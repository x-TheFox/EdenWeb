/**
 * Illustrative catalogue for a fictional company. Not a real client, not real prices.
 */
export type Feature = {
  id: string;
  name: string;
  summary: string;
  kind: "Workforce" | "Copilot" | "Intelligence" | "Software";
  weeks: [number, number];
  price: number;
};

export const DEMO_COMPANY = "Marlowe Freight Co.";
export const DEMO_DEPOSIT = 2500;

export const catalog: Feature[] = [
  { id: "MF-01", name: "Inbound quote desk agent", summary: "Reads quote requests, prices lanes from your rate history, drafts replies for approval.", kind: "Workforce", weeks: [3, 4], price: 14800 },
  { id: "MF-02", name: "Carrier onboarding pipeline", summary: "Collects documents, checks insurance and authority, flags gaps before dispatch.", kind: "Workforce", weeks: [2, 3], price: 9600 },
  { id: "MF-03", name: "Shipment status agent", summary: "Answers “where's my load” on WhatsApp and email around the clock, straight from your TMS.", kind: "Workforce", weeks: [2, 2], price: 7400 },
  { id: "MF-04", name: "Invoice reconciliation", summary: "Matches carrier invoices to rate confirmations and PODs, then surfaces disputes.", kind: "Workforce", weeks: [3, 3], price: 11200 },
  { id: "MF-05", name: "Dispatcher copilot", summary: "A side panel in your TMS that suggests carriers from lane history and drafts tenders.", kind: "Copilot", weeks: [4, 4], price: 16500 },
  { id: "MF-06", name: "Lane margin forecast", summary: "Weekly margin forecasts by lane, with alerts when a lane starts to slip.", kind: "Intelligence", weeks: [4, 5], price: 18900 },
  { id: "MF-07", name: "Shipper prospecting engine", summary: "Researches shippers, writes first-touch outreach, books meetings for your reps.", kind: "Workforce", weeks: [3, 3], price: 12300 },
  { id: "MF-08", name: "Customer portal", summary: "Branded portal for quotes, tracking and documents.", kind: "Software", weeks: [6, 8], price: 34000 },
];

export const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const weeksLabel = ([a, b]: [number, number]) => (a === b ? `${a} weeks` : `${a}-${b} weeks`);
