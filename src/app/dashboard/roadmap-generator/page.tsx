'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateRoadmap, type RoadmapOutput } from '@/ai/flows/roadmap-generator';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Rocket, Milestone, Link as LinkIcon, BookOpen, Clock, Lightbulb, HelpCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link';

const formSchema = z.object({
  careerGoal: z.string().min(2, {
    message: 'Career goal must be at least 2 characters.',
  }),
});

export default function RoadmapGeneratorPage() {
  const [roadmap, setRoadmap] = useState<RoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careerGoal: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRoadmap(null);
    try {
      const result = await generateRoadmap(values);
      setRoadmap(result);
    } catch (error) => {
      console.error('Failed to generate roadmap:', error);
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career Roadmap Generator</h1>
        <p className="text-muted-foreground">Enter your desired career and get a personalized roadmap from our AI.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="careerGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Career Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Frontend Developer, Product Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Generate Roadmap
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center pt-10">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is crafting your future...</p>
        </div>
      )}

      {roadmap && (
        <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Personalized Roadmap to Becoming a {form.getValues('careerGoal')}</CardTitle>
            <CardDescription>
                Follow these steps to achieve your career goal. 
                <span className="font-semibold"> Total Estimated Duration: {roadmap.totalDuration}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6">
              {/* Vertical timeline bar */}
              <div className="absolute left-[35px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
              
              <div className="space-y-12">
                {roadmap.roadmap.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute left-0 top-1.5 flex items-center justify-center w-12">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background">
                        <Milestone className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="ml-16">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{`Step ${index + 1}: ${item.step}`}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{item.duration}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-muted-foreground">{item.reasoning}</p>
                      
                      {item.resources && item.resources.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary/80"/>Recommended Resources</h4>
                          <div className="mt-2 space-y-2">
                            {item.resources.map((resource, rIndex) => (
                              <Link href={resource.url} target="_blank" rel="noopener noreferrer" key={rIndex} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                                <LinkIcon className="h-4 w-4 text-primary/50 group-hover:text-primary" />
                                <span className="underline">{resource.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {roadmap.recommendedProjects && roadmap.recommendedProjects.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="h-6 w-6 text-primary"/>Recommended Projects</CardTitle>
                    <CardDescription>Build these projects to create a strong portfolio and showcase your skills.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Accordion type="single" collapsible className="w-full">
                        {roadmap.recommendedProjects.map((project, index) => (
                            <AccordionItem value={`project-${index}`} key={index}>
                                <AccordionTrigger>
                                    <span className="font-semibold">{project.name}</span>
                                </AccordionTrigger>
                                <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                                    {project.description}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        )}

        {roadmap.interviewQuestions && roadmap.interviewQuestions.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HelpCircle className="h-6 w-6 text-primary"/>Interview Practice</CardTitle>
                    <CardDescription>Prepare for your interviews with these common questions and answer guidelines.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {roadmap.interviewQuestions.map((qa, index) => (
                            <AccordionItem value={`qa-${index}`} key={index}>
                                <AccordionTrigger>
                                    <span className="font-semibold text-left">{qa.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                                    {qa.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        )}

        </div>
      )}
    </div>
  );
}
