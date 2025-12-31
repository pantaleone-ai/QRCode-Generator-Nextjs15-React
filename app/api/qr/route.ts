import QRCode from 'qrcode';
import { createCanvas } from 'canvas';

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

const drawLogo = (ctx: any, centerX: number, centerY: number, logoSize: number) => {
  const padding = logoSize * 0.15; // Thick white border as seen in your image
  const borderRadius = logoSize * 0.25;

  // 1. White Background Border
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(
    ctx, 
    centerX - (logoSize + padding) / 2, 
    centerY - (logoSize + padding) / 2, 
    logoSize + padding, 
    logoSize + padding, 
    borderRadius + padding / 2
  );
  ctx.fill();

  // 2. Black Rounded Square
  ctx.fillStyle = '#000000';
  drawRoundedRect(ctx, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize, borderRadius);
  ctx.fill();

  // 3. Draw the "P" using vector paths to match the reference image exactly
  ctx.fillStyle = '#ffffff';
  
  const pWidth = logoSize * 0.5;
  const pHeight = logoSize * 0.6;
  const stemWidth = pWidth * 0.35;
  const startX = centerX - pWidth / 2;
  const startY = centerY - pHeight / 2;

  ctx.beginPath();
  // Vertical Stem
  ctx.rect(startX, startY, stemWidth, pHeight);
  
  // Top horizontal bar of loop
  ctx.rect(startX + stemWidth, startY, pWidth - stemWidth, stemWidth);
  
  // Bottom horizontal bar of loop
  ctx.rect(startX + stemWidth, startY + (pHeight * 0.5) - (stemWidth / 2), pWidth - stemWidth, stemWidth);
  
  // Right vertical bar of loop (slightly rounded feel)
  ctx.rect(startX + pWidth - stemWidth, startY, stemWidth, (pHeight * 0.5) + (stemWidth / 2));
  
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

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // QR Generation
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

  // Logo Overlay
  drawLogo(ctx, size / 2, size / 2, size * 0.22);

  // Convert to Buffer and return with proper Type casting for TS
  const buffer = canvas.toBuffer('image/png');

  return new Response(buffer as any, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="qr-code.png"',
    },
  });
}