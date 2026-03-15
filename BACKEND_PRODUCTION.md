# Backend Production Deployment Guide

## Overview

The Style Fair Events backend is a serverless Node.js API deployed on Vercel, handling form submissions and email notifications with production-grade security and reliability.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Ensure these are configured in Vercel dashboard (Settings > Environment Variables):

```
NODEMAILER_USER = stylefairevents@gmail.com
NODEMAILER_PASS = [your 16-char app password]
ALLOWED_ORIGINS = https://yourdomain.com
```

### 2. Gmail Setup
- [ ] 2FA enabled on Gmail account
- [ ] App Password generated (myaccount.google.com/apppasswords)
- [ ] Stored securely in Vercel environment variables
- [ ] NOT stored in .env files or version control

### 3. Domain Configuration
- [ ] Custom domain linked in Vercel
- [ ] SSL certificate auto-configured
- [ ] DNS records properly set

---

## 🚀 Deployment Steps

### Step 1: Prepare Local Environment
```bash
# Install dependencies
npm install

# Verify .env.local has test credentials (local only)
cat .env.local
```

### Step 2: Test Locally
```bash
# Start development server
npm run dev

# Test form submission:
curl -X POST http://localhost:3000/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+254799799345",
    "service": "Event Decor",
    "message": "This is a test inquiry message"
  }'
```

### Step 3: Deploy to Vercel
```bash
# Deploy to production
vercel --prod

# Or use the Vercel dashboard
# Connect GitHub > select repository > auto-deploy on push
```

### Step 4: Verify Deployment
```bash
# Test production endpoint
curl -X POST https://yourdomain.com/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prod Test",
    "email": "admin@stylefairevents.com",
    "phone": "+254799799345",
    "service": "Event Planning",
    "message": "Testing production deployment successfully"
  }'
```

---

## 🔒 Security Implementation

### Input Sanitization
- All text inputs are sanitized to remove XSS vectors
- HTML special characters (`<`, `>`) removed
- JavaScript protocol removed (`javascript:`)
- onerror attribute stripped
- Maximum 500 characters per field

### Rate Limiting
- **Limit:** 50 requests per IP per hour
- **Window:** 1 hour sliding window
- **Response:** 429 Too Many Requests
- **Note:** In-memory storage; consider Redis for multi-server

### Request Validation
- **Size Limit:** 50KB max payload
- **Method:** POST only (405 Method Not Allowed)
- **Headers:** Content-Type validation
- **Body:** Type checking on all fields

### CORS Headers
```
Access-Control-Allow-Origin: yourdomain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Email Configuration
- **Transporter:** Gmail SMTP with connection pooling
- **Max connections:** 5
- **Rate limit:** 14 emails per 4 seconds
- **Timeout:** 10 seconds per email
- **Total timeout:** 15 seconds (with buffer)

---

## 📧 Email Troubleshooting

### Error: "Invalid login: invalid username and password"
**Solution:** 
- Gmail account password ≠ App Password
- Generate app password at myaccount.google.com/apppasswords
- Select "Mail" and "Windows Computer"
- Copy 16-character password
- Update NODEMAILER_PASS in Vercel

### Error: "Timeout or connection refused"
**Solution:**
- Check Internet connection
- Verify Gmail SMTP server is accessible
- Check firewall rules
- Enable "Less secure app access" (if not using app password)

### Emails sent but not received
**Solution:**
- Check spam folder
- Verify recipient email address
- Check email credentials in vercel.json
- Enable "Less secure apps" in Gmail security settings

### Rate limiter too aggressive
**Solution:**
- Adjust MAX_REQUESTS_PER_HOUR (currently 50)
- Consider implementing Redis for distributed rate limiting
- Monitor Vercel logs for false positives

---

## 📊 Monitoring & Logging

### Vercel Logs
```bash
# View real-time logs
vercel logs --follow

