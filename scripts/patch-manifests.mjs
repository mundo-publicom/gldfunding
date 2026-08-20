/**
 * Several packages in this tree (vite-react-ssg, @vitejs/plugin-react, and any
 * others published from a pnpm monorepo) ship unresolved `catalog:` and
 * `workspace:*` specifiers inside their published devDependencies. npm cannot
 * parse those protocols, so every `npm install` after the first one dies with
 * EUNSUPPORTEDPROTOCOL.
 *
 * A dependency's devDependencies are never installed by consumers, so stripping
 * them is safe and makes installs idempotent. This runs on postinstall.
 *
 * Remove entries here as upstream publishes fixed manifests.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('../node_modules', import.meta.url).pathname
const BAD = /"(catalog:[^"]*|workspace:[^"]*)"/

let patched = 0

function patch(pkgDir) {
  const manifest = join(pkgDir, 'package.json')
  if (!existsSync(manifest)) return

  let raw
  try {
    raw = readFileSync(manifest, 'utf8')
  } catch {
    return
  }
  if (!BAD.test(raw)) return

  let pkg
  try {
    pkg = JSON.parse(raw)
  } catch {
    return
  }

  let changed = false
  // Only ever touch fields consumers do not install from.
  for (const field of ['devDependencies', 'peerDependencies']) {
    const block = pkg[field]
    if (!block) continue
    for (const [name, range] of Object.entries(block)) {
      if (typeof range === 'string' && /^(catalog:|workspace:)/.test(range)) {
        if (field === 'devDependencies') {
          delete block[name]
        } else {
          // Keep the peer declared, but with a range npm can parse.
          block[name] = '*'
        }
        changed = true
      }
    }
    if (block && Object.keys(block).length === 0) delete pkg[field]
  }

  if (changed) {
    writeFileSync(manifest, `${JSON.stringify(pkg, null, 2)}\n`)
    patched++
  }
}

function walk(dir, depth = 0) {
  if (depth > 2 || !existsSync(dir)) return
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry === '.bin' || entry === '.package-lock.json') continue
    const full = join(dir, entry)
    let s
    try {
      s = statSync(full)
    } catch {
      continue
    }
    if (!s.isDirectory()) continue

    if (entry.startsWith('@')) {
      walk(full, depth) // scoped: recurse without counting a level
    } else {
      patch(full)
      // Nested node_modules from conflicting versions.
      walk(join(full, 'node_modules'), depth + 1)
    }
  }
}

walk(ROOT)

if (patched > 0) {
  console.log(`[patch-manifests] normalized ${patched} package manifest(s) with catalog:/workspace: specifiers`)
}
