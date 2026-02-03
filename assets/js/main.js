// ========================================
// Byewait Landing Page - Premium Animations
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDemoAnimation();
  initScrollAnimations();
  initPricingToggle();
  initCounterAnimations();
});

// ========================================
// Navigation
// ========================================

function initNavigation() {
  const nav = document.getElementById("nav");

  // Scroll behavior
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ========================================
// Demo Animation (Phone Number)
// ========================================

function initDemoAnimation() {
  const demoNumber = document.getElementById("demo-number");
  if (!demoNumber) return;

  let number = 42;

  setInterval(() => {
    number = number >= 50 ? 42 : number + 1;
    demoNumber.textContent = number;
    demoNumber.style.animation = "none";
    demoNumber.offsetHeight; // Trigger reflow
    demoNumber.style.animation = "numberPop 0.3s ease-out";
  }, 3000);
}

// ========================================
// Scroll Animations
// ========================================

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for grid items
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add("animate-in");
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation
  const animatedElements = document.querySelectorAll(
    ".bento-card, .timeline__step, .pricing-card, .use-case, .stats-card, .testimonial-card, .section-header",
  );

  animatedElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    el.dataset.delay = (index % 6) * 100; // Stagger in groups
    observer.observe(el);
  });
}

// ========================================
// Pricing Toggle
// ========================================

function initPricingToggle() {
  const toggle = document.getElementById("pricing-toggle");
  if (!toggle) return;

  const monthlyLabel = document.querySelector('[data-period="monthly"]');
  const yearlyLabel = document.querySelector('[data-period="yearly"]');
  const priceElements = document.querySelectorAll("[data-monthly]");

  let isYearly = false;

  toggle.addEventListener("click", () => {
    isYearly = !isYearly;
    toggle.classList.toggle("active", isYearly);

    // Update labels
    monthlyLabel.classList.toggle("pricing__toggle-label--active", !isYearly);
    yearlyLabel.classList.toggle("pricing__toggle-label--active", isYearly);

    // Update prices with animation
    priceElements.forEach((el) => {
      const monthly = el.dataset.monthly;
      const yearly = el.dataset.yearly;

      el.style.transform = "scale(0.8)";
      el.style.opacity = "0";

      setTimeout(() => {
        el.textContent = isYearly ? `${yearly}€` : `${monthly}€`;
        el.style.transform = "scale(1)";
        el.style.opacity = "1";
      }, 150);
    });
  });
}

// ========================================
// Counter Animations
// ========================================

function initCounterAnimations() {
  const counters = document.querySelectorAll("[data-count]");

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count, 10);
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// ========================================
// Utility: Debounce
// ========================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
