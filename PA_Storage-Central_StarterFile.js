/*
        Author: Eric Mckinzy    
        Date: August 22, 2026
        Purpose: Willow & Pine Crafts catalog rendering, dynamic stock management,
                 localStorage for cart, sessionStorage for additions, and cookie tracking for last purchases.
*/

/* =========================================
   1. PRODUCTS DATA WITH INITIAL STOCK
========================================= */

const products = [
    {
        id: 1,
        name: "Hand-Thrown Ceramic Mug",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        altText: "Speckled beige hand-thrown ceramic mug with a smooth glazed finish",
        description: "Artisanal clay mug crafted on a potter's wheel, perfect for warm morning brews.",
        price: 24.99,
        initialStock: 12
    },
    {
        id: 2,
        name: "Woven Macramé Wall Hanging",
        image: "https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?auto=format&fit=crop&w=600&q=80",
        altText: "Boho style natural cotton macramé wall tapestry hanging on driftwood",
        description: "Intricately knotted natural cotton rope mounted on reclaimed driftwood.",
        price: 45.00,
        initialStock: 5
    },
    {
        id: 3,
        name: "Eric Mckinzy's Signature Candle",
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
        altText: "Amber glass jar candle filled with natural soy wax and essential oils",
        description: "Hand-poured soy wax infused with soothing lavender and cedarwood oils.",
        price: 18.50,
        initialStock: 20
    },
    {
        id: 4,
        name: "Handmade Leather Journal",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        altText: "Rustic brown leather-bound journal tied with a leather strap",
        description: "Bound with genuine full-grain leather and filled with recycled cream paper.",
        price: 32.00,
        initialStock: 8
    },
    {
        id: 5,
        name: "Handwoven Cotton Throw",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
        altText: "Soft neutral textured handwoven cotton throw blanket with fringe edges",
        description: "Lightweight and breathable blanket, hand-loomed using pure cotton yarn.",
        price: 68.00,
        initialStock: 0
    },
    {
        id: 6,
        name: "Carved Wooden Coaster Set",
        image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80",
        altText: "Set of four round walnut wooden coasters showing natural grain patterns",
        description: "Set of 4 solid walnut coasters finished with food-safe natural oils.",
        price: 22.00,
        initialStock: 15
    }
];

/* =========================================
   2. STORAGE, COOKIE & STATE MANAGEMENT
========================================= */

let cart = [];
let sessionItemsAdded = 0;

// Load stored cart and session values on load
function loadCart() {
    const savedCart = localStorage.getItem("willowPineCart");
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error("Error parsing cart data from localStorage:", e);
            cart = [];
        }
    }

    const savedSessionCount = sessionStorage.getItem("sessionItemsAdded");
    sessionItemsAdded = savedSessionCount ? parseInt(savedSessionCount, 10) || 0 : 0;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("willowPineCart", JSON.stringify(cart));
}

// Track session addition count
function trackSessionAddition(quantityAdded = 1) {
    sessionItemsAdded += quantityAdded;
    sessionStorage.setItem("sessionItemsAdded", sessionItemsAdded.toString());
    updateSessionUI();
}

function updateSessionUI() {
    const sessionCountEl = document.getElementById("sessionAddedCount");
    if (sessionCountEl) {
        sessionCountEl.textContent = sessionItemsAdded;
    }
}

/* =========================================
   3. COOKIE MANAGEMENT FOR LAST PURCHASED
========================================= */

// Helper to set a cookie with an expiration (default 30 days)
function setCookie(name, value, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

// Helper to read a cookie value by name
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

// Display last purchased items from cookie
function displayLastPurchased() {
    const container = document.getElementById("lastPurchasedContainer");
    if (!container) return;

    const lastPurchased = getCookie("lastPurchasedItems");

    if (lastPurchased) {
        container.innerHTML = `<strong>Recently Purchased:</strong> ${lastPurchased}`;
        container.style.display = "inline-block";
    } else {
        container.style.display = "none";
    }
}

/* =========================================
   4. DYNAMIC STOCK CALCULATION
========================================= */

// Returns remaining available stock for a product minus quantity in cart
function getAvailableStock(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    const cartItem = cart.find(item => item.id === productId);
    const cartQty = cartItem ? cartItem.quantity : 0;

    return Math.max(0, product.initialStock - cartQty);
}

/* =========================================
   5. RENDER FUNCTIONS
========================================= */

function displayProducts() {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    let gridHTML = "";

    products.forEach(product => {
        const availableStock = getAvailableStock(product.id);
        const isOutOfStock = availableStock <= 0;
        const cardClass = isOutOfStock ? "product-card out-of-stock" : "product-card";
        const buttonText = isOutOfStock ? "Out of Stock" : "Add to Cart";
        const buttonDisabled = isOutOfStock ? "disabled" : "";

        gridHTML += `
            <article class="${cardClass}" id="product-card-${product.id}">
                <img src="${product.image}" alt="${product.altText}">
                <div class="product-content">
                    <div>
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                    </div>
                    <div>
                        <p class="price">$${product.price.toFixed(2)}</p>
                        <p class="stock">Available Stock: ${availableStock}</p>
                        <button type="button" 
                                id="add-btn-${product.id}"
                                ${buttonDisabled} 
                                onclick="addToCart(${product.id})">
                            ${buttonText}
                        </button>
                    </div>
                </div>
            </article>
        `;
    });

    productGrid.innerHTML = gridHTML;
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartCountEl = document.getElementById("cartCount");
    const cartTotalEl = document.getElementById("cartTotal");

    let totalProducts = 0;
    let totalPrice = 0;
    let itemsHTML = "";

    if (cart.length === 0) {
        itemsHTML = `<p style="color: #888; font-style: italic; padding: 1rem 0;">Your cart is empty.</p>`;
    } else {
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            totalProducts += item.quantity;
            totalPrice += itemTotal;

            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <span>${item.name}</span>
                        <span>$${itemTotal.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <div class="qty-btn-group">
                            <button type="button" class="qty-btn" onclick="adjustQuantity(${item.id}, -1)">-</button>
                            <span class="item-qty">Qty: ${item.quantity}</span>
                            <button type="button" class="qty-btn" onclick="adjustQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button type="button" class="btn-remove" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `;
        });
    }

    if (cartItemsContainer) cartItemsContainer.innerHTML = itemsHTML;
    if (cartCountEl) cartCountEl.textContent = totalProducts;
    if (cartTotalEl) cartTotalEl.textContent = totalPrice.toFixed(2);
}

