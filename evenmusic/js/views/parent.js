// ============================================================
// VISTAS DEL ACUDIENTE (RF12)
// ============================================================

window.ParentViews = {

    dashboard: () => {
        const hijos = (Session.user.hijos || []).map(id => getUsuario(id)).filter(Boolean);

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-home"></i> Hola, ${Session.user.nombre}</h2>
                    <p class="page-subtitle">Portal de Acudientes - RF12</p>
                </div>
            </div>

            ${hijos.length === 0 ? '<div class="empty-state"><i class="fas fa-child"></i><p>No tienes hijos registrados</p></div>' : ''}

            ${hijos.map(h => {
                const grupo = DB.grupos.find(g => g.estudiantes.includes(h.id));
                const progreso = DB.progreso.find(p => p.estudianteId === h.id);
                const pendiente = DB.pagos.find(p => p.estudianteId === h.id && p.estado === 'pendiente');

                return `
                    <div class="card" style="margin-bottom:16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                            <div style="display:flex; gap:16px; align-items:center;">
                                <span style="font-size:3rem;">${h.avatar}</span>
                                <div>
                                    <h3 style="color:var(--primary);">${h.nombre}</h3>
                                    <p style="color:var(--text-muted); font-size:0.85rem;">${grupo?.nombre || 'Sin grupo'}</p>
                                </div>
                            </div>
                            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                ${pendiente ? `<span class="badge badge-danger">💰 Pago pendiente</span>` : `<span class="badge badge-success">✅ Al día</span>`}
                                <span class="badge badge-info">📈 ${progreso ? Math.round((progreso.teoria + progreso.practica + progreso.auditivo)/3) : 0}% progreso</span>
                            </div>
                        </div>

                        ${progreso ? `
                        <div style="margin-top:16px; display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px;">
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
                        </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        `;
    },

    'mis-hijos': () => {
        const hijos = (Session.user.hijos || []).map(id => getUsuario(id)).filter(Boolean);
        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-child"></i> Mis Hijos</h2>
                    <p class="page-subtitle">Información académica de tus hijos</p>
                </div>
            </div>
            <div class="grid grid-2">
                ${hijos.map(h => {
                    const grupo = DB.grupos.find(g => g.estudiantes.includes(h.id));
                    const profe = grupo ? getUsuario(grupo.profesorId) : null;
                    return `
                        <div class="card">
                            <div style="display:flex; gap:16px; align-items:center; margin-bottom:14px;">
                                <span style="font-size:3.5rem;">${h.avatar}</span>
                                <div>
                                    <h3 style="color:var(--primary);">${h.nombre}</h3>
                                    <p style="color:var(--text-muted); font-size:0.85rem;">Nacimiento: ${h.fechaNacimiento}</p>
                                </div>
                            </div>
                            ${grupo ? `
                                <div style="padding:12px; background:var(--bg); border-radius:10px; margin-bottom:10px;">
                                    <strong>📚 ${grupo.nombre}</strong>
                                    <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">⏰ ${grupo.horario}</p>
                                </div>
                                <p style="font-size:0.9rem;"><strong>👨‍🏫 Profesor:</strong> ${profe?.nombre}</p>
                            ` : '<p style="color:var(--text-muted);">Sin grupo asignado</p>'}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    asistencia: () => {
        const hijos = (Session.user.hijos || []).map(id => getUsuario(id)).filter(Boolean);
        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-clipboard-check"></i> Asistencia</h2>
                    <p class="page-subtitle">RF12 - Historial de asistencia de tus hijos</p>
                </div>
            </div>
            ${hijos.map(h => {
                const registros = DB.asistencia.filter(a => a.estudianteId === h.id);
                return `
                    <div class="card" style="margin-bottom:16px;">
                        <h3 class="card-title">${h.avatar} ${h.nombre}</h3>
                        ${registros.length === 0 ? '<p style="color:var(--text-muted);">Sin registros</p>' : `
                            <table>
                                <thead><tr><th>Fecha</th><th>Estado</th><th>Observación</th></tr></thead>
                                <tbody>
                                    ${registros.map(r => `
                                        <tr>
                                            <td>${r.fecha}</td>
                                            <td><span class="badge badge-${r.estado === 'presente' ? 'success' : r.estado === 'tarde' ? 'warning' : 'danger'}">${r.estado}</span></td>
                                            <td>${r.observacion || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        `}
                    </div>
                `;
            }).join('')}
        `;
    },

    progreso: () => {
        const hijos = (Session.user.hijos || []).map(id => getUsuario(id)).filter(Boolean);
        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-chart-line"></i> Progreso Académico</h2>
                    <p class="page-subtitle">RF12 - Avance pedagógico por competencias</p>
                </div>
            </div>
            ${hijos.map(h => {
                const p = DB.progreso.find(x => x.estudianteId === h.id);
                if (!p) return `<div class="card" style="margin-bottom:16px;"><h3>${h.avatar} ${h.nombre}</h3><p style="color:var(--text-muted);">Sin datos de progreso</p></div>`;
                return `
                    <div class="card" style="margin-bottom:16px;">
                        <h3 class="card-title">${h.avatar} ${h.nombre}</h3>
                        <div class="grid grid-3" style="margin-top:12px;">
                            <div class="competency">
                                <div class="competency-header"><span>📖 Teoría</span><span>${p.teoria}%</span></div>
                                <div class="progress-bar"><div class="progress-fill" style="width:${p.teoria}%"></div></div>
                            </div>
                            <div class="competency">
                                <div class="competency-header"><span>🎯 Práctica</span><span>${p.practica}%</span></div>
                                <div class="progress-bar"><div class="progress-fill" style="width:${p.practica}%"></div></div>
                            </div>
                            <div class="competency">
                                <div class="competency-header"><span>👂 Auditivo</span><span>${p.auditivo}%</span></div>
                                <div class="progress-bar"><div class="progress-fill" style="width:${p.auditivo}%"></div></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    },

    pagos: () => {
        const hijos = (Session.user.hijos || []).map(id => getUsuario(id)).filter(Boolean);
        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-credit-card"></i> Pagos y Estado de Cuenta</h2>
                    <p class="page-subtitle">RF13 - Cartera de tus hijos</p>
                </div>
            </div>
            ${hijos.map(h => {
                const pagos = DB.pagos.filter(p => p.estudianteId === h.id);
                const pendientes = pagos.filter(p => p.estado === 'pendiente');
                return `
                    <div class="card" style="margin-bottom:16px;">
                        <h3 class="card-title">${h.avatar} ${h.nombre}</h3>
                        ${pendientes.length > 0 ? `<div class="badge badge-danger" style="margin-bottom:12px;">💰 ${pendientes.length} pago(s) pendiente(s)</div>` : '<div class="badge badge-success" style="margin-bottom:12px;">✅ Al día</div>'}
                        <table>
                            <thead><tr><th>Mes</th><th>Monto</th><th>Estado</th><th>Acción</th></tr></thead>
                            <tbody>
                                ${pagos.map(p => `
                                    <tr>
                                        <td>${p.mes}</td>
                                        <td>$${p.monto.toLocaleString('es-CO')}</td>
                                        <td><span class="badge badge-${p.estado === 'pagado' ? 'success' : 'danger'}">${p.estado}</span></td>
                                        <td>${p.estado === 'pendiente' ? `<button class="btn-primary btn-sm" onclick="showToast('💳 Redirigiendo a pasarela de pago...', 'info')">Pagar</button>` : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }).join('')}
        `;
    },

    circulares: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-bullhorn"></i> Circulares Informativas</h2>
                <p class="page-subtitle">RF12 - Comunicados oficiales de la escuela</p>
            </div>
        </div>
        <div class="grid" style="gap:12px;">
            <div class="card">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <strong>📢 Suspensión de clases - 20 de septiembre</strong>
                    <small style="color:var(--text-muted);">Publicado: 10 sep 2026</small>
                </div>
                <p style="color:var(--text-muted); font-size:0.9rem;">Se informa a los acudientes que el próximo 20 de septiembre no habrá clases por mantenimiento del auditorio.</p>
            </div>
            <div class="card">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <strong>🎭 Inscripciones abiertas: Recital de Primavera</strong>
                    <small style="color:var(--text-muted);">Publicado: 05 sep 2026</small>
                </div>
                <p style="color:var(--text-muted); font-size:0.9rem;">Ya están abiertas las inscripciones para el recital de primavera. Fecha límite: 30 de septiembre.</p>
            </div>
        </div>
    `,

    mensajes: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-envelope"></i> Mensajería con Profesores</h2>
                <p class="page-subtitle">RF19 - Comunicación directa</p>
            </div>
            <button class="btn-primary" onclick="showToast('✉️ Nuevo mensaje')"><i class="fas fa-paper-plane"></i> Nuevo mensaje</button>
        </div>
        <div class="grid" style="gap:10px;">
            ${DB.mensajes.filter(m => m.de === Session.user.id || m.para === Session.user.id).map(m => {
                const de = getUsuario(m.de);
                const para = getUsuario(m.para);
                return `
                    <div class="card" style="border-left:5px solid var(--info);">
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <strong>${m.asunto}</strong>
                            <small style="color:var(--text-muted);">${m.fecha}</small>
                        </div>
                        <p style="font-size:0.85rem; color:var(--text-muted);">De: ${de?.nombre} · Para: ${para?.nombre}</p>
                        <p style="margin-top:8px;">${m.cuerpo}</p>
                    </div>
                `;
            }).join('') || '<div class="empty-state"><i class="fas fa-inbox"></i><p>No hay mensajes</p></div>'}
        </div>
    `,

    'clases-grabadas': () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-play-circle"></i> Clases Grabadas</h2>
                <p class="page-subtitle">RF12 - Acceso a grabaciones de clases anteriores</p>
            </div>
        </div>
        <div class="grid grid-3">
            ${[1,2,3,4,5,6].map(i => `
                <div class="card">
                    <div style="background:var(--primary); height:120px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-size:3rem; margin-bottom:10px;">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <strong>Clase ${i} - Semana ${i}</strong>
                    <p style="color:var(--text-muted); font-size:0.8rem;">Grabada: ${i} sep 2026</p>
                </div>
            `).join('')}
        </div>
    `
};