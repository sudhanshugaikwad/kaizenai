'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const text =
 "Kaizen AI is your intelligent career companion, transforming the way individuals navigate their professional journey. Powered by Kaizen Ai, it delivers resume feedback, personalised learning paths, and actionable career guidance—helping students, job seekers, and professionals unlock new opportunities with confidence."

export default function ScrollRevealText() {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25'],
  });

  return (
  
    <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
   
        <p
            ref={containerRef}
            className="text-2xl md:text-4xl font-bold max-w-6xl mx-auto leading-relaxed"
        >
            {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
                </Word>
            );
            })}
        </p>
    </motion.section>
  );
}

const Word = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: any;
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <span className="relative inline-block mr-3 mt-3">
      <motion.span style={{ opacity: opacity }}>{children}</motion.span>
    </span>
  );
};
