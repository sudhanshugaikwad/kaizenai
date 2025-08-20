
'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";

const teamMembers = [
    {
        name: 'Sudhanshu Gaikwad',
        role: 'Founder & Lead Developer',
        shortDescription: 'Visionary leader and core developer behind Kaizen AI, driving innovation in career tech.',
        fullDescription: 'This team member is the founder and main person who discovered and designed the Kaizen AI website. As the visionary leader and core developer behind Kaizen AI, Sudhanshu is responsible for driving innovation in career tech and shaping the future of the platform.',
        avatar: 'https://github.com/sudhanshugaikwad.png',
        linkedin: 'https://www.linkedin.com/in/sudhanshugaikwad',
        github: 'https://github.com/sudhanshugaikwad'
    },
    {
        name: 'Jane Doe',
        role: 'Frontend Developer',
        shortDescription: 'Specializes in creating responsive and intuitive user interfaces with React and Next.js.',
        fullDescription: 'Jane is a skilled Frontend Developer who specializes in creating responsive and intuitive user interfaces. With expertise in React and Next.js, she brings designs to life and ensures a seamless user experience across the Kaizen AI platform.',
        avatar: 'https://i.pravatar.cc/150?img=25',
        linkedin: '#',
        github: '#'
    },
    {
        name: 'John Smith',
        role: 'AI & Backend Developer',
        shortDescription: 'Expert in Python and GenAI, building the intelligent core of our application.',
        fullDescription: 'John is an AI & Backend Developer with deep expertise in Python and Generative AI. He is the architect behind the intelligent core of our application, developing the sophisticated algorithms that power Kaizen AI\'s smart features.',
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
                         <Dialog key={index}>
                            <Card className="w-full hover:border-primary/50 hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-1">
                                <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <Avatar className="w-24 h-24 rounded-lg border-2 border-primary/50 flex-shrink-0">
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col flex-grow'>
                                        <h4 className="text-xl font-semibold text-foreground">{member.name}</h4>
                                        <p className="text-primary font-medium">{member.role}</p>
                                        <p className="text-sm text-muted-foreground mt-1 flex-grow line-clamp-2">{member.shortDescription}</p>
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
                                             <DialogTrigger asChild>
                                                <Button variant="link" className="text-sm text-primary hover:underline">
                                                    See more details
                                                </Button>
                                             </DialogTrigger>
                                        </div>
                                    </div>
                                </div>
                                </CardContent>
                            </Card>
                            <DialogContent>
                                <DialogHeader>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-20 h-20 rounded-full border-2 border-primary">
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                                            <DialogDescription>{member.role}</DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-muted-foreground">{member.fullDescription}</p>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button>Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </section>
    );
}
