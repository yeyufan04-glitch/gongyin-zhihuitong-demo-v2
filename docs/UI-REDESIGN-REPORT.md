# 工银智汇通 UI Redesign Report

## Source audit

原始远程仓库仅提供可下载 ZIP，未提供 `src/` 或 React/Vite 源码；本分支整理回现有可维护 React/Vite 工程，保留原 ZIP 作为历史交付物。核心入口为 `app/page.tsx`、`app/components/DemoApp.tsx` 与 `app/globals.css`。

## 本轮改造

- 统一中文业务层级：竞赛演示环境、企业、经办、复核、运行、证据、业务状态等面向用户文案优先中文。
- 统一工行红、深灰、浅灰背景和白色卡片视觉；提高标题、正文、状态与运行节点字号，适配投影阅读。
- 保留四角色、Case切换、材料查看、证据定位、运行回放与Reset。
- 系统运行页统一为“可信作业运行监控”，保留自动驾驶技术迁移、CAV、21节点和审计链，但默认以业务阶段呈现。
- 新增 `src/api/demoApi.js`，集中封装 Demo Case 创建、商业发票上传、分析、Summary、Action、Reset；通过 `VITE_DEMO_API_BASE_URL` 适配本地后端，静态页不伪造真实接口结果。

## 运行模式

GitHub Pages 继续使用预置演示数据，并明确为竞赛在线演示；本地真实模式可通过 API Adapter 连接 Demo API。当前未改动 FACT、CAV、FLOW 或模型实现。

## 验证

- `npm run build:cn`：PASS
- `npm run build`：PASS
- `npm test`：13/13 PASS
- `npm run lint`：PASS（2 个既有 `<img>` 优化 warning，无 error）
- Playwright 浏览器验收：首页、企业端、材料中心、经办、复核、运行页可打开并截图。

## 已知边界

远程 ZIP 内的压缩构建产物仍作为历史文件保留，未作为开发源；当前前端工程的原始部分仍有少量既有英文技术标签和合成数据文案，后续人工 UI 审查可继续逐页收口。未修改真实后端业务逻辑、模型、CAV Policy 或 FLOW 状态机。
