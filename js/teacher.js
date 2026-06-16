// Teacher Functions
let deleteTarget = null;

function showGuruTab(tab) {
    document.querySelectorAll('.guru-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.guru-tab').forEach(el => el.classList.remove('bg-indigo-50', 'text-indigo-700'));
    document.getElementById('content-' + tab).classList.remove('hidden');
    const tabBtn = document.getElementById('tab-' + tab);
    if (tabBtn) tabBtn.classList.add('bg-indigo-50', 'text-indigo-700');
}

// Student CRUD
async function editSiswa(id) {
    const s = dataManager.getById(id);
    if (!s) {
        showToast('Data siswa tidak ditemukan');
        return;
    }
    document.getElementById('edit-siswa-id').value = id;
    document.getElementById('input-siswa-nama').value = s.name;
    document.getElementById('input-siswa-nis').value = s.identifier;
    showModal('modal-siswa');
}

async function saveSiswa(e) {
    e.preventDefault();
    const nama = document.getElementById('input-siswa-nama').value.trim();
    const nis = document.getElementById('input-siswa-nis').value.trim();
    const editId = document.getElementById('edit-siswa-id').value;
    
    if (!nama || !nis) {
        showToast('Mohon isi semua field');
        return;
    }

    if (editId) {
        const record = dataManager.getById(editId);
        if (record) {
            await dataManager.update(editId, {
                ...record,
                name: nama,
                identifier: nis
            });
        }
    } else {
        await dataManager.create({
            type: 'student',
            name: nama,
            identifier: nis,
            created_at: new Date().toISOString()
        });
    }

    hideModal('modal-siswa');
    document.getElementById('form-add-siswa').reset();
    document.getElementById('edit-siswa-id').value = '';
    showToast('Siswa berhasil disimpan');
}

// Upload CSV
async function uploadCSV(e) {
    e.preventDefault();
    const file = document.getElementById('input-csv').files[0];
    if (!file) {
        showToast('Pilih file CSV terlebih dahulu');
        return;
    }

    try {
        const text = await file.text();
        const lines = csvToArray(text);
        
        if (lines.length < 2) {
            showToast('File CSV tidak valid atau kosong');
            return;
        }

        let added = 0;
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i];
            if (row.length >= 2) {
                const nama = row[0];
                const nis = row[1];
                if (nama && nis) {
                    await dataManager.create({
                        type: 'student',
                        name: nama,
                        identifier: nis,
                        created_at: new Date().toISOString()
                    });
                    added++;
                }
            }
        }

        hideModal('modal-upload');
        document.getElementById('form-upload').reset();
        document.getElementById('input-csv').value = '';
        showToast(`${added} siswa berhasil ditambahkan`);
    } catch (err) {
        showToast('Error membaca file: ' + err.message);
    }
}

// Material CRUD
function toggleMateriFields() {
    const type = document.getElementById('input-materi-type').value;
    document.getElementById('materi-teks-field').classList.toggle('hidden', type !== 'teks');
    document.getElementById('materi-video-field').classList.toggle('hidden', type !== 'video');
    document.getElementById('materi-doc-field').classList.toggle('hidden', type !== 'dokumen');
}

async function editMateri(id) {
    const m = dataManager.getById(id);
    if (!m) {
        showToast('Data materi tidak ditemukan');
        return;
    }
    document.getElementById('edit-materi-id').value = id;
    document.getElementById('input-materi-title').value = m.title;
    document.getElementById('input-materi-type').value = m.content_type;
    document.getElementById('input-materi-content').value = m.content || '';
    document.getElementById('input-materi-video-url').value = m.video_url || '';
    document.getElementById('input-materi-doc-url').value = m.video_url || '';
    toggleMateriFields();
    showModal('modal-materi');
}

