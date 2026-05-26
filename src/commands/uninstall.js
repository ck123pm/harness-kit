import chalk from 'chalk';
import fs from 'fs-extra';
import {
  FILE_MAPPINGS,
  resolveTargetPath,
  getRecordPath,
  readRecord,
} from '../utils/registry.js';

export default async function uninstallAction() {
  console.log(chalk.bold('\n🗑️  harness-kit uninstall\n'));

  const scope = 'global';
  let removedCount = 0;

  // Step 1: Read install record for tracked files
  const record = await readRecord(scope);

  if (record && record.files) {
    for (const fileEntry of record.files) {
      if (await fs.pathExists(fileEntry.target)) {
        await fs.remove(fileEntry.target);
        console.log(chalk.green(`  ✓ Removed ${fileEntry.target}`));
        removedCount++;
      } else {
        console.log(chalk.yellow(`  ~ Already gone: ${fileEntry.target}`));
      }
    }
  } else {
    // No record, use known paths
    console.log(chalk.yellow('  No install record found, removing known files...'));
    for (const mapping of FILE_MAPPINGS) {
      const targetPath = resolveTargetPath(mapping.target, scope);
      if (await fs.pathExists(targetPath)) {
        await fs.remove(targetPath);
        console.log(chalk.green(`  ✓ Removed ${targetPath}`));
        removedCount++;
      }
    }
  }

  // Step 2: Delete harness-kit.json
  const recordPath = getRecordPath(scope);
  if (await fs.pathExists(recordPath)) {
    await fs.remove(recordPath);
    console.log(chalk.green(`  ✓ Removed ${recordPath}`));
    removedCount++;
  }

  // Step 3: Summary
  console.log(chalk.bold.green(`\n✅ Uninstalled. Removed ${removedCount} file(s).\n`));
}
