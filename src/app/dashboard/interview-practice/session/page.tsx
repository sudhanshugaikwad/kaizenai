
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateInterviewQuestions, InterviewQuestionsInput } from '@/ai/flows/interview-question-generator';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type InterviewQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
};

export default function InterviewSessionPage() {
    const [settings, setSettings] = useState<InterviewQuestionsInput | null>(null);
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<{[key: number]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const router = useRouter();
    const { toast } = useToast();
    
    useEffect(() => {
        const storedSettings = sessionStorage.getItem('interviewSettings');
        if (storedSettings) {
            const parsedSettings = JSON.parse(storedSettings);
            setSettings(parsedSettings);
        } else {
            router.push('/dashboard/interview-practice');
        }
    }, [router]);

    useEffect(() => {
        if (settings) {
            const fetchQuestions = async () => {
                setIsLoading(true);
                try {
                    const result = await generateInterviewQuestions(settings);
                    setQuestions(result.questions);
                } catch (error) {
                    console.error("Failed to generate questions", error);
                    toast({
                        title: "Error",
                        description: "Could not generate interview questions. Please try again.",
                        variant: "destructive"
                    });
                    router.push('/dashboard/interview-practice');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchQuestions();
        }
    }, [settings, router, toast]);
    
    const handleAnswerChange = (questionIndex: number, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        let score = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score++;
            }
        });

        sessionStorage.setItem('interviewResults', JSON.stringify({
            score,
            total: questions.length,
            questions,
            answers
        }));

        toast({ title: "Quiz Submitted!", description: "Redirecting to your results." });
        router.push('/dashboard/interview-practice/summary');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg font-semibold">Preparing your interview questions...</p>
                <p className="text-muted-foreground">This may take a moment. Please don't leave this page.</p>
            </div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Interview Practice: {settings?.role}</CardTitle>
                    <CardDescription>Answer all the questions to the best of your ability. Good luck!</CardDescription>
                </CardHeader>
            </Card>

            <div className="space-y-6">
                {questions.map((q, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Question {index + 1} of {questions.length}</CardTitle>
                                <CardDescription className="pt-2 text-base text-foreground">{q.question}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={answers[index]}
                                    onValueChange={(value) => handleAnswerChange(index, value)}
                                >
                                    {q.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center space-x-2 py-2">
                                            <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                                            <Label htmlFor={`q${index}-o${optionIndex}`} className="flex-1 cursor-pointer">{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
                <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard/interview-practice')}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || Object.keys(answers).length !== questions.length}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : "Submit Answers"}
                </Button>
            </div>
        </motion.div>
    );
}
