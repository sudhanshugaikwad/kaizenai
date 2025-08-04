import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, FileText, PenSquare, ArrowRight, MessageSquare } from 'lucide-react';

const features = [
  {
    title: "Roadmap Generator",
    description: "Chart your path to success. Get a personalized career roadmap based on your goals.",
    href: "/dashboard/roadmap-generator",
    icon: Rocket,
  },
  {
    title: "Resume Analyzer",
    description: "Optimize your resume. Get AI-powered feedback to stand out to recruiters.",
    href: "/dashboard/resume-analyzer",
    icon: FileText,
  },
  {
    title: "Cover Letter Writer",
    description: "Craft the perfect pitch. Generate compelling cover letters for any job application.",
    href: "/dashboard/cover-letter-writer",
    icon: PenSquare,
  },
  {
    title: "Kaizen AI Chat",
    description: "Have a question? Ask our AI career coach for personalized advice and insights.",
    href: "/dashboard/kaizen-ai-chat",
    icon: MessageSquare,
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Here are your AI-powered tools to accelerate your career.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href={feature.href}>
                <Button className="w-full">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
