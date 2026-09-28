/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

type RuntimeCase = { id: string; customerName: string; amount: number; currency: string; route: string; riskStatus: string; contractParty: string; issue: string; evidencePrefix: string; service: string; purpose: string };

const migrations = [
  { key: "感知", cav: ["摄像头", "雷达", "定位", "V2X"], bank: ["SWIFT报文", "年度合同", "Invoice", "银行风险系统"], note: "获取业务环境。" },
  { key: "融合", cav: ["多传感器融合", "环境模型"], bank: ["业务事实融合", "实体标准化", "证据关联"], note: "把不同来源整理成统一业务事实。" },
  { key: "智能作业", cav: ["自动驾驶决策算法"], bank: ["确定性规则", "AI语义模型"], note: "能确定的用规则，模糊问题交给模型。" },
  { key: "安全计算", cav: ["V2X身份验证", "车载安全计算单元"], bank: ["可信证据网关", "工银隐私舱"], note: "数据先验证，再进入受控处理环境。" },
  { key: "可信决策闸门", cav: ["Safety Controller"], bank: ["可信决策闸门"], note: "AI建议不能直接触发真实业务动作。", primary: true },
  { key: "人工与日志", cav: ["驾驶员接管", "事件记录仪"], bank: ["银行重点复核", "可信审核日志"], note: "不确定时交给人，全过程留下记录。" },
];

const runtimeSteps = ["多源输入", "事实融合", "规则 + AI", "可信检查", "决策路由", "人工接管", "银行复核", "入账", "黑匣子"];

