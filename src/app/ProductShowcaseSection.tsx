'use client';

import { motion } from 'framer-motion';
import { MessageSquareText, CodeXml } from 'lucide-react';
import Image from 'next/image';
import Kaizenaiwebsite from "./assets/Kaizenaiwebsite.png"
import Rightside from "./assets/Rightside.png"
import Leftslide from "./assets/Leftslide.png"
const WindowFrame = ({ children, className, title }: { children: React.ReactNode, className?: string, title?: string }) => (
    <div className={`relative rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm shadow-2xl ${className}`}>
        <div className="absolute top-0 left-0 flex items-center gap-1.5 p-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        {title && <div className="absolute top-2.5 left-20 text-sm text-white/40">{title}</div>}
        <div className="p-4 pt-10 h-full">
            {children}
        </div>
    </div>
);

const FloatingIcon = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`absolute z-20 p-2 border border-white/10 bg-black/50 rounded-lg backdrop-blur-sm ${className}`}>
        {children}
    </div>
);


export default function ProductShowcaseSection() {
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

  return (
    <motion.section
        className="py-16 sm:py-20 md:py-24 bg-[#0d0d0d] overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-center h-[400px] md:h-[600px]">
                {/* Background Window */}
                <motion.div 
                    className="absolute w-full max-w-lg md:max-w-4xl lg:max-w-6xl h-full md:h-4/5 z-0"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <WindowFrame >
                        <Image
                            src={Kaizenaiwebsite}
                            alt="Background showcase"
                            fill
                            className="object-cover w-full h-full rounded-md opacity-60"
                            data-ai-hint="abstract background"
                        />
                    </WindowFrame>
                </motion.div>

                {/* Left Window */}
                <motion.div 
                    className="absolute left-0 bottom-0 w-2/5 max-w-[150px] sm:max-w-xs h-3/5 md:h-4/5 z-10"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <WindowFrame>
                         <Image
                            src={Leftslide}
                            alt="Left panel showcase"
                            fill
                            className="object-cover w-full h-full rounded-md opacity-100"
                            data-ai-hint="code editor"
                        />
                    </WindowFrame>
                     <FloatingIcon className="top-1/2 -right-6 hidden md:block">
                        <CodeXml className="w-10 h-10 text-white/50" />
                    </FloatingIcon>
                </motion.div>

                {/* Right Window */}
                 <motion.div 
                    className="absolute right-0 top-0 w-2/5 max-w-[150px] sm:max-w-xs h-3/5 md:h-4/5 z-10"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <WindowFrame>
                         <Image
                            src={Rightside}
                            alt="Right panel showcase"
                            fill
                            className="object-cover w-full h-full rounded-md opacity-100"
                            data-ai-hint="website preview"
                        />
                    </WindowFrame>
                    <FloatingIcon className="bottom-1/2 -left-6 hidden md:block">
                        <MessageSquareText  className="w-9 h-9 text-white/50" />
                    </FloatingIcon>
                </motion.div>
            </div>
        </div>
    </motion.section>
  );
}