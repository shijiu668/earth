import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Earth Zoom Out - Create Stunning AI Earth Zoom Out Videos',
  description: 'Generate breathtaking earth zoom out videos with AI. Upload any image and watch it transform into an epic earth zoom out sequence. Create professional-quality videos in seconds.',
  keywords: 'earth zoom out, ai earth zoom out, video generation, ai video, zoom out effect, earth video, space video, aerial video, satellite view',
  authors: [{ name: 'AI Earth Zoom Out' }],
  creator: 'AI Earth Zoom Out',
  publisher: 'AI Earth Zoom Out',
  robots: 'index, follow',
  openGraph: {
    title: 'AI Earth Zoom Out - Create Stunning Earth Zoom Out Videos',
    description: 'Generate breathtaking earth zoom out videos with AI. Upload any image and watch it transform into an epic earth zoom out sequence.',
    url: 'https://aiearthzoomout.org',
    siteName: 'AI Earth Zoom Out',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Earth Zoom Out - Create Stunning Videos',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Earth Zoom Out - Create Stunning Earth Zoom Out Videos',
    description: 'Generate breathtaking earth zoom out videos with AI. Upload any image and watch it transform into an epic earth zoom out sequence.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://aiearthzoomout.org',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body className={inter.className}>
        <AuthProvider> {/* 包裹 children */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}