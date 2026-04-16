import React, { useState, useEffect } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ArticleForm from './components/ArticleForm';
import ArticleList from './components/ArticleList';
import CommandeForm from './components/CommandeForm';
import CommandeList from './components/CommandeList';
import Accueil from './components/Accueil';
import './App.css';
import axios from 'axios';


const App = () => {
  const [view, setView] = useState('clients'); // 'clients', 'articles' ou 'commandes'

  // --- CLIENT ---
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:3001/clients');
      const data = await res.json();
      setClients(data);
      setSelectedClient(null);
    } catch (error) {
      console.error("Erreur lors du chargement des clients :", error);
      setClients([]);
    }
  };

  // --- ARTICLE ---
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('http://localhost:3001/articles');
      const data = await res.json();
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        console.error("La réponse n'est pas un tableau :", data);
        setArticles([]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des articles :", err);
      setArticles([]);
    }
  };

  // --- COMMANDE ---
  const [commandes, setCommandes] = useState([]);
  const [selectedCommande, setSelectedCommande] = useState(null);

  const fetchCommandes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/commandes');
      setCommandes(res.data);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);
      setCommandes([]);
    }
  };

  const handleSelectCommande = (commande) => {
    setSelectedCommande(commande);
    console.log('Commande sélectionnée :', commande);
  };

  const handleCommandeAdded = () => {
    fetchCommandes();
    setSelectedCommande(null);
  };
  

 
  // car le formulaire Commande a besoin de ces listes
  useEffect(() => {
    if (view === 'clients') {
      fetchClients();
    } else if (view === 'articles') {
      fetchArticles();
    } else if (view === 'commandes') {
      // Charger clients et articles pour le formulaire commande
      fetchClients();
      fetchArticles();
      fetchCommandes();
    }
  }, [view]);

  return (
    <div className="app-container">
    <h1>Gestion Boucherie</h1>
    <div className="menu">
    <a href="#" onClick={(e) => { e.preventDefault(); setView('Accueil'); }}>
    Accueil
      </a>{' '}
      {' '}
      <a href="#" onClick={(e) => { e.preventDefault(); setView('clients'); }}>
        Clients
      </a>{' '}
      {' '}
      <a href="#" onClick={(e) => { e.preventDefault(); setView('articles'); }}>
        Articles
      </a>{' '}
      {' '}
      <a href="#" onClick={(e) => { e.preventDefault(); setView('commandes'); }}>
        Commandes
      </a>
    </div>
    {view === 'Accueil' && <Accueil />}

      {view === 'clients' && (
        <>
          <h2>Information Clients</h2>
          <ClientForm selectedClient={selectedClient} onSuccess={fetchClients} />
          <ClientList clients={clients} onSelect={setSelectedClient} />
        </>
      )}

      {view === 'articles' && (
        <>
          <h2>Information Articles</h2>
          <ArticleForm selectedArticle={selectedArticle} onSuccess={() => {
            setSelectedArticle(null);
            fetchArticles();
          }} />
          <ArticleList articles={articles} onSelect={setSelectedArticle} />
        </>
      )}

      
{view === 'commandes' && (
        <>
          <h2>Commandes Clients</h2>
          <CommandeForm
            selectedCommande={selectedCommande}
            clients={clients}
            articles={articles}
            onCommandeAdded={handleCommandeAdded}
            onCancel={() => setSelectedCommande(null)}
          />
          <CommandeList
          commandes={commandes}                  
          onSelect={handleSelectCommande}           
          onFacture={(commande) => console.log('Voir facture :', commande)}
          />
        </>
      )}
    </div>
  );
};

export default App;
