document.querySelectorAll('.project-item').forEach(project => {
    project.addEventListener('click', () => {
        const projectId = project.getAttribute('data-id');
        console.log('Project ID:', projectId);
        window.location.href = `/projects/${projectId}`;
    })
})