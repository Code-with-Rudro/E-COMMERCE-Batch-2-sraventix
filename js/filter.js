/**
 * filter.js
 * Owner: Pramod
 * Purpose: Category filter, price-range filter, and sort dropdown.
 *          Works together with search.js – every change triggers applySearch().
 */

// Shared filter state
window.activeCategory = "all";
window.activePriceMax = Infinity;
window.activeSortBy = "default";

// ── Core filter function ──────────────────────────────────────────────────────
/**
 * Apply category, price, and sort to a product list.
 * Called by search.js before its own text filter step.
 * @param {Array} list  Source array (defaults to all products)
 * @returns {Array}
 */
function applyFilters(list = [...products]) {
  // 1. Category
  if (window.activeCategory && window.activeCategory !== "all") {
    list = list.filter(
      (p) => p.category === window.activeCategory
    );
  }

  // 2. Price
  if (isFinite(window.activePriceMax)) {
    list = list.filter((p) => p.price <= window.activePriceMax);
  }

  // 3. Sort
  switch (window.activeSortBy) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "discount":
      list = [...list].sort(
        (a, b) =>
          calcDiscount(b.originalPrice || b.price, b.price) -
          calcDiscount(a.originalPrice || a.price, a.price)
      );
      break;
    default:
      break; // "default" keeps insertion order
  }

  return list;
}

// ── Reset all filters ─────────────────────────────────────────────────────────
function resetAll() {
  window.activeCategory = "all";
  window.activePriceMax = Infinity;
  window.activeSortBy = "default";
  window.currentSearch = "";

  // Reset UI elements
  document.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.cat === "all");
  });
  const priceRange = document.getElementById("priceRange");
  if (priceRange) {
    priceRange.value = priceRange.max;
    updatePriceLabel(priceRange.max);
  }
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "default";
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = "";
    searchInput.classList.remove("has-value");
  }
  const clearBtn = document.getElementById("clearSearch");
  if (clearBtn) clearBtn.style.display = "none";

  renderProducts(products);
}

// ── Price label helper ────────────────────────────────────────────────────────
function updatePriceLabel(value) {
  const label = document.getElementById("priceLabel");
  if (label) {
    label.textContent =
      Number(value) >= 100000
        ? "Any price"
        : `Up to ${formatCurrency(value)}`;
  }
}

// ── Wiring ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── Category chips ──────────────────────────────────────────────────────────
  const filterChips = document.getElementById("filterChips");
  if (filterChips) {
    // Build category list from product data (dynamic)
    const categories = ["all", ...new Set(products.map((p) => p.category))];
    filterChips.innerHTML = categories
      .map(
        (cat) =>
          `<button
            class="filter-chip${cat === "all" ? " active" : ""}"
            data-cat="${cat}"
            aria-pressed="${cat === "all"}"
          >${cat === "all" ? "All" : cat}</button>`
      )
      .join("");

    filterChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      document.querySelectorAll(".filter-chip").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");

      window.activeCategory = chip.dataset.cat;
      applySearch();
    });
  }

  // ── Price range slider ──────────────────────────────────────────────────────
  const priceRange = document.getElementById("priceRange");
  if (priceRange) {
    const maxPrice = Math.max(...products.map((p) => p.price));
    priceRange.max = Math.ceil(maxPrice / 1000) * 1000; // round up to nearest 1k
    priceRange.value = priceRange.max;
    updatePriceLabel(priceRange.value);

    priceRange.addEventListener("input", () => {
      window.activePriceMax =
        Number(priceRange.value) >= Number(priceRange.max)
          ? Infinity
          : Number(priceRange.value);
      updatePriceLabel(priceRange.value);
      applySearch();
    });
  }

  // ── Sort dropdown ───────────────────────────────────────────────────────────
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      window.activeSortBy = sortSelect.value;
      applySearch();
    });
  }

  // ── Mobile filter toggle ────────────────────────────────────────────────────
  const toggleBtn = document.getElementById("filterToggleBtn");
  const filterPanel = document.getElementById("filterPanel");
  if (toggleBtn && filterPanel) {
    toggleBtn.addEventListener("click", () => {
      filterPanel.classList.toggle("open");
      toggleBtn.textContent = filterPanel.classList.contains("open")
        ? "✕ Hide Filters"
        : "⚙ Filters";
    });
  }
});
