
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, FileText, PenSquare, ArrowRight, MessageSquare, Briefcase, BookOpenCheck, StickyNote, UserSearch, CalendarCheck, Sparkles, Globe, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import FeedbackForm from './FeedbackForm';
import { useAuth } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';


const features = [
  {
    title: "Kaizen Ai Chat",
    description: "Have a question? Ask our AI career coach for personalized advice and insights.",
    href: "/dashboard/kaizen-ai-chat",
    icon: MessageSquare,
  },
  {
    title: "Dream Career Finder",
    description: "Answer a few questions to discover the career path that best matches your skills and goals.",
    href: "/dashboard/dream-career-finder",
    icon: Sparkles,
  },
  {
    title: "Roadmap Generator",
    description: "Chart your path to success. Get a personalized career roadmap based on your goals.",
    href: "/dashboard/roadmap-generator",
    icon: Rocket,
    pro: true,
  },
  {
    title: "Project Idea Generator",
    description: "Receive practical project ideas with a full roadmap based on your tech stack and experience.",
    href: "/dashboard/project-idea-generator",
    icon: Lightbulb,
  },
  {
    title: "AI Resume Builder",
    description: "Build a professional, ATS-friendly resume with AI-driven suggestions and templates.",
    href: "/dashboard/resume-analyzer",
    icon: FileText,
    pro: true,
  },
  {
    title: "Cover Letter Writer",
    description: "Craft the perfect pitch. Generate compelling cover letters for any job application.",
    href: "/dashboard/cover-letter-writer",
    icon: PenSquare,
  },
  {
    title: "Job Search and Matching",
    description: "Find your next role with smart recommendations and market insights.",
    href: "/dashboard/job-matcher",
    icon: Briefcase,
    pro: true,
  },
   {
    title: "Interview Practice",
    description: "Ace your next interview with AI-powered mock interviews and real-time feedback.",
    href: "/dashboard/interview-practice",
    icon: BookOpenCheck,
    
  },
  {
    title: "HR Contact Finder",
    description: "Find HR contacts by department or by uploading your resume.",
    href: "/dashboard/hr-contact-finder",
    icon: UserSearch,
    pro: true,
  },
  {
    title: "Events & Hackathons",
    description: "Discover events, hackathons, and challenges from top platforms.",
    href: "/dashboard/events-hackathons",
    icon: CalendarCheck,
  },
  {
    title: "Website Builder",
    description: "Create and deploy simple websites using AI.",
    href: "/dashboard/website-builder",
    icon: Globe,
  },
  {
    title: "Sticky Notes",
    description: "Organize your day. Create and manage your tasks with this simple tool.",
    href: "/dashboard/sticky-notes",
    icon: StickyNote,
  },
];

export default function DashboardPage() {
    const { has } = useAuth();
    const isPro = has && has({ permission: 'org:feature:pro_plan' });


    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1,
        },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

  return (
    <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Here are your AI-powered tools to accelerate your career.</p>
      </motion.div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="flex flex-col h-full">
                <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <feature.icon className="h-8 w-8 text-primary" />
                       <CardTitle>{feature.title}</CardTitle>
                    </div>
                    {feature.pro && (
                        <Badge variant={isPro ? "default" : "secondary"}>
                            {isPro ? "Pro" : "Pro"}
                        </Badge>
                    )}
                </div>
                </CardHeader>
                <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href={feature.href} className="w-full">
                      <Button className="w-full">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                  </Link>
                </CardFooter>
            </Card>
          </motion.div>
        ))}
         <motion.div variants={itemVariants} className="lg:col-span-3">
            <FeedbackForm />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
