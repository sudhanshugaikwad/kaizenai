
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { matchJobs, type JobMatcherOutput } from '@/ai/flows/job-matcher';
import { recommendJobs, type SmartJobRecommenderOutput } from '@/ai/flows/smart-job-recommender';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileUp, Sparkles, Briefcase, ExternalLink, Building, Clock, UserCheck, MapPin, BarChart2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';


type ViewMode = 'ai-match' | 'recommendations' | 'insights';

const allSkills = [
    "Software Engineer", "Web Developer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Scientist", "Data Analyst", "Machine Learning Engineer", "AI Engineer",
    "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst", "Network Engineer",
    "UI/UX Designer", "Product Manager", "Project Manager", "Business Analyst",
    "Marketing Manager", "Digital Marketing Specialist", "Content Strategist", "SEO Specialist",
    "Sales Representative", "Account Executive", "Customer Success Manager",
    "Financial Analyst", "Accountant", "Investment Banker",
    "Human Resources Manager", "Recruiter",
    "Graphic Designer", "Video Editor"
];

const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];

const countries = [
    { value: 'USA', label: 'United States' },
    { value: 'India', label: 'India' },
    { value: 'Canada', label: 'Canada' },
    { value: 'GBR', label: 'United Kingdom' },
    { value: 'AUS', label: 'Australia' },
    { value: 'DEU', label: 'Germany' },
    { value: 'FRA', label: 'France' },
    { value: 'JPN', label: 'Japan' },
    { value: 'CHN', label: 'China' },
    { value: 'BRA', label: 'Brazil' },
    { value: 'ZAF', label: 'South Africa' },
];


