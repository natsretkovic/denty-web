import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api/api';

export default function PacijentProfil() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pacijent, setPacijent] = useState(null);
    const [karton, setKarton] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selektovaniZub, setSelektovaniZub] = useState(null);
    const [prikaziProceduru, setPrikaziProceduru] = useState(false);
    const [prikaziTerapiju, setPrikaziTerapiju] = useState(false);
    const [novaProcedura, setNovaProcedura] = useState({ tipProcedure: '', opis: '', cena: 0, imeStomatologa: '' });
    const [novaTerapija, setNovaTerapija] = useState({ lek: '', doza: '', datumZavrsetka: '', napomena: '' });
    const [noviZubForma, setNoviZubForma] = useState({ vilica: 'Gornja', strana: 'Desna', status: 'zdrav' });
    const [izmenaStatusa, setIzmenaStatusa] = useState(false);
    const [noviStatus, setNoviStatus] = useState('');
    const [uredjivanaTerapija, setUredjivanaTerapija] = useState(null);

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const odgovor = await api.getKarton(id);
            if (odgovor && odgovor.karton) {
                setKarton(odgovor.karton);
                setPacijent(odgovor.pacijent);
            } else {
                setKarton(odgovor);
                const p = await api.getPacijentById(id);
                setPacijent(p);
            }
        } catch (err) {
            console.error("Greška kod učitavanja", err);
        } finally {
            setLoading(false);
        }
    };

    const osvezi = async () => {
        const osvezeno = await api.getKarton(id);
        const svezKarton = osvezeno.karton || osvezeno;
        setKarton(svezKarton);
        const azuriranZub = svezKarton.zubi?.find(z => Number(z.brojZuba) === Number(selektovaniZub?.brojZuba));
        if (azuriranZub) setSelektovaniZub(azuriranZub);
    };

    const nadjiZubUBazi = (broj) => {
        if (!karton?.zubi) return null;
        return karton.zubi.find(z => Number(z.brojZuba) === Number(broj));
    };

    const handleIzmeniStatus = async () => {
        if (!noviStatus) return;
        try {
            await api.izmeniStatusZuba(id, selektovaniZub.brojZuba, noviStatus);
            setIzmenaStatusa(false);
            await osvezi();
        } catch (err) { alert("Greška kod promene statusa"); }
    };

    const handleIzmeniTerapiju = async () => {
        if (!uredjivanaTerapija) return;
        if (!uredjivanaTerapija.podaci.lek || !uredjivanaTerapija.podaci.doza || !uredjivanaTerapija.podaci.datumZavrsetka) {
            alert("Lek, doza i datum završetka su obavezni");
            return;
        }
        try {
            const data = {
                lek: uredjivanaTerapija.podaci.lek,
                doza: uredjivanaTerapija.podaci.doza,
                datumPrepisivanja: uredjivanaTerapija.podaci.datumPrepisivanja,
                datumZavrsetka: new Date(uredjivanaTerapija.podaci.datumZavrsetka).toISOString(),
                napomena: uredjivanaTerapija.podaci.napomena || null
            };
            await api.izmeniTerapiju(id, selektovaniZub.brojZuba, uredjivanaTerapija.index, data);
            setUredjivanaTerapija(null);
            await osvezi();
        } catch (err) { alert("Greška kod promene terapije"); }
    };

    const handleDodajZubUBazu = async () => {
        try {
            const podaciZaSlanje = {
                brojZuba: Number(selektovaniZub.brojZuba),
                vilica: noviZubForma.vilica,
                strana: noviZubForma.strana,
                status: noviZubForma.status,
                procedure: [],
                terapije: []
            };
            await api.dodajZub(id, podaciZaSlanje);
            await osvezi();
        } catch (err) { alert("Greška."); }
    };

    const handleDodajProceduru = async () => {
        try {
            const data = { ...novaProcedura, datumProcedure: new Date().toISOString(), cena: parseFloat(novaProcedura.cena) };
            await api.dodajProceduru(id, selektovaniZub.brojZuba, data);
            setPrikaziProceduru(false);
            setNovaProcedura({ tipProcedure: '', opis: '', cena: 0 });
            await osvezi();
        } catch (err) { alert("Greška."); }
    };

    const handleDodajTerapiju = async () => {
        if (!novaTerapija.lek || !novaTerapija.doza || !novaTerapija.datumZavrsetka) {
            alert("Lek, doza i datum završetka su obavezni.");
            return;
        }
        try {
            const data = {
                lek: novaTerapija.lek,
                doza: novaTerapija.doza,
                datumPrepisivanja: new Date().toISOString(),
                datumZavrsetka: new Date(novaTerapija.datumZavrsetka).toISOString(),
                napomena: novaTerapija.napomena || null
            };
            await api.dodajTerapiju(id, selektovaniZub.brojZuba, data);
            setPrikaziTerapiju(false);
            setNovaTerapija({ lek: '', doza: '', datumZavrsetka: '', napomena: '' });
            await osvezi();
        } catch (err) { alert("Greška pri dodavanju terapije."); }
    };

    const getBojaStatusa = (status) => {
        switch (status?.toLowerCase()) {
            case 'karijes': return '#feb2b2';
            case 'plomba': return '#faf089';
            case 'nedostaje': return '#cbd5e0';
            case 'zdrav': return '#9ae6b4';
            default: return '#fff';
        }
    };

    if (loading) return <div style={s.cleanContainer}>Učitavanje podataka...</div>;

    const zubPostoji = selektovaniZub && nadjiZubUBazi(selektovaniZub.brojZuba);

    return (
        <div style={s.container}>
            <button style={s.backBtn} onClick={() => navigate(-1)}>Nazad</button>

            <div style={s.headerCard}>
                <h1 style={s.imePrezime}>{pacijent?.ime} {pacijent?.prezime}</h1>
                <div style={s.infoGrid}>
                    <p style={s.infoTekst}><strong>JMBG:</strong> {pacijent?.jmbg}</p>
                    <p style={s.infoTekst}><strong>Tel:</strong> {pacijent?.brojTelefona}</p>
                    <p style={s.infoTekst}><strong>Email:</strong> {pacijent?.email || "/"}</p>
                </div>
                {pacijent?.napomene && (
                    <p style={{ marginTop: '10px', fontSize: '14px', color: '#4a5568' }}>
                        <strong>Napomene:</strong> {pacijent.napomene}
                    </p> )}
                    {karton?.alergije && karton.alergije.length > 0 && (
                    <p style={{ marginTop: '8px', fontSize: '14px', color: '#4a5568' }}>
                        <strong>Alergije:</strong> {karton.alergije.join(', ')}
                    </p>
                )}
                    </div>

            <div style={s.mainGrid}>
                <div style={s.kartonCard}>
                    <h3 style={s.sekcijaNaslov}>Mapa</h3>
                    <p style={s.vilicaLabel}>GORNJA VILICA</p>
                    <div style={s.zubiRed}>
                        {[...Array(16)].map((_, i) => {
                            const broj = i + 1;
                            const zubIzBaze = nadjiZubUBazi(broj);
                            return (
                                <div key={broj}
                                onClick={() => { 
                                    setSelektovaniZub(zubIzBaze ? { ...zubIzBaze } : { brojZuba: broj });
                                    setNoviZubForma({ 
                                        ...noviZubForma, 
                                        vilica: broj <= 16 ? 'Gornja' : 'Donja',
                                        strana: broj <= 8 || (broj >= 17 && broj <= 24) ? 'Desna' : 'Leva'
                                    });
                                    setIzmenaStatusa(false); 
                                    setUredjivanaTerapija(null); 
                                }}                                    style={{ ...s.zubItem, backgroundColor: getBojaStatusa(zubIzBaze?.status), border: Number(selektovaniZub?.brojZuba) === broj ? '2px solid #3182ce' : '1px solid #e2e8f0' }}>
                                    {broj}
                                </div>
                            );
                        })}
                    </div>
                    <p style={{ ...s.vilicaLabel, marginTop: '25px' }}>DONJA VILICA</p>
                    <div style={s.zubiRed}>
                        {[...Array(16)].map((_, i) => {
                            const broj = i + 17;
                            const zubIzBaze = nadjiZubUBazi(broj);
                            return (
                                <div key={broj}
                                onClick={() => { 
                                    setSelektovaniZub(zubIzBaze ? { ...zubIzBaze } : { brojZuba: broj });
                                    setNoviZubForma({ 
                                        ...noviZubForma, 
                                        vilica: broj <= 16 ? 'Gornja' : 'Donja',
                                        strana: broj <= 8 || (broj >= 17 && broj <= 24) ? 'Desna' : 'Leva'
                                    });
                                    setIzmenaStatusa(false); 
                                    setUredjivanaTerapija(null); 
                                }}                                    
                                style={{ ...s.zubItem, backgroundColor: getBojaStatusa(zubIzBaze?.status), border: Number(selektovaniZub?.brojZuba) === broj ? '2px solid #3182ce' : '1px solid #e2e8f0' }}>
                                    {broj}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={s.detaljiPanel}>
                    {selektovaniZub ? (
                        <div>
                            <h3 style={s.panelNaslov}>Zub {selektovaniZub.brojZuba}</h3>
                            <div style={s.separator}></div>

                            {!zubPostoji ? (
                                <div>
                                    <label style={s.label}>Vilica</label>
                                    <label style={s.label}>Status</label>
                                    <select style={s.select} value={noviZubForma.status} onChange={e => setNoviZubForma({ ...noviZubForma, status: e.target.value })}>
                                        <option value="zdrav">Zdrav</option>
                                        <option value="karijes">Karijes</option>
                                        <option value="plomba">Plomba</option>
                                        <option value="nedostaje">Nedostaje</option>
                                    </select>
                                    <button style={s.glavnoDugme} onClick={handleDodajZubUBazu}>Sačuvaj zub</button>
                                </div>
                            ) : (
                                <>
                                    <p style={s.crniTekst}><strong>Status:</strong> {selektovaniZub.status}</p>
                                    <div style={{ marginTop: '8px' }}>
                                        {!izmenaStatusa ? (
                                            <button onClick={() => { setIzmenaStatusa(true); setNoviStatus(selektovaniZub.status); }} style={s.miniDugme}>
                                                Izmeni status
                                            </button>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                                                <select value={noviStatus} onChange={e => setNoviStatus(e.target.value)} style={{ ...s.select, marginTop: 0 }}>
                                                    <option value="zdrav">Zdrav</option>
                                                    <option value="karijes">Karijes</option>
                                                    <option value="plomba">Plomba</option>
                                                    <option value="nedostaje">Nedostaje</option>
                                                </select>
                                                <button onClick={handleIzmeniStatus} style={s.potvrdiDugme}>Sačuvaj</button>
                                                <button onClick={() => setIzmenaStatusa(false)} style={s.miniDugme}>Otkaži</button>
                                            </div>
                                        )}
                                    </div>
                                    <p style={s.crniTekst}><strong>Lokacija:</strong> {selektovaniZub.vilica}, {selektovaniZub.strana}</p>

                                    <div style={s.listaSekcija}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={s.podNaslov}>Procedure</h4>
                                            <button onClick={() => setPrikaziProceduru(!prikaziProceduru)} style={s.miniDugme}>
                                                {prikaziProceduru ? "Zatvori" : "+"}
                                            </button>
                                        </div>
                                        {prikaziProceduru && (
                                            <div style={s.malaForma}>
                                                <input placeholder="Tip procedure" value={novaProcedura.tipProcedure} onChange={e => setNovaProcedura({ ...novaProcedura, tipProcedure: e.target.value })} style={s.miniInput} />
                                                <input placeholder="Cena" type="number" value={novaProcedura.cena} onChange={e => setNovaProcedura({ ...novaProcedura, cena: e.target.value })} style={s.miniInput} />
                                                <input 
                                                placeholder="Ime stomatologa" 
                                                value={novaProcedura.imeStomatologa} 
                                                onChange={e => setNovaProcedura({ ...novaProcedura, imeStomatologa: e.target.value })} 
                                                style={s.miniInput} 
                                            />
                                                <button onClick={handleDodajProceduru} style={s.potvrdiDugme}>Sačuvaj</button>
                                            </div>
                                        )}
                                        {selektovaniZub.procedure?.length > 0 ? (
                                            selektovaniZub.procedure.map((p, i) => (
                                                <div key={i} style={s.miniStavka}>
                                                {p.tipProcedure} — {p.cena} din
                                                {p.imeStomatologa && <span style={{ color: '#718096', fontSize: '12px' }}> · {p.imeStomatologa}</span>}
                                            </div>
                                            ))
                                        ) : (
                                            <p style={{ fontSize: '13px', color: '#a0aec0', marginTop: '8px' }}>Nema upisanih procedura</p>
                                        )}
                                    </div>

                                    <div style={s.listaSekcija}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={s.podNaslov}>Terapije</h4>
                                            <button onClick={() => setPrikaziTerapiju(!prikaziTerapiju)} style={s.miniDugme}>
                                                {prikaziTerapiju ? "Zatvori" : "+"}
                                            </button>
                                        </div>
                                        {prikaziTerapiju && (
                                            <div style={s.malaForma}>
                                                <label style={s.miniLabel}>Lek</label>
                                                <input placeholder="npr. Amoksicilin" value={novaTerapija.lek} onChange={e => setNovaTerapija({ ...novaTerapija, lek: e.target.value })} style={s.miniInput} />
                                                <label style={s.miniLabel}>Doza</label>
                                                <input placeholder="npr. 500mg" value={novaTerapija.doza} onChange={e => setNovaTerapija({ ...novaTerapija, doza: e.target.value })} style={s.miniInput} />
                                                <label style={s.miniLabel}>Datum završetka</label>
                                                <input type="date" value={novaTerapija.datumZavrsetka} onChange={e => setNovaTerapija({ ...novaTerapija, datumZavrsetka: e.target.value })} style={s.miniInput} />
                                                <label style={s.miniLabel}>Napomena</label>
                                                <input placeholder="Opciono" value={novaTerapija.napomena} onChange={e => setNovaTerapija({ ...novaTerapija, napomena: e.target.value })} style={s.miniInput} />
                                                <button onClick={handleDodajTerapiju} style={s.potvrdiDugme}>Prepiši terapiju</button>
                                            </div>
                                        )}
                                        {selektovaniZub.terapije?.length > 0 ? (
                                            selektovaniZub.terapije.map((t, i) => (
                                                <div key={i} style={s.terapijaKartica}>
                                                    {uredjivanaTerapija?.index === i ? (
                                                        <div>
                                                            <label style={s.miniLabel}>Lek *</label>
                                                            <input value={uredjivanaTerapija.podaci.lek} onChange={e => setUredjivanaTerapija({ ...uredjivanaTerapija, podaci: { ...uredjivanaTerapija.podaci, lek: e.target.value } })} style={s.miniInput} />
                                                            <label style={s.miniLabel}>Doza *</label>
                                                            <input value={uredjivanaTerapija.podaci.doza} onChange={e => setUredjivanaTerapija({ ...uredjivanaTerapija, podaci: { ...uredjivanaTerapija.podaci, doza: e.target.value } })} style={s.miniInput} />
                                                            <label style={s.miniLabel}>Datum završetka *</label>
                                                            <input type="date" value={uredjivanaTerapija.podaci.datumZavrsetka?.split('T')[0]} onChange={e => setUredjivanaTerapija({ ...uredjivanaTerapija, podaci: { ...uredjivanaTerapija.podaci, datumZavrsetka: e.target.value } })} style={s.miniInput} />
                                                            <label style={s.miniLabel}>Napomena</label>
                                                            <input value={uredjivanaTerapija.podaci.napomena || ''} onChange={e => setUredjivanaTerapija({ ...uredjivanaTerapija, podaci: { ...uredjivanaTerapija.podaci, napomena: e.target.value } })} style={s.miniInput} />
                                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                                <button onClick={handleIzmeniTerapiju} style={s.potvrdiDugme}>Sačuvaj izmenu</button>
                                                                <button onClick={() => setUredjivanaTerapija(null)} style={s.miniDugme}>Otkaži</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span style={s.terapijaLek}> {t.lek}</span>
                                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                                    <span style={s.terapijaDoza}>{t.doza}</span>
                                                                    <button onClick={() => setUredjivanaTerapija({ index: i, podaci: { ...t } })} style={s.miniDugme}>Uredi</button>
                                                                </div>
                                                            </div>
                                                            <div style={s.terapijaDatumi}>
                                                                <span>Prepisano: {new Date(t.datumPrepisivanja).toLocaleDateString('sr-RS')}</span>
                                                                <span>Završetak: {new Date(t.datumZavrsetka).toLocaleDateString('sr-RS')}</span>
                                                            </div>
                                                            {t.napomena && <p style={s.terapijaNapomena}>📝 {t.napomena}</p>}
                                                        </>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ fontSize: '13px', color: '#a0aec0', marginTop: '8px' }}>Nema upisanih terapija</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#718096', marginTop: '20px' }}>Odaberite zub za detalje</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const s = {
    container: { maxWidth: '1100px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff' },
    cleanContainer: { padding: '20px', color: '#1a202c' },
    backBtn: { padding: '8px 15px', marginBottom: '20px', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '8px', color: '#1a202c' },
    headerCard: { background: '#fdfdfd', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' },
    imePrezime: { margin: '0 0 10px 0', fontSize: '24px', color: '#000' },
    infoGrid: { display: 'flex', gap: '25px', color: '#000', flexWrap: 'wrap' },
    infoTekst: { margin: 0, fontSize: '15px' },
    mainGrid: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' },
    kartonCard: { background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    sekcijaNaslov: { margin: '0 0 15px 0', color: '#000' },
    vilicaLabel: { textAlign: 'center', fontSize: '11px', color: '#a0aec0', fontWeight: 'bold', textTransform: 'uppercase', margin: '15px 0' },
    zubiRed: { display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' },
    zubItem: { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', color: '#000' },
    detaljiPanel: { background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' },
    panelNaslov: { margin: '0 0 10px 0', color: '#000' },
    separator: { height: '1px', backgroundColor: '#e2e8f0', marginBottom: '15px' },
    label: { display: 'block', fontSize: '12px', fontWeight: 'bold', marginTop: '10px', color: '#000' },
    select: { width: '100%', padding: '8px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '14px' },
    glavnoDugme: { width: '100%', marginTop: '15px', padding: '10px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    miniDugme: { padding: '2px 8px', fontSize: '12px', cursor: 'pointer', background: '#fff', border: '1px solid #cbd5e0', borderRadius: '6px' },
    potvrdiDugme: { width: '100%', padding: '8px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '8px', marginTop: '8px', fontWeight: 'bold', cursor: 'pointer' },
    miniStavka: { padding: '8px', background: '#f7fafc', marginBottom: '6px', borderRadius: '8px', fontSize: '13px', border: '1px solid #e2e8f0', color: '#000' },
    malaForma: { padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', marginTop: '10px', background: '#fcfcfc' },
    miniInput: { width: '100%', padding: '8px', marginBottom: '6px', border: '1px solid #cbd5e0', borderRadius: '6px', boxSizing: 'border-box', fontSize: '13px' },
    crniTekst: { color: '#000', fontSize: '15px', margin: '6px 0' },
    podNaslov: { margin: 0, fontSize: '16px', color: '#000' },
    listaSekcija: { marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' },
    miniLabel: { display: 'block', fontSize: '11px', fontWeight: '600', color: '#718096', marginBottom: '3px', marginTop: '8px', textTransform: 'uppercase' },
    terapijaKartica: { padding: '10px 12px', background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '8px', marginBottom: '8px', marginTop: '8px' },
    terapijaLek: { fontWeight: 'bold', fontSize: '14px', color: '#276749' },
    terapijaDoza: { fontSize: '13px', color: '#2f855a', background: '#c6f6d5', padding: '2px 8px', borderRadius: '12px' },
    terapijaDatumi: { display: 'flex', gap: '15px', fontSize: '12px', color: '#718096', marginTop: '6px' },
    terapijaNapomena: { fontSize: '12px', color: '#4a5568', margin: '6px 0 0 0' },
};