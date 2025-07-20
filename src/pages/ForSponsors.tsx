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
        <section className="bg-gradient-hero py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Discover High-Impact{" "}
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Student Events
              </span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              Reach engaged student audiences through strategic event sponsorships with measurable ROI.
            </p>
            <Button variant="accent" size="xl" asChild>
              <Link to="/auth">
                Start Sponsoring
                <Target className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features for Sponsors */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Sponsors Choose SponsorSync</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-card transition-all duration-300">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Targeted Reach</h3>
                <p className="text-muted-foreground">Connect with your exact demographic through student events</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-card transition-all duration-300">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Measurable ROI</h3>
                <p className="text-muted-foreground">Track engagement and measure sponsorship performance</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-card transition-all duration-300">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">Real-time insights into campaign performance</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForSponsors;