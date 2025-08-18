
'use server';

/**
 * @fileOverview An AI agent that finds relevant events, hackathons, and challenges.
 *
 * - findEvents - A function that handles finding professional events.
 * - EventFinderInput - The input type for the findEvents function.
 * - EventFinderOutput - The return type for the findEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EventFinderInputSchema = z.object({
  resumeDataUri: z.string().optional().describe(
      "An optional resume file, as a data URI, to identify the user's role and find relevant events. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  eventType: z.string().optional().describe('The type of event to search for (e.g., "Hackathon", "Webinar", "Competition").'),
  location: z.string().optional().describe('The location or mode of the event (e.g., "Online", "Offline", "City Name").'),
  cost: z.string().optional().describe('The cost of the event ("Free" or "Paid").'),
  searchTerm: z.string().optional().describe('A specific search term to narrow down events.'),
});
export type EventFinderInput = z.infer<typeof EventFinderInputSchema>;

const EventFinderOutputSchema = z.object({
  userRole: z.string().optional().describe("The user's most likely job role based on the resume analysis. If no resume is provided, this can be empty."),
  events: z.array(
    z.object({
      title: z.string().describe('The title of the event.'),
      description: z.string().describe('A short, compelling description of the event.'),
      platform: z.string().describe('The platform hosting the event (e.g., "Hack2Skill", "MLH", "HackerEarth", "GeeksforGeeks Contests").'),
      type: z.string().describe('The type of event (e.g., "Hackathon", "Webinar", "Competition").'),
      date: z.string().describe('The date or date range of the event (e.g., "18/08/2025" or "Aug 18-20, 2025").'),
      location: z.string().describe('The location of the event (e.g., "Online", "City Name").'),
      applyLink: z.string().url().describe('The direct URL to the event registration or application page.'),
    })
  ).describe('A list of 20 to 30 relevant events, hackathons, or challenges based on the search criteria.'),
});
export type EventFinderOutput = z.infer<typeof EventFinderOutputSchema>;


export async function findEvents(input: EventFinderInput): Promise<EventFinderOutput> {
  return eventFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eventFinderPrompt',
  input: {schema: EventFinderInputSchema},
  output: {schema: EventFinderOutputSchema},
  prompt: `You are an expert at finding professional development events, challenges, and hackathons for students and professionals. Your task is to find relevant opportunities from top platforms like Hack2Skill, MLH (Major League Hacking), HackerEarth, and GeeksforGeeks Contests.

  **Search Criteria:**
  {{#if resumeDataUri}}
  - **Resume Analysis:** Analyze the following resume to identify the user's job role and find the most relevant events.
    Resume: {{media url=resumeDataUri}}
  {{/if}}
  {{#if eventType}}- **Event Type:** {{{eventType}}} {{/if}}
  {{#if location}}- **Location/Mode:** {{{location}}} {{/if}}
  {{#if cost}}- **Cost:** {{{cost}}} {{/if}}
  {{#if searchTerm}}- **Search Term:** {{{searchTerm}}} {{/if}}

  **Instructions:**
  1.  If a resume is provided, first determine the user's likely **Job Role**.
  2.  Find **20 to 30 relevant events** that match the provided criteria.
  3.  Prioritize events that are recent or upcoming.
  4.  For each event, provide the following details:
      - Title
      - A short, compelling description.
      - Platform (e.g., "Hack2Skill", "MLH")
      - Type (e.g., "Hackathon", "Webinar")
      - Date(s) (e.g., "18/08/2025" or "Aug 18-20, 2025")
      - Location ("Online" or city)
      - A direct URL to apply or register.

  **IMPORTANT**: If no events are found matching the criteria, return an empty array for 'events'. Do not throw an error.
  `,
});

const eventFinderFlow = ai.defineFlow(
  {
    name: 'eventFinderFlow',
    inputSchema: EventFinderInputSchema,
    outputSchema: EventFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
