import { createHash } from "node:crypto";

const sha256 = (value) => createHash("sha256").update(String(value)).digest("hex");

export function buildAuditLedger(events, caseId) {
  let previousHash = "GENESIS";
  return events.map((event, index) => {
    const payloadHash = sha256(JSON.stringify(event));
    const entryHash = sha256(`${caseId}|${index + 1}|${event.timestamp}|${event.actor}|${event.module}|${event.action}|${payloadHash}|${previousHash}`);
    const entry = { id: `LEDGER-${String(index + 1).padStart(3, "0")}`, caseId, sequence: index + 1, ...event, payloadHash, previousHash, entryHash };
    previousHash = entryHash;
    return entry;
  });
}

export function verifyAuditChain(entries) {
  let previousHash = "GENESIS";
  for (const entry of entries) {
    const expected = sha256(`${entry.caseId}|${entry.sequence}|${entry.timestamp}|${entry.actor}|${entry.module}|${entry.action}|${entry.payloadHash}|${previousHash}`);
    if (entry.previousHash !== previousHash || entry.entryHash !== expected) return false;
    previousHash = entry.entryHash;
  }
  return true;
}
