const query = require('../db/database');

const getTables = async (req, res) => {
    try {
        const rows = await query('SHOW TABLES FROM ' + req.params.databaseName);
        //console.log(rows);
        const tables = rows.map((row) => row['Tables_in_' + req.params.databaseName]);
        res.json(tables); // Adjust for your database name
    } catch (err) {
        console.error('Error retrieving tables:', err);
        res.status(500).send('Error retrieving tables : ' + err);
    }
}

module.exports = getTables;