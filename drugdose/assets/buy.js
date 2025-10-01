// buy.js
// Mock product data for demo (replace with real API if available)

const mockProducts = [
  {
    name: "Paracetamol 500mg Tablet",
    img: "https://images.unsplash.com/photo-1588776814546-ec7e93716c6a?auto=format&fit=crop&w=400&q=80",
    price: 25,
    platform: "1mg",
    url: "https://www.1mg.com/search/all?name=paracetamol",
    reviews: [
      { user: "Amit", rating: 5, text: "Very effective for fever." },
      { user: "Priya", rating: 4, text: "Works well, no side effects." }
    ]
  },
  {
    name: "Paracetamol Syrup 60ml",
    img: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80",
    price: 35,
    platform: "Netmeds",
    url: "https://www.netmeds.com/catalogsearch/result?q=paracetamol",
    reviews: [
      { user: "Rahul", rating: 4, text: "Good for kids." }
    ]
  },
  {
    name: "Paracetamol Suspension 100ml",
    img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80",
    price: 50,
    platform: "PharmEasy",
    url: "https://pharmeasy.in/search/all?name=paracetamol",
    reviews: [
      { user: "Sneha", rating: 5, text: "Quick relief for fever." }
    ]
  }
];

let cart = [];

function renderFilters(platforms) {
  const filterDiv = document.getElementById('productFilters');
  let html = '<label style="margin-right:10px;">Platform:</label>';
  html += '<select id="platformFilter" style="margin-right:18px;">';
  html += '<option value="">All</option>';
  platforms.forEach(p => html += `<option value="${p}">${p}</option>`);
  html += '</select>';
  html += '<label style="margin-right:10px;">Max Price:</label>';
  html += '<input type="number" id="priceFilter" min="0" style="width:80px;">';
  html += '<button onclick="showProducts()" style="margin-left:14px;">Apply</button>';
  filterDiv.innerHTML = html;
}

function addToCart(product) {
  cart.push(product);
  renderCart();
}

function renderCart() {
  const cartDiv = document.getElementById('cartBox');
  if (!cartDiv) return;
  if (cart.length === 0) {
    cartDiv.innerHTML = '<span style="color:#64748b;">Cart is empty.</span>';
    return;
  }
  let html = '<h3 style="margin-bottom:8px;">Cart</h3><ul style="padding-left:18px;">';
  cart.forEach((item, idx) => {
    html += `<li>${item.name} <span style='color:#16a34a;'>₹${item.price}</span> <button onclick='removeFromCart(${idx})' style='margin-left:8px;font-size:0.9em;'>Remove</button></li>`;
  });
  html += '</ul>';
  html += `<div style='margin-top:8px;font-weight:600;'>Total: ₹${cart.reduce((sum, i) => sum + i.price, 0)}</div>`;
  cartDiv.innerHTML = html;
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}

// --- Drug name validation and correction ---
const validDrugList = [
  "paracetamol", "ibuprofen", "amoxicillin", "azithromycin", "metformin", "atorvastatin", "omeprazole", "amitriptyline", "cetirizine", "ciprofloxacin", "doxycycline", "lisinopril", "losartan", "simvastatin", "levothyroxine", "amlodipine", "clopidogrel", "pantoprazole", "gabapentin", "tramadol"
];

function getClosestDrugName(input) {
  let minDist = 999, closest = null;
  validDrugList.forEach(drug => {
    const dist = levenshtein(input, drug);
    if (dist < minDist) {
      minDist = dist;
      closest = drug;
    }
  });
  return (minDist <= 2) ? closest : null;
}

