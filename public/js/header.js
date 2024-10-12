function updateHeaderText() {
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
        // Remove any existing text nodes
        Array.from(headerTitle.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                headerTitle.removeChild(node);
            }
        });

        // Add new text node based on window width
        const textContent = window.innerWidth < 575 ? '' : 'Code Factory';
        headerTitle.appendChild(document.createTextNode(textContent));
    }
}

// Update on load
updateHeaderText();

// Update on resize
window.addEventListener('resize', updateHeaderText);