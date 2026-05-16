import type { Metadata } from "next";
import { Inter, JetBrains_Mono, VT323 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-sans-next",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono-next",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "BisnisMulai - Platform Bimbingan Bisnis",
  description: "Platform all-in-one yang membimbing calon pengusaha Indonesia membangun bisnis dari nol secara sistematis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetBrainsMono.variable} ${vt323.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="bisnisMulai-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
