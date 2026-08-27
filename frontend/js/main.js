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

    products.forEach((product) => {
      const scents = allData.filter((d) => d.product === product);

      const card = document.createElement("div");
      card.className = "category-card";
      card.addEventListener("click", () => {
        window.location.href = `/pages/product.html?product=${encodeURIComponent(product)}`;
      });

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
