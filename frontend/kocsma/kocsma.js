// ======================================================
// KOCSMA KEZELŐ FELÜLET - JAVASCRIPT (KIBŐVÍTVE NYITVATARTÁSSAL)
// 🔥 TOKEN NÉLKÜLI VERZIÓ
// ======================================================

// ======================================================
// KIJELENTKEZÉS FUNKCIÓ
// ======================================================
function kijelentkezes() {
    localStorage.removeItem('felhasznalo');
    window.location.href = 'regisztracio_bejelentkezes.html';
}

// ======================================================
// 1. OVERLAY (FELUGGÓ ABLAK) VEZÉRLÉS
// ======================================================

/**
 * Modal ablak megnyitása
 * @param {string} id - Az overlay elem azonosítója
 */
function openOverlay(id) { 
  const el = document.getElementById(id); 
  if (el) el.style.display = "flex"; 
}

/**
 * Modal ablak bezárása
 * @param {string} id - Az overlay elem azonosítója
 */
function closeOverlay(id) { 
  const el = document.getElementById(id); 
  if (el) el.style.display = "none"; 
}

// ======================================================
// 2. TOAST (ÜZENET) VISSZAJELZŐ RENDSZER
// ======================================================

/**
 * Üzenet megjelenítése a felhasználónak
 * @param {string} szoveg - A megjelenítendő szöveg
 * @param {string} tipus - 'ok' (siker) vagy 'hiba' (error)
 */
function mutatUzenetet(szoveg, tipus = "ok") {
  const uzenetDiv = document.getElementById("valaszUzenet");
  if (!uzenetDiv) return;
  
  uzenetDiv.textContent = szoveg;
  uzenetDiv.className = tipus;
  
  // 5 másodperc után automatikus eltűnés
  setTimeout(() => { 
    uzenetDiv.textContent = ""; 
    uzenetDiv.className = ""; 
  }, 5000);
}

// ======================================================
// 3. SEGÉDFÜGGVÉNYEK - gyakran használt műveletek
// ======================================================

/**
 * JSON szöveg biztonságos parse-olása
 * @param {string} jsonText - JSON formátumú szöveg
 * @returns {object|null} - Parsolt objektum vagy null hiba esetén
 */
function tryParse(jsonText) { 
  try { 
    return JSON.parse(jsonText); 
  } catch { 
    return null; 
  } 
}

/**
 * HTML elem szövegének beállítása
 * @param {string} id - Elem azonosítója
 * @param {string} text - Beállítandó szöveg
 */
function setText(id, text) { 
  const el = document.getElementById(id); 
  if (el) el.textContent = text; 
}

/**
 * Input mező értékének beállítása
 * @param {string} id - Input azonosítója
 * @param {string} value - Beállítandó érték
 */
function setValue(id, value) { 
  const el = document.getElementById(id); 
  if (el) el.value = value; 
}

/**
 * Input mező értékének lekérése
 * @param {string} id - Input azonosítója
 * @returns {string} - Input értéke vagy üres string
 */
function getValue(id) { 
  const el = document.getElementById(id); 
  return el ? el.value : ""; 
}

/**
 * Kritikus hiba megjelenítése (ha nem töltődik be az oldal)
 * @param {string} text - Hibaüzenet
 */
function showInlineError(text) { 
  const hibaDiv = document.createElement("div"); 
  hibaDiv.textContent = text; 
  hibaDiv.style.color = "red"; 
  hibaDiv.style.textAlign = "center"; 
  hibaDiv.style.marginTop = "40px"; 
  document.body.appendChild(hibaDiv); 
}

/**
 * HTML entitások escape-elése (XSS védelem)
 * @param {string} s - Eredeti szöveg
 * @returns {string} - Biztonságos szöveg
 */
function escapeHtml(s) { 
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[c]); 
}

// ======================================================
// 4. GLOBÁLIS ÁLLAPOT - alkalmazás adatai
// ======================================================
let GLOBALS = { 
  kocsmaId: null,           // Jelenlegi kocsma azonosítója
  felhasznaloId: null,      // Bejelentkezett felhasználó ID-ja
  felhasznalonev: null,     // 🔥 Bejelentkezett felhasználónév
  fotar: [],                // Főraktár adatai (központi raktár)
  kocsmaRaktar: []          // Saját kocsma raktárának adatai
};

