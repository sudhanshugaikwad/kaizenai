
'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { generateAgentRoadmap, type AgentRoadmapOutput } from '@/ai/flows/agent-roadmap-generator';
import Editor from '@monaco-editor/react';
import ReactFlow, {
  Controls,
  Background,
  Panel,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, ArrowLeft, Plus, Milestone, Check, ChevronsUpDown, XIcon, Bot, Copy, Download, FileJson } from 'lucide-react';
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

// Function to arrange nodes in a simple top-to-bottom layout
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
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [generatedOutput, setGeneratedOutput] = useState<AgentRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleSelectAgent = (agent: string) => {
    setSelectedAgents(prev => 
        prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
  };

  const onSubmit = useCallback(async () => {
    if (selectedAgents.length === 0) {
        toast({ title: "No agents selected", description: "Please select at least one agent type to generate a roadmap.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    setGeneratedOutput(null);
    try {
      const result = await generateAgentRoadmap({ agentTypes: selectedAgents });
      setGeneratedOutput(result);
      toast({ title: "Roadmaps Generated!", description: "Your AI agent roadmaps and JSON file are ready."});
    } catch (error) {
      console.error('Failed to generate agent roadmaps:', error);
      toast({
        title: "Error",
        description: "Failed to generate roadmaps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgents, toast]);

  const handleNew = () => {
    setSelectedAgents([]);
    setGeneratedOutput(null);
    setIsLoading(false);
  }
  
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
    a.download = `kaizen-ai-n8n-workflow.json`;
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
            <p className="text-muted-foreground">Select agent types to generate and visualize their workflow roadmaps.</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard">
                <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Dashboard</Button>
            </Link>
             <Button onClick={handleNew}><Plus className="mr-2 h-4 w-4"/> New</Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow space-y-2">
                        <label className="text-sm font-medium">Select Agent Types</label>
                         <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                                >
                                {selectedAgents.length > 0 ? `${selectedAgents.length} selected` : "Select agent types..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search agent type..." />
                                    <CommandList>
                                        <CommandEmpty>No agent type found.</CommandEmpty>
                                        <CommandGroup>
                                            {agentTypes.map((agent) => (
                                            <CommandItem
                                                key={agent}
                                                value={agent}
                                                onSelect={() => handleSelectAgent(agent)}
                                            >
                                                <Check className="mr-2 h-4 w-4" style={{ opacity: selectedAgents.includes(agent) ? 1 : 0 }} />
                                                {agent}
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                     <Button onClick={onSubmit} disabled={isLoading || selectedAgents.length === 0} className="self-end">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Roadmaps</>}
                    </Button>
                </div>
                 {selectedAgents.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {selectedAgents.map(agent => (
                            <Badge key={agent} variant="secondary">
                                {agent}
                                <button onClick={() => handleSelectAgent(agent)} className="ml-1.5 rounded-full p-0.5 hover:bg-background/50">
                                    <XIcon className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                 )}
            </CardContent>
        </Card>
      </motion.div>
        
      <div className="space-y-4">
        {isLoading && (
        <motion.div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-96" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Our AI architect is designing your agent roadmaps...</p>
        </motion.div>
        )}

        {!isLoading && !generatedOutput && (
        <motion.div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-96 text-center p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Bot className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg font-medium">Your agent roadmaps will appear here</p>
            <p className="text-muted-foreground">Select one or more agent types and click "Generate" to get started.</p>
        </motion.div>
        )}
            
        {generatedOutput && generatedOutput.roadmaps.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
            <Tabs defaultValue={generatedOutput.roadmaps[0].agentType}>
                <div className="flex justify-between items-center">
                    <TabsList>
                        {generatedOutput.roadmaps.map(roadmap => (
                            <TabsTrigger key={roadmap.agentType} value={roadmap.agentType}>{roadmap.agentType}</TabsTrigger>
                        ))}
                         <TabsTrigger value="export-json"><FileJson className="mr-2 h-4 w-4"/>Export</TabsTrigger>
                    </TabsList>
                </div>
                {generatedOutput.roadmaps.map(roadmap => {
                    const { nodes, edges } = getLayoutedElements(roadmap.workflowSteps);
                    return (
                         <TabsContent value={roadmap.agentType} key={roadmap.agentType}>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Workflow for {roadmap.agentType}</CardTitle>
                                    <CardDescription>{roadmap.summary}</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-1">
                                         <Accordion type="single" collapsible className="w-full" defaultValue="step-1">
                                            {roadmap.workflowSteps.map((step) => (
                                                <AccordionItem value={step.id} key={step.id}>
                                                    <AccordionTrigger><Milestone className="mr-2 h-4 w-4 text-primary"/>{step.title}</AccordionTrigger>
                                                    <AccordionContent>{step.description}</AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                    <div className="lg:col-span-2 h-[500px] border rounded-lg">
                                        <ReactFlow
                                            nodes={nodes}
                                            edges={edges}
                                            fitView
                                        >
                                            <Controls />
                                            <Background />
                                            <Panel position="top-right">
                                                <div className="p-2 bg-card border rounded-md shadow-md">
                                                    Workflow Visualization
                                                </div>
                                            </Panel>
                                        </ReactFlow>
                                    </div>
                                </CardContent>
                             </Card>
                         </TabsContent>
                    )
                })}
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
                                    value={JSON.stringify(JSON.parse(generatedOutput.n8nWorkflowJson), null, 2)}
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
