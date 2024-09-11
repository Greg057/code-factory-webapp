import db from '../db/queries.js'

async function getProjects(req, res) {
    const { interest, skillLevel } = req.query;
    const projects = await db.getFilteredProjects({ interest, skillLevel });
    res.render('index', { projects, interest, skillLevel })
}

async function getProjectDetails(req, res) {
    const { id } = req.params;
    try {
        const project = await db.getProjectById(id);
        const milestones = await db.getMilestonesByProjectId(id);
        if (project) {
            res.render('projectDetails', { project, milestones });
        } else {
            res.status(404).send('Project not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

export default { getProjects, getProjectDetails };
