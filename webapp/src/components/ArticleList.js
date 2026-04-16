import React from 'react';
import './ArticleListe.css';

const ArticleList = ({ articles, onSelect }) => {
  return (
    <div>
      <h2>Liste des Articles</h2>
      <table className="article-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.codeArt}>
              <td>{article.codeArt}</td>
              <td>{article.nomArt}</td>
              <td>{article.prix}</td>
              <td>{article.Stock_disponible}</td>
              <td>
                <button onClick={() => onSelect(article)}>Modifier / Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleList;
