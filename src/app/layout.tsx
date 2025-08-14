import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secure the Bag - Hustle Planner",
  description: "Privacy-first planner for exotic dancers to manage shifts, maximize income, and scale careers",
  keywords: ["planner", "income tracking", "dancer planner", "client management", "privacy-focused"],
  authors: [{ name: "Secure the Bag Team" }],
  openGraph: {
    title: "Secure the Bag - Hustle Planner",
    description: "Privacy-first planner for exotic dancers to manage shifts, maximize income, and scale careers",
    url: "https://hustle-planner.vercel.app",
    siteName: "Secure the Bag",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" }
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Example analytics integration (uncomment and configure for production) */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </script> */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
