import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              SponsorSync
            </span>
            ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The most advanced sponsorship platform designed for the modern digital age. 
            Powered by AI, trusted by thousands.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="p-8 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-card hover:scale-105 bg-gradient-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card 
              key={benefit.title}
              className="p-6 hover:shadow-card transition-all duration-300 hover:scale-105 border hover:border-primary/20"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 shadow-hero">
          <h3 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Sponsorship Game?
          </h3>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations and sponsors who've found their perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="xl" className="group">
              Start For Students
              <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
            <Button variant="professional" size="xl" className="group">
              Start For Sponsors
              <Target className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;