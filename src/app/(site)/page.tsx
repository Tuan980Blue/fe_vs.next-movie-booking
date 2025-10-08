import HeroSection from "@/app/(site)/_components/HeroSection";
import Promotions from "@/app/(site)/_components/Promotions";
import MoviesShowcase from "@/app/(site)/_components/MoviesShowcase";

export default function HomePage() {
  return (
      <div className="min-h-screen">
          <HeroSection />
          <MoviesShowcase/>
          <Promotions />
      </div>
  );
}


