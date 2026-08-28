(function () {
  const API_BASE_URL =
    window.SCENT_API_BASE_URL ||
    localStorage.getItem("SCENT_API_BASE_URL") ||
    "";

  async function fetchJson(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || `API request failed: ${response.status}`);
    }
    return payload;
  }

  async function fetchScentProducts(product, scentSlug, page, perPage, fragranceSlug) {
    let path = `/fragrances/${encodeURIComponent(product)}/${encodeURIComponent(scentSlug)}/products?page=${page}&per_page=${perPage}`;
    if (fragranceSlug) path += `&fragrance=${encodeURIComponent(fragranceSlug)}`;
    return fetchJson(path);
  }

  function renderPagination(container, currentPage, totalPages, onPageChange) {
    container.innerHTML = "";
    if (totalPages <= 1) return;

    const btn = (label, page, disabled, active) => {
      const el = document.createElement("button");
      el.className = `pagination__btn${active ? " is-active" : ""}`;
      el.textContent = label;
      el.disabled = disabled;
      if (!disabled) el.addEventListener("click", () => onPageChange(page));
      return el;
    };

    const ellipsis = () => {
      const el = document.createElement("span");
      el.className = "pagination__ellipsis";
      el.textContent = "…";
      return el;
    };

    container.appendChild(btn("이전", currentPage - 1, currentPage === 1, false));

    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end   = Math.min(totalPages, currentPage + delta);

    if (start > 1) {
      container.appendChild(btn("1", 1, false, false));
      if (start > 2) container.appendChild(ellipsis());
    }
    for (let i = start; i <= end; i++) {
      container.appendChild(btn(String(i), i, false, i === currentPage));
    }
    if (end < totalPages) {
      if (end < totalPages - 1) container.appendChild(ellipsis());
      container.appendChild(btn(String(totalPages), totalPages, false, false));
    }

    container.appendChild(btn("다음", currentPage + 1, currentPage === totalPages, false));
  }

  function stripHtml(html) {
    const el = document.createElement("div");
    el.innerHTML = html || "";
    return el.textContent || el.innerText || "";
  }

  function formatPrice(value) {
    const n = Number.parseInt(value, 10);
    return Number.isNaN(n) ? "가격 정보 없음" : `${n.toLocaleString("ko-KR")}원`;
  }

  function sortByPrice(items, order) {
    return [...items].sort((a, b) => {
      const pa = Number.parseInt(a.lprice, 10);
      const pb = Number.parseInt(b.lprice, 10);
      if (Number.isNaN(pa) && Number.isNaN(pb)) return 0;
      if (Number.isNaN(pa)) return 1;
      if (Number.isNaN(pb)) return -1;
      return order === "asc" ? pa - pb : pb - pa;
    });
  }

  function renderProductCards(container, items) {
    container.innerHTML = "";

    if (!items.length) {
      container.innerHTML = '<p class="empty-state">관련 상품이 없습니다.</p>';
      return;
    }

    items.forEach((item) => {
      const title = stripHtml(item.title || "상품명 없음");
      const card = document.createElement("div");
      card.className = "product-card";

      const mediaHtml = item.image
        ? `<img src="${item.image}" alt="${title}" class="product-card__image">`
        : `<div class="product-card__no-image">No Image</div>`;

      const ctaLabel = item.mallName ? `${item.mallName}에서 보기 →` : "상품 보기 →";

      card.innerHTML = `
        <div class="product-card__media">
          ${mediaHtml}
          <a href="${item.link || "#"}" target="_blank" rel="noopener noreferrer" class="product-card__cta">${ctaLabel}</a>
        </div>
        <div class="product-card__body">
          ${item.mallName ? `<span class="product-card__mall">${item.mallName}</span>` : ""}
          <p class="product-card__title">${title}</p>
          <p class="product-card__price">${formatPrice(item.lprice)}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function updateSortButton(button, order) {
    button.textContent = order === "asc" ? "가격 낮은순" : "가격 높은순";
  }

  window.ScentApp = {
    API_BASE_URL,
    fetchJson,
    fetchScentProducts,
    formatPrice,
    renderPagination,
    renderProductCards,
    sortByPrice,
    stripHtml,
    updateSortButton,
  };
})();
