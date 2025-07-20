import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { RecommendationsDashboard } from "@/components/matchmaking/RecommendationsDashboard";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        {user && (
          <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <RecommendationsDashboard />
            </div>
          </section>
        )}
        <FeaturesSection />
        <TestimonialsSection />
      </main>
    </div>
  );
};

export default Index;
