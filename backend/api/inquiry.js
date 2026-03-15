// ============================================
// BACK-END API - INQUIRY HANDLER
// Handles form submissions and sends emails
// Production-Ready: Includes validation, security, and error handling
// ============================================

const nodemailer = require('nodemailer');

// ============================================
// RATE LIMITER (In-memory for simplicity)
// For production, consider using Redis
// ============================================
const rateLimitStore = {};
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_HOUR = 50; // Max 50 inquiries per IP per hour

function checkRateLimit(ip) {
  const now = Date.now();
  
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, timestamp: now };
    return true;
  }
  
  const timeDifference = now - rateLimitStore[ip].timestamp;
  
  if (timeDifference > RATE_LIMIT_WINDOW) {
    // Reset after window expires
    rateLimitStore[ip] = { count: 1, timestamp: now };
    return true;
  }
  
  if (rateLimitStore[ip].count >= MAX_REQUESTS_PER_HOUR) {
    return false;
  }
  
  rateLimitStore[ip].count++;
  return true;
}

// ============================================
// EMAIL TRANSPORTER CONFIGURATION
// ============================================
let transporter = null;

function initializeTransporter() {
  if (transporter) return transporter;
  
  const user = process.env.NODEMAILER_USER;
  const pass = process.env.NODEMAILER_PASS;
  
  if (!user || !pass) {
    console.error('Missing email credentials in environment variables');
    return null;
  }
  
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    },
    pool: {
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 4000,
      rateLimit: 14
    }
  });
  
  return transporter;
}

// ============================================
// VALIDATE EMAIL FORMAT
// ============================================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// SANITIZE INPUT
// ============================================
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/onerror=/gi, '') // Remove onerror attribute
    .slice(0, 500); // Limit to 500 characters
}

// ============================================
// BUILD EMAIL TEMPLATE
// ============================================
function buildEmailTemplate(data) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Lato', Arial, sans-serif;
          color: #1A1A1A;
          background-color: #F5F1E8;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-top: 4px solid #D4AF37;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          font-family: 'Playfair Display', serif;
          color: #D4AF37;
          font-size: 28px;
          margin: 0;
          letter-spacing: 1px;
        }
        .header p {
          color: #2D5016;
          font-size: 14px;
          margin: 5px 0 0 0;
          letter-spacing: 1px;
        }
        .content {
          line-height: 1.8;
          margin: 30px 0;
        }
        .field {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #E0D5C7;
        }
        .field:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #2D5016;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .value {
          color: #1A1A1A;
          margin-top: 5px;
          word-break: break-word;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #E0D5C7;
          font-size: 12px;
          color: #888;
        }
        .contact-info {
          background: #F5F1E8;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NEW INQUIRY</h1>
          <p>Style Fair Events & Decor Hub</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Client Name</div>
            <div class="value">${sanitizeInput(data.name)}</div>
          </div>
          
          <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Phone Number</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Service Interested</div>
            <div class="value">${sanitizeInput(data.service)}</div>
          </div>
          
          <div class="field">
            <div class="label">Message</div>
            <div class="value">${sanitizeInput(data.message).replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="contact-info">
            <strong>Next Step:</strong><br>
            Contact the client via phone or email to discuss their requirements and provide a customized quote.
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated inquiry from your website. | Sent on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return template;
}

// ============================================
// BUILD CLIENT CONFIRMATION EMAIL
// ============================================
function buildConfirmationTemplate(data) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Lato', Arial, sans-serif;
          color: #1A1A1A;
          background-color: #F5F1E8;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-top: 4px solid #D4AF37;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          font-family: 'Playfair Display', serif;
          color: #D4AF37;
          font-size: 28px;
          margin: 0;
          letter-spacing: 1px;
        }
        .header p {
          color: #2D5016;
          font-size: 14px;
          margin: 5px 0 0 0;
          letter-spacing: 1px;
        }
        .content {
          line-height: 1.8;
          margin: 30px 0;
        }
        .accent {
          color: #D4AF37;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #E0D5C7;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Elegance Redefined</h1>
          <p>Style Fair Events & Decor Hub</p>
        </div>
        
        <div class="content">
          <p>Dear <span class="accent">${sanitizeInput(data.name)}</span>,</p>
          
          <p>Thank you for reaching out to Style Fair Events & Decor Hub! We've received your inquiry and truly appreciate your interest in our services.</p>
          
          <p>Our team will review your request shortly and contact you within <span class="accent">24-48 hours</span> to discuss your event details and provide you with a personalized quote.</p>
          
          <p><strong>Here's what to expect:</strong></p>
          <ul>
            <li>Detailed consultation about your event vision</li>
            <li>Customized service packages tailored to your needs</li>
            <li>Professional styling and decoration expertise</li>
            <li>Competitive pricing with premium quality</li>
          </ul>
          
          <p>If you have any urgent questions, feel free to reach us directly:</p>
          <p>
            <strong>Phone:</strong> <a href="tel:0799799345">0799 799 345</a> / <a href="tel:0703747508">0703 747 508</a><br>
            <strong>Email:</strong> <a href="mailto:stylefairevents@gmail.com">stylefairevents@gmail.com</a>
          </p>
          
          <p>Warm regards,<br><span class="accent">Style Fair Events & Decor Hub Team</span></p>
        </div>
        
        <div class="footer">
          <p>Make your event unforgettable with Style Fair | P.O Box 1875-00100</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return template;
}

