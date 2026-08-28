import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Electrical Installation Mastery',
    short_name: 'Electrical Mastery',
    description:
      'A personal electrical learning workshop for lessons, practice, projects, calculations, and revision.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#08111d',
    theme_color: '#08111d',
    categories: ['education', 'utilities'],
    lang: 'en-KE',
  };
}
