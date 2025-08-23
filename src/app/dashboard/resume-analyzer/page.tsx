
'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeResume, type AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, FileUp, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  resume: z.any(),
  jobDescription: z.string().optional(),
});

export default function ResumeAnalyzerPage() {
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please upload a file smaller than 5MB.", variant: "destructive" });
        return;
      }
      setFileName(file.name);
      form.setValue('resume', file);
    }
  };

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    if (!values.resume) {
      toast({ title: "No resume uploaded", description: "Please upload your resume.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const resumeDataUri = await fileToDataUri(values.resume);
      const result = await analyzeResume({
        resumeDataUri,
        jobDescription: values.jobDescription,
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
        <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="text-muted-foreground">Get instant feedback on your resume to improve your job prospects.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="resume"
                  render={() => (
                    <FormItem>
                      <FormLabel>Resume File (PDF, DOCX)</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {fileName ? fileName : <><span className="font-semibold">Click to upload</span> or drag and drop</>}
                              </p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste the job description here for a more detailed analysis..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze Resume</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <motion.div className="flex justify-center pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Our AI is reviewing your resume...</p>
        </motion.div>
      )}

      {analysis && (
        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Analysis Complete</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="h-10 w-10 text-primary" />
                    <p className="text-5xl font-bold">{analysis.overallScore}</p>
                  </div>
                  <p className="text-muted-foreground mt-2">Overall Score</p>
                  <Progress value={analysis.overallScore} className="mt-4 max-w-sm mx-auto" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-muted-foreground">{analysis.summary}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Actionable Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {analysis.improvements.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{item.section}</AccordionTrigger>
                      <AccordionContent>{item.suggestion}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>ATS Keyword Analysis</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Matching Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.atsKeywords.matchingKeywords.map(keyword => <Badge key={keyword} variant="secondary">{keyword}</Badge>)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-500" /> Missing Keywords</h3>
                   <div className="flex flex-wrap gap-2">
                    {analysis.atsKeywords.missingKeywords.map(keyword => <Badge key={keyword} variant="destructive">{keyword}</Badge>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
