import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kita App",
  description: "Staff-first daily workflow for Swiss Kitas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
