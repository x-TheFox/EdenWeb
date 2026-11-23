"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "@phosphor-icons/react";
import { useId, useRef, useState, type ReactNode } from "react";
import {
  BUDGET,
  DECISION,
  INTERESTS,
  SIZE,
  TIMELINE,
  stepOne,
  stepTwo,
  type Qualification,
} from "@/lib/qualify/schema";
import { bookingLink, site } from "@/lib/site";
import { captureFunnelEvent } from "@/lib/analytics";

type Values = Omit<Qualification, "decision" | "size" | "budget" | "timeline" | "interests"> & {
  decision: string;
  size: string;
  budget: string;
  timeline: string;
  interests: string[];
};
type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = {
  name: "",
  email: "",
  company: "",
  role: "",
  decision: "",
  size: "",
  interests: [],
  bottleneck: "",
  budget: "",
  timeline: "",
  website: "",
};

const inputCls =
  "w-full rounded-[var(--radius-surface)] border border-line-strong bg-ink px-4 py-3 text-bone placeholder:text-moss/80 transition-[border-color,box-shadow] duration-300 outline-none focus:border-survey focus:shadow-[0_0_0_3px_rgb(255_90_31/0.18)] aria-[invalid=true]:border-survey-soft";

function Field({
  label,
  id,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.92rem] text-bone">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[0.82rem] text-moss">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-[0.85rem] text-survey-soft">
          {error}
        </p>
      )}
    </div>
  );
}

