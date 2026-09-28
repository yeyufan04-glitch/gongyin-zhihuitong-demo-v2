import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hook = await readFile("src/live/useLiveDemoSession.ts", "utf8");
const workspace = await readFile("app/components/LiveDemoWorkspace.tsx", "utf8");
const app = await readFile("app/components/DemoApp.tsx", "utf8");

test("STATIC模式不进入Live工作区", () => {
  assert.match(app, /liveMode \? <LiveDemoWorkspace/);
  assert.match(hook, /在线版仅展示预置演示数据，不执行真实OCR/);
});

test("LIVE创建C03 Demo Case并保存真实上传结果", () => {
  assert.match(hook, /createDemoCase\("C03"\)/);
  assert.match(hook, /setUploadedDocument\(result\.document\)/);
  assert.match(hook, /URL\.createObjectURL\(file\)/);
});

test("analyze完成后liveSummary成为真实页面事实源", () => {
  assert.match(hook, /await analyzeCase\(demoCaseId\)/);
  assert.match(hook, /setLiveSummary\(summary\)/);
  assert.match(workspace, /const summary = session\.liveSummary/);
});

test("Fast BLOCK不由前端迁移FLOW", () => {
  assert.match(workspace, /session\.act\("ADVANCE_TO_FAST_REVIEW"\)/);
  assert.doesNotMatch(workspace, /setWorkflowState/);
});

test("Focused ALLOW通过后端动作并刷新Summary", () => {
  assert.match(workspace, /session\.act\("ADVANCE_TO_FOCUSED_REVIEW"\)/);
  assert.match(hook, /await refresh\(demoCaseId\)/);
});

test("Reset清除完整Live Session", () => {
  for (const setter of ["setDemoCaseId(null)", "setUploadedDocument(null)", "setLiveSummary(null)", "setLastActionResult(null)"]) assert.ok(hook.includes(setter));
});
