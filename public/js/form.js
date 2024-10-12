document.querySelectorAll('.filter-by').forEach(filterOption => {
    filterOption.addEventListener('click', function() {
        const target = document.getElementById(this.getAttribute('data-target'));
        
        // Hide other filter options
        document.querySelectorAll('.filter-options').forEach(option => {
            if (option !== target) {
                option.style.display = 'none';
            }
        });
        
        // Show the clicked filter options
        target.style.display = 'block';
    });
});

document.querySelectorAll('.filter-options .option').forEach(option => {
    option.addEventListener('click', function() {
        const filterOptions = this.closest('.filter-options');
        const filterBy = filterOptions.id === 'interest-options' ? 'interest' : 'skillLevel';
        
        // Find the corresponding filter text element
        const filterText = document.querySelector(`#filter-by-${filterBy} .filter-text`);
        
        if (filterText) {
            filterText.textContent = this.textContent;
            document.querySelector(`input[name="${filterBy}"]`).value = this.getAttribute('data-value');
            
            // Hide the entire filter-options element after selection
            filterOptions.style.display = 'none';
        } else {
            console.error(`Filter text element for ${filterBy} not found.`);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    function updateButtonText() {
        const button = document.getElementById('apply-filters-btn');
        if (window.innerWidth < 491) {
            button.textContent = 'Apply';
        } else {
            button.textContent = 'Apply Filters';
        }
    }

    // Update on load
    updateButtonText();

    // Update on resize
    window.addEventListener('resize', updateButtonText);
});