function AiMatchView() {
    const [result, setResult] = useState<JobMatcherOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();
    
    const jobsPerPage = 9;

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
        setCurrentPage(1);

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

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = result?.matchedJobs.slice(indexOfFirstJob, indexOfLastJob) || [];
    const totalPages = result ? Math.ceil(result.matchedJobs.length / jobsPerPage) : 0;

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>Upload Resume & AI Job Match</CardTitle>
                    <CardDescription>Upload your resume and let our AI find the best job openings for you in India.</CardDescription>
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
                    {result.userJobRole && (
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                                <UserCheck className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle>Identified Role</CardTitle>
                                    <CardDescription className="text-lg font-semibold text-foreground">{result.userJobRole}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    )}

                    <h2 className="text-2xl font-bold tracking-tight">Recommended Jobs & Internships for You</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {currentJobs.map((job, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                            <Card className="flex flex-col h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 border rounded-md bg-muted/50">
                                                <Briefcase className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building className="w-4 h-4" /><span>{job.companyName}</span></div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="flex items-center gap-1.5 whitespace-nowrap"><Clock className="w-3 h-3"/>{job.postedDate}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-4">{job.jobDescription}</p>
                                </CardContent>
                                <div className="p-6 pt-0">
                                    <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full">Apply Now <ExternalLink className="ml-2 h-4 w-4" /></Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                    </div>
                     {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-4">
                            <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                            <span className="text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button variant="outline" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

function SmartRecommendationsView() {
    const [recommendations, setRecommendations] = useState<SmartJobRecommenderOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const jobsPerPage = 9;

    const fetchRecommendations = useCallback(async () => {
        if (selectedSkills.length === 0) {
            toast({ title: "No skills selected", description: "Please select at least one skill.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setRecommendations(null);
        setCurrentPage(1);
        try {
            const result = await recommendJobs({
                jobPreferences: {
                    roles: selectedSkills,
                    jobTypes: selectedJobTypes as any,
                    country: country,
                    city: city,
                    experienceLevel: "Any" 
                }
            });
            setRecommendations(result);
        } catch (error) {
            console.error('Failed to get recommendations:', error);
            toast({ title: "Error", description: "Could not fetch job recommendations.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [selectedSkills, selectedJobTypes, country, city, toast]);

    const handleSkillChange = (skill: string) => {
        setSelectedSkills(prev => 
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const handleJobTypeChange = (jobType: string) => {
        setSelectedJobTypes(prev =>
            prev.includes(jobType) ? prev.filter(jt => jt !== jobType) : [...prev, jobType]
        );
    };

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = recommendations?.recommendedJobs.slice(indexOfFirstJob, indexOfLastJob) || [];
    const totalPages = recommendations ? Math.ceil(recommendations.recommendedJobs.length / jobsPerPage) : 0;
    
    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Smart Job Recommendations</CardTitle>
                    <CardDescription>AI-powered global job recommendations tailored to your profile and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label className="font-semibold">Skills / Roles</Label>
                             <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between mt-2"
                                    >
                                    {selectedSkills.length > 0 ? `${selectedSkills.length} selected` : "Select skills..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search skills..." />
                                        <CommandList>
                                            <CommandEmpty>No skill found.</CommandEmpty>
                                            <CommandGroup>
                                                {allSkills.map((skill) => (
                                                <CommandItem
                                                    key={skill}
                                                    value={skill}
                                                    onSelect={() => {
                                                        handleSkillChange(skill);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", selectedSkills.includes(skill) ? "opacity-100" : "opacity-0")} />
                                                    {skill}
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           <div>
                            <Label className="font-semibold">Job Type</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {jobTypes.map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox id={`jt-${type}`} checked={selectedJobTypes.includes(type)} onCheckedChange={() => handleJobTypeChange(type)} />
                                    <Label htmlFor={`jt-${type}`} className="font-normal">{type}</Label>
                                </div>
                                ))}
                            </div>
                           </div>
                           <div>
                               <Label className="font-semibold">Country</Label>
                               <Select onValueChange={setCountry}>
                                    <SelectTrigger className="w-full mt-2">
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map(c => <SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                           </div>
                           <div>
                               <Label className="font-semibold">City (Optional)</Label>
                               <Input placeholder="Enter city name" value={city} onChange={(e) => setCity(e.target.value)} className="mt-2" />
                           </div>
                        </div>
                    </div>
                    <Button onClick={fetchRecommendations} disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Fetching...</> : 'Get Recommendations'}
                    </Button>
                </CardContent>
            </Card>

             {isLoading && (
                 <div className="flex flex-col items-center justify-center pt-10">
                    <Loader2 className="mr-2 h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg text-muted-foreground">Finding smart recommendations for you...</p>
                </div>
            )}
            
            {recommendations && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Found {recommendations.recommendedJobs.length} Jobs</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {currentJobs.map((job, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                <Card className="flex flex-col h-full">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg line-clamp-1">{job.jobTitle}</CardTitle>
                                            <Badge variant="default">{job.matchScore}%</Badge>
                                        </div>
                                        <CardDescription>{job.companyName} - {job.location}</CardDescription>
                                        <Badge variant="outline" className="flex items-center gap-1.5 whitespace-nowrap w-fit"><Clock className="w-3 h-3"/>{job.postedDate}</Badge>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-3">
                                        <p className="text-sm text-muted-foreground line-clamp-3">{job.jobDescription}</p>
                                        <div>
                                            <p className="text-sm font-semibold">Match Score: {job.matchScore}%</p>
                                            <Progress value={job.matchScore} className="h-2 mt-1" />
                                        </div>
                                        <p className="text-sm text-muted-foreground"><span className="font-semibold">Salary:</span> {job.salaryRange}</p>
                                    </CardContent>
                                    <div className="p-6 pt-0">
                                        <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">
                                            <Button className="w-full">Apply Now <ExternalLink className="ml-2 h-4 w-4" /></Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                     {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-4">
                            <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                            <span className="text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button variant="outline" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}

function JobMarketInsightsView() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
                <CardHeader>
                    <CardTitle>Job Market Insights</CardTitle>
                    <CardDescription>Real-time insights and analytics. This feature is coming soon!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center h-64">
                    <BarChart2 className="w-16 h-16 text-muted-foreground/50" />
                    <p className="mt-4 text-lg font-semibold">Coming Soon</p>
                    <p className="text-muted-foreground">We're working on bringing you detailed job market trends and company insights.</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}


export default function JobMatcherPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('ai-match');

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Job Search and Matching</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-muted p-1 rounded-lg">
            <Button variant={viewMode === 'ai-match' ? 'default' : 'ghost'} onClick={() => setViewMode('ai-match')}>Upload Resume & AI Job Match</Button>
            <Button variant={viewMode === 'recommendations' ? 'default' : 'ghost'} onClick={() => setViewMode('recommendations')}>Smart Job Recommendations</Button>
            <Button variant={viewMode === 'insights' ? 'default' : 'ghost'} onClick={() => setViewMode('insights')}>Job Market Insights</Button>
        </div>

        <div>
            <AnimatePresence mode="wait">
                {viewMode === 'ai-match' && <AiMatchView key="ai-match" />}
                {viewMode === 'recommendations' && <SmartRecommendationsView key="recommendations" />}
                {viewMode === 'insights' && <JobMarketInsightsView key="insights" />}
            </AnimatePresence>
        </div>
    </div>
  );
}
