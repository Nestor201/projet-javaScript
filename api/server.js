const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Connexion à la base de données
const pool = mysql.createPool({
  host: 'localhost',
  user: 'Fanomezantsoa',
  password: 'fanomezantsoa',
  database: 'projet_php_gestionboucherie',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/*// Test
app.get('/', (req, res) => {
  res.send('API Boucherie opérationnelle');
});
*/
// === ROUTES CLIENTS ===

// Ajouter
app.post('/clients', async (req, res) => {
  try {
    const { nomCli, prenomCli, adressCli, telCli, sexe } = req.body;
    if (!nomCli || !prenomCli || !adressCli || !telCli || !sexe) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const [result] = await pool.query(
      `INSERT INTO client (nomCli, prenomCli, adressCli, telCli, sexe) VALUES (?, ?, ?, ?, ?)`,
      [nomCli, prenomCli, adressCli, telCli, sexe]
    );
    res.json({ codeCli: result.insertId, nomCli, prenomCli, adressCli, telCli, sexe });
  } catch (error) {
    console.error('Erreur POST /clients =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Modifier
app.put('/clients/:codeCli', async (req, res) => {
  try {
    const { codeCli } = req.params;
    const { nomCli, prenomCli, adressCli, telCli, sexe } = req.body;
    const [result] = await pool.query(
      `UPDATE client SET nomCli=?, prenomCli=?, adressCli=?, telCli=?, sexe=? WHERE codeCli=?`,
      [nomCli, prenomCli, adressCli, telCli, sexe, codeCli]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Client non trouvé' });
    res.json({ message: 'Client modifié avec succès' });
  } catch (error) {
    console.error('Erreur PUT /clients/:codeCli =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer
app.delete('/clients/:codeCli', async (req, res) => {
  try {
    const { codeCli } = req.params;
    const [result] = await pool.query(`DELETE FROM client WHERE codeCli=?`, [codeCli]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Client non trouvé' });
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Erreur DELETE /clients/:codeCli =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Lister
app.get('/clients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM client');
    res.json(rows);
  } catch (error) {
    console.error('Erreur GET /clients =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Rechercher un client par ID
app.get('/clients/:codeCli', async (req, res) => {
  try {
    const { codeCli } = req.params;
    const [rows] = await pool.query('SELECT * FROM client WHERE codeCli = ?', [codeCli]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur GET /clients/:codeCli =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// === ROUTES ARTICLES ===

// Ajouter
app.post('/articles', async (req, res) => {
  try {
    const { nomArt, prix, Stock_disponible } = req.body;
    if (!nomArt || prix == null || Stock_disponible == null) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const [result] = await pool.query(
      'INSERT INTO article (nomArt, prix, Stock_disponible) VALUES (?, ?, ?)',
      [nomArt, prix, Stock_disponible]
    );
    res.json({ codeArt: result.insertId, nomArt, prix, Stock_disponible });
  } catch (error) {
    console.error('Erreur POST /articles =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Modifier
app.put('/articles/:codeArt', async (req, res) => {
  try {
    const { codeArt } = req.params;
    const { nomArt, prix, Stock_disponible } = req.body;
    const [result] = await pool.query(
      'UPDATE article SET nomArt=?, prix=?, Stock_disponible=? WHERE codeArt=?',
      [nomArt, prix, Stock_disponible, codeArt]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Article non trouvé' });
    res.json({ message: 'Article modifié avec succès' });
  } catch (error) {
    console.error('Erreur PUT /articles/:codeArt =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer
app.delete('/articles/:codeArt', async (req, res) => {
  try {
    const { codeArt } = req.params;
    const [result] = await pool.query('DELETE FROM article WHERE codeArt=?', [codeArt]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Article non trouvé' });
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error('Erreur DELETE /articles/:codeArt =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Lister
app.get('/articles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM article');
    res.json(rows);
  } catch (error) {
    console.error('Erreur GET /articles =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// Rechercher un article par codeArt
app.get('/articles/:codeArt', async (req, res) => {
  try {
    const { codeArt } = req.params;
    console.log('Recherche article codeArt:', codeArt);

    const [results] = await pool.query('SELECT * FROM article WHERE codeArt = ?', [codeArt]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('Erreur GET /articles/:codeArt =>', error);  // <- détail de l’erreur
    res.status(500).json({ message: 'Erreur serveur' });
  }
});







// === ROUTES COMMANDES ===

// Lister toutes les commandes (5 champs seulement)
app.get('/commandes', async (req, res) => {
  try {
    const sql = `
      SELECT
        c.idCOM,
        c.codeCli,
        c.codeArt,
        cl.nomCli,
        cl.prenomCli,
        a.nomArt,
        a.prix,
        c.QteCom,
        c.dateCom,
        (c.QteCom * a.prix) AS total
      FROM commande c
      JOIN client cl ON c.codeCli = cl.codeCli
      JOIN article a ON c.codeArt = a.codeArt
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    console.error('Erreur GET /commandes =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Lister une commande par ID
app.get('/commandes/:idCOM', async (req, res) => {
  try {
    const idCOM = parseInt(req.params.idCOM, 10);
    if (isNaN(idCOM)) {
      return res.status(400).json({ message: 'idCOM invalide' });
    }
    const sql = `
      SELECT
        c.idCOM,
        c.codeCli,
        cl.nomCli,
        cl.prenomCli,
        c.codeArt,
        a.nomArt,
        a.prix,
        c.QteCom,
        c.dateCom,
        (c.QteCom * a.prix) AS total
      FROM commande c
      JOIN client cl ON c.codeCli = cl.codeCli
      JOIN article a ON c.codeArt = a.codeArt
      WHERE c.idCOM = ?
    `;
    const [rows] = await pool.query(sql, [idCOM]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    const commande = {
      ...rows[0],
      dateCom: rows[0].dateCom ? rows[0].dateCom.toISOString().split('T')[0] : null,
    };
    res.json(commande);
  } catch (error) {
    console.error('Erreur GET /commandes/:idCOM =>', error.message, error.stack);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
// Ajouter une commande
app.post('/commandes', async (req, res) => {
  try {
    const { codeCli, codeArt, dateCom, QteCom } = req.body;

    if (!codeCli || !codeArt || !dateCom || !QteCom) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier que codeCli existe
    const [client] = await pool.query('SELECT codeCli FROM client WHERE codeCli = ?', [codeCli]);
    if (client.length === 0) return res.status(400).json({ message: 'codeCli inexistant' });

    // Vérifier que codeArt existe
    const [article] = await pool.query('SELECT codeArt FROM article WHERE codeArt = ?', [codeArt]);
    if (article.length === 0) return res.status(400).json({ message: 'codeArt inexistant' });

    // Générer manuellement idCOM
    const [rows] = await pool.query('SELECT MAX(idCOM) AS maxId FROM commande');
    const idCOM = (rows[0].maxId || 0) + 1;

    // Insérer la commande
    await pool.query(
      'INSERT INTO commande (idCOM, codeCli, codeArt, dateCom, QteCom) VALUES (?, ?, ?, ?, ?)',
      [idCOM, codeCli, codeArt, dateCom, QteCom]
    );

    res.status(201).json({ message: 'Commande ajoutée', idCOM });
  } catch (error) {
    console.error('Erreur POST /commandes =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Modifier une commande
app.put('/commandes/:idCOM', async (req, res) => {
  try {
    const idCOM = parseInt(req.params.idCOM, 10);
    if (isNaN(idCOM)) return res.status(400).json({ message: 'idCOM invalide' });

    const { codeCli, codeArt, dateCom, QteCom } = req.body;

    if (!codeCli || !codeArt || !dateCom || !QteCom) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier que codeCli existe
    const [client] = await pool.query('SELECT codeCli FROM client WHERE codeCli = ?', [codeCli]);
    if (client.length === 0) return res.status(400).json({ message: 'codeCli inexistant' });

    // Vérifier que codeArt existe
    const [article] = await pool.query('SELECT codeArt FROM article WHERE codeArt = ?', [codeArt]);
    if (article.length === 0) return res.status(400).json({ message: 'codeArt inexistant' });

    const [result] = await pool.query(
      'UPDATE commande SET codeCli=?, codeArt=?, dateCom=?, QteCom=? WHERE idCOM=?',
      [codeCli, codeArt, dateCom, QteCom, idCOM]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Commande non trouvée' });

    // Récupérer et retourner les données mises à jour
    const [updatedRows] = await pool.query(
      `SELECT c.idCOM, c.codeCli, cl.nomCli, cl.prenomCli, c.codeArt, a.nomArt, a.prix, c.QteCom, c.dateCom,
              (c.QteCom * a.prix) AS total
       FROM commande c
       JOIN client cl ON c.codeCli = cl.codeCli
       JOIN article a ON c.codeArt = a.codeArt
       WHERE c.idCOM = ?`,
      [idCOM]
    );
    res.json({ message: 'Commande modifiée', commande: updatedRows[0] });
  } catch (error) {
    console.error('Erreur PUT /commandes/:idCOM =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une commande
app.delete('/commandes/:idCOM', async (req, res) => {
  try {
    const idCOM = parseInt(req.params.idCOM, 10);
    if (isNaN(idCOM)) return res.status(400).json({ message: 'idCOM invalide' });

    const [result] = await pool.query('DELETE FROM commande WHERE idCOM = ?', [idCOM]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Commande non trouvée' });

    res.json({ message: 'Commande supprimée' });
  } catch (error) {
    console.error('Erreur DELETE /commandes/:idCOM =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Rechercher un commande par idCOM
app.get('/commandes/:idCOM', async (req, res) => {
  try {
    const { codeArt } = req.params;
    console.log('Recherche commande idCOM:', codeArt);

    const [results] = await pool.query('SELECT * FROM commande WHERE idCOM = ?', [idCOM]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'commande non trouvé' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('Erreur GET /commandes/:idCOM =>', error);  // <- détail de l’erreur
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Route pour les statistiques des quantités par mois
app.get('/commandes/stats/monthly', async (req, res) => {
  try {
    const sql = `
      SELECT 
        DATE_FORMAT(c.dateCom, '%Y-%m') AS month,
        SUM(c.QteCom) AS totalQuantite
      FROM commande c
      WHERE c.dateCom <= ?
      GROUP BY DATE_FORMAT(c.dateCom, '%Y-%m')
      ORDER BY month
    `;
    const [rows] = await pool.query(sql, ['2025-09-22']); // Date actuelle

    if (!rows.length) {
      return res.status(404).json({ message: 'Aucune statistique disponible' });
    }

    const labels = rows.map(row => row.month);
    const data = rows.map(row => row.totalQuantite || 0);

    res.json({
      labels,
      data
    });
  } catch (error) {
    console.error('Erreur GET /commandes/stats/monthly =>', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Middleware 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
