'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Rocket,
  FileText,
  PenSquare,
  MessageSquare,
  Briefcase,
  Menu,
  User,
  CreditCard,
  History,
  Star,
  Award,
  BookOpenCheck,
  StickyNote,
  UserSearch,
  Shield,
  Globe,
  Home,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import { UserButton, useUser } from "@clerk/nextjs";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import logo from "../Kaizenai.png"

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/kaizen-ai-chat', icon: MessageSquare, label: 'Kaizen Ai Chat' },
  { href: '/dashboard/dream-career-finder', icon: Sparkles, label: 'Dream Career Finder' },
  { href: '/dashboard/roadmap-generator', icon: Rocket, label: 'Roadmap Generator' },
  { href: '/dashboard/resume-analyzer', icon: FileText, label: 'Resume Analyzer' },
  { href: '/dashboard/cover-letter-writer', icon: PenSquare, label: 'Cover Letter Writer' },
  { href: '/dashboard/job-matcher', icon: Briefcase, label: 'Job Matcher' },
  { href: '/dashboard/interview-practice', icon: BookOpenCheck, label: 'Interview Practice' },
  { href: '/dashboard/hr-contact-finder', icon: UserSearch, label: 'HR Contact Finder' },
  { href: '/dashboard/events-hackathons', icon: CalendarCheck, label: 'Events & Hackathons' },
  { href: '/dashboard/website-builder', icon: Globe, label: 'Website Builder' },
  { href: '/dashboard/sticky-notes', icon: StickyNote, label: 'Sticky Notes' },
];

const accountItems = [
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
    { href: '/dashboard/profile/billing', icon: CreditCard, label: 'Billing' },
    { href: '/dashboard/history', icon: History, label: 'History' },
    { href: '/dashboard/feedback', icon: Star, label: 'Manage Feedback' },
    { href: '/dashboard/certification', icon: Award, label: 'Generate Certification' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();

  const renderMenuItem = (item: typeof navItems[0]) => {
    return (
      <SidebarMenuButton
        isActive={pathname === item.href}
        tooltip={item.label}
        className="w-full justify-start"
      >
        <item.icon className="w-5 h-5 shrink-0" />
        <span className="truncate">{item.label}</span>
      </SidebarMenuButton>
    );
  };

  return (
    <SidebarProvider>
      <Sidebar side='left' collapsible="icon">
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Image src={logo} alt="Kaizen Ai" width={150} height={100} className="hidden group-data-[state=expanded]:block"/>
             <Image src={logo} alt="Kaizen Ai" width={40} height={40} className="block group-data-[state=expanded]:hidden"/>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href} className="w-full">
                <Link href={item.href} className="w-full">
                  {renderMenuItem(item)}
                </Link>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
              <div className="my-2 border-t border-sidebar-border" />
            </SidebarMenuItem>
             {accountItems.map((item) => (
              <SidebarMenuItem key={item.href} className="w-full">
                <Link href={item.href} className="w-full">
                  {renderMenuItem(item)}
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className='flex justify-between items-center group-data-[collapsible=icon]:justify-center'>
               <div className='text-xs text-muted-foreground group-data-[collapsible=icon]:hidden'>
                 <p>&copy; {new Date().getFullYear()} Kaizen AI</p>
                 <p>Designed By Sudhanshu Gaikwad</p>
               </div>
               <ThemeToggle />
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className='flex items-center gap-2'>
              <SidebarTrigger className='md:hidden'>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SidebarTrigger>
               <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
                <Logo className="h-6 w-auto text-primary" />
              </Link>
            </div>
          <div className="flex items-center gap-4">
            <Link href="/">
                <Button variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                </Button>
            </Link>
             <span className="hidden sm:inline text-sm font-medium">Welcome, {user?.firstName}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
