function updateHeaderText() {
    const button = document.querySelector('.header-title');
    if (window.innerWidth < 526) {
        button.innerHTML = '<img src="/images/logo.png" alt="Code Factory Logo" class="header-logo">CF';
    } else {
        button.innerHTML = '<img src="/images/logo.png" alt="Code Factory Logo" class="header-logo">Code Factory';
    }
}

// Update on load
updateHeaderText();

// Update on resize
window.addEventListener('resize', updateHeaderText);