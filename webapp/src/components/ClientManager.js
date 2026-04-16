import React, { useState } from 'react';
import ClientSearch from './ClientSearch';
import ClientForm from './ClientForm';

const ClientManager = () => {
  const [selectedClient, setSelectedClient] = useState(null);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const handleSuccess = () => {
    setSelectedClient(null); // reset après ajout/modification/suppression
  };

  return (
    <div>
      <ClientSearch onClientFound={handleClientSelect} />
      <ClientForm selectedClient={selectedClient} onSuccess={handleSuccess} />
    </div>
  );
};

export default ClientManager;
