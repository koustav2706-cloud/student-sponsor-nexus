import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, Search, Trophy, Star, Building2, DollarSign, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { demoSponsors } from "@/data/demoSponsors";

const ForStudents = () => {
  return (
    <div className="min-h-screen bg-background bg-particles">
      <Navigation />
      <div className="absolute inset-0 bg-aurora-pattern opacity-15"></div>
      
      <main className="relative pt-16">
        {/* Enhanced Hero Section */}
        <section className="py-20 overflow-hidden">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-liquid-float"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-r from-success/20 to-primary/20 rounded-full blur-3xl animate-liquid-float" style={{ animationDelay: '3s' }}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 mb-8 border border-primary/30">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI-Powered Sponsor Matching
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
              Find Perfect{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-success bg-clip-text text-transparent animate-glow-pulse">
                Sponsors
              </span>{" "}
              for Your Events
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed">
              Connect your student organization with sponsors who align with your values and goals through intelligent AI matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button variant="premium" size="xl" className="group" asChild>
                <Link to="/auth">
                  Get Started Free
                  <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="glass-effect group">
                Watch Demo
                <TrendingUp className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works for <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Student Organizations</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our intelligent platform simplifies the sponsorship process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Search className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Create Your Profile</h3>
                <p className="text-muted-foreground leading-relaxed">Showcase your events, audience demographics, and organizational impact with detailed analytics</p>
              </Card>
              
              <Card className="glass-card p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-success rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Get AI Matches</h3>
                <p className="text-muted-foreground leading-relaxed">Our advanced AI algorithm finds sponsors perfectly aligned with your events and values</p>
              </Card>
              
              <Card className="glass-card p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-success to-primary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Build Partnerships</h3>
                <p className="text-muted-foreground leading-relaxed">Create lasting relationships with top brands through our integrated communication tools</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Sponsors Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sponsors</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover leading companies ready to sponsor your next event
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {demoSponsors.map((sponsor, index) => (
                <Card key={sponsor.id} className="glass-card p-6 group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {sponsor.company_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{sponsor.industry}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {sponsor.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">{sponsor.budget_range}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" />
                      <span className="text-sm text-foreground line-clamp-1">Focus: {sponsor.marketing_goals}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {sponsor.target_demographics.slice(0, 3).map((demo, demoIndex) => (
                      <Badge key={demoIndex} variant="secondary" className="text-xs glass-effect">
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
                  Ready to Connect with <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sponsors</span>?
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Join our platform to access AI-powered matching and connect with sponsors perfect for your events.
                </p>
                <Button variant="premium" size="lg" asChild>
                  <Link to="/auth">Join SponsorSync</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForStudents;