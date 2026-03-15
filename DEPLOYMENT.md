# 🚀 Production Deployment Guide

## Quick Start

### 1. Generate Gmail App Password
```
1. Go to: myaccount.google.com/apppasswords
2. Sign in to stylefairevents@gmail.com if prompted
3. Select "Mail" application
4. Select "Windows Computer" (or your OS)
5. Click "Generate"
6. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
```

### 2. Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

Add these 4 variables:

| Variable | Value | Scope |
|----------|-------|-------|
| `NODEMAILER_USER` | `stylefairevents@gmail.com` | Production, Preview, Development |
| `NODEMAILER_PASS` | `[16-char app password]` | **Production ONLY** ⚠️ |
| `ALLOWED_ORIGINS` | `https://stylefairevents.com,https://www.stylefairevents.com` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production ONLY |

### 3. Deploy to Production
```bash
# Deploy to production
vercel --prod

# Or just push to main branch if auto-deploy enabled
```

---

## 📋 Complete Deployment Checklist

### Pre-Deployment (Week Before)
- [ ] All pages tested locally
- [ ] Forms submit successfully
- [ ] Emails send to test accounts
- [ ] Images load correctly
- [ ] Responsive design verified on 3+ devices
- [ ] No console errors in DevTools
- [ ] All links work (internal and external)
- [ ] Contact form fully functional

### Gmail Configuration
- [ ] 2-Factor Authentication enabled on stylefairevents@gmail.com
- [ ] App-Specific Password generated
- [ ] Password copied correctly (16 chars with spaces)
- [ ] Less secure app access allowed (if needed)

### Vercel Configuration
- [ ] Domain connected to Vercel project
- [ ] SSL certificate configured (auto)
- [ ] All 4 environment variables set
- [ ] NODEMAILER_PASS scope = **Production only** ⚠️
- [ ] All other variables set to "Production, Preview, Development"

