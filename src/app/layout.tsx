import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Simulation",
  description: "Blackhole simulation, created via @sauroww(X) @saur0w(GitHub)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
