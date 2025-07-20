import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Users, TrendingUp, Target, Sparkles, Zap, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden z-10 bg-transparent">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-mesh-pattern opacity-30"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary-light/20 rounded-full blur-3xl animate-float delay-300"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-bounce-subtle"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-accent rounded-full animate-bounce-subtle delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary-light rounded-full animate-bounce-subtle delay-200"></div>
        <Sparkles className="absolute top-1/2 right-1/4 w-6 h-6 text-accent animate-pulse-glow delay-300" />
        <Star className="absolute top-1/6 left-1/2 w-4 h-4 text-primary animate-spin-slow delay-400" />
        <Zap className="absolute bottom-1/3 right-1/6 w-5 h-5 text-accent-light animate-pulse-glow delay-500" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-20">
        <div className="text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-3 bg-background/20 backdrop-blur-sm border border-primary/30 rounded-full px-6 py-3 mb-8 animate-fade-in group hover:bg-background/30 transition-all duration-300">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary-foreground font-display">
              #1 Sponsorship Matchmaking Platform
            </span>
            <ArrowRight className="w-4 h-4 text-primary-foreground group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-overlay mb-10 relative z-30 animate-fade-in delay-100">
            Smart Sponsorship &{" "}
            <span className="gradient-text">
              Brand Matchmaking
            </span>{" "}
            Engine
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl lg:text-4xl text-overlay max-w-6xl mx-auto mb-16 leading-relaxed relative z-30 animate-fade-in delay-200 font-sans">
            Connect student organizations with perfect sponsors through AI-powered matching. 
            Build meaningful partnerships that drive events and grow brands.
          </p>

          {/* Enhanced Spline Animation Container */}
          <div className="mb-16 mx-auto max-w-4xl animate-fade-in delay-300">
            <Card variant="glass" className="h-96 overflow-hidden group hover:shadow-floating transition-all duration-500">
              <div 
                dangerouslySetInnerHTML={{
                  __html: `
                    <script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.33/build/spline-viewer.js"></script>
                    <spline-viewer loading-anim-type="none" url="https://prod.spline.design/m5prql-j6-q9cRZ3/scene.splinecode" style="width: 100%; height: 100%;"></spline-viewer>
                  `
                }}
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Card>
          </div>

          {/* Enhanced CTAs */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24 animate-fade-in delay-400">
            <Button variant="premium" size="xxl" className="group" asChild>
              <Link to="/for-students">
                <Users className="mr-4 h-7 w-7 group-hover:scale-110 transition-transform" />
                Find Sponsors
                <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="glass" size="xxl" className="group" asChild>
              <Link to="/for-sponsors">
                <Target className="mr-4 h-7 w-7 group-hover:scale-110 transition-transform" />
                Discover Events
                <TrendingUp className="ml-4 h-7 w-7 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto animate-fade-in delay-500">
            <Card variant="neumorphic" className="group">
              <div className="p-10 text-center">
                <div className="text-5xl lg:text-6xl font-display font-bold text-primary mb-4 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-xl text-muted-foreground font-medium">Student Organizations</div>
              </div>
            </Card>
            <Card variant="neumorphic" className="group md:-translate-y-4">
              <div className="p-10 text-center">
                <div className="text-5xl lg:text-6xl font-display font-bold text-accent mb-4 group-hover:scale-110 transition-transform duration-300">1,200+</div>
                <div className="text-xl text-muted-foreground font-medium">Active Sponsors</div>
              </div>
            </Card>
            <Card variant="neumorphic" className="group">
              <div className="p-10 text-center">
                <div className="text-5xl lg:text-6xl font-display font-bold gradient-text mb-4 group-hover:scale-110 transition-transform duration-300">$2M+</div>
                <div className="text-xl text-muted-foreground font-medium">Sponsorships Matched</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
        <div className="w-8 h-12 border-2 border-primary-foreground/30 rounded-full flex justify-center p-2 group hover:border-primary transition-colors duration-300">
          <div className="w-1.5 h-4 bg-gradient-to-b from-primary to-accent rounded-full animate-pulse group-hover:animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;