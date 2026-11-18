import { z } from "zod";

import { BUDGET, DECISION, INTERESTS, SIZE, TIMELINE } from "./options";

export { BUDGET, DECISION, INTERESTS, SIZE, TIMELINE };

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
