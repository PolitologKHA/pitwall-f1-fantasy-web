import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 DecisionIQ | Fantasy Decision Engine",
  description:
    "Fantasy Decision Engine for explainable F1 Fantasy recommendations.",
  metadataBase: new URL("https://pitwallf1fantasy.com"),
  openGraph: {
    title: "F1 DecisionIQ",
    description:
      "Fantasy Decision Engine for explainable F1 Fantasy recommendations.",
    url: "https://pitwallf1fantasy.com",
    siteName: "F1 DecisionIQ",
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
