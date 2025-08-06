
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog"
import { Star, Trash2, Edit, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

type FeedbackItem = {
  name: string;
  avatar?: string;
  feedback: string;
  rating: number;
};

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedText, setEditedText] = useState("");
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    try {
      const storedFeedback = localStorage.getItem('kaizen-ai-feedback');
      if (storedFeedback) {
        setFeedbackList(JSON.parse(storedFeedback));
      }
    } catch (e) {
      console.error('Could not load feedback from localStorage', e);
      toast({
        title: 'Error',
        description: 'Failed to load feedback.',
        variant: 'destructive',
      });
    }
  };

  const deleteFeedback = (feedbackToDelete: FeedbackItem) => {
    try {
      const updatedList = feedbackList.filter(f => f.name !== feedbackToDelete.name);
      localStorage.setItem('kaizen-ai-feedback', JSON.stringify(updatedList));
      setFeedbackList(updatedList);
      toast({
        title: 'Feedback Deleted',
        description: `Feedback from ${feedbackToDelete.name} has been removed.`,
      });
    } catch (e) {
      console.error('Could not delete feedback from localStorage', e);
      toast({
        title: 'Error',
        description: 'Failed to delete feedback.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (feedback: FeedbackItem) => {
    setEditingFeedback(feedback);
    setEditedRating(feedback.rating);
    setEditedText(feedback.feedback);
  }

  const handleEditSubmit = () => {
    if (!editingFeedback) return;
    try {
      const updatedList = feedbackList.map(f => {
        if (f.name === editingFeedback.name) {
          return { ...f, rating: editedRating, feedback: editedText };
        }
        return f;
      });
      localStorage.setItem('kaizen-ai-feedback', JSON.stringify(updatedList));
      setFeedbackList(updatedList);
      toast({
        title: 'Feedback Updated',
        description: `Feedback from ${editingFeedback.name} has been updated.`,
      });
      setEditingFeedback(null);
    } catch (e) {
        console.error('Could not update feedback in localStorage', e);
        toast({
          title: 'Error',
          description: 'Failed to update feedback.',
          variant: 'destructive',
        });
    }
  }

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
    return null; // Avoid rendering on the server
  }

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Manage Feedback</h1>
        <p className="text-muted-foreground">
          View, edit, or delete feedback submitted by users.
        </p>
      </motion.div>

      {feedbackList.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center"
        >
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No Feedback Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            When users submit feedback, it will appear here.
          </p>
        </motion.div>
      ) : (
        <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
        >
          {feedbackList.map((feedback, index) => (
            <motion.div key={index} variants={itemVariants}>
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-primary">
                                <AvatarImage src={feedback.avatar} alt={feedback.name} />
                                <AvatarFallback>{feedback.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{feedback.name}</CardTitle>
                                <div className="flex justify-start mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground italic">"{feedback.feedback}"</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                         <Dialog onOpenChange={(isOpen) => !isOpen && setEditingFeedback(null)}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(feedback)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Feedback</DialogTitle>
                                    <DialogDescription>
                                        Update the rating and feedback for {editingFeedback?.name}.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                <div className="flex justify-center space-x-1">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return (
                                            <button
                                                key={starValue}
                                                type="button"
                                                onMouseEnter={() => setHover(starValue)}
                                                onMouseLeave={() => setHover(0)}
                                                onClick={() => setEditedRating(starValue)}
                                            >
                                                <Star
                                                    className={`w-8 h-8 cursor-pointer transition-colors ${
                                                        starValue <= (hover || editedRating)
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                                <Textarea
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    rows={5}
                                />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                         <Button onClick={handleEditSubmit}>Save Changes</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                         </Dialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will permanently delete the feedback from {feedback.name}. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteFeedback(feedback)}>
                                Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
