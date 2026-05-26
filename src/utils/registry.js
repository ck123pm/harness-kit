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
    source: 'commands/harness-init.md',
    target: 'commands/harness-init.md',
  },
  {
    source: 'commands/harness-update-spec.md',
    target: 'commands/harness-update-spec.md',
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
  const content = await fs.readFile(filePath);
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
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
  const stat = await fs.stat(tgt);

  return {
    target: tgt,
    didUpdate: true,
    hash,
    size: stat.size,
  };
}

export async function detectGlobalCommand(binName) {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const exec = promisify(execFile);

  try {
    const { stdout } = await exec(binName, ['--version']);
    return { available: true, version: stdout.trim() };
  } catch {
    return { available: false, version: null };
  }
}

export async function installGlobalPackage(packageName) {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const exec = promisify(execFile);

  await exec('npm', ['install', '-g', packageName], { stdio: 'inherit' });
}

export async function getPackageVersion() {
  const pkgPath = path.join(PACKAGE_ROOT, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    return pkg.version;
  }
  return 'unknown';
}
