# @ck123pm/harness-kit

CLI for installing and managing Claude Code harness capabilities.

## 安装

```bash
npx @ck123pm/harness-kit install
```

或全局安装后使用：

```bash
npm install -g @ck123pm/harness-kit
harness-kit install
```

## 使用流程

三步初始化模型：

```
第一步：CLI 安装能力
npx @ck123pm/harness-kit install

第二步：Claude 执行智能初始化
/harness-init

第三步：CLI 或 Claude 执行 comet 初始化
comet init
```

## CLI 命令

### `harness-kit install`

安装 harness 能力到 Claude 环境：

- 复制 `harness-init.md` → `~/.claude/commands/`
- 复制 `harness-update-spec.md` → `~/.claude/commands/`
- 复制 `md-to-html-doc.md` → `~/.claude/skills/`
- 检查/安装 `@ck123pm/comet`
- 检查/安装 `@fission-ai/openspec`
- 写入安装记录 `~/.claude/harness-kit.json`

**选项：**

| 选项 | 说明 |
|------|------|
| `--scope <scope>` | `global`（默认）或 `local`（安装到项目 `.claude/`） |
| `--skip-comet` | 跳过 comet 安装 |
| `--skip-openspec` | 跳过 openspec 安装 |
| `--force` | 覆盖已有文件 |

**示例：**

```bash
# 全局安装（默认）
harness-kit install

# 安装到项目级 .claude/
harness-kit install --scope local

# 跳过 comet 和 openspec
harness-kit install --skip-comet --skip-openspec
```

### `harness-kit doctor`

环境健康检查，打印各项状态：

```
🔍 harness-kit doctor

  ✓ Claude command harness-init        Found
  ✓ Claude command harness-update-spec Found
  ✓ Claude skill md-to-html-doc        Found
  ✗ comet                               Not found
  ✗ openspec                            Not found
  ✓ superpowers                         Built-in
  ✗ .harness/                           Not found
  ✗ .comet.yaml                         Not found
  ✗ openspec/                           Not found
```

末尾给出修复建议。

### `harness-kit update`

升级已安装的 command/skill：

- 对比已安装文件与包内文件的哈希
- 有更新时提示确认后覆盖
- 已是最新时打印 "All files up to date"

**选项：**

| 选项 | 说明 |
|------|------|
| `--check` | 仅检查不升级 |
| `--force` | 强制覆盖不提示 |

**示例：**

```bash
# 检查是否有更新
harness-kit update --check

# 执行更新
harness-kit update
```

### `harness-kit uninstall`

卸载已安装的 command/skill：

```bash
harness-kit uninstall
```

删除 `~/.claude/commands/harness-init.md`、`harness-update-spec.md`、`skills/md-to-html-doc.md` 和 `harness-kit.json`。

## Claude Commands

安装后在 Claude 中可用的斜杠命令：

| 命令 | 说明 |
|------|------|
| `/harness-init` | 智能初始化 `.harness/` 目录，基于项目代码推导生成全部 spec |
| `/harness-update-spec` | 分析当前项目状态，对比现有 `.harness/` spec，交互式建议更新或新增 |

## .harness/ 目录结构

`/harness-init` 生成的目录：

```
.harness/
├── README.md                    # 使用说明
├── index/
│   ├── routing.md               # 任务→上下文路由
│   ├── priority.md              # 注入优先级 (MUST/SHOULD/HINT)
│   ├── module-map.md            # 模块→spec 映射
│   └── project-profile.md       # 项目身份卡片
├── rules/
│   ├── architecture.md          # 架构约束
│   ├── coding.md                # 编码规范
│   ├── testing.md               # 测试规则
│   └── security.md              # 安全约束
├── domain/
│   ├── glossary.md              # 领域术语
│   ├── business-rules.md        # 业务规则
│   └── runtime-semantics.md     # 运行时语义
├── decisions/
│   ├── adr/                     # 架构决策记录
│   └── tradeoffs.md             # 设计权衡
├── guides/
│   ├── backend.md               # 后端执行手册
│   └── ops.md                   # 运维操作指南
├── memory/
│   ├── pitfalls.md              # 踩坑经验
│   ├── regressions.md           # 回归问题
│   ├── patterns.md              # 可复用模式
│   └── lessons.md               # 经验总结
└── human-docs/
    ├── onboarding.html          # 新人手册
    ├── architecture-intro.html  # 架构介绍
    └── operation-manual.html    # 操作手册
```

## Claude Skill

| Skill | 说明 |
|-------|------|
| `md-to-html-doc` | Markdown 转响应式 HTML（含侧边栏导航、flexbox 流程图） |

## 环境要求

- Node.js >= 20
- Claude Code CLI
- `@ck123pm/comet`（可选）
- `@fission-ai/openspec`（可选）

## License

MIT