import pool from "./pool.js";

async function getAllProjects() {
    const { rows } = await pool.query("SELECT * FROM projects")
    return rows
}

export default { getAllProjects }
