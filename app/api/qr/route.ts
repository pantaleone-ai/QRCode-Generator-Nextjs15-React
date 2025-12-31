import QRCode from 'qrcode';
import { createCanvas } from 'canvas';
// Request is a global type, so we don't import it

// Normalize URLs (copied from page.js)
const normalizeUrl = (input: string | null): string => {
  if (!input) return '';
  if (/^[\w-]+(\.[\w-]+)+/.test(input) && !/^https?:\/\//i.test(input)) {
    return `https://${input}`;
  }
  return input;
};

// Draw rounded rect
const drawRoundedRect = (ctx: any, x: number, y: number, width: number, height: number, radius: number) => {
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

// Draw logo
const drawLogo = (ctx: any, centerX: number, centerY: number, logoSize: number) => {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let value = searchParams.get('value');
  const sizeParam = searchParams.get('size');
  const fgColor = searchParams.get('fgColor') || '#000000';
  const bgColor = searchParams.get('bgColor') || '#ffffff';

  if (!value) {
    return new Response('Missing "value" parameter', { status: 400 });
  }

  value = normalizeUrl(value);
  let size = parseInt(sizeParam || '256', 10);
  if (size > 1024) size = 1024;

  // Create canvas
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Generate QR
  const margin = size * 0.05;
  const qrSize = size - margin * 2;
  const qrCanvas = createCanvas(qrSize, qrSize);
  await QRCode.toCanvas(qrCanvas, value, {
    errorCorrectionLevel: 'H',
    color: { dark: fgColor, light: bgColor },
    margin: 0,
    width: qrSize,
  });

  // Draw QR
  ctx.drawImage(qrCanvas, margin, margin);

  // Draw logo
  const centerX = size / 2;
  const centerY = size / 2;
  const logoSize = size * 0.22;
  drawLogo(ctx, centerX, centerY, logoSize);

  // Create buffer
  const buffer = canvas.toBuffer('image/png');

  // Return Response
  // FIX: Cast `buffer` to `any` (or `BodyInit`) to resolve Node vs Web type conflict
  return new Response(buffer as any, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="qr-code.png"',
    },
  });
}