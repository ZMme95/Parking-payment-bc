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
        dark: '#003366',
        light: '#FFFFFF'
      }
    });

    // Convert data URL to buffer
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(base64Data, 'base64');

    // Create canvas with marketing copy
    const canvas = createCanvas(400, 650);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 650);

    // Header background with BC blue gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 90);
    gradient.addColorStop(0, '#003366');
    gradient.addColorStop(1, '#004d99');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 90);

    // Header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🅿️ Parking Payment BC', 200, 40);
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Fast, Secure & Easy', 200, 65);
    ctx.font = '11px Arial';
    ctx.fillText('🍁 British Columbia, Canada', 200, 82);

    // Load QR code image
    const img = new (await import('canvas')).Image();
    img.src = qrBuffer;
    
    // Draw QR code centered
    ctx.drawImage(img, 50, 110, 300, 300);

    // Marketing copy below QR
    ctx.fillStyle = '#003366';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scan to Pay', 200, 440);

    ctx.font = '12px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText('Quick parking payment', 200, 465);
    ctx.fillText('PayPal • Debit • Credit Card', 200, 485);

    // Footer with pricing in CAD
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 510, 400, 140);

    ctx.fillStyle = '#003366';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PRICING (CAD)', 200, 530);

    ctx.font = '10px Arial';
    ctx.fillStyle = '#333333';
    ctx.fillText('1 Hour: $8.50  |  1 Day: $36.50', 200, 550);
    ctx.fillText('1 Week: $118.50  |  1 Month: $175.00', 200, 568);

    ctx.font = '11px Arial';
    ctx.fillStyle = '#004d99';
    ctx.fillText('Multiple Payment Options', 200, 590);

    ctx.font = '10px Arial';
    ctx.fillStyle = '#999999';
    ctx.fillText('License plate required • Instant activation', 200, 610);
    ctx.fillText('Secure & Encrypted • Zone A, BC', 200, 625);

    // Save canvas as PNG
    const outputPath = path.join('/home/ubuntu/payment_portal/public', 'parking-payment-bc-qr.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ BC QR Code with marketing copy generated successfully!`);
    console.log(`📍 Location: ${outputPath}`);
    console.log(`🔗 Payment Portal URL: ${paymentPortalURL}`);
    console.log(`\nQR Code Features:`);
    console.log(`  • BC-themed header with maple leaf`);
    console.log(`  • Professional QR code for scanning`);
    console.log(`  • CAD pricing tiers`);
    console.log(`  • Multiple payment method options`);
    console.log(`  • British Columbia branding`);
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
    process.exit(1);
  }
}

generateQRCodeWithCopy();