# View specific deployment logs
vercel logs [deployment-id]
```

### Log Format
```
[2026-03-15T10:30:00.000Z] Inquiry submitted - Name: John Doe, Service: Wedding Decor, IP: 192.168.1.1
[2026-03-15T10:31:00.000Z] Inquiry API Error - IP: 192.168.1.2 - Error: ECONNREFUSED
```

### Monitoring Alerts
Set up alerts for:
- ❌ API errors (5xx responses)
- ⚠️ Rate limit hits
- 📧 Email delivery failures
- ⏱️ Slow response times (>5s)

---

## 🔧 Performance Optimization

### Current Implementation
- ✅ Parallel email sending (Promise.all)
- ✅ Connection pooling (5 max connections)
- ✅ Rate limiting (prevent abuse)
- ✅ Timeout handling (10-15 seconds)
- ✅ In-memory operations (no database)

### Future Improvements
- Consider Redis for distributed rate limiting
- Implement request queuing for high load
- Add database for inquiry archival
- Set up webhook notifications instead of email
- Implement async email jobs

---

## 📈 Scaling Considerations

### Current Limits
- **Vercel timeout:** 30 seconds (API functions)
- **Request size:** 50KB
- **Rate limit:** 50/hour per IP
- **Concurrent emails:** 5 (Nodemailer pool)

### When to Scale
- **High traffic:** Implement Redis rate limiting
- **Many emails:** Use email queue service (Bull, RabbitMQ)
- **Data persistence:** Migrate to database (PostgreSQL, MongoDB)
- **Webhooks:** Integrate with third-party services

---

## 🚨 Incident Response

### Form Submissions Failing
1. Check Vercel logs: `vercel logs --follow`
2. Verify environment variables are set
3. Test Gmail credentials: telnet smtp.gmail.com 587
4. Check network connectivity
5. Review recent code changes

### Rate Limiting Too Strict
1. Check logs for repeat IPs
2. Increase MAX_REQUESTS_PER_HOUR if legitimate traffic
3. Consider whitelisting known IPs
4. Implement more sophisticated rate limiter

### Email Not Sending
1. Verify NODEMAILER_PASS is app-specific password (not Gmail password)
2. Check Gmail account 2FA is enabled
3. Re-generate app password if >6 months old
4. Test SMTP credentials locally first
5. Check firewall rules on Gmail

---

## 📝 Maintenance Tasks

### Weekly
- [ ] Review Vercel logs for errors
- [ ] Check rate limit hits
- [ ] Monitor email delivery

### Monthly
- [ ] Regenerate Gmail app password if required
- [ ] Review and update dependencies: `npm outdated`
- [ ] Audit security headers
- [ ] Check for abandoned inquiries

### Quarterly
- [ ] Update Node.js runtime version
- [ ] Review and optimize email templates
- [ ] Analyze traffic patterns
- [ ] Test fallback email service

---

## 🔐 Security Updates

### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest (may be breaking)
npm install nodemailer@latest

# Audit for vulnerabilities
npm audit
npm audit fix
```

### Code Review
- Review input sanitization regularly
- Test XSS vectors: `<img onerror="alert(1)">`
- Test SQL injection (if database added)
- Verify CORS headers on all origins
- Test rate limiter effectiveness

---

## 📞 Support & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| 429 Too Many Requests | Wait 1 hour or increase rate limit |
| 400 Invalid email | Verify email format (test@example.com) |
| 500 Internal Server Error | Check Vercel logs, verify credentials |
| Email timeout | Check Gmail/SMTP connectivity |
| CORS error | Verify ALLOWED_ORIGINS set correctly |

### Getting Help
1. Check Vercel docs: vercel.com/docs
2. Review Nodemailer docs: nodemailer.com
3. Check Gmail troubleshooting: support.google.com
4. Review backend code: backend/api/inquiry.js

---

## ✅ Production Readiness Certification

Backend API is **PRODUCTION READY** with:

- ✅ Rate limiting (50/hour per IP)
- ✅ Input sanitization & validation
- ✅ Security headers configured
- ✅ Error handling without info leaks
- ✅ Email timeout protection
- ✅ CORS configured
- ✅ Logging for debugging
- ✅ Environment variables secured
- ✅ Type checking on inputs
- ✅ Graceful error responses

**Last Updated:** March 15, 2026
**Version:** 1.0.0
**Status:** Production Deployment Ready ✅
