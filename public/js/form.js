document.querySelectorAll('.filter-by').forEach(filterOption => {
    filterOption.addEventListener('click', function() {
        const target = document.getElementById(this.getAttribute('data-target'));
        
        // Hide other filter options
        document.querySelectorAll('.filter-options').forEach(option => {
            if (option !== target) {
                option.style.display = 'none';
            }
        });
        
        // Toggle the clicked filter options
        if (target.style.display === 'none' || target.style.display === '') {
            target.style.display = 'block';
        } else {
            target.style.display = 'none';
        }
    });
});
