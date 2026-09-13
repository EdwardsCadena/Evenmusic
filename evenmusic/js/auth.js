// ============================================================
// AUTENTICACIÓN Y SESIÓN (RF01 + RNF05)
// ============================================================

function handleLogin(e) {
    if (e) e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const role = document.getElementById('loginRole').value;

    let user = DB.usuarios.find(u => u.email === email && u.rol === role);
    if (!user) {
        user = DB.usuarios.find(u => u.rol === role);
    }

    if (!user) {
        showToast('❌ Usuario no encontrado', 'error');
        return;
    }

    Session.user = user;
    Session.role = user.rol;

    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');

    try {
        initApp();
    } catch (err) {
        console.error('❌ Error en initApp:', err);
        showToast('Error: ' + err.message, 'error');
    }
}

function quickLogin(role) {
    const emails = {
        admin: 'admin@evenmusic.com',
        teacher: 'profe@evenmusic.com',
        student: 'alumno@evenmusic.com',
        parent: 'padre@evenmusic.com'
    };
    document.getElementById('loginEmail').value = emails[role];
    document.getElementById('loginPassword').value = '123456';
    document.getElementById('loginRole').value = role;
}

function handleLogout() {
    Session.user = null;
    Session.role = null;
    document.getElementById('appScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('loginForm').reset();
}