'use server';

/**
 * @fileOverview An AI agent that generates a description for another AI agent.
 *
 * - generateAgentDescription - A function that handles the description generation.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

export const AgentDescriptionInputSchema = z.object({
    agentName: z.string().describe("The name of the AI agent."),
    agentType: z.string().describe("The type or category of the AI agent."),
    platformName: z.string().describe("The platform where the agent will be used (e.g., n8n, Zapier)."),
});
export type AgentDescriptionInput = z.infer<typeof AgentDescriptionInputSchema>;

export const AgentDescriptionOutputSchema = z.object({
  description: z.string().describe("The generated, detailed description for the AI agent."),
});
export type AgentDescriptionOutput = z.infer<typeof AgentDescriptionOutputSchema>;

export async function generateAgentDescription(input: AgentDescriptionInput): Promise<AgentDescriptionOutput> {
  return generateAgentDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentDescriptionGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: AgentDescriptionInputSchema},
  output: {schema: AgentDescriptionOutputSchema},
  prompt: `You are an expert prompt engineer and AI architect. Your task is to generate a detailed, clear, and concise description for an AI agent based on the provided inputs.

  **Agent Details:**
  - **Name:** {{{agentName}}}
  - **Type:** {{{agentType}}}
  - **Platform:** {{{platformName}}}

  **Instructions:**
  1.  Start by summarizing the agent's primary function.
  2.  Explain its key capabilities and what it helps the user to achieve.
  3.  Mention the target platform and how it integrates.
  4.  Keep the tone professional and informative.
  5.  The description should be 2-4 sentences long.

  Generate the description now.
  `,
});

const generateAgentDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAgentDescriptionFlow',
    inputSchema: AgentDescriptionInputSchema,
    outputSchema: AgentDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
