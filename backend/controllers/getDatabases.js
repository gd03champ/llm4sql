
const query = require('../db/database');

const getDatabases = async (req, res) => {
    try {
        const rows = await query('SHOW DATABASES');
        const databases = rows.map((row) => row.Database);
        res.json(databases);
    } catch (err) {
        console.error('Error retrieving databases:', err);
        res.status(500).send('Error retrieving databases');
    }
}

module.exports = getDatabases;