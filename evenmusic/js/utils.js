// ============================================================
// UTILIDADES GENERALES
// ============================================================

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Confetti (para gamificación)
function createConfetti(element) {
    const emojis = ['🎵', '⭐', '🎶', '✨', '🎉', '🌈', '🏆'];
    const rect = element?.getBoundingClientRect() || { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 250;
        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 150;
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.fontSize = (1.5 + Math.random() * 2) + 'rem';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1500);
    }
}

// Modal
function openModal(title, bodyHtml, footerHtml = '') {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalFooter').innerHTML = footerHtml;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal(event) {
    if (event && event.target.id !== 'modalOverlay') return;
    document.getElementById('modalOverlay').classList.remove('active');
}

// Generador de ID de reunión (Zoom/Meet)
function generateMeetingId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 9; i++) {
        if (i > 0 && i % 3 === 0) id += '-';
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// Copy al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Copiado al portapapeles', 'success');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('📋 Copiado al portapapeles', 'success');
    });
}

// Genera enlace de reunión según plataforma
function getMeetingUrl(meetingId, platform = 'meet') {
    const clean = meetingId.replace(/-/g, '');
    const urls = {
        zoom: `https://zoom.us/j/${clean}`,
        meet: `https://meet.google.com/${meetingId.toLowerCase()}`,
        teams: `https://teams.microsoft.com/l/meetup-join/${meetingId}`
    };
    return urls[platform] || urls.meet;
}

// Helper: obtener nombre por ID
function getNombreInstrumento(id) {
    return DB.instrumentos.find(i => i.id === id)?.nombre || 'N/A';
}
function getNombreNivel(id) {
    return DB.niveles.find(n => n.id === id)?.nombre || 'N/A';
}
function getNombreRangoEdad(id) {
    return DB.rangosEdad.find(r => r.id === id)?.nombre || 'N/A';
}
function getUsuario(id) {
    return DB.usuarios.find(u => u.id === id);
}
function getGrupo(id) {
    return DB.grupos.find(g => g.id === id);
}

// Renderiza estrellas de calificación
function renderStars(value, studentId, readonly = false) {
    let html = '<div class="stars" data-student="' + studentId + '">';
    for (let i = 1; i <= 5; i++) {
        html += `<i class="${i <= value ? 'fas' : 'far'} fa-star" data-value="${i}" ${readonly ? '' : 'onclick="setStars(this)"'}></i>`;
    }
    html += '</div>';
    return html;
}

// Establece estrellas
function setStars(el) {
    const container = el.parentElement;
    const value = parseInt(el.dataset.value);
    const studentId = container.dataset.student;
    container.querySelectorAll('i').forEach((star, idx) => {
        star.className = idx < value ? 'fas fa-star' : 'far fa-star';
    });
    createConfetti(el);
    showToast(`⭐ ${value} estrellas asignadas`, 'success');
}