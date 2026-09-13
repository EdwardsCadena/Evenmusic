// ============================================================
// VISTAS DEL ADMINISTRADOR
// ============================================================

window.AdminViews = {

    dashboard: () => {
        const totalAlumnos = DB.usuarios.filter(u => u.rol === 'student').length;
        const totalProfes = DB.usuarios.filter(u => u.rol === 'teacher').length;
        const totalGrupos = DB.grupos.filter(g => g.activo).length;
        const totalRecaudado = DB.pagos.filter(p => p.estado === 'pagado').reduce((a, p) => a + p.monto, 0);
        const pendientes = DB.pagos.filter(p => p.estado === 'pendiente').length;

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-chart-line"></i> Dashboard Administrativo</h2>
                    <p class="page-subtitle">Resumen general de Evenmusic</p>
                </div>
                <span class="badge badge-info"><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>

            <div class="grid grid-4" style="margin-bottom:20px;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-user-graduate"></i></div>
                    <div class="stat-info"><h4>${totalAlumnos}</h4><p>Estudiantes activos</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="fas fa-chalkboard-teacher"></i></div>
                    <div class="stat-info"><h4>${totalProfes}</h4><p>Profesores</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-layer-group"></i></div>
                    <div class="stat-info"><h4>${totalGrupos}</h4><p>Grupos activos</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon yellow"><i class="fas fa-dollar-sign"></i></div>
                    <div class="stat-info"><h4>$${(totalRecaudado/1000).toFixed(0)}K</h4><p>Recaudado mes</p></div>
                </div>
            </div>

            ${pendientes > 0 ? `
            <div class="card" style="margin-bottom:20px; border-left:5px solid var(--accent);">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <div>
                        <strong style="color:var(--primary);"><i class="fas fa-exclamation-triangle" style="color:var(--accent);"></i> ${pendientes} pago(s) pendiente(s)</strong>
                        <p style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">Revisa la cartera de estudiantes morosos</p>
                    </div>
                    <button class="btn-primary btn-sm" onclick="navigateTo('pagos')">Ver pagos</button>
                </div>
            </div>` : ''}

            <div class="grid grid-2">
                <div class="card">
                    <h3 class="card-title"><i class="fas fa-users"></i> Distribución por rango de edad</h3>
                    ${DB.rangosEdad.map(r => {
                        const count = DB.usuarios.filter(u => u.rol === 'student').length;
                        const pct = Math.round(Math.random() * 40 + 10);
                        return `
                            <div class="competency">
                                <div class="competency-header">
                                    <span>${r.nombre}</span>
                                    <span>${pct}%</span>
                                </div>
                                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="card">
                    <h3 class="card-title"><i class="fas fa-clock"></i> Últimas acciones (RF20)</h3>
                    ${DB.auditoria.slice(0, 5).map(a => {
                        const user = getUsuario(a.usuarioId);
                        return `
                            <div style="padding:10px 0; border-bottom:1px solid var(--border); font-size:0.85rem;">
                                <strong>${user?.nombre || 'Sistema'}</strong>
                                <p style="color:var(--text-muted); font-size:0.8rem;">${a.accion}</p>
                                <small style="color:var(--text-muted);">${a.fecha}</small>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    usuarios: () => {
        const filtros = ['admin', 'teacher', 'student', 'parent'];
        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-users"></i> Gestión de Usuarios</h2>
                    <p class="page-subtitle">RF01 - CRUD de Administradores, Profesores, Estudiantes y Acudientes</p>
                </div>
                <button class="btn-primary" onclick="AdminViews.modalCrearUsuario()"><i class="fas fa-plus"></i> Nuevo Usuario</button>
            </div>

            <div class="tabs">
                <button class="tab-btn active" onclick="filterUsers(this, 'all')">Todos (${DB.usuarios.length})</button>
                ${filtros.map(f => {
                    const count = DB.usuarios.filter(u => u.rol === f).length;
                    const labels = { admin: 'Admins', teacher: 'Profesores', student: 'Estudiantes', parent: 'Acudientes' };
                    return `<button class="tab-btn" onclick="filterUsers(this, '${f}')">${labels[f]} (${count})</button>`;
                }).join('')}
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                        ${DB.usuarios.map(u => `
                            <tr data-rol="${u.rol}">
                                <td style="font-size:1.6rem;">${u.avatar}</td>
                                <td><strong>${u.nombre}</strong></td>
                                <td>${u.email}</td>
                                <td><span class="badge badge-${u.rol === 'admin' ? 'danger' : u.rol === 'teacher' ? 'info' : u.rol === 'student' ? 'success' : 'warning'}">${u.rol}</span></td>
                                <td>${u.activo ? '<span class="badge badge-success">Activo</span>' : '<span class="badge badge-gray">Inactivo</span>'}</td>
                                <td>
                                    <button class="btn-icon" style="background:var(--info); width:32px; height:32px; font-size:0.8rem;" title="Editar" onclick="showToast('✏️ Editar usuario (demo)')"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon" style="background:var(--accent); width:32px; height:32px; font-size:0.8rem;" title="Desactivar" onclick="showToast('🚫 Usuario desactivado')"><i class="fas fa-ban"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    modalCrearUsuario: () => {
        openModal('Nuevo Usuario', `
            <div class="form-group">
                <label>Nombre completo</label>
                <input type="text" id="newUserName" placeholder="Ej: Juan Pérez">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="newUserEmail" placeholder="correo@ejemplo.com">
            </div>
            <div class="form-group">
                <label>Rol</label>
                <select id="newUserRole">
                    <option value="admin">Administrador</option>
                    <option value="teacher">Profesor</option>
                    <option value="student">Estudiante</option>
                    <option value="parent">Acudiente</option>
                </select>
            </div>
        `, `
            <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
            <button class="btn-primary" onclick="closeModal(); showToast('✅ Usuario creado (demo)', 'success')">Guardar</button>
        `);
    },

    catalogos: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-list"></i> Catálogos del Sistema</h2>
                <p class="page-subtitle">RF02 - Instrumentos, Niveles y Rangos de Edad</p>
            </div>
        </div>

        <div class="grid grid-3">
            <div class="card">
                <h3 class="card-title">🎻 Instrumentos (${DB.instrumentos.length})</h3>
                ${DB.instrumentos.map(i => `
                    <div style="padding:8px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between;">
                        <span>${i.icon} ${i.nombre}</span>
                        <button class="btn-icon" style="background:var(--accent); width:28px; height:28px; font-size:0.7rem;"><i class="fas fa-times"></i></button>
                    </div>
                `).join('')}
                <button class="btn-primary btn-sm" style="margin-top:12px;" onclick="showToast('➕ Agregar instrumento')"><i class="fas fa-plus"></i> Agregar</button>
            </div>

            <div class="card">
                <h3 class="card-title">📊 Niveles (${DB.niveles.length})</h3>
                ${DB.niveles.map(n => `
                    <div style="padding:8px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between;">
                        <span>${n.nombre}</span>
                        <button class="btn-icon" style="background:var(--accent); width:28px; height:28px; font-size:0.7rem;"><i class="fas fa-times"></i></button>
                    </div>
                `).join('')}
                <button class="btn-primary btn-sm" style="margin-top:12px;" onclick="showToast('➕ Agregar nivel')"><i class="fas fa-plus"></i> Agregar</button>
            </div>

            <div class="card">
                <h3 class="card-title">👶 Rangos de Edad (${DB.rangosEdad.length})</h3>
                ${DB.rangosEdad.map(r => `
                    <div style="padding:8px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between;">
                        <span>${r.nombre}</span>
                        <button class="btn-icon" style="background:var(--accent); width:28px; height:28px; font-size:0.7rem;"><i class="fas fa-times"></i></button>
                    </div>
                `).join('')}
                <button class="btn-primary btn-sm" style="margin-top:12px;" onclick="showToast('➕ Agregar rango')"><i class="fas fa-plus"></i> Agregar</button>
            </div>
        </div>
    `,

    grupos: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-layer-group"></i> Gestión de Grupos</h2>
                <p class="page-subtitle">RF03 - Combinación: Instrumento + Nivel + Rango de Edad</p>
            </div>
            <button class="btn-primary" onclick="showToast('➕ Crear grupo')"><i class="fas fa-plus"></i> Nuevo Grupo</button>
        </div>

        <div class="grid grid-3">
            ${DB.grupos.map(g => {
                const profe = getUsuario(g.profesorId);
                return `
                    <div class="card">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div>
                                <h3 class="card-title">${getNombreInstrumento(g.instrumentoId)} ${g.nombre}</h3>
                                <p style="color:var(--text-muted); font-size:0.85rem;">${g.horario}</p>
                            </div>
                            <span class="badge ${g.activo ? 'badge-success' : 'badge-gray'}">${g.activo ? 'Activo' : 'Inactivo'}</span>
                        </div>
                        <div style="margin:12px 0; display:flex; gap:6px; flex-wrap:wrap;">
                            <span class="badge badge-info">📊 ${getNombreNivel(g.nivelId)}</span>
                            <span class="badge badge-warning">👶 ${getNombreRangoEdad(g.rangoEdadId)}</span>
                        </div>
                        <div style="margin:12px 0; font-size:0.85rem;">
                            <strong>👨‍🏫 ${profe?.nombre || 'Sin asignar'}</strong>
                            <br><small style="color:var(--text-muted);">👥 ${g.estudiantes.length} estudiantes</small>
                        </div>
                        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:10px;">
                            ${g.submódulos.teoria ? '<span class="badge badge-info">📖 Teoría</span>' : ''}
                            ${g.submódulos.practica ? '<span class="badge badge-success">🎯 Práctica</span>' : ''}
                            ${g.submódulos.auditivo ? '<span class="badge badge-warning">👂 Auditivo</span>' : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `,

    matriculas: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-user-plus"></i> Matrículas en Línea</h2>
                <p class="page-subtitle">RF16 - Solicitudes de inscripción pendientes de aprobación</p>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Nombre</th>
                        <th>Contacto</th>
                        <th>Instrumento deseado</th>
                        <th>Edad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${DB.matriculas.map(m => `
                        <tr>
                            <td>${m.fecha}</td>
                            <td><strong>${m.nombre}</strong></td>
                            <td>${m.email}<br><small>${m.telefono}</small></td>
                            <td>${getNombreInstrumento(m.instrumentoId)}</td>
                            <td>${getNombreRangoEdad(m.rangoEdadId)}</td>
                            <td><span class="badge badge-warning">${m.estado}</span></td>
                            <td>
                                <button class="btn-primary btn-sm" onclick="showToast('✅ Matrícula aprobada', 'success')">Aprobar</button>
                                <button class="btn-danger btn-sm" onclick="showToast('❌ Matrícula rechazada')">Rechazar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `,

    recitales: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-theater-masks"></i> Recitales y Eventos</h2>
                <p class="page-subtitle">RF18 - Planificación de eventos académicos</p>
            </div>
            <button class="btn-primary" onclick="showToast('➕ Nuevo recital')"><i class="fas fa-plus"></i> Nuevo Recital</button>
        </div>

        <div class="grid grid-2">
            ${DB.recitales.map(r => `
                <div class="card">
                    <h3 class="card-title">🎭 ${r.titulo}</h3>
                    <p style="color:var(--text-muted); margin-bottom:10px;">
                        <i class="fas fa-calendar"></i> ${r.fecha}<br>
                        <i class="fas fa-map-marker-alt"></i> ${r.lugar}
                    </p>
                    <div class="progress-bar" style="margin:10px 0;">
                        <div class="progress-fill" style="width:${(r.participantes.length/10)*100}%"></div>
                    </div>
                    <small style="color:var(--text-muted);">${r.participantes.length} estudiantes inscritos</small>
                </div>
            `).join('')}
        </div>
    `,

    materiales: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-folder-open"></i> Repositorio de Materiales</h2>
                <p class="page-subtitle">RF05 - Recursos multimedia por grupo</p>
            </div>
        </div>
        <div class="grid grid-2">
            ${DB.materiales.map(m => `
                <div class="card" style="display:flex; gap:12px; align-items:center;">
                    <div class="stat-icon ${m.tipo === 'PDF' ? 'red' : 'blue'}"><i class="fas fa-${m.tipo === 'PDF' ? 'file-pdf' : 'video'}"></i></div>
                    <div style="flex:1;">
                        <strong>${m.titulo}</strong>
                        <p style="color:var(--text-muted); font-size:0.8rem;">Semana ${m.semana} · ${m.fechaSubida}</p>
                    </div>
                    <button class="btn-secondary btn-sm">Abrir</button>
                </div>
            `).join('')}
        </div>
    `,

    pagos: () => {
        const total = DB.pagos.reduce((a, p) => a + p.monto, 0);
        const pagado = DB.pagos.filter(p => p.estado === 'pagado').reduce((a, p) => a + p.monto, 0);
        const pendiente = total - pagado;

        return `
            <div class="page-header">
                <div>
                    <h2><i class="fas fa-credit-card"></i> Gestión de Pagos y Cartera</h2>
                    <p class="page-subtitle">RF13 - Cobros de mensualidades</p>
                </div>
            </div>

            <div class="grid grid-3" style="margin-bottom:20px;">
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info"><h4>$${(pagado/1000).toFixed(0)}K</h4><p>Recaudado</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-clock"></i></div>
                    <div class="stat-info"><h4>$${(pendiente/1000).toFixed(0)}K</h4><p>Pendiente</p></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info"><h4>$${(total/1000).toFixed(0)}K</h4><p>Total mes</p></div>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>Estudiante</th><th>Mes</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        ${DB.pagos.map(p => {
                            const est = getUsuario(p.estudianteId);
                            return `
                                <tr>
                                    <td><strong>${est?.nombre}</strong></td>
                                    <td>${p.mes}</td>
                                    <td>$${p.monto.toLocaleString('es-CO')}</td>
                                    <td><span class="badge ${p.estado === 'pagado' ? 'badge-success' : 'badge-danger'}">${p.estado}</span></td>
                                    <td>
                                        ${p.estado === 'pendiente' 
                                            ? `<button class="btn-primary btn-sm" onclick="showToast('✅ Pago registrado', 'success')">Registrar pago</button>`
                                            : `<span style="color:var(--text-muted); font-size:0.8rem;">${p.fechaPago || ''}</span>`}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    descuentos: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-percent"></i> Descuentos y Becas</h2>
                <p class="page-subtitle">RF21 - Aplicación de becas y convenios</p>
            </div>
            <button class="btn-primary" onclick="showToast('➕ Nuevo descuento')"><i class="fas fa-plus"></i> Nuevo</button>
        </div>
        <div class="empty-state">
            <i class="fas fa-percent"></i>
            <p>No hay descuentos configurados</p>
        </div>
    `,

    reportes: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-file-alt"></i> Reportes Administrativos</h2>
                <p class="page-subtitle">RF15 - Métricas del negocio</p>
            </div>
        </div>
        <div class="grid grid-2">
            <div class="card">
                <h3 class="card-title">📈 Retención de alumnos</h3>
                <div class="progress-bar"><div class="progress-fill" style="width:85%"></div></div>
                <p style="margin-top:8px; font-weight:700;">85% de retención mensual</p>
            </div>
            <div class="card">
                <h3 class="card-title">📅 Asistencia promedio</h3>
                <div class="progress-bar"><div class="progress-fill" style="width:78%"></div></div>
                <p style="margin-top:8px; font-weight:700;">78% de asistencia</p>
            </div>
            <div class="card">
                <h3 class="card-title">📚 Uso de recursos</h3>
                <div class="progress-bar"><div class="progress-fill" style="width:62%"></div></div>
                <p style="margin-top:8px; font-weight:700;">62% de materiales vistos</p>
            </div>
            <div class="card">
                <h3 class="card-title">💰 Ingresos del mes</h3>
                <p style="font-size:2rem; color:var(--success); font-weight:800;">$1.500.000</p>
            </div>
        </div>
    `,

    auditoria: () => `
        <div class="page-header">
            <div>
                <h2><i class="fas fa-history"></i> Bitácora de Auditoría</h2>
                <p class="page-subtitle">RF20 - Registro trazable de acciones críticas</p>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr><th>Fecha</th><th>Usuario</th><th>Acción</th></tr>
                </thead>
                <tbody>
                    ${DB.auditoria.map(a => {
                        const u = getUsuario(a.usuarioId);
                        return `
                            <tr>
                                <td>${a.fecha}</td>
                                <td><strong>${u?.nombre || 'Sistema'}</strong></td>
                                <td>${a.accion}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `
};

function filterUsers(btn, rol) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#usersTableBody tr').forEach(tr => {
        tr.style.display = (rol === 'all' || tr.dataset.rol === rol) ? '' : 'none';
    });
}