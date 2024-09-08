import pool from "./pool.js";

async function getFilteredProjects(filters) {
    let query = 'SELECT * FROM projects WHERE 1=1';
    const values = [];

    // Append filters to the query
    if (filters.interest) {
        query += ' AND interest = $1';
        values.push(filters.interest);
    }
    if (filters.skillLevel) {
        query += ' AND skill_level = $2';
        values.push(filters.skillLevel);
    }

    const { rows } = await pool.query(query, values);
    return rows;
}

export default { getFilteredProjects };

