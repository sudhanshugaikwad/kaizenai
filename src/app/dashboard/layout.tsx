
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
} from 'lucide-react';
import { UserButton, useUser, Protect } from "@clerk/nextjs";

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
  { href: '/dashboard/roadmap-generator', icon: Rocket, label: 'Roadmap Generator' },
  { href: '/dashboard/resume-analyzer', icon: FileText, label: 'Resume Analyzer' },
  { href: '/dashboard/cover-letter-writer', icon: PenSquare, label: 'Cover Letter Writer' },
  { href: '/dashboard/kaizen-ai-chat', icon: MessageSquare, label: 'Kaizen Ai Chat' },
  { href: '/dashboard/job-matcher', icon: Briefcase, label: 'Job Matcher' },
  { href: '/dashboard/interview-practice', icon: BookOpenCheck, label: 'Interview Practice', new: true },
  { href: '/dashboard/hr-contact-finder', icon: UserSearch, label: 'HR Contact Finder' },
  { href: '/dashboard/sticky-notes', icon: StickyNote, label: 'Sticky Notes' },
];

const accountItems = [
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
    { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
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

  return (
    <SidebarProvider>
      <Sidebar variant='inset' side='left'>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
          <Image src={logo} alt="Kaizen Ai" width={150} height={100}/>
        
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="flex items-center justify-between w-full">
                  <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.label} className="flex-grow">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                   {item.new && (
                    <span className="new-feature-badge ml-2">New</span>
                  )}
                </Link>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
              <div className="my-2 border-t border-sidebar-border" />
            </SidebarMenuItem>
             {accountItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
            <Protect role="org:admin">
                <SidebarMenuItem>
                    <div className="my-2 border-t border-sidebar-border" />
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/admin/dashboard">
                    <SidebarMenuButton isActive={pathname.startsWith('/admin')} tooltip="Admin">
                        <Shield className="w-5 h-5" />
                        <span>Admin Panel</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </Protect>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <UserButton />
                <span className="text-sm font-medium truncate">{user?.firstName ?? 'User'}</span>
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
             <span className='hidden sm:inline text-sm font-medium text-muted-foreground'>Welcome, {user?.firstName ?? 'User'}!</span>
             <UserButton afterSignOutUrl='/' />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
