/**
 * products.js
 * Owner: Rudro (TL)
 * Purpose: Central product data source for the store.
 * All images use Unsplash URLs so no local assets are needed.
 */

const products = [
  // ── Electronics ──────────────────────────────────────────────────────────
  {
    id: 1,
    name: "ProBook Ultra Laptop",
    category: "Electronics",
    price: 54999,
    originalPrice: 64999,
    rating: 4.5,
    reviews: 312,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
    description: "14\" FHD IPS, Intel Core i7, 16GB RAM, 512GB SSD"
  },
  {
    id: 2,
    name: "NovaSpark Smartphone",
    category: "Electronics",
    price: 27999,
    originalPrice: 32999,
    rating: 4.8,
    reviews: 876,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    description: "6.7\" AMOLED, 108MP camera, 5000mAh battery"
  },
  {
    id: 3,
    name: "SoundPulse Wireless Earbuds",
    category: "Electronics",
    price: 3499,
    originalPrice: 4999,
    rating: 4.3,
    reviews: 541,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description: "Active noise cancellation, 30hr battery, IPX5"
  },
  {
    id: 4,
    name: "VisionCurve Monitor 27\"",
    category: "Electronics",
    price: 18999,
    originalPrice: 22999,
    rating: 4.6,
    reviews: 198,
    badge: null,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
    description: "QHD 165Hz IPS, 1ms response, USB-C hub"
  },
  {
    id: 5,
    name: "MechEdge Gaming Keyboard",
    category: "Electronics",
    price: 4299,
    originalPrice: 5499,
    rating: 4.4,
    reviews: 267,
    badge: null,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
    description: "TKL mechanical, RGB backlit, blue switches"
  },

  // ── Fashion ───────────────────────────────────────────────────────────────
  {
    id: 6,
    name: "AirStride Running Shoes",
    category: "Fashion",
    price: 3299,
    originalPrice: 4499,
    rating: 4.2,
    reviews: 423,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description: "Lightweight mesh upper, responsive foam sole"
  },
  {
    id: 7,
    name: "Urban Slim Fit Jacket",
    category: "Fashion",
    price: 2499,
    originalPrice: 3499,
    rating: 4.5,
    reviews: 189,
    badge: "New",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    description: "Water-resistant, 4 pockets, unisex fit"
  },
  {
    id: 8,
    name: "Canvas Tote Bag",
    category: "Fashion",
    price: 799,
    originalPrice: 1199,
    rating: 4.1,
    reviews: 312,
    badge: null,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    description: "100% organic cotton, 15L capacity, zip closure"
  },

  // ── Home & Kitchen ────────────────────────────────────────────────────────
  {
    id: 9,
    name: "BrewMaster Coffee Machine",
    category: "Home & Kitchen",
    price: 6499,
    originalPrice: 8999,
    rating: 4.7,
    reviews: 634,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    description: "15-bar espresso, built-in grinder, milk frother"
  },
  {
    id: 10,
    name: "AirFry Pro 6L",
    category: "Home & Kitchen",
    price: 4299,
    originalPrice: 5999,
    rating: 4.6,
    reviews: 892,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
    description: "Digital display, 8 presets, 360° rapid air"
  },
  {
    id: 11,
    name: "Nordic Ceramic Bowl Set",
    category: "Home & Kitchen",
    price: 1299,
    originalPrice: 1799,
    rating: 4.3,
    reviews: 156,
    badge: "New",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80",
    description: "Set of 4, microwave & dishwasher safe"
  },

  // ── Books ─────────────────────────────────────────────────────────────────
  {
    id: 12,
    name: "Atomic Habits",
    category: "Books",
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviews: 2341,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    description: "James Clear · Paperback · 320 pages"
  },
  {
    id: 13,
    name: "Deep Work",
    category: "Books",
    price: 349,
    originalPrice: 499,
    rating: 4.7,
    reviews: 1678,
    badge: null,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80",
    description: "Cal Newport · Paperback · 304 pages"
  },

  // ── Sports ────────────────────────────────────────────────────────────────
  {
    id: 14,
    name: "FlexPro Yoga Mat",
    category: "Sports",
    price: 1199,
    originalPrice: 1699,
    rating: 4.4,
    reviews: 387,
    badge: null,
    image: "https://images.unsplash.com/photo-1601925228606-be81b5a49ea2?w=600&q=80",
    description: "6mm anti-slip, eco TPE, carrying strap included"
  },
  {
    id: 15,
    name: "IronGrip Dumbbell Set",
    category: "Sports",
    price: 3999,
    originalPrice: 5499,
    rating: 4.6,
    reviews: 215,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    description: "5–30kg adjustable, rubber coated, compact"
  }
];
