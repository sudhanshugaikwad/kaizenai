/**
 * @fileOverview Type definitions for the JSON converter AI flow.
 */
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
