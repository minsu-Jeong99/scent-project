document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("product-container");

  container.innerHTML = '<div class="loading">불러오는 중…</div>';

  try {
    const allData = await ScentApp.fetchJson("/fragrances");
    render(allData);
  } catch (err) {
    console.error("Failed to load fragrances:", err);
    container.innerHTML = `<div class="error-state">${err.message}</div>`;
  }

  function render(allData) {
    container.innerHTML = "";

    if (!allData.length) {
      container.innerHTML = '<div class="empty-state">표시할 데이터가 없습니다.</div>';
      return;
    }

    const products = [...new Set(allData.map((d) => d.product))];

    const iconMap = {
      shampoo: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v4h-4z"/><path d="M12 6v2"/><rect x="7" y="8" width="10" height="14" rx="3"/><path d="M7 14h10"/></svg>',
      bodywash: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h-6a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4z"/><path d="M12 3v4"/><circle cx="12" cy="14" r="2"/></svg>',
      handcream: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7"/><rect x="5" y="11" width="14" height="11" rx="3"/></svg>',
      perfume: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5h4"/><path d="M12 5V3"/><rect x="7" y="5" width="10" height="3" rx="1"/><path d="M8 8v2a8 8 0 0 0 8 0V8"/><path d="M6 12a6 6 0 0 0 12 0v-2H6z"/><path d="M6 12v4a6 6 0 0 0 12 0v-4"/></svg>',
    };
    const defaultIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><circle cx="12" cy="16" r=".5" fill="currentColor"/></svg>';

    products.forEach((product) => {
      const scents = allData.filter((d) => d.product === product);

      const card = document.createElement("div");
      card.className = "category-card";
      card.addEventListener("click", () => {
        window.location.href = `/pages/product.html?product=${encodeURIComponent(product)}`;
      });

      const icon = document.createElement("div");
      icon.className = "category-card__icon";
      icon.innerHTML = iconMap[product.toLowerCase()] || defaultIcon;
      card.appendChild(icon);

      const head = document.createElement("div");
      head.className = "category-card__head";

      const info = document.createElement("div");

      const name = document.createElement("h2");
      name.className = "category-card__name";
      name.textContent = product;

      const meta = document.createElement("p");
      meta.className = "category-card__meta";
      meta.textContent = `${scents.length}가지 향 계열`;

      info.appendChild(name);
      info.appendChild(meta);

      const arrow = document.createElement("div");
      arrow.className = "category-card__arrow";
      arrow.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3.5 9h11M10 4.5L14.5 9 10 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

      head.appendChild(info);
      head.appendChild(arrow);

      const scentList = document.createElement("div");
      scentList.className = "category-card__scents";

      scents.forEach((item) => {
        const tag = document.createElement("span");
        tag.className = "category-card__scent";
        tag.textContent = item.scent;
        tag.addEventListener("click", (e) => {
          e.stopPropagation();
          window.location.href = `/pages/scent.html?product=${encodeURIComponent(product)}&scent=${encodeURIComponent(item.scent_slug)}`;
        });
        scentList.appendChild(tag);
      });

      card.appendChild(head);
      card.appendChild(scentList);
      container.appendChild(card);
    });
  }
});
