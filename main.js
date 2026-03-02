// WhatsApp Configuration
const MY_WHATSAPP_NUMBER = "923XXXXXXXXX"; // Replace with actual number in format: CountryCode + Number

// Header & Scroll Effects
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Theme Toggle Logic
window.toggleTheme = function () {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    const isLight = body.getAttribute('data-theme') === 'light';

    if (isLight) {
        body.removeAttribute('data-theme');
        icon.setAttribute('data-lucide', 'moon');
    } else {
        body.setAttribute('data-theme', 'light');
        icon.setAttribute('data-lucide', 'sun');
    }
    lucide.createIcons();
};

// Global Data (Prices as Numbers for calculation)
const products = [
    // Men
    { id: 1, name: "Velvet Midnight Blazer", brand: "GIVENCHY", price: 1299, sellerContact: "sales@givenchy.com", category: "Men", img: "assets/product-blazer.png" },
    { id: 3, name: "Tailored Wool Overcoat", brand: "PRADA", price: 3200, sellerContact: "concierge@prada.com", category: "Men", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800" },
    { id: 7, name: "Linen Summer Suit", brand: "ARMANI", price: 2100, sellerContact: "support@armani.com", category: "Men", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" },
    { id: 8, name: "Balenciaga Logo Tee", brand: "BALENCIAGA", price: 450, sellerContact: "info@balenciaga.com", category: "Men", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" },
    { id: 9, name: "Saint Laurent Biker", brand: "SAINT LAURENT", price: 4500, sellerContact: "orders@ysl.com", category: "Men", img: "https://images.unsplash.com/photo-1551028711-131da507bd89?auto=format&fit=crop&q=80&w=800" },

    // Women
    { id: 2, name: "Silk Drape Gown", brand: "VALENTINO", price: 2450, sellerContact: "service@valentino.com", category: "Women", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800" },
    { id: 5, name: "Floral Couture Dress", brand: "DOLCE & GABBANA", price: 1650, sellerContact: "vip@dolcegabbana.it", category: "Women", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800" },
    { id: 11, name: "Burberry Trench", brand: "BURBERRY", price: 2200, sellerContact: "clientservice@burberry.com", category: "Women", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800" },
    { id: 12, name: "Dior Slip Dress", brand: "DIOR", price: 1890, sellerContact: "contact@dior.com", category: "Women", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800" },
    { id: 19, name: "Chanel Tweed Jacket", brand: "CHANEL", price: 4200, sellerContact: "service@chanel.com", category: "Women", img: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800" },

    // Accessories
    { id: 4, name: "Gucci Leather Tote", brand: "GUCCI", price: 1890, sellerContact: "assistance@gucci.com", category: "Accessories", img: "https://images.unsplash.com/photo-1584917033924-a736024fa86b?auto=format&fit=crop&q=80&w=800" },
    { id: 6, name: "Ferragamo Oxford", brand: "FERRAGAMO", price: 850, sellerContact: "shop@ferragamo.com", category: "Accessories", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800" },
    { id: 17, name: "Cartier Square Watch", brand: "CARTIER", price: 5200, sellerContact: "concierge.cartier@cartier.com", category: "Accessories", img: "https://images.unsplash.com/photo-1524383503251-872f77e20a06?auto=format&fit=crop&q=80&w=800" },
    { id: 18, name: "Choo Stilettos", brand: "JIMMY CHOO", price: 790, sellerContact: "customerservice@jimmychoo.com", category: "Accessories", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800" }
];

let cart = [];
let wishlist = [];

// Main Render Function
window.renderProducts = function (productsToDisplay = products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (productsToDisplay.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 50px 0;">No products found in this category.</p>`;
        return;
    }

    grid.innerHTML = productsToDisplay.map(p => {
        const isWishlisted = wishlist.some(item => item.id === p.id);
        return `
        <div class="product-card animate-up">
            <i data-lucide="heart" class="wishlist-icon ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${p.id})"></i>
            <div class="product-image">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-info">
                <div class="product-brand">${p.brand}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-price">$${p.price.toLocaleString()}</div>
                <button class="seller-contact-btn" onclick="contactSeller('${p.sellerContact}')">Contact Seller</button>
            </div>
            <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Bag</button>
        </div>`;
    }).join('');
    lucide.createIcons();
};

// Wishlist Logic
window.toggleWishlist = function (productId) {
    const index = wishlist.findIndex(p => p.id === productId);
    if (index === -1) {
        wishlist.push(products.find(p => p.id === productId));
    } else {
        wishlist.splice(index, 1);
    }
    updateWishlistUI();
    renderProducts(); // Refresh heart icons
};

function updateWishlistUI() {
    const badge = document.getElementById('wishlist-count');
    badge.innerText = wishlist.length;
    badge.style.display = wishlist.length > 0 ? 'block' : 'none';
}

window.showWishlistAlert = function () {
    if (wishlist.length === 0) {
        alert("Your wishlist is empty!");
    } else {
        const list = wishlist.map(p => `- ${p.brand} ${p.name}`).join('\n');
        alert(`Your Wishlist:\n${list}`);
    }
};

// Category Filters
window.filterByCategory = function (category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.toggle('active', btn.innerText === category));

    const filtered = category === 'All'
        ? products
        : products.filter(p => p.category === category);
    renderProducts(filtered);
};

// Cart Functionality
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();

    // Feedback Animation
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Added to Bag!';
    btn.style.background = '#d4af37';
    btn.style.color = '#0a0a0c';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
    }, 1500);
};

// Fixed Cart UI Logic with Mathematical Sum
function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('cart-total-amount');
    const cartBadge = document.getElementById('cart-count');

    cartBadge.innerText = cart.length;
    cartBadge.style.display = cart.length > 0 ? 'block' : 'none';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align: center; margin-top: 2rem; color: var(--text-muted);">Your bag is empty.</p>';
        totalDisplay.innerText = '$0';
        return;
    }

    itemsContainer.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--glass-border);">
            <div style="flex:1">
                <div style="font-weight:600; font-size:0.9rem;">${item.name}</div>
                <div style="color:var(--accent-gold); font-size:0.8rem;">$${item.price.toLocaleString()}</div>
            </div>
            <i data-lucide="trash-2" onclick="removeFromCart(${index})" style="cursor:pointer; color:#ff4444; width:18px;"></i>
        </div>`).join('');

    // Mathematical sum using reduce
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalDisplay.innerText = `$${total.toLocaleString()}`;
    lucide.createIcons();
}

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    updateCartUI();
};

// Checkout & WhatsApp Integration Logic
window.processCheckout = function () {
    if (cart.length === 0) {
        alert("Your bag is empty!");
        return;
    }

    // Prepare WhatsApp Message
    let message = `*New Order - Wardrobe Hub*%0A%0A`;
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.brand}* - ${item.name} ($${item.price.toLocaleString()})%0A`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `%0A*Total Amount: $${total.toLocaleString()}*%0A%0APlease confirm my order.`;

    // Open WhatsApp Link
    const whatsappUrl = `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Show Success Popup
    document.getElementById('order-popup').style.display = 'flex';

    // Reset Cart & UI
    cart = [];
    updateCartUI();
    toggleCart();
};

window.closePopup = function () {
    document.getElementById('order-popup').style.display = 'none';
};

// Sidebar Controls
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.getElementById('cart-btn-icon');
const closeCartBtn = document.getElementById('close-cart');

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.style.display = cartSidebar.classList.contains('active') ? 'block' : 'none';
}

cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Seller Modal Controls
const sellBtn = document.getElementById('sell-btn');
const sellerModal = document.getElementById('seller-modal');
const closeSellerModal = document.getElementById('close-seller-modal');

sellBtn.onclick = (e) => { e.preventDefault(); sellerModal.style.display = 'flex'; };
closeSellerModal.onclick = () => { sellerModal.style.display = 'none'; };
window.onclick = (e) => { if (e.target === sellerModal) sellerModal.style.display = 'none'; };

// Search Integration
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term)
    );
    renderProducts(filtered);
});

// Brand Contact Mock
window.contactSeller = function (email) {
    alert(`Starting professional inquiry to: ${email}\nOfficial brand representative will respond within 24 hours.`);
};

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
