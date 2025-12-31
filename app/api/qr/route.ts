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
  const padding = logoSize * 0.12; // Slightly increased for visibility
  const borderRadius = logoSize * 0.25;

  // 1. Draw the white outer border (The "Glow/Stroke" effect)
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

  // 2. Draw the black background box
  ctx.fillStyle = '#000000';
  drawRoundedRect(ctx, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize, borderRadius);
  ctx.fill();

  // 3. Draw the "P" Text
  ctx.fillStyle = '#ffffff';
  // Use sans-serif for better cross-platform compatibility on servers
  ctx.font = `bold ${Math.floor(logoSize * 0.7)}px sans-serif`; 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Slight Y offset adjustment to visually center the "P"
  ctx.fillText('P', centerX, centerY);
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

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const margin = size * 0.05;
  const qrSize = size - margin * 2;
  const qrCanvas = createCanvas(qrSize, qrSize);
  
  await QRCode.toCanvas(qrCanvas, value, {
    errorCorrectionLevel: 'H', // High correction is vital for logo overlays
    color: { dark: fgColor, light: bgColor },
    margin: 0,
    width: qrSize,
  });

  ctx.drawImage(qrCanvas, margin, margin);

  const centerX = size / 2;
  const centerY = size / 2;
  const logoSize = size * 0.22;
  
  drawLogo(ctx, centerX, centerY, logoSize);

  const buffer = canvas.toBuffer('image/png');

  return new Response(buffer as any, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="qr-code.png"',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}