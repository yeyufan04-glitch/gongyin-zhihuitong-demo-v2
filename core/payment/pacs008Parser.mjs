const textBetween = (source, tag, scope = source) => {
  const match = scope.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match?.[1]?.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim() ?? "";
};

const section = (source, tag) => source.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"))?.[1] ?? "";

export function parsePacs008Xml(xml, sourceId = "swift-case-001") {
  const appHdr = section(xml, "AppHdr");
  const body = section(xml, "FIToFICstmrCdtTrf");
  const transaction = section(body, "CdtTrfTxInf");
  const debtor = section(transaction, "Dbtr");
  const creditor = section(transaction, "Cdtr");
  const amountMatch = transaction.match(/<IntrBkSttlmAmt(?:\s+[^>]*)?\s+Ccy="([A-Z]{3})"[^>]*>([0-9.]+)<\/IntrBkSttlmAmt>/i);
  const xmlRef = (label, xpath, sourceText) => ({
    id: `${sourceId}-${label.toLowerCase()}`,
    sourceId,
    sourceType: "SWIFT_XML",
    label,
    locator: { type: "XML", xpath },
    sourceText,
  });
  const payerName = textBetween(debtor, "Nm");
  const beneficiaryName = textBetween(creditor, "Nm");
  const remittanceInfo = textBetween(transaction, "Ustrd");
  const uetr = textBetween(transaction, "UETR");
  const currency = amountMatch?.[1] ?? "";
  const amount = Number(amountMatch?.[2] ?? 0);
  return {
    sourceId,
    messageDefinition: textBetween(appHdr, "MsgDefIdr"),
    messageId: textBetween(appHdr, "BizMsgIdr") || textBetween(body, "MsgId"),
    createdAt: textBetween(appHdr, "CreDt") || textBetween(body, "CreDtTm"),
    payerName,
    beneficiaryName,
    amount,
    currency,
    remittanceInfo,
    uetr,
    settlementDate: textBetween(transaction, "IntrBkSttlmDt"),
    evidenceRefs: {
      payerName: xmlRef("PayerName", "/AppHdr/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Nm", payerName),
      beneficiaryName: xmlRef("BeneficiaryName", "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Nm", beneficiaryName),
      amount: xmlRef("SettlementAmount", "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt", `${currency} ${amount.toFixed(2)}`),
      remittanceInfo: xmlRef("RemittanceInfo", "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Ustrd", remittanceInfo),
      uetr: xmlRef("UETR", "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/UETR", uetr),
    },
  };
}

export function parsePacs008Amount(xml) {
  return parsePacs008Xml(xml).amount;
}
