import { useState } from "react";
import { Bell, X, CheckCircle, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: "match" | "message" | "event" | "sponsor";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "match",
      title: "New Match Found!",
      message: "TechCorp is interested in sponsoring your hackathon event",
      timestamp: "2 minutes ago",
      read: false,
      avatar: "TC"
    },
    {
      id: "2", 
      type: "message",
      title: "Message from InnovateTech",
      message: "We'd like to discuss sponsorship opportunities...",
      timestamp: "1 hour ago",
      read: false,
      avatar: "IT"
    },
    {
      id: "3",
      type: "event",
      title: "Event Analytics Update",
      message: "Your Tech Conference reached 95% capacity",
      timestamp: "3 hours ago",
      read: true
    },
    {
      id: "4",
      type: "sponsor",
      title: "Sponsorship Confirmed",
      message: "GreenTech Solutions confirmed $5,000 sponsorship",
      timestamp: "1 day ago",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const getIcon = (type: string) => {
    switch (type) {
      case "match":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-primary" />;
      case "event":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
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
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                  !notification.read ? "bg-primary/5 border-l-4 border-l-primary" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {notification.avatar ? (
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs font-semibold text-primary-foreground">
                        {notification.avatar}
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full" size="sm">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;