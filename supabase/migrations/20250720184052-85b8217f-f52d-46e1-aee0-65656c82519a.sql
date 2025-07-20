-- Create messages table for chat functionality
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view messages in rooms they have access to" 
ON public.messages 
FOR SELECT 
USING (true); -- For demo purposes, allow all users to see messages

CREATE POLICY "Authenticated users can create messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" 
ON public.messages 
FOR DELETE 
USING (auth.uid() = sender_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();