### Production Domain Setup
- [ ] Domain DNS updated to point to Vercel
- [ ] DNS A record: `76.76.19.165` (Vercel's IP)
- [ ] CNAME record: `cname.vercel.com`
- [ ] SSL certificate active (green lock icon)
- [ ] Redirects working (www → non-www or vice versa)

### Final Testing (Post-Deployment)
- [ ] Visit production domain: https://stylefairevents.com
- [ ] Speed test: Should load in <3 seconds
- [ ] Mobile responsive: Test on phone
- [ ] Form submission: Fill & submit test form
- [ ] Admin email received: Check inbox for test inquiry
- [ ] Client confirmation email: Check test recipient
- [ ] WhatsApp button: Click and verify link
- [ ] Social media links: Click Instagram/TikTok
- [ ] Navigation: All menu items accessible
- [ ] Images: All portfolio images display
- [ ] No errors: Check browser console (F12)

---

## 🔐 Security Checklist

### Credentials Management
- [ ] `.env.local` file exists locally but NOT committed
- [ ] `.env.production` file NOT committed to git
- [ ] `.gitignore` includes `.env*` patterns
- [ ] No credentials in GitHub/version control
- [ ] All secrets in Vercel dashboard (not in code)
- [ ] NODEMAILER_PASS scoped to Production only

### API Security
- [ ] CORS headers restrict to your domain
- [ ] Rate limiting active (50/hour per IP)
- [ ] Input validation working
- [ ] No sensitive errors exposed to frontend
- [ ] HTTPS enforced (Vercel default)
- [ ] Security headers configured

### Email Security
- [ ] App Password (not Gmail password) used
- [ ] 2FA enabled on Gmail account
- [ ] Gmail SMTP encryption enabled
- [ ] Connection pooling limits concurrent emails
- [ ] Timeout protection prevents hanging requests

---

## 📧 Email Test Checklist

### Admin Notification Email
```
TO: stylefairevents@gmail.com
Subject: New Inquiry: [Client Name] - [Service]

Expected Content:
- Client name, email, phone number
- Service type requested
- Message content
- Formatted with gold/green branding
- Professional footer
```

### Client Confirmation Email
```
TO: [Client's Email from Form]
Subject: We Received Your Inquiry - Style Fair Events

Expected Content:
- Thank you message
- "24-48 hour response" expectation
- Next steps explanation
- Contact phone numbers
- Warm professional tone
```

---

## 🎯 Vercel Dashboard Configuration

### 1. Environment Variables Location
```
Settings > Environment Variables
```

### 2. Add Variables in This Order

**Step 1: NODEMAILER_USER**
- Key: `NODEMAILER_USER`
- Value: `stylefairevents@gmail.com`
- Scope: ✅ Production ✅ Preview ✅ Development
- Click "Save"

**Step 2: NODEMAILER_PASS**
- Key: `NODEMAILER_PASS`
- Value: `[your 16-char app password]`
- Scope: ✅ Production ⚠️ ONLY (no Preview, no Development)
- Click "Save"

**Step 3: ALLOWED_ORIGINS**
- Key: `ALLOWED_ORIGINS`
- Value: `https://stylefairevents.com,https://www.stylefairevents.com`
- Scope: ✅ Production ✅ Preview ✅ Development
- Click "Save"

**Step 4: NODE_ENV**
- Key: `NODE_ENV`
- Value: `production`
- Scope: ✅ Production (Optional for others)
- Click "Save"

### 3. Redeploy After Changes
```bash
vercel --prod
```

---

## 🧪 Testing the Deployment

### Test with cURL
```bash
# Test form submission
curl -X POST https://stylefairevents.com/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@example.com",
    "phone": "+254799799345",
    "service": "Wedding Decor",
    "message": "This is a test inquiry from production deployment"
  }'

# Expected response:
# {"success":true,"message":"Inquiry submitted successfully! We will contact you shortly."}
```

### Test via Web Form
1. Go to https://stylefairevents.com/contact
2. Fill out the form with test data
3. Submit form
4. You should see success message
5. Check email inbox within 5-10 seconds
6. Verify both admin and confirmation emails received

---

## 🚨 Troubleshooting

### Form Submission Fails (500 Error)

**Checklist:**
1. Review Vercel logs: `vercel logs --follow`
2. Verify all 4 environment variables are set
3. Check NODEMAILER_USER spelling: `stylefairevents@gmail.com`
4. Verify NODEMAILER_PASS: Should be 16 chars (with spaces)
5. Test Gmail app password: Is 2FA enabled?

**Solution:**
- Go to myaccount.google.com/apppasswords
- Regenerate app password
- Update in Vercel dashboard
- Redeploy: `vercel --prod`

### Email Not Sending

**Checklist:**
1. Verify form submission succeeds (green message)
2. Wait 5-10 seconds (Gmail SMTP can be slow)
3. Check spam folder
4. Check NODEMAILER_PASS is app password, not Gmail password
5. Verify recipient email is correct

**Solution:**
- Regenerate Gmail app password
- Test locally first: `npm run dev`
- Update Vercel environment variables
- Redeploy: `vercel --prod`
- Try again with test form

### Rate Limiting (429 Error)

**Checklist:**
1. Have you submitted >50 requests in 1 hour?
2. Are multiple IPs testing?
3. Is rate limiter too strict?

**Solution:**
- Wait 1 hour for limit to reset
- Or increase RATE_LIMIT_MAX_REQUESTS in environment
- Or implement Redis for distributed rate limiting

### CORS Error in Browser

**Checklist:**
1. Is your domain in ALLOWED_ORIGINS?
2. Did you redeploy: `vercel --prod`?
3. Is domain exactly correct (www vs non-www)?

**Solution:**
```bash
# Update ALLOWED_ORIGINS
# Add your exact domain(s):
https://stylefairevents.com,https://www.stylefairevents.com

# Redeploy
vercel --prod

# Wait 30 seconds for Vercel to rebuild
```

---

## 📊 Monitoring & Logs

### View Vercel Logs
```bash
# Real-time logs
vercel logs --follow

# Specific service
vercel logs --follow api/inquiry

# Last N lines
vercel logs | tail -50
```

### Log Example
```
[2026-03-15T14:30:00.000Z] Inquiry submitted - Name: John Doe, Service: Wedding Decor, IP: 192.168.1.1
[2026-03-15T14:31:00.000Z] Inquiry API Error - IP: 192.168.1.2 - Error: ECONNREFUSED
```

### Monitoring Dashboard
1. Vercel Dashboard → Project → Analytics
2. Monitor:
   - Response times
   - Error rates
   - Request counts
   - Function invocations

---

## 🔄 Updating After Deployment

### Update Frontend
```bash
# Make changes to frontend files
# Commit and push
git add .
git commit -m "Update homepage hero"
git push origin main

# Auto-deploys on Vercel (if connected)
# Or manually: vercel --prod
```

### Update Email Templates
1. Edit `backend/api/inquiry.js`
2. Modify `buildEmailTemplate()` or `buildConfirmationTemplate()`
3. Commit and push
4. Vercel auto-redeploys

### Update Environment Variables
1. Go to Vercel Dashboard
2. Settings > Environment Variables
3. Update the variable value
4. Redeploy: `vercel --prod`

---

## 📱 Mobile Testing Checklist

### iPhone (Safari)
- [ ] Form accessible and submits
- [ ] Hamburger menu works
- [ ] Images load quickly
- [ ] No horizontal scroll
- [ ] WhatsApp button clickable
- [ ] Text readable at current zoom

### Android (Chrome)
- [ ] Touch responsiveness good
- [ ] Form keyboard doesn't hide submit button
- [ ] Buttons clickable (not too small/close)
- [ ] Social icons visible
- [ ] No layout shift

### Tablet (iPad)
- [ ] Grid layouts responsive
- [ ] Services cards aligned properly
- [ ] Gallery images display well
- [ ] Form fully visible
- [ ] No horizontal scroll

---

## ✅ Post-Deployment Handoff

**When everything works, you can:**
1. ✅ Announce website launch
2. ✅ Share stylefairevents.com link
3. ✅ Expect client inquiries
4. ✅ Monitor admin email for form submissions
5. ✅ Share link on Instagram/TikTok

**Regular maintenance:**
- Weekly: Check inquiry emails received
- Weekly: Review analytics
- Monthly: Update portfolio with new events
- Quarterly: Audit security and performance

---

## 🎉 Success!

Your Style Fair Events website is now **PRODUCTION READY** and deployed to the internet!

**Key Points:**
- ✅ SSL/HTTPS secured
- ✅ Forms working and sending emails
- ✅ Mobile responsive
- ✅ Rate limited against abuse
- ✅ Professional branding throughout
- ✅ WhatsApp integration active
- ✅ Social media links configured
- ✅ 28+ portfolio images displayed

**Next Steps:**
1. Share website URL widely
2. Add to Google Business Profile
3. Share on social media
4. Monitor form submissions
5. Track analytics and engagement
6. Collect client feedback
7. Continue portfolio updates

---

**Questions?** Refer to `BACKEND_PRODUCTION.md` for technical details.
**Last Updated:** March 15, 2026
**Status:** READY FOR PRODUCTION ✅
