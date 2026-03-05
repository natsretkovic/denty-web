import React, { useEffect, useState } from 'react';
import * as api from '../api/api';
import MenadzmentNavbar from './menadzmentNavbar';

const parseBson = (val) => {
    if (val?.$numberDecimal) return parseFloat(val.$numberDecimal);
    if (val?.$numberInt) return parseInt(val.$numberInt);
    return val ?? 0;
};

export default function MenadzmentStatistike() {
    const [najcesceProcedure, setNajcesceProcedure] = useState([]);
    const [najcesceLeceniZubi, setNajcesceLeceniZubi] = useState([]);
    const [najaktivnijiLekari, setNajaktivnijiLekari] = useState([]);
    const [najcesciLekovi, setNajcesciLekovi] = useState([]);
    const [dnevniObracun, setDnevniObracun] = useState([]);
    const [ukupanPrihodDanas, setUkupanPrihodDanas] = useState(null);
    const [alergija, setAlergija] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSve();
    }, []);

    const fetchSve = async () => {
        try {
            setLoading(true);
            const [proc, zubi, lekari, lekovi, dnevni, prihod] = await Promise.all([
                api.getNajcesceProcedure(),
                api.getNajcesceLeceniZubi(),
                api.getNajaktivnijiLekari(),
                api.getNajcesciLekovi(),
                api.getDnevniObracun(),
                api.getUkupanPrihodDanas(),
            ]);
            setNajcesceProcedure(proc);
            setNajcesceLeceniZubi(zubi);
            setNajaktivnijiLekari(lekari);
            setNajcesciLekovi(lekovi);
            setDnevniObracun(dnevni);
            setUkupanPrihodDanas(prihod[0] || null);
        } catch (err) {
            console.error("Greška kod  statistika", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={s.container}>Učitavanje</div>;

    return (
      <>
      <MenadzmentNavbar /> 
        <div style={s.container}>
            
            <h1 style={s.naslov}>Statistike</h1>

            <div style={s.karticaGrid}>
                <div style={{ ...s.kartica, background: '#ebf8ff', borderColor: '#90cdf4' }}>
                    <p style={s.karticaLabel}>Ukupan prihod danas</p>
                    <p style={s.karticaBroj}>{parseBson(ukupanPrihodDanas?.ukupanPrihod).toLocaleString()} din</p>
                </div>
                <div style={{ ...s.kartica, background: '#f0fff4', borderColor: '#9ae6b4' }}>
                    <p style={s.karticaLabel}>Procedure danas</p>
                    <p style={s.karticaBroj}>{ukupanPrihodDanas?.ukupnoProcedura ?? 0}</p>
                </div>
            </div>

            <div style={s.sekcija}>
                <h2 style={s.sekcijaNaslov}>Dnevni obračun po lekaru</h2>
                {dnevniObracun.length === 0 ? (
                    <p style={s.prazno}>Nema procedura danas</p>
                ) : (
                    <table style={s.tabela}>
                        <thead>
                            <tr>
                                <th style={s.th}>Lekar</th>
                                <th style={s.th}>Broj procedura</th>
                                <th style={s.th}>Prihod</th>
                                <th style={s.th}>Procedure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dnevniObracun.map((red, i) => (
                                <tr key={i} style={i % 2 === 0 ? s.trParan : s.trNeparan}>
                                    <td style={s.td}>{red._id || 'Nepoznat'}</td>
                                    <td style={s.td}>{red.brojProcedura}</td>
                                    <td style={s.td}>{parseBson(red.ukupanPrihod).toLocaleString()} din</td>
                                    <td style={s.td}>{red.procedure?.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={s.sekcija}>
                <h2 style={s.sekcijaNaslov}>Najčešće procedure</h2>
                {najcesceProcedure.map((p, i) => (
                    <div key={i} style={s.redStavka}>
                        <span>{p._id}</span>
                        <span style={s.badge}>{p.broj}x</span>
                    </div>
                ))}
            </div>

            <div style={s.sekcija}>
                <h2 style={s.sekcijaNaslov}>Najaktivniji lekari</h2>
                <table style={s.tabela}>
                    <thead>
                        <tr>
                            <th style={s.th}>Lekar</th>
                            <th style={s.th}>Broj procedura</th>
                            <th style={s.th}>Ukupan prihod</th>
                        </tr>
                    </thead>
                    <tbody>
                        {najaktivnijiLekari.map((l, i) => (
                            <tr key={i} style={i % 2 === 0 ? s.trParan : s.trNeparan}>
                                <td style={s.td}>{l._id || 'Nepoznat'}</td>
                                <td style={s.td}>{l.brojProcedura}</td>
                                <td style={s.td}>{parseBson(l.ukupanPrihod).toLocaleString()} din</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={s.sekcija}>
                <h2 style={s.sekcijaNaslov}>Najčešće lečeni zubi</h2>
                {najcesceLeceniZubi.map((z, i) => (
                    <div key={i} style={s.redStavka}>
                        <span>Zub #{z._id}</span>
                        <span style={s.badge}>broj intervencija: {z.brojIntervencija}</span>
                    </div>
                ))}
            </div>

            <div style={s.sekcija}>
                <h2 style={s.sekcijaNaslov}>Najčešći lekovi</h2>
                {najcesciLekovi.map((l, i) => (
                    <div key={i} style={s.redStavka}>
                        <span>{l._id}</span>
                        <span style={s.badge}>{l.brojPrepisivanja}x prepisano</span>
                    </div>
                ))}
            </div>
            </div>
        </>
    );
}
const s = {
    container: { maxWidth: '900px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' },
    naslov: { fontSize: '22px', marginBottom: '24px' },
    karticaGrid: { display: 'flex', gap: '16px', marginBottom: '24px' },
    kartica: { flex: 1, padding: '16px', borderRadius: '8px', border: '1px solid', textAlign: 'center' },
    karticaLabel: { fontSize: '13px', color: '#718096', margin: '0 0 6px 0' },
    karticaBroj: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
    sekcija: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
    sekcijaNaslov: { fontSize: '15px', fontWeight: '600', margin: '0 0 12px 0' },
    redStavka: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' },
    badge: { fontSize: '13px', color: '#2b6cb0' },
    tabela: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'left', padding: '8px', borderBottom: '1px solid #e2e8f0', color: '#4a5568' },
    td: { padding: '8px', borderBottom: '1px solid #f0f0f0' },
    trParan: {},
    trNeparan: { background: '#f7fafc' },
    prazno: { color: '#a0aec0', fontSize: '14px' },
    input: { flex: 1, padding: '8px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '14px' },
    dugme: { padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};