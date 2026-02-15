import type { Metadata } from "next";
import { Ubuntu} from "next/font/google";
import "./globals.css";
import "@/components/ui/buttons.module.css";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/footer";

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
      <Navbar />
      <body>
        <main className="w-full">{children}</main>
      </body>
      <Footer />
    </html>
  );
}
