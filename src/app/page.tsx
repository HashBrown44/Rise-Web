import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Pricing } from "@/components/sections/pricing";
import { SignupForm } from "@/components/sections/signup-form";
import { FAQ } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <WhyChooseUs />
        <Pricing />
        <SignupForm />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
