import type { Metadata } from "next";
import { Ubuntu} from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../app/ui/buttons.module.css";

const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "OwlReads",
  description: "Read. Share. Discover.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ubuntu.className}>
      <link rel="shortcut icon" href="../public/OwlReadsLogo.png" />
      <body>
        <Navbar />
        <div className="pt-20"></div>
        <main className="w-full">{children}</main>
      </body>
      <Footer />
    </html>
  );
}
