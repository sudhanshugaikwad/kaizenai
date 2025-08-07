
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateInterviewQuestions, InterviewQuestionsInput } from '@/ai/flows/interview-question-generator';
import { useToast } from '@/hooks/use-toast';

type InterviewQuestion = {
    question: string;
    answer: string;
};

export default function InterviewSessionPage() {
    const [settings, setSettings] = useState<InterviewQuestionsInput | null>(null);
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(0);
    const router = useRouter();
    const { toast } = useToast();
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const storedSettings = sessionStorage.getItem('interviewSettings');
        if (storedSettings) {
            const parsedSettings = JSON.parse(storedSettings);
            const durationInSeconds = parseInt(parsedSettings.duration, 10) * 60;
            setSettings(parsedSettings);
            setTimer(durationInSeconds);
        } else {
            router.push('/dashboard/interview-practice');
        }
    }, [router]);

    useEffect(() => {
        if (settings) {
            const fetchQuestions = async () => {
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
    
    useEffect(() => {
        if (!isLoading && questions.length > 0) {
            timerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        endInterview();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isLoading, questions]);

    const endInterview = () => {
        // In a real app, you would save the results here.
        // For now, we'll just navigate to a summary page (to be created).
        toast({ title: "Interview Ended", description: "Generating your summary." });
        // router.push('/dashboard/interview-practice/summary');
        // For now, let's go back to setup
        router.push('/dashboard/interview-practice');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg">Preparing your interview...</p>
            </div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col gap-4"
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Interview: {settings?.role}</CardTitle>
                    <div className="text-lg font-semibold tabular-nums">Time: {formatTime(timer)}</div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
                 <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>AI Camera</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center bg-muted/50 rounded-b-lg">
                        <p className="text-muted-foreground">AI camera feed placeholder</p>
                    </CardContent>
                </Card>
                 <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>User Camera</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center bg-muted/50 rounded-b-lg">
                        <p className="text-muted-foreground">User camera feed placeholder</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p>{questions[currentQuestionIndex]?.question}</p>
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Code / Answer</CardTitle>
                    </CardHeader>
                     <CardContent className="flex-grow flex items-center justify-center bg-muted/50 rounded-b-lg">
                        <p className="text-muted-foreground">Code/Answer section placeholder</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="flex justify-end gap-4 mt-4">
                <Button variant="secondary" onClick={() => {
                     if (currentQuestionIndex < questions.length - 1) {
                         setCurrentQuestionIndex(currentQuestionIndex + 1);
                     } else {
                         endInterview();
                     }
                }}>
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit"}
                </Button>
                <Button variant="destructive" onClick={endInterview}>End Interview</Button>
            </div>

        </motion.div>
    );
}
