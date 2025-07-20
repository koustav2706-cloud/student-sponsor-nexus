import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Users, TrendingUp, Target } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background bg-particles overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-aurora-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Liquid Glass Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-liquid-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent/20 to-success/20 rounded-full blur-3xl animate-liquid-float" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl animate-glow-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 mb-8 animate-fade-in border border-primary/30">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-sm shadow-success/50"></div>
            <span className="text-sm font-medium text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              #1 AI-Powered Sponsorship Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Smart Sponsorship &{" "}
            <span className="bg-gradient-to-r from-accent via-primary to-accent-light bg-clip-text text-transparent animate-glow-pulse">
              AI Matchmaking
            </span>{" "}
            Platform
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Connect student organizations with perfect sponsors through AI-powered matching. 
            Build meaningful partnerships that drive events and grow brands with liquid precision.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button variant="accent" size="xl" className="group" asChild>
              <Link to="/for-students">
                Find Sponsors
                <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
            <Button variant="professional" size="xl" className="group" asChild>
              <Link to="/for-sponsors">
                Discover Events
                <Target className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Card className="glass-card p-8 text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-muted-foreground">Student Organizations</div>
            </Card>
            <Card className="glass-card p-8 text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">1,200+</div>
              <div className="text-muted-foreground">Active Sponsors</div>
            </Card>
            <Card className="glass-card p-8 text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">$2M+</div>
              <div className="text-muted-foreground">Sponsorships Matched</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center glass-effect">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse shadow-sm shadow-primary/50"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;