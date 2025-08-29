
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
  2.  **Workflow Steps:** Define a clear, step-by-step workflow for the agent. Provide 4 logical steps: 1. "Manual Trigger", 2. "Set Input Data", 3. "AI Model Call", and 4. "Output Formatting". Each step must have a unique 'id', 'title', and 'description'.
  3.  **JSON Output:** Create a valid n8n workflow JSON string that a user can directly import.
      - The workflow must have 4 nodes corresponding to the workflow steps.
      - **Node 1 (startNode):** A "Start" node.
      - **Node 2 (setNode):** A "Set" node to define the input. Give it a descriptive name and include a string field named \`prompt\`.
      - **Node 3 (aiNode):** A "Google Gemini" node. Set the "Model" to "gemini-1.5-flash-latest" and configure the "Text" field to use the prompt from the Set node.
      - **Node 4 (outputNode):** A "Respond to Webhook" node. Configure it to return the text output from the Gemini node.
      - Define the connections between the nodes logically: Start -> Set -> AI -> Respond.
  4.  **Resources and Tips:** Provide a list of 3-4 helpful resources and tips. Each item must have a 'title' and 'content'. Include topics relevant to building n8n workflows with AI.

  **Example n8n JSON Structure (use this as a template):**
  \`\`\`json
  {
    "name": "{{{agentName}}}",
    "nodes": [
      {
        "parameters": {},
        "id": "5a42d99b-029e-4364-814f-48d6174a7536",
        "name": "Start",
        "type": "n8n-nodes-base.start",
        "typeVersion": 1.1,
        "position": [820, 440]
      },
      {
        "parameters": { "values": { "string": [ { "name": "prompt", "value": "User input for {{{agentName}}}" } ] }, "options": {} },
        "id": "3c1a9b2f-4e6d-4f7c-8d3a-1b5e2f0a1c3d",
        "name": "Set Input",
        "type": "n8n-nodes-base.set",
        "typeVersion": 3.4,
        "position": [1040, 440]
      },
      {
        "parameters": { "model": "gemini-1.5-flash-latest", "text": "={{ $('Set Input').item.json.prompt }}" },
        "id": "a2b4c6d8-1e9f-4a2b-9c8d-3e5f7a9b1d2c",
        "name": "Gemini AI Call",
        "type": "n8n-nodes-base.googleGemini",
        "typeVersion": 1,
        "position": [1260, 440],
        "credentials": { "googleGeminiApi": { "id": "YOUR_CREDENTIAL_ID", "name": "Google Gemini account" } }
      },
      {
        "parameters": { "responseCode": 200, "responseData": "={{ $('Gemini AI Call').item.json.text }}" },
        "id": "f8d7e6c5-3b2a-4f1e-9c8d-2a4b6c8d0e1f",
        "name": "Respond to Webhook",
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 2,
        "position": [1480, 440]
      }
    ],
    "connections": {
      "Start": { "main": [ [ { "node": "Set Input", "type": "main", "index": 0 } ] ] },
      "Set Input": { "main": [ [ { "node": "Gemini AI Call", "type": "main", "index": 0 } ] ] },
      "Gemini AI Call": { "main": [ [ { "node": "Respond to Webhook", "type": "main", "index": 0 } ] ] }
    },
    "settings": {},
    "staticData": null,
    "pinData": {},
    "versionId": "c8e7d6f5-2a4b-4f1e-9c8d-1b5e2f0a1c3d",
    "triggerCount": 0,
    "tags": []
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
