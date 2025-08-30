
'use client';

import { useState, useRef } from 'react';
import {
  MessageSquare, FileText, PenSquare, Sparkles, Rocket, Bot,
  Briefcase, BookOpenCheck, UserSearch, CalendarCheck, Globe, StickyNote, Zap, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


const codeSnippets = {
  default: `
// Welcome to the Genkit Functions Showcase!
// Select a tool to see its core AI function.

import { generate } from '@genkit-ai/ai';
import { defineFlow } from 'genkit';
import { z } from 'zod';

function selectATool(toolName) {
  console.log(\`Loading Genkit code for \${toolName}...\`);
  // Your journey into AI-powered development starts here.
}
`,
  'Kaizen Ai Chat': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const kaizenChatFlow = defineFlow(
  {
    name: 'kaizenChatFlow',
    inputSchema: z.object({ message: z.string() }),
    outputSchema: z.string(),
  },
  async ({ message }) => {
    const response = await generate({
      prompt: \`You are a helpful career coach. Respond to: \${message}\`,
    });
    return response.text();
  }
);
`,
  'AI Resume Analyzer': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const resumeAnalyzerFlow = defineFlow(
  {
    name: 'resumeAnalyzerFlow',
    inputSchema: z.object({ resume: z.string() }),
    outputSchema: z.object({
      feedback: z.string(),
      keywords: z.array(z.string()),
    }),
  },
  async ({ resume }) => {
    const response = await generate({
      prompt: \`Analyze resume: \${resume} and suggest improvements and keywords.\`,
    });
    // In a real flow, you'd parse the response into the schema.
    return {
      feedback: response.text(),
      keywords: response.usage.custom?.keywords || [],
    };
  }
);
`,
  'AI Cover Letter Writer': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const coverLetterFlow = defineFlow(
  {
    name: 'coverLetterFlow',
    inputSchema: z.object({
      resume: z.string(),
      jobDesc: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ resume, jobDesc }) => {
    const response = await generate({
      prompt: \`Write a compelling cover letter using the provided resume for the following job: \${jobDesc}. Resume: \${resume}\`,
    });
    return response.text();
  }
);
`,
  'Dream Career Finder': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const careerFinderFlow = defineFlow(
  {
    name: 'careerFinderFlow',
    inputSchema: z.object({
      skills: z.array(z.string()),
      preferences: z.string(),
    }),
    outputSchema: z.array(z.string()),
  },
  async ({ skills, preferences }) => {
    const response = await generate({
      prompt: \`Find careers matching skills: \${skills.join(', ')} and preferences: \${preferences}.\`,
    });
    return response.text().split('\\n').filter(line => line.trim());
  }
);
`,
  'AI Roadmap Generator': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const roadmapGeneratorFlow = defineFlow(
  {
    name: 'roadmapGeneratorFlow',
    inputSchema: z.object({ goal: z.string() }),
    outputSchema: z.array(z.string()),
  },
  async ({ goal }) => {
    const response = await generate({
      prompt: \`Generate a detailed, step-by-step roadmap for a user whose goal is: \${goal}.\`,
    });
    return response.text().split('\\n').filter(line => line.trim());
  }
);
`,
  'AI Agent Roadmap Generator': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const agentRoadmapFlow = defineFlow(
  {
    name: 'agentRoadmapFlow',
    inputSchema: z.object({ agentGoal: z.string() }),
    outputSchema: z.array(z.string()),
  },
  async ({ agentGoal }) => {
    const response = await generate({
      prompt: \`Generate a detailed AI agent development roadmap for the following task: \${agentGoal}.\`,
    });
    return response.text().split('\\n').filter(line => line.trim());
  }
);
`,
  'AI Job Search and Matching': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const jobSearchFlow = defineFlow(
  {
    name: 'jobSearchFlow',
    inputSchema: z.object({ profile: z.string() }),
    outputSchema: z.array(z.string()),
  },
  async ({ profile }) => {
    const response = await generate({
      prompt: \`Based on this profile, find 5 matching job titles and companies: \${profile}.\`,
    });
    return response.text().split('\\n').filter(line => line.trim());
  }
);
`,
  'Interview Practice': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const interviewPracticeFlow = defineFlow(
  {
    name: 'interviewPracticeFlow',
    inputSchema: z.object({ jobRole: z.string() }),
    outputSchema: z.object({
      questions: z.array(z.string()),
      feedback: z.string(),
    }),
  },
  async ({ jobRole }) => {
    const response = await generate({
      prompt: \`Generate 5 interview questions for a \${jobRole} and provide general feedback.\`
    });
    // In a real flow, you'd parse the response into the schema.
    return {
        questions: response.text().split('?').map(q => q.trim() + '?'),
        feedback: "Practice answering concisely and with confidence."
    };
  }
);
`,
  'HR Contact Finder': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const hrContactFinderFlow = defineFlow(
  {
    name: 'hrContactFinderFlow',
    inputSchema: z.object({ company: z.string(), role: z.string() }),
    outputSchema: z.array(z.object({ name: z.string(), email: z.string() })),
  },
  async ({ company, role }) => {
    // This is a placeholder for a real data lookup tool
    console.log(\`Searching for HR contacts at \${company} for \${role}\`);
    return [
      { name: 'Jane Doe', email: 'jane.doe@example.com' },
      { name: 'John Smith', email: 'john.smith@example.com' },
    ];
  }
);
`,
  'Events & Hackathons': `
import { defineFlow } from 'genkit';
import { z } from 'zod';

// Assumes a 'search' tool is defined elsewhere
// import { search } from './tools';

export const eventFinderFlow = defineFlow(
  {
    name: 'eventFinderFlow',
    inputSchema: z.object({ topic: z.string() }),
    outputSchema: z.array(z.string()),
  },
  async ({ topic }) => {
    // const results = await search({ domain: 'events', query: topic });
    console.log(\`Searching for events related to \${topic}\`);
    return ["AI Conference 2024", "Web Dev Hackathon"];
  }
);
`,
  'Website Builder': `
import { defineFlow, generate } from 'genkit';
import { z } from 'zod';

export const websiteBuilderFlow = defineFlow(
  {
    name: 'websiteBuilderFlow',
    inputSchema: z.object({ idea: z.string() }),
    outputSchema: z.object({ html: z.string(), css: z.string() }),
  },
  async ({ idea }) => {
    const response = await generate({
      prompt: \`Generate HTML and CSS for a simple landing page about: \${idea}.\`
    });
    // In a real flow, you'd parse the response.
    return { html: '<h1>Welcome</h1>', css: 'body { font-family: sans-serif; }'};
  }
);
`,
  'Sticky Notes': `
import { defineFlow, state } from 'genkit';
import { z } from 'zod';

export const stickyNoteFlow = defineFlow(
  {
    name: 'stickyNoteFlow',
    inputSchema: z.object({ content: z.string() }),
    outputSchema: z.string(),
  },
  async ({ content }) => {
    const noteId = \`note_\${Date.now()}\`;
    await state.set(noteId, { content });
    return \`Note saved with ID: \${noteId}\`;
  }
);
`,
  'Powerful AI Core': `
import { generate } from '@genkit-ai/ai';

// The core of Genkit is the 'generate' function,
// which provides a unified interface to interact
// with various AI models.

async function runCoreQuery(promptText) {
  const llmResponse = await generate({
    prompt: promptText,
    model: 'googleai/gemini-1.5-flash',
    output: {
      format: 'json',
      schema: z.object({ result: z.string() })
    },
    config: { temperature: 0.7 },
  });

  return llmResponse.output()?.result;
}
`,
};


const features = [
  { icon: MessageSquare, label: 'Kaizen Ai Chat' },
  { icon: FileText, label: 'AI Resume Analyzer' },
  { icon: PenSquare, label: 'AI Cover Letter Writer' },
  { icon: Sparkles, label: 'Dream Career Finder' },
  { icon: Rocket, label: 'AI Roadmap Generator' },
  { icon: Bot, label: 'AI Agent Roadmap Generator' },
  { icon: Briefcase, label: 'AI Job Search and Matching' },
  { icon: BookOpenCheck, label: 'Interview Practice' },
  { icon: UserSearch, label: 'HR Contact Finder' },
  { icon: CalendarCheck, label: 'Events & Hackathons' },
  { icon: Globe, label: 'Website Builder' },
  { icon: StickyNote, label: 'Sticky Notes' },
  { icon: Zap, label: 'Powerful AI Core' },
];

type Feature = keyof typeof codeSnippets;


function CodeBlock({ code }: { code: string }) {
    const { toast } = useToast();
    
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast({ title: 'Copied to clipboard!' });
    }

    return (
        <div className="relative h-full rounded-lg bg-[#1E1E1E] p-4 font-mono text-sm">
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                onClick={handleCopy}
            >
                <Copy className="h-4 w-4" />
            </Button>
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', height: '100%' }}>
                {code.trim()}
            </SyntaxHighlighter>
        </div>
    )
}

export default function ToolkitShowcase() {
  const [selectedFeature, setSelectedFeature] = useState<Feature>('default');

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Personal AI Career Toolkit</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Everything you need to land your dream job, powered by Genkit AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left side: Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {features.map((feature) => (
            <Button
              key={feature.label}
              variant={selectedFeature === feature.label ? 'default' : 'secondary'}
              onClick={() => setSelectedFeature(feature.label as Feature)}
              className="flex items-center gap-2"
            >
              <feature.icon className="h-4 w-4" />
              {feature.label}
            </Button>
          ))}
        </div>

        {/* Right side: Code Display */}
        <div className="w-full h-96 lg:h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                >
                    <CodeBlock code={codeSnippets[selectedFeature] || codeSnippets.default} />
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
