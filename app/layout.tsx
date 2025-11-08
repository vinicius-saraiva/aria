import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sailing Weather AI Assistant",
  description: "AI-powered sailing weather interpretation tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
