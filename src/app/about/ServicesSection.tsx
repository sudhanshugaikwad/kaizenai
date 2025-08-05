
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, FileText, PenSquare, Briefcase, MessageSquare } from "lucide-react";

const services = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: "AI Roadmap Generator",
    description: "Get a personalized career roadmap with timelines, resources, and project ideas to guide your journey.",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "AI Resume Analyzer",
    description: "Optimize your resume with AI feedback, ATS keyword analysis, and targeted improvement suggestions.",
  },
  {
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    title: "AI Cover Letter Writer",
    description: "Generate compelling and personalized cover letters tailored to any job description in seconds.",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "AI Job Matcher",
    description: "Let our AI find the best job openings for you based on your resume and skills.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Kaizen AI Chat",
    description: "Get instant career advice from our AI coach. Ask about interviews, skills, and career paths.",
  },
];

export default function ServicesSection() {
  return (
    <div className="space-y-10">
      <h3 className="text-3xl font-extrabold text-center text-foreground">
        Our Services
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="bg-card/50 text-center">
            <CardHeader className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4 border border-primary/20">
                    {service.icon}
                </div>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
