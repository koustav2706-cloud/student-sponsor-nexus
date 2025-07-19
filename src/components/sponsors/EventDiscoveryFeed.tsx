import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Star,
  Contact
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  audience_size: number;
  event_date: string;
  location: string;
  budget_range: string;
  engagement_metrics: any;
  organizer_id: string;
  match_score?: number;
}

interface EventDiscoveryFeedProps {
  sponsorProfile?: any;
}

const EVENT_CATEGORIES = [
  'All Categories', 'Technology', 'Cultural', 'Sports', 'Academic',
  'Workshop', 'Conference', 'Competition', 'Networking', 'Arts', 'Music'
];

const AUDIENCE_RANGES = [
  'All Sizes', '50-200', '200-500', '500-1000', '1000+'
];

const BUDGET_RANGES = [
  'All Budgets', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000',
  '$5,000 - $10,000', '$10,000 - $25,000', '$25,000+'
];

const EventDiscoveryFeed = ({ sponsorProfile }: EventDiscoveryFeedProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [audienceFilter, setAudienceFilter] = useState('All Sizes');
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, categoryFilter, audienceFilter, budgetFilter]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Calculate match scores
      const eventsWithScores = data?.map(event => ({
        ...event,
        match_score: calculateMatchScore(event, sponsorProfile)
      })) || [];

      setEvents(eventsWithScores);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (event: any, profile: any): number => {
    if (!profile) return 0.5;

    let score = 0;
    let factors = 0;

    // Industry alignment (30%)
    if (profile.industry && event.category) {
      const industryMatch = getIndustryAlignment(profile.industry, event.category);
      score += industryMatch * 0.3;
      factors += 0.3;
    }

    // Budget compatibility (25%)
    if (profile.budget_range && event.budget_range) {
      const budgetMatch = getBudgetAlignment(profile.budget_range, event.budget_range);
      score += budgetMatch * 0.25;
      factors += 0.25;
    }

    // Audience size preference (20%)
    if (event.audience_size) {
      const audienceScore = getAudienceScore(event.audience_size);
      score += audienceScore * 0.2;
      factors += 0.2;
    }

    // Engagement potential (25%)
    if (event.engagement_metrics) {
      const engagementScore = getEngagementScore(event.engagement_metrics);
      score += engagementScore * 0.25;
      factors += 0.25;
    }

    return factors > 0 ? score / factors : 0.5;
  };

  const getIndustryAlignment = (sponsorIndustry: string, eventCategory: string): number => {
    const alignments: Record<string, string[]> = {
      'Technology': ['Technology', 'Academic', 'Workshop', 'Conference'],
      'Finance': ['Academic', 'Conference', 'Networking'],
      'Healthcare': ['Academic', 'Workshop', 'Sports'],
      'Education': ['Academic', 'Workshop', 'Conference'],
      'Entertainment': ['Cultural', 'Arts', 'Music', 'Sports']
    };

    const relevantCategories = alignments[sponsorIndustry] || [];
    return relevantCategories.includes(eventCategory) ? 1 : 0.3;
  };

  const getBudgetAlignment = (sponsorBudget: string, eventBudget: string): number => {
    // Simple budget range matching logic
    return sponsorBudget === eventBudget ? 1 : 0.6;
  };

  const getAudienceScore = (audienceSize: number): number => {
    if (audienceSize >= 1000) return 1;
    if (audienceSize >= 500) return 0.8;
    if (audienceSize >= 200) return 0.6;
    return 0.4;
  };

  const getEngagementScore = (metrics: any): number => {
    if (!metrics) return 0.5;
    
    const pastAttendance = metrics.past_attendance || 0;
    const socialReach = metrics.social_media_reach || 0;
    
    let score = 0;
    if (pastAttendance > 500) score += 0.5;
    else if (pastAttendance > 200) score += 0.3;
    
    if (socialReach > 1000) score += 0.5;
    else if (socialReach > 500) score += 0.3;
    
    return Math.min(score, 1);
  };

  const applyFilters = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All Categories') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    // Audience size filter
    if (audienceFilter !== 'All Sizes') {
      const [min, max] = audienceFilter.split('-').map(n => parseInt(n.replace('+', '')));
      filtered = filtered.filter(event => {
        if (audienceFilter.includes('+')) {
          return event.audience_size >= min;
        }
        return event.audience_size >= min && event.audience_size <= max;
      });
    }

    // Budget filter
    if (budgetFilter !== 'All Budgets') {
      filtered = filtered.filter(event => event.budget_range === budgetFilter);
    }

    // Sort by match score
    filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    setFilteredEvents(filtered);
  };

  const toggleBookmark = (eventId: string) => {
    const newBookmarks = new Set(bookmarkedEvents);
    if (newBookmarks.has(eventId)) {
      newBookmarks.delete(eventId);
    } else {
      newBookmarks.add(eventId);
    }
    setBookmarkedEvents(newBookmarks);
  };

  const initiateContact = async (eventId: string) => {
    if (!user || !sponsorProfile) {
      toast({
        title: 'Profile Required',
        description: 'Complete your company profile to contact event organizers',
        variant: 'destructive'
      });
      return;
    }

    try {
      const event = events.find(e => e.id === eventId);
      const { error } = await supabase
        .from('matches')
        .insert([{
          event_id: eventId,
          sponsor_id: sponsorProfile.id,
          match_score: event?.match_score || 0.5,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: 'Interest Sent!',
        description: 'Your sponsorship interest has been sent to the event organizer'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send sponsorship interest',
        variant: 'destructive'
      });
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
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Discover Events</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EVENT_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={audienceFilter} onValueChange={setAudienceFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCE_RANGES.map(range => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map(range => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Event Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {event.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">
                      {Math.round((event.match_score || 0) * 100)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Match</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(event.id)}
                  className={bookmarkedEvents.has(event.id) ? 'text-primary' : ''}
                >
                  <Heart className={`h-4 w-4 ${bookmarkedEvents.has(event.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{event.audience_size} attendees</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(event.event_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{event.budget_range}</span>
              </div>
            </div>

            {event.engagement_metrics && (
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium text-sm">Past Performance</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span>Attendance: {event.engagement_metrics.past_attendance || 'N/A'}</span>
                  <span>Social Reach: {event.engagement_metrics.social_media_reach || 'N/A'}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="hero"
                size="sm"
                onClick={() => initiateContact(event.id)}
                className="flex-1 gap-2"
              >
                <Contact className="h-4 w-4" />
                Express Interest
              </Button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="p-12 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms to find relevant events.
          </p>
        </Card>
      )}
    </div>
  );
};

export default EventDiscoveryFeed;