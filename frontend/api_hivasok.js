const localhost_e = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const apiBaseUrl = localhost_e ? "http://localhost:5147" : "https://kocsma_ba.vizsgaremek.xyz";

window.API = {
  adatok: {
    felhasznalok: `${apiBaseUrl}/api/adatok/felhasznalok`,
    regisztracio: `${apiBaseUrl}/api/adatok/regisztracio`,
    bejelentkezes: `${apiBaseUrl}/api/adatok/bejelentkezes`
  },

  admin: {
    felhasznalok: `${apiBaseUrl}/api/admin/felhasznalok`,
    felhasznaloById: id => `${apiBaseUrl}/api/admin/felhasznalok/${id}`,
    felhasznaloTorles: felhasznalonev => `${apiBaseUrl}/api/admin/felhasznalok/${felhasznalonev}`,
    felhasznalokDTO: `${apiBaseUrl}/api/admin/felhasznalokDTO`,

    kocsmak: `${apiBaseUrl}/api/admin/kocsmak`,
    kocsmaById: id => `${apiBaseUrl}/api/admin/kocsmak/${id}`,
    kocsmaTorles: id => `${apiBaseUrl}/api/admin/kocsmak/${id}`,
    kocsmakDTO: `${apiBaseUrl}/api/admin/kocsmakDTO`,

    italok: `${apiBaseUrl}/api/admin/italok`,
    italById: id => `${apiBaseUrl}/api/admin/italok/${id}`,
    italTorles: id => `${apiBaseUrl}/api/admin/italok/${id}`,
    italokDTO: `${apiBaseUrl}/api/admin/italokDTO`
  },

  kocsma: {
    osszes: `${apiBaseUrl}/api/kocsma/osszes`,
    byId: id => `${apiBaseUrl}/api/kocsma/${id}`,
    update: id => `${apiBaseUrl}/api/kocsma/${id}`,
    raktar: id => `${apiBaseUrl}/api/kocsma/${id}/raktar`
  },

  raktar: {
    italok: `${apiBaseUrl}/api/raktar/italok`
  },

  rendeles: {
    uj: `${apiBaseUrl}/api/rendeles`
  },

  statisztika: {
    osszes: `${apiBaseUrl}/api/statisztika`,
    kocsmak: `${apiBaseUrl}/api/kocsma/osszes`
  }
};

console.log("✅ API betöltve:", window.API);