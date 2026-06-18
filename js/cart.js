/**
 * cart.js
 * Owner: Sathwik
 * Purpose: Add-to-cart, quantity management, removal, and cart page rendering.
 *          Works on BOTH index.html (add) and cart.html (full management).
 */

// ── Add to Cart ───────────────────────────────────────────────────────────────
/**
 * Add a product to the cart (or increment its quantity if already present).
 * @param {number} productId
 */
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
    showToast(`${product.name} quantity updated`, "success");
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });
    showToast(`${product.name} added to cart 🛒`, "success");
  }

  saveCart(cart);
  updateCartBadge();

  // Button animation feedback
  const btn = event?.currentTarget;
  if (btn) {
    btn.textContent = "✓ Added!";
    btn.classList.add("added");
    setTimeout(() => {
      btn.innerHTML = '<span class="cart-icon-btn">🛒</span> Add to Cart';
      btn.classList.remove("added");
    }, 1200);
  }
}

// ── Remove from Cart ──────────────────────────────────────────────────────────
/**
 * Remove a product entirely from the cart.
 * @param {number} productId
 */
function removeFromCart(productId) {
  let cart = getCart();
  const item = cart.find((i) => i.id === productId);
  cart = cart.filter((i) => i.id !== productId);
  saveCart(cart);
  updateCartBadge();
  if (item) showToast(`${item.name} removed from cart`, "info");
  renderCartPage();
}

// ── Update Quantity ───────────────────────────────────────────────────────────
/**
 * Change the quantity of a cart item by delta (+1 or -1).
 * Removes the item if quantity would drop to 0.
 * @param {number} productId
 * @param {number} delta  +1 or -1
 */
function updateQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart(cart);
  updateCartBadge();
  renderCartPage(); // re-render to update totals
}

// ── Clear Cart ────────────────────────────────────────────────────────────────
function clearCart() {
  saveCart([]);
  updateCartBadge();
  renderCartPage();
  showToast("Cart cleared", "info");
}

// ── Cart Summary Calculations ─────────────────────────────────────────────────
/**
 * Calculate subtotal, discount, shipping and grand total.
 * @param {Array} cart
 * @returns {Object}
 */
function calcCartTotals(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal === 0 ? 0 : subtotal >= 1000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.03); // 3% GST estimate
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

// ── Render Cart Page ──────────────────────────────────────────────────────────
/**
 * Full re-render of cart.html content.
 * Only runs when #cartItemsContainer exists.
 */
function renderCartPage() {
  const container = document.getElementById("cartItemsContainer");
  if (!container) return;

  const cart = getCart();

  // Empty state
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet. Start shopping!</p>
        <a href="index.html" class="btn-primary">Continue Shopping</a>
      </div>
    `;
    // Hide summary panel
    const summary = document.getElementById("cartSummaryPanel");
    if (summary) summary.style.display = "none";
    const clearBtn = document.getElementById("clearCartBtn");
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  // Show summary + clear button
  const summary = document.getElementById("cartSummaryPanel");
  if (summary) summary.style.display = "block";
  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) clearBtn.style.display = "inline-flex";

  // Cart items
  container.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img-wrap">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img"
               onerror="this.src='https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&q=80'"/>
        </div>

        <div class="cart-item-info">
          <span class="cart-item-cat">${item.category}</span>
          <h3 class="cart-item-name">${item.name}</h3>
          <span class="cart-item-price">${formatCurrency(item.price)} each</span>
        </div>

        <div class="cart-item-controls">
          <div class="qty-control">
            <button
              class="qty-btn"
              onclick="updateQuantity(${item.id}, -1)"
              aria-label="Decrease quantity"
            >−</button>
            <span class="qty-value">${item.quantity}</span>
            <button
              class="qty-btn"
              onclick="updateQuantity(${item.id}, 1)"
              aria-label="Increase quantity"
            >+</button>
          </div>

          <span class="cart-item-subtotal">
            ${formatCurrency(item.price * item.quantity)}
          </span>

          <button
            class="remove-btn"
            onclick="removeFromCart(${item.id})"
            aria-label="Remove ${item.name}"
            title="Remove item"
          >🗑</button>
        </div>
      </div>
    `
    )
    .join("");

  // Summary panel
  const { subtotal, shipping, tax, total } = calcCartTotals(cart);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const fillEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  fillEl("summaryItems", `${totalItems} item${totalItems !== 1 ? "s" : ""}`);
  fillEl("summarySubtotal", formatCurrency(subtotal));
  fillEl(
    "summaryShipping",
    shipping === 0 ? "FREE" : formatCurrency(shipping)
  );
  fillEl("summaryTax", formatCurrency(tax));
  fillEl("summaryTotal", formatCurrency(total));

  // Store total for checkout page
  localStorage.setItem("cartTotal", total);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
});
