import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proline Ops",
  description: "Production and downtime tracking for manufacturers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}