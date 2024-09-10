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

export default { getFilteredProjects };

