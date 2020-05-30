const express = require('express');
const bodyParser = require('body-parser');

// Database
const db = require('./config/database');

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('error: ' + err));

const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Rotas
app.use(require('./routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