// ======================================================
// 5. OLDAL BETÖLTÉS - inicializáció (KIBŐVÍTVE)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  
  // ===== Felhasználó név megjelenítése =====
  const user = tryParse(localStorage.getItem("felhasznalo")) || {};
  if (user.nev) {
    document.getElementById('userName').textContent = user.nev;
    GLOBALS.felhasznalonev = user.felhasznalonev; // 🔥 Felhasználónév mentése
  }
  
  // ===== Kijelentkezés gomb eseménykezelője =====
  document.getElementById('logoutBtn').addEventListener('click', kijelentkezes);
  
  // 5.1 KOCSMA AZONOSÍTÓ MEGHATÁROZÁSA
  const params = new URLSearchParams(window.location.search);
  let kocsmaId = params.get("kocsmaid");
  const felhasznalo = tryParse(localStorage.getItem("felhasznalo"));

  // Ha nincs az URL-ben, próbáljuk a localStorage-ból
  if (!kocsmaId && felhasznalo) { 
    kocsmaId = felhasznalo.KocsmaId ?? felhasznalo.kocsmaId; 
    GLOBALS.felhasznaloId = felhasznalo?.Id ?? felhasznalo?.id ?? null; 
  } else { 
    GLOBALS.felhasznaloId = felhasznalo?.Id ?? felhasznalo?.id ?? null; 
  }

  // Ha még mindig nincs, hiba
  if (!kocsmaId || isNaN(Number(kocsmaId))) { 
    showInlineError("❌ Hiba: nincs megadva érvényes kocsma ID."); 
    return; 
  }
  GLOBALS.kocsmaId = Number(kocsmaId);

  // 5.2 KOCSMA ADATOK BETÖLTÉSE - 🔥 KIBŐVÍTVE NYITVATARTÁSSAL
  fetch(API.kocsma.byId(GLOBALS.kocsmaId))
    .then(async res => { 
      if (!res.ok) throw new Error(await res.text() || "Nem sikerült lekérni a kocsma adatait."); 
      return res.json(); 
    })
    .then(kocsma => {
      // Kocsma adatok megjelenítése a fejlécben
      const nev = kocsma.nev ?? kocsma.Nev ?? "Ismeretlen";
      const cim = kocsma.cim ?? kocsma.Cim ?? "Nincs cím";
      const telefon = kocsma.telefon ?? kocsma.Telefon ?? "Nincs telefonszám";
      
      setText("kocsmaNev", nev); 
      setText("kocsmaCim", `📍 ${cim}`); 
      setText("kocsmaTelefon", `📞 ${telefon}`);
      
      // 🔥 NYITVATARTÁS MEGJELENÍTÉSE
      setText("nyitHetfo", kocsma.hetfo ?? "Zárva");
      setText("nyitKedd", kocsma.kedd ?? "Zárva");
      setText("nyitSzerda", kocsma.szerda ?? "Zárva");
      setText("nyitCsutortok", kocsma.csutortok ?? "Zárva");
      setText("nyitPentek", kocsma.pentek ?? "Zárva");
      setText("nyitSzombat", kocsma.szombat ?? "Zárva");
      setText("nyitVasarnap", kocsma.vasarnap ?? "Zárva");
      
      // Szerkesztő modal előtöltése - alapadatok
      setValue("ujNev", nev); 
      setValue("ujCim", cim); 
      setValue("ujTelefon", telefon);
      
      // 🔥 Szerkesztő modal előtöltése - nyitvatartás
      setValue("editHetfo", kocsma.hetfo ?? "");
      setValue("editKedd", kocsma.kedd ?? "");
      setValue("editSzerda", kocsma.szerda ?? "");
      setValue("editCsutortok", kocsma.csutortok ?? "");
      setValue("editPentek", kocsma.pentek ?? "");
      setValue("editSzombat", kocsma.szombat ?? "");
      setValue("editVasarnap", kocsma.vasarnap ?? "");
      
      // Szerkesztés gomb eseménykezelője
      const szerkBtn = document.getElementById("szerkesztoGomb"); 
      if (szerkBtn) szerkBtn.addEventListener("click", () => openOverlay("overlayKocsma"));
    })
    .catch(err => showInlineError(`❌ Hiba történt: ${err.message}`));

  // 5.3 KOCSMA MENTÉS GOMB - 🔥 KIBŐVÍTVE NYITVATARTÁSSAL
  const mentesBtn = document.getElementById("mentesGomb");
  if (mentesBtn) {
    mentesBtn.addEventListener("click", () => {
      const felhasznalo = tryParse(localStorage.getItem("felhasznalo")) || {};
      const aktualisKocsmaId = (felhasznalo?.KocsmaId ?? felhasznalo?.kocsmaId ?? GLOBALS.kocsmaId);
      
      // Frissített adatok összegyűjtése - 🔥 NYITVATARTÁSSAL
      const frissitett = { 
        nev: getValue("ujNev"), 
        cim: getValue("ujCim"), 
        telefon: getValue("ujTelefon"), 
        tulajFelhasznalo: felhasznalo.Felhasznalonev ?? felhasznalo.felhasznalonev ?? null,
        
        // 🔥 Nyitvatartás mezők
        hetfo: document.getElementById("editHetfo")?.value || null,
        kedd: document.getElementById("editKedd")?.value || null,
        szerda: document.getElementById("editSzerda")?.value || null,
        csutortok: document.getElementById("editCsutortok")?.value || null,
        pentek: document.getElementById("editPentek")?.value || null,
        szombat: document.getElementById("editSzombat")?.value || null,
        vasarnap: document.getElementById("editVasarnap")?.value || null
      };
      
      // API hívás a módosításhoz
      fetch(API.kocsma.byId(aktualisKocsmaId), { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(frissitett) 
      })
        .then(async res => { 
          if (!res.ok) throw new Error(await res.text() || "Mentés sikertelen"); 
          return res.json().catch(() => ({})); 
        })
        .then(valasz => { 
          // Sikeres mentés
          mutatUzenetet(valasz.uzenet ?? "✅ Kocsma adatai mentve!", "ok"); 
          
          // Frissítés a képernyőn
          setText("kocsmaNev", frissitett.nev); 
          setText("kocsmaCim", `📍 ${frissitett.cim}`); 
          setText("kocsmaTelefon", `📞 ${frissitett.telefon}`);
          
          // 🔥 Nyitvatartás frissítése
          setText("nyitHetfo", frissitett.hetfo || "Zárva");
          setText("nyitKedd", frissitett.kedd || "Zárva");
          setText("nyitSzerda", frissitett.szerda || "Zárva");
          setText("nyitCsutortok", frissitett.csutortok || "Zárva");
          setText("nyitPentek", frissitett.pentek || "Zárva");
          setText("nyitSzombat", frissitett.szombat || "Zárva");
          setText("nyitVasarnap", frissitett.vasarnap || "Zárva");
          
          closeOverlay("overlayKocsma"); 
        })
        .catch(err => mutatUzenetet("❌ Hiba történt: " + err.message, "hiba"));
    });
  }

  // 5.4 ESEMÉNYKEZELŐK BEÁLLÍTÁSA
  const keresF = document.getElementById("keresForaruhaz"); 
  if (keresF) keresF.addEventListener("input", renderListak);
  
  const keresK = document.getElementById("keresKocsma"); 
  if (keresK) keresK.addEventListener("input", renderListak);
  
  const mennyInput = document.getElementById("rendelesMennyiseg"); 
  if (mennyInput) mennyInput.addEventListener("input", frissitOsszesen);
  
  const rendelesBtn = document.getElementById("rendelesKuldes"); 
  if (rendelesBtn) rendelesBtn.addEventListener("click", kuldRendelest);

  // 5.5 KÉSZLETEK BETÖLTÉSE
  betoltKeszletek().catch(err => mutatUzenetet("❌ Hiba a készletek betöltésekor: " + err.message, "hiba"));
});

