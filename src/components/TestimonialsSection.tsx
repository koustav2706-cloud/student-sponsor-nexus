import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Event Coordinator",
      organization: "Tech Students Alliance",
      content: "SponsorSync helped us secure $15,000 in sponsorships for our annual hackathon. The AI matching was spot-on - we connected with sponsors who truly aligned with our values.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director", 
      organization: "InnovateTech Corp",
      content: "We've sponsored 12 student events through SponsorSync this year. The ROI tracking and engagement metrics give us clear proof of value. Best sponsorship platform we've used.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Thompson",
      role: "Club President",
      organization: "Business Leaders Society",
      content: "The platform made finding the right sponsors effortless. We went from months of cold emails to meaningful partnerships in weeks. Our events have never been better funded.",
      rating: 5,
      avatar: "ET"
    },
    {
      name: "David Park",
      role: "Brand Partnerships Manager",
      organization: "Future Finance",
      content: "SponsorSync's analytics dashboard shows real impact. We can track everything from brand exposure to lead generation. It's transformed how we approach student marketing.",
      rating: 5,
      avatar: "DP"
    },
    {
      name: "Lisa Wang",
      role: "Events Manager",
      organization: "STEM Women United",
      content: "The quality of matches is incredible. Every sponsor we've connected with has been a perfect fit for our audience and mission. It's like having a matchmaking expert on our team.",
      rating: 5,
      avatar: "LW"
    },
    {
      name: "Alex Johnson",
      role: "Corporate Relations",
      organization: "GreenTech Solutions",
      content: "We've increased our student engagement by 300% since using SponsorSync. The platform helps us find events that truly resonate with our target demographic.",
      rating: 5,
      avatar: "AJ"
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mb-6">
            Trusted by{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what students and sponsors are saying about their SponsorSync success stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="p-6 hover:shadow-floating transition-all duration-300 hover:scale-105 border hover:border-primary/20 bg-background/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <Quote className="h-6 w-6 text-primary/60" />
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {testimonial.organization}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-8">Trusted by leading organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="px-6 py-3 bg-background/50 rounded-lg border">
              <span className="font-semibold text-lg">500+ Organizations</span>
            </div>
            <div className="px-6 py-3 bg-background/50 rounded-lg border">
              <span className="font-semibold text-lg">1,200+ Sponsors</span>
            </div>
            <div className="px-6 py-3 bg-background/50 rounded-lg border">
              <span className="font-semibold text-lg">$2M+ Matched</span>
            </div>
            <div className="px-6 py-3 bg-background/50 rounded-lg border">
              <span className="font-semibold text-lg">95% Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;