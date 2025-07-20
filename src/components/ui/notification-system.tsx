import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  X, 
  Settings, 
  Star, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'match' | 'message' | 'event' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

interface NotificationSystemProps {
  className?: string;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ className }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highMatches: true,
    weeklyDigest: true,
    inApp: true,
    email: true,
    push: false
  });

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupRealtimeSubscription();
      loadNotificationSettings();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Simulate fetching notifications - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'match',
          title: 'New High-Quality Match!',
          message: 'TechCorp is a 92% match for your AI Workshop event',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high'
        },
        {
          id: '2',
          type: 'message',
          title: 'Message from InnovateTech',
          message: 'We\'d like to discuss sponsorship opportunities...',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'event',
          title: 'Event Reminder',
          message: 'Your Tech Summit is in 3 days',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'medium'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    // Set up real-time subscription for new matches
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'recommendations' 
        }, 
        (payload) => {
          const newRecommendation = payload.new as any;
          if (newRecommendation.match_score >= 80 && settings.highMatches) {
            const notification: Notification = {
              id: Date.now().toString(),
              type: 'match',
              title: 'New High-Quality Match!',
              message: `${newRecommendation.match_score}% compatibility found`,
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'high'
            };
            
            setNotifications(prev => [notification, ...prev]);
            
            if (settings.inApp) {
              toast.success(notification.title, {
                description: notification.message
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const loadNotificationSettings = async () => {
    try {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (data) {
        setSettings({
          highMatches: data.new_matches_push,
          weeklyDigest: data.match_updates_email,
          inApp: data.new_matches_push,
          email: data.new_matches_email,
          push: data.match_updates_push
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const updateNotificationSettings = async (newSettings: typeof settings) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user?.id,
          new_matches_email: newSettings.email,
          new_matches_push: newSettings.inApp,
          match_updates_email: newSettings.weeklyDigest,
          match_updates_push: newSettings.push
        });

      if (error) throw error;
      
      setSettings(newSettings);
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string, priority: string) => {
    const iconClass = cn(
      'w-5 h-5',
      priority === 'high' ? 'text-red-500' : 
      priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
    );

    switch (type) {
      case 'match':
        return <TrendingUp className={iconClass} />;
      case 'message':
        return <MessageCircle className={iconClass} />;
      case 'event':
        return <Calendar className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={cn('relative', className)}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-hidden z-50 shadow-floating border-2">
          {/* Header */}
          <div className="p-4 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-base">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 border-b hover:bg-muted/30 transition-colors cursor-pointer',
                    !notification.read && 'bg-primary/5 border-l-4 border-l-primary'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type, notification.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground">
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Settings Footer */}
          <div className="p-4 border-t bg-muted/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-matches" className="text-sm">High-quality matches</Label>
                <Switch
                  id="high-matches"
                  checked={settings.highMatches}
                  onCheckedChange={(checked) => 
                    updateNotificationSettings({ ...settings, highMatches: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="weekly-digest" className="text-sm">Weekly digest</Label>
                <Switch
                  id="weekly-digest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => 
                    updateNotificationSettings({ ...settings, weeklyDigest: checked })
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};