// ======================================================
// 6. KÉSZLETEK KEZELÉSE
// ======================================================

/**
 * Főraktár és saját raktár adatainak betöltése az API-ról
 */
async function betoltKeszletek() {
  // Főraktár lekérése
  const fotarRes = await fetch(API.raktar.italok);
  if (!fotarRes.ok) throw new Error(await fotarRes.text() || "Főraktár nem elérhető");
  GLOBALS.fotar = await fotarRes.json();

  // Saját kocsma raktárának lekérése
  const kocsmaRes = await fetch(API.kocsma.raktar(GLOBALS.kocsmaId));
  if (!kocsmaRes.ok) throw new Error(await kocsmaRes.text() || "Kocsma raktár nem elérhető");
  GLOBALS.kocsmaRaktar = await kocsmaRes.json();

  // Listák újrarajzolása
  renderListak();
}

/**
 * Készletlisták újrarajzolása a keresési feltételek alapján
 */
function renderListak() {
  const qF = (document.getElementById("keresForaruhaz")?.value || "").toLowerCase();
  const qK = (document.getElementById("keresKocsma")?.value || "").toLowerCase();

  // Szűrés a keresőmezők alapján
  const fotarSzurt = GLOBALS.fotar.filter(x => (x.nev ?? x.Nev ?? "").toLowerCase().includes(qF));
  const kocsmaSzurt = GLOBALS.kocsmaRaktar.filter(x => (x.nev ?? x.Nev ?? "").toLowerCase().includes(qK));

  const fotarDiv = document.getElementById("fotarLista");
  const kocsmaDiv = document.getElementById("kocsmaLista");

  // HTML generálás és beillesztés
  if (fotarDiv) fotarDiv.innerHTML = fotarSzurt.map(italKartyaFotar).join("");
  if (kocsmaDiv) kocsmaDiv.innerHTML = kocsmaSzurt.map(italKartyaKocsma).join("");

  // Rendelés gombok eseménykezelőinek beállítása
  document.querySelectorAll(".rendeles-btn[data-nev]").forEach(btn => {
    btn.addEventListener("click", () => nyitRendelesModal(btn.dataset.nev));
  });
}

