'use client';

import { useState } from 'react';
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
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setCoverLetter('');
    try {
      const result = await generateCoverLetter(values);
      setCoverLetter(result.coverLetter);
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
    navigator.clipboard.writeText(coverLetter);
    toast({
        title: "Copied!",
        description: "Cover letter copied to clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cover Letter Writer</h1>
        <p className="text-muted-foreground">Fill in the details below and let our AI craft a professional cover letter for you.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Cover Letter</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="min-h-[400px] lg:min-h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Cover Letter</CardTitle>
                <CardDescription>Your AI-crafted letter will appear here.</CardDescription>
              </div>
              {coverLetter && (
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading ? (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : (
                <Textarea
                  readOnly
                  value={coverLetter}
                  placeholder="Your cover letter will be generated here..."
                  className="h-full min-h-[300px] lg:min-h-full resize-none"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
