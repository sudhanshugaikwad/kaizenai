
"use client";
import React from "react";
import Image from "next/image";

import { Linkedin, Github, Newspaper } from "lucide-react";
import ServicesSection from "./ServicesSection";
import DeveloperTeamSection from "./DeveloperTeamSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from 'framer-motion';
import { Logo } from "@/components/icons";

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
      className="bg-background text-foreground px-4 py-10 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        <motion.div variants={itemVariants} className="text-center">
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
            <Logo
              alt="Kaizen AI"
              data-ai-hint="abstract technology"
              className="rounded-xl shadow-md w-[400px] h-[400px]"
            />
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

        {/* Services Section */}
        <motion.div variants={itemVariants}>
            <ServicesSection />
        </motion.div>
        
        {/* Developer Team */}
        <motion.div variants={itemVariants}>
            <DeveloperTeamSection />
        </motion.div>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="text-center text-sm text-gray-400 mt-12 border-t pt-6">
          {year && (
            <>
              &copy; {year} Kaizen Ai.
              <p>Designed by Sudhanshu Gaikwad</p>
            </>
          )}
        </motion.footer>
      </div>
    </motion.div>
  );
}
