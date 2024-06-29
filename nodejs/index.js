const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const config = {
  host: process.env.MYSQL_HOST || 'mdb',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'nodedb',
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(config);

  connection.connect(function(err) {
    if (err) {
      console.error('Error connecting to database:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connected to database successfully!');
    }
  });

  connection.on('error', function(err) {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

const insertQuery = "INSERT INTO people (name) VALUES ('Marco Comarella')";
connection.query(insertQuery)

app.get('/', (req, res) => {
  const selectQuery = 'SELECT name FROM people';
  connection.query(selectQuery, (error, results, fields) => {
    if (error) throw error;

    const names = results.map(result => `<li>${result.name}</li>`).join('');
    const responseHTML = `<h1>Full Cycle Rocks!</h1><ul>${names}</ul>`;

    res.send(responseHTML);
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