function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  multi = false,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  value: string | string[];
  onChange: (v: string) => void;
  error?: string;
  multi?: boolean;
}) {
  const errId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className="mb-3 text-[0.92rem] text-bone">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = multi ? (value as string[]).includes(o) : value === o;
          return (
            <label
              key={o}
              className={`relative cursor-pointer select-none rounded-full border px-4 py-2 text-[0.88rem] transition-[border-color,background-color,color,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.97] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-survey ${
                on ? "border-survey bg-survey text-survey-ink" : "border-line-strong text-bone-dim hover:border-bone-dim hover:text-bone"
              }`}
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={name}
                value={o}
                checked={on}
                onChange={() => onChange(o)}
                className="sr-only"
              />
              {o}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errId} className="mt-2 text-[0.85rem] text-survey-soft">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function FitForm() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [step, setStep] = useState<0 | 1>(0);
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const toggleInterest = (o: string) =>
    set("interests", v.interests.includes(o) ? v.interests.filter((x) => x !== o) : [...v.interests, o]);

  const validate = (schema: typeof stepOne | typeof stepTwo) => {
    const r = schema.safeParse(v);
    if (r.success) return true;
    const fe = r.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const next: Errors = {};
    for (const [k, msgs] of Object.entries(fe)) if (msgs?.[0]) next[k as keyof Values] = msgs[0];
    setErrors(next);
    // Focus the first invalid control.
    requestAnimationFrame(() => {
      const first = Object.keys(next)[0];
      const el = document.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] textarea`);
      el?.focus();
    });
    return false;
  };

  const next = () => {
    if (!validate(stepOne)) return;
    captureFunnelEvent("fit_form_step_completed", { step: "1" });
    setStep(1);
    topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) return next();
    if (!validate(stepTwo)) {
      captureFunnelEvent("fit_form_submit_failed", { reason: "validation" });
      return;
    }
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; issues?: Record<string, string[]> };
      if (res.ok && data.ok) {
        captureFunnelEvent("fit_form_submitted");
        setStatus("done");
        topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        return;
      }
      if (res.status === 422 && data.issues) {
        const errs: Errors = {};
        for (const [k, m] of Object.entries(data.issues)) if (m?.[0]) errs[k as keyof Values] = m[0];
        setErrors(errs);
        if (Object.keys(errs).some((k) => k in stepOne.shape)) setStep(0);
      }
      setStatus("error");
      captureFunnelEvent("fit_form_submit_failed", { reason: res.status === 429 ? "rate_limit" : "server" });
      setErrMsg(res.status === 429 && data.error ? data.error : "");
    } catch {
      setStatus("error");
      captureFunnelEvent("fit_form_submit_failed", { reason: "network" });
    }
  };

  const desc = (k: keyof Values, hint?: boolean) =>
    errors[k] ? `${uid}-${k}-error` : hint ? `${uid}-${k}-hint` : undefined;

  if (status === "done") {
    const summary = `${v.company}: ${v.interests.join(", ")}. ${v.bottleneck}`;
    return (
      <div ref={topRef} className="scroll-mt-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[10px] border border-line-strong bg-ink-2 p-8 md:p-12"
          role="status"
        >
          <span className="grid size-12 place-items-center rounded-full bg-survey text-survey-ink">
            <Check weight="bold" className="size-5" aria-hidden />
          </span>
          <p className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.03em] text-bone">Received.</p>
          <p className="lede mt-4 max-w-[34rem]">Next, pick a time for the fit call. It takes 30 minutes.</p>
          <a
            href={bookingLink({ name: v.name, email: v.email, notes: summary })}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-survey py-2 pl-5 pr-2 font-medium text-survey-ink transition-[transform,background-color] duration-300 hover:bg-survey-soft active:scale-[0.97]"
          >
            Book the fit call
            <span className="grid size-8 place-items-center rounded-full bg-survey-ink/10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <ArrowUpRight weight="bold" className="size-3.5" aria-hidden />
            </span>
          </a>
          <p className="mt-6 text-[0.9rem] text-moss">
            Questions in the meantime:{" "}
            <a className="text-bone underline decoration-line-strong underline-offset-4 hover:decoration-bone" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      <form
        noValidate
        onSubmit={submit}
        className="rounded-[10px] border border-line-strong bg-ink-2 p-6 md:p-10"
        aria-describedby={`${uid}-progress`}
      >
        <div className="flex items-center justify-between gap-4">
          <p id={`${uid}-progress`} className="annot text-moss">
            Step {step + 1} of 2: {step === 0 ? "You" : "The work"}
          </p>
          <div className="flex w-24 gap-1.5" aria-hidden>
            <span className="h-[3px] flex-1 rounded-full bg-survey" />
            <span className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${step === 1 ? "bg-survey" : "bg-line-strong"}`} />
          </div>
        </div>

        {/* Honeypot */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
          </label>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <motion.div
              key="s1"
              initial={reduce ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 grid gap-6 md:grid-cols-2"
            >
              <div data-field="name">
                <Field label="Name" id={`${uid}-name`} error={errors.name}>
                  <input id={`${uid}-name`} className={inputCls} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={desc("name")} />
                </Field>
              </div>
              <div data-field="email">
                <Field label="Work email" id={`${uid}-email`} error={errors.email}>
                  <input id={`${uid}-email`} type="email" inputMode="email" className={inputCls} autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={desc("email")} />
                </Field>
              </div>
              <div data-field="company">
                <Field label="Company" id={`${uid}-company`} error={errors.company}>
                  <input id={`${uid}-company`} className={inputCls} autoComplete="organization" value={v.company} onChange={(e) => set("company", e.target.value)} aria-invalid={!!errors.company} aria-describedby={desc("company")} />
                </Field>
              </div>
              <div data-field="role">
                <Field label="Your role" id={`${uid}-role`} error={errors.role}>
                  <input id={`${uid}-role`} className={inputCls} autoComplete="organization-title" value={v.role} onChange={(e) => set("role", e.target.value)} aria-invalid={!!errors.role} aria-describedby={desc("role")} />
                </Field>
              </div>
              <div className="md:col-span-2" data-field="decision">
                <ChoiceGroup legend="Are you the decision-maker?" name="decision" options={DECISION} value={v.decision} onChange={(o) => set("decision", o)} error={errors.decision} />
              </div>
              <div className="md:col-span-2" data-field="size">
                <ChoiceGroup legend="Company size" name="size" options={SIZE} value={v.size} onChange={(o) => set("size", o)} error={errors.size} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="s2"
              initial={reduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 grid gap-7"
            >
              <div data-field="interests">
                <ChoiceGroup legend="What do you want to automate or build?" name="interests" options={INTERESTS} value={v.interests} onChange={toggleInterest} error={errors.interests} multi />
              </div>
              <div data-field="bottleneck">
                <Field label="The bottleneck or vision behind it" id={`${uid}-bottleneck`} error={errors.bottleneck} hint="What is slow, manual or missing today, and what would change if it were fixed?">
                  <textarea id={`${uid}-bottleneck`} rows={5} className={`${inputCls} resize-y`} value={v.bottleneck} onChange={(e) => set("bottleneck", e.target.value)} aria-invalid={!!errors.bottleneck} aria-describedby={desc("bottleneck", true)} maxLength={2000} />
                </Field>
              </div>
              <div data-field="budget">
                <ChoiceGroup legend="Budget for this project" name="budget" options={BUDGET} value={v.budget} onChange={(o) => set("budget", o)} error={errors.budget} />
              </div>
              <div data-field="timeline">
                <ChoiceGroup legend="When do you want to start?" name="timeline" options={TIMELINE} value={v.timeline} onChange={(o) => set("timeline", o)} error={errors.timeline} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div aria-live="assertive" className="mt-6 min-h-[1.5rem] text-[0.92rem] text-survey-soft">
          {status === "error" &&
            (errMsg || (
              <>
                Something went wrong sending that. Try again, or email{" "}
                <a className="underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </>
            ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          {step === 1 ? (
            <button type="button" onClick={() => setStep(0)} className="inline-flex items-center gap-2 py-2 text-[0.95rem] text-bone-dim transition-colors hover:text-bone">
              <ArrowLeft weight="light" className="size-4" aria-hidden />
              Back
            </button>
          ) : (
            <p className="text-[0.85rem] text-moss">Takes about two minutes.</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-survey py-2 pl-5 pr-2 text-[0.95rem] font-medium text-survey-ink transition-[transform,background-color,opacity] duration-300 ease-[var(--ease-out-expo)] hover:bg-survey-soft active:scale-[0.97] disabled:opacity-60"
          >
            {step === 0 ? "Continue" : status === "sending" ? "Sending..." : "Send and book a call"}
            <span className="grid size-8 place-items-center rounded-full bg-survey-ink/10 transition-transform duration-500 group-hover:translate-x-0.5">
              <ArrowRight weight="bold" className="size-3.5" aria-hidden />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
