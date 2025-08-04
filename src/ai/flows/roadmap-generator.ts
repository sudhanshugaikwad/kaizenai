// roadmap-generator.ts
'use server';

/**
 * @fileOverview Generates a personalized career roadmap based on a user's desired career goal.
 *
 * - generateRoadmap - A function that generates a career roadmap.
 * - RoadmapInput - The input type for the generateRoadmap function.
 * - RoadmapOutput - The return type for the generateRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RoadmapInputSchema = z.object({
  careerGoal: z
    .string()
    .describe('The desired career goal of the user (e.g., "Data Scientist", "Software Engineer", "Product Manager").'),
});
export type RoadmapInput = z.infer<typeof RoadmapInputSchema>;

const RoadmapOutputSchema = z.object({
  roadmap: z.array(
    z.object({
      step: z.string().describe('A step in the career roadmap.'),
      reasoning: z.string().describe('The reasoning behind this step.'),
      resources: z.array(
        z.object({
          name: z.string().describe('The name of the resource.'),
          url: z.string().url().describe('The URL for the resource.'),
        })
      ).describe('A list of helpful resources for this step.'),
    })
  ).describe('A structured plan to achieve the career goal.'),
});
export type RoadmapOutput = z.infer<typeof RoadmapOutputSchema>;

export async function generateRoadmap(input: RoadmapInput): Promise<RoadmapOutput> {
  return generateRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'roadmapPrompt',
  input: {schema: RoadmapInputSchema},
  output: {schema: RoadmapOutputSchema},
  prompt: `You are a career coach who helps people achieve their career goals.

  Based on the user's desired career goal, generate a personalized career roadmap.
  For each step, provide a clear title, detailed reasoning, and a list of 2-3 specific, actionable, and high-quality online resources (like articles, courses, or tutorials) with their names and URLs.
  Be specific and actionable.

  Desired Career Goal: {{{careerGoal}}}

  Roadmap:
  `,
});

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: RoadmapInputSchema,
    outputSchema: RoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
