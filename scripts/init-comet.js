#!/usr/bin/env node
/**
 * Standalone script to run comet init.
 * Checks for comet binary, installs if missing, then runs comet init.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

async function detectComet() {
  try {
    const { stdout } = await exec('comet', ['--version']);
    return { available: true, version: stdout.trim() };
  } catch {
    return { available: false, version: null };
  }
}

async function main() {
  console.log('Checking for comet...');

  const comet = await detectComet();

  if (!comet.available) {
    console.log('comet not found, installing @ck123pm/comet...');
    try {
      await exec('npm', ['install', '-g', '@ck123pm/comet'], { stdio: 'inherit' });
    } catch (err) {
      console.error('Failed to install comet:', err.message);
      console.error('Try: npm install -g @ck123pm/comet');
      process.exit(1);
    }
  } else {
    console.log(`comet ${comet.version} found`);
  }

  console.log('Running comet init...');
  try {
    await exec('comet', ['init'], { stdio: 'inherit' });
    console.log('comet init complete');
  } catch (err) {
    console.error('Failed to run comet init:', err.message);
    process.exit(1);
  }
}

main();
