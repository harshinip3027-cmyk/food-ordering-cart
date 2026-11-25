// ===== DATA =====
const MENU = [
  { id: 1, name: "Veg Burger",       price: 80,  category: "Meals",    emoji: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 2, name: "Chicken Biryani",  price: 150, category: "Meals",    emoji: "🍛", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=640&q=80", veg: false },
  { id: 3, name: "Masala Dosa",      price: 60,  category: "Meals",    emoji: "🥞", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 4, name: "Veg Sandwich",     price: 50,  category: "Snacks",   emoji: "🥪", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 5, name: "French Fries",     price: 70,  category: "Snacks",   emoji: "🍟", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 6, name: "Samosa (2 pcs)",   price: 30,  category: "Snacks",   emoji: "🥟", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 7, name: "Filter Coffee",    price: 25,  category: "Drinks",   emoji: "☕", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 8, name: "Cold Coffee",      price: 60,  category: "Drinks",   emoji: "🧋", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 9, name: "Fresh Lime Soda",  price: 40,  category: "Drinks",   emoji: "🍋", image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 10, name: "Chocolate Brownie", price: 75, category: "Desserts", emoji: "🍫", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=640&q=80", veg: true },
  { id: 11, name: "Ice Cream Cup",   price: 45, category: "Desserts", emoji: "🍨", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=640&q=80", veg: true  },
  { id: 12, name: "Gulab Jamun (2)", price: 40, category: "Desserts", emoji: "🍮", image: "https://www.cadburydessertscorner.com/hubfs/dc-website-2022/articles/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp", veg: true  },
  { id: 13, name: "Paneer Tikka Roll", price: 90, category: "Snacks", emoji: "🌯", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=640&q=80", veg: true },
  { id: 14, name: "Margherita Pizza", price: 120, category: "Meals", emoji: "🍕", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=640&q=80", veg: true },
  { id: 15, name: "Mango Lassi", price: 55, category: "Drinks", emoji: "🥭", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=640&q=80", veg: true },
  { id: 16, name: "Chocolate Chip Cookie", price: 35, category: "Desserts", emoji: "🍪", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=640&q=80", veg: true }
];

const SERVICE_RATE = 0.05;
const STORAGE_KEY = "campusCafeCart";

// cart = { itemId: quantity }
let cart = loadCart();
let activeCategory = "All";
let orderCounter = Number(localStorage.getItem("campusCafeOrderNo")) || 1000;

// ===== ELEMENTS =====
const $ = (id) => document.getElementById(id);
const menuGrid = $("menuGrid");
const categoryFilters = $("categoryFilters");
const cartList = $("cartList");
const emptyState = $("emptyState");
const billBox = $("billBox");
const checkoutBtn = $("checkoutBtn");
const cartMsg = $("cartMsg");
const nameInput = $("customerName");
const serviceToggle = $("serviceToggle");

const receiptModal = new bootstrap.Modal($("receiptModal"));
const toast = new bootstrap.Toast($("toast"), { delay: 1600 });

// ===== HELPERS =====
const money = (n) => "₹" + n.toFixed(2);
const findItem = (id) => MENU.find((m) => m.id === id);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}
function showToast(msg) {
  $("toastBody").textContent = msg;
  toast.show();
}
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ===== MENU RENDERING =====
function renderFilters() {
  const cats = ["All", ...new Set(MENU.map((m) => m.category))];
  categoryFilters.innerHTML = cats
    .map((c) => `<button type="button" class="btn btn-sm ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function renderMenu() {
  const items = activeCategory === "All" ? MENU : MENU.filter((m) => m.category === activeCategory);
  menuGrid.innerHTML = items
    .map(
      (m) => `
    <div class="col-6 col-md-4">
      <div class="card menu-card shadow-sm h-100">
        <div class="menu-image">
          <span aria-hidden="true">${m.emoji}</span>
          <img src="${m.image}" alt="${m.name}" loading="lazy" onerror="this.remove()">
        </div>
        <div class="card-body d-flex flex-column">
          <div class="small text-muted">
            <span class="${m.veg ? "veg-dot" : "nonveg-dot"}"></span>${m.veg ? "Veg" : "Non-veg"} · ${m.category}
          </div>
          <h3 class="h6 mt-1">${m.name}</h3>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="price">${money(m.price)}</span>
            <button class="btn btn-warning btn-sm" data-add="${m.id}">+ Add</button>
          </div>
        </div>
      </div>
    </div>`
    )
    .join("");
}

// ===== CART RENDERING =====
function calcTotals() {
  let subtotal = 0;
  let count = 0;
  for (const [id, qty] of Object.entries(cart)) {
    subtotal += findItem(Number(id)).price * qty;
    count += qty;
  }
  const service = serviceToggle.checked ? subtotal * SERVICE_RATE : 0;
  return { subtotal, service, total: subtotal + service, count };
}

function renderCart() {
  const ids = Object.keys(cart);
  const { subtotal, service, total, count } = calcTotals();

  emptyState.classList.toggle("d-none", ids.length > 0);
  billBox.classList.toggle("d-none", ids.length === 0);
  checkoutBtn.disabled = ids.length === 0;
  $("clearBtn").disabled = ids.length === 0;

  cartList.innerHTML = ids
    .map((id) => {
      const item = findItem(Number(id));
      const qty = cart[id];
      return `
      <li class="list-group-item px-0">
        <div class="d-flex justify-content-between">
          <span>${item.emoji} <strong>${item.name}</strong></span>
          <button class="btn btn-sm btn-link text-danger p-0" data-remove="${id}" aria-label="Remove ${item.name}">✕ Remove</button>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-1">
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary qty-btn" data-dec="${id}" aria-label="Decrease quantity">−</button>
            <span class="fw-semibold" style="min-width:1.5rem;text-align:center">${qty}</span>
            <button class="btn btn-outline-secondary qty-btn" data-inc="${id}" aria-label="Increase quantity">+</button>
            <span class="text-muted small">× ${money(item.price)}</span>
          </div>
          <span class="fw-semibold">${money(item.price * qty)}</span>
        </div>
      </li>`;
    })
    .join("");

  $("subtotal").textContent = money(subtotal);
  $("service").textContent = money(service);
  $("total").textContent = money(total);
  $("navCount").textContent = count;
  checkoutBtn.textContent = ids.length ? `Checkout · ${money(total)}` : "Checkout";
  saveCart();
}

// ===== CART ACTIONS =====
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  showToast(`${findItem(id).name} added to cart`);
  renderCart();
}
function increase(id) {
  cart[id]++;
  renderCart();
}
function decrease(id) {
  cart[id]--;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}
function removeItem(id) {
  delete cart[id];
  renderCart();
}
function clearCart() {
  cart = {};
  cartMsg.textContent = "";
  renderCart();
}

// ===== CHECKOUT =====
function checkout() {
  cartMsg.textContent = "";

  if (Object.keys(cart).length === 0) {
    cartMsg.textContent = "Your cart is empty. Add at least one item before checkout.";
    return;
  }

  const name = nameInput.value.trim();
  if (name.length < 2) {
    nameInput.classList.add("is-invalid");
    nameInput.focus();
    return;
  }
  nameInput.classList.remove("is-invalid");

  const { subtotal, service, total } = calcTotals();
  orderCounter++;
  localStorage.setItem("campusCafeOrderNo", orderCounter);

  const rows = Object.entries(cart)
    .map(([id, qty]) => {
      const item = findItem(Number(id));
      return `<tr><td>${item.name}</td><td class="text-center">${qty}</td><td class="text-end">${money(item.price * qty)}</td></tr>`;
    })
    .join("");

  $("receiptBody").innerHTML = `
    <div class="text-center mb-3">
      <h3 class="h5 mb-0">☕ Campus Café</h3>
      <div class="small text-muted">Order #${orderCounter} · ${new Date().toLocaleString()}</div>
    </div>
    <p class="mb-2">Thank you, <strong>${escapeHtml(name)}</strong>! Your order is being prepared.</p>
    <table class="table table-sm">
      <thead><tr><th>Item</th><th class="text-center">Qty</th><th class="text-end">Amount</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="2">Subtotal</td><td class="text-end">${money(subtotal)}</td></tr>
        <tr><td colspan="2">Service charge ${serviceToggle.checked ? "(5%)" : "(not applied)"}</td><td class="text-end">${money(service)}</td></tr>
        <tr class="fw-bold"><td colspan="2">Total paid</td><td class="text-end">${money(total)}</td></tr>
      </tfoot>
    </table>`;

  receiptModal.show();
  cart = {};
  nameInput.value = "";
  renderCart();
}

// ===== EVENTS =====
categoryFilters.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderFilters();
  renderMenu();
});

menuGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(Number(btn.dataset.add));
});

cartList.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rem = e.target.closest("[data-remove]");
  if (inc) increase(inc.dataset.inc);
  else if (dec) decrease(dec.dataset.dec);
  else if (rem) removeItem(rem.dataset.remove);
});

serviceToggle.addEventListener("change", renderCart);
$("clearBtn").addEventListener("click", clearCart);
checkoutBtn.addEventListener("click", checkout);
nameInput.addEventListener("input", () => nameInput.classList.remove("is-invalid"));

// ===== INIT =====
// Drop any saved items that no longer exist in the menu
Object.keys(cart).forEach((id) => { if (!findItem(Number(id))) delete cart[id]; });
renderFilters();
renderMenu();
renderCart();
