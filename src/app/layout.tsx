import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 GridIQ | F1 Fantasy Strategy Optimizer",
  description:
    "Explainable F1 Fantasy strategy optimizer for SAFE, BALANCED and AGGRESSIVE plans.",
  metadataBase: new URL("https://pitwallf1fantasy.com"),
  openGraph: {
    title: "F1 GridIQ",
    description:
      "Explainable F1 Fantasy strategy optimizer for SAFE, BALANCED and AGGRESSIVE plans.",
    url: "https://pitwallf1fantasy.com",
    siteName: "F1 GridIQ",
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
