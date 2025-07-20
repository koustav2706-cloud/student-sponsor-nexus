import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoSponsors } from "@/data/demoSponsors";
import { Building2, DollarSign, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const DemoSponsors = () => {
  return (
    <div className="min-h-screen bg-background bg-particles">
      <Navigation />
      <div className="absolute inset-0 bg-aurora-pattern opacity-10"></div>
      
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sponsors</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover leading companies ready to sponsor your next event
            </p>
          </div>

          {/* Sponsors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="glass-card p-6 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {sponsor.company_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{sponsor.industry}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {sponsor.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">{sponsor.budget_range}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="text-sm text-foreground">Focus: {sponsor.marketing_goals}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {sponsor.target_demographics.slice(0, 3).map((demo, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {demo}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="premium" size="sm" className="flex-1" asChild>
                    <Link to={`/chat/sponsor-${sponsor.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Connect
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="glass-effect">
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Card className="glass-card p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Connect with Sponsors?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join our platform to access AI-powered matching and connect with sponsors perfect for your events.
              </p>
              <Button variant="premium" size="lg" asChild>
                <Link to="/auth">Join SponsorSync</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSponsors;