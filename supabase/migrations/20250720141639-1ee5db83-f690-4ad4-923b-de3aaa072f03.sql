-- Create AI matchmaking tables for the recommendation system

-- Create recommendations table to store AI-generated matches
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  reasoning TEXT NOT NULL,
  factors JSONB NOT NULL DEFAULT '{}',
  is_viewed BOOLEAN NOT NULL DEFAULT FALSE,
  is_starred BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'interested', 'contacted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, sponsor_id)
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  new_matches_email BOOLEAN NOT NULL DEFAULT TRUE,
  new_matches_push BOOLEAN NOT NULL DEFAULT TRUE,
  match_updates_email BOOLEAN NOT NULL DEFAULT TRUE,
  match_updates_push BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create match history table for tracking interactions
CREATE TABLE public.match_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('viewed', 'starred', 'contacted', 'rejected', 'interested')),
  actor_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recommendations
CREATE POLICY "Users can view recommendations for their events/sponsors"
ON public.recommendations
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = recommendations.event_id AND events.organizer_id = auth.uid())
  OR
  EXISTS (SELECT 1 FROM public.sponsors WHERE sponsors.id = recommendations.sponsor_id AND sponsors.user_id = auth.uid())
);

CREATE POLICY "Users can update recommendations for their events/sponsors"
ON public.recommendations
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = recommendations.event_id AND events.organizer_id = auth.uid())
  OR
  EXISTS (SELECT 1 FROM public.sponsors WHERE sponsors.id = recommendations.sponsor_id AND sponsors.user_id = auth.uid())
);

-- RLS Policies for notification preferences
CREATE POLICY "Users can manage their own notification preferences"
ON public.notification_preferences
FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for match history
CREATE POLICY "Users can view match history for their recommendations"
ON public.match_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.recommendations r
    WHERE r.id = match_history.recommendation_id
    AND (
      EXISTS (SELECT 1 FROM public.events WHERE events.id = r.event_id AND events.organizer_id = auth.uid())
      OR
      EXISTS (SELECT 1 FROM public.sponsors WHERE sponsors.id = r.sponsor_id AND sponsors.user_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can create match history for their recommendations"
ON public.match_history
FOR INSERT
WITH CHECK (
  actor_id = auth.uid()
  AND
  EXISTS (
    SELECT 1 FROM public.recommendations r
    WHERE r.id = match_history.recommendation_id
    AND (
      EXISTS (SELECT 1 FROM public.events WHERE events.id = r.event_id AND events.organizer_id = auth.uid())
      OR
      EXISTS (SELECT 1 FROM public.sponsors WHERE sponsors.id = r.sponsor_id AND sponsors.user_id = auth.uid())
    )
  )
);

-- Create indexes for better performance
CREATE INDEX idx_recommendations_event_id ON public.recommendations(event_id);
CREATE INDEX idx_recommendations_sponsor_id ON public.recommendations(sponsor_id);
CREATE INDEX idx_recommendations_match_score ON public.recommendations(match_score DESC);
CREATE INDEX idx_recommendations_created_at ON public.recommendations(created_at DESC);
CREATE INDEX idx_match_history_recommendation_id ON public.match_history(recommendation_id);

-- Create triggers for updated_at
CREATE TRIGGER update_recommendations_updated_at
  BEFORE UPDATE ON public.recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();