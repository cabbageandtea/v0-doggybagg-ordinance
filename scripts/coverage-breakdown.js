#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const lcovPath = path.resolve(process.cwd(), 'coverage/lcov.info')
if (!fs.existsSync(lcovPath)) {
  console.error('coverage/lcov.info not found')
  process.exit(1)
}
const lcov = fs.readFileSync(lcovPath, 'utf8')
const records = lcov.split('\nend_of_record\n')

function parseRecord(rec) {
  const lines = rec.split('\n')
  const file = lines.find(l => l.startsWith('SF:'))?.slice(3) || '<unknown>'
  let LF = 0, LH = 0, FNF = 0, FNH = 0, BRF = 0, BRH = 0
  for (const line of lines) {
    if (line.startsWith('LF:')) LF += Number(line.split(':')[1])
    if (line.startsWith('LH:')) LH += Number(line.split(':')[1])
    if (line.startsWith('FNF:')) FNF += Number(line.split(':')[1])
    if (line.startsWith('FNH:')) FNH += Number(line.split(':')[1])
    if (line.startsWith('BRF:')) BRF += Number(line.split(':')[1])
    if (line.startsWith('BRH:')) BRH += Number(line.split(':')[1])
  }
  const statements = LF === 0 ? 0 : (LH / LF) * 100
  const functions = FNF === 0 ? 0 : ((FNF - FNH) / FNF) * 100
  const branches = BRF === 0 ? 0 : ((BRF - BRH) / BRF) * 100
  return { file, statements, functions, branches }
}

const summaries = records.map(parseRecord).filter(s => s.file && s.file !== '<unknown>')

function topBy(field, n = 10) {
  return summaries
    .filter(s => Number.isFinite(s[field]))
    .sort((a, b) => a[field] - b[field])
    .slice(0, n)
}

console.log('Top 10 worst by functions coverage (low -> high):')
for (const s of topBy('functions')) {
  console.log(`${s.functions.toFixed(2).padStart(6)}%  ${s.file}`)
}
console.log('\nTop 10 worst by branches coverage (low -> high):')
for (const s of topBy('branches')) {
  console.log(`${s.branches.toFixed(2).padStart(6)}%  ${s.file}`)
}

console.log('\nFiles with 0 functions (FNF=0) are omitted from functions ranking; same for branches.')
process.exit(0)
