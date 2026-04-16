import React, { useState } from 'react';
import axios from 'axios';

function ClientSearch() {
  const [codeCli, setCodeCli] = useState('');
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');

  const searchClient = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/clients/${codeCli}`);
      setClient(response.data);
      setError('');
    } catch (err) {
      setClient(null);
      if (err.response && err.response.status === 404) {
        setError('Client non trouvé');
      } else {
        setError('Erreur serveur');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Recherche Client par codeCli</h2>
      <input
        type="number"
        placeholder="Entrer code client (numérique)"
        value={codeCli}
        onChange={(e) => setCodeCli(e.target.value)}
        className="border px-2 py-1 mr-2"
        />

      <button onClick={searchClient} className="bg-blue-500 text-white px-4 py-1 rounded">
        Rechercher
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {client && (
        <table className="mt-4 border border-collapse w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1">Code</th>
              <th className="border px-2 py-1">Nom</th>
              <th className="border px-2 py-1">Prénom</th>
              <th className="border px-2 py-1">Adresse</th>
              <th className="border px-2 py-1">Téléphone</th>
              <th className="border px-2 py-1">Sexe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">{client.codeCli}</td>
              <td className="border px-2 py-1">{client.nomCli}</td>
              <td className="border px-2 py-1">{client.prenomCli}</td>
              <td className="border px-2 py-1">{client.adressCli}</td>
              <td className="border px-2 py-1">{client.telCli}</td>
              <td className="border px-2 py-1">{client.sexe}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClientSearch;
