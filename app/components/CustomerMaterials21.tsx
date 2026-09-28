/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { analyzeCase, createDemoCase, resetDemo as resetLiveCase, uploadInvoice } from "../../src/api/demoApi.js";

const materialProfiles: Record<string, Array<{ key: string; name: string; path: string; note: string }>> = {
  case_2011: [
    { key: "invoice", name: "商业发票 TX0522", path: "./demo-documents/trade-cases/2011/commercial_invoice.jpg", note: "原始扫描件 · USD 32,800 · BLACK TEA" },
    { key: "packing", name: "装箱单 TXT264", path: "./demo-documents/trade-cases/2011/packing_list.jpg", note: "原始扫描件 · 66 CARTONS · 375KGS" },
  ],
  case_2012: [
    { key: "invoice", name: "商业发票 X118", path: "./demo-documents/trade-cases/2012/commercial_invoice.png", note: "原始扫描件 · USD 192,000 · CUTTING TOOLS" },
    { key: "insurance", name: "海洋货物运输保险单 ABX999", path: "./demo-documents/trade-cases/2012/insurance_policy.png", note: "原始扫描件 · USD 211,200 · ICC(A)" },
    { key: "origin", name: "原产地证明 IB012345678", path: "./demo-documents/trade-cases/2012/certificate_of_origin.png", note: "原始扫描件 · DAYU CUTTING TOOLS I/E CORP" },
  ],
  case_2019: [
    { key: "invoice", name: "商业发票 EXP2019033", path: "./demo-documents/trade-cases/2019/commercial_invoice.jpg", note: "原始扫描件 · USD 180,000 · RT628" },
    { key: "shipping", name: "装运通知 EXP2019033", path: "./demo-documents/trade-cases/2019/shipping_note.jpg", note: "原始扫描件 · USD 180,000 · 天津至汉堡" },
  ],
};

export function CustomerMaterials21({ activeCase, uploaded, setUploaded, aiDone, runPrecheck, setView }: any) {
  const docs = materialProfiles[activeCase.evidencePrefix] ?? materialProfiles.case_2011;
  const [selectedKey, setSelectedKey] = useState(docs[0].key);
  const [fileMeta, setFileMeta] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [demoCaseId, setDemoCaseId] = useState<string | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [localAnalyzed, setLocalAnalyzed] = useState(false);
  const liveMode = Boolean(import.meta.env.VITE_DEMO_API_BASE_URL);
  useEffect(() => {
    const handleReset = async () => {
      if (!liveMode || !demoCaseId) return;
      try { await resetLiveCase(demoCaseId); } catch { /* reset is best-effort during navigation */ }
      setDemoCaseId(null); setFileMeta(null); setLocalAnalyzed(false); setUploaded(false); setError("");
    };
    window.addEventListener("demo-live-reset", handleReset);
    return () => window.removeEventListener("demo-live-reset", handleReset);
  }, [demoCaseId, liveMode, setUploaded]);
  const selected = docs.find((doc) => doc.key === selectedKey) ?? docs[0];
  const onFile = async (event: any) => { const file = event.target.files?.[0]; if (!file) return; setError(""); if (!/^image\/(jpeg|png)$/.test(file.type)) { setError("文件格式不支持，仅支持 JPG / JPEG / PNG"); return; } if (file.size > 15 * 1024 * 1024) { setError("文件超过15MB"); return; } setFileMeta(file); setUploading(true); try { if (liveMode) { const id = demoCaseId || (await createDemoCase("C03")).caseId; setDemoCaseId(id); await uploadInvoice(id, file); } setUploaded(true); } catch (cause) { setError(cause instanceof Error ? cause.message : "上传失败，请检查本地演示服务"); setUploaded(false); } finally { setUploading(false); } };
  const handleAnalyze = async () => { if (!liveMode) { runPrecheck(); return; } if (!demoCaseId) { setError("当前Demo Case不存在，请重新选择文件"); return; } setLiveLoading(true); setError(""); try { await analyzeCase(demoCaseId); setLocalAnalyzed(true); } catch (cause) { setError(cause instanceof Error ? cause.message : "智能分析服务暂不可用"); } finally { setLiveLoading(false); } };
  const analysisDone = aiDone || localAnalyzed;
  return <div className="stack"><section className="page-intro"><div><span className="eyebrow red-eyebrow">材料中心</span><h2>本次汇款所需材料</h2><p>商业发票用于智能识别、事实构建与一致性核验。</p></div><span className="mode-note">{liveMode ? "本地智能分析模式" : "竞赛在线演示 · 使用预置演示数据"}</span></section><section className="materials21"><aside className="materials21-actions"><span className="eyebrow red-eyebrow">本次必要材料</span><h3>商业发票</h3>{docs.map((doc) => <button key={doc.key} className={selected.key === doc.key ? "material21 active" : "material21"} onClick={() => setSelectedKey(doc.key)}><b>{doc.name}</b><small>{doc.note}</small></button>)}<label className="upload21">选择商业发票<input type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onChange={onFile} /></label>{fileMeta && <div className="upload-meta"><strong>{fileMeta.name}</strong><small>{fileMeta.type} · {(fileMeta.size / 1024).toFixed(1)} KB</small></div>}{uploading && <span className="status-pill amber">正在接收文件…</span>}{uploaded && <span className="status-pill green">文件已接收 · 完整性校验完成</span>}{error && <span className="status-pill red">{error}</span>}<button className="primary wide" disabled={!uploaded || analysisDone || liveLoading} onClick={handleAnalyze}>{liveLoading ? "正在进行智能分析…" : analysisDone ? "分析已完成" : "开始智能分析"}</button>{analysisDone && <button className="ghost wide" onClick={() => setView("home")}>返回首页</button>}<div className="material21-note">竞赛演示使用公开教学/模拟材料，不包含真实银行客户敏感信息。</div></aside><section className="materials21-original"><div className="original21-head"><div><span>原始单据</span><b>{fileMeta?.name || selected.name}</b></div><small>商业发票 · 证据链入口</small></div><div className="original21-paper"><img src={selected.path} alt={selected.name} /><small>在线模式使用预置演示数据；本地模式上传后调用真实 Demo Backend。</small></div></section></section><div className="materials21-progress"><span className="done">● 汇款与材料</span><span className={uploaded ? "done" : ""}>● 文件接收</span><span className={liveLoading ? "active" : analysisDone ? "done" : ""}>● 智能识别与核验</span><span>○ 银行复核</span><b>{activeCase.id}</b></div></div>;
}
