/**
 * display.js
 * Owner: Kiran
 * Purpose: Render product cards into the grid. Consumed by search.js and filter.js.
 */

/**
 * Build the HTML markup for a single product card.
 * @param {Object} product
 * @returns {string} HTML string
 */
function buildProductCard(product) {
  const discount = product.originalPrice
    ? calcDiscount(product.originalPrice, product.price)
    : 0;

  const badgeHTML = product.badge
    ? `<span class="card-badge badge-${product.badge.toLowerCase().replace(/\s/g, "-")}">${product.badge}</span>`
    : "";

  const discountHTML = discount > 0
    ? `<span class="discount-tag">-${discount}%</span>`
    : "";

  return `
    <article class="product-card" data-id="${product.id}" role="listitem">
      ${badgeHTML}
      <div class="card-image-wrap">
        <img
          src="${product.image}"
          alt="${product.name}"
          class="card-image"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80'"
        />
        <button
          class="wishlist-btn"
          aria-label="Add to wishlist"
          onclick="toggleWishlist(${product.id}, this)"
        >♡</button>
      </div>

      <div class="card-body">
        <span class="card-category">${product.category}</span>
        <h3 class="card-name">${product.name}</h3>
        <p class="card-desc">${product.description}</p>

        <div class="card-rating">
          ${generateStars(product.rating)}
          <span class="rating-num">${product.rating}</span>
          <span class="rating-count">(${product.reviews.toLocaleString()})</span>
        </div>

        <div class="card-pricing">
          <span class="card-price">${formatCurrency(product.price)}</span>
          ${product.originalPrice
            ? `<span class="card-original">${formatCurrency(product.originalPrice)}</span>`
            : ""}
          ${discountHTML}
        </div>

        <button
          class="btn-add-cart"
          onclick="addToCart(${product.id})"
          aria-label="Add ${product.name} to cart"
        >
          <span class="cart-icon-btn">🛒</span> Add to Cart
        </button>
      </div>
    </article>
  `;
}

/**
 * Render an array of products into #productGrid.
 * Shows a no-results message when the array is empty.
 * @param {Array} list  Filtered/sorted product array
 */
function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  const countEl = document.getElementById("productCount");
  if (!grid) return;

  // Update count label
  if (countEl) {
    countEl.textContent = `${list.length} product${list.length !== 1 ? "s" : ""} found`;
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filters.</p>
        <button class="btn-outline" onclick="resetAll()">Clear Filters</button>
      </div>
    `;
    return;
  }

  // Build all cards, then inject once (single reflow)
  grid.innerHTML = list.map(buildProductCard).join("");

  // Animate cards in with stagger
  const cards = grid.querySelectorAll(".product-card");
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 40}ms`;
    card.classList.add("card-enter");
  });
}

// ── Wishlist (UI only, no backend) ────────────────────────────────────────────
const wishlistSet = new Set(
  JSON.parse(localStorage.getItem("wishlist") || "[]")
);

function toggleWishlist(id, btn) {
  if (wishlistSet.has(id)) {
    wishlistSet.delete(id);
    btn.innerHTML = "♡";
    btn.classList.remove("wishlisted");
    showToast("Removed from wishlist", "info");
  } else {
    wishlistSet.add(id);
    btn.innerHTML = "♥";
    btn.classList.add("wishlisted");
    showToast("Added to wishlist ♥", "success");
  }
  localStorage.setItem("wishlist", JSON.stringify([...wishlistSet]));
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
/**
 * Show skeleton placeholder cards while data loads.
 * @param {number} count  How many skeletons to show
 */
function showSkeletons(count = 8) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = Array(count)
    .fill(0)
    .map(
      () => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-line short"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line medium"></div>
          <div class="skeleton skeleton-line short"></div>
        </div>
      </div>`
    )
    .join("");
}

// ── Initialise page ───────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  showSkeletons(8);

  // Small delay so skeletons are visible for a moment
  setTimeout(() => {
    renderProducts(products);
    // Mark wishlisted items
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      const id = Number(btn.closest(".product-card").dataset.id);
      if (wishlistSet.has(id)) {
        btn.innerHTML = "♥";
        btn.classList.add("wishlisted");
      }
    });
  }, 600);
});
