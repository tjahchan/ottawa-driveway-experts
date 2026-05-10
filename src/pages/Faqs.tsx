import { useEffect } from "react";
import { Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCallButton } from "@/components/StickyCallButton";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What kind of guarantee do you offer your customers?",
    a: `"100 % Customer Satisfaction" has always been our motto from the beginning and we have proudly stood behind our guarantee. A happy customer is a repeat customer not to mention the best kind of advertising that we ask for! "What we get is what you get" which is nothing less than the best quality products on the market such as: "Black Mac" Liquid Asphalt Oil-Based Sealer. This product is available only to commercial contractors like ourselves. We have never tampered with our sealer in order to "stretch it out" as some fly-by-night companies have been known to do. Competitive Rates resulting in acquiring thousands of satisfied customers over the course of our 23 years of being in business. Speedy Service by Certified Seal Coaters to serve you better!`,
  },
  {
    q: "What kind of services do you offer?",
    a: `Our Services Include: High pressure spray sealing of driveways & commercial parking lots, Hot rubberized crack filling, Hot asphalt garage door ramps or lips, Hot asphalt curb-side entrance lips, Hot asphalt re-surfacing (overlay) on older driveways, Hot asphalt paving of new driveways and parking lots, Oil patch Cut-Outs, Pothole repairs (Hot or cold asphalt), Depression filling (Hot or cold asphalt), Liquid pour crack filling, Oil spot neutralizing, Gas leak repairs, Interlock repairs & installation (Since 2008 season)`,
  },
  {
    q: "Why should I have my driveway sealed?",
    a: `Applying oil-based sealer once a year will prolong the life of your driveway immensely, which is more important than the cosmetic aspect! Asphalt is a porous material. It is very important to protect your asphalt driveway from the penetration of water, oil, gas or other vehicle fluid spills and from overall wear and tear damage caused by our harsh weather conditions. Neglecting to apply an oil-based sealer on a new driveway will allow water to penetrate the asphalt. When the ground freezes in winter, the water-saturated soil under your driveway will heave in areas where your asphalt may be thinner and thus weaker and more susceptible to cracking. An even more important reason is that a well-maintained driveway increases the resale value of your property!`,
  },
  {
    q: "My driveway has just been paved, how long should I wait to have it sealed?",
    a: `You should have it sealed within the first year of it being paved. After three months, the chemicals in the asphalt start to break down with the sun's UV rays. Without sealer, your driveway is vulnerable to various means of damage.`,
  },
  {
    q: "How long does sealer take to dry?",
    a: `We recommend that you wait 24- 48 hours before driving on it. If you wait the recommended time we can guarantee it against tracking or staying sticky.`,
  },
  {
    q: "Once the sealer has dried, are there any final steps before I drive on it?",
    a: `If the temperature is consistently above 20 degrees Celsius and if it has not rained anytime after the driveway has been sealed, we recommend wetting it down with cold water for approximately 10 to 20 minutes. This procedure should be done on the following morning prior to driving on it. The reason for doing this is to cool down the driveway which tends to hold the sun's heat. By doing so, you can help speed up the curing process. ** We refer to this as the "Hot / Cold Effect", utilizing Mother Nature's "hot sun / cold water" to guarantee the best results for you. **`,
  },
  {
    q: "If the weather is forecasting rain should I still seal my driveway?",
    a: `As long as the pavement is dry at the time of application, it will be fine. Since our product "Black Mac" is oil-based and is a derivative composition of Liquid Asphalt, the same material used in the mixing of asphalt, it is designed to penetrate and blend into the pavement immediately. Therefore, it can rain within seconds after it has been sprayed with absolutely no harmful affect, because oil and water do not mix. As a matter of fact it can be most beneficial. (**Review Question Above **)`,
  },
  {
    q: "How often should I seal my driveway?",
    a: `We recommend once a year to extend the life of your driveway. If you miss a year don't fret, just make sure you get it done as soon as possible.`,
  },
  {
    q: "Why do cracks form in my driveway and should I have them fixed?",
    a: `Cracks in asphalt are your worst enemy. Water gets into these cracks and erodes the granular base beneath your asphalt. It will freeze in the winter and cause it to buckle. We provide a base and fill the cracks with special filler to ensure no more water will penetrate the surface.`,
  },
  {
    q: "Why not apply sealer myself and roll it on?",
    a: `Chevrier Group - OttawaDrivewayExperts.com utilizes "Black Mac" oil-based sealer EXCLUSIVELY! It is superior to any and all consumer-grade products available to the consumer. "Black Mac" is a derivative composition of Liquid Asphalt and is designed to penetrate into and seal your driveway properly. Black Mac" oil-based sealer won't streak, chip, layer, crack or peel as most acrylic (water-based) sealers do. Our sealer is applied with high pressure spray, resulting in deep penetration, not just a surface paint job, which is what you get when you roll it on. By the time you calculate the costs of doing it yourself, not to mention the time involved, our question to you is: "Isn't your money better spent by getting us at OttawaDrivewayExperts to seal your driveway professionally?" Black Mac" oil-based sealer is not available to you, the consumer.`,
  },
  {
    q: "Is it true that oil based sealers track or stay sticky like tar?",
    a: `No, this is not true. "Black Mac" oil-based sealer is guaranteed not to track as long as the guidelines are properly followed in regards to drying time.`,
  },
  {
    q: "If a neighbor and I want to get our driveway sealed is there a discount?",
    a: `Yes, we have group discounts available when there are three or more driveways sealed or paved on the same street, on the same day. Each customer is entitled to a discount of up to a maximum of 25%, depending on the number of driveways participating in the group. However, advance arrangements are necessary in order for discounts to apply! The "group organizer" will be entitled to receive an additional discount for his or her efforts for organizing the group, including obtaining each customer's contact information. Since each driveway is unique and usually requires different needs, each customer will receive their own estimate and/or invoice indicating their specific details of the scope of work required. We also have a shared driveway discount! Note: This discount cannot be combined with any other promotional offer available!`,
  },
  {
    q: "What if I have oil spots on my driveway?",
    a: `Oil will eat away the asphalt causing crumbling and eventually a pothole. To prevent further damage, we use a special, commercial grade, oil spot primer to neutralize the oil spots before applying the sealer thereby preventing the spots from reappearing and also making sure that the sealer bonds properly to the driveway. When there are fewer than 10 spots, we will offer this service at no charge. However there is a nominal fee when there are more. This service also comes with a guarantee not to reappear!`,
  },
  {
    q: "What if I have oil patches on my driveway?",
    a: `Oil patches cause even more serious and rapid deterioration effects than do oil spots when it comes to causing crumbling and soon a pothole. Any large concentration of oil tends to soften the asphalt, thus breaking down its chemical bonding capabilities and durability. We can use an oil spot primer to neutralize the patch, however it has been our experience that doing so is only a waste of time and money. Our recommendation is for you to have us cut out the oil patch and replace that portion of asphalt with new.`,
  },
  {
    q: "How do you prepare the driveway to be sealed?",
    a: `We air-sweep with a high powered backpack gas blower as well as broom sweep all debris and clean out all the cracks. We also remove any weeds growing along the edges and at the bottom of the driveway. Grass overgrowth can severely damage the edges of your asphalt driveway or parking lot. We have special equipment that we utilize to remove or cleanup the grass overgrowth. we call this service the "Icing on the Cake". It is a dirty job but the final result is extraordinarily aesthetically pleasing, clean cut edges of your freshly sealed asphalt. By having Chevrier Group - OttawaDrivewayExperts.com perform this special service your asphalt is sealed right up to the true edge of your asphalt.`,
  },
  {
    q: "What is the difference between an acrylic sealer and oil based sealer?",
    a: `We do a lot of parking lots with our product, which is an oil-based sealer. You never see an acrylic sealer on a commercial application. This is because acrylic sealer doesn't have the same wearability as does an oil-based sealer. If you only want a paint job done to your driveway, use acrylic. But if you are seeking to protect and properly seal your driveway, use our services, because we at OttawaDrivewayExperts use "Black Mac" oil-based sealer EXCLUSIVELY!`,
  },
  {
    q: "You do paving, landscaping and interlock. Do you have specialized staff for each?",
    a: `Yes we do! We have separate specialty crews for our paving, landscaping and interlock divisions.`,
  },
  {
    q: "What should we do in preparation for a landscaping project?",
    a: `It is good policy to advise your neighbors that there may be some noise and dust while the work is taking place. This will allow them to close any windows or remove clothing from the clothesline, etc. You should also ensure that all gates are accessible.`,
  },
  {
    q: "Am I responsible for locating any gas or hydro lines in the ground?",
    a: `No, absolutely not! Our professional staff are 100% responsible for ensuring everything is done properly and legally.`,
  },
  {
    q: "What is the benefit of sealing my driveway annually?",
    a: `We strongly advise annual seal coating for your consideration. This recommendation is based on several key benefits: 1. Annual seal coating prompts the timely repair of any minor surface imperfections. 2. It enhances the aesthetic appeal and market value of your property. 3. As a valued client, you are eligible for our customer loyalty discount, potentially covering up to 10% of the cost, effectively offsetting taxes. 4. Regular seal coating provides long-term cost savings; neglecting annual maintenance can lead to more extensive and costly repairs within a few years.`,
  },
];

