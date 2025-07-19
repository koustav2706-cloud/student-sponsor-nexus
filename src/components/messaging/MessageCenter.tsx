import { useState } from "react";
import { MessageSquare, Send, Search, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  type: "sponsor" | "student";
  status: "online" | "offline" | "away";
}

const MessageCenter = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "TechCorp Sponsorship",
      avatar: "TC",
      lastMessage: "We're excited to sponsor your hackathon! When can we discuss details?",
      timestamp: "2m ago",
      unreadCount: 2,
      type: "sponsor",
      status: "online"
    },
    {
      id: "2", 
      name: "InnovateTech Partners",
      avatar: "IP",
      lastMessage: "The sponsorship package looks great. Let's finalize terms.",
      timestamp: "1h ago",
      unreadCount: 0,
      type: "sponsor",
      status: "away"
    },
    {
      id: "3",
      name: "Sarah Chen",
      avatar: "SC",
      lastMessage: "Thanks for connecting us with GreenTech!",
      timestamp: "3h ago", 
      unreadCount: 1,
      type: "student",
      status: "offline"
    }
  ];

  const messages: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        senderId: "tc",
        senderName: "TechCorp Team",
        senderAvatar: "TC",
        content: "Hi! We're very interested in sponsoring your upcoming hackathon. Could you share more details about the expected attendance and demographic?",
        timestamp: "10:30 AM",
        isCurrentUser: false
      },
      {
        id: "2",
        senderId: "user",
        senderName: "You",
        senderAvatar: "U",
        content: "Thanks for your interest! We're expecting 300+ computer science students from top universities. The demographic is 18-25 years old, 60% male, 40% female, with high tech affinity.",
        timestamp: "10:45 AM",
        isCurrentUser: true
      },
      {
        id: "3",
        senderId: "tc",
        senderName: "TechCorp Team",
        senderAvatar: "TC",
        content: "Perfect! That aligns perfectly with our target audience. We're excited to sponsor your hackathon! When can we discuss details?",
        timestamp: "11:20 AM",
        isCurrentUser: false
      }
    ]
  };

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];
  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Handle sending message
    setNewMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-success";
      case "away": return "bg-accent";
      default: return "bg-muted-foreground";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <MessageSquare className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-r bg-muted/20">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-9" />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                    selectedConversation === conversation.id ? "bg-primary/10 border-primary/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground">
                        {conversation.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(conversation.status)}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant={conversation.type === "sponsor" ? "default" : "secondary"} className="text-xs">
                          {conversation.type}
                        </Badge>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground">
                          {currentConversation.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(currentConversation.status)}`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{currentConversation.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{currentConversation.status}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] ${message.isCurrentUser ? "order-2" : ""}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              message.isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-1">
                            {message.timestamp}
                          </p>
                        </div>
                        {!message.isCurrentUser && (
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs font-semibold text-primary-foreground mr-3 flex-shrink-0">
                            {message.senderAvatar}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageCenter;