"use strict";

const deleteBtns = document.querySelectorAll(".btnDelete");

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", async () => {
    try {
      const prodId =
        deleteBtn.parentNode.querySelector("[name=productId]").value;
      const result = await fetch("/admin/product/" + prodId, {
        method: "DELETE",
      });
      const data = await result.json();
      const productElement = deleteBtn.closest("article");
      productElement?.remove();
    } catch (error) {
      console.error("error");
    }
  });
});
