export const site = {
  name: "Edencorp",
  url: "https://edencorp.org",
  email: "founder@edencorp.org",
  description:
    "Edencorp is a bespoke AI and software engineering partner. We study how your business runs, then build the AI workforces, copilots, intelligence and custom software it needs.",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.com/sam-adrian-lilugj/edencorp-fit-call",
} as const;

export function bookingLink() {
  return site.bookingUrl;
}
