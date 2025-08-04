
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, FileText, PenSquare, ArrowRight, MessageSquare, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Roadmap Generator",
    description: "Chart your path to success. Get a personalized career roadmap based on your goals.",
    href: "/dashboard/roadmap-generator",
    icon: Rocket,
  },
  {
    title: "Resume Analyzer",
    description: "Optimize your resume. Get AI-powered feedback to stand out to recruiters.",
    href: "/dashboard/resume-analyzer",
    icon: FileText,
  },
  {
    title: "Cover Letter Writer",
    description: "Craft the perfect pitch. Generate compelling cover letters for any job application.",
    href: "/dashboard/cover-letter-writer",
    icon: PenSquare,
  },
  {
    title: "Kaizen AI Chat",
    description: "Have a question? Ask our AI career coach for personalized advice and insights.",
    href: "/dashboard/kaizen-ai-chat",
    icon: MessageSquare,
  },
  {
    title: "Job Matcher",
    description: "Find your next role. Get job recommendations based on your resume.",
    href: "/dashboard/job-matcher",
    icon: Briefcase,
  }
];

export default function DashboardPage() {

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
                <div className="flex items-center gap-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
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
      </motion.div>
    </motion.div>
  );
}
