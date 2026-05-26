---
name: harness-update-spec
description: Analyze current project state and derive whether .harness/ specs need updating, provide interactive suggestions
---

# Harness Update Spec

基于当前项目最新代码状态，分析 `.harness/` 目录中的 spec 是否需要更新或新增。

**核心原则（严格遵守）**：
1. **对比驱动**：以 `.harness/` 现有内容为基准，对比当前代码真实状态
2. **增量更新**：只关注"什么变了"和"什么缺失了"，不重新生成全部内容
3. **交互式建议**：列出变更候选项，用户确认后逐个执行
4. **不记录可推导信息**：AI 能从源码直接推导的信息不写入 spec

## 分析流程

### 第一步：扫描现有 .harness/ 内容

读取当前 `.harness/` 目录下的所有文件，建立内容索引：
- 每个文件的主题、关键声明、版本号（如有）
- 识别出哪些 spec 存在、哪些缺失

### 第二步：探索项目当前状态

至少 3 轮深入探索（如果存在 codegraph 则优先使用 codegraph MCP）：

1. **技术栈变更**：package.json/pom.xml 的依赖新增/删除/升级
2. **模块边界变更**：新增/删除/重构的模块、服务入口、实体
3. **数据流/消息流变更**：新的 Consumer/Producer、RPC 调用、Topic
4. **高风险链路变更**：新的分布式锁、事务、外部集成
5. **Git 近期变更**：最近 commit message 中暗示的架构调整

### 第三步：推导差异矩阵

| 变更类型 | 影响 spec | 推导信号 |
|---|---|---|
| 新依赖 | `index/project-profile.md` | package.json/pom.xml 新增重要依赖 |
| 新模块 | `index/module-map.md` | 新目录/新 Maven module |
| 新服务入口 | `guides/backend.md` | 新 Consumer/Producer/Service |
| 新 RPC/DB/QMQ 集成 | `guides/backend.md` | 新配置、新 Topic、新 Entity |
| 新枚举/状态 | `domain/runtime-semantics.md` | 新增枚举类、状态定义 |
| 架构变更 | `rules/architecture.md` | 模块间依赖方向变化 |
| 新设计决策 | `decisions/tradeoffs.md` | commit message 中的权衡记录 |
| 新项目身份 | `index/project-profile.md` | 应用号、环境、关键常量变更 |
| 新业务术语 | `domain/glossary.md` | 新增领域概念 |
| 新项目业务规则 | `domain/business-rules.md` | 新的长期业务逻辑 |
| 新踩坑经验 | `memory/pitfalls.md` | 近期修复的问题 |
| 新回归问题 | `memory/regressions.md` | 回归修复记录 |
| 新模式 | `memory/patterns.md` | 可复用的新代码模式 |

### 第四步：交互式建议

以表格形式列出所有候选更新项：

```
🔍 harness-update-spec 分析报告

发现的变更（5 项）：

  #   类型      影响 spec                          信号
  ─── ───────── ────────────────────────────────── ──────────────────────
  1   新增      guides/backend.md                  新增 QMQ Topic: order.create
  2   变更      index/project-profile.md           新增依赖: @elastic/elasticsearch v8.x
  3   缺失      domain/runtime-semantics.md        存在 OrderState 枚举但未记录
  4   变更      rules/architecture.md              module-a 开始依赖 module-c
  5   新增      memory/pitfalls.md                 修复了分布式锁超时问题 (#1234)

缺失的 spec（2 项）：
  ~ decisions/tradeoffs.md  不存在，可能有新设计决策
  ~ memory/patterns.md      不存在，可能有新模式

请选择要执行的操作：
  A. 全部更新
  B. 交互式选择（逐项确认）
  C. 取消

输入 [A/B/C]:
```

### 第五步：执行更新

根据用户选择执行：

**A. 全部更新**：
- 逐个生成/更新对应 spec 文件
- 遵循内容拆分规则
- 完成后用 `find .harness -type f | sort` 验证

**B. 交互式选择**：
- 逐项列出变更
- 每次询问用户是否更新该项
- 用户确认后执行该项更新

**C. 取消**：
- 打印摘要后退出

### 第六步：human-docs 处理

如果新增了 human-docs/ 下的内容：
1. 先写 `.md` 文件
2. 调用 `md-to-html-doc` skill 转 `.html`
3. 删除 `.md` 原文件

## 内容拆分规则（复用 harness-init）

| 信息类型 | 存放位置 |
|---|---|
| 项目身份（应用号、技术栈、模块结构、关键常量） | `index/project-profile.md` |
| 数据流/消息流（QMQ Topic、消费链路） | `guides/backend.md` |
| 外部系统运行语义（DB/QMQ/RPC/翻译服务/锁/CAT/Shark） | `guides/backend.md` |
| 高风险链路 | `rules/architecture.md` |
| 模块边界/Ownership/禁止跨域行为 | `rules/architecture.md` |
| 设计决策/权衡 | `decisions/` |
| 历史踩坑/回归/模式 | `memory/` |

## 更新时的注意事项

- **不要覆盖已有的正确内容**：只新增和变更部分
- **保留历史记录**：如果是 ADR 或 memory 类 spec，追加而非覆盖
- **验证一致性**：更新后检查 `.harness/` 内部引用是否一致
- **如果 .harness/ 不存在**：提示用户先运行 `/harness-init`
