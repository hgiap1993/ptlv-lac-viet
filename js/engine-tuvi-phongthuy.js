// ============================================================================
// ENGINE 4: LÁ SỐ TỬ VI LẠC VIỆT 12 CUNG, BÁT TRẠCH HÀ ĐỒ HẬU THIÊN LẠC VIỆT & ĐỘN TOÁN
// Cơ sở lý thuyết: Đại Sư Phụ Thiên Sứ Nguyễn Vũ Tuấn Anh, Sư Huynh Hoàng Triệu Hải & Thiên Luân
// ============================================================================

(function () {
  const AL = window.LacVietAmLich;

  const CUNG_12_NAMES = [
    'MỆNH', 'PHỤ MẪU', 'PHÚC ĐỨC', 'ĐIỀN TRẠCH', 'QUAN LỘC', 'NÔ BỘC',
    'THIÊN DI', 'TẬT ÁCH', 'TÀI BẠCH', 'TỬ TỨC', 'PHU THÊ', 'HUYNH ĐỆ'
  ];

  // Kiểm tra 5 Giờ Phạm Trẻ Sơ Sinh (Chuyên đề 4 Phần A TaiLieuLyHoc.md dòng 7986-8087)
  function check5GioPhamTreEm(yearChiIdx, lunarMonth, lunarDay, hourChiIdx, gender = 'Nam') {
    const results = [];

    // 1. Giờ Kim Xà Thiết Tỏa (dòng 7991-8010 TaiLieuLyHoc.md):
    // Khởi cung Tuất (10) là năm Tý (0), đếm xuôi đến năm sinh:
    const posYear = (10 + yearChiIdx) % 12;
    // Từ cung ấy khởi tháng 1 tính ngược đến tháng sinh:
    const posMonth = (posYear - (lunarMonth - 1) + 12) % 12;
    // Từ cung ấy khởi ngày mồng 1 tính xuôi đến ngày sinh:
    const posDay = (posMonth + (lunarDay - 1)) % 12;
    // Từ cung ấy khởi giờ Tý tính ngược đến giờ sinh:
    const posHour = (posDay - hourChiIdx + 12) % 12;
    const cungKimXa = AL.CHI[posHour];
    const isBoyKimXa = (gender === 'Nam' && (cungKimXa === 'Thìn' || cungKimXa === 'Tuất'));
    const isGirlKimXa = (gender === 'Nữ' && (cungKimXa === 'Sửu' || cungKimXa === 'Mùi'));
    if (isBoyKimXa || isGirlKimXa) {
      results.push({
        name: 'Giờ Kim Xà Thiết Tỏa',
        pham: true,
        cungRoi: cungKimXa,
        desc: `Bấm độn từ cung Tuất dừng tại cung ${cungKimXa} (${gender} kỵ ${gender === 'Nam' ? 'Thìn – Tuất' : 'Sửu – Mùi'}). Trẻ nhỏ thường khó nuôi hoặc hay đau yếu nếu bản mệnh bị cha/mẹ khắc.`,
        hoaGiai: 'Hóa giải cổ truyền (Diễn đàn Lý Học Đông Phương): Làm lễ Bán khoán cửa Đức Thánh Trần / Chùa hoặc dùng phép Tam Y hóa giải, kết hợp điều chỉnh phong thủy phòng ngủ của bé.'
      });
    }

    // 2. Giờ Quan Sát (dòng 8011-8042 TaiLieuLyHoc.md):
    const QUAN_SAT_MAP = {
      1: 'Tỵ', 2: 'Thìn', 3: 'Mão', 4: 'Dần', 5: 'Sửu', 6: 'Tý',
      7: 'Hợi', 8: 'Tuất', 9: 'Dậu', 10: 'Thân', 11: 'Mùi', 12: 'Ngọ'
    };
    const hChi = AL.CHI[hourChiIdx];
    if (QUAN_SAT_MAP[lunarMonth] === hChi) {
      results.push({
        name: 'Giờ Quan Sát',
        pham: true,
        desc: `Sinh tháng ${lunarMonth} ÂL vào giờ ${hChi} phạm Giờ Quan Sát — Chức năng gan dễ nhạy cảm, khi lớn tính khí bướng bỉnh, hiếu động mạnh.`,
        hoaGiai: 'Hóa giải: Bán khoán và rèn luyện tâm tính bằng giáo dục nhân văn (Ngũ Giáo), giữ môi trường sống ôn hòa.'
      });
    }

    // 3. Giờ Diêm Vương (dòng 8043-8056 TaiLieuLyHoc.md):
    const season = Math.floor(((lunarMonth - 1) % 12) / 3); // 0=Xuân(1,2,3), 1=Hạ(4,5,6), 2=Thu(7,8,9), 3=Đông(10,11,12)
    const DIEM_VUONG_MAP = [['Sửu', 'Mùi'], ['Thìn', 'Tuất'], ['Tý', 'Ngọ'], ['Mão', 'Dậu']];
    if (DIEM_VUONG_MAP[season].includes(hChi)) {
      results.push({
        name: 'Giờ Diêm Vương',
        pham: true,
        desc: `Sinh mùa ${['Xuân', 'Hạ', 'Thu', 'Đông'][season]} giờ ${hChi} phạm Giờ Diêm Vương — Trẻ nhỏ ban đêm dễ giật mình, hốt hoảng, thần kinh nhạy cảm.`,
        hoaGiai: 'Hóa giải: Giữ ánh sáng ấm áp, tránh treo tranh ảnh hình thù kỳ dị trong phòng ngủ của trẻ, điều khí phòng ngủ theo Bát Trạch Lạc Việt.'
      });
    }

    // 4. Giờ Dạ Đề (dòng 8057-8072 TaiLieuLyHoc.md):
    const DA_DE_MAP = ['Ngọ', 'Dậu', 'Tý', 'Mão'];
    if (DA_DE_MAP[season] === hChi) {
      results.push({
        name: 'Giờ Dạ Đề',
        pham: true,
        desc: `Sinh mùa ${['Xuân', 'Hạ', 'Thu', 'Đông'][season]} giờ ${hChi} phạm Giờ Dạ Đề — Trẻ nhỏ ban đêm dễ trằn trọc quấy khóc.`,
        hoaGiai: 'Hóa giải: Điều hòa nhiệt độ & lưu thông khí phòng ngủ; theo mẹo dân gian cổ trong tài liệu dùng thuyền thoái (xác ve) sao giòn hoặc giữ ấm vùng bụng/bàn chân cho trẻ.'
      });
    }

    // 5. Giờ Tướng Quân (dòng 8073-8086 TaiLieuLyHoc.md):
    const TUONG_QUAN_MAP = [
      ['Thìn', 'Tuất', 'Dậu'],
      ['Tý', 'Mão', 'Mùi'],
      ['Dần', 'Ngọ', 'Sửu'],
      ['Thân', 'Tỵ', 'Hợi']
    ];
    if (TUONG_QUAN_MAP[season].includes(hChi)) {
      results.push({
        name: 'Giờ Tướng Quân (Nhẹ)',
        pham: true,
        desc: `Sinh mùa ${['Xuân', 'Hạ', 'Thu', 'Đông'][season]} giờ ${hChi} phạm Giờ Tướng Quân (mức độ nhẹ) — Nhỏ dễ khóc dai, lớn lên mặt mũi hiền lành nhưng cá tính độc lập, bướng nghịch.`,
        hoaGiai: 'Giờ này rất nhẹ, không đáng ngại; khi trẻ lớn lên chỉ cần định hướng thể thao và rèn tính kỷ luật.'
      });
    }

    return results;
  }

  // Lập Lá Số Tử Vi Lạc Việt 12 Cung đầy đủ
  function generateTuViChart({ name = 'Đương Số Lạc Việt', gender = 'Nam', solarDay = 15, solarMonth = 6, solarYear = 1990, hourChiIdx = 6, viewYear = 2026 }) {
    const fullDate = AL.getFullDateCanChi(solarDay, solarMonth, solarYear, hourChiIdx);
    const lDay = fullDate.lunar.lunarDay;
    const lMonth = fullDate.lunar.lunarMonth;
    const lYear = fullDate.lunar.lunarYear;
    const yInfo = fullDate.yearInfo;
    const viewYInfo = AL.getYearInfo(viewYear);

    const amDuongNamNu = `${yInfo.canAmDuong} ${gender}`;
    const isThuanChieu = (yInfo.canAmDuong === 'Dương' && gender === 'Nam') || (yInfo.canAmDuong === 'Âm' && gender === 'Nữ');

    // 1. An Cung Mệnh và Cung Thân (Khởi tháng Giêng tại cung Dần [chiIdx=2])
    const menhChiIdx = (2 + (lMonth - 1) - hourChiIdx + 12) % 12;
    const thanChiIdx = (2 + (lMonth - 1) + hourChiIdx) % 12;

    // Khởi tạo 12 cung Địa Bàn (0=Tý .. 11=Hợi)
    const palaces = AL.CHI.map((chiName, idx) => {
      // Tính Thiên Can của từng cung theo Ngũ Hổ Độn (Khởi Dần từ Can Năm)
      const danCanIdx = ((yInfo.canIdx % 5) * 2 + 2) % 10;
      const offsetFromDan = (idx - 2 + 12) % 12;
      const cungCanIdx = (danCanIdx + offsetFromDan) % 10;
      return {
        chiIdx: idx,
        chi: chiName,
        can: AL.CAN[cungCanIdx],
        canChi: `${AL.CAN[cungCanIdx]} ${chiName}`,
        chiHanh: AL.CHI_HANH[chiName],
        cungName: '',
        isMenh: idx === menhChiIdx,
        isThan: idx === thanChiIdx,
        chinhTinh: [],
        catTinh: [],
        satTinh: [],
        vongThaiTue: '',
        vongLocTon: '',
        vongTrangSinh: '',
        vongTuongTinh: '',
        daiVan: 0,
        tieuVanChi: ''
      };
    });

    // Điền tên 12 cung chức năng (Đi nghịch chiều kim đồng hồ từ Cung Mệnh)
    for (let i = 0; i < 12; i++) {
      const targetIdx = (menhChiIdx - i + 12) % 12;
      palaces[targetIdx].cungName = CUNG_12_NAMES[i];
    }

    // 2. Tính Cục Số (Khởi từ Can Năm và vị trí Cung Mệnh)
    // Ngũ Hành Nạp Âm của Can Chi Cung Mệnh quyết định Cục:
    const menhPalace = palaces[menhChiIdx];
    let menhCycle60 = 0;
    const mCanIdx = AL.CAN.indexOf(menhPalace.can);
    for (let i = 0; i < 60; i++) {
      if (i % 10 === mCanIdx && i % 12 === menhChiIdx) {
        menhCycle60 = i;
        break;
      }
    }
    const menhNapAm = AL.NAP_AM_30[Math.floor(menhCycle60 / 2)];
    const CUC_MAP = {
      'Thủy': { num: 2, name: 'Thủy Nhị Cục', hanh: 'Thủy' },
      'Mộc':  { num: 3, name: 'Mộc Tam Cục',  hanh: 'Mộc' },
      'Kim':  { num: 4, name: 'Kim Tứ Cục',   hanh: 'Kim' },
      'Thổ':  { num: 5, name: 'Thổ Ngũ Cục',  hanh: 'Thổ' },
      'Hỏa':  { num: 6, name: 'Hỏa Lục Cục',  hanh: 'Hỏa' }
    };
    // Cục theo Lạc Thư Hoa Giáp vs Cục truyền thống
    const cucLacViet = CUC_MAP[menhNapAm.lacVietHanh];
    const cucTruyenThong = CUC_MAP[menhNapAm.hanHanh];
    const cucNum = cucLacViet.num;

    // 3. An Sao Tử Vi & 14 Chính Tinh
    let tuViChiIdx = 2;
    const rem = lDay % cucNum;
    if (rem === 0) {
      const q = lDay / cucNum;
      tuViChiIdx = (2 + q - 1) % 12;
    } else {
      const add = cucNum - rem;
      const q = (lDay + add) / cucNum;
      if (add % 2 === 1) {
        tuViChiIdx = (2 + q - 1 - add + 24) % 12;
      } else {
        tuViChiIdx = (2 + q - 1 + add) % 12;
      }
    }

    // Vòng Tử Vi (đi nghịch): Tử Vi (0), Thiên Cơ (-1), cách 1, Thái Dương (-3), Vũ Khúc (-4), Thiên Đồng (-5), cách 2, Liêm Trinh (-8)
    const VONG_TU_VI = [
      { offset: 0,  name: 'Tử Vi',      hanh: 'Thổ', loai: 'Đế Tinh' },
      { offset: -1, name: 'Thiên Cơ',   hanh: 'Mộc', loai: 'Thiện Tinh' },
      { offset: -3, name: 'Thái Dương', hanh: 'Hỏa', loai: 'Quyền Tinh' },
      { offset: -4, name: 'Vũ Khúc',    hanh: 'Kim', loai: 'Tài Tinh' },
      { offset: -5, name: 'Thiên Đồng', hanh: 'Thủy',loai: 'Phúc Tinh' },
      { offset: -8, name: 'Liêm Trinh', hanh: 'Hỏa', loai: 'Đào Hoa / Quyền Tinh' }
    ];
    VONG_TU_VI.forEach(s => {
      const pos = (tuViChiIdx + s.offset + 24) % 12;
      palaces[pos].chinhTinh.push(s);
    });

    // Vòng Thiên Phủ (đối xứng với Tử Vi qua trục Dần [2] - Thân [8]):
    const thienPhuChiIdx = (4 - tuViChiIdx + 12) % 12;
    const VONG_THIEN_PHU = [
      { offset: 0,  name: 'Thiên Phủ',   hanh: 'Thổ', loai: 'Tài Khố Quyền Tinh' },
      { offset: 1,  name: 'Thái Âm',     hanh: 'Thủy',loai: 'Phú Tinh' },
      { offset: 2,  name: 'Tham Lang',   hanh: 'Thủy',loai: 'Đào Hoa / Dục Tinh' },
      { offset: 3,  name: 'Cự Môn',      hanh: 'Thủy',loai: 'Ám Tinh / Ngôn Biện' },
      { offset: 4,  name: 'Thiên Tướng', hanh: 'Thủy',loai: 'Ấn Tinh' },
      { offset: 5,  name: 'Thiên Lương', hanh: 'Mộc', loai: 'Ấm Tinh / Thọ Tinh' },
      { offset: 6,  name: 'Thất Sát',    hanh: 'Kim', loai: 'Quyền Dũng Tinh' },
      { offset: 10, name: 'Phá Quân',    hanh: 'Thủy',loai: 'Hao Tinh / Tiên Phong' }
    ];
    VONG_THIEN_PHU.forEach(s => {
      const pos = (thienPhuChiIdx + s.offset) % 12;
      palaces[pos].chinhTinh.push(s);
    });

    // 4. An Vòng Thái Tuế (12 sao khởi từ Chi Năm Sinh)
    const VONG_THAI_TUE = [
      'Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm', 'Quan Phù', 'Tử Phù',
      'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù'
    ];
    for (let i = 0; i < 12; i++) {
      palaces[(yInfo.chiIdx + i) % 12].vongThaiTue = VONG_THAI_TUE[i];
    }

    // 5. An Vòng Tướng Tinh 12 Sao (Trích nguyên bản Chuyên đề 3 Phần A TaiLieuLyHoc.md dòng 7934-7983)
    // Dần Ngọ Tuất an ở Ngọ (6); Thân Tý Thìn an ở Tý (0); Tỵ Dậu Sửu an ở Dậu (9); Hợi Mão Mùi an ở Mão (3)
    const TUONG_TINH_START = {
      'Dần': 6, 'Ngọ': 6, 'Tuất': 6,
      'Thân': 0, 'Tý': 0, 'Thìn': 0,
      'Tỵ': 9,  'Dậu': 9, 'Sửu': 9,
      'Hợi': 3, 'Mão': 3, 'Mùi': 3
    };
    const VONG_TUONG_TINH_12 = [
      'Tướng Tinh', 'Phan Án', 'Tuế Dịch (Lưu Mã)', 'Tức Thần', 'Hoa Cái', 'Kiếp Sát',
      'Tai Sát', 'Thiên Sát', 'Chỉ Bối', 'Hàm Trì (Đào Hoa)', 'Nguyệt Sát', 'Vong Thần'
    ];
    const startTuongTinh = TUONG_TINH_START[yInfo.chi];
    for (let i = 0; i < 12; i++) {
      const pIdx = (startTuongTinh + i) % 12;
      palaces[pIdx].vongTuongTinh = VONG_TUONG_TINH_12[i];
      if (['Hoa Cái', 'Hàm Trì (Đào Hoa)', 'Phan Án'].includes(VONG_TUONG_TINH_12[i])) {
        palaces[pIdx].catTinh.push(VONG_TUONG_TINH_12[i]);
      } else if (['Kiếp Sát', 'Tai Sát', 'Chỉ Bối', 'Vong Thần'].includes(VONG_TUONG_TINH_12[i])) {
        palaces[pIdx].satTinh.push(VONG_TUONG_TINH_12[i]);
      }
    }

    // 6. An Vòng Lộc Tồn & Kình Dương - Đà La
    const LOC_TON_POS = {
      'Giáp': 2, 'Ất': 3, 'Bính': 5, 'Mậu': 5, 'Đinh': 6, 'Kỷ': 6,
      'Canh': 8, 'Tân': 9, 'Nhâm': 11, 'Quý': 0
    };
    const locTonIdx = LOC_TON_POS[yInfo.can];
    palaces[locTonIdx].catTinh.push('Lộc Tồn');
    palaces[(locTonIdx + 1) % 12].satTinh.push('Kình Dương');
    palaces[(locTonIdx + 11) % 12].satTinh.push('Đà La');

    const VONG_BAC_SI = [
      'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư',
      'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ'
    ];
    for (let i = 0; i < 12; i++) {
      const pos = isThuanChieu ? (locTonIdx + i) % 12 : (locTonIdx - i + 12) % 12;
      palaces[pos].vongLocTon = VONG_BAC_SI[i];
    }

    // 7. An Lục Cát (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt) & Lục Sát (Không, Kiếp)
    palaces[(4 + (lMonth - 1)) % 12].catTinh.push('Tả Phù');
    palaces[(10 - (lMonth - 1) + 12) % 12].catTinh.push('Hữu Bật');
    palaces[(10 - hourChiIdx + 12) % 12].catTinh.push('Văn Xương');
    palaces[(4 + hourChiIdx) % 12].catTinh.push('Văn Khúc');
    palaces[(11 - hourChiIdx + 12) % 12].satTinh.push('Địa Không');
    palaces[(11 + hourChiIdx) % 12].satTinh.push('Địa Kiếp');

    // Thiên Khôi - Thiên Việt (Thiên Ất Quý Nhân theo Can Năm)
    const KHOI_VIET = {
      'Giáp': [1, 7], 'Mậu': [1, 7], 'Canh': [1, 7],
      'Ất': [0, 8],   'Kỷ': [0, 8],
      'Bính': [11, 9],'Đinh': [11, 9],
      'Tân': [6, 2],
      'Nhâm': [3, 5], 'Quý': [3, 5]
    };
    const kv = KHOI_VIET[yInfo.can] || [1, 7];
    palaces[kv[0]].catTinh.push('Thiên Khôi');
    palaces[kv[1]].catTinh.push('Thiên Việt');

    // 8. An Vòng Tràng Sinh theo Cục Lạc Việt
    const TRANG_SINH_START = { 'Thủy': 8, 'Mộc': 11, 'Kim': 5, 'Thổ': 8, 'Hỏa': 2 };
    const VONG_TRANG_SINH = [
      'Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy',
      'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
    ];
    const tsStart = TRANG_SINH_START[cucLacViet.hanh] || 8;
    for (let i = 0; i < 12; i++) {
      const pos = isThuanChieu ? (tsStart + i) % 12 : (tsStart - i + 12) % 12;
      palaces[pos].vongTrangSinh = VONG_TRANG_SINH[i];
    }

    // 9. An Đại Vận 10 năm cho 12 cung
    for (let i = 0; i < 12; i++) {
      const pos = isThuanChieu ? (menhChiIdx + i) % 12 : (menhChiIdx - i + 12) % 12;
      palaces[pos].daiVan = cucNum + i * 10;
    }

    // 10. Kiểm tra 5 Giờ Phạm Trẻ Sơ Sinh
    const gioPhamList = check5GioPhamTreEm(yInfo.chiIdx, lMonth, lDay, hourChiIdx, gender);

    // 11. Luận giải tổng quát Định Tính & Định Lượng
    const menhVsCuc = AL.compareNguHanh(yInfo.lacVietHanh, cucLacViet.hanh);
    const currentLunarAge = viewYear - lYear + 1;
    const activeDaiVanPalace = palaces.find(p => currentLunarAge >= p.daiVan && currentLunarAge <= p.daiVan + 9) || palaces[menhChiIdx];
    const luuNienPalace = palaces[viewYInfo.chiIdx] || palaces[0];

    const meta = {
      name,
      gender,
      amDuongNamNu,
      isThuanChieu,
      solarDateStr: `${String(solarDay).padStart(2, '0')}/${String(solarMonth).padStart(2, '0')}/${solarYear}`,
      lunarDateStr: `${String(lDay).padStart(2, '0')}/${String(lMonth).padStart(2, '0')}/${lYear} (${yInfo.canChi})`,
      tuTru: {
        nam: yInfo.canChi,
        thang: fullDate.month.canChi,
        ngay: fullDate.day.canChi,
        gio: fullDate.hour.canChi
      },
      yInfo,
      viewYear,
      viewYInfo,
      currentLunarAge,
      menhChiIdx,
      thanChiIdx,
      menhCungChi: AL.CHI[menhChiIdx],
      thanCungChi: AL.CHI[thanChiIdx],
      thanCuName: palaces[thanChiIdx].cungName,
      cucLacViet,
      cucTruyenThong,
      menhVsCuc,
      activeDaiVanPalace,
      luuNienPalace
    };

    // Gắn luận giải chi tiết ngôn ngữ đời thường cho từng cung trong 12 cung
    palaces.forEach(p => {
      p.customerReading = interpretPalaceForCustomer(p, palaces, meta);
    });

    const lifeSummary6 = buildCustomerLifeSummary(palaces, meta);

    return {
      meta,
      palaces,
      gioPhamList,
      lifeSummary6
    };
  }

  // ============================================================================
  // TỪ ĐIỂN LUẬN GIẢI TỬ VI NGÔN NGỮ ĐỜI THƯỜNG DÀNH CHO KHÁCH HÀNG
  // ============================================================================
  const STAR_HUMAN_DICT = {
    'Tử Vi': {
      trait: 'Đĩnh đạc, tự trọng cao, có tố chất lãnh đạo, bao dung và thích làm chủ công việc.',
      career: 'Hợp làm quản lý, điều hành doanh nghiệp, cơ quan nhà nước, kinh doanh độc lập hoặc vị trí đứng đầu.',
      wealth: 'Tài lộc vững vàng, kiếm tiền bằng uy tín và vị thế xã hội, càng về trung niên càng sung túc.',
      marriage: 'Người bạn đời có tự trọng cao, có năng lực quán xuyến; vợ chồng cần tôn trọng sĩ diện của nhau.',
      property: 'Duyên nhà đất rất tốt, thích ở nhà cao cửa rộng, khu vực trung tâm hoặc khang trang.',
      health: 'Chú ý hệ tiêu hóa, dạ dày, tỳ vị và huyết áp do áp lực công việc.'
    },
    'Thiên Cơ': {
      trait: 'Thông minh, sắc sảo, lắm mưu nhiều kế, nhân hậu, thích tìm tòi học hỏi và linh hoạt ứng biến.',
      career: 'Rất hợp công nghệ, kế hoạch, chiến lược, tư vấn, giáo dục, kỹ thuật, thiết kế hoặc thương mại điện tử.',
      wealth: 'Kiếm tiền bằng trí óc và sự nhạy bén; dòng tiền luân chuyển liên tục, hợp đầu tư đa ngành.',
      marriage: 'Vợ/chồng là người thông minh, tháo vát, khéo léo trong giao tiếp.',
      property: 'Thường đổi nhà hoặc sửa sang nhà cửa vài lần rồi mới an cư ổn định; hợp nhà nhiều cây xanh.',
      health: 'Hay suy nghĩ nhiều dễ mất ngủ, mỏi vai gáy, thần kinh căng thẳng và chức năng gan.'
    },
    'Thái Dương': {
      trait: 'Quang minh chính đại, nhiệt tình, hào phóng, trọng danh dự, thích giúp đỡ người khác.',
      career: 'Hợp ngoại giao, truyền thông, thương mại quốc tế, quản lý, luật pháp, giảng dạy hoặc công việc có danh tiếng.',
      wealth: 'Tiền bạc đến từ danh tiếng và các mối quan hệ rộng; kiếm tiền giỏi nhưng cũng hào phóng hay giúp người.',
      marriage: 'Người phối ngẫu thẳng thắn, năng động, có trách nhiệm lớn với gia đình.',
      property: 'Hợp nhà hướng sáng, thoáng đãng, mặt tiền rộng hoặc chung cư tầng cao nhiều ánh sáng.',
      health: 'Lưu ý thị lực (mắt), tim mạch, huyết áp và chứng đau đầu khi làm việc quá sức.'
    },
    'Vũ Khúc': {
      trait: 'Quyết đoán, thực tế, nghị lực cao, cực kỳ nhạy bén với con số và tiền bạc, làm việc dứt khoát.',
      career: 'Bậc thầy về tài chính, ngân hàng, kinh doanh, bất động sản, kế toán, kiểm toán hoặc kỹ thuật cơ khí.',
      wealth: 'Đại Tài Tinh: Rất có duyên làm giàu, giỏi kiếm tiền và biết nắm bắt cơ hội kinh doanh thực tế.',
      marriage: 'Vợ/chồng chăm chỉ, giỏi làm ăn nhưng đôi lúc hơi khô khan, ít nói lời hoa mỹ.',
      property: 'Tích lũy bất động sản và tài sản cố định rất giỏi, hậu vận nhiều nhà đất.',
      health: 'Chú ý đường hô hấp (phổi, mũi họng) và xương khớp.'
    },
    'Thiên Đồng': {
      trait: 'Hiền hòa, nhân hậu, yêu đời, thích tận hưởng cuộc sống, đi đến đâu cũng được mọi người quý mến.',
      career: 'Hợp dịch vụ, ẩm thực, du lịch, làm đẹp, nghệ thuật, chăm sóc khách hàng, y tế hoặc văn hóa.',
      wealth: 'Phúc Tinh: Tiền bạc thường đến tự nhiên, ít khi rơi vào cảnh túng thiếu lâu dài, tay trắng làm nên.',
      marriage: 'Đời sống vợ chồng tình cảm, lãng mạn; người bạn đời hiền lành, trẻ trung.',
      property: 'Khởi đầu tự lập mua nhà từ nhỏ đến lớn, hậu vận có nhà cửa êm ấm gần sông hồ/công viên.',
      health: 'Lưu ý hệ bài tiết, thận, bàng quang và kiểm soát cân nặng.'
    },
    'Liêm Trinh': {
      trait: 'Thẳng tính, nguyên tắc, kỷ luật cao, làm việc có trách nhiệm nhưng nội tâm giàu tình cảm.',
      career: 'Hợp hành chính, pháp luật, kiểm soát nội bộ, lực lượng vũ trang, thẩm mỹ hoặc quản trị nhân sự.',
      wealth: 'Kiếm tiền bằng chuyên môn vững và sự nhạy bén trong giao tiếp kinh doanh.',
      marriage: 'Tình duyên sâu đậm nhưng dễ ghen tuông hoặc đòi hỏi sự chuẩn mực cao ở người bạn đời.',
      property: 'Nhà đất giữ vững ổn định, hợp nơi an ninh trật tự tốt.',
      health: 'Chú ý nóng trong người, huyết áp, tim mạch và dị ứng da.'
    },
    'Thiên Phủ': {
      trait: 'Khoan hòa, điềm đạm, chín chắn, rất giỏi quản lý tài sản và quán xuyến đại cuộc.',
      career: 'Hợp tài chính, ngân hàng, quản lý kho vận, bất động sản, giám đốc điều hành hoặc chủ doanh nghiệp.',
      wealth: 'Kho Tiền Của Trời (Tài Khố): Không chỉ giỏi kiếm tiền mà đặc biệt giỏi giữ tiền, tích lũy tài sản lớn.',
      marriage: 'Hôn nhân bền vững; người bạn đời đảm đang, vun vén gia đình và quản lý kinh tế rất khéo.',
      property: 'Cung Điền Trạch/Tài sản cực vượng, dễ sở hữu nhiều nhà đất, biệt thự hoặc đất đai rộng.',
      health: 'Sức khỏe nền tảng tốt, chỉ cần chú ý dạ dày và bệnh do ăn uống sung túc.'
    },
    'Thái Âm': {
      trait: 'Tinh tế, nhẹ nhàng, sâu sắc, thẩm mỹ tốt, biết lo xa và rất coi trọng hạnh phúc gia đình.',
      career: 'Hợp bất động sản, tài chính, nghệ thuật, thời trang, mỹ phẩm, thiết kế nội thất, giáo dục, lưu trú.',
      wealth: 'Phú Tinh (Sao Giàu Có): Lộc tiền bạc và nhà đất tích tụ âm thầm nhưng cực kỳ bền vững.',
      marriage: 'Người bạn đời dịu dàng, chu đáo, nhan sắc ưa nhìn và biết chăm lo cho tổ ấm.',
      property: 'Đại cát về bất động sản — rất có duyên mua bán, đầu tư đất đai và nhà cửa.',
      health: 'Chú ý giấc ngủ, nội tiết, thận và mắt.'
    },
    'Tham Lang': {
      trait: 'Năng động, quảng giao, khéo ăn nói, thích khám phá cái mới, có sức hút lớn với mọi người.',
      career: 'Hợp kinh doanh thương mại, giải trí, truyền thông, nhà hàng khách sạn, ngoại giao, bán hàng.',
      wealth: 'Nhạy bén với các cơ hội kiếm tiền nhanh, càng giao thiệp rộng càng dễ phát tài.',
      marriage: 'Có sức hút đào hoa; vợ chồng nên kết hôn muộn một chút hoặc cùng nhau làm ăn sẽ rất bền.',
      property: 'Nhà cửa thường ở nơi sầm uất, phố thị đông đúc thuận tiện kinh doanh.',
      health: 'Chú ý chức năng gan, thận và hạn chế rượu bia, thức khuya.'
    },
    'Cự Môn': {
      trait: 'Sắc sảo, tư duy phản biện cực tốt, tài ăn nói thuyết phục, thẳng thắn và phân tích sâu.',
      career: 'Hợp luật sư, giảng viên, tư vấn, marketing, bán hàng, ngoại ngữ, truyền thông hoặc nghiên cứu.',
      wealth: 'Dùng lời nói và trí tuệ để ra tiền ("Khẩu thiệt sinh tài"), hợp nghề tư vấn, thương thảo hợp đồng.',
      marriage: 'Vợ chồng thẳng tính nên đôi khi dễ tranh luận; cần nhường lời để tránh hiểu lầm nhỏ.',
      property: 'Tự tay gây dựng nhà cửa, cần kiểm tra kỹ giấy tờ pháp lý khi mua bán đất đai.',
      health: 'Lưu ý đường tiêu hóa, dạ dày và cổ họng/thanh quản.'
    },
    'Thiên Tướng': {
      trait: 'Trọng chữ tín, nghĩa khí, công bằng, ăn mặc chỉnh tề, hay giúp đỡ người gặp khó khăn.',
      career: 'Hợp vị trí phó tướng, cố vấn cấp cao, quản lý, hành chính, y dược, dịch vụ cao cấp.',
      wealth: 'Thu nhập ổn định, bền vững từ uy tín cá nhân và công việc chuyên môn.',
      marriage: 'Người phối ngẫu đàng hoàng, chung thủy, có trách nhiệm với hai bên nội ngoại.',
      property: 'Nhà cửa khang trang, yên tĩnh, hàng xóm văn minh.',
      health: 'Chú ý hệ bài tiết, thận và da liễu.'
    },
    'Thiên Lương': {
      trait: 'Nhân từ, điềm đạm, sống có đạo đức, nguyên tắc, luôn được quý nhân và bề trên che chở.',
      career: 'Hợp y bác sĩ, giáo viên, dược phẩm, từ thiện, thanh tra, giám sát, tư vấn tâm lý/phong thủy.',
      wealth: 'Tiền tài thanh sạch, bền vững, gặp hung hóa cát, không bao giờ lo túng thiếu.',
      marriage: 'Vợ chồng gắn bó bằng tình nghĩa sâu nặng, người bạn đời chín chắn, biết nhường nhịn.',
      property: 'Dễ được hưởng lộc đất đai tổ tiên hoặc mua được nhà đất có phong thủy rất lành.',
      health: 'Thọ Tinh (Sao Trường Thọ): Sức đề kháng tốt, gặp bệnh dễ gặp thầy gặp thuốc giỏi.'
    },
    'Thất Sát': {
      trait: 'Bản lĩnh, gan dạ, độc lập, dám nghĩ dám làm, thích tiên phong mở lối riêng.',
      career: 'Hợp khởi nghiệp tự thân, điều hành dự án khó, kỹ thuật công nghệ, xây dựng, quân đội, kinh doanh.',
      wealth: 'Kiếm tiền bứt phá mạnh mẽ trong những giai đoạn biến động, tay trắng dựng nghiệp lớn.',
      marriage: 'Cá tính mạnh nên trong nhà cần sự chia sẻ nhẹ nhàng, tránh áp đặt ý kiến lên người bạn đời.',
      property: 'Tự lực mua nhà lập nghiệp, càng về trung vận nhà đất càng vững.',
      health: 'Lưu ý phổi, hô hấp và cẩn thận va chạm nhỏ khi vận động.'
    },
    'Phá Quân': {
      trait: 'Sáng tạo, táo bạo, không ngại thay đổi cái cũ để xây dựng cái mới tốt hơn, quyết liệt.',
      career: 'Hợp tiên phong mở thị trường mới, cải tổ doanh nghiệp, sáng tạo, vận tải, xuất nhập khẩu, kỹ thuật.',
      wealth: 'Tiền vào lớn ra lớn, hợp đầu tư vào bất động sản hoặc tài sản giá trị để giữ tiền lâu dài.',
      marriage: 'Tình cảm nồng nhiệt nhưng cần tránh nóng nảy nhất thời; kết hôn muộn hoặc nhường nhịn nhau sẽ rất bền.',
      property: 'Thường mua nhà rồi sửa sang, cải tạo lại theo ý mình hoặc đổi sang nhà lớn hơn.',
      health: 'Chú ý thận, xương khớp và hệ tiêu hóa.'
    }
  };

  function interpretPalaceForCustomer(palace, allPalaces, meta) {
    const xungIdx = (palace.chiIdx + 6) % 12;
    const xungPalace = allPalaces[xungIdx];
    const isVCD = palace.chinhTinh.length === 0;
    const activeStars = isVCD ? xungPalace.chinhTinh : palace.chinhTinh;
    const starNames = activeStars.map(s => s.name);

    const fieldMap = {
      'MỆNH': 'trait',
      'QUAN LỘC': 'career',
      'TÀI BẠCH': 'wealth',
      'PHU THÊ': 'marriage',
      'ĐIỀN TRẠCH': 'property',
      'TẬT ÁCH': 'health'
    };
    const fieldKey = fieldMap[palace.cungName] || 'trait';

    let mainReading = '';
    if (isVCD) {
      const borrowedNames = starNames.join(' & ') || 'Cát tinh';
      mainReading = `Cung ${palace.cungName} của bạn thuộc cách "Vô Chính Diệu" (không có sao chính đóng trực tiếp mà nhận năng lượng từ sao <b>${borrowedNames}</b> ở cung đối diện ${xungPalace.cungName} chiếu sang). Đặc điểm của cách này là sự <b>mềm dẻo, linh hoạt và thích nghi cực nhanh</b>. `;
    } else {
      mainReading = `Cung ${palace.cungName} có sao chính <b>${starNames.join(' & ')}</b> tọa thủ. `;
    }

    activeStars.forEach(s => {
      const dict = STAR_HUMAN_DICT[s.name];
      if (dict && dict[fieldKey]) {
        mainReading += `${dict[fieldKey]} `;
      }
    });

    // Dịch ý nghĩa các sao phụ tốt (Cát tinh)
    const goodNotes = [];
    if (palace.catTinh.includes('Lộc Tồn')) goodNotes.push('Có <b>Lộc Tồn (Kho Lộc Trời Ban)</b>: Giỏi tích lũy, luôn có của để dành và gặp may về tiền bạc.');
    if (palace.catTinh.includes('Tả Phù') || palace.catTinh.includes('Hữu Bật')) goodNotes.push('Có <b>Tả Phù / Hữu Bật</b>: Đi đâu cũng có cộng sự, bạn bè và người thân trợ lực đắc lực.');
    if (palace.catTinh.includes('Văn Xương') || palace.catTinh.includes('Văn Khúc')) goodNotes.push('Có <b>Văn Xương / Văn Khúc</b>: Có khiếu ăn nói, học hành sáng dạ, giấy tờ hợp đồng thuận lợi.');
    if (palace.catTinh.includes('Thiên Khôi') || palace.catTinh.includes('Thiên Việt')) goodNotes.push('Có <b>Thiên Khôi / Thiên Việt (Quý Nhân)</b>: Khi gặp việc khó luôn có người lớn hoặc cấp trên xuất hiện nâng đỡ.');
    if (palace.catTinh.includes('Hàm Trì (Đào Hoa)') || palace.catTinh.includes('Hoa Cái')) goodNotes.push('Có <b>Đào Hoa / Hoa Cái</b>: Có duyên thu hút, thẩm mỹ tinh tế, được nhiều người yêu mến.');
    if (['Tràng Sinh', 'Đế Vượng', 'Lâm Quan', 'Quan Đới'].includes(palace.vongTrangSinh)) {
      goodNotes.push(`Nằm ở đất <b>${palace.vongTrangSinh}</b> (Vòng Tràng Sinh): Năng lượng sinh trưởng rất dồi dào, hậu vận vững chắc.`);
    }

    // Dịch ý nghĩa các sao cần lưu ý (Sát tinh)
    const cautionNotes = [];
    if (palace.satTinh.includes('Kình Dương') || palace.satTinh.includes('Đà La')) {
      cautionNotes.push('Có <b>Kình Dương / Đà La</b>: Đôi lúc gặp sự cạnh tranh hoặc chậm trễ bước đầu, cần kiên nhẫn không nóng vội.');
    }
    if (palace.satTinh.includes('Địa Không') || palace.satTinh.includes('Địa Kiếp')) {
      cautionNotes.push('Có <b>Địa Không / Địa Kiếp</b>: Tư duy táo bạo khác người nhưng cần tránh đầu tư lướt sóng mạo hiểm tất tay.');
    }
    if (palace.vongLocTon === 'Đại Hao' || palace.vongLocTon === 'Tiểu Hao') {
      cautionNotes.push(`Có sao <b>${palace.vongLocTon}</b>: Dòng tiền hay luân chuyển ra vào, nên chuyển tiền mặt thành tài sản/nhà đất để giữ của.`);
    }

    if (goodNotes.length === 0) {
      goodNotes.push(`Cung ${palace.cungName} ở trạng thái bình hòa, ổn định (${palace.vongLocTon} – ${palace.vongTrangSinh}).`);
    }
    if (cautionNotes.length === 0) {
      cautionNotes.push('Cung này không có đại sát tinh xâm phạm, rất bình an và thuận lợi.');
    }

    const starHeader = isVCD
      ? `Vô Chính Diệu (Mượn ${starNames.join(' & ') || 'Xung Chiếu'})`
      : starNames.join(' & ');

    return {
      isVCD,
      starNames,
      starHeader,
      mainReading: mainReading.trim(),
      goodNotes,
      cautionNotes
    };
  }

  function buildCustomerLifeSummary(palaces, meta) {
    const findP = (name) => palaces.find(p => p.cungName === name) || palaces[0];
    const pMenh = findP('MỆNH');
    const pQuan = findP('QUAN LỘC');
    const pTai = findP('TÀI BẠCH');
    const pDien = findP('ĐIỀN TRẠCH');
    const pPhuThe = findP('PHU THÊ');
    const pTuTuc = findP('TỬ TỨC');
    const pTat = findP('TẬT ÁCH');
    const pPhuc = findP('PHÚC ĐỨC');
    const pThienDi = findP('THIÊN DI');

    const thanGuides = {
      'MỆNH': 'Thân cư Mệnh: Bạn là người tự chủ hoàn toàn cuộc đời mình, tính cách trước sau như một, càng lớn tuổi càng kiên định.',
      'PHÚC ĐỨC': 'Thân cư Phúc Đức: Sau tuổi 32, bạn rất coi trọng đời sống tinh thần, tâm linh và phúc ấm gia đình; làm nhiều việc thiện sẽ cực kỳ phát đạt.',
      'QUAN LỘC': 'Thân cư Quan Lộc: Sau tuổi 32, tâm trí bạn đặt trọn vào sự nghiệp, danh tiếng và vị thế xã hội, dễ đạt chức vụ hoặc cơ nghiệp riêng.',
      'THIÊN DI': 'Thân cư Thiên Di: Hợp lập nghiệp phương xa, giao thương bên ngoài xã hội hoặc thường xuyên di chuyển sẽ phát tài lớn.',
      'TÀI BẠCH': 'Thân cư Tài Bạch: Hậu vận gắn liền với quản lý tài chính, kinh doanh và tạo dựng dòng tiền; càng về trung niên càng nhạy bén làm giàu.',
      'PHU THÊ': 'Thân cư Phu Thê: Sau khi lập gia đình, cuộc đời và sự nghiệp của bạn gắn bó mật thiết với người bạn đời ("Thuận vợ thuận chồng tát biển Đông cũng cạn").'
    };

    const dv = meta.activeDaiVanPalace;
    const ln = meta.luuNienPalace;

    return [
      {
        icon: '👤',
        title: `1. Tính Cách & Bản Mệnh`,
        stars: `Thân cư ${meta.thanCuName}`,
        content: `${pMenh.customerReading.mainReading} <br><br>• <b>Hướng phát triển sau 30 tuổi (${meta.thanCuName}):</b> ${thanGuides[meta.thanCuName] || ''}<br>• <b>Tương quan Mệnh & Cục:</b> Bản mệnh Lạc Việt hành <b>${meta.yInfo.lacVietHanh}</b> gặp <b>${meta.cucLacViet.name}</b> (${meta.menhVsCuc.rel}) — ${meta.menhVsCuc.score >= 0 ? 'Hoàn cảnh xã hội nâng đỡ tốt cho bản mệnh của bạn.' : 'Bạn là người tự lực cánh sinh, vượt qua thử thách bằng chính bản lĩnh của mình.'}`,
        goodPoint: pMenh.customerReading.goodNotes[0]
      },
      {
        icon: '💼',
        title: `2. Công Danh & Sự Nghiệp`,
        stars: pQuan.customerReading.starHeader,
        content: `${pQuan.customerReading.mainReading}`,
        goodPoint: pQuan.customerReading.goodNotes[0]
      },
      {
        icon: '💰',
        title: `3. Tài Lộc & Nhà Đất`,
        stars: `Tài: ${pTai.customerReading.starHeader}`,
        content: `• <b>Về Tiền Bạc (Cung Tài Bạch):</b> ${pTai.customerReading.mainReading}<br><br>• <b>Về Nhà Đất & Bất Động Sản (Cung Điền Trạch):</b> ${pDien.customerReading.mainReading}`,
        goodPoint: pDien.customerReading.goodNotes[0]
      },
      {
        icon: '❤️',
        title: `4. Hôn Nhân & Con Cái`,
        stars: `Phu Thê tại ${pPhuThe.chi}`,
        content: `• <b>Đời sống Vợ Chồng (Cung Phu Thê):</b> ${pPhuThe.customerReading.mainReading}<br><br>• <b>Đường Con Cái (Cung Tử Tức):</b> ${pTuTuc.customerReading.mainReading}`,
        goodPoint: 'Kết hợp chọn năm sinh Con Út tại mục 1. Luận Tuổi để khóa chặt vận khí tốt nhất cho cả gia đình.'
      },
      {
        icon: '🌿',
        title: `5. Sức Khỏe & Phúc Đức`,
        stars: `Phúc: ${pPhuc.vongTrangSinh}`,
        content: `• <b>Sức khỏe cần lưu ý (Cung Tật Ách):</b> ${pTat.customerReading.mainReading}<br>• <b>Ra ngoài xã hội (Cung Thiên Di):</b> ${pThienDi.customerReading.mainReading}<br>• <b>Nền tảng Phúc Đức dòng họ:</b> Đóng tại cung ${pPhuc.chi} (${pPhuc.vongTrangSinh}).`,
        goodPoint: pThienDi.customerReading.goodNotes[0]
      },
      {
        icon: '📅',
        title: `6. Vận Hạn Năm ${meta.viewYear}`,
        stars: `Đại vận ${dv.daiVan}–${dv.daiVan + 9} tuổi`,
        content: `• <b>Đại vận 10 năm hiện tại (${dv.daiVan}–${dv.daiVan + 9} tuổi):</b> Đang đi qua cung <b>${dv.cungName} (${dv.canChi})</b>. Trọng tâm 10 năm này xoay quanh vấn đề <b>${dv.cungName}</b>. ${dv.customerReading.mainReading}<br><br>• <b>Vận hạn năm ${meta.viewYear} (${meta.viewYInfo.canChi}):</b> Lưu niên đi vào cung <b>${ln.cungName} (${ln.chi})</b>. Năm nay bạn nên tập trung chăm chút cho phương diện <b>${ln.cungName}</b>.`,
        goodPoint: 'Khi khởi sự việc lớn năm nay, hãy tra ngày tốt và Giờ Quý Nhân Đăng Thiên Môn tại mục 2. Chọn Ngày Tốt để kích hoạt cát khí tối đa!'
      }
    ];
  }

  // ============================================================================
  // ĐỊA LÝ PHONG THỦY BÁT TRẠCH & HUYỀN KHÔNG LẠC VIỆT
  // ============================================================================
  function calculateBatTrachLacViet(birthYear, gender = 'Nam') {
    const yInfo = AL.getYearInfo(birthYear);

    // Tính số Phi Tinh Lưu Niên Huyền Không (Chuyên khảo 15 dòng 12263-12275 TaiLieuLyHoc.md):
    // Khởi năm 1864 (Giáp Tý Thượng Nguyên): Nam = 1 (Khảm), đi nghịch 1-9-8-7-6-5-4-3-2; Nữ = 5 (Cấn/Khôn trung cung), đi thuận 5-6-7-8-9-1-2-3-4
    const diffFrom1864 = birthYear - 1864;
    let starNum;
    if (gender === 'Nam') {
      starNum = ((1 - diffFrom1864) % 9 + 9) % 9;
      if (starNum === 0) starNum = 9;
    } else {
      starNum = ((5 + diffFrom1864 - 1) % 9 + 9) % 9 + 1;
    }

    // Bảng đối chiếu Số Phi Tinh -> Quái Mệnh Trạch theo:
    // (A) HÀ ĐỒ PHỐI HẬU THIÊN LẠC VIỆT (Sư Phụ Thiên Sứ & Sư Huynh Hoàng Triệu Hải - dòng 12253, 12344-12434):
    //     Đổi chỗ Tốn (Tây Nam) và Khôn (Đông Nam); Độ số Đoài (9) và Ly (7); Nam số 5 quy Khôn, Nữ số 5 quy Cấn!
    // (B) BÁT TRẠCH TRUYỀN THỐNG (Hậu Thiên Văn Vương):
    const QUAI_LAC_VIET_MAP = {
      1: { quai: 'Khảm', hanh: 'Dương Thủy (1-6 Hà Đồ)', nhom: 'Đông Tứ Trạch', huongGoc: 'Chính Bắc', cuuTinh: 'Nhất Bạch Tham Lang (Cát tinh đứng đầu)' },
      2: { quai: 'Khôn', hanh: 'Âm Hỏa đới Thổ (2-7 Hà Đồ)', nhom: 'Đông Tứ Trạch (Lạc Việt hoán vị Tốn–Khôn)', huongGoc: 'Đông Nam (Lạc Việt) / Tây Nam (Văn Vương)', cuuTinh: 'Nhị Hắc Cự Môn' },
      3: { quai: 'Chấn', hanh: 'Dương Mộc (3-8 Hà Đồ)', nhom: 'Đông Tứ Trạch', huongGoc: 'Chính Đông', cuuTinh: 'Tam Bích Lộc Tồn' },
      4: { quai: 'Tốn',  hanh: 'Âm Kim (4-9 Hà Đồ)', nhom: 'Tây Tứ Trạch (Lạc Việt hoán vị Tốn–Khôn)', huongGoc: 'Tây Nam (Lạc Việt) / Đông Nam (Văn Vương)', cuuTinh: 'Tứ Lục Văn Xương (Cát tinh)' },
      5: gender === 'Nam'
        ? { quai: 'Khôn (Nam Ngũ Trung)', hanh: 'Thổ Trung Cung (5-10 Hà Đồ)', nhom: 'Đông/Tây Tứ Trạch Đối Chiếu', huongGoc: 'Đông Nam (Lạc Việt)', cuuTinh: 'Ngũ Hoàng Trung Cung' }
        : { quai: 'Cấn (Nữ Ngũ Trung)',   hanh: 'Âm Mộc / Thổ Trung Cung',     nhom: 'Tây Tứ Trạch', huongGoc: 'Đông Bắc (Quái Địa Cầu)', cuuTinh: 'Ngũ Hoàng -> Quy Cấn' },
      6: { quai: 'Càn',  hanh: 'Âm Kim đới Thủy (1-6 Hà Đồ)', nhom: 'Tây Tứ Trạch', huongGoc: 'Tây Bắc (Thiên Môn)', cuuTinh: 'Lục Bạch Vũ Khúc (Cát tinh)' },
      7: { quai: 'Ly (Lạc Việt số 7)', hanQuai: 'Đoài (Truyền thống số 7)', hanh: 'Dương Hỏa (2-7 Hà Đồ)', nhom: 'Đông Tứ Trạch (Lạc Việt Ly 7)', huongGoc: 'Chính Nam (Ly 7 Lạc Việt)', cuuTinh: 'Thất Xích Phá Quân' },
      8: { quai: 'Cấn',  hanh: 'Âm Mộc (3-8 Hà Đồ)', nhom: 'Tây Tứ Trạch', huongGoc: 'Đông Bắc (Cung Địa Cầu)', cuuTinh: 'Bát Bạch Tả Phù (Cát tinh)' },
      9: { quai: 'Đoài (Lạc Việt số 9)', hanQuai: 'Ly (Truyền thống số 9)', hanh: 'Dương Kim (4-9 Hà Đồ)', nhom: 'Tây Tứ Trạch (Lạc Việt Đoài 9)', huongGoc: 'Chính Tây (Đoài 9 Lạc Việt)', cuuTinh: 'Cửu Tử Hữu Bật' }
    };

    const quaiData = QUAI_LAC_VIET_MAP[starNum];
    const baseQuai = starNum === 5 ? (gender === 'Nam' ? 'Khôn' : 'Cấn') : (starNum === 7 ? 'Ly' : (starNum === 9 ? 'Đoài' : quaiData.quai));

    // 8 Hướng Bát Trạch theo Quái Mệnh Trạch
    const BAT_TRACH_DIRECTIONS = {
      'Khảm': [
        { dir: 'Đông Nam', cungLV: 'Khôn (LV) / Tốn (VV)', star: 'Sinh Khí', good: true, desc: 'Thượng cát: Vượng khí tài lộc, thăng tiến, con cái hiếu thảo.' },
        { dir: 'Chính Đông', cungLV: 'Chấn', star: 'Thiên Y', good: true, desc: 'Thượng cát: Sức khỏe dồi dào, gặp thầy gặp thuốc, quý nhân phù trợ.' },
        { dir: 'Chính Nam', cungLV: 'Ly', star: 'Diên Niên (Phúc Đức)', good: true, desc: 'Thượng cát: Gia đạo hòa thuận, hôn nhân bền vững, phúc thọ lâu dài.' },
        { dir: 'Chính Bắc', cungLV: 'Khảm', star: 'Phục Vị', good: true, desc: 'Cát: Tâm tính an định, vững vàng, thuận lợi tu dưỡng.' },
        { dir: 'Tây Nam', cungLV: 'Tốn (LV) / Khôn (VV)', star: 'Tuyệt Mạng', good: false, desc: 'Đại hung hướng: Tránh đặt cửa chính hoặc hướng nhìn mặt tiền; hợp đặt khu phụ/bếp tọa hung hướng cát.' },
        { dir: 'Đông Bắc', cungLV: 'Cấn', star: 'Ngũ Quỷ', good: false, desc: 'Hung hướng: Dễ phát sinh thị phi, nóng nảy, hao tán.' },
        { dir: 'Tây Bắc', cungLV: 'Càn', star: 'Lục Sát', good: false, desc: 'Hung hướng: Tránh đặt phòng ngủ chính hoặc bàn làm việc quay mặt về hướng này.' },
        { dir: 'Chính Tây', cungLV: 'Đoài', star: 'Họa Hại', good: false, desc: 'Hung hướng: Dễ vướng chuyện vụn vặt, kiện tụng nhỏ.' }
      ],
      'Ly': [
        { dir: 'Chính Đông', cungLV: 'Chấn', star: 'Sinh Khí', good: true, desc: 'Thượng cát: Sinh sôi tài lộc, danh tiếng vươn xa.' },
        { dir: 'Đông Nam', cungLV: 'Khôn (LV) / Tốn (VV)', star: 'Thiên Y', good: true, desc: 'Thượng cát: Vượng sức khỏe, quý nhân nâng đỡ.' },
        { dir: 'Chính Bắc', cungLV: 'Khảm', star: 'Diên Niên (Phúc Đức)', good: true, desc: 'Thượng cát: Thủy Hỏa Ký Tế, gia đạo viên mãn bền lâu.' },
        { dir: 'Chính Nam', cungLV: 'Ly', star: 'Phục Vị', good: true, desc: 'Cát: Củng cố nội lực, tinh thần minh mẫn.' },
        { dir: 'Tây Bắc', cungLV: 'Càn', star: 'Tuyệt Mạng', good: false, desc: 'Đại hung hướng: Kỵ mở cửa chính; nên đặt Bếp tọa tại đây nhìn về hướng tốt.' },
        { dir: 'Chính Tây', cungLV: 'Đoài', star: 'Ngũ Quỷ', good: false, desc: 'Hung hướng: Dễ hao tài, tranh cãi.' },
        { dir: 'Tây Nam', cungLV: 'Tốn (LV) / Khôn (VV)', star: 'Lục Sát', good: false, desc: 'Hung hướng: Tránh đặt giường ngủ hoặc bàn thờ.' },
        { dir: 'Đông Bắc', cungLV: 'Cấn', star: 'Họa Hại', good: false, desc: 'Hung hướng: Dễ gặp trở ngại nhỏ.' }
      ],
      'Chấn': [
        { dir: 'Chính Nam', cungLV: 'Ly', star: 'Sinh Khí', good: true, desc: 'Thượng cát: Mộc Hỏa thông minh, đại phát công danh tài lộc.' },
        { dir: 'Chính Bắc', cungLV: 'Khảm', star: 'Thiên Y', good: true, desc: 'Thượng cát: Thủy dưỡng Mộc, sức khỏe và tài vận dồi dào.' },
        { dir: 'Đông Nam', cungLV: 'Khôn (LV) / Tốn (VV)', star: 'Diên Niên (Phúc Đức)', good: true, desc: 'Thượng cát: Gia đạo thuận hòa, đối ngoại đắc lợi.' },
        { dir: 'Chính Đông', cungLV: 'Chấn', star: 'Phục Vị', good: true, desc: 'Cát: Vững chãi, bình an.' },
        { dir: 'Chính Tây', cungLV: 'Đoài', star: 'Tuyệt Mạng', good: false, desc: 'Đại hung hướng: Kim khắc Mộc trực xung, tránh làm cửa chính.' },
        { dir: 'Tây Bắc', cungLV: 'Càn', star: 'Ngũ Quỷ', good: false, desc: 'Hung hướng: Dễ gặp thị phi, va chạm.' },
        { dir: 'Đông Bắc', cungLV: 'Cấn', star: 'Lục Sát', good: false, desc: 'Hung hướng: Trì trệ dòng tiền.' },
        { dir: 'Tây Nam', cungLV: 'Tốn (LV) / Khôn (VV)', star: 'Họa Hại', good: false, desc: 'Hung hướng: Hao tổn sức lực.' }
      ],
      'Tốn': [
        { dir: 'Chính Bắc', cungLV: 'Khảm', star: 'Sinh Khí', good: true, desc: 'Thượng cát: Khí vận hanh thông, tài lộc dồi dào.' },
        { dir: 'Chính Nam', cungLV: 'Ly', star: 'Thiên Y', good: true, desc: 'Thượng cát: Quý nhân trợ giúp, bệnh tật tiêu trừ.' },
        { dir: 'Chính Đông', cungLV: 'Chấn', star: 'Diên Niên (Phúc Đức)', good: true, desc: 'Thượng cát: Phúc đức bền lâu, gia đình gắn kết.' },
        { dir: 'Đông Nam', cungLV: 'Khôn (LV) / Tốn (VV)', star: 'Phục Vị', good: true, desc: 'Cát: Yên ổn, tích lũy bền vững.' },
        { dir: 'Đông Bắc', cungLV: 'Cấn', star: 'Tuyệt Mạng', good: false, desc: 'Đại hung hướng: Kỵ hướng nhà, hướng bàn thờ.' },
        { dir: 'Tây Nam', cungLV: 'Tốn (LV) / Khôn (VV)', star: 'Ngũ Quỷ', good: false, desc: 'Hung hướng: Lưu ý sự hoán vị Tốn – Khôn trong Hà Đồ phối Hậu Thiên Lạc Việt để nghiệm chứng thực địa.' },
        { dir: 'Chính Tây', cungLV: 'Đoài', star: 'Lục Sát', good: false, desc: 'Hung hướng: Tránh đặt cửa chính.' },
        { dir: 'Tây Bắc', cungLV: 'Càn', star: 'Họa Hại', good: false, desc: 'Hung hướng: Dễ sinh bất đồng.' }
      ],
      'Càn': [
        { dir: 'Chính Tây', cungLV: 'Đoài', star: 'Sinh Khí', good: true, desc: 'Thượng cát: Kim khí tương hợp, đại vượng quan lộc và tài sản.' },
        { dir: 'Đông Bắc', cungLV: 'Cấn', star: 'Thiên Y', good: true, desc: 'Thượng cát: Thổ sinh Kim, sức khỏe và điền sản sung túc.' },
        { dir: 'Tây Nam', cungLV: 'Tốn (LV) / Khôn (VV)', star: 'Diên Niên (Phúc Đức)', good: true, desc: 'Thượng cát: Thiên Địa giao thái, gia đạo hưng thịnh.' },
        { dir: 'Tây Bắc', cungLV: 'Càn', star: 'Phục Vị', good: true, desc: 'Cát: Giữ vững uy quyền và vị thế.' },
        { dir: 'Chính Nam', cungLV: 'Ly', star: 'Tuyệt Mạng', good: false, desc: 'Đại hung hướng: Hỏa khắc Kim, kỵ mở cổng/cửa chính.' },
        { dir: 'Chính Đông', cungLV: 'Chấn', star: 'Ngũ Quỷ', good: false, desc: 'Hung hướng: Dễ vướng tranh chấp.' },
        { dir: 'Chính Bắc', cungLV: 'Khảm', star: 'Lục Sát', good: false, desc: 'Hung hướng: Tiết khí bản mệnh.' },
        { dir: 'Đông Nam', cungLV: 'Khôn (LV) / Tốn (VV)', star: 'Họa Hại', good: false, desc: 'Hung hướng: Hao tán nhỏ.' }
      ],
      'Khôn': [
        { dir: 'Đông Bắc', cungLV: 'Cấn', star: 'Sinh Khí', good: true, desc: 'Thượng cát: Điền trạch vượng phát, con cháu thành đạt.' },
        { dir: 'Chính Tây', cungLV: 'Đoài', star: 'Thiên Y', good: true, desc: 'Thượng cát: Quý nhân phù trợ, tài lộc hanh thông.' },
        { dir: 'Tây Bắc', cungLV: 'Càn', star: 'Diên Niên (Phúc Đức)', good: true, desc: 'Thượng cát: Càn Khôn phối ngẫu, gia đạo đại cát.' },
        { dir: 'Tây Nam', cungLV: 'Tốn (LV) / Khôn (VV)', star: 'Phục Vị', good: true, desc: 'Cát: Lưu ý đối chiếu phương Đông Nam – Tây Nam theo Hà Đồ phối Hậu Thiên Lạc Việt.' },
        { dir: 'Chính Bắc', cungLV: 'Khảm', star: 'Tuyệt Mạng', good: false, desc: 'Đại hung hướng: Tránh làm hướng cửa chính.' },
        { dir: 'Đông Nam', cungLV: 'Khôn (LV) / Tốn (VV)', star: 'Ngũ Quỷ', good: false, desc: 'Cần khảo sát thực địa Loan Đầu & Huyền Không khi mở cửa hướng này.' },
        { dir: 'Chính Nam', cungLV: 'Ly', star: 'Lục Sát', good: false, desc: 'Hung hướng: Khí hỏa quá táo.' },
        { dir: 'Chính Đông', cungLV: 'Chấn', star: 'Họa Hại', good: false, desc: 'Hung hướng: Mộc khắc Thổ.' }
      ],
      'Cấn': [
        { dir: 'Tây Nam', cungLV: 'Tốn (LV) / Khôn (VV)', star: 'Sinh Khí', good: true, desc: 'Thượng cát: Vạn vật chung thủy tại Cấn (Quái Địa Cầu), điền sản đại vượng.' },
        { dir: 'Tây Bắc', cungLV: 'Càn', star: 'Thiên Y', good: true, desc: 'Thượng cát: Thiên Y hộ mệnh, phúc lộc dồi dào.' },
        { dir: 'Chính Tây', cungLV: 'Đoài', star: 'Diên Niên (Phúc Đức)', good: true, desc: 'Thượng cát: Gia đạo ấm êm, nhân duyên bền chặt.' },
        { dir: 'Đông Bắc', cungLV: 'Cấn', star: 'Phục Vị', good: true, desc: 'Cát: Tĩnh tại, vững bền như núi.' },
        { dir: 'Đông Nam', cungLV: 'Khôn (LV) / Tốn (VV)', star: 'Tuyệt Mạng', good: false, desc: 'Đại hung hướng: Kỵ hướng nhà, hợp đặt khu vệ sinh/bếp trấn sát.' },
        { dir: 'Chính Bắc', cungLV: 'Khảm', star: 'Ngũ Quỷ', good: false, desc: 'Hung hướng: Dễ hao tài, bất an.' },
        { dir: 'Chính Đông', cungLV: 'Chấn', star: 'Lục Sát', good: false, desc: 'Hung hướng: Mộc khắc Thổ.' },
        { dir: 'Chính Nam', cungLV: 'Ly', star: 'Họa Hại', good: false, desc: 'Hung hướng: Dễ sinh nóng nảy.' }
      ],
      'Đoài': [
        { dir: 'Tây Bắc', cungLV: 'Càn', star: 'Sinh Khí', good: true, desc: 'Thượng cát: Công danh rạng rỡ, quý quyền hội tụ.' },
        { dir: 'Tây Nam', cungLV: 'Tốn (LV) / Khôn (VV)', star: 'Thiên Y', good: true, desc: 'Thượng cát: Sức khỏe viên mãn, tài nguyên dồi dào.' },
        { dir: 'Đông Bắc', cungLV: 'Cấn', star: 'Diên Niên (Phúc Đức)', good: true, desc: 'Thượng cát: Sơn Trạch Thông Khí, gia đình hòa hợp.' },
        { dir: 'Chính Tây', cungLV: 'Đoài', star: 'Phục Vị', good: true, desc: 'Cát: Vững vàng, tụ lộc.' },
        { dir: 'Chính Đông', cungLV: 'Chấn', star: 'Tuyệt Mạng', good: false, desc: 'Đại hung hướng: Kim Mộc giao chiến, tránh mở cửa chính.' },
        { dir: 'Chính Nam', cungLV: 'Ly', star: 'Ngũ Quỷ', good: false, desc: 'Hung hướng: Hỏa khắc Kim.' },
        { dir: 'Đông Nam', cungLV: 'Khôn (LV) / Tốn (VV)', star: 'Lục Sát', good: false, desc: 'Hung hướng: Dễ vướng thị phi.' },
        { dir: 'Chính Bắc', cungLV: 'Khảm', star: 'Họa Hại', good: false, desc: 'Hung hướng: Tiết khí Kim.' }
      ]
    };

    // Tính Phi Tinh Lầu (Chọn tầng chung cư hợp mệnh theo Bài 10 Phần B Thiên Luân Lạc Việt)
    const floors = [];
    const HANH_TANG = ['Thủy', 'Hỏa', 'Mộc', 'Kim', 'Thổ']; // 1-6 Thủy, 2-7 Hỏa, 3-8 Mộc, 4-9 Kim, 5-10 Thổ (Số Hà Đồ!)
    for (let f = 1; f <= 30; f++) {
      const mod5 = f % 5;
      let fHanh = 'Thổ';
      if (mod5 === 1) fHanh = 'Thủy';      // 1, 6, 11, 16, 21, 26
      else if (mod5 === 2) fHanh = 'Hỏa';  // 2, 7, 12, 17, 22, 27
      else if (mod5 === 3) fHanh = 'Mộc';  // 3, 8, 13, 18, 23, 28
      else if (mod5 === 4) fHanh = 'Kim';  // 4, 9, 14, 19, 24, 29
      else fHanh = 'Thổ';                  // 5, 10, 15, 20, 25, 30

      const rel = AL.compareNguHanh(fHanh, yInfo.lacVietHanh);
      if (rel.score > 0) {
        floors.push({ floor: f, hanh: fHanh, rel: rel.rel });
      }
    }

    return {
      birthYear,
      gender,
      yInfo,
      starNum,
      quaiData,
      baseQuai,
      directions: BAT_TRACH_DIRECTIONS[baseQuai] || BAT_TRACH_DIRECTIONS['Khảm'],
      goodFloors: floors
    };
  }

  // ============================================================================
  // LẠC VIỆT ĐỘN TOÁN & CHU DỊCH LẠC VIỆT (64 QUẺ)
  // ============================================================================
  const BAT_QUAI_8 = [
    { idx: 1, name: 'Càn',  symbol: '☰', lines: [1, 1, 1], hanhLV: 'Kim đới Thủy (1-6 Hà Đồ)', nature: 'Trời – Cương kiện, chính trực, người đứng đầu' },
    { idx: 2, name: 'Đoài', symbol: '☱', lines: [1, 1, 0], hanhLV: 'Dương Kim (4-9 Hà Đồ)',     nature: 'Đầm – Hỷ duyệt, ngôn ngữ, giao tế, tài chính' },
    { idx: 3, name: 'Ly',   symbol: '☲', lines: [1, 0, 1], hanhLV: 'Dương Hỏa (2-7 Hà Đồ)',     nature: 'Lửa – Văn minh, sáng suốt, danh tiếng, giấy tờ' },
    { idx: 4, name: 'Chấn', symbol: '☳', lines: [1, 0, 0], hanhLV: 'Dương Mộc (3-8 Hà Đồ)',     nature: 'Sấm – Khởi động, biến chuyển nhanh, tiên phong' },
    { idx: 5, name: 'Tốn',  symbol: '☴', lines: [0, 1, 1], hanhLV: 'Âm Kim (Lạc Việt) / Mộc',   nature: 'Gió – Thuận nhập, linh hoạt, thương mại, đi xa' },
    { idx: 6, name: 'Khảm', symbol: '☵', lines: [0, 1, 0], hanhLV: 'Dương Thủy (1-6 Hà Đồ)',    nature: 'Nước – Trí tuệ sâu sắc, hiểm trở, lưu thông' },
    { idx: 7, name: 'Cấn',  symbol: '☶', lines: [0, 0, 1], hanhLV: 'Âm Mộc / Thổ (Quái Địa Cầu)', nature: 'Núi – Tĩnh tại, giữ vững, hoàn thành và khởi đầu' },
    { idx: 8, name: 'Khôn', symbol: '☷', lines: [0, 0, 0], hanhLV: 'Âm Hỏa đới Thổ (Lạc Việt)', nature: 'Đất – Bao dung, nhu thuận, nuôi dưỡng, điền sản' }
  ];

  const QUE_64_NAMES = {
    '1-1': 'Thuần Càn (Khốn Long Đắc Thủy – Đại Cát)',
    '8-8': 'Thuần Khôn (Ngạ Hổ Đắc Thực – Đại Cát)',
    '6-4': 'Thủy Lôi Truân (Vạn Vật Khởi Đầu Nan – Kiên Trì Tốt)',
    '7-6': 'Sơn Thủy Mộng (Khai Mở Trí Tuệ – Cần Thầy Dẫn Dắt)',
    '6-1': 'Thủy Thiên Nhu (Chờ Thời Đợi Cơ – Nhẫn Nại Thành Công)',
    '1-6': 'Thiên Thủy Tụng (Đề Phòng Tranh Chấp – Nên Hòa Giải)',
    '8-6': 'Địa Thủy Sư (Tập Hợp Lực Lượng – Kỷ Luật Nghiêm Minh)',
    '6-8': 'Thủy Địa Tỷ (Thân Phụ Tương Hòa – Hợp Tác Đại Lợi)',
    '5-1': 'Phong Thiên Tiểu Súc (Tích Lũy Nhỏ – Chưa Nên Mạo Hiểm)',
    '1-2': 'Thiên Trạch Lý (Giữ Lễ Nghĩa – Cẩn Trọng Bước Đi)',
    '8-1': 'Địa Thiên Thái (Thiên Địa Giao Thái – Vạn Sự Hanh Thông)',
    '1-8': 'Thiên Địa Bĩ (Bĩ Cực Thái Lai – Giữ Mình Chờ Vận)',
    '1-3': 'Thiên Hỏa Đồng Nhân (Đồng Tâm Hiệp Lực – Quý Nhân Trợ Giúp)',
    '3-1': 'Hỏa Thiên Đại Hữu (Mặt Trời Giữa Trưa – Tài Lộc Rực Rỡ)',
    '8-7': 'Địa Sơn Khiêm (Khiêm Cung Đắc Phúc – Trong Ngoài Đều Lợi)',
    '4-8': 'Lôi Địa Dự (An Vui Thuận Động – Khởi Sự Thuận Lợi)',
    '2-4': 'Trạch Lôi Tùy (Thuận Thời Tùy Thế – Đắc Lợi Tự Nhiên)',
    '7-5': 'Sơn Phong Cổ (Chấn Chỉnh Cái Cũ – Cải Tổ Để Phát Triển)',
    '8-2': 'Địa Trạch Lâm (Dương Khí Tăng Trưởng – Cơ Hội Đang Tới)',
    '5-8': 'Phong Địa Quan (Quan Sát Thấu Đáo – Chưa Vội Hành Động)',
    '3-4': 'Hỏa Lôi Phệ Hạp (Phá Bỏ Vật Cản – Minh Bạch Pháp Lý)',
    '7-3': 'Sơn Hỏa Bí (Văn Hoa Sáng Sủa – Tốt Cho Danh Tiếng)',
    '7-8': 'Sơn Địa Bác (Khí Dương Suy Giảm – Phòng Hao Tán)',
    '8-4': 'Địa Lôi Phục (Nhất Dương Lai Phục – Khởi Đầu Vận Mới)',
    '1-4': 'Thiên Lôi Vô Vọng (Thuận Theo Tự Nhiên – Không Cầu Phi Pháp)',
    '7-1': 'Sơn Thiên Đại Súc (Tích Trữ Lớn – Đại Thành Công)',
    '7-4': 'Sơn Lôi Di (Cẩn Trọng Lời Nói & Dưỡng Thân)',
    '2-5': 'Trạch Phong Đại Quá (Gánh Vác Quá Sức – Cần Điểm Tựa)',
    '6-6': 'Thuần Khảm (Vượt Qua Hiểm Trở Bằng Trí Tuệ)',
    '3-3': 'Thuần Ly (Quang Minh Chính Đại – Nương Tựa Chính Đạo)',
    '2-7': 'Trạch Sơn Hàm (Cảm Ứng Tự Nhiên – Hôn Nhân Tình Cảm Đại Cát)',
    '4-5': 'Lôi Phong Hằng (Bền Bỉ Trường Cửu – Giữ Đạo Vợ Chồng)',
    '1-7': 'Thiên Sơn Độn (Lùi Một Bước Để Tiến Ba Bước)',
    '4-1': 'Lôi Thiên Đại Tráng (Khí Thế Hùng Mạnh – Tránh Chủ Quan)',
    '3-8': 'Hỏa Địa Tấn (Mặt Trời Mọc Lên – Thăng Tiến Vượt Bậc)',
    '8-3': 'Địa Hỏa Minh Di (Giấu Tài Chờ Thời – Tránh Thị Phi)',
    '5-3': 'Phong Hỏa Gia Nhân (Gia Đạo Hòa Thuận – Gốc Rễ Vững Vàng)',
    '3-2': 'Hỏa Trạch Khuê (Khác Biệt Quan Điểm – Cầu Đồng Tồn Dị)',
    '6-7': 'Thủy Sơn Kiển (Trước Khó Sau Dễ – Tìm Quý Nhân Tây Nam)',
    '4-6': 'Lôi Thủy Giải (Mưa Xuân Giải Hạn – Mọi Sự Thông Suốt)',
    '7-2': 'Sơn Trạch Tổn (Bớt Trước Thêm Sau – Đầu Tư Dài Hạn)',
    '5-4': 'Phong Lôi Ích (Gió Sấm Tương Trợ – Đại Lợi Khởi Sự)',
    '2-1': 'Trạch Thiên Quải (Quyết Đoán Dứt Khoát – Tránh Nóng Vội)',
    '1-5': 'Thiên Phong Cấu (Gặp Gỡ Bất Ngờ – Cẩn Trọng Duyên Lạ)',
    '2-8': 'Trạch Địa Tụy (Quần Anh Hội Tụ – Đại Lợi Hợp Tác Cầu Tài)',
    '8-5': 'Địa Phong Thăng (Cây Mọc Từ Đất – Từng Bước Lên Cao)',
    '2-6': 'Trạch Thủy Khốn (Tạm Thời Bế Tắc – Giữ Vững Chí Khí)',
    '6-5': 'Thủy Phong Tỉnh (Giếng Nước Nguồn Trong – Bền Bỉ Nuôi Dưỡng)',
    '2-3': 'Trạch Hỏa Cách (Đổi Mới Triệt Để – Thay Cũ Đổi Mới)',
    '3-5': 'Hỏa Phong Đỉnh (Vạc Vàng Vững Chãi – Đắc Quyền Đắc Lộc)',
    '4-4': 'Thuần Chấn (Sấm Rền Bốn Phương – Bình Tĩnh Tự Tin)',
    '7-7': 'Thuần Cấn (Biết Điểm Dừng Đúng Lúc – An Định Tâm Trí)',
    '5-7': 'Phong Sơn Tiệm (Tuần Tự Tiến Lên – Hôn Nhân Công Danh Bền Vững)',
    '4-2': 'Lôi Trạch Quy Muội (Tránh Vội Vàng Cảm Tính)',
    '4-3': 'Lôi Hỏa Phong (Thịnh Vượng Sung Túc – Giữ Gìn Lúc Đỉnh Cao)',
    '3-7': 'Hỏa Sơn Lữ (Đi Xa Cầu Tài – Cẩn Trọng Nơi Đất Khách)',
    '5-5': 'Thuần Tốn (Thuận Theo Gió Lành – Khiêm Nhu Đắc Lợi)',
    '2-2': 'Thuần Đoài (Hỷ Khí Đầy Nhà – Hòa Khí Sinh Tài)',
    '5-6': 'Phong Thủy Hoán (Tan Băng Tuyết – Hóa Giải Hiềm Khích)',
    '6-2': 'Thủy Trạch Tiết (Tiết Độ Chừng Mực – Quản Lý Tài Chính)',
    '5-2': 'Phong Trạch Trung Phu (Tín Nghĩa Chân Thành – Cảm Hóa Lòng Người)',
    '4-7': 'Lôi Sơn Tiểu Quá (Việc Nhỏ Khả Thành – Việc Lớn Khoan Làm)',
    '6-3': 'Thủy Hỏa Ký Tế (Âm Dương Quân Bình – Mọi Việc Đã Thành)',
    '3-6': 'Hỏa Thủy Vị Tế (Chưa Hoàn Tất – Chuẩn Bị Cho Chu Kỳ Mới)'
  };

  function castLacVietDonToan({ question = 'Hỏi việc khởi sự, cầu tài, gia đạo', method = 'time', customSeeds = null, customLines6 = null, customHaoDong = null }) {
    const now = new Date();
    const full = AL.getFullDateCanChi(now.getDate(), now.getMonth() + 1, now.getFullYear(), Math.floor(((now.getHours() + 1) % 24) / 2));
    const yNum = full.yearInfo.chiIdx + 1;
    const mNum = full.lunar.lunarMonth;
    const dNum = full.lunar.lunarDay;
    const hNum = full.hour.chiIdx + 1;

    function findQuaiByLines(l3) {
      return BAT_QUAI_8.find(q => q.lines[0] === l3[0] && q.lines[1] === l3[1] && q.lines[2] === l3[2]) || BAT_QUAI_8[0];
    }

    let thuongIdx, haIdx, haoDong, quaiThuong, quaiHa, lines6;
    if (Array.isArray(customLines6) && customLines6.length === 6) {
      lines6 = customLines6.map(v => (v ? 1 : 0));
      quaiHa = findQuaiByLines([lines6[0], lines6[1], lines6[2]]);
      quaiThuong = findQuaiByLines([lines6[3], lines6[4], lines6[5]]);
      haIdx = quaiHa.idx;
      thuongIdx = quaiThuong.idx;
      haoDong = (customHaoDong >= 1 && customHaoDong <= 6) ? customHaoDong : ((yNum + mNum + dNum + hNum) % 6 || 6);
    } else if (method === 'coins' && Array.isArray(customSeeds) && customSeeds.length === 3) {
      thuongIdx = ((customSeeds[0] - 1) % 8 + 8) % 8 + 1;
      haIdx = ((customSeeds[1] - 1) % 8 + 8) % 8 + 1;
      haoDong = ((customSeeds[2] - 1) % 6 + 6) % 6 + 1;
      quaiThuong = BAT_QUAI_8[thuongIdx - 1];
      quaiHa = BAT_QUAI_8[haIdx - 1];
      lines6 = [...quaiHa.lines, ...quaiThuong.lines];
    } else {
      const sumThuong = yNum + mNum + dNum;
      const sumHa = sumThuong + hNum;
      thuongIdx = sumThuong % 8 === 0 ? 8 : sumThuong % 8;
      haIdx = sumHa % 8 === 0 ? 8 : sumHa % 8;
      haoDong = sumHa % 6 === 0 ? 6 : sumHa % 6;
      quaiThuong = BAT_QUAI_8[thuongIdx - 1];
      quaiHa = BAT_QUAI_8[haIdx - 1];
      lines6 = [...quaiHa.lines, ...quaiThuong.lines];
    }

    // Quẻ Hỗ (hào 2,3,4 làm Hạ quái Hỗ; hào 3,4,5 làm Thượng quái Hỗ)
    const hoHa = findQuaiByLines([lines6[1], lines6[2], lines6[3]]);
    const hoThuong = findQuaiByLines([lines6[2], lines6[3], lines6[4]]);

    // Quẻ Biến (Đảo âm dương tại hào động 1..6)
    const linesBien = [...lines6];
    linesBien[haoDong - 1] = linesBien[haoDong - 1] === 1 ? 0 : 1;
    const bienHa = findQuaiByLines([linesBien[0], linesBien[1], linesBien[2]]);
    const bienThuong = findQuaiByLines([linesBien[3], linesBien[4], linesBien[5]]);

    const queChuName = QUE_64_NAMES[`${thuongIdx}-${haIdx}`] || `${quaiThuong.name} ${quaiHa.name}`;
    const queHoName = QUE_64_NAMES[`${hoThuong.idx}-${hoHa.idx}`] || `${hoThuong.name} ${hoHa.name}`;
    const queBienName = QUE_64_NAMES[`${bienThuong.idx}-${bienHa.idx}`] || `${bienThuong.name} ${bienHa.name}`;

    // Phân định Thể - Dụng (Quái không có hào động là Thể, Quái có hào động là Dụng)
    const theQuai = haoDong <= 3 ? quaiThuong : quaiHa;
    const dungQuai = haoDong <= 3 ? quaiHa : quaiThuong;
    const bienDungQuai = haoDong <= 3 ? bienHa : bienThuong;

    function baseHanhOfQuai(qName) {
      // Theo Hà Đồ phối Hậu Thiên Lạc Việt của Sư Phụ Thiên Sứ:
      // Khảm (Thủy), Càn (Kim), Đoài (Kim), Tốn (Kim Lạc Việt), Chấn (Mộc), Cấn (Mộc/Thổ), Ly (Hỏa), Khôn (Hỏa đới Thổ)
      const map = { 'Khảm': 'Thủy', 'Càn': 'Kim', 'Đoài': 'Kim', 'Tốn': 'Kim', 'Chấn': 'Mộc', 'Cấn': 'Thổ', 'Ly': 'Hỏa', 'Khôn': 'Thổ' };
      return map[qName] || 'Thổ';
    }

    const theHanh = baseHanhOfQuai(theQuai.name);
    const dungHanh = baseHanhOfQuai(dungQuai.name);
    const bienHanh = baseHanhOfQuai(bienDungQuai.name);

    const theVsDung = AL.compareNguHanh(theHanh, dungHanh);
    const theVsBien = AL.compareNguHanh(theHanh, bienHanh);

    let conclusion = '';
    if (theVsDung.rel.includes('Được Sinh') || theVsBien.rel.includes('Được Sinh')) {
      conclusion = `🌟 ĐẠI CÁT ĐẮC LỢI: Quẻ Dụng/Biến tương sinh cho Quẻ Thể (${theQuai.name} – ${theHanh}). Sự việc "${question}" được thiên thời và quý nhân nâng đỡ, không tốn nhiều sức mà thành tựu mỹ mãn!`;
    } else if (theVsDung.rel.includes('Tương Hòa') && theVsBien.score >= 0) {
      conclusion = `✨ TƯƠNG HÒA THUẬN LỢI: Thể và Dụng đồng khí tương cầu (${theHanh}). Hợp tác, giao dịch hay mưu sự đều suôn sẻ, có đồng minh đắc lực.`;
    } else if (theVsDung.rel.includes('Thuận Sinh')) {
      conclusion = `⚖️ TIẾT KHÍ TRƯỚC, THU THÀNH QUẢ SAU: Quẻ Thể (${theHanh}) sinh xuất cho Quẻ Dụng (${dungHanh}). Giai đoạn đầu cần đầu tư công sức, tâm huyết hoặc chi phí trước, kết quả về sau (${queBienName}) sẽ ổn thỏa.`;
    } else if (theVsDung.rel.includes('Khắc Xuất')) {
      conclusion = `💪 CHẾ KHẮC ĐỂ THÀNH CÔNG: Quẻ Thể (${theHanh}) khắc chế được Quẻ Dụng (${dungHanh}). Việc tuy có thử thách nhưng nằm trong tầm kiểm soát của bạn; kiên quyết chủ động ắt thành.`;
    } else {
      conclusion = `⚠️ Dụng Khắc Thể (${dungHanh} khắc ${theHanh}): Thời cơ hiện tại còn lực cản khách quan. Theo nguyên lý Lạc Việt Độn Toán, nên hoãn bước tiến, chọn Giờ Quý Nhân Đăng Thiên Môn hoặc nhờ người có hành trung gian thông quan trợ giúp.`;
    }

    return {
      question,
      timestampStr: `${now.getHours()}h${String(now.getMinutes()).padStart(2, '0')} ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} (${full.day.canChi}, giờ ${full.hour.canChi})`,
      haoDong,
      quaiThuong,
      quaiHa,
      queChuName,
      queHoName,
      queBienName,
      lines6,
      linesBien,
      theQuai,
      dungQuai,
      bienDungQuai,
      theHanh,
      dungHanh,
      bienHanh,
      theVsDung,
      theVsBien,
      conclusion
    };
  }

  window.LacVietTuViPhongThuy = {
    CUNG_12_NAMES,
    check5GioPhamTreEm,
    generateTuViChart,
    calculateBatTrachLacViet,
    BAT_QUAI_8,
    QUE_64_NAMES,
    castLacVietDonToan
  };
})();
