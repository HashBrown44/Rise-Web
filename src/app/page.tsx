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
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo";
import { homePageGraph } from "@/lib/structured-data";

const HOME_SEO = {
  path: "/",
  title: "Rise Websites — Websites Built To Grow Your Business",
  description:
    "Custom, high-converting websites for local businesses. Launch in 2–4 weeks with mobile-first design, an SEO foundation and full ownership from $799.",
};

export const metadata = pageMetadata({ ...HOME_SEO, absoluteTitle: true });

export default function Home() {
  return (
    <>
      <JsonLd data={homePageGraph(HOME_SEO)} />
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
