import nodemailer from 'nodemailer';

// Configure email transporter
// For production, use a real email service (Gmail, SendGrid, etc.)
// For testing, you can use Ethereal Email (fake SMTP service)

export const createEmailTransporter = () => {
  // Using Gmail SMTP (you'll need to set up app-specific password)
  // Or use another email service like SendGrid, Mailgun, etc.
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

export const sendReceiptEmail = async (transporter, customerEmail, paymentData) => {
  const { licensePlate, duration, amount, transactionId, paymentDate } = paymentData;

  const htmlContent = generateReceiptHTML(licensePlate, duration, amount, transactionId, paymentDate);

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Parking Payment Receipt - License Plate: ${licensePlate}`,
    html: htmlContent,
    text: generateReceiptText(licensePlate, duration, amount, transactionId, paymentDate)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const generateReceiptHTML = (licensePlate, duration, amount, transactionId, paymentDate) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f5f7fa;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 2rem;
            }
            .header p {
                margin: 5px 0 0 0;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .receipt-title {
                font-size: 1.5rem;
                color: #1e3c72;
                margin-bottom: 20px;
                text-align: center;
                font-weight: 600;
            }
            .success-badge {
                text-align: center;
                margin-bottom: 20px;
                font-size: 3rem;
            }
            .section {
                margin-bottom: 25px;
                border-bottom: 1px solid #e0e6ed;
                padding-bottom: 20px;
            }
            .section:last-child {
                border-bottom: none;
            }
            .section-title {
                font-size: 0.9rem;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 12px;
                font-weight: 600;
            }
            .license-plate-box {
                background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
                border: 3px solid #333;
                border-radius: 6px;
                padding: 15px;
                text-align: center;
                margin-bottom: 15px;
            }
            .license-plate-box .state {
                font-size: 0.7rem;
                color: #333;
                font-weight: 700;
                letter-spacing: 2px;
                margin-bottom: 5px;
            }
            .license-plate-box .plate-number {
                font-size: 2rem;
                color: #333;
                font-weight: 700;
                font-family: 'Courier New', monospace;
                letter-spacing: 3px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 8px 0;
            }
            .detail-label {
                color: #666;
                font-weight: 500;
            }
            .detail-value {
                color: #1e3c72;
                font-weight: 600;
            }
            .amount-row {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 2px solid #2a5298;
                font-size: 1.2rem;
                font-weight: 700;
                color: #1e3c72;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #999;
                font-size: 0.85rem;
                border-top: 1px solid #e0e6ed;
            }
            .footer p {
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🅿️ Parking Payment</h1>
                <p>Payment Receipt</p>
            </div>
            
            <div class="content">
                <div class="success-badge">✅</div>
                <div class="receipt-title">Payment Successful</div>
                
                <div class="section">
                    <div class="section-title">Vehicle Information</div>
                    <div class="license-plate-box">
                        <div class="state">STATE</div>
                        <div class="plate-number">${licensePlate}</div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Parking Details</div>
                    <div class="detail-row">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">${duration}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Amount Paid</span>
                        <span class="detail-value">$${amount}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Date</span>
                        <span class="detail-value">${paymentDate}</span>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Transaction Information</div>
                    <div class="detail-row">
                        <span class="detail-label">Transaction ID</span>
                        <span class="detail-value">${transactionId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Method</span>
                        <span class="detail-value">PayPal</span>
                    </div>
                </div>
                
                <div class="section" style="border-bottom: none;">
                    <div class="amount-row">
                        <span>Total Amount</span>
                        <span>$${amount}</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>🔒 This is an automated receipt. Your parking session has been activated.</p>
                <p>Keep this receipt for your records.</p>
                <p>© 2025 Parking Payment System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const generateReceiptText = (licensePlate, duration, amount, transactionId, paymentDate) => {
  return `
PARKING PAYMENT RECEIPT
=======================

✅ PAYMENT SUCCESSFUL

VEHICLE INFORMATION
-------------------
License Plate: ${licensePlate}

PARKING DETAILS
---------------
Duration: ${duration}
Amount Paid: $${amount}
Payment Date: ${paymentDate}

TRANSACTION INFORMATION
----------------------
Transaction ID: ${transactionId}
Payment Method: PayPal

TOTAL AMOUNT: $${amount}

---

🔒 This is an automated receipt. Your parking session has been activated.
Keep this receipt for your records.

© 2025 Parking Payment System. All rights reserved.
  `;
};
