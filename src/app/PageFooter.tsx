
'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "./Kaizenai.png"
import Link from "next/link";
import {
    House,
    Building2,
    ShieldCheck,
    Siren,
    Newspaper,
    MessageSquare,
    Sparkles,
    HeartHandshake,
    Rocket,
    Bot,
    FileText,
    PenSquare,
    Briefcase,
    BookOpenCheck,
    UserSearch,
    CalendarCheck,
    Globe,
    StickyNote,
  } from "lucide-react";

export const PageFooter = () => {
    const footerTools = [
      { title: 'Kaizen AI Chat', href: '/dashboard/kaizen-ai-chat', icon: MessageSquare },
      { title: 'Dream Career Finder', href: '/dashboard/dream-career-finder', icon: Sparkles },
      { title: 'AI Roadmap Generator', href: '/dashboard/roadmap-generator', icon: Rocket },
      { title: 'AI Resume Analyzer', href: '/dashboard/resume-analyzer', icon: FileText },
      { title: 'AI Cover Letter Writer', href: '/dashboard/cover-letter-writer', icon: PenSquare },
      { title: 'AI Job Search & Matching', href: '/dashboard/job-matcher', icon: Briefcase },
      { title: 'Interview Practice', href: '/dashboard/interview-practice', icon: BookOpenCheck },
      { title: 'HR Contact Finder', href: '/dashboard/hr-contact-finder', icon: UserSearch },
      { title: 'Events & Hackathons', href: '/dashboard/events-hackathons', icon: CalendarCheck },
      { title: 'Website Builder', href: '/dashboard/website-builder', icon: Globe },
      { title: 'Articles', href: '/dashboard/articles', icon: Newspaper },
      { title: 'Sticky Notes', href: '/dashboard/sticky-notes', icon: StickyNote },
    ];
    
    const companyLinks = [
        { title: 'Home', href: '/', icon: House},
        { title: 'About', href: '/about', icon: Building2},
        // { title: 'Verify Certificate', href: '/verify-certificate', icon: ShieldCheck},
    ];

    const legalLinks = [
        { title: 'Terms of Service', href: '/terms-of-service' , icon: HeartHandshake},
        { title: 'Privacy Policy', href: '/privacy-policy', icon: Siren},
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
        <footer className="relative overflow-hidden bg-card/20 border-t border-border/50">
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]" />
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
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.title}</span>
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
                                    <Link href={item.href}  className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.title}</span>
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
                                    <Link href={item.href} className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.title}</span>
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
                    <p>Designed by  <Link href="https://sudhanshugaikwad.netlify.app/" className="hover:text-primary transition-colors">Sudhanshu Gaikwad</Link> </p>
                   

                </div>
            </div>
        </footer>
    );
}
