
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@clerk/nextjs';

export default function FeedbackForm() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState("");
    const { toast } = useToast();
    const { user } = useUser();

    const handleSubmit = () => {
        if (!feedback || rating === 0) {
            toast({
                title: "Incomplete Feedback",
                description: "Please provide a rating and some feedback before submitting.",
                variant: "destructive",
            });
            return;
        }

        try {
            const existingFeedback = JSON.parse(localStorage.getItem('kaizen-ai-feedback') || '[]');
            const newFeedback = {
                name: user?.fullName || 'Anonymous',
                avatar: user?.imageUrl,
                feedback,
                rating,
            };
            
            // Avoid duplicate feedback from the same user
            const userFeedbackIndex = existingFeedback.findIndex((f: any) => f.name === newFeedback.name);
            if (userFeedbackIndex > -1) {
                existingFeedback[userFeedbackIndex] = newFeedback;
            } else {
                existingFeedback.unshift(newFeedback);
            }

            localStorage.setItem('kaizen-ai-feedback', JSON.stringify(existingFeedback));

            toast({
                title: "Feedback Submitted",
                description: "Thank you for sharing your thoughts with us!",
            });

            setFeedback("");
            setRating(0);
            setHover(0);

        } catch (e) {
            console.error("Could not save feedback to localStorage", e);
            toast({
                title: "Error",
                description: "Could not save your feedback. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Get Instant Feedback</CardTitle>
                <CardDescription>Share your experience and help us improve.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow space-y-4">
                <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                            <button
                                key={starValue}
                                type="button"
                                onMouseEnter={() => setHover(starValue)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(starValue)}
                            >
                                <Star
                                    className={`w-8 h-8 cursor-pointer transition-colors ${
                                        starValue <= (hover || rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>
                <Textarea
                    placeholder="Tell us what you think..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="flex-grow"
                    rows={4}
                />
                <Button onClick={handleSubmit} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                </Button>
            </CardContent>
        </Card>
    );
}
