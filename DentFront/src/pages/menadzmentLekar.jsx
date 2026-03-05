import React, { useEffect, useState } from 'react';
import * as api from '../api/api';
import MenadzmentNavbar from './menadzmentNavbar';

export default function MenadzmentLekar() {
  const [lekari, setLekari] = useState([]);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [editId, setEditId] = useState(null);

  const [forma, setForma] = useState({
    ime: '',
    prezime: '',
    datumRodjenja: '',
    brojTelefona: '',
    email: '',
    specijalizacija: ''
  });

  useEffect(() => {
    ucitajLekare();
  }, []);

  const ucitajLekare = async () => {
    try {
      const data = await api.getSveLekare();
      setLekari(data);
    } catch (err) {
      console.error("Greška", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const slanjePodataka = {
        ...forma,
        datumRodjenja: new Date(forma.datumRodjenja).toISOString()
      };

      if (editId) {
        await api.azurirajLekara(editId, slanjePodataka);
      } else {
        await api.kreirajLekara(slanjePodataka);
      }
      resetujFormu();
      ucitajLekare();
    } catch (err) {
      alert("Greška kod čuvanja " + err.message);
    }
  };

  const handleEdit = (l) => {
    setEditId(l.id);
    setForma({
      ime: l.ime,
      prezime: l.prezime,
      datumRodjenja: l.datumRodjenja ? l.datumRodjenja.split('T')[0] : '',
      brojTelefona: l.brojTelefona,
      email: l.email || '',
      specijalizacija: l.specijalizacija || ''
    });
    setPrikaziFormu(true);
  };

  const resetujFormu = () => {
    setForma({ ime: '', prezime: '', datumRodjenja: '', brojTelefona: '', email: '', specijalizacija: '' });
    setEditId(null);
    setPrikaziFormu(false);
  };

  return (
    <div>
      <MenadzmentNavbar />
      <div style={s.container}>
        <div style={s.header}>
          <h1>Lekarski Tim</h1>
          <button style={s.dodajBtn} onClick={() => setPrikaziFormu(!prikaziFormu)}>
            {prikaziFormu ? "Zatvori" : "Dodaj Lekara"}
          </button>
        </div>

        {prikaziFormu && (
          <form onSubmit={handleSubmit} style={s.formaCard}>
            <h3>{editId ? "Ažuriranje podataka" : "Novi lekar"}</h3>
            <div style={s.grid}>
              <input placeholder="Ime" style={s.input} value={forma.ime} 
                     onChange={e => setForma({...forma, ime: e.target.value})} required />
              
              <input placeholder="Prezime" style={s.input} value={forma.prezime} 
                     onChange={e => setForma({...forma, prezime: e.target.value})} required />
              
              <div style={s.inputGroup}>
                <label style={s.label}>Datum rođenja:</label>
                <input type="date" style={s.input} value={forma.datumRodjenja} 
                       onChange={e => setForma({...forma, datumRodjenja: e.target.value})} required />
              </div>

              <input placeholder="Broj telefona" style={s.input} value={forma.brojTelefona} 
                     onChange={e => setForma({...forma, brojTelefona: e.target.value})} required />
              
              <input placeholder="Email adresa" type="email" style={s.input} value={forma.email} 
                     onChange={e => setForma({...forma, email: e.target.value})} />
              
              <input placeholder="Specijalizacija (opciono)" style={s.input} value={forma.specijalizacija} 
                     onChange={e => setForma({...forma, specijalizacija: e.target.value})} />
            </div>
            <div style={s.akcije}>
              <button type="submit" style={s.saveBtn}>{editId ? "Sačuvaj" : "Kreiraj"}</button>
              <button type="button" onClick={resetujFormu} style={s.cancelBtn}>Otkaži</button>
            </div>
          </form>
        )}

        <div style={s.tabelaWrapper}>
          <table style={s.tabela}>
            <thead>
              <tr>
                <th style={s.th}>Lekar</th>
                <th style={s.th}>Specijalizacija</th>
                <th style={s.th}>Kontakt</th>
                <th style={s.th}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {lekari.map(l => (
                <tr key={l.id} style={s.tr}>
                  <td style={s.td}>
                    <strong>{l.ime} {l.prezime}</strong><br/>
                    <small style={{color: '#888'}}>Rođen: {new Date(l.datumRodjenja).toLocaleDateString('sr-RS')}</small>
                  </td>
                  <td style={s.td}>{l.specijalizacija || 'Opšta stomatologija'}</td>
                  <td style={s.td}>{l.brojTelefona} <br/> {l.email}</td>
                  <td style={s.td}>
                    <button onClick={() => handleEdit(l)} style={s.miniBtnEdit}>Uredi</button>
                    <button onClick={() => api.obrisiLekara(l.id).then(ucitajLekare)} style={s.miniBtnDel}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const s = {
  container: { padding: '30px 5%', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  dodajBtn: { padding: '10px 20px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  formaCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '30px', border: '1px solid #e2e8f0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '12px', marginBottom: '4px', color: '#718096', fontWeight: 'bold' },
  akcije: { display: 'flex', gap: '10px' },
  saveBtn: { padding: '10px 25px', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { padding: '10px 20px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tabelaWrapper: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '15px', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' },
  td: { padding: '15px', borderTop: '1px solid #f1f5f9' },
  miniBtnEdit: { marginRight: '8px', padding: '6px 12px', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer', background: '#fff' },
  miniBtnDel: { padding: '6px 12px', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer', background: '#fff' }
};