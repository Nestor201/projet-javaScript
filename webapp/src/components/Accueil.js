// components/Accueil.js
import React from 'react';
import './Accueil.css';

const Accueil = ({ setView }) => {
  return (
    <div className="accueil-container">
      <h2>Bienvenue dans le Système de Gestion de Boucherie</h2>
      <p>Gérez efficacement vos clients, articles et commandes.</p>
      
      <div className="dashboard">
        <div className="card">
          <h3>Gestion des Clients</h3>
          <p>Ajoutez, modifiez ou consultez les informations de vos clients.</p>
          <a href="#" onClick={(e) => { e.preventDefault(); setView('clients'); }}>
          <img 
              src=".\images\client.jpeg" 
              alt="client" 
              className="card-image" 
            />
          </a>
        </div>
        <div className="card">
          <h3>Gestion des Articles</h3>
          <p>Consultez et gérez votre inventaire de produits.</p>
          <a href="#" onClick={(e) => { e.preventDefault(); setView('articles'); }}>
            
          <img 
              src=".\images\article.jpeg" 
              alt="article" 
              className="card-image" 
            /> 
          </a>
        </div>
        <div className="card">
          <h3>Gestion des Commandes</h3>
          <p>Créez, suivez et gérez les commandes de vos clients.</p>
          <a href="#" onClick={(e) => { e.preventDefault(); setView('commandes'); }}>
          <img 
              src="/images/commande.jpg"  
              alt="article" 
              className="card-image" 
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Accueil;