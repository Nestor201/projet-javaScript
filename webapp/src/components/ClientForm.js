import React, { useState, useEffect } from 'react';
import './ClientForm.css';

const ClientForm = ({ selectedClient, onSuccess }) => {
  const [formData, setFormData] = useState({
    codeCli: '',
    nomCli: '',
    prenomCli: '',
    adressCli: '',
    telCli: '',
    sexe: ''
  });

  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Chargement du client sélectionné
  useEffect(() => {
    if (selectedClient) {
      setFormData({
        codeCli: selectedClient.codeCli,
        nomCli: selectedClient.nomCli,
        prenomCli: selectedClient.prenomCli,
        adressCli: selectedClient.adressCli,
        telCli: selectedClient.telCli,
        sexe: selectedClient.sexe
      });
      setIsEditing(true);
      setError('');
    } else {
      resetForm();
    }
  }, [selectedClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      codeCli: '',
      nomCli: '',
      prenomCli: '',
      adressCli: '',
      telCli: '',
      sexe: ''
    });
    setIsEditing(false);
    setError('');
  };

  const validateForm = ({ nomCli, prenomCli, telCli, sexe }) => {
    const onlyLetters = /^[A-Za-zÀ-ÿ\s\-']+$/;
    const phonePattern = /^[0-9]{8,15}$/;
    const sexeValid = ['M', 'F'];

    if (!onlyLetters.test(nomCli)) {
      return 'Le nom doit contenir uniquement des lettres.';
    }
    if (!onlyLetters.test(prenomCli)) {
      return 'Le prénom doit contenir uniquement des lettres.';
    }
    if (!phonePattern.test(telCli)) {
      return 'Le téléphone doit contenir uniquement des chiffres (8 à 15 chiffres).';
    }
    if (!sexeValid.includes(sexe.toUpperCase())) {
      return "Le sexe doit être 'M' ou 'F'.";
    }
    return null;
  };

  // Recherche client par codeCli
  const handleSearch = async () => {
    if (!formData.codeCli) {
      setError('Veuillez entrer un code client');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/clients/${formData.codeCli}`);

      if (res.status === 404) {
        setError('Client non trouvé');
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          nomCli: '',
          prenomCli: '',
          adressCli: '',
          telCli: '',
          sexe: ''
        }));
        return;
      }

      if (!res.ok) throw new Error('Erreur serveur');

      const data = await res.json();

      setFormData({
        codeCli: data.codeCli,
        nomCli: data.nomCli,
        prenomCli: data.prenomCli,
        adressCli: data.adressCli,
        telCli: data.telCli,
        sexe: data.sexe
      });
      setIsEditing(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    const { codeCli, nomCli, prenomCli, adressCli, telCli, sexe } = formData;

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `http://localhost:3001/clients/${codeCli}`
        : 'http://localhost:3001/clients';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomCli, prenomCli, adressCli, telCli, sexe })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur ${res.status} : ${text}`);
      }

      if (!isEditing) resetForm();
      if (onSuccess) onSuccess();
      alert(isEditing ? 'Client modifié avec succès' : 'Client ajouté avec succès');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Suppression client
  const handleDelete = async () => {
    if (!isEditing) return;
    if (!window.confirm('Supprimer ce client ?')) return;

    try {
      const res = await fetch(`http://localhost:3001/clients/${formData.codeCli}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur ${res.status} : ${text}`);
      }

      resetForm();
      if (onSuccess) onSuccess();
      alert('Client supprimé avec succès');
    } catch (err) {
      setError(err.message);
    }
  };

  // Animation boutons (optionnel, tu peux garder)
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
    <div className="client-form-container">
          
      <div className="search-block" style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          name="codeCli"
          placeholder="Code Client"
          value={formData.codeCli}
          onChange={handleChange}
          className="input-codeCli"
          style={{ marginRight: '8px', padding: '6px' }}
          
        />
        <button type="button" onClick={handleSearch} className="btn-search">
          Rechercher
        </button>
      </div>
      <form className="client-form" onSubmit={handleSubmit}>

      <input
        name="nomCli"
        placeholder="Nom"
        value={formData.nomCli}
        onChange={handleChange}
        required
   
      />
      <input
        name="prenomCli"
        placeholder="Prénom"
        value={formData.prenomCli}
        onChange={handleChange}
        required
    
      />
      <input
        name="adressCli"
        placeholder="Adresse"
        value={formData.adressCli}
        onChange={handleChange}
        required
      
      />
      <input
        name="telCli"
        placeholder="Téléphone"
        value={formData.telCli}
        onChange={handleChange}
        required
      
      />

      {/* Radio buttons sexe */}
      <div className="sexe-radio-group" style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="radio"
            name="sexe"
            value="M"
            checked={formData.sexe === 'M'}
            onChange={handleChange}
            required
          />
          Homme
        </label>

        <label style={{ marginLeft: '1rem' }}>
          <input
            type="radio"
            name="sexe"
            value="F"
            checked={formData.sexe === 'F'}
            onChange={handleChange}
            required
          />
          Femme
        </label>
      </div>

      <button type="submit" className={isEditing ? 'edit-button' : 'add-button'}>
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

export default ClientForm;
