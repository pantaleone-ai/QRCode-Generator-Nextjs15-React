import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'QR Generator',
  description: 'Generate QR codes easily and quickly',
  keywords: ['qr code', 'generator', 'barcode'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'QR Generator',
    description: 'Generate QR codes easily and quickly',
    url: 'http://localhost:3000',
    siteName: 'QRGen',
    images: [{ url: '/next.svg', width: 800, height: 600 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Generator',
    description: 'Generate QR codes easily and quickly',
    creator: '@yourusername',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
