document.addEventListener("DOMContentLoaded", () => {
  const navState = document.getElementById("nav-state");
  if (!navState) return;

  const params    = new URLSearchParams(window.location.search);
  const product   = params.get("product");
  const scent     = params.get("scent");
  const fragrance = params.get("fragrance");

  if (fragrance && scent && product) {
    navState.textContent = `${product} · ${scent} · ${fragrance}`;
  } else if (scent && product) {
    navState.textContent = `${product} · ${scent}`;
  } else if (product) {
    navState.textContent = product;
  }
});
