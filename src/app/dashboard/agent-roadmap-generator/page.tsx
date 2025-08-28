
'use client';

import { useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, Wand2, ArrowLeft, Plus, Copy, Download, Bot, Milestone, BookOpen, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import ReactFlow, {
  Controls,
  Background,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Link from 'next/link';
import { generateAgentDescription } from '@/ai/flows/agent-description-generator';
import { generateAgentRoadmap, type AgentRoadmapOutput } from '@/ai/flows/agent-roadmap-generator';

const agentTypes = {
    'Chat & Conversation Agents': ['Customer Support Agent', 'FAQ / Knowledge Base Bot', 'Personal Assistant Chatbot', 'Social Media Chatbot', 'Community / Forum Assistant'],
    'Research & Knowledge Agents': ['Data Research Assistant', 'Academic / Scientific Research Agent', 'Market Analysis Agent', 'News & Trend Analysis Bot', 'Legal Research Assistant'],
    'Content & Creativity Agents': ['Copywriting / Marketing Content Agent', 'Blog / Article Generator', 'Storytelling / Creative Writing Agent', 'Video / Script Idea Generator', 'Social Media Content Planner'],
    'Development & Code Agents': ['Code Completion / Helper Agent', 'Code Review / Debugging Agent', 'API Integration Assistant', 'Automation Workflow Agent', 'Test Case / QA Agent'],
    'Business & Productivity Agents': ['Project Management Assistant', 'CRM / Sales Support Agent', 'Workflow Automation Agent', 'Scheduling / Calendar Assistant', 'Meeting Summarizer'],
    'Data & Analytics Agents': ['Data Cleaning / Transformation Agent', 'Business Intelligence Agent', 'KPI / Metrics Dashboard Agent', 'Predictive Analytics Agent', 'Data Visualization Assistant'],
    'Personal / Lifestyle Agents': ['Personal Finance Advisor', 'Health & Fitness Assistant', 'Study / Learning Companion', 'Travel / Trip Planner'],
};

const platformNames = ["n8n", "Make.com", "Zapier", "Custom API"];

const formSchema = z.object({
  agentName: z.string().min(3, "Agent name must be at least 3 characters."),
  agentType: z.string({ required_error: "Please select an agent type." }),
  platformName: z.string({ required_error: "Please select a platform." }),
  description: z.string().optional(),
});

const getTreeLayout = (steps: any[]) => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];
    const nodeWidth = 300;
    const nodeHeight = 150;
    const horizontalSpacing = 50;
    const verticalSpacing = 50;

    steps.forEach((step, index) => {
        const nodeId = `step-${index + 1}`;
        initialNodes.push({
            id: nodeId,
            type: 'default',
            data: { label: (
                 <div className="p-2 text-left">
                    <div className='font-bold text-base mb-1'>{`Step ${index + 1}: ${step.title}`}</div>
                    <div className='text-xs text-muted-foreground'>{step.description}</div>
                </div>
            ) },
            position: { x: (index % 2) * (nodeWidth + horizontalSpacing), y: index * (nodeHeight + verticalSpacing) },
            style: { width: nodeWidth, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' },
        });

        if (index > 0) {
            initialEdges.push({
                id: `e${index}-${index + 1}`,
                source: `step-${index}`,
                target: nodeId,
                type: 'smoothstep',
                animated: true,
            });
        }
    });

    return { nodes: initialNodes, edges: initialEdges };
};


export default function AiAgentRoadmapGeneratorPage() {
    const [roadmap, setRoadmap] = useState<AgentRoadmapOutput | null>(null);
    const [isDescLoading, setIsDescLoading] = useState(false);
    const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agentName: '',
            agentType: '',
            platformName: '',
            description: '',
        },
    });

    const { nodes, edges } = useMemo(() => {
        if (!roadmap) return { nodes: [], edges: [] };
        return getTreeLayout(roadmap.workflowSteps);
    }, [roadmap]);

    const handleGenerateDescription = async () => {
        const { agentName, agentType, platformName } = form.getValues();
        if (!agentName || !agentType || !platformName) {
            toast({ title: "Please fill in all required fields first.", variant: "destructive" });
            return;
        }
        setIsDescLoading(true);
        try {
            const result = await generateAgentDescription({ agentName, agentType, platformName });
            form.setValue('description', result.description);
        } catch (error) {
            console.error("Failed to generate description", error);
            toast({ title: "Error", description: "Could not generate description.", variant: "destructive"});
        } finally {
            setIsDescLoading(false);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsRoadmapLoading(true);
        setRoadmap(null);
        try {
            const result = await generateAgentRoadmap(values);
            setRoadmap(result);
        } catch (error) {
            console.error('Failed to generate roadmap:', error);
            toast({ title: "Error", description: "Failed to generate roadmap.", variant: "destructive" });
        } finally {
            setIsRoadmapLoading(false);
        }
    }

    const handleCopyJson = () => {
        if (!roadmap?.jsonOutput) return;
        navigator.clipboard.writeText(roadmap.jsonOutput);
        toast({ title: "Copied!", description: "JSON output copied to clipboard." });
    }

    const handleDownloadJson = () => {
        if (!roadmap?.jsonOutput) return;
        const blob = new Blob([roadmap.jsonOutput], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form.getValues('agentName') || 'agent'}-workflow.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded!", description: "JSON output saved." });
    }

    const handleNew = () => {
        form.reset();
        setRoadmap(null);
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
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">AI Agent Roadmap Generator</h1>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                        <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Dashboard</Button>
                    </Link>
                    <Button variant="outline" onClick={handleNew}><Plus className="mr-2 h-4 w-4" /> New</Button>
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="agentName" render={({ field }) => (
                                        <FormItem><FormLabel>Agent Name</FormLabel><FormControl><Input placeholder="e.g., SupportMaster 3000" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="agentType" render={({ field }) => (
                                        <FormItem><FormLabel>Agent Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select an agent type" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {Object.entries(agentTypes).map(([group, options]) => (
                                                        <SelectGroup key={group}>
                                                            <SelectLabel>{group}</SelectLabel>
                                                            {options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        <FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="platformName" render={({ field }) => (
                                        <FormItem><FormLabel>Platform Name</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {platformNames.map(platform => <SelectItem key={platform} value={platform}>{platform}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        <FormMessage /></FormItem>
                                    )} />
                                </div>
                                
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Write a description for the AI agent (Optional)</FormLabel>
                                            <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isDescLoading}>
                                                {isDescLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                                Generate Description
                                            </Button>
                                        </div>
                                        <FormControl><Textarea placeholder="Describe the main goal and functions of your AI agent..." rows={4} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <Button type="submit" disabled={isRoadmapLoading}>
                                    {isRoadmapLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Roadmap...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Agent Roadmap</>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>

            {isRoadmapLoading && (
                <motion.div className="flex flex-col items-center justify-center pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg text-muted-foreground">Our AI is building your agent's roadmap...</p>
                </motion.div>
            )}

            {roadmap && (
                <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary"/>Agent Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{roadmap.summary}</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Milestone className="h-6 w-6 text-primary"/>Workflow Steps</CardTitle>
                                <CardDescription>A visual representation of your agent's workflow.</CardDescription>
                            </CardHeader>
                            <CardContent style={{ height: 600 }}>
                                <ReactFlow nodes={nodes} edges={edges} fitView>
                                    <Controls />
                                    <Background />
                                </ReactFlow>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card>
                             <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2"><Code2 className="h-6 w-6 text-primary"/>Platform JSON Output</CardTitle>
                                        <CardDescription>Copy or download this JSON to import into {form.getValues('platformName')}.</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleCopyJson}>
                                            <Copy className="mr-2 h-4 w-4"/> Copy JSON
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleDownloadJson}>
                                            <Download className="mr-2 h-4 w-4"/> Download JSON
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <pre className="p-4 rounded-md bg-muted/80 text-xs w-full max-w-full overflow-x-auto font-mono break-words whitespace-pre-wrap">
                                    <code>{roadmap.jsonOutput}</code>
                                </pre>
                            </CardContent>

                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary"/>Additional Resources & Tips</CardTitle>
                                <CardDescription>Guidance to help you build and optimize your agent.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {roadmap.resourcesAndTips.map((item, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger>{item.title}</AccordionTrigger>
                                            <AccordionContent>{item.content}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}

        </motion.div>
    );
}
