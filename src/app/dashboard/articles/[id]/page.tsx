'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

type Article = {
    id: number;
    title: string;
    description: string;
    readable_publish_date: string;
    slug: string;
    path: string;
    url: string;
    comments_count: number;
    public_reactions_count: number;
    collection_id: number | null;
    published_timestamp: string;
    positive_reactions_count: number;
    cover_image: string | null;
    social_image: string;
    canonical_url: string;
    created_at: string;
    edited_at: string | null;
    crossposted_at: string | null;
    published_at: string;
    last_comment_at: string;
    reading_time_minutes: number;
    tag_list: string[];
    body_html: string;
    body_markdown: string;
    user: {
      name: string;
      username: string;
      twitter_username: string | null;
      github_username: string | null;
      user_id: number;
      website_url: string | null;
      profile_image: string;
      profile_image_90: string;
    };
};

export default function SingleArticlePage() {
    const { id } = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [allArticles, setAllArticles] = useState<Article[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                // Fetch all articles to enable next/previous navigation
                const allRes = await fetch(`https://dev.to/api/articles?username=sudhanshudevelopers`, {
                    headers: { 'api-key': 'GbWwTMGiH7eb7TA8rtWZgygV' }
                });
                if (!allRes.ok) throw new Error('Failed to fetch articles');
                const allData: Article[] = await allRes.json();
                setAllArticles(allData);

                // Find the current article and its index
                const currentArticleId = Number(id);
                const foundIndex = allData.findIndex(a => a.id === currentArticleId);
                if (foundIndex !== -1) {
                    const singleRes = await fetch(`https://dev.to/api/articles/${currentArticleId}`, {
                        headers: { 'api-key': 'GbWwTMGiH7eb7TA8rtWZgygV' }
                    });
                    if (!singleRes.ok) throw new Error('Failed to fetch single article');
                    const singleData = await singleRes.json();
                    setArticle(singleData);
                    setCurrentIndex(foundIndex);
                } else {
                    router.push('/dashboard/articles'); // Article not found
                }
            } catch (error) {
                console.error("Failed to fetch article", error);
                router.push('/dashboard/articles');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchArticles();
        }
    }, [id, router]);

    const navigateToArticle = (index: number) => {
        if (index >= 0 && index < allArticles.length) {
            const articleId = allArticles[index].id;
            router.push(`/dashboard/articles/${articleId}`);
        }
    };


    if (isLoading || !article) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => router.push('/dashboard/articles')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Articles
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    {article.cover_image && (
                        <div className="relative h-64 w-full mb-6">
                             <Image
                                src={article.cover_image}
                                alt={article.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-t-lg"
                                data-ai-hint="article cover"
                            />
                        </div>
                    )}
                    <CardTitle className="text-3xl font-bold tracking-tight">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 pt-2">
                        <span>By {article.user.name}</span>
                        <span>{format(new Date(article.published_at), 'MMMM dd, yyyy')}</span>
                        <span>{article.reading_time_minutes} min read</span>
                    </CardDescription>
                     <div className="flex flex-wrap gap-2 pt-2">
                        {article.tag_list.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-invert max-w-none prose-img:rounded-lg">
                       <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                           {article.body_markdown}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between items-center">
                 <Button variant="outline" onClick={() => navigateToArticle(currentIndex - 1)} disabled={currentIndex <= 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Post
                </Button>
                <Button onClick={() => router.push('/dashboard/articles')}>
                    See More Posts
                </Button>
                <Button variant="outline" onClick={() => navigateToArticle(currentIndex + 1)} disabled={currentIndex >= allArticles.length - 1}>
                    Next Post <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
}
