
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BarChart, Settings, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const adminFeatures = [
  {
    title: "Manage Users",
    description: "View, search, and manage all users in the system.",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    description: "View application analytics and user engagement metrics.",
    href: "#",
    icon: BarChart,
  },
  {
    title: "Settings",
    description: "Configure application settings and manage integrations.",
    href: "#",
    icon: Settings,
  },
];

export default function AdminDashboardPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the control center for Kaizen AI.</p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {adminFeatures.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link href={feature.href} className="w-full">
                  <Button className="w-full" disabled={feature.href === '#'}>
                    Go to Section <ArrowRight className="ml-2 h-4 w-4" />
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
