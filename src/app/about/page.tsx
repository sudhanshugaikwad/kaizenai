
'use client';
import React from 'react';
import { Linkedin, Github, Newspaper } from 'lucide-react';
import ServicesSection from './ServicesSection';
import DeveloperTeamSection from './DeveloperTeamSection';
import { Logo } from '@/components/icons';
import { motion } from 'framer-motion';

export default function AboutPage() {
    const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };


  return (
    <motion.div
      className="bg-background text-foreground px-4 py-10 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto space-y-16">
        <motion.h2
          className="text-4xl font-extrabold text-center text-foreground mb-10"
          variants={itemVariants}
        >
          About Us
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 border rounded-xl bg-card shadow-sm"
          variants={itemVariants}
        >
          {/* Logo Section */}
          <div className="flex justify-center items-center">
             <Logo className="w-[300px] h-[300px]" />
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <p className="text-muted-foreground text-base leading-relaxed">
              <strong className="text-2xl text-foreground font-semibold">
                Kaizen AI
              </strong>{' '}
              is your intelligent career companion, founded by{' '}
              <span className="font-semibold text-primary">
                Sudhanshu Gaikwad
              </span>
              , with a mission to eliminate the friction in career growth. What
              began as a personal journey now empowers students, job seekers,
              and professionals with smart tools like resume analyzers, roadmap
              generators, and AI-driven chat guidance.
            </p>

            <p className="mt-4 text-muted-foreground text-base leading-relaxed">
              Blending the power of AI, real-world insights, and intuitive
              design, Kaizen AI helps users make informed decisions, track
              progress, and confidently advance in their careers—anytime,
              anywhere.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-6 mt-6">
              <a
                href="https://www.linkedin.com/in/sudhanshugaikwad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/sudhanshugaikwad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://dev.to/sudhanshudevelopers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Newspaper className="w-6 h-6" />
              </a>
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
        
      </div>
    </motion.div>
  );
}
