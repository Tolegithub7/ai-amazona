import Header from "./Header";
import Footer from "./Footer";
import type { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">{children}</main>
      <Footer />
    </div>
  );
} 