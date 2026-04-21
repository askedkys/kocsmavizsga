// ======================================================
// STATISZTIKA OLDAL - JAVASCRIPT
// ======================================================

const STATISZTIKA_URL = "http://localhost:5147/api/statisztika";
const KOCSMA_URL = "http://localhost:5147/api/kocsma/osszes";

let betoltesFolyamatban = false;

document.addEventListener('DOMContentLoaded', function() {
    // 🔥 USER ellenőrzés TOKEN helyett
    const user = JSON.parse(localStorage.getItem('felhasznalo') || '{}');
    if (user.nev) {
        document.getElementById('userName').textContent = user.nev;
    } else {
        window.location.href = 'regisztracio_bejelentkezes.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('felhasznalo');
        window.location.href = 'regisztracio_bejelentkezes.html';
    });

    betoltMindenAdat();
});

function mutatUzenetet(szoveg, tipus) {
    const toast = document.getElementById("toastMessage");
    toast.textContent = szoveg;
    toast.className = tipus;
    setTimeout(() => {
        toast.textContent = "";
        toast.className = "";
    }, 3000);
}

async function betoltMindenAdat() {
    if (betoltesFolyamatban) return;

    try {
        betoltesFolyamatban = true;

        // 🔥 TOKEN HEADER NÉLKÜL
        const [statRes, kocsmaRes] = await Promise.all([
            fetch(STATISZTIKA_URL),
            fetch(KOCSMA_URL)
        ]);

        if (!statRes.ok || !kocsmaRes.ok) {
            throw new Error('Hiba az adatok lekérésekor');
        }

        const statData = await statRes.json();
        const kocsmaData = await kocsmaRes.json();

        // Statisztika beállítása
        document.getElementById('kocsmakSzama').textContent = statData.kocsmakSzama || 0;

        const kocsma = statData.legnepszerubbKocsma || {};
        document.getElementById('legnepszerubbKocsma').textContent = kocsma.nev || 'Nincs adat';
        document.getElementById('legnepszerubbKocsmaInfo').textContent = 
            kocsma.rendelesDb ? `${kocsma.rendelesDb} db ital` : '';

        const ital = statData.legtobbetRendeltItal || {};
        document.getElementById('legtobbetRendeltItal').textContent = ital.nev || 'Nincs adat';
        document.getElementById('legtobbetRendeltItalInfo').textContent = 
            ital.darab ? `${ital.darab} db` : '';

        document.getElementById('teljesForgalom').textContent = 
            Math.round(statData.teljesForgalom || 0).toLocaleString('hu-HU') + ' Ft';
        document.getElementById('osszesTermekDb').textContent = 
            (statData.osszesTermekDb || 0).toLocaleString('hu-HU');

        // Kocsmák megjelenítése
        megjelenitKocsmak(kocsmaData);

    } catch (error) {
        mutatUzenetet('❌ Betöltési hiba', 'error');
    } finally {
        betoltesFolyamatban = false;
    }
}

function megjelenitKocsmak(kocsmak) {
    const container = document.getElementById('pubsContainer');
    
    if (!kocsmak || kocsmak.length === 0) {
        container.innerHTML = '<div class="no-data">📭 Nincsenek kocsmák</div>';
        return;
    }
    
    let html = '';
    
    for (let i = 0; i < kocsmak.length; i++) {
        const k = kocsmak[i];
        
        const hetfo = k.hetfo || 'Zárva';
        const kedd = k.kedd || 'Zárva';
        const szerda = k.szerda || 'Zárva';
        const csutortok = k.csutortok || 'Zárva';
        const pentek = k.pentek || 'Zárva';
        const szombat = k.szombat || 'Zárva';
        const vasarnap = k.vasarnap || 'Zárva';
        
        const nyitvatartasRovid = `H:${hetfo} K:${kedd} Sze:${szerda} Cs:${csutortok} P:${pentek} Szo:${szombat} V:${vasarnap}`;
        
        html += '<div class="pub-item">';
        html += '    <div class="pub-icon">🏠</div>';
        html += '    <div class="pub-info">';
        html += '        <div><b>' + (k.nev || 'Névtelen') + '</b></div>';
        html += '        <div>📍 ' + (k.cim || 'Nincs cím') + '</div>';
        html += '        <div>📞 ' + (k.telefon || 'Nincs telefon') + '</div>';
        html += '        <div>🕒 ' + nyitvatartasRovid + '</div>';
        html += '    </div>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}