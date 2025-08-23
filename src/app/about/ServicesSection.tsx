
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, FileText, PenSquare, MessageSquare, Briefcase, BookOpenCheck, StickyNote, UserSearch, Globe, Zap, CalendarCheck } from 'lucide-react';
import React from 'react';

const services = [
    {
        icon: <MessageSquare className="h-6 w-6 text-primary" />,
        title: 'Kaizen Ai Chat',
        description: 'Get instant career advice from our AI coach.',
    },
    {
        icon: <FileText className="h-6 w-6 text-primary" />,
        title: 'AI Resume Analyzer',
        description: 'Optimize your resume with AI-powered feedback.',
    },
    {
        icon: <PenSquare className="h-6 w-6 text-primary" />,
        title: 'AI Cover Letter Writer',
        description: 'Generate compelling cover letters in seconds.',
    },
    {
        icon: <Rocket className="h-6 w-6 text-primary" />,
        title: 'AI Roadmap Generator',
        description: 'Get a personalized career plan with resources.',
    },
    {
        icon: <Briefcase className="h-6 w-6 text-primary" />,
        title: 'AI Job Matcher',
        description: 'Let our AI find the best job openings for you.',
    },
    {
        icon: <BookOpenCheck className="h-6 w-6 text-primary" />,
        title: 'Interview Practice',
        description: 'Ace interviews with AI-powered mock sessions.',
    },
    {
        icon: <UserSearch className="h-6 w-6 text-primary" />,
        title: 'HR Contact Finder',
        description: 'Discover HR contacts by department or resume.',
    },
    {
        icon: <CalendarCheck className="h-6 w-6 text-primary" />,
        title: 'Events & Hackathons',
        description: 'Find relevant events, hackathons, and challenges.',
    },
    {
        icon: <Globe className="h-6 w-6 text-primary" />,
        title: 'Website Builder',
        description: 'Create and deploy simple websites using AI.',
    },
    {
        icon: <StickyNote className="h-6 w-6 text-primary" />,
        title: 'Sticky Notes',
        description: 'Organize your daily tasks and boost productivity.',
    },
    {
        icon: <Zap className="h-6 w-6 text-primary" />,
        title: 'Powerful AI Core',
        description: 'Powered by advanced generative AI for best results.',
    },
]

export default function ServicesSection() {
    return (
        <section className="py-12 bg-muted/50 rounded-xl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center mb-8">Our Core Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {services.map((service, index) => (
                        <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-1 h-full">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-md bg-primary/10 border border-primary/20">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{service.title}</p>
                                        <p className="text-sm text-muted-foreground">{service.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
