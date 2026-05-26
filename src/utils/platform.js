import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';

/**
 * Resolve the Claude config directory.
 * Priority: CLAUDE_CONFIG_DIR env var > ~/.claude
 * For --scope local, uses cwd/.claude instead.
 */
export function resolveClaudeConfigDir({ scope = 'global' } = {}) {
  if (scope === 'local') {
    return path.join(process.cwd(), '.claude');
  }
  if (process.env.CLAUDE_CONFIG_DIR) {
    return process.env.CLAUDE_CONFIG_DIR;
  }
  return path.join(os.homedir(), '.claude');
}

/**
 * Ensure directories exist for command/skill installation.
 */
export async function ensureClaudeDirs(claudeDir) {
  await fs.ensureDir(path.join(claudeDir, 'commands'));
  await fs.ensureDir(path.join(claudeDir, 'skills'));
}

/**
 * Detect platform info for display purposes.
 */
export function getPlatformInfo() {
  return {
    os: process.platform,
    arch: process.arch,
    homeDir: os.homedir(),
    claudeDir: resolveClaudeConfigDir(),
    isWindows: process.platform === 'win32',
  };
}
