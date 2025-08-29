
'use server';

/**
 * @fileOverview An AI agent that validates, fixes, and converts JSON for various automation platforms.
 *
 * - convertJson - A function that handles the JSON conversion process.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

export const JsonConverterInputSchema = z.object({
  jsonString: z.string().describe("The JSON string to be processed."),
  targetPlatform: z.string().describe("The target platform for the JSON conversion (e.g., n8n, Make.com, Zapier)."),
});
export type JsonConverterInput = z.infer<typeof JsonConverterInputSchema>;

export const JsonConverterOutputSchema = z.object({
  fixedJson: z.string().describe("The validated and corrected JSON string."),
  isSuccess: z.boolean().describe("Whether the JSON was successfully validated and fixed."),
  feedback: z.string().describe("Feedback on the original JSON, including any errors found and fixed."),
});
export type JsonConverterOutput = z.infer<typeof JsonConverterOutputSchema>;


export async function convertJson(input: JsonConverterInput): Promise<JsonConverterOutput> {
  return jsonConverterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jsonConverterPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: JsonConverterInputSchema},
  output: {schema: JsonConverterOutputSchema},
  prompt: `You are an expert in automation platforms like n8n, Make.com, and Zapier. Your task is to validate, fix, and convert a given JSON string to make it compatible with a specified target platform.

  **User's Request:**
  - **Target Platform:** {{{targetPlatform}}}
  - **Input JSON:**
  \`\`\`json
  {{{jsonString}}}
  \`\`\`

  **Instructions:**
  1.  **Validate and Fix:** Analyze the input JSON for any syntax errors, structural issues, or inconsistencies. Correct any problems to make it a valid JSON object.
  2.  **Convert for Platform:** If necessary, adjust the structure or content to align with the best practices and required format for the **{{{targetPlatform}}}** platform. For example, ensure node structures, parameter names, and connection formats are correct.
  3.  **Provide Feedback:**
      - If the JSON is valid and requires no changes, set 'isSuccess' to true and provide positive feedback.
      - If errors are found and fixed, set 'isSuccess' to true and explain what was corrected.
      - If the JSON is fundamentally broken and cannot be fixed, set 'isSuccess' to false and provide clear, actionable feedback on why it failed.
  4.  **Return the Result:** Output the corrected and valid JSON in the 'fixedJson' field.

  Generate the response in the required JSON format.
  `,
});

const jsonConverterFlow = ai.defineFlow(
  {
    name: 'jsonConverterFlow',
    inputSchema: JsonConverterInputSchema,
    outputSchema: JsonConverterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
