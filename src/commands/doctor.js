import path from 'node:path';
import fs from 'fs-extra';
import chalk from 'chalk';
import {
  resolveTargetPath,
  detectGlobalCommand,
  getRecordPath,
  LEGACY_FILE_MAPPINGS,
} from '../utils/registry.js';

export default async function doctorAction() {
  console.log(chalk.bold('\n🔍 harness-kit doctor\n'));

  const checks = [];

  // Check 1: Claude skill harness-init (check both scopes)
  let initSkillPath = null;
  const globalInitSkill = resolveTargetPath('skills/harness-init/SKILL.md', 'global');
  const localInitSkill = resolveTargetPath('skills/harness-init/SKILL.md', 'local');
  if (await fs.pathExists(globalInitSkill)) {
    initSkillPath = globalInitSkill;
  } else if (await fs.pathExists(localInitSkill)) {
    initSkillPath = localInitSkill;
  }
  checks.push({
    label: 'Claude skill harness-init',
    status: initSkillPath ? 'ok' : 'fail',
    detail: initSkillPath ? `Found at ${initSkillPath}` : 'Not installed',
    fix: 'Run: harness-kit install',
  });

  // Check 2: Claude skill md-to-html-doc (check both scopes)
  let skillPath = null;
  let legacySkillPath = null;
  const globalSkill = resolveTargetPath('skills/md-to-html-doc/SKILL.md', 'global');
  const localSkill = resolveTargetPath('skills/md-to-html-doc/SKILL.md', 'local');
  const globalLegacySkill = resolveTargetPath(LEGACY_FILE_MAPPINGS[0].target, 'global');
  const localLegacySkill = resolveTargetPath(LEGACY_FILE_MAPPINGS[0].target, 'local');
  if (await fs.pathExists(globalSkill)) {
    skillPath = globalSkill;
  } else if (await fs.pathExists(localSkill)) {
    skillPath = localSkill;
  } else if (await fs.pathExists(globalLegacySkill)) {
    legacySkillPath = globalLegacySkill;
  } else if (await fs.pathExists(localLegacySkill)) {
    legacySkillPath = localLegacySkill;
  }
  checks.push({
    label: 'Claude skill md-to-html-doc',
    status: skillPath ? 'ok' : 'fail',
    detail: skillPath
      ? `Found at ${skillPath}`
      : legacySkillPath
        ? `Legacy single-file install found at ${legacySkillPath}`
        : 'Not installed',
    fix: legacySkillPath ? 'Run: harness-kit update or harness-kit install --force' : 'Run: harness-kit install',
  });

  // Check 3: Claude skill harness-update-spec (check both scopes)
  let updateSpecSkillPath = null;
  const globalUpdateSpecSkill = resolveTargetPath('skills/harness-update-spec/SKILL.md', 'global');
  const localUpdateSpecSkill = resolveTargetPath('skills/harness-update-spec/SKILL.md', 'local');
  if (await fs.pathExists(globalUpdateSpecSkill)) {
    updateSpecSkillPath = globalUpdateSpecSkill;
  } else if (await fs.pathExists(localUpdateSpecSkill)) {
    updateSpecSkillPath = localUpdateSpecSkill;
  }
  checks.push({
    label: 'Claude skill harness-update-spec',
    status: updateSpecSkillPath ? 'ok' : 'fail',
    detail: updateSpecSkillPath ? `Found at ${updateSpecSkillPath}` : 'Not installed',
    fix: 'Run: harness-kit install',
  });

  // Check 4: harness-kit install record (check both scopes)
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
    fix: 'Ask Claude to use the harness-init skill',
  });

  // Check 8: .comet.yaml
  const cometYaml = path.join(process.cwd(), '.comet.yaml');
  const cometYamlExists = await fs.pathExists(cometYaml);
  checks.push({
    label: '.comet.yaml',
    status: cometYamlExists ? 'ok' : 'fail',
    detail: cometYamlExists ? 'Found' : 'Not found',
    fix: 'Ask Claude to use the harness-init skill or run comet init',
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
