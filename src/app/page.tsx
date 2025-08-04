import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, FileText, PenSquare, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Kaizen AI Lite</h1>
        </div>
        <Link href="/dashboard">
            <Button variant="ghost">
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Your Personal AI
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {' '}
                Career Coach
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Unlock your professional potential with AI-powered tools. Generate career roadmaps, analyze your resume, and craft the perfect cover letter.
            </p>
          </div>
          <Link href="/dashboard">
            <Button size="lg">
              Get Started for Free
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">Roadmap Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get a step-by-step, AI-generated career plan tailored to your goals, including key skills and job milestones.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">Resume Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload your resume and receive instant, actionable feedback from our AI to improve your chances of getting hired.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <PenSquare className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">Cover Letter Writer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate personalized and compelling cover letters that highlight your strengths for any job application.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Kaizen AI Lite. All rights reserved.</p>
      </footer>
    </div>
  );
}