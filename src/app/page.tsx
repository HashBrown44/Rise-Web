import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { FeatureStory } from "@/components/sections/feature-story";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { AboutUs } from "@/components/sections/about-us";
import { StatsBar } from "@/components/sections/stats-bar";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { SignupForm } from "@/components/sections/signup-form";
import { PaymentReturnBanner } from "@/components/checkout/payment-return-banner";

export default function Home() {
  return (
    <>
      <PaymentReturnBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureStory />
        <WhyChooseUs />
        <AboutUs />
        <StatsBar />
        <Pricing />
        <FAQ />
        <SignupForm />
      </main>
      <Footer />
    </>
  );
}
