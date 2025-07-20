import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { RecommendationCard } from './RecommendationCard';
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
  Eye
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

  useEffect(() => {
    if (user) {
      fetchUserRole();
      fetchRecommendations();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            {userRole === 'student' 
              ? 'Discover sponsors perfect for your events'
              : 'Find high-impact student events to sponsor'
            }
          </p>
        </div>
        
        <Button
          onClick={generateRecommendations}
          disabled={isGenerating}
          variant="hero"
          size="lg"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate New'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 neumorphic">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Matches</p>
              <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 neumorphic">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Interested</p>
              <p className="text-2xl font-bold text-foreground">{statusCounts.interested}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 neumorphic">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Contacted</p>
              <p className="text-2xl font-bold text-foreground">{statusCounts.contacted}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 neumorphic">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm text-muted-foreground">Starred</p>
              <p className="text-2xl font-bold text-foreground">{statusCounts.starred}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 neumorphic">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${userRole === 'student' ? 'sponsors' : 'events'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
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
            <SelectTrigger className="w-full md:w-48">
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
      ) : filteredRecommendations.length === 0 ? (
        <Card className="p-12 text-center neumorphic">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Recommendations Yet</h3>
          <p className="text-muted-foreground mb-6">
            {recommendations.length === 0 
              ? 'Generate your first AI-powered recommendations to get started!'
              : 'No recommendations match your current filters.'
            }
          </p>
          {recommendations.length === 0 && (
            <Button onClick={generateRecommendations} disabled={isGenerating} variant="hero">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Recommendations
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              userRole={userRole}
              onUpdate={fetchRecommendations}
            />
          ))}
        </div>
      )}
    </div>
  );
}