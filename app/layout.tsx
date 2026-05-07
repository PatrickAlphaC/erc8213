import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ERC-8213 — Wallet Signature & Calldata Digest Display",
  description:
    "An open standard for cryptographic fingerprints in wallet UIs. Standardizes the EIP-712 Digest, Domain Hash, Message Hash, and Calldata Digest so signers can independently verify what they're signing.",
  openGraph: {
    title: "ERC-8213 — Cryptographic Fingerprints for Wallets",
    description:
      "The standard for displaying EIP-712 and calldata digests so signers can verify what they sign.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${instrument.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
