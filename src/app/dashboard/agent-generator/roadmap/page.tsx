
'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateAgentRoadmap, type AgentRoadmapOutput } from '@/ai/flows/agent-roadmap-generator';
import { generateAgentDescription } from '@/ai/flows/agent-description-generator';
import Editor from '@monaco-editor/react';
import ReactFlow, { Controls, Background, type Node, type Edge } from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, ArrowLeft, Plus, Milestone, Copy, Download, FileJson, Bot, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const agentTypes = [
    "Data Analysis Agent", "Research Assistant Agent", "Code Generation Agent", "QA & Testing Agent", "Knowledge Base Agent", "Task Automation Agent", 
    "Workflow Optimizer Agent", "Recommendation Engine Agent", "Sentiment Analysis Agent", "Monitoring & Alerts Agent", "Copywriting Agent", "Blog/Article Writing Agent", 
    "Storytelling Agent", "Social Media Post Agent", "Marketing Strategy Agent", "Design & Graphics Agent", "Music Composition Agent", "Video Script Agent", 
    "Visual AI/Art Agent", "Meme Generator Agent", "Customer Support Agent", "Sales Assistant Agent", "Lead Generation Agent", "Financial Forecasting Agent", 
    "HR Recruitment Agent", "Project Management Agent", "Meeting Summarizer Agent", "Document Summarizer Agent", "Email Automation Agent", "Scheduling & Calendar Agent", 
    "DevOps Assistant Agent", "Bug Fixing Agent", "API Integration Agent", "Database Management Agent", "Network Security Agent", "Cloud Optimization Agent", 
    "Code Review Agent", "CI/CD Pipeline Agent", "Script Automation Agent", "System Monitoring Agent", "Personal Productivity Agent", "Health & Fitness Agent", 
    "Meal Planning Agent", "Travel Planner Agent", "Language Learning Agent", "Meditation & Mindfulness Agent", "Habit Tracking Agent", "Personal Finance Agent", 
    "Virtual Companion Agent", "Smart Home Control Agent"
];

const formSchema = z.object({
    agentName: z.string().min(3, "Agent name must be at least 3 characters."),
    agentType: z.string({ required_error: "Please select an agent type." }),
    agentDescription: z.string().min(10, "Description must be at least 10 characters."),
});

const getLayoutedElements = (steps: any[], yOffset = 0) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeHeight = 80;
    const verticalSpacing = 40;

    steps.forEach((step, index) => {
        const nodeId = `${step.id}`;
        nodes.push({
            id: nodeId,
            type: 'default',
            data: { label: step.title },
            position: { x: 0, y: yOffset + index * (nodeHeight + verticalSpacing) },
            style: { width: 250, textAlign: 'center' },
        });

        if (index > 0) {
            edges.push({
                id: `e${steps[index - 1].id}-${nodeId}`,
                source: `${steps[index-1].id}`,
                target: nodeId,
                type: 'smoothstep',
                animated: true,
            });
        }
    });
    return { nodes, edges };
};

