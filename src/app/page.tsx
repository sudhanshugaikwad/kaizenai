
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
  Github,
  Star,
  Globe,
  CalendarCheck,
  Sparkles,
  CreditCard,
  Home,
  Newspaper,
} from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Image from "next/image";
import logo from "./Kaizenai.png"
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import CreateAccount from "./assets/CreateYourAccount.png"
import UsetheAITools from "./assets/UsetheAITools.png"
import GetInstantFeedback from "./assets/GetInstantFeedback.png"
import LandYourDreamJob from "./assets/LandYourDreamJob.png"
import { motion } from 'framer-motion';
import ScrollRevealText from './ScrollRevealText';
import { BackToTop } from '@/components/ui/back-to-top';
import LatestArticlesSection from './LatestArticlesSection';
import PricingSection from './PricingSection';
import ProductShowcaseSection from './ProductShowcaseSection';


const features = [
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: 'Kaizen Ai Chat',
    description: 'Get instant career advice from our AI coach.',
    href: '/dashboard/kaizen-ai-chat',
  },
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: 'AI Resume Analyzer',
    description: 'Optimize your resume with AI-powered feedback.',
    href: '/dashboard/resume-analyzer',
  },
  {
    icon: <PenSquare className="h-6 w-6 text-primary" />,
    title: 'AI Cover Letter Writer',
    description: 'Generate compelling cover letters in seconds.',
    href: '/dashboard/cover-letter-writer',
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: 'Dream Career Finder',
    description: 'Answer a few questions to discover the career path.',
    href: '/dashboard/dream-career-finder',
  },
  {
    icon: <Rocket className="h-6 w-6 text-primary" />,
    title: 'AI Roadmap Generator',
    description: 'Get a personalized career plan with resources.',
    href: '/dashboard/roadmap-generator',
  },
  {
    icon: <Briefcase className="h-6 w-6 text-primary" />,
    title: 'AI Job Search and Matching',
    description: 'Let our AI find the best job openings for you.',
    href: '/dashboard/job-matcher',
  },
  {
    icon: <BookOpenCheck className="h-6 w-6 text-primary" />,
    title: 'Interview Practice',
    description: 'Ace interviews with AI-powered mock sessions.',
    href: '/dashboard/interview-practice',
  },
  {
    icon: <UserSearch className="h-6 w-6 text-primary" />,
    title: 'HR Contact Finder',
    description: 'Discover HR contacts by department or resume.',
    href: '/dashboard/hr-contact-finder',
  },
  {
    icon: <CalendarCheck className="h-6 w-6 text-primary" />,
    title: 'Events & Hackathons',
    description: 'Find relevant events, hackathons, and challenges.',
    href: '/dashboard/events-hackathons',
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: 'Website Builder',
    description: 'Create and deploy simple websites using AI.',
    href: '/dashboard/website-builder',
  },
  {
    icon: <StickyNote className="h-6 w-6 text-primary" />,
    title: 'Sticky Notes',
    description: 'Organize your daily tasks and boost productivity.',
    href: '/dashboard/sticky-notes',
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: 'Powerful AI Core',
    description: 'Powered by advanced generative AI for best results.',
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

const PageFooter = () => {
    const footerTools = [
        { title: 'AI Roadmap Generator', href: '/dashboard/roadmap-generator' },
        { title: 'AI Resume Analyzer', href: '/dashboard/resume-analyzer' },
        { title: 'AI Cover Letter Writer', href: '/dashboard/cover-letter-writer' },
        { title: 'AI Job Search', href: '/dashboard/job-matcher' },
        { title: 'Kaizen AI Chat', href: '/dashboard/kaizen-ai-chat' },
        { title: 'Interview Practice', href: '/dashboard/interview-practice' },
        { title: 'HR Contact Finder', href: '/dashboard/hr-contact-finder' },
    ];
    
    const companyLinks = [
        { title: 'Home', href: '/' },
        { title: 'About', href: '/about' },
        { title: 'Verify Certificate', href: '/verify-certificate' },
    ];

    const legalLinks = [
        { title: 'Terms of Service', href: '/terms-of-service' },
        { title: 'Privacy Policy', href: '/privacy-policy' },
    ];

    const [articles, setArticles] = useState<{ title: string, url: string }[]>([]);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await fetch('https://dev.to/api/articles?username=sudhanshudevelopers&per_page=5');
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data.map((a: any) => ({ title: a.title, url: a.url })));
                }
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            }
        }
        fetchArticles();
    }, []);

    return (
        <footer className="bg-card/20 border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid gap-8 grid-cols-2 md:grid-cols-5 text-sm">
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src={logo} alt="Kaizen Ai" width={150} height={100}/>
                        </Link>
                        <p className="text-muted-foreground">Your intelligent career coach to help you land your dream job.</p>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-4 text-foreground">Kaizen AI Tools</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            {footerTools.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="hover:text-primary transition-colors">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            {companyLinks.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="hover:text-primary transition-colors">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            {legalLinks.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="hover:text-primary transition-colors">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-4 text-foreground">Latest Articles</h4>
                        {articles.length > 0 ? (
                            <ul className="space-y-2 text-muted-foreground">
                                {articles.map((article) => (
                                    <li key={article.title}>
                                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-muted-foreground">Loading articles...</p>}
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Kaizen Ai. All rights reserved.</p>
                    <p>Designed by Sudhanshu Gaikwad</p>
                </div>
            </div>
        </footer>
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
                                GitHub
                                <div className="h-4 w-px bg-border mx-1" />
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span>130k</span>
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

        <ProductShowcaseSection />

        {/* How It Works Section Component */}
        <HowItWorksSection />
        
        {/* Features Section */}
        <motion.section
          id="features"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="text-center mb-12">
             <ScrollRevealText
                className="text-3xl md:text-4xl font-bold tracking-tight"
                text="Your Personal AI Career Toolkit"
            />
            <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Everything you need to land your dream job, powered by AI.</p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-md bg-primary/10 border border-primary/20">
                                {feature.icon}
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{feature.title}</p>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    </CardContent>
                  </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

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
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]" />
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