export function SystemRuntime21({ cases, activePayment, posted, selectEvidence }: { cases: RuntimeCase[]; activePayment: any; posted: boolean; selectEvidence: (id: string) => void }) {
  const activeCase = cases[0];
  const [paused, setPaused] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(4);
  const [drawer, setDrawer] = useState<string | null>(null);
  const replayStop = posted ? runtimeSteps.length - 1 : 5;
  const pulseMoving = replaying && !paused && pulseIndex < replayStop;

  useEffect(() => {
    if (!replaying || paused) return;
    if (pulseIndex >= replayStop) return;
    const timer = window.setTimeout(() => setPulseIndex((value) => value + 1), 720);
    return () => window.clearTimeout(timer);
  }, [replaying, paused, pulseIndex, replayStop]);

  const replay = () => { setPulseIndex(0); setPaused(false); setReplaying(true); };
  const reset = () => { setPulseIndex(4); setPaused(false); setReplaying(false); };
  const actualStage = (key: string) => {
    if (key === "感知") return `已接入4类信息：模拟SWIFT、原始单据、${activeCase.service}贸易背景、银行风险系统。`;
    if (key === "融合") return `${activeCase.id} 已将付款方、出口商、金额和单据编号关联为统一业务事实。`;
    if (key === "智能作业") return `规则核验完成；${activeCase.service}贸易背景关联结果仅作为辅助判断。`;
    if (key === "安全计算") return "输入来源、材料Hash、风险接口和AI Claim证据均已验证。";
    if (key === "可信决策闸门") return activeCase.route === "SUPPLEMENT_REQUIRED" ? "金额存在原始单据冲突，已阻断正常流转并路由至待补件。" : "自动核验完成，但主体名称属于非确定性事项，路由至重点复核。";
    return posted ? "经办、复核、Mock入账和审计封存已完成。" : "等待银行经办确认付款方主体关系，并将全过程写入可信审核日志。";
  };

  return <section className="runtime-cockpit">
    <header className="runtime-cockpit-head"><div><span className="eyebrow red-eyebrow">CAV可信AI运行驾驶舱</span><h2>系统运行</h2><p>AI处理一笔汇款的过程，就像智能汽车在可信安全系统保护下抵达目的地。</p></div><div className="runtime-case-chip"><span>{activeCase.id}</span><b>{activeCase.customerName}</b><strong>{activeCase.currency} {activeCase.amount.toLocaleString()}.00 · {activeCase.purpose}</strong></div><div className="runtime-head-status"><span>当前阶段<b>可信决策</b></span><span>业务路由<b>{activeCase.route === "SUPPLEMENT_REQUIRED" ? "待客户补件" : "重点复核"}</b></span><span>人工待确认<b>{activeCase.route === "SUPPLEMENT_REQUIRED" ? "金额冲突" : "1项"}</b></span><div><button className="outline" onClick={replay}>过程回放</button><button className="outline" onClick={() => setPaused(!paused)}>{paused ? "继续" : "暂停"}</button><button className="primary" onClick={reset}>重置本Case</button></div></div></header>

    <section className="migration-panel"><div className="runtime-section-title"><div><span className="eyebrow red-eyebrow">技术迁移层</span><h3>自动驾驶安全架构如何迁移到银行可信AI</h3></div><small>点击任一阶段查看原理、银行对应机制和本Case的实际数据。</small></div><div className="migration-track"><div className="track-label cav-label">自动驾驶安全架构 <span>小车仅作为技术思想来源</span></div><div className="track-label bank-label">工银智汇通可信AI作业架构</div>{migrations.map((item, index) => <button key={item.key} className={`migration-stage ${item.primary ? "primary" : ""}`} onClick={(event) => { event.stopPropagation(); setDrawer(item.key); }}><em>{String(index + 1).padStart(2, "0")}</em><div className="migration-cav"><span>自动驾驶</span><b>{item.cav.map((value) => <i key={value}>{value}</i>)}</b></div><div className="migration-arrow">↓</div><div className="migration-bank"><span>银行对应</span><b>{item.bank.map((value) => <i key={value}>{value}</i>)}</b></div><p>{item.note}</p></button>)}</div></section>

    <section className="runtime-case-panel"><div className="runtime-section-title"><div><span className="eyebrow red-eyebrow">当前Case运行层</span><h3>{activeCase.id} 正在如何被处理</h3></div><div className="runtime-live"><i />{pulseMoving ? "数据脉冲回放中" : paused && replaying ? "数据脉冲已暂停" : pulseIndex >= 5 && !posted ? "脉冲停在人工接管" : posted ? "已归档" : "实时状态"}</div></div><div className="case-flow">{runtimeSteps.map((step, index) => <div key={step} className={`runtime-step ${index === pulseIndex ? "pulse-here" : ""} ${index < pulseIndex ? "passed" : ""} ${index > 5 && !posted ? "future" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b><i>{index < 5 ? "自动" : index === 5 ? "人工" : "银行"}</i>{index < runtimeSteps.length - 1 && <em>→</em>}</div>)}</div><div className="runtime-detail-grid"><InputFacts activeCase={activeCase} activePayment={activePayment} selectEvidence={selectEvidence} /><FactFusion activeCase={activeCase} activePayment={activePayment} selectEvidence={selectEvidence} /><IntelligentDomain /><TrustChecks drawer={() => setDrawer("安全计算")} /><DecisionGate /><Handover activeCase={activeCase} activePayment={activePayment} posted={posted} /></div></section>

    <section className="blackbox-panel"><div className="runtime-section-title"><div><span className="eyebrow red-eyebrow">审计黑匣子</span><h3>可信审核日志</h3></div><div className="blackbox-stats"><span>记录<b>21条</b></span><span>完整性<b>✓</b></span><span>Hash Chain<b>通过</b></span><button className="ghost" onClick={() => setDrawer("人工与日志")}>查看完整记录</button></div></div><div className="blackbox-list">{[["14:32:01", "收到pacs.008报文"], ["14:39:06", "Invoice解析完成"], ["14:39:07", "交易对手完成名称规范化"], ["14:39:08", "银行风险系统返回 CLEAR"], ["14:39:10", "可信决策闸门：重点复核"]].map(([time, text]) => <div key={time}><time>{time}</time><span>{text}</span></div>)}</div></section>

    {drawer && <RuntimeDrawer stage={migrations.find((item) => item.key === drawer)} actual={actualStage(drawer)} evidencePrefix={activeCase.evidencePrefix} close={() => setDrawer(null)} selectEvidence={selectEvidence} posted={posted} />}
  </section>;
}

function InputFacts({ activeCase, activePayment, selectEvidence }: any) { const prefix = activeCase.evidencePrefix; return <article className="runtime-detail inputs"><div><span>① 多源输入</span><b>已接入4类信息</b></div><button onClick={() => selectEvidence(`${prefix}-swift-amount`)}>模拟SWIFT<small>{activePayment.debtorName}<br />{activePayment.currency} {activePayment.amount.toLocaleString()}<br />{activePayment.remittanceInfo}</small></button><button onClick={() => selectEvidence(`${prefix}-contract-party`)}>原始单据<small>{activeCase.contractParty}<br />{activeCase.service}<br />{activeCase.country} · 贸易背景</small></button><button onClick={() => selectEvidence(`${prefix}-invoice-amount`)}>商业发票<small>{activeCase.currency}<br />{activeCase.invoiceAmount ? `题面 ${activeCase.amount.toLocaleString()} / 发票 ${activeCase.invoiceAmount.toLocaleString()}` : activeCase.amount.toLocaleString()}<br />原始扫描件</small></button><button onClick={() => selectEvidence(`${prefix}-risk-result`)}>银行风险系统<small>查询完成<br />未触发预警</small></button></article>; }
function FactFusion({ activeCase, activePayment, selectEvidence }: any) { const prefix = activeCase.evidencePrefix; return <article className="runtime-detail fusion"><div><span>② 业务事实融合</span><b>标准业务事实</b></div><p>付款人 <strong>{activePayment.debtorName}</strong><br />贸易主体 <strong>{activeCase.contractParty}</strong><br />货物 <strong>{activeCase.service}</strong></p><button onClick={() => selectEvidence(`${prefix}-contract-party`)}>名称与单据关联 →<small>金额：{activeCase.currency} {activeCase.amount.toLocaleString()}.00<br />来源：模拟SWIFT + 原始单据<br />国家：{activeCase.country}</small></button></article>; }
function IntelligentDomain() { return <article className="runtime-detail intelligence"><div><span>③ 智能作业域</span><b>规则与AI分离</b></div><section><strong>确定性规则 <em>6 / 6 PASS</em></strong><p>金额一致 ✓，币种一致 ✓<br />收款主体 ✓，合同有效期 ✓<br />材料完整 ✓，Invoice日期 ✓</p></section><section><strong>非确定性模型</strong><p>主体匹配 96%，阈值95%<br />用途匹配 93%，阈值90%</p><small>任务可靠度达到辅助判断要求</small></section></article>; }
function TrustChecks({ drawer }: any) { return <article className="runtime-detail trust"><div><span>④ 可信检查</span><b>三道安全门</b></div>{[["输入可信", "SWIFT来源 · 材料Hash · 风险接口 · 证据关联"], ["计算可信", "模型授权 · 规则有效 · 任务可靠度 · AI Claim证据"], ["执行可信", "材料PASS · 规则PASS · 风险CLEAR · 人工接管1项"]].map(([title, content]) => <button key={title} onClick={drawer}><strong>{title}</strong><small>{content}</small></button>)}</article>; }
function DecisionGate() { return <article className="runtime-detail gate"><div><span>⑤ 安全决策闸门</span><b>可信决策闸门</b></div><ul>{["材料完整性 PASS", "确定性规则 PASS", "银行风险系统 CLEAR", "模型授权 PASS", "规则版本 PASS", "AI证据 PASS", "AI权限 PASS"].map((item) => <li key={item}>{item}<i>✓</i></li>)}</ul><strong className="gate-result">重点复核</strong><p>AI已完成7项自动核验，人工仅需确认1项。</p></article>; }
function Handover({ activeCase, activePayment, posted }: any) { return <article className="runtime-detail handover"><div><span>⑥ 人工接管与后续</span><b>{posted ? "已完成入账" : activeCase.route === "SUPPLEMENT_REQUIRED" ? "待补件 · 金额冲突" : "待人工判断 · 1项"}</b></div><p>{activePayment.debtorName}<br /><b>vs</b><br />{activeCase.contractParty}</p><small>贸易背景：{activeCase.service}<br />AI只提供关系与证据，不替代审批</small><footer>{posted ? "经办 ✓ → 复核 ✓ → 入账 ✓" : "等待银行经办确认"}</footer></article>; }

function RuntimeDrawer({ stage, actual, evidencePrefix, close, selectEvidence, posted }: any) { const currentStage = stage || { key: "人工与日志", cav: ["驾驶员接管", "事件记录仪"], bank: ["银行重点复核", "可信审核日志"], note: "全过程可审计。" }; return <aside className="runtime-explain-drawer"><button className="drawer-close" onClick={close}>×</button><span className="eyebrow red-eyebrow">技术迁移说明</span><h3>{currentStage.key}</h3><section><span>自动驾驶原理</span><b>{currentStage.cav.join(" · ")}</b></section><i>↓</i><section><span>银行对应机制</span><b>{currentStage.bank.join(" · ")}</b></section><i>↓</i><section><span>当前Case实际数据</span><p>{actual}</p></section>{currentStage.key === "安全计算" && <button onClick={() => selectEvidence(`${evidencePrefix}-risk-result`)}>查看AI Claim与风险系统证据</button>}{currentStage.key === "可信决策闸门" && <div className="drawer-gate"><b>重点复核</b><p>非确定性事项：1项。AI不可直接入账。</p></div>}{currentStage.key === "人工与日志" && <div className="drawer-log">Audit Ledger 21条<br />Hash Chain {posted ? "最终封存通过" : "当前完整性通过"}</div>}</aside>; }
