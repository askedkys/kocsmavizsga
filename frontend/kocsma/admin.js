// ======================================================
// ADMIN FELÜLET - JAVASCRIPT
// ======================================================

// ======================================================
// KIJELENTKEZÉS FUNKCIÓ
// ======================================================
function kijelentkezes() {
    window.location.href = 'regisztracio_bejelentkezes.html';
}

// ======================================================
// OVERLAY VEZÉRLÉS
// ======================================================
function openOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "flex";
}

function closeOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

// ======================================================
// TOAST ÜZENET
// ======================================================
function showToast(msg, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ======================================================
// SEGÉDFÜGGVÉNYEK
// ======================================================
function tryNumber(v, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ 
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" 
  }[c]));
}

// ======================================================
// FELHASZNÁLÓK KEZELÉSE
// ======================================================
let usersCache = [];
let aktualisFelhasznaloId = null;

function loadUsers() {
  fetch(API.admin.felhasznalok)
    .then(res => { 
      if (!res.ok) throw new Error("Hiba a felhasználók lekérésekor"); 
      return res.json(); 
    })
    .then(users => {
      usersCache = users;
      renderUsers(users);
      const dl = document.getElementById("felhasznaloLista");
      if (dl) {
        dl.innerHTML = "";
        users.forEach(u => {
          const opt = document.createElement("option");
          opt.value = u.felhasznalonev;
          dl.appendChild(opt);
        });
      }
    })
    .catch(err => showToast("❌ " + err.message, "error"));
}

// 🔥 MÓDOSÍTVA: btn-danger és btn-primary + btn-sm
function renderUsers(users) {
  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  users.forEach(u => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.id}</td>
      <td>${escapeHtml(u.nev ?? "")}</td>
      <td>${escapeHtml(u.felhasznalonev ?? "")}</td>
      <td>${escapeHtml(u.email ?? "")}</td>
      <td>${escapeHtml(u.jelszo ?? "")}</td>
      <td>${u.isAdmin ? "✔️" : "❌"}</td>
      <td>${u.kocsmaId ?? "-"}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteUser('${escapeHtml(u.felhasznalonev)}', this)">🗑️ Törlés</button>
        <button class="btn btn-primary btn-sm" onclick='szerkesztFelhasznalo(${JSON.stringify(u)})'>✏️ Szerkesztés</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function filterUsers() {
  const inp = document.getElementById("searchUsers");
  const q = (inp?.value || "").toLowerCase().trim();
  const filtered = usersCache.filter(u =>
    (u.nev || "").toLowerCase().includes(q) ||
    (u.felhasznalonev || "").toLowerCase().includes(q) ||
    (u.email || "").toLowerCase().includes(q)
  );
  renderUsers(filtered);
}

function ujFelhasznalo() {
  aktualisFelhasznaloId = null;
  document.getElementById("editNev").value = "";
  document.getElementById("editFnev").value = "";
  document.getElementById("editEmail").value = "";
  document.getElementById("editJelszo").value = "";
  document.getElementById("editKocsmaId").value = "";
  document.getElementById("editAdmin").checked = false;
  openOverlay("overlayFelhasznalo");
}

function szerkesztFelhasznalo(user) {
  aktualisFelhasznaloId = user.id;
  document.getElementById("editNev").value = user.nev || "";
  document.getElementById("editFnev").value = user.felhasznalonev || "";
  document.getElementById("editEmail").value = user.email || "";
  document.getElementById("editJelszo").value = user.jelszo || "";
  document.getElementById("editKocsmaId").value = user.kocsmaId || "";
  document.getElementById("editAdmin").checked = !!user.isAdmin;
  openOverlay("overlayFelhasznalo");
}

function deleteUser(username, button) {
  if (!confirm(`Biztosan törölni szeretnéd a(z) ${username} felhasználót?`)) return;
  fetch(`${API.admin.felhasznalok}/${username}`, { method: "DELETE" })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.uzenet || "❌ Hiba történt a törlés során.");
      return data;
    })
    .then(() => {
      showToast("✅ Felhasználó törölve!");
      const row = button.closest("tr");
      if (row) row.remove();
    })
    .catch(err => showToast("❌ " + err.message, "error"));
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mentesFelhasznalo");
  if (btn) {
    btn.addEventListener("click", () => {
      const kocsmaIdInput = document.getElementById("editKocsmaId").value;
      const kocsmaId = kocsmaIdInput ? parseInt(kocsmaIdInput) : null;
      const adat = {
        nev: document.getElementById("editNev").value,
        felhasznalonev: document.getElementById("editFnev").value,
        email: document.getElementById("editEmail").value,
        jelszo: document.getElementById("editJelszo").value,
        isAdmin: document.getElementById("editAdmin").checked,
        kocsmaId: kocsmaId
      };
      let url, method;
      if (aktualisFelhasznaloId) {
        url = API.admin.felhasznaloById(aktualisFelhasznaloId);
        method = "PUT";
      } else {
        url = API.admin.felhasznalokDTO;
        method = "POST";
      }
      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adat)
      })
        .then(async res => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.uzenet || "Mentés sikertelen");
          return data;
        })
        .then(() => {
          showToast("✅ Felhasználó mentve!");
          closeOverlay("overlayFelhasznalo");
          loadUsers();
        })
        .catch(err => showToast("❌ " + err.message, "error"));
    });
  }
});

