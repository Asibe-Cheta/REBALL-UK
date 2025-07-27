import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Permanent_Marker, Poppins } from "next/font/google";
import SessionProvider from "@/components/auth/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const inter = Inter({ subsets: ["latin"] });

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "REBALL UK",
  description: "The ultimate football community platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${permanentMarker.variable} ${poppins.variable}`}>
        <ErrorBoundary>
          <SessionProvider>
            <ToastProvider>
              {children}
              <PerformanceMonitor />
            </ToastProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
