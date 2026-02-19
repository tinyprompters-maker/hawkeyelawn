import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HawkeyeLawn — Lawn Care at Iowa Speed",
  description:
    "On-demand lawn mowing in Cedar Rapids, Iowa. Book in 60 seconds. Pay with card or crypto. No account required.",
  keywords: "lawn care, cedar rapids, iowa, mowing, on-demand, same day",
  openGraph: {
    title: "HawkeyeLawn — Get Mowed Today",
    description: "Lawn care at Iowa Speed. Book in 60 seconds.",
    url: "https://hawkeyelawn.com",
    siteName: "HawkeyeLawn",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
