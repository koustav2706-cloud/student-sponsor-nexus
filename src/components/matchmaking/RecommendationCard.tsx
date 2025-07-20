import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Heart, 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Users,
  DollarSign,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RecommendationCardProps {
  recommendation: any;
  userRole: 'student' | 'sponsor';
  onUpdate?: () => void;
}

export function RecommendationCard({ 
  recommendation, 
  userRole, 
  onUpdate 
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const entity = userRole === 'student' ? recommendation.sponsors : recommendation.events;
  
  if (!entity) return null;

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.functions.invoke('ai-matchmaking', {
        body: {
          action: 'updateMatchStatus',
          eventId: recommendation.events?.id,
          sponsorId: recommendation.sponsors?.id,
          status: newStatus,
          is_viewed: true
        }
      });

      if (error) throw error;
      
      toast.success(`Status updated to ${newStatus}`);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <Card className="p-6 neumorphic neumorphic-hover transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {userRole === 'student' ? entity.company_name : entity.title}
          </h3>
          <Badge variant="outline" className={`${getScoreColor(recommendation.match_score)} border-current`}>
            {recommendation.match_score}% Match
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <Progress value={recommendation.match_score} className="h-2 mb-4" />
      
      <p className="text-sm text-muted-foreground mb-4">
        {recommendation.reasoning}
      </p>

      <div className="flex gap-2">
        <Button variant="hero" size="sm" onClick={() => updateStatus('interested')} disabled={isUpdating}>
          <Heart className="h-4 w-4 mr-1" />
          Interested
        </Button>
        <Button variant="outline" size="sm" onClick={() => updateStatus('contacted')} disabled={isUpdating}>
          <MessageCircle className="h-4 w-4 mr-1" />
          Contact
        </Button>
      </div>
    </Card>
  );
}