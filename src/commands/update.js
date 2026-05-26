import chalk from 'chalk';
import {
  FILE_MAPPINGS,
  resolveSourcePath,
  resolveTargetPath,
  hashFile,
  readRecord,
  writeRecord,
} from '../utils/registry.js';

export default async function updateAction(options) {
  const { check = false, force = false } = options;

  console.log(chalk.bold('\n🔄 harness-kit update\n'));

  // Step 1: Read install record
  const record = await readRecord('global');
  if (!record) {
    console.log(chalk.red('  ✗ Not installed. Run: harness-kit install'));
    return;
  }

  console.log(chalk.cyan(`  Installed version: ${record.version}`));
  console.log(chalk.cyan(`  Installed at: ${record.installedAt}\n`));

  // Step 2: Compare hashes
  const updates = [];
  let allUpToDate = true;

  for (const fileEntry of record.files) {
    const srcPath = resolveSourcePath(fileEntry.source);
    const tgtPath = fileEntry.target;

    let sourceHash;
    try {
      sourceHash = await hashFile(srcPath);
    } catch {
      console.log(chalk.yellow(`  ⚠ Source file not found: ${fileEntry.source}`));
      continue;
    }

    const installedHash = fileEntry.hash;
    const isDifferent = sourceHash !== installedHash;

    if (isDifferent) {
      allUpToDate = false;
      updates.push({
        source: fileEntry.source,
        target: tgtPath,
        installedHash,
        sourceHash,
      });
    }
  }

  if (allUpToDate) {
    console.log(chalk.green('  ✅ All files up to date.'));
    console.log();
    return;
  }

  // Step 3: Show differences
  console.log(chalk.bold.yellow(`  ${updates.length} file(s) have updates available:\n`));

  for (const update of updates) {
    console.log(chalk.yellow(`  ~ ${update.source}`));
    console.log(chalk.gray(`    installed: ${update.installedHash} → package: ${update.sourceHash}`));
  }

  if (check) {
    console.log(chalk.cyan('\n  Use harness-kit update (without --check) to apply updates.'));
    console.log();
    return;
  }

  // Step 4: Apply updates (unless force, prompt first)
  if (!force) {
    console.log();
    const readline = await import('node:readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise(resolve => {
      rl.question(chalk.bold('  Apply updates? [y/N] '), resolve);
    });
    rl.close();

    if (!answer.toLowerCase().startsWith('y')) {
      console.log(chalk.yellow('  Update cancelled.'));
      console.log();
      return;
    }
  }

  // Step 5: Copy updated files
  console.log();
  for (const update of updates) {
    const fs = await import('fs-extra');
    await fs.copy(resolveSourcePath(update.source), update.target, { overwrite: true });
    const newHash = await hashFile(update.target);

    // Update record
    const recordEntry = record.files.find(f => f.source === update.source);
    if (recordEntry) {
      recordEntry.hash = newHash;
    }

    console.log(chalk.green(`  ✓ Updated ${update.source}`));
  }

  await writeRecord(record, 'global');
  console.log(chalk.green('\n  ✓ Install record updated'));
  console.log(chalk.bold.green('\n✅ Update complete!\n'));
}