async function saveMateri(e) {
    e.preventDefault();
    const title = document.getElementById('input-materi-title').value.trim();
    const ctype = document.getElementById('input-materi-type').value;
    const content = document.getElementById('input-materi-content').value.trim();
    const videoUrl = document.getElementById('input-materi-video-url').value.trim();
    const docUrl = document.getElementById('input-materi-doc-url').value.trim();
    const editId = document.getElementById('edit-materi-id').value;

    if (!title) {
        showToast('Mohon isi judul materi');
        return;
    }

    // 🔥 PERUBAHAN: Hanya pakai URL, tidak upload file
    let finalUrl = '';
    
    if (ctype === 'video') {
        finalUrl = videoUrl;
        if (!finalUrl) {
            showToast('Masukkan URL video (YouTube, dll)');
            return;
        }
    } else if (ctype === 'dokumen') {
        finalUrl = docUrl;
        if (!finalUrl) {
            showToast('Masukkan URL dokumen (Google Drive, dll)');
            return;
        }
    }

    let dataToSave = {
        title,
        content_type: ctype,
        content: ctype === 'teks' ? content : '',
        video_url: finalUrl
    };

    if (editId) {
        const record = dataManager.getById(editId);
        if (record) {
            await dataManager.update(editId, {
                ...record,
                ...dataToSave
            });
        }
    } else {
        await dataManager.create({
            type: 'material',
            ...dataToSave,
            created_at: new Date().toISOString()
        });
    }

    hideModal('modal-materi');
    document.getElementById('form-add-materi').reset();
    document.getElementById('edit-materi-id').value = '';
    // Reset input file
    document.getElementById('input-materi-video-url').value = '';
    document.getElementById('input-materi-doc-url').value = '';
    showToast('Materi berhasil disimpan');
}

// Quiz CRUD
async function saveQuizSet(e) {
    e.preventDefault();
    const title = document.getElementById('input-quiz-set-title').value.trim();
    
    if (!title) {
        showToast('Mohon isi judul quiz');
        return;
    }

    await dataManager.create({
        type: 'quiz_set',
        title,
        created_at: new Date().toISOString()
    });

    hideModal('modal-quiz-set');
    document.getElementById('form-add-quiz-set').reset();
    showToast('Set quiz berhasil dibuat');
}

async function editQuizSet(id) {
    const set = dataManager.getById(id);
    if (!set) {
        showToast('Data quiz tidak ditemukan');
        return;
    }
    document.getElementById('input-quiz-set-title').value = set.title;
    showModal('modal-quiz-set');
}

function openQuizEditor(setId) {
    currentQuizSetId = setId;
    const set = dataManager.getById(setId);
    if (!set) {
        showToast('Data quiz tidak ditemukan');
        return;
    }
    document.getElementById('quiz-set-name').textContent = `Set: ${set.title}`;
    document.getElementById('edit-quiz-q-id').value = '';
    document.getElementById('quiz-q-set-id').value = setId;
    document.getElementById('form-add-quiz-q').reset();
    showModal('modal-quiz-question');
}

async function editQuizQuestion(id, setId) {
    const q = dataManager.getById(id);
    if (!q) {
        showToast('Data soal tidak ditemukan');
        return;
    }
    currentQuizSetId = setId;
    const set = dataManager.getById(setId);
    document.getElementById('quiz-set-name').textContent = `Set: ${set.title}`;
    document.getElementById('edit-quiz-q-id').value = id;
    document.getElementById('quiz-q-set-id').value = setId;
    document.getElementById('input-quiz-q').value = q.question;
    document.getElementById('input-quiz-qa').value = q.option_a || '';
    document.getElementById('input-quiz-qb').value = q.option_b || '';
    document.getElementById('input-quiz-qc').value = q.option_c || '';
    document.getElementById('input-quiz-qd').value = q.option_d || '';
    document.getElementById('input-quiz-answer').value = q.correct_answer || 'A';
    showModal('modal-quiz-question');
}

async function saveQuizQuestion(e) {
    e.preventDefault();
    const setId = document.getElementById('quiz-q-set-id').value;
    const question = document.getElementById('input-quiz-q').value.trim();
    const a = document.getElementById('input-quiz-qa').value.trim();
    const b = document.getElementById('input-quiz-qb').value.trim();
    const c = document.getElementById('input-quiz-qc').value.trim();
    const d = document.getElementById('input-quiz-qd').value.trim();
    const answer = document.getElementById('input-quiz-answer').value;
    const editId = document.getElementById('edit-quiz-q-id').value;

    if (!question || !a || !b || !c || !d) {
        showToast('Mohon isi semua field (pertanyaan dan 4 opsi)');
        return;
    }

    // 🔥 SIMPAN SEBAGAIMANA ADANYA (tidak di-escape)
    // Karena nanti akan di-escape saat ditampilkan
    const dataToSave = {
        question: question,
        option_a: a,
        option_b: b,
        option_c: c,
        option_d: d,
        correct_answer: answer
    };

    if (editId) {
        const record = dataManager.getById(editId);
        if (record) {
            await dataManager.update(editId, {
                ...record,
                ...dataToSave
            });
        }
    } else {
        await dataManager.create({
            type: 'quiz_question',
            quiz_id: setId,
            ...dataToSave,
            created_at: new Date().toISOString()
        });
    }

    hideModal('modal-quiz-question');
    document.getElementById('form-add-quiz-q').reset();
    document.getElementById('edit-quiz-q-id').value = '';
    showToast('Soal berhasil disimpan');
}

