import { demoCases, demoPayments, historicalDocuments } from "../engine.mjs";
export const demoRepository = { listPayments: () => demoPayments, listCases: () => demoCases, listHistoricalDocuments: () => historicalDocuments, getCase: (id) => demoCases.find((item) => item.id === id) };
