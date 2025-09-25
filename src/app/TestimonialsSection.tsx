
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ShieldCheck } from 'lucide-react';

type Feedback = {
  name: string;
  feedback: string;
  rating: number;
  avatar?: string;
  date: string;
};

const defaultTestimonials: Feedback[] = [
    {
        name: "Sudhanshu Gaikwad",
        feedback: "This website is very useful for students, it solves all the problems they face, such as interview preparation, resume analysis, finding jobs and internships, and many more options available on the website.",
        rating: 5,
        avatar: "https://github.com/sudhanshugaikwad.png",
        date: "June 2024"
    },
    {
        name: "Nivedita Kalyankar",
        feedback: "Kaizen AI’s Agent Generator is powerful and user friendly. It lets you create custom AI agents to automate tasks, handle workflows, and interact with users without any coding. It saves me hours every week and is highly recommended for anyone wanting to scale work effortlessly.",
        rating: 5,
        avatar: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMzhZSXpBRnVZREN2bGJjNTMyV09SajVZV1cifQ?width=96",
        date: "June 2024"
    },
    {
        name: "Anjali Sonkamble",
        feedback: "Kaizen AI’s Roadmap Generator is a game-changer. It creates clear step-by-step plans in minutes, highlights risks and dependencies, and makes strategic planning effortless—like having a strategist and project manager in one.",
        rating: 4,
        avatar: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMzhnZXZjVDZUY0R1UmtMelIxSzRvQzVHNWUifQ?width=96",
        date: "May 2024"
    },
    {
        name: "Sanika Pimpalgaonkar",
        feedback: "The Al Roadmap Generator makes planning effortless. It gives structured, smart, and achievable roadmaps in minutes. A must-have for anyone managing projects or startups",
        rating: 5,
        avatar: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMzhmZkJQdnR5d08wM0ptOVJqcWtSOVhFY1gifQ?width=96",
        date: "May 2024"
    },
    {
        name: "Pritam Patil",
        feedback: "The AI chat feature is like having a career coach in your pocket. I got great advice on negotiating my salary.",
        rating: 5,
        avatar: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zMzhXV0w4QnJCakFWOXVGc1hVdVo1ZWhpSGEifQ?width=96",
        date: "April 2024"
    },
    {
        name: "Savio Dsouza",
        feedback: "I used the Job Matcher and found an internship within a week. The recommendations were spot on!",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=60",
        date: "April 2024"
    }
];

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Feedback[]>(defaultTestimonials);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        try {
            const storedFeedback = localStorage.getItem('kaizen-ai-feedback');
            if (storedFeedback) {
                const parsedFeedback = JSON.parse(storedFeedback).map((f: any) => ({...f, date: "Just now"}));
                if(Array.isArray(parsedFeedback)) {
                    // Combine default and user feedback, ensuring no duplicates if a user has the same name as a default one.
                    const userNames = new Set(parsedFeedback.map((f: Feedback) => f.name));
                    const combined = [
                        ...parsedFeedback,
                        ...defaultTestimonials.filter(f => !userNames.has(f.name))
                    ];
                    setTestimonials(combined);
                }
            }
        } catch (e) {
            console.error("Could not load feedback from localStorage", e);
        }
    }, [isMounted]);

  if (!isMounted) {
      // Render a placeholder or nothing on the server and initial client render
      return null;
  }

  return (
    <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Users Say</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">
            Hear from professionals who have supercharged their careers with Kaizen Ai.
        </p>
        <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-left relative overflow-hidden">
                <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-5 w-5 ${
                            i < testimonial.rating ? 'fill-primary text-primary' : 'fill-muted stroke-muted-foreground'
                            }`}
                        />
                        ))}
                    </div>
                    </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    "{testimonial.feedback}"
                </p>
                <p className="mt-4 text-xs text-muted-foreground/80">{testimonial.date}</p>
                </CardContent>
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground border">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Verified</span>
                </div>
            </Card>
            ))}
        </div>
    </div>
  );
}
