import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Header from "./_components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "INTELLIFORM · Form Builder",
  description: "Build beautiful forms in seconds. Smart auto-fill, analytics, and one-click sharing.",
};

const RootLayout = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${bricolage.variable} ${dmSans.variable} font-sans antialiased`}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