// Delete
function confirmDelete(id) {
    deleteTarget = id;
    showModal('modal-delete');
}

async function handleDelete() {
    if (!deleteTarget) return;
    const record = dataManager.getById(deleteTarget);
    if (!record) {
        showToast('Data tidak ditemukan');
        return;
    }

    // If deleting a quiz set, also delete its questions
    if (record.type === 'quiz_set') {
        const questions = dataManager.getData().filter(q => 
            q.type === 'quiz_question' && q.quiz_id === deleteTarget
        );
        for (const q of questions) {
            await dataManager.delete(q.__backendId);
        }
    }

    const result = await dataManager.delete(deleteTarget);
    if (result.isOk) {
        showToast('Data berhasil dihapus');
    } else {
        showToast('Gagal menghapus data');
    }
    
    hideModal('modal-delete');
    deleteTarget = null;
}

// Export Nilai
function exportNilai() {
    const scores = dataManager.getByType('score');
    const students = dataManager.getByType('student');
    const quizSets = dataManager.getByType('quiz_set');
    
    if (scores.length === 0) {
        showToast('Tidak ada data nilai untuk diexport');
        return;
    }
    
    let csv = 'Nama Siswa,Quiz,Skor (%),Tanggal\n';
    scores.forEach(score => {
        const student = students.find(s => s.__backendId === score.student_id);
        const quiz = quizSets.find(q => q.__backendId === score.quiz_id);
        const date = formatDate(score.created_at);
        const studentName = (student?.name || '-').replace(/"/g, '""');
        const quizName = (quiz?.title || '-').replace(/"/g, '""');
        csv += `"${studentName}","${quizName}",${score.score},"${date}"\n`;
    });
    
    downloadFile(csv, `nilai_siswa_${new Date().toISOString().slice(0,10)}.csv`);
    showToast('File berhasil diunduh');
}

// Upload file to Firebase Storage
async function uploadFile(file, path) {
    try {
        // Cek apakah file ada
        if (!file) {
            console.log('Tidak ada file yang diupload');
            return '';
        }

        console.log('Mulai upload file:', file.name);
        
        // Buat nama file unik
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `${path}/${fileName}`;
        
        // Upload ke Firebase Storage
        const storageRef = storage.ref(filePath);
        const snapshot = await storageRef.put(file);
        console.log('Upload berhasil, mendapatkan URL...');
        
        // Dapatkan URL download
        const url = await snapshot.ref.getDownloadURL();
        console.log('URL file:', url);
        
        return url;
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Gagal upload file: ' + error.message);
        return '';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-add-siswa').addEventListener('submit', saveSiswa);
    document.getElementById('form-upload').addEventListener('submit', uploadCSV);
    document.getElementById('form-add-materi').addEventListener('submit', saveMateri);
    document.getElementById('form-add-quiz-set').addEventListener('submit', saveQuizSet);
    document.getElementById('form-add-quiz-q').addEventListener('submit', saveQuizQuestion);
    document.getElementById('input-materi-type').addEventListener('change', toggleMateriFields);
    document.getElementById('btn-confirm-delete').addEventListener('click', handleDelete);
});

// Export
window.showGuruTab = showGuruTab;
window.editSiswa = editSiswa;
window.editMateri = editMateri;
window.openQuizEditor = openQuizEditor;
window.editQuizSet = editQuizSet;
window.editQuizQuestion = editQuizQuestion;
window.confirmDelete = confirmDelete;
window.exportNilai = exportNilai;
window.toggleMateriFields = toggleMateriFields;