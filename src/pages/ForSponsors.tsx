import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Target, TrendingUp, Users, BarChart3, Calendar, MapPin, DollarSign, MessageCircle, Sparkles, Play } from "lucide-react";
import { demoEvents } from "@/data/demoEvents";

const ForSponsors = () => {
  return (
    <div className="min-h-screen bg-background bg-particles">
      <Navigation />
      <div className="absolute inset-0 bg-aurora-pattern opacity-15"></div>
      
      <main className="relative pt-16">
        {/* Enhanced Hero Section */}
        <section className="py-20 overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-accent/20 to-success/20 rounded-full blur-3xl animate-liquid-float"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-liquid-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 mb-8 border border-accent/30">
              <Target className="h-4 w-4 text-accent animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
                Smart Event Discovery Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
              Discover High-Impact{" "}
              <span className="bg-gradient-to-r from-accent via-success to-primary bg-clip-text text-transparent animate-glow-pulse">
                Student Events
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed">
              Reach engaged student audiences through strategic event sponsorships with measurable ROI and AI-powered targeting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button variant="premium" size="xl" className="group" asChild>
                <Link to="/auth">
                  Start Sponsoring
                  <Target className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="glass-effect group">
                View Analytics
                <Play className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Sponsors Choose <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">SponsorSync</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Advanced analytics and intelligent matching for maximum sponsorship impact
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Precision Targeting</h3>
                <p className="text-muted-foreground leading-relaxed">Connect with your exact demographic through carefully curated student events and organizations</p>
              </Card>
              
              <Card className="glass-card p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-success to-accent rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Measurable ROI</h3>
                <p className="text-muted-foreground leading-relaxed">Track engagement metrics and measure sponsorship performance with real-time analytics dashboards</p>
              </Card>
              
              <Card className="glass-card p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-success rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">AI-Powered Insights</h3>
                <p className="text-muted-foreground leading-relaxed">Advanced machine learning provides predictive analytics and optimization recommendations</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Upcoming <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Events</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover exciting events looking for sponsors to make them happen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {demoEvents.map((event, index) => (
                <Card key={event.id} className="glass-card p-6 group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {event.title}
                    </h3>
                    <Badge variant="outline" className="mb-3 border-accent/50 text-accent glass-effect">
                      {event.category}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">
                        {new Date(event.event_date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="text-sm text-foreground line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-success" />
                      <span className="text-sm text-foreground">{event.audience_size.toLocaleString()} attendees</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{event.budget_range}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.requirements.slice(0, 2).map((req, reqIndex) => (
                      <Badge key={reqIndex} variant="secondary" className="text-xs glass-effect">
                        {req}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="premium" size="sm" className="flex-1" asChild>
                      <Link to={`/chat/event-${event.id}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Sponsor
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="glass-effect">
                      Learn More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <Card className="glass-card p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Maximize Your <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Sponsorship ROI</span>?
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Join our platform to access AI-powered event discovery and connect with high-impact student organizations.
                </p>
                <Button variant="premium" size="lg" asChild>
                  <Link to="/auth">Start Sponsoring Today</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForSponsors;