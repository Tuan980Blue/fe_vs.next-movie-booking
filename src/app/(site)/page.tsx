import HeroSection from "@/app/(site)/_components/HeroSection";
import Promotions from "@/app/(site)/_components/Promotions";
import MoviesShowcase from "@/app/(site)/_components/MoviesShowcase";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.home;

export default function HomePage() {
  return (
      <div className="min-h-screen">
          <HeroSection />
          <MoviesShowcase/>
          <Promotions />
      </div>
  );
}


