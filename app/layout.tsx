import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, Economica, Geist, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";


const cinzel = Cinzel_Decorative({
  weight: ["400", "700"],
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  weight: ["400", "700"],
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Drivaro - Premium Car Rental Service.",
  description: "Experience luxury and performance with Drivaro's exclusive car rental options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en" suppressHydrationWarning>

      <body
        className={`font-hanken-grotesk  antialiased ${cinzel.variable} ${hankenGrotesk.variable}`}
      >

        <ThemeProvider
          attribute="class"

          enableSystem={false}
          disableTransitionOnChange

        >
          {children}
        </ThemeProvider>        <Toaster position="top-right" closeButton expand richColors />

      </body>
    </html>
  );
}
