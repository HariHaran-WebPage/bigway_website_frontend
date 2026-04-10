import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ClientWrapper from "./components/Clientwrapper";
import FloatingWidgets from "./components/Floatingwidgets"; // ← add this

export const metadata: Metadata = {
  title: "BIGWAY Real Estate",
  description: "Premium Real Estate Solutions in Coimbatore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientWrapper>
          <Navbar />
          {children}
          <Footer />
          <FloatingWidgets /> {/* ← add this */}
        </ClientWrapper>
      </body>
    </html>
  );
}