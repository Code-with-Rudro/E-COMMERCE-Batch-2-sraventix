/**
 * utils.js
 * Owner: Rudro (TL)
 * Purpose: Shared helper functions used across all pages.
 */

// ── Currency Formatting ───────────────────────────────────────────────────────
/**
 * Format a number as Indian Rupee currency string.
 * @param {number} amount
 * @returns {string}  e.g. "₹27,999"
 */
function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// ── Star Rating HTML ──────────────────────────────────────────────────────────
/**
 * Generate filled / half / empty star HTML for a rating out of 5.
 * @param {number} rating  e.g. 4.5
 * @returns {string} HTML string
 */
function generateStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars += '<i class="star filled">★</i>';
    } else if (rating >= i - 0.5) {
      stars += '<i class="star half">★</i>';
    } else {
      stars += '<i class="star empty">☆</i>';
    }
  }
  return stars;
}

// ── Cart Badge Count ──────────────────────────────────────────────────────────
/**
 * Update the cart icon badge across all pages.
 */
function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll(".cart-badge");
  badges.forEach((badge) => {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? "flex" : "none";
  });
}

// ── LocalStorage: Cart ────────────────────────────────────────────────────────
/**
 * Read cart from LocalStorage.
 * @returns {Array}
 */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

/**
 * Save cart array to LocalStorage.
 * @param {Array} cart
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ── Toast Notification ────────────────────────────────────────────────────────
/**
 * Show a brief toast notification at the bottom of the screen.
 * @param {string} message
 * @param {"success"|"error"|"info"} type
 */
function showToast(message, type = "success") {
  // Remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => toast.classList.add("toast-visible"));

  // Auto-remove after 3s
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ── Discount % ───────────────────────────────────────────────────────────────
/**
 * Calculate discount percentage.
 * @param {number} original
 * @param {number} current
 * @returns {number}
 */
function calcDiscount(original, current) {
  return Math.round(((original - current) / original) * 100);
}

// ── Debounce ─────────────────────────────────────────────────────────────────
/**
 * Delay a function call until after `delay` ms of inactivity.
 * @param {Function} fn
 * @param {number} delay  milliseconds
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── Scroll to Top ─────────────────────────────────────────────────────────────
/**
 * Smoothly scroll the page back to the top.
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Init on every page load ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  // Scroll-to-top button wiring
  const btn = document.getElementById("scrollTopBtn");
  if (btn) {
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    });
    btn.addEventListener("click", scrollToTop);
  }
});
