// src/components/ArticleSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';

function ArticleSearch({ onArticleFound }) {
  const [codeArt, setCodeArt] = useState('');
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  const searchArticle = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/articles/${codeArt}`);
      setArticle(response.data);
      setError('');
      if (onArticleFound) onArticleFound(response.data); // callback vers ArticleForm
    } catch (err) {
      setArticle(null);
      if (err.response && err.response.status === 404) {
        setError('Article non trouvé');
      } else {
        setError('Erreur serveur');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Recherche Article par codeArt</h2>
      <input
        type="number"
        placeholder="Entrer code article"
        value={codeArt}
        onChange={(e) => setCodeArt(e.target.value)}
        className="border px-2 py-1 mr-2"
      />
      <button onClick={searchArticle} className="bg-green-500 text-white px-4 py-1 rounded">
        Rechercher
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {article && (
        <table className="mt-4 border border-collapse w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1">Code</th>
              <th className="border px-2 py-1">Nom</th>
              <th className="border px-2 py-1">Prix</th>
              <th className="border px-2 py-1">Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">{article.codeArt}</td>
              <td className="border px-2 py-1">{article.nomArt}</td>
              <td className="border px-2 py-1">{article.prix}</td>
              <td className="border px-2 py-1">{article.Stock_disponible}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ArticleSearch;
