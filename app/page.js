"use client";

import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy } from "lucide-react";

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
    const [qrValue, setQrValue] = useState("https://pantaleone.net?utm_source=qrcode&utm_medium=qr&utm_id=main-qr");
    const [qrSize, setQrSize] = useState(256);
    const [qrColor, setQrColor] = useState("#000000");
    const [qrBgColor, setQrBgColor] = useState("#ffffff");
    const [qrLevel, setQrLevel] = useState("H");
    const [dpr, setDpr] = useState(1);

    const hiddenQrRef = useRef(null);
    const visibleCanvasRef = useRef(null);

    useEffect(() => {
        setDpr(window.devicePixelRatio || 1);
    }, []);

    // --- FINAL, CORRECTED COMPOSITING LOGIC ---
    useEffect(() => {
        const hiddenCanvas = hiddenQrRef.current?.querySelector("canvas");
        const visibleCanvas = visibleCanvasRef.current;
        if (!hiddenCanvas || !visibleCanvas) return;
        
        const timeoutId = setTimeout(() => {
            const ctx = visibleCanvas.getContext("2d");
            if (!ctx) return;

            // Define our own margin ("quiet zone") as a percentage of the canvas size
            const margin = visibleCanvas.width * 0.05;
            const qrDrawableSize = visibleCanvas.width - margin * 2;

            // 1. Fill the entire visible canvas with the desired background color.
            ctx.fillStyle = qrBgColor;
            ctx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);

            // 2. Draw the QR code from the hidden canvas, scaling it to fit within our manual margin.
            // This makes the scannable area much larger and more reliable.
            ctx.drawImage(hiddenCanvas, margin, margin, qrDrawableSize, qrDrawableSize);

            // 3. Draw the logo perfectly in the center of the final canvas.
            const centerX = visibleCanvas.width / 2;
            const centerY = visibleCanvas.height / 2;
            const logoSize = visibleCanvas.width * 0.22;
            drawLogo(ctx, centerX, centerY, logoSize);
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [qrValue, qrSize, qrColor, qrBgColor, qrLevel, dpr]);

    // --- DOWNLOAD AND COPY ACTIONS (Unchanged, they correctly target the visible canvas) ---
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
                .then(() => alert("QR Code copied to clipboard!"))
                .catch(err => console.error("Copy failed:", err));
        }, "image/png");
    };

    const internalSize = Math.round(qrSize * dpr);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-2xl border border-gray-100" role="main">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Free QR Code Generator
                </h1>

                {/* --- USER INPUTS --- */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter URL or text</label>
                        <input type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://pantaleone.net"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Foreground</label>
                            <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-full h-10 rounded-lg"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                            <input type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} className="w-full h-10 rounded-lg"/>
                        </div>
                    </div>
                </div>

                {/* --- QR PREVIEW & ACTIONS --- */}
                <div className="mt-10 flex flex-col items-center space-y-6">
                    <div className="p-2 rounded-2xl border border-gray-200 shadow-sm bg-white">
                        {/* Hidden canvas for edge-to-edge QR generation */}
                        <div ref={hiddenQrRef} style={{ display: 'none' }}>
                            <QRCodeCanvas
                                value={normalizeUrl(qrValue)}
                                size={internalSize}
                                bgColor="transparent" // Background is handled by the visible canvas
                                fgColor={qrColor}
                                level={qrLevel}
                                includeMargin={false} // CRITICAL FIX: Renders the code edge-to-edge
                            />
                        </div>
                        {/* Visible canvas for final composition with manual margin */}
                        <canvas
                            ref={visibleCanvasRef}
                            width={internalSize}
                            height={internalSize}
                            style={{ width: qrSize, height: qrSize }}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleDownloadQR} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"><Download className="w-5 h-5" /><span>Download PNG</span></button>
                        <button onClick={handleCopyQR} className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2"><Copy className="w-5 h-5" /><span>Copy</span></button>
                    </div>
                </div>
            </div>
            
            {/* ...Your informational sections... */}

            <footer className="mt-12 text-center text-sm text-gray-500">
                Built with ❤️ by <a href="https://pantaleone.net" target="_blank" rel="noopener noreferrer">Pantaleone.net</a>
            </footer>
        </main>
    );
}