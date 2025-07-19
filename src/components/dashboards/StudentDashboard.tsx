import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateEventForm from '@/components/events/CreateEventForm';
import { 
  Plus, 
  Calendar, 
  Users, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Bell,
  BarChart3
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  audience_size: number;
  category: string;
  budget_range: string;
  location: string;
  event_date: string;
  created_at: string;
}

interface Match {
  id: string;
  match_score: number;
  status: string;
  created_at: string;
  sponsors: {
    company_name: string;
    industry: string;
  };
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchMatches();
    }
  }, [user]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setEvents(data || []);
    }
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        sponsors!inner(company_name, industry),
        events!inner(organizer_id)
      `)
      .eq('events.organizer_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setMatches(data || []);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-accent" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-accent text-accent-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and connect with sponsors</p>
        </div>
        <Button variant="hero" className="gap-2" onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 hover:shadow-card transition-all cursor-pointer" onClick={() => setShowCreateForm(true)}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Create Event</h3>
              <p className="text-sm text-muted-foreground">Start a new event</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-card transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Bell className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-medium">Sponsor Requests</h3>
              <p className="text-sm text-muted-foreground">{matches.filter(m => m.status === 'pending').length} pending</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-card transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-medium">Analytics</h3>
              <p className="text-sm text-muted-foreground">View performance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{events.length}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{matches.length}</p>
              <p className="text-sm text-muted-foreground">Total Matches</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {matches.filter(m => m.status === 'accepted').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Partnerships</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-light/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-light" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {matches.length > 0 
                  ? Math.round(matches.reduce((acc, m) => acc + m.match_score, 0) / matches.length * 100)
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Match Score</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Events</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:shadow-card transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {event.description?.slice(0, 100)}...
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.audience_size} attendees
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.event_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Badge variant="outline">{event.budget_range || 'Budget TBD'}</Badge>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
            {events.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events created yet</p>
                <p className="text-sm text-muted-foreground">Create your first event to get started</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Matches */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Matches</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {matches.slice(0, 3).map((match) => (
              <div key={match.id} className="border rounded-lg p-4 hover:shadow-card transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{match.sponsors.company_name}</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(match.status)}
                    <Badge className={getStatusColor(match.status)} variant="secondary">
                      {match.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Industry: {match.sponsors.industry}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Match Score: {Math.round(match.match_score * 100)}%
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(match.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            
            {matches.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No matches yet</p>
                <p className="text-sm text-muted-foreground">Create events to get matched with sponsors</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <CreateEventForm
          onClose={() => setShowCreateForm(false)}
          onEventCreated={() => {
            fetchEvents();
            fetchMatches();
          }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;