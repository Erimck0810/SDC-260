// Nomad Life Gallery — Product Catalog
// Shared product data and rendering logic, reusable across Browse, Homepage,
// and Collection pages so artwork details only live in one place.
 
const products = [
  {
    title: "Signal Drift",
    artist: "Maya Lin",
    region: "Himalayan Plateau",
    medium: "Generative Art",
    price: 4200,
    edition: "1 of 1",
    verified: true,
    featured: true
  },
  {
    title: "Nomadic Hours",
    artist: "Julian Ross",
    region: "Kyoto Hinterlands",
    medium: "Digital Photography",
    price: 325,
    edition: "1 of 25",
    verified: true,
    featured: true
  },
  {
    title: "Ledger Bloom",
    artist: "Soren Aabye",
    region: "Faroese Steppes",
    medium: "3D Environmental Scan",
    price: 1850,
    edition: "1 of 1",
    verified: true,
    featured: true
  },
  {
    title: "Sahara Dunes",
    artist: "Foggy Bottom",
    region: "Moroccan Erg",
    medium: "Digital Photography",
    price: 2100,
    edition: "1 of 10",
    verified: true
  },
  {
    title: "Glacial Static",
    artist: "Maya Lin",
    region: "Himalayan Plateau",
    medium: "Generative Art",
    price: 3150,
    edition: "1 of 1",
    verified: true
  },
  {
    title: "Ronin Fog",
    artist: "Julian Ross",
    region: "Kyoto Hinterlands",
    medium: "Digital Photography",
    price: 480,
    edition: "1 of 25",
    verified: true
  },
  {
    title: "Tidal Ledger",
    artist: "Soren Aabye",
    region: "Faroese Steppes",
    medium: "3D Environmental Scan",
    price: 2675,
    edition: "1 of 3",
    verified: true
  },
  {
    title: "Ember Erg",
    artist: "Foggy Bottom",
    region: "Moroccan Erg",
    medium: "Digital Photography",
    price: 1590,
    edition: "1 of 10",
    verified: true
  },
  {
    title: "Altitude Ciphers",
    artist: "Maya Lin",
    region: "Himalayan Plateau",
    medium: "Generative Art",
    price: 5400,
    edition: "1 of 1",
    verified: true
  },
  {
    title: "Lantern Season",
    artist: "Julian Ross",
    region: "Kyoto Hinterlands",
    medium: "Digital Photography",
    price: 395,
    edition: "1 of 25",
    verified: false
  },
  {
    title: "Basalt Chorus",
    artist: "Soren Aabye",
    region: "Faroese Steppes",
    medium: "3D Environmental Scan",
    price: 2980,
    edition: "1 of 3",
    verified: true
  },
  {
    title: "Star Caravan",
    artist: "Foggy Bottom",
    region: "Moroccan Erg",
    medium: "Digital Photography",
    price: 1875,
    edition: "1 of 10",
    verified: true
  }
];
 
// Saved-to-collection records for the Collector Dashboard. Kept separate from
// the product catalog since "saved on" is a fact about a collector's wallet,
// not about the artwork itself. title links back to an entry in `products`.
const collectionItems = [
  { title: "Signal Drift", savedOn: "2026-08-01", savedLabel: "Aug 1, 2026" },
  { title: "Nomadic Hours", savedOn: "2026-08-04", savedLabel: "Aug 4, 2026" },
  { title: "Ledger Bloom", savedOn: "2026-08-07", savedLabel: "Aug 7, 2026" }
];
 
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0
});
 
// Product prices are always whole dollars, so currencyFormatter (no forced
// decimals) suits the catalog. Discounts and post-discount totals can land
// on cents (e.g. 10% of $6,375 = $637.50), so they use this formatter
// instead — always 2 decimals, so amounts never silently drop a trailing zero.
const preciseCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
 
// Builds one product card as a DOM node, matching the site's existing card markup.
// options.compact = true omits the artist/region/medium/edition meta-list, for
// contexts like the homepage that only need the badge, title, and price.
function buildProductCard(product, options) {
  options = options || {};
  const article = document.createElement("article");
  article.className = "card";
 
  const badgeText = product.verified ? "✓ Verified on-chain" : "Pending verification";
  const badgeClass = product.verified ? "badge" : "badge badge-pending";
 
  const metaList = options.compact ? "" : `
        <dl class="meta-list">
          <dt>Artist:</dt>
          <dd>${product.artist}</dd>
          <dt>Region:</dt>
          <dd>${product.region}</dd>
          <dt>Medium:</dt>
          <dd>${product.medium}</dd>
          <dt>Edition:</dt>
          <dd>${product.edition}</dd>
        </dl>`;
 
  article.innerHTML = `
    <figure>
      <div class="thumb" role="img" aria-label="Artwork image: ${product.title}">Image Placeholder</div>
      <figcaption class="body">
        <span class="${badgeClass}">${badgeText}</span>
        <h3 class="title">${product.title}</h3>
        <p class="price">${currencyFormatter.format(product.price)}</p>${metaList}
      </figcaption>
    </figure>
  `;
 
  return article;
}
 
