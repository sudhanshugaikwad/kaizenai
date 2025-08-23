
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, ArrowLeft, Wand2, Star, User, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { BehavioralCoachInputSchema, rewriteWithSTAR, type BehavioralCoachOutput } from '@/ai/flows/behavioral-coach';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Input } from '@/components/ui/input';


export default function BehavioralCoachPage() {
  const [result, setResult] = useState<BehavioralCoachOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof BehavioralCoachInputSchema>>({
    resolver: zodResolver(BehavioralCoachInputSchema),
    defaultValues: {
      question: '',
      situation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof BehavioralCoachInputSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const coachResult = await rewriteWithSTAR(values);
      setResult(coachResult);
    } catch (error) {
      console.error('Failed to get coaching:', error);
      toast({
        title: "Error",
        description: "Failed to get coaching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Behavioral Interview Coach</h1>
            <p className="text-muted-foreground">Transform your experiences into powerful, structured stories.</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <motion.div variants={itemVariants}>
            <Card>
                <CardHeader>
                    <CardTitle>Describe Your Experience</CardTitle>
                    <CardDescription>Tell the AI about a time you faced a challenge, led a project, or achieved a goal. The more detail, the better!</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="question" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interview Question (Optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., Tell me about a time you handled a conflict." {...field} /></FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="situation" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Story</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the situation, what you did, and what the outcome was..."
                                        rows={10}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Coaching...</> : <><Wand2 className="mr-2 h-4 w-4" />Get STAR Feedback</>}
                        </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </motion.div>

         <motion.div variants={itemVariants}>
            {isLoading && (
                <Card className="h-[500px] flex flex-col items-center justify-center">
                    <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg text-muted-foreground">Your AI coach is preparing your answers...</p>
                </Card>
            )}

            {!result && !isLoading && (
                 <Card className="h-[500px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed">
                    <Bot className="h-16 w-16 text-muted-foreground/30" />
                    <p className="mt-4 text-lg font-medium">Your AI-powered answers will appear here</p>
                    <p className="text-muted-foreground">Describe an experience to get started.</p>
                </Card>
            )}

            {result && (
                <Tabs defaultValue="formalAnswer">
                    <div className="flex justify-center">
                        <TabsList>
                            <TabsTrigger value="formalAnswer">Formal</TabsTrigger>
                            <TabsTrigger value="conversationalAnswer">Conversational</TabsTrigger>
                            <TabsTrigger value="leadershipAnswer">Leadership</TabsTrigger>
                            <TabsTrigger value="starMethod">STAR Breakdown</TabsTrigger>
                        </TabsList>
                    </div>
                    <Card className="mt-4">
                        <CardContent className="p-6 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {Object.entries(result).map(([key, value]) => (
                                     <TabsContent value={key} key={key} asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                                        >
                                            {typeof value === 'string' ? (
                                                <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                                                    {value}
                                                </ReactMarkdown>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div><h4 className="font-bold text-foreground">Situation:</h4><p>{value.situation}</p></div>
                                                    <div><h4 className="font-bold text-foreground">Task:</h4><p>{value.task}</p></div>
                                                    <div><h4 className="font-bold text-foreground">Action:</h4><p>{value.action}</p></div>
                                                    <div><h4 className="font-bold text-foreground">Result:</h4><p>{value.result}</p></div>
                                                </div>
                                            )}
                                        </motion.div>
                                     </TabsContent>
                                ))}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </Tabs>
            )}
        </motion.div>
      </div>
    </motion.div>
  );
}
