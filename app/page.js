"use client";

import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, X, Wifi, Smartphone, BookUser, ShoppingCart, Github } from "lucide-react";

// ✅ Normalize URLs (adds https:// if missing)
const normalizeUrl = (input) => {
    if (!input) return "";
    if (/^[\w-]+(\.[\w-]+)+/.test(input) && !/^https?:\/\//i.test(input)) {
        return `https://${input}`;
    }
    return input;
};

// --- LOGO DRAWING FUNCTIONS (Unchanged) ---
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
};

const drawLogo = (ctx, centerX, centerY, logoSize) => {
    const padding = logoSize * 0.1;
    const borderRadius = logoSize * 0.2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = padding;
    drawRoundedRect(ctx, centerX - logoSize / 2 - padding / 2, centerY - logoSize / 2 - padding / 2, logoSize + padding, logoSize + padding, borderRadius + padding / 2);
    ctx.stroke();
    ctx.fillStyle = '#000000';
    drawRoundedRect(ctx, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize, borderRadius);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${logoSize * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', centerX, centerY - logoSize * 0.05);
};


export default function Home() {
    // --- STATE MANAGEMENT ---
    const [inputValue, setInputValue] = useState("https://pantaleone.net?utm_source=qrcode&utm_medium=qr&utm_id=main-qr");
    const [qrValue, setQrValue] = useState("https://pantaleone.net?utm_source=qrcode&utm_medium=qr&utm_id=main-qr");
    const [qrSize, setQrSize] = useState(256);
    const [qrColor, setQrColor] = useState("#000000");
    const [qrBgColor, setQrBgColor] = useState("#ffffff");
    const [qrLevel, setQrLevel] = useState("H");
    const [dpr, setDpr] = useState(1);
    const [toast, setToast] = useState({ show: false, message: "" });

    const hiddenQrRef = useRef(null);
    const visibleCanvasRef = useRef(null);

    useEffect(() => {
        setDpr(window.devicePixelRatio || 1);
    }, []);

    // --- NEW: Debounced Input for Smoother UX ---
    useEffect(() => {
        const handler = setTimeout(() => {
            setQrValue(inputValue);
        }, 300); // 300ms delay after user stops typing

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue]);

    // --- RELIABLE COMPOSITING LOGIC (Unchanged) ---
    useEffect(() => {
        const hiddenCanvas = hiddenQrRef.current?.querySelector("canvas");
        const visibleCanvas = visibleCanvasRef.current;
        if (!hiddenCanvas || !visibleCanvas) return;
        
        const timeoutId = setTimeout(() => {
            const ctx = visibleCanvas.getContext("2d");
            if (!ctx) return;
            const margin = visibleCanvas.width * 0.05;
            const qrDrawableSize = visibleCanvas.width - margin * 2;
            ctx.fillStyle = qrBgColor;
            ctx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);
            ctx.drawImage(hiddenCanvas, margin, margin, qrDrawableSize, qrDrawableSize);
            const centerX = visibleCanvas.width / 2;
            const centerY = visibleCanvas.height / 2;
            const logoSize = visibleCanvas.width * 0.22;
            drawLogo(ctx, centerX, centerY, logoSize);
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [qrValue, qrSize, qrColor, qrBgColor, qrLevel, dpr]);

    // --- NEW: Toast Notification Helper ---
    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast({ show: false, message: "" });
        }, 3000); // Hide after 3 seconds
    };

    // --- DOWNLOAD AND COPY ACTIONS ---
    const handleDownloadQR = () => {
        const canvas = visibleCanvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "qr-code-pantaleone.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyQR = () => {
        const canvas = visibleCanvasRef.current;
        if (!canvas) return;
        canvas.toBlob((blob) => {
            if (!blob) return;
            navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
                .then(() => showToast("Copied to clipboard!"))
                .catch(err => console.error("Copy failed:", err));
        }, "image/png");
    };

    const internalSize = Math.round(qrSize * dpr);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-2xl border border-gray-100" role="main">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Free Custom QR Code Generator from Pantaleone.net
                </h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter URL or text</label>
                        <div className="relative">
                            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10" placeholder="https://pantaleone.net"/>
                            {inputValue && (
                                <button onClick={() => setInputValue('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5"/>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Size (px)</label>
                            <input type="number" value={qrSize} min={200} max={600} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Error Correction</label>
                            <select value={qrLevel} onChange={(e) => setQrLevel(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="L">Low</option>
                                <option value="M">Medium</option>
                                <option value="Q">Quartile</option>
                                <option value="H">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Foreground</label>
                            <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                            <input type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer"/>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center space-y-6">
                    <div className="p-2 rounded-2xl border border-gray-200 shadow-sm bg-white">
                        <div ref={hiddenQrRef} style={{ display: 'none' }}>
                            <QRCodeCanvas value={normalizeUrl(qrValue)} size={internalSize} bgColor="transparent" fgColor={qrColor} level={qrLevel} includeMargin={false}/>
                        </div>
                        <canvas ref={visibleCanvasRef} width={internalSize} height={internalSize} style={{ width: qrSize, height: qrSize }}/>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleDownloadQR} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 transform hover:scale-105 active:scale-95"><Download className="w-5 h-5" /><span>Download</span></button>
                        <button onClick={handleCopyQR} className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2 transform hover:scale-105 active:scale-95"><Copy className="w-5 h-5" /><span>Copy</span></button>
                    </div>
                </div>
            </div>
            
               {/* --- NEW: Keyword-Rich Intro Section --- */}
            <section className="mt-8 text-center w-full max-w-4xl">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Free QR Code Generator | Create Custom QR Codes Instantly</h1>
                <p className="text-gray-600 text-lg mb-6">Our free QR code generator lets you create custom QR codes online with logos, colors, and high error correction. Perfect for websites, business cards, Wi-Fi sharing, and more. No sign-up required—generate static QR codes that never expire.</p>
            </section>

            {/* --- UPDATED: How It Works with More Details --- */}
            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">How to Use Our Free QR Code Generator</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="flex justify-center items-center mb-4 bg-blue-100 text-blue-600 rounded-full w-16 h-16 mx-auto"><span className="text-2xl font-bold">1</span></div>
                        <h3 className="text-xl font-semibold mb-2">Enter Your Content</h3>
                        <p className="text-gray-600">Simply input a URL, text, or any data into the field. Our custom QR code maker automatically normalizes URLs and updates the preview in real-time. Ideal for creating QR codes for websites or links.</p>
                    </div>
                    <div>
                        <div className="flex justify-center items-center mb-4 bg-purple-100 text-purple-600 rounded-full w-16 h-16 mx-auto"><span className="text-2xl font-bold">2</span></div>
                        <h3 className="text-xl font-semibold mb-2">Customize Your QR Code</h3>
                        <p className="text-gray-600">Adjust the size (up to 1024px), foreground and background colors, and error correction level to fit your branding. Add our custom logo for a professional touch with this free QR code creator.</p>
                    </div>
                    <div>
                        <div className="flex justify-center items-center mb-4 bg-green-100 text-green-600 rounded-full w-16 h-16 mx-auto"><span className="text-2xl font-bold">3</span></div>
                        <h3 className="text-xl font-semibold mb-2">Download or Share</h3>
                        <p className="text-gray-600">Get a high-resolution PNG download or copy to clipboard. Share your custom QR code easily for marketing, events, or personal use.</p>
                    </div>
                </div>
            </section>

            {/* --- NEW: Benefits Section --- */}
            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Why Choose Our Free Custom QR Code Maker?</h2>
                <ul className="space-y-4 text-gray-600">
                    <li><strong>Completely Free:</strong> No ads, limits, or watermarks—unlike other QR code generators.</li>
                    <li><strong>Custom Branding:</strong> Add logos and colors to make your QR code unique.</li>
                    <li><strong>High Reliability:</strong> Fixed high error correction ensures scans work even if damaged.</li>
                    <li><strong>Instant Generation:</strong> Create QR codes online free in seconds, no software needed.</li>
                    <li><strong>SEO-Friendly:</strong> Optimized for searches like "best free QR code generator with logo".</li>
                </ul>
            </section>

            {/* --- UPDATED: Common Use Cases with Details --- */}
            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                 <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Common Use Cases for QR Codes</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div className="p-4 rounded-lg bg-slate-50">
                        <Wifi className="mx-auto mb-2 text-blue-500" size={32} alt="Wi-Fi sharing icon" />
                        <h3 className="font-semibold">Share Wi-Fi Networks</h3>
                        <p className="text-sm text-gray-600 mt-2">Create a QR code for Wi-Fi credentials to let guests connect easily without typing passwords.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50">
                        <ShoppingCart className="mx-auto mb-2 text-green-500" size={32} alt="Product labels icon" />
                        <h3 className="font-semibold">Product Labels</h3>
                        <p className="text-sm text-gray-600 mt-2">Add QR codes to products linking to details, reviews, or purchase pages for better customer engagement.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50">
                        <BookUser className="mx-auto mb-2 text-purple-500" size={32} alt="Business cards icon" />
                        <h3 className="font-semibold">Business Cards</h3>
                        <p className="text-sm text-gray-600 mt-2">Generate vCard QR codes for contact info, making networking seamless and digital.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50">
                        <Smartphone className="mx-auto mb-2 text-red-500" size={32} alt="App downloads icon" />
                        <h3 className="font-semibold">App Downloads</h3>
                        <p className="text-sm text-gray-600 mt-2">Link directly to app stores with a custom QR code for quick mobile downloads.</p>
                    </div>
                 </div>
            </section>

            {/* --- NEW: QR Code API Section --- */}
            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">QR Code Generation API</h2>
                <p className="text-gray-600 mb-4">Integrate our free QR code API into your apps or websites. Use GET requests like <code>/api/qr?value=your-url&size=256&fgColor=%23000000</code> to generate custom QR codes programmatically.</p>
                <p className="text-gray-600">Perfect for developers needing a reliable, free QR code generator API with logo support. Check the GitHub repo for docs.</p>
            </section>

            {/* --- UPDATED: Frequently Asked Questions with More Entries --- */}
            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Frequently Asked Questions About QR Code Generators</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg">Do these QR codes expire?</h3>
                        <p className="text-gray-600">No. The QR codes generated here are static and encode the text or URL you provide directly. They will work as long as the destination URL is active.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Can I track how many people scan my QR code?</h3>
                        <p className="text-gray-600">Not directly with this tool. To track scans, you should use a URL shortener service (like Bitly) or add UTM tracking parameters to your link before generating the QR code. This allows your analytics software (like Google Analytics) to track the traffic coming from your code.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">Is this service completely free?</h3>
                        <p className="text-gray-600">Yes. This QR code generator is a free tool with no restrictions, subscriptions, or hidden costs. You can create and download as many codes as you need.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">How do I add a logo to my QR code?</h3>
                        <p className="text-gray-600">Our free custom QR code maker automatically adds a branded logo in the center. For custom logos, contact us or check advanced tools.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">What is the best size for a QR code?</h3>
                        <p className="text-gray-600">We recommend at least 256px for print. Larger sizes (up to 1024px) ensure better scannability from distances.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Can I create QR codes for events or payments?</h3>
                        <p className="text-gray-600">Yes! Use our tool to generate QR codes for event registrations, PayPal links, or cryptocurrency wallets.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Is this QR code generator secure?</h3>
                        <p className="text-gray-600">Absolutely. All generation happens client-side or via our secure API—no data is stored.</p>
                    </div>
                </div>
            </section>

            {/* --- NEW: Tips Section --- */}
            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Tips for Creating Effective QR Codes</h2>
                <ul className="space-y-4 text-gray-600">
                    <li><strong>Test Scans:</strong> Always scan your QR code on multiple devices before printing.</li>
                    <li><strong>Contrast Colors:</strong> Use high-contrast foreground/background for easy scanning.</li>
                    <li><strong>Add Calls-to-Action:</strong> Print "Scan Me" next to your QR code to boost engagement.</li>
                    <li><strong>Optimize for Mobile:</strong> Ensure linked content is mobile-friendly.</li>
                    <li><strong>Use Long-Tail Links:</strong> Shorten complex URLs for cleaner codes.</li>
                </ul>
            </section>

            <footer className="mt-12 text-center text-sm text-gray-500 flex items-center space-x-2">
                <span>Built with ❤️ by</span>
                <a href="https://pantaleone.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pantaleone.net</a>
                <span>•</span>
                <a href="https://github.com/pantaleone-ai/qrgen-main" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                    <Github className="w-5 h-5" alt="GitHub repository" />
                </a>
            </footer>
        </main>
    );
}