document.addEventListener("DOMContentLoaded", async () => {
  const params  = new URLSearchParams(window.location.search);
  const product = params.get("product") || "";

  if (!product) { window.location.href = "/"; return; }

  const pageTitle       = document.getElementById("page-title");
  const scentsContainer = document.getElementById("scents-container");
  const productsContainer = document.getElementById("products-container");
  const paginationEl    = document.getElementById("pagination");
  const productCount    = document.getElementById("shopping-title");
  const sortButton      = document.getElementById("sort-button");

  let currentItems = [];
  let currentPage  = 1;
  let totalPages   = 1;
  let sortOrder    = "asc";

  if (pageTitle) pageTitle.textContent = product;

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `<a href="/">홈</a>`;
  }

  ScentApp.updateSortButton(sortButton, sortOrder);
  sortButton.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    ScentApp.updateSortButton(sortButton, sortOrder);
    ScentApp.renderProductCards(productsContainer, ScentApp.sortByPrice(currentItems, sortOrder));
  });

  try {
    scentsContainer.innerHTML = '<p class="loading">향 정보를 불러오는 중…</p>';
    productsContainer.innerHTML = '<p class="loading">상품을 검색하는 중…</p>';

    const data   = await ScentApp.fetchJson("/fragrances");
    const scents = data.filter((d) => d.product === product);

    if (!scents.length) {
      scentsContainer.innerHTML = '<p class="empty-state">해당 제품 정보를 찾을 수 없습니다.</p>';
      productsContainer.innerHTML = "";
      return;
    }

    renderScents(scents);
    await loadPage(1);
  } catch (err) {
    console.error("Failed to load product page:", err);
    productsContainer.innerHTML = `<div class="error-state">${err.message}</div>`;
  }

  async function loadPage(page) {
    productsContainer.innerHTML = '<p class="loading">상품을 검색하는 중…</p>';
    try {
      const data = await ScentApp.fetchJson(
        `/fragrances/${encodeURIComponent(product)}/products?page=${page}&per_page=20`
      );
      currentItems = data.items;
      currentPage  = data.page;
      totalPages   = data.total_pages;

      if (productCount) productCount.innerHTML = `총 <strong>${data.total}</strong>개 상품`;

      ScentApp.renderProductCards(productsContainer, ScentApp.sortByPrice(currentItems, sortOrder));
      ScentApp.renderPagination(paginationEl, currentPage, totalPages, loadPage);
    } catch (err) {
      productsContainer.innerHTML = `<div class="error-state">${err.message}</div>`;
    }
  }

  function renderScents(scents) {
    scentsContainer.innerHTML = "";
    scents.forEach((item) => {
      const card = document.createElement("div");
      card.className = "scent-card";
      card.addEventListener("click", () => {
        window.location.href = `/pages/scent.html?product=${encodeURIComponent(product)}&scent=${encodeURIComponent(item.scent_slug)}`;
      });

      const name = document.createElement("h2");
      name.className = "scent-card__name";
      name.textContent = item.scent;

      const tags = document.createElement("div");
      tags.className = "scent-card__tags";

      (item.fragrances || []).forEach((frag) => {
        const tag = document.createElement("span");
        tag.className = "scent-card__tag";
        tag.textContent = frag.name;
        tags.appendChild(tag);
      });

      card.appendChild(name);
      card.appendChild(tags);
      scentsContainer.appendChild(card);
    });
  }
});
