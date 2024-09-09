import pool from "./pool.js";

async function getFilteredProjects(filters) {
    let query = 'SELECT * FROM projects WHERE 1=1';
    const values = [];
    let count = 1

    // Append filters to the query
    if (filters.interest) {
        console.log(filters.interest)
        query += ` AND interest = $${count}`;
        values.push(filters.interest);
        count++
    }
    if (filters.skillLevel) {
        query += ` AND skill_level = $${count}`;
        values.push(filters.skillLevel);
        count++
    }

    const { rows } = await pool.query(query, values);
    return rows;
}

export default { getFilteredProjects };

