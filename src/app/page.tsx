
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
  BookOpenCheck,
  UserSearch,
  StickyNote,
} from 'lucide-react';
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
import { Logo } from '@/components/icons';


const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Kaizen Ai Chat',
    description: 'Get instant career advice from an AI coach. Ask about interviews, skills, and career paths.',
    href: '/dashboard/kaizen-ai-chat',
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
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'AI Roadmap Generator',
    description: 'Chart your path to success. Get a personalized career roadmap with timelines, resources, and project ideas.',
    href: '/dashboard/roadmap-generator',

  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'AI Job Matcher',
    description: 'Upload your resume and let our AI find the best, most recent job openings for you in India.',
    href: '/dashboard/job-matcher',
    new: true,
  },

  {
    icon: <BookOpenCheck className="h-8 w-8 text-primary" />,
    title: 'Interview Practice',
    description: 'Ace your interviews with AI-powered mock sessions and real-time feedback.',
    href: '/dashboard/interview-practice',
    new: true,
  },
  {
    icon: <UserSearch className="h-8 w-8 text-primary" />,
    title: 'HR Contact Finder',
    description: 'Find HR contacts by department or by analyzing your resume for the best fit.',
    href: '/dashboard/hr-contact-finder',
    new: true,
  },
  {
    icon: <StickyNote className="h-8 w-8 text-primary" />,
    title: 'Sticky Notes',
    description: 'Organize your daily tasks and stay productive with AI-powered suggestions.',
    href: '/dashboard/sticky-notes',
    new: true,
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Powerful AI Core',
    description: 'Powered by advanced generative AI to provide you with the most accurate and relevant career tools.',
    href: '/dashboard',
  },
];

const footerFeatures = [
    {
      title: 'AI Roadmap Generator',
      href: '/dashboard/roadmap-generator',
    },
    {
      title: 'AI Resume Analyzer',
      href: '/dashboard/resume-analyzer',
    },
    {
      title: 'AI Cover Letter Writer',
      href: '/dashboard/cover-letter-writer',
    },
    {
      title: 'AI Job Matcher',
      href: '/dashboard/job-matcher',
    },
    {
      title: 'Kaizen Ai Chat',
      href: '/dashboard/kaizen-ai-chat',
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
        <section
          id="how-it-works"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it Works?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="flex flex-col gap-4">
                {howItWorksSteps.map((step, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={cn(
                            'p-6 rounded-lg cursor-pointer border-2 transition-all',
                            activeStep === index
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-transparent bg-muted/50 hover:bg-muted'
                        )}
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
                    </div>
                ))}
            </div>
            <div className="relative h-[450px] w-full">
                <Image
                    src={howItWorksSteps[activeStep].image}
                    alt={howItWorksSteps[activeStep].title}
                    data-ai-hint={howItWorksSteps[activeStep]['data-ai-hint']}
                    width={600}
                    height={450}
                    className="rounded-lg shadow-2xl object-cover w-full h-full"
                />
            </div>
          </div>
        </section>
    );
};


export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="Kaizen Ai" width={150} height={100}/>
        </Link>
        <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            </nav>
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
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-20 md:py-32"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Supercharge Your Career with{' '}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Kaizen Ai
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-md sm:text-lg text-muted-foreground mb-8">
            The all-in-one AI platform to help you build a personalized career roadmap, optimize your resume, write compelling cover letters, and find the perfect job.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Personal AI Career Toolkit</h2>
            <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Everything you need to land your dream job, powered by AI.</p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-1 h-full relative">
                  {feature.new && (
                    <span className="absolute top-4 right-4 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b692f4] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#b692f4]"></span>
                    </span>
                  )}
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4 border border-primary/20">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
            ))}
          </div>
        </section>

        <section 
            id="testimonials"
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
            <TestimonialsSection />
        </section>

        <HowItWorksSection />

        {/* CTA Section */}
        <section
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="bg-card border border-border/50 rounded-lg p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]" />
            <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Ready to Find Your Dream Job?</h2>
                <p className="max-w-2xl mx-auto mt-2 text-muted-foreground mb-8">
                Stop guessing and start winning career strategy. Your next opportunity is just a click away.
                </p>
                <Link href="/sign-up">
                <Button size="lg">
                    Start Your Journey Now <Rocket className="ml-2 h-5 w-5" />
                </Button>
                </Link>
            </div>
          </div>
        </section>
      </main>

       <footer
        className="bg-card/20 border-t border-border/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8 md:grid-cols-4 text-center md:text-left">
            <div className="space-y-2 flex flex-col items-center md:items-start col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <Image src={logo} alt="Kaizen Ai" width={150} height={100}/>
              </Link>
              <p className="text-muted-foreground">Your personal AI career coach.</p>
            </div>
            <div className="col-span-1 md:col-span-1">
              <h4 className="font-semibold mb-2">Tools</h4>
              <ul className="space-y-2 text-muted-foreground">
                {footerFeatures.slice(0, 5).map((f) => (
                  <li key={f.title}>
                    <Link href={f.href} className="hover:text-primary">
                      {f.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-1 md:col-span-1">
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/verify-certificate" className="hover:text-primary">
                    Verify Certificate
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-1 md:col-span-1">
              <h4 className="font-semibold mb-2">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Kaizen Ai.</p>
            <p>Designed by Sudhanshu Gaikwad</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
