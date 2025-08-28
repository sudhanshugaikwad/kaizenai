
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowLeft, ArrowRight, LayoutDashboard, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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

const categories = [
  'All Articles', 'Javascript', 'React.Js', 'API', 'JSON', 'Database', 'AI', 'Deployment', 'Software Engineering'
];

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All Articles');
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;
    const router = useRouter();

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://dev.to/api/articles?username=sudhanshudevelopers');
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data: Article[] = await response.json();
                setArticles(data);
                // console.log("Articel Data >> ",data)
                setFilteredArticles(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        if (activeFilter === 'All Articles') {
            setFilteredArticles(articles);
        } else {
            let filterTerm = activeFilter.toLowerCase().replace('.js', 'js').replace(/\s/g, '');
            if (filterTerm === 'reactjs') filterTerm = 'react';
            setFilteredArticles(
                articles.filter(article =>
                    article.tag_list.some(tag => tag.toLowerCase().includes(filterTerm))
                )
            );
        }
    }, [activeFilter, articles]);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Latest Articles</h1>
                <Link href="/dashboard">
                    <Button variant="outline"><LayoutDashboard className="mr-2 h-4 w-4"/> Go Back to Dashboard</Button>
                </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={activeFilter === category ? 'default' : 'outline'}
                                onClick={() => setActiveFilter(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {isLoading ? (
                 <div className="flex justify-center pt-10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                    {currentArticles.map((article, index) => (
                        <motion.div key={article.id} variants={itemVariants}>
                            <Card className="flex flex-col md:flex-row items-center p-4 gap-6 hover:border-primary/50 transition-colors">
                                <div className="w-full md:w-1/4 h-48 md:h-auto relative flex-shrink-0 self-stretch">
                                    <Image
                                    src={article.cover_image || `https://picsum.photos/seed/${article.id}/400/300`}
                                    alt={article.title}
                                    fill
                                    style={{objectFit:"cover"}}
                                    className="rounded-md"
                                    data-ai-hint="article cover"
                                    />
                                </div>
                                <div className="flex-grow flex flex-col">
                                    <h2 className="text-xl font-bold line-clamp-2">{article.title}</h2>
                                    <p className="text-muted-foreground mt-2 flex-grow line-clamp-2">{article.description}</p>
                                    <div className="flex items-center text-sm text-muted-foreground mt-4 gap-4">
                                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/>{format(new Date(article.published_at), 'MMM dd, yyyy')}</div>
                                       
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline">View Post</Button>
                                        </a>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 md:gap-4">
                        <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>
                        
                        <div className="hidden md:flex items-center gap-2">
                            {[...Array(totalPages).keys()].map(num => (
                                <Button key={num} variant={currentPage === num + 1 ? 'default' : 'ghost'} size="icon" onClick={() => paginate(num + 1)}>
                                    {num + 1}
                                </Button>
                            ))}
                        </div>
                        <span className="md:hidden">Page {currentPage} of {totalPages}</span>

                        <Button variant="outline" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                             Next <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </motion.div>
                )}
                </>
            )}

        </motion.div>
    );
}
