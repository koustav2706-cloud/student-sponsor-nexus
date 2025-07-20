import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, TrendingUp, Users, BarChart3 } from "lucide-react";

const ForSponsors = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
          <div className="absolute inset-0 bg-mesh-pattern opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
            <h1 className="text-5xl md:text-7xl font-bold text-overlay mb-8">
              Discover High-Impact{" "}
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Student Events
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-overlay max-w-4xl mx-auto mb-10 leading-relaxed">
              Reach engaged student audiences through strategic event sponsorships with measurable ROI.
            </p>
            <Button variant="accent" size="xxl" asChild className="relative z-30">
              <Link to="/auth">
                Start Sponsoring
                <Target className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features for Sponsors */}
        <section className="py-24 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-overlay">
              Why Sponsors Choose SponsorSync
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <Card className="p-8 text-center hover-lift neumorphic transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-overlay">Targeted Reach</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Connect with your exact demographic through high-engagement student events
                </p>
              </Card>
              <Card className="p-8 text-center hover-lift neumorphic transition-all duration-300 group md:-translate-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-overlay">Measurable ROI</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Track engagement and measure sponsorship performance with detailed analytics
                </p>
              </Card>
              <Card className="p-8 text-center hover-lift neumorphic transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-overlay">Analytics Dashboard</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Real-time insights into campaign performance and audience engagement
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForSponsors;