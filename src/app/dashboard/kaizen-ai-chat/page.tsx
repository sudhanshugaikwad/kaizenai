'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { chatWithCoach } from '@/ai/flows/career-chat';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, User, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters."),
});

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function KaizenAiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { sender: 'user', text: values.question };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await chatWithCoach(values);
      const botMessage: Message = { sender: 'bot', text: result.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get chat response:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      // Revert the user message if the bot fails to respond
      setMessages((prev) => prev.slice(0, prev.length -1));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Kaizen AI Chat</h1>
        <p className="text-muted-foreground">Ask me anything about your career path, interviews, or skills!</p>
      </div>

      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow p-0 flex flex-col">
          <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
             <div className="space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                   <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.sender === 'bot' && (
                      <Avatar className="h-8 w-8 border">
                         <AvatarFallback><Bot/></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-lg px-4 py-3 max-w-lg break-words ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border shadow-sm'}`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                     {message.sender === 'user' && (
                       <Avatar className="h-8 w-8">
                          <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                          <AvatarFallback><User/></AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
               {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                     <Avatar className="h-8 w-8 border">
                       <AvatarFallback><Bot/></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-3 bg-muted flex items-center shadow-sm">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </motion.div>
                )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField control={form.control} name="question" render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="e.g., How should I prepare for a product manager interview?" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
