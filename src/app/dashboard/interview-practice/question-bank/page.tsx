
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Search, ArrowLeft, Lightbulb } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { fetchQuestionBank } from '@/ai/flows/question-bank';
import { QuestionBankInputSchema, type QuestionBankOutput } from '@/ai/flows/question-bank.types';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const questionTypes = ['Technical', 'Behavioral', 'Situational'];
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function QuestionBankPage() {
  const [result, setResult] = useState<QuestionBankOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof QuestionBankInputSchema>>({
    resolver: zodResolver(QuestionBankInputSchema),
    defaultValues: {
      role: '',
      questionType: 'Behavioral',
      difficulty: 'Medium',
    },
  });

  async function onSubmit(values: z.infer<typeof QuestionBankInputSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const questionResult = await fetchQuestionBank(values);
      setResult(questionResult);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch questions. Please try again.",
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
            <h1 className="text-3xl font-bold tracking-tight">Interview Question Bank</h1>
            <p className="text-muted-foreground">Find interview questions by role, type, and difficulty.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
            <CardHeader>
                <CardTitle>Search for Questions</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <FormField control={form.control} name="role" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Role</FormLabel>
                            <FormControl><Input placeholder="e.g., 'React Developer'" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="questionType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>{questionTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="difficulty" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>{difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</> : <><Search className="mr-2 h-4 w-4" />Find Questions</>}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <motion.div className="flex flex-col items-center justify-center pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Our AI is fetching questions...</p>
        </motion.div>
      )}

      {result && result.questions.length > 0 && (
        <motion.div className="space-y-6" variants={containerVariants}>
            <motion.h2 className="text-2xl font-bold tracking-tight" variants={itemVariants}>Found {result.questions.length} Questions</motion.h2>
            <motion.div variants={itemVariants}>
                <Card>
                    <CardContent className="p-0">
                         <Accordion type="single" collapsible className="w-full">
                            {result.questions.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="p-6 text-left font-semibold hover:bg-muted/50">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="p-6 pt-2 bg-muted/30">
                                        <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
                                            <h4 className="font-semibold mb-2 text-foreground">Suggested Answer:</h4>
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                                                {item.answer}
                                            </ReactMarkdown>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
      )}

       {result && result.questions.length === 0 && !isLoading && (
        <motion.div 
            className="flex flex-col items-center justify-center pt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Lightbulb className="w-12 h-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-semibold">No Questions Found</p>
            <p className="text-muted-foreground">We couldn't find any questions for the selected criteria. Try adjusting your filters.</p>
        </motion.div>
       )}
    </motion.div>
  );
}
