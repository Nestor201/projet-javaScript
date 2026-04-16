import React from 'react';
import './CommandeList.css';

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const CommandeList = ({ commandes = [], onSelect, onFacture }) => {
  return (
    <div>
      <table className="commande-table">
        <thead>
          <tr>
            <th>ID Commande</th>
            <th>Code Client</th>
            <th>Code Article</th>
            <th>Date</th>
            <th>Quantité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => (
            <tr key={commande.idCOM}>
              <td>{commande.idCOM}</td>
              <td>{commande.codeCli || 'N/A'}</td>
              <td>{commande.codeArt || 'N/A'}</td>
              <td>{formatDate(commande.dateCom)}</td>
              <td>{commande.QteCom}</td>
              <td>
                <button onClick={() => onSelect(commande)}>
                  Modifier / Supprimer
                </button>
                <button onClick={() => onFacture(commande)}>
                  Voir facture
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandeList;