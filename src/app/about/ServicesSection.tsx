
'use client';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Rocket, FileText, PenSquare, MessageSquare, Briefcase, BookOpenCheck, StickyNote, UserSearch } from 'lucide-react';
import React from 'react';

const services = [
    {
        icon: <FileText className="w-8 h-8 text-primary" />,
        title: "AI Resume Analyzer",
        description: "Get AI-powered feedback to optimize your resume and stand out to recruiters.",
    },
    {
        icon: <PenSquare className="w-8 h-8 text-primary" />,
        title: "AI Cover Letter Writer",
        description: "Generate compelling cover letters tailored to any job application in seconds.",
    },
    {
        icon: <Rocket className="w-8 h-8 text-primary" />,
        title: "AI Roadmap Generator",
        description: "Receive a personalized career roadmap with timelines, resources, and project ideas.",
    },
     {
        icon: <Briefcase className="w-8 h-8 text-primary" />,
        title: "AI Job Matcher",
        description: "Upload your resume and let our AI find the best job openings for you.",
    },
    {
        icon: <MessageSquare className="w-8 h-8 text-primary" />,
        title: "Kaizen AI Chat",
        description: "Ask our AI career coach anything about career paths, interviews, or skill development.",
    },
    {
        icon: <BookOpenCheck className="w-8 h-8 text-primary" />,
        title: "Interview Practice",
        description: "Ace your next interview with AI-powered mock interviews and real-time feedback.",
    },
    {
        icon: <UserSearch className="w-8 h-8 text-primary" />,
        title: "HR Contact Finder",
        description: "Discover HR contacts by department or by analyzing your resume for the best fit.",
    },
    {
        icon: <StickyNote className="w-8 h-8 text-primary" />,
        title: "Sticky Notes",
        description: "A simple and effective way to organize your daily tasks and stay productive.",
    }
]

export default function ServicesSection() {
    return (
        <section className="py-12 bg-muted/50 rounded-xl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center mb-8">Our Core Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service, index) => (
                        <SpotlightCard key={index} className="text-center p-6">
                            <div className="p-3 rounded-full bg-primary/10 mb-4 border border-primary/20 inline-block">{service.icon}</div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">{service.title}</h4>
                            <p className="text-muted-foreground text-sm">{service.description}</p>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
