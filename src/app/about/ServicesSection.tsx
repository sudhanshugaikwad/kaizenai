'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, FileText, PenSquare, MessageSquare, Briefcase } from 'lucide-react';
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
]

export default function ServicesSection() {
    return (
        <section className="py-12 bg-muted/50 rounded-xl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center mb-8">Our Core Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service, index) => (
                        <Card key={index} className="text-center">
                            <CardHeader className="items-center">
                                 <div className="p-3 rounded-full bg-primary/10 mb-4 border border-primary/20">{service.icon}</div>
                                <CardTitle>{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{service.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
