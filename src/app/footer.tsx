
'use client';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from "next/image";
import logo from "./Kaizenai.png"

const features = [
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

export default function Footer() {
    return (
        <motion.footer
        className="bg-card/20 border-t border-border/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
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
                {features.slice(0, 5).map((f) => (
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
      </motion.footer>
    )
}

    