'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

// A destination opens at its beginning, even when Next considers its page visible
// at the previous route's scroll position. Modified clicks keep native behavior.
export default function StudyNavigationLink({ children, ...props }: Omit<ComponentProps<typeof Link>, 'scroll' | 'onNavigate'>) {
  return <Link {...props} scroll={false} onNavigate={() => window.scrollTo({ top: 0, behavior: 'instant' })}>{children}</Link>;
}
