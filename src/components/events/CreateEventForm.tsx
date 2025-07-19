import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateEventFormProps {
  onClose: () => void;
  onEventCreated: () => void;
}

const CreateEventForm = ({ onClose, onEventCreated }: CreateEventFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [eventDate, setEventDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    audience_size: '',
    location: '',
    budget_range: '',
    engagement_metrics: {
      past_attendance: '',
      social_media_reach: '',
      website_visits: '',
      conversion_rate: ''
    }
  });

  const categories = [
    'Technology',
    'Cultural',
    'Sports',
    'Academic',
    'Business',
    'Arts',
    'Music',
    'Career',
    'Health & Wellness',
    'Social Impact'
  ];

  const budgetRanges = [
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !eventDate) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('events')
        .insert({
          organizer_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          audience_size: parseInt(formData.audience_size),
          location: formData.location,
          event_date: eventDate.toISOString(),
          budget_range: formData.budget_range,
          engagement_metrics: formData.engagement_metrics
        });

      if (error) throw error;

      toast({
        title: "Event created successfully!",
        description: "Your event is now live and ready to attract sponsors.",
      });

      onEventCreated();
      onClose();
    } catch (error) {
      toast({
        title: "Error creating event",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateEngagementMetrics = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      engagement_metrics: {
        ...prev.engagement_metrics,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Event Details</h3>
            
            <div>
              <Label htmlFor="title">Event Name *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Enter event name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe your event, its purpose, and what makes it special..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="audience_size">Expected Attendance *</Label>
                <Input
                  id="audience_size"
                  type="number"
                  value={formData.audience_size}
                  onChange={(e) => updateFormData('audience_size', e.target.value)}
                  placeholder="Number of attendees"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="Event venue/location"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Sponsorship Budget Needed</Label>
              <Select value={formData.budget_range} onValueChange={(value) => updateFormData('budget_range', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map(range => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Past Event Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Past Event Performance (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              Help sponsors understand your track record and event impact
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="past_attendance">Previous Event Attendance</Label>
                <Input
                  id="past_attendance"
                  type="number"
                  value={formData.engagement_metrics.past_attendance}
                  onChange={(e) => updateEngagementMetrics('past_attendance', e.target.value)}
                  placeholder="Average attendance"
                />
              </div>

              <div>
                <Label htmlFor="social_media_reach">Social Media Reach</Label>
                <Input
                  id="social_media_reach"
                  type="number"
                  value={formData.engagement_metrics.social_media_reach}
                  onChange={(e) => updateEngagementMetrics('social_media_reach', e.target.value)}
                  placeholder="Followers/impressions"
                />
              </div>

              <div>
                <Label htmlFor="website_visits">Website/Event Page Visits</Label>
                <Input
                  id="website_visits"
                  type="number"
                  value={formData.engagement_metrics.website_visits}
                  onChange={(e) => updateEngagementMetrics('website_visits', e.target.value)}
                  placeholder="Monthly visitors"
                />
              </div>

              <div>
                <Label htmlFor="conversion_rate">Engagement Rate (%)</Label>
                <Input
                  id="conversion_rate"
                  type="number"
                  value={formData.engagement_metrics.conversion_rate}
                  onChange={(e) => updateEngagementMetrics('conversion_rate', e.target.value)}
                  placeholder="Engagement percentage"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateEventForm;