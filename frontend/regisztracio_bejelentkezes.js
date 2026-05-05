function showMessage(message, type = 'error') {
    const hibaDiv = document.getElementById('hibaUzenet');
    
    hibaDiv.textContent = message;
    hibaDiv.className = '';
    hibaDiv.classList.add(type);
    hibaDiv.classList.add('show');
    
    setTimeout(() => {
        hibaDiv.classList.remove('show');
    }, 3000);
}

function showForm(type) {
    document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none';
    document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
    
    const hibaDiv = document.getElementById('hibaUzenet');
    hibaDiv.className = '';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (type === 'login') {
        document.getElementById('nav-bejelentkezes').classList.add('active');
    } else if (type === 'register') {
        document.getElementById('nav-regisztracio').classList.add('active');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function Regisztracio() {
    const nev = document.getElementById('nev').value.trim();
    const felhasznalonev = document.getElementById('felhasznalonev').value.trim();
    const email = document.getElementById('email').value.trim();
    const jelszo = document.getElementById('jelszo').value.trim();

    if (!nev || !felhasznalonev || !email || !jelszo) {
        showMessage("Hiányzó adatok! Kérjük, töltsd ki az összes mezőt.", "info");
        return;
    }
    
    if (jelszo.length < 6) {
        showMessage("A jelszónak legalább 6 karakter hosszúnak kell lennie!", "info");
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage("Kérjük, adj meg egy érvényes email címet (pl. pelda@gmail.com)!", "info");
        return;
    }

    const formData = { 
        Nev: nev, 
        Felhasznalonev: felhasznalonev, 
        Email: email, 
        Jelszo: jelszo,
        IsAdmin: false,
        KocsmaId: null
    };

    fetch(API.adatok.regisztracio, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        const data = await response.json();

        if (response.ok) {
            showMessage(`Sikeres regisztráció! Üdvözöllek ${felhasznalonev}!`, "success");
            
            setTimeout(() => {
                document.getElementById('loginFelhasznalonev').value = felhasznalonev;
                showForm('login');
            }, 2000);
            
            document.getElementById('nev').value = "";
            document.getElementById('felhasznalonev').value = "";
            document.getElementById('email').value = "";
            document.getElementById('jelszo').value = "";
            
        } else if (response.status === 409) {
            showMessage(data.uzenet || "Ez a felhasználónév vagy email már foglalt!", "error");
        } else {
            showMessage(data.uzenet || "Hiba történt a regisztráció során!", "error");
        }
    })
    .catch(error => {
        showMessage("Hálózati hiba: " + error.message, "error");
    });
}

function Bejelentkezes() {
    const felhasznalonev = document.getElementById('loginFelhasznalonev').value.trim();
    const jelszo = document.getElementById('loginJelszo').value.trim();
    
    if (!felhasznalonev || !jelszo) {
        showMessage("Kérjük, töltsd ki mindkét mezőt!", "info");
        return;
    }

    fetch(API.adatok.bejelentkezes, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ felhasznalonev, jelszo })
    })
    .then(async response => {
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("felhasznalo", JSON.stringify(data.felhasznalo));

            showMessage("Sikeres bejelentkezés!", "success");
            
            setTimeout(() => {
                const felhasznalo = data.felhasznalo;
                
                const kocsmaId = felhasznalo.kocsmaId || felhasznalo.KocsmaId;
                const isAdmin = felhasznalo.isAdmin || felhasznalo.IsAdmin || felhasznalo.admin;
                
                if (isAdmin === true) {
                    window.location.href = "admin.html";
                } else if (kocsmaId) {
                    window.location.href = "kocsma.html";
                } else {
                    window.location.href = "statisztika.html";
                }
            }, 1500);
        } else {
            showMessage(data.uzenet ?? data.Uzenet ?? "Hibás felhasználónév vagy jelszó", "error");
        }
    })
    .catch(error => {
        showMessage("Hálózati hiba: " + error.message, "error");
    });
}

document.addEventListener('DOMContentLoaded', function() {
    showForm('register');
    
    document.getElementById('nav-bejelentkezes').addEventListener('click', function(e) {
        e.preventDefault();
        showForm('login');
    });
    
    document.getElementById('nav-regisztracio').addEventListener('click', function(e) {
        e.preventDefault();
        showForm('register');
    });
    
    document.getElementById('loginJelszo').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            Bejelentkezes();
        }
    });
    
    document.getElementById('jelszo').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            Regisztracio();
        }
    });
});