import {
  Features,
  type FeatureSlide,
  BoreasMark,
  EarthSpinIcon,
  ChartDrawIcon,
  AccountPulseIcon,
} from "@alduin/design-system";
import { GlobalNav } from "@/components/GlobalNav";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CenteredCta } from "@/components/CenteredCta";
import { ProductHero } from "@/components/pdp/ProductHero";
import { ProductBenefits, type Benefit } from "@/components/pdp/ProductBenefits";
import { ProductPricing } from "@/components/pdp/ProductPricing";

const benefits: Benefit[] = [
  {
    Icon: EarthSpinIcon,
    label: "GLOBAL TRAVELER VISIBILITY",
    description:
      "Track every traveler's live location across flights, hotels, and ground transit in a single unified view.",
    animationMs: 2200,
  },
  {
    Icon: ChartDrawIcon,
    label: "PROACTIVE RISK SCORING",
    description:
      "Automatically score itineraries against live geopolitical and weather threats before travelers are exposed.",
    animationMs: 850,
  },
  {
    Icon: AccountPulseIcon,
    label: "RAPID DUTY-OF-CARE RESPONSE",
    description:
      "Coordinate alerts, rebooking, and evacuation support the moment conditions change.",
    animationMs: 680,
  },
];

const slides: FeatureSlide[] = [
  {
    id: "unified-traveler-risk-map",
    heading: "UNIFIED TRAVELER RISK MAP",
    subheading: "From scattered itineraries to one live picture.",
    body: (
      <>
        <strong className="font-bold">Live Traveler Exposure Mapping</strong>{" "}
        Instantly overlay every traveler's flight status, hotel location,
        and ground movement against real-time risk layers—eliminating the
        need to manually cross-reference disparate travel and intelligence
        feeds.
      </>
    ),
    imageSrc: "/products/boreas.png",
    imageAlt: "Boreas unified traveler risk map",
  },
  {
    id: "proactive-itinerary-screening",
    heading: "PROACTIVE ITINERARY SCREENING",
    subheading: "From reactive lookups to automatic screening.",
    body: "Go beyond manual risk checks. Boreas automatically screens every booked itinerary against evolving geopolitical, health, and weather risk feeds, flagging exposure before travel begins so duty-of-care teams can act early.",
    imageSrc: "/products/boreas.png",
    imageAlt: "Boreas proactive itinerary screening",
  },
  {
    id: "faster-duty-of-care-coordination",
    heading: "FASTER DUTY-OF-CARE COORDINATION",
    subheading: "From delayed outreach to immediate action.",
    body: "When conditions change, Boreas generates live traveler rosters and shareable status dashboards that sync across security, HR, and executive stakeholders—cutting response time when travelers need help fastest.",
    imageSrc: "/products/boreas.png",
    imageAlt: "Boreas duty-of-care coordination",
  },
];

export default function BoreasPage() {
  return (
    <main className="min-h-screen bg-neutral-900">
      <GlobalNav />
      <div className="pt-[116px]">
        <ProductHero
          name="BOREAS"
          description="A corporate travel intelligence tool that tracks live aircraft movement, hotel locations, and traveler exposure to geopolitical and weather risk events."
          Mark={BoreasMark}
        />
        <div className="flex flex-col px-[70px] min-[1441px]:px-[150px]">
          <ScrollReveal>
            <div className="mt-[60px]">
              <ProductBenefits
                headline="Corporate travel risk, visualized in real time"
                description="Unlike static travel itineraries, Boreas fuses live flight tracking, hotel geolocation, and evolving risk feeds—weather, geopolitical, and civil unrest—into a single traveler exposure map."
                benefits={benefits}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <Features slides={slides} className="mt-[60px]" />
          </ScrollReveal>
          <ScrollReveal>
            <div className="mt-[100px] grid grid-cols-2 gap-5">
              <ProductPricing
                name="BOREAS"
                tagline="Predictable budgeting with zero seat-licensing friction."
                price="$450"
                included={[
                  "All inclusive software access",
                  "No Variable Overage Fees",
                  "Core API Feeds Included",
                ]}
              />
              <CenteredCta className="flex min-h-[340px] flex-col items-center justify-between rounded-[40px] border border-white/10 bg-neutral-850/50 px-20 py-10 text-center backdrop-blur-xl" />
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <Footer />
        </ScrollReveal>
      </div>
    </main>
  );
}
