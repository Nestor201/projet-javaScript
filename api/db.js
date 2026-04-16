const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'Fanomezantsoa',        // Remplace par ton utilisateur MySQL
  password: 'fanomezantsoa',        // Remplace par ton mot de passe MySQL
  database: 'projet_php_gestionboucherie'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});

module.exports = db;
