document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
  const btn = document.getElementById("ajoloteMenuBtn");
  const menu = document.getElementById("ajoloteMenu");

  if (btn && menu) {
    // Toggle open/close
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent triggering close-on-click-outside
      menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });

    // Prevent clicks inside the menu from closing it
    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
      menu.style.display = "none";
    });
  }
});
