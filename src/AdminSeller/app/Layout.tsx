import type React from "react";
import { Suspense } from "react";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen font-sans">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
