// Veloura Scents — App Logic

// ─── State ───────────────────────────────────────────────
let cart = {};         // { [id]: { ...product, qty } }
let wishlist = new Set();
let currentPage = 'home';
let pageHistory = [];
let currentCat = 'All';
let currentDetailId = null;
let detailQty = 1;
let loggedIn = false;

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('splash').style.opacity = '0';
    document.getElementById('splash').style.transition = 'opacity 0.6s';
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      document.getElementById('main-app').style.display = 'flex';
      renderHome();
    }, 600);
  }, 1800);
});

// ─── Page Navigation ─────────────────────────────────────
function showPage(name) {
  if (name !== currentPage) pageHistory.push(currentPage);
  currentPage = name;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
  }

  // Update bottom nav
  ['home','shop','cart','profile'].forEach(n => {
    const btn = document.getElementById('nav-' + n);
    if (btn) btn.classList.toggle('active', n === name);
  });

  // Page-specific renders
  if (name === 'cart') renderCart();
  if (name === 'wishlist') renderWishlist();
  if (name === 'shop') renderShop();
  if (name === 'search') { setTimeout(() => document.getElementById('search-input').focus(), 200); renderSearch(''); }
}

function goBack() {
  const prev = pageHistory.pop() || 'home';
  currentPage = prev;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + prev);
  if (target) { target.classList.add('active'); target.scrollTop = 0; }
  ['home','shop','cart','profile'].forEach(n => {
    const btn = document.getElementById('nav-' + n);
    if (btn) btn.classList.toggle('active', n === prev);
  });
}

// ─── Render Helpers ───────────────────────────────────────
function productCardHTML(p) {
  const wished = wishlist.has(p.id);
  return `
  <div class="product-card" onclick="openDetail(${p.id})">
    <div class="card-img" style="background:${p.bgColor}">
      <img src="${p.image}" alt="${p.name}" class="card-photo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
      <span class="card-emoji-fallback" style="display:none">🌸</span>
      <button class="card-heart ${wished ? 'active' : ''}" onclick="toggleWish(${p.id}, event)" aria-label="Wishlist">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${wished ? '#e74c3c' : 'none'}" stroke="${wished ? '#e74c3c' : 'currentColor'}" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      ${p.sale ? '<span class="sale-tag">Sale</span>' : ''}
    </div>
    <div class="card-body">
      <p class="card-cat">${p.cat}</p>
      <p class="card-name">${p.name}</p>
      <div class="card-footer">
        <div class="card-prices">
          <span class="card-price">₨${p.price.toLocaleString()}</span>
          ${p.oldPrice ? `<span class="card-old">₨${p.oldPrice.toLocaleString()}</span>` : ''}
        </div>
        <button class="add-cart-btn" onclick="quickAddCart(${p.id}, event)" aria-label="Add to cart">+</button>
      </div>
    </div>
  </div>`;
}

function renderHome() {
  const featured = PRODUCTS.slice(0, 6);
  const sale = PRODUCTS.filter(p => p.sale);
  document.getElementById('home-products').innerHTML = featured.map(productCardHTML).join('');
  document.getElementById('sale-products').innerHTML = sale.map(productCardHTML).join('');
}

function renderShop() {
  let filtered = PRODUCTS;
  if (currentCat !== 'All') {
    filtered = currentCat === 'Sale' ? PRODUCTS.filter(p => p.sale) : PRODUCTS.filter(p => p.cat === currentCat);
  }
  document.getElementById('shop-products').innerHTML = filtered.length
    ? filtered.map(productCardHTML).join('')
    : '<p style="grid-column:span 2;text-align:center;padding:40px;color:#888;font-size:14px">No products found</p>';
}

function renderSearch(query) {
  const results = query
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.cat.toLowerCase().includes(query.toLowerCase()) || p.notes.some(n => n.toLowerCase().includes(query.toLowerCase())))
    : PRODUCTS;
  const grid = document.getElementById('search-results');
  const empty = document.getElementById('search-empty');
  if (!results.length) { grid.innerHTML = ''; empty.style.display = 'block'; }
  else { empty.style.display = 'none'; grid.innerHTML = results.map(productCardHTML).join(''); }
}

