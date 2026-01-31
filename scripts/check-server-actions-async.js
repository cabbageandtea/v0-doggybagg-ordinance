#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const e of entries) {
    const res = path.resolve(dir, e.name)
    if (e.isDirectory()) files = files.concat(walk(res))
    else files.push(res)
  }
  return files
}

function checkFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const lines = text.split(/\r?\n/)
  const problems = []
  const exportFnRe = /^\s*export\s+function\s+([A-Za-z0-9_]+)\s*\(/
  const exportAsyncFnRe = /^\s*export\s+async\s+function\s+([A-Za-z0-9_]+)\s*\(/

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const mAsync = line.match(exportAsyncFnRe)
    const m = line.match(exportFnRe)
    if (m && !mAsync) {
      problems.push({ line: i + 1, name: m[1], snippet: line.trim() })
    }
  }

  return problems
}

function main() {
  const actionsDir = path.join(process.cwd(), 'app', 'actions')
  if (!fs.existsSync(actionsDir)) {
    console.log('No app/actions directory found; skipping server actions async check.')
    return 0
  }

  const files = walk(actionsDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
  const allProblems = []
  for (const f of files) {
    const problems = checkFile(f)
    if (problems.length > 0) allProblems.push({ file: f, problems })
  }

  if (allProblems.length > 0) {
    console.error('\nERROR: Found exported non-async functions inside app/actions/ which Next.js treats as Server Actions. Server Actions must be async functions. Please convert them to `export async function` or move helper code to `lib/` or a non-server file.\n')
    for (const item of allProblems) {
      console.error(`File: ${path.relative(process.cwd(), item.file)}`)
      for (const p of item.problems) {
        console.error(`  Line ${p.line}: ${p.snippet}`)
      }
      console.error('')
    }
    process.exitCode = 1
    return 1
  }

  console.log('OK: All exported functions in app/actions are async.')
  return 0
}

main()
