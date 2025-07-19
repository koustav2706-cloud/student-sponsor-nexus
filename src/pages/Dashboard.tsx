import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Manage your sponsorships, track performance, and grow your partnerships.
            </p>
            <Card className="p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                Your personalized dashboard is being built with powerful analytics and management tools.
              </p>
              <Button variant="hero" className="w-full">
                Join Waitlist
              </Button>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;