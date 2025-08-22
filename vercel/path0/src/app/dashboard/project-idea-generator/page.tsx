
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { ProjectIdeaInputSchema, type ProjectIdeaInput } from '@/ai/flows/project-idea-generator.types';


const techOptions = {
    frontend: [
        "HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Vue.js", "Angular", "Svelte",
        "Tailwind CSS", "Bootstrap", "jQuery", "Material UI"
    ],
    backend: [
        "Node.js", "Express.js", "NestJS (Node.js, TypeScript)", "Django (Python)", "Flask (Python)", "FastAPI (Python)",
        "Spring Boot (Java)", "ASP.NET Core (C#)", "Ruby on Rails (Ruby)", "Laravel (PHP)", "Go (Golang)", "Koa.js (Node.js)",
        "Rust", "Kotlin"
    ],
    ai_ml: [
        "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Pandas", "NumPy", "R Language", "Julia", "MATLAB",
        "Java (Weka, Deeplearning4j)", "C++", "Lisp", "Prolog", "Swift for TensorFlow", "JavaScript (TensorFlow.js, Brain.js)"
    ],
    databases: [
        "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Firebase (Firestore & Realtime DB)", "Redis", "Oracle DB", "Cassandra"
    ],
    devops: [
        "Vercel", "Netlify", "Heroku", "Render", "AWS", "Google Cloud (GCP)", "Microsoft Azure", "Docker", "Kubernetes"
    ]
};

const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Professional"];


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
            type: 'default'
        });
        if (parent) {
            initialEdges.push({ id: `e-${parent}-${id}`, source: parent, target: id, type: 'smoothstep', animated: true });
        }
    };
    
    const rootId = 'project-root';
    createNode(rootId, <div className="p-2 font-bold text-lg text-center">Project Roadmap</div>, 0, yPos);
    yPos += ySpacing;

    Object.entries(projectTree).forEach(([key, value], index) => {
        const stepId = `step-${key}`;
        const xPos = (index - (Object.keys(projectTree).length-1)/2) * xSpacing;
        createNode(stepId, <div className="p-2 font-semibold">{value.title}</div>, xPos, yPos, rootId);

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

  const form = useForm<ProjectIdeaInput>({
    resolver: zodResolver(ProjectIdeaInputSchema),
    defaultValues: {
        frontend: [],
        backend: [],
        ai_ml: [],
        databases: [],
        devops: [],
        experienceLevel: 'Beginner',
        userProjectIdea: '',
    },
  });

  const { nodes, edges } = useMemo(() => {
    if (!project?.projectTree) return { nodes: [], edges: [] };
    return getTreeLayout(project.projectTree);
  }, [project]);

  useEffect(() => {
    try {
      const reuseData = sessionStorage.getItem('kaizen-ai-reuse-project-idea');
      if (reuseData && reuseData !== 'undefined') {
        const parsedData = JSON.parse(reuseData);
        form.reset(parsedData);
        sessionStorage.removeItem('kaizen-ai-reuse-project-idea');
      }
    } catch(e) {
      console.error("Could not reuse data", e);
    }
  }, [form]);

  async function onSubmit(values: ProjectIdeaInput) {
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
Duration (Beginner): ${project.duration.student}
Duration (Professional): ${project.duration.experienced}

Roadmap:
${Object.values(project.projectTree).map(step => `
## ${step.title}
${step.details.join('\n- ')}
Resources:
${step.resources.map(r => `- ${r.name}: ${r.url}`).join('\n')}
`).join('\n')}
    `;
    navigator.clipboard.writeText(projectText.trim());
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

  const renderCheckboxGroup = (category: keyof typeof techOptions, label: string) => (
    <AccordionItem value={category}>
        <AccordionTrigger>{label}</AccordionTrigger>
        <AccordionContent>
            <FormField control={form.control} name={category} render={() => (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                    {techOptions[category].map((item) => (
                        <FormField key={item} control={form.control} name={category} render={({ field }) => (
                            <FormItem key={item} className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                            const currentValue = field.value || [];
                                            return checked
                                                ? field.onChange([...currentValue, item])
                                                : field.onChange(currentValue.filter((value) => value !== item));
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">{item}</FormLabel>
                            </FormItem>
                        )} />
                    ))}
                </div>
            )} />
        </AccordionContent>
    </AccordionItem>
);

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
                            <FormDescription>If you have an idea, our AI will validate it and generate a roadmap.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                
                <Accordion type="multiple" className="w-full">
                    {renderCheckboxGroup("frontend", "Frontend Technologies")}
                    {renderCheckboxGroup("backend", "Backend Technologies")}
                    {renderCheckboxGroup("ai_ml", "AI/ML Libraries")}
                    {renderCheckboxGroup("databases", "Databases")}
                    {renderCheckboxGroup("devops", "DevOps & Deployment")}
                </Accordion>


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
        >
          <div ref={projectContentRef} className="space-y-6 bg-background p-4 rounded-lg">
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
                           <Badge variant="outline">Beginner: {project.duration.student}</Badge>
                           <Badge variant="outline">Professional: {project.duration.experienced}</Badge>
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
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
