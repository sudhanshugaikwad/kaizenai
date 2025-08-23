
'use client';

import { useState, useCallback, useEffect } from 'react';
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
import { Loader2, Sparkles, FileUp, Trophy, CheckCircle, XCircle, UserCheck, Edit, LayoutList, FileText } from 'lucide-react';
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

  useEffect(() => {
    try {
      const reuseData = sessionStorage.getItem('kaizen-ai-reuse-resume-analyzer');
      if (reuseData && reuseData !== 'undefined') {
        const parsedData = JSON.parse(reuseData);
        form.reset(parsedData);
        sessionStorage.removeItem('kaizen-ai-reuse-resume-analyzer');
      }
    } catch(e) {
      console.error("Could not reuse data", e);
    }
  }, [form]);

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

  const saveToHistory = (input: z.infer<typeof formSchema>, output: AnalyzeResumeOutput) => {
    try {
        const history = JSON.parse(localStorage.getItem('kaizen-ai-history') || '[]');
        const newHistoryItem = {
            type: 'Resume Analysis',
            title: `Analyzed resume: ${fileName || 'Untitled'}`,
            timestamp: new Date().toISOString(),
            data: {
                ...input,
                fileName,
                analysis: output,
            }
        };
        history.unshift(newHistoryItem);
        localStorage.setItem('kaizen-ai-history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
        console.error("Could not save to history", e);
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
      saveToHistory(values, result);
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
  }, [toast, fileName]);

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

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-1">
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
                                <p className="text-sm text-center text-muted-foreground">
                                  {fileName ? fileName : <><span className="font-semibold">Click to upload</span> or drag & drop</>}
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
                          <Textarea placeholder="Paste job description for a tailored analysis..." rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze Resume</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-2">
            {isLoading && (
            <motion.div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Our AI is reviewing your resume...</p>
            </motion.div>
            )}

            {!isLoading && !analysis && (
                <motion.div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed h-full text-center p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <FileText className="h-16 w-16 text-muted-foreground/30" />
                    <p className="mt-4 text-lg font-medium">Your analysis will appear here</p>
                    <p className="text-muted-foreground">Upload your resume to get started.</p>
                </motion.div>
            )}

            {analysis && (
                <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
                
                 <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader>
                        <CardTitle>Overall Score</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                           <div className="relative size-32">
                             <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                               <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-muted/20" strokeWidth="2"></circle>
                               <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray={`${analysis.overallScore}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)"></circle>
                             </svg>
                             <div className="absolute inset-0 flex items-center justify-center">
                               <span className="text-4xl font-bold">{analysis.overallScore}</span>
                             </div>
                           </div>
                           <div className="flex-1">
                             <h3 className="font-semibold text-lg">Analysis Summary</h3>
                             <p className="text-muted-foreground text-sm">{analysis.summary}</p>
                           </div>
                        </div>
                    </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck className="h-6 w-6 text-primary"/> Identified Role</CardTitle></CardHeader>
                    <CardContent><p className="text-lg font-semibold">{analysis.identifiedRole}</p></CardContent>
                    </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Edit className="h-6 w-6 text-primary"/> Actionable Improvements</CardTitle></CardHeader>
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
                    <CardHeader><CardTitle className="flex items-center gap-2"><LayoutList className="h-6 w-6 text-primary"/> Formatting Suggestions</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {analysis.formattingSuggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                        </ul>
                    </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader><CardTitle>ATS Keyword Analysis</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Matching Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.atsKeywords.matchingKeywords.length > 0 ? 
                                analysis.atsKeywords.matchingKeywords.map(keyword => <Badge key={keyword} variant="secondary">{keyword}</Badge>) :
                                <p className="text-sm text-muted-foreground">No matching keywords found.</p>
                            }
                        </div>
                        </div>
                        <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-500" /> Missing Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.atsKeywords.missingKeywords.length > 0 ?
                                analysis.atsKeywords.missingKeywords.map(keyword => <Badge key={keyword} variant="destructive">{keyword}</Badge>) :
                                <p className="text-sm text-muted-foreground">No missing keywords to suggest.</p>
                            }
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                </motion.div>
                </motion.div>
            )}
        </div>
      </div>
    </motion.div>
  );
}

    