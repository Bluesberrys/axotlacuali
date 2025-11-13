document.addEventListener("DOMContentLoaded", () => {
  const abrirBtns = document.querySelectorAll(".menu-btn");
  abrirBtns.forEach((btn, i) => {
    const modal = document.getElementById(`menuModal_${i + 1}`);
    const cerrar = document.getElementById(`cerrarMenu_${i + 1}`);

    if (modal && cerrar) {
      btn.onclick = () => modal.showModal();
      cerrar.onclick = () => modal.close();
      window.addEventListener("click", (e) => {
        if (e.target === modal) modal.close();
      });
    }
  });
});
