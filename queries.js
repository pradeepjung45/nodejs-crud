const Pool = require('pg').Pool;
const pool = new Pool({
    
    user: 'postgres',
    host: 'localhost',
    database: 'tutorial',
    password: '1234',
    port: 5432
});

const Response = require('./mode/response');

module.exports = pool;


async function queries() {
    try {
        const client = await pool.connect();
        console.log('connected');
        client.release();
    } catch (error) {
        console.error(error);
    }

}

queries();