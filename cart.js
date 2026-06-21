// ===== ТОВАРЫ =====
const products = [
    { id: 1, name: 'Легендарный бургер', price: 399.99 },
    { id: 2, name: 'Острые крылышки', price: 199.99 },
    { id: 3, name: 'Картошка фри', price: 119.99 },
    { id: 4, name: 'Картошка по деревенски', price: 139.99 },
    { id: 5, name: 'Кола', price: 129.99 },
    { id: 6, name: 'Фанта', price: 129.99 },
    { id: 7, name: 'Спрайт', price: 129.99 },
    { id: 8, name: 'Кофе-Латте', price: 149.99 }
];

let cart = {};

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }
function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) { try { cart = JSON.parse(saved); } catch(e) { cart = {}; } }
}

function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    updateCartUI();
    showToast('Добавлено в корзину 🎉');
    let btn = document.querySelector('.cart');
    btn.style.transform = 'scale(1.05)';
    btn.style.background = '#ff1e1e';
    setTimeout(() => { btn.style.transform = 'scale(1)'; btn.style.background = '#8b1f1f'; }, 300);
}

function updateCartUI() {
    const total = Object.values(cart).reduce((s, v) => s + v, 0);
    const counter = document.getElementById('cartCount');
    if (counter) counter.textContent = total;
    
    const items = document.getElementById('cartItems');
    const totalPrice = document.getElementById('cartTotal');
    if (!items) return;
    
    if (total === 0) {
        items.innerHTML = '<div class="empty-cart-msg">Корзина пуста</div>';
        if (totalPrice) totalPrice.textContent = '0 ₽';
        return;
    }
    
    let html = '';
    let sum = 0;
    Object.entries(cart).forEach(([id, qty]) => {
        const p = products.find(x => x.id == id);
        if (!p) return;
        sum += p.price * qty;
        html += `
            <div class="cart-item">
                <div>
                    <div class="cart-item-title">${p.name}</div>
                    <div class="cart-item-price">${p.price.toFixed(2)} ₽ × ${qty}</div>
                </div>
                <div class="cart-item-actions">
                    <button onclick="changeQty(${id}, -1)">−</button>
                    <span class="cart-item-count">${qty}</span>
                    <button onclick="changeQty(${id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeAll(${id})">✕</button>
                </div>
            </div>
        `;
    });
    items.innerHTML = html;
    if (totalPrice) totalPrice.textContent = sum.toFixed(2) + ' ₽';
}

function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    updateCartUI();
}

function removeAll(id) {
    delete cart[id];
    saveCart();
    updateCartUI();
}

function openCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('overlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('active');
    updateCartUI();
}

function closeCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('overlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

function checkout() {
    if (Object.keys(cart).length === 0) {
        showToast('⚠️ Корзина пуста!');
        return;
    }
    const modal = document.getElementById('orderModal');
    if (modal) modal.classList.add('active');
    cart = {};
    saveCart();
    updateCartUI();
    setTimeout(closeCart, 400);
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) modal.classList.remove('active');
}

function copyCode(code) {
    navigator.clipboard?.writeText(code);
    showToast('Промокод ' + code + ' скопирован!');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCart();
        closeOrderModal();
    }
});

loadCart();
updateCartUI();