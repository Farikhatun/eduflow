// Authentication Functions
let currentUser = null;
let currentLoginRole = 'guru';

function switchRole(role) {
    currentLoginRole = role;
    const btnGuru = document.getElementById('btn-role-guru');
    const btnSiswa = document.getElementById('btn-role-siswa');
    const formGuru = document.getElementById('form-guru');
    const formSiswa = document.getElementById('form-siswa');

    if (role === 'guru') {
        btnGuru.className = 'flex-1 py-2.5 rounded-lg text-sm font-semibold transition border-2 border-indigo-600 bg-indigo-600 text-white';
        btnSiswa.className = 'flex-1 py-2.5 rounded-lg text-sm font-semibold transition border-2 border-slate-200 text-slate-600 hover:border-slate-300';
        formGuru.classList.remove('hidden');
        formSiswa.classList.add('hidden');
    } else {
        btnGuru.className = 'flex-1 py-2.5 rounded-lg text-sm font-semibold transition border-2 border-slate-200 text-slate-600 hover:border-slate-300';
        btnSiswa.className = 'flex-1 py-2.5 rounded-lg text-sm font-semibold transition border-2 border-emerald-600 bg-emerald-600 text-white';
        formGuru.classList.add('hidden');
        formSiswa.classList.remove('hidden');
    }
}

function loginGuru(e) {
    e.preventDefault();
    const nama = document.getElementById('guru-nama').value.trim();
    const nip = document.getElementById('guru-nip').value.trim();
    
    if (!nama || !nip) {
        showToast('Mohon isi semua field');
        return;
    }

    currentUser = { 
        role: 'guru', 
        name: nama,
        nip: nip
    };
    
    document.getElementById('guru-display-name').textContent = nama;
    showPage('guru');
    showGuruTab('siswa');
    renderAll();
}

function loginSiswa(e) {
    e.preventDefault();
    const nama = document.getElementById('siswa-nama').value.trim();
    const nis = document.getElementById('siswa-nis').value.trim();
    const err = document.getElementById('siswa-error');
    
    if (!nama || !nis) {
        showToast('Mohon isi semua field');
        return;
    }

    const students = dataManager.getByType('student');
    console.log('Mencari siswa:', nama, nis);
    console.log('Data siswa:', students);
    
    const found = students.find(s => 
        s.name.toLowerCase() === nama.toLowerCase() && 
        s.identifier === nis
    );

    if (!found) {
        err.textContent = 'Nama atau NIS tidak ditemukan. Hubungi guru Anda.';
        err.classList.remove('hidden');
        return;
    }

    err.classList.add('hidden');
    currentUser = {
        role: 'siswa',
        name: nama,
        id: found.__backendId,
        studentData: found
    };

    document.getElementById('siswa-display-name').textContent = nama;
    showPage('siswa');
    
    // 🔥 PASTIKAN FUNGSI INI DIPANGGIL
    setTimeout(function() {
        showSiswaTab('s-materi');
        renderSiswaMateri();
        renderSiswaQuizSets();
    }, 100);
}

function logout() {
    currentUser = null;
    showPage('login');
    document.getElementById('form-guru').reset();
    document.getElementById('form-siswa').reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-guru').addEventListener('submit', loginGuru);
    document.getElementById('form-siswa').addEventListener('submit', loginSiswa);
});

// Export
window.switchRole = switchRole;
window.logout = logout;
window.currentUser = currentUser;