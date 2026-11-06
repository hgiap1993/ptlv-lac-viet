// ============================================================================
// MAIN UI CONTROLLER: LẠC VIỆT ĐẠO QUÁN WEB APP / PWA
// Kết nối 4 Engine Lý Học Đông Phương & Kho dữ liệu TaiLieuLyHoc.md
// ============================================================================

(function () {
  const AL = window.LacVietAmLich;
  const LT = window.LacVietLuanTuoi;
  const TC = window.LacVietTrachCat;
  const TV = window.LacVietTuViPhongThuy;

  // State cho Luận Tuổi Gia Đạo & Tiện ích Người Lớn Tuổi
  let currentChildrenYears = [2018, 2026];
  let currentLuanTuoiMode = 'children'; // 'couple' | 'children' | 'findBaby'
  let selectedTrachCatPurpose = 'all';  // 'all' | 'dongtho' | 'cuoihoi' | 'khaitruong' | 'nhaptrach' | 'xuathanh' | 'cunggio'
  let isSimpleSeniorTuViBoard = false;
  let currentTuViChart = null;
  let selectedPalaceIdx = null;
  let audioCtx = null;
  let ambientOsc = null;
  let isAmbientPlaying = false;
  let ttsSpeedRate = 0.9; // Mặc định đọc chậm rõ (0.9x) cho người lớn tuổi
  let lastSpokenText = '';
  let modalDocFontStep = 1; // 0: Thường, 1: Lớn (mặc định cho người lớn tuổi), 2: Rất lớn

  const ZODIAC_ANIMALS = {
    'Tý': { icon: '🐭', animal: 'Con Chuột' },
    'Sửu': { icon: '🐮', animal: 'Con Trâu' },
    'Dần': { icon: '🐯', animal: 'Con Hổ' },
    'Mão': { icon: '🐱', animal: 'Con Mèo' },
    'Thìn': { icon: '🐉', animal: 'Con Rồng' },
    'Tỵ': { icon: '🐍', animal: 'Con Rắn' },
    'Ngọ': { icon: '🐴', animal: 'Con Ngựa' },
    'Mùi': { icon: '🐐', animal: 'Con Dê' },
    'Thân': { icon: '🐵', animal: 'Con Khỉ' },
    'Dậu': { icon: '🐔', animal: 'Con Gà' },
    'Tuất': { icon: '🐶', animal: 'Con Chó' },
    'Hợi': { icon: '🐷', animal: 'Con Heo' }
  };

  function getYearOptionLabel(year) {
    const info = AL.getYearInfo(year);
    const z = ZODIAC_ANIMALS[info.chi] || { icon: '🌟', animal: '' };
    return `${z.icon} ${year} — ${info.canChi} (${z.animal} · Mạng ${info.lacVietHanh})`;
  }

  function buildYearSelectHtml(selectedYear, minYear = 1935, maxYear = 2036, extraClass = '', dataIdx = '') {
    const opts = [];
    for (let y = maxYear; y >= minYear; y--) {
      opts.push(`<option value="${y}" ${y === Number(selectedYear) ? 'selected' : ''}>${getYearOptionLabel(y)}</option>`);
    }
    return `<select class="zodiac-helper-select ${extraClass}" ${dataIdx !== '' ? `data-idx="${dataIdx}"` : ''} title="Chọn nhanh theo Tuổi Con Giáp (Can Chi)">${opts.join('')}</select>`;
  }

  function attachZodiacSelectToYearInput(inputId, minYear = 1935, maxYear = 2035, onChangeCallback = null) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    let sel = inp.parentElement.querySelector('.zodiac-helper-select');
    if (!sel) {
      sel = document.createElement('select');
      sel.className = 'zodiac-helper-select';
      sel.title = 'Chọn nhanh theo Tuổi Con Giáp (Can Chi)';
      const opts = [];
      for (let y = maxYear; y >= minYear; y--) {
        opts.push(`<option value="${y}">${getYearOptionLabel(y)}</option>`);
      }
      sel.innerHTML = opts.join('');
      inp.insertAdjacentElement('afterend', sel);

      sel.addEventListener('change', () => {
        inp.value = sel.value;
        saveUserState();
        if (onChangeCallback) onChangeCallback();
      });
      inp.addEventListener('input', () => {
        const v = parseInt(inp.value, 10);
        if (v >= minYear && v <= maxYear) sel.value = String(v);
      });
    }
    sel.value = String(inp.value);
  }

  function showSeniorToast(msg) {
    const t = document.getElementById('seniorToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 4500);
  }

  async function shareOrCopyZalo(title, plainText) {
    const fullText = `${title}\n\n${plainText}\n\n👉 Xem chi tiết tại ứng dụng Lạc Việt Đạo Quán (PTLV): https://hgiap1993.github.io/ptlv-lac-viet/`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
      }
    } catch (e) {}
    if (navigator.share) {
      try {
        await navigator.share({ title, text: fullText, url: 'https://hgiap1993.github.io/ptlv-lac-viet/' });
        showSeniorToast('✅ Đã chia sẻ kết quả thành công!');
        return;
      } catch (e) {}
    }
    showSeniorToast('✅ Đã sao chép kết quả! Bạn chỉ cần mở Zalo hoặc Tin nhắn và bấm "Dán" (Paste) để gửi cho con cháu.');
  }

  function saveUserState() {
    try {
      const state = {
        fatherYear: parseInt(document.getElementById('inputFatherYear')?.value, 10) || 1988,
        motherYear: parseInt(document.getElementById('inputMotherYear')?.value, 10) || 1990,
        childrenYears: currentChildrenYears,
        luanTuoiMode: currentLuanTuoiMode,
        trachCatOwnerYear: parseInt(document.getElementById('inputTrachCatOwnerYear')?.value, 10) || 1990,
        buildYear: parseInt(document.getElementById('inputBuildYear')?.value, 10) || 2026,
        tuViName: document.getElementById('inputTuViName')?.value || 'Nguyễn Văn An',
        tuViGender: document.getElementById('inputTuViGender')?.value || 'Nam',
        tuViCalType: document.getElementById('selectTuViCalType')?.value || 'solar',
        tuViDay: parseInt(document.getElementById('inputTuViDay')?.value, 10) || 15,
        tuViMonth: parseInt(document.getElementById('inputTuViMonth')?.value, 10) || 6,
        tuViYear: parseInt(document.getElementById('inputTuViYear')?.value, 10) || 1990,
        tuViHour: parseInt(document.getElementById('inputTuViHour')?.value, 10) || 6,
        phongThuyYear: parseInt(document.getElementById('inputPhongThuyYear')?.value, 10) || 1984,
        phongThuyGender: document.getElementById('inputPhongThuyGender')?.value || 'Nam'
      };
      localStorage.setItem('ptlv_senior_profile_v1', JSON.stringify(state));
    } catch (e) {}
  }

  function loadUserState() {
    try {
      const raw = localStorage.getItem('ptlv_senior_profile_v1');
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.fatherYear && document.getElementById('inputFatherYear')) document.getElementById('inputFatherYear').value = s.fatherYear;
      if (s.motherYear && document.getElementById('inputMotherYear')) document.getElementById('inputMotherYear').value = s.motherYear;
      if (Array.isArray(s.childrenYears)) currentChildrenYears = s.childrenYears;
      if (s.luanTuoiMode) currentLuanTuoiMode = s.luanTuoiMode;
      if (s.trachCatOwnerYear && document.getElementById('inputTrachCatOwnerYear')) document.getElementById('inputTrachCatOwnerYear').value = s.trachCatOwnerYear;
      if (s.buildYear && document.getElementById('inputBuildYear')) document.getElementById('inputBuildYear').value = s.buildYear;
      if (s.tuViName && document.getElementById('inputTuViName')) document.getElementById('inputTuViName').value = s.tuViName;
      if (s.tuViGender && document.getElementById('inputTuViGender')) document.getElementById('inputTuViGender').value = s.tuViGender;
      if (s.tuViCalType && document.getElementById('selectTuViCalType')) document.getElementById('selectTuViCalType').value = s.tuViCalType;
      if (s.tuViDay && document.getElementById('inputTuViDay')) document.getElementById('inputTuViDay').value = s.tuViDay;
      if (s.tuViMonth && document.getElementById('inputTuViMonth')) document.getElementById('inputTuViMonth').value = s.tuViMonth;
      if (s.tuViYear && document.getElementById('inputTuViYear')) document.getElementById('inputTuViYear').value = s.tuViYear;
      if (s.tuViHour !== undefined && document.getElementById('inputTuViHour')) document.getElementById('inputTuViHour').value = s.tuViHour;
      if (s.phongThuyYear && document.getElementById('inputPhongThuyYear')) document.getElementById('inputPhongThuyYear').value = s.phongThuyYear;
      if (s.phongThuyGender && document.getElementById('inputPhongThuyGender')) document.getElementById('inputPhongThuyGender').value = s.phongThuyGender;
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // ÂM THANH CHUÔNG ĐỒNG ĐÔNG SƠN & GIỌNG ĐỌC TIẾNG VIỆT (TTS CÓ ĐIỀU KHIỂN)
  // --------------------------------------------------------------------------
  function playBronzeBell(freq = 528, duration = 1.2) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function toggleAmbientSound() {
    const btn = document.getElementById('btnAmbientAudio');
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (isAmbientPlaying) {
        if (ambientOsc) { ambientOsc.stop(); ambientOsc.disconnect(); ambientOsc = null; }
        isAmbientPlaying = false;
        if (btn) { btn.classList.remove('active'); btn.innerHTML = '🔔 Nhạc Thiền'; }
      } else {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        ambientOsc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        ambientOsc.type = 'sine';
        ambientOsc.frequency.setValueAtTime(432, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
        ambientOsc.connect(gain);
        gain.connect(audioCtx.destination);
        ambientOsc.start();
        isAmbientPlaying = true;
        if (btn) { btn.classList.add('active'); btn.innerHTML = '🔊 Nhạc 432Hz'; }
      }
    } catch (e) {}
  }

  function speakVietnamese(text) {
    if (!('speechSynthesis' in window)) {
      showSeniorToast('⚠️ Trình duyệt trên thiết bị này chưa hỗ trợ đọc giọng nói.');
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]+>/g, ' ').replace(/[#*>`_~]/g, '').replace(/\s+/g, ' ').trim().slice(0, 1800);
    lastSpokenText = clean;
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'vi-VN';
    utter.rate = ttsSpeedRate;

    const bar = document.getElementById('ttsFloatingBar');
    const pauseBtn = document.getElementById('btnTtsPauseResume');
    const statusLbl = document.getElementById('ttsStatusLabel');
    if (bar) bar.classList.add('active');
    if (pauseBtn) pauseBtn.innerHTML = '⏸️ Tạm Dừng';
    if (statusLbl) statusLbl.innerHTML = '🔊 Đang đọc tư vấn to rõ...';

    utter.onend = () => {
      if (bar) bar.classList.remove('active');
    };
    utter.onerror = () => {
      if (bar) bar.classList.remove('active');
    };
    window.speechSynthesis.speak(utter);
  }

  // --------------------------------------------------------------------------
  // CHUYỂN TAB NAVIGATION
  // --------------------------------------------------------------------------
  function switchTab(tabId) {
    playBronzeBell(528, 0.5);
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn, .dock-item').forEach(b => {
      if (b.getAttribute('data-tab') === tabId) b.classList.add('active');
      else b.classList.remove('active');
    });
    const target = document.getElementById(`panel-${tabId}`);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --------------------------------------------------------------------------
  // TAB 1: LUẬN TUỔI LẠC VIỆT (GIA ĐẠO, VỢ CHỒNG, CHỌN NĂM SINH CON ÚT & 60 HOA GIÁP)
  // --------------------------------------------------------------------------
  function updateModeButtonsUI() {
    const btnCouple = document.getElementById('btnModeCoupleOnly');
    const btnWithKids = document.getElementById('btnModeWithChildren');
    const btnFindBaby = document.getElementById('btnModeFindBabyYear');
    if (btnCouple && btnWithKids && btnFindBaby) {
      btnCouple.classList.toggle('active', currentLuanTuoiMode === 'couple');
      btnWithKids.classList.toggle('active', currentLuanTuoiMode === 'children');
      btnFindBaby.classList.toggle('active', currentLuanTuoiMode === 'findBaby');
    }
  }

  function renderChildrenInputs() {
    updateModeButtonsUI();
    const container = document.getElementById('childrenListContainer');
    if (!container) return;
    if (currentLuanTuoiMode === 'findBaby') {
      container.innerHTML = `<div style="color:var(--jade-light);font-size:0.88rem;padding:10px 12px;background:rgba(16,185,129,0.12);border-left:4px solid var(--jade-primary);border-radius:8px;">🌟 Đang chọn <b>Tìm Năm Đẹp Sinh Con</b>: Bảng xếp hạng năm tốt nhất hiển thị ngay bên dưới.</div>`;
      return;
    }
    if (currentChildrenYears.length === 0) {
      container.innerHTML = `<div style="color:var(--jade-light);font-size:0.86rem;padding:8px 4px;">✨ Đang xem chế độ <b>2 Vợ Chồng</b>. Bấm <b>"+ Thêm Con"</b> nếu đã có con.</div>`;
      return;
    }
    container.innerHTML = currentChildrenYears.map((yr, idx) => {
      const isLast = idx === currentChildrenYears.length - 1;
      const yInfo = AL.getYearInfo(yr);
      const label = isLast ? `Con thứ ${idx + 1} (🌟 Con Út)` : `Con thứ ${idx + 1}`;
      return `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;padding:8px;background:rgba(255,255,255,0.03);border-radius:8px;">
          <span class="badge ${isLast ? 'badge-good' : 'badge-neutral'}" style="min-width:160px;">${label}</span>
          <input type="number" class="form-input child-year-input" data-idx="${idx}" value="${yr}" min="1940" max="2045" style="width:105px;" />
          <div style="flex:1;min-width:240px;">
            ${buildYearSelectHtml(yr, 1960, 2038, 'child-zodiac-select', idx)}
          </div>
          <span class="badge hanh-${yInfo.lacVietHanh}">${yInfo.canChi} · Mạng ${yInfo.lacVietHanh}</span>
          <button type="button" class="btn-secondary btn-remove-child" data-idx="${idx}" style="padding:6px 10px;font-size:0.75rem;">✕ Xóa</button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.child-year-input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const i = parseInt(e.target.getAttribute('data-idx'), 10);
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          currentChildrenYears[i] = val;
          saveUserState();
          renderChildrenInputs();
          runLuanTuoiAnalysis();
        }
      });
    });

    container.querySelectorAll('.child-zodiac-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const i = parseInt(e.target.getAttribute('data-idx'), 10);
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          currentChildrenYears[i] = val;
          saveUserState();
          renderChildrenInputs();
          runLuanTuoiAnalysis();
        }
      });
    });

    container.querySelectorAll('.btn-remove-child').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        currentChildrenYears.splice(i, 1);
        saveUserState();
        renderChildrenInputs();
        runLuanTuoiAnalysis();
      });
    });
  }

  function runLuanTuoiAnalysis() {
    saveUserState();
    const fYear = parseInt(document.getElementById('inputFatherYear').value, 10) || 1988;
    const mYear = parseInt(document.getElementById('inputMotherYear').value, 10) || 1990;
    const fSel = document.getElementById('inputFatherYear')?.parentElement?.querySelector('.zodiac-helper-select');
    if (fSel) fSel.value = String(fYear);
    const mSel = document.getElementById('inputMotherYear')?.parentElement?.querySelector('.zodiac-helper-select');
    if (mSel) mSel.value = String(mYear);
    const res = LT.analyzeFamilyLacViet(fYear, mYear, currentChildrenYears);
    const recYears = LT.recommendChildYears(fYear, mYear, 2025, 2036);

    const outBox = document.getElementById('luanTuoiResultBox');
    if (!outBox) return;

    // Sơ đồ dòng truyền dẫn khí gia đạo
    const chainHtml = `
      <div class="flow-chain">
        <div class="flow-node">
          <div style="font-size:0.72rem;color:var(--gold-primary);font-weight:700;">👨 CHỒNG (CHA)</div>
          <div style="font-size:1rem;font-weight:800;">${res.father.info.year} – ${res.father.info.canChi}</div>
          <div style="margin-top:4px;"><span class="badge hanh-${res.father.info.lacVietHanh}">Mạng Lạc Việt: ${res.father.info.lacVietHanh}</span></div>
          <div style="font-size:0.72rem;color:var(--text-muted);margin-top:3px;">(Sách thường: ${res.father.info.hanHanh})</div>
        </div>
        <div class="flow-arrow">+</div>
        <div class="flow-node">
          <div style="font-size:0.72rem;color:var(--gold-primary);font-weight:700;">👩 VỢ (MẸ)</div>
          <div style="font-size:1rem;font-weight:800;">${res.mother.info.year} – ${res.mother.info.canChi}</div>
          <div style="margin-top:4px;"><span class="badge hanh-${res.mother.info.lacVietHanh}">Mạng Lạc Việt: ${res.mother.info.lacVietHanh}</span></div>
          <div style="font-size:0.72rem;color:var(--text-muted);margin-top:3px;">(Sách thường: ${res.mother.info.hanHanh})</div>
        </div>
        ${res.childrenAnalyses.map(c => `
          <div class="flow-arrow">➔</div>
          <div class="flow-node ${c.isYoungest ? 'youngest-node' : ''}">
            <div style="font-size:0.72rem;color:${c.isYoungest ? 'var(--jade-light)' : 'var(--gold-light)'};font-weight:700;">${c.isYoungest ? '🌟 ĐIỂM DỪNG: CON ÚT' : `CON THỨ ${c.index}`}</div>
            <div style="font-size:1rem;font-weight:800;">${c.person.info.year} – ${c.person.info.canChi}</div>
            <div style="margin-top:4px;"><span class="badge hanh-${c.person.info.lacVietHanh}">Mạng Lạc Việt: ${c.person.info.lacVietHanh}</span></div>
            <div style="font-size:0.76rem;margin-top:4px;font-weight:700;color:${c.combinedScore >= 70 ? '#34d399' : '#fbbf24'};">Độ hợp Bố Mẹ: ${c.combinedScore}/100</div>
          </div>
        `).join('')}
      </div>
    `;

    // Chi tiết tương tác từng người con
    const childrenDetailHtml = res.childrenAnalyses.length === 0
      ? ''
      : `
        <div class="card" style="background:var(--bg-card-alt);">
          <div class="card-header">
            <div class="card-title">👶 Độ Hợp Của Các Con Với Cha Mẹ</div>
          </div>
          ${res.childrenAnalyses.map(c => `
            <div style="padding:14px;border:1px solid ${c.isYoungest ? 'var(--jade-primary)' : 'var(--border-subtle)'};border-radius:10px;margin-bottom:12px;background:var(--bg-card);">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
                <div style="font-weight:800;font-size:0.98rem;color:${c.isYoungest ? 'var(--jade-light)' : 'var(--gold-light)'};">
                  ${c.orderTitle}: ${c.person.info.year} (${c.person.info.canChi}) — Mạng ${c.person.info.lacVietHanh}
                </div>
                <span class="badge ${c.combinedScore >= 70 ? 'badge-good' : (c.combinedScore >= 55 ? 'badge-neutral' : 'badge-warn')}">
                  Độ hợp: ${c.combinedScore}/100
                </span>
              </div>
              ${c.bridgeExplanation ? `<div style="margin-bottom:10px;padding:10px 12px;background:rgba(16,185,129,0.12);border-left:3px solid var(--jade-primary);font-size:0.88rem;">${c.bridgeExplanation}</div>` : ''}
              <div class="grid-2" style="gap:10px;font-size:0.85rem;">
                <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;">
                  <b style="color:var(--gold-light);">🔹 Với Cha (${res.father.info.year} ${res.father.info.canChi}): ${c.withFather.totalScore}/100</b>
                  <div style="margin-top:6px;color:var(--text-main);">${c.withFather.mang.human}</div>
                  <div style="margin-top:4px;font-size:0.78rem;color:var(--text-muted);">• ${c.withFather.can.detail} | ${c.withFather.chi.detail}</div>
                </div>
                <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;">
                  <b style="color:var(--gold-light);">🔸 Với Mẹ (${res.mother.info.year} ${res.mother.info.canChi}): ${c.withMother.totalScore}/100</b>
                  <div style="margin-top:6px;color:var(--text-main);">${c.withMother.mang.human}</div>
                  <div style="margin-top:4px;font-size:0.78rem;color:var(--text-muted);">• ${c.withMother.can.detail} | ${c.withMother.chi.detail}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

    // Giải oan ngộ nhận dân gian
    const mythHtml = res.mythBusters.length === 0
      ? ''
      : `
        <div class="card" style="border-color:var(--jade-primary);">
          <div class="card-header">
            <div class="card-title" style="color:var(--jade-light);">🛡️ Hóa Giải Ngộ Nhận Dân Gian</div>
          </div>
          ${res.mythBusters.map(m => `
            <div style="margin-bottom:10px;padding:12px 14px;background:rgba(16,185,129,0.08);border-left:3px solid var(--jade-primary);border-radius:8px;">
              <div style="font-weight:700;color:var(--jade-light);font-size:0.92rem;">${m.title}</div>
              <div style="font-size:0.88rem;color:var(--text-main);margin-top:4px;line-height:1.65;">${m.content}</div>
            </div>
          `).join('')}
        </div>
      `;

    const babyYearsCardHtml = `
      <!-- BẢNG ĐỀ XUẤT NĂM VÀNG SINH CON ÚT (2025 - 2036) -->
      <div class="card" id="babyYearsTableCard" style="${currentLuanTuoiMode === 'findBaby' ? 'border:2px solid var(--gold-primary);box-shadow:0 0 24px rgba(229,184,92,0.22);' : ''}">
        <div class="card-header">
          <div>
            <div class="card-title">🌟 Bảng Xếp Hạng Năm Sinh Con (2025 – 2036)</div>
            <div class="card-subtitle">Chồng <b>${res.father.info.year} (${res.father.info.canChi})</b> & Vợ <b>${res.mother.info.year} (${res.mother.info.canChi})</b></div>
          </div>
          <span class="badge badge-good">2025 – 2036</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Năm Sinh</th>
                <th>Mạng</th>
                <th>Hợp Cha</th>
                <th>Hợp Mẹ</th>
                <th>Đánh Giá</th>
                <th>Điểm</th>
                <th>Chọn</th>
              </tr>
            </thead>
            <tbody>
              ${recYears.map((item, idx) => `
                <tr>
                  <td><b>#${idx + 1}</b></td>
                  <td><b>${item.year} (${item.cInfo.canChi})</b></td>
                  <td><span class="badge hanh-${item.cInfo.lacVietHanh}">${item.cInfo.lacVietHanh}</span></td>
                  <td>${item.withF.totalScore}/100</td>
                  <td>${item.withM.totalScore}/100</td>
                  <td style="font-size:0.83rem;">
                    <div><b>${item.bridgeTag}</b></div>
                    <div style="color:var(--text-muted);margin-top:2px;">${item.whyGood}</div>
                  </td>
                  <td><span class="badge ${item.score >= 78 ? 'badge-good' : (item.score >= 62 ? 'badge-neutral' : 'badge-warn')}">${item.score}/100</span></td>
                  <td>
                    <button type="button" class="btn-secondary btn-try-child-year" data-year="${item.year}" style="padding:5px 10px;font-size:0.76rem;white-space:nowrap;">
                      + Chọn năm này
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    outBox.innerHTML = `
      ${currentLuanTuoiMode === 'findBaby' ? babyYearsCardHtml : ''}
      <!-- TỔNG KẾT CỤC DIỆN GIA ĐẠO -->
      <div class="card card-highlight">
        <div class="card-header">
          <div>
            <div class="card-title">🏛️ Tổng Quan Vận Khí Gia Đình</div>
            <div class="card-subtitle">Chồng <b>${res.father.info.year} (${res.father.info.canChi})</b> & Vợ <b>${res.mother.info.year} (${res.mother.info.canChi})</b></div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="badge ${res.overallScore >= 72 ? 'badge-good' : (res.overallScore >= 55 ? 'badge-neutral' : 'badge-warn')}" style="font-size:0.96rem;padding:7px 14px;">
              Vận Khí: ${res.overallScore}/100
            </span>
            <button type="button" class="btn-pill" id="btnSpeakLuanTuoi">🔊 Nghe Đọc</button>
            <button type="button" class="btn-pill" id="btnShareLuanTuoiZalo" style="border-color:var(--jade-primary);color:var(--jade-light);font-weight:700;">📤 Gửi Zalo</button>
          </div>
        </div>

        ${chainHtml}

        <!-- 3 HỘP TÓM TẮT -->
        <div class="summary-3-grid">
          <div class="summary-box">
            <div class="summary-box-title">💑 1. Tình Cảm Vợ Chồng</div>
            <div>${res.customerSummary.hoaKhi}</div>
          </div>
          <div class="summary-box">
            <div class="summary-box-title">💰 2. Kinh Tế & Tài Lộc</div>
            <div>${res.customerSummary.taiLoc}</div>
          </div>
          <div class="summary-box">
            <div class="summary-box-title">💡 3. Lời Khuyên Gia Đạo</div>
            <div style="white-space:pre-line;">${res.customerSummary.loiKhuyen}</div>
          </div>
        </div>

        <div style="padding:14px;background:rgba(229,184,92,0.1);border-left:4px solid var(--gold-primary);border-radius:8px;margin:14px 0 10px;">
          <div style="font-weight:700;color:var(--gold-light);margin-bottom:4px;">📌 Đánh Giá Cục Diện:</div>
          <div style="font-size:0.92rem;line-height:1.65;">${res.familyVerdict}</div>
        </div>

        <div style="padding:14px;background:rgba(16,185,129,0.1);border-left:4px solid var(--jade-primary);border-radius:8px;">
          <div style="font-weight:700;color:var(--jade-light);margin-bottom:4px;">🧭 Giải Pháp Gia Đạo:</div>
          <div style="font-size:0.9rem;white-space:pre-line;line-height:1.65;">${res.familySolution}</div>
        </div>
      </div>

      <!-- SO SÁNH 3 TRỤ VỢ CHỒNG & BẢN MỆNH -->
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">💑 Luận Tuổi Hai Vợ Chồng (${res.couple.totalScore}/100)</div>
            <span class="badge ${res.couple.badgeClass}">${res.couple.rank}</span>
          </div>
          <div style="font-size:0.88rem;display:flex;flex-direction:column;gap:10px;">
            <div style="padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;">
              <b style="color:var(--gold-light);">1. Thiên Can (Tính Cách & Lời Nói):</b>
              <div style="margin-top:4px;color:var(--text-main);">${res.couple.can.human}</div>
              <div style="margin-top:4px;font-size:0.78rem;color:var(--text-muted);">• ${res.couple.can.detail}</div>
            </div>
            <div style="padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;">
              <b style="color:var(--gold-light);">2. Địa Chi (Lối Sống & Sinh Hoạt):</b>
              <div style="margin-top:4px;color:var(--text-main);">${res.couple.chi.human}</div>
              <div style="margin-top:4px;font-size:0.78rem;color:var(--text-muted);">• ${res.couple.chi.detail}</div>
            </div>
            <div style="padding:12px;background:rgba(229,184,92,0.08);border:1px solid var(--border-gold);border-radius:8px;">
              <b style="color:var(--gold-light);">3. Thân Mạng Lạc Việt (Tài Lộc & Sức Khỏe):</b>
              <div style="margin-top:4px;color:var(--text-main);">${res.couple.mang.human}</div>
              <div style="margin-top:4px;font-size:0.78rem;color:var(--text-muted);">• ${res.couple.mang.detail}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🧬 Bản Mệnh Từng Người</div>
          </div>
          <div style="font-size:0.88rem;display:flex;flex-direction:column;gap:12px;">
            <div style="padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;">
              <div style="font-weight:800;color:var(--gold-light);font-size:0.95rem;">👨 Chồng: ${res.father.info.year} (${res.father.info.canChi} – Mạng ${res.father.info.lacVietHanh})</div>
              <div style="margin-top:4px;color:var(--jade-light);font-weight:600;">• ${res.father.internalType}</div>
              <div style="margin-top:4px;color:var(--text-main);">${res.father.internalAdv}</div>
              ${res.father.specialNote ? `<div style="margin-top:5px;color:var(--text-muted);font-size:0.83rem;">• ${res.father.specialNote}</div>` : ''}
            </div>
            <div style="padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;">
              <div style="font-weight:800;color:var(--gold-light);font-size:0.95rem;">👩 Vợ: ${res.mother.info.year} (${res.mother.info.canChi} – Mạng ${res.mother.info.lacVietHanh})</div>
              <div style="margin-top:4px;color:var(--jade-light);font-weight:600;">• ${res.mother.internalType}</div>
              <div style="margin-top:4px;color:var(--text-main);">${res.mother.internalAdv}</div>
              ${res.mother.specialNote ? `<div style="margin-top:5px;color:var(--text-muted);font-size:0.83rem;">• ${res.mother.specialNote}</div>` : ''}
            </div>
          </div>
        </div>
      </div>

      ${childrenDetailHtml}
      ${mythHtml}
      ${currentLuanTuoiMode !== 'findBaby' ? babyYearsCardHtml : ''}
    `;

    const speakBtn = document.getElementById('btnSpeakLuanTuoi');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        speakVietnamese(`${res.customerSummary.hoaKhi} ${res.customerSummary.taiLoc} ${res.familyVerdict} ${res.familySolution}`);
      });
    }

    const shareZaloBtn = document.getElementById('btnShareLuanTuoiZalo');
    if (shareZaloBtn) {
      shareZaloBtn.addEventListener('click', () => {
        const plain = [
          `📌 KẾT QUẢ LUẬN TUỔI GIA ĐẠO LẠC VIỆT (${res.overallScore}/100 điểm)`,
          `• Chồng: ${res.father.info.year} (${res.father.info.canChi} - Mạng Lạc Việt: ${res.father.info.lacVietHanh})`,
          `• Vợ: ${res.mother.info.year} (${res.mother.info.canChi} - Mạng Lạc Việt: ${res.mother.info.lacVietHanh})`,
          res.childrenAnalyses.length > 0 ? `• Các con: ${res.childrenAnalyses.map(c => `${c.person.info.year} (${c.person.info.canChi})`).join(', ')}` : '• Chế độ: Xem 2 vợ chồng',
          `1. Hòa khí: ${res.customerSummary.hoaKhi.replace(/<[^>]+>/g, '')}`,
          `2. Tài lộc: ${res.customerSummary.taiLoc.replace(/<[^>]+>/g, '')}`,
          `3. Lời khuyên: ${res.customerSummary.loiKhuyen.replace(/<[^>]+>/g, '')}`,
          `🌟 Top 3 năm đẹp nhất sinh con (2025-2036): ${recYears.slice(0, 3).map(r => `${r.year} (${r.cInfo.canChi} - ${r.score}/100đ)`).join(', ')}`
        ].join('\n');
        shareOrCopyZalo('Kết Quả Luận Tuổi Gia Đạo Lạc Việt', plain);
      });
    }

    outBox.querySelectorAll('.btn-try-child-year').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const y = parseInt(e.currentTarget.getAttribute('data-year'), 10);
        currentChildrenYears.push(y);
        currentLuanTuoiMode = 'children';
        renderChildrenInputs();
        runLuanTuoiAnalysis();
        document.getElementById('luanTuoiResultBox')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // Render Bảng Tra cứu 60 Năm Lạc Thư Hoa Giáp
  function render60HoaGiapTable(filterKeyword = '') {
    const tbody = document.getElementById('table60HoaGiapBody');
    if (!tbody) return;
    const kw = filterKeyword.trim().toLowerCase();
    const rows = [];

    for (let y = 1954; y <= 2033; y++) {
      const info = AL.getYearInfo(y);
      const matchStr = `${y} ${info.canChi} ${info.lacVietHanh} ${info.hanName} ${info.hanHanh}`.toLowerCase();
      if (kw && !matchStr.includes(kw)) continue;
      rows.push(`
        <tr>
          <td><b>${y}</b></td>
          <td><b>${info.canChi}</b></td>
          <td>${info.can} (${info.canHanh})</td>
          <td>${info.chi} (${info.chiHanh})</td>
          <td><span class="badge hanh-${info.lacVietHanh}">${info.lacVietHanh} (${info.swapped ? '⚡ Hoán vị Thủy–Hỏa' : 'Giữ nguyên'})</span></td>
          <td style="color:var(--text-muted);">${info.hanName} (${info.hanHanh})</td>
          <td style="font-size:0.8rem;color:var(--text-main);">${info.bulletDesc || ''}</td>
        </tr>
      `);
    }
    tbody.innerHTML = rows.join('');
  }

  // --------------------------------------------------------------------------
  // TAB 2: CHỌN NGÀY GIỜ TỐT LẠC VIỆT (TRẠCH CÁT, LỊCH BLOC CHỮ ĐẠI & LỌC VIỆC)
  // --------------------------------------------------------------------------
  const PURPOSE_CONFIG = {
    all: { label: 'Tất Cả Mọi Việc', goodTruc: ['Kiến', 'Mãn', 'Bình', 'Định', 'Chấp', 'Thành', 'Khai'], keywords: [] },
    dongtho: { label: 'Động Thổ / Làm Nhà / Sửa Nhà', goodTruc: ['Định', 'Thành', 'Khai', 'Mãn', 'Bình'], keywords: ['động thổ', 'xây dựng', 'khởi công', 'sửa chữa', 'nhập trạch'] },
    cuoihoi: { label: 'Cưới Hỏi / Ăn Hỏi', goodTruc: ['Định', 'Thành', 'Mãn', 'Khai', 'Bình'], keywords: ['cưới', 'hôn', 'giá thú', 'mọi việc'] },
    khaitruong: { label: 'Khai Trương / Mở Hàng / Ký Kết', goodTruc: ['Khai', 'Thành', 'Mãn', 'Định', 'Kiến'], keywords: ['khai trương', 'cầu tài', 'giao dịch', 'mở hàng', 'xuất hành'] },
    nhaptrach: { label: 'Nhập Trạch / Về Nhà Mới', goodTruc: ['Thành', 'Khai', 'Định', 'Mãn'], keywords: ['nhập trạch', 'di chuyển', 'xây dựng', 'an sàng'] },
    xuathanh: { label: 'Xuất Hành / Đi Xa / Mua Xe', goodTruc: ['Khai', 'Thành', 'Kiến', 'Mãn', 'Bình'], keywords: ['xuất hành', 'đi xa', 'nhận chức', 'cầu tài'] },
    cunggio: { label: 'Cúng Giỗ / Tế Tự / Cầu Phúc', goodTruc: ['Mãn', 'Định', 'Thành', 'Khai', 'Chấp', 'Thu'], keywords: ['tế tự', 'cầu phúc', 'cúng', 'mọi việc'] }
  };

  function isDayGoodForPurpose(d, purposeKey) {
    if (purposeKey === 'all') return true;
    const cfg = PURPOSE_CONFIG[purposeKey] || PURPOSE_CONFIG.all;
    const nen = (d.saoInfo?.nenLam || '').toLowerCase();
    const kieng = (d.saoInfo?.kiengCu || '').toLowerCase();
    const truc = d.trucInfo?.name || '';
    const hasBadKeyword = cfg.keywords.some(kw => kieng.includes(kw));
    if (hasBadKeyword) return false;
    const hasGoodKeyword = cfg.keywords.some(kw => nen.includes(kw)) || nen.includes('mọi việc');
    return cfg.goodTruc.includes(truc) || hasGoodKeyword;
  }

  function runTrachCatAnalysis() {
    saveUserState();
    const dateVal = document.getElementById('inputTrachCatDate').value || '2026-11-01';
    const [yy, mm, dd] = dateVal.split('-').map(Number);
    const ownerYear = parseInt(document.getElementById('inputTrachCatOwnerYear').value, 10) || 1990;
    const buildYear = parseInt(document.getElementById('inputBuildYear').value, 10) || yy;

    const ownerSel = document.getElementById('inputTrachCatOwnerYear')?.parentElement?.querySelector('.zodiac-helper-select');
    if (ownerSel) ownerSel.value = String(ownerYear);

    const evalRes = TC.evaluateDayFull(dd, mm, yy, ownerYear);
    const monthScan = TC.scanGoodDaysInMonth(mm, yy, ownerYear);
    const buildCheck = TC.checkAgeForBuilding(ownerYear, buildYear);

    const out = document.getElementById('trachCatResultBox');
    if (!out) return;

    const f = evalRes.full;
    const dowNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const jsDate = new Date(yy, mm - 1, dd);
    const dowStr = dowNames[jsDate.getDay()] || '';
    const purposeCfg = PURPOSE_CONFIG[selectedTrachCatPurpose] || PURPOSE_CONFIG.all;
    const fitsSelectedPurpose = evalRes.taboos.length === 0 && evalRes.score >= 65 && isDayGoodForPurpose(evalRes, selectedTrachCatPurpose);

    const filteredGoodDays = monthScan.goodDays.filter(d => isDayGoodForPurpose(d, selectedTrachCatPurpose));
    const displayDays = filteredGoodDays.length > 0 ? filteredGoodDays : monthScan.goodDays;

    const hdListStr = evalRes.hours12.filter(h => h.hoangDao).map(h => `${h.chi} (${h.timeRange})`).join(' · ');

    out.innerHTML = `
      <!-- TỜ LỊCH BLOC TRUYỀN THỐNG -->
      <div class="card card-highlight">
        <div class="card-header">
          <div>
            <div class="card-title">
              📅 Lịch Vạn Niên — ${dowStr}, ${String(dd).padStart(2,'0')}/${String(mm).padStart(2,'0')}/${yy}
            </div>
            <div class="card-subtitle">
              Gia Chủ: <b>${ownerYear} (${buildCheck.bInfo.canChi} – Mạng ${buildCheck.bInfo.lacVietHanh})</b> · Việc: <b style="color:var(--gold-light);">${purposeCfg.label}</b>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span class="badge ${evalRes.ratingClass}" style="font-size:0.95rem;padding:6px 14px;">
              ${evalRes.ratingLabel} (${evalRes.score}/100)
            </span>
            <button type="button" class="btn-pill" id="btnSpeakTrachCat">🔊 Nghe Đọc</button>
            <button type="button" class="btn-pill" id="btnShareTrachCatZalo" style="border-color:var(--jade-primary);color:var(--jade-light);font-weight:700;">📤 Gửi Zalo</button>
          </div>
        </div>

        <div class="lich-bloc-card">
          <div class="lich-bloc-side">
            <div class="lich-bloc-label">☀️ DƯƠNG LỊCH</div>
            <div class="lich-bloc-big-num">${String(dd).padStart(2, '0')}</div>
            <div class="lich-bloc-sub">${dowStr} · Tháng ${mm} Năm ${yy}</div>
            <div style="font-size:0.84rem;color:var(--text-muted);margin-top:4px;">Tiết khí: <b>${f.solarTerm.name}</b></div>
          </div>
          <div class="lich-bloc-side">
            <div class="lich-bloc-label">🌙 ÂM LỊCH</div>
            <div class="lich-bloc-big-num" style="color:var(--jade-light);">${String(f.lunar.lunarDay).padStart(2, '0')}</div>
            <div class="lich-bloc-sub">Tháng ${f.lunar.lunarMonth}${f.lunar.lunarLeap ? ' (Nhuận)' : ''} · Năm ${f.yearInfo.canChi}</div>
            <div style="font-size:0.84rem;color:var(--gold-light);margin-top:4px;">Ngày <b>${f.day.canChi}</b> (Mạng <b>${f.day.lacVietHanh}</b>) · Tháng <b>${f.month.canChi}</b></div>
          </div>
        </div>

        <div style="padding:12px 16px;border-radius:10px;margin-bottom:14px;background:${fitsSelectedPurpose ? 'rgba(16,185,129,0.14)' : 'rgba(245,158,11,0.14)'};border-left:4px solid ${fitsSelectedPurpose ? 'var(--jade-primary)' : 'var(--amber-warn)'};font-size:0.95rem;">
          ${fitsSelectedPurpose
            ? `✅ <b>THUẬN LỢI (${purposeCfg.label}):</b> Ngày ${dd}/${mm}/${yy} (${f.lunar.lunarDay}/${f.lunar.lunarMonth} ÂL) rất tốt (${evalRes.score}/100 điểm), hợp với tuổi ${buildCheck.bInfo.canChi}.`
            : `⚠️ <b>LƯU Ý (${purposeCfg.label}):</b> Ngày ${dd}/${mm}/${yy} chưa tối ưu. Hãy chọn trong <b>Bảng Ngày Tốt Tháng ${mm}/${yy}</b> bên dưới.`}
        </div>

        <div class="grid-3" style="margin-bottom:14px;">
          <div style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);border-radius:10px;">
            <div style="font-size:0.75rem;color:var(--gold-primary);font-weight:700;">HOÀNG ĐẠO & TRỰC NGÀY</div>
            <div style="font-weight:800;font-size:0.95rem;margin:4px 0;">
              ${evalRes.hoangDaoInfo.name} (${evalRes.hoangDaoInfo.hoangDao ? '🌟 Hoàng Đạo' : '⚫ Hắc Đạo'}) · Trực ${evalRes.trucInfo.name}
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);">${evalRes.trucInfo.desc}</div>
          </div>

          <div style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);border-radius:10px;">
            <div style="font-size:0.75rem;color:var(--gold-primary);font-weight:700;">NHỊ THẬP BÁT TÚ</div>
            <div style="font-weight:800;font-size:0.95rem;margin:4px 0;">
              Sao #${evalRes.saoInfo.id}: ${evalRes.saoInfo.name} (${evalRes.saoInfo.rank})
            </div>
            <div style="font-size:0.78rem;color:var(--jade-light);"><b>Nên làm:</b> ${evalRes.saoInfo.nenLam}</div>
            <div style="font-size:0.78rem;color:#fda4af;margin-top:2px;"><b>Kiêng cữ:</b> ${evalRes.saoInfo.kiengCu}</div>
            ${evalRes.saoInfo.ngoaiLe ? `<div style="font-size:0.76rem;color:var(--gold-light);margin-top:4px;padding-top:4px;border-top:1px dashed rgba(255,255,255,0.1);"><b>⚡ Ngoại lệ:</b> ${evalRes.saoInfo.ngoaiLe}</div>` : ''}
          </div>

          <div style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);border-radius:10px;">
            <div style="font-size:0.75rem;color:var(--gold-primary);font-weight:700;">HƯỚNG XUẤT HÀNH</div>
            <div style="font-size:0.84rem;margin-top:4px;">
              <div>🎉 <b>Hỷ Thần:</b> <span style="color:var(--jade-light);font-weight:700;">${evalRes.huong.hyThan}</span></div>
              <div>💰 <b>Tài Thần:</b> <span style="color:var(--gold-light);font-weight:700;">${evalRes.huong.taiThan}</span></div>
              <div>🦩 <b>Hạc Thần (Xấu):</b> <span style="color:#fda4af;font-weight:700;">${evalRes.huong.hacThan}</span></div>
              <div style="margin-top:6px;font-size:0.78rem;color:${evalRes.huong.conflict ? '#fb7185' : 'var(--text-muted)'};">${evalRes.huong.conflictNote}</div>
            </div>
          </div>
        </div>

        <!-- GIỜ QUÝ NHÂN ĐĂNG THIÊN MÔN -->
        <div style="padding:14px;background:linear-gradient(90deg, rgba(229,184,92,0.16), rgba(16,185,129,0.12));border:1px solid var(--gold-primary);border-radius:10px;margin-bottom:14px;">
          <div style="font-weight:800;color:var(--gold-light);font-size:0.95rem;">
            👑 Giờ Quý Nhân Đăng Thiên Môn
          </div>
          <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px;">
            Nguyệt Tướng: <b>${evalRes.quyNhanHours.nguyetTuong}</b> · Dương Quý: <b>${evalRes.quyNhanHours.duongQuyCung}</b> · Âm Quý: <b>${evalRes.quyNhanHours.amQuyCung}</b> · Kỵ giờ Thọ Tử: <b style="color:#fda4af;">${evalRes.gioThoTu}</b> · Sát Chủ: <b style="color:#fda4af;">${evalRes.gioSatChu}</b>
          </div>
          ${evalRes.quyNhanHours.hours.length === 0
            ? `<div style="font-size:0.85rem;">Hôm nay dùng 6 Giờ Hoàng Đạo bên dưới để khởi sự.</div>`
            : evalRes.quyNhanHours.hours.map(h => `
                <div style="font-size:0.86rem;margin-top:4px;color:var(--text-main);">
                  🌟 <b>${h.type}: Giờ ${h.chi} (${h.timeRange})</b> — ${h.detail}
                </div>
              `).join('')}
        </div>

        <!-- CÁT THẦN & HUNG SÁT -->
        <div class="grid-2" style="margin-bottom:14px;">
          <div style="padding:12px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);border-radius:8px;">
            <div style="font-weight:700;color:var(--jade-light);margin-bottom:6px;">✅ Cát Tinh & Độ Hợp Gia Chủ (${ownerYear}):</div>
            ${evalRes.blessings.length === 0 ? `<div style="font-size:0.82rem;color:var(--text-muted);">Bình hòa.</div>` : evalRes.blessings.map(b => `<div style="font-size:0.83rem;margin-bottom:4px;">• <b>${b.name}:</b> ${b.desc}</div>`).join('')}
            ${evalRes.ownerComparison ? `<div style="margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,0.1);font-size:0.83rem;">👤 <b>Gia Chủ ${evalRes.ownerComparison.ownerInfo.canChi}:</b> ${evalRes.ownerComparison.ownerNote}</div>` : ''}
          </div>

          <div style="padding:12px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.3);border-radius:8px;">
            <div style="font-weight:700;color:#fda4af;margin-bottom:6px;">⚠️ Ngày Kỵ Cần Tránh:</div>
            ${evalRes.taboos.length === 0
              ? `<div style="font-size:0.84rem;color:var(--jade-light);">🎉 Ngày SẠCH: Không phạm Dương Công, Tam Nương, Nguyệt Kỵ, Sát Chủ, Thọ Tử, Vãng Vong, Thập Ác Đại Bại.</div>`
              : evalRes.taboos.map(t => `<div style="font-size:0.83rem;margin-bottom:4px;">• <b style="color:#fb7185;">${t.name}:</b> ${t.desc}</div>`).join('')}
          </div>
        </div>

        <!-- 12 GIỜ TRONG NGÀY -->
        <div>
          <div style="font-weight:700;color:var(--gold-light);font-size:0.88rem;margin-bottom:8px;">🕐 12 Giờ Trong Ngày:</div>
          <div class="grid-4">
            ${evalRes.hours12.map(h => `
              <div style="padding:8px 10px;border-radius:6px;background:${h.hoangDao ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)'};border:1px solid ${h.hoangDao ? 'rgba(16,185,129,0.4)' : 'var(--border-subtle)'};font-size:0.78rem;">
                <div style="font-weight:700;color:${h.hoangDao ? 'var(--jade-light)' : 'var(--text-muted)'};">
                  ${h.hoangDao ? '🌟' : '⚫'} Giờ ${h.chi} (${h.timeRange})
                </div>
                <div>${h.starName} (${h.hoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'})</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- KIỂM TRA TUỔI XÂY NHÀ & THÁNG CƯỚI HỎI -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🏗️ Kiểm Tra Tuổi Xây Nhà & Cưới Hỏi</div>
            <div class="card-subtitle">Kim Lâu · Hoang Ốc · Tam Tai · Tháng Xuất Giá</div>
          </div>
        </div>
        <div style="padding:12px;background:${buildCheck.canBuild ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'};border-left:4px solid ${buildCheck.canBuild ? 'var(--jade-primary)' : 'var(--amber-warn)'};border-radius:8px;margin-bottom:14px;font-size:0.9rem;">
          ${buildCheck.summary}
        </div>
        <div class="grid-4">
          <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:0.83rem;">
            <b style="color:var(--gold-light);">1. Kim Lâu:</b>
            <div style="margin-top:4px;color:${buildCheck.kimLau.pham ? '#fb7185' : '#34d399'};font-weight:700;">${buildCheck.kimLau.type}</div>
            <div style="margin-top:2px;color:var(--text-muted);">${buildCheck.kimLau.desc}</div>
          </div>
          <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:0.83rem;">
            <b style="color:var(--gold-light);">2. Hoang Ốc:</b>
            <div style="margin-top:4px;color:${buildCheck.hoangOc.good ? '#34d399' : '#fb7185'};font-weight:700;">${buildCheck.hoangOc.name}</div>
            <div style="margin-top:2px;color:var(--text-muted);">${buildCheck.hoangOc.desc}</div>
          </div>
          <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:0.83rem;">
            <b style="color:var(--gold-light);">3. Tam Tai:</b>
            <div style="margin-top:4px;color:${buildCheck.tamTai.pham ? '#fb7185' : '#34d399'};font-weight:700;">${buildCheck.tamTai.pham ? 'Phạm Tam Tai' : 'Không phạm Tam Tai'}</div>
            <div style="margin-top:2px;color:var(--text-muted);">${buildCheck.tamTai.desc}</div>
          </div>
          <div style="padding:10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:0.83rem;">
            <b style="color:var(--gold-light);">4. Tháng Cưới Hỏi (Tuổi ${buildCheck.bInfo.chi}):</b>
            <div style="margin-top:4px;color:#34d399;"><b>Đại lợi:</b> ${buildCheck.xuatGia.daiLoi}</div>
            <div style="color:var(--gold-light);"><b>Tiểu lợi:</b> ${buildCheck.xuatGia.tieuLoi}</div>
            <div style="color:var(--text-muted);font-size:0.75rem;">Kỵ Công cô: ${buildCheck.xuatGia.congCo} | Phu chủ: ${buildCheck.xuatGia.phuChu}</div>
          </div>
        </div>
      </div>

      <!-- DANH SÁCH NGÀY TỐT TRONG THÁNG -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🌟 Ngày Tốt Tháng ${mm}/${yy} (${purposeCfg.label})</div>
            <div class="card-subtitle">Gia Chủ ${ownerYear} (${buildCheck.bInfo.canChi}) · Đã lọc sạch các ngày kỵ</div>
          </div>
          <span class="badge badge-good">${displayDays.length} ngày tốt</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Dương Lịch</th>
                <th>Âm Lịch</th>
                <th>Can Chi & Mạng</th>
                <th>Hoàng Đạo / Trực / Sao</th>
                <th>Giờ Tốt</th>
                <th>Hướng Tốt</th>
                <th>Điểm</th>
                <th>Xem</th>
              </tr>
            </thead>
            <tbody>
              ${displayDays.slice(0, 15).map(d => {
                const s = d.full.solar;
                const l = d.full.lunar;
                const qHours = d.quyNhanHours.hours.map(h => `${h.chi} (${h.timeRange})`).join(', ');
                const hdHours = d.hours12.filter(h => h.hoangDao).slice(0, 4).map(h => h.chi).join(', ');
                return `
                  <tr>
                    <td><b>${String(s.day).padStart(2,'0')}/${String(s.month).padStart(2,'0')}/${s.year}</b></td>
                    <td><b>${l.lunarDay}/${l.lunarMonth} ÂL</b></td>
                    <td><b>${d.full.day.canChi}</b> <span class="badge hanh-${d.full.day.lacVietHanh}">${d.full.day.lacVietHanh}</span></td>
                    <td>${d.hoangDaoInfo.name} · Trực ${d.trucInfo.name} · Sao ${d.saoInfo.name}</td>
                    <td style="font-size:0.78rem;">${qHours ? `👑 Quý Nhân: <b>${qHours}</b><br>` : ''}Hoàng đạo: ${hdHours}</td>
                    <td style="font-size:0.78rem;">Hỷ: ${d.huong.hyThan}<br>Tài: ${d.huong.taiThan}</td>
                    <td><span class="badge badge-good">${d.score}/100</span></td>
                    <td>
                      <button type="button" class="btn-secondary btn-pick-date" data-date="${s.year}-${String(s.month).padStart(2,'0')}-${String(s.day).padStart(2,'0')}" style="padding:5px 10px;font-size:0.78rem;">
                        Xem
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('btnSpeakTrachCat')?.addEventListener('click', () => {
      speakVietnamese(`Tờ lịch ngày Dương lịch ${dd} tháng ${mm} năm ${yy}, tức ngày Âm lịch ${f.lunar.lunarDay} tháng ${f.lunar.lunarMonth} năm ${f.yearInfo.canChi}, ngày ${f.day.canChi}, mạng Lạc Việt ${f.day.lacVietHanh}. Đánh giá chung: ${evalRes.ratingLabel}, đạt ${evalRes.score} trên 100 điểm. Giờ Hoàng Đạo trong ngày gồm: ${hdListStr}. ${buildCheck.summary.replace(/<[^>]+>/g, '')}`);
    });

    document.getElementById('btnShareTrachCatZalo')?.addEventListener('click', () => {
      const top3Days = displayDays.slice(0, 5).map(d => `• Dương lịch ${d.full.solar.day}/${d.full.solar.month}/${d.full.solar.year} (${d.full.lunar.lunarDay}/${d.full.lunar.lunarMonth} ÂL - Ngày ${d.full.day.canChi}): ${d.score}/100 điểm`).join('\n');
      const plain = [
        `📅 XEM NGÀY GIỜ TỐT LẠC VIỆT (${purposeCfg.label})`,
        `• Gia chủ: Sinh năm ${ownerYear} (${buildCheck.bInfo.canChi} - Mạng ${buildCheck.bInfo.lacVietHanh})`,
        `• Ngày đang xem: Dương lịch ${dd}/${mm}/${yy} ➔ Âm lịch ${f.lunar.lunarDay}/${f.lunar.lunarMonth} năm ${f.yearInfo.canChi} (Ngày ${f.day.canChi})`,
        `• Đánh giá: ${evalRes.ratingLabel} (${evalRes.score}/100 điểm) · Trực ${evalRes.trucInfo.name} · Sao ${evalRes.saoInfo.name}`,
        `• Giờ Hoàng Đạo: ${hdListStr}`,
        `• Hướng tốt xuất hành: Hỷ Thần ${evalRes.huong.hyThan}, Tài Thần ${evalRes.huong.taiThan}`,
        `🌟 Các ngày đẹp nhất trong tháng ${mm}/${yy} cho việc ${purposeCfg.label}:\n${top3Days}`
      ].join('\n');
      shareOrCopyZalo(`Xem Ngày Tốt Tháng ${mm}/${yy} - Lạc Việt Đạo Quán`, plain);
    });

    out.querySelectorAll('.btn-pick-date').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dt = e.currentTarget.getAttribute('data-date');
        document.getElementById('inputTrachCatDate').value = dt;
        runTrachCatAnalysis();
        window.scrollTo({ top: 180, behavior: 'smooth' });
      });
    });
  }

  // --------------------------------------------------------------------------
  // TAB 3: LÁ SỐ TỬ VI LẠC VIỆT 12 CUNG (ĐỊNH TÍNH & ĐỊNH LƯỢNG)
  // --------------------------------------------------------------------------
  function renderTuViCell(p) {
    const isSelected = selectedPalaceIdx === p.chiIdx;
    return `
      <div class="tuvi-cell ${p.isMenh ? 'is-menh' : ''} ${isSelected ? 'selected' : ''}" data-chi-idx="${p.chiIdx}">
        <div class="cell-top">
          <span style="color:var(--text-muted);font-weight:600;">${p.canChi} (${p.chiHanh})</span>
          <span class="cell-cung-name">${p.cungName} ${p.isThan ? '<span class="badge badge-good" style="font-size:0.62rem;padding:1px 6px;">THÂN</span>' : ''}</span>
          <span style="font-weight:700;color:var(--gold-primary);">ĐV: ${p.daiVan}</span>
        </div>
        <div class="cell-chinh-tinh">
          ${p.chinhTinh.length === 0
            ? `<span style="font-size:0.75rem;color:var(--text-muted);font-style:italic;">Vô Chính Diệu (Mượn Xung Chiếu)</span>`
            : p.chinhTinh.map(s => `<span class="star-chinh">${s.name} (${s.hanh})</span>`).join('')}
        </div>
        <div class="cell-substars">
          <div>
            ${p.catTinh.map(c => `<span class="star-cat">+ ${c}</span>`).join('')}
            <span class="star-cat">• ${p.vongLocTon}</span>
          </div>
          <div>
            ${p.satTinh.map(s => `<span class="star-sat">- ${s}</span>`).join('')}
            <span style="color:#c4b5fd;display:block;">• ${p.vongThaiTue}</span>
            <span style="color:#93c5fd;display:block;">• ${p.vongTuongTinh}</span>
          </div>
        </div>
        <div class="cell-bottom">
          <span>Vòng Tràng Sinh: <b style="color:var(--gold-light);">${p.vongTrangSinh}</b></span>
          <span style="color:var(--gold-primary);font-weight:700;">Bấm dịch nghĩa ➔</span>
        </div>
      </div>
    `;
  }

  function renderSelectedPalaceDetail(chart, chiIdx) {
    const p = chart.palaces[chiIdx];
    const box = document.getElementById('tuViPalaceDetailBox');
    if (!box || !p) return;

    const cr = p.customerReading || {};
    const chinhNames = p.chinhTinh.map(s => `${s.name} (${s.loai} – hành ${s.hanh})`).join(', ') || 'Vô Chính Diệu (Mượn sao chính tinh cung đối diện xung chiếu)';
    const cungGuides = {
      'MỆNH': 'Cung Mệnh quyết định tính cách cốt lõi, thiên tư, khí chất và trục vận mệnh chủ đạo cả đời của bạn.',
      'PHỤ MẪU': 'Phản ánh duyên nghiệp, tình cảm và sự tương tác giữa bạn với Cha Mẹ ruột.',
      'PHÚC ĐỨC': 'Nền tảng âm phúc dòng họ, sự an lạc nội tâm, tuổi thọ và quý nhân che chở vô hình ("Nhất Phúc, Nhị Phận").',
      'ĐIỀN TRẠCH': 'Khả năng tích lũy nhà đất, bất động sản và môi trường cư ngụ — nơi Phong thủy Lạc Việt can thiệp mạnh nhất để gia tăng tài sản!',
      'QUAN LỘC': 'Con đường sự nghiệp, công danh, chức vị, khả năng quản lý và ngành nghề dễ thành công nhất.',
      'NÔ BỘC': 'Mối quan hệ với bạn bè, đồng nghiệp, nhân viên dưới quyền và đối tác hợp tác làm ăn.',
      'THIÊN DI': 'Môi trường hoạt động bên ngoài xã hội, cơ hội đi xa, xuất ngoại và quý nhân giúp đỡ khi ra ngoài.',
      'TẬT ÁCH': 'Thể trạng cơ thể, các bộ phận sức khỏe cần chăm sóc và cách hóa giải bệnh tật, tai ách.',
      'TÀI BẠCH': 'Năng lực kiếm tiền, giữ tiền, nguồn thu nhập chính và độ lớn tài chính.',
      'TỬ TỨC': 'Duyên con cái — Kết hợp với việc chủ động chọn năm sinh Con Út hợp tuổi Cha Mẹ là chìa khóa xoay chuyển gia đạo.',
      'PHU THÊ': 'Duyên nợ hôn nhân, tính cách người bạn đời và bí quyết giữ gìn hạnh phúc vợ chồng.',
      'HUYNH ĐỆ': 'Tình cảm, sự gắn kết và tương trợ giữa anh chị em ruột thịt.'
    };

    box.innerHTML = `
      <div class="card card-highlight">
        <div class="card-header">
          <div>
            <div class="card-title">🔍 Luận Giải Cung ${p.cungName} (${p.canChi})</div>
            <div class="card-subtitle">Đại vận: ${p.daiVan}–${p.daiVan + 9} tuổi · Vòng Tràng Sinh: <b>${p.vongTrangSinh}</b></div>
          </div>
          <span class="badge badge-good">${cr.starHeader || chinhNames}</span>
        </div>

        <div style="font-size:0.9rem;display:flex;flex-direction:column;gap:10px;">
          <div style="padding:12px 14px;background:rgba(229,184,92,0.1);border-left:4px solid var(--gold-primary);border-radius:8px;line-height:1.6;">
            <div style="font-weight:800;color:var(--gold-light);margin-bottom:4px;">📖 Ý Nghĩa Cung ${p.cungName}:</div>
            <div style="color:var(--text-muted);font-size:0.83rem;margin-bottom:6px;"><i>${cungGuides[p.cungName] || ''}</i></div>
            <div>${cr.mainReading || ''}</div>
          </div>

          <div class="grid-2" style="gap:10px;">
            <div style="padding:10px 12px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.28);border-radius:8px;">
              <div style="font-weight:700;color:#6ee7b7;margin-bottom:4px;">✨ Cát Tinh Hội Họp:</div>
              <ul style="margin:0;padding-left:18px;font-size:0.83rem;line-height:1.55;">
                ${(cr.goodNotes || []).map(n => `<li>${n}</li>`).join('')}
              </ul>
            </div>
            <div style="padding:10px 12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.28);border-radius:8px;">
              <div style="font-weight:700;color:#fcd34d;margin-bottom:4px;">⚠️ Lưu Ý & Hóa Giải:</div>
              <ul style="margin:0;padding-left:18px;font-size:0.83rem;line-height:1.55;">
                ${(cr.cautionNotes || []).map(n => `<li>${n}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="margin-top:2px;padding:10px 14px;background:rgba(16,185,129,0.1);border-left:3px solid var(--jade-primary);border-radius:6px;">
            <b style="color:var(--jade-light);">🧭 Lời Khuyên Cải Mệnh:</b>
            <div style="margin-top:4px;font-size:0.84rem;line-height:1.55;">
              Lá số Tử Vi chỉ ra <b>Định Tính</b> (xu hướng sự việc tại cung ${p.cungName}), còn <b>Định Lượng</b> (thành tựu lớn hay nhỏ, hóa giải hạn nặng thành nhẹ) do <b>Phong Thủy Nhà Ở</b> và <b>Tuổi Con Út</b> quyết định. Khi bước vào Đại vận ${p.daiVan}–${p.daiVan + 9} tuổi tại cung ${p.chi} (${p.chiHanh}), nên ưu tiên hướng nhà/bàn làm việc tương sinh với hành <b>${chart.meta.yInfo.lacVietHanh}</b>.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function runTuViGeneration() {
    saveUserState();
    const name = document.getElementById('inputTuViName')?.value || 'Quý Khách';
    const gender = document.getElementById('inputTuViGender')?.value || 'Nam';
    const calType = document.getElementById('selectTuViCalType')?.value || 'solar';
    let dd = parseInt(document.getElementById('inputTuViDay')?.value, 10) || 15;
    let mm = parseInt(document.getElementById('inputTuViMonth')?.value, 10) || 6;
    let yy = parseInt(document.getElementById('inputTuViYear')?.value, 10) || 1990;

    const tvYearSel = document.getElementById('inputTuViYear')?.parentElement?.querySelector('.zodiac-helper-select');
    if (tvYearSel) tvYearSel.value = String(yy);

    if (dd < 1) dd = 1;
    if (dd > 31) dd = 31;
    if (mm < 1) mm = 1;
    if (mm > 12) mm = 12;

    let solarDay = dd;
    let solarMonth = mm;
    let solarYear = yy;

    if (calType === 'lunar' && AL.convertLunar2Solar) {
      const converted = AL.convertLunar2Solar(dd, mm, yy, 0, 7);
      if (converted && converted[0] > 0) {
        solarDay = converted[0];
        solarMonth = converted[1];
        solarYear = converted[2];
      }
    }

    const hourChiIdx = parseInt(document.getElementById('inputTuViHour')?.value, 10) || 6;
    const viewYear = parseInt(document.getElementById('inputTuViViewYear')?.value, 10) || 2026;

    const chart = TV.generateTuViChart({ name, gender, solarDay, solarMonth, solarYear, hourChiIdx, viewYear });
    currentTuViChart = chart;
    selectedPalaceIdx = chart.meta.menhChiIdx;

    const p = chart.palaces;
    const m = chart.meta;

    // Cập nhật dòng đối chiếu Dương lịch <-> Âm lịch ngay dưới ô nhập
    const previewEl = document.getElementById('tuViDatePreviewText');
    if (previewEl) {
      previewEl.innerHTML = calType === 'lunar'
        ? `Bạn đang nhập <b>Âm lịch ${dd}/${mm}/${yy}</b> ➔ Hệ thống tự động quy đổi sang <b>Dương lịch: ${m.solarDateStr}</b> · Năm <b>${m.tuTru.nam}</b>, Tháng <b>${m.tuTru.thang}</b>, Ngày <b>${m.tuTru.ngay}</b>, Giờ <b>${m.tuTru.gio}</b>`
        : `Đang nhập <b>Dương lịch ${m.solarDateStr}</b> ➔ Tương ứng <b>Âm lịch: ${m.lunarDateStr}</b> · Năm <b>${m.tuTru.nam}</b>, Tháng <b>${m.tuTru.thang}</b>, Ngày <b>${m.tuTru.ngay}</b>, Giờ <b>${m.tuTru.gio}</b>`;
    }

    // Bản luận giải tổng hợp 6 mặt cuộc đời
    const lifeSummaryHtml = `
      <div class="card card-highlight">
        <div class="card-header">
          <div>
            <div class="card-title" style="font-size:1.15rem;">
              📜 Luận Giải Tử Vi — ${m.name} (${m.amDuongNamNu} · ${m.tuTru.nam})
            </div>
            <div class="card-subtitle">
              Bản mệnh Lạc Thư: <b>${m.yInfo.lacVietName} (${m.yInfo.lacVietHanh})</b> · Cục: <b>${m.cucLacViet.name}</b>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn-secondary" id="btnSpeakTuViSummary" style="padding:7px 12px;font-size:0.8rem;">
              🔊 Nghe Đọc
            </button>
            <button type="button" class="btn-secondary" id="btnShareTuViZalo" style="padding:7px 12px;font-size:0.8rem;border-color:var(--jade-primary);color:var(--jade-light);font-weight:700;">
              📤 Gửi Zalo
            </button>
          </div>
        </div>

        <div class="grid-2" style="gap:12px;">
          ${(chart.lifeSummary6 || []).map(sec => `
            <div style="padding:14px;background:rgba(255,255,255,0.03);border:1px solid var(--border-gold);border-radius:12px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;">
                  <div style="font-weight:800;font-size:0.96rem;color:var(--gold-light);">${sec.icon} ${sec.title}</div>
                  <span class="badge badge-neutral" style="font-size:0.7rem;">${sec.stars}</span>
                </div>
                <div style="font-size:0.86rem;line-height:1.6;color:var(--text-main);">${sec.content}</div>
              </div>
              <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border-subtle);font-size:0.8rem;color:#6ee7b7;">
                ✨ <b>Điểm nhấn:</b> ${sec.goodPoint}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Thanh chọn nhanh 12 cung
    const quickNavHtml = `
      <div class="card" style="padding:14px 18px;margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
          <div style="font-size:0.86rem;font-weight:700;color:var(--gold-light);">
            👆 Chọn cung để xem chi tiết:
          </div>
          <button type="button" class="btn-pill" id="btnToggleSimpleTuViBoard" style="font-weight:700;">
            ${isSimpleSeniorTuViBoard ? '🔍 Đang Bật: Bàn Cờ Chữ To' : '👓 Bàn Cờ Chữ To'}
          </button>
        </div>
        <div class="palace-quick-nav">
          ${p.map(pal => `
            <button type="button" class="palace-pill-btn ${pal.chiIdx === selectedPalaceIdx ? 'active' : ''}" data-chi-idx="${pal.chiIdx}">
              ${pal.cungName} (${pal.chi}) ${pal.isMenh ? '⭐' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Thứ tự 12 cung trên bàn cờ 4x4 truyền thống:
    // Hàng 1: Tỵ (5), Ngọ (6), Mùi (7), Thân (8)
    // Hàng 2: Thìn (4), [TRUNG CUNG], Dậu (9)
    // Hàng 3: Mão (3),  [TRUNG CUNG], Tuất (10)
    // Hàng 4: Dần (2), Sửu (1), Tý (0), Hợi (11)
    const boardHtml = `
      <div class="tuvi-board ${isSimpleSeniorTuViBoard ? 'senior-simple-board' : ''}" id="tuViMainGridBoard">
        ${renderTuViCell(p[5])}
        ${renderTuViCell(p[6])}
        ${renderTuViCell(p[7])}
        ${renderTuViCell(p[8])}

        ${renderTuViCell(p[4])}
        <div class="tuvi-center">
          <div style="text-align:center;border-bottom:1px solid var(--border-gold);padding-bottom:8px;margin-bottom:10px;">
            <div style="font-size:0.74rem;color:var(--gold-primary);font-weight:700;letter-spacing:1px;">LÁ SỐ TỬ VI LẠC VIỆT</div>
            <div style="font-size:1.15rem;font-weight:900;color:var(--text-main);margin-top:2px;">${m.name} (${m.amDuongNamNu})</div>
          </div>
          <div class="grid-2" style="font-size:0.8rem;gap:8px;">
            <div>
              <div>• <b>Dương lịch:</b> ${m.solarDateStr}</div>
              <div>• <b>Âm lịch:</b> ${m.lunarDateStr}</div>
              <div>• <b>Tứ Trụ:</b> Năm ${m.tuTru.nam} · Tháng ${m.tuTru.thang} · Ngày ${m.tuTru.ngay} · Giờ ${m.tuTru.gio}</div>
              <div>• <b>Mệnh tại:</b> ${m.menhCungChi} · <b>Thân cư:</b> ${m.thanCuName} (${m.thanCungChi})</div>
            </div>
            <div>
              <div>• <b>Mệnh Lạc Thư:</b> <span class="badge hanh-${m.yInfo.lacVietHanh}">${m.yInfo.lacVietHanh}</span> (${m.yInfo.swapped ? 'Hoán vị Thủy–Hỏa' : 'Chính vị'})</div>
              <div style="color:var(--text-muted);font-size:0.74rem;">(Sách Hán: ${m.yInfo.hanName} – ${m.yInfo.hanHanh})</div>
              <div>• <b>Cục Lạc Việt:</b> <b style="color:var(--gold-light);">${m.cucLacViet.name}</b></div>
              <div>• <b>Mệnh – Cục:</b> ${m.menhVsCuc.rel}</div>
              <div>• <b>Năm ${m.viewYear} (${m.viewYInfo.canChi}):</b> ${m.currentLunarAge} tuổi (ĐV: ${m.activeDaiVanPalace.cungName})</div>
            </div>
          </div>
        </div>
        ${renderTuViCell(p[9])}

        ${renderTuViCell(p[3])}
        ${renderTuViCell(p[10])}

        ${renderTuViCell(p[2])}
        ${renderTuViCell(p[1])}
        ${renderTuViCell(p[0])}
        ${renderTuViCell(p[11])}
      </div>
    `;

    const gioPhamHtml = `
      <div class="card" style="margin-top:18px;">
        <div class="card-header">
          <div>
            <div class="card-title">👶 Kiểm Tra Giờ Sinh Trẻ Nhỏ</div>
            <div class="card-subtitle">Kim Xà Thiết Tỏa · Quan Sát · Diêm Vương · Dạ Đề · Tướng Quân</div>
          </div>
        </div>
        ${chart.gioPhamList.length === 0
          ? `<div style="padding:12px;background:rgba(16,185,129,0.12);border-left:4px solid var(--jade-primary);border-radius:8px;font-size:0.9rem;">
              🎉 <b>GIỜ SINH BÌNH AN THUẬN LỢI:</b> Bạn sinh giờ ${m.tuTru.gio} hoàn toàn <b>KHÔNG phạm</b> Kim Xà Thiết Tỏa, Quan Sát, Diêm Vương, Dạ Đề hay Tướng Quân!
            </div>`
          : chart.gioPhamList.map(g => `
              <div style="padding:12px;background:rgba(245,158,11,0.12);border-left:4px solid var(--amber-warn);border-radius:8px;margin-bottom:8px;font-size:0.86rem;">
                <div style="font-weight:700;color:var(--gold-light);">⚠️ Phát hiện: ${g.name}</div>
                <div style="margin-top:3px;">${g.desc}</div>
                <div style="margin-top:4px;color:var(--jade-light);"><b>💡 Phương pháp hóa giải:</b> ${g.hoaGiai}</div>
              </div>
            `).join('')}
      </div>
    `;

    const container = document.getElementById('tuViBoardContainer');
    if (container) {
      container.innerHTML = lifeSummaryHtml + quickNavHtml + `<div id="tuViPalaceDetailBox" style="margin-bottom:16px;"></div>` + boardHtml + gioPhamHtml;
      renderSelectedPalaceDetail(chart, selectedPalaceIdx);

      const selectPalaceFn = (idx) => {
        selectedPalaceIdx = idx;
        container.querySelectorAll('.tuvi-cell').forEach(c => {
          c.classList.toggle('selected', parseInt(c.getAttribute('data-chi-idx'), 10) === idx);
        });
        container.querySelectorAll('.palace-pill-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.getAttribute('data-chi-idx'), 10) === idx);
        });
        renderSelectedPalaceDetail(chart, idx);
      };

      container.querySelectorAll('.tuvi-cell').forEach(cell => {
        cell.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-chi-idx'), 10);
          selectPalaceFn(idx);
          document.getElementById('tuViPalaceDetailBox')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      });

      container.querySelectorAll('.palace-pill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-chi-idx'), 10);
          selectPalaceFn(idx);
        });
      });

      const toggleBoardBtn = document.getElementById('btnToggleSimpleTuViBoard');
      if (toggleBoardBtn) {
        toggleBoardBtn.addEventListener('click', () => {
          isSimpleSeniorTuViBoard = !isSimpleSeniorTuViBoard;
          const boardEl = document.getElementById('tuViMainGridBoard');
          if (boardEl) boardEl.classList.toggle('senior-simple-board', isSimpleSeniorTuViBoard);
          toggleBoardBtn.innerHTML = isSimpleSeniorTuViBoard
            ? '🔍 Đang Bật: Bàn Cờ Chữ To'
            : '👓 Bàn Cờ Chữ To';
        });
      }

      const speakTuViBtn = document.getElementById('btnSpeakTuViSummary');
      if (speakTuViBtn) {
        speakTuViBtn.addEventListener('click', () => {
          const plain = (chart.lifeSummary6 || [])
            .map(s => `${s.title}: ${s.content.replace(/<[^>]+>/g, '')}`)
            .join('. ');
          speakVietnamese(`Bản luận giải Tử Vi Lạc Việt của ${m.name}, tuổi ${m.tuTru.nam}, bản mệnh ${m.yInfo.lacVietName}. ${plain}`);
        });
      }

      const shareTuViBtn = document.getElementById('btnShareTuViZalo');
      if (shareTuViBtn) {
        shareTuViBtn.addEventListener('click', () => {
          const plain = [
            `🌌 BẢN LUẬN GIẢI LÁ SỐ TỬ VI LẠC VIỆT — ${m.name.toUpperCase()} (${m.amDuongNamNu})`,
            `• Ngày sinh Dương lịch: ${m.solarDateStr} (Âm lịch: ${m.lunarDateStr})`,
            `• Tứ Trụ: Năm ${m.tuTru.nam} · Tháng ${m.tuTru.thang} · Ngày ${m.tuTru.ngay} · Giờ ${m.tuTru.gio}`,
            `• Bản mệnh Lạc Thư: ${m.yInfo.lacVietName} (${m.yInfo.lacVietHanh}) · Cục: ${m.cucLacViet.name}`,
            ...(chart.lifeSummary6 || []).map(s => `${s.icon} ${s.title}:\n${s.content.replace(/<[^>]+>/g, ' ')}`)
          ].join('\n\n');
          shareOrCopyZalo(`Lá Số Tử Vi Lạc Việt - ${m.name}`, plain);
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // TAB 4: ĐỊA LÝ PHONG THỦY BÁT TRẠCH – HUYỀN KHÔNG LẠC VIỆT (HÀ ĐỒ PHỐI HẬU THIÊN)
  // --------------------------------------------------------------------------
  function runPhongThuyAnalysis() {
    saveUserState();
    const birthYear = parseInt(document.getElementById('inputPhongThuyYear').value, 10) || 1984;
    const ptSel = document.getElementById('inputPhongThuyYear')?.parentElement?.querySelector('.zodiac-helper-select');
    if (ptSel) ptSel.value = String(birthYear);
    const gender = document.getElementById('inputPhongThuyGender').value || 'Nam';
    const res = TV.calculateBatTrachLacViet(birthYear, gender);

    const out = document.getElementById('phongThuyResultBox');
    if (!out) return;

    out.innerHTML = `
      <div class="card card-highlight">
        <div class="card-header">
          <div>
            <div class="card-title">
              🧭 Phong Thủy Gia Chủ ${res.birthYear} (${res.yInfo.canChi} – ${res.gender})
            </div>
            <div class="card-subtitle">
              Hà Đồ phối Hậu Thiên Lạc Việt & Huyền Không Lưu Niên
            </div>
          </div>
          <span class="badge badge-good" style="font-size:0.92rem;padding:6px 14px;">
            Phi Tinh Số ${res.starNum} — Quái ${res.quaiData.quai}
          </span>
        </div>

        <div class="grid-3" style="margin-bottom:16px;">
          <div style="padding:12px;background:rgba(229,184,92,0.1);border:1px solid var(--border-gold);border-radius:10px;">
            <div style="font-size:0.75rem;color:var(--gold-primary);font-weight:700;">MỆNH TRẠCH CHỦ</div>
            <div style="font-size:1.05rem;font-weight:800;margin:4px 0;">Quái ${res.quaiData.quai}</div>
            <div style="font-size:0.82rem;color:var(--text-muted);">Hành Hà Đồ: <b>${res.quaiData.hanh}</b></div>
            <div style="font-size:0.82rem;color:var(--jade-light);margin-top:2px;">Cửu Tinh: <b>${res.quaiData.cuuTinh}</b></div>
          </div>

          <div style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);border-radius:10px;">
            <div style="font-size:0.75rem;color:var(--gold-primary);font-weight:700;">ĐỐI CHIẾU LẠC VIỆT</div>
            <div style="font-size:0.83rem;margin-top:4px;">
              • Hoán vị cung <b>Tốn (Tây Nam)</b> và <b>Khôn (Đông Nam)</b>; Độ số <b>Ly = 7</b> và <b>Đoài = 9</b>.<br>
              ${(res.starNum === 7 || res.starNum === 9) ? `<span style="color:var(--jade-light);font-weight:700;">⚡ Số phi tinh ${res.starNum} thuộc ${res.quaiData.quai} (Sách Hán: ${res.quaiData.hanQuai}).</span>` : ''}
            </div>
          </div>

          <div style="padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);border-radius:10px;">
            <div style="font-size:0.75rem;color:var(--gold-primary);font-weight:700;">CHỌN TẦNG CHUNG CƯ</div>
            <div style="font-size:0.82rem;margin-top:4px;">
              Gia chủ mạng <b>${res.yInfo.lacVietHanh}</b> hợp các tầng:
              <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">
                ${res.goodFloors.slice(0, 10).map(f => `<span class="badge badge-good">Tầng ${f.floor} (${f.hanh})</span>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- BẢNG 8 HƯỚNG BÁT TRẠCH -->
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Hướng</th>
                <th>Quái Vị</th>
                <th>Du Niên</th>
                <th>Tính Chất</th>
                <th>Ứng Dụng</th>
              </tr>
            </thead>
            <tbody>
              ${res.directions.map(d => `
                <tr>
                  <td><b>${d.dir}</b></td>
                  <td>${d.cungLV}</td>
                  <td><b style="color:${d.good ? '#34d399' : '#fb7185'};">${d.star}</b></td>
                  <td><span class="badge ${d.good ? 'badge-good' : 'badge-warn'}">${d.good ? 'Hướng Cát' : 'Hướng Hung'}</span></td>
                  <td style="font-size:0.82rem;">${d.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // TAB 5: LẠC VIỆT ĐỘN TOÁN & SÂN KHẤU MÔ PHỎNG GIEO QUẺ ĐỘNG
  // (MAI RÙA LỬA THIÊNG · 50 THẺ TRE ĐẠI DIỄN · 3 ĐỒNG XU CỔ · BẤM ĐỘN GIỜ)
  // --------------------------------------------------------------------------
  let currentDivMethod = 'coins'; // 'coins' | 'tortoise' | 'bamboo' | 'time'
  let castedHaos = [];            // Mảng tối đa 6 phần tử (từ Hào 1 -> Hào 6)
  let isAutoCasting = false;
  let lastArenaState = {
    coins: [1, 1, 0], // 1: Ngửa (Dương), 0: Sấp (Âm)
    tortoiseSign: 'Chưa châm lửa — Bấm nút Gieo Hào để hơ lửa Mai Rùa',
    bambooLeft: 24,
    bambooRight: 24,
    bambooResultNum: 7,
    stepDesc: 'Hãy tĩnh tâm nghĩ về việc cần hỏi, sau đó bấm nút Gieo Từng Hào hoặc Tự Động Gieo Đủ 6 Hào.'
  };

  function playCoinClinkSound() {
    [1320, 1680, 1980].forEach((freq, idx) => {
      setTimeout(() => playBronzeBell(freq, 0.32), idx * 90);
    });
  }

  function playTortoiseCrackSound() {
    playBronzeBell(185, 0.45);
    setTimeout(() => playBronzeBell(960, 0.22), 210);
    setTimeout(() => playBronzeBell(620, 0.35), 310);
  }

  function playBambooShakeSound() {
    [360, 440, 390, 480].forEach((freq, idx) => {
      setTimeout(() => playBronzeBell(freq, 0.18), idx * 75);
    });
  }

  function generateSingleHaoByMethod(method, haoNumber) {
    if (method === 'coins') {
      const c1 = Math.random() < 0.5 ? 1 : 0;
      const c2 = Math.random() < 0.5 ? 1 : 0;
      const c3 = Math.random() < 0.5 ? 1 : 0;
      const sumYang = c1 + c2 + c3;
      lastArenaState.coins = [c1, c2, c3];
      // Quy ước Lục Hào Cổ Truyền:
      // 1 Ngửa (Dương) + 2 Sấp (Âm) -> Thiếu Dương (val=1, tĩnh)
      // 2 Ngửa (Dương) + 1 Sấp (Âm) -> Thiếu Âm (val=0, tĩnh)
      // 3 Ngửa -> Lão Dương (val=1, ĐỘNG ○)
      // 3 Sấp  -> Lão Âm (val=0, ĐỘNG ✕)
      let val = 1, isMoving = false, name = '';
      if (sumYang === 1) { val = 1; isMoving = false; name = 'Thiếu Dương (Dương Tĩnh)'; }
      else if (sumYang === 2) { val = 0; isMoving = false; name = 'Thiếu Âm (Âm Tĩnh)'; }
      else if (sumYang === 3) { val = 1; isMoving = true; name = 'Lão Dương (Hào Động ○)'; }
      else { val = 0; isMoving = true; name = 'Lão Âm (Hào Động ✕)'; }
      const detail = `${sumYang} Ngửa · ${3 - sumYang} Sấp`;
      lastArenaState.stepDesc = `Hào ${haoNumber}: Gieo được <b>${detail}</b> ➔ <b>${name}</b>`;
      return { haoIndex: haoNumber, val, isMoving, name, detail };
    }

    if (method === 'tortoise') {
      const r = Math.random();
      let val = 1, isMoving = false, name = '', sign = '';
      if (r < 0.36) {
        val = 1; isMoving = false; name = 'Thiếu Dương'; sign = 'Phương Triệu (Vết nứt thẳng vươn lên)';
      } else if (r < 0.72) {
        val = 0; isMoving = false; name = 'Thiếu Âm'; sign = 'Nghĩa Triệu (Vết nứt tách đôi cân xứng)';
      } else if (r < 0.86) {
        val = 1; isMoving = true; name = 'Lão Dương (Động ○)'; sign = 'Vũ Triệu (Vết nứt rực sáng chuyển biến)';
      } else {
        val = 0; isMoving = true; name = 'Lão Âm (Động ✕)'; sign = 'Túc Triệu (Vết nứt giao thoa biến đổi)';
      }
      lastArenaState.tortoiseSign = `🔥 Hào ${haoNumber}: ${sign}`;
      lastArenaState.stepDesc = `Hào ${haoNumber}: Lửa châm Mai Rùa hiện <b>${sign}</b> ➔ <b>${name}</b>`;
      return { haoIndex: haoNumber, val, isMoving, name, detail: sign.split(' (')[0] };
    }

    // method === 'bamboo' (Đại Diễn 50 thẻ tre -> dùng 49 thẻ chia Tả - Hữu, đếm 4 ra 6, 7, 8, 9)
    const left = 14 + Math.floor(Math.random() * 21);
    const right = 48 - left;
    const r = Math.random();
    let stalkNum = 7, val = 1, isMoving = false, name = '';
    if (r < 0.34) { stalkNum = 7; val = 1; isMoving = false; name = 'Số 7 — Thiếu Dương'; }
    else if (r < 0.76) { stalkNum = 8; val = 0; isMoving = false; name = 'Số 8 — Thiếu Âm'; }
    else if (r < 0.90) { stalkNum = 9; val = 1; isMoving = true; name = 'Số 9 — Lão Dương (Động ○)'; }
    else { stalkNum = 6; val = 0; isMoving = true; name = 'Số 6 — Lão Âm (Động ✕)'; }
    lastArenaState.bambooLeft = left;
    lastArenaState.bambooRight = right;
    lastArenaState.bambooResultNum = stalkNum;
    lastArenaState.stepDesc = `Hào ${haoNumber}: Chia 49 thẻ (Tả ${left} · Hữu ${right}), đếm Tứ Doanh được <b>${name}</b>`;
    return { haoIndex: haoNumber, val, isMoving, name, detail: `Tứ doanh: ${stalkNum}` };
  }

  function renderArenaVisualHtml() {
    if (currentDivMethod === 'coins') {
      const coinsHtml = lastArenaState.coins.map((c, idx) => `
        <div class="ancient-coin ${c === 1 ? 'coin-yang' : 'coin-yin'}" id="simCoin_${idx}">
          <span class="coin-face-label">${c === 1 ? 'THÔNG' : 'ĐÔNG'}</span>
          <span class="coin-bottom-label">${c === 1 ? 'NGỬA' : 'SẤP'}</span>
        </div>
      `).join('');
      return `
        <div style="text-align:center;">
          <div style="font-size:0.82rem;font-weight:800;color:var(--gold-light);letter-spacing:0.5px;">🪙 ĐĨA ĐỒNG LỤC HÀO — 3 ĐỒNG XU CỔ</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Mặt Vàng: Ngửa (Dương) · Mặt Xám: Sấp (Âm)</div>
        </div>
        <div class="coins-plate" id="coinsPlateArena">
          ${coinsHtml}
        </div>
      `;
    }

    if (currentDivMethod === 'tortoise') {
      const count = castedHaos.length;
      const cracks = [
        { d: 'M 95 140 L 95 112 L 72 102', idx: 1 },
        { d: 'M 95 118 L 122 105 L 138 96', idx: 2 },
        { d: 'M 95 100 L 66 84 L 50 74', idx: 3 },
        { d: 'M 95 88 L 126 74 L 142 62', idx: 4 },
        { d: 'M 95 68 L 70 50 L 54 38', idx: 5 },
        { d: 'M 95 52 L 120 36 L 136 26', idx: 6 }
      ];
      return `
        <div style="text-align:center;">
          <div style="font-size:0.82rem;font-weight:800;color:var(--gold-light);">🐢 YẾM RÙA CỬU CUNG LẠC THƯ & LỬA THIÊNG</div>
          <div style="font-size:0.76rem;color:#fbbf24;margin-top:2px;">${lastArenaState.tortoiseSign}</div>
        </div>
        <div class="tortoise-wrap">
          <svg class="tortoise-svg" id="tortoiseSvgArena" viewBox="0 0 190 175">
            <defs>
              <radialGradient id="shellGrad" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stop-color="#b45309" />
                <stop offset="65%" stop-color="#78350f" />
                <stop offset="100%" stop-color="#451a03" />
              </radialGradient>
            </defs>
            <!-- Yếm rùa cổ -->
            <path d="M 95 10 C 142 10, 168 42, 164 88 C 160 136, 134 164, 95 165 C 56 164, 30 136, 26 88 C 22 42, 48 10, 95 10 Z"
                  fill="url(#shellGrad)" stroke="#f59e0b" stroke-width="3" />
            <!-- Đường rãnh Cửu Cung trên yếm rùa -->
            <path d="M 95 14 L 95 160 M 34 62 L 156 62 M 30 112 L 160 112 M 62 22 L 54 152 M 128 22 L 136 152"
                  stroke="rgba(253, 224, 71, 0.28)" stroke-width="1.5" fill="none" />
            <!-- Đốm lửa hồng tâm dưới mai rùa -->
            <circle cx="95" cy="90" r="${count > 0 ? 18 : 10}" fill="rgba(239, 68, 68, 0.38)" />
            <!-- 6 Vết nứt Bốc Phệ tương ứng 6 Hào -->
            ${cracks.map(c => `
              <path d="${c.d}" class="crack-path ${count >= c.idx ? 'revealed' : ''}" />
            `).join('')}
          </svg>
        </div>
      `;
    }

    if (currentDivMethod === 'bamboo') {
      const leftStalks = Array.from({ length: 12 }).map((_, i) => `<div class="bamboo-stalk" style="height:${78 + (i % 4) * 5}px;"></div>`).join('');
      const rightStalks = Array.from({ length: 12 }).map((_, i) => `<div class="bamboo-stalk" style="height:${78 + ((i + 2) % 4) * 5}px;"></div>`).join('');
      return `
        <div style="text-align:center;">
          <div style="font-size:0.82rem;font-weight:800;color:var(--gold-light);">🎋 ĐẠI DIỄN 50 THẺ TRE (DÙNG 49 · TRỪ 1 THÁI CỰC)</div>
          <div style="font-size:0.75rem;color:var(--jade-light);margin-top:2px;">1 Thẻ Thái Cực đặt riêng · Chia 49 thẻ làm 2 bó Tả – Hữu</div>
        </div>
        <div class="bamboo-stage">
          <div class="bamboo-bundles-row" id="bambooRowArena">
            <div style="text-align:center;">
              <div class="bamboo-group">${leftStalks}</div>
              <div style="font-size:0.75rem;font-weight:700;color:var(--gold-light);margin-top:4px;">Bó Tả (Trời): ${lastArenaState.bambooLeft} thẻ</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:18px;">
              <span class="badge badge-good" style="font-size:0.9rem;padding:6px 12px;">Số ${lastArenaState.bambooResultNum}</span>
              <span style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">Tứ Doanh</span>
            </div>
            <div style="text-align:center;">
              <div class="bamboo-group">${rightStalks}</div>
              <div style="font-size:0.75rem;font-weight:700;color:var(--jade-light);margin-top:4px;">Bó Hữu (Đất): ${lastArenaState.bambooRight} thẻ</div>
            </div>
          </div>
        </div>
      `;
    }

    // method === 'time'
    const now = new Date();
    const full = AL.getFullDateCanChi(now.getDate(), now.getMonth() + 1, now.getFullYear(), Math.floor(((now.getHours() + 1) % 24) / 2));
    return `
      <div style="text-align:center;">
        <div style="font-size:0.84rem;font-weight:800;color:var(--gold-light);">⏱️ BẤM ĐỘN THỜI KHẮC ĐỘNG TÂM</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">Lấy Năm – Tháng – Ngày – Giờ Âm Lịch hiện tại</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%;max-width:340px;margin:12px 0;">
        <div style="padding:10px;background:rgba(229,184,92,0.1);border:1px solid var(--border-gold);border-radius:8px;text-align:center;">
          <div style="font-size:0.72rem;color:var(--text-muted);">NĂM & THÁNG ÂM</div>
          <div style="font-weight:800;color:var(--gold-light);">${full.yearInfo.canChi} · Tháng ${full.lunar.lunarMonth}</div>
        </div>
        <div style="padding:10px;background:rgba(16,185,129,0.1);border:1px solid var(--jade-primary);border-radius:8px;text-align:center;">
          <div style="font-size:0.72rem;color:var(--text-muted);">NGÀY & GIỜ ÂM</div>
          <div style="font-weight:800;color:var(--jade-light);">Ngày ${full.lunar.lunarDay} · Giờ ${full.hour.chi}</div>
        </div>
      </div>
    `;
  }

  function renderDivinationStage() {
    const stageBox = document.getElementById('divinationStageBox');
    if (!stageBox) return;

    document.querySelectorAll('#divinationMethodGrid .div-method-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-div-method') === currentDivMethod);
    });

    if (currentDivMethod === 'time') {
      stageBox.innerHTML = `
        <div class="divination-arena" style="min-height:210px;">
          ${renderArenaVisualHtml()}
          <button type="button" class="btn-primary" id="btnInstantTimeCast" style="min-width:240px;">
            ⚡ Bấm Độn Lập Quẻ Ngay Theo Giờ Này
          </button>
        </div>
      `;
      document.getElementById('btnInstantTimeCast')?.addEventListener('click', () => {
        runDonToanCast('time');
      });
      return;
    }

    const nextHaoNum = castedHaos.length + 1;
    const isComplete = castedHaos.length >= 6;

    // Hiển thị 6 tầng Hào từ Hào 6 (trên cùng) xuống Hào 1 (dưới cùng)
    const haoSlotsHtml = [6, 5, 4, 3, 2, 1].map(hIdx => {
      const hObj = castedHaos.find(item => item.haoIndex === hIdx);
      const haoTitle = hIdx === 1 ? 'Hào 1 (Sơ)' : (hIdx === 6 ? 'Hào 6 (Thượng)' : `Hào ${hIdx}`);
      if (!hObj) {
        return `
          <div class="hao-slot">
            <span style="font-weight:700;color:var(--text-muted);min-width:95px;">${haoTitle}</span>
            <span style="font-size:0.76rem;color:var(--text-muted);font-style:italic;">Chưa gieo...</span>
          </div>
        `;
      }
      return `
        <div class="hao-slot filled ${hObj.isMoving ? 'moving-slot' : ''}">
          <span style="font-weight:800;color:${hObj.isMoving ? '#fda4af' : 'var(--gold-light)'};min-width:95px;">
            ${haoTitle} ${hObj.isMoving ? '⚡' : ''}
          </span>
          <div class="hao-bar-preview">
            ${hObj.val === 1
              ? `<div class="hao-bar-yang"></div>`
              : `<div class="hao-bar-yin"></div><div class="hao-bar-yin"></div>`}
          </div>
          <span style="font-size:0.75rem;font-weight:700;color:${hObj.isMoving ? '#fda4af' : 'var(--text-main)'};">
            ${hObj.isMoving ? (hObj.val === 1 ? 'Lão Dương ○' : 'Lão Âm ✕') : (hObj.val === 1 ? 'Dương —' : 'Âm --')}
          </span>
        </div>
      `;
    }).join('');

    stageBox.innerHTML = `
      <div class="divination-stage-grid">
        <div class="divination-arena">
          ${renderArenaVisualHtml()}
          <div style="text-align:center;width:100%;">
            <div style="font-size:0.86rem;color:var(--text-main);margin-bottom:12px;min-height:24px;">
              ${lastArenaState.stepDesc}
            </div>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button type="button" class="btn-primary" id="btnStepCastHao" ${isAutoCasting ? 'disabled' : ''}>
                ${isComplete
                  ? '🔄 Gieo Lại Quẻ Mới (Từ Hào 1)'
                  : `🎲 Tự Tay Gieo Hào ${nextHaoNum}/6`}
              </button>
              <button type="button" class="btn-secondary" id="btnAutoCastAll6" ${isAutoCasting ? 'disabled' : ''} style="border-color:var(--jade-primary);color:var(--jade-light);font-weight:800;">
                ⚡ Tự Động Gieo Đủ 6 Hào
              </button>
            </div>
          </div>
        </div>

        <div class="hao-builder-panel">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <span style="font-weight:800;font-size:0.9rem;color:var(--gold-light);">☯️ Tháp Lập 6 Hào (Từ Dưới Lên)</span>
              <span class="badge ${isComplete ? 'badge-good' : 'badge-neutral'}">Đã gieo: ${castedHaos.length}/6 Hào</span>
            </div>
            ${haoSlotsHtml}
          </div>
          <div style="font-size:0.76rem;color:var(--text-muted);margin-top:6px;text-align:center;">
            💡 Hào có dấu <b>○ / ✕ (⚡)</b> là <b>Hào Động</b> biến sang Quẻ Biến.
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnStepCastHao')?.addEventListener('click', () => {
      if (isAutoCasting) return;
      if (castedHaos.length >= 6) {
        castedHaos = [];
      }
      performAnimatedSingleStep();
    });

    document.getElementById('btnAutoCastAll6')?.addEventListener('click', () => {
      if (isAutoCasting) return;
      castedHaos = [];
      isAutoCasting = true;
      const runNext = (step) => {
        if (step > 6) {
          isAutoCasting = false;
          renderDivinationStage();
          return;
        }
        performAnimatedSingleStep(() => {
          setTimeout(() => runNext(step + 1), 360);
        });
      };
      runNext(1);
    });
  }

  function performAnimatedSingleStep(onDoneCallback = null) {
    const nextIdx = castedHaos.length + 1;
    if (nextIdx > 6) return;

    // Phát âm thanh & kích hoạt CSS animation trên sân khấu
    if (currentDivMethod === 'coins') {
      playCoinClinkSound();
      document.querySelectorAll('.ancient-coin').forEach(c => c.classList.add('tossing'));
    } else if (currentDivMethod === 'tortoise') {
      playTortoiseCrackSound();
      document.getElementById('tortoiseSvgArena')?.classList.add('heating');
    } else if (currentDivMethod === 'bamboo') {
      playBambooShakeSound();
      document.getElementById('bambooRowArena')?.classList.add('shuffling');
    }

    setTimeout(() => {
      const hRes = generateSingleHaoByMethod(currentDivMethod, nextIdx);
      castedHaos.push(hRes);
      renderDivinationStage();

      if (castedHaos.length === 6) {
        // Khi đủ 6 hào -> Lập quẻ Chủ - Hỗ - Biến từ đúng 6 hào vừa gieo
        const customLines6 = castedHaos.map(h => h.val);
        const movingList = castedHaos.filter(h => h.isMoving);
        const customHaoDong = movingList.length > 0
          ? movingList[movingList.length - 1].haoIndex
          : null;
        runDonToanCast(currentDivMethod, customLines6, customHaoDong);
      }

      if (onDoneCallback) onDoneCallback();
    }, 450);
  }

  function renderHexagramLines(lines6, movingLine = null) {
    return `
      <div class="hexagram-box">
        ${lines6.map((val, idx) => {
          const isMoving = movingLine === idx + 1;
          return `
            <div class="hex-line ${isMoving ? 'moving' : ''}" title="Hào ${idx + 1}${isMoving ? ' (Hào Động)' : ''}">
              ${val === 1
                ? `<div class="hex-yang"></div>`
                : `<div class="hex-yin-part"></div><div class="hex-yin-part"></div>`}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function runDonToanCast(method = 'time', customLines6 = null, customHaoDong = null) {
    playBronzeBell(639, 0.9);
    const question = document.getElementById('inputDonToanQuestion').value || 'Hỏi việc khởi sự, cầu tài lộc và gia đạo';
    const methodLabels = {
      coins: 'Gieo 3 Đồng Xu Cổ (Lục Hào)',
      tortoise: 'Bốc Phệ Mai Rùa Lửa Thiêng',
      bamboo: 'Rút 50 Thẻ Tre Đại Diễn',
      time: 'Bấm Độn Theo Thời Khắc'
    };

    const res = TV.castLacVietDonToan({
      question,
      method,
      customLines6,
      customHaoDong
    });
    const out = document.getElementById('donToanResultBox');
    if (!out) return;

    out.innerHTML = `
      <div class="card card-highlight">
        <div class="card-header">
          <div>
            <div class="card-title">☯️ Kết Quả Quẻ Dịch (${methodLabels[method] || 'Lạc Việt Độn Toán'})</div>
            <div class="card-subtitle">${res.question} · ${res.timestampStr} · Động hào <b>${res.haoDong}</b></div>
          </div>
          <span class="badge badge-good">Thể: ${res.theQuai.name} (${res.theHanh}) ↔ Dụng: ${res.dungQuai.name} (${res.dungHanh})</span>
        </div>

        <div class="grid-3" style="text-align:center;margin-bottom:16px;">
          <div style="padding:14px;background:rgba(255,255,255,0.03);border:1px solid var(--border-gold);border-radius:12px;">
            <div style="font-size:0.75rem;color:var(--gold-primary);font-weight:700;">1. QUẺ CHỦ</div>
            <div style="font-weight:800;font-size:0.96rem;margin:6px 0;color:var(--text-main);">${res.queChuName}</div>
            ${renderHexagramLines(res.lines6, res.haoDong)}
            <div style="font-size:0.78rem;color:var(--text-muted);">Thượng: ${res.quaiThuong.symbol} ${res.quaiThuong.name} | Hạ: ${res.quaiHa.symbol} ${res.quaiHa.name}</div>
          </div>

          <div style="padding:14px;background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);border-radius:12px;">
            <div style="font-size:0.75rem;color:var(--gold-primary);font-weight:700;">2. QUẺ HỖ</div>
            <div style="font-weight:800;font-size:0.96rem;margin:6px 0;color:var(--text-main);">${res.queHoName}</div>
            <div style="padding:22px 10px;font-size:0.82rem;color:var(--text-muted);">
              Diễn biến trung gian của sự việc.
            </div>
          </div>

          <div style="padding:14px;background:rgba(255,255,255,0.03);border:1px solid var(--jade-primary);border-radius:12px;">
            <div style="font-size:0.75rem;color:var(--jade-light);font-weight:700;">3. QUẺ BIẾN</div>
            <div style="font-weight:800;font-size:0.96rem;margin:6px 0;color:var(--text-main);">${res.queBienName}</div>
            ${renderHexagramLines(res.linesBien, null)}
            <div style="font-size:0.78rem;color:var(--text-muted);">Động hào ${res.haoDong} ➔ Hành ${res.bienHanh}</div>
          </div>
        </div>

        <div style="padding:14px;background:rgba(16,185,129,0.12);border-left:4px solid var(--jade-primary);border-radius:8px;font-size:0.92rem;">
          <div style="font-weight:700;color:var(--jade-light);margin-bottom:4px;">📜 Luận Đoán Quẻ:</div>
          <div>${res.conclusion}</div>
          <div style="margin-top:6px;font-size:0.82rem;color:var(--text-muted);">
            • <b>Quẻ Thể:</b> ${res.theQuai.name} (${res.theQuai.nature}) — Hành ${res.theHanh}<br>
            • <b>Quẻ Dụng:</b> ${res.dungQuai.name} (${res.dungQuai.nature}) — Hành ${res.dungHanh} (${res.theVsDung.desc})
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // TAB 6: TÀNG KINH CÁC (TRA CỨU KHO TÀI LIỆU LÝ HỌC LẠC VIỆT)
  // --------------------------------------------------------------------------
  function renderTangKinhCac(filterAuthor = 'all', searchKw = '') {
    const list = window.LYHOC_TANGKINHCAC || [];
    const container = document.getElementById('tangKinhCacGrid');
    if (!container) return;

    const kw = searchKw.trim().toLowerCase();
    const filtered = list.filter(item => {
      const matchAuthor = filterAuthor === 'all' || item.filterKey === filterAuthor;
      const matchKw = !kw || `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(kw);
      return matchAuthor && matchKw;
    });

    container.innerHTML = filtered.map(doc => `
      <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;margin-bottom:0;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:8px;">
            <span class="badge badge-neutral">${doc.category}</span>
            <span style="font-size:0.74rem;color:var(--gold-primary);font-weight:600;">${doc.author}</span>
          </div>
          <div style="font-weight:800;font-size:1rem;color:var(--text-main);margin-bottom:8px;">${doc.title}</div>
          <div style="font-size:0.84rem;color:var(--text-muted);margin-bottom:14px;">${doc.summary}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--border-subtle);">
          <span style="font-size:0.74rem;color:var(--text-muted);">${doc.role}</span>
          <button type="button" class="btn-primary btn-read-doc" data-id="${doc.id}" style="padding:7px 14px;font-size:0.8rem;">
            📖 Đọc Toàn Văn
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-read-doc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openDocModal(id);
      });
    });
  }

  function applyModalDocFontSize() {
    const bodyEl = document.getElementById('modalDocBody');
    const btnEl = document.getElementById('btnModalFontSize');
    if (!bodyEl) return;
    if (modalDocFontStep === 0) {
      bodyEl.style.fontSize = '0.96rem';
      bodyEl.style.lineHeight = '1.75';
      if (btnEl) btnEl.textContent = '🔍 Cỡ chữ: Thường';
    } else if (modalDocFontStep === 1) {
      bodyEl.style.fontSize = '1.15rem';
      bodyEl.style.lineHeight = '1.9';
      if (btnEl) btnEl.textContent = '🔍 Cỡ chữ: Lớn';
    } else {
      bodyEl.style.fontSize = '1.36rem';
      bodyEl.style.lineHeight = '2.0';
      if (btnEl) btnEl.textContent = '🔍 Cỡ chữ: Rất Lớn';
    }
  }

  function openDocModal(docId) {
    const list = window.LYHOC_TANGKINHCAC || [];
    const doc = list.find(d => d.id === docId);
    if (!doc) return;
    playBronzeBell(528, 0.6);
    const modal = document.getElementById('docReaderModal');
    document.getElementById('modalDocTitle').textContent = doc.title;
    document.getElementById('modalDocMeta').textContent = `${doc.author} · Chuyên mục: ${doc.category}`;
    document.getElementById('modalDocBody').textContent = doc.content;
    applyModalDocFontSize();
    modal.classList.add('open');

    const speakDocBtn = document.getElementById('btnSpeakModalDoc');
    if (speakDocBtn) {
      speakDocBtn.onclick = () => speakVietnamese(`${doc.title}. ${doc.summary}. ${doc.content}`);
    }
  }

  // --------------------------------------------------------------------------
  // KHỞI ĐỘNG ỨNG DỤNG
  // --------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    // 0. Khôi phục Hồ sơ Gia đình & Cài đặt Cỡ chữ / Nền sáng của Người lớn tuổi
    loadUserState();

    let fontStep = parseInt(localStorage.getItem('ptlv_font_step') || '0', 10);
    const btnFont = document.getElementById('btnCycleFontSize');
    const applyFontStep = () => {
      document.documentElement.classList.remove('font-lg', 'font-xl');
      if (fontStep === 1) {
        document.documentElement.classList.add('font-lg');
        if (btnFont) btnFont.innerHTML = '🔍 Cỡ chữ: Lớn';
      } else if (fontStep === 2) {
        document.documentElement.classList.add('font-xl');
        if (btnFont) btnFont.innerHTML = '🔍 Cỡ chữ: Rất Lớn';
      } else {
        if (btnFont) btnFont.innerHTML = '🔍 Cỡ chữ: Thường';
      }
      try { localStorage.setItem('ptlv_font_step', String(fontStep)); } catch (e) {}
    };
    applyFontStep();
    if (btnFont) {
      btnFont.addEventListener('click', () => {
        fontStep = (fontStep + 1) % 3;
        applyFontStep();
        showSeniorToast(fontStep === 0 ? 'Đã chuyển về Cỡ chữ Thường' : (fontStep === 1 ? '🔍 Đã bật Chữ Lớn (A+) dễ đọc!' : '🔍 Đã bật Chữ Rất Lớn (A++) cho người lớn tuổi!'));
      });
    }

    let isLightTheme = localStorage.getItem('ptlv_theme_light') === '1';
    const btnTheme = document.getElementById('btnToggleLightTheme');
    const applyThemeMode = () => {
      document.body.classList.toggle('theme-light', isLightTheme);
      if (btnTheme) {
        btnTheme.innerHTML = isLightTheme ? '🌙 Nền Tối' : '☀️ Nền Sáng';
      }
      try { localStorage.setItem('ptlv_theme_light', isLightTheme ? '1' : '0'); } catch (e) {}
    };
    applyThemeMode();
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        isLightTheme = !isLightTheme;
        applyThemeMode();
        showSeniorToast(isLightTheme ? '☀️ Đã bật Chế độ Nền Sáng (Giấy Dó truyền thống dịu mắt)!' : '🌙 Đã chuyển về Chế độ Nền Tối!');
      });
    }

    // Thanh điều khiển Giọng đọc nổi (Floating TTS Bar)
    document.getElementById('btnTtsSpeed')?.addEventListener('click', (e) => {
      if (ttsSpeedRate === 0.9) {
        ttsSpeedRate = 0.78;
        e.currentTarget.innerHTML = '🐢 Tốc độ: Rất Chậm (0.78x)';
      } else if (ttsSpeedRate === 0.78) {
        ttsSpeedRate = 1.05;
        e.currentTarget.innerHTML = '🚶 Tốc độ: Bình Thường (1.05x)';
      } else {
        ttsSpeedRate = 0.9;
        e.currentTarget.innerHTML = '🐢 Tốc độ: Chậm Rõ (0.9x)';
      }
      if (lastSpokenText && window.speechSynthesis && window.speechSynthesis.speaking) {
        speakVietnamese(lastSpokenText);
      }
    });
    document.getElementById('btnTtsPauseResume')?.addEventListener('click', (e) => {
      if (!window.speechSynthesis) return;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        e.currentTarget.innerHTML = '⏸️ Tạm Dừng';
      } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        e.currentTarget.innerHTML = '▶️ Đọc Tiếp';
      }
    });
    document.getElementById('btnTtsStop')?.addEventListener('click', () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      document.getElementById('ttsFloatingBar')?.classList.remove('active');
    });

    // 1. Gán sự kiện chuyển Tab
    document.querySelectorAll('.tab-btn, .dock-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (tabId) switchTab(tabId);
      });
    });

    // 2. Nút Âm thanh Thiền Đông Sơn
    const btnAudio = document.getElementById('btnAmbientAudio');
    if (btnAudio) btnAudio.addEventListener('click', toggleAmbientSound);

    // 3. Gắn danh sách Chọn nhanh Tuổi Con Giáp (Can Chi) vào tất cả các ô nhập Năm sinh
    attachZodiacSelectToYearInput('inputFatherYear', 1935, 2015, runLuanTuoiAnalysis);
    attachZodiacSelectToYearInput('inputMotherYear', 1935, 2015, runLuanTuoiAnalysis);
    attachZodiacSelectToYearInput('inputTrachCatOwnerYear', 1935, 2015, runTrachCatAnalysis);
    attachZodiacSelectToYearInput('inputTuViYear', 1935, 2030, runTuViGeneration);
    attachZodiacSelectToYearInput('inputPhongThuyYear', 1935, 2015, runPhongThuyAnalysis);

    // 4. Khởi tạo Tab 1: Luận Tuổi Lạc Việt
    renderChildrenInputs();
    runLuanTuoiAnalysis();
    render60HoaGiapTable('');

    document.getElementById('btnModeCoupleOnly')?.addEventListener('click', () => {
      playBronzeBell(528, 0.5);
      currentLuanTuoiMode = 'couple';
      currentChildrenYears = [];
      renderChildrenInputs();
      runLuanTuoiAnalysis();
      document.getElementById('luanTuoiResultBox')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('btnModeWithChildren')?.addEventListener('click', () => {
      playBronzeBell(528, 0.5);
      currentLuanTuoiMode = 'children';
      if (currentChildrenYears.length === 0) currentChildrenYears = [2026];
      renderChildrenInputs();
      runLuanTuoiAnalysis();
    });
    document.getElementById('btnModeFindBabyYear')?.addEventListener('click', () => {
      playBronzeBell(528, 0.5);
      currentLuanTuoiMode = 'findBaby';
      renderChildrenInputs();
      runLuanTuoiAnalysis();
      document.getElementById('babyYearsTableCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('btnAddChild')?.addEventListener('click', () => {
      currentLuanTuoiMode = 'children';
      currentChildrenYears.push(2026);
      renderChildrenInputs();
      runLuanTuoiAnalysis();
    });
    document.getElementById('btnClearChildren')?.addEventListener('click', () => {
      currentLuanTuoiMode = 'couple';
      currentChildrenYears = [];
      renderChildrenInputs();
      runLuanTuoiAnalysis();
    });
    document.getElementById('btnRunLuanTuoi')?.addEventListener('click', () => {
      playBronzeBell(528, 0.7);
      runLuanTuoiAnalysis();
    });
    document.getElementById('inputFatherYear')?.addEventListener('change', runLuanTuoiAnalysis);
    document.getElementById('inputMotherYear')?.addEventListener('change', runLuanTuoiAnalysis);
    document.getElementById('inputFilter60HoaGiap')?.addEventListener('input', (e) => {
      render60HoaGiapTable(e.target.value);
    });

    // Các nút mẫu gia đình thực chứng nhanh
    document.querySelectorAll('.btn-preset-family').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = parseInt(btn.getAttribute('data-f'), 10);
        const m = parseInt(btn.getAttribute('data-m'), 10);
        const cStr = btn.getAttribute('data-c') || '';
        document.getElementById('inputFatherYear').value = f;
        document.getElementById('inputMotherYear').value = m;
        currentChildrenYears = cStr ? cStr.split(',').map(Number) : [];
        currentLuanTuoiMode = currentChildrenYears.length === 0 ? 'couple' : 'children';
        renderChildrenInputs();
        runLuanTuoiAnalysis();
      });
    });

    // 5. Khởi tạo Tab 2: Chọn Ngày Giờ Tốt Lạc Việt
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateInput = document.getElementById('inputTrachCatDate');
    if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
    runTrachCatAnalysis();

    const shiftTrachCatDate = (deltaDays) => {
      if (!dateInput) return;
      const parts = (dateInput.value || `${yyyy}-${mm}-${dd}`).split('-').map(Number);
      const dt = new Date(parts[0], parts[1] - 1, parts[2]);
      dt.setDate(dt.getDate() + deltaDays);
      const ny = dt.getFullYear();
      const nm = String(dt.getMonth() + 1).padStart(2, '0');
      const nd = String(dt.getDate()).padStart(2, '0');
      dateInput.value = `${ny}-${nm}-${nd}`;
      runTrachCatAnalysis();
    };
    document.getElementById('btnTrachCatPrevDay')?.addEventListener('click', () => shiftTrachCatDate(-1));
    document.getElementById('btnTrachCatNextDay')?.addEventListener('click', () => shiftTrachCatDate(1));
    document.getElementById('btnTrachCatToday')?.addEventListener('click', () => {
      if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
      runTrachCatAnalysis();
    });

    document.querySelectorAll('#trachCatPurposeBar .purpose-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedTrachCatPurpose = e.currentTarget.getAttribute('data-purpose') || 'all';
        document.querySelectorAll('#trachCatPurposeBar .purpose-pill').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        runTrachCatAnalysis();
      });
    });

    document.getElementById('btnRunTrachCat')?.addEventListener('click', () => {
      playBronzeBell(528, 0.7);
      runTrachCatAnalysis();
    });
    document.getElementById('inputTrachCatDate')?.addEventListener('change', runTrachCatAnalysis);
    document.getElementById('inputTrachCatOwnerYear')?.addEventListener('change', runTrachCatAnalysis);
    document.getElementById('inputBuildYear')?.addEventListener('change', runTrachCatAnalysis);

    // 6. Khởi tạo Tab 3: Lá Số Tử Vi Lạc Việt
    runTuViGeneration();
    document.getElementById('btnRunTuVi')?.addEventListener('click', () => {
      playBronzeBell(528, 0.8);
      runTuViGeneration();
    });
    ['selectTuViCalType', 'inputTuViDay', 'inputTuViMonth', 'inputTuViYear', 'inputTuViHour', 'inputTuViViewYear', 'inputTuViGender'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', runTuViGeneration);
    });

    // 7. Khởi tạo Tab 4: Phong Thủy Bát Trạch & Huyền Không Lạc Việt
    runPhongThuyAnalysis();
    document.getElementById('btnRunPhongThuy')?.addEventListener('click', () => {
      playBronzeBell(528, 0.7);
      runPhongThuyAnalysis();
    });
    document.getElementById('inputPhongThuyYear')?.addEventListener('change', runPhongThuyAnalysis);
    document.getElementById('inputPhongThuyGender')?.addEventListener('change', runPhongThuyAnalysis);

    // 8. Khởi tạo Tab 5: Gieo Quẻ Dịch & Lạc Việt Độn Toán (Mô phỏng Mai Rùa, Thẻ Tre, 3 Đồng Xu)
    renderDivinationStage();
    runDonToanCast('coins');
    document.querySelectorAll('#divinationMethodGrid .div-method-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const m = e.currentTarget.getAttribute('data-div-method') || 'coins';
        currentDivMethod = m;
        castedHaos = [];
        isAutoCasting = false;
        if (m === 'coins') {
          playCoinClinkSound();
          lastArenaState.stepDesc = 'Đã chọn <b>Gieo 3 Đồng Xu Cổ</b>: Bấm nút bên dưới để tung đồng xu lập từng hào.';
        } else if (m === 'tortoise') {
          playTortoiseCrackSound();
          lastArenaState.stepDesc = 'Đã chọn <b>Bốc Phệ Mai Rùa</b>: Bấm nút bên dưới để châm lửa xem vết nứt từng hào.';
        } else if (m === 'bamboo') {
          playBambooShakeSound();
          lastArenaState.stepDesc = 'Đã chọn <b>Rút 50 Thẻ Tre Đại Diễn</b>: Bấm nút bên dưới để chia thẻ lập từng hào.';
        } else {
          playBronzeBell(528, 0.5);
          runDonToanCast('time');
        }
        renderDivinationStage();
      });
    });

    // 9. Khởi tạo Tab 6: Tàng Kinh Các
    renderTangKinhCac('all', '');
    document.getElementById('selectAuthorFilter')?.addEventListener('change', (e) => {
      const kw = document.getElementById('inputSearchTangKinh')?.value || '';
      renderTangKinhCac(e.target.value, kw);
    });
    document.getElementById('inputSearchTangKinh')?.addEventListener('input', (e) => {
      const author = document.getElementById('selectAuthorFilter')?.value || 'all';
      renderTangKinhCac(author, e.target.value);
    });
    document.getElementById('btnModalFontSize')?.addEventListener('click', () => {
      modalDocFontStep = (modalDocFontStep + 1) % 3;
      applyModalDocFontSize();
    });

    // Đóng Modal đọc tài liệu
    document.getElementById('btnCloseDocModal')?.addEventListener('click', () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
      document.getElementById('ttsFloatingBar')?.classList.remove('active');
      document.getElementById('docReaderModal')?.classList.remove('open');
    });
    document.getElementById('docReaderModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'docReaderModal') {
        window.speechSynthesis && window.speechSynthesis.cancel();
        document.getElementById('ttsFloatingBar')?.classList.remove('active');
        e.target.classList.remove('open');
      }
    });
  });
})();
