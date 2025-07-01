import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/store/providers";
import { Toaster } from "@/components/ui/sonner";
import { LangAttribute } from "@/components/lang-attribute";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Personalized Dashboard",
  description:
    "Your personalized content dashboard with news, recommendations, and social feeds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <LangAttribute />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
