const util = require('util');
const mysql = require('mysql');

// Database connection configuration (replace with your credentials)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '2003',
    database: 'practice'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database successfully!');
    }
});

// to use async await syntax with mysql, they should be promisified
// they don't support promises by default
const query = util.promisify(connection.query).bind(connection);

module.exports = query;