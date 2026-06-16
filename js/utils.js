// Utility Functions
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    t.classList.remove('hidden');
    t.classList.add('toast-show');
    setTimeout(() => {
        t.classList.add('hidden');
        t.classList.remove('toast-show');
    }, 3000);
}

function showModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function showPage(page) {
    document.getElementById('page-login').classList.add('hidden');
    document.getElementById('page-guru').classList.add('hidden');
    document.getElementById('page-siswa').classList.add('hidden');
    document.getElementById('page-' + page).classList.remove('hidden');
    window.currentPage = page;
}

function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function csvToArray(csv) {
    const lines = csv.trim().split('\n');
    return lines.map(line => {
        const parts = line.split(',').map(s => s.trim());
        return parts;
    });
}

function downloadFile(content, filename, type = 'text/csv') {
    const blob = new Blob([content], { type: type + ';charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}