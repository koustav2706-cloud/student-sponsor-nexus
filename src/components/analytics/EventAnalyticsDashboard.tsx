import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Share2, 
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  Activity
} from "lucide-react";

const EventAnalyticsDashboard = () => {
  const metrics = [
    {
      title: "Total Reach",
      value: "45,230",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-primary"
    },
    {
      title: "Event Registrations", 
      value: "1,247",
      change: "+8.3%", 
      trend: "up",
      icon: Users,
      color: "text-success"
    },
    {
      title: "Social Engagement",
      value: "23,890",
      change: "+15.2%",
      trend: "up", 
      icon: MessageSquare,
      color: "text-accent"
    },
    {
      title: "Sponsorship Revenue",
      value: "$15,750",
      change: "+22.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary"
    }
  ];

  const eventData = [
    {
      name: "Tech Innovation Summit",
      status: "Live",
      registrations: 342,
      capacity: 500,
      revenue: "$8,500",
      engagement: 94,
      sponsors: ["TechCorp", "InnovateAI", "DevTools Pro"]
    },
    {
      name: "Startup Pitch Competition", 
      status: "Upcoming",
      registrations: 156,
      capacity: 200,
      revenue: "$4,250",
      engagement: 87,
      sponsors: ["VentureCapital", "StartupHub"]
    },
    {
      name: "AI & Machine Learning Workshop",
      status: "Completed",
      registrations: 98,
      capacity: 100,
      revenue: "$3,000",
      engagement: 96,
      sponsors: ["AITech", "DataScience Inc"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "bg-success";
      case "Upcoming": return "bg-accent";
      default: return "bg-muted-foreground";
    }
  };

  const getCapacityPercentage = (registrations: number, capacity: number) => {
    return Math.min((registrations / capacity) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Event Analytics</h2>
          <p className="text-muted-foreground">Track your event performance and ROI</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Activity className="h-4 w-4" />
          Live Data
        </Badge>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-6 hover:shadow-card transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${metric.color}`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <Badge variant={metric.trend === "up" ? "default" : "destructive"} className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {metric.change}
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{metric.value}</h3>
              <p className="text-sm text-muted-foreground">{metric.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Event Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Event Performance Overview
        </h3>
        
        <div className="space-y-4">
          {eventData.map((event, index) => (
            <div key={event.name} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`}></div>
                  <h4 className="font-semibold">{event.name}</h4>
                  <Badge variant="outline">{event.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{event.revenue}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Registration Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Registrations</span>
                    <span>{event.registrations}/{event.capacity}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getCapacityPercentage(event.registrations, event.capacity)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Engagement Score */}
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Engagement:</span>
                  <Badge variant="secondary">{event.engagement}%</Badge>
                </div>

                {/* Sponsors */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Share2 className="h-4 w-4 text-success" />
                    <span className="text-sm text-muted-foreground">Sponsors:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {event.sponsors.map((sponsor) => (
                      <Badge key={sponsor} variant="outline" className="text-xs">
                        {sponsor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-card transition-all duration-300 cursor-pointer border-primary/20 hover:border-primary/40">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-semibold">Create New Event</h4>
              <p className="text-sm text-muted-foreground">Launch your next event</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-card transition-all duration-300 cursor-pointer border-accent/20 hover:border-accent/40">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-accent" />
            <div>
              <h4 className="font-semibold">Find Sponsors</h4>
              <p className="text-sm text-muted-foreground">Discover new partnerships</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-card transition-all duration-300 cursor-pointer border-success/20 hover:border-success/40">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-success" />
            <div>
              <h4 className="font-semibold">View Reports</h4>
              <p className="text-sm text-muted-foreground">Detailed analytics</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EventAnalyticsDashboard;