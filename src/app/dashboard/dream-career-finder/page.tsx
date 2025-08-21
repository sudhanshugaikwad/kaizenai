
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Check, Bot, Repeat, Sparkles, BookOpen, Briefcase, User, ArrowLeft, Lightbulb, GraduationCap, Target, ExternalLink, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestDreamCareer, type DreamCareerFinderOutput, type DreamCareerFinderInput } from '@/ai/flows/dream-career-finder';
import { useToast } from '@/hooks/use-toast';
import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import Link from 'next/link';

type UserCategory = 'Student' | 'Job Seeker' | 'Professional' | 'Other';

type Question = {
    key: string;
    question: string;
    options?: string[];
    type?: 'text';
};


const studentQuestions: Question[] = [
  { key: 'educationLevel', question: "What is your current level of education?", options: ["High School (10th)", "High School (12th)", "Bachelors Degree", "Masters Degree", "Doctorate (PhD)"] },
  { key: 'interests', question: "Which subjects or fields excite you the most?", options: ['Technology', 'Arts & Humanities', 'Business & Management', 'Science & Research', 'Social Service & Education', 'Finance & Commerce'] },
  { key: 'strengths', question: "What do you enjoy the most?", options: ['Problem Solving', 'Creativity & Design', 'Analyzing Data', 'Helping People', 'Building Things', 'Leadership'] },
];

