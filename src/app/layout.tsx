import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PitWall Fantasy | AI F1 Fantasy Optimizer",
  description:
    "AI-powered F1 Fantasy optimizer with explainable recommendations for serious fantasy players.",
  metadataBase: new URL("https://pitwallf1fantasy.com"),
  openGraph: {
    title: "PitWall Fantasy",
    description:
      "Stop guessing. Start gaining points with explainable F1 Fantasy recommendations.",
    url: "https://pitwallf1fantasy.com",
    siteName: "PitWall Fantasy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
