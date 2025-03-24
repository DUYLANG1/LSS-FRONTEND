import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/providers/AuthProvider";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "SkillSwap",
  description: "Platform for trading skills and services without money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
