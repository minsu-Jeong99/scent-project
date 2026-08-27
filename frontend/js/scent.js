document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const product  = params.get("product") || "";
  const scent    = params.get("scent")   || "";

  const scentTitle    = document.getElementById("scent-title");
  const shoppingTitle = document.getElementById("shopping-title");
  const fragranceList = document.getElementById("fragrance-list");
  const shoppingResults = document.getElementById("shopping-results");
  const paginationEl  = document.getElementById("pagination");
  const productCount  = document.getElementById("product-count");
  const breadcrumb    = document.getElementById("breadcrumb");
  const sortButton    = document.getElementById("sort-button");

  let currentItems = [];
  let currentPage  = 1;
  let totalPages   = 1;
  let sortOrder    = "asc";

  ScentApp.updateSortButton(sortButton, sortOrder);
  sortButton.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    ScentApp.updateSortButton(sortButton, sortOrder);
    ScentApp.renderProductCards(shoppingResults, ScentApp.sortByPrice(currentItems, sortOrder));
  });

  try {
    shoppingResults.innerHTML = '<p class="loading">상품을 검색하는 중…</p>';

    const data   = await ScentApp.fetchJson("/fragrances");
    const target = data.find((d) => d.product === product && d.scent_slug === scent);

    if (!target) {
      scentTitle.textContent = "해당 향 정보를 찾을 수 없습니다.";
      shoppingResults.innerHTML = "";
      return;
    }

    shoppingTitle.textContent = product;
    scentTitle.textContent    = target.scent;
    breadcrumb.innerHTML = `<a href="/pages/product.html?product=${encodeURIComponent(product)}">${product}</a>`;

    target.fragrances.forEach((frag) => {
      const tag = document.createElement("span");
      tag.className = "filter-tag";
      tag.textContent = frag.name;
      tag.addEventListener("click", () => {
        window.location.href = `/pages/fragrance.html?product=${encodeURIComponent(product)}&scent=${encodeURIComponent(scent)}&fragrance=${encodeURIComponent(frag.slug)}`;
      });
      fragranceList.appendChild(tag);
    });

    await loadPage(1);
  } catch (err) {
    console.error("Failed to load scent page:", err);
    shoppingResults.innerHTML = `<div class="error-state">${err.message}</div>`;
  }

  async function loadPage(page) {
    shoppingResults.innerHTML = '<p class="loading">상품을 검색하는 중…</p>';
    try {
      const data = await ScentApp.fetchScentProducts(product, scent, page, 20, null);
      currentItems = data.items;
      currentPage  = data.page;
      totalPages   = data.total_pages;

      if (productCount) productCount.innerHTML = `총 <strong>${data.total}</strong>개 상품`;

      ScentApp.renderProductCards(shoppingResults, ScentApp.sortByPrice(currentItems, sortOrder));
      ScentApp.renderPagination(paginationEl, currentPage, totalPages, loadPage);
    } catch (err) {
      shoppingResults.innerHTML = `<div class="error-state">${err.message}</div>`;
    }
  }
});
