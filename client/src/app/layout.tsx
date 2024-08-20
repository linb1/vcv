import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProviderWrapper from "./storeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Version Control Visualizer",
  description: "Created by Brian Lin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProviderWrapper>{children}</StoreProviderWrapper>
      </body>
    </html>
  );
}
