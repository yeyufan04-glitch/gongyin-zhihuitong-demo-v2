export function appendAuditEvent(events, { caseId, actor, action, before, after, timestamp = "2026-09-10 09:16" }) {
  return [...events, { id: `AUD-${String(events.length + 1).padStart(3, "0")}`, caseId, timestamp, actor, action, ...(before === undefined ? {} : { before }), ...(after === undefined ? {} : { after }) }];
}
