// ============================================================
// VISTAS DEL PROFESOR (RF04)
// ============================================================

window.TeacherViews = {

    dashboard: () => {
        const myGroups = DB.grupos.filter(g => g.profesorId === Session.user.id);
        const totalStudents = myGroups.reduce((a, g) => a + g.estudiantes.length, 0);
        const todayMeetings = myGroups.length;

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-home"></i> Hola, ${Session.user.nombre.split(' ')[0]} 👋</h2>
                    <p class="page-subtitle">Aquí está tu resumen de hoy</p>
                </div>
            </div>

            <div class="grid grid-4" style="margin-bottom:20px;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-layer-group"></i></div>
                    <div class="stat-info"><h4>${myGroups.length}</h4><p>Grupos asignados</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-user-graduate"></i></div>
                    <div class="stat-info"><h4>${totalStudents}</h4><p>Estudiantes</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon yellow"><i class="fas fa-video"></i></div>
                    <div class="stat-info"><h4>${todayMeetings}</h4><p>Clases hoy</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="fas fa-envelope"></i></div>
                    <div class="stat-info"><h4>${DB.mensajes.length}</h4><p>Mensajes</p></div>
                </div>
            </div>

            <h3 style="color:var(--primary); margin-bottom:12px;"><i class="fas fa-calendar-day"></i> Mis grupos</h3>
            <div class="grid grid-2">
                ${myGroups.map(g => `
                    <div class="card">
                        <div style="display:flex; justify-content:space-between;">
                            <h3 class="card-title">${g.nombre}</h3>
                            <span class="badge badge-info">${getNombreNivel(g.nivelId)}</span>
                        </div>
                        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:10px;">${g.horario}</p>
                        <p style="margin-bottom:10px;">👥 <strong>${g.estudiantes.length}</strong> estudiantes</p>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-primary btn-sm" onclick="navigateTo('asistencia')"><i class="fas fa-clipboard-check"></i> Asistencia</button>
                            <button class="btn-secondary btn-sm" onclick="navigateTo('reuniones')"><i class="fas fa-video"></i> Reunión</button>
                        </div>
                    </div>
                `).join('') || '<div class="empty-state"><i class="fas fa-inbox"></i><p>No tienes grupos asignados</p></div>'}
            </div>
        `;
    },

    'mis-grupos': () => {
        const myGroups = DB.grupos.filter(g => g.profesorId === Session.user.id);
        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-layer-group"></i> Mis Grupos</h2>
                    <p class="page-subtitle">RF04 - Solo ves tus grupos asignados (RNF05: RBAC)</p>
                </div>
            </div>
            <div class="grid grid-2">
                ${myGroups.map(g => `
                    <div class="card">
                        <h3 class="card-title">${getNombreInstrumento(g.instrumentoId)} ${g.nombre}</h3>
                        <p style="color:var(--text-muted); font-size:0.85rem;">⏰ ${g.horario}</p>
                        <div style="margin:12px 0; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="badge badge-info">📊 ${getNombreNivel(g.nivelId)}</span>
                            <span class="badge badge-warning">👶 ${getNombreRangoEdad(g.rangoEdadId)}</span>
                        </div>
                        <h4 style="margin-top:12px; color:var(--primary); font-size:0.9rem;">Estudiantes:</h4>
                        ${g.estudiantes.map(eid => {
                            const est = getUsuario(eid);
                            return `<div style="padding:6px 0; font-size:0.9rem;">${est?.avatar} ${est?.nombre}</div>`;
                        }).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    },

    asistencia: () => {
        const myGroups = DB.grupos.filter(g => g.profesorId === Session.user.id);
        const firstGroup = myGroups[0];
        const students = firstGroup ? firstGroup.estudiantes.map(id => getUsuario(id)) : [];

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-clipboard-check"></i> Control de Asistencia</h2>
                    <p class="page-subtitle">RF04 - Registro diario de asistencia y observaciones</p>
                </div>
                <span class="badge badge-info">${new Date().toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
            </div>

            <div class="card" style="margin-bottom:20px;">
                <label style="font-weight:700; margin-bottom:8px; display:block;">Grupo:</label>
                <select style="max-width:400px; padding:10px; border-radius:8px; border:2px solid var(--border); font-family:'Quicksand'; font-weight:600;">
                    ${myGroups.map(g => `<option>${g.nombre}</option>`).join('')}
                </select>
            </div>

            <div class="grid grid-2">
                ${students.map(s => `
                    <div class="card">
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                            <span style="font-size:2.5rem;">${s.avatar}</span>
                            <div>
                                <strong style="font-size:1.1rem;">${s.nombre}</strong>
                                <p style="color:var(--text-muted); font-size:0.8rem;">${getNombreRangoEdad(DB.usuarios.find(u=>u.id===s.id)?.rangoEdadId || 1)}</p>
                            </div>
                        </div>
                        <div style="display:flex; gap:6px; margin-bottom:10px;">
                            <button class="btn-primary btn-sm" style="flex:1; background:#4ade80;" onclick="markAttendance(this, 'presente')">✅ Presente</button>
                            <button class="btn-primary btn-sm" style="flex:1; background:#fbbf24;" onclick="markAttendance(this, 'tarde')">⏰ Tarde</button>
                            <button class="btn-primary btn-sm" style="flex:1; background:#f05454;" onclick="markAttendance(this, 'ausente')">❌ Ausente</button>
                        </div>
                        <textarea placeholder="Observación pedagógica..." style="width:100%; padding:8px; border-radius:8px; border:2px solid var(--border); font-family:'Quicksand'; font-size:0.85rem; resize:none;" rows="2"></textarea>
                    </div>
                `).join('') || '<div class="empty-state"><i class="fas fa-user-graduate"></i><p>No hay estudiantes en este grupo</p></div>'}
            </div>
        `;
    },

    tareas: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-tasks"></i> Tareas y Actividades</h2>
                <p class="page-subtitle">RF08 - Asignaciones y entrega de evidencias</p>
            </div>
            <button class="btn-primary" onclick="showToast('➕ Nueva tarea')"><i class="fas fa-plus"></i> Nueva Tarea</button>
        </div>
        <div class="grid grid-2">
            ${DB.tareas.map(t => `
                <div class="card">
                    <div style="display:flex; justify-content:space-between;">
                        <h3 class="card-title">${t.titulo}</h3>
                        <span class="badge ${t.estado === 'entregada' ? 'badge-success' : 'badge-warning'}">${t.estado}</span>
                    </div>
                    <p style="color:var(--text-muted); font-size:0.9rem;">${t.descripcion}</p>
                    <p style="margin-top:8px; font-size:0.85rem;"><i class="fas fa-calendar"></i> Entrega: ${t.fechaEntrega}</p>
                </div>
            `).join('')}
        </div>
    `,

    materiales: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-folder-open"></i> Repositorio de Materiales</h2>
                <p class="page-subtitle">RF05 - Carga recursos multimedia por semana/módulo</p>
            </div>
            <button class="btn-primary" onclick="showToast('➕ Subir material')"><i class="fas fa-upload"></i> Subir</button>
        </div>
        <div class="grid grid-2">
            ${DB.materiales.map(m => `
                <div class="card" style="display:flex; gap:12px; align-items:center;">
                    <div class="stat-icon ${m.tipo === 'PDF' ? 'red' : 'blue'}"><i class="fas fa-${m.tipo === 'PDF' ? 'file-pdf' : 'video'}"></i></div>
                    <div style="flex:1;">
                        <strong>${m.titulo}</strong>
                        <p style="color:var(--text-muted); font-size:0.8rem;">Semana ${m.semana}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `,

    reuniones: () => {
        const meetingId = generateMeetingId();
        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-video"></i> Reuniones y Clases en Vivo</h2>
                    <p class="page-subtitle">RF06 + RF07 - Integración con Google Meet y Calendar</p>
                </div>
            </div>

            <div class="meeting-box" style="margin-bottom:20px;">
                <h3 style="margin-bottom:12px; color:var(--accent-2);"><i class="fas fa-broadcast-tower"></i> Clase en vivo</h3>
                <p style="margin-bottom:10px; opacity:0.9;">Comparte este ID con tus estudiantes:</p>
                <div class="meeting-id" onclick="copyToClipboard('${meetingId}')">${meetingId}</div>
                <div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
                    <button class="btn-primary" onclick="window.open(getMeetingUrl('${meetingId}','meet'), '_blank')"><i class="fas fa-video"></i> Abrir en Google Meet</button>
                    <button class="btn-accent btn-primary" onclick="copyToClipboard(getMeetingUrl('${meetingId}','meet'))"><i class="fas fa-link"></i> Copiar enlace</button>
                    <button class="btn-secondary" onclick="window.open('https://calendar.google.com', '_blank')"><i class="fas fa-calendar-plus"></i> Agregar a Calendar</button>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title"><i class="fas fa-history"></i> Historial de reuniones</h3>
                <p style="color:var(--text-muted); font-size:0.85rem;">Las reuniones pasadas se pueden consultar desde el calendario</p>
            </div>
        `;
    },

    recitales: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-theater-masks"></i> Recitales</h2>
                <p class="page-subtitle">RF18 - Participación en eventos</p>
            </div>
        </div>
        <div class="grid grid-2">
            ${DB.recitales.map(r => `
                <div class="card">
                    <h3 class="card-title">🎭 ${r.titulo}</h3>
                    <p style="color:var(--text-muted);">📅 ${r.fecha} · 📍 ${r.lugar}</p>
                    <p style="margin-top:10px; font-size:0.85rem;">👥 ${r.participantes.length} estudiantes inscritos</p>
                </div>
            `).join('')}
        </div>
    `,

    mensajes: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-envelope"></i> Mensajería Interna</h2>
                <p class="page-subtitle">RF19 - Comunicación con acudientes y admin</p>
            </div>
            <button class="btn-primary" onclick="showToast('✉️ Nuevo mensaje')"><i class="fas fa-paper-plane"></i> Nuevo</button>
        </div>
        <div class="grid" style="gap:10px;">
            ${DB.mensajes.map(m => {
                const de = getUsuario(m.de);
                const para = getUsuario(m.para);
                return `
                    <div class="card" style="${m.leido ? '' : 'border-left:5px solid var(--accent-2);'}">
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <strong>${m.asunto}</strong>
                            <small style="color:var(--text-muted);">${m.fecha}</small>
                        </div>
                        <p style="font-size:0.85rem; color:var(--text-muted);">De: ${de?.nombre} · Para: ${para?.nombre}</p>
                        <p style="margin-top:8px;">${m.cuerpo}</p>
                    </div>
                `;
            }).join('')}
        </div>
    `
};

function markAttendance(btn, estado) {
    const parent = btn.parentElement;
    parent.querySelectorAll('button').forEach(b => b.style.opacity = '0.4');
    btn.style.opacity = '1';
    showToast(`✅ Marcado como ${estado}`, 'success');
    if (estado === 'presente') createConfetti(btn);
}