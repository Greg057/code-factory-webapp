import pool from "./pool.js";

async function getFilteredProjects(filters) {
    let query = 'SELECT * FROM projects WHERE 1=1';
    const values = [];
    let param = 1

    // Append filters to the query
    if (filters.interest) {
        query += ` AND interest = $${param}`;
        values.push(filters.interest);
        param++
    }
    if (filters.skillLevel) {
        query += ` AND skill_level = $${param}`;
        values.push(filters.skillLevel);
        param++
    }

    const { rows } = await pool.query(query, values);
    return rows;
}

async function getProjectById(id) {
    const query = `SELECT * FROM projects WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function getMilestonesByProjectId(projectId) {
    const query = `SELECT * FROM milestones WHERE project_id = $1 ORDER BY id`;
    const result = await pool.query(query, [projectId]);
    return result.rows;
}

export default { getFilteredProjects, getProjectById, getMilestonesByProjectId };

