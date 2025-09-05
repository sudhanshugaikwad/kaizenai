
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
  Github,
  Star,
  Globe,
  CalendarCheck,
  Sparkles,
  Bot,
} from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Image from "next/image";
import logo from "./Kaizenai.png"
import React from 'react';
import { cn } from '@/lib/utils';
import CreateAccount from "./assets/CreateYourAccountwithkaizen.png"
import UsetheAITools from "./assets/UsetheAIToolswithkaizen.png"
import GetInstantFeedback from "./assets/GetInstantFeedbackwithkaizen.png"
import LandYourDreamJob from "./assets/LandYourDreamJobwithkaizen.png"
import { motion } from 'framer-motion';
import ScrollRevealText from './ScrollRevealText';
import { BackToTop } from '@/components/ui/back-to-top';
import LatestArticlesSection from './LatestArticlesSection';
import PricingSection from './PricingSection';
import { PageFooter } from './PageFooter';
import ProductShowcaseSection from './ProductShowcaseSection';
import ToolkitShowcase from './ToolkitShowcase';

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

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


const HowItWorksSection = () => {
    const [activeStep, setActiveStep] = React.useState(0);

    const WindowFrame = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <div className={cn('relative rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm', className)}>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/30 rounded-full blur-[50px]" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-[50px]" />
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

    return (
        <motion.section
          id="how-it-works"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How does it work?</h2>
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
                        variants={itemVariants}
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
             <motion.div className="relative h-[450px] w-full" variants={itemVariants}>
                 <WindowFrame className="absolute inset-0">
                    <Image 
                        src={howItWorksSteps[activeStep].image}
                        alt={howItWorksSteps[activeStep].title}
                        className="rounded-md object-contain"
                        data-ai-hint={howItWorksSteps[activeStep]['data-ai-hint']}
                        placeholder="blur"
                    />
                </WindowFrame>
            </motion.div>
          </div>
        </motion.section>
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
        <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
              <Link href="/">
                <Button variant="ghost" size="sm">Home</Button>
              </Link>
              <div className="h-4 w-px bg-border mx-1" />
              <Link href="/about">
                <Button variant="ghost" size="sm">About</Button>
              </Link>
            </nav>
           
            
            <div className='flex items-center gap-2'>
              
                <SignedIn>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline text-sm font-medium">Welcome, {user?.firstName}</span>
                    <UserButton afterSignOutUrl="/" />
                </div>
                </SignedIn>
                <SignedOut>
                    <div className="flex items-center gap-2">
                    <Link href="https://github.com/sudhanshugaikwad/kaizenai" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-1">
                                <Github className="h-4 w-4" />
                               
                               
                              
                            </Button>
                        </Link>
                        <Link href="/sign-in">
                            <Button variant="outline" size="sm">
                            Login <LogIn className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        
                    </div>
                </SignedOut>
            </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          
            <motion.div
              className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-20 md:py-32"
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
                variants={itemVariants}
              >
                Supercharge Your Career with{' '}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Kaizen Ai
                </span>
              </motion.h1>
              <motion.p 
                className="max-w-3xl mx-auto text-md sm:text-lg text-muted-foreground mb-8"
                variants={itemVariants}
              >
                The all-in-one AI platform to help you build a personalized career roadmap, optimize your resume, write compelling cover letters, and find the perfect job.
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row justify-center gap-4" variants={itemVariants}>
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
            </motion.div>
        </section>


        {/* Product Showcase Section */}
        
        <ProductShowcaseSection />

        
          {/* Features Section */}
          <motion.section
          id="features"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true, amount: 0.1 }}
        >
          <ToolkitShowcase />
        </motion.section>

        {/* How It Works Section Component */}
        <HowItWorksSection />
        
      

        <motion.section
          id="promo-section"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
                <div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 opacity-30 blur-3xl"
                    style={{
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)',
                        maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)'
                    }}
                />
                 
                <div className="relative z-10 flex flex-col items-center">
              
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Kaizen Ai</h2>
                    <p className="max-w-2xl text-lg mt-4 text-muted-foreground mb-8">
                        Your intelligent career coach, providing resume analysis, personalized learning paths, and career guidance.
                    </p>
                    <Link href="/about">
                        <Button size="lg" variant="default" >
                            Learn More About Kaizen Ai <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
          </div>
        </motion.section>
        
        <motion.section 
            id="articles"
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.2 }}
        >
            <LatestArticlesSection />
        </motion.section>

        <motion.section 
            id="pricing"
            className="py-16"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.2 }}
        >
            <PricingSection />
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="bg-card border border-border/50 rounded-lg p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]" />
            <div className="relative z-10">
                <ScrollRevealText className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight" text="Ready to Find Your Dream Job?" />
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
        </motion.section>
      </main>

      <PageFooter />
      <BackToTop />
    </div>
  );
}
