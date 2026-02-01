#!/usr/bin/env node

/**
 * Workflow CLI - Quick access to automated workflows
 * Usage: node scripts/workflow-cli.js <command> [options]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function exec(cmd, silent = false) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: silent ? 'pipe' : 'inherit' });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function featureWorkflow() {
  console.log('\n🚀 Feature Workflow\n');

  const componentName = await question('Component name (e.g., MyComponent): ');
  const description = await question('Component description: ');
  const branchName = await question(`Branch name (default: feat/${componentName.toLowerCase()}): `) || `feat/${componentName.toLowerCase()}`;

  console.log('\n📋 Workflow Steps:\n');

  // 1. Create branch
  console.log('1️⃣  Creating feature branch...');
  exec(`git checkout -b ${branchName} origin/main`);
  console.log(`✅ Created: ${branchName}\n`);

  // 2. Generate component
  console.log('2️⃣  Generate component at: components/generated/${componentName}.tsx');
  console.log('   (Use Cursor AI: "Generate a React component for: ${description}")\n');

  // 3. Export from V0
  const exported = await question('Component exported to project? (y/n): ');
  if (exported.toLowerCase() === 'y') {
    console.log('✅ Component integrated\n');
  }

  // 4. Commit
  console.log('3️⃣  Committing changes...');
  exec(`git add -A && git commit -m "feat: add ${componentName} component"`);
  console.log('✅ Committed\n');

  // 5. Push
  console.log('4️⃣  Pushing to remote...');
  exec(`git push -u origin ${branchName}`);
  console.log('✅ Pushed\n');

  // 6. Create PR
  console.log('5️⃣  Creating pull request...');
  const prUrl = exec(
    `gh pr create --title "feat: add ${componentName} component" --body "${description}" --base main --head ${branchName}`,
    true
  );
  console.log(`✅ PR Created: ${prUrl}\n`);

  console.log('6️⃣  Preview deploying on Vercel...');
  console.log('✅ Preview URL will be in PR comments\n');

  console.log('✨ Workflow complete! Waiting for PR reviews and merge.\n');
}

async function hotfixWorkflow() {
  console.log('\n🚑 Hotfix Workflow\n');

  const issueId = await question('Issue/bug ID (e.g., BUG-123): ');
  const description = await question('Hotfix description: ');
  const branchName = `fix/${issueId}`;

  console.log('\n📋 Workflow Steps:\n');

  // 1. Create branch
  console.log('1️⃣  Creating hotfix branch...');
  exec(`git checkout -b ${branchName} origin/main`);
  console.log(`✅ Created: ${branchName}\n`);

  // 2. Apply fix
  console.log('2️⃣  Apply fixes in Cursor\n');
  const fixed = await question('Fix applied? (y/n): ');

  if (fixed.toLowerCase() === 'y') {
    // 3. Run tests
    console.log('\n3️⃣  Running tests...');
    exec('pnpm test');
    console.log('✅ Tests passed\n');

    // 4. Commit
    console.log('4️⃣  Committing fix...');
    exec(`git add -A && git commit -m "fix: ${description}"`);
    console.log('✅ Committed\n');

    // 5. Push and create PR
    console.log('5️⃣  Pushing and creating PR...');
    exec(`git push -u origin ${branchName}`);
    const prUrl = exec(
      `gh pr create --title "fix: ${description}" --body "Fixes #${issueId}" --base main --head ${branchName}`,
      true
    );
    console.log(`✅ PR Created: ${prUrl}\n`);

    console.log('✨ Hotfix PR ready for urgent review!\n');
  }
}

async function releaseWorkflow() {
  console.log('\n📦 Release Workflow\n');

  const version = await question('Version number (e.g., 1.2.0): ');
  const changelog = await question('Changelog/release notes: ');

  console.log('\n📋 Workflow Steps:\n');

  // 1. Create release branch
  console.log('1️⃣  Creating release branch...');
  exec(`git checkout -b release/v${version} origin/main`);
  console.log(`✅ Created: release/v${version}\n`);

  // 2. Update version
  console.log('2️⃣  Updating package.json...');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  pkg.version = version;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  console.log(`✅ Updated to v${version}\n`);

  // 3. Build
  console.log('3️⃣  Building for production...');
  exec('pnpm build');
  console.log('✅ Build successful\n');

  // 4. Commit and tag
  console.log('4️⃣  Creating release commit and tag...');
  exec(`git add package.json && git commit -m "chore: release v${version}"`);
  exec(`git tag -a v${version} -m "Release v${version}\n\n${changelog}"`);
  console.log(`✅ Created tag: v${version}\n`);

  // 5. Push
  console.log('5️⃣  Pushing release...');
  exec('git push origin release/v${version}');
  exec('git push origin --tags');
  console.log('✅ Pushed\n');

  // 6. Create PR
  console.log('6️⃣  Creating release PR...');
  const prUrl = exec(
    `gh pr create --title "release: v${version}" --body "${changelog}" --base main --head release/v${version}`,
    true
  );
  console.log(`✅ PR Created: ${prUrl}\n`);

  console.log('7️⃣  Production deployment will start after merge\n');
  console.log('✨ Release workflow initiated!\n');
}

async function statusCheck() {
  console.log('\n📊 Current Status\n');

  try {
    // Git status
    const branch = exec('git rev-parse --abbrev-ref HEAD', true).trim();
    const status = exec('git status --short', true);
    console.log(`📍 Branch: ${branch}`);
    console.log(`📝 Changes:\n${status || '  (no changes)'}\n`);

    // Recent commits
    const logs = exec('git log --oneline -3', true);
    console.log(`📜 Recent commits:\n${logs}\n`);

    // Vercel status
    console.log('🚀 Vercel status: Check your GitHub PR for preview URL\n');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function main() {
  const cmd = process.argv[2];

  console.log('🔧 Workflow CLI');
  console.log('================\n');

  switch (cmd) {
    case 'feature':
      await featureWorkflow();
      break;
    case 'hotfix':
      await hotfixWorkflow();
      break;
    case 'release':
      await releaseWorkflow();
      break;
    case 'status':
      await statusCheck();
      break;
    default:
      console.log('Available workflows:\n');
      console.log('  feature  - Create and integrate new component');
      console.log('  hotfix   - Emergency bug fix workflow');
      console.log('  release  - Create production release');
      console.log('  status   - Check current git status\n');
      console.log('Usage: node scripts/workflow-cli.js <command>\n');
  }

  rl.close();
}

main().catch(console.error);
