
'use client';

import { useState } from 'react';
import {
  MessageSquare, FileText, PenSquare, Sparkles, Rocket, Bot,
  Briefcase, BookOpenCheck, UserSearch, CalendarCheck, Globe, StickyNote, Zap, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const codeSnippets = {
  default: `// Welcome to the Kaizen AI Toolkit!
// Click any feature to see its code.

function welcome() {
  console.log("Explore the power of Genkit AI!");
}`,
  'Kaizen Ai Chat': `// 1. Kaizen Ai Chat
async function kaizenAiChat(message) {
  return await genkit.chat({ prompt: message });
}`,
  'AI Resume Analyzer': `// 2. AI Resume Analyzer
async function resumeAnalyzer(resumeText) {
  return await genkit.analyze({ type: "resume", content: resumeText });
}`,
  'AI Cover Letter Writer': `// 3. AI Cover Letter Writer
async function coverLetterWriter(jobDesc, resume) {
  return await genkit.generate({
    task: "coverLetter",
    inputs: { job: jobDesc, resume },
  });
}`,
  'Dream Career Finder': `// 4. Dream Career Finder
async function dreamCareerFinder(skills, interests) {
  return await genkit.match({
    domain: "career",
    profile: { skills, interests },
  });
}`,
  'AI Roadmap Generator': `// 5. AI Roadmap Generator
async function aiRoadmapGenerator(goal) {
  return await genkit.plan({
    task: "roadmap",
    target: goal,
  });
}`,
  'AI Agent Roadmap Generator': `// 6. AI Agent Roadmap Generator
async function agentRoadmapGenerator(agentType) {
  return await genkit.plan({
    task: "agentRoadmap",
    type: agentType,
  });
}`,
  'AI Job Search and Matching': `// 7. AI Job Search and Matching
async function jobSearchMatching(profile) {
  return await genkit.search({
    domain: "jobs",
    query: profile,
  });
}`,
  'Interview Practice': `// 8. Interview Practice
async function interviewPractice(role) {
  return await genkit.simulate({
    scenario: "interview",
    role,
  });
}`,
  'HR Contact Finder': `// 9. HR Contact Finder
async function hrContactFinder(company) {
  return await genkit.search({
    domain: "contacts",
    query: { company, role: "HR" },
  });
}`,
  'Events & Hackathons': `// 10. Events & Hackathons
async function eventsHackathons(topic) {
  return await genkit.search({
    domain: "events",
    query: topic,
  });
}`,
  'Website Builder': `// 11. Website Builder
async function websiteBuilder(idea) {
  return await genkit.generate({
    task: "website",
    inputs: { concept: idea },
  });
}`,
  'Sticky Notes': `// 12. Sticky Notes
async function stickyNotes(content) {
  return await genkit.memory.save({
    type: "note",
    data: content,
  });
}`,
  'Powerful AI Core': `// 13. Powerful AI Core
async function powerfulAiCore(query) {
  return await genkit.core({ query });
}`,
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

type Feature = typeof features[0];

const CodeBlock = ({ code }: { code: string }) => {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast({ title: 'Copied to clipboard!' });
    };

    return (
        <div className="relative rounded-lg bg-[#1E1E1E] text-sm font-code h-full">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 text-white/50 hover:text-white hover:bg-white/10"
                onClick={handleCopy}
            >
                <Copy className="h-4 w-4" />
            </Button>
            <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{
                    background: 'transparent',
                    margin: 0,
                    padding: '1.25rem',
                    height: '100%',
                    overflow: 'auto',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "var(--font-code), monospace"
                  }
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};


export default function ToolkitShowcase() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const currentCode = selectedFeature ? codeSnippets[selectedFeature.label as keyof typeof codeSnippets] : codeSnippets.default;

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Personal AI Career Toolkit</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Everything you need to land your dream job, powered by AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left side: Buttons */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          {features.map((feature) => (
            <Button
              key={feature.label}
              variant={selectedFeature?.label === feature.label ? 'default' : 'secondary'}
              onClick={() => setSelectedFeature(feature)}
              className="flex items-center gap-2"
            >
              <feature.icon className="h-4 w-4" />
              {feature.label}
            </Button>
          ))}
        </div>

        {/* Right side: Code Display */}
        <div className="w-full h-80 lg:h-96">
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedFeature ? selectedFeature.label : 'empty'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                >
                   <CodeBlock code={currentCode} />
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
