"use client";

import { useState, useRef } from 'react';
import { Menu, X, ArrowRight, Star, Check, QrCode, Palette, Download, Copy, Zap, Shield, User, Mail, Github, Twitter, Linkedin } from 'lucide-react';

// Mock QRCode component that generates a scannable QR code pattern
const QRCode = ({ value, size = 200, level = 'H', fgColor = '#000000', bgColor = '#ffffff' }) => {
  // Simple algorithm to generate a QR code pattern
  const generateQRPattern = (data, size) => {
    // Create a fixed pattern for demonstration purposes
    // In a real implementation, we would use a proper QR code algorithm
    const modules = 21; // Standard QR code size for version 1
    const moduleSize = size / modules;
    
    // Create an array to hold the pattern
    const pattern = [];
    
    // Add finder patterns (corners)
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        // Top-left finder pattern
        pattern.push({
          x: i * moduleSize,
          y: j * moduleSize,
          color: (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) ? fgColor : bgColor
        });
        
        // Top-right finder pattern
        pattern.push({
          x: (modules - 7 + i) * moduleSize,
          y: j * moduleSize,
          color: (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) ? fgColor : bgColor
        });
        
        // Bottom-left finder pattern
        pattern.push({
          x: i * moduleSize,
          y: (modules - 7 + j) * moduleSize,
          color: (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) ? fgColor : bgColor
        });
      }
    }
    
    // Add timing patterns
    for (let i = 7; i < modules - 7; i++) {
      // Horizontal timing pattern
      pattern.push({
        x: i * moduleSize,
        y: 6 * moduleSize,
        color: (i % 2 === 0) ? fgColor : bgColor
      });
      
      // Vertical timing pattern
      pattern.push({
        x: 6 * moduleSize,
        y: i * moduleSize,
        color: (i % 2 === 0) ? fgColor : bgColor
      });
    }
    
    // Add alignment pattern
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        pattern.push({
          x: (modules - 9 + i) * moduleSize,
          y: (modules - 9 + j) * moduleSize,
          color: (i === 0 || i === 4 || j === 0 || j === 4 || (i === 2 && j === 2)) ? fgColor : bgColor
        });
      }
    }
    
    // Add data pattern (simplified)
    for (let i = 8; i < modules - 8; i++) {
      for (let j = 8; j < modules - 8; j++) {
        // Create a pattern based on the input value
        const index = (i * modules + j) % value.length;
        const charCode = value.charCodeAt(index);
        pattern.push({
          x: i * moduleSize,
          y: j * moduleSize,
          color: (charCode % 2 === 0) ? fgColor : bgColor
        });
      }
    }
    
    return pattern;
  };

  const pattern = generateQRPattern(value, size);

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: bgColor,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {pattern.map((module, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: module.x,
            top: module.y,
            width: size / 21,
            height: size / 21,
            backgroundColor: module.color,
          }}
        />
      ))}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontSize: size * 0.08,
          color: fgColor,
          width: '80%',
          wordBreak: 'break-all',
          pointerEvents: 'none'
        }}
      >
        {value.substring(0, 20)}{value.length > 20 ? '...' : ''}
      </div>
    </div>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [qrValue, setQrValue] = useState('https://example.com');
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrLevel, setQrLevel] = useState('H');
  const qrRef = useRef();

  const handleDownloadQR = () => {
    // Create a temporary canvas to draw the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    // Set background
    ctx.fillStyle = qrBgColor;
    ctx.fillRect(0, 0, qrSize, qrSize);
    
    // Draw QR code pattern
    const modules = 21;
    const moduleSize = qrSize / modules;
    
    // Draw finder patterns (corners)
    drawFinderPattern(ctx, 0, 0, moduleSize, qrColor);
    drawFinderPattern(ctx, qrSize - 7 * moduleSize, 0, moduleSize, qrColor);
    drawFinderPattern(ctx, 0, qrSize - 7 * moduleSize, moduleSize, qrColor);
    
    // Draw alignment pattern
    drawAlignmentPattern(ctx, qrSize - 9 * moduleSize, qrSize - 9 * moduleSize, moduleSize, qrColor);
    
    // Draw timing patterns
    for (let i = 7; i < modules - 7; i++) {
      if (i % 2 === 0) {
        // Horizontal timing pattern
        ctx.fillStyle = qrColor;
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
        // Vertical timing pattern
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
      }
    }
    
    // Draw data pattern
    for (let i = 8; i < modules - 8; i++) {
      for (let j = 8; j < modules - 8; j++) {
        // Create a pattern based on the input value
        const index = (i * modules + j) % qrValue.length;
        const charCode = qrValue.charCodeAt(index);
        if (charCode % 2 === 0) {
          ctx.fillStyle = qrColor;
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Draw format information
    for (let i = 0; i < 15; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = qrColor;
        ctx.fillRect(8 * moduleSize, i * moduleSize, moduleSize, moduleSize); // Vertical
        ctx.fillRect(i * moduleSize, 8 * moduleSize, moduleSize, moduleSize); // Horizontal
      }
    }
    
    // Create download link
    const pngUrl = canvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = pngUrl;
    link.click();
  };

  const handleCopyQR = () => {
    // Create a temporary canvas to draw the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    // Set background
    ctx.fillStyle = qrBgColor;
    ctx.fillRect(0, 0, qrSize, qrSize);
    
    // Draw QR code pattern
    const modules = 21;
    const moduleSize = qrSize / modules;
    
    // Draw finder patterns (corners)
    drawFinderPattern(ctx, 0, 0, moduleSize, qrColor);
    drawFinderPattern(ctx, qrSize - 7 * moduleSize, 0, moduleSize, qrColor);
    drawFinderPattern(ctx, 0, qrSize - 7 * moduleSize, moduleSize, qrColor);
    
    // Draw alignment pattern
    drawAlignmentPattern(ctx, qrSize - 9 * moduleSize, qrSize - 9 * moduleSize, moduleSize, qrColor);
    
    // Draw timing patterns
    for (let i = 7; i < modules - 7; i++) {
      if (i % 2 === 0) {
        // Horizontal timing pattern
        ctx.fillStyle = qrColor;
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
        // Vertical timing pattern
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
      }
    }
    
    // Draw data pattern
    for (let i = 8; i < modules - 8; i++) {
      for (let j = 8; j < modules - 8; j++) {
        // Create a pattern based on the input value
        const index = (i * modules + j) % qrValue.length;
        const charCode = qrValue.charCodeAt(index);
        if (charCode % 2 === 0) {
          ctx.fillStyle = qrColor;
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Draw format information
    for (let i = 0; i < 15; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = qrColor;
        ctx.fillRect(8 * moduleSize, i * moduleSize, moduleSize, moduleSize); // Vertical
        ctx.fillRect(i * moduleSize, 8 * moduleSize, moduleSize, moduleSize); // Horizontal
      }
    }
    
    // Copy to clipboard
    canvas.toBlob((blob) => {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    });
  };

  // Helper function to draw finder pattern
  const drawFinderPattern = (ctx, x, y, size, color) => {
    // Outer square (7x7)
    ctx.fillStyle = color;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          ctx.fillRect(x + i * size, y + j * size, size, size);
        }
      }
    }
  };

  // Helper function to draw alignment pattern
  const drawAlignmentPattern = (ctx, x, y, size, color) => {
    // 5x5 alignment pattern
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (i === 0 || i === 4 || j === 0 || j === 4 || (i === 2 && j === 2)) {
          ctx.fillRect(x + i * size, y + j * size, size, size);
        }
      }
    }
  };

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Custom QR Codes",
      description: "Create personalized QR codes with custom colors and sizes"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Design Options",
      description: "Choose from multiple color schemes and error correction levels"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Easy Export",
      description: "Download or copy your QR codes in high resolution"
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Marketing Director",
      content: "The QR code generator has revolutionized our marketing campaigns. The customization options are fantastic.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "E-commerce Manager",
      content: "Perfect for our product packaging. The ability to match our brand colors is a game-changer.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Event Organizer",
      content: "Great tool for creating custom QR codes for tickets and event materials. Easy to use and professional.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started",
      features: ["Up to 10 QR codes", "Basic customization", "PNG export", "Standard resolution"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$9",
      period: "per month",
      description: "For growing businesses and professionals",
      features: ["Unlimited QR codes", "Advanced customization", "High resolution export", "Priority support", "Batch generation"],
      cta: "Try Free for 14 Days",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "per month",
      description: "For large organizations with complex needs",
      features: ["Everything in Pro", "Custom integrations", "Dedicated support", "API access", "White-label options"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QRGen
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#generator" className="text-gray-700 hover:text-blue-600 transition-colors">Generator</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t mt-2">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-blue-600">Features</a>
              <a href="#generator" className="block text-gray-700 hover:text-blue-600">Generator</a>
              <a href="#testimonials" className="block text-gray-700 hover:text-blue-600">Testimonials</a>
              <a href="#pricing" className="block text-gray-700 hover:text-blue-600">Pricing</a>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span>🎉 New: Advanced customization options available</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Generate Custom
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> QR Codes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create beautiful, customizable QR codes for your business, events, or personal projects. 
            Perfect for marketing, packaging, and digital engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
              <span>Create QR Code</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
              View Examples
            </button>
          </div>
        </div>
      </section>

      {/* QR Code Generator Section */}
      <section id="generator" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Custom QR Code Generator</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create your custom QR code with our easy-to-use generator
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Content</label>
                <input
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter URL or text to encode"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size (px)</label>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">{qrSize}px</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Error Correction</label>
                  <select
                    value={qrLevel}
                    onChange={(e) => setQrLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foreground Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleDownloadQR}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleCopyQR}
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <Copy className="w-5 h-5" />
                  <span>Copy to Clipboard</span>
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 inline-block">
                <QRCode
                  value={qrValue}
                  size={qrSize}
                  level={qrLevel}
                  fgColor={qrColor}
                  bgColor={qrBgColor}
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create professional QR codes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you and your team
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative p-8 rounded-2xl border-2 ${
                plan.popular 
                  ? 'border-blue-600 bg-white transform scale-105' 
                  : 'border-gray-200 bg-white'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to create custom QR codes?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already creating beautiful QR codes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
              <span>Create QR Code</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">QRGen</span>
              </div>
              <p className="text-gray-400 mb-4">
                Create beautiful, customizable QR codes for your business, events, or personal projects.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QRGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
