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
                    Free QR Code Generator
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
            
            {/* --- NEW: SEO Content and Feature Sections --- */}
            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="flex justify-center items-center mb-4 bg-blue-100 text-blue-600 rounded-full w-16 h-16 mx-auto"><span className="text-2xl font-bold">1</span></div>
                        <h3 className="text-xl font-semibold mb-2">Enter Content</h3>
                        <p className="text-gray-600">Enter any URL or text into the input field. The QR code will instantly update.</p>
                    </div>
                    <div>
                        <div className="flex justify-center items-center mb-4 bg-purple-100 text-purple-600 rounded-full w-16 h-16 mx-auto"><span className="text-2xl font-bold">2</span></div>
                        <h3 className="text-xl font-semibold mb-2">Customize</h3>
                        <p className="text-gray-600">Change the size, colors, and error correction level to match your style.</p>
                    </div>
                    <div>
                        <div className="flex justify-center items-center mb-4 bg-green-100 text-green-600 rounded-full w-16 h-16 mx-auto"><span className="text-2xl font-bold">3</span></div>
                        <h3 className="text-xl font-semibold mb-2">Download & Share</h3>
                        <p className="text-gray-600">Download a high-resolution PNG or copy it to your clipboard for immediate use.</p>
                    </div>
                </div>
            </section>
            
            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                 <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Common Use Cases</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div className="p-4 rounded-lg bg-slate-50"><Wifi className="mx-auto mb-2 text-blue-500" size={32}/><h3 className="font-semibold">Share Wi-Fi</h3></div>
                    <div className="p-4 rounded-lg bg-slate-50"><ShoppingCart className="mx-auto mb-2 text-green-500" size={32}/><h3 className="font-semibold">Product Labels</h3></div>
                    <div className="p-4 rounded-lg bg-slate-50"><BookUser className="mx-auto mb-2 text-purple-500" size={32}/><h3 className="font-semibold">Business Cards</h3></div>
                    <div className="p-4 rounded-lg bg-slate-50"><Smartphone className="mx-auto mb-2 text-red-500" size={32}/><h3 className="font-semibold">App Downloads</h3></div>
                 </div>
            </section>

            <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Frequently Asked Questions</h2>
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
                </div>
            </section>

            <footer className="mt-12 text-center text-sm text-gray-500 flex items-center space-x-2">
                <span>Built with ❤️ by</span>
                <a href="https://pantaleone.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pantaleone.net</a>
                <span>•</span>
                <a href="https://github.com/pantaleone-ai/qrgen-main" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                    <Github className="w-5 h-5"/>
                </a>
            </footer>

            {/* --- NEW: Toast Notification Component --- */}
            <div className={`fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-transform duration-300 ${toast.show ? 'translate-x-0' : 'translate-x-[120%]'}`}>
                {toast.message}
            </div>
        </main>
    );
}