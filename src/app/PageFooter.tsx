
'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "./Kaizenai.png"
import Link from "next/link";

export const PageFooter = () => {
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
