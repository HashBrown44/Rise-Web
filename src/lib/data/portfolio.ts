export type PortfolioCategory = "All" | "Restaurants" | "Local Services" | "E-Commerce" | "Professional";

export type PortfolioProject = {
  name: string;
  category: PortfolioCategory;
  result: string;
  gradient: string;
  description: string;
};

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  "All",
  "Restaurants",
  "Local Services",
  "E-Commerce",
  "Professional",
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    name: "Harvest & Table Bistro",
    category: "Restaurants",
    result: "+142% online orders",
    gradient: "from-primary/40 via-secondary/30 to-transparent",
    description: "A warm, modern redesign for a farm-to-table restaurant with online ordering.",
  },
  {
    name: "Greenline Landscaping Co.",
    category: "Local Services",
    result: "+96 leads / quarter",
    gradient: "from-highlight/40 via-primary/20 to-transparent",
    description: "Lead-focused site with instant quote requests for a landscaping crew.",
  },
  {
    name: "Cantina Del Sol",
    category: "Restaurants",
    result: "+210% reservations",
    gradient: "from-secondary/40 via-highlight/20 to-transparent",
    description: "Coastal-inspired visuals paired with a frictionless reservation flow.",
  },
  {
    name: "Northline Legal Group",
    category: "Professional",
    result: "+64% consult requests",
    gradient: "from-primary/30 via-highlight/30 to-transparent",
    description: "Authority-building design for a law firm targeting high-value clients.",
  },
  {
    name: "Solstice Home Goods",
    category: "E-Commerce",
    result: "+178% conversion rate",
    gradient: "from-secondary/30 via-primary/30 to-transparent",
    description: "A boutique storefront with curated collections and a fast checkout.",
  },
  {
    name: "Ironclad Auto Detailing",
    category: "Local Services",
    result: "+88% booking rate",
    gradient: "from-highlight/30 via-secondary/20 to-transparent",
    description: "Bold, high-contrast design with instant online booking integration.",
  },
];
