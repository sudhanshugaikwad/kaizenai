
'use client';

import { useState, useCallback } from 'react';
import { analyzeResume, type AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, FileUp, Lightbulb, CheckCircle, XCircle, FileSearch, Sparkles, Wand } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';

export default function ResumeAnalyzerPage() {
  const [feedback, setFeedback] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFeedback(null);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

   const saveToHistory = (output: AnalyzeResumeOutput) => {
    try {
        const history = JSON.parse(localStorage.getItem('kaizen-ai-history') || '[]');
        const newHistoryItem = {
            type: 'Resume Analysis',
            title: `Analyzed: ${fileName}`,
            timestamp: new Date().toISOString(),
            data: {
                fileName,
                jobDescription,
                feedback: output,
            }
        };
        history.unshift(newHistoryItem);
        localStorage.setItem('kaizen-ai-history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
        console.error("Could not save to history", e);
    }
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const resumeDataUri = await fileToDataUri(file);
      const result = await analyzeResume({ resumeDataUri, jobDescription });
      setFeedback(result);
      saveToHistory(result);
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
  }, [file, fileName, jobDescription, toast]);

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
        <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="text-muted-foreground">Get instant AI-powered feedback. For a tailored analysis, paste the job description.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
            <Card>
            <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                        {fileName && <p className="mt-4 text-sm font-medium text-primary">{fileName}</p>}
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                    </label>
                </div>
                <div>
                    <label htmlFor="job-description" className="block text-sm font-medium text-muted-foreground mb-2">Job Description (Optional)</label>
                    <Textarea
                    id="job-description"
                    placeholder="Paste the job description here for a more accurate ATS scan..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    />
                </div>
                <Button type="submit" disabled={isLoading || !file} className="w-full sm:w-auto">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" />Analyze Resume</>}
                </Button>
                </form>
            </CardContent>
            </Card>
        </motion.div>
        
        <div className="space-y-8">
            {isLoading && (
            <motion.div 
                className="flex flex-col items-center justify-center h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Card className="flex flex-col items-center justify-center w-full h-full">
                    <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg text-muted-foreground">Our AI is reviewing your resume...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </Card>
            </motion.div>
            )}

            {feedback && (
                <motion.div 
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                 <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                        <CardTitle>Overall Score</CardTitle>
                        <CardDescription>Your resume's estimated performance.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="text-5xl font-bold text-primary">{feedback.overallScore}</div>
                            <div className="text-2xl text-muted-foreground">/ 100</div>
                        </div>
                        <Progress value={feedback.overallScore} className="w-full" />
                        <p className="text-sm text-muted-foreground text-center">{feedback.summary}</p>
                        </CardContent>
                    </Card>
                 </motion.div>

                 <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="h-6 w-6 text-primary"/>Improvement Suggestions</CardTitle>
                        <CardDescription>Actionable feedback to enhance your resume.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {feedback.improvements.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <Wand className="h-5 w-5 text-primary/80"/>
                                    <span className="font-semibold">{item.section}</span>
                                </div>
                                </AccordionTrigger>
                                <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                                {item.suggestion}
                                </AccordionContent>
                            </AccordionItem>
                            ))}
                        </Accordion>
                        </CardContent>
                    </Card>
                 </motion.div>

                 <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileSearch className="h-6 w-6 text-primary"/>ATS Keyword Analysis</CardTitle>
                        <CardDescription>How well your resume matches the job description keywords.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><CheckCircle className="h-5 w-5 text-green-500" /> Matching Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {feedback.atsKeywords.matchingKeywords.length > 0 ? feedback.atsKeywords.matchingKeywords.map((kw, i) => <Badge key={i} variant="secondary">{kw}</Badge>) : <p className="text-sm text-muted-foreground">No matching keywords found.</p>}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><XCircle className="h-5 w-5 text-red-500" /> Missing Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {feedback.atsKeywords.missingKeywords.length > 0 ? feedback.atsKeywords.missingKeywords.map((kw, i) => <Badge key={i} variant="destructive">{kw}</Badge>) : <p className="text-sm text-muted-foreground">No missing keywords found.</p>}
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
