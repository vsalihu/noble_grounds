import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { siteConfig } from "@/data/site";
import { createMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  ...createMetadata({
    title: "Premium Grass Mowing in Leverington and Wisbech",
    description:
      "Noble Grounds provides premium grass mowing, lawn mowing and property presentation for homeowners, landlords, businesses and estate agents around Leverington and Wisbech.",
    path: "/",
  }),
  title: {
    default: "Noble Grounds | Premium Grass Mowing in Leverington, Wisbech",
    template: "%s | Noble Grounds",
  },
  applicationName: "Noble Grounds",
  authors: [{ name: "Noble Grounds" }],
  creator: "Noble Grounds",
  publisher: "Noble Grounds",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
