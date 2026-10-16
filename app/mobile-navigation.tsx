'use client';

import Link from 'next/link';
import { BookOpen, ClipboardList, Files, Home, PlayCircle } from 'lucide-react';

type CourseDestination = 'home' | 'learn' | 'books';
type MobileDestination = CourseDestination | 'practice' | 'papers';

const destinations = [
  { id: 'home', label: 'Home', href: '/#home', icon: Home },
  { id: 'learn', label: 'Learn', href: '/#learn', icon: PlayCircle },
  { id: 'books', label: 'Books', href: '/#books', icon: BookOpen },
  { id: 'practice', label: 'Practice', href: '/practice', icon: ClipboardList },
  { id: 'papers', label: 'Papers', href: '/past-papers/c2', icon: Files },
] as const;

export default function MobileNavigation({ active, onCourseNavigate, papersHref = '/past-papers/c2' }: {
  active: MobileDestination;
  onCourseNavigate?: (destination: CourseDestination) => void;
  papersHref?: string;
}) {
  return <nav className="mobile-navigation" aria-label="Mobile navigation">
    {destinations.map(item => {
      const Icon = item.icon;
      const current = active === item.id ? 'page' : undefined;
      const content = <><span className="mobile-navigation-icon"><Icon size={24} aria-hidden="true"/></span><span>{item.label}</span></>;
      if (onCourseNavigate && (item.id === 'home' || item.id === 'learn' || item.id === 'books')) {
        const destination = item.id;
        return <button key={item.id} className="mobile-navigation-link" type="button" aria-current={current} onClick={() => onCourseNavigate(destination)}>{content}</button>;
      }
      return <Link key={item.id} className="mobile-navigation-link" href={item.id === 'papers' ? papersHref : item.href} aria-current={current}>{content}</Link>;
    })}
  </nav>;
}
