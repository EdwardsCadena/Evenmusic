// ============================================================
// INICIALIZACIÓN DE LA APP
// ============================================================

function initApp() {
    // Actualizar header con info del usuario
    document.getElementById('roleBadge').textContent = {
        admin: '🛡️ Administrador',
        teacher: '👨‍🏫 Profesor',
        student: '👦 Estudiante',
        parent: '👨‍👩‍👧 Acudiente'
    }[Session.role];

    document.getElementById('roleBadge').className = 'role-badge ' + Session.role;
    document.getElementById('userName').textContent = Session.user.nombre;
    document.getElementById('userEmail').textContent = Session.user.email;
    document.getElementById('userAvatar').textContent = Session.user.avatar;

    // Renderizar sidebar + vista inicial
    currentView = 'dashboard';
    renderSidebar();
    renderView();

    showToast(`👋 ¡Bienvenido, ${Session.user.nombre}!`, 'success');
}

// ============================================================
// EVENT LISTENERS GLOBALES
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('appScreen').classList.remove('active');
});