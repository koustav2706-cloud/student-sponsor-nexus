import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Users, TrendingUp, Target } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden z-10">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary-foreground">
              #1 Sponsorship Matchmaking Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up relative z-20">
            Smart Sponsorship &{" "}
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Brand Matchmaking
            </span>{" "}
            Engine
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-4xl mx-auto mb-10 leading-relaxed animate-slide-up relative z-20" style={{ animationDelay: '0.2s' }}>
            Connect student organizations with perfect sponsors through AI-powered matching. 
            Build meaningful partnerships that drive events and grow brands.
          </p>

          {/* Spline Animation */}
          <div className="mb-12 mx-auto max-w-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-3xl overflow-hidden border border-primary/20 h-80 bg-background/10 backdrop-blur-sm">
              <div 
                dangerouslySetInnerHTML={{
                  __html: `
                    <script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.33/build/spline-viewer.js"></script>
                    <spline-viewer loading-anim-type="none" url="https://prod.spline.design/m5prql-j6-q9cRZ3/scene.splinecode" style="width: 100%; height: 100%;"></spline-viewer>
                  `
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

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
            <Card className="p-6 bg-background/10 backdrop-blur-sm border-primary/20 hover:bg-background/20 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-primary-foreground mb-2">500+</div>
              <div className="text-primary-foreground/70">Student Organizations</div>
            </Card>
            <Card className="p-6 bg-background/10 backdrop-blur-sm border-primary/20 hover:bg-background/20 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-primary-foreground mb-2">1,200+</div>
              <div className="text-primary-foreground/70">Active Sponsors</div>
            </Card>
            <Card className="p-6 bg-background/10 backdrop-blur-sm border-primary/20 hover:bg-background/20 transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-primary-foreground mb-2">$2M+</div>
              <div className="text-primary-foreground/70">Sponsorships Matched</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/30 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;