import React, { useState, useEffect } from 'react';
import './ArticleForm.css';

const ArticleForm = ({ selectedArticle, onSuccess }) => {
  const [formData, setFormData] = useState({
    codeArt: '',
    nomArt: '',
    prix: '',
    Stock_disponible: ''
  });

  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedArticle) {
      setFormData({
        codeArt: selectedArticle.codeArt,
        nomArt: selectedArticle.nomArt,
        prix: selectedArticle.prix,
        Stock_disponible: selectedArticle.Stock_disponible
      });
      setIsEditing(true);
    } else {
      resetForm();
    }
  }, [selectedArticle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      codeArt: '',
      nomArt: '',
      prix: '',
      Stock_disponible: ''
    });
    setIsEditing(false);
    setError('');
  };

  const validateForm = ({ codeArt, nomArt, prix, Stock_disponible }) => {
    const onlyDigits = /^[0-9]+$/;
    const onlyLetters = /^[A-Za-zÀ-ÿ\s\-']+$/;

    // controle champs
    if (!onlyLetters.test(nomArt)) {
      return 'Le nom de l’article ne doit contenir que des lettres.';
    }
    if (!onlyDigits.test(prix)) {
      return 'Le prix doit contenir uniquement des chiffres.';
    }
    if (!onlyDigits.test(Stock_disponible)) {
      return 'Le stock disponible doit contenir uniquement des chiffres.';
    }
    return null;
  };

  const handleSearch = async () => {
    if (!formData.codeArt) {
      setError('Veuillez entrer un code article');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/articles/${formData.codeArt}`);

      if (res.status === 404) {
        setError('Article non trouvé');
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          nomArt: '',
          prix: '',
          Stock_disponible: '',
        }));
        return;
      }

      if (!res.ok) throw new Error('Erreur serveur');

      const data = await res.json();

      setFormData({
        codeArt: data.codeArt,
        nomArt: data.nomArt,
        prix: data.prix,
        Stock_disponible: data.Stock_disponible,
      });
      setIsEditing(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { codeArt, nomArt, prix, Stock_disponible } = formData;

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `http://localhost:3001/articles/${codeArt}`
        : 'http://localhost:3001/articles';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomArt, prix, Stock_disponible })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur ${res.status} : ${text}`);
      }

      if (!isEditing) resetForm();
      if (onSuccess) onSuccess();
      alert(isEditing ? 'Article modifié avec succès' : 'Article ajouté avec succès');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (!window.confirm('Supprimer cet article ?')) return;

    try {
      const res = await fetch(`http://localhost:3001/articles/${formData.codeArt}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur ${res.status} : ${text}`);
      }

      resetForm();
      if (onSuccess) onSuccess();
      alert('Article supprimé avec succès');
    } catch (err) {
      setError(err.message);
    }
  };
  // annimation js
  useEffect(() => {
    function handleMouseEnter(e) {
      const button = e.target;
      button.style.transition = 'all 0.3s ease';
      button.style.transform = 'translateY(-3px)';
      button.style.backgroundColor = '#4CAF50';
      button.style.color = '#fff';
      button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    }
  
    function handleMouseLeave(e) {
      const button = e.target;
      button.style.transform = 'translateY(0)';
      button.style.backgroundColor = '';
      button.style.color = '';
      button.style.boxShadow = '';
    }
  
    const buttons = document.querySelectorAll('button');
  
    buttons.forEach(button => {
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
    });
  
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
useEffect(() => {
  function handleMouseEnter(e) {
    const button = e.target;
    button.style.transition = 'all 0.3s ease';
    button.style.transform = 'translateY(-3px)';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = '#fff';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  }

  function handleMouseLeave(e) {
    const button = e.target;
    button.style.transform = 'translateY(0)';
    button.style.backgroundColor = '';
    button.style.color = '';
    button.style.boxShadow = '';
  }

  const buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
  });

  return () => {
    buttons.forEach(button => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    });
  };
}, []);
  
  return (
    <div className="article-form-container">
      <div className="search-block" style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          name="codeArt"
          placeholder="Code Article"
          value={formData.codeArt}
          onChange={handleChange}
          className="input-codeArt"
          style={{ marginRight: '8px', padding: '6px' }}
        />
        <button type="button" onClick={handleSearch} className="btn-search">
          Rechercher
        </button>
      </div>

      <form className="article-form" onSubmit={handleSubmit}>
        <input
          name="nomArt"
          placeholder="Nom Article"
          value={formData.nomArt}
          onChange={handleChange}
          required
        />
        <input
          name="prix"
          placeholder="Prix"
          type="text"
          value={formData.prix}
          onChange={handleChange}
          required
        />
        <input
          name="Stock_disponible"
          placeholder="Stock Disponible"
          type="text"
          value={formData.Stock_disponible}
          onChange={handleChange}
          required
        />
        <button type="submit"className={isEditing ? 'edit-button' : 'add-button'}>
        {isEditing ? 'Modifier' : 'Ajouter'}
        </button>
        {isEditing && (
          <button
            type="button" onClick={handleDelete} style={{ backgroundColor: '#dc3545', marginTop: '10px' }}>
            Supprimer
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default ArticleForm;
