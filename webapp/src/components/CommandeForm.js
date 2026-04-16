import React, { useState, useEffect } from 'react';
import './CommandeForm.css';
import { jsPDF } from 'jspdf'; 
import html2canvas from 'html2canvas'; 



const CommandeForm = ({ selectedCommande, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    idCOM: '',
    codeCli: '',
    codeArt: '',
    dateCom: '',
    QteCom: ''
  });

  const [factureVisible, setFactureVisible] = useState(false);
  const [factureData, setFactureData] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    if (selectedCommande) {
      setFormData({
        ...selectedCommande,
        dateCom: selectedCommande.dateCom ? selectedCommande.dateCom.split('T')[0] : ''
      });
      setFactureVisible(false);
      setIsEditing(true); 
    } else {
      resetForm();
    }
  }, [selectedCommande]);

  const validateForm = ({ idCOM, codeCli, codeArt, QteCom, dateCom }) => {
    const onlyDigits = /^[0-9]+$/;
    if (idCOM && !onlyDigits.test(idCOM)) return 'L\'ID Commande doit contenir uniquement des chiffres.';
    if (!onlyDigits.test(codeCli)) return 'Le code client doit contenir uniquement des chiffres.';
    if (!onlyDigits.test(codeArt)) return 'Le code article doit contenir uniquement des chiffres.';
    if (!onlyDigits.test(QteCom)) return 'La quantité doit contenir uniquement des chiffres.';
    if (!dateCom) return 'La date de commande est requise.';
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      idCOM: '',
      codeCli: '',
      codeArt: '',
      dateCom: '',
      QteCom: ''
    });
    setFactureVisible(false);
    setFactureData(null);
    setMessage('');
    setError('');
    setIsEditing(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    const isModification = !!formData.idCOM;
    if (isModification) {
      const confirmModify = confirm('Voulez-vous vraiment modifier cette commande ?');
      if (!confirmModify) return; 
    }

    const method = formData.idCOM ? 'PUT' : 'POST';
    const url = formData.idCOM
      ? `http://localhost:3001/commandes/${formData.idCOM}`
      : 'http://localhost:3001/commandes';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur ${res.status} : ${text}`);
      }

      const successMessage = formData.idCOM ? 'Commande modifiée avec succès.' : 'Commande ajoutée avec succès.';
      setMessage(successMessage);
      alert(successMessage);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('Voulez-vous vraiment supprimer cette commande ?');
    if (!confirmDelete) return; 

    try {
      const res = await fetch(`http://localhost:3001/commandes/${formData.idCOM}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur ${res.status} : ${text}`);
      }

      const successMessage = 'Commande supprimée avec succès.';
      setMessage(successMessage);
      alert(successMessage); 
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async () => {
    if (!formData.idCOM) {
      setError('Veuillez entrer un ID de commande');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/commandes/${formData.idCOM}`);

      if (res.status === 404) {
        setError('Commande non trouvée');
        setIsEditing(false); 
        setFormData(prev => ({
          ...prev,
          idCOM: '',
          codeCli: '',
          codeArt: '',
          dateCom: '',
          QteCom: '',
        }));
        return;
      }

      if (!res.ok) throw new Error('Erreur serveur');

      const data = await res.json();

      // Mettre à jour uniquement les champs demandés (idCOM, codeCli, codeArt, dateCom, QteCom)
      setFormData({
        idCOM: data.idCOM,
        codeCli: data.codeCli,
        codeArt: data.codeArt,
        dateCom: data.dateCom || '', 
        QteCom: data.QteCom || '',  
      });
      setIsEditing(true); 
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVoirFacture = async () => {
    try {
      const res = await fetch(`http://localhost:3001/commandes/${formData.idCOM}`);
      if (!res.ok) throw new Error('Erreur récupération facture');
      const data = await res.json();

      const cleanedData = {
        ...data,
        dateCom: data.dateCom ? data.dateCom.split('T')[0] : data.dateCom
      };

      setFactureData(cleanedData);
      setFactureVisible(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePrintFacture = () => {
    if (!factureData) return;

    // Créer le contenu HTML de la facture
    const content = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 14px; padding: 20px; max-width: 400px; margin: auto; border: 1px solid #ccc;">
        <h3 style="text-align: center; font-family: 'Times New Roman', Times, serif; font-size: 16px;">🧾 Facture Commande #${factureData.idCOM || 'N/A'}</h3>
        <p style="margin: 5px 0;"><strong>ID Commande :</strong> ${factureData.idCOM || 'N/A'}</p>
        <p style="margin: 5px 0;"><strong>Code Client :</strong> ${factureData.codeCli || 'N/A'}</p>
        <p style="margin: 5px 0;"><strong>Client :</strong> ${factureData.nomCli || 'Inconnu'} ${factureData.prenomCli || ''}</p>
        <p style="margin: 5px 0;"><strong>Code Article :</strong> ${factureData.codeArt || 'N/A'}</p>
        <p style="margin: 5px 0;"><strong>Article :</strong> ${factureData.nomArt || 'Inconnu'}</p>
        <p style="margin: 5px 0;"><strong>Prix unitaire :</strong> ${factureData.prix || 0} €</p>
        <p style="margin: 5px 0;"><strong>Quantité :</strong> ${factureData.QteCom || 0}</p>
        <p style="margin: 5px 0;"><strong>Date :</strong> ${factureData.dateCom || 'N/A'}</p>
        <p style="margin: 5px 0;"><strong>Total :</strong> ${(factureData.QteCom && factureData.prix ? (factureData.QteCom * factureData.prix).toFixed(2) : '0.00')} €</p>
        <p style="text-align: center; margin: 5px 0;">Merci pour votre commande</p>
      </div>
    `;

    // Créer un élément temporaire pour rendre le contenu
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px'; // Cacher hors de l'écran
    tempDiv.innerHTML = content;
    document.body.appendChild(tempDiv);

    // Générer le PDF avec html2canvas et jsPDF
    html2canvas(tempDiv, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'legal',
      });

      const imgWidth = 180; // Largeur de l'image dans le PDF
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const marginTop = (pageHeight - imgHeight) / 2; // Centrer verticalement

      pdf.addImage(imgData, 'PNG', 15, marginTop, imgWidth, imgHeight);

      // Nettoyer l'ID pour un nom de fichier sûr
      const safeIdCOM = String(factureData.idCOM || Date.now()).replace(/[^a-zA-Z0-9]/g, '');
      const fileName = `Facture_Commande_${safeIdCOM}.pdf`;

      // Télécharger le PDF
      pdf.save(fileName);

      // Supprimer l'élément temporaire
      document.body.removeChild(tempDiv);
    }).catch((error) => {
      console.error('Erreur lors de la génération du PDF :', error);
      document.body.removeChild(tempDiv);
      setError('Erreur lors de la génération du PDF');
    });
  };

  return (
    <div className="commande-form-container">
      <div className="search-block" style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          name="idCOM"
          placeholder="ref_commande"
          value={formData.idCOM}
          onChange={handleChange}
          className="input-idCOM"
          style={{ marginRight: '8px', padding: '6px' }}
        />
        <button type="button" onClick={handleSearch} className="btn-search">
          Rechercher
        </button>
      </div>
      <form onSubmit={handleSubmit} className="commande-form">
        <fieldset className="fieldsetstyle">
          <input
            name="codeCli"
            placeholder="Code Client"
            value={formData.codeCli}
            onChange={handleChange}
            required
            disabled={!isEditing} 
          />
          <input
            name="codeArt"
            placeholder="Code Article"
            value={formData.codeArt}
            onChange={handleChange}
            required
            disabled={!isEditing} 
          />
          <input
            type="date"
            name="dateCom"
            placeholder="Date de commande"
            value={formData.dateCom}
            onChange={handleChange}
            required
            disabled={!isEditing} 
          />
          <input
            type="number"
            name="QteCom"
            placeholder="Quantité"
            value={formData.QteCom}
            onChange={handleChange}
            required
            disabled={!isEditing} // Désactiver les champs si !isEditing
          />
        </fieldset>
        <div className="button-group">
          <button
            type="submit"
            className={formData.idCOM ? 'btn-submit bounce-click' : 'btn-submit bounce-click'}
          >
            {formData.idCOM ? 'Modifier' : 'Ajouter'}
          </button>
          {formData.idCOM && (
            <>
              <button
                type="button"
                className="btn-delete bounce-click"
                onClick={handleDelete}
              >
                Supprimer
              </button>
              <button
                type="button"
                className="btn-cancel bounce-click"
                onClick={onCancel}
              >
                Annuler
              </button>
            </>
          )}
          <button
            type="button"
            className="btn-facture bounce-click"
            onClick={handleVoirFacture}
          >
            Voir facture
          </button>
        </div>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>

      {factureVisible && factureData && (
        <div className="parent">
          <div className="facture-box">
            <h3>🧾 Facture Commande #{factureData.idCOM}</h3>
            <p><strong>ID Commande :</strong> {factureData.idCOM}</p>
            <p><strong>Code Client :</strong> {factureData.codeCli}</p>
            <p><strong>Client :</strong> {factureData.nomCli} {factureData.prenomCli}</p>
            <p><strong>Code Article :</strong> {factureData.codeArt}</p>
            <p><strong>Article :</strong> {factureData.nomArt}</p>
            <p><strong>Prix unitaire :</strong> {factureData.prix} Ar</p>
            <p><strong>Quantité :</strong> {factureData.QteCom}</p>
            <p><strong>Date :</strong> {factureData.dateCom}</p>
            <p><strong>Total :</strong> {(factureData.QteCom * factureData.prix).toFixed(2)} Ar</p>
            <button onClick={handlePrintFacture}>🖨️ Télécharger la facture (PDF)</button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CommandeForm;