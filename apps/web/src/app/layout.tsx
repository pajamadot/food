import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What Should I Eat? | Food Randomizer",
  description:
    "Can't decide what to eat? Pick a spot on the map, find nearby restaurants, and spin the wheel to decide!",
  metadataBase: new URL("https://food.pajamadot.com"),
  openGraph: {
    title: "What Should I Eat?",
    description: "Spin the wheel and let fate decide your next meal!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
