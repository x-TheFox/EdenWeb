import { z } from "zod";

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

const text = (min: number, max: number, msg: string) => z.string().trim().min(min, msg).max(max, `Keep this under ${max} characters.`);

export const stepOne = z.object({
  name: text(2, 120, "Tell us your name."),
  email: z.string().trim().max(200).email("Enter a valid work email."),
  company: text(1, 160, "Tell us the company name."),
  role: text(2, 120, "Tell us your role."),
  decision: z.enum(DECISION, { message: "Choose one." }),
  size: z.enum(SIZE, { message: "Choose a company size." }),
});

export const stepTwo = z.object({
  interests: z.array(z.enum(INTERESTS)).min(1, "Pick at least one.").max(INTERESTS.length),
  bottleneck: text(20, 2000, "A sentence or two helps us prepare. At least 20 characters."),
  budget: z.enum(BUDGET, { message: "Choose a range. Any range is fine." }),
  timeline: z.enum(TIMELINE, { message: "Choose a timeline." }),
});

export const qualification = stepOne.merge(stepTwo).extend({
  website: z.string().max(0).optional().or(z.literal("")),
});

export type Qualification = z.infer<typeof qualification>;
