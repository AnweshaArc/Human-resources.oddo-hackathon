// Shared across all pages: highlights the current page in the nav bar.
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.main-nav a').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// =====================================
// HELP POPUP
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const helpBtn = document.getElementById("helpBtn");
    const helpPopup = document.getElementById("helpPopup");
    const closeHelp = document.getElementById("closeHelp");

    if (!helpBtn || !helpPopup || !closeHelp) return;

    helpBtn.addEventListener("click", () => {

        helpPopup.style.display = "block";

    });

    closeHelp.addEventListener("click", () => {

        helpPopup.style.display = "none";

    });

    window.addEventListener("click", (event) => {

        if (event.target === helpPopup) {

            helpPopup.style.display = "none";

        }

    });

});