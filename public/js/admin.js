document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("confirmDialog");
  const msg = document.getElementById("confirmMessage");
  const cancelBtn = document.getElementById("cancelBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  let currentForm = null;

  // Attach to any form with the 'needs-confirm' class
  document.querySelectorAll("form.needs-confirm").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      currentForm = form;

      // Use data-confirm attribute or default message
      const customMsg = form.dataset.confirm || "¿Estás seguro?";
      msg.textContent = customMsg;

      dialog.showModal();
    });
  });

  cancelBtn.addEventListener("click", () => dialog.close());
  confirmBtn.addEventListener("click", () => {
    if (currentForm) currentForm.submit();
    dialog.close();
  });
});
