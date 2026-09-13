// ============================================================
// VISTAS DEL ESTUDIANTE (RNF02: UX amigable para niños)
// ============================================================

window.StudentViews = {

    dashboard: () => {
        const student = Session.user;
        const grupo = DB.grupos.find(g => g.estudiantes.includes(student.id));
        const progreso = DB.progreso.find(p => p.estudianteId === student.id);
        const insignias = DB.insigniasObtenidas.filter(i => i.estudianteId === student.id);

        return `
            <div class="card" style="background:linear-gradient(135deg, #e8f0fe 0%, #d4e2f7 100%); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                <div>
                    <h2 style="color:var(--primary); font-size:1.8rem;">🎵 ¡Hola, ${student.nombre.split(' ')[0]}!</h2>
                    <p style="color:var(--text-muted); font-weight:600; margin-top:6px;">${grupo?.nombre || 'Sin grupo asignado'}</p>
                    <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
                        <span class="badge badge-warning">⭐ ${insignias.length} logros</span>
                        <span class="badge badge-info">📈 ${progreso ? Math.round((progreso.teoria + progreso.practica + progreso.auditivo)/3) : 0}% avance</span>
                    </div>
                </div>
                <div style="font-size:5rem;">${student.avatar}</div>
            </div>

            <div class="grid grid-3">
                <div class="card">
                    <h3 class="card-title">🎯 Mi próxima clase</h3>
                    <p style="font-size:1.1rem; font-weight:700; color:var(--primary);">📅 Hoy 16:00</p>
                    <p style="color:var(--text-muted); font-size:0.85rem;">${grupo?.horario || ''}</p>
                    <button class="btn-primary btn-block" style="margin-top:12px;" onclick="navigateTo('clase-en-vivo')">
                        <i class="fas fa-video"></i> Unirme a la clase
                    </button>
                </div>
                <div class="card">
                    <h3 class="card-title">📊 Mi progreso</h3>
                    ${progreso ? `
                        <div class="competency">
                            <div class="competency-header"><span>📖 Teoría</span><span>${progreso.teoria}%</span></div>
                            <div class="progress-bar"><div class="progress-fill" style="width:${progreso.teoria}%"></div></div>
                        </div>
                        <div class="competency">
                            <div class="competency-header"><span>🎯 Práctica</span><span>${progreso.practica}%</span></div>
                            <div class="progress-bar"><div class="progress-fill" style="width:${progreso.practica}%"></div></div>
                        </div>
                        <div class="competency">
                            <div class="competency-header"><span>👂 Auditivo</span><span>${progreso.auditivo}%</span></div>
                            <div class="progress-bar"><div class="progress-fill" style="width:${progreso.auditivo}%"></div></div>
                        </div>
                    ` : '<p style="color:var(--text-muted);">Aún no tienes progreso registrado</p>'}
                </div>
                <div class="card">
                    <h3 class="card-title">🏆 Mis logros recientes</h3>
                    ${insignias.length > 0 ? insignias.slice(0,3).map(i => {
                        const ins = DB.insignias.find(x => x.id === i.insigniaId);
                        return `
                            <div class="insignia" style="margin-bottom:8px;">
                                <div class="icon">${ins?.icon}</div>
                                <div class="info">
                                    <strong>${ins?.nombre}</strong>
                                    <small>${ins?.descripcion}</small>
                                </div>
                            </div>
                        `;
                    }).join('') : '<p style="color:var(--text-muted);">¡Sigue practicando para ganar logros!</p>'}
                </div>
            </div>
        `;
    },

    'mi-grupo': () => {
        const student = Session.user;
        const grupo = DB.grupos.find(g => g.estudiantes.includes(student.id));
        if (!grupo) return '<div class="empty-state"><i class="fas fa-inbox"></i><p>No estás asignado a ningún grupo</p></div>';
        const profe = getUsuario(grupo.profesorId);
        const compañeros = grupo.estudiantes.filter(id => id !== student.id).map(id => getUsuario(id));

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-users"></i> Mi Grupo</h2>
                    <p class="page-subtitle">${grupo.nombre}</p>
                </div>
            </div>
            <div class="grid grid-2">
                <div class="card">
                    <h3 class="card-title">👨‍🏫 Mi profesor</h3>
                    <div style="display:flex; gap:12px; align-items:center;">
                        <span style="font-size:3rem;">${profe?.avatar}</span>
                        <div>
                            <strong style="font-size:1.1rem;">${profe?.nombre}</strong>
                            <p style="color:var(--text-muted); font-size:0.85rem;">${profe?.especialidad}</p>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <h3 class="card-title">⏰ Horario</h3>
                    <p style="font-size:1.1rem; font-weight:700; color:var(--primary);">${grupo.horario}</p>
                    <p style="color:var(--text-muted); font-size:0.85rem; margin-top:8px;">
                        ${getNombreInstrumento(grupo.instrumentoId)} · ${getNombreNivel(grupo.nivelId)}
                    </p>
                </div>
            </div>
            ${compañeros.length > 0 ? `
                <div class="card" style="margin-top:16px;">
                    <h3 class="card-title">👥 Mis compañeros (${compañeros.length})</h3>
                    <div style="display:flex; gap:12px; flex-wrap:wrap;">
                        ${compañeros.map(c => `
                            <div style="display:flex; align-items:center; gap:8px; padding:8px 14px; background:var(--bg); border-radius:10px;">
                                <span style="font-size:1.5rem;">${c.avatar}</span>
                                <strong>${c.nombre}</strong>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    },

    'mi-progreso': () => {
        const progreso = DB.progreso.find(p => p.estudianteId === Session.user.id);
        if (!progreso) return '<div class="empty-state"><i class="fas fa-chart-line"></i><p>Aún no tienes progreso registrado</p></div>';

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-chart-line"></i> Mi Progreso Musical</h2>
                    <p class="page-subtitle">RF09 - Avance por competencias</p>
                </div>
            </div>
            <div class="grid grid-3">
                <div class="card" style="text-align:center;">
                    <div style="font-size:3rem;">📖</div>
                    <h3 class="card-title">Teoría</h3>
                    <p style="font-size:2.5rem; color:var(--accent); font-weight:800;">${progreso.teoria}%</p>
                    <div class="progress-bar"><div class="progress-fill" style="width:${progreso.teoria}%"></div></div>
                </div>
                <div class="card" style="text-align:center;">
                    <div style="font-size:3rem;">🎯</div>
                    <h3 class="card-title">Práctica</h3>
                    <p style="font-size:2.5rem; color:var(--accent); font-weight:800;">${progreso.practica}%</p>
                    <div class="progress-bar"><div class="progress-fill" style="width:${progreso.practica}%"></div></div>
                </div>
                <div class="card" style="text-align:center;">
                    <div style="font-size:3rem;">👂</div>
                    <h3 class="card-title">Entrenamiento Auditivo</h3>
                    <p style="font-size:2.5rem; color:var(--accent); font-weight:800;">${progreso.auditivo}%</p>
                    <div class="progress-bar"><div class="progress-fill" style="width:${progreso.auditivo}%"></div></div>
                </div>
            </div>
        `;
    },

    'mis-logros': () => {
        const obtenidas = DB.insigniasObtenidas.filter(i => i.estudianteId === Session.user.id);

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-trophy"></i> Mis Logros e Insignias</h2>
                    <p class="page-subtitle">RF10 - Desbloquea reconocimientos</p>
                </div>
            </div>
            <div class="grid grid-3">
                ${DB.insignias.map(ins => {
                    const obtenida = obtenidas.find(o => o.insigniaId === ins.id);
                    return `
                        <div class="insignia ${obtenida ? '' : 'locked'}">
                            <div class="icon">${ins.icon}</div>
                            <div class="info">
                                <strong>${ins.nombre}</strong>
                                <small>${ins.descripcion}</small>
                                ${obtenida ? `<small style="color:var(--success); display:block; margin-top:4px;">✅ ${obtenida.fecha}</small>` : '<small style="display:block; margin-top:4px;">🔒 Bloqueado</small>'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    'mis-certificados': () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-certificate"></i> Mis Certificados</h2>
                <p class="page-subtitle">RF11 - Certificados del Viaje Musical Evenmusic</p>
            </div>
        </div>
        <div class="empty-state">
            <i class="fas fa-certificate"></i>
            <p>Aún no has completado ninguna etapa</p>
            <p style="font-size:0.85rem;">¡Sigue practicando para obtener tu primer certificado!</p>
        </div>
    `,

    materiales: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-folder-open"></i> Materiales de Clase</h2>
                <p class="page-subtitle">Recursos que tu profesor ha compartido</p>
            </div>
        </div>
        <div class="grid grid-2">
            ${DB.materiales.map(m => `
                <div class="card" style="display:flex; gap:12px; align-items:center;">
                    <div class="stat-icon ${m.tipo === 'PDF' ? 'red' : 'blue'}"><i class="fas fa-${m.tipo === 'PDF' ? 'file-pdf' : 'video'}"></i></div>
                    <div style="flex:1;">
                        <strong>${m.titulo}</strong>
                        <p style="color:var(--text-muted); font-size:0.8rem;">Semana ${m.semana}</p>
                    </div>
                    <button class="btn-primary btn-sm">Abrir</button>
                </div>
            `).join('')}
        </div>
    `,

    tareas: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-tasks"></i> Mis Tareas</h2>
                <p class="page-subtitle">RF08 - Tareas asignadas por tu profesor</p>
            </div>
        </div>
        <div class="grid grid-2">
            ${DB.tareas.map(t => `
                <div class="card">
                    <div style="display:flex; justify-content:space-between;">
                        <h3 class="card-title">${t.titulo}</h3>
                        <span class="badge ${t.estado === 'entregada' ? 'badge-success' : 'badge-warning'}">${t.estado}</span>
                    </div>
                    <p style="color:var(--text-muted); font-size:0.9rem;">${t.descripcion}</p>
                    <p style="margin-top:8px; font-size:0.85rem;"><i class="fas fa-calendar"></i> ${t.fechaEntrega}</p>
                    ${t.estado === 'pendiente' ? `
                        <button class="btn-primary btn-block" style="margin-top:10px;" onclick="showToast('📤 Evidencia enviada', 'success'); createConfetti(this)">
                            <i class="fas fa-upload"></i> Entregar
                        </button>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `,

    'clase-en-vivo': () => {
        const grupo = DB.grupos.find(g => g.estudiantes.includes(Session.user.id));
        const meetingId = generateMeetingId();

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-video"></i> Clase en Vivo</h2>
                    <p class="page-subtitle">RF06 - Acceso directo a Google Meet</p>
                </div>
            </div>

            <div class="meeting-box">
                <h3 style="margin-bottom:12px; color:var(--accent-2);"><i class="fas fa-broadcast-tower"></i> ${grupo?.nombre || 'Clase'}</h3>
                <p style="opacity:0.9; margin-bottom:12px;">Tu profesor iniciará la clase pronto</p>
                <div class="meeting-id" onclick="copyToClipboard('${meetingId}')">${meetingId}</div>
                <div style="margin-top:16px;">
                    <button class="btn-primary" style="background:var(--success); color:#14532d;" onclick="window.open(getMeetingUrl('${meetingId}','meet'), '_blank')">
                        <i class="fas fa-sign-in-alt"></i> Unirme ahora
                    </button>
                </div>
            </div>

            <div class="card" style="margin-top:20px;">
                <h3 class="card-title">📼 Clases grabadas</h3>
                <p style="color:var(--text-muted);">Aquí podrás ver las clases anteriores</p>
            </div>
        `;
    },

    recitales: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-theater-masks"></i> Recitales</h2>
                <p class="page-subtitle">RF18 - Eventos en los que participas</p>
            </div>
        </div>
        <div class="grid grid-2">
            ${DB.recitales.map(r => `
                <div class="card">
                    <h3 class="card-title">🎭 ${r.titulo}</h3>
                    <p style="color:var(--text-muted);">📅 ${r.fecha} · 📍 ${r.lugar}</p>
                    ${r.participantes.includes(Session.user.id) 
                        ? '<span class="badge badge-success" style="margin-top:10px;">✅ Estás inscrito</span>' 
                        : '<button class="btn-primary btn-sm" style="margin-top:10px;" onclick="showToast(\'🎉 ¡Inscrito!\', \'success\')">Inscribirme</button>'}
                </div>
            `).join('')}
        </div>
    `
};