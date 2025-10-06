"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ direct import – no dynamic()
import { Download, Copy } from "lucide-react";

// ✅ Normalize URLs (adds https:// if missing)
const normalizeUrl = (input) => {
  if (!input) return input;
  if (/^[\w-]+(\.[\w-]+)+/.test(input) && !/^https?:\/\//i.test(input)) {
    return `https://${input}`;
  }
  return input;
};

export default function Home() {
  const [qrValue, setQrValue] = useState("https://pantaleone.net");
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrLevel, setQrLevel] = useState("H");

  const wrapperRef = useRef(null);

  const getCanvas = () => {
    if (!wrapperRef.current) return null;
    return wrapperRef.current.querySelector("canvas");
  };

  const handleDownloadQR = async () => {
    try {
      const canvas = getCanvas();
      if (!canvas) throw new Error("QR canvas not found.");

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) throw new Error("Unable to create canvas context.");

      ctx.fillStyle = qrBgColor || "#ffffff";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      ctx.drawImage(canvas, 0, 0);

      const pngUrl = exportCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download QR code.");
    }
  };

  const handleCopyQR = async () => {
    try {
      const canvas = getCanvas();
      if (!canvas) throw new Error("QR canvas not found.");

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) throw new Error("Unable to create canvas context.");

      ctx.fillStyle = qrBgColor || "#ffffff";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      ctx.drawImage(canvas, 0, 0);

      if (!navigator.clipboard) throw new Error("Clipboard API unavailable.");

      exportCanvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Blob creation failed.");
        await navigator.clipboard.write([
          new window.ClipboardItem({ "image/png": blob }),
        ]);
        alert("QR code copied to clipboard!");
      }, "image/png");
    } catch (err) {
      console.error(err);
      alert("Copy to clipboard failed. Try downloading instead.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-2xl border border-gray-100" role="main">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Free QR Code Generator
        </h1>

        {/* QR Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter URL or text
            </label>
            <input
              type="text"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Size
              </label>
              <input
                type="number"
                value={qrSize}
                min={100}
                max={600}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Error Correction
              </label>
              <select
                value={qrLevel}
                onChange={(e) => setQrLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="L">L - Low</option>
                <option value="M">M - Medium</option>
                <option value="Q">Q - Quartile</option>
                <option value="H">H - High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foreground Color
              </label>
              <input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="w-full h-10 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={qrBgColor}
                onChange={(e) => setQrBgColor(e.target.value)}
                className="w-full h-10 rounded"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-10 flex flex-col items-center space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div ref={wrapperRef}>
              <QRCodeCanvas
                value={normalizeUrl(qrValue)}
                size={qrSize}
                bgColor={qrBgColor}
                fgColor={qrColor}
                level={qrLevel}
                includeMargin={true}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownloadQR}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handleCopyQR}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2"
            >
              <Copy className="w-5 h-5" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        Built with ❤️ by Pantaleone • Powered by Next.js 15 & qrcode.react
      </footer>
    </main>
  );
}
