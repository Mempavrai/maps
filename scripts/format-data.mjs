import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { serializeJson } from '../src/core/model/jsonFormat.ts'
import { listDataJsonFiles, root } from './dataFiles.mjs'

for (const relPath of listDataJsonFiles()) {
  const fullPath = join(root, relPath)
  const text = readFileSync(fullPath, 'utf8')
  const formatted = serializeJson(JSON.parse(text))
  if (text !== formatted) {
    writeFileSync(fullPath, formatted)
    console.log(`formatted ${relPath}`)
  }
}