function levenshtein(a, b) {
  const dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function showProducts() {
  console.log('showProducts called');
  const drug = document.getElementById('buyDrugName').value.trim().toLowerCase();
  console.log('Drug input:', drug);
  const listDiv = document.getElementById('productList');
  const filterDiv = document.getElementById('productFilters');
  if (!filterDiv.innerHTML) {
    // Render filters on first search
    const platforms = [...new Set(mockProducts.map(p => p.platform))];
    renderFilters(platforms);
  }
  listDiv.innerHTML = '';
  if (!drug) {
    listDiv.innerHTML = '<span style="color:#e11d48;">Please enter a medicine name.</span>';
    return;
  }
  // Validate drug name
  if (!validDrugList.includes(drug)) {
    const suggestion = getClosestDrugName(drug);
    if (suggestion) {
      listDiv.innerHTML = `<span style='color:#eab308;'>Did you mean <b>${suggestion}</b>? <button onclick=\"document.getElementById('buyDrugName').value='${suggestion}';showProducts();\">Yes</button></span>`;
    } else {
      listDiv.innerHTML = '<span style="color:#e11d48;">No such medicine found. Please check the spelling.</span>';
    }
    return;
  }
  // Filter mock products by drug name (simple contains)
  let filtered = mockProducts.filter(p => p.name.toLowerCase().includes(drug));
  // Apply platform filter
  const platform = document.getElementById('platformFilter')?.value;
  if (platform) filtered = filtered.filter(p => p.platform === platform);
  // Apply price filter
  const maxPrice = document.getElementById('priceFilter')?.value;
  if (maxPrice) filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
  if (filtered.length === 0) {
    // Try to fetch from internet (1mg, Netmeds, PharmEasy)
    listDiv.innerHTML = '<span style="color:#64748b;">No local products found. Searching online...</span>';
    fetchInternetProducts(drug, listDiv);
    return;
  }
  let html = '<div class="product-grid">';
  filtered.forEach((prod, idx) => {
    html += `<div class="product-card">
      <img src="${prod.img}" alt="${prod.name}" class="product-img">
      <div class="product-info">
        <div class="product-title">${prod.name}</div>
        <div class="product-price">₹${prod.price}</div>
        <div style='margin-bottom:8px;'><button onclick='addToCart(mockProducts[${mockProducts.findIndex(p=>p.name===prod.name)}])' class='buy-btn' style='margin-bottom:4px;'>Add to Cart</button> <a href="${prod.url}" target="_blank" class="buy-btn" style='background:#16a34a;margin-left:6px;'>Buy on ${prod.platform}</a></div>
        <div class='product-reviews' style='margin-top:8px;'>
          <b>Reviews:</b>
          <ul style='padding-left:18px;'>
            ${(prod.reviews||[]).map(r=>`<li><span style='color:#facc15;'>${'★'.repeat(r.rating)}</span> <b>${r.user}:</b> ${r.text}</li>`).join('')||'<li>No reviews yet.</li>'}
          </ul>
        </div>
      </div>
    </div>`;
  });
  html += '</div>';
  listDiv.innerHTML = html;
  renderCart();
}

// Fetch product links from 1mg, Netmeds, PharmEasy
function fetchInternetProducts(drug, listDiv) {
  console.log('Fetching internet products for:', drug);
  // Always use company logos for product images
  const oneMgUrl = `https://www.1mg.com/search/all?name=${encodeURIComponent(drug)}`;
  let html = '<div class="product-grid">';
  html += `<div class="product-card">
    <img src="https://onemg.gumlet.io/1mg_logo.png" alt="1mg" class="product-img" style="max-width:120px;max-height:60px;object-fit:contain;">
    <div class="product-info">
      <div class="product-title">${drug.charAt(0).toUpperCase() + drug.slice(1)} on 1mg</div>
      <a href="${oneMgUrl}" target="_blank" class="buy-btn" style="background:#2563eb;">View on 1mg</a>
    </div>
  </div>`;
  html += `<div class="product-card">
    <img src="https://www.netmeds.com/images/cms/wysiwyg/cms/Netmeds_New_Logo.png" alt="Netmeds" class="product-img" style="max-width:120px;max-height:60px;object-fit:contain;">
    <div class="product-info">
      <div class="product-title">${drug.charAt(0).toUpperCase() + drug.slice(1)} on Netmeds</div>
      <a href="https://www.netmeds.com/catalogsearch/result?q=${encodeURIComponent(drug)}" target="_blank" class="buy-btn" style="background:#2563eb;">View on Netmeds</a>
    </div>
  </div>`;
  html += `<div class="product-card">
    <img src="https://assets.pharmeasy.in/web-assets/dist/fca22bc9.png" alt="PharmEasy" class="product-img" style="max-width:120px;max-height:60px;object-fit:contain;">
    <div class="product-info">
      <div class="product-title">${drug.charAt(0).toUpperCase() + drug.slice(1)} on PharmEasy</div>
      <a href="https://pharmeasy.in/search/all?name=${encodeURIComponent(drug)}" target="_blank" class="buy-btn" style="background:#2563eb;">View on PharmEasy</a>
    </div>
  </div>`;
  html += `<div class="product-card">
    <img src="https://newassets.apollo247.com/images/ic_logo.png" alt="Apollo Pharmacy" class="product-img" style="max-width:120px;max-height:60px;object-fit:contain;">
    <div class="product-info">
      <div class="product-title">${drug.charAt(0).toUpperCase() + drug.slice(1)} on Apollo Pharmacy</div>
      <a href="https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(drug)}" target="_blank" class="buy-btn" style="background:#2563eb;">View on Apollo</a>
    </div>
  </div>`;
  html += `<div class="product-card">
    <img src="https://www.1mg.com/favicon/android-chrome-192x192.png" alt="Tata 1mg" class="product-img" style="max-width:120px;max-height:60px;object-fit:contain;">
    <div class="product-info">
      <div class="product-title">${drug.charAt(0).toUpperCase() + drug.slice(1)} on Tata 1mg (Official)</div>
      <a href="https://www.1mg.com/search/all?name=${encodeURIComponent(drug)}" target="_blank" class="buy-btn" style="background:#2563eb;">View on Tata 1mg</a>
    </div>
  </div>`;
  html += '</div>';
  listDiv.innerHTML = html;

  // Ensure global access for button onclick

  window.showProducts = showProducts;
  window.fetchInternetProducts = fetchInternetProducts;
}


