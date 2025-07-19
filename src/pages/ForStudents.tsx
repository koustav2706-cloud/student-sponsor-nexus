import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Search, Trophy, Star } from "lucide-react";

const ForStudents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Find Perfect{" "}
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Sponsors
              </span>{" "}
              for Your Events
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              Connect your student organization with sponsors who align with your values and goals.
            </p>
            <Button variant="accent" size="xl">
              Get Started Free
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Features for Students */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works for Student Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-card transition-all duration-300">
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground">Showcase your events, audience, and impact</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-card transition-all duration-300">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                <p className="text-muted-foreground">Our AI finds sponsors perfect for your events</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-card transition-all duration-300">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Build Partnerships</h3>
                <p className="text-muted-foreground">Create lasting relationships with top brands</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForStudents;