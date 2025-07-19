import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Building2, Settings } from 'lucide-react';

const formSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  marketing_goals: z.string().min(10, 'Please describe your marketing goals'),
  budget_range: z.string().min(1, 'Please select a budget range'),
  target_demographics: z.array(z.string()).min(1, 'Select at least one demographic'),
});

interface CompanyProfileFormProps {
  profile?: any;
  onProfileUpdate?: () => void;
}

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
  'Manufacturing', 'Consulting', 'Media & Entertainment', 'Real Estate',
  'Transportation', 'Energy', 'Food & Beverage', 'Gaming', 'Other'
];

const BUDGET_RANGES = [
  '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000',
  '$5,000 - $10,000', '$10,000 - $25,000', '$25,000+'
];

const DEMOGRAPHICS = [
  'College Students', 'Young Professionals', 'Tech Enthusiasts',
  'Creative Artists', 'Entrepreneurs', 'Athletes', 'Researchers',
  'International Students', 'Graduate Students', 'Early Career'
];

const CompanyProfileForm = ({ profile, onProfileUpdate }: CompanyProfileFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: profile?.company_name || '',
      industry: profile?.industry || '',
      marketing_goals: profile?.marketing_goals || '',
      budget_range: profile?.budget_range || '',
      target_demographics: profile?.target_demographics || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = profile 
        ? await supabase
            .from('sponsors')
            .update(values)
            .eq('user_id', user.id)
        : await supabase
            .from('sponsors')
            .insert([{ ...values, user_id: user.id } as any]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Company profile ${profile ? 'updated' : 'created'} successfully`,
      });

      setOpen(false);
      onProfileUpdate?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save company profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={profile ? "ghost" : "hero"} className="gap-2">
          {profile ? <Settings className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
          {profile ? 'Edit Profile' : 'Complete Profile'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {profile ? 'Update Company Profile' : 'Create Company Profile'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget_range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsorship Budget Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BUDGET_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketing_goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marketing Goals & Objectives</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your marketing goals, target outcomes, and what you hope to achieve through sponsorships..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_demographics"
              render={() => (
                <FormItem>
                  <FormLabel>Target Demographics</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {DEMOGRAPHICS.map((demographic) => (
                      <FormField
                        key={demographic}
                        control={form.control}
                        name="target_demographics"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(demographic)}
                                onCheckedChange={(checked) => {
                                  const value = field.value || [];
                                  if (checked) {
                                    field.onChange([...value, demographic]);
                                  } else {
                                    field.onChange(value.filter((item) => item !== demographic));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-sm">
                              {demographic}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyProfileForm;