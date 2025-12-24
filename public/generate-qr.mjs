import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const paymentPortalURL = 'https://3000-i8gc1hu7p40kqtnrl6wmi-5bba271d.manus.computer';

async function generateQRCode() {
  try {
    const outputPath = path.join('/home/ubuntu/payment_portal/public', 'payment-qr.png');
    
    await QRCode.toFile(outputPath, paymentPortalURL, {
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

    console.log(`✅ QR Code generated successfully!`);
    console.log(`📍 Location: ${outputPath}`);
    console.log(`🔗 Payment Portal URL: ${paymentPortalURL}`);
    console.log(`\nQR Code points to: ${paymentPortalURL}`);
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
    process.exit(1);
  }
}

generateQRCode();