const professionalQuestions: Question[] = [
  { key: 'currentRole', question: "What is your current or most recent job title?", type: 'text' },
  { key: 'yearsOfExperience', question: "How many years of professional experience do you have?", options: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"] },
  { key: 'motivation', question: "What are you looking for in your next role?", options: ['Career Growth', 'Higher Salary', 'Better Work-Life Balance', 'A new Challenge', 'Making an Impact'] },
  { key: 'workStyle', question: 'Do you prefer working alone, in a team, or a mix of both?', options: ['Alone', 'In a team', 'A mix of both'] },
];

export default function DreamCareerFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DreamCareerFinderInput>>({});
  const [result, setResult] = useState<DreamCareerFinderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCategorySelect = (category: UserCategory) => {
    // Reset answers when category changes to avoid inconsistent data
    setAnswers({ userCategory: category });
    setStep(1);
  };

  const handleAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const questions = answers.userCategory === 'Student' ? studentQuestions : professionalQuestions;
  
  const isLastQuestion = step === questions.length +1;

  const nextStep = () => {
    const currentQuestionKey = questions[step - 1]?.key;
     if (!answers[currentQuestionKey as keyof typeof answers]) {
        toast({
          title: "Please provide an answer",
          description: "You must answer the question to proceed.",
          variant: "destructive",
        });
        return;
      }
    if (step < questions.length) {
      setStep(prev => prev + 1);
    }
  };
  
  const previousStep = () => {
    if (step > 1) {
        setStep(prev => prev - 1);
    } else if (step === 1) {
        setStep(0);
        setAnswers({});
    }
  };

  const handleSubmit = async () => {
    const currentQuestionKey = questions[step - 1]?.key;
    if (!answers[currentQuestionKey as keyof typeof answers]) {
        toast({
          title: "Please provide an answer",
          description: "You must answer the question to proceed.",
          variant: "destructive",
        });
        return;
      }
    setIsLoading(true);
    setResult(null);
    try {
      const careerResult = await suggestDreamCareer(answers as DreamCareerFinderInput);
      setResult(careerResult);
    } catch (error) {
      console.error('Failed to suggest career:', error);
      toast({
        title: "Error",
        description: "Could not get career suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const renderIntro = () => (
    <div className="text-center">
        <Bot className="h-16 w-16 mx-auto text-primary" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Find Your Dream Career</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          I'm your AI Career Coach. Answer a few questions to discover the path that best matches your skills and goals. This works for everyone—students, job seekers, and professionals.
        </p>
        <p className="mt-6 font-semibold">First, who are you?</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" size="lg" onClick={() => handleCategorySelect('Student')}><BookOpen className="mr-2 h-5 w-5"/> Student</Button>
            <Button variant="outline" size="lg" onClick={() => handleCategorySelect('Job Seeker')}><Briefcase className="mr-2 h-5 w-5"/> Job Seeker</Button>
            <Button variant="outline" size="lg" onClick={() => handleCategorySelect('Professional')}><User className="mr-2 h-5 w-5"/> Professional</Button>
            <Button variant="outline" size="lg" onClick={() => handleCategorySelect('Other')}><Sparkles className="mr-2 h-5 w-5"/> Other</Button>
        </div>
    </div>
  );

  const renderQuestion = () => {
    const questionData = questions[step-1];
    if (!questionData) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                <CardHeader>
                    <CardTitle className="text-2xl">{questionData.question}</CardTitle>
                    <CardDescription>
                        Question {step} of {questions.length}. There are no right or wrong answers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {questionData.type === 'text' ? (
                        <Input 
                            value={answers[questionData.key as keyof typeof answers] || ''}
                            onChange={(e) => handleAnswer(questionData.key, e.target.value)}
                            placeholder="Type your answer here..."
                        />
                    ) : (
                         <RadioGroup
                            value={answers[questionData.key as keyof typeof answers]}
                            onValueChange={(value) => handleAnswer(questionData.key, value)}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {questionData.options?.map(option => (
                                <Label
                                    key={option}
                                    htmlFor={option}
                                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                                    answers[questionData.key as keyof typeof answers] === option ? 'border-primary bg-primary/10' : ''
                                    }`}
                                >
                                    <RadioGroupItem value={option} id={option} />
                                    {option}
                                </Label>
                            ))}
                        </RadioGroup>
                    )}
                <div className="mt-6 flex justify-between w-full">
                    <Button variant="outline" onClick={previousStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>
                    <Button onClick={step === questions.length ? handleSubmit : nextStep}>
                        {step === questions.length ? 'Find My Career' : 'Next Question'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                </CardContent>
            </motion.div>
        </AnimatePresence>
    )
  }

  const renderResult = () => {
    if (!result) return null;
    
    const chartData = [
        ...result.suggestedPaths.map(path => ({ name: path, value: 20, fill: "hsl(var(--chart-2))" })),
        { name: result.careerTitle, value: 40, fill: "hsl(var(--primary))" }
    ];

    const chartConfig = chartData.reduce((acc, item) => {
        acc[item.name] = { label: item.name, color: item.fill };
        return acc;
    }, {} as any);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl">Your Career Recommendation</CardTitle>
                        <CardDescription>Based on your answers, here is a recommended path for you.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={resetQuiz}>
                            <Repeat className="mr-2 h-4 w-4" /> Start Over
                        </Button>
                        <Link href="/dashboard">
                            <Button variant="outline">
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                <Card className="border rounded-lg p-6 space-y-4">
                    <CardContent className="text-center">
                        <p className="text-2xl font-bold">{result.careerIcon} {result.careerTitle}</p>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{result.whyThisFits}</p>
                    </CardContent>

                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[300px]"
                    >
                        <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            labelLine={false}
                            label={({ payload, ...props }) => {
                                return (
                                  <text
                                    cx={props.cx}
                                    cy={props.cy}
                                    x={props.x}
                                    y={props.y}
                                    textAnchor={props.textAnchor}
                                    dominantBaseline={props.dominantBaseline}
                                    fill="hsla(var(--foreground), 0.8)"
                                    className="text-sm"
                                  >
                                    {payload.name}
                                  </text>
                                )
                              }}
                        >
                             {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        </PieChart>
                    </ChartContainer>
                </Card>
                
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    {result.recommendedCourses && result.recommendedCourses.length > 0 && (
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-semibold"><GraduationCap className="mr-2 h-5 w-5"/>Recommended Courses/Degrees</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-none space-y-2 pl-4">
                                {result.recommendedCourses.map((course, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>{course}</span>
                                    </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-semibold"><Briefcase className="mr-2 h-5 w-5"/>Suggested Career Paths</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-none space-y-2 pl-4">
                                {result.suggestedPaths.map((path, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{path}</span>
                                </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg font-semibold"><Target className="mr-2 h-5 w-5"/>Actionable Next Steps</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-none space-y-2 pl-4">
                                {result.nextSteps.map((nextStep, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{nextStep}</span>
                                </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-lg font-semibold"><Lightbulb className="mr-2 h-5 w-5"/>Career Insight</AccordionTrigger>
                        <AccordionContent>
                            <p className="pl-4 text-muted-foreground">{result.careerInsights}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </motion.div>
    );
  };

  const renderLoading = () => (
    <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-lg font-semibold">Analyzing your answers...</p>
        <p className="text-muted-foreground">Our AI is finding the perfect career for you.</p>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderLoading();
    if (result) return renderResult();
    if (step === 0) return renderIntro();
    return renderQuestion();
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
    >
      <Card className="min-h-[600px] flex items-center justify-center p-4">
        {renderContent()}
      </Card>
    </motion.div>
  );
}
