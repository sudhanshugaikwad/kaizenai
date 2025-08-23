
/**
 * @fileOverview Type definitions for the behavioral coach AI flow.
 */

import {z} from 'genkit';

export const BehavioralCoachInputSchema = z.object({
  situation: z.string().describe("The user's description of a situation or experience."),
  question: z.string().optional().describe("An optional interview question this experience is meant to answer (e.g., 'Tell me about a time you handled a conflict.')."),
});
export type BehavioralCoachInput = z.infer<typeof BehavioralCoachInputSchema>;

export const BehavioralCoachOutputSchema = z.object({
    starMethod: z.object({
        situation: z.string().describe("The situation or context of the story."),
        task: z.string().describe("The task or goal the user was trying to achieve."),
        action: z.string().describe("The specific actions the user took."),
        result: z.string().describe("The outcome or result of the user's actions, ideally with quantifiable metrics."),
    }).describe("The user's experience broken down into the STAR (Situation, Task, Action, Result) method."),
    formalAnswer: z.string().describe("A formally structured, professional version of the story suitable for a traditional corporate interview."),
    conversationalAnswer: z.string().describe("A more relaxed, conversational version of the story suitable for a less formal interview setting."),
    leadershipAnswer: z.string().describe("A version of the story that emphasizes leadership, initiative, and impact, suitable for senior or management roles."),
});
export type BehavioralCoachOutput = z.infer<typeof BehavioralCoachOutputSchema>;
