import db from '../db/queries.js'

async function getProjects(req, res) {
    const projects = await db.getAllProjects()
    res.render('index', {projects: projects})
}

export default { getProjects }
