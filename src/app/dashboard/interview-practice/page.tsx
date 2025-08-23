
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Start Mock Interview",
    description: "Engage in a real-time interview simulation with an AI interviewer tailored to your job role.",
    icon: Sparkles,
    href: "/dashboard/interview-practice/setup",
    cta: "Start Practice",
    disabled: false,
  },
  {
    title: "Browse Question Bank",
    description: "Explore a curated library of questions filtered by role, industry, and difficulty.",
    icon: BookOpen,
    href: "/dashboard/interview-practice/question-bank",
    cta: "Browse Questions",
    disabled: false,
  },
  {
    title: "Try Behavioral Coach",
    description: "Learn to structure your answers effectively using methods like STAR to impress recruiters.",
    icon: MessageCircle,
    href: "/dashboard/interview-practice/behavioral-coach",
    cta: "Start Coaching",
    disabled: false,
  },
];

export default function InterviewPracticeLandingPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Ready to Ace Your Next Interview?</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          AI mock interviews with personalised practice and real-time analytics.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="flex flex-col h-full text-center">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                    <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="pt-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                    className="w-full"
                    onClick={() => !feature.disabled && router.push(feature.href)}
                    disabled={feature.disabled}
                >
                  {feature.cta}
                  {!feature.disabled && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
