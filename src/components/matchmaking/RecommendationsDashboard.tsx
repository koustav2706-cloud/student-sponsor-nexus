import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MatchCard } from './MatchCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Search, 
  Filter, 
  TrendingUp, 
  RefreshCw,
  Star,
  Heart,
  MessageCircle,
  Eye,
  Bell,
  Target,
  BarChart3
} from 'lucide-react';

interface Recommendation {
  id: string;
  match_score: number;
  reasoning: string;
  factors: any;
  is_starred: boolean;
  is_viewed: boolean;
  status: string;
  created_at: string;
  events?: any;
  sponsors?: any;
}

export function RecommendationsDashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userRole, setUserRole] = useState<'student' | 'sponsor' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [notificationSettings, setNotificationSettings] = useState({
    highMatches: true,
    weeklyDigest: true,
    inApp: true
  });

  useEffect(() => {
    if (user) {
      fetchUserRole();
      fetchRecommendations();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();
      
      setUserRole(role?.role as 'student' | 'sponsor');
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('recommendations')
        .select(`
          *,
          events (*),
          sponsors (*)
        `)
        .order('match_score', { ascending: false });

      if (error) throw error;
      
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('recommendations')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'recommendations' 
        }, 
        (payload) => {
          const newRecommendation = payload.new as Recommendation;
          if (newRecommendation.match_score >= 80 && notificationSettings.highMatches) {
            toast.success(`New high-quality match found! ${newRecommendation.match_score}% compatibility`);
          }
          fetchRecommendations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-matchmaking', {
        body: { action: 'generateRecommendations' }
      });

      if (error) throw error;
      
      toast.success(data.message || 'New recommendations generated!');
      await fetchRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConnect = async (entityId: string) => {
    try {
      // Create a match/connection request
      const { error } = await supabase
        .from('matches')
        .insert({
          event_id: userRole === 'sponsor' ? entityId : null,
          sponsor_id: userRole === 'student' ? entityId : null,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success('Connection request sent successfully!');
    } catch (error) {
      console.error('Error creating connection:', error);
      toast.error('Failed to send connection request');
    }
  };

  const handleSave = async (entityId: string) => {
    try {
      const recommendation = recommendations.find(r => 
        (userRole === 'student' ? r.sponsors?.id : r.events?.id) === entityId
      );
      
      if (!recommendation) return;

      const { error } = await supabase
        .from('recommendations')
        .update({ is_starred: !recommendation.is_starred })
        .eq('id', recommendation.id);

      if (error) throw error;
      
      toast.success(recommendation.is_starred ? 'Removed from saved' : 'Saved for later');
      fetchRecommendations();
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast.error('Failed to save recommendation');
    }
  };

  const handleViewDetails = (entityId: string) => {
    // Navigate to detailed view
    console.log('View details for:', entityId);
  };

  // Filter and sort recommendations
  const filteredRecommendations = recommendations
    .filter(rec => {
      if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
      
      if (searchTerm) {
        const entity = userRole === 'student' ? rec.sponsors : rec.events;
        const searchText = userRole === 'student' 
          ? `${entity?.company_name} ${entity?.industry}`.toLowerCase()
          : `${entity?.title} ${entity?.category}`.toLowerCase();
        return searchText.includes(searchTerm.toLowerCase());
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.match_score - a.match_score;
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Transform recommendations to match cards
  const matchCards = filteredRecommendations.map(rec => {
    const entity = userRole === 'student' ? rec.sponsors : rec.events;
    return {
      id: rec.id,
      score: rec.match_score,
      reasoning: rec.reasoning,
      factors: rec.factors || {},
      entity: {
        id: entity?.id || '',
        name: userRole === 'student' ? entity?.company_name : entity?.title,
        type: userRole === 'student' ? 'sponsor' : 'event',
        image: entity?.image || '/placeholder.svg',
        category: entity?.category || entity?.industry,
        industry: entity?.industry,
        location: entity?.location,
        budget: entity?.budget_range,
        audience_size: entity?.audience_size,
        date: entity?.event_date
      }
    };
  });

  const getStatusCounts = () => {
    return {
      all: recommendations.length,
      pending: recommendations.filter(r => r.status === 'pending').length,
      interested: recommendations.filter(r => r.status === 'interested').length,
      contacted: recommendations.filter(r => r.status === 'contacted').length,
      rejected: recommendations.filter(r => r.status === 'rejected').length,
      starred: recommendations.filter(r => r.is_starred).length,
    };
  };

  const statusCounts = getStatusCounts();

  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Recommendations
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {userRole === 'student' 
              ? 'Discover sponsors perfect for your events'
              : 'Find high-impact student events to sponsor'
            }
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={generateRecommendations}
            disabled={isGenerating}
            variant="hero"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate New'}
          </Button>
          
          <Button variant="outline" size="lg" className="gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 neumorphic hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Matches</p>
              <p className="text-3xl font-bold text-foreground">{statusCounts.all}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 neumorphic hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Heart className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Interested</p>
              <p className="text-3xl font-bold text-foreground">{statusCounts.interested}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 neumorphic hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contacted</p>
              <p className="text-3xl font-bold text-foreground">{statusCounts.contacted}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 neumorphic hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Starred</p>
              <p className="text-3xl font-bold text-foreground">{statusCounts.starred}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 neumorphic">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${userRole === 'student' ? 'sponsors' : 'events'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 h-12 text-base"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 h-12">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="interested">Interested ({statusCounts.interested})</SelectItem>
              <SelectItem value="contacted">Contacted ({statusCounts.contacted})</SelectItem>
              <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 h-12">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Match Score</SelectItem>
              <SelectItem value="date">Date Created</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Recommendations List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : matchCards.length === 0 ? (
        <Card className="p-16 text-center neumorphic">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-4">No Recommendations Yet</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            {recommendations.length === 0 
              ? 'Generate your first AI-powered recommendations to get started!'
              : 'No recommendations match your current filters.'
            }
          </p>
          {recommendations.length === 0 && (
            <Button onClick={generateRecommendations} disabled={isGenerating} variant="hero">
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Recommendations
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* High-Quality Matches Section */}
          {matchCards.filter(m => m.score >= 80).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-bold text-foreground">Excellent Matches</h2>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  {matchCards.filter(m => m.score >= 80).length} matches
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {matchCards
                  .filter(m => m.score >= 80)
                  .slice(0, 6)
                  .map((match, index) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onConnect={handleConnect}
                      onSave={handleSave}
                      onViewDetails={handleViewDetails}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* All Matches Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">All Recommendations</h2>
              <Badge variant="outline">
                {matchCards.length} total
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {matchCards.map((match, index) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onConnect={handleConnect}
                  onSave={handleSave}
                  onViewDetails={handleViewDetails}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Success Stories Section */}
      {matchCards.length > 0 && (
        <Card className="p-8 neumorphic bg-gradient-subtle">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Success Stories</h3>
            <p className="text-lg text-muted-foreground mb-6">
              See how other {userRole === 'student' ? 'students' : 'sponsors'} found their perfect matches
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Match Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">$2M+</div>
                <div className="text-sm text-muted-foreground">Sponsorships Matched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">1,200+</div>
                <div className="text-sm text-muted-foreground">Active Partnerships</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
            />
          ))}
        </div>
      )}
    </div>
  );
}