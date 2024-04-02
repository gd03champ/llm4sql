
const query = require('../db/database');

const descTable = async (req, res) => {
    try {
        const { describe } = req.query;
        const myQuery = describe === 'true' ? 'DESCRIBE ' : 'SHOW COLUMNS FROM ';
        const rows = await query(myQuery + req.params.databaseName + '.' + req.params.tableName);
        if (describe === 'true') {
            res.json(rows);
        } else {
            const columns = rows.map((row) => row.Field);
            res.json(columns);
        }
    } catch (err) {
        console.error('Error retrieving table information:', err);
        res.status(500).send('Error retrieving table information');
    }
}

module.exports = descTable;