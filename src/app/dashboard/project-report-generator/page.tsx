
'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateProjectReport, type ProjectReportOutput } from '@/ai/flows/project-report-generator';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, Download, FileText, Users, GraduationCap, X, Plus, Book, FileBarChart, Trophy, FileUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required."),
  role: z.string().min(1, "Role is required."),
});

const formSchema = z.object({
  projectTitle: z.string().min(5, "Project title must be at least 5 characters."),
  collegeName: z.string().min(3, "College name is required."),
  guideName: z.string().min(3, "Guide's name is required."),
  technologiesUsed: z.string().min(3, "Please list at least one technology."),
  teamMembers: z.array(teamMemberSchema).min(1, "At least one team member is required."),
});

type FormData = z.infer<typeof formSchema>;

export default function ProjectReportGeneratorPage() {
  const [generatedOutput, setGeneratedOutput] = useState<ProjectReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const reportContentRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectTitle: '',
      collegeName: '',
      guideName: '',
      technologiesUsed: '',
      teamMembers: [{ name: '', role: 'Team Leader' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'teamMembers',
  });

  const onSubmit = useCallback(async (values: FormData) => {
    setIsLoading(true);
    setGeneratedOutput(null);
    try {
      const input = {
        ...values,
        technologiesUsed: values.technologiesUsed.split(',').map(tech => tech.trim()),
      };
      const result = await generateProjectReport(input);
      setGeneratedOutput(result);
      toast({ title: "Report Content Generated!", description: "Key sections of your project report are ready." });
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDownload = () => {
    toast({
        title: "Coming Soon!",
        description: "PDF and DOCX downloading functionality will be available in a future update.",
    });
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
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">AI Project Report Generator</h1>
        <p className="text-muted-foreground">Fill in your project details, and our AI will generate the key sections of your report.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <motion.div variants={itemVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/>Project Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="projectTitle" render={({ field }) => (
                        <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input placeholder="e.g., AI-Powered Career Coach" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="technologiesUsed" render={({ field }) => (
                        <FormItem><FormLabel>Technologies Used</FormLabel><FormControl><Input placeholder="e.g., React, Next.js, Genkit, TailwindCSS" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5"/>Academic Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <FormField control={form.control} name="collegeName" render={({ field }) => (
                        <FormItem><FormLabel>College/University Name</FormLabel><FormControl><Input placeholder="e.g., Institute of Technology" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="guideName" render={({ field }) => (
                        <FormItem><FormLabel>Project Guide's Name</FormLabel><FormControl><Input placeholder="e.g., Prof. Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/>Team Members</CardTitle>
                        <Button type="button" size="sm" variant="outline" onClick={() => append({ name: '', role: 'Team Member' })}><Plus className="mr-2 h-4 w-4"/>Add Member</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                       <FormField control={form.control} name={`teamMembers.${index}.name`} render={({ field }) => (
                            <FormItem className="flex-grow"><FormLabel>Member Name</FormLabel><FormControl><Input {...field} placeholder={`Member ${index + 1}`} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`teamMembers.${index}.role`} render={({ field }) => (
                            <FormItem className="flex-grow"><FormLabel>Role</FormLabel><FormControl><Input {...field} placeholder="Role" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><X className="h-4 w-4"/></Button>
                    </div>
                  ))}
                  {form.formState.errors.teamMembers && <p className="text-sm font-medium text-destructive">{form.formState.errors.teamMembers.message}</p>}
                </CardContent>
              </Card>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Sections...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Report Content</>}
              </Button>
            </form>
          </Form>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 sticky top-4">
            {isLoading && (
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-96">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg text-muted-foreground">AI is writing your report...</p>
                 </div>
            )}
            {!isLoading && !generatedOutput && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-96 text-center p-8">
                    <FileBarChart className="h-16 w-16 text-muted-foreground/30" />
                    <p className="mt-4 text-lg font-medium">Your generated report will appear here</p>
                    <p className="text-muted-foreground">Fill in your project details to get started.</p>
                </div>
            )}
            {generatedOutput && (
                <Card>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle>Generated Report Content</CardTitle>
                            <CardDescription>Review the AI-generated sections below.</CardDescription>
                        </div>
                        <Button variant="outline" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" /> Download Full Report
                        </Button>
                    </CardHeader>
                    <CardContent ref={reportContentRef}>
                        <Accordion type="multiple" defaultValue={['abstract', 'acknowledgement', 'conclusion']} className="w-full">
                            <AccordionItem value="abstract">
                                <AccordionTrigger><Book className="mr-2 h-4 w-4 text-primary"/>Abstract</AccordionTrigger>
                                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">{generatedOutput.abstract}</AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="acknowledgement">
                                <AccordionTrigger><Trophy className="mr-2 h-4 w-4 text-primary"/>Acknowledgement</AccordionTrigger>
                                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">{generatedOutput.acknowledgement}</AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="conclusion">
                                <AccordionTrigger><Sparkles className="mr-2 h-4 w-4 text-primary"/>Conclusion & Future Scope</AccordionTrigger>
                                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">{generatedOutput.conclusion}</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            )}
        </motion.div>
      </div>
    </motion.div>
  );
}
