import './globals.css'
import Script from 'next/script'

export const metadata = {
  metadataBase: new URL('https://pantaleone.net'),
  title: {
    default: 'Free QR Code Generator | Create QR Codes Instantly',
    template: '%s | QRGen'
  },
  description: 'Generate free QR codes online for URLs, text, and more. Customizable colors, sizes, and error correction levels. Download in high quality PNG format.',
  keywords: ['qr code', 'generator', 'barcode', 'free qr code', 'create qr code', 'qr code tool'],
  authors: [{ name: 'Pantaleone' }],
  creator: 'Pantaleone',
  publisher: 'Pantaleone',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Free QR Code Generator | Create QR Codes Instantly',
    description: 'Generate free QR codes online for URLs, text, and more. Customizable colors, sizes, and error correction levels. Download in high quality PNG format.',
    url: 'https://pantaleone.net',
    siteName: 'QRGen',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'QR Code Generator Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free QR Code Generator | Create QR Codes Instantly',
    description: 'Generate free QR codes online for URLs, text, and more. Customizable colors, sizes, and error correction levels.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-site-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  category: 'tools',
}

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://pantaleone.net/#softwareapplication",
        "name": "QRGen - QR Code Generator",
        "description": "Free online QR code generator tool. Create customizable QR codes for URLs, text, and more. Download in high quality PNG format with custom colors and error correction.",
        "url": "https://pantaleone.net",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Person",
          "name": "Pantaleone"
        },
        "publisher": {
          "@type": "Person",
          "name": "Pantaleone"
        },
        "fileSize": "N/A",
        "softwareVersion": "1.0.0",
        "screenshot": "https://pantaleone.net/og-image.jpg"
      },
      {
        "@type": "WebSite",
        "@id": "https://pantaleone.net/#website",
        "url": "https://pantaleone.net",
        "name": "QRGen - Free QR Code Generator",
        "description": "Generate free QR codes online for URLs, text, and more. Customizable colors, sizes, and error correction levels.",
        "publisher": {
          "@id": "https://pantaleone.net/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://pantaleone.net/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://pantaleone.net/#organization",
        "name": "Pantaleone",
        "url": "https://pantaleone.net",
        "logo": {
          "@type": "ImageObject",
          "url": "https://pantaleone.net/icon.svg"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <body>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {children}
      </body>
    </html>
  )
}
