
'use server';

/**
 * @fileOverview Generates interview questions for a given category.
 *
 * - generateInterviewQuestions: Generates interview questions.
 * - InterviewQuestionsInput: Input type for the generator.
 * - InterviewQuestionsOutput: Output type for the generator.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InterviewQuestionsInputSchema = z.object({
  category: z.string().describe('The category for which to generate questions (e.g., "Frontend Developer", "DSA").'),
  topics: z.string().describe('Specific topics within the category (e.g., "React.js, JavaScript", "Arrays, Trees").'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the questions.'),
  count: z.number().int().min(5).max(20).describe('The number of questions to generate.'),
});
export type InterviewQuestionsInput = z.infer<typeof InterviewQuestionsInputSchema>;

const InterviewQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The interview question, framed like a LeetCode problem statement.'),
      answer: z.string().describe('A detailed, ideal answer to the question, explaining the approach and concepts.'),
      topic: z.string().describe('The specific topic this question relates to.'),
    })
  ).describe('A list of generated LeetCode-style interview questions.'),
});
export type InterviewQuestionsOutput = z.infer<typeof InterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(
  input: InterviewQuestionsInput
): Promise<InterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewQuestionPrompt',
  input: { schema: InterviewQuestionsInputSchema },
  output: { schema: InterviewQuestionsOutputSchema },
  prompt: `You are an expert interviewer for a top tech company and your task is to generate LeetCode-style problems.

  Generate {{{count}}} interview questions for a candidate applying for a **{{{category}}}** role.
  The questions should be of **{{{difficulty}}}** difficulty.
  Focus on the following topics: **{{{topics}}}**.

  For each question, provide:
  1. A clear and concise **question** that reads like a LeetCode problem statement. Include examples if necessary.
  2. A detailed, ideal **answer** that explains the logic, algorithm, and data structures used to solve the problem.
  3. The specific **topic** the question falls under.

  Ensure the questions are practical, relevant, and similar in style to what one would find on LeetCode. Do not include a direct link.`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: InterviewQuestionsInputSchema,
    outputSchema: InterviewQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
