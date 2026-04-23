import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Services } from "@/components/Services";
import { BeforeAfter } from "@/components/BeforeAfter";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { Process } from "@/components/Process";
import { QuoteSection } from "@/components/QuoteSection";
import { Footer } from "@/components/Footer";
import { StickyCallButton } from "@/components/StickyCallButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <Services />
        <BeforeAfter />
        <WhyUs />
        <Testimonials />
        <Process />
        <QuoteSection />
      </main>
      <Footer />
      <StickyCallButton />
    </div>
  );
};

export default Index;
