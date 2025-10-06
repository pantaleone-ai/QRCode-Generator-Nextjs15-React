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
          Free QR Code Generator from Pantaleone.net
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

      {/* Customization Features Section */}
      <section className="mt-12 bg-white shadow-xl rounded-3xl p-10 w-full max-w-4xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Why Choose Our Free Custom QR Code Generator?
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Effortless Customization Options
            </h3>
            <p className="text-gray-600 mb-4">
              Create <strong>custom QR codes</strong> tailored to your needs with our intuitive interface. Choose from a wide range of sizes, colors, and error correction levels to match your brand identity or personal style.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Adjustable QR code size from 100x100 to 600x600 pixels</li>
              <li>Customizable foreground and background colors</li>
              <li>Four error correction levels (L, M, Q, H) for reliability</li>
              <li>Real-time preview of your <strong>custom QR codes</strong></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Simple and Fast Creation Process
            </h3>
            <p className="text-gray-600 mb-4">
              Generate professional <strong>QR codes</strong> in seconds with our user-friendly tool. No registration required - just enter your text or URL and start customizing immediately.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Instant QR code generation</li>
              <li>URL normalization for seamless linking</li>
              <li>High-quality PNG export for all devices</li>
              <li>Copy to clipboard functionality for easy sharing</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg font-medium text-gray-700">
            Perfect for businesses, marketers, and individuals looking to create <strong>easy custom QR codes</strong> that work everywhere.
          </p>
        </div>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-500">
        Built with ❤️ by <a href="https://pantaleone.net" target="_blank">Pantaleone.net</a> • Powered by Next.js 15 & qrcode.react
      </footer>
    </main>
  );
}
