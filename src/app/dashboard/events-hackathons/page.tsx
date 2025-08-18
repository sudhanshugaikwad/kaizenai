
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { findEvents, type EventFinderOutput } from '@/ai/flows/event-finder';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileUp, Sparkles, Search, UserCheck, Briefcase, ExternalLink, Calendar, MapPin, Ticket } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const formSchema = z.object({
  eventType: z.string().optional(),
  location: z.string().optional(),
  cost: z.string().optional(),
  searchTerm: z.string().optional(),
  resume: z.any().optional(),
});

const eventTypes = ["Hackathons", "Webinars", "Career Fairs", "Competitions", "Events"];
const locations = ["Online", "Offline"];
const costs = ["Free", "Paid"];

export default function EventsHackathonsPage() {
  const [result, setResult] = useState<EventFinderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      form.setValue('resume', selectedFile);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const saveToHistory = (output: EventFinderOutput) => {
    try {
        const history = JSON.parse(localStorage.getItem('kaizen-ai-history') || '[]');
        const newHistoryItem = {
            type: 'Event Search',
            title: `Found ${output.events.length} events`,
            timestamp: new Date().toISOString(),
            data: output
        };
        history.unshift(newHistoryItem);
        localStorage.setItem('kaizen-ai-history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
        console.error("Could not save to history", e);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      let resumeDataUri: string | undefined = undefined;
      if (file) {
        resumeDataUri = await fileToDataUri(file);
      }
      const eventResult = await findEvents({ ...values, resumeDataUri });
      setResult(eventResult);
      saveToHistory(eventResult);
    } catch (error) {
      console.error('Failed to find events:', error);
      toast({
        title: "Error",
        description: "Failed to find events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
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
        <h1 className="text-3xl font-bold tracking-tight">Discover Events, Challenges & Hackathons</h1>
        <p className="text-muted-foreground">Find opportunities from top platforms like Hack2Skill, MLH, and more.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
            <CardHeader>
                <CardTitle>Search for Events</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField control={form.control} name="eventType" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Event Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger></FormControl>
                                <SelectContent>{eventTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                            </Select><FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="location" render={({ field }) => (
                             <FormItem>
                             <FormLabel>Location</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Any Location" /></SelectTrigger></FormControl>
                                <SelectContent>{locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}</SelectContent>
                             </Select><FormMessage />
                             </FormItem>
                        )} />
                         <FormField control={form.control} name="cost" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cost</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Any Cost" /></SelectTrigger></FormControl>
                                <SelectContent>{costs.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select><FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="searchTerm" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Search</FormLabel>
                            <FormControl><Input placeholder="e.g., 'React hackathon'" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div>
                        <FormLabel>Discover based on resume (optional)</FormLabel>
                        <div className="flex items-center justify-center w-full mt-2">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {fileName ? fileName : <><span className="font-semibold">Upload your resume</span> for personalized suggestions</>}
                                    </p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                            </label>
                        </div>
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</> : <><Search className="mr-2 h-4 w-4" />Discover Events</>}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <motion.div className="flex flex-col items-center justify-center pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Our AI is searching for events...</p>
        </motion.div>
      )}

      {result && (
        <motion.div className="space-y-6" variants={containerVariants}>
            {result.userRole &&
                <motion.div variants={itemVariants}>
                    <Card>
                    <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                        <UserCheck className="w-8 h-8 text-primary" />
                        <div>
                            <CardTitle>Identified Role from Resume</CardTitle>
                            <CardDescription className="text-lg font-semibold text-foreground">{result.userRole}</CardDescription>
                        </div>
                    </CardHeader>
                    </Card>
                </motion.div>
            }
            
            <motion.h2 className="text-2xl font-bold tracking-tight" variants={itemVariants}>Found {result.events.length} Events</motion.h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {result.events.map((event, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="flex flex-col h-full">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">{event.title}</CardTitle>
                                    <Badge variant="secondary">{event.type}</Badge>
                                </div>
                                <CardDescription className="flex items-center gap-2 pt-2">
                                   <Briefcase className="w-4 h-4" /> {event.platform}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{event.date}</span>
                                </div>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                </div>
                            </CardContent>
                             <div className="p-6 pt-0">
                                <Link href={event.applyLink} target="_blank" rel="noopener noreferrer">
                                    <Button className="w-full">
                                        Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
      )}

       {result && result.events.length === 0 && !isLoading && (
        <motion.div 
            className="flex flex-col items-center justify-center pt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Calendar className="w-12 h-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-semibold">No Events Found</p>
            <p className="text-muted-foreground">We couldn't find any events for the selected criteria. Try adjusting your filters.</p>
        </motion.div>
       )}
    </motion.div>
  );
}
