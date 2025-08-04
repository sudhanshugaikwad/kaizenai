'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { matchJobs, type JobMatcherOutput } from '@/ai/flows/job-matcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileUp, Sparkles, Briefcase, ExternalLink, Building, Clock, UserCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

export default function JobMatcherPage() {
  const [result, setResult] = useState<JobMatcherOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setResult(null);
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
        description: "Please upload your resume to find jobs.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const resumeDataUri = await fileToDataUri(file);
      const matchedJobsResult = await matchJobs({ resumeDataUri });
      setResult(matchedJobsResult);
    } catch (error) {
      console.error('Failed to match jobs:', error);
      toast({
        title: "Error",
        description: "Failed to find jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [file, toast]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Matcher</h1>
        <p className="text-muted-foreground">Upload your resume and let our AI find the best job openings for you in India.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Your Next Opportunity</CardTitle>
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
            <Button type="submit" disabled={isLoading || !file} className="w-full sm:w-auto">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Finding Jobs...</> : <><Sparkles className="mr-2 h-4 w-4" />Match Jobs</>}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center pt-10">
            <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Our AI is searching for jobs that match your profile...</p>
        </div>
      )}

      {result && result.matchedJobs.length > 0 && (
        <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <UserCheck className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle>Identified Role</CardTitle>
                    <CardDescription className="text-lg font-semibold text-foreground">{result.userJobRole}</CardDescription>
                  </div>
              </CardHeader>
            </Card>

            <h2 className="text-2xl font-bold tracking-tight">Recommended Jobs & Internships for You</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.matchedJobs.map((job, index) => (
                <Card key={index} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                           <div className="flex items-center gap-3">
                             <div className="p-2 border rounded-md bg-muted/50">
                                <Briefcase className="w-6 h-6 text-primary" />
                             </div>
                             <div>
                                <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building className="w-4 h-4" />
                                    <span>{job.companyName}</span>
                                </div>
                             </div>
                           </div>
                           <Badge variant="outline" className="flex items-center gap-1.5 whitespace-nowrap">
                                <Clock className="w-3 h-3"/>
                                {job.postedDate}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-4">{job.jobDescription}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full">
                                Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            ))}
            </div>
        </div>
      )}

       {result && result.matchedJobs.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center pt-10 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-semibold">No Jobs Found</p>
            <p className="text-muted-foreground">We couldn't find any job matches for the uploaded resume. Try updating your resume or checking back later.</p>
        </div>
       )}
    </div>
  );
}
