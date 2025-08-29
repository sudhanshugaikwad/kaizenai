
'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  MessageSquare, FileText, PenSquare, Sparkles, Rocket, Bot,
  Briefcase, BookOpenCheck, UserSearch, CalendarCheck, Globe, StickyNote, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import kaizenChatImg from './assets/kaizen-chat.png';
import resumeAnalyzerImg from './assets/resume-analyzer.png';
import coverLetterImg from './assets/resume-analyzer.png';
import dreamCareerImg from './assets/dream-career-finder.png';
import roadmapGeneratorImg from './assets/roadmap-generator.png';
import jobMatcherImg from './assets/job-matcher.png';
import interviewPracticeImg from './assets/interview-practice.png';
import hrFinderImg from './assets/hr-finder.png';
import eventsImg from './assets/events.png';
import websiteBuilderImg from './assets/website-builder.png';
import stickyNotesImg from './assets/sticky-notes.png';

const features = [
  { icon: MessageSquare, label: 'Kaizen Ai Chat', image: kaizenChatImg },
  { icon: FileText, label: 'AI Resume Analyzer', image: resumeAnalyzerImg },
  { icon: PenSquare, label: 'AI Cover Letter Writer', image: coverLetterImg },
  { icon: Sparkles, label: 'Dream Career Finder', image: dreamCareerImg },
  { icon: Rocket, label: 'AI Roadmap Generator', image: roadmapGeneratorImg },
  { icon: Bot, label: 'AI Agent Roadmap Generator', image: roadmapGeneratorImg },
  { icon: Briefcase, label: 'AI Job Search and Matching', image: jobMatcherImg },
  { icon: BookOpenCheck, label: 'Interview Practice', image: interviewPracticeImg },
  { icon: UserSearch, label: 'HR Contact Finder', image: hrFinderImg },
  { icon: CalendarCheck, label: 'Events & Hackathons', image: eventsImg },
  { icon: Globe, label: 'Website Builder', image: websiteBuilderImg },
  { icon: StickyNote, label: 'Sticky Notes', image: stickyNotesImg },
  { icon: Zap, label: 'Powerful AI Core', image: kaizenChatImg },
];

type Feature = typeof features[0];

const WindowFrame = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn('relative rounded-lg border border-white/20 bg-black/50 backdrop-blur-sm', className)}>
        <div className="absolute top-0 left-0 flex items-center gap-1.5 p-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="p-4 pt-10 h-full flex items-center justify-center">
            {children}
        </div>
    </div>
);


export default function ToolkitShowcase() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Personal AI Career Toolkit</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Everything you need to land your dream job, powered by AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side: Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
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

        {/* Right side: Image Display */}
        <div className="w-full h-80">
            <WindowFrame className="h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedFeature ? selectedFeature.label : 'empty'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        {selectedFeature ? (
                            <Image
                            src={selectedFeature.image}
                            alt={selectedFeature.label}
                            className="object-contain w-full h-full rounded-md"
                            placeholder="blur"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p className="text-lg font-medium">Image</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </WindowFrame>
        </div>
      </div>
    </div>
  );
}
