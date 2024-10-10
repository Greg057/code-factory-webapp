import pkg from 'pg';
import 'dotenv/config'
const { Pool } = pkg;

export default new Pool({
    connectionString: process.env.DATABASE_URL
});