import chalk from 'chalk';
import fs from 'fs-extra';
import {
  FILE_MAPPINGS,
  LEGACY_FILE_MAPPINGS,
  prepareTargetForCopy,
  resolveSourcePath,
  resolveTargetPath,
  hashFile,
  readRecord,
  writeRecord,
} from '../utils/registry.js';

const LEGACY_SOURCE_REMAP = new Map([
  ['skills/md-to-html-doc.md', 'skills/md-to-html-doc'],
]);

export default async function updateAction(options) {
  const { check = false, force = false } = options;

  console.log(chalk.bold('\nUpdate harness-kit\n'));

  const record = await readRecord('global');
  if (!record) {
    console.log(chalk.red('  Not installed. Run: harness-kit install'));
    return;
  }

  console.log(chalk.cyan(`  Installed version: ${record.version}`));
  console.log(chalk.cyan(`  Installed at: ${record.installedAt}\n`));

  const updates = [];
  let allUpToDate = true;
  const trackedSources = new Set(
    (record.files ?? []).map(file => LEGACY_SOURCE_REMAP.get(file.source) ?? file.source),
  );

  for (const fileEntry of record.files ?? []) {
    const effectiveSource = LEGACY_SOURCE_REMAP.get(fileEntry.source) ?? fileEntry.source;
    const srcPath = resolveSourcePath(effectiveSource);

    let sourceHash;
    try {
      sourceHash = await hashFile(srcPath);
    } catch {
      console.log(chalk.yellow(`  Source file not found in package: ${effectiveSource}`));
      continue;
    }

    const installedHash = fileEntry.hash ?? await hashFile(fileEntry.target);

    if (sourceHash !== installedHash) {
      allUpToDate = false;
      updates.push({
        source: effectiveSource,
        target: fileEntry.target,
        installedHash,
        sourceHash,
      });
    }
  }

  for (const mapping of FILE_MAPPINGS) {
    if (trackedSources.has(mapping.source)) {
      continue;
    }

    allUpToDate = false;
    updates.push({
      source: mapping.source,
      target: resolveTargetPath(mapping.target, 'global'),
      installedHash: 'missing',
      sourceHash: await hashFile(resolveSourcePath(mapping.source)),
    });
  }

  const legacyTargets = LEGACY_FILE_MAPPINGS.map(mapping => resolveTargetPath(mapping.target, 'global'));
  const hasLegacyTargets = (await Promise.all(legacyTargets.map(target => fs.pathExists(target)))).some(Boolean);
  if (hasLegacyTargets) {
    allUpToDate = false;
  }

  if (allUpToDate) {
    console.log(chalk.green('  All files up to date.'));
    console.log();
    return;
  }

  console.log(chalk.bold.yellow(`  ${updates.length} package update(s) available:\n`));
  for (const update of updates) {
    console.log(chalk.yellow(`  ~ ${update.source}`));
    console.log(chalk.gray(`    installed: ${update.installedHash} -> package: ${update.sourceHash}`));
  }
  if (hasLegacyTargets) {
    console.log(chalk.yellow('  ~ legacy single-file md-to-html-doc install will be removed'));
  }

  if (check) {
    console.log(chalk.cyan('\n  Use harness-kit update (without --check) to apply updates.'));
    console.log();
    return;
  }

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

  console.log();
  for (const update of updates) {
    const sourcePath = resolveSourcePath(update.source);
    await prepareTargetForCopy(sourcePath, update.target);
    await fs.copy(sourcePath, update.target, { overwrite: true });
    const newHash = await hashFile(update.target);
    const recordEntry = (record.files ?? []).find(file => file.source === update.source);
    const legacyRecordEntry = (record.files ?? []).find(file => LEGACY_SOURCE_REMAP.get(file.source) === update.source);

    if (recordEntry) {
      recordEntry.hash = newHash;
      recordEntry.target = update.target;
      recordEntry.source = update.source;
    } else if (legacyRecordEntry) {
      legacyRecordEntry.hash = newHash;
      legacyRecordEntry.target = update.target;
      legacyRecordEntry.source = update.source;
    } else {
      record.files ??= [];
      record.files.push({
        source: update.source,
        target: update.target,
        hash: newHash,
      });
    }

    console.log(chalk.green(`  Updated ${update.source}`));
  }

  for (const legacyMapping of LEGACY_FILE_MAPPINGS) {
    const legacyTarget = resolveTargetPath(legacyMapping.target, 'global');
    if (await fs.pathExists(legacyTarget)) {
      await fs.remove(legacyTarget);
      record.files = (record.files ?? []).filter(file => file.target !== legacyTarget && file.source !== legacyMapping.target);
      console.log(chalk.gray(`  - removed legacy ${legacyMapping.target}`));
    }
  }

  await writeRecord(record, 'global');
  console.log(chalk.green('\n  Install record updated'));
  console.log(chalk.bold.green('\nUpdate complete\n'));
}
