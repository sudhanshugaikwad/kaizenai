
'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateProjectIdea } from '@/ai/flows/project-idea-generator';
import type { ProjectIdeaOutput } from '@/ai/flows/project-idea-generator.types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Lightbulb, Copy, Download, Rocket, Settings, Code, Milestone, ExternalLink } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
    frontendLanguages: z.array(z.string()).refine(value => value.some(item => item), {
        message: 'You have to select at least one frontend language.',
    }),
    backendLanguages: z.array(z.string()).refine(value => value.some(item => item), {
        message: 'You have to select at least one backend language.',
    }),
    experienceLevel: z.string({
        required_error: "Please select your experience level.",
    }),
    userProjectIdea: z.string().optional(),
});

const frontendLangs = ["HTML", "CSS", "JavaScript", "TypeScript", "React.js", "Next.js", "Vue.js", "Angular", "Svelte", "Tailwind CSS", "Bootstrap", "Material UI"];
const backendLangs = ["Node.js", "Express.js", "NestJS", "Python", "Django", "Flask", "FastAPI", "Java", "Spring Boot", "PHP", "Laravel", "Ruby on Rails", "C#", "ASP.NET Core", "Go", "Gin", "Rust", "Kotlin", "MySQL", "PostgreSQL", "MongoDB", "Firebase"];
const experienceLevels = ["Student/Fresher", "1-2 years experience"];


const getTreeLayout = (projectTree: ProjectIdeaOutput['projectTree']) => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];
    let yPos = 0;
    const xSpacing = 450;
    const ySpacing = 150;

    const createNode = (id: string, label: React.ReactNode, x: number, y: number, parent?: string) => {
        initialNodes.push({
            id,
            position: { x, y },
            data: { label },
            style: { width: 350, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' },
        });
        if (parent) {
            initialEdges.push({ id: `e-${parent}-${id}`, source: parent, target: id, type: 'smoothstep', animated: true });
        }
    };
    
    // Root Node
    const rootId = 'project-root';
    createNode(rootId, <div className="p-2 font-bold text-lg">Project Roadmap</div>, 0, yPos);
    yPos += ySpacing;

    // Main Steps
    Object.entries(projectTree).forEach(([key, value], index) => {
        const stepId = `step-${key}`;
        const xPos = (index - (Object.keys(projectTree).length-1)/2) * xSpacing;
        createNode(stepId, <div className="p-2 font-semibold">{value.title}</div>, xPos, yPos, rootId);

        // Sub-steps
        let subYPos = yPos + ySpacing/1.5;
        value.details.forEach((detail, detailIndex) => {
            const detailId = `detail-${key}-${detailIndex}`;
            createNode(detailId, <div className="p-2 text-sm">{detail}</div>, xPos, subYPos, stepId);
            subYPos += ySpacing/2;
        });
    });

    return { nodes: initialNodes, edges: initialEdges };
};


export default function ProjectIdeaGeneratorPage() {
  const [project, setProject] = useState<ProjectIdeaOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const projectContentRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frontendLanguages: [],
      backendLanguages: [],
      userProjectIdea: '',
    },
  });

  const { nodes, edges } = useMemo(() => {
    if (!project) return { nodes: [], edges: [] };
    return getTreeLayout(project.projectTree);
  }, [project]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setProject(null);
    try {
      const result = await generateProjectIdea(values);
      setProject(result);
    } catch (error) {
      console.error('Failed to generate project idea:', error);
      toast({
        title: "Error",
        description: "Failed to generate project idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (!project) return;
    const projectText = `
Project: ${project.projectTitle}
Description: ${project.projectDescription}
Tech Stack: ${project.techStack.join(', ')}
Complexity: ${project.complexity}
Duration (Student): ${project.duration.student}
Duration (Experienced): ${project.duration.experienced}

Roadmap:
... (Roadmap details would be formatted here) ...
    `;
    navigator.clipboard.writeText(projectText);
    toast({ title: "Copied!", description: "Project idea copied to clipboard." });
  };

  const handleDownload = async () => {
    if (!projectContentRef.current || !project) {
        toast({ title: "Error", description: "Please generate a project first.", variant: "destructive" });
        return;
    }
    toast({ title: "Generating PDF...", description: "Please wait." });
    const canvas = await html2canvas(projectContentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`Project-Idea-${project.projectTitle.replace(/\s+/g, '-')}.pdf`);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Project Idea Mentor</h1>
        <p className="text-muted-foreground">Select your tech stack and experience to get a tailored project idea with a complete roadmap.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="frontendLanguages" render={() => (
                        <FormItem>
                            <div className="mb-4"><FormLabel>Frontend Languages</FormLabel></div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {frontendLangs.map((item) => (
                                <FormField key={item} control={form.control} name="frontendLanguages" render={({ field }) => (
                                    <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item))
                                    }} /></FormControl>
                                    <FormLabel className="font-normal text-sm">{item}</FormLabel>
                                    </FormItem>
                                )} />
                            ))}
                            </div>
                             <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="backendLanguages" render={() => (
                        <FormItem>
                            <div className="mb-4"><FormLabel>Backend Languages</FormLabel></div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {backendLangs.map((item) => (
                                <FormField key={item} control={form.control} name="backendLanguages" render={({ field }) => (
                                    <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item))
                                    }} /></FormControl>
                                    <FormLabel className="font-normal text-sm">{item}</FormLabel>
                                    </FormItem>
                                )} />
                            ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger></FormControl>
                            <SelectContent>{experienceLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="userProjectIdea" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Enter your Project Idea (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., A social media app for pet owners" {...field} />
                        </FormControl>
                        <FormDescription>If you have an idea, our AI will validate it and generate a roadmap. Otherwise, we'll suggest one for you.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Idea...</> : <><Lightbulb className="mr-2 h-4 w-4" />Generate Project Idea</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

       {isLoading && (
        <motion.div className="flex justify-center pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is building your project plan...</p>
        </motion.div>
      )}

      {project && (
        <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            ref={projectContentRef}
        >
            <motion.div variants={itemVariants}>
                <Card className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">{project.projectTitle}</h2>
                            <p className="text-muted-foreground mt-1">{project.projectDescription}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                            <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> PDF</Button>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2"><Settings className="h-4 w-4 text-primary"/><strong>Tech Stack:</strong> {project.techStack.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}</div>
                        <div className="flex items-center gap-2"><Rocket className="h-4 w-4 text-primary"/><strong>Complexity:</strong> <Badge>{project.complexity}</Badge></div>
                        <div className="flex items-center gap-2"><Milestone className="h-4 w-4 text-primary"/><strong>Duration:</strong> 
                           <Badge variant="outline">Student: {project.duration.student}</Badge>
                           <Badge variant="outline">Experienced: {project.duration.experienced}</Badge>
                        </div>
                    </div>
                </Card>
            </motion.div>

             <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader><CardTitle>Project Roadmap</CardTitle></CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                            {Object.values(project.projectTree).map((step, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg font-semibold">{step.title}</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <ul className="list-disc pl-5 space-y-2">
                                        {step.details.map((detail, i) => <li key={i}>{detail}</li>)}
                                    </ul>
                                    {step.resources && step.resources.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold">Resources:</h4>
                                            <ul className="list-none pl-5 space-y-1">
                                                {step.resources.map((resource, i) => (
                                                    <li key={i}>
                                                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                                                            {resource.name} <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
             </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader><CardTitle>Interactive Project Tree</CardTitle></CardHeader>
                    <CardContent style={{ height: 800 }}>
                        <ReactFlow nodes={nodes} edges={edges} fitView>
                            <Controls />
                            <Background />
                        </ReactFlow>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
