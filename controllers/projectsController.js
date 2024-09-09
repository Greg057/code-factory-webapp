import db from '../db/queries.js'

async function getProjects(req, res) {
    const { interest, skillLevel } = req.query;
    const projects = await db.getFilteredProjects({ interest, skillLevel });
    res.render('index', { projects, interest, skillLevel })
}

export default { getProjects }
