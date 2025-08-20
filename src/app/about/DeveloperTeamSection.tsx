
'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const teamMembers = [
    {
        name: 'Sudhanshu Gaikwad',
        role: 'Founder & Lead Developer',
        description: 'Visionary leader and core developer behind Kaizen AI, driving innovation in career tech.',
        avatar: 'https://github.com/sudhanshugaikwad.png',
        linkedin: 'https://www.linkedin.com/in/sudhanshugaikwad',
        github: 'https://github.com/sudhanshugaikwad'
    },
    {
        name: 'Jane Doe',
        role: 'Frontend Developer',
        description: 'Specializes in creating responsive and intuitive user interfaces with React and Next.js.',
        avatar: 'https://i.pravatar.cc/150?img=25',
        linkedin: '#',
        github: '#'
    },
    {
        name: 'John Smith',
        role: 'AI & Backend Developer',
        description: 'Expert in Python and GenAI, building the intelligent core of our application.',
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <Card key={index} className="w-full hover:border-primary/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-1">
                            <CardContent className="p-4">
                               <div className="flex gap-4">
                                 <Avatar className="w-24 h-24 rounded-lg border-2 border-primary/50">
                                     <AvatarImage src={member.avatar} alt={member.name} />
                                     <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                 </Avatar>
                                 <div className='flex flex-col flex-grow'>
                                    <h4 className="text-xl font-semibold text-foreground">{member.name}</h4>
                                    <p className="text-primary font-medium">{member.role}</p>
                                    <p className="text-sm text-muted-foreground mt-1 flex-grow">{member.description}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex gap-2">
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
                                        <Link href="#" className="text-sm text-primary hover:underline">
                                            See more details
                                        </Link>
                                    </div>
                                 </div>
                               </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