export default function AgentRoadmapGeneratorPage() {
  const [generatedOutput, setGeneratedOutput] = useState<AgentRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDescLoading, setIsDescLoading] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { agentName: '', agentType: '', agentDescription: '' },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setGeneratedOutput(null);
    try {
      const result = await generateAgentRoadmap(values);
      setGeneratedOutput(result);
      toast({ title: "Roadmap Generated!", description: "Your AI agent roadmap and JSON file are ready."});
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

  const handleGenerateDescription = async () => {
    const agentName = form.getValues('agentName');
    const agentType = form.getValues('agentType');
    if (!agentName || !agentType) {
        toast({ title: "Name and Type required", description: "Please enter an agent name and select a type first.", variant: "destructive" });
        return;
    }
    setIsDescLoading(true);
    try {
        const result = await generateAgentDescription({ agentName, agentType });
        form.setValue('agentDescription', result.description);
    } catch (error) {
        toast({ title: "Error", description: "Could not generate description.", variant: "destructive" });
    } finally {
        setIsDescLoading(false);
    }
  };

  const handleNew = () => {
    form.reset({ agentName: '', agentType: '', agentDescription: '' });
    setGeneratedOutput(null);
    setIsLoading(false);
  };
  
  const handleCopyJson = () => {
    if (!generatedOutput?.n8nWorkflowJson) return;
    navigator.clipboard.writeText(generatedOutput.n8nWorkflowJson);
    toast({ title: "Copied!", description: "n8n workflow JSON copied to clipboard." });
  };

  const handleDownloadJson = () => {
    if (!generatedOutput?.n8nWorkflowJson) return;
    const blob = new Blob([generatedOutput.n8nWorkflowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.getValues('agentName') || 'kaizen-ai'}-n8n-workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: "n8n workflow JSON file saved." });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  
  const prettyJson = useMemo(() => {
    if (!generatedOutput?.n8nWorkflowJson) return '';
    try {
      return JSON.stringify(JSON.parse(generatedOutput.n8nWorkflowJson), null, 2);
    } catch (e) {
      return generatedOutput.n8nWorkflowJson;
    }
  }, [generatedOutput?.n8nWorkflowJson]);

  const { nodes, edges } = useMemo(() => {
    if (!generatedOutput) return { nodes: [], edges: [] };
    return getLayoutedElements(generatedOutput.roadmap.workflowSteps);
  }, [generatedOutput]);

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">AI Agent Roadmap Generator</h1>
            <p className="text-muted-foreground">Select an agent type to generate and visualize its workflow roadmap.</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/agent-generator">
                <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Go Back</Button>
            </Link>
             <Button onClick={handleNew}><Plus className="mr-2 h-4 w-4"/> New</Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="agentName" className="text-sm font-medium">Agent Name</label>
                        <Input id="agentName" {...form.register('agentName')} placeholder="e.g., Customer Support Bot" />
                        {form.formState.errors.agentName && <p className="text-sm text-destructive">{form.formState.errors.agentName.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="agentType" className="text-sm font-medium">Agent Type</label>
                         <Controller
                            name="agentType"
                            control={form.control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an agent type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agentTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {form.formState.errors.agentType && <p className="text-sm text-destructive">{form.formState.errors.agentType.message}</p>}
                    </div>
                </div>
                <div className="space-y-1">
                    <label htmlFor="agentDescription" className="text-sm font-medium">Agent Description</label>
                    <div className="flex items-start gap-2">
                        <Textarea id="agentDescription" {...form.register('agentDescription')} placeholder="Describe what this agent will do." rows={3} />
                        <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isDescLoading}>
                             {isDescLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4" />}
                             <span className="ml-2 hidden sm:inline">Generate</span>
                        </Button>
                    </div>
                     {form.formState.errors.agentDescription && <p className="text-sm text-destructive">{form.formState.errors.agentDescription.message}</p>}
                </div>
                 <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Agent Roadmap</>}
                </Button>
            </CardContent>
            </form>
        </Card>
      </motion.div>
        
      <div className="space-y-4">
        {isLoading && (
        <motion.div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-96" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Our AI architect is designing your agent roadmap...</p>
        </motion.div>
        )}

        {!isLoading && !generatedOutput && (
        <motion.div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-96 text-center p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Bot className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg font-medium">Your agent roadmap will appear here</p>
            <p className="text-muted-foreground">Fill in the details above and click "Generate" to get started.</p>
        </motion.div>
        )}
            
        {generatedOutput && (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
            <Tabs defaultValue="workflow">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="workflow">Workflow Visualization</TabsTrigger>
                        <TabsTrigger value="export-json"><FileJson className="mr-2 h-4 w-4"/>Export</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="workflow">
                    <Card>
                    <CardHeader>
                        <CardTitle>Workflow for {generatedOutput.roadmap.agentType}</CardTitle>
                        <CardDescription>{generatedOutput.roadmap.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <Accordion type="single" collapsible className="w-full" defaultValue="step-1">
                                {generatedOutput.roadmap.workflowSteps.map((step) => (
                                    <AccordionItem value={step.id} key={step.id}>
                                        <AccordionTrigger><Milestone className="mr-2 h-4 w-4 text-primary"/>{step.title}</AccordionTrigger>
                                        <AccordionContent>{step.description}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                        <div className="lg:col-span-2 h-[500px] border rounded-lg">
                            <ReactFlow nodes={nodes} edges={edges} fitView>
                                <Controls />
                                <Background />
                            </ReactFlow>
                        </div>
                    </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="export-json">
                    <Card>
                        <CardHeader>
                            <CardTitle>Export n8n Workflow JSON</CardTitle>
                            <CardDescription>Copy or download the n8n-compatible JSON file to import into your workflow automation tool.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Button onClick={handleCopyJson} variant="outline"><Copy className="mr-2 h-4 w-4"/> Copy JSON</Button>
                                <Button onClick={handleDownloadJson}><Download className="mr-2 h-4 w-4"/> Download .json File</Button>
                            </div>
                            <div className="h-[500px] border rounded-lg overflow-hidden">
                                <Editor
                                    height="100%"
                                    language="json"
                                    value={prettyJson}
                                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
        )}
      </div>
    </motion.div>
  );
}
