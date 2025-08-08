
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
import { MoreHorizontal, Trash2, Edit, CheckCircle, Trash, ListTodo, Plus, Wand, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestTaskContent } from '@/ai/flows/task-suggester';

type TaskStatus = 'Pending' | 'Working on' | 'Completed';

type Task = {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  createdAt: string;
};

export default function StickyNotesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedTasks = localStorage.getItem('kaizen-ai-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (e) {
      console.error('Could not load tasks', e);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('kaizen-ai-tasks', JSON.stringify(tasks));
      } catch (e) {
        console.error('Could not save tasks', e);
      }
    }
  }, [tasks, isMounted]);

  const handleAddTask = () => {
    if (!title.trim()) {
      toast({ title: 'Task title is required', variant: 'destructive' });
      return;
    }
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      content,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
    setContent('');
    toast({ title: 'Task Added!', description: `"${title}" has been added to your list.` });
  };

  const handleEditTask = () => {
    if (!editingTask || !editingTask.title.trim()) {
        toast({ title: 'Task title is required', variant: 'destructive' });
        return;
    }
    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
    setEditingTask(null);
    toast({ title: 'Task Updated!', description: `"${editingTask.title}" has been updated.` });
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({ title: 'Task Deleted' });
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(
      tasks.map(task => (task.id === id ? { ...task, status } : task))
    );
    toast({ title: 'Task Status Updated' });
  };

  const deleteAllTasks = () => {
    setTasks([]);
    toast({ title: 'All tasks have been deleted.' });
  };

  const completeAllTasks = () => {
    setTasks(tasks.map(task => ({ ...task, status: 'Completed' })));
    toast({ title: 'All tasks marked as completed.' });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTaskId: string) => {
    const sourceTaskId = e.dataTransfer.getData("taskId");
    const sourceIndex = tasks.findIndex(t => t.id === sourceTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetTaskId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const reorderedTasks = [...tasks];
    const [removed] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(targetIndex, 0, removed);
    setTasks(reorderedTasks);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAiSuggest = async () => {
    if (!title.trim()) {
      toast({ title: 'Please enter a task title first', variant: 'destructive' });
      return;
    }
    setIsAiLoading(true);
    try {
        const result = await suggestTaskContent({ title });
        setContent(result.content);
        toast({ title: 'AI suggestion added!' });
    } catch(e) {
        console.error("AI suggestion failed", e);
        toast({ title: 'AI suggestion failed', description: 'Could not generate a suggestion. Please try again.', variant: 'destructive' });
    } finally {
        setIsAiLoading(false);
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case 'Completed': return 'text-green-500';
        case 'Working on': return 'text-blue-500';
        case 'Pending': return 'text-yellow-500';
        default: return 'text-muted-foreground';
    }
  }

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sticky Notes By Kaizen Ai</h1>
        <p className="text-muted-foreground">
          Write Your Day Tasks. You can get help By Kaizen Ai
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-2 border rounded-md flex items-center gap-2 text-muted-foreground bg-muted/50">
                <Button variant="ghost" size="icon" disabled><Bold className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" disabled><Italic className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" disabled><Underline className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" disabled><List className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" disabled><ListOrdered className="h-4 w-4" /></Button>
              </div>
              <Input
                placeholder="Task Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Task details..."
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={5}
              />
               <Button className="w-full" variant="outline" onClick={handleAiSuggest} disabled={isAiLoading}>
                {isAiLoading ? 'Generating...' : <><Wand className="mr-2 h-4 w-4" /> Task AI Suggestions</>}
              </Button>
              <div className="flex gap-2">
                <Button onClick={handleAddTask} className="w-full">
                    <Plus className="mr-2 h-4 w-4"/> Add New Task
                </Button>
                <Button variant="outline" className="w-full" onClick={() => { setTitle(''); setContent(''); }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Today’s Tasks</CardTitle>
              <CardDescription>
                You have {tasks.length} task(s) right now.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full" disabled={tasks.length === 0}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Completed All Task
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will mark all tasks as completed.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={completeAllTasks}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full" disabled={tasks.length === 0}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete All Task
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete all your tasks.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteAllTasks}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

              <div className="space-y-3 h-[50vh] overflow-y-auto pr-2">
                <AnimatePresence>
                  {tasks.length > 0 ? (
                    tasks.map(task => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDrop={(e) => handleDrop(e, task.id)}
                        onDragOver={handleDragOver}
                        className="p-4 border rounded-lg flex items-center justify-between cursor-grab active:cursor-grabbing bg-card"
                      >
                         <Dialog onOpenChange={(isOpen) => !isOpen && setViewingTask(null)}>
                            <DialogTrigger asChild>
                                <div className="cursor-pointer flex-grow" onClick={() => setViewingTask(task)}>
                                    <p className="font-semibold">{task.title}</p>
                                    <p className={`text-xs ${getStatusColor(task.status)}`}>{task.status}</p>
                                </div>
                             </DialogTrigger>
                              <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{viewingTask?.title}</DialogTitle>
                                        <DialogDescription>
                                           Created on {viewingTask ? new Date(viewingTask.createdAt).toLocaleDateString() : ''}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
                                        <p>{viewingTask?.content || 'No details provided.'}</p>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button>Close</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                         </Dialog>

                        <Dialog open={editingTask?.id === task.id} onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onClick={() => setEditingTask(task)}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-500">
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'Working on')}>Working on</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'Pending')}>Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'Completed')}>Completed</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Task</DialogTitle>
                                    <DialogDescription>
                                        Update the details for your task.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                <Input
                                    value={editingTask?.title || ''}
                                    onChange={(e) => setEditingTask(prev => prev ? {...prev, title: e.target.value} : null)}
                                />
                                <Textarea
                                    value={editingTask?.content || ''}
                                    onChange={(e) => setEditingTask(prev => prev ? {...prev, content: e.target.value} : null)}
                                    rows={4}
                                />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleEditTask}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                         </Dialog>

                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                      <ListTodo className="mx-auto h-12 w-12" />
                      <p className="mt-4">No tasks yet. Add one to get started!</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
