import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";

import { Poppins } from "next/font/google";
import AppSidebar from "@/components/layout/sidebar";
import AppBottomBar from "@/components/layout/bottom-bar";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Edunote | Social Education & Note Platform",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${poppins.className} min-h-screen bg-background antialiased relative`}
        >
          <Toaster position="bottom-right" duration={2000} richColors />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppSidebar />
            <main className="relative left-[280px] top-[80px]">{children}</main>
            <AppBottomBar />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
