import path from 'node:path';
import fs from 'fs-extra';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolveClaudeConfigDir, ensureClaudeDirs } from './platform.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');

export const FILE_MAPPINGS = [
  {
    source: 'skills/harness-init',
    target: 'skills/harness-init',
  },
  {
    source: 'skills/harness-update-spec',
    target: 'skills/harness-update-spec',
  },
  {
    source: 'skills/md-to-html-doc.md',
    target: 'skills/md-to-html-doc.md',
  },
];

export function resolveSourcePath(relativePath) {
  return path.join(PACKAGE_ROOT, relativePath);
}

export function resolveTargetPath(relativeTarget, scope = 'global') {
  const claudeDir = resolveClaudeConfigDir({ scope });
  return path.join(claudeDir, relativeTarget);
}

export async function hashFile(filePath) {
  const stat = await fs.stat(filePath);

  if (stat.isDirectory()) {
    const hash = createHash('sha256');
    await hashDirectoryInto(hash, filePath, filePath);
    return hash.digest('hex').slice(0, 12);
  }

  const content = await fs.readFile(filePath);
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
}

async function hashDirectoryInto(hash, rootDir, currentDir) {
  const entries = await fs.readdir(currentDir);
  entries.sort();

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry);
    const stat = await fs.stat(fullPath);
    const relativePath = path.relative(rootDir, fullPath).replaceAll('\\', '/');

    hash.update(relativePath);
    hash.update(stat.isDirectory() ? 'dir' : 'file');

    if (stat.isDirectory()) {
      await hashDirectoryInto(hash, rootDir, fullPath);
      continue;
    }

    const content = await fs.readFile(fullPath);
    hash.update(content);
  }
}

async function getPathSize(targetPath) {
  const stat = await fs.stat(targetPath);
  if (stat.isFile()) {
    return stat.size;
  }

  let total = 0;
  const entries = await fs.readdir(targetPath);
  for (const entry of entries) {
    total += await getPathSize(path.join(targetPath, entry));
  }
  return total;
}

export function getRecordPath(scope = 'global') {
  const claudeDir = resolveClaudeConfigDir({ scope });
  return path.join(claudeDir, 'harness-kit.json');
}

export async function readRecord(scope = 'global') {
  const recordPath = getRecordPath(scope);
  if (await fs.pathExists(recordPath)) {
    return await fs.readJson(recordPath);
  }
  return null;
}

export async function writeRecord(record, scope = 'global') {
  const recordPath = getRecordPath(scope);
  await fs.ensureDir(path.dirname(recordPath));
  await fs.writeJson(recordPath, record, { spaces: 2 });
}

export async function copyFileRecord(sourceRel, targetRel, { force = false, scope = 'global' } = {}) {
  const src = resolveSourcePath(sourceRel);
  const tgt = resolveTargetPath(targetRel, scope);

  if (!force && await fs.pathExists(tgt)) {
    const existingHash = await hashFile(tgt);
    const sourceHash = await hashFile(src);
    if (existingHash === sourceHash) {
      return { target: tgt, didUpdate: false, reason: 'already-up-to-date' };
    }
  }

  const claudeDir = resolveClaudeConfigDir({ scope });
  await ensureClaudeDirs(claudeDir);
  await fs.copy(src, tgt, { overwrite: true });
  const hash = await hashFile(tgt);

  return {
    target: tgt,
    didUpdate: true,
    hash,
    size: await getPathSize(tgt),
  };
}

export async function detectGlobalCommand(binName) {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const exec = promisify(execFile);

  try {
    const { stdout } = await exec(binName, ['--version'], { shell: true });
    return { available: true, version: stdout.trim() };
  } catch {
    return { available: false, version: null };
  }
}

export async function installGlobalPackage(packageName) {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const exec = promisify(execFile);

  await exec('npm', ['install', '-g', packageName], { shell: true });
}

export async function getPackageVersion() {
  const pkg = await readPackageJson();
  return pkg?.version ?? 'unknown';
}

export async function readPackageJson() {
  const pkgPath = path.join(PACKAGE_ROOT, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    return await fs.readJson(pkgPath);
  }
  return null;
}

export async function getDeclaredPackageSpec(packageName) {
  const pkg = await readPackageJson();
  if (!pkg) {
    return packageName;
  }

  const spec =
    pkg.dependencies?.[packageName]
    ?? pkg.peerDependencies?.[packageName]
    ?? pkg.optionalDependencies?.[packageName];

  return spec ? `${packageName}@${spec}` : packageName;
}
