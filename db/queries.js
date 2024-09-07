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
    if (filters.techStack) {
        query += ' AND technologies ILIKE $3'; // Assuming tech_stack is a text field and using ILIKE for partial matching
        values.push(`%${filters.techStack}%`);
    }

    const { rows } = await pool.query(query, values);
    return rows;
}

export default { getFilteredProjects };

