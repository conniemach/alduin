import { type SVGAttributes } from "react";
import {
  CheckDrawIcon,
  ChartDrawIcon,
  AccountPulseIcon,
  EarthSpinIcon,
} from "@alduin/design-system";

const benefits: {
  Icon: (props: SVGAttributes<SVGSVGElement>) => React.JSX.Element;
  label: string;
  description: string;
}[] = [
  {
    Icon: CheckDrawIcon,
    label: "PREDICT",
    description:
      "Model tsunamis, eruptions, and hurricanes — then auto-generate impact projections across infrastructure, populations, and critical assets.",
  },
  {
    Icon: ChartDrawIcon,
    label: "TRACK",
    description:
      "Full incident lifecycle visibility, from escalation to resolution, with ownership, updates, and a timeline built for review.",
  },
  {
    Icon: AccountPulseIcon,
    label: "RESPOND",
    description:
      "Coordinate response and SAR planning with shared context, decision logs, and clear task routing to the field.",
  },
  {
    Icon: EarthSpinIcon,
    label: "COMMAND",
    description:
      "Structured briefings and posture tracking that keep every stakeholder aligned on one operational picture.",
  },
];

export function BenefitsSection() {
  return (
    <section className="flex flex-col gap-[50px] pb-10">
      <div className="flex gap-12">
        <p className="flex-1 font-mono text-[32px] leading-[38.4px] text-white">
          Modern intelligence capability at a fraction of legacy platform
          cost.
        </p>
        <p className="flex-1 font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
          Alduin supports teams operating in fast-changing environments
          where timing, clarity, and consequence matter. From natural
          hazard modeling to field response coordination, the platform is
          designed to move organizations from uncertainty to action.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {benefits.map((b) => (
          <div key={b.label} className="flex flex-col gap-5 pb-10 pt-10 pr-5">
            <b.Icon className="size-6 text-white" />
            <div className="flex flex-col gap-5">
              <p className="font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] text-white">
                {b.label}
              </p>
              <p className="font-sans text-[15px] leading-[21px] tracking-[-0.075px] text-white">
                {b.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
