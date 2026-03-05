import React, { useEffect, useState } from 'react';
import * as api from '../api/api';
import MenadzmentNavbar from './menadzmentNavbar';

export default function MenadzmentPacijent() {
  const [pacijenti, setPacijenti] = useState([]);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [editId, setEditId] = useState(null);

  const [forma, setForma] = useState({
    ime: '', prezime: '', jmbg: '', brojTelefona: '', email: '', datumRodjenja: '', napomene: ''
  });
  const [alergije, setAlergije] = useState('');

  useEffect(() => { ucitajSve(); }, []);

  const ucitajSve = async () => {
    try {
      const data = await api.getSviPacijenti();
      setPacijenti(data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.azurirajPacijenta(editId, forma);
      } else {
        const novi = await api.kreirajPacijenta(forma);
        await api.kreirajKarton({ pacijentId: novi.id, zubi: [] , alergije: alergije ? alergije.split(',').map(a => a.trim()) : []});
      }
      resetujFormu();
      ucitajSve();
    } catch (err) { alert("Greška " + err.message); }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForma({
      ime: p.ime, prezime: p.prezime, jmbg: p.jmbg,
      brojTelefona: p.brojTelefona, email: p.email || '',
      datumRodjenja: p.datumRodjenja ? p.datumRodjenja.split('T')[0] : ''
    });
    setPrikaziFormu(true);
  };

  const handleObrisi = async (id) => {
    if (window.confirm("Brisanjem pacijenta brišete i njegov karton. Da li ste sigurni?")) {
      await api.obrisiPacijenta(id);
      ucitajSve();
    }
  };

  const resetujFormu = () => {
    setForma({ ime: '', prezime: '', jmbg: '', brojTelefona: '', email: '', datumRodjenja: '' });
    setEditId(null);
    setPrikaziFormu(false);
    setAlergije('');
  };

  return (
    <div>
      <MenadzmentNavbar />
      <div style={s.container}>
        <div style={s.header}>
          <h1>Upravljanje Pacijentima</h1>
          <button style={s.dodajBtn} onClick={() => setPrikaziFormu(true)}>
            {prikaziFormu ? "Zatvori formu" : "Dodaj pacijenta"}
          </button>
        </div>

        {prikaziFormu && (
          <form onSubmit={handleSubmit} style={s.formaCard}>
            <h3>{editId ? "Ažuriraj podatke" : "Novi unos"}</h3>
            <div style={s.grid}>
              <input placeholder="Ime" style={s.input} value={forma.ime} onChange={e => setForma({...forma, ime: e.target.value})} required />
              <input placeholder="Prezime" style={s.input} value={forma.prezime} onChange={e => setForma({...forma, prezime: e.target.value})} required />
              <input 
                placeholder="JMBG (13 cifara)" 
                style={s.input} 
                value={forma.jmbg} 
                onChange={e => setForma({...forma, jmbg: e.target.value.replace(/\D/g, '')})} 
                required 
                maxLength={13}
                minLength={13}
            />
              <input placeholder="Telefon" style={s.input} value={forma.brojTelefona} onChange={e => setForma({...forma, brojTelefona: e.target.value})} />
              <input type="date" style={s.input} value={forma.datumRodjenja} onChange={e => setForma({...forma, datumRodjenja: e.target.value})} />
              <input placeholder="Email" type="email" style={s.input} value={forma.email} onChange={e => setForma({...forma, email: e.target.value})} />
              <input placeholder="Napomene (opciono)" style={s.input} value={forma.napomene} onChange={e => setForma({...forma, napomene: e.target.value})} />
              <input placeholder="Alergije (razdvojene zarezom)" style={s.input} value={alergije} onChange={e => setAlergije(e.target.value)} />
            </div>
            <div style={s.akcije}>
              <button type="submit" style={s.saveBtn}>{editId ? "Sačuvaj izmene" : "Kreiraj pacijenta"}</button>
              <button type="button" onClick={resetujFormu} style={s.cancelBtn}>Otkaži</button>
            </div>
          </form>
        )}

        <div style={s.tabelaWrapper}>
          <table style={s.tabela}>
            <thead>
              <tr>
                <th style={s.th}>Pacijent</th>
                <th style={s.th}>JMBG</th>
                <th style={s.th}>Kontakt</th>
                <th style={s.th}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {pacijenti.map(p => (
                <tr key={p.id} style={s.tr}>
                  <td style={s.td}><strong>{p.ime} {p.prezime}</strong></td>
                  <td style={s.td}>{p.jmbg}</td>
                  <td style={s.td}>{p.brojTelefona} <br/> <small>{p.email}</small></td>
                  <td style={s.td}>
                    <button onClick={() => handleEdit(p)} style={s.miniBtnEdit}>Uredi</button>
                    <button onClick={() => handleObrisi(p.id)} style={s.miniBtnDel}>Obriši</button>
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
  dodajBtn: { padding: '10px 20px', backgroundColor: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  formaCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '30px', border: '1px solid #e2e8f0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  akcije: { display: 'flex', gap: '10px' },
  saveBtn: { padding: '10px 25px', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '10px 20px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tabelaWrapper: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '15px', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' },
  td: { padding: '15px', borderTop: '1px solid #f1f5f9' },
  miniBtnEdit: { marginRight: '8px', padding: '6px 12px', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer', background: '#fff' },
  miniBtnDel: { padding: '6px 12px', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer', background: '#fff' }
}