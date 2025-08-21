
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, Check, Bot, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestDreamCareer, type DreamCareerFinderOutput } from '@/ai/flows/dream-career-finder';
import { useToast } from '@/hooks/use-toast';

const quizQuestions = [
  {
    key: 'strength',
    question: 'What do you enjoy the most?',
    options: ['Problem Solving', 'Creativity & Design', 'Analyzing Data', 'Helping People', 'Building Things', 'Teaching'],
  },
  {
    key: 'workStyle',
    question: 'Do you prefer working alone, in a team, or a mix of both?',
    options: ['Alone', 'In a team', 'A mix of both'],
  },
  {
    key: 'interests',
    question: 'Which subjects or fields excite you the most?',
    options: ['Technology', 'Arts', 'Business', 'Science', 'Social Service', 'Finance'],
  },
  {
    key: 'motivation',
    question: 'What motivates you the most in your career?',
    options: ['Money', 'Making an Impact', 'Innovation', 'Stability', 'Learning & Growth'],
  },
  {
    key: 'workSetting',
    question: 'What kind of work setting do you prefer?',
    options: ['Remote Work', 'Office Work', 'Field Work', 'Travel-Based Work'],
  },
];

type Answers = {
  [key: string]: string;
};

export default function DreamCareerFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<DreamCareerFinderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < quizQuestions.length) {
      if (!answers[quizQuestions[step].key]) {
        toast({
          title: "Please select an option",
          description: "You must choose an answer to proceed.",
          variant: "destructive",
        });
        return;
      }
      setStep(prev => prev + 1);
    }
  };
  
  const handleSubmit = async () => {
     if (!answers[quizQuestions[step].key]) {
        toast({
          title: "Please select an option",
          description: "You must choose an answer to proceed.",
          variant: "destructive",
        });
        return;
      }
    setIsLoading(true);
    try {
      const careerResult = await suggestDreamCareer(answers as any);
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

  const isLastQuestion = step === quizQuestions.length - 1;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg font-semibold">Analyzing your answers...</p>
          <p className="text-muted-foreground">Our AI is finding the perfect career for you.</p>
        </div>
      );
    }

    if (result) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Your Dream Career Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-6">
            <div className="text-6xl">{result.careerIcon}</div>
            <h3 className="text-2xl font-bold">{result.careerTitle}</h3>
            <p className="text-muted-foreground max-w-md">{result.whyThisFits}</p>
            <div className="w-full max-w-md text-left space-y-3">
              <h4 className="font-semibold text-lg">Suggested Next Steps:</h4>
              <ul className="list-none space-y-2">
                {result.nextSteps.map((nextStep, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>{nextStep}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={resetQuiz} className="mt-6">
              <Repeat className="mr-2 h-4 w-4" /> Start Over
            </Button>
          </CardContent>
        </motion.div>
      );
    }

    if (step < quizQuestions.length) {
      const currentQuestion = quizQuestions[step];
      return (
         <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
            >
                <CardHeader>
                <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
                <CardDescription>
                    Question {step + 1} of {quizQuestions.length}. There are no right or wrong answers.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <RadioGroup
                    value={answers[currentQuestion.key]}
                    onValueChange={(value) => handleAnswer(currentQuestion.key, value)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {currentQuestion.options.map(option => (
                    <Label
                        key={option}
                        htmlFor={option}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                        answers[currentQuestion.key] === option ? 'border-primary bg-primary/10' : ''
                        }`}
                    >
                        <RadioGroupItem value={option} id={option} />
                        {option}
                    </Label>
                    ))}
                </RadioGroup>
                <Button onClick={isLastQuestion ? handleSubmit : nextStep} className="mt-4">
                    {isLastQuestion ? 'Find My Career' : 'Next Question'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </CardContent>
            </motion.div>
         </AnimatePresence>
      );
    }

    return (
      <div className="text-center">
        <Bot className="h-16 w-16 mx-auto text-primary" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Find Your Dream Career</h1>
        <p className="mt-2 text-muted-foreground">
            Hi! I’m your AI Career Coach. Answer a few simple questions and I’ll help you discover the career path that best matches your skills, personality, and goals. This tool works for everyone — whether you’re a student, job seeker, or professional.
        </p>
        <Button onClick={() => setStep(0)} className="mt-6">
            Start the Quiz <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
    >
      <Card className="min-h-[500px] flex items-center justify-center p-4">
        {step === 0 && !result ? (
           <div className="text-center">
                <Bot className="h-16 w-16 mx-auto text-primary" />
                <h1 className="mt-4 text-2xl font-bold tracking-tight">Find Your Dream Career</h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Hi! I’m your AI Career Coach. Answer a few simple questions and I’ll help you discover the career path that best matches your skills, personality, and goals. This tool works for everyone — whether you’re a student, job seeker, or professional.
                </p>
                <Button onClick={() => setStep(1)} className="mt-6">
                    Start the Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        ) : (
            <div className="w-full">
                {renderContent()}
            </div>
        )}
      </Card>
    </motion.div>
  );
}
