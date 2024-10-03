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

document.addEventListener('DOMContentLoaded', () => {
    // Function to update the filter text
    function updateFilterText() {
        const interestText = document.querySelector('#filter-by-interest .filter-text');
        const skillLevelText = document.querySelector('#filter-by-skill-level .filter-text');
        
        // Get selected interest
        const interestSelect = document.querySelector('#interest-select');
        const selectedInterest = interestSelect.options[interestSelect.selectedIndex].text;
        interestText.textContent = selectedInterest === 'All interests' ? 'All interests' : selectedInterest;
        
        // Update skill level filter text
        const skillLevelSelect = document.querySelector('#skill-options select');
        const selectedSkillLevel = skillLevelSelect.options[skillLevelSelect.selectedIndex].text;
        skillLevelText.textContent = selectedSkillLevel === 'All skill levels' ? 'All skill levels' : selectedSkillLevel;
    }

    // Attach event listener to interest select
    document.querySelector('#interest-select').addEventListener('change', updateFilterText);

    // Attach event listener to skill level select
    document.querySelector('#skill-options select').addEventListener('change', updateFilterText);
});
