import React, { useState, useEffect } from 'react';
import CommandeForm from './CommandeForm';

const CommandePage = () => {
  const [commandes, setCommandes] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupération des commandes depuis l'API
  const fetchCommandes = async () => {
    try {
      const res = await fetch('http://localhost:3001/commandes');
      if (!res.ok) throw new Error('Erreur lors du chargement des commandes');
      const data = await res.json();
      setCommandes(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const handleSuccess = () => {
    fetchCommandes();
    setSelectedCommande(null); 
  };

  const handleSelectCommande = (commande) => {
    setSelectedCommande(commande);
  };

  const handleCancel = () => {
    setSelectedCommande(null); 
  };

  return (
    <div className="commande-page">
      <h2>Gestion des Commandes</h2>

      <CommandeForm
        selectedCommande={selectedCommande}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />

      <h3>Liste des commandes</h3>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: '15px', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Article</th>
              <th>Quantité</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((cmd) => (
              <tr key={cmd.idCOM}>
                <td>{cmd.idCOM}</td>
                <td>{cmd.nomCli} {cmd.prenomCli}</td>
                <td>{cmd.nomArt}</td>
                <td>{cmd.QteCom}</td>
                <td>{cmd.dateCom.split('T')[0]}</td>
                <td>
                  <button onClick={() => handleSelectCommande(cmd)}>Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CommandePage;