// ============================================
// MAIN HANDLER FUNCTION - PRODUCTION READY
// ============================================
module.exports = async (req, res) => {
  // ============================================
  // SECURITY HEADERS
  // ============================================
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  // ============================================
  // RATE LIMITING
  // ============================================
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return res.status(429).json({ 
      success: false, 
      message: 'Too many requests. Please try again later.' 
    });
  }
  
  // ============================================
  // REQUEST SIZE VALIDATION
  // ============================================
  const contentLength = parseInt(req.headers['content-length'] || 0);
  if (contentLength > 50 * 1024) { // 50KB limit
    return res.status(413).json({ 
      success: false, 
      message: 'Request payload too large' 
    });
  }
  
  try {
    // Ensure transporter is initialized
    const transporter = initializeTransporter();
    if (!transporter) {
      console.error('Email service not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Service temporarily unavailable. Please try again later.' 
      });
    }
    
    const { name, email, phone, service, message } = req.body;
    
    // ============================================
    // VALIDATION
    // ============================================
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name must be at least 2 characters long' 
      });
    }
    
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }
    
    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid phone number' 
      });
    }
    
    if (!service || typeof service !== 'string' || service.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select a service' 
      });
    }
    
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message must be at least 10 characters long' 
      });
    }
    
    // ============================================
    // SEND ADMIN NOTIFICATION EMAIL
    // ============================================
    const adminEmailData = {
      from: process.env.NODEMAILER_USER,
      to: process.env.NODEMAILER_USER,
      subject: `New Inquiry: ${sanitizeInput(name)} - ${sanitizeInput(service)}`,
      html: buildEmailTemplate({ name, email, phone, service, message }),
      timeout: 10000 // 10 second timeout
    };
    
    // ============================================
    // SEND CONFIRMATION TO CLIENT
    // ============================================
    const clientEmailData = {
      from: process.env.NODEMAILER_USER,
      to: sanitizeInput(email),
      subject: 'We Received Your Inquiry - Style Fair Events',
      html: buildConfirmationTemplate({ name }),
      timeout: 10000 // 10 second timeout
    };
    
    // Send both emails in parallel with timeout
    const emailPromises = [
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Admin email timeout')), 15000);
        transporter.sendMail(adminEmailData).then(resolve).catch(reject);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Client email timeout')), 15000);
        transporter.sendMail(clientEmailData).then(resolve).catch(reject);
      })
    ];
    
    await Promise.all(emailPromises);
    
    // ============================================
    // SUCCESS LOGGING
    // ============================================
    console.log(`[${new Date().toISOString()}] Inquiry submitted - Name: ${sanitizeInput(name)}, Service: ${sanitizeInput(service)}, IP: ${clientIP}`);
    
    // ============================================
    // SUCCESS RESPONSE
    // ============================================
    return res.status(200).json({
      success: true,
      message: 'Inquiry submitted successfully! We will contact you shortly.'
    });
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Inquiry API Error - IP: ${clientIP} - Error: ${error.message}`);
    
    // Don't expose internal error details to client
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your inquiry. Please try again later or contact us directly.'
    });
  }
};
