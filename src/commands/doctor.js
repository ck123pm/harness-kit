import path from 'node:path';
import fs from 'fs-extra';
import chalk from 'chalk';
import {
  resolveTargetPath,
  detectGlobalCommand,
  getRecordPath,
} from '../utils/registry.js';

export default async function doctorAction() {
  console.log(chalk.bold('\n🔍 harness-kit doctor\n'));

  const checks = [];

  // Check 1: Claude command harness-init (check both scopes)
  let cmdPath = null;
  const globalCmd = resolveTargetPath('commands/harness-init.md', 'global');
  const localCmd = resolveTargetPath('commands/harness-init.md', 'local');
  if (await fs.pathExists(globalCmd)) {
    cmdPath = globalCmd;
  } else if (await fs.pathExists(localCmd)) {
    cmdPath = localCmd;
  }
  checks.push({
    label: 'Claude command harness-init',
    status: cmdPath ? 'ok' : 'fail',
    detail: cmdPath ? `Found at ${cmdPath}` : 'Not installed',
    fix: 'Run: harness-kit install',
  });

  // Check 2: Claude skill md-to-html-doc (check both scopes)
  let skillPath = null;
  const globalSkill = resolveTargetPath('skills/md-to-html-doc.md', 'global');
  const localSkill = resolveTargetPath('skills/md-to-html-doc.md', 'local');
  if (await fs.pathExists(globalSkill)) {
    skillPath = globalSkill;
  } else if (await fs.pathExists(localSkill)) {
    skillPath = localSkill;
  }
  checks.push({
    label: 'Claude skill md-to-html-doc',
    status: skillPath ? 'ok' : 'fail',
    detail: skillPath ? `Found at ${skillPath}` : 'Not installed',
    fix: 'Run: harness-kit install',
  });

  // Check 3: harness-kit install record (check both scopes)
  let recordPath = null;
  const gr = await getRecordPath('global');
  const lr = await getRecordPath('local');
  if (await fs.pathExists(gr)) {
    recordPath = gr;
  } else if (await fs.pathExists(lr)) {
    recordPath = lr;
  }
  checks.push({
    label: 'harness-kit install record',
    status: recordPath ? 'ok' : 'fail',
    detail: recordPath ? `Found at ${recordPath}` : 'Not installed',
    fix: 'Run: harness-kit install',
  });

  // Check 4: comet
  const comet = await detectGlobalCommand('comet');
  checks.push({
    label: 'comet',
    status: comet.available ? 'ok' : 'fail',
    detail: comet.available ? `v${comet.version}` : 'Not found',
    fix: 'Run: npm install -g @ck123pm/comet',
  });

  // Check 5: openspec
  const openspec = await detectGlobalCommand('openspec');
  checks.push({
    label: 'openspec',
    status: openspec.available ? 'ok' : 'fail',
    detail: openspec.available ? `v${openspec.version}` : 'Not found',
    fix: 'Run: npm install -g @fission-ai/openspec',
  });

  // Check 6: superpowers (built-in to Claude Code)
  checks.push({
    label: 'superpowers',
    status: 'ok',
    detail: 'Built-in to Claude Code',
    fix: null,
  });

  // Check 7: .harness/
  const harnessDir = path.join(process.cwd(), '.harness');
  const harnessExists = await fs.pathExists(harnessDir);
  checks.push({
    label: '.harness/',
    status: harnessExists ? 'ok' : 'fail',
    detail: harnessExists ? 'Project initialized' : 'Not found',
    fix: 'Run: /harness-init in Claude',
  });

  // Check 8: .comet.yaml
  const cometYaml = path.join(process.cwd(), '.comet.yaml');
  const cometYamlExists = await fs.pathExists(cometYaml);
  checks.push({
    label: '.comet.yaml',
    status: cometYamlExists ? 'ok' : 'fail',
    detail: cometYamlExists ? 'Found' : 'Not found',
    fix: 'Run: /harness-init in Claude or comet init',
  });

  // Check 8: openspec/
  const openspecDir = path.join(process.cwd(), 'openspec');
  const openspecDirExists = await fs.pathExists(openspecDir);
  checks.push({
    label: 'openspec/',
    status: openspecDirExists ? 'ok' : 'fail',
    detail: openspecDirExists ? 'Found' : 'Not found',
    fix: 'Run: openspec init',
  });

  // Print table
  const maxLabel = Math.max(...checks.map(c => c.label.length));
  const maxDetail = Math.max(...checks.map(c => c.detail.length));

  console.log(chalk.bold(`  ${'Check'.padEnd(maxLabel + 2)} ${'Status'.padEnd(8)} ${'Details'}`));
  console.log(chalk.gray('  ' + '─'.repeat(maxLabel + 2 + 8 + maxDetail + 4)));

  for (const check of checks) {
    const status = check.status === 'ok'
      ? chalk.green('✓')
      : chalk.red('✗');
    const label = check.label.padEnd(maxLabel + 2);
    const detail = check.detail;
    console.log(`  ${status} ${label} ${detail}`);
  }

  // Repair suggestions
  const failures = checks.filter(c => c.status === 'fail' && c.fix);
  if (failures.length > 0) {
    console.log(chalk.bold.yellow('\nRepair suggestions:'));
    failures.forEach((f, i) => {
      console.log(chalk.yellow(`  ${i + 1}. ${f.fix}`));
    });
  } else {
    console.log(chalk.bold.green('\n✅ All checks passed!\n'));
  }
  console.log();
}
