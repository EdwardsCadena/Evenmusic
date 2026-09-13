// ============================================================
// DATOS MOCK - Simulan la base de datos
// ============================================================

const DB = {
    // RF02 - Catálogos
    instrumentos: [
        { id: 1, nombre: 'Violín', icon: '🎻' },
        { id: 2, nombre: 'Guitarra', icon: '🎸' },
        { id: 3, nombre: 'Piano', icon: '🎹' },
        { id: 4, nombre: 'Batería', icon: '🥁' },
        { id: 5, nombre: 'Canto', icon: '🎤' },
        { id: 6, nombre: 'Saxofón', icon: '🎷' },
        { id: 7, nombre: 'Flauta', icon: '🪈' },
        { id: 8, nombre: 'Bajo', icon: '🎸' }
    ],
    niveles: [
        { id: 1, nombre: 'Básico' },
        { id: 2, nombre: 'Medio' },
        { id: 3, nombre: 'Avanzado' }
    ],
    rangosEdad: [
        { id: 1, nombre: '5-7 años' },
        { id: 2, nombre: '8-10 años' },
        { id: 3, nombre: '11-12 años' },
        { id: 4, nombre: '13-16 años' },
        { id: 5, nombre: 'Adultos' }
    ],

    // RF01 - Usuarios
    usuarios: [
        { id: 'u1', nombre: 'Admin Principal', email: 'admin@evenmusic.com', rol: 'admin', avatar: '🛡️', activo: true },
        { id: 'u2', nombre: 'Laura Gómez', email: 'profe@evenmusic.com', rol: 'teacher', avatar: '👩‍🏫', activo: true, especialidad: 'Violín' },
        { id: 'u3', nombre: 'Carlos Ruiz', email: 'carlos@evenmusic.com', rol: 'teacher', avatar: '👨‍🏫', activo: true, especialidad: 'Guitarra' },
        { id: 'u4', nombre: 'Ana Martínez', email: 'ana@evenmusic.com', rol: 'teacher', avatar: '👩‍🏫', activo: true, especialidad: 'Piano' },
        { id: 'u5', nombre: 'Martina Pérez', email: 'alumno@evenmusic.com', rol: 'student', avatar: '👧', activo: true, fechaNacimiento: '2018-05-10', acudienteId: 'u10' },
        { id: 'u6', nombre: 'Lucas Ramírez', email: 'lucas@evenmusic.com', rol: 'student', avatar: '👦', activo: true, fechaNacimiento: '2016-08-22', acudienteId: 'u11' },
        { id: 'u7', nombre: 'Sofía López', email: 'sofia@evenmusic.com', rol: 'student', avatar: '👧', activo: true, fechaNacimiento: '2014-03-15', acudienteId: 'u12' },
        { id: 'u8', nombre: 'Mateo Torres', email: 'mateo@evenmusic.com', rol: 'student', avatar: '👦', activo: true, fechaNacimiento: '2019-11-08', acudienteId: 'u13' },
        { id: 'u9', nombre: 'Valentina Cruz', email: 'valentina@evenmusic.com', rol: 'student', avatar: '👧', activo: true, fechaNacimiento: '2012-07-20', acudienteId: 'u14' },
        { id: 'u10', nombre: 'Sra. Gómez', email: 'padre@evenmusic.com', rol: 'parent', avatar: '👨‍👩‍👧', activo: true, hijos: ['u5'] },
        { id: 'u11', nombre: 'Sr. Ramírez', email: 'ramirez@evenmusic.com', rol: 'parent', avatar: '👨‍👩‍👦', activo: true, hijos: ['u6'] },
        { id: 'u12', nombre: 'Sra. López', email: 'lopez@evenmusic.com', rol: 'parent', avatar: '👩‍👧', activo: true, hijos: ['u7'] },
        { id: 'u13', nombre: 'Sr. Torres', email: 'torres@evenmusic.com', rol: 'parent', avatar: '👨‍👦', activo: true, hijos: ['u8'] },
        { id: 'u14', nombre: 'Sra. Cruz', email: 'cruz@evenmusic.com', rol: 'parent', avatar: '👩‍👧', activo: true, hijos: ['u9'] }
    ],

    // RF03 - Grupos (Instrumento + Nivel + Rango Edad)
    grupos: [
        {
            id: 'g1',
            nombre: 'Violín Básico Niños',
            instrumentoId: 1,
            nivelId: 1,
            rangoEdadId: 1,
            profesorId: 'u2',
            horario: 'Lunes y Miércoles 16:00-17:00',
            estudiantes: ['u5'],
            submódulos: { teoria: true, practica: true, auditivo: true },
            activo: true
        },
        {
            id: 'g2',
            nombre: 'Guitarra Intermedio',
            instrumentoId: 2,
            nivelId: 2,
            rangoEdadId: 3,
            profesorId: 'u3',
            horario: 'Martes y Jueves 17:00-18:00',
            estudiantes: ['u6'],
            submódulos: { teoria: true, practica: true, auditivo: false },
            activo: true
        },
        {
            id: 'g3',
            nombre: 'Piano Básico Juvenil',
            instrumentoId: 3,
            nivelId: 1,
            rangoEdadId: 4,
            profesorId: 'u4',
            horario: 'Viernes 15:00-16:30',
            estudiantes: ['u7'],
            submódulos: { teoria: true, practica: true, auditivo: true },
            activo: true
        },
        {
            id: 'g4',
            nombre: 'Violín Avanzado',
            instrumentoId: 1,
            nivelId: 3,
            rangoEdadId: 4,
            profesorId: 'u2',
            horario: 'Sábados 10:00-12:00',
            estudiantes: ['u9'],
            submódulos: { teoria: false, practica: true, auditivo: true },
            activo: true
        }
    ],

    // RF04 - Asistencia
    asistencia: [
        { id: 1, grupoId: 'g1', estudianteId: 'u5', fecha: hoy(), estado: 'presente', observacion: '' },
        { id: 2, grupoId: 'g2', estudianteId: 'u6', fecha: hoy(), estado: 'ausente', observacion: 'No asistió' },
        { id: 3, grupoId: 'g3', estudianteId: 'u7', fecha: hoy(), estado: 'tarde', observacion: 'Llegó 15 min tarde' }
    ],

    // RF05 - Material educativo
    materiales: [
        { id: 1, grupoId: 'g1', titulo: 'Escalas Básicas', tipo: 'PDF', url: '#', semana: 1, fechaSubida: '2026-08-01' },
        { id: 2, grupoId: 'g1', titulo: 'Video: Postura del violín', tipo: 'Video', url: '#', semana: 1, fechaSubida: '2026-08-01' },
        { id: 3, grupoId: 'g2', titulo: 'Acordes Mayores', tipo: 'PDF', url: '#', semana: 2, fechaSubida: '2026-08-08' }
    ],

    // RF08 - Tareas
    tareas: [
        { id: 1, grupoId: 'g1', titulo: 'Practicar escala de Do', descripcion: 'Repetir 10 veces', fechaEntrega: '2026-09-15', estado: 'pendiente' },
        { id: 2, grupoId: 'g2', titulo: 'Grabar canción', descripcion: 'Enviar video tocando', fechaEntrega: '2026-09-20', estado: 'entregada' }
    ],

    // RF09 - Progreso por competencias
    progreso: [
        { estudianteId: 'u5', grupoId: 'g1', teoria: 80, practica: 70, auditivo: 85 },
        { estudianteId: 'u6', grupoId: 'g2', teoria: 60, practica: 55, auditivo: 0 },
        { estudianteId: 'u7', grupoId: 'g3', teoria: 90, practica: 85, auditivo: 80 }
    ],

    // RF10 - Insignias
    insignias: [
        { id: 'i1', nombre: 'Primera Clase', icon: '🎵', descripcion: 'Completaste tu primera clase' },
        { id: 'i2', nombre: 'Primera Canción', icon: '🎼', descripcion: 'Tocaste tu primera canción completa' },
        { id: 'i3', nombre: 'Lectura Musical', icon: '📖', descripcion: 'Aprendiste a leer partituras' },
        { id: 'i4', nombre: 'Nivel Completado', icon: '🏆', descripcion: 'Completaste un nivel entero' },
        { id: 'i5', nombre: 'Racha de Práctica', icon: '🔥', descripcion: 'Practicaste 7 días seguidos' }
    ],
    insigniasObtenidas: [
        { estudianteId: 'u5', insigniaId: 'i1', fecha: '2026-07-15' },
        { estudianteId: 'u5', insigniaId: 'i2', fecha: '2026-08-20' },
        { estudianteId: 'u7', insigniaId: 'i1', fecha: '2026-06-10' },
        { estudianteId: 'u7', insigniaId: 'i3', fecha: '2026-08-15' }
    ],

    // RF18 - Recitales
    recitales: [
        { id: 1, titulo: 'Recital de Primavera', fecha: '2026-10-15', lugar: 'Auditorio Principal', participantes: ['u5', 'u7', 'u9'] },
        { id: 2, titulo: 'Concierto de Fin de Año', fecha: '2026-12-10', lugar: 'Teatro Municipal', participantes: [] }
    ],

    // RF19 - Mensajería
    mensajes: [
        { id: 1, de: 'u10', para: 'u2', asunto: 'Consulta sobre práctica', cuerpo: '¿Cómo le fue a Martina hoy?', fecha: '2026-09-08 10:30', leido: true },
        { id: 2, de: 'u2', para: 'u10', asunto: 'Re: Consulta sobre práctica', cuerpo: 'Muy bien, progresó en la escala.', fecha: '2026-09-08 11:15', leido: true }
    ],

    // RF13 - Pagos
    pagos: [
        { id: 1, estudianteId: 'u5', mes: 'Septiembre 2026', monto: 250000, estado: 'pagado', fechaPago: '2026-09-01' },
        { id: 2, estudianteId: 'u6', mes: 'Septiembre 2026', monto: 250000, estado: 'pendiente', fechaPago: null },
        { id: 3, estudianteId: 'u7', mes: 'Septiembre 2026', monto: 250000, estado: 'pagado', fechaPago: '2026-09-02' }
    ],

    // RF16 - Matrículas
    matriculas: [
        { id: 1, nombre: 'Diego Sánchez', email: 'diego@email.com', telefono: '3001234567', instrumentoId: 1, rangoEdadId: 2, estado: 'pendiente', fecha: '2026-09-05' }
    ],

    // RF20 - Auditoría
    auditoria: [
        { id: 1, usuarioId: 'u1', accion: 'Creó grupo Violín Básico Niños', fecha: '2026-09-01 09:00' },
        { id: 2, usuarioId: 'u1', accion: 'Cambió estado de pago u5 a Pagado', fecha: '2026-09-01 10:30' }
    ]
};

// Helper: fecha actual
function hoy() {
    return new Date().toISOString().split('T')[0];
}

// Estado de la sesión actual
const Session = {
    user: null,
    role: null
};