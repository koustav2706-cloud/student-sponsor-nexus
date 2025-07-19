import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyProfileForm from '@/components/sponsors/CompanyProfileForm';
import EventDiscoveryFeed from '@/components/sponsors/EventDiscoveryFeed';
import { 
  Users, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Search,
  Heart,
  BarChart3
} from 'lucide-react';

interface SponsorProfile {
  id: string;
  company_name: string;
  industry: string;
  target_demographics: any;
  marketing_goals: string;
  budget_range: string;
}

interface Match {
  id: string;
  match_score: number;
  status: string;
  created_at: string;
  events: {
    title: string;
    category: string;
    audience_size: number;
    event_date: string;
  };
}

const SponsorDashboard = () => {
  const { user } = useAuth();
  const [sponsorProfile, setSponsorProfile] = useState<SponsorProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSponsorProfile();
      fetchMatches();
    }
  }, [user]);

  const fetchSponsorProfile = async () => {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (!error) {
      setSponsorProfile(data);
    }
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        events!inner(title, category, audience_size, event_date),
        sponsors!inner(user_id)
      `)
      .eq('sponsors.user_id', user?.id)
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
          <h1 className="text-3xl font-bold text-foreground">Sponsor Dashboard</h1>
          <p className="text-muted-foreground">
            {sponsorProfile ? `Welcome back, ${sponsorProfile.company_name}` : 'Discover and sponsor student events'}
          </p>
        </div>
        <CompanyProfileForm 
          profile={sponsorProfile} 
          onProfileUpdate={() => {
            fetchSponsorProfile();
            fetchMatches();
          }} 
        />
      </div>

      {/* Profile Setup Notice */}
      {!sponsorProfile && (
        <Card className="p-6 mb-8 border-accent bg-accent/5">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-accent" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Complete Your Company Profile</h3>
              <p className="text-muted-foreground">
                Set up your company profile to start receiving event matches and connect with student organizations.
              </p>
            </div>
            <CompanyProfileForm onProfileUpdate={fetchSponsorProfile} />
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
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
              <p className="text-sm text-muted-foreground">Active Sponsorships</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {matches.filter(m => m.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
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
        {/* Company Profile */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Company Profile</h2>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
          
          {sponsorProfile ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">{sponsorProfile.company_name}</h3>
                <p className="text-sm text-muted-foreground">{sponsorProfile.industry}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Marketing Goals</h4>
                <p className="text-sm text-muted-foreground">
                  {sponsorProfile.marketing_goals || 'Not specified'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Budget Range</h4>
                <Badge variant="outline">{sponsorProfile.budget_range || 'Not specified'}</Badge>
              </div>
              
              {sponsorProfile.target_demographics && sponsorProfile.target_demographics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Target Demographics</h4>
                  <div className="flex flex-wrap gap-2">
                    {sponsorProfile.target_demographics.map((demo, index) => (
                      <Badge key={index} variant="secondary">{demo}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No company profile set up</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your profile to start receiving matches
              </p>
              <Button variant="outline" size="sm">Create Profile</Button>
            </div>
          )}
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
                  <h3 className="font-medium">{match.events.title}</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(match.status)}
                    <Badge className={getStatusColor(match.status)} variant="secondary">
                      {match.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {match.events.audience_size} attendees
                  </div>
                  <Badge variant="outline">{match.events.category}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Match Score: {Math.round(match.match_score * 100)}%
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(match.events.event_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            
            {matches.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No matches yet</p>
                <p className="text-sm text-muted-foreground">
                  Complete your profile to start getting matched with events
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SponsorDashboard;