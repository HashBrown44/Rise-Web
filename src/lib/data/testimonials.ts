export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Maria Chen",
    role: "Owner, Harvest & Table Bistro",
    quote:
      "Rise Websites completely transformed how customers find us. Online orders nearly doubled in the first two months and the site still feels fresh a year later.",
    rating: 5,
    initials: "MC",
  },
  {
    name: "Daniel Ortiz",
    role: "Founder, Greenline Landscaping Co.",
    quote:
      "I finally own my website outright and it actually generates leads instead of just sitting there. The turnaround was faster than any agency I've used before.",
    rating: 5,
    initials: "DO",
  },
  {
    name: "Priya Kapoor",
    role: "Managing Partner, Northline Legal Group",
    quote:
      "The design instantly makes us look like the premium firm we are. Consultation requests are up significantly and clients comment on the site unprompted.",
    rating: 5,
    initials: "PK",
  },
  {
    name: "Jonah Reyes",
    role: "Owner, Ironclad Auto Detailing",
    quote:
      "Booking went from phone-tag to instant. Rise handled everything and the ongoing support means I never have to think about the tech side.",
    rating: 5,
    initials: "JR",
  },
];
