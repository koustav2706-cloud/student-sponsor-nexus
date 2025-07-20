import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_email: string;
  created_at: string;
}

const ChatRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock chat functionality since we don't have messages table yet
  const mockMessages: Message[] = [
    {
      id: "1",
      content: "Hi! I'm interested in sponsoring your event. Could you tell me more about the expected audience?",
      sender_id: "sponsor-1",
      sender_email: "sponsor@techcorp.com",
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "2", 
      content: "Hello! Thanks for your interest. We're expecting around 500 students, primarily from Computer Science and Engineering programs.",
      sender_id: "student-1",
      sender_email: "organizer@university.edu",
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: "3",
      content: "That sounds perfect for our target demographic. What sponsorship packages do you have available?",
      sender_id: "sponsor-1", 
      sender_email: "sponsor@techcorp.com",
      created_at: new Date(Date.now() - 900000).toISOString()
    }
  ];

  useEffect(() => {
    // Load mock messages
    setMessages(mockMessages);
  }, [roomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    
    // Mock sending message
    const mockNewMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user.id,
      sender_email: user.email || "user@example.com",
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, mockNewMessage]);
    setNewMessage("");
    setLoading(false);
    toast.success("Message sent!");
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background bg-particles">
      <div className="absolute inset-0 bg-aurora-pattern opacity-10"></div>
      
      <div className="relative max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 p-4 glass-nav rounded-lg">
          <Button variant="ghost" size="sm" asChild className="glass-effect">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Chat Room</h1>
            <p className="text-sm text-muted-foreground">Room ID: {roomId}</p>
          </div>
        </div>

        {/* Messages */}
        <Card className="glass-card mb-4 h-96 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender_id === user.id ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {message.sender_email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === user.id
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "glass-effect"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="glass-effect border-primary/20 flex-1"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading || !newMessage.trim()}
            className="glass-effect hover:bg-primary/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Demo Notice */}
        <div className="mt-4 p-3 glass-effect rounded-lg border border-accent/20">
          <p className="text-sm text-accent">
            <strong>Demo Mode:</strong> This is a preview of the chat functionality. 
            Messages are not persisted and this is for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;