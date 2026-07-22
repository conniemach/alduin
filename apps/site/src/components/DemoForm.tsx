"use client";

import { Button } from "@alduin/design-system";
import {
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

const FIELD_CLASSNAME =
  "w-full rounded-lg border border-white/15 bg-transparent px-2 py-2 font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none";

function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-1 flex-col gap-2">
      <span className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
        {label}
      </span>
      <input className={FIELD_CLASSNAME} {...props} />
    </label>
  );
}

const COMPANY_SIZES = ["1–50", "51–200", "201–1,000", "1,000+"];

// No chevron icon exists in the design system yet — a native <select>'s own
// arrow can't be restyled to match the glass inputs, so this draws a plain
// one and hides the native arrow via `appearance-none` on the trigger.
function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5 min-[701px]:flex-row">{children}</div>;
}

export function DemoForm() {
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="w-full rounded-[20px] bg-gradient-to-b from-[#666666] via-[#242424] to-[#666666] p-px">
        <div className="flex min-h-[461px] flex-col items-center justify-center gap-3 rounded-[20px] bg-neutral-850/10 p-5 text-center backdrop-blur-xl">
          <p className="font-mono text-[20px] leading-[24px] text-white">
            Message sent
          </p>
          <p className="max-w-[420px] font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
            Thanks, {fullName.split(" ")[0] || "there"} — someone from our team
            will follow up at {workEmail || "the email you provided"} shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="w-full rounded-[20px] bg-gradient-to-b from-[#666666] via-[#242424] to-[#666666] p-px"
    >
      <div className="flex flex-col gap-5 rounded-[20px] bg-neutral-850/10 p-5 backdrop-blur-xl">
        <Row>
          <Field
            label="Full name"
            placeholder="John Smith"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Field
            label="Work email"
            type="email"
            placeholder="jsmith@email.com"
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            required
          />
        </Row>
        <Row>
          <Field
            label="Company name"
            placeholder="jsmith@email.com"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <label className="flex flex-1 flex-col gap-2">
            <span className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
              Company size
            </span>
            <div className="relative">
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                required
                className={`${FIELD_CLASSNAME} appearance-none pr-8 ${companySize ? "" : "text-neutral-500"}`}
              >
                <option value="" disabled hidden>
                  Select size
                </option>
                {COMPANY_SIZES.map((size) => (
                  <option
                    key={size}
                    value={size}
                    className="bg-neutral-900 text-white"
                  >
                    {size}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          </label>
        </Row>
        <label className="flex flex-col gap-2">
          <span className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
            Tell us about your needs
          </span>
          <textarea
            placeholder="I'm interested in Alduin for my team..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${FIELD_CLASSNAME} h-[160px] resize-none`}
          />
        </label>
        <Button type="submit" className="self-start">
          Send message
        </Button>
      </div>
    </form>
  );
}
