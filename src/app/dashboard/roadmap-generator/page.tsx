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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Rocket, Milestone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

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
    } catch (error) {
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
        <Card>
          <CardHeader>
            <CardTitle>Your Personalized Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {roadmap.roadmap.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                        <Milestone className="h-5 w-5 text-primary"/>
                        <span className="font-semibold">{`Step ${index + 1}: ${item.step}`}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                    <p>{item.reasoning}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
