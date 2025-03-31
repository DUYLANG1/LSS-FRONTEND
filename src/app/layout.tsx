import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import AuthProviders from "@/components/providers/AuthProviders";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

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
      <body
        suppressHydrationWarning
        className={`${geist.className} antialiased`}
      >
        <ErrorBoundary>
          <AuthProviders>
            <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </AuthProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
