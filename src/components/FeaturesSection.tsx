import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Calendar,
  Star,
  Target,
  BarChart3 
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithm analyzes event types, audience demographics, and sponsor preferences to create perfect matches.",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Event Profiles",
      description: "Comprehensive event showcases with audience insights, past performance metrics, and engagement analytics.",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      title: "ROI Tracking",
      description: "Real-time performance monitoring with detailed analytics to measure sponsorship success and impact.",
      color: "text-success"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Find perfect matches in minutes, not months"
    },
    {
      icon: Shield,
      title: "Verified Partners",
      description: "All organizations and sponsors are thoroughly vetted"
    },
    {
      icon: Calendar,
      title: "Streamlined Process",
      description: "From discovery to contract signing in one platform"
    },
    {
      icon: Star,
      title: "Quality Matches",
      description: "95% match satisfaction rate from our users"
    },
    {
      icon: Target,
      title: "Targeted Reach",
      description: "Connect with your exact target demographic"
    },
    {
      icon: BarChart3,
      title: "Performance Insights",
      description: "Detailed analytics and ROI measurement tools"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-overlay mb-8">
            Why Choose{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              SponsorSync
            </span>
            ?
          </h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            The most advanced sponsorship platform designed for the modern digital age. 
            Powered by AI, trusted by thousands.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="neumorphic"
              className="group hover-lift neumorphic transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-10">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-glow`}>
                  <feature.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-display font-bold text-overlay mb-6 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <Card 
              key={benefit.title}
              variant="glass"
              className="group hover-lift transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-semibold text-overlay mb-3">
                      {benefit.title}
                    </h4>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card variant="gradient" className="text-center p-16 shadow-hero animate-fade-in">
          <h3 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-6">
            Ready to Transform Your Sponsorship Game?
          </h3>
          <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of organizations and sponsors who've found their perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="premium" size="xxl" className="group" asChild>
              <Link to="/for-students">
                Start For Students
                <Users className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
            <Button variant="glass" size="xxl" className="group" asChild>
              <Link to="/for-sponsors">
                Start For Sponsors
                <Target className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;