
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

type Article = {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  published_at: string;
  tags: string[];
};

const RELEVANT_TAGS = ['ai', 'machinelearning', 'artificialintelligence', 'genai', 'llm', 'react', 'javascript', 'reactjs'];

export default function LatestArticlesSection() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await fetch('https://dev.to/api/articles?username=sudhanshudevelopers');
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data: Article[] = await response.json();
                const relevantArticles = data.filter(article => 
                    article.tags.some(tag => RELEVANT_TAGS.includes(tag.toLowerCase()))
                );
                setArticles(relevantArticles.slice(0, 6)); // Show latest 6
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchArticles();
    }, []);

  if (isLoading) {
    return (
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Latest Articles</h2>
            <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">
                Stay updated with the latest insights on Agentic AI, LLMs, and modern web technologies.
            </p>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12 max-w-6xl mx-auto">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="p-4">
                         <Skeleton className="h-40 w-full mb-4" />
                         <div className="space-y-3">
                             <Skeleton className="h-6 w-3/4" />
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-1/2" />
                         </div>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

  if (articles.length === 0) {
    return null; // Don't render the section if there are no relevant articles
  }

  return (
    <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Latest Articles</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">
            Stay updated with the latest insights on Agentic AI, LLMs, and modern web technologies.
        </p>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12 max-w-6xl mx-auto">
            {articles.map((article) => (
                <Card key={article.id} className="p-1.5 bg-card/50 hover:border-primary/50 transition-all flex flex-col">
                    <div className="border rounded-lg h-full flex flex-col p-4">
                        <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                            <Image
                                src={article.cover_image || 'https://placehold.co/400x200.png'}
                                alt={article.title}
                                width={400}
                                height={200}
                                className="object-cover w-full h-full"
                                data-ai-hint="article cover"
                            />
                        </div>
                        <div className="flex flex-col flex-1 text-left">
                            <h3 className="font-bold text-lg leading-tight line-clamp-2">{article.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-grow">{article.description}</p>
                             <div className="flex justify-between items-center mt-4">
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3"/>
                                    {format(new Date(article.published_at), 'MMM dd, yyyy')}
                                </p>
                                <Link href={article.url} target="_blank" rel="noopener noreferrer">
                                   <Button variant="link" className="p-0 h-auto">Read More</Button>
                                </Link>
                             </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
}
