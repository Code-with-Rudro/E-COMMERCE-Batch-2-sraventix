/**
 * checkout.js
 * Owner: Uday
 * Purpose: Render order summary on checkout page and validate + submit the form.
 */

// ── Populate Order Summary ────────────────────────────────────────────────────
function populateOrderSummary() {
  const cart = getCart();
  const listEl = document.getElementById("checkoutItemList");
  const emptyMsg = document.getElementById("checkoutEmptyMsg");
  const formSection = document.getElementById("checkoutFormSection");

  if (!listEl) return;

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = "block";
    if (formSection) formSection.style.display = "none";
    listEl.innerHTML = "";
    return;
  }

  if (emptyMsg) emptyMsg.style.display = "none";
  if (formSection) formSection.style.display = "block";

  listEl.innerHTML = cart
    .map(
      (item) => `
      <li class="checkout-item">
        <img src="${item.image}" alt="${item.name}" class="checkout-item-img"
             onerror="this.src='https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=80&q=80'"/>
        <div class="checkout-item-details">
          <span class="checkout-item-name">${item.name}</span>
          <span class="checkout-item-qty">Qty: ${item.quantity}</span>
        </div>
        <span class="checkout-item-price">${formatCurrency(item.price * item.quantity)}</span>
      </li>`
    )
    .join("");

  // Fill summary numbers (re-use cart.js helper)
  const { subtotal, shipping, tax, total } = calcCartTotals(cart);
  const fillEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  fillEl("chkSubtotal", formatCurrency(subtotal));
  fillEl("chkShipping", shipping === 0 ? "FREE" : formatCurrency(shipping));
  fillEl("chkTax", formatCurrency(tax));
  fillEl("chkTotal", formatCurrency(total));
}

// ── Validation Helpers ────────────────────────────────────────────────────────
const validators = {
  fullName: (v) => v.trim().length >= 3,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  phone: (v) => /^[6-9]\d{9}$/.test(v.trim()),
  address: (v) => v.trim().length >= 10,
  city: (v) => v.trim().length >= 2,
  pincode: (v) => /^\d{6}$/.test(v.trim()),
  state: (v) => v.trim() !== ""
};

const errorMessages = {
  fullName: "Enter your full name (min 3 characters).",
  email: "Enter a valid email address.",
  phone: "Enter a valid 10-digit Indian mobile number.",
  address: "Enter your full address (min 10 characters).",
  city: "Enter your city.",
  pincode: "Enter a valid 6-digit PIN code.",
  state: "Select your state."
};

/**
 * Show or hide a validation error under a field.
 * @param {string} fieldId
 * @param {boolean} isValid
 */
function setFieldValidity(fieldId, isValid) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (!field) return;

  if (isValid) {
    field.classList.remove("input-error");
    field.classList.add("input-ok");
    if (errorEl) errorEl.textContent = "";
  } else {
    field.classList.add("input-error");
    field.classList.remove("input-ok");
    if (errorEl) errorEl.textContent = errorMessages[fieldId] || "Invalid value.";
  }
}

/**
 * Validate the entire form.
 * @returns {boolean} true if all fields pass
 */
function validateForm() {
  let allValid = true;

  Object.keys(validators).forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    const valid = validators[id](field.value);
    setFieldValidity(id, valid);
    if (!valid) allValid = false;
  });

  // Payment method radio
  const paymentSelected = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );
  const paymentError = document.getElementById("paymentError");
  if (!paymentSelected) {
    if (paymentError) paymentError.textContent = "Please select a payment method.";
    allValid = false;
  } else {
    if (paymentError) paymentError.textContent = "";
  }

  return allValid;
}

// ── Live inline validation (on blur) ─────────────────────────────────────────
function attachLiveValidation() {
  Object.keys(validators).forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;

    field.addEventListener("blur", () => {
      setFieldValidity(id, validators[id](field.value));
    });

    field.addEventListener("input", () => {
      // Only show "ok" state while typing, not errors
      if (validators[id](field.value)) {
        setFieldValidity(id, true);
      }
    });
  });
}

// ── Order Placement ───────────────────────────────────────────────────────────
function placeOrder(e) {
  e.preventDefault();

  // Guard: cart must not be empty
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  if (!validateForm()) {
    showToast("Please fix the errors above.", "error");
    // Scroll to first error
    const firstError = document.querySelector(".input-error");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Collect form data
  const formData = {
    name: document.getElementById("fullName")?.value,
    email: document.getElementById("email")?.value,
    phone: document.getElementById("phone")?.value,
    address: document.getElementById("address")?.value,
    city: document.getElementById("city")?.value,
    pincode: document.getElementById("pincode")?.value,
    state: document.getElementById("state")?.value,
    payment: document.querySelector('input[name="paymentMethod"]:checked')?.value,
    total: localStorage.getItem("cartTotal"),
    orderId: "ORD" + Date.now(),
    items: cart
  };

  // Save order to LocalStorage (could be retrieved later)
  localStorage.setItem("lastOrder", JSON.stringify(formData));

  // Clear cart
  saveCart([]);
  updateCartBadge();

  // Show success overlay
  showSuccessOverlay(formData);
}

// ── Success Overlay ───────────────────────────────────────────────────────────
function showSuccessOverlay(order) {
  const overlay = document.getElementById("successOverlay");
  if (!overlay) return;

  document.getElementById("successOrderId").textContent = order.orderId;
  document.getElementById("successName").textContent = order.name;
  document.getElementById("successEmail").textContent = order.email;
  document.getElementById("successTotal").textContent = formatCurrency(order.total || 0);

  overlay.classList.add("visible");

  // Auto-redirect after 6 seconds
  let countdown = 6;
  const countEl = document.getElementById("redirectCountdown");
  const interval = setInterval(() => {
    countdown--;
    if (countEl) countEl.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(interval);
      window.location.href = "index.html";
    }
  }, 1000);
}

// ── Payment method toggle ─────────────────────────────────────────────────────
function initPaymentToggle() {
  const radios = document.querySelectorAll('input[name="paymentMethod"]');
  const upiSection = document.getElementById("upiSection");
  const cardSection = document.getElementById("cardSection");

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (upiSection) upiSection.style.display = "none";
      if (cardSection) cardSection.style.display = "none";

      if (radio.value === "upi" && upiSection) upiSection.style.display = "block";
      if (radio.value === "card" && cardSection) cardSection.style.display = "block";
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  populateOrderSummary();
  attachLiveValidation();
  initPaymentToggle();

  const form = document.getElementById("checkoutForm");
  if (form) form.addEventListener("submit", placeOrder);

  // Success overlay "Go Home" button
  const homeBtn = document.getElementById("goHomeBtn");
  if (homeBtn) homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
