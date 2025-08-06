'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Bot, Cpu, Database, ArrowRight, Dna } from 'lucide-react';
import { motion } from 'framer-motion';

const practiceCategories = [
    {
        title: 'Web Developer',
        description: 'Practice questions on HTML, CSS, Bootstrap, and basic JavaScript.',
        href: '/dashboard/interview-practice/web-developer',
        icon: Code,
        slug: 'web-developer',
        topics: 'HTML, CSS, Bootstrap, Basic JavaScript'
    },
    {
        title: 'Frontend Developer',
        description: 'Sharpen your skills in JavaScript, React.js, APIs, and JSON.',
        href: '/dashboard/interview-practice/frontend-developer',
        icon: Bot,
        slug: 'frontend-developer',
        topics: 'JavaScript, React.js, APIs, JSON'
    },
    {
        title: 'Backend Developer',
        description: 'Test your knowledge of Node.js, Express.js, MongoDB, and MySQL.',
        href: '/dashboard/interview-practice/backend-developer',
        icon: Database,
        slug: 'backend-developer',
        topics: 'Node.js, Express.js, MongoDB, MySQL'
    },
    {
        title: 'Software Engineer',
        description: 'General software engineering principles and practices.',
        href: '/dashboard/interview-practice/software-engineer',
        icon: Cpu,
        slug: 'software-engineer',
        topics: 'Data Structures, Algorithms, System Design, Networking, OS'
    },
    {
        title: 'Data Structures & Algorithms',
        description: 'Practice DSA questions in C++, Java, Python, and JavaScript.',
        href: '/dashboard/interview-practice/dsa',
        icon: Dna,
        slug: 'dsa',
        topics: 'Arrays, Strings, Linked Lists, Trees, Graphs, Sorting, Searching'
    }
];

export default function InterviewPracticePage() {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    
    return (
        <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold tracking-tight">Interview Practice</h1>
                <p className="text-muted-foreground">Select a category to start practicing with AI-generated questions.</p>
            </motion.div>

            <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
            >
                {practiceCategories.map((category) => (
                    <motion.div key={category.title} variants={itemVariants}>
                        <Card className="flex flex-col h-full">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <category.icon className="h-8 w-8 text-primary" />
                                    <CardTitle>{category.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{category.description}</CardDescription>
                            </CardContent>
                            <CardFooter>
                                <Link href={category.href} className="w-full">
                                    <Button className="w-full">
                                        Start Practice <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
