import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SajhaCart — Buy Together, Save Together",
  description:
    "Join your neighbourhood to discover better group prices on everyday essentials.",
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
