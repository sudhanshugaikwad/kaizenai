
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

type Feedback = {
  name: string;
  feedback: string;
  rating: number;
  avatar?: string;
};

const defaultTestimonials: Feedback[] = [
    {
        name: "Priya Sharma",
        feedback: "Kaizen Ai's roadmap generator gave me a clear path to becoming a Data Scientist. The resource suggestions were incredibly helpful!",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
        name: "Rohan Verma",
        feedback: "The resume analyzer is a game-changer. I got actionable feedback that helped my resume stand out and I landed more interviews.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
        name: "Anjali Mehta",
        feedback: "I used to struggle with cover letters, but the AI writer crafts compelling letters in seconds. Highly recommended for any job seeker.",
        rating: 4,
        avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
        name: "Vikram Singh",
        feedback: "The job matcher saved me so much time. It found relevant openings in my city that I hadn't seen on other platforms.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=4"
    },
    {
        name: "Sneha Reddy",
        feedback: "The AI chat feature is like having a career coach in your pocket. I got great advice on negotiating my salary.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=5"
    }
];

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Feedback[]>(defaultTestimonials);

    useEffect(() => {
        try {
            const storedFeedback = localStorage.getItem('kaizen-ai-feedback');
            if (storedFeedback) {
                const parsedFeedback = JSON.parse(storedFeedback);
                // Combine default and user feedback, ensuring no duplicates if a user has the same name as a default one.
                const userNames = new Set(parsedFeedback.map((f: Feedback) => f.name));
                const combined = [
                    ...parsedFeedback,
                    ...defaultTestimonials.filter(f => !userNames.has(f.name))
                ];
                setTestimonials(combined);
            }
        } catch (e) {
            console.error("Could not load feedback from localStorage", e);
        }
    }, []);

  return (
    <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Users Say</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">
            Hear from professionals who have supercharged their careers with Kaizen Ai.
        </p>
        <Carousel
            opts={{
                align: 'start',
                loop: true,
            }}
            className="w-full max-w-4xl mx-auto mt-12"
        >
            <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                            <Card className="h-full flex flex-col">
                                <CardContent className="flex flex-col items-center justify-center flex-grow p-6 text-center">
                                    <Avatar className="w-16 h-16 mb-4 border-2 border-primary">
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <div className="flex justify-center my-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">"{testimonial.feedback}"</p>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div>
  );
}
