// ============================================================
// ROUTER Y MENÚ DINÁMICO POR ROL
// ============================================================

const MENUS = {
    admin: [
        { section: 'Gestión' },
        { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
        { id: 'usuarios', icon: 'fa-users', label: 'Usuarios' },
        { id: 'catalogos', icon: 'fa-list', label: 'Catálogos' },
        { id: 'grupos', icon: 'fa-layer-group', label: 'Grupos' },
        { section: 'Académico' },
        { id: 'matriculas', icon: 'fa-user-plus', label: 'Matrículas' },
        { id: 'recitales', icon: 'fa-theater-masks', label: 'Recitales' },
        { id: 'materiales', icon: 'fa-folder-open', label: 'Materiales' },
        { section: 'Administración' },
        { id: 'pagos', icon: 'fa-credit-card', label: 'Pagos' },
        { id: 'descuentos', icon: 'fa-percent', label: 'Descuentos' },
        { id: 'reportes', icon: 'fa-file-alt', label: 'Reportes' },
        { id: 'auditoria', icon: 'fa-history', label: 'Auditoría' }
    ],
    teacher: [
        { section: 'Mis clases' },
        { id: 'dashboard', icon: 'fa-home', label: 'Inicio' },
        { id: 'mis-grupos', icon: 'fa-layer-group', label: 'Mis Grupos' },
        { id: 'asistencia', icon: 'fa-clipboard-check', label: 'Asistencia' },
        { id: 'tareas', icon: 'fa-tasks', label: 'Tareas' },
        { section: 'Recursos' },
        { id: 'materiales', icon: 'fa-folder-open', label: 'Materiales' },
        { id: 'reuniones', icon: 'fa-video', label: 'Reuniones' },
        { id: 'recitales', icon: 'fa-theater-masks', label: 'Recitales' },
        { section: 'Comunicación' },
        { id: 'mensajes', icon: 'fa-envelope', label: 'Mensajes' }
    ],
    student: [
        { section: 'Mi viaje musical' },
        { id: 'dashboard', icon: 'fa-home', label: 'Inicio' },
        { id: 'mi-grupo', icon: 'fa-users', label: 'Mi Grupo' },
        { id: 'mi-progreso', icon: 'fa-chart-line', label: 'Mi Progreso' },
        { id: 'mis-logros', icon: 'fa-trophy', label: 'Mis Logros' },
        { id: 'mis-certificados', icon: 'fa-certificate', label: 'Certificados' },
        { section: 'Recursos' },
        { id: 'materiales', icon: 'fa-folder-open', label: 'Materiales' },
        { id: 'tareas', icon: 'fa-tasks', label: 'Mis Tareas' },
        { id: 'clase-en-vivo', icon: 'fa-video', label: 'Clase en vivo' },
        { section: 'Eventos' },
        { id: 'recitales', icon: 'fa-theater-masks', label: 'Recitales' }
    ],
    parent: [
        { section: 'Mi familia' },
        { id: 'dashboard', icon: 'fa-home', label: 'Inicio' },
        { id: 'mis-hijos', icon: 'fa-child', label: 'Mis Hijos' },
        { id: 'asistencia', icon: 'fa-clipboard-check', label: 'Asistencia' },
        { id: 'progreso', icon: 'fa-chart-line', label: 'Progreso' },
        { section: 'Administración' },
        { id: 'pagos', icon: 'fa-credit-card', label: 'Pagos' },
        { id: 'circulares', icon: 'fa-bullhorn', label: 'Circulares' },
        { section: 'Comunicación' },
        { id: 'mensajes', icon: 'fa-envelope', label: 'Mensajes' },
        { id: 'clases-grabadas', icon: 'fa-play-circle', label: 'Clases Grabadas' }
    ]
};

let currentView = 'dashboard';

function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menu = MENUS[Session.role] || [];
    sidebar.innerHTML = '';

    menu.forEach(item => {
        if (item.section) {
            const section = document.createElement('div');
            section.className = 'sidebar-section';
            section.textContent = item.section;
            sidebar.appendChild(section);
        } else {
            const btn = document.createElement('button');
            btn.className = 'sidebar-item' + (item.id === currentView ? ' active' : '');
            btn.innerHTML = `<i class="fas ${item.icon}"></i> <span>${item.label}</span>`;
            btn.onclick = () => navigateTo(item.id);
            sidebar.appendChild(btn);
        }
    });
}

function navigateTo(viewId) {
    currentView = viewId;
    renderSidebar();
    renderView();
}

function renderView() {
    const container = document.getElementById('mainContent');
    const views = {
        admin: window.AdminViews,
        teacher: window.TeacherViews,
        student: window.StudentViews,
        parent: window.ParentViews
    };
    const viewsByRole = views[Session.role] || {};
    const renderFn = viewsByRole[currentView] || viewsByRole.dashboard;
    if (renderFn) {
        container.innerHTML = renderFn();
        // Ejecutar hooks post-render
        if (viewsByRole[`${currentView}After`]) {
            viewsByRole[`${currentView}After`]();
        }
    } else {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-tools"></i><p>Vista en construcción</p></div>`;
    }
}