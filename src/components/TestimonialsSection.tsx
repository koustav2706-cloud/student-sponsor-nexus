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
          <h2 className="text-4xl md:text-6xl font-bold font-display text-overlay mb-8">
            Trusted by{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            See what students and sponsors are saying about their SponsorSync success stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="p-8 hover-lift transition-all duration-300 border-2 hover:border-primary/30 bg-background/90 backdrop-blur-sm neumorphic"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <Quote className="h-8 w-8 text-primary/60" />
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              
              <p className="text-lg text-foreground mb-8 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-overlay">
                    {testimonial.name}
                  </h4>
                  <p className="text-base text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-base text-primary font-medium">
                    {testimonial.organization}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-xl text-muted-foreground mb-10">Trusted by leading organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="px-8 py-4 bg-background/50 rounded-xl border-2 hover-lift">
              <span className="font-bold text-xl">500+ Organizations</span>
            </div>
            <div className="px-8 py-4 bg-background/50 rounded-xl border-2 hover-lift">
              <span className="font-bold text-xl">1,200+ Sponsors</span>
            </div>
            <div className="px-8 py-4 bg-background/50 rounded-xl border-2 hover-lift">
              <span className="font-bold text-xl">$2M+ Matched</span>
            </div>
            <div className="px-8 py-4 bg-background/50 rounded-xl border-2 hover-lift">
              <span className="font-bold text-xl">95% Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;