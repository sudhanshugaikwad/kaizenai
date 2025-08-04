'use client';

import { useState, useCallback } from 'react';
import { analyzeResume, type AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileUp, Lightbulb } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export default function ResumeAnalyzerPage() {
  const [feedback, setFeedback] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
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
      const result = await analyzeResume({ resumeDataUri });
      setFeedback(result);
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
  }, [file, toast]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="text-muted-foreground">Upload your resume (PDF) to get instant AI-powered feedback.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                  {fileName && <p className="mt-4 text-sm font-medium text-primary">{fileName}</p>}
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
              </label>
            </div>
            <Button type="submit" disabled={isLoading || !file} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center pt-10">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Our AI is reviewing your resume...</p>
        </div>
      )}

      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary"/>
                AI Feedback
            </CardTitle>
            <CardDescription>Here are suggestions to improve your resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {feedback.feedback}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
