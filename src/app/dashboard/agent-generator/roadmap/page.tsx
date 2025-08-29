
'use client';

import { useState, useRef, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateAgentRoadmap, type AgentRoadmapOutput } from '@/ai/flows/agent-roadmap-generator';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, Download, BookOpen, Lightbulb, Copy, Milestone, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

const formSchema = z.object({
  agentName: z.string().min(3, "Agent name must be at least 3 characters."),
  agentType: z.string().min(3, "Agent type is required."),
  platformName: z.enum(['n8n', 'Make.com', 'Zapier'], { required_error: "Please select a platform."}),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

const agentTypeSuggestions = ["Chatbot", "Data Processor", "API Integrator", "Social Media Poster", "Email Assistant", "Automation Agent"];

export default function AgentRoadmapGeneratorPage() {
  const [roadmap, setRoadmap] = useState<AgentRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: '',
      agentType: '',
      description: '',
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setRoadmap(null);
    try {
      const result = await generateAgentRoadmap(values);
      setRoadmap(result);
      toast({ title: "Roadmap Generated!", description: "Your AI agent roadmap is ready."});
    } catch (error) {
      console.error('Failed to generate agent roadmap:', error);
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleCopyJson = () => {
    if (!roadmap?.jsonOutput) return;
    navigator.clipboard.writeText(JSON.stringify(JSON.parse(roadmap.jsonOutput), null, 2));
    toast({ title: "Copied!", description: "Workflow JSON copied to clipboard." });
  }

  const handleDownloadJson = () => {
    if (!roadmap?.jsonOutput) return;
    const blob = new Blob([JSON.stringify(JSON.parse(roadmap.jsonOutput), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.getValues('agentName').replace(/\s+/g, '_')}_workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: "Workflow saved as a .json file." });
  };


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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">AI Agent Roadmap Generator</h1>
        <p className="text-muted-foreground">Design and build your AI agent with a step-by-step roadmap and importable JSON.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
              <CardDescription>Provide the specifications for your AI agent.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="agentName" render={({ field }) => (
                    <FormItem><FormLabel>Agent Name</FormLabel><FormControl><Input placeholder="e.g., Customer Support Chatbot" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="agentType" render={({ field }) => (
                     <FormItem><FormLabel>Agent Type</FormLabel><FormControl><Input placeholder="e.g., Chatbot, Data Processor" {...field} list="agent-types" /></FormControl>
                     <datalist id="agent-types">
                        {agentTypeSuggestions.map(s => <option key={s} value={s} />)}
                     </datalist>
                     <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="platformName" render={({ field }) => (
                    <FormItem><FormLabel>Platform</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="n8n">n8n.io</SelectItem>
                            <SelectItem value="Make.com">Make.com</SelectItem>
                            <SelectItem value="Zapier">Zapier</SelectItem>
                        </SelectContent>
                    </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe what the agent should do..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Roadmap</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
        
        <div className="space-y-4">
          {isLoading && (
            <motion.div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-full min-h-[400px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Our AI architect is designing your agent...</p>
            </motion.div>
          )}

          {!isLoading && !roadmap && (
            <motion.div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-full text-center p-8 min-h-[400px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Bot className="h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-lg font-medium">Your agent roadmap will appear here</p>
                <p className="text-muted-foreground">Fill out the form to get started.</p>
            </motion.div>
          )}
            
          {roadmap && (
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Agent Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{roadmap.summary}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Milestone />Workflow Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {roadmap.workflowSteps.map((step, index) => (
                                    <AccordionItem value={`step-${index}`} key={step.id}>
                                        <AccordionTrigger>{step.title}</AccordionTrigger>
                                        <AccordionContent>{step.description}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Importable JSON</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleCopyJson}><Copy className="mr-2 h-4 w-4"/> Copy JSON</Button>
                                <Button variant="outline" size="sm" onClick={handleDownloadJson}><Download className="mr-2 h-4 w-4"/> Download JSON</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="h-80 w-full rounded-md overflow-hidden border bg-muted/30">
                                <Editor
                                    height="100%"
                                    language="json"
                                    value={JSON.stringify(JSON.parse(roadmap.jsonOutput), null, 2)}
                                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12 }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                 <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen />Resources & Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {roadmap.resourcesAndTips.map((item, index) => (
                                    <AccordionItem value={`resource-${index}`} key={index}>
                                        <AccordionTrigger><Lightbulb className="mr-2 h-4 w-4 text-yellow-400"/>{item.title}</AccordionTrigger>
                                        <AccordionContent>{item.content}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
