import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Electrical Installation Mastery',
    short_name: 'Electrical Mastery',
    description:
      'Electrical installation video lessons, reference books and personal progress.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#08111d',
    theme_color: '#08111d',
    icons: [
      { src: '/icons/app-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/app-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/app-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Learn', url: '/#learn', description: 'Open video lessons' },
      { name: 'Books', url: '/#books', description: 'Open reference books' },
      { name: 'Practice', url: '/practice', description: 'Open practice questions' },
    ],
    prefer_related_applications: false,
    categories: ['education', 'utilities'],
    lang: 'en-GB',
  };
}