function doSearch(val) { renderSearch(val); }

function setCategory(btn, cat, inShop = false) {
  currentCat = cat;
  const container = btn.closest('.categories-row');
  container.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (inShop) renderShop();
  else { showPage('shop'); }
}

// ─── Product Detail ────────────────────────────────────────
function openDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  currentDetailId = id;
  detailQty = 1;

  document.getElementById('detail-img').style.background = p.bgColor;
  // Show real image in detail view
  let detailImgEl = document.getElementById('detail-product-img');
  if (!detailImgEl) {
    detailImgEl = document.createElement('img');
    detailImgEl.id = 'detail-product-img';
    detailImgEl.className = 'detail-photo';
    const emojiEl = document.getElementById('detail-emoji');
    emojiEl.parentNode.insertBefore(detailImgEl, emojiEl);
    emojiEl.style.display = 'none';
  }
  detailImgEl.src = p.image;
  detailImgEl.alt = p.name;
  detailImgEl.style.display = 'block';
  document.getElementById('detail-emoji').style.display = 'none';
  document.getElementById('detail-cat').textContent = p.cat;
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-price').textContent = '₨' + p.price.toLocaleString();
  document.getElementById('detail-old-price').textContent = p.oldPrice ? '₨' + p.oldPrice.toLocaleString() : '';
  document.getElementById('detail-desc').textContent = p.desc;
  document.getElementById('detail-qty').textContent = detailQty;
  document.getElementById('detail-notes').innerHTML = p.notes.map(n => `<span class="note-chip">${n}</span>`).join('');

  const heart = document.getElementById('detail-heart');
  updateDetailHeart(heart, id);

  showPage('detail');
}

function updateDetailHeart(btn, id) {
  const active = wishlist.has(id);
  btn.querySelector('svg').setAttribute('fill', active ? '#e74c3c' : 'none');
  btn.querySelector('svg').setAttribute('stroke', active ? '#e74c3c' : 'currentColor');
}

function toggleWishDetail() {
  toggleWish(currentDetailId, null);
  updateDetailHeart(document.getElementById('detail-heart'), currentDetailId);
}

function changeDetailQty(delta) {
  detailQty = Math.max(1, detailQty + delta);
  document.getElementById('detail-qty').textContent = detailQty;
}

function addDetailToCart() {
  const p = PRODUCTS.find(x => x.id === currentDetailId);
  if (!p) return;
  if (cart[p.id]) cart[p.id].qty += detailQty;
  else cart[p.id] = { ...p, qty: detailQty };
  updateBadges();
  showToast(`${p.name} added to cart 🛒`);
}

// ─── Cart ─────────────────────────────────────────────────
function quickAddCart(id, e) {
  e.stopPropagation();
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  if (cart[id]) cart[id].qty++;
  else cart[id] = { ...p, qty: 1 };
  updateBadges();
  showToast(`${p.name} added to cart 🛒`);
}

