
'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-4 right-4 z-50 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      aria-label="Go to top"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
