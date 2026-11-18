/** Option lists shared by the form, its zod schema and the Worker validator. */
export const DECISION = ["Yes, I make the call", "I share the decision", "I'm gathering options for someone else"] as const;
export const SIZE = ["Just me", "2-10", "11-50", "51-200", "201-1,000", "1,000+"] as const;
export const INTERESTS = [
  "Customer support",
  "Data entry",
  "Outbound sales",
  "Back-office operations",
  "QA generation",
  "A copilot for a team",
  "Forecasting or decision support",
  "Custom software or a platform",
  "Not sure yet",
] as const;
export const BUDGET = ["Under $5k", "$5k-15k", "$15k-50k", "$50k-150k", "$150k+", "Not sure yet"] as const;
export const TIMELINE = ["As soon as possible", "Within a month", "1-3 months", "3-6 months", "Just exploring"] as const;
