import chalk from 'chalk';
import {
  resolveClaudeConfigDir,
  ensureClaudeDirs,
} from '../utils/platform.js';
import {
  FILE_MAPPINGS,
  copyFileRecord,
  detectGlobalCommand,
  getDeclaredPackageSpec,
  installGlobalPackage,
  writeRecord,
  getPackageVersion,
} from '../utils/registry.js';

export default async function installAction(options) {
  const { scope = 'global', skipComet = false, skipOpenspec = false, force = false, mode = 'overwrite' } = options;

  console.log(chalk.bold('\n🔧 harness-kit install'));
  console.log(chalk.cyan(`  Mode: ${mode}\n`));

  // Step 1: Resolve and ensure dirs
  const claudeDir = resolveClaudeConfigDir({ scope });
  console.log(chalk.cyan(`  Scope: ${scope}`));
  console.log(chalk.cyan(`  Config: ${claudeDir}\n`));

  await ensureClaudeDirs(claudeDir);

  // Step 2: Copy files
  console.log(chalk.bold('Installing skills:'));
  const fileResults = [];

  for (const mapping of FILE_MAPPINGS) {
    const result = await copyFileRecord(mapping.source, mapping.target, { force, mode, scope });
    fileResults.push({ ...result, source: mapping.source });

    if (result.didUpdate) {
      console.log(chalk.green(`  ✓ ${mapping.target}`));
    } else if (result.reason === 'skipped') {
      console.log(chalk.gray(`  - ${mapping.target} (skipped, existing preserved)`));
    } else if (result.reason === 'skipped-by-user') {
      console.log(chalk.yellow(`  ~ ${mapping.target} (skipped by user)`));
    } else {
      console.log(chalk.yellow(`  ~ ${mapping.target} (already up to date)`));
    }
  }

  // Step 3: Check/install comet
  let cometResult;
  if (!skipComet) {
    const cometPackageSpec = await getDeclaredPackageSpec('@ck123pm/comet');
    console.log(chalk.bold('\nChecking comet:'));
    cometResult = await detectGlobalCommand('comet');
    if (cometResult.available) {
      console.log(chalk.green(`  ✓ comet ${cometResult.version}`));
    } else {
      console.log(chalk.yellow(`  ! comet not found, installing ${cometPackageSpec}...`));
      try {
        await installGlobalPackage(cometPackageSpec);
        const afterInstall = await detectGlobalCommand('comet');
        cometResult = afterInstall;
        if (afterInstall.available) {
          console.log(chalk.green(`  ✓ comet ${afterInstall.version} (installed)`));
        } else {
          console.log(chalk.red('  ✗ Failed to install comet'));
        }
      } catch (err) {
        console.log(chalk.red(`  ✗ Failed to install comet: ${err.message}`));
        console.log(chalk.yellow(`  Try: npm install -g ${cometPackageSpec}`));
      }
    }
  }

  // Step 4: Check/install openspec
  let openspecResult;
  if (!skipOpenspec) {
    const openspecPackageSpec = await getDeclaredPackageSpec('@fission-ai/openspec');
    console.log(chalk.bold('\nChecking openspec:'));
    openspecResult = await detectGlobalCommand('openspec');
    if (openspecResult.available) {
      console.log(chalk.green(`  ✓ openspec ${openspecResult.version}`));
    } else {
      console.log(chalk.yellow(`  ! openspec not found, installing ${openspecPackageSpec}...`));
      try {
        await installGlobalPackage(openspecPackageSpec);
        const afterInstall = await detectGlobalCommand('openspec');
        openspecResult = afterInstall;
        if (afterInstall.available) {
          console.log(chalk.green(`  ✓ openspec ${afterInstall.version} (installed)`));
        } else {
          console.log(chalk.red('  ✗ Failed to install openspec'));
        }
      } catch (err) {
        console.log(chalk.red(`  ✗ Failed to install openspec: ${err.message}`));
        console.log(chalk.yellow(`  Try: npm install -g ${openspecPackageSpec}`));
      }
    }
  }

  // Step 5: Write install record
  const version = await getPackageVersion();
  const record = {
    version,
    installedAt: new Date().toISOString(),
    scope,
    files: fileResults.map(r => ({
      source: r.source,
      target: r.target,
      hash: r.hash,
      size: r.size,
    })),
    options: {
      comet: !skipComet,
      openspec: !skipOpenspec,
    },
  };

  await writeRecord(record, scope);
  console.log(chalk.green(`\n  ✓ Install record written to ${claudeDir}/harness-kit.json`));

  // Step 6: Summary
  console.log(chalk.bold.green('\n✅ Installation complete!\n'));
  console.log('Next step:');
  console.log(chalk.cyan('  Open Claude and ask it to use the harness-init skill to initialize your project\n'));
}
