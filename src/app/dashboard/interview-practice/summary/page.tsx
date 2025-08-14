
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, XCircle, ChevronRight, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

type InterviewQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
};

type Results = {
    score: number;
    total: number;
    questions: InterviewQuestion[];
    answers: {[key: number]: string};
};

export default function InterviewSummaryPage() {
    const [results, setResults] = useState<Results | null>(null);
    const [scorePercentage, setScorePercentage] = useState(0);
    const router = useRouter();

    const saveToHistory = (resultsToSave: Results) => {
        try {
            const history = JSON.parse(localStorage.getItem('kaizen-ai-history') || '[]');
            const newHistoryItem = {
                type: 'Interview Practice',
                title: `Scored ${resultsToSave.score}/${resultsToSave.total} on Interview Practice`,
                timestamp: new Date().toISOString(),
                data: resultsToSave
            };
            history.unshift(newHistoryItem);
            localStorage.setItem('kaizen-ai-history', JSON.stringify(history.slice(0, 50)));
        } catch (e) {
            console.error("Could not save to history", e);
        }
    };

    useEffect(() => {
        const storedResults = sessionStorage.getItem('interviewResults');
        if (storedResults) {
            const parsedResults = JSON.parse(storedResults);
            setResults(parsedResults);
            setScorePercentage(Math.round((parsedResults.score / parsedResults.total) * 100));
            saveToHistory(parsedResults);
        } else {
            router.push('/dashboard/interview-practice');
        }
    }, [router]);

    const getPerformanceMessage = () => {
        if (scorePercentage > 80) return "Excellent work! You have a strong grasp of the concepts.";
        if (scorePercentage > 60) return "Good job! A little more practice will make you unstoppable.";
        if (scorePercentage > 40) return "Solid effort. Review the incorrect answers to improve.";
        return "Keep practicing! Every attempt is a step forward.";
    };

    if (!results) {
        return null; // Or a loading spinner
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Interview Results</CardTitle>
                    <CardDescription className="text-lg">{getPerformanceMessage()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="text-5xl font-bold text-primary">{results.score}</div>
                        <div className="text-3xl text-muted-foreground">/ {results.total}</div>
                    </div>
                    <div className="space-y-2">
                        <Progress value={scorePercentage} className="w-full h-4" />
                        <p className="text-center text-muted-foreground">{scorePercentage}% Correct</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Review Your Answers</CardTitle>
                    <CardDescription>Go through the questions to see where you can improve.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Accordion type="single" collapsible className="w-full">
                        {results.questions.map((q, index) => {
                            const userAnswer = results.answers[index];
                            const isCorrect = userAnswer === q.correctAnswer;
                            return (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="flex items-center gap-3 text-left">
                                                {isCorrect ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                                )}
                                                <span className="font-semibold">{`Question ${index + 1}: ${q.question}`}</span>
                                            </div>
                                            <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                {isCorrect ? 'Correct' : 'Incorrect'}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="prose prose-sm max-w-none text-muted-foreground space-y-2 pl-8">
                                        <p><strong>Your Answer:</strong> {userAnswer || 'Not answered'}</p>
                                        {!isCorrect && <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>}
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                     </Accordion>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button onClick={() => router.push('/dashboard/interview-practice')}>
                    Try Another Interview <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

        </motion.div>
    );
}

    