const query = require('../db/database');

const descTableForAI = async (databaseName, tableName) => {
    try {
        const rows = await query('SHOW COLUMNS FROM ' + databaseName + '.' + tableName);
        //console.log('Rows:', rows); //for more details about each column
        const columns = rows.map((row) => row.Field);
        return (columns);    
    } catch (err) {
        console.error('Error retrieving table information:', err);
        throw err;
    }
};

const promptAI = async (prompt) => {

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: 'sqlcoder', prompt, stream: false})
    });

    console.log('prompting ai with data');
    const result = await response.json();
    console.log(result.response);
    return(result.response);
};

const aiQuery = async (req, res) => {
    try {
        console.log('AI Query req incoming: ', req.body);
        const { input, database, tables } = req.body;

        let tablesData = "";

        for(const table of tables) {
            const desc = await descTableForAI(database, table);
            tablesData += `${table} : {Columns: ${desc}}\n`;
        }

        const prompt =
`
In the database named:  ${database}, 
you have the following tables and their columns as follows:
${tablesData}
Write a query to perform the following task: ** ${input} **
Write only query, don't give any explainations or other context about it
Remember that the query should be valid SQL syntax and joins are preferred if needed rather than subqueries
Also keep note that the query should be optimized and should not be too complex. Keep it as simple as possible
`

        console.log(prompt);

        const response = await promptAI(prompt);

        res.send(response);

    } catch (err) {
        console.error('Error executing AI query:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = aiQuery;
