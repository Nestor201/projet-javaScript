import React from 'react';
import './ClientList.css';

const ClientList = ({ clients, onSelect }) => {
  return (
    <div>
      <h2>Liste des Clients</h2>
      <table className="client-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Sexe</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map(client => (
            <tr key={client.codeCli}>
              <td>{client.codeCli}</td>
              <td>{client.nomCli}</td>
              <td>{client.prenomCli}</td>
              <td>{client.adressCli}</td>
              <td>{client.telCli}</td>                   
              <td>{client.sexe}</td>
              <td>
                <button onClick={() => onSelect(client)}>
                  Modifier / Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;

