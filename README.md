# @ck123pm/harness-kit

CLI for installing and managing harness-related Claude skills.

## Install

```bash
npx @ck123pm/harness-kit install
```

Or install globally first:

```bash
npm install -g @ck123pm/harness-kit
harness-kit install
```

## What Gets Installed

`harness-kit install` installs these Claude skills:

- `harness-init`
- `harness-update-spec`
- `md-to-html-doc`

It also checks for:

- `@ck123pm/comet`
- `@fission-ai/openspec`

And writes an install record to `~/.claude/harness-kit.json` or the local `.claude/` scope.

## Usage Flow

1. Install the skills with `harness-kit install`.
2. Open Claude and ask it to use the `harness-init` skill to initialize the project harness.
3. After the harness exists, ask Claude to use the `harness-update-spec` skill when specs need to be refreshed.
4. Use `comet init` or `openspec` commands as needed for the surrounding workflow.

## CLI Commands

### `harness-kit install`

Install the packaged Claude skills.

Options:

- `--scope <scope>`: `global` or `local`
- `--skip-comet`: skip `@ck123pm/comet` install check
- `--skip-openspec`: skip `@fission-ai/openspec` install check
- `--force`: overwrite installed files

Examples:

```bash
harness-kit install
harness-kit install --scope local
harness-kit install --skip-comet --skip-openspec
```

### `harness-kit doctor`

Check whether the required skills and supporting tools are present.

### `harness-kit update`

Update installed skill files from the current package contents.

Options:

- `--check`: detect updates without applying them
- `--force`: overwrite without prompting

### `harness-kit uninstall`

Remove installed skill files and the install record.

## Installed Skills

### `harness-init`

Initializes the `.harness/` directory from the real codebase and splits project knowledge into the expected harness structure.

### `harness-update-spec`

Compares the current codebase against the existing `.harness/` specs and proposes or applies incremental updates.

### `md-to-html-doc`

Converts Markdown architecture and guide documents into responsive HTML output.

## Expected `.harness/` Structure

```text
.harness/
├── README.md
├── index/
├── rules/
├── domain/
├── decisions/
├── guides/
├── memory/
└── human-docs/
```

## Requirements

- Node.js >= 20
- Claude Code CLI
- `@ck123pm/comet` optional
- `@fission-ai/openspec` optional

## License

MIT
