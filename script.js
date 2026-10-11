/**
 * Pisang Matcha Co. - Interactive Application Logic
 */

// Product Data - Menu Utama Spesial Pisang Matcha Lumpia
const products = [
  {
    id: 1,
    name: "Pisang Matcha Lumpia Crispy",
    category: "lumpia",
    price: 5000,
    image: "assets/menu-roll.jpg",
    desc: "Camilan berbahan dasar pisang manis pilihan yang dibalut lembaran kulit lumpia renyah, digoreng garing keemasan hingga kriuk maksimal, dan dipadukan dengan lelehan saus matcha autentik yang khas."
  }
];

// Cart State (loaded from localStorage if exists)
let cart = JSON.parse(localStorage.getItem('pisang_matcha_cart')) || [];

// DOM Elements
const navbarNav = document.getElementById('navbarNav');
const hamburgerBtn = document.getElementById('hamburger-menu');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartBadge = document.getElementById('cartBadge');
const cartItemsList = document.getElementById('cartItemsList');
const cartSubtotal = document.getElementById('cartSubtotal');
const searchBtn = document.getElementById('search-btn');
const searchModal = document.getElementById('searchModal');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  setupCategoryFilter();
  setupNavbarScroll();
});

// Mobile Hamburger Toggle
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navbarNav.classList.toggle('open');
  });
}

// Close mobile menu when clicking outside or link
document.addEventListener('click', (e) => {
  if (navbarNav && !navbarNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    navbarNav.classList.remove('open');
  }
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navbarNav) navbarNav.classList.remove('open');
  });
});

// Navbar Active on Scroll
function setupNavbarScroll() {
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Category Filter Handling
function setupCategoryFilter() {
  const catButtons = document.querySelectorAll('.cat-btn');
  const cards = document.querySelectorAll('.product-card');

  catButtons.forEach(button => {
    button.addEventListener('click', () => {
      catButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-category');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Search Modal Controls
if (searchBtn && searchModal && closeSearchBtn) {
  searchBtn.addEventListener('click', () => {
    searchModal.classList.add('open');
    searchInput.focus();
  });

  closeSearchBtn.addEventListener('click', () => {
    searchModal.classList.remove('open');
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    const searchPool = [
      ...products,
      {
        id: 99,
        name: "Paket Box Hemat (5 Pcs Pisang Matcha Lumpia)",
        category: "lumpia",
        price: 22000,
        image: "assets/menu-roll.jpg",
        desc: "Paket hemat 5 porsi pisang matcha berbalut kulit lumpia renyah."
      }
    ];

    const matched = searchPool.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.desc.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
      searchResults.innerHTML = `
        <div style="color: #9ca3af; text-align: center; padding: 20px;">
          Tidak ditemukan menu dengan kata "${e.target.value}"
        </div>
      `;
      return;
    }

    searchResults.innerHTML = matched.map(item => `
      <div class="search-item">
        <div>
          <strong style="display:block; font-size:1rem;">${item.name}</strong>
          <span style="font-size:0.85rem; color:#a3e635;">Rp ${item.price.toLocaleString('id-ID')}</span>
        </div>
        <button class="btn btn-primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="addToCartFromSearch(${item.id})">
          + Pesan
        </button>
      </div>
    `).join('');
  });
}

function addToCartFromSearch(productId) {
  if (productId === 99) {
    addComboToCart();
  } else {
    addToCart(productId);
  }
  searchModal.classList.remove('open');
  searchInput.value = '';
  searchResults.innerHTML = '';
}

// Cart Sidebar Controls
function openCart() {
  cartSidebar.classList.add('open');
  cartBackdrop.classList.add('open');
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartBackdrop.classList.remove('open');
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

// Cart Operations
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`✨ ${product.name} berhasil ditambahkan!`);
  openCart();
}

function addComboToCart() {
  const promoItem = {
    id: 99,
    name: "Paket Box Hemat (5 Pcs Pisang Matcha Lumpia)",
    price: 8.000,
    image: "assets/menu-roll.jpg",
    qty: 1
  };

  const existingPromo = cart.find(item => item.id === promoItem.id);
  if (existingPromo) {
    existingPromo.qty += 1;
  } else {
    cart.push(promoItem);
  }

  saveCart();
  renderCart();
  showToast(`🎉 Paket Hemat Box (5 Pcs) berhasil ditambahkan!`);
  openCart();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('pisang_matcha_cart', JSON.stringify(cart));
}

function renderCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (cartBadge) {
    cartBadge.textContent = totalCount;
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => {
      cartBadge.style.transform = 'scale(1)';
    }, 200);
  }

  if (cartSubtotal) {
    cartSubtotal.textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;
  }

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart-state">
        <i data-feather="shopping-cart"></i>
        <p>Keranjang kamu masih kosong</p>
        <small>Yuk pilih varian pisang matcha favoritmu!</small>
      </div>
    `;
    if (window.feather) feather.replace();
    return;
  }

  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-price">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span class="qty-count">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Hapus">
        <i data-feather="trash-2"></i>
      </button>
    </div>
  `).join('');

  if (window.feather) feather.replace();
}

// WhatsApp Checkout Automation
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Keranjang kamu masih kosong. Silakan pilih menu terlebih dahulu!");
    return;
  }

  const storePhone = "6289510592814"; // WhatsApp admin number
  let message = `Halo Admin Picha Picha., saya ingin memesan menu berikut:\n\n`;

  let subtotal = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    message += `${index + 1}. ${item.name} (${item.qty}x) = Rp ${itemTotal.toLocaleString('id-ID')}\n`;
  });

  message += `\n*Total Belanja:* Rp ${subtotal.toLocaleString('id-ID')}\n`;
  message += `Mohon info ongkir ke alamat saya dan nomor rekening untuk transfer ya. Terima kasih!`;

  const encodedUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, '_blank');
}

// Contact Form WhatsApp submission
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  const phone = document.getElementById('contactPhone').value;
  const note = document.getElementById('contactNote').value;

  const storePhone = "6289510592814";
  const message = `Halo Admin Picha Picha.,\nNama: ${name}\nNo HP: ${phone}\nPesan/Catatan: ${note || '-'}`;

  const encodedUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, '_blank');
}

function handleNewsletter(e) {
  e.preventDefault();
  showToast("🎉 Kupon diskon 20% telah dikirim ke email kamu!");
  e.target.reset();
}

// Toast Feedback Notification
let toastTimer;
function showToast(text) {
  if (!toastNotification || !toastMessage) return;

  toastMessage.textContent = text;
  toastNotification.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 3200);
}
