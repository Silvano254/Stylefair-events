// ============================================
// STYLE FAIR EVENTS - MAIN JS
// AOS Integration & Form Handling
// ============================================

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
  // Load theme config
  loadThemeConfig();
  
  // Initialize AOS
  initializeAOS();
  
  // Setup form handlers
  setupFormHandlers();
  
  // Setup navigation
  setupNavigation();
  
  // Setup hamburger menu
  setupHamburgerMenu();
  
  // Setup WhatsApp button
  setupWhatsAppButton();
});

// ============================================
// LOAD THEME CONFIGURATION
// ============================================
async function loadThemeConfig() {
  try {
    const response = await fetch('/config/theme.json');
    const config = await response.json();
    window.themeConfig = config;
  } catch (error) {
    console.error('Error loading theme config:', error);
  }
}

// ============================================
// INITIALIZE AOS
// ============================================
function initializeAOS() {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/aos@next/dist/aos.js';
  script.onload = function() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out-quad',
      once: true,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  };
  document.head.appendChild(script);
  
  // Load AOS CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/aos@next/dist/aos.css';
  document.head.appendChild(link);
}

// ============================================
// FORM HANDLING & API SUBMISSION
// ============================================
function setupFormHandlers() {
  const inquiryForm = document.getElementById('inquiryForm');
  if (!inquiryForm) return;
  
  inquiryForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim()
    };
    
    // Basic validation
    if (!validateForm(formData)) {
      showMessage('error', 'Please fill all required fields correctly.');
      return;
    }
    
    // Show loading state
    const submitBtn = inquiryForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showMessage('success', 'Thank you! We\'ll contact you shortly.');
        inquiryForm.reset();
      } else {
        showMessage('error', result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage('error', 'Network error. Please check your connection.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// ============================================
// FORM VALIDATION
// ============================================
function validateForm(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  
  return (
    data.name && data.name.length >= 2 &&
    data.email && emailRegex.test(data.email) &&
    data.phone && phoneRegex.test(data.phone) &&
    data.service && data.service !== '' &&
    data.message && data.message.length >= 10
  );
}

// ============================================
// SHOW FORM MESSAGE
// ============================================
function showMessage(type, text) {
  const messageEl = document.getElementById('formMessage');
  if (!messageEl) return;
  
  messageEl.className = `form-message ${type} show`;
  messageEl.textContent = text;
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageEl.classList.remove('show');
    }, 5000);
  }
}

// ============================================
// NAVIGATION SETUP
// ============================================
function setupNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Set active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ============================================
// HAMBURGER MENU SETUP
// ============================================
function setupHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (!hamburger || !navMenu) return;
  
  // Toggle menu on hamburger click
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('nav')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// ============================================
// WHATSAPP BUTTON SETUP
// ============================================
function setupWhatsAppButton() {
  const config = window.themeConfig;
  if (!config) return;
  
  const whatsappNumber = config.contact.whatsapp.replace(/\D/g, '');
  const waButton = document.querySelector('.whatsapp-button');
  
  if (waButton) {
    waButton.href = `https://wa.me/${whatsappNumber}?text=Hi%20Style%20Fair%20Events,%20I%20have%20an%20inquiry.`;
    waButton.target = '_blank';
    waButton.rel = 'noopener noreferrer';
  }
}

// ============================================
// SCROLL ANIMATIONS REFRESH
// ============================================
window.addEventListener('load', function() {
  if (window.AOS) {
    AOS.refresh();
  }
});

// ============================================
// UTILITY: Smooth Scroll Handler
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================
// CONSOLE LOG - BRAND MESSAGE
// ============================================
console.log('%c✨ Style Fair Events & Decor Hub ✨', 'color: #D4AF37; font-size: 16px; font-weight: bold;');
console.log('%cElegance Redefined', 'color: #2D5016; font-size: 12px;');
