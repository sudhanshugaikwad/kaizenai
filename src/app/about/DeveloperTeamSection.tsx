'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DeveloperTeamSection() {
    return (
        <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center mb-8">Meet the Founder</h3>
                <div className="flex justify-center">
                    <Card className="w-full max-w-sm text-center">
                        <CardContent className="p-6">
                            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                                <AvatarImage src="https://github.com/sudhanshugaikwad.png" alt="Sudhanshu Gaikwad" />
                                <AvatarFallback>SG</AvatarFallback>
                            </Avatar>
                            <h4 className="text-xl font-semibold text-foreground">Sudhanshu Gaikwad</h4>
                            <p className="text-muted-foreground">Founder & Lead Developer</p>
                            <div className="flex justify-center gap-4 mt-4">
                               <Link href="https://www.linkedin.com/in/sudhanshugaikwad" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="icon">
                                    <Linkedin className="w-5 h-5" />
                                </Button>
                               </Link>
                               <Link href="https://github.com/sudhanshugaikwad" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="icon">
                                    <Github className="w-5 h-5" />
                                </Button>
                               </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
