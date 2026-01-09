import type { Metadata } from "next";
import { Economica, Geist, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";


const economica = Economica({
  weight: ["400", "700"],
  variable: "--font-economica",
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
    <html lang="en">
      <body
        className={`font-hanken-grotesk antialiased ${economica.variable} ${hankenGrotesk.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
