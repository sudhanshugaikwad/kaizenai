
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateCoverLetter } from '@/ai/flows/cover-letter-writer';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { motion } from 'framer-motion';

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required."),
  companyName: z.string().min(2, "Company name is required."),
  jobDescription: z.string().min(10, "Job description is too short."),
  skills: z.string().min(5, "Please list some relevant skills."),
  experience: z.string().min(10, "Please describe your experience."),
});

export default function CoverLetterWriterPage() {
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      skills: '',
      experience: '',
    },
  });

  useEffect(() => {
    try {
      const reuseData = sessionStorage.getItem('kaizen-ai-reuse-cover-letter');
      if (reuseData && reuseData !== 'undefined') {
        const parsedData = JSON.parse(reuseData);
        form.reset(parsedData);
        sessionStorage.removeItem('kaizen-ai-reuse-cover-letter');
      }
    } catch(e) {
      console.error("Could not reuse data", e);
    }
  }, [form]);


  const saveToHistory = (values: z.infer<typeof formSchema>, generatedCoverLetter: string) => {
    try {
      const history = JSON.parse(localStorage.getItem('kaizen-ai-history') || '[]');
      const newHistoryItem = {
        type: 'Cover Letter Generated',
        title: `For ${values.jobTitle} at ${values.companyName}`,
        timestamp: new Date().toISOString(),
        data: {
            ...values,
            coverLetter: generatedCoverLetter,
        }
      };
      history.unshift(newHistoryItem);
      localStorage.setItem('kaizen-ai-history', JSON.stringify(history.slice(0, 50))); // limit history
    } catch (e) {
      console.error("Could not save to history", e);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setCoverLetter('');
    try {
      const result = await generateCoverLetter(values);
      setCoverLetter(result.coverLetter);
      saveToHistory(values, result.coverLetter);
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
       toast({
        title: "Error",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    toast({
        title: "Copied!",
        description: "Cover letter copied to clipboard.",
    });
  };

  const handleDownload = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover-Letter-${form.getValues('companyName') || 'Untitled'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
     toast({
        title: "Downloaded!",
        description: "Cover letter saved as a .txt file.",
    });
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
        <h1 className="text-3xl font-bold tracking-tight">Cover Letter Writer</h1>
        <p className="text-muted-foreground">Fill in the details below and let our AI craft a professional cover letter for you.</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
            <Card>
            <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Provide information about the job you're applying for.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (
                    <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="e.g., Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="jobDescription" render={({ field }) => (
                    <FormItem><FormLabel>Job Description</FormLabel><FormControl><Textarea placeholder="Paste the job description here..." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="skills" render={({ field }) => (
                    <FormItem><FormLabel>Your Skills</FormLabel><FormControl><Textarea placeholder="e.g., React, Node.js, Project Management" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="experience" render={({ field }) => (
                    <FormItem><FormLabel>Your Experience</FormLabel><FormControl><Textarea placeholder="Briefly describe your relevant experience..." rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Cover Letter</>}
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <Card className="min-h-[400px] lg:min-h-full flex flex-col">
            <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <CardTitle>Generated Cover Letter</CardTitle>
                <CardDescription>Your AI-crafted letter will appear here. You can edit it directly.</CardDescription>
              </div>
              {coverLetter && !isLoading && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading ? (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : (
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Your cover letter will be generated here..."
                  className="h-[80vh] min-h-[300px] lg:min-h-full resize-none"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
