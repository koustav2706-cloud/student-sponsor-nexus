import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoEvents } from "@/data/demoEvents";
import { Calendar, MapPin, Users, DollarSign, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const DemoEvents = () => {
  return (
    <div className="min-h-screen bg-background bg-particles">
      <Navigation />
      <div className="absolute inset-0 bg-aurora-pattern opacity-10"></div>
      
      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Upcoming <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover exciting events looking for sponsors to make them happen
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoEvents.map((event) => (
              <Card key={event.id} className="glass-card p-6 group">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {event.title}
                  </h3>
                  <Badge variant="outline" className="mb-3 border-accent/50 text-accent">
                    {event.category}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="text-sm text-foreground">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-success" />
                    <span className="text-sm text-foreground">{event.audience_size} attendees</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{event.budget_range}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {event.requirements.slice(0, 2).map((req, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
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
                Have an Event to Sponsor?
              </h3>
              <p className="text-muted-foreground mb-6">
                List your event on our platform and get matched with perfect sponsors through AI-powered recommendations.
              </p>
              <Button variant="premium" size="lg" asChild>
                <Link to="/auth">List Your Event</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoEvents;