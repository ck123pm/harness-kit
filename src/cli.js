import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = await fs.readJson(path.join(__dirname, '..', 'package.json'));

const program = new Command();

program
  .name('harness-kit')
  .description('CLI for installing and managing Claude Code harness capabilities')
  .version(pkg.version);

program
  .command('install')
  .description('Install harness skills into Claude')
  .option('--scope <scope>', 'Installation scope: global or local', 'global')
  .option('--skip-comet', 'Skip @ck123pm/comet installation')
  .option('--skip-openspec', 'Skip @fission-ai/openspec installation')
  .option('--force', 'Overwrite existing files')
  .action(async (options) => {
    if (!['global', 'local'].includes(options.scope)) {
      console.error('Error: --scope must be "global" or "local"');
      process.exit(1);
    }
    const { default: action } = await import('./commands/install.js');
    await action(options);
  });

program
  .command('doctor')
  .description('Check health of harness environment')
  .action(async () => {
    const { default: action } = await import('./commands/doctor.js');
    await action();
  });

program
  .command('update')
  .description('Update installed skill files')
  .option('--check', 'Check for updates without installing')
  .option('--force', 'Force overwrite without prompting')
  .action(async (options) => {
    const { default: action } = await import('./commands/update.js');
    await action(options);
  });

program
  .command('uninstall')
  .description('Remove installed skill files')
  .action(async () => {
    const { default: action } = await import('./commands/uninstall.js');
    await action();
  });

export { program };
