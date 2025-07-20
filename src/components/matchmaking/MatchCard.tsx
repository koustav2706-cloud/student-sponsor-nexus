import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { OptimizedImage } from '@/components/ui/image';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  DollarSign,
  Building2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: {
    id: string;
    score: number;
    reasoning: string;
    factors: {
      industry_alignment?: number;
      budget_compatibility?: number;
      audience_fit?: number;
      location_proximity?: number;
      marketing_alignment?: number;
    };
    entity: {
      id: string;
      name: string;
      type: 'event' | 'sponsor';
      image?: string;
      category?: string;
      industry?: string;
      location?: string;
      budget?: string;
      audience_size?: number;
      date?: string;
    };
  };
  onConnect: (id: string) => void;
  onSave: (id: string) => void;
  onViewDetails: (id: string) => void;
  className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onConnect,
  onSave,
  onViewDetails,
  className
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'match-score-excellent';
    if (score >= 70) return 'match-score-good';
    if (score >= 55) return 'match-score-fair';
    return 'match-score-poor';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 55) return 'Fair Match';
    return 'Poor Match';
  };

  const formatFactorName = (factor: string) => {
    return factor.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className={cn(
      'group relative overflow-hidden hover-lift neumorphic border-2 transition-all duration-300',
      'hover:border-primary/30 hover:shadow-floating',
      className
    )}>
      {/* Match Score Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={cn(
          'px-3 py-1 rounded-full text-sm font-bold shadow-lg',
          getScoreColor(match.score)
        )}>
          {match.score}% Match
        </div>
      </div>

      {/* Entity Image */}
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={match.entity.image || '/placeholder.svg'}
          alt={match.entity.name}
          className="w-full h-full"
          fallbackSrc="/placeholder.svg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Entity Type Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {match.entity.type === 'event' ? (
              <Calendar className="w-3 h-3 mr-1" />
            ) : (
              <Building2 className="w-3 h-3 mr-1" />
            )}
            {match.entity.type === 'event' ? 'Event' : 'Sponsor'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
            {match.entity.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {match.entity.category && (
              <Badge variant="outline" className="text-xs">
                {match.entity.category}
              </Badge>
            )}
            {match.entity.industry && (
              <Badge variant="outline" className="text-xs">
                {match.entity.industry}
              </Badge>
            )}
          </div>
        </div>

        {/* Match Score Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              {getScoreLabel(match.score)}
            </span>
            <span className="text-sm text-muted-foreground">
              {match.score}%
            </span>
          </div>
          <Progress value={match.score} className="h-2" />
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {match.entity.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{match.entity.location}</span>
            </div>
          )}
          
          {match.entity.budget && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{match.entity.budget}</span>
            </div>
          )}
          
          {match.entity.audience_size && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{match.entity.audience_size.toLocaleString()} attendees</span>
            </div>
          )}
          
          {match.entity.date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{new Date(match.entity.date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Matching Factors */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Match Factors</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(match.factors).map(([factor, score]) => (
              <div key={factor} className="flex justify-between items-center">
                <span className="text-muted-foreground truncate">
                  {formatFactorName(factor)}
                </span>
                <span className={cn(
                  'font-medium',
                  score >= 80 ? 'text-green-600' : 
                  score >= 60 ? 'text-yellow-600' : 'text-red-600'
                )}>
                  {score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {match.reasoning}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onConnect(match.entity.id)}
            className="flex-1 gap-2"
            variant="hero"
          >
            <MessageCircle className="w-4 h-4" />
            Connect Now
          </Button>
          
          <Button 
            onClick={() => onSave(match.entity.id)}
            variant="outline"
            size="icon"
            className="hover:bg-accent/10"
          >
            <Heart className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={() => onViewDetails(match.entity.id)}
            variant="outline"
            size="icon"
            className="hover:bg-accent/10"
          >
            <Star className="w-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};