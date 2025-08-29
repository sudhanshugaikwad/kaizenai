
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "AI Agent Roadmap Generator",
    description: "Generate a full-fledged roadmap and importable JSON file for building AI agents on platforms like n8n, Make.com, and Zapier.",
    icon: Compass,
    href: "/dashboard/agent-generator/roadmap",
    cta: "Start Building",
    disabled: false,
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
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Agent Generator Tools</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Your command center for creating, customizing, and deploying AI agents on various no-code/low-code platforms.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center"
        variants={containerVariants}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants} className="md:col-span-1 lg:col-span-1 flex">
            <Card className="flex flex-col h-full text-center w-full">
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
