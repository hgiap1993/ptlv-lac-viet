// ============================================================================
// ENGINE 1: ÂM DƯƠNG LỊCH VIỆT NAM (UTC+7), CAN CHI, TIẾT KHÍ & LẠC THƯ HOA GIÁP
// Cơ sở lý thuyết: Đại Sư Phụ Thiên Sứ Nguyễn Vũ Tuấn Anh & Các Sư Huynh Lạc Việt
// ============================================================================

(function () {
  const PI = Math.PI;
  function INT(d) { return Math.floor(d); }

  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const CON_GIAP = ['Chuột (Tý)', 'Trâu (Sửu)', 'Hổ (Dần)', 'Mèo (Mão)', 'Rồng (Thìn)', 'Rắn (Tỵ)', 'Ngựa (Ngọ)', 'Dê (Mùi)', 'Khỉ (Thân)', 'Gà (Dậu)', 'Chó (Tuất)', 'Hợi (Heo)'];

  // Ngũ hành của Thiên Can & Địa Chi
  const CAN_HANH = {
    'Giáp': 'Mộc', 'Ất': 'Mộc',
    'Bính': 'Hỏa', 'Đinh': 'Hỏa',
    'Mậu': 'Thổ', 'Kỷ': 'Thổ',
    'Canh': 'Kim', 'Tân': 'Kim',
    'Nhâm': 'Thủy', 'Quý': 'Thủy'
  };
  const CAN_AM_DUONG = {
    'Giáp': 'Dương', 'Ất': 'Âm', 'Bính': 'Dương', 'Đinh': 'Âm', 'Mậu': 'Dương',
    'Kỷ': 'Âm', 'Canh': 'Dương', 'Tân': 'Âm', 'Nhâm': 'Dương', 'Quý': 'Âm'
  };
  const CHI_HANH = {
    'Tý': 'Thủy', 'Hợi': 'Thủy',
    'Dần': 'Mộc', 'Mão': 'Mộc',
    'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa',
    'Thân': 'Kim', 'Dậu': 'Kim',
    'Thìn': 'Thổ', 'Tuất': 'Thổ', 'Sửu': 'Thổ', 'Mùi': 'Thổ'
  };

  // Bảng 30 cặp Nạp Âm (60 năm): So sánh Cổ thư Hán (Lục Thập Hoa Giáp) và Lạc Thư Hoa Giáp (Lạc Việt - Hoán vị Thủy & Hỏa)
  const NAP_AM_30 = [
    { idx: 0,  years: ['Giáp Tý', 'Ất Sửu'],     hanName: 'Hải Trung Kim',   hanHanh: 'Kim',  lacVietHanh: 'Kim',  lacVietName: 'Hải Trung Kim (Chính Kim)',       swapped: false },
    { idx: 1,  years: ['Bính Dần', 'Đinh Mão'],  hanName: 'Lư Trung Hỏa',    hanHanh: 'Hỏa',  lacVietHanh: 'Thủy', lacVietName: 'Lạc Thư Thủy (Hoán vị từ Lư Trung Hỏa)', swapped: true },
    { idx: 2,  years: ['Mậu Thìn', 'Kỷ Tỵ'],     hanName: 'Đại Lâm Mộc',     hanHanh: 'Mộc',  lacVietHanh: 'Mộc',  lacVietName: 'Đại Lâm Mộc (Chính Mộc)',         swapped: false },
    { idx: 3,  years: ['Canh Ngọ', 'Tân Mùi'],   hanName: 'Lộ Bàng Thổ',     hanHanh: 'Thổ',  lacVietHanh: 'Thổ',  lacVietName: 'Lộ Bàng Thổ (Chính Thổ)',         swapped: false },
    { idx: 4,  years: ['Nhâm Thân', 'Quý Dậu'],  hanName: 'Kiếm Phong Kim',  hanHanh: 'Kim',  lacVietHanh: 'Kim',  lacVietName: 'Kiếm Phong Kim (Chính Kim)',      swapped: false },
    { idx: 5,  years: ['Giáp Tuất', 'Ất Hợi'],   hanName: 'Sơn Đầu Hỏa',     hanHanh: 'Hỏa',  lacVietHanh: 'Thủy', lacVietName: 'Lạc Thư Thủy (Hoán vị từ Sơn Đầu Hỏa)',  swapped: true },
    { idx: 6,  years: ['Bính Tý', 'Đinh Sửu'],   hanName: 'Giản Hạ Thủy',    hanHanh: 'Thủy', lacVietHanh: 'Hỏa',  lacVietName: 'Lạc Thư Hỏa (Hoán vị từ Giản Hạ Thủy)',  swapped: true },
    { idx: 7,  years: ['Mậu Dần', 'Kỷ Mão'],     hanName: 'Thành Đầu Thổ',   hanHanh: 'Thổ',  lacVietHanh: 'Thổ',  lacVietName: 'Thành Đầu Thổ (Chính Thổ)',       swapped: false },
    { idx: 8,  years: ['Canh Thìn', 'Tân Tỵ'],   hanName: 'Bạch Lạp Kim',    hanHanh: 'Kim',  lacVietHanh: 'Kim',  lacVietName: 'Bạch Lạp Kim (Chính Kim)',        swapped: false },
    { idx: 9,  years: ['Nhâm Ngọ', 'Quý Mùi'],   hanName: 'Dương Liễu Mộc',  hanHanh: 'Mộc',  lacVietHanh: 'Mộc',  lacVietName: 'Dương Liễu Mộc (Chính Mộc)',      swapped: false },
    { idx: 10, years: ['Giáp Thân', 'Ất Dậu'],   hanName: 'Tuyền Trung Thủy',hanHanh: 'Thủy', lacVietHanh: 'Hỏa',  lacVietName: 'Lạc Thư Hỏa (Hoán vị từ Tuyền Trung Thủy)', swapped: true },
    { idx: 11, years: ['Bính Tuất', 'Đinh Hợi'], hanName: 'Ốc Thượng Thổ',   hanHanh: 'Thổ',  lacVietHanh: 'Thổ',  lacVietName: 'Ốc Thượng Thổ (Chính Thổ)',       swapped: false },
    { idx: 12, years: ['Mậu Tý', 'Kỷ Sửu'],      hanName: 'Tích Lịch Hỏa',   hanHanh: 'Hỏa',  lacVietHanh: 'Thủy', lacVietName: 'Lạc Thư Thủy (Hoán vị từ Tích Lịch Hỏa)', swapped: true },
    { idx: 13, years: ['Canh Dần', 'Tân Mão'],   hanName: 'Tùng Bách Mộc',   hanHanh: 'Mộc',  lacVietHanh: 'Mộc',  lacVietName: 'Tùng Bách Mộc (Chính Mộc)',       swapped: false },
    { idx: 14, years: ['Nhâm Thìn', 'Quý Tỵ'],   hanName: 'Trường Lưu Thủy', hanHanh: 'Thủy', lacVietHanh: 'Hỏa',  lacVietName: 'Lạc Thư Hỏa (Hoán vị từ Trường Lưu Thủy)', swapped: true },
    { idx: 15, years: ['Giáp Ngọ', 'Ất Mùi'],    hanName: 'Sa Trung Kim',    hanHanh: 'Kim',  lacVietHanh: 'Kim',  lacVietName: 'Sa Trung Kim (Chính Kim)',        swapped: false },
    { idx: 16, years: ['Bính Thân', 'Đinh Dậu'], hanName: 'Sơn Hạ Hỏa',      hanHanh: 'Hỏa',  lacVietHanh: 'Thủy', lacVietName: 'Lạc Thư Thủy (Hoán vị từ Sơn Hạ Hỏa)',    swapped: true },
    { idx: 17, years: ['Mậu Tuất', 'Kỷ Hợi'],    hanName: 'Bình Địa Mộc',    hanHanh: 'Mộc',  lacVietHanh: 'Mộc',  lacVietName: 'Bình Địa Mộc (Chính Mộc)',        swapped: false },
    { idx: 18, years: ['Canh Tý', 'Tân Sửu'],    hanName: 'Bích Thượng Thổ', hanHanh: 'Thổ',  lacVietHanh: 'Thổ',  lacVietName: 'Bích Thượng Thổ (Chính Thổ)',     swapped: false },
    { idx: 19, years: ['Nhâm Dần', 'Quý Mão'],   hanName: 'Kim Bạc Kim',     hanHanh: 'Kim',  lacVietHanh: 'Kim',  lacVietName: 'Kim Bạc Kim (Chính Kim)',         swapped: false },
    { idx: 20, years: ['Giáp Thìn', 'Ất Tỵ'],    hanName: 'Phú Đăng Hỏa',    hanHanh: 'Hỏa',  lacVietHanh: 'Thủy', lacVietName: 'Lạc Thư Thủy (Hoán vị từ Phú Đăng Hỏa)',  swapped: true },
    { idx: 21, years: ['Bính Ngọ', 'Đinh Mùi'],  hanName: 'Thiên Hà Thủy',   hanHanh: 'Thủy', lacVietHanh: 'Hỏa',  lacVietName: 'Lạc Thư Hỏa (Hoán vị từ Thiên Hà Thủy)',  swapped: true },
    { idx: 22, years: ['Mậu Thân', 'Kỷ Dậu'],    hanName: 'Đại Trạch Thổ',   hanHanh: 'Thổ',  lacVietHanh: 'Thổ',  lacVietName: 'Đại Trạch Thổ (Chính Thổ)',       swapped: false },
    { idx: 23, years: ['Canh Tuất', 'Tân Hợi'],  hanName: 'Thoa Xuyến Kim',  hanHanh: 'Kim',  lacVietHanh: 'Kim',  lacVietName: 'Thoa Xuyến Kim (Chính Kim)',      swapped: false },
    { idx: 24, years: ['Nhâm Tý', 'Quý Sửu'],    hanName: 'Tang Đố Mộc',     hanHanh: 'Mộc',  lacVietHanh: 'Mộc',  lacVietName: 'Tang Đố Mộc (Chính Mộc)',         swapped: false },
    { idx: 25, years: ['Giáp Dần', 'Ất Mão'],    hanName: 'Đại Khê Thủy',    hanHanh: 'Thủy', lacVietHanh: 'Hỏa',  lacVietName: 'Lạc Thư Hỏa (Hoán vị từ Đại Khê Thủy)',   swapped: true },
    { idx: 26, years: ['Bính Thìn', 'Đinh Tỵ'],  hanName: 'Sa Trung Thổ',    hanHanh: 'Thổ',  lacVietHanh: 'Thổ',  lacVietName: 'Sa Trung Thổ (Chính Thổ)',        swapped: false },
    { idx: 27, years: ['Mậu Ngọ', 'Kỷ Mùi'],     hanName: 'Thiên Thượng Hỏa',hanHanh: 'Hỏa',  lacVietHanh: 'Thủy', lacVietName: 'Lạc Thư Thủy (Hoán vị từ Thiên Thượng Hỏa)', swapped: true },
    { idx: 28, years: ['Canh Thân', 'Tân Dậu'],  hanName: 'Thạch Lựu Mộc',   hanHanh: 'Mộc',  lacVietHanh: 'Mộc',  lacVietName: 'Thạch Lựu Mộc (Chính Mộc)',       swapped: false },
    { idx: 29, years: ['Nhâm Tuất', 'Quý Hợi'],  hanName: 'Đại Hải Thủy',    hanHanh: 'Thủy', lacVietHanh: 'Hỏa',  lacVietName: 'Lạc Thư Hỏa (Hoán vị từ Đại Hải Thủy)',   swapped: true }
  ];

  // Quy luật Ngũ Hành Sinh - Khắc
  const NGU_HANH_SINH = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  const NGU_HANH_KHAC = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };

  function compareNguHanh(h1, h2) {
    if (!h1 || !h2) return { rel: 'Bình hòa', score: 0, desc: 'Chưa xác định' };
    if (h1 === h2) return { rel: 'Tương Hòa (Đồng hành)', score: 1, type: 'good', desc: `Đồng hành ${h1} – Tương trợ bình hòa, đồng thanh tương ứng.` };
    if (NGU_HANH_SINH[h1] === h2) return { rel: 'Thuận Sinh (Sinh xuất)', score: 2, type: 'very_good', desc: `${h1} sinh ${h2} – Dòng khí tương sinh thuận chiều, đại cát.` };
    if (NGU_HANH_SINH[h2] === h1) return { rel: 'Được Sinh (Sinh nhập)', score: 2, type: 'very_good', desc: `${h2} sinh ${h1} – Được tương sinh trợ lực, cát lành bền vững.` };
    if (NGU_HANH_KHAC[h1] === h2) return { rel: 'Khắc Xuất (Chế ước)', score: -1, type: 'bad', desc: `${h1} khắc ${h2} – Hao tổn nguyên khí để chế khắc.` };
    if (NGU_HANH_KHAC[h2] === h1) return { rel: 'Bị Khắc (Khắc nhập)', score: -2, type: 'very_bad', desc: `${h2} khắc ${h1} – Bị khắc chế trực diện, cần hành trung gian thông quan.` };
    return { rel: 'Bình hòa', score: 0, type: 'neutral', desc: 'Tương tác trung tính.' };
  }

  // Thiên Can Hợp Hóa & Tương Xung
  const CAN_HOP_HOA = {
    'Giáp-Kỷ': { hoa: 'Thổ', desc: 'Giáp – Kỷ hợp hóa Trung Chính Thổ (Trọng tín nghĩa, đôn hậu)' },
    'Kỷ-Giáp': { hoa: 'Thổ', desc: 'Kỷ – Giáp hợp hóa Trung Chính Thổ (Trọng tín nghĩa, đôn hậu)' },
    'Ất-Canh': { hoa: 'Kim', desc: 'Ất – Canh hợp hóa Nhân Nghĩa Kim (Quả quyết, trọng nghĩa khí)' },
    'Canh-Ất': { hoa: 'Kim', desc: 'Canh – Ất hợp hóa Nhân Nghĩa Kim (Quả quyết, trọng nghĩa khí)' },
    'Bính-Tân': { hoa: 'Thủy', desc: 'Bính – Tân hợp hóa Uy Chế Thủy (Thông tuệ, uy quyền)' },
    'Tân-Bính': { hoa: 'Thủy', desc: 'Tân – Bính hợp hóa Uy Chế Thủy (Thông tuệ, uy quyền)' },
    'Đinh-Nhâm': { hoa: 'Mộc', desc: 'Đinh – Nhâm hợp hóa Nhân Thọ Mộc (Nhân từ, giàu sinh khí)' },
    'Nhâm-Đinh': { hoa: 'Mộc', desc: 'Nhâm – Đinh hợp hóa Nhân Thọ Mộc (Nhân từ, giàu sinh khí)' },
    'Mậu-Quý': { hoa: 'Hỏa', desc: 'Mậu – Quý hợp hóa Vô Tình Hỏa (Văn chương, lễ nghi rực rỡ)' },
    'Quý-Mậu': { hoa: 'Hỏa', desc: 'Quý – Mậu hợp hóa Vô Tình Hỏa (Văn chương, lễ nghi rực rỡ)' }
  };

  const CAN_XUNG = {
    'Giáp': 'Canh', 'Canh': 'Giáp',
    'Ất': 'Tân', 'Tân': 'Ất',
    'Bính': 'Nhâm', 'Nhâm': 'Bính',
    'Đinh': 'Quý', 'Quý': 'Đinh'
  };

  // Địa Chi Lục Hợp, Tam Hợp, Lục Xung, Lục Hại, Tương Hình
  const CHI_LUC_HOP = {
    'Tý-Sửu': 'Hợp hóa Thổ', 'Sửu-Tý': 'Hợp hóa Thổ',
    'Dần-Hợi': 'Hợp hóa Mộc', 'Hợi-Dần': 'Hợp hóa Mộc',
    'Mão-Tuất': 'Hợp hóa Hỏa', 'Tuất-Mão': 'Hợp hóa Hỏa',
    'Thìn-Dậu': 'Hợp hóa Kim', 'Dậu-Thìn': 'Hợp hóa Kim',
    'Tỵ-Thân': 'Hợp hóa Thủy', 'Thân-Tỵ': 'Hợp hóa Thủy',
    'Ngọ-Mùi': 'Nhật Nguyệt Hợp', 'Mùi-Ngọ': 'Nhật Nguyệt Hợp'
  };

  const CHI_TAM_HOP = [
    { group: ['Thân', 'Tý', 'Thìn'], cuc: 'Thủy Cục' },
    { group: ['Dần', 'Ngọ', 'Tuất'], cuc: 'Hỏa Cục' },
    { group: ['Hợi', 'Mão', 'Mùi'], cuc: 'Mộc Cục' },
    { group: ['Tỵ', 'Dậu', 'Sửu'], cuc: 'Kim Cục' }
  ];

  const CHI_LUC_XUNG = {
    'Tý': 'Ngọ', 'Ngọ': 'Tý',
    'Sửu': 'Mùi', 'Mùi': 'Sửu',
    'Dần': 'Thân', 'Thân': 'Dần',
    'Mão': 'Dậu', 'Dậu': 'Mão',
    'Thìn': 'Tuất', 'Tuất': 'Thìn',
    'Tỵ': 'Hợi', 'Hợi': 'Tỵ'
  };

  const CHI_LUC_HAI = {
    'Tý': 'Mùi', 'Mùi': 'Tý',
    'Sửu': 'Ngọ', 'Ngọ': 'Sửu',
    'Dần': 'Tỵ', 'Tỵ': 'Dần',
    'Mão': 'Thìn', 'Thìn': 'Mão',
    'Thân': 'Hợi', 'Hợi': 'Thân',
    'Dậu': 'Tuất', 'Tuất': 'Dậu'
  };

  // Julian Day & Lunar Calendar Algorithm (Ho Ngoc Duc standard UTC+7)
  function jdFromDate(dd, mm, yy) {
    const a = INT((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    }
    return jd;
  }

  function jdToDate(jd) {
    let a, b, c;
    if (jd > 2299160) {
      a = jd + 32044;
      b = INT((4 * a + 3) / 146097);
      c = a - INT((b * 146097) / 4);
    } else {
      b = 0;
      c = jd + 32082;
    }
    const d = INT((4 * c + 3) / 1461);
    const e = c - INT((1461 * d) / 4);
    const m = INT((5 * e + 2) / 153);
    const day = e - INT((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * INT(m / 10);
    const year = b * 100 + d - 4800 + INT(m / 10);
    return [day, month, year];
  }

  function NewMoon(k) {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    let deltat;
    if (T < -11) {
      deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
      deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    return Jd1 + C1 - deltat;
  }

  function SunLongitude(jdn) {
    const T = (jdn - 2451545.0) / 36525;
    const T2 = T * T;
    const dr = PI / 180;
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    let L = L0 + DL;
    L = L * dr;
    L = L - PI * 2 * (INT(L / (PI * 2)));
    return L;
  }

  function getSunLongitude(dayNumber, timeZone) {
    return INT(SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6);
  }

  function getSolarTerm24(jd, timeZone = 7) {
    const deg = SunLongitude(jd - 0.5 - timeZone / 24) * 180 / PI;
    const idx = INT(((deg + 15) % 360) / 15);
    const terms = [
      'Xuân Phân', 'Thanh Minh', 'Cốc Vũ', 'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng',
      'Hạ Chí', 'Tiểu Thử', 'Đại Thử', 'Lập Thu', 'Xử Thử', 'Bạch Lộ',
      'Thu Phân', 'Hàn Lộ', 'Sương Giáng', 'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết',
      'Đông Chí', 'Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập'
    ];
    return { index: idx, name: terms[idx], degree: Math.round(deg * 10) / 10 };
  }

  function getNewMoonDay(k, timeZone) {
    return INT(NewMoon(k) + 0.5 + timeZone / 24);
  }

  function getLunarMonth11(yy, timeZone) {
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = INT(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    const sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
      nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }

  function getLeapMonthOffset(a11, timeZone) {
    const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }

  function convertSolar2Lunar(dd, mm, yy, timeZone = 7) {
    const dayNumber = jdFromDate(dd, mm, yy);
    const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = getNewMoonDay(k, timeZone);
    }
    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = getLunarMonth11(yy + 1, timeZone);
    }
    const lunarDay = dayNumber - monthStart + 1;
    const diff = INT((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }
    return {
      lunarDay,
      lunarMonth,
      lunarYear,
      lunarLeap,
      jd: dayNumber
    };
  }

  function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap = 0, timeZone = 7) {
    let a11, b11;
    if (lunarMonth < 11) {
      a11 = getLunarMonth11(lunarYear - 1, timeZone);
      b11 = getLunarMonth11(lunarYear, timeZone);
    } else {
      a11 = getLunarMonth11(lunarYear, timeZone);
      b11 = getLunarMonth11(lunarYear + 1, timeZone);
    }
    const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    let off = lunarMonth - 11;
    if (off < 0) {
      off += 12;
    }
    if (b11 - a11 > 365) {
      const leapOff = getLeapMonthOffset(a11, timeZone);
      let leapMonth = leapOff - 2;
      if (leapMonth < 0) {
        leapMonth += 12;
      }
      if (lunarLeap !== 0 && lunarMonth !== leapMonth) {
        return { day: 1, month: 1, year: lunarYear };
      } else if (lunarLeap !== 0 || off >= leapOff) {
        off += 1;
      }
    }
    const monthStart = getNewMoonDay(k + off, timeZone);
    return jdToDate(monthStart + lunarDay - 1);
  }

  // Lấy thông tin Can Chi - Nạp Âm Lạc Thư Hoa Giáp từ năm sinh (hoặc chỉ số 0..59)
  function getYearInfo(year) {
    const y = parseInt(year, 10);
    const canIdx = ((y + 6) % 10 + 10) % 10;
    const chiIdx = ((y + 8) % 12 + 12) % 12;
    const can = CAN[canIdx];
    const chi = CHI[chiIdx];
    const canChi = `${can} ${chi}`;

    // Tìm chỉ số 0..59 trong vòng 60 Hoa Giáp (Giáp Tý = 0)
    let cycle60 = 0;
    for (let i = 0; i < 60; i++) {
      if (i % 10 === canIdx && i % 12 === chiIdx) {
        cycle60 = i;
        break;
      }
    }
    const pairIdx = Math.floor(cycle60 / 2);
    const napAm = NAP_AM_30[pairIdx];

    const bulletDesc = (window.LYHOC_GIAPTY_BULLETS && window.LYHOC_GIAPTY_BULLETS[cycle60]) || '';
    const deepDesc = (window.LYHOC_GIAPTY_DEEP && window.LYHOC_GIAPTY_DEEP[cycle60]) || '';

    return {
      year: y,
      canIdx,
      chiIdx,
      can,
      chi,
      canChi,
      conGiap: CON_GIAP[chiIdx],
      canHanh: CAN_HANH[can],
      canAmDuong: CAN_AM_DUONG[can],
      chiHanh: CHI_HANH[chi],
      cycle60,
      pairIdx,
      napAm,
      lacVietHanh: napAm.lacVietHanh,
      lacVietName: napAm.lacVietName,
      hanHanh: napAm.hanHanh,
      hanName: napAm.hanName,
      swapped: napAm.swapped,
      bulletDesc,
      deepDesc
    };
  }

  // Lấy Can Chi của Ngày, Tháng, Năm từ ngày Dương lịch
  function getFullDateCanChi(dd, mm, yy, hourIndex = 0) {
    const lunar = convertSolar2Lunar(dd, mm, yy, 7);
    const jd = lunar.jd;

    // Năm Can Chi
    const yearInfo = getYearInfo(lunar.lunarYear);

    // Tháng Can Chi (Tháng Giêng là Dần -> chiIdx = 2)
    const monthChiIdx = (lunar.lunarMonth + 1) % 12;
    const monthCanIdx = ((yearInfo.canIdx * 2 + lunar.lunarMonth + 1) % 10);
    const monthCan = CAN[monthCanIdx];
    const monthChi = CHI[monthChiIdx];
    const monthCanChi = `${monthCan} ${monthChi}`;

    // Ngày Can Chi
    const dayCanIdx = (jd + 9) % 10;
    const dayChiIdx = (jd + 1) % 12;
    const dayCan = CAN[dayCanIdx];
    const dayChi = CHI[dayChiIdx];
    const dayCanChi = `${dayCan} ${dayChi}`;

    // Tìm chỉ số 0..59 của Ngày trong 60 Hoa Giáp
    let dayCycle60 = 0;
    for (let i = 0; i < 60; i++) {
      if (i % 10 === dayCanIdx && i % 12 === dayChiIdx) {
        dayCycle60 = i;
        break;
      }
    }
    const dayNapAm = NAP_AM_30[Math.floor(dayCycle60 / 2)];

    // Giờ Can Chi (hourIndex 0=Tý .. 11=Hợi)
    const hChiIdx = ((hourIndex % 12) + 12) % 12;
    const hCanIdx = (dayCanIdx * 2 + hChiIdx) % 10;
    const hourCan = CAN[hCanIdx];
    const hourChi = CHI[hChiIdx];
    const hourCanChi = `${hourCan} ${hourChi}`;

    const solarTerm = getSolarTerm24(jd, 7);

    return {
      solar: { day: dd, month: mm, year: yy },
      lunar,
      jd,
      yearInfo,
      month: { canIdx: monthCanIdx, chiIdx: monthChiIdx, can: monthCan, chi: monthChi, canChi: monthCanChi, canHanh: CAN_HANH[monthCan], chiHanh: CHI_HANH[monthChi] },
      day: {
        canIdx: dayCanIdx,
        chiIdx: dayChiIdx,
        can: dayCan,
        chi: dayChi,
        canChi: dayCanChi,
        canHanh: CAN_HANH[dayCan],
        chiHanh: CHI_HANH[dayChi],
        cycle60: dayCycle60,
        napAm: dayNapAm,
        lacVietHanh: dayNapAm.lacVietHanh,
        hanHanh: dayNapAm.hanHanh
      },
      hour: { canIdx: hCanIdx, chiIdx: hChiIdx, can: hourCan, chi: hourChi, canChi: hourCanChi },
      solarTerm
    };
  }

  window.LacVietAmLich = {
    CAN,
    CHI,
    CON_GIAP,
    CAN_HANH,
    CAN_AM_DUONG,
    CHI_HANH,
    NAP_AM_30,
    NGU_HANH_SINH,
    NGU_HANH_KHAC,
    CAN_HOP_HOA,
    CAN_XUNG,
    CHI_LUC_HOP,
    CHI_TAM_HOP,
    CHI_LUC_XUNG,
    CHI_LUC_HAI,
    compareNguHanh,
    jdFromDate,
    jdToDate,
    convertSolar2Lunar,
    convertLunar2Solar,
    getYearInfo,
    getFullDateCanChi,
    getSolarTerm24
  };
})();