/**
 * Főraktár egy tételének HTML kártya generálása - 🔥 MÓDOSÍTVA
 * @param {object} row - Ital adatai
 * @returns {string} - HTML kód
 */
function italKartyaFotar(row) {
  const nev = row.nev ?? row.Nev ?? "Ismeretlen ital";
  const menny = row.mennyiseg ?? row.Mennyiseg ?? 0;
  const ar = row.ar ?? row.Ar ?? 0;
  const alk = row.alkoholszazalek ?? row.Alkoholszazalek ?? null;
  const kisz = row.kiszereles ?? row.Kiszereles ?? null;

  // Meta információk összefűzése
  const meta = [
    `Elérhető: ${menny}`,
    `Ár: ${Number(ar).toFixed(0)} Ft`,
    alk != null ? `${alk}%` : null,
    kisz != null ? `${kisz} L` : null
  ].filter(Boolean).join(" • ");

  return `
    <div class="kartya">
      <div>
        <div class="cim">${escapeHtml(nev)}</div>
        <div class="meta">${meta}</div>
      </div>
      <div class="akcik">
        <button class="btn btn-success rendeles-btn" data-nev="${escapeHtml(nev)}">🛒 Rendelés</button>
      </div>
    </div>
  `;
}

/**
 * Saját raktár egy tételének HTML kártya generálása - 🔥 MÓDOSÍTVA
 * @param {object} row - Ital adatai
 * @returns {string} - HTML kód
 */
function italKartyaKocsma(row) {
  const nev = row.nev ?? row.Nev ?? "Ismeretlen ital";
  const menny = row.mennyiseg ?? row.Mennyiseg ?? 0;
  const ar = row.ar ?? row.Ar ?? 0;
  const meta = `Készlet: ${menny} • Ár: ${Number(ar).toFixed(0)} Ft`;

  return `
    <div class="kartya">
      <div>
        <div class="cim">${escapeHtml(nev)}</div>
        <div class="meta">${meta}</div>
      </div>
      <div class="akcik">
        <button class="btn btn-success rendeles-btn" data-nev="${escapeHtml(nev)}">🛒 Rendelés</button>
      </div>
    </div>
  `;
}

