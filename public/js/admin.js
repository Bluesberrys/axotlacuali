document.addEventListener("DOMContentLoaded", () => {
  // Dialog confirmacion para formularios
  const dialog = document.getElementById("confirmDialog");
  const msg = document.getElementById("confirmMessage");
  const cancelBtn = document.getElementById("cancelBtn");
  const confirmBtn = document.getElementById("confirmBtn");
  let currentForm = null;

  if (dialog) {
    document.querySelectorAll("form.needs-confirm").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        currentForm = form;

        msg.textContent = form.dataset.confirm || "¿Estás seguro?";
        dialog.showModal();
      });
    });

    cancelBtn?.addEventListener("click", () => dialog.close());
    confirmBtn?.addEventListener("click", () => {
      if (currentForm) currentForm.submit();
      dialog.close();
    });
  }
  // Dialog editar restaurante
  const editResDialog = document.getElementById("editRestaurantDialog");
  if (editResDialog) {
    const form = document.getElementById("editRestaurantForm");

    const id = document.getElementById("editResId");
    const nombre = document.getElementById("editResNombre");
    const tipo = document.getElementById("editResTipo");
    const desc = document.getElementById("editResDesc");
    const horario = document.getElementById("editResHorario");
    const rango = document.getElementById("editResRango");
    const imagen = document.getElementById("editResImagen");
    const direccion = document.getElementById("editResDireccion");

    document.querySelectorAll(".edit-res-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        id.value = btn.dataset.id;
        nombre.value = btn.dataset.nombre || "";
        tipo.value = btn.dataset.tipo || "";
        desc.value = btn.dataset.descripcion || "";
        horario.value = btn.dataset.horario || "";
        rango.value = btn.dataset.rango || "";
        imagen.value = btn.dataset.imagen || "";
        direccion.value = btn.dataset.direccion || "";

        // Assign dynamic action URL
        form.action = `/admin/restaurantes/${btn.dataset.id}/editar`;

        editResDialog.showModal();
      });
    });

    document.getElementById("editResCancel")?.addEventListener("click", () => {
      editResDialog.close();
    });
  }
  // Dialog editar menu
  const editMenuDialog = document.getElementById("editMenuDialog");
  if (editMenuDialog) {
    const editForm = document.getElementById("editMenuForm");

    const inputId = document.getElementById("editMenuId");
    const inputPlato = document.getElementById("editPlato");
    const inputPrecio = document.getElementById("editPrecio");
    const inputPrecioMax = document.getElementById("editPrecioMax");

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        inputId.value = btn.dataset.id;
        inputPlato.value = btn.dataset.plato;
        inputPrecio.value = btn.dataset.precio;
        inputPrecioMax.value = btn.dataset.precioMax;

        editForm.action = `/admin/menus/${btn.dataset.id}/editar`;

        editMenuDialog.showModal();
      });
    });

    document.getElementById("editCancelBtn")?.addEventListener("click", () => {
      editMenuDialog.close();
    });
  }
});
