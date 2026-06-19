/**
 * search.js
 * Owner: Pramod
 * Purpose: Live search across product name, category, and description.
 */

// Current search query (shared with filter.js via window)
window.currentSearch = "";

/**
 * Filter products by the current search term and re-render.
 * Called both directly and from filter.js when filters change.
 */
function applySearch() {
  const query = window.currentSearch.toLowerCase().trim();
  let results = [...products];

  // Apply category / price / sort filters first (from filter.js)
  if (typeof applyFilters === "function") {
    results = applyFilters(results);
  }

  // Then filter by search term
  if (query) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  renderProducts(results);
}

// ── Search Input Wiring ───────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");

  if (!searchInput) return;

  // Debounce so we don't re-render on every keystroke
  const debouncedSearch = debounce(() => {
    window.currentSearch = searchInput.value;
    applySearch();
    // Show / hide clear button
    if (clearBtn) {
      clearBtn.style.display = searchInput.value ? "flex" : "none";
    }
    // Highlight search input
    searchInput.classList.toggle("has-value", !!searchInput.value);
  }, 280);

  searchInput.addEventListener("input", debouncedSearch);

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      window.currentSearch = "";
      clearBtn.style.display = "none";
      searchInput.classList.remove("has-value");
      searchInput.focus();
      applySearch();
    });
  }

  // Submit via Enter
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      window.currentSearch = searchInput.value;
      applySearch();
    }
    // Clear on Escape
    if (e.key === "Escape") {
      searchInput.value = "";
      window.currentSearch = "";
      if (clearBtn) clearBtn.style.display = "none";
      searchInput.classList.remove("has-value");
      applySearch();
    }
  });
});
