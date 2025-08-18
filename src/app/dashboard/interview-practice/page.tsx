
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileUp, Loader2, Sparkles, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { matchJobs } from '@/ai/flows/job-matcher';

const formSchema = z.object({
  role: z.string().min(2, "Role name is required."),
  roundType: z.enum(['Coding', 'Beginner', 'Role Related', 'Fresher'], {
    required_error: "You need to select a round type.",
  }),
  language: z.string().optional(),
  resume: z.any().optional(),
});

const codingLanguages = [
  "JavaScript", "Python", "Java", "C++", "C#", "TypeScript", "Go", "Rust", "Kotlin", "Swift"
];

export default function InterviewPracticeSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
    },
  });

  const roundType = form.watch('roundType');

  useEffect(() => {
    try {
      const reuseData = sessionStorage.getItem('kaizen-ai-reuse-interview-practice');
      if (reuseData) {
        const parsedData = JSON.parse(reuseData);
        form.reset(parsedData);
        sessionStorage.removeItem('kaizen-ai-reuse-interview-practice');
      }
    } catch(e) {
      console.error("Could not reuse data", e);
    }
  }, [form]);


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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setFileName(file.name);
        form.setValue('resume', file);
        setIsLoading(true);
        toast({ title: "Analyzing resume..."});
        try {
            const resumeDataUri = await fileToDataUri(file);
            const result = await matchJobs({ resumeDataUri });
            if (result.userJobRole && result.userJobRole !== 'Could not process resume') {
                form.setValue('role', result.userJobRole);
                toast({ title: "Success", description: `Identified role: ${result.userJobRole}`});
            } else {
                 toast({ title: "Could not identify role from resume.", variant: "destructive"});
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error analyzing resume", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }
  };


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (values.roundType === 'Coding' && !values.language) {
      toast({
        title: "Language required",
        description: "Please select a coding language for the coding round.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Store settings in session storage to pass to the next page
    sessionStorage.setItem('interviewSettings', JSON.stringify(values));
    
    // Navigate to the interview page
    router.push('/dashboard/interview-practice/session');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Ready to Ace Your Next Interview?</CardTitle>
          <CardDescription>AI mock interviews with personalised practice and real-time analytics.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div>
                <FormLabel>Resume Based Interview (Optional)</FormLabel>
                <div className="flex items-center justify-center w-full mt-2">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {fileName ? fileName : 
                                (<><span className="font-semibold">Upload your resume</span> to identify your role</>)
                                }
                            </p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                    </label>
                </div>
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roundType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Round *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        {['Coding', 'Beginner', 'Role Related', 'Fresher'].map(type => (
                           <FormItem key={type} className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <RadioGroupItem value={type} id={type} />
                            </FormControl>
                            <FormLabel htmlFor={type} className="font-normal">{type}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <div className="space-y-3">
                    <FormLabel>Interview Duration</FormLabel>
                    <div className="flex items-center gap-2 text-muted-foreground p-3 border rounded-md">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">35 Minutes</span>
                    </div>
                </div>
              
              {roundType === 'Coding' && (
                 <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Coding Language *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {codingLanguages.map(lang => (
                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                />
              )}

              <div className="flex justify-end gap-4">
                 <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>Cancel</Button>
                 <Button type="submit" disabled={isLoading}>
                   {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                   Start Practice
                 </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
