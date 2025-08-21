'use server';

/**
 * @fileOverview An AI agent that generates practical project ideas with a full roadmap.
 *
 * - generateProjectIdea - A function that generates a project idea.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
    ProjectIdeaInputSchema,
    ProjectIdeaOutputSchema,
    type ProjectIdeaInput,
    type ProjectIdeaOutput,
} from './project-idea-generator.types';

export async function generateProjectIdea(input: ProjectIdeaInput): Promise<ProjectIdeaOutput> {
  return generateProjectIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectIdeaPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: ProjectIdeaInputSchema},
  output: {schema: ProjectIdeaOutputSchema},
  prompt: `You are Kaizen AI, an intelligent project idea mentor. Your role is to generate practical and feasible project ideas for users based on their selected programming languages, frameworks, and experience level.

  **User's Choices:**
  - **Frontend:** {{{frontendLanguages}}}
  - **Backend:** {{{backendLanguages}}}
  - **Experience Level:** {{{experienceLevel}}}

  **Instructions:**
  1.  **Generate a Feasible Project Idea:** Based on the user's tech stack, create a clear and practical project idea.
  2.  **Estimate Duration Dynamically:** Provide two time estimates for the project: one for a "Student/Fresher" and one for an "Experienced Developer (1–2 years)". The student timeline should be longer.
  3.  **Define the Project Roadmap in a Tree Structure:** Output the roadmap with the following four main steps. Each step must have a title and an array of detailed sub-steps.

      - **Step 1: Validate the project idea:** Explain the project's purpose and where it can be applied (e.g., finance, medical, education, e-commerce, etc.).
      - **Step 2: Project setup:** Detail the installation process, file structure, and include links to official documentation for the main technologies.
      - **Step 3: Section-wise breakdown:** Explain the logical order of features to build. For example: 1) User Registration, 2) User Login, 3) Dashboard, 4) Core project features.
      - **Step 4: Deployment & publishing:** Describe testing steps and suggest deployment options (e.g., Vercel, Netlify for frontend; Heroku, Render for backend).

  4.  **Complete all Output Fields:** Ensure you provide a response for every field in the JSON schema, including 'projectTitle', 'projectDescription', 'techStack', 'complexity', 'duration', and the full 'projectTree'.

  Generate the response in the required JSON format.
  `,
});

const generateProjectIdeaFlow = ai.defineFlow(
  {
    name: 'generateProjectIdeaFlow',
    inputSchema: ProjectIdeaInputSchema,
    outputSchema: ProjectIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
