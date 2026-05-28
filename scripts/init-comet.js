#!/usr/bin/env node
/**
 * Standalone script to run comet init.
 * Checks for comet binary, installs if missing, then runs comet init.
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..');

async function detectComet() {
  try {
    const { stdout } = await exec('comet', ['--version']);
    return { available: true, version: stdout.trim() };
  } catch {
    return { available: false, version: null };
  }
}

async function getCometPackageSpec() {
  const pkgPath = path.join(PACKAGE_ROOT, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  const spec = pkg.dependencies?.['@ck123pm/comet']
    ?? pkg.peerDependencies?.['@ck123pm/comet'];
  return spec ? `@ck123pm/comet@${spec}` : '@ck123pm/comet';
}

async function main() {
  console.log('Checking for comet...');

  const comet = await detectComet();
  const cometPackageSpec = await getCometPackageSpec();

  if (!comet.available) {
    console.log(`comet not found, installing ${cometPackageSpec}...`);
    try {
      await exec('npm', ['install', '-g', cometPackageSpec], { stdio: 'inherit' });
    } catch (err) {
      console.error('Failed to install comet:', err.message);
      console.error(`Try: npm install -g ${cometPackageSpec}`);
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
