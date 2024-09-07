import db from '../db/queries.js'

async function getProjects(req, res) {
    const { interest, skillLevel, techStack } = req.query;
    console.log(skillLevel)
    const projects = await db.getFilteredProjects({ interest, skillLevel, techStack });
    res.render('index', { projects, interest, skillLevel, techStack })
}

export default { getProjects }
