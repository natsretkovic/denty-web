const url = "http://localhost:5291/api";


export const getSviPacijenti = async () => {
  const res = await fetch(`${url}/lekar/svi_pacijenti`);
  if (!res.ok) throw new Error("Greška pri preuzimanju pacijenata");
  return res.json();
};

export const getPacijentById = async (id) => {
  const res = await fetch(`${url}/lekar/pacijenti/${id}`);
  if (!res.ok) throw new Error("Pacijent nije pronađen");
  return res.json();
};

export const getPacijentByJmbg = async (jmbg) => {
  const res = await fetch(`${url}/lekar/get_pacijenta/${jmbg}`);
  if (!res.ok) throw new Error("Pacijent nije pronađen");
  return res.json();
};

export const kreirajPacijenta = async (pacijent) => {
  const res = await fetch(`${url}/lekar/kreiraj_pacijenta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pacijent),
  });
  if (!res.ok) throw new Error("Greška pri kreiranju pacijenta");
  return res.json();
};

export const azurirajPacijenta = async (id, pacijent) => {
  const res = await fetch(`${url}/lekar/azuriraj_pacijenta/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pacijent),
  });
  if (!res.ok) throw new Error("Greška pri ažuriranju pacijenta");
};

export const obrisiPacijenta = async (id) => {
  const res = await fetch(`${url}/lekar/obrisi_pacijenta/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Greška pri brisanju pacijenta");
};


export const getKarton = async (pacijentId) => {
  const res = await fetch(`${url}/lekar/preuzmi_karton/${pacijentId}`);
  if (!res.ok) throw new Error("Karton nije pronađen");
  return res.json();
};

export const kreirajKarton = async (karton) => {
  const res = await fetch(`${url}/lekar/kreiraj_karton`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(karton),
  });
  if (!res.ok) throw new Error("Greška pri kreiranju kartona");
  return res.json();
};

export const azurirajAnamnezu = async (pacijentId, anamneza) => {
  const res = await fetch(`${url}/lekar/azuriraj_anamnezu/${pacijentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anamneza),
  });
  if (!res.ok) throw new Error("Greška pri ažuriranju anamneze");
};


export const dodajZub = async (pacijentId, zub) => {
  const res = await fetch(`${url}/lekar/dodaj_zub/${pacijentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zub),
  });
  if (!res.ok) throw new Error("Greška pri dodavanju zuba");
};

export const izmeniStatusZuba = async (pacijentId, brojZuba, noviStatus) => {
  const res = await fetch(`${url}/lekar/izmeni_status_zuba/${pacijentId}/${brojZuba}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noviStatus),
  });
  if (!res.ok) throw new Error("Greška pri izmeni statusa zuba");
};


export const dodajProceduru = async (pacijentId, brojZuba, procedura) => {
  const res = await fetch(`${url}/lekar/dodaj_proceduru/${pacijentId}/${brojZuba}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(procedura),
  });
  if (!res.ok) throw new Error("Greška pri dodavanju procedure");
};

export const izmeniProceduru = async (pacijentId, brojZuba, indexProcedure, procedura) => {
  const res = await fetch(`${url}/lekar/izmeni_proceduru/${pacijentId}/${brojZuba}/${indexProcedure}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(procedura),
  });
  if (!res.ok) throw new Error("Greška pri izmeni procedure");
};


export const dodajTerapiju = async (pacijentId, brojZuba, terapija) => {
  const res = await fetch(`${url}/lekar/dodaj_terapiju/${pacijentId}/${brojZuba}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(terapija),
  });
  if (!res.ok) throw new Error("Greška pri dodavanju terapije");
};

export const izmeniTerapiju = async (pacijentId, brojZuba, indexTerapije, terapija) => {
  const res = await fetch(`${url}/lekar/izmeni_terapiju/${pacijentId}/${brojZuba}/${indexTerapije}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(terapija),
  });
  if (!res.ok) throw new Error("Greška pri izmeni terapije");
};


export const getSveLekare = async () => {
  const res = await fetch(`${url}/menadzment/lekari`);
  if (!res.ok) throw new Error("Greška pri preuzimanju lekara");
  return res.json();
};

export const getLekarById = async (id) => {
  const res = await fetch(`${url}/menadzment/lekari/${id}`);
  if (!res.ok) throw new Error("Lekar nije pronađen");
  return res.json();
};

export const kreirajLekara = async (lekar) => {
  const res = await fetch(`${url}/menadzment/lekari`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lekar),
  });
  if (!res.ok) throw new Error("Greška pri kreiranju lekara");
  return res.json();
};

export const azurirajLekara = async (id, lekar) => {
  const res = await fetch(`${url}/menadzment/lekari/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lekar),
  });
  if (!res.ok) throw new Error("Greška pri ažuriranju lekara");
};

export const obrisiLekara = async (id) => {
  const res = await fetch(`${url}/menadzment/lekari/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Greška pri brisanju lekara");
};


export const getNajcesceProcedure = async () => {
  const res = await fetch(`${url}/menadzment/statistike/najcesce-procedure`);
  if (!res.ok) throw new Error("Greška");
  return res.json();
};

export const getPrihodPoMesecima = async () => {
  const res = await fetch(`${url}/menadzment/statistike/prihod-po-mesecima`);
  if (!res.ok) throw new Error("Greška");
  return res.json();
};

export const getNajcesceLeceniZubi = async () => {
  const res = await fetch(`${url}/menadzment/statistike/najcesce-leceni-zubi`);
  if (!res.ok) throw new Error("Greška");
  return res.json();
};

export const getNajaktivnijiLekari = async () => {
  const res = await fetch(`${url}/menadzment/statistike/najaktivniji-lekari`);
  if (!res.ok) throw new Error("Greška");
  return res.json();
};

export const getNajcesciLekovi = async () => {
  const res = await fetch(`${url}/menadzment/statistike/najcesci-lekovi`);
  if (!res.ok) throw new Error("Greška");
  return res.json();
};

export const getDnevniObracun = async () => {
  const res = await fetch(`${url}/menadzment/statistike/dnevni-obracun`);
  if (!res.ok) throw new Error("Greška");
  return res.json();
};

export const getUkupanPrihodDanas = async () => {
  const res = await fetch(`${url}/menadzment/statistike/ukupan-prihod-danas`);
  if (!res.ok) throw new Error("Greška");
  return res.json();
};