// ======================================================
// KOCSMÁK KEZELÉSE
// ======================================================
let pubsCache = [];
let aktualisKocsmaId = null;

function loadPubs() {
  fetch(API.admin.kocsmak)
    .then(res => { 
      if (!res.ok) throw new Error("❌ Hiba a kocsmák lekérésekor"); 
      return res.json(); 
    })
    .then(pubs => { pubsCache = pubs; renderPubs(pubs); })
    .catch(err => showToast("❌ " + err.message, "error"));
}

// 🔥 MÓDOSÍTVA: btn-danger és btn-primary + btn-sm
function renderPubs(pubs) {
  const tbody = document.getElementById("pubsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  pubs.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.kocsmaId}</td>
      <td>${escapeHtml(p.nev ?? "")}</td>
      <td>${escapeHtml(p.cim ?? "-")}</td>
      <td>${escapeHtml(p.telefon ?? "-")}</td>
      <td>${escapeHtml(p.tulajFelhasznalo ?? "-")}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick='torolKocsma(${p.kocsmaId})'>🗑️ Törlés</button>
        <button class="btn btn-primary btn-sm" onclick='szerkesztKocsma(${JSON.stringify(p)})'>✏️ Szerkesztés</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function filterPubs() {
  const inp = document.getElementById("searchPubs");
  const q = (inp?.value || "").toLowerCase().trim();
  const filtered = pubsCache.filter(p =>
    (p.nev || "").toLowerCase().includes(q) ||
    (p.cim || "").toLowerCase().includes(q) ||
    (p.telefon || "").toLowerCase().includes(q)
  );
  renderPubs(filtered);
}

function ujKocsma() {
  aktualisKocsmaId = null;
  document.getElementById("editKocsmaNev").value = "";
  document.getElementById("editKocsmaCim").value = "";
  document.getElementById("editKocsmaTelefon").value = "";
  document.getElementById("editKocsmaTulaj").value = "";
  openOverlay("overlayKocsma");
}

function szerkesztKocsma(kocsma) {
  aktualisKocsmaId = kocsma.kocsmaId;
  document.getElementById("editKocsmaNev").value = kocsma.nev || "";
  document.getElementById("editKocsmaCim").value = kocsma.cim || "";
  document.getElementById("editKocsmaTelefon").value = kocsma.telefon || "";
  document.getElementById("editKocsmaTulaj").value = kocsma.tulajFelhasznalo || "";
  openOverlay("overlayKocsma");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mentesKocsma");
  if (btn) {
    btn.addEventListener("click", () => {
      const adat = {
        nev: document.getElementById("editKocsmaNev").value,
        cim: document.getElementById("editKocsmaCim").value,
        telefon: document.getElementById("editKocsmaTelefon").value,
        tulajFelhasznalo: document.getElementById("editKocsmaTulaj").value
      };
      let url, method;
      if (aktualisKocsmaId) {
        url = API.admin.kocsmaById(aktualisKocsmaId);
        method = "PUT";
      } else {
        url = API.admin.kocsmakDTO;
        method = "POST";
      }
      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adat)
      })
        .then(async res => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.uzenet || "Mentés sikertelen");
          return data;
        })
        .then(() => {
          showToast("✅ Kocsma mentve!");
          closeOverlay("overlayKocsma");
          loadPubs();
        })
        .catch(err => showToast("❌ " + err.message, "error"));
    });
  }
});

function torolKocsma(id) {
  if (!confirm(`❓ Biztosan törölni szeretnéd a(z) ${id} azonosítójú kocsmát?`)) return;
  fetch(`${API.admin.kocsmak}/${id}`, { method: "DELETE" })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.uzenet || "❌ Hiba történt a törlés során.");
      return data;
    })
    .then(() => { 
      showToast("✅ Kocsma törölve!"); 
      loadPubs(); 
    })
    .catch(err => showToast("❌ " + err.message, "error"));
}

// ======================================================
// KÖZPONTI RAKTÁR KEZELÉSE
// ======================================================
let stockCache = [];
let aktualisItalId = null;

function loadCentralStock() {
  fetch(API.admin.italok)
    .then(res => { 
      if (!res.ok) throw new Error("❌ Hiba az alkoholos készlet lekérésekor"); 
      return res.json(); 
    })
    .then(items => { stockCache = items; renderStock(items); })
    .catch(err => showToast("❌ " + err.message, "error"));
}

