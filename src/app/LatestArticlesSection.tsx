
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type Article = {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  published_at: string;
  tag_list: string[];
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
                    article.tag_list.some(tag => RELEVANT_TAGS.includes(tag.toLowerCase()))
                );
                setArticles(relevantArticles);
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
                Exploring the latest trends and insights in AI and technology.
            </p>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4 space-y-3">
                           <Skeleton className="h-[200px] w-full" />
                           <Skeleton className="h-6 w-3/4" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

  if (articles.length === 0) {
    return null; // Don't render the section if there are no AI articles
  }

  return (
    <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Latest Articles</h2>
        <p className="max-w-2xl mx-auto mt-2 text-muted-foreground">
            Exploring the latest trends and insights in AI and technology from my dev.to profile.
        </p>
        <Carousel
            opts={{
                align: 'start',
                loop: true,
            }}
            className="w-full max-w-6xl mx-auto mt-12"
        >
            <CarouselContent>
                {articles.map((article) => (
                    <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                            <Card className="h-full flex flex-col overflow-hidden">
                                <CardHeader className="p-0">
                                   <div className="aspect-video overflow-hidden">
                                        <Image
                                            src={article.cover_image || 'https://placehold.co/600x400.png'}
                                            alt={article.title}
                                            width={600}
                                            height={400}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint="article cover"
                                        />
                                   </div>
                                </CardHeader>
                                <CardContent className="flex-grow p-4 space-y-2 text-left">
                                    <div className="flex flex-wrap gap-2">
                                        {article.tag_list.slice(0, 3).map(tag => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                    <CardTitle className="text-lg leading-tight line-clamp-2">{article.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
                                </CardContent>
                                <CardFooter className="p-4 flex justify-between items-center">
                                     <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3"/>
                                        {format(new Date(article.published_at), 'MMM dd, yyyy')}
                                     </div>
                                    <Link href={article.url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div>
  );
}
