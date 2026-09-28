/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

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

export function CustomerMaterials21({ activeCase, historyUsed, setHistoryUsed, uploaded, setUploaded, aiDone, runPrecheck, setView }: any) {
  const docs = materialProfiles[activeCase.evidencePrefix] ?? materialProfiles.case_2011;
  const [selectedKey, setSelectedKey] = useState(docs[0].key);
  const selected = docs.find((doc) => doc.key === selectedKey) ?? docs[0];
  return <div className="stack"><section className="page-intro"><div><span className="eyebrow red-eyebrow">材料中心 / 原始单据</span><h2>本次材料直接引用考试原始扫描件</h2><p>原始图片保留为证据源；模拟SWIFT、风险和外部数据单独标记，不与原始单据混淆。</p></div></section><section className="materials21"><aside className="materials21-actions"><span className="eyebrow red-eyebrow">本次必要材料</span><h3>{docs.length}项已识别材料</h3>{docs.map((doc) => <button key={doc.key} className={selected.key === doc.key ? "material21 active" : "material21"} onClick={() => setSelectedKey(doc.key)}><b>{doc.name}</b><small>{doc.note}</small></button>)}<button className={historyUsed ? "used-button wide" : "outline wide"} onClick={() => setHistoryUsed(!historyUsed)}>{historyUsed ? "已记录材料引用 ✓" : "记录材料引用"}</button><label className="upload21">补充演示材料<input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={() => setUploaded(true)} /></label>{uploaded && <span className="status-pill green">补充材料已接收</span>}<div className="material21-note">原始扫描件可追溯到 Case Manifest；系统不把考试资料表述为真实银行客户材料。</div><button className="primary wide" disabled={!historyUsed || !uploaded || aiDone} onClick={runPrecheck}>{aiDone ? "已提交银行审核" : "提交银行审核"}</button>{aiDone && <button className="ghost wide" onClick={() => setView("home")}>返回首页</button>}</aside><section className="materials21-original"><div className="original21-head"><div><span>原件</span><b>{selected.name}</b></div><small>Original Scan · {selected.note}</small></div><div className="original21-paper"><img src={selected.path} alt={selected.name} /><small>原始扫描件 · 仅作竞赛演示证据，不代表真实银行客户资料</small></div></section></section><div className="materials21-progress"><span className="done">● 汇款到账</span><span className="done">● 企业确认</span><span className={historyUsed && uploaded ? "done" : ""}>● 材料准备</span><span className={aiDone ? "done" : ""}>● AI预审</span><span>○ 银行审核</span><span>○ 入账</span><b>{activeCase.id}</b></div></div>;
}
