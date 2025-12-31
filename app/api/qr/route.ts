import QRCode from 'qrcode';
import { createCanvas } from 'canvas';

// 1. Fixed the import error - Request is global in Next.js
const normalizeUrl = (input: string | null): string => {
  if (!input) return '';
  if (/^[\w-]+(\.[\w-]+)+/.test(input) && !/^https?:\/\//i.test(input)) {
    return `https://${input}`;
  }
  return input;
};

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

/**
 * FIXED: This function now draws the "P" manually using shapes 
 * so it doesn't depend on server fonts.
 */
const drawLogo = (ctx: any, centerX: number, centerY: number, logoSize: number) => {
  const padding = logoSize * 0.12;
  const borderRadius = logoSize * 0.25;

  // 1. Draw White Outer Border (The Stroke)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = padding;
  drawRoundedRect(
    ctx, 
    centerX - logoSize / 2 - padding / 2, 
    centerY - logoSize / 2 - padding / 2, 
    logoSize + padding, 
    logoSize + padding, 
    borderRadius + padding / 2
  );
  ctx.stroke();

  // 2. Draw Black Box
  ctx.fillStyle = '#000000';
  drawRoundedRect(ctx, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize, borderRadius);
  ctx.fill();

  // 3. Draw the "P" using paths (No font required)
  const pSize = logoSize * 0.55;
  const pX = centerX - pSize * 0.35; // Position the stem
  const pY = centerY - pSize * 0.5;
  
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  
  // Stem of the P
  ctx.fillRect(pX, pY, pSize * 0.2, pSize);
  
  // Loop of the P
  const loopWidth = pSize * 0.5;
  const loopHeight = pSize * 0.55;
  const loopX = pX + pSize * 0.2;
  const loopY = pY;
  
  // Outer part of loop
  drawRoundedRect(ctx, loopX - 2, loopY, loopWidth, loopHeight, loopHeight / 2);
  ctx.fill();
  
  // Cutout for the loop (making it look like a "P")
  ctx.fillStyle = '#000000';
  const innerPad = pSize * 0.15;
  drawRoundedRect(
    ctx, 
    loopX, 
    loopY + innerPad, 
    loopWidth - innerPad, 
    loopHeight - (innerPad * 2), 
    (loopHeight - (innerPad * 2)) / 2
  );
  ctx.fill();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let value = searchParams.get('value');
  const sizeParam = searchParams.get('size');
  const fgColor = searchParams.get('fgColor') || '#000000';
  const bgColor = searchParams.get('bgColor') || '#ffffff';

  if (!value) return new Response('Missing "value"', { status: 400 });

  value = normalizeUrl(value);
  let size = parseInt(sizeParam || '256', 10);
  if (size > 1024) size = 1024;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill Background
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

  ctx.drawImage(qrCanvas, margin, margin);

  // Overlay Logo
  drawLogo(ctx, size / 2, size / 2, size * 0.22);

  const buffer = canvas.toBuffer('image/png');

  // 2. Fixed Type error - casting to any
  return new Response(buffer as any, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}