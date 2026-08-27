document.addEventListener("DOMContentLoaded", async () => {
  const params   = new URLSearchParams(window.location.search);
  const product  = params.get("product")   || "";
  const scent    = params.get("scent")     || "";
  const fragrance = params.get("fragrance") || "";

  const mainTitle       = document.getElementById("main-title");
  const subTitle        = document.getElementById("sub-title");
  const fragranceButtons = document.getElementById("fragrance-buttons");
  const productResults  = document.getElementById("product-results");
  const paginationEl    = document.getElementById("pagination");
  const productCount    = document.getElementById("product-count");
  const breadcrumb      = document.getElementById("breadcrumb");
  const sortButton      = document.getElementById("sort-button");

  let currentItems = [];
  let currentPage  = 1;
  let totalPages   = 1;
  let sortOrder    = "asc";

  ScentApp.updateSortButton(sortButton, sortOrder);
  sortButton.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    ScentApp.updateSortButton(sortButton, sortOrder);
    ScentApp.renderProductCards(productResults, ScentApp.sortByPrice(currentItems, sortOrder));
  });

  try {
    productResults.innerHTML = '<p class="loading">상품을 검색하는 중…</p>';

    const data       = await ScentApp.fetchJson("/fragrances");
    const scentGroup = data.find((d) => d.product === product && d.scent_slug === scent);

    if (!scentGroup) {
      mainTitle.textContent = "향 정보를 찾을 수 없습니다.";
      productResults.innerHTML = "";
      return;
    }

    const currentFrag = scentGroup.fragrances.find((f) => f.slug === fragrance);
    if (!currentFrag) {
      subTitle.textContent = "해당 세부 향을 찾을 수 없습니다.";
      productResults.innerHTML = "";
      return;
    }

    breadcrumb.innerHTML = `
      <a href="/pages/product.html?product=${encodeURIComponent(product)}">${product}</a>
      <a href="/pages/scent.html?product=${encodeURIComponent(product)}&scent=${encodeURIComponent(scent)}">${scentGroup.scent}</a>
    `;
    mainTitle.textContent = `${product} · ${scentGroup.scent}`;
    subTitle.textContent  = currentFrag.name;

    scentGroup.fragrances.forEach((f) => {
      const tag = document.createElement("span");
      tag.className = `filter-tag${f.slug === fragrance ? " is-active" : ""}`;
      tag.textContent = f.name;
      tag.addEventListener("click", () => {
        window.location.href = `/pages/fragrance.html?product=${encodeURIComponent(product)}&scent=${encodeURIComponent(scent)}&fragrance=${encodeURIComponent(f.slug)}`;
      });
      fragranceButtons.appendChild(tag);
    });

    await loadPage(1);
  } catch (err) {
    console.error("Failed to load fragrance page:", err);
    productResults.innerHTML = `<div class="error-state">${err.message}</div>`;
  }

  async function loadPage(page) {
    productResults.innerHTML = '<p class="loading">상품을 검색하는 중…</p>';
    try {
      const data = await ScentApp.fetchScentProducts(product, scent, page, 20, fragrance);
      currentItems = data.items;
      currentPage  = data.page;
      totalPages   = data.total_pages;

      if (productCount) productCount.innerHTML = `총 <strong>${data.total}</strong>개 상품`;

      ScentApp.renderProductCards(productResults, ScentApp.sortByPrice(currentItems, sortOrder));
      ScentApp.renderPagination(paginationEl, currentPage, totalPages, loadPage);
    } catch (err) {
      productResults.innerHTML = `<div class="error-state">${err.message}</div>`;
    }
  }
});
