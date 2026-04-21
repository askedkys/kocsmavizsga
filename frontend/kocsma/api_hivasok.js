// ======================================================
// API KONFIGURÁCIÓ - Végpontok központi kezelése
// ======================================================

window.API = {
  
  // ======================================================
  // 1. ADATOK CONTROLLER - Regisztráció, bejelentkezés
  // ======================================================
  adatok: {
    felhasznalok: "http://localhost:5147/api/adatok/felhasznalok",
    regisztracio: "http://localhost:5147/api/adatok/regisztracio",
    bejelentkezes: "http://localhost:5147/api/adatok/bejelentkezes"
  },

  // ======================================================
  // 2. ADMIN CONTROLLER - Teljes CRUD műveletek
  // ======================================================
  admin: {
    felhasznalok: "http://localhost:5147/api/admin/felhasznalok",
    felhasznaloById: id => `http://localhost:5147/api/admin/felhasznalok/${id}`,
    felhasznaloTorles: felhasznalonev => `http://localhost:5147/api/admin/felhasznalok/${felhasznalonev}`,
    felhasznalokDTO: "http://localhost:5147/api/admin/felhasznalokDTO",

    kocsmak: "http://localhost:5147/api/admin/kocsmak",
    kocsmaById: id => `http://localhost:5147/api/admin/kocsmak/${id}`,
    kocsmaTorles: id => `http://localhost:5147/api/admin/kocsmak/${id}`,
    kocsmakDTO: "http://localhost:5147/api/admin/kocsmakDTO",

    italok: "http://localhost:5147/api/admin/italok",
    italById: id => `http://localhost:5147/api/admin/italok/${id}`,
    italTorles: id => `http://localhost:5147/api/admin/italok/${id}`,
    italokDTO: "http://localhost:5147/api/admin/italokDTO"
  },

  // ======================================================
  // 3. KOCSMA CONTROLLER - Kocsma műveletek
  // ======================================================
  kocsma: {
    osszes: "http://localhost:5147/api/kocsma/osszes",
    byId: id => `http://localhost:5147/api/kocsma/${id}`,
    update: id => `http://localhost:5147/api/kocsma/${id}`,
    raktar: id => `http://localhost:5147/api/kocsma/${id}/raktar`
  },

  // ======================================================
  // 4. RAKTÁR CONTROLLER - Központi raktár
  // ======================================================
  raktar: {
    italok: "http://localhost:5147/api/raktar/italok"
  },

  // ======================================================
  // 5. RENDELÉS CONTROLLER - Rendelés leadása
  // ======================================================
  rendeles: {
    uj: "http://localhost:5147/api/rendeles"
  },

  // ======================================================
  // 6. STATISZTIKA CONTROLLER - Rendszer statisztikák
  // ======================================================
  statisztika: {
    osszes: "http://localhost:5147/api/statisztika"
  }
};

console.log("✅ API konfiguráció betöltve:", window.API);