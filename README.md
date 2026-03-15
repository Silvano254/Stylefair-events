# Style Fair Events & Decor Hub

**Elegance Redefined** — Premium Event Decoration & Styling Services

## 📋 Project Overview

Style Fair Events & Decor Hub is a luxury event decoration and styling website built with modern web technologies. The site showcases services, packages, gallery, and provides a seamless inquiry system for potential clients.

### Client Information
- **Name:** Style Fair Events & Decor Hub
- **P.O. Box:** 1875-00100, Kenya
- **Phone:** 0799 799 345 / 0703 747 508
- **Email:** stylefairevents@gmail.com
- **Instagram:** https://www.instagram.com/stylefairevents?igsh=MW4zcnVibmF3eHFyaw==
- **TikTok:** https://www.tiktok.com/@stylefairevents?_r=1&_t=ZS-94f1DxPYgy5

---

## 🎨 Design Philosophy

### Brand Identity
- **Primary Color:** Gold (#D4AF37) - Luxury & Elegance
- **Accent Color:** Green (#2D5016) - Growth & Sophistication
- **Light Background:** #F5F1E8 - Warmth & Elegance
- **Typography:** Playfair Display (Headings), Montserrat (UI), Lato (Body)

### Visual Elements
- Gold headings with green underline accents
- Green highlights on service cards
- Gold buttons with green hover effects
- Smooth animations on scroll (AOS integration)
- WhatsApp floating button for quick contact

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **JavaScript (Vanilla)** - AOS initialization, form handling, dynamic features
- **AOS (Animate On Scroll)** - Scroll-triggered animations

### Backend
- **Node.js** - Serverless environment
- **Nodemailer** - Email delivery system
- **Vercel** - Deployment platform

### Deployment
- **Vercel** - Static hosting with serverless functions

---

## 📁 Project Structure

```
stylefair-events/
│
├── frontend/
│   ├── pages/
│   │   ├── index.html          # Homepage
│   │   ├── about.html          # About Us
│   │   ├── services.html       # Services
│   │   ├── gallery.html        # Portfolio Gallery
│   │   ├── packages.html       # Pricing Packages
│   │   └── contact.html        # Contact & Inquiry Form
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css       # Global styles (1000+ lines)
│   │   ├── js/
│   │   │   └── main.js         # AOS init + form handling
│   │   └── images/             # Event images (to be added)
│   │
│   └── config/
│       └── theme.json          # Site-wide theme configuration
│
├── backend/
│   └── api/
│       └── inquiry.js          # Form submission handler
│
├── vercel.json                 # Deployment configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file

```

---

## 📄 Pages Overview

### 1. **Homepage (index.html)**
- Hero section with brand showcase
- Featured services grid with cards
- "Why Choose Us" section
- CTA (Call-to-Action) section
- Quick contact information

### 2. **About Us (about.html)**
- Company mission and values
- Team information
- Statistics/achievements
- Brand story

### 3. **Services (services.html)**
- Comprehensive service descriptions
- Event type specializations
- Service cards with detailed features
- Service comparisons

### 4. **Gallery (gallery.html)**
- Portfolio showcase
- Event categorization
- Client testimonials
- High-quality imagery

### 5. **Packages (packages.html)**
- Three pricing tiers: Bronze, Silver, Gold
- Package feature comparison
- Optional add-ons pricing
- Comparison table

### 6. **Contact (contact.html)**
- Inquiry form with validation
- Contact information
- FAQ section
- WhatsApp integration

---

## 🎯 Features & Functionality

### Frontend Features
- ✅ **Responsive Design** - Mobile-first approach (480px+)
- ✅ **AOS Animations** - Smooth scroll-triggered animations
- ✅ **Form Validation** - Client-side validation before submission
- ✅ **Navigation** - Sticky header with active link highlighting
- ✅ **Social Integration** - Instagram, TikTok, WhatsApp links
- ✅ **Accessibility** - Semantic HTML, proper contrast ratios

### Backend Features
- ✅ **Form Processing** - Receives and validates form data
- ✅ **Email Notifications** - Sends styled emails to admin
- ✅ **Client Confirmation** - Auto-replies to client
- ✅ **Error Handling** - Comprehensive validation
- ✅ **CORS Support** - Cross-origin request handling

### Form Submission Flow
```
Client fills form
        ↓
Frontend validation (email, phone, required fields)
        ↓
fetch() POST to /api/inquiry
        ↓
Backend validates again
        ↓
Sends email to admin
        ↓
Sends confirmation to client
        ↓
Returns success/error JSON
        ↓
Frontend displays message
```

---

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/stylefair/stylefair-events.git
   cd stylefair-events
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env.local` file:
   ```
   NODEMAILER_USER=stylefairevents@gmail.com
   NODEMAILER_PASS=your_app_specific_password
   ```

4. **Run development server**
   ```bash
   npm start
   ```

5. **Access the site**
   - Local: `http://localhost:3000`
   - Production: Deploy to Vercel

### Deployment to Vercel

1. **Connect repository to Vercel**
   ```bash
   npm run deploy
   ```

2. **Set environment variables in Vercel dashboard**
   - NODEMAILER_USER: `stylefairevents@gmail.com`
   - NODEMAILER_PASS: Your Gmail App-Specific Password
   - ALLOWED_ORIGINS: Your production domain(s)

3. **Deploy**
   ```bash
   vercel
   ```

### Production Deployment Checklist

✅ **Backend Security**
- [x] Environment variables secured (no hardcoding credentials)
- [x] Rate limiting implemented (50 requests/hour per IP)
- [x] Request size validation (50KB max)
- [x] Input sanitization (XSS protection)
- [x] Email timeout handling (15 seconds)
- [x] CORS headers configured
- [x] Security headers added (X-Frame-Options, X-Content-Type-Options, etc.)
- [x] Error handling without exposing internal details
- [x] Type checking for all inputs
- [x] Nodemailer connection pooling enabled

✅ **Frontend Security**
- [x] Form validation on client and server
- [x] No sensitive data in localStorage
- [x] Proper error messages for users
- [x] HTTPS enforced (Vercel default)

✅ **Data Protection**
- [x] Email templates use professional branding
- [x] Client data sanitized before storage/email
- [x] Logging includes IP but not sensitive data
- [x] Timeout protection for email operations

✅ **Performance**
- [x] Async/await error handling
- [x] Connection pooling for email service
- [x] Rate limiting to prevent spam
- [x] Static file caching configured

---

## 📧 Email Setup

### Gmail Configuration (Recommended)

1. Enable 2-Factor Authentication on Gmail
2. Generate App-Specific Password:
   - Go to myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. Use as `NODEMAILER_PASS` in environment variables

### Email Templates

#### Admin Notification Email
- Client details (name, email, phone)
- Service inquiry type
- Message content
- Formatted with gold/green branding
- Action-oriented footer

#### Client Confirmation Email
- Thank you message
- Expectation setting (24-48 hour response)
- Next steps
- Contact information
- Professional tone

---

## 🎨 CSS Structure

### Main Sections
- **Root variables** - Color scheme, transitions
- **Typography** - Font families, sizing, hierarchy
- **Header/Navigation** - Sticky navigation with active states
- **Hero Section** - Large impactful heading with animation
- **Buttons** - Primary and secondary styles with hover effects
- **Cards** - Reusable card component with shadows and hover effects
- **Forms** - Input styling, focus states, validation messages
- **Footer** - Social links, contact info, branding
- **Responsive Design** - Mobile-first media queries (768px, 480px breakpoints)

---

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+ (full layout)
- **Tablet:** 768px - 1199px (adjusted grid)
- **Mobile:** 480px - 767px (single column)
- **Small Mobile:** < 480px (minimal padding)

---

## 🔒 Security & Validation

### Form Validation
- Email regex validation
- Phone number format checking
- Required field validation
- Minimum character requirements (messages > 10 chars)

### Backend Validation
- Duplicate validation on server
- Input sanitization (HTML special chars removed)
- Error messages without sensitive info

### CORS
- Configured for production domain
- Options method supported
- Proper headers set

---

## 🐛 Troubleshooting

### Issue: Form not submitting
- Check browser console for errors
- Verify API endpoint is correct
- Ensure environment variables are set
- Check email credentials

### Issue: Emails not sending
- Verify NODEMAILER_PASS is app-specific password (not regular password)
- Check Gmail account security settings
- Verify less secure apps are allowed
- Check Vercel environment variables

### Issue: Animations not working
- Ensure AOS script loads (check Network tab)
- Verify data-aos attributes are on elements
- Check CSS for animation conflicts

### Issue: Responsive design broken
- Clear browser cache
- Check viewport meta tag is present
- Verify CSS media queries
- Test on actual device

---

## 📈 Performance Optimization

- Inline CSS for critical path
- AOS lazy loads only on viewport
- Optimized font loading (Google Fonts)
- Email templates are pre-built
- Static HTML for faster loading

---

## 🔄 Workflow: Client Inquiry to Follow-up

1. **Client Visits Website**
   - Browses services, gallery, packages
   - Explores options

2. **Client Submits Form**
   - Provides name, email, phone, service, message
   - Frontend validates

3. **Form Submission**
   - JavaScript sends POST to `/api/inquiry`
   - Backend receives and validates

4. **Email Dispatch**
   - Admin receives styled notification
   - Client receives confirmation

5. **Admin Follow-up**
   - Admin reviews inquiry details
   - Contacts client directly
   - Discusses requirements & pricing

6. **Engagement Begins**
   - Agreement on services
   - Booking confirmed
   - Event planning commences

---

## 📞 Support & Contact

For website issues or updates:
- Email: stylefairevents@gmail.com
- Phone: 0799 799 345 / 0703 747 508
- WhatsApp: 0799 799 345

---

## 📝 License

© 2026 Style Fair Events & Decor Hub. All rights reserved.

---

## 🎯 Next Steps & Enhancements

- [ ] Add image gallery items
- [ ] Implement SEO optimization
- [ ] Add Google Analytics
- [ ] Setup email campaigns
- [ ] Add payment gateway
- [ ] Implement booking calendar
- [ ] Add client testimonial videos
- [ ] Setup blog section
- [ ] Mobile app consideration

---

**Made with ✨ for Style Fair Events & Decor Hub**

*Elegance Redefined*
