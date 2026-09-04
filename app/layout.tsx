import type { Metadata, Viewport } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import './learning-ui.css';
import './book-reading.css';
import './reader-mobile.css';

const PRODUCT_NAME = 'Electrical Installation Mastery';
const PRODUCT_DESCRIPTION =
  'Electrical installation video lessons, summaries, quizzes and calculators. Track your learning at your own pace.';

function resolveMetadataBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  const candidate = configuredUrl || vercelUrl;

  if (!candidate) return new URL('http://localhost:3000');
  return new URL(
    candidate.startsWith('http://') || candidate.startsWith('https://')
      ? candidate
      : `https://${candidate}`,
  );
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#08111d' },
  ],
};

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  applicationName: PRODUCT_NAME,
  title: {
    default: PRODUCT_NAME,
    template: `%s | ${PRODUCT_NAME}`,
  },
  description: PRODUCT_DESCRIPTION,
  category: 'education',
  keywords: [
    'electrical installation',
    'electrical learning',
    'electrical calculations',
    'wiring practice',
    'inspection and testing',
  ],
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: '/',
    siteName: PRODUCT_NAME,
    title: PRODUCT_NAME,
    description: 'Watch. Read. Practise. Master. Your personal electrical learning workshop.',
    images: [
      {
        url: '/og.png',
        width: 1672,
        height: 941,
        alt: 'Electrical Installation Mastery — Watch. Read. Practise. Master.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PRODUCT_NAME,
    description: 'Watch. Read. Practise. Master. Your personal electrical learning workshop.',
    images: ['/og.png'],
  },
  appleWebApp: {
    capable: true,
    title: 'Electrical Mastery',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <body>{children}</body>
    </html>
  );
}
