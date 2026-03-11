import type { Metadata } from "next";

import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import ProblemSection from "@/components/sections/ProblemSection";
import ServicesSection from "@/components/sections/ServicesSection";
import QuoteCalculator from "@/components/home/QuoteCalculator";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
    title: "GroundTruth — Reality, confirmed before you send the money.",
};

export default function HomePage() {
    return (
        <div className="pt-16">
            <HeroSection />
            {/*<StatsBar />*/}
            <ProblemSection />
            <ServicesSection />
            <QuoteCalculator />
            <HowItWorksSection />
            <TestimonialsSection />
            <CtaSection />
        </div>
    );
}