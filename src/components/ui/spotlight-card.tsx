
'use client';

import { cn } from '@/lib/utils';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import type { MouseEvent } from 'react';

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  size?: number;
  background?: string;
  isPaused?: boolean;
};

export function SpotlightCard({
  children,
  className,
  size = 450,
  background = 'hsl(var(--primary) / 0.1)',
  isPaused = false,
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        'group relative w-full rounded-xl border border-border/50 bg-card shadow-sm',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${background}, transparent 80%)
          `,
        }}
      />
      <div>{children}</div>
    </div>
  );
}
