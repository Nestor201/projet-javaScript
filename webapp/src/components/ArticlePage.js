import React, { useState, useEffect } from 'react';
import ArticleForm from './ArticleForm';
import ArticleList from './ArticleList';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('http://localhost:3001/articles');
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Erreur lors du chargement des articles :', err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSuccess = () => {
    fetchArticles();
    setSelectedArticle(null);
  };

  const handleSearchSuccess = (article) => {
    if (article) {
      setSelectedArticle(article);
    } else {
      setSelectedArticle(null);
    }
    fetchArticles(); // on recharge la liste pour être à jour
  };

  return (
    <div>
      <h1>Gestion des Articles</h1>
      <ArticleForm
        selectedArticle={selectedArticle}
        onSuccess={handleSuccess}
        onSearchSuccess={handleSearchSuccess}
      />
      <ArticleList
        articles={articles}
        onSelect={setSelectedArticle}
      />
    </div>
  );
};

export default ArticlePage;
