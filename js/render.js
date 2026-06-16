// Render Functions
function renderAll() {
    console.log('renderAll dipanggil, currentPage:', window.currentPage);
    
    if (window.currentPage === 'guru') {
        renderStudents();
        renderMaterials();
        renderQuizSets();
        renderNilai();
    } else if (window.currentPage === 'siswa') {
        renderSiswaMateri();
        renderSiswaQuizSets();
    }
}

function renderStudents() {
    const list = document.getElementById('list-siswa');
    const empty = document.getElementById('empty-siswa');
    const students = dataManager.getByType('student');
    
    console.log('Render Students:', students.length, 'siswa');
    
    empty.classList.toggle('hidden', students.length > 0);
    
    if (students.length === 0) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = students.map(s => `
        <div class="bg-white rounded-xl p-4 border border-slate-100 flex items-center justify-between hover:shadow-sm transition">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                    <i data-lucide="user" class="w-4 h-4 text-slate-500"></i>
                </div>
                <div>
                    <p class="font-medium text-sm text-slate-900">${s.name}</p>
                    <p class="text-xs text-slate-400">NIS: ${s.identifier}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editSiswa('${s.__backendId}')" class="p-2 hover:bg-slate-100 rounded-lg transition">
                    <i data-lucide="edit-2" class="w-4 h-4 text-slate-500"></i>
                </button>
                <button onclick="confirmDelete('${s.__backendId}')" class="p-2 hover:bg-red-50 rounded-lg transition">
                    <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function renderMaterials() {
    const list = document.getElementById('list-materi');
    const empty = document.getElementById('empty-materi');
    const materials = dataManager.getByType('material');
    
    console.log('Render Materials:', materials.length, 'materi');
    
    empty.classList.toggle('hidden', materials.length > 0);
    
    if (materials.length === 0) {
        list.innerHTML = '';
        return;
    }

    const icons = { teks: 'file-text', video: 'play-circle', dokumen: 'file' };
    list.innerHTML = materials.map(m => `
        <div class="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-sm transition">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                        <i data-lucide="${icons[m.content_type] || 'file'}" class="w-4 h-4 text-blue-500"></i>
                    </div>
                    <div>
                        <p class="font-medium text-sm text-slate-900">${m.title}</p>
                        <p class="text-xs text-slate-400 capitalize">${m.content_type}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="editMateri('${m.__backendId}')" class="p-2 hover:bg-slate-100 rounded-lg transition">
                        <i data-lucide="edit-2" class="w-4 h-4 text-slate-500"></i>
                    </button>
                    <button onclick="confirmDelete('${m.__backendId}')" class="p-2 hover:bg-red-50 rounded-lg transition">
                        <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function renderQuizSets() {
    const list = document.getElementById('list-quiz-sets');
    const empty = document.getElementById('empty-quiz-sets');
    const sets = dataManager.getByType('quiz_set');
    
    console.log('Render Quiz Sets:', sets.length, 'quiz set');
    
    empty.classList.toggle('hidden', sets.length > 0);
    
    if (sets.length === 0) {
        list.innerHTML = '';
        return;
    }

    // 🔥 Fungsi escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    list.innerHTML = sets.map(set => {
        const questions = dataManager.getData().filter(q => 
            q.type === 'quiz_question' && q.quiz_id === set.__backendId
        );
        return `
            <div class="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-sm transition">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex-1">
                        <p class="font-medium text-sm text-slate-900">${escapeHtml(set.title)}</p>
                        <p class="text-xs text-slate-400">${questions.length} soal</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="openQuizEditor('${set.__backendId}')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition">
                            <i data-lucide="plus" class="w-3 h-3 inline mr-1"></i> Soal
                        </button>
                        <button onclick="editQuizSet('${set.__backendId}')" class="p-1.5 hover:bg-slate-100 rounded-lg transition">
                            <i data-lucide="edit-2" class="w-4 h-4 text-slate-500"></i>
                        </button>
                        <button onclick="confirmDelete('${set.__backendId}')" class="p-1.5 hover:bg-red-50 rounded-lg transition">
                            <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i>
                        </button>
                    </div>
                </div>
                ${questions.length > 0 ? `
                    <div class="space-y-1 border-t border-slate-100 pt-3">
                        ${questions.slice(0, 3).map((q, i) => `
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-slate-600 line-clamp-1">${i+1}. ${escapeHtml(q.question)}</span>
                                <div class="flex gap-1">
                                    <button onclick="editQuizQuestion('${q.__backendId}', '${set.__backendId}')" class="p-1 hover:bg-slate-100 rounded">
                                        <i data-lucide="edit-2" class="w-3 h-3 text-slate-400"></i>
                                    </button>
                                    <button onclick="confirmDelete('${q.__backendId}')" class="p-1 hover:bg-red-50 rounded">
                                        <i data-lucide="trash-2" class="w-3 h-3 text-red-400"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                        ${questions.length > 3 ? `<p class="text-xs text-slate-400">+${questions.length - 3} soal lagi</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

function renderSiswaMateri() {
    const list = document.getElementById('list-s-materi');
    const empty = document.getElementById('empty-s-materi');
    const materials = dataManager.getByType('material');
    
    console.log('Render Siswa Materi:', materials.length, 'materi');
    
    if (!list) {
        console.error('Element list-s-materi tidak ditemukan!');
        return;
    }
    
    empty.classList.toggle('hidden', materials.length > 0);
    
    if (materials.length === 0) {
        list.innerHTML = '';
        return;
    }

    // 🔥 FUNGSI UNTUK KONVERSI URL KE EMBED
    function getEmbedUrl(url) {
        if (!url) return '';
        
        // YouTube
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1]?.split('?')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        
        // Google Drive
        if (url.includes('drive.google.com')) {
            let embed = url.replace('/view', '/preview');
            if (!embed.includes('preview')) {
                const fileId = url.match(/\/d\/(.+?)\//)?.[1];
                if (fileId) {
                    embed = `https://drive.google.com/file/d/${fileId}/preview`;
                }
            }
            return embed;
        }
        
        return url;
    }

    list.innerHTML = materials.map(m => {
        let contentHtml = '';
        const embedUrl = getEmbedUrl(m.video_url);
        
        if (m.content_type === 'teks') {
            contentHtml = `<p class="text-sm text-slate-600 whitespace-pre-wrap mt-3">${m.content || ''}</p>`;
            
        } else if (m.content_type === 'video') {
            contentHtml = `
                <div class="mt-3 aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <iframe 
                        src="${embedUrl}" 
                        class="w-full h-full" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                ${m.video_url ? `<a href="${m.video_url}" target="_blank" class="text-xs text-blue-500 mt-2 inline-block hover:underline">🔗 Buka di tab baru</a>` : ''}
            `;
            
        } else if (m.content_type === 'dokumen') {
            contentHtml = `
                <div class="mt-3 rounded-lg overflow-hidden bg-slate-100" style="height: 500px;">
                    <iframe 
                        src="${embedUrl}" 
                        class="w-full h-full" 
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                </div>
                <a href="${m.video_url}" target="_blank" class="text-xs text-blue-500 mt-2 inline-block hover:underline">
                    📄 Buka dokumen di tab baru
                </a>
            `;
        }
        
        return `
            <div class="bg-white rounded-xl p-5 border border-slate-100">
                <div class="flex items-center gap-3 mb-1">
                    <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-md capitalize">${m.content_type}</span>
                </div>
                <h3 class="font-semibold text-slate-900">${m.title}</h3>
                ${contentHtml}
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

function renderSiswaQuizSets() {
    const list = document.getElementById('list-s-quiz-sets');
    const empty = document.getElementById('empty-s-quiz');
    const sets = dataManager.getByType('quiz_set');
    
    console.log('Render Siswa Quiz:', sets.length, 'quiz set');
    
    if (!list) {
        console.error('Element list-s-quiz-sets tidak ditemukan!');
        return;
    }
    
    empty.classList.toggle('hidden', sets.length > 0);
    
    if (sets.length === 0) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = sets.map(set => {
        // 🔥 AMBIL SEMUA SOAL UNTUK QUIZ INI
        const questions = dataManager.getData().filter(q => 
            q.type === 'quiz_question' && q.quiz_id === set.__backendId
        );
        
        // Cek apakah sudah dikerjakan
        const completed = dataManager.getData().find(s => 
            s.type === 'score' && 
            s.quiz_id === set.__backendId && 
            s.student_id === currentUser?.id
        );
        
        // Tampilkan preview soal (3 soal pertama)
        let previewHtml = '';
        if (questions.length > 0) {
            previewHtml = `
                <div class="mt-2 text-xs text-slate-500 space-y-1">
                    ${questions.slice(0, 3).map((q, i) => `
                        <div class="flex items-center gap-2">
                            <span class="text-indigo-600 font-bold">${i+1}.</span>
                            <span class="truncate">${q.question}</span>
                        </div>
                    `).join('')}
                    ${questions.length > 3 ? `<div class="text-slate-400">+ ${questions.length - 3} soal lagi</div>` : ''}
                </div>
            `;
        }
        
        return `
            <div class="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-md transition">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="font-medium text-slate-900 text-lg">${set.title}</p>
                        <p class="text-xs text-slate-400">📝 ${questions.length} soal</p>
                        ${completed ? `<p class="text-xs text-emerald-600 font-medium mt-1">✅ Selesai - Skor: ${completed.score}%</p>` : ''}
                        ${previewHtml}
                    </div>
                    <button onclick="startQuizAttempt('${set.__backendId}')" 
                            class="px-6 py-2.5 ${completed ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} text-sm font-medium rounded-lg transition ml-4" 
                            ${completed ? 'disabled' : ''}>
                        ${completed ? 'Selesai' : '🚀 Mulai'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

function renderNilai() {
    const tbody = document.getElementById('tabel-nilai');
    const empty = document.getElementById('empty-nilai');
    const scores = dataManager.getByType('score');
    
    console.log('Render Nilai:', scores.length, 'nilai');
    
    if (scores.length === 0) {
        empty.classList.remove('hidden');
        tbody.innerHTML = '';
        return;
    }
    
    empty.classList.add('hidden');
    const students = dataManager.getByType('student');
    const quizSets = dataManager.getByType('quiz_set');
    
    tbody.innerHTML = scores.map(score => {
        const student = students.find(s => s.__backendId === score.student_id);
        const quiz = quizSets.find(q => q.__backendId === score.quiz_id);
        const date = formatDate(score.created_at);
        return `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="px-4 py-3 text-slate-900">${student?.name || '-'}</td>
                <td class="px-4 py-3 text-slate-600">${quiz?.title || '-'}</td>
                <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg">${score.score}%</span>
                </td>
                <td class="px-4 py-3 text-center text-slate-500 text-sm">${date}</td>
            </tr>
        `;
    }).join('');
}

// Export
window.renderAll = renderAll;
window.renderStudents = renderStudents;
window.renderMaterials = renderMaterials;
window.renderQuizSets = renderQuizSets;
window.renderSiswaMateri = renderSiswaMateri;
window.renderSiswaQuizSets = renderSiswaQuizSets;
window.renderNilai = renderNilai;