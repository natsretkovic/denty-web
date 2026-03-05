import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/api'; 
import "./LekarPage.css";

export default function LekarPage() {
  const [jmbg, setJmbg] = useState('');
  const [pacijent, setPacijent] = useState(null);
  const [karton, setKarton] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePretraga = async () => {
    if (!jmbg || jmbg.length !== 13) {
      setError('Molimo unesite ispravan JMBG (13 cifara)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const p = await api.getPacijentByJmbg(jmbg);
      setPacijent(p);
      const k = await api.getKarton(p.id);
      setKarton(k);
    } catch (err) {
      setError('Pacijent nije pronađen');
      setPacijent(null);
      setKarton(null);
    } finally {
      setLoading(false);
    }
  };

  const idiNaProfil = () => {
    if (pacijent) {
      navigate(`/pacijent/${pacijent.id}`);
    }
  };

  return (
    <div className="lekar-container">
      <h1>Lekarski Panel</h1>
      
      <div className="search-section">
        <input 
          type="text" 
          placeholder="Unesite JMBG pacijenta (13 cifara)" 
          value={jmbg}
          maxLength={13}
          onChange={(e) => setJmbg(e.target.value)} 
        />
        <button 
          className="btn-primarno" 
          onClick={handlePretraga}
          disabled={loading}
        >
          {loading ? 'Pretraživanje' : 'Pretraži'}
        </button>
      </div>

      {error && <p className="error-poruka" style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {pacijent && (
        <div className="main-grid">
          <aside 
            className="info-panel profil-kartica-klik" 
            onClick={idiNaProfil}
            title="Klikni za kompletan profil pacijenta"
          >
            <div className="panel-header">
              <h2>Pacijent</h2>
              <span className="vidi-vise">vidi profil</span>
            </div>
            
            <div className="pacijent-osnovno">
              <p><strong>Ime i prezime:</strong> {pacijent.ime} {pacijent.prezime}</p>
              <p><strong>JMBG:</strong> {pacijent.jmbg}</p>
              <p><strong>Telefon:</strong> {pacijent.brojTelefona}</p>
            </div>

            <hr style={{ margin: '1.5rem 0', opacity: 0.1 }} />
          </aside>
        </div>
      )}
    </div>
  );
}