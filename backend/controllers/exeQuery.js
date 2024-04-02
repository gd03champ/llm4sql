const query = require('../db/database');

const exeQuery = async (req, res) => {
    try {
        console.log(req.body);
        const { myQuery} = req.body;
        const { databaseName } = req.params;
        await query('USE ' + databaseName);
        const rows = await query(myQuery);
        console.log(rows);
        res.json(rows);
    } catch (err) {
        console.error('Error executing query:', err);
        res.send(err.sqlMessage);
    }
}

module.exports = exeQuery;