function kijelentkezes() {
    localStorage.removeItem('felhasznalo');
    window.location.href = 'regisztracio_bejelentkezes.html';
}

function openOverlay(id) { 
  const el = document.getElementById(id); 
  if (el) el.style.display = "flex"; 
}

function closeOverlay(id) { 
  const el = document.getElementById(id); 
  if (el) el.style.display = "none"; 
}

function mutatUzenetet(szoveg, tipus = "ok") {
  const uzenetDiv = document.getElementById("valaszUzenet");
  if (!uzenetDiv) return;
  
  uzenetDiv.textContent = szoveg;
  uzenetDiv.className = tipus;

  setTimeout(() => { 
    uzenetDiv.textContent = ""; 
    uzenetDiv.className = ""; 
  }, 5000);
}

function tryParse(jsonText) { 
  try { 
    return JSON.parse(jsonText); 
  } catch { 
    return null; 
  } 
}

function setText(id, text) { 
  const el = document.getElementById(id); 
  if (el) el.textContent = text; 
}

function setValue(id, value) { 
  const el = document.getElementById(id); 
  if (el) el.value = value; 
}

function getValue(id) { 
  const el = document.getElementById(id); 
  return el ? el.value : ""; 
}

function showInlineError(text) { 
  const hibaDiv = document.createElement("div"); 
  hibaDiv.textContent = text; 
  hibaDiv.style.color = "red"; 
  hibaDiv.style.textAlign = "center"; 
  hibaDiv.style.marginTop = "40px"; 
  document.body.appendChild(hibaDiv); 
}

function escapeHtml(s) { 
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[c]); 
}

let GLOBALS = { 
  kocsmaId: null,
  felhasznaloId: null,
  felhasznalonev: null,
  fotar: [],
  kocsmaRaktar: []
};

