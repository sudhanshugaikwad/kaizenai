import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, FileText, PenSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Kaizen AI Lite</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Your Personal AI
              <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
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
            <Card>
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
            <Card>
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
            <Card>
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
