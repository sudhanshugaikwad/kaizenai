
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
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const RoadmapInputSchema = z.object({
  careerGoal: z
    .string()
    .describe('The desired career goal of the user (e.g., "Data Scientist", "Software Engineer", "Product Manager").'),
});
export type RoadmapInput = z.infer<typeof RoadmapInputSchema>;

const RoadmapOutputSchema = z.object({
  totalDuration: z.string().describe('The total estimated time to complete the entire roadmap (e.g., "3-6 months", "1-2 years").'),
  roadmap: z.array(
    z.object({
      step: z.string().describe('A step in the career roadmap.'),
      reasoning: z.string().describe('The reasoning behind this step.'),
      duration: z.string().describe('An estimated time to complete this step (e.g., "2-4 weeks", "1-2 months").'),
      resources: z.array(
        z.object({
          name: z.string().describe('The name of the resource.'),
          url: z.string().describe('The URL for the resource.'),
        })
      ).describe('A list of helpful resources for this step.'),
    })
  ).describe('A structured plan to achieve the career goal.'),
  recommendedProjects: z.array(
    z.object({
      name: z.string().describe('The name of the recommended project.'),
      description: z.string().describe('A brief description of the project.'),
    })
  ).describe('A list of 5 recommended projects to build a portfolio.'),
  interviewQuestions: z.array(
    z.object({
      question: z.string().describe('A sample interview question.'),
      answer: z.string().describe('A brief, ideal answer or key points to cover for the question.'),
    })
  ).describe('A list of practice interview questions with answers.'),
});
export type RoadmapOutput = z.infer<typeof RoadmapOutputSchema>;

export async function generateRoadmap(input: RoadmapInput): Promise<RoadmapOutput> {
  return generateRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'roadmapPrompt',
  model: googleAI.model('gemini-1.5-pro-latest'),
  input: {schema: RoadmapInputSchema},
  output: {schema: RoadmapOutputSchema},
  prompt: `You are a career coach who helps people achieve their career goals.

  Based on the user's desired career goal, generate a personalized career roadmap.
  For each step, provide a clear title, detailed reasoning, an estimated duration (e.g., "3-4 weeks", "1-2 months"), and a list of 2-3 specific, actionable, and high-quality online resources with their names and URLs.
  Also, calculate and provide the total estimated duration for the entire roadmap.

  In addition, provide:
  1. A list of 5 recommended project ideas with a brief description for each to help build a strong portfolio.
  2. A list of relevant practice interview questions along with brief, ideal answers or key points to cover.

  Be specific and actionable.

  Desired Career Goal: {{{careerGoal}}}
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
