
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    title: "AI Agent Roadmap Generator",
    description: "Generate a complete, step-by-step roadmap for building a new AI agent on platforms like n8n.",
    icon: Bot,
    href: "/dashboard/agent-roadmap-generator",
    cta: "Start Building",
  },
];

export default function AgentGeneratorLandingPage() {
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
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Agent Generator Tools</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
            Your hub for creating, customizing, and deploying powerful AI agents for your favorite automation platforms.
            </p>
        </div>
        <Link href="/dashboard">
            <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Dashboard
            </Button>
        </Link>
      </motion.div>

      <motion.div
        className="grid gap-8 md:grid-cols-1"
        variants={containerVariants}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="flex flex-col h-full text-center hover:border-primary transition-colors">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                    <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="pt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                    className="w-full"
                    onClick={() => router.push(feature.href)}
                >
                  {feature.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