// Builds one saved-item card for the Collector Dashboard, matching that page's
// existing markup (status tag + saved date + remove button instead of a
// verified badge and artist/region details).
function buildCollectionCard(product, savedItem) {
  const article = document.createElement("article");
  article.className = "card";
 
  article.innerHTML = `
    <figure>
      <div class="thumb" role="img" aria-label="Artwork image: ${product.title}">Image Placeholder</div>
      <figcaption class="body">
        <mark class="status-tag">Saved Item</mark>
        <h4 class="title" style="margin-top: 8px;">${product.title}</h4>
        <p class="price">${currencyFormatter.format(product.price)}</p>
        <div class="collection-meta">
          <span>Saved on <time datetime="${savedItem.savedOn}">${savedItem.savedLabel}</time></span>
          <button type="button" class="remove-btn">Remove</button>
        </div>
      </figcaption>
    </figure>
  `;
 
  return article;
}
 
// Loops over a product list and renders every item into the target grid element.
// gridId: the id of the container element to populate.
// countId: optional id of an element to receive a "n artworks" summary label.
// options: passed through to buildProductCard (e.g. { compact: true }).
function renderProducts(list, gridId, countId, options) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
 
  grid.innerHTML = "";
  for (let i = 0; i < list.length; i++) {
    grid.appendChild(buildProductCard(list[i], options));
  }
 
  if (countId) {
    const countLabel = document.getElementById(countId);
    if (countLabel) {
      countLabel.textContent = `${list.length} artwork${list.length === 1 ? "" : "s"}`;
    }
  }
}
 
// Loops over collectionItems (standing in for a cart until a dedicated cart
// model exists) and renders line items + a subtotal into the Checkout page's
// order summary panel. Returns the numeric subtotal so the caller can layer
// a coupon discount and a grand total on top of it.
function renderOrderSummary(items, listId, subtotalId) {
  const list = document.getElementById(listId);
  if (!list) return 0;
 
  list.innerHTML = "";
  let subtotal = 0;
 
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-note";
    empty.textContent = "Your cart is empty.";
    list.appendChild(empty);
  }
 
  for (let i = 0; i < items.length; i++) {
    const savedItem = items[i];
    const product = products.find(function (p) { return p.title === savedItem.title; });
    if (!product) continue;
 
    const li = document.createElement("li");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = product.title;
    const priceSpan = document.createElement("span");
    priceSpan.className = "item-price";
    priceSpan.textContent = currencyFormatter.format(product.price);
 
    li.appendChild(nameSpan);
    li.appendChild(priceSpan);
    list.appendChild(li);
 
    subtotal += product.price;
  }
 
  const subtotalEl = document.getElementById(subtotalId);
  if (subtotalEl) subtotalEl.textContent = currencyFormatter.format(subtotal);
 
  return subtotal;
}
 
// Coupon codes available in the store. scope "order" discounts the whole
// subtotal; scope "product" discounts only the line items whose title
// appears in appliesTo. Keyed in uppercase so lookups are case-insensitive.
const coupons = {
  NOMAD10: {
    code: "NOMAD10",
    type: "percent",
    value: 10,
    scope: "order",
    description: "10% off your order"
  },
  WELCOME15: {
    code: "WELCOME15",
    type: "percent",
    value: 15,
    scope: "order",
    description: "15% off your order"
  },
  SIGNAL20: {
    code: "SIGNAL20",
    type: "percent",
    value: 20,
    scope: "product",
    appliesTo: ["Signal Drift"],
    description: "20% off Signal Drift"
  }
};
 
// Looks up a coupon code, case-insensitively and trimmed. Returns the coupon
// record, or null if the code doesn't exist — this is the existence check.
function getCoupon(code) {
  if (typeof code !== "string") return null;
  const normalized = code.trim().toUpperCase();
  if (normalized === "") return null;
  return coupons[normalized] || null;
}
 
// Rounds to the nearest cent to avoid floating-point artifacts like $12.000000000001.
function round2(amount) {
  return Math.round(amount * 100) / 100;
}
 
// Computes the dollar discount a coupon applies to a given set of cart items
// and subtotal. items: array of { title } (e.g. collectionItems).
function computeDiscount(items, subtotal, coupon) {
  if (!coupon) return 0;
 
  if (coupon.scope === "order") {
    return round2(subtotal * (coupon.value / 100));
  }
 
  if (coupon.scope === "product") {
    let eligibleTotal = 0;
    for (let i = 0; i < items.length; i++) {
      const product = products.find(function (p) { return p.title === items[i].title; });
      if (product && coupon.appliesTo.indexOf(product.title) !== -1) {
        eligibleTotal += product.price;
      }
    }
    return round2(eligibleTotal * (coupon.value / 100));
  }
 
  return 0;
}
 
// Loops over collectionItems, looks up each artwork's full product record by
// title, and renders the saved-item cards into the Collector Dashboard grid.
// Also updates the "Saved Items" and "Est. Value" stat outputs when present.
function renderCollection(items, gridId, statsIds) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
 
  grid.innerHTML = "";
  let totalValue = 0;
 
  for (let i = 0; i < items.length; i++) {
    const savedItem = items[i];
    const product = products.find(function (p) { return p.title === savedItem.title; });
    if (!product) continue;
 
    grid.appendChild(buildCollectionCard(product, savedItem));
    totalValue += product.price;
  }
 
  if (statsIds) {
    const countEl = statsIds.countId ? document.getElementById(statsIds.countId) : null;
    const valueEl = statsIds.valueId ? document.getElementById(statsIds.valueId) : null;
    if (countEl) countEl.textContent = items.length;
    if (valueEl) valueEl.textContent = currencyFormatter.format(totalValue);
  }
}
 