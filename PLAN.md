# @ck123pm/harness-kit 设计文档

## 产品定位

两段式初始化模型：

```
第一步：CLI 安装能力
npx @ck123pm/harness-kit install

第二步：Claude 执行智能初始化
/harness-init

第三步：CLI 或 Claude 执行 comet 初始化
comet init
```

**产品边界：**
- **harness-kit CLI**：安装 Claude command/skill、检查/安装 comet、环境诊断
- **harness-init.md**：Claude command，由 Claude 理解项目后智能生成 `.harness/`
- **md-to-html-doc.md**：Claude skill，Markdown 转响应式 HTML
- **comet**：后续 OpenSpec + Superpowers workflow 管理

CLI **不直接生成 `.harness/`** —— 真正的 `.harness/` 内容需要大模型理解项目后生成。

## 目录结构

```
@ck123pm/harness-kit
├── bin/
│   └── harness-kit.js          # CLI shebang 入口
├── src/
│   ├── cli.js                  # Commander 程序定义
│   ├── commands/
│   │   ├── install.js          # install 命令
│   │   ├── doctor.js           # doctor 命令
│   │   ├── update.js           # update 命令
│   │   └── uninstall.js        # uninstall 命令
│   └── utils/
│       ├── platform.js         # 平台检测（Windows/Mac/Linux 路径差异）
│       └── registry.js         # command/skill 安装路径解析
├── commands/
│   └── harness-init.md         # Claude command（智能初始化指令）
├── skills/
│   └── md-to-html-doc.md       # Claude skill
├── scripts/
│   └── init-comet.js           # 独立脚本：执行 comet init
├── package.json
└── README.md
```

## CLI 命令定义

### `harness-kit install`

安装 harness 能力到 Claude 环境：

1. **检测 Claude 配置路径**：解析 `~/.claude/` 或 `CLAUDE_CONFIG_DIR` 环境变量
2. **安装 harness-init.md 到 commands**：复制 `commands/harness-init.md` → `~/.claude/commands/harness-init.md`
3. **安装 md-to-html-doc.md 到 skills**：复制 `skills/md-to-html-doc.md` → `~/.claude/skills/md-to-html-doc.md`
4. **检查/安装 @ck123pm/comet**：检测 `comet` 是否在 PATH，不在则 `npm install -g @ck123pm/comet`
5. **检查/安装 openspec**：检测 `openspec` 是否在 PATH，不在则 `npm install -g @fission-ai/openspec`
6. **写入安装记录**：`~/.claude/harness-kit.json`
7. **提示用户下一步**："Open Claude and run `/harness-init` to initialize your project"

选项：
- `--scope <scope>`: global (默认) | local（安装到项目 .claude/ 而非全局）
- `--skip-comet`: 跳过 comet 安装
- `--skip-openspec`: 跳过 openspec 安装
- `--force`: 覆盖已有文件

### `harness-kit doctor`

环境健康检查，打印表格，每项绿色 ✓ 或红色 ✗：

- [ ] Claude command harness-init 是否已安装
- [ ] Claude skill md-to-html-doc 是否已安装
- [ ] comet 是否可用（版本）
- [ ] openspec 是否可用（版本）
- [ ] superpowers 是否可用
- [ ] 当前目录是否已有 `.harness/`
- [ ] 当前目录是否已有 `.comet.yaml`
- [ ] 当前目录是否已有 `openspec/`

末尾给出修复建议。

### `harness-kit update`

升级已安装的 command/skill：

1. 对比已安装文件与包内文件的哈希/大小
2. 如果有更新：提示用户，确认后覆盖
3. 如果已是最新：打印 "Up to date"
4. 可选：`--check` 仅检查不升级

### `harness-kit uninstall`

卸载已安装的 command/skill：

1. 删除 `~/.claude/commands/harness-init.md`
2. 删除 `~/.claude/skills/md-to-html-doc.md`
3. 删除 `~/.claude/harness-kit.json`
4. 打印确认信息

## 依赖配置

- **dependencies**: commander (^14.0.0), chalk (^5.3.0), fs-extra (^11.2.0)
- **peerDependencies**: @ck123pm/comet (>=0.2.0), @fission-ai/openspec (>=1.0.0)
- **peerDependenciesMeta**: 两者 optional: true
- **engines**: node >= 20
- **publishConfig**: { "access": "public" }
- **type**: "module"

## 验证方式

1. `npm install` 安装依赖
2. `node bin/harness-kit.js install` — 安装到全局
3. `node bin/harness-kit.js doctor` — 验证环境
4. 打开 Claude，执行 `/harness-init` — 验证 Claude 能识别 command
5. `node bin/harness-kit.js update` — 验证升级检测
6. `node bin/harness-kit.js uninstall` — 验证卸载
7. 测试 `--scope local` 安装到项目 `.claude/`
8. 测试 `--force` 覆盖