// 🔥 MÓDOSÍTVA: btn-danger és btn-primary + btn-sm
function renderStock(items) {
  const tbody = document.getElementById("stockTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  items.forEach(t => {
    const low = tryNumber(t.mennyiseg) <= 5;
    const row = document.createElement("tr");
    if (low) row.classList.add("low-stock");
    row.innerHTML = `
      <td>${t.italId}</td>
      <td>${escapeHtml(t.nev ?? "")}</td>
      <td>${t.mennyiseg}</td>
      <td>${Number(t.ar).toFixed(0)} Ft</td>
      <td>${t.alkoholszazalek ?? "-"}</td>
      <td>${escapeHtml(t.szarmazas ?? "-")}</td>
      <td>${t.kiszereles ?? "-"}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick='torolItal(${t.italId})'>🗑️ Törlés</button>
        <button class="btn btn-primary btn-sm" onclick='szerkesztItal(${JSON.stringify(t)})'>✏️ Szerkesztés</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function filterStock() {
  const inp = document.getElementById("searchStock");
  const q = (inp?.value || "").toLowerCase().trim();
  const filtered = stockCache.filter(t =>
    (t.nev || "").toLowerCase().includes(q) ||
    (t.szarmazas || "").toLowerCase().includes(q) ||
    String(t.alkoholszazalek || "").toLowerCase().includes(q)
  );
  renderStock(filtered);
}

function ujItal() {
  aktualisItalId = null;
  document.getElementById("editItalNev").value = "";
  document.getElementById("editItalMennyiseg").value = "";
  document.getElementById("editItalAr").value = "";
  document.getElementById("editItalAlkohol").value = "";
  document.getElementById("editItalSzarmazas").value = "";
  document.getElementById("editItalKiszereles").value = "";
  openOverlay("overlayItal");
}

function szerkesztItal(ital) {
  aktualisItalId = ital.italId;
  document.getElementById("editItalNev").value = ital.nev || "";
  document.getElementById("editItalMennyiseg").value = tryNumber(ital.mennyiseg, "");
  document.getElementById("editItalAr").value = tryNumber(ital.ar, "");
  document.getElementById("editItalAlkohol").value = tryNumber(ital.alkoholszazalek, "");
  document.getElementById("editItalSzarmazas").value = ital.szarmazas || "";
  document.getElementById("editItalKiszereles").value = tryNumber(ital.kiszereles, "");
  openOverlay("overlayItal");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mentesItal");
  if (btn) {
    btn.addEventListener("click", () => {
      const adat = {
        nev: document.getElementById("editItalNev").value,
        mennyiseg: tryNumber(document.getElementById("editItalMennyiseg").value),
        ar: tryNumber(document.getElementById("editItalAr").value),
        alkoholszazalek: tryNumber(document.getElementById("editItalAlkohol").value),
        szarmazas: document.getElementById("editItalSzarmazas").value,
        kiszereles: tryNumber(document.getElementById("editItalKiszereles").value)
      };
      if (adat.mennyiseg < 0 || adat.ar < 0 || adat.kiszereles < 0) {
        showToast("❌ Csak pozitív értéket adj meg!");
        return;
      }
      let url, method;
      if (aktualisItalId) {
        url = `${API.admin.italok}/${aktualisItalId}`;
        method = "PUT";
      } else {
        url = API.admin.italokDTO;
        method = "POST";
      }
      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adat)
      })
        .then(async res => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.uzenet || "Mentés sikertelen");
          return data;
        })
        .then(() => {
          showToast("✅ Ital mentve!");
          closeOverlay("overlayItal");
          loadCentralStock();
        })
        .catch(err => showToast("❌ " + err.message, "error"));
    });
  }
});

function torolItal(id) {
  if (!confirm(`Biztosan törölni szeretnéd a(z) ${id} azonosítójú italt?`)) return;
  fetch(`${API.admin.italok}/${id}`, { method: "DELETE" })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.uzenet || "❌ Hiba történt a törlés során.");
      return data;
    })
    .then(() => {
      showToast("✅ Ital törölve!");
      loadCentralStock();
    })
    .catch(err => showToast("❌ " + err.message, "error"));
}

// ======================================================
// INICIALIZÁLÁS
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('logoutBtn').addEventListener('click', kijelentkezes);
  loadUsers();
  loadPubs();
  loadCentralStock();
  const su = document.getElementById("searchUsers");
  if (su) su.addEventListener("input", filterUsers);
  const sp = document.getElementById("searchPubs");
  if (sp) sp.addEventListener("input", filterPubs);
  const ss = document.getElementById("searchStock");
  if (ss) ss.addEventListener("input", filterStock);
});