/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { analyzeCase, createDemoCase, executeAction, getCaseSummary, resetDemo, uploadInvoice } from "../api/demoApi.js";

const friendlyError = (error: unknown, fallback: string) => {
  const text = error instanceof Error ? error.message : "";
  if (/fetch|network/i.test(text)) return "本地演示服务未启动";
  if (/upload/i.test(text)) return "商业发票上传失败";
  if (/analysis|runtime/i.test(text)) return "智能识别服务暂不可用";
  return text && !/^(TypeError|HTTP 5\d\d)/i.test(text) ? text : fallback;
};

export function useLiveDemoSession(enabled: boolean) {
  const [demoCaseId, setDemoCaseId] = useState<string | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [liveSummary, setLiveSummary] = useState<any>(null);
  const [lastActionResult, setLastActionResult] = useState<any>(null);
  const [liveError, setLiveError] = useState("");
  const [liveLoading, setLiveLoading] = useState<"" | "upload" | "analysis" | "action" | "reset">("");

  useEffect(() => () => { if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl); }, [uploadedPreviewUrl]);

  const refresh = useCallback(async (caseId = demoCaseId) => {
    if (!caseId) return null;
    const summary = await getCaseSummary(caseId);
    setLiveSummary(summary);
    return summary;
  }, [demoCaseId]);

  const upload = useCallback(async (file: File) => {
    if (!enabled) throw new Error("在线版仅展示预置演示数据，不执行真实OCR");
    setLiveLoading("upload"); setLiveError("");
    try {
      const created = demoCaseId ? { caseId: demoCaseId } : await createDemoCase("C03");
      const caseId = created?.caseId;
      if (!caseId) throw new Error("创建演示业务失败：响应缺少业务编号");
      if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
      const preview = URL.createObjectURL(file);
      setDemoCaseId(caseId); setUploadedFile(file); setUploadedPreviewUrl(preview);
      const result = await uploadInvoice(caseId, file);
      if (!result?.document?.fileHash) throw new Error("上传响应缺少文件完整性校验值");
      setUploadedDocument(result.document);
      await refresh(caseId);
      return result;
    } catch (error) { const message = friendlyError(error, "商业发票上传失败"); setLiveError(message); throw new Error(message); }
    finally { setLiveLoading(""); }
  }, [demoCaseId, enabled, refresh, uploadedPreviewUrl]);

  const analyze = useCallback(async () => {
    if (!demoCaseId) throw new Error("请先上传商业发票");
    setLiveLoading("analysis"); setLiveError("");
    try { const result = await analyzeCase(demoCaseId); setAnalysisResult(result); await refresh(demoCaseId); return result; }
    catch (error) { const message = friendlyError(error, "分析任务失败"); setLiveError(message); throw new Error(message); }
    finally { setLiveLoading(""); }
  }, [demoCaseId, refresh]);

  const act = useCallback(async (requestedAction: string) => {
    if (!demoCaseId) throw new Error("当前业务已失效");
    setLiveLoading("action"); setLiveError("");
    try {
      const result = await executeAction(demoCaseId, { requestedAction, actorType: "SYSTEM", actorId: "DEMO-SYS" });
      setLastActionResult(result); await refresh(demoCaseId); return result;
    } catch (error) { const message = friendlyError(error, "可信执行失败"); setLiveError(message); throw new Error(message); }
    finally { setLiveLoading(""); }
  }, [demoCaseId, refresh]);

  const reset = useCallback(async () => {
    setLiveLoading("reset"); setLiveError("");
    try { if (demoCaseId) await resetDemo(demoCaseId); }
    catch (error) { setLiveError(friendlyError(error, "演示业务重置失败")); }
    finally {
      if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
      setDemoCaseId(null); setUploadedDocument(null); setUploadedFile(null); setUploadedPreviewUrl(null);
      setAnalysisResult(null); setLiveSummary(null); setLastActionResult(null); setLiveLoading("");
    }
  }, [demoCaseId, uploadedPreviewUrl]);

  return { mode: enabled ? "LIVE" : "STATIC", demoCaseId, uploadedDocument, uploadedFile, uploadedPreviewUrl, analysisResult, liveSummary, lastActionResult, liveError, liveLoading, upload, analyze, act, refresh, reset };
}