// ======================================================
// 7. RENDELÉS KEZELÉS
// ======================================================

/**
 * Rendelési modal megnyitása egy adott italra
 * @param {string} italNev - A rendelni kívánt ital neve
 */
function nyitRendelesModal(italNev) {
  const item = GLOBALS.fotar.find(x => (x.nev ?? x.Nev) === italNev);
  if (!item) {
    mutatUzenetet("❌ Nem található az ital a főraktárban.", "hiba");
    return;
  }
  
  const menny = item.mennyiseg ?? item.Mennyiseg ?? 0;
  const ar = item.ar ?? item.Ar ?? 0;

  // Modal mezők kitöltése
  setText("rendelesItalNev", italNev);
  setText("rendelesElheto", String(menny));
  setText("rendelesAr", `${Number(ar).toFixed(0)} Ft`);
  setText("rendelesOsszesen", `${Number(ar).toFixed(0)} Ft`); // Alapértelmezett 1 db
  setValue("rendelesMennyiseg", 1);

  // Adatok tárolása a rendelés gombon (dataset)
  const g = document.getElementById("rendelesKuldes");
  if (g) {
    g.dataset.nev = italNev;
    g.dataset.max = String(menny);
    g.dataset.ar = String(ar);
  }

  openOverlay("overlayRendeles");
}

/**
 * Összesen frissítése a mennyiség változásakor
 */
function frissitOsszesen() {
  const g = document.getElementById("rendelesKuldes");
  const ar = parseFloat(g?.dataset?.ar || "0");
  const qty = parseInt(document.getElementById("rendelesMennyiseg")?.value || "0", 10);
  
  const osszeg = (isNaN(qty) ? 0 : qty) * (isNaN(ar) ? 0 : ar);
  setText("rendelesOsszesen", `${Number(osszeg).toFixed(0)} Ft`);
}

/**
 * Rendelés elküldése az API-nak - 🔥 TOKEN NÉLKÜLI VERZIÓ
 */
async function kuldRendelest() {
  const g = document.getElementById("rendelesKuldes");
  const italNev = g?.dataset?.nev;
  const max = parseInt(g?.dataset?.max || "0", 10);
  const qty = parseInt(document.getElementById("rendelesMennyiseg")?.value || "0", 10);

  // ===== Validáció =====
  if (!italNev) return mutatUzenetet("❌ Hiányzó ital név.", "hiba");
  if (qty <= 0) return mutatUzenetet("❌ Adj meg pozitív mennyiséget.", "hiba");
  if (qty > max) return mutatUzenetet("❌ Nincs ennyi elérhető a főraktárban.", "hiba");

  // 🔥 Felhasználónév lekérése a localStorage-ból
  const user = tryParse(localStorage.getItem("felhasznalo")) || {};
  if (!user.felhasznalonev) {
    return mutatUzenetet("❌ Nem vagy bejelentkezve!", "hiba");
  }

  // 🔥 Új payload felhasználónévvel
  const payload = { 
    italNev: italNev, 
    mennyiseg: qty,
    felhasznalonev: user.felhasznalonev
  };
  console.log("Rendelés payload:", payload);

  try {
    // 🔥 API hívás TOKEN NÉLKÜL
    const res = await fetch(API.rendeles.uj, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // 🔥 NINCS Authorization header
      },
      body: JSON.stringify(payload)
    });

    // Hibakezelés
    if (!res.ok) {
      const errorText = await res.text();
      try {
        const parsed = JSON.parse(errorText);
        throw new Error(parsed.uzenet ?? parsed.Uzenet ?? "Rendelés sikertelen");
      } catch {
        throw new Error(errorText || "Rendelés sikertelen");
      }
    }

    const data = await res.json().catch(() => ({}));
    
    // Sikeres rendelés
    mutatUzenetet(data.uzenet ?? "✅ Rendelés sikeres!", "ok");
    closeOverlay("overlayRendeles");
    
    // Készletek frissítése
    await betoltKeszletek();
    
  } catch (err) {
    mutatUzenetet("❌ Hiba rendelés közben: " + err.message, "hiba");
  }
}