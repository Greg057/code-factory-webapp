document.querySelectorAll('.project-item').forEach(project => {
    project.addEventListener('click', () => {
        const projectId = project.getAttribute('data-id');
        window.location.href = `/projects/${projectId}`;
    })
})