/* =========================================
   6. VISUAL FEEDBACK (SUCCESS INDICATION)
========================================= */

/*
   VISUAL INDICATION DESCRIPTION:
   When an item is added to the cart, triggerAddToCartFeedback() provides immediate visual feedback by:
   1. Changing the "Add to Cart" button's background color temporarily to green (#2e6f40).
   2. Changing the button text to "✓ Added!".
   3. Applying a CSS keyframe pulse animation ('successPulse') that slightly expands and settles the button.
   4. Reverting the button to its normal text and styling after 800 milliseconds.
*/
function triggerAddToCartFeedback(productId) {
    const btn = document.getElementById(`add-btn-${productId}`);
    if (!btn || btn.disabled) return;

    const originalText = btn.textContent;
    btn.classList.add("btn-add-success");
    btn.textContent = "✓ Added!";

    setTimeout(() => {
        btn.classList.remove("btn-add-success");
        // Only revert text if button hasn't been disabled due to reaching zero stock
        if (!btn.disabled) {
            btn.textContent = originalText;
        }
    }, 800);
}

/* =========================================
   7. CART ACTIONS & CONTROLS
========================================= */

function addToCart(productId) {
    const availableStock = getAvailableStock(productId);
    const product = products.find(p => p.id === productId);

    if (!product || availableStock <= 0) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    trackSessionAddition(1);
    updateCartUI();
    displayProducts(); // Re-render to update stock numbers & greying out
    triggerAddToCartFeedback(productId); // Trigger visual success feedback
}

function adjustQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    const availableStock = getAvailableStock(productId);

    if (change > 0 && availableStock <= 0) {
        alert("Sorry, no more stock available for this product.");
        return;
    }

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        item.quantity = newQuantity;
        if (change > 0) {
            trackSessionAddition(change);
        }
        saveCart();
        updateCartUI();
        displayProducts(); // Restore/reduce stock counts
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    displayProducts(); // Restores stock count on card
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        saveCart();
        updateCartUI();
        displayProducts(); // Restores all stock counts on cards
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add items before checking out.");
        return;
    }

    // 1. Compile product names for cookie
    const purchasedItemNames = cart.map(item => `${item.name} (x${item.quantity})`).join(", ");
    
    // 2. Save last purchased items to a cookie
    setCookie("lastPurchasedItems", purchasedItemNames, 30);

    const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    alert(`Thank you for your purchase! Total amount: $${totalCost}`);

    // 3. Clear cart after purchase
    cart = [];
    saveCart();
    updateCartUI();
    displayProducts();
    displayLastPurchased(); // Refresh cookie display banner
}

/* =========================================
   8. TOOLTIP FEATURE (FOR OUT OF STOCK)
========================================= */

function setupTooltip() {
    let tooltip = document.querySelector(".mouse-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "mouse-tooltip";
        tooltip.textContent = "Out of Stock";
        document.body.appendChild(tooltip);
    }

    document.addEventListener("mousemove", (e) => {
        const target = e.target.closest(".out-of-stock");
        if (target) {
            tooltip.style.left = `${e.clientX + 15}px`;
            tooltip.style.top = `${e.clientY + 15}px`;
            tooltip.classList.add("show");
        } else {
            tooltip.classList.remove("show");
        }
    });
}

/* =========================================
   9. INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const welcomeMsg = document.getElementById("welcome-message");
    if (welcomeMsg) {
        welcomeMsg.textContent = "Explore our artisanal collection created with natural, high-quality materials.";
    }

    const clearBtn = document.getElementById("clearCartBtn");
    if (clearBtn) clearBtn.addEventListener("click", clearCart);

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);

    loadCart();
    displayProducts();
    updateCartUI();
    updateSessionUI();
    displayLastPurchased();
    setupTooltip();
});