
'use server';

/**
 * @fileOverview Generates a complete roadmap for building an AI agent.
 *
 * - generateAgentRoadmap - A function that generates the agent roadmap.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
    AgentRoadmapInputSchema,
    AgentRoadmapOutputSchema,
    type AgentRoadmapInput,
    type AgentRoadmapOutput
} from './agent-roadmap-generator.types';

export { type AgentRoadmapOutput };

export async function generateAgentRoadmap(input: AgentRoadmapInput): Promise<AgentRoadmapOutput> {
  return generateAgentRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentRoadmapGeneratorPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: AgentRoadmapInputSchema},
  output: {schema: AgentRoadmapOutputSchema},
  prompt: `You are an expert AI agent architect for n8n. Your task is to generate a complete and functional roadmap for creating the specified AI agent.

  **User's Request:**
  - **Agent Name:** {{{agentName}}}
  - **Agent Type:** {{{agentType}}}
  - **Platform:** {{{platformName}}}
  - **Description:** {{#if description}}{{{description}}}{{else}}Not provided.{{/if}}

  **Your Task:**
  Generate a comprehensive roadmap for creating the specified AI agent on the n8n platform. The output must be a valid JSON object that follows the defined schema.

  **Instructions:**
  1.  **Summary:** Write a brief, encouraging summary of the agent's purpose and the roadmap you are providing.
  2.  **Workflow Steps:** Define a clear, step-by-step workflow for the agent. Provide at least 4 logical steps, like "Webhook Input", "Pre-Processing", "AI Model Call", and "Respond to Webhook". Each step must have a unique 'id', 'title', and 'description'.
  3.  **JSON Output:** Create a valid n8n workflow JSON string that a user can directly import. Use the structure provided below as a template. You MUST replace the "name" field with the user's requested "agentName". The rest of the structure should be used as is to ensure validity.
  4.  **Resources and Tips:** Provide a list of 3-4 helpful resources and tips. Each item must have a 'title' and 'content'. Include topics relevant to building n8n workflows with AI.

  **n8n JSON Template:**
  \`\`\`json
  {
    "name": "{{{agentName}}}",
    "nodes": [
      {
        "parameters": { "httpMethod": "POST", "path": "genkit-ai", "options": {} },
        "name": "Webhook Input", "type": "n8n-nodes-base.webhook", "typeVersion": 1, "position": [250, 300]
      },
      {
        "parameters": { "functionCode": "return [{ json: { prompt: \`User said: \${$json[\\"userMessage\\"]}\`, context: $json[\\"context\\"] || {} } }];" },
        "name": "Pre-Processing", "type": "n8n-nodes-base.function", "typeVersion": 1, "position": [500, 300]
      },
      {
        "parameters": { "resource": "completion", "operation": "create", "model": "gpt-3.5-turbo", "prompt": "={{$json[\\"prompt\\"]}}", "temperature": 0.7, "maxTokens": 300 },
        "name": "OpenAI Chat", "type": "n8n-nodes-base.openAi", "typeVersion": 1, "position": [750, 300],
        "credentials": { "openAiApi": { "id": "your-credential-id", "name": "OpenAI Account" } }
      },
      {
        "parameters": { "functionCode": "const responseText = $json[\\"data\\"]?.[0]?.[\\"text\\"] || ($json[\\"choices\\"] && $json[\\"choices\\"][0]?.[\\"message\\"]?.[\\"content\\"]) || \\"(no response)\\";\\nreturn [{ json: { response: responseText, context: $json[\\"context\\"], timestamp: new Date().toISOString() } }];" },
        "name": "Post-Processing", "type": "n8n-nodes-base.function", "typeVersion": 1, "position": [1000, 300]
      },
      {
        "parameters": { "respondWith": "json", "options": {} },
        "name": "Respond to Webhook", "type": "n8n-nodes-base.respondToWebhook", "typeVersion": 1, "position": [1250, 300]
      }
    ],
    "connections": {
      "Webhook Input": { "main": [ [ { "node": "Pre-Processing", "type": "main", "index": 0 } ] ] },
      "Pre-Processing": { "main": [ [ { "node": "OpenAI Chat", "type": "main", "index": 0 } ] ] },
      "OpenAI Chat": { "main": [ [ { "node": "Post-Processing", "type": "main", "index": 0 } ] ] },
      "Post-Processing": { "main": [ [ { "node": "Respond to Webhook", "type": "main", "index": 0 } ] ] }
    }
  }
  \`\`\`

  Generate the response in the required JSON format.
  `
});


const generateAgentRoadmapFlow = ai.defineFlow(
  {
    name: 'generateAgentRoadmapFlow',
    inputSchema: AgentRoadmapInputSchema,
    outputSchema: AgentRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
