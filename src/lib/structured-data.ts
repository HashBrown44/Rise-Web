import type {
  BreadcrumbList,
  FAQPage,
  Graph,
  Organization,
  Person,
  Service,
  WebPage,
  WebSite,
} from "schema-dts";
import { FAQS } from "@/lib/data/faq";
import { FOUNDERS } from "@/lib/data/founders";
import { PRICING_PLANS } from "@/lib/data/pricing";
import { SITE } from "@/lib/data/site";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

// schema-dts types are generated from the schema.org vocabulary, so any
// misspelled property or wrong value type here fails `tsc`.

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function organization(): Organization {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE_URL,
    logo: absoluteUrl("/rise-logo-mark.png"),
    email: SITE.email,
    telephone: SITE.phone,
    slogan: SITE.tagline,
    founder: FOUNDERS.map(
      (f): Person => ({ "@type": "Person", name: f.name, jobTitle: f.title, image: absoluteUrl(f.photo) }),
    ),
  };
}

function website(): WebSite {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

type Crumb = { name: string; path: string };

function breadcrumbs(trail: Crumb[]): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

function webPage(path: string, name: string, description: string): WebPage {
  const url = absoluteUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    inLanguage: "en-US",
  };
}

function faqPage(path: string): FAQPage {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// Amounts mirror PLAN_AMOUNTS in src/app/api/checkout/stripe/route.ts.
const PLAN_OFFERS = {
  "full-ownership": [{ price: 799, label: "One-time payment" }],
  "growth-plan": [
    { price: 500, label: "Due at checkout" },
    { price: 100, label: "Per month, starting one month after checkout", monthly: true },
  ],
} as const;

/**
 * Rise sells a service, not a physical product, so pricing is expressed as a
 * Service with Offers (Google's Product rich results are for goods).
 */
function webDesignService(): Service {
  return {
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    name: "Custom website design and development",
    serviceType: "Web design",
    description: "Custom, mobile-responsive websites with an SEO foundation for local businesses.",
    provider: { "@id": ORG_ID },
    offers: PRICING_PLANS.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.description,
      url: absoluteUrl("/#pricing"),
      priceCurrency: "USD",
      price: PLAN_OFFERS[plan.id][0].price,
      priceSpecification: PLAN_OFFERS[plan.id].map((part) => ({
        "@type": "UnitPriceSpecification",
        name: part.label,
        price: part.price,
        priceCurrency: "USD",
        ...("monthly" in part ? { billingDuration: "P1M", unitText: "MONTH" } : {}),
      })),
    })),
  };
}

/** JSON-LD graph for the home page. */
export function homePageGraph(meta: { title: string; description: string }): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(),
      website(),
      webPage("/", meta.title, meta.description),
      breadcrumbs([{ name: "Home", path: "/" }]),
      webDesignService(),
      faqPage("/"),
    ],
  };
}
