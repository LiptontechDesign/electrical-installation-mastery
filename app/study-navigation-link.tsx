'use client';

import Link, { useLinkStatus } from 'next/link';
import type { ComponentProps } from 'react';

// A destination opens at its beginning, even when Next considers its page visible
// at the previous route's scroll position. Modified clicks keep native behavior.
export default function StudyNavigationLink({ children, ...props }: Omit<ComponentProps<typeof Link>, 'scroll' | 'onNavigate'>) {
  return <Link {...props} scroll={false} onNavigate={() => window.scrollTo({ top: 0, behavior: 'instant' })}>{children}<NavigationFeedback/></Link>;
}

function NavigationFeedback() {
  const { pending } = useLinkStatus();
  return <span className="study-navigation-feedback" data-pending={pending || undefined} role="status"><span className="sr-only">{pending ? 'Opening page…' : ''}</span></span>;
}