document.addEventListener("DOMContentLoaded", () => {
  
  const user = tryParse(localStorage.getItem("felhasznalo")) || {};
  if (user.nev) {
    document.getElementById('userName').textContent = user.nev;
    GLOBALS.felhasznalonev = user.felhasznalonev;
  }
  
  document.getElementById('logoutBtn').addEventListener('click', kijelentkezes);
  
  const params = new URLSearchParams(window.location.search);
  let kocsmaId = params.get("kocsmaid");
  const felhasznalo = tryParse(localStorage.getItem("felhasznalo"));

  if (!kocsmaId && felhasznalo) { 
    kocsmaId = felhasznalo.KocsmaId ?? felhasznalo.kocsmaId; 
    GLOBALS.felhasznaloId = felhasznalo?.Id ?? felhasznalo?.id ?? null; 
  } else { 
    GLOBALS.felhasznaloId = felhasznalo?.Id ?? felhasznalo?.id ?? null; 
  }

  if (!kocsmaId || isNaN(Number(kocsmaId))) { 
    showInlineError("❌ Hiba: nincs megadva érvényes kocsma ID."); 
    return; 
  }
  GLOBALS.kocsmaId = Number(kocsmaId);

  fetch(API.kocsma.byId(GLOBALS.kocsmaId))
    .then(async res => { 
      if (!res.ok) throw new Error(await res.text() || "Nem sikerült lekérni a kocsma adatait."); 
      return res.json(); 
    })
    .then(kocsma => {
      const nev = kocsma.nev ?? kocsma.Nev ?? "Ismeretlen";
      const cim = kocsma.cim ?? kocsma.Cim ?? "Nincs cím";
      const telefon = kocsma.telefon ?? kocsma.Telefon ?? "Nincs telefonszám";
      
      setText("kocsmaNev", nev); 
      setText("kocsmaCim", `📍 ${cim}`); 
      setText("kocsmaTelefon", `📞 ${telefon}`);
      
      setText("nyitHetfo", kocsma.hetfo ?? "Zárva");
      setText("nyitKedd", kocsma.kedd ?? "Zárva");
      setText("nyitSzerda", kocsma.szerda ?? "Zárva");
      setText("nyitCsutortok", kocsma.csutortok ?? "Zárva");
      setText("nyitPentek", kocsma.pentek ?? "Zárva");
      setText("nyitSzombat", kocsma.szombat ?? "Zárva");
      setText("nyitVasarnap", kocsma.vasarnap ?? "Zárva");
      
      setValue("ujNev", nev); 
      setValue("ujCim", cim); 
      setValue("ujTelefon", telefon);
      
      setValue("editHetfo", kocsma.hetfo ?? "");
      setValue("editKedd", kocsma.kedd ?? "");
      setValue("editSzerda", kocsma.szerda ?? "");
      setValue("editCsutortok", kocsma.csutortok ?? "");
      setValue("editPentek", kocsma.pentek ?? "");
      setValue("editSzombat", kocsma.szombat ?? "");
      setValue("editVasarnap", kocsma.vasarnap ?? "");
      
      const szerkBtn = document.getElementById("szerkesztoGomb"); 
      if (szerkBtn) szerkBtn.addEventListener("click", () => openOverlay("overlayKocsma"));
    })
    .catch(err => showInlineError(`❌ Hiba történt: ${err.message}`));

  const mentesBtn = document.getElementById("mentesGomb");
  if (mentesBtn) {
    mentesBtn.addEventListener("click", () => {
      const felhasznalo = tryParse(localStorage.getItem("felhasznalo")) || {};
      const aktualisKocsmaId = (felhasznalo?.KocsmaId ?? felhasznalo?.kocsmaId ?? GLOBALS.kocsmaId);

      const frissitett = { 
        nev: getValue("ujNev"), 
        cim: getValue("ujCim"), 
        telefon: getValue("ujTelefon"), 
        tulajFelhasznalo: felhasznalo.Felhasznalonev ?? felhasznalo.felhasznalonev ?? null,
        
        hetfo: document.getElementById("editHetfo")?.value || null,
        kedd: document.getElementById("editKedd")?.value || null,
        szerda: document.getElementById("editSzerda")?.value || null,
        csutortok: document.getElementById("editCsutortok")?.value || null,
        pentek: document.getElementById("editPentek")?.value || null,
        szombat: document.getElementById("editSzombat")?.value || null,
        vasarnap: document.getElementById("editVasarnap")?.value || null
      };
      
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
          mutatUzenetet(valasz.uzenet ?? "✅ Kocsma adatai mentve!", "ok"); 
          
          setText("kocsmaNev", frissitett.nev); 
          setText("kocsmaCim", `📍 ${frissitett.cim}`); 
          setText("kocsmaTelefon", `📞 ${frissitett.telefon}`);
          
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

  const keresF = document.getElementById("keresForaruhaz"); 
  if (keresF) keresF.addEventListener("input", renderListak);
  
  const keresK = document.getElementById("keresKocsma"); 
  if (keresK) keresK.addEventListener("input", renderListak);
  
  const mennyInput = document.getElementById("rendelesMennyiseg"); 
  if (mennyInput) mennyInput.addEventListener("input", frissitOsszesen);
  
  const rendelesBtn = document.getElementById("rendelesKuldes"); 
  if (rendelesBtn) rendelesBtn.addEventListener("click", kuldRendelest);

  betoltKeszletek().catch(err => mutatUzenetet("❌ Hiba a készletek betöltésekor: " + err.message, "hiba"));
});

async function betoltKeszletek() {
  const fotarRes = await fetch(API.raktar.italok);
  if (!fotarRes.ok) throw new Error(await fotarRes.text() || "Főraktár nem elérhető");
  GLOBALS.fotar = await fotarRes.json();

  const kocsmaRes = await fetch(API.kocsma.raktar(GLOBALS.kocsmaId));
  if (!kocsmaRes.ok) throw new Error(await kocsmaRes.text() || "Kocsma raktár nem elérhető");
  GLOBALS.kocsmaRaktar = await kocsmaRes.json();

  renderListak();
}

function renderListak() {
  const qF = (document.getElementById("keresForaruhaz")?.value || "").toLowerCase();
  const qK = (document.getElementById("keresKocsma")?.value || "").toLowerCase();

  const fotarSzurt = GLOBALS.fotar.filter(x => (x.nev ?? x.Nev ?? "").toLowerCase().includes(qF));
  const kocsmaSzurt = GLOBALS.kocsmaRaktar.filter(x => (x.nev ?? x.Nev ?? "").toLowerCase().includes(qK));

  const fotarDiv = document.getElementById("fotarLista");
  const kocsmaDiv = document.getElementById("kocsmaLista");

  if (fotarDiv) fotarDiv.innerHTML = fotarSzurt.map(italKartyaFotar).join("");
  if (kocsmaDiv) kocsmaDiv.innerHTML = kocsmaSzurt.map(italKartyaKocsma).join("");

  document.querySelectorAll(".rendeles-btn[data-nev]").forEach(btn => {
    btn.addEventListener("click", () => nyitRendelesModal(btn.dataset.nev));
  });
}

function italKartyaFotar(row) {
  const nev = row.nev ?? row.Nev ?? "Ismeretlen ital";
  const menny = row.mennyiseg ?? row.Mennyiseg ?? 0;
  const ar = row.ar ?? row.Ar ?? 0;
  const alk = row.alkoholszazalek ?? row.Alkoholszazalek ?? null;
  const kisz = row.kiszereles ?? row.Kiszereles ?? null;

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

function nyitRendelesModal(italNev) {
  const item = GLOBALS.fotar.find(x => (x.nev ?? x.Nev) === italNev);
  if (!item) {
    mutatUzenetet("❌ Nem található az ital a főraktárban.", "hiba");
    return;
  }
  
  const menny = item.mennyiseg ?? item.Mennyiseg ?? 0;
  const ar = item.ar ?? item.Ar ?? 0;

  setText("rendelesItalNev", italNev);
  setText("rendelesElheto", String(menny));
  setText("rendelesAr", `${Number(ar).toFixed(0)} Ft`);
  setText("rendelesOsszesen", `${Number(ar).toFixed(0)} Ft`);
  setValue("rendelesMennyiseg", 1);

  const g = document.getElementById("rendelesKuldes");
  if (g) {
    g.dataset.nev = italNev;
    g.dataset.max = String(menny);
    g.dataset.ar = String(ar);
  }

  openOverlay("overlayRendeles");
}

function frissitOsszesen() {
  const g = document.getElementById("rendelesKuldes");
  const ar = parseFloat(g?.dataset?.ar || "0");
  const qty = parseInt(document.getElementById("rendelesMennyiseg")?.value || "0", 10);
  
  const osszeg = (isNaN(qty) ? 0 : qty) * (isNaN(ar) ? 0 : ar);
  setText("rendelesOsszesen", `${Number(osszeg).toFixed(0)} Ft`);
}

async function kuldRendelest() {
  const g = document.getElementById("rendelesKuldes");
  const italNev = g?.dataset?.nev;
  const max = parseInt(g?.dataset?.max || "0", 10);
  const qty = parseInt(document.getElementById("rendelesMennyiseg")?.value || "0", 10);

  if (!italNev) return mutatUzenetet("❌ Hiányzó ital név.", "hiba");
  if (qty <= 0) return mutatUzenetet("❌ Adj meg pozitív mennyiséget.", "hiba");
  if (qty > max) return mutatUzenetet("❌ Nincs ennyi elérhető a főraktárban.", "hiba");

  const user = tryParse(localStorage.getItem("felhasznalo")) || {};
  if (!user.felhasznalonev) {
    return mutatUzenetet("❌ Nem vagy bejelentkezve!", "hiba");
  }

  const payload = { 
    italNev: italNev, 
    mennyiseg: qty,
    felhasznalonev: user.felhasznalonev
  };
  console.log("Rendelés payload:", payload);

  try {
    const res = await fetch(API.rendeles.uj, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

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

    mutatUzenetet(data.uzenet ?? "✅ Rendelés sikeres!", "ok");
    closeOverlay("overlayRendeles");
    
    await betoltKeszletek();
    
  } catch (err) {
    mutatUzenetet("❌ Hiba rendelés közben: " + err.message, "hiba");
  }
}