
'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateRoadmap, type RoadmapOutput } from '@/ai/flows/roadmap-generator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Rocket, Lightbulb, HelpCircle, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import ReactFlow, {
  Controls,
  Background,
  type Node,
  type Edge,
} from 'reactflow';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


import 'reactflow/dist/style.css';

const formSchema = z.object({
  careerGoal: z.string().min(2, {
    message: 'Career goal must be at least 2 characters.',
  }),
});

// Function to arrange nodes in a tree-like structure
const getTreeLayout = (items: any[]) => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];
    const nodeWidth = 400;
    const nodeHeight = 200;
    const horizontalSpacing = 50;
    const verticalSpacing = 100;
    const itemsPerRow = 2;

    items.forEach((item, index) => {
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;

        // Alternate direction for each row
        const x = (row % 2 === 0) 
            ? col * (nodeWidth + horizontalSpacing) 
            : (itemsPerRow - 1 - col) * (nodeWidth + horizontalSpacing);
        
        const y = row * (nodeHeight + verticalSpacing);
        
        const nodeId = `step-${index + 1}`;
        initialNodes.push({
            id: nodeId,
            type: 'default',
            data: {
                label: (
                    <div className="p-2">
                        <div className='font-bold text-base mb-2'>{`Step ${index + 1}: ${item.step}`}</div>
                        <div className='text-sm text-muted-foreground'>{item.reasoning}</div>
                        <div className="text-xs text-muted-foreground mt-2 italic">Duration: {item.duration}</div>
                    </div>
                )
            },
            position: { x, y },
            style: { width: nodeWidth, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' },
        });

        if (index > 0) {
            initialEdges.push({
                id: `e${index}-${index + 1}`,
                source: `step-${index}`,
                target: nodeId,
                type: 'smoothstep',
                animated: true,
                style: { stroke: 'hsl(var(--primary))' },
            });
        }
    });

    return { nodes: initialNodes, edges: initialEdges };
};


export default function RoadmapGeneratorPage() {
  const [roadmap, setRoadmap] = useState<RoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const roadmapContentRef = useRef<HTMLDivElement>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careerGoal: '',
    },
  });

  useEffect(() => {
    try {
      const reuseData = sessionStorage.getItem('kaizen-ai-reuse-roadmap');
      if (reuseData && reuseData !== 'undefined') {
        const parsedData = JSON.parse(reuseData);
        form.reset(parsedData);
        sessionStorage.removeItem('kaizen-ai-reuse-roadmap');
      }
    } catch(e) {
      console.error("Could not reuse data", e);
    }
  }, [form]);

  const { nodes, edges } = useMemo(() => {
    if (!roadmap) return { nodes: [], edges: [] };
    return getTreeLayout(roadmap.roadmap);
  }, [roadmap]);

  const saveToHistory = (input: z.infer<typeof formSchema>, output: RoadmapOutput) => {
    try {
        const history = JSON.parse(localStorage.getItem('kaizen-ai-history') || '[]');
        const newHistoryItem = {
            type: 'Roadmap Generated',
            title: `For career goal: ${input.careerGoal}`,
            timestamp: new Date().toISOString(),
            data: {
                input,
                output
            }
        };
        history.unshift(newHistoryItem);
        localStorage.setItem('kaizen-ai-history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
        console.error("Could not save to history", e);
    }
  };


  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setRoadmap(null);
    try {
      const result = await generateRoadmap(values);
      setRoadmap(result);
      saveToHistory(values, result);
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDownload = async () => {
    if (!roadmapContentRef.current || !roadmap) {
        toast({
            title: "Error",
            description: "Could not download roadmap. Please generate a roadmap first.",
            variant: "destructive"
        });
        return;
    }

    toast({ title: "Generating PDF...", description: "Please wait a moment."});

    const canvas = await html2canvas(roadmapContentRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: null, 
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`Roadmap-for-${form.getValues('careerGoal').replace(/\s+/g, '-')}.pdf`);
  };


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
        <h1 className="text-3xl font-bold tracking-tight">Career Roadmap Generator</h1>
        <p className="text-muted-foreground">Enter your desired career and get a personalized roadmap from our AI.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
            <CardContent className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="careerGoal"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Career Goal</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Senior Frontend Developer, Product Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                    ) : (
                    <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Generate Roadmap
                    </>
                    )}
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <motion.div 
            className="flex items-center justify-center pt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is crafting your future...</p>
        </motion.div>
      )}

      {roadmap && (
        <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            ref={roadmapContentRef}
        >
        <motion.div variants={itemVariants}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Your Personalized Roadmap to Becoming a {form.getValues('careerGoal')}</CardTitle>
                        <CardDescription>
                            Follow these steps to achieve your career goal. 
                            <span className="font-semibold"> Total Estimated Duration: {roadmap.totalDuration}</span>
                        </CardDescription>
                    </div>
                     <Button variant="outline" size="icon" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download Roadmap</span>
                    </Button>
                </CardHeader>
                <CardContent style={{ height: 600 }}>
                     <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        fitView
                     >
                        <Controls />
                        <Background />
                    </ReactFlow>
                </CardContent>
            </Card>
        </motion.div>
        
        {roadmap.recommendedProjects && roadmap.recommendedProjects.length > 0 && (
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="h-6 w-6 text-primary"/>Recommended Projects</CardTitle>
                        <CardDescription>Build these projects to create a strong portfolio and showcase your skills.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {roadmap.recommendedProjects.map((project, index) => (
                                <AccordionItem value={`project-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <span className="font-semibold">{project.name}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                                        {project.description}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </motion.div>
        )}

        {roadmap.interviewQuestions && roadmap.interviewQuestions.length > 0 && (
             <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HelpCircle className="h-6 w-6 text-primary"/>Interview Practice</CardTitle>
                        <CardDescription>Prepare for your interviews with these common questions and answer guidelines.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {roadmap.interviewQuestions.map((qa, index) => (
                                <AccordionItem value={`qa-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <span className="font-semibold text-left">{qa.question}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                                        {qa.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
             </motion.div>
        )}

        </motion.div>
      )}
    </motion.div>
  );
}
