import React from "react";
import Header from "./_components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "INTELLIFORM",
  description: "AI-Form builder",
};

const RootLayout = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <head />
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
