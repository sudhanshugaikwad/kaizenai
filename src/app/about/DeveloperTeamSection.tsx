
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
        avatar: 'https://github.com/sudhanshugaikwad.png',
        linkedin: 'https://www.linkedin.com/in/sudhanshugaikwad',
        github: 'https://github.com/sudhanshugaikwad'
    },
    {
        name: 'Jane Doe',
        role: 'Frontend Developer',
        avatar: 'https://i.pravatar.cc/150?img=25',
        linkedin: '#',
        github: '#'
    },
    {
        name: 'John Smith',
        role: 'Backend Developer',
        avatar: 'https://i.pravatar.cc/150?img=32',
        linkedin: '#',
        github: '#'
    }
];

export default function DeveloperTeamSection() {
    return (
        <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center mb-8">Meet the Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <Card key={index} className="w-full max-w-sm text-center mx-auto">
                            <CardContent className="p-6">
                                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <h4 className="text-xl font-semibold text-foreground">{member.name}</h4>
                                <p className="text-muted-foreground">{member.role}</p>
                                <div className="flex justify-center gap-4 mt-4">
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
