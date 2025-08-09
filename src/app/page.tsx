
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Rocket,
  FileText,
  PenSquare,
  ArrowRight,
  MessageSquare,
  Briefcase,
  Zap,
  LogIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import TestimonialsSection from './TestimonialsSection';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from "next/image";
import logo from "./Kaizenai.png"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import CreateAccount from "./assets/CreateYourAccount.png"
import UsetheAITools from "./assets/UsetheAITools.png"
import GetInstantFeedback from "./assets/GetInstantFeedback.png"
import LandYourDreamJob from "./assets/LandYourDreamJob.png"
import ScrollRevealText from './ScrollRevealText';
import Footer from './footer';

const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'AI Roadmap Generator',
    description: 'Chart your path to success. Get a personalized career roadmap with timelines, resources, and project ideas.',
    href: '/dashboard/roadmap-generator',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'AI Resume Analyzer',
    description: 'Optimize your resume with AI-powered feedback, ATS keyword analysis, and improvement suggestions.',
    href: '/dashboard/resume-analyzer',
  },
  {
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    title: 'AI Cover Letter Writer',
    description: 'Generate compelling and personalized cover letters tailored to any job description in seconds.',
    href: '/dashboard/cover-letter-writer',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'AI Job Matcher',
    description: 'Upload your resume and let our AI find the best, most recent job openings for you in India.',
    href: '/dashboard/job-matcher',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Kaizen Ai Chat',
    description: 'Get instant career advice from an AI coach. Ask about interviews, skills, and career paths.',
    href: '/dashboard/kaizen-ai-chat',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Powerful AI Core',
    description: 'Powered by advanced generative AI to provide you with the most accurate and relevant career tools.',
    href: '/dashboard',
  },
];

const howItWorksSteps = [
  {
    title: 'Create Your Account',
    description: 'Sign up for free to get instant access to our full suite of AI-powered career tools.',
    image: CreateAccount,
    "data-ai-hint": "account creation signup"
  },
  {
    title: 'Use the AI Tools',
    description: 'From roadmaps to resumes, leverage our specialized AI to generate personalized career assets.',
    image: UsetheAITools,
     "data-ai-hint": "dashboard tools"
  },
  {
    title: 'Get Instant Feedback',
    description: 'Receive actionable insights, scores, and content to improve your job application materials.',
    image: GetInstantFeedback,
     "data-ai-hint": "feedback results"
  },
  {
    title: 'Land Your Dream Job',
    description: 'Apply with confidence using your newly optimized resume and compelling cover letter.',
    image: LandYourDreamJob,
     "data-ai-hint": "job offer success"
  },
];


const HowItWorksSection = () => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <motion.section
          id="how-it-works"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it Works?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="flex flex-col gap-4">
                {howItWorksSteps.map((step, index) => (
                    <motion.div
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={cn(
                            'p-6 rounded-lg cursor-pointer border-2 transition-all',
                            activeStep === index
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-transparent bg-muted/50 hover:bg-muted'
                        )}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all",
                                activeStep === index ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
                            )}>
                                {index + 1}
                            </div>
                            <div>
                                <p className="text-md font-medium">{step.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="relative h-[450px] w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={howItWorksSteps[activeStep].image}
                            alt={howItWorksSteps[activeStep].title}
                            data-ai-hint={howItWorksSteps[activeStep]['data-ai-hint']}
                            width={600}
                            height={450}
                            className="rounded-lg shadow-2xl object-cover w-full h-full"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
          </div>
        </motion.section>
    );
};


export default function Home() {
  const { user } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-2">
        <Image src={logo} alt="Kaizen Ai" width={150} height={100}/>
        </Link>
        <div className='flex items-center gap-2'>
            <SignedIn>
            <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-sm font-medium">Welcome, {user?.firstName}</span>
                <UserButton afterSignOutUrl="/" />
            </div>
            </SignedIn>
            <SignedOut>
            <Link href="/sign-in">
                <Button variant="outline">
                Login <LogIn className="ml-2 h-4 w-4" />
                </Button>
            </Link>
            </SignedOut>
            <ThemeToggle />
        </div>
      </motion.header>

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-20 md:py-32 overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="absolute inset-0 -z-10 h-full w-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
              src="/kaizenai.mp4"
            >
              Your browser does not support the video tag.
            </video>
             <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative z-10">
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Supercharge Your Career with{' '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Kaizen Ai
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-md sm:text-lg text-muted-foreground mb-8">
              The all-in-one AI platform to help you build a personalized career roadmap, optimize your resume, write compelling cover letters, and find the perfect job.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </SignedIn>
              <SignedOut>
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </SignedOut>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Personal AI Career Toolkit</h2>
            <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Everything you need to land your dream job, powered by AI.</p>
          </motion.div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div key={feature.title} custom={index} variants={featureCardVariants}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4 border border-primary/20">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <ScrollRevealText />

        <motion.section 
            id="testimonials"
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            <TestimonialsSection />
        </motion.section>

        <HowItWorksSection />

        {/* CTA Section */}
        <motion.section
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants}
        >
          <div className="bg-card/50 border border-border/50 rounded-lg p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Ready to Find Your Dream Job?</h2>
            <p className="max-w-2xl mx-auto mt-2 text-muted-foreground mb-8">
              Stop guessing and start building a winning career strategy. Your next opportunity is just a click away.
            </p>
            <Link href="/sign-up">
              <Button size="lg">
                Start Your Journey Now <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

    