const Faqs = () => {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = "https://ottawadrivewayexperts.com/faqs";
    return () => {
      link!.href = "https://ottawadrivewayexperts.com/";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-14 md:pt-44 md:pb-20 bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_110%,hsl(var(--accent)/0.15),transparent)] pointer-events-none" />
          <div className="container max-w-3xl relative text-center">
            <Reveal>
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">
                Got Questions?
              </p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground mb-5 leading-[1.1]">
                Frequently Asked<br className="hidden sm:block" /> Questions
              </h1>
              <p className="text-primary-foreground/65 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                Everything you need to know about driveway sealing, paving, and our services across Ottawa.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Accordion */}
        <section className="py-14 md:py-24 bg-background">
          <div className="container max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={Math.min(i * 25, 250)}>
                  <AccordionItem
                    value={`item-${i}`}
                    className="border border-border bg-card rounded-2xl px-5 shadow-card data-[state=open]:border-accent/30 data-[state=open]:shadow-elegant transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-foreground hover:no-underline hover:text-accent py-5 gap-4 [&[data-state=open]]:text-accent">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5 pt-0">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </Reveal>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 bg-secondary">
          <div className="container max-w-xl text-center">
            <Reveal>
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">
                Ready to Get Started?
              </p>
              <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
                Still have questions?
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Call us or request a free quote — we respond within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:+16138641485">
                  <Button variant="gold" size="lg" className="gap-2 w-full sm:w-auto">
                    <Phone className="w-4 h-4" />
                    (613) 864-1485
                  </Button>
                </a>
                <a href="/#quote">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Get a Free Quote
                  </Button>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCallButton />
    </div>
  );
};

export default Faqs;