function renderCart() {
  const items = Object.values(cart);
  const listEl = document.getElementById('cart-list');
  const footerEl = document.getElementById('cart-footer');
  if (!items.length) {
    listEl.innerHTML = `<div class="empty-state"><span class="empty-icon">🛒</span><p>Your cart is empty</p><button class="btn-secondary" onclick="showPage('shop')">Browse Fragrances</button></div>`;
    footerEl.innerHTML = '';
    return;
  }
  listEl.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-thumb" style="background:${item.bgColor}">
        <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.style.display='none'" />
      </div>
      <div class="cart-info">
        <p class="cart-name">${item.name}</p>
        <p class="cart-unit">₨${item.price.toLocaleString()} each</p>
        <div class="cart-qty-row">
          <button class="qty-btn sm" onclick="changeCartQty(${item.id},-1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn sm" onclick="changeCartQty(${item.id},1)">+</button>
        </div>
      </div>
      <div class="cart-right">
        <p class="cart-total">₨${(item.price * item.qty).toLocaleString()}</p>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove">✕</button>
      </div>
    </div>`).join('');

  const subtotal = items.reduce((a, c) => a + c.price * c.qty, 0);
  const shipping = subtotal >= 3000 ? 0 : 199;
  const total = subtotal + shipping;

  footerEl.innerHTML = `
    <div class="cart-summary">
      <div class="summary-row"><span>Subtotal</span><span>₨${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:#27ae60">Free</span>' : '₨' + shipping}</span></div>
      ${shipping > 0 ? `<div class="free-ship-hint">Add ₨${(3000 - subtotal).toLocaleString()} more for free shipping</div>` : ''}
      <div class="summary-total"><span>Total</span><span>₨${total.toLocaleString()}</span></div>
    </div>
    <button class="wa-btn" onclick="whatsappCheckout()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Order via WhatsApp
    </button>
    <button class="track-btn" onclick="showPage('tracking')">📍 Track My Order</button>`;
}

function changeCartQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateBadges();
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  showToast('Item removed');
  updateBadges();
  renderCart();
}

function whatsappCheckout() {
  const items = Object.values(cart);
  if (!items.length) return;
  const subtotal = items.reduce((a, c) => a + c.price * c.qty, 0);
  const shipping = subtotal >= 3000 ? 0 : 199;
  const total = subtotal + shipping;
  let msg = '🛍️ *New Order — Veloura Scents*\n\n';
  items.forEach(i => { msg += `• ${i.name} × ${i.qty}  ₨${(i.price * i.qty).toLocaleString()}\n`; });
  msg += `\n📦 Shipping: ${shipping === 0 ? 'Free' : '₨' + shipping}`;
  msg += `\n💰 *Total: ₨${total.toLocaleString()}*\n\nPlease confirm my order. Thank you!`;
  openWhatsApp(msg);
}

function openWhatsApp(msg) {
  window.open('https://wa.me/923124279368?text=' + encodeURIComponent(msg), '_blank');
}

// ─── Wishlist ─────────────────────────────────────────────
function toggleWish(id, e) {
  if (e) e.stopPropagation();
  if (wishlist.has(id)) { wishlist.delete(id); showToast('Removed from wishlist'); }
  else { wishlist.add(id); showToast('Added to wishlist ❤️'); }
  updateBadges();
  // Re-render whichever grids are visible
  if (currentPage === 'home') renderHome();
  if (currentPage === 'shop') renderShop();
  if (currentPage === 'wishlist') renderWishlist();
  if (currentPage === 'search') doSearch(document.getElementById('search-input').value);
}

function renderWishlist() {
  const grid = document.getElementById('wish-grid');
  const empty = document.getElementById('wish-empty');
  const wished = PRODUCTS.filter(p => wishlist.has(p.id));
  if (!wished.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  grid.innerHTML = wished.map(productCardHTML).join('');
}

// ─── Profile / Auth ───────────────────────────────────────
function doLogin() {
  const email = document.getElementById('login-email').value || 'guest@veloura.pk';
  const name = email.includes('@') ? email.split('@')[0].replace(/[._]/g, ' ') : 'Guest User';
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('profile-view').style.display = 'block';
  document.getElementById('profile-name').textContent = capitalize(name);
  document.getElementById('profile-email').textContent = email;
  document.getElementById('avatar-initials').textContent = name.slice(0, 2).toUpperCase();
  loggedIn = true;
  showToast('Welcome to Veloura ✨');
}

function doLogout() {
  loggedIn = false;
  document.getElementById('profile-view').style.display = 'none';
  document.getElementById('login-view').style.display = 'block';
  document.getElementById('login-email').value = '';
  document.getElementById('login-pass').value = '';
  showToast('Signed out');
}

// ─── Badges & Utilities ───────────────────────────────────
function updateBadges() {
  const cartCount = Object.values(cart).reduce((a, c) => a + c.qty, 0);
  const wishCount = wishlist.size;
  const cb = document.getElementById('cart-badge');
  const wb = document.getElementById('wish-badge');
  cb.textContent = cartCount; cb.style.display = cartCount ? 'flex' : 'none';
  wb.textContent = wishCount; wb.style.display = wishCount ? 'flex' : 'none';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function capitalize(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}
