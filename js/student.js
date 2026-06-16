// Student Functions
let quizAnswers = {};
let currentQuizSetId = null;

function showSiswaTab(tab) {
    console.log('showSiswaTab:', tab);
    document.querySelectorAll('.siswa-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.siswa-tab').forEach(el => el.classList.remove('bg-emerald-50', 'text-emerald-700'));
    document.getElementById('content-' + tab).classList.remove('hidden');
    const tabBtn = document.getElementById('tab-' + tab);
    if (tabBtn) tabBtn.classList.add('bg-emerald-50', 'text-emerald-700');
}

function startQuizAttempt(setId) {
    console.log('startQuizAttempt:', setId);
    
    const set = dataManager.getById(setId);
    if (!set) {
        showToast('Quiz tidak ditemukan');
        return;
    }

    // Cek sudah dikerjakan
    const completed = dataManager.getData().find(s => 
        s.type === 'score' && s.quiz_id === setId && s.student_id === currentUser.id
    );

    if (completed) {
        showToast('Quiz sudah selesai');
        return;
    }

    // 🔥 AMBIL SEMUA SOAL
    const questions = dataManager.getData().filter(q => 
        q.type === 'quiz_question' && q.quiz_id === setId
    );

    console.log('Jumlah soal:', questions.length);
    console.log('Soal:', questions);

    if (questions.length === 0) {
        showToast('Belum ada soal');
        return;
    }

    quizAnswers = {};
    currentQuizSetId = setId;
    document.getElementById('quiz-attempt-title').textContent = set.title;
    
    // 🔥 PERBAIKI: ESCAPE HTML ENTITIES
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 🔥 BUILD HTML
    let html = '<div class="space-y-4">';
    
    questions.forEach((q, i) => {
        // Escape semua teks agar karakter khusus seperti < > & tampil
        const questionText = escapeHtml(q.question);
        const optA = escapeHtml(q.option_a);
        const optB = escapeHtml(q.option_b);
        const optC = escapeHtml(q.option_c);
        const optD = escapeHtml(q.option_d);
        
        html += `
            <div class="bg-white rounded-lg p-4 border border-slate-200">
                <p class="font-bold text-slate-800 mb-3">
                    <span class="text-indigo-600">${i+1}.</span> 
                    <span>${questionText}</span>
                </p>
                <div class="space-y-2">
        `;
        
        // Opsi A
        html += `
            <button onclick="selectQuizAnswer(${i}, 'A')" 
                    class="quiz-btn-${i} w-full text-left px-4 py-2 rounded-lg border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition text-sm">
                <span class="font-bold text-indigo-600">A.</span> 
                <span>${optA}</span>
            </button>
        `;
        
        // Opsi B
        html += `
            <button onclick="selectQuizAnswer(${i}, 'B')" 
                    class="quiz-btn-${i} w-full text-left px-4 py-2 rounded-lg border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition text-sm">
                <span class="font-bold text-indigo-600">B.</span> 
                <span>${optB}</span>
            </button>
        `;
        
        // Opsi C
        html += `
            <button onclick="selectQuizAnswer(${i}, 'C')" 
                    class="quiz-btn-${i} w-full text-left px-4 py-2 rounded-lg border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition text-sm">
                <span class="font-bold text-indigo-600">C.</span> 
                <span>${optC}</span>
            </button>
        `;
        
        // Opsi D
        html += `
            <button onclick="selectQuizAnswer(${i}, 'D')" 
                    class="quiz-btn-${i} w-full text-left px-4 py-2 rounded-lg border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition text-sm">
                <span class="font-bold text-indigo-600">D.</span> 
                <span>${optD}</span>
            </button>
        `;
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 sticky bottom-0">
            📝 Total: ${questions.length} soal
        </div>
    `;
    
    document.getElementById('quiz-attempt-content').innerHTML = html;
    showModal('modal-quiz-attempt');
    lucide.createIcons();
}

function selectQuizAnswer(idx, opt) {
    console.log('Pilih:', idx, opt);
    
    // Simpan jawaban
    quizAnswers[idx] = opt;
    
    // Reset semua tombol untuk soal ini
    document.querySelectorAll(`.quiz-btn-${idx}`).forEach(btn => {
        btn.classList.remove('bg-indigo-50', 'border-indigo-400', 'text-indigo-700');
        btn.classList.add('border-slate-300', 'text-slate-700');
    });
    
    // Highlight tombol yang dipilih
    const btns = document.querySelectorAll(`.quiz-btn-${idx}`);
    btns.forEach(btn => {
        if (btn.textContent.trim().startsWith(opt + '.')) {
            btn.classList.add('bg-indigo-50', 'border-indigo-400', 'text-indigo-700');
            btn.classList.remove('border-slate-300', 'text-slate-700');
        }
    });
    
    // Update progress
    const total = document.querySelectorAll('[class^="quiz-btn-"]').length / 4;
    const answered = Object.keys(quizAnswers).length;
    const footer = document.querySelector('#modal-quiz-attempt footer .jawaban-info');
    if (footer) {
        footer.textContent = `💡 ${answered} dari ${total} soal terjawab`;
    }
}

async function submitQuizAttempt() {
    console.log('Submit quiz');
    
    if (!currentUser || currentUser.role !== 'siswa') {
        showToast('Login sebagai siswa');
        return;
    }

    const setId = currentQuizSetId;
    if (!setId) {
        showToast('Error');
        return;
    }

    const questions = dataManager.getData().filter(q => 
        q.type === 'quiz_question' && q.quiz_id === setId
    );

    const total = questions.length;
    const answered = Object.keys(quizAnswers).length;
    
    if (answered < total) {
        showToast(`⚠️ ${answered} dari ${total} soal dijawab`);
        return;
    }

    let correct = 0;
    questions.forEach((q, i) => {
        if (quizAnswers[i] === q.correct_answer) correct++;
    });

    const percentage = Math.round((correct / total) * 100);

    await dataManager.create({
        type: 'score',
        quiz_id: setId,
        student_id: currentUser.id,
        score: percentage,
        answers: JSON.stringify(quizAnswers),
        created_at: new Date().toISOString()
    });

    hideModal('modal-quiz-attempt');
    showToast(`🎯 ${correct} dari ${total} benar (${percentage}%)`);
    renderSiswaQuizSets();
}

// Export
window.showSiswaTab = showSiswaTab;
window.startQuizAttempt = startQuizAttempt;
window.selectQuizAnswer = selectQuizAnswer;
window.submitQuizAttempt = submitQuizAttempt;