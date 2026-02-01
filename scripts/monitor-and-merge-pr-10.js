#!/usr/bin/env node
/* Monitor & Merge agent for PR #10

Behavior:
- Poll PR mergeable_state every 15s
- When 'clean' or 'mergeable': try to enable auto-merge via GraphQL (SQUASH)
  - If enabling auto-merge fails, try to perform a SQUASH merge via GraphQL
- After merge, delete head branch via REST
- Verify https://doggybagg.cc responds with HTTP 200 within 2 minutes
- Post PR comments with results or API errors

Environment:
- Requires GITHUB_TOKEN or GH_TOKEN in env with repo write permissions
*/

const OWNER = 'cabbageandtea';
const REPO = 'v0-doggybagg-ordinance';
const PR_NUMBER = 10;
const POLL_INTERVAL_MS = 15000;
const SITE_CHECK_TIMEOUT_MS = 2 * 60 * 1000;

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
  console.error('Missing GITHUB_TOKEN or GH_TOKEN in environment');
  process.exit(2);
}

const fetch = globalThis.fetch || (await import('node-fetch')).default; // node 18+ has fetch

async function requestREST(path, method = 'GET', body) {
  const url = `https://api.github.com${path}`;
  const opts = { method, headers: { Authorization: `token ${token}`, 'User-Agent': 'monitor-and-merge-agent', Accept: 'application/vnd.github+json' } };
  if (body) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch(url, opts);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch (e) { json = text; }
  return { status: res.status, ok: res.ok, json, text };
}

async function requestGraphQL(query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'monitor-and-merge-agent' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  return { status: res.status, json };
}

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getPR() {
  return await requestREST(`/repos/${OWNER}/${REPO}/pulls/${PR_NUMBER}`);
}

async function postPRComment(body) {
  return await requestREST(`/repos/${OWNER}/${REPO}/issues/${PR_NUMBER}/comments`, 'POST', { body });
}

async function addLabel(name) {
  return await requestREST(`/repos/${OWNER}/${REPO}/issues/${PR_NUMBER}/labels`, 'POST', [name]);
}

async function deleteHeadRef(headRef) {
  return await requestREST(`/repos/${OWNER}/${REPO}/git/refs/heads/${encodeURIComponent(headRef)}`, 'DELETE');
}

async function checkForAdminForceComment() {
  // scan recent comments for a phrase like 'force-merge'
  const r = await requestREST(`/repos/${OWNER}/${REPO}/issues/${PR_NUMBER}/comments`);
  if (!r.ok) return false;
  for (const c of r.json) {
    const body = (c.body || '').toLowerCase();
    if (/(force[- ]?merge|force merge now|force-merge now)/.test(body)) {
      // check author's permission
      const uname = c.user.login;
      const perm = await requestREST(`/repos/${OWNER}/${REPO}/collaborators/${uname}/permission`);
      if (perm.ok && perm.json && perm.json.permission === 'admin') {
        return { allowed: true, comment: c };
      }
    }
  }
  return { allowed: false };
}

async function enableAutoMerge(prNodeId) {
  const q = `mutation EnableAutoMerge($id: ID!, $method: PullRequestMergeMethod!) {
    enablePullRequestAutoMerge(input:{pullRequestId: $id, mergeMethod: $method}) { pullRequest { number } }
  }`;
  const r = await requestGraphQL(q, { id: prNodeId, method: 'SQUASH' });
  return r;
}

async function mergePullRequest(prNodeId) {
  const q = `mutation MergePullRequest($id: ID!, $method: PullRequestMergeMethod!) {
    mergePullRequest(input: { pullRequestId: $id, mergeMethod: $method }) {
      pullRequest { merged, mergeCommit { oid url } }
    }
  }`;
  return await requestGraphQL(q, { id: prNodeId, method: 'SQUASH' });
}

async function verifySite() {
  const start = Date.now();
  const deadline = start + SITE_CHECK_TIMEOUT_MS;
  let lastStatus = null;
  while (Date.now() < deadline) {
    try {
      const res = await fetch('https://doggybagg.cc', { redirect: 'follow' });
      lastStatus = res.status;
      if (res.status === 200) return { ok: true, status: res.status };
    } catch (e) {
      lastStatus = e.message;
    }
    await delay(3000);
  }
  return { ok: false, status: lastStatus };
}

(async function main() {
  console.log(`Monitoring PR ${PR_NUMBER} on ${OWNER}/${REPO}...`);

  // Poll mergeable_state
  let prInfo;
  let prNodeId = null;
  while (true) {
    const r = await getPR();
    if (!r.ok) {
      console.error('Failed to fetch PR:', r.status, r.text);
      await postPRComment(`Monitor agent error: failed to fetch PR: ${r.status}\n\n${JSON.stringify(r.json, null, 2)}`);
      process.exit(1);
    }
    prInfo = r.json;
    console.log('mergeable_state:', prInfo.mergeable_state, 'state:', prInfo.state);
    if (prInfo.state === 'closed') {
      console.log('PR is closed, exiting.');
      await postPRComment('Monitor agent: PR closed before merge attempt. Stopping.');
      console.log('FINAL: not-merged');
      process.exit(0);
    }
    if (['clean', 'mergeable'].includes(prInfo.mergeable_state)) {
      break;
    }
    await delay(POLL_INTERVAL_MS);
  }

  // Fetch PR node ID using GraphQL
  const grabQ = `query($owner:String!, $repo:String!, $number:Int!) { repository(owner:$owner, name:$repo){ pullRequest(number:$number){ id, headRefName, headRefOid } } }`;
  const grabRes = await requestGraphQL(grabQ, { owner: OWNER, repo: REPO, number: PR_NUMBER });
  if (!grabRes.json || !grabRes.json.data || !grabRes.json.data.repository || !grabRes.json.data.repository.pullRequest) {
    console.error('Failed to get PR node id', JSON.stringify(grabRes.json, null, 2));
    await postPRComment(`Monitor agent error: failed to retrieve PR node id.\n\n${JSON.stringify(grabRes.json, null, 2)}`);
    process.exit(1);
  }
  prNodeId = grabRes.json.data.repository.pullRequest.id;
  const headRefName = grabRes.json.data.repository.pullRequest.headRefName;
  const headRefOid = grabRes.json.data.repository.pullRequest.headRefOid;

  console.log('Attempting to enable auto-merge (SQUASH)...');
  const enableRes = await enableAutoMerge(prNodeId);
  if (enableRes.json && enableRes.json.errors && enableRes.json.errors.length) {
    console.log('enable auto-merge errors:', JSON.stringify(enableRes.json.errors, null, 2));
    // If permission error or branch protection prevents auto-merge, attempt direct merge
    const errText = JSON.stringify(enableRes.json.errors, null, 2);
    await postPRComment(`Auto-merge enable failed:\n\n${errText}`);
    // attempt direct merge
    console.log('Attempting to perform a SQUASH merge directly...');
    const mergeRes = await mergePullRequest(prNodeId);
    if (mergeRes.json && mergeRes.json.errors && mergeRes.json.errors.length) {
      console.error('Merge attempt failed:', JSON.stringify(mergeRes.json.errors, null, 2));
      const fullErr = JSON.stringify(mergeRes.json.errors, null, 2);
      // Check for admin 'force-merge' comment
      const { allowed } = await checkForAdminForceComment();
      if (allowed) {
        // attempt merge again (force attempt)
        await postPRComment('Admin requested force-merge. Attempting merge again (force attempt).');
        const mergeRes2 = await mergePullRequest(prNodeId);
        if (mergeRes2.json && mergeRes2.json.errors && mergeRes2.json.errors.length) {
          const err2 = JSON.stringify(mergeRes2.json.errors, null, 2);
          await postPRComment(`Force-merge attempt failed:\n\n${err2}`);
          await addLabel('blocked').catch(()=>{});
          console.log('FINAL: not-merged');
          // Post blocked comment containing error
          await postPRComment(`Merge blocked. Error:\n\n${err2}`);
          console.log(err2);
          process.exit(1);
        } else {
          // success
          const mergedInfo = mergeRes2.json.data.mergePullRequest.pullRequest;
          const sha = mergedInfo.mergeCommit.oid;
          const url = mergedInfo.mergeCommit.url;
          await postPRComment(`Merged (force attempt) successfully: ${sha} - ${url}`);
          // delete branch
          const del = await deleteHeadRef(headRefName);
          const delText = del.ok ? 'branch deleted' : `branch deletion failed: ${del.status} ${JSON.stringify(del.json)}`;
          // verify site
          const site = await verifySite();
          const siteText = site.ok ? `site returned HTTP 200` : `site check failed: ${site.status}`;
          await postPRComment(`Post-merge verification:\n- Merge commit: ${sha} - ${url}\n- ${delText}\n- ${siteText}`);
          console.log(`FINAL: merged ${sha}`);
          process.exit(0);
        }
      } else {
        // Post error and block
        await postPRComment(`Merge attempt failed and no admin force-merge approval found. Error:\n\n${fullErr}`);
        await addLabel('blocked').catch(()=>{});
        console.log('FINAL: not-merged');
        process.exit(1);
      }
    } else {
      // success
      const mergedInfo = mergeRes.json.data.mergePullRequest.pullRequest;
      const sha = mergedInfo.mergeCommit.oid;
      const url = mergedInfo.mergeCommit.url;
      await postPRComment(`Merged successfully: ${sha} - ${url}`);
      // delete branch
      const del = await deleteHeadRef(headRefName);
      const delText = del.ok ? 'branch deleted' : `branch deletion failed: ${del.status} ${JSON.stringify(del.json)}`;
      // verify site
      const site = await verifySite();
      const siteText = site.ok ? `site returned HTTP 200` : `site check failed: ${site.status}`;
      await postPRComment(`Post-merge verification:\n- Merge commit: ${sha} - ${url}\n- ${delText}\n- ${siteText}`);
      console.log(`FINAL: merged ${sha}`);
      process.exit(0);
    }
  } else {
    // Auto-merge enabled successfully
    console.log('Auto-merge enabled successfully. Waiting for merge to happen...');
    await postPRComment('Auto-merge (SQUASH) enabled by monitor agent. Waiting for GitHub to complete the merge.');
    // Poll PR until merged
    while (true) {
      const r2 = await getPR();
      if (!r2.ok) { console.error('Error fetching PR status', r2); break; }
      const p = r2.json;
      if (p.merged) {
        const sha = p.merge_commit_sha;
        const url = p._links && p._links.html && p._links.html.href;
        // attempt branch deletion
        const del = await deleteHeadRef(p.head.ref);
        const delText = del.ok ? 'branch deleted' : `branch deletion failed: ${del.status} ${JSON.stringify(del.json)}`;
        const site = await verifySite();
        const siteText = site.ok ? `site returned HTTP 200` : `site check failed: ${site.status}`;
        await postPRComment(`Auto-merge completed:\n- Merge commit: ${sha} - ${url}\n- ${delText}\n- ${siteText}`);
        console.log(`FINAL: merged ${sha}`);
        process.exit(0);
      }
      // If PR becomes closed without merge, exit
      if (p.state === 'closed' && !p.merged) {
        await postPRComment('Auto-merge was enabled but PR was closed without merging.');
        console.log('FINAL: not-merged');
        process.exit(1);
      }
      await delay(15000);
    }
  }

})().catch(async (err) => {
  console.error('Unhandled error', err);
  try { await postPRComment(`Monitor agent unhandled error:\n\n${String(err)}`); } catch(e) {}
  process.exit(1);
});
