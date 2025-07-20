import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Search, Trophy, Star } from "lucide-react";

const ForStudents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
          <div className="absolute inset-0 bg-mesh-pattern opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="relative z-10 text-5xl md:text-7xl font-bold text-overlay mb-8">
              Find Perfect{" "}
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Sponsors
              </span>{" "}
              for Your Events
            </h1>
            <p className="relative z-10 text-xl md:text-2xl text-overlay mb-10 max-w-4xl mx-auto leading-relaxed">
              Connect your student organization with sponsors who align with your values and goals.
            </p>
            <Button variant="accent" size="xxl" asChild className="relative z-10">
              <Link to="/auth">
                Get Started Free
                <Users className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features for Students */}
        <section className="py-24 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-overlay">
              How It Works for Student Organizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <Card className="p-8 text-center hover-lift neumorphic transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-overlay">Create Your Profile</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Showcase your events, audience, and impact with detailed analytics
                </p>
              </Card>
              <Card className="p-8 text-center hover-lift neumorphic transition-all duration-300 group md:-translate-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-overlay">Get Matched</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our AI finds sponsors perfect for your events with 95% accuracy
                </p>
              </Card>
              <Card className="p-8 text-center hover-lift neumorphic transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-overlay">Build Partnerships</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Create lasting relationships with top brands and secure funding
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForStudents;