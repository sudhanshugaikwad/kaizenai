
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Rocket,
  FileText,
  PenSquare,
  MessageSquare,
  Briefcase,
  Clock,
  Trash2,
  BookOpenCheck,
  UserSearch,
  Globe,
  CalendarCheck,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type HistoryItem = {
  type: string;
  title: string;
  timestamp: string;
  data: any;
};

const iconMap: { [key: string]: React.ElementType } = {
  'Roadmap Generated': Rocket,
  'Resume Analysis': FileText,
  'Cover Letter Generated': PenSquare,
  'Kaizen Ai Chat': MessageSquare,
  'Job Matcher Run': Briefcase,
  'HR Contact Search': UserSearch,
  'Interview Practice': BookOpenCheck,
  'Website Generated': Globe,
  'Event Search': CalendarCheck,
};

const reuseActionMap: { [key: string]: { url: string; storageKey: string, dataKey?: string } } = {
    'Roadmap Generated': { url: '/dashboard/roadmap-generator', storageKey: 'kaizen-ai-reuse-roadmap', dataKey: 'input' },
    'Resume Analysis': { url: '/dashboard/resume-analyzer', storageKey: 'kaizen-ai-reuse-resume-analyzer' },
    'Cover Letter Generated': { url: '/dashboard/cover-letter-writer', storageKey: 'kaizen-ai-reuse-cover-letter' },
    'HR Contact Search': { url: '/dashboard/hr-contact-finder', storageKey: 'kaizen-ai-reuse-hr-contact', dataKey: 'input' },
    'Event Search': { url: '/dashboard/events-hackathons', storageKey: 'kaizen-ai-reuse-event-finder', dataKey: 'input' },
    'Interview Practice': { url: '/dashboard/interview-practice', storageKey: 'kaizen-ai-reuse-interview-practice' },
    'Website Generated': { url: '/dashboard/website-builder', storageKey: 'kaizen-ai-reuse-website-builder', dataKey: 'input' },
};


export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedHistory = localStorage.getItem('kaizen-ai-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Could not load history from localStorage', e);
      toast({
        title: 'Error',
        description: 'Failed to load history.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const clearHistory = () => {
    try {
      localStorage.removeItem('kaizen-ai-history');
      setHistory([]);
      toast({
        title: 'History Cleared',
        description: 'Your activity history has been successfully cleared.',
      });
    } catch (e) {
      console.error('Could not clear history from localStorage', e);
      toast({
        title: 'Error',
        description: 'Failed to clear history.',
        variant: 'destructive',
      });
    }
  };

  const handleReuse = (item: HistoryItem) => {
    const action = reuseActionMap[item.type];
    if (action) {
      try {
        const dataToStore = action.dataKey ? item.data[action.dataKey] : item.data;
        sessionStorage.setItem(action.storageKey, JSON.stringify(dataToStore));
        router.push(action.url);
      } catch (e) {
        console.error("Could not save reuse data", e);
        toast({ title: "Error", description: "Could not reuse this item.", variant: "destructive" });
      }
    } else {
        toast({ title: "Not reusable", description: "This type of history item cannot be reused.", variant: "destructive" });
    }
  };


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
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (!isMounted) {
    return null; // Avoid rendering on the server to prevent hydration mismatch
  }

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your History</h1>
          <p className="text-muted-foreground">
            Review your past activities and generated content.
          </p>
        </div>
        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your activity history from this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </motion.div>

      {history.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center"
        >
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No History Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start using the tools and your activity will show up here.
          </p>
        </motion.div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {history.map((item, index) => {
                const Icon = iconMap[item.type] || Clock;
                const isReusable = !!reuseActionMap[item.type];
                return (
                  <AccordionItem
                    value={`item-${index}`}
                    key={index}
                    className="border-b"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 w-full text-left">
                        <div className="flex items-center gap-4">
                            <Icon className="h-6 w-6 text-primary" />
                            <div>
                                <p className="font-semibold">{item.type}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground/80 mt-1">
                                    {new Date(item.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-muted/20 space-y-4">
                        {isReusable && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleReuse(item)}
                            >
                                <RefreshCw className="mr-2 h-4 w-4"/> Reuse
                            </Button>
                        )}
                        <pre className="w-full overflow-auto rounded-md bg-muted p-4 text-xs">
                            {JSON.stringify(item.data, null, 2)}
                        </pre>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
