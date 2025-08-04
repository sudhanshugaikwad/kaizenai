
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, FileText, PenSquare, ArrowRight, MessageSquare, Briefcase, Bot, Zap, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/icons';

const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: "AI Roadmap Generator",
    description: "Chart your path to success. Get a personalized career roadmap with timelines, resources, and project ideas.",
    href: "/dashboard/roadmap-generator",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "AI Resume Analyzer",
    description: "Optimize your resume with AI-powered feedback, ATS keyword analysis, and improvement suggestions.",
    href: "/dashboard/resume-analyzer",
  },
  {
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    title: "AI Cover Letter Writer",
    description: "Generate compelling and personalized cover letters tailored to any job description in seconds.",
    href: "/dashboard/cover-letter-writer",
  },
    {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "AI Job Matcher",
    description: "Upload your resume and let our AI find the best, most recent job openings for you in India.",
    href: "/dashboard/job-matcher",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Kaizen AI Chat",
    description: "Get instant career advice from an AI coach. Ask about interviews, skills, and career paths.",
    href: "/dashboard/kaizen-ai-chat",
  },
    {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Powerful AI Core",
    description: "Powered by advanced generative AI to provide you with the most accurate and relevant career tools.",
    href: "/dashboard",
  },
];


export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Kaizen AI Lite</h1>
        </Link>
        <Link href="/dashboard">
            <Button variant="ghost">
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center py-20 md:py-32">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-1/2 right-0 top-0 -z-10 -translate-x-1/2 m-auto h-[480px] w-[640px] rounded-full bg-primary/10 opacity-40 blur-[120px]"></div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Supercharge Your Career with
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {' '}
              Kaizen AI
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
            The all-in-one AI platform to help you build a personalized career roadmap, optimize your resume, write compelling cover letters, and find the perfect job.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Personal AI Career Toolkit</h2>
                <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">Everything you need to land your dream job, powered by AI.</p>
            </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4 border border-primary/20">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
         <section className="container mx-auto px-4 py-16">
            <div className="bg-card/50 border border-border/50 rounded-lg p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[50px]"></div>
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Find Your Dream Job?</h2>
                 <p className="max-w-2xl mx-auto mt-2 text-muted-foreground mb-8">
                    Stop guessing and start building a winning career strategy. Your next opportunity is just a click away.
                 </p>
                 <Link href="/dashboard">
                    <Button size="lg">
                        Start Your Journey Now <Rocket className="ml-2 h-5 w-5" />
                    </Button>
                 </Link>
            </div>
         </section>

      </main>

      <footer className="bg-card/20 border-t border-border/50">
        <div className="container mx-auto px-4 py-8">
           <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <Logo className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-bold">Kaizen AI Lite</h3>
                </div>
                <p className="text-muted-foreground">Your personal AI career coach.</p>
              </div>
               <div>
                  <h4 className="font-semibold mb-2">Tools</h4>
                  <ul className="space-y-2 text-muted-foreground">
                      <li><Link href="/dashboard/roadmap-generator" className="hover:text-primary">Roadmap Generator</Link></li>
                      <li><Link href="/dashboard/resume-analyzer" className="hover:text-primary">Resume Analyzer</Link></li>
                      <li><Link href="/dashboard/cover-letter-writer" className="hover:text-primary">Cover Letter Writer</Link></li>
                      <li><Link href="/dashboard/job-matcher" className="hover:text-primary">Job Matcher</Link></li>
                      <li><Link href="/dashboard/kaizen-ai-chat" className="hover:text-primary">AI Chat</Link></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-semibold mb-2">Legal</h4>
                  <ul className="space-y-2 text-muted-foreground">
                      <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                      <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                  </ul>
              </div>
           </div>
           <div className="mt-8 pt-8 border-t border-border/50 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Kaizen AI Lite. Designed by Sudhanshu Gaikwad.</p>
           </div>
        </div>
      </footer>
    </div>
  );
}
