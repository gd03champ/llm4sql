const express = require('express');
const cors = require('cors'); // Allow Cross-Origin Requests
const app = express();
app.use(express.json());
app.use(cors());


// Import controllers
const getDatabases = require('./controllers/getDatabases');
const getTables = require('./controllers/getTables');
const descTable = require('./controllers/descTable');
const exeQuery = require('./controllers/exeQuery');
const aiQuery = require('./controllers/aiQuery');


// Endpoint to retrieve available databases
app.get('/api/databases', getDatabases);

// Endpoint to retrieve tables for a selected database
app.get('/api/tables/:databaseName', getTables);

// Endpoint to retrieve columns or describe a table for a selected database and table
app.get('/api/tabledata/:databaseName/:tableName', descTable);

// Endpoint to execute a query on the selected database
app.post('/api/query/:databaseName', exeQuery);

// Endpoint to get AI query
app.post('/api/aiquery', aiQuery);

app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
