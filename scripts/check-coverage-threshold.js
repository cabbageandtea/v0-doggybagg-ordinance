#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const thresholds = {
  statements: process.env.COVERAGE_STATEMENTS ? Number(process.env.COVERAGE_STATEMENTS) : 75,
  branches: process.env.COVERAGE_BRANCHES ? Number(process.env.COVERAGE_BRANCHES) : 60,
  functions: process.env.COVERAGE_FUNCTIONS ? Number(process.env.COVERAGE_FUNCTIONS) : 70,
  lines: process.env.COVERAGE_LINES ? Number(process.env.COVERAGE_LINES) : 75,
}

function parseLcov(lcov) {
  const lines = lcov.split('\n')
  let totalLF = 0
  let totalLH = 0
  let totalFNF = 0
  let totalFNH = 0
  let totalBRF = 0
  let totalBRH = 0
  for (const line of lines) {
    if (line.startsWith('LF:')) totalLF += Number(line.split(':')[1])
    if (line.startsWith('LH:')) totalLH += Number(line.split(':')[1])
    if (line.startsWith('FNF:')) totalFNF += Number(line.split(':')[1])
    if (line.startsWith('FNH:')) totalFNH += Number(line.split(':')[1])
    if (line.startsWith('BRF:')) totalBRF += Number(line.split(':')[1])
    if (line.startsWith('BRH:')) totalBRH += Number(line.split(':')[1])
  }
  const statementPct = totalLF === 0 ? 0 : (totalLH / totalLF) * 100
  const functionsPct = totalFNF === 0 ? 0 : ((totalFNF - totalFNH) / totalFNF) * 100
  const branchesPct = totalBRF === 0 ? 0 : ((totalBRF - totalBRH) / totalBRF) * 100
  return { statementPct, functionsPct, branchesPct }
}

const lcovPath = path.resolve(process.cwd(), 'coverage/lcov.info')
if (!fs.existsSync(lcovPath)) {
  console.error('coverage/lcov.info not found — cannot check thresholds')
  process.exit(1)
}

const lcov = fs.readFileSync(lcovPath, 'utf8')
const { statementPct, functionsPct, branchesPct } = parseLcov(lcov)
const linesPct = statementPct // lcov doesn't separate lines/statements; use statementPct as lines

console.log(`Coverage summary: statements=${statementPct.toFixed(2)}%, functions=${functionsPct.toFixed(2)}%, branches=${branchesPct.toFixed(2)}%`)

let ok = true
if (statementPct < thresholds.statements) {
  console.error(`Statements coverage ${statementPct.toFixed(2)}% < threshold ${thresholds.statements}%`)
  ok = false
}
if (linesPct < thresholds.lines) {
  console.error(`Lines coverage ${linesPct.toFixed(2)}% < threshold ${thresholds.lines}%`)
  ok = false
}
if (functionsPct < thresholds.functions) {
  console.error(`Functions coverage ${functionsPct.toFixed(2)}% < threshold ${thresholds.functions}%`)
  ok = false
}
if (branchesPct < thresholds.branches) {
  console.error(`Branches coverage ${branchesPct.toFixed(2)}% < threshold ${thresholds.branches}%`)
  ok = false
}

if (!ok) process.exit(2)
console.log('Coverage thresholds met')
process.exit(0)
