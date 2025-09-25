'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const teamMembers = [
    {
      name: 'Sudhanshu Gaikwad',
      role: 'Founder, Lead Developer & Frontend Developer',
      description: 'Founder and main innovator of Kaizen AI, leading advancements in career tech.',
      avatar: 'https://github.com/sudhanshugaikwad.png',
      linkedin: 'https://www.linkedin.com/in/sudhanshugaikwad',
      github: 'https://github.com/sudhanshugaikwad'
    },
    {
      name: 'Jane Doe',
      role: 'AI Agent Developer & Figma Designer',
      description: 'Specializes in designing intuitive user experiences and building responsive interfaces with React and Next.js.',
      avatar: 'https://i.pravatar.cc/150?img=25',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'John Smith',
      role: 'Backend Developer',
      description: 'Expert in Python and GenAI, building the intelligent core of Kaizen AI applications.',
      avatar: 'https://i.pravatar.cc/150?img=32',
      linkedin: '#',
      github: '#'
    }
  ];
  
export default function DeveloperTeamSection() {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center mb-8">Meet the Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <Card key={index} className="w-full text-center hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <Avatar className="w-24 h-24 mx-auto rounded-full border-2 border-primary">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-xl">{member.name}</CardTitle>
                                <CardDescription className="text-primary">{member.role}</CardDescription>
                                <p className="text-muted-foreground mt-4 text-sm">
                                    {member.description}
                                </p>
                                <div className="flex justify-center gap-2 mt-6">
                                    <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon">
                                            <Linkedin className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Link href={member.github} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon">
                                            <Github className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
