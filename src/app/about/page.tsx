
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../Kaizenai.png"

import { Linkedin, Github, Newspaper, Home } from "lucide-react";
import ServicesSection from "./ServicesSection";
import DeveloperTeamSection from "./DeveloperTeamSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from 'framer-motion';
import TestimonialsSection from "../TestimonialsSection";

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
}

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);


  return (
    <motion.div 
      className="bg-background text-foreground"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto space-y-16 px-4 py-10 sm:px-6 lg:px-8">
        
        <motion.div variants={itemVariants} className="text-center relative">
             <Link href="/" className="absolute top-0 left-0">
                <Button variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    Go back to home
                </Button>
             </Link>
             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                About <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">Kaizen Ai</span>
             </h1>
             <p className="max-w-3xl mx-auto text-md sm:text-lg text-muted-foreground">
                Our mission is to empower professionals to achieve their career goals with intelligent, AI-driven tools.
             </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-6 border rounded-xl bg-card shadow-sm">
          {/* Image Section */}
          <div className="flex justify-center items-center">
          <Image src={logo}  alt="Kaizen Ai"/>
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              <strong className="text-primary font-semibold">
                Kaizen AI
              </strong>{" "}
              is your intelligent career companion, founded by{" "}
              <span className="font-semibold text-primary">
                Sudhanshu Gaikwad
              </span>
              , with a mission to eliminate the friction in career growth. What
              began as a personal journey now empowers students, job seekers,
              and professionals with smart tools like resume analyzers, roadmap
              generators, and AI-driven chat guidance.
            </p>

            <p className="mt-4 text-muted-foreground text-base leading-relaxed">
              Blending the power of AI with real-world insights, Kaizen AI helps users make informed decisions, track
              progress, and confidently advance in their careers—anytime,
              anywhere.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6">
              <Link href="https://www.linkedin.com/in/sudhanshugaikwad" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                    <Linkedin className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="https://github.com/sudhanshugaikwad" target="_blank" rel="noopener noreferrer">
                 <Button variant="outline" size="icon">
                    <Github className="w-5 h-5" />
                 </Button>
              </Link>
              <Link href="https://dev.to/sudhanshudevelopers" target="_blank" rel="noopener noreferrer">
                 <Button variant="outline" size="icon">
                    <Newspaper className="w-5 h-5" />
                 </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Developer Team */}
        <motion.div variants={itemVariants}>
            <DeveloperTeamSection />
        </motion.div>

   

        {/* Services Section */}
        <motion.div variants={itemVariants}>
            <ServicesSection />
        </motion.div>

             {/* Testimonials Section */}
             <motion.div variants={itemVariants}>
          <TestimonialsSection />
        </motion.div>
      </div>

       <PageFooter />

    </motion.div>
  );
}

    