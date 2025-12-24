import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

const paymentPortalURL = 'https://3000-i8gc1hu7p40kqtnrl6wmi-5bba271d.manus.computer';

async function generateQRCodeWithCopy() {
  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(paymentPortalURL, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Convert data URL to buffer
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(base64Data, 'base64');

    // Create canvas with marketing copy
    const canvas = createCanvas(400, 600);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 600);

    // Header background
    const gradient = ctx.createLinearGradient(0, 0, 0, 80);
    gradient.addColorStop(0, '#1e3c72');
    gradient.addColorStop(1, '#2a5298');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 80);

    // Header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🅿️ Parking Payment', 200, 35);
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Fast, Secure & Easy', 200, 60);

    // Load QR code image
    const img = new (await import('canvas')).Image();
    img.src = qrBuffer;
    
    // Draw QR code centered
    ctx.drawImage(img, 50, 110, 300, 300);

    // Marketing copy below QR
    ctx.fillStyle = '#1e3c72';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scan to Pay', 200, 440);

    ctx.font = '12px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText('Quick parking payment', 200, 465);
    ctx.fillText('Secure PayPal checkout', 200, 485);

    // Footer with pricing
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 510, 400, 90);

    ctx.fillStyle = '#2a5298';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PRICING', 200, 530);

    ctx.font = '11px Arial';
    ctx.fillStyle = '#333333';
    ctx.fillText('1 Hour: $6.00  |  1 Day: $27.00', 200, 550);
    ctx.fillText('1 Week: $88.00  |  1 Month: $130.00', 200, 568);

    ctx.font = '10px Arial';
    ctx.fillStyle = '#999999';
    ctx.fillText('License plate required • Instant activation', 200, 585);

    // Save canvas as PNG
    const outputPath = path.join('/home/ubuntu/payment_portal/public', 'payment-qr-marketing.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ QR Code with marketing copy generated successfully!`);
    console.log(`📍 Location: ${outputPath}`);
    console.log(`🔗 Payment Portal URL: ${paymentPortalURL}`);
    console.log(`\nQR Code Features:`);
    console.log(`  • Professional header with branding`);
    console.log(`  • Clear QR code for scanning`);
    console.log(`  • Marketing copy and pricing`);
    console.log(`  • Footer with key information`);
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
    process.exit(1);
  }
}

generateQRCodeWithCopy();
