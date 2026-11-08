// ============================================================================
// ENGINE 3: CHỌN NGÀY GIỜ TỐT LẠC VIỆT (TRẠCH CÁT, LỤC NHÂM QUÝ NHÂN ĐĂNG THIÊN MÔN)
// Cơ sở lý thuyết: Đại Sư Phụ Thiên Sứ Nguyễn Vũ Tuấn Anh, Sư Huynh Hoàng Triệu Hải & Thiên Luân
// ============================================================================

(function () {
  const AL = window.LacVietAmLich;

  // 12 Trực (Khởi Kiến tại Chi của Tháng Âm Lịch)
  const TRUC_12 = [
    { name: 'Kiến',  type: 'neutral', desc: 'Đầu mối vạn vật khởi sinh. Tốt cho xuất hành, nhậm chức, cầu tài; kỵ động thổ, đào đất, an táng, cưới gả.' },
    { name: 'Trừ',   type: 'good',    desc: 'Tẩy trừ cái cũ, đón cái mới. Rất tốt cho cầu y trị bệnh, giải hạn, dọn dẹp, tế tự; kỵ cưới hỏi, đi xa.' },
    { name: 'Mãn',   type: 'good',    desc: 'Viên mãn, sung túc. Tốt cho khai trương, mở kho, cầu tài lộc, cúng tế; kỵ kiện tụng, nhậm chức.' },
    { name: 'Bình',  type: 'neutral', desc: 'Cân bằng, ổn định. Tốt cho tu tạo nhỏ, sửa đường, giao dịch hòa giải; tránh việc tranh chấp.' },
    { name: 'Định',  type: 'very_good', desc: 'Đổng Công Tuyển Trạch: Có Hoàng la, Tử đàn, Thiên Địa hoàng chiếu. Đại cát cho khởi tạo, khai trương, nhập trạch, cưới hỏi, giao dịch.' },
    { name: 'Chấp',  type: 'neutral', desc: 'Giữ gìn, bảo tồn. Tốt cho tu sửa nhà cửa, tuyển dụng, lập khế ước; kỵ xuất hành xa, mở kho xuất tiền.' },
    { name: 'Phá',   type: 'bad',     desc: 'Xung phá Nguyệt Kiến (Đại Hao). Chỉ tốt cho phá dỡ nhà cũ, trị bệnh cắt bỏ khối u; đại kỵ cưới hỏi, khai trương, ký hợp đồng.' },
    { name: 'Nguy',  type: 'bad',     desc: 'Nguy hiểm, chông chênh. Kỵ xuất hành xa, đi thuyền, leo cao, khởi tạo lớn; riêng ngày Đinh Dậu có Thiên Đức chiếu dùng việc phúc nguyện được.' },
    { name: 'Thành', type: 'very_good', desc: 'Thành tựu viên mãn, Thiên Hỷ hội tụ. Đại cát cho khai trương, ký kết hợp đồng, nhập học, cưới hỏi, nhập trạch, cầu tài.' },
    { name: 'Thâu',  type: 'neutral', desc: 'Thu hoạch, cất giữ. Tốt cho thu nợ, mua bất động sản, tích trữ tài sản, nộp hồ sơ; kỵ khởi công mới hoặc an táng.' },
    { name: 'Khai',  type: 'very_good', desc: 'Mở mang sinh khí, thông suốt bốn phương. Đại cát cho khai trương, động thổ, nhập trạch, cưới gả, xuất hành, nhậm chức.' },
    { name: 'Bế',    type: 'bad',     desc: 'Đóng kín, bế tắc. Chỉ hợp đắp đê, lấp hang lỗ, xây tường rào; đại kỵ khai trương, xuất hành, cưới hỏi, chôn cất.' }
  ];

  // Hoàng Đạo - Hắc Đạo 12 Sao theo Chi Tháng
  // Khởi Thanh Long tại: Tháng 1,7 -> Tý; Tháng 2,8 -> Dần; Tháng 3,9 -> Thìn; Tháng 4,10 -> Ngọ; Tháng 5,11 -> Thân; Tháng 6,12 -> Tuất
  const VONG_HOANG_DAO = [
    { name: 'Thanh Long', hoangDao: true,  desc: 'Thanh Long Hoàng Đạo – Đại cát tinh, trăm việc hanh thông.' },
    { name: 'Minh Đường', hoangDao: true,  desc: 'Minh Đường Hoàng Đạo – Quý nhân phù trợ, lợi cho công danh, khai trương.' },
    { name: 'Thiên Hình', hoangDao: false, desc: 'Thiên Hình Hắc Đạo – Kỵ kiện tụng, tranh chấp, cưới hỏi.' },
    { name: 'Chu Tước',   hoangDao: false, desc: 'Chu Tước Hắc Đạo – Dễ sinh khẩu thiệt thị phi, kỵ nhập trạch, khai trương.' },
    { name: 'Kim Quỹ',    hoangDao: true,  desc: 'Kim Quỹ Hoàng Đạo – Tài tinh hội tụ, đại lợi cho cầu tài, cưới hỏi, mở hàng.' },
    { name: 'Thiên Đức',  hoangDao: true,  desc: 'Thiên Đức Hoàng Đạo – Phúc đức che chở, giải trừ hung sát.' },
    { name: 'Bạch Hổ',    hoangDao: false, desc: 'Bạch Hổ Hắc Đạo – Kỵ động thổ, cưới gả (trừ việc săn bắn, tế tự).' },
    { name: 'Ngọc Đường', hoangDao: true,  desc: 'Ngọc Đường Hoàng Đạo – Đại cát cho thi cử, nhậm chức, khai trương, xây dựng.' },
    { name: 'Thiên Lao',  hoangDao: false, desc: 'Thiên Lao Hắc Đạo – Tránh khởi sự lớn, ký kết pháp lý.' },
    { name: 'Huyền Vũ',   hoangDao: false, desc: 'Huyền Vũ Hắc Đạo – Đề phòng hao tài, mất mát, kỵ xuất hành xa.' },
    { name: 'Tư Mệnh',    hoangDao: true,  desc: 'Tư Mệnh Hoàng Đạo – Cát tinh hộ mệnh, lợi cho cầu phúc, dựng nhà, cưới gả.' },
    { name: 'Câu Trần',   hoangDao: false, desc: 'Câu Trần Hắc Đạo – Trì trệ, vướng bận, kỵ động thổ, kiện tụng.' }
  ];

  const KHOI_THANH_LONG_THANG = {
    1: 0, 7: 0,   // Tý
    2: 2, 8: 2,   // Dần
    3: 4, 9: 4,   // Thìn
    4: 6, 10: 6,  // Ngọ
    5: 8, 11: 8,  // Thân
    6: 10, 12: 10 // Tuất
  };

  function getHoangDaoDay(lunarMonth, dayChiIdx) {
    const startChi = KHOI_THANH_LONG_THANG[lunarMonth] || 0;
    const offset = (dayChiIdx - startChi + 12) % 12;
    return VONG_HOANG_DAO[offset];
  }

  // Tính 12 Giờ Hoàng Đạo / Hắc Đạo trong ngày dựa theo Chi Ngày
  function get12HoursHoangDao(dayChiIdx) {
    // Quy tắc khởi Thanh Long cho Giờ trong ngày:
    // Ngày Dần, Thân khởi Tý (0); Mão, Dậu khởi Dần (2); Thìn, Tuất khởi Thìn (4);
    // Tỵ, Hợi khởi Ngọ (6); Tý, Ngọ khởi Thân (8); Sửu, Mùi khởi Tuất (10)
    const mapStart = { 2: 0, 8: 0, 3: 2, 9: 2, 4: 4, 10: 4, 5: 6, 11: 6, 0: 8, 6: 8, 1: 10, 7: 10 };
    const startChi = mapStart[dayChiIdx] ?? 0;
    const KHUNG_GIO = [
      '23h–01h', '01h–03h', '03h–05h', '05h–07h', '07h–09h', '09h–11h',
      '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'
    ];
    return AL.CHI.map((chiName, hIdx) => {
      const offset = (hIdx - startChi + 12) % 12;
      const star = VONG_HOANG_DAO[offset];
      return {
        chiIdx: hIdx,
        chi: chiName,
        timeRange: KHUNG_GIO[hIdx],
        starName: star.name,
        hoangDao: star.hoangDao,
        desc: star.desc
      };
    });
  }

  // Tính Giờ Tối Thiện: QUÝ NHÂN ĐĂNG THIÊN MÔN (Lục Nhâm Đại Độn - Chuyên đề 1 Phần A TaiLieuLyHoc.md)
  function getQuyNhanDangThienMon(dayCan, solarTermIndex) {
    // Cung Quý Nhân Ngày (Dương Quý) và Quý Nhân Đêm (Âm Quý) theo Hiệp Kỷ Biện Phương Thư (dòng 7796-7803 TaiLieuLyHoc.md)
    const QUY_NGAY = {
      'Giáp': 7,  // Mùi
      'Ất': 8,    // Thân
      'Bính': 9,  // Dậu
      'Đinh': 11, // Hợi
      'Mậu': 1,   // Sửu
      'Kỷ': 0,    // Tý
      'Canh': 1,  // Sửu
      'Tân': 2,   // Dần
      'Nhâm': 3,  // Mão
      'Quý': 5    // Tỵ
    };
    const QUY_DEM = {
      'Giáp': 1,  // Sửu
      'Ất': 0,    // Tý
      'Bính': 11, // Hợi
      'Đinh': 9,  // Dậu
      'Mậu': 7,   // Mùi
      'Kỷ': 8,    // Thân
      'Canh': 7,  // Mùi
      'Tân': 6,   // Ngọ
      'Nhâm': 5,  // Tỵ
      'Quý': 3    // Mão
    };

    // Nguyệt Tướng theo Tiết Khí (dòng 7830-7852 TaiLieuLyHoc.md)
    // solarTermIndex: 0=Xuân Phân..23=Kinh Trập
    // Vũ Thủy (22), Kinh Trập (23) -> Hợi Tướng (11)
    // Xuân Phân (0), Thanh Minh (1) -> Tuất Tướng (10)
    // Cốc Vũ (2), Lập Hạ (3) -> Dậu Tướng (9)
    // Tiểu Mãn (4), Mang Chủng (5) -> Thân Tướng (8)
    // Hạ Chí (6), Tiểu Thử (7) -> Mùi Tướng (7)
    // Đại Thử (8), Lập Thu (9) -> Ngọ Tướng (6)
    // Xử Thử (10), Bạch Lộ (11) -> Tỵ Tướng (5)
    // Thu Phân (12), Hàn Lộ (13) -> Thìn Tướng (4)
    // Sương Giáng (14), Lập Đông (15) -> Mão Tướng (3)
    // Tiểu Tuyết (16), Đại Tuyết (17) -> Dần Tướng (2)
    // Đông Chí (18), Tiểu Hàn (19) -> Sửu Tướng (1)
    // Đại Hàn (20), Lập Xuân (21) -> Tý Tướng (0)
    const NGUYET_TUONG_MAP = [
      { chiIdx: 10, name: 'Tuất Tướng (Hà Khôi)' },     // 0: Xuân Phân
      { chiIdx: 10, name: 'Tuất Tướng (Hà Khôi)' },     // 1: Thanh Minh
      { chiIdx: 9,  name: 'Dậu Tướng (Tòng Khôi)' },    // 2: Cốc Vũ
      { chiIdx: 9,  name: 'Dậu Tướng (Tòng Khôi)' },    // 3: Lập Hạ
      { chiIdx: 8,  name: 'Thân Tướng (Truyền Tòng)' }, // 4: Tiểu Mãn
      { chiIdx: 8,  name: 'Thân Tướng (Truyền Tòng)' }, // 5: Mang Chủng
      { chiIdx: 7,  name: 'Mùi Tướng (Tiểu Cát)' },     // 6: Hạ Chí
      { chiIdx: 7,  name: 'Mùi Tướng (Tiểu Cát)' },     // 7: Tiểu Thử
      { chiIdx: 6,  name: 'Ngọ Tướng (Thắng Quang)' },  // 8: Đại Thử
      { chiIdx: 6,  name: 'Ngọ Tướng (Thắng Quang)' },  // 9: Lập Thu
      { chiIdx: 5,  name: 'Tỵ Tướng (Thái Ất)' },       // 10: Xử Thử
      { chiIdx: 5,  name: 'Tỵ Tướng (Thái Ất)' },       // 11: Bạch Lộ
      { chiIdx: 4,  name: 'Thìn Tướng (Thiên Cương)' }, // 12: Thu Phân
      { chiIdx: 4,  name: 'Thìn Tướng (Thiên Cương)' }, // 13: Hàn Lộ
      { chiIdx: 3,  name: 'Mão Tướng (Thái Xung)' },    // 14: Sương Giáng
      { chiIdx: 3,  name: 'Mão Tướng (Thái Xung)' },    // 15: Lập Đông
      { chiIdx: 2,  name: 'Dần Tướng (Công Tào)' },     // 16: Tiểu Tuyết
      { chiIdx: 2,  name: 'Dần Tướng (Công Tào)' },     // 17: Đại Tuyết
      { chiIdx: 1,  name: 'Sửu Tướng (Đại Cát)' },      // 18: Đông Chí
      { chiIdx: 1,  name: 'Sửu Tướng (Đại Cát)' },      // 19: Tiểu Hàn
      { chiIdx: 0,  name: 'Tý Tướng (Thần Hậu)' },      // 20: Đại Hàn
      { chiIdx: 0,  name: 'Tý Tướng (Thần Hậu)' },      // 21: Lập Xuân
      { chiIdx: 11, name: 'Hợi Tướng (Đăng Minh)' },    // 22: Vũ Thủy
      { chiIdx: 11, name: 'Hợi Tướng (Đăng Minh)' }     // 23: Kinh Trập
    ];

    const nt = NGUYET_TUONG_MAP[solarTermIndex] || NGUYET_TUONG_MAP[0];
    const THIEN_MON = 11; // Cung Hợi là Thiên Môn

    // Tính Dương Quý (Giờ ban ngày: Mão[3], Thìn[4], Tỵ[5], Ngọ[6], Mùi[7], Thân[8], và cả Dậu[9] trục ngày đêm)
    const qNgay = QUY_NGAY[dayCan];
    const stepNgay = (THIEN_MON - qNgay + 12) % 12;
    const gioDuongQuy = (nt.chiIdx + stepNgay) % 12;
    const validDayHours = [3, 4, 5, 6, 7, 8, 9];
    const hasDuongQuy = validDayHours.includes(gioDuongQuy);

    // Tính Âm Quý (Giờ ban đêm: Dậu[9], Tuất[10], Hợi[11], Tý[0], Sửu[1], Dần[2], và cả Mão[3] trục ngày đêm)
    const qDem = QUY_DEM[dayCan];
    const stepDem = (THIEN_MON - qDem + 12) % 12;
    const gioAmQuy = (nt.chiIdx + stepDem) % 12;
    const validNightHours = [9, 10, 11, 0, 1, 2, 3];
    const hasAmQuy = validNightHours.includes(gioAmQuy);

    const KHUNG_GIO = [
      '23h–01h', '01h–03h', '03h–05h', '05h–07h', '07h–09h', '09h–11h',
      '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'
    ];

    const list = [];
    if (hasDuongQuy) {
      list.push({
        type: 'Dương Quý Nhân Đăng Thiên Môn (Ban ngày)',
        chi: AL.CHI[gioDuongQuy],
        timeRange: KHUNG_GIO[gioDuongQuy],
        detail: `Nhật Can ${dayCan} khởi Dương Quý tại ${AL.CHI[qNgay]}, gặp ${nt.name} đưa Quý Nhân đăng Thiên Môn (cung Hợi) vào giờ ${AL.CHI[gioDuongQuy]} (${KHUNG_GIO[gioDuongQuy]}).`
      });
    }
    if (hasAmQuy) {
      list.push({
        type: 'Âm Quý Nhân Đăng Thiên Môn (Ban đêm)',
        chi: AL.CHI[gioAmQuy],
        timeRange: KHUNG_GIO[gioAmQuy],
        detail: `Nhật Can ${dayCan} khởi Âm Quý tại ${AL.CHI[qDem]}, gặp ${nt.name} đưa Quý Nhân đăng Thiên Môn (cung Hợi) vào giờ ${AL.CHI[gioAmQuy]} (${KHUNG_GIO[gioAmQuy]}).`
      });
    }

    return {
      nguyetTuong: nt.name,
      duongQuyCung: AL.CHI[qNgay],
      amQuyCung: AL.CHI[qDem],
      hours: list
    };
  }

  // Tính Phương vị Hỷ Thần, Tài Thần & Hạc Thần (Bài 21 Phần A TaiLieuLyHoc.md dòng 5653-5712)
  function getHuongXuatHanh(dayCan, dayCycle60) {
    const HY_THAN = {
      'Giáp': 'Đông Bắc', 'Kỷ': 'Đông Bắc',
      'Ất': 'Tây Bắc',    'Canh': 'Tây Bắc',
      'Bính': 'Tây Nam',  'Tân': 'Tây Nam',
      'Đinh': 'Chính Nam','Nhâm': 'Chính Nam',
      'Mậu': 'Đông Nam',  'Quý': 'Đông Nam'
    };
    const TAI_THAN = {
      'Giáp': 'Đông Nam', 'Ất': 'Đông Nam',
      'Bính': 'Chính Đông','Đinh': 'Chính Đông',
      'Mậu': 'Chính Bắc', 'Kỷ': 'Chính Nam',
      'Canh': 'Tây Nam',  'Tân': 'Tây Nam',
      'Nhâm': 'Chính Tây','Quý': 'Tây Bắc'
    };

    // Hạc Thần theo chu kỳ 60 Hoa Giáp (Giáp Tý cycle60 = 0 .. Quý Hợi = 59)
    // Đối chiếu chính xác dòng 5693-5709 TaiLieuLyHoc.md:
    let hacThan = '';
    if (dayCycle60 >= 29 && dayCycle60 <= 44) {
      // Từ Quý Tỵ (cycle60=29) đến Mậu Thân (cycle60=44): 16 ngày Hạc Thần ở trên trời!
      hacThan = 'Ở trên trời (16 ngày Quý Tỵ – Mậu Thân Hạc Thần quy thiên, xuất hành 8 hướng đều không sợ Hạc Thần!)';
    } else if (dayCycle60 >= 45 && dayCycle60 <= 50) {
      // Kỷ Dậu (45) -> Giáp Dần (50): Đông Bắc
      hacThan = 'Đông Bắc';
    } else if (dayCycle60 >= 51 && dayCycle60 <= 55) {
      // Ất Mão (51) -> Kỷ Mùi (55): Chính Đông
      hacThan = 'Chính Đông';
    } else if (dayCycle60 >= 56 || dayCycle60 <= 1) {
      // Canh Thân (56) -> Ất Sửu (1): Đông Nam
      hacThan = 'Đông Nam';
    } else if (dayCycle60 >= 2 && dayCycle60 <= 6) {
      // Bính Dần (2) -> Canh Ngọ (6): Chính Nam
      hacThan = 'Chính Nam';
    } else if (dayCycle60 >= 7 && dayCycle60 <= 12) {
      // Tân Mùi (7) -> Bính Tý (12): Tây Nam
      hacThan = 'Tây Nam';
    } else if (dayCycle60 >= 13 && dayCycle60 <= 17) {
      // Đinh Sửu (13) -> Tân Tỵ (17): Chính Tây
      hacThan = 'Chính Tây';
    } else if (dayCycle60 >= 18 && dayCycle60 <= 23) {
      // Nhâm Ngọ (18) -> Đinh Hợi (23): Tây Bắc
      hacThan = 'Tây Bắc';
    } else {
      // Mậu Tý (24) -> Nhâm Thìn (28): Chính Bắc
      hacThan = 'Chính Bắc';
    }

    const hy = HY_THAN[dayCan];
    const tai = TAI_THAN[dayCan];
    const conflict = (hacThan === hy || hacThan === tai);

    return {
      hyThan: hy,
      taiThan: tai,
      hacThan,
      conflict,
      conflictNote: conflict
        ? `⚠️ LƯU Ý ĐẶC BIỆT (Bài 21 Lý Học Đông Phương): Hôm nay hướng Hạc Thần (${hacThan}) trùng với hướng ${hacThan === hy ? 'Hỷ Thần' : 'Tài Thần'}! Nên ưu tiên chọn hướng ${hacThan === hy ? `Tài Thần (${tai})` : `Hỷ Thần (${hy})`} để tránh thần ác.`
        : 'Hướng Hỷ Thần và Tài Thần hôm nay hoàn toàn thông thoáng, không trùng hướng Hạc Thần.'
    };
  }

  // Kiểm định toàn diện 1 ngày Dương lịch (kèm tuổi gia chủ nếu có)
  function evaluateDayFull(dd, mm, yy, ownerYear = null, purpose = 'all') {
    const full = AL.getFullDateCanChi(dd, mm, yy, 0);
    const lDay = full.lunar.lunarDay;
    const lMonth = full.lunar.lunarMonth;
    const dCan = full.day.can;
    const dChi = full.day.chi;
    const dCanChi = full.day.canChi;

    const taboos = [];
    const blessings = [];
    let score = 75;

    // 1. Dương Công Kỵ Nhật (dòng 6307-6333 TaiLieuLyHoc.md)
    const DUONG_CONG = {
      1: [13], 2: [11], 3: [9], 4: [7], 5: [5], 6: [3],
      7: [8, 29], 8: [27], 9: [25], 10: [23], 11: [21], 12: [19]
    };
    if ((DUONG_CONG[lMonth] || []).includes(lDay)) {
      taboos.push({
        name: 'Dương Công Kỵ Nhật',
        level: 'severe',
        desc: `Ngày ${lDay}/${lMonth} ÂL là 1 trong 13 ngày Dương Công Kỵ Nhật xấu nhất trong năm — Đại kỵ khởi tạo, động thổ, cưới gả, khai trương.`
      });
      score -= 40;
    }

    // 2. Tam Nương Sát (Mùng 3, 7, 13, 18, 22, 27 ÂL)
    if ([3, 7, 13, 18, 22, 27].includes(lDay)) {
      taboos.push({
        name: 'Ngày Tam Nương Sát',
        level: 'high',
        desc: `Ngày mùng/ngày ${lDay} ÂL phạm Tam Nương (giao thoa từ trường Mặt Trăng gây nhiễu loạn cảm xúc). Tránh khởi sự đại cuộc, cưới hỏi, động thổ.`
      });
      score -= 22;
    }

    // 3. Nguyệt Kỵ (Mùng 5, 14, 23 ÂL + Đại Nguyệt Kỵ theo tháng dòng 6600-6618)
    if ([5, 14, 23].includes(lDay)) {
      const daiKy5 = [1, 4, 7, 10].includes(lMonth) && lDay === 5;
      const daiKy14 = [2, 5, 8, 11].includes(lMonth) && lDay === 14;
      const daiKy23 = [3, 6, 9, 12].includes(lMonth) && lDay === 23;
      const isDaiNguyetKy = daiKy5 || daiKy14 || daiKy23;
      taboos.push({
        name: isDaiNguyetKy ? 'ĐẠI NGUYỆT KỴ (Chính Kỵ Tháng)' : 'Ngày Nguyệt Kỵ',
        level: isDaiNguyetKy ? 'severe' : 'high',
        desc: `"Mồng năm, mười bốn, hai ba" — ${isDaiNguyetKy ? `Tháng ${lMonth} ÂL đại kỵ chính ngày ${lDay} ÂL!` : 'Nửa chặng chu kỳ trăng, khí lực bất ổn, kỵ xuất hành, khởi công lớn.'}`
      });
      score -= isDaiNguyetKy ? 30 : 18;
    }

    // 4. Ngày Sát Chủ (dòng 6357-6424 TaiLieuLyHoc.md)
    const SAT_CHU_THANG_1 = { 1:'Tý', 2:'Sửu', 3:'Sửu', 4:'Tuất', 5:'Thìn', 6:'Thìn', 7:'Sửu', 8:'Thìn', 9:'Sửu', 10:'Thìn', 11:'Mùi', 12:'Thìn' };
    const SAT_CHU_THANG_2 = { 1:'Tỵ', 2:'Tý', 3:'Mùi', 4:'Mão', 5:'Thân', 6:'Tuất', 7:'Hợi', 8:'Sửu', 9:'Ngọ', 10:'Dậu', 11:'Dần', 12:'Thìn' };
    if (SAT_CHU_THANG_1[lMonth] === dChi || SAT_CHU_THANG_2[lMonth] === dChi) {
      taboos.push({
        name: 'Ngày Sát Chủ Tháng',
        level: 'severe',
        desc: `Tháng ${lMonth} ÂL kỵ ngày ${dChi} (Sát Chủ) — Đại kỵ xây cất nhà cửa, cưới gả và an táng.`
      });
      score -= 25;
    }

    // 5. Ngày Thọ Tử (dòng 6487-6514 TaiLieuLyHoc.md)
    const THO_TU_NGAY = {
      1: 'Bính Tuất', 2: 'Nhâm Thìn', 3: 'Tân Hợi', 4: 'Đinh Tỵ',
      5: 'Mậu Tý', 6: 'Bính Ngọ', 7: 'Ất Sửu', 8: 'Quý Mùi',
      9: 'Giáp Dần', 10: 'Mậu Thân', 11: 'Tân Mão', 12: 'Tân Dậu'
    };
    if (THO_TU_NGAY[lMonth] === dCanChi) {
      taboos.push({
        name: 'Ngày Thọ Tử (Trăm sự đều kỵ)',
        level: 'severe',
        desc: `Tháng ${lMonth} ÂL gặp ngày ${dCanChi} là chính ngày Thọ Tử — Trăm sự đại sự đều kiêng kỵ.`
      });
      score -= 35;
    }

    // Giờ Thọ Tử trong ngày (dòng 6515-6566 TaiLieuLyHoc.md)
    const GIO_THO_TU = {
      'Tý': 'Giờ Sửu (01h–03h)', 'Sửu': 'Giờ Ngọ (11h–13h)', 'Dần': 'Giờ Ngọ (11h–13h)',
      'Mão': 'Giờ Tỵ (09h–11h)', 'Thìn': 'Giờ Tỵ (09h–11h)', 'Tỵ': 'Giờ Ngọ (11h–13h)',
      'Ngọ': 'Giờ Mùi (13h–15h)', 'Mùi': 'Giờ Ngọ (11h–13h)', 'Thân': 'Giờ Mão (05h–07h)',
      'Dậu': 'Giờ Tỵ (09h–11h)', 'Tuất': 'Giờ Mùi (13h–15h)', 'Hợi': 'Giờ Ngọ (11h–13h)'
    };
    const GIO_SAT_CHU = {
      1: 'Giờ Dần (03h–05h)', 7: 'Giờ Dần (03h–05h)',
      2: 'Giờ Tỵ (09h–11h)',  8: 'Giờ Tỵ (09h–11h)',
      3: 'Giờ Thân (15h–17h)',9: 'Giờ Thân (15h–17h)',
      4: 'Giờ Thìn (07h–09h)',10: 'Giờ Thìn (07h–09h)',
      5: 'Giờ Dậu (17h–19h)', 11: 'Giờ Dậu (17h–19h)',
      6: 'Giờ Mão (05h–07h)', 12: 'Giờ Mão (05h–07h)'
    };

    // 6. Ngày Vãng Vong (dòng 6571-6598 TaiLieuLyHoc.md)
    const VANG_VONG = {
      1:'Dần', 2:'Tỵ', 3:'Thân', 4:'Hợi', 5:'Mão', 6:'Ngọ',
      7:'Dậu', 8:'Tý', 9:'Thìn', 10:'Mùi', 11:'Tuất', 12:'Sửu'
    };
    if (VANG_VONG[lMonth] === dChi) {
      taboos.push({
        name: 'Ngày Vãng Vong',
        level: 'high',
        desc: `Tháng ${lMonth} ÂL gặp ngày ${dChi} phạm Vãng Vong — Chính kỵ xuất hành đi xa, động thổ, cưới gả.`
      });
      score -= 20;
    }

    // 7. Ngày Thập Ác Đại Bại (dòng 6653-6690 TaiLieuLyHoc.md)
    const yCan = full.yearInfo.can;
    let isThapAc = false;
    if ((yCan === 'Giáp' || yCan === 'Kỷ') && ((lMonth === 3 && dCanChi === 'Mậu Tuất') || (lMonth === 7 && dCanChi === 'Quý Hợi') || (lMonth === 10 && dCanChi === 'Bính Thân') || (lMonth === 11 && dCanChi === 'Đinh Hợi'))) isThapAc = true;
    if ((yCan === 'Ất' || yCan === 'Canh') && ((lMonth === 4 && dCanChi === 'Nhâm Thân') || (lMonth === 9 && dCanChi === 'Ất Tỵ'))) isThapAc = true;
    if ((yCan === 'Bính' || yCan === 'Tân') && ((lMonth === 3 && dCanChi === 'Tân Tỵ') || (lMonth === 9 && dCanChi === 'Canh Thìn') || (lMonth === 10 && dCanChi === 'Giáp Thìn'))) isThapAc = true;
    if ((yCan === 'Mậu' || yCan === 'Quý') && (lMonth === 6 && dCanChi === 'Kỷ Sửu')) isThapAc = true;
    if (isThapAc) {
      taboos.push({
        name: 'Thập Ác Đại Bại (Vô Lộc Nhật)',
        level: 'severe',
        desc: `Năm ${yCan} tháng ${lMonth} ngày ${dCanChi} phạm Thập Ác Đại Bại — Đại kỵ khai trương, ký hợp đồng, giao dịch tài chính, cưới hỏi.`
      });
      score -= 30;
    }

    // 8. Thiên Tai – Địa Họa (dòng 6699-6710 TaiLieuLyHoc.md)
    const THIEN_TAI_DIA_HOA = {
      1:'Tý', 5:'Tý', 9:'Tý',
      2:'Mão', 6:'Mão', 10:'Mão',
      3:'Ngọ', 7:'Ngọ', 11:'Ngọ',
      4:'Dậu', 8:'Dậu', 12:'Dậu'
    };
    if (THIEN_TAI_DIA_HOA[lMonth] === dChi) {
      taboos.push({
        name: 'Ngày Thiên Tai – Địa Họa',
        level: 'medium',
        desc: `Tháng ${lMonth} ÂL ngày ${dChi} phạm Thiên Tai Địa Họa — Kỵ động thổ xây cất và cưới gả.`
      });
      score -= 12;
    }

    // 9. Tứ Ly & Tứ Tuyệt (dòng 7011-7040 TaiLieuLyHoc.md)
    if ((mm === 3 && dd === 20) || (mm === 6 && dd === 20) || (mm === 9 && dd === 22) || (mm === 12 && dd === 21)) {
      taboos.push({ name: 'Ngày Tứ Ly', level: 'high', desc: 'Trước Xuân phân, Hạ chí, Thu phân, Đông chí 1 ngày — Khí vận giao mùa suy kiệt, tránh khởi sự lớn.' });
      score -= 20;
    }
    if ((mm === 2 && dd === 3) || (mm === 5 && dd === 5) || (mm === 8 && dd === 8) || (mm === 11 && dd === 7)) {
      taboos.push({ name: 'Ngày Tứ Tuyệt', level: 'high', desc: 'Ngày tận cùng mỗi mùa trước Lập Xuân, Lập Hạ, Lập Thu, Lập Đông — Tránh khởi công việc trọng đại.' });
      score -= 20;
    }

    // 10. Hoàng Đạo / Hắc Đạo
    const hoangDaoInfo = getHoangDaoDay(lMonth, full.day.chiIdx);
    if (hoangDaoInfo.hoangDao) {
      blessings.push({ name: `Ngày Hoàng Đạo (${hoangDaoInfo.name})`, desc: hoangDaoInfo.desc });
      score += 12;
    } else {
      taboos.push({ name: `Ngày Hắc Đạo (${hoangDaoInfo.name})`, level: 'low', desc: hoangDaoInfo.desc });
      score -= 6;
    }

    // 11. Thập Nhị Kiến Trừ (12 Trực)
    const trucIdx = (full.day.chiIdx - full.month.chiIdx + 12) % 12;
    const trucInfo = TRUC_12[trucIdx];
    if (trucInfo.type === 'very_good') {
      blessings.push({ name: `Trực ${trucInfo.name} (Đại Cát)`, desc: trucInfo.desc });
      score += 12;
    } else if (trucInfo.type === 'good') {
      blessings.push({ name: `Trực ${trucInfo.name} (Tốt)`, desc: trucInfo.desc });
      score += 6;
    } else if (trucInfo.type === 'bad') {
      taboos.push({ name: `Trực ${trucInfo.name} (Kỵ Khởi Sự)`, level: 'medium', desc: trucInfo.desc });
      score -= 14;
    }

    // 12. Nhị Thập Bát Tú (28 Sao) kèm Ngoại Lệ
    const sao28Arr = window.LYHOC_SAO28 || [];
    // Chuẩn JDN modulo 28: JDN 2451545 (01/01/2000) là Sao昴 (Mão Nhật Kê - index 17 trong 0..27)
    const saoIdx = ((full.jd - 2451545 + 17) % 28 + 28) % 28;
    const saoInfo = sao28Arr[saoIdx] || {
      id: saoIdx + 1,
      name: 'Phòng Nhật Thố',
      rank: 'Kiết Tú',
      animalDesc: 'Tướng tinh con Thỏ',
      nenLam: 'Khởi công tạo tác mọi việc đều tốt.',
      kiengCu: 'Không kỵ việc chi cả.',
      ngoaiLe: 'Tại Dậu Đăng Viên đại cát.'
    };
    const isKietTu = /Kiết/i.test(saoInfo.rank);
    const isHungTu = /Hung/i.test(saoInfo.rank);
    if (isKietTu) {
      blessings.push({ name: `Sao ${saoInfo.name} (${saoInfo.rank})`, desc: saoInfo.nenLam });
      score += 10;
    } else if (isHungTu) {
      taboos.push({ name: `Sao ${saoInfo.name} (${saoInfo.rank})`, level: 'medium', desc: saoInfo.kiengCu });
      score -= 10;
    }

    // 13. Giờ Hoàng Đạo & Giờ Quý Nhân Đăng Thiên Môn & Hướng Xuất Hành
    const hours12 = get12HoursHoangDao(full.day.chiIdx);
    const quyNhanHours = getQuyNhanDangThienMon(dCan, full.solarTerm.index);
    const huong = getHuongXuatHanh(dCan, full.day.cycle60);

    // 14. Tương tác với Tuổi Gia Chủ (nếu có nhập năm sinh)
    let ownerComparison = null;
    if (ownerYear && !isNaN(parseInt(ownerYear, 10))) {
      ownerComparison = window.LacVietLuanTuoi.compareTwoPeople(parseInt(ownerYear, 10), full.lunar.lunarYear, 'Gia Chủ', 'Năm Hiện Hành');
      const ownerInfo = AL.getYearInfo(parseInt(ownerYear, 10));
      const canRel = AL.compareNguHanh(dCan ? AL.CAN_HANH[dCan] : 'Thổ', ownerInfo.canHanh);
      const chiRel = AL.compareNguHanh(full.day.chiHanh, ownerInfo.chiHanh);
      const mangRel = AL.compareNguHanh(full.day.lacVietHanh, ownerInfo.lacVietHanh);
      const isLucXung = AL.CHI_LUC_XUNG[dChi] === ownerInfo.chi;
      const isCanXung = AL.CAN_XUNG[dCan] === ownerInfo.can;

      let ownerScoreDelta = (canRel.score + chiRel.score + mangRel.score * 2) * 3;
      let ownerNote = `Hành khí Ngày ${dCanChi} (Mạng Lạc Thư: ${full.day.lacVietHanh}) so với Gia Chủ ${ownerInfo.year} ${ownerInfo.canChi} (Mạng Lạc Thư: ${ownerInfo.lacVietHanh}): ${mangRel.rel}.`;

      if (isLucXung) {
        ownerScoreDelta -= 25;
        ownerNote = `⚠️ NGÀY XUNG TUỔI GIA CHỦ: Địa chi ngày (${dChi}) Lục Xung với Địa chi tuổi Gia Chủ (${ownerInfo.chi})${isCanXung ? ' lại phạm Thiên Khắc Địa Xung!' : '.'} Gia chủ tuyệt đối tránh dùng ngày này cho đại sự cá nhân.`;
        taboos.push({ name: 'Ngày Xung Tuổi Gia Chủ', level: 'severe', desc: ownerNote });
      } else if (mangRel.score > 0) {
        blessings.push({ name: 'Tương Sinh Tuổi Gia Chủ (Lạc Thư Hoa Giáp)', desc: ownerNote });
      }
      score += ownerScoreDelta;

      ownerComparison = {
        ownerInfo,
        canRel,
        chiRel,
        mangRel,
        isLucXung,
        isCanXung,
        ownerNote
      };
    }

    const finalScore = Math.max(5, Math.min(99, Math.round(score)));
    let ratingLabel = 'Ngày Bình Thường (Thứ Cát)';
    let ratingClass = 'badge-neutral';
    if (finalScore >= 80 && !taboos.some(t => t.level === 'severe')) {
      ratingLabel = 'NGÀY ĐẠI CÁT (Thượng Cát Lạc Việt)';
      ratingClass = 'badge-good';
    } else if (finalScore >= 65 && !taboos.some(t => t.level === 'severe')) {
      ratingLabel = 'Ngày Tốt (Khá Cát Lành)';
      ratingClass = 'badge-good';
    } else if (finalScore < 48 || taboos.some(t => t.level === 'severe')) {
      ratingLabel = 'Ngày Kỵ / Hung Nhật (Nên Tránh Việc Lớn)';
      ratingClass = 'badge-warn';
    }

    return {
      full,
      score: finalScore,
      ratingLabel,
      ratingClass,
      hoangDaoInfo,
      trucInfo,
      saoInfo,
      taboos,
      blessings,
      gioThoTu: GIO_THO_TU[dChi],
      gioSatChu: GIO_SAT_CHU[lMonth],
      hours12,
      quyNhanHours,
      huong,
      ownerComparison
    };
  }

  // Quét toàn bộ các ngày trong 1 tháng Dương lịch để tìm Top Ngày Tốt
  function scanGoodDaysInMonth(mm, yy, ownerYear = null) {
    const daysInMonth = new Date(yy, mm, 0).getDate();
    const allDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      allDays.push(evaluateDayFull(d, mm, yy, ownerYear));
    }
    const goodDays = allDays
      .filter(item => item.score >= 65 && !item.taboos.some(t => t.level === 'severe'))
      .sort((a, b) => b.score - a.score);
    return { allDays, goodDays };
  }

  // Tính Tuổi Xây Nhà: KIM LÂU (Khởi từ Cung Cấn = 10 tuổi theo Sư phụ Thiên Sứ dòng 6785-6808) + HOANG ỐC + TAM TAI
  function checkAgeForBuilding(birthYear, buildYear) {
    const bInfo = AL.getYearInfo(birthYear);
    const targetInfo = AL.getYearInfo(buildYear);
    const lunarAge = buildYear - birthYear + 1; // Tuổi mụ (tuổi Âm lịch)

    // 1. Tính Kim Lâu theo đồ hình Bát Quái Lạc Việt (Bài 1 Article dòng 6791-6808 TaiLieuLyHoc.md):
    // Khởi 10 tuổi ở Cấn -> 11 Chấn -> 12 Khôn (Kim Lâu Thân) -> 13 Ly -> 14 Tốn (Kim Lâu Thê) -> 15 Đoài -> 16 Càn (Kim Lâu Tử) -> 17 Khảm -> 18 Cấn (Kim Lâu Lục Súc) -> 19 Chấn
    // Sang hàng chục tiếp theo nhảy 1 cung (tức là tương đương quy tắc lấy tuổi mụ chia 9 dư 1, 3, 6, 8 phạm Kim Lâu!)
    const rem9 = lunarAge % 9;
    let kimLau = { pham: false, type: 'Không phạm Kim Lâu', desc: `Tuổi mụ ${lunarAge} rơi vào cung tốt trên Bát Quái (khởi Cấn 10 tuổi), hoàn toàn không phạm Kim Lâu.` };
    if (rem9 === 1) {
      kimLau = { pham: true, type: 'Phạm Kim Lâu Thân (Dư 1)', desc: `Tuổi mụ ${lunarAge} phạm Kim Lâu Thân — Gây bất lợi cho chính bản mệnh người đứng tuổi xây nhà.` };
    } else if (rem9 === 3) {
      kimLau = { pham: true, type: 'Phạm Kim Lâu Thê (Dư 3)', desc: `Tuổi mụ ${lunarAge} phạm Kim Lâu Thê — Gây bất lợi cho người phối ngẫu (vợ/chồng).` };
    } else if (rem9 === 6) {
      kimLau = { pham: true, type: 'Phạm Kim Lâu Tử (Dư 6)', desc: `Tuổi mụ ${lunarAge} phạm Kim Lâu Tử — Gây bất lợi cho con cái trong gia đình.` };
    } else if (rem9 === 8) {
      kimLau = { pham: true, type: 'Phạm Kim Lâu Lục Súc (Dư 8)', desc: `Tuổi mụ ${lunarAge} phạm Kim Lâu Lục Súc — Ảnh hưởng tài sản, vật nuôi, nhân sự dưới quyền.` };
    }

    // 2. Tính Hoang Ốc (Khởi 10 tuổi tại Nhất Kiết, 20 Nhị Nghi, 30 Tam Địa Sát, 40 Tứ Tấn Tài, 50 Ngũ Thọ Tử, 60 Lục Hoang Ốc)
    const HOANG_OC_6 = [
      { idx: 1, name: 'Nhất Kiết (Tốt)', good: true,  desc: 'Nhất Kiết an cư, thông vạn sự — Làm nhà đại cát, mọi việc hanh thông.' },
      { idx: 2, name: 'Nhị Nghi (Tốt)',  good: true,  desc: 'Nhị Nghi tấn thất địa sinh tài — Làm nhà hưng vượng, giàu có thêm lộc.' },
      { idx: 3, name: 'Tam Địa Sát (Xấu)', good: false, desc: 'Tam Sát nhơn do giai đắc mệnh — Phạm Địa Sát, dễ sinh bệnh tật hao tán.' },
      { idx: 4, name: 'Tứ Tấn Tài (Tốt)', good: true,  desc: 'Tứ Tấn Tài chi phước lộc lai — Làm nhà phúc lộc tự tìm đến.' },
      { idx: 5, name: 'Ngũ Thọ Tử (Xấu)', good: false, desc: 'Ngũ Tử ly thân phòng tử biệt — Đại kỵ xây cất, gia đạo chia rẽ.' },
      { idx: 6, name: 'Lục Hoang Ốc (Xấu)', good: false, desc: 'Lục ốc tạo gia bất khả thành — Xây nhà phạm Hoang Ốc, khó thành đạt.' }
    ];
    const tens = Math.floor(lunarAge / 10);
    const units = lunarAge % 10;
    const hoangOcIdx = ((tens + units - 1) % 6 + 6) % 6;
    const hoangOc = HOANG_OC_6[hoangOcIdx];

    // 3. Tính Tam Tai (dòng 6341-6355 TaiLieuLyHoc.md)
    const TAM_TAI_MAP = {
      'Thân': ['Dần', 'Mão', 'Thìn'], 'Tý': ['Dần', 'Mão', 'Thìn'], 'Thìn': ['Dần', 'Mão', 'Thìn'],
      'Dần': ['Thân', 'Dậu', 'Tuất'], 'Ngọ': ['Thân', 'Dậu', 'Tuất'], 'Tuất': ['Thân', 'Dậu', 'Tuất'],
      'Tỵ': ['Hợi', 'Tý', 'Sửu'],     'Dậu': ['Hợi', 'Tý', 'Sửu'],     'Sửu': ['Hợi', 'Tý', 'Sửu'],
      'Hợi': ['Tỵ', 'Ngọ', 'Mùi'],     'Mão': ['Tỵ', 'Ngọ', 'Mùi'],     'Mùi': ['Tỵ', 'Ngọ', 'Mùi']
    };
    const tamTaiYears = TAM_TAI_MAP[bInfo.chi] || [];
    const phamTamTai = tamTaiYears.includes(targetInfo.chi);

    // 4. Bảng Tháng Xuất Giá cho Nữ giới (dòng 6727-6776 TaiLieuLyHoc.md)
    const XUAT_GIA_MAP = {
      'Tý':  { daiLoi: 'Tháng 6 & Tháng 12 ÂL', tieuLoi: 'Tháng 1 & Tháng 7 ÂL', congCo: 'Tháng 2 & 8', phuChu: 'Tháng 4 & 10', theChu: 'Tháng 5 & 11' },
      'Ngọ': { daiLoi: 'Tháng 6 & Tháng 12 ÂL', tieuLoi: 'Tháng 1 & Tháng 7 ÂL', congCo: 'Tháng 2 & 8', phuChu: 'Tháng 4 & 10', theChu: 'Tháng 5 & 11' },
      'Sửu': { daiLoi: 'Tháng 5 & Tháng 11 ÂL', tieuLoi: 'Tháng 4 & Tháng 10 ÂL', congCo: 'Tháng 3 & 9', phuChu: 'Tháng 1 & 7', theChu: 'Tháng 6 & 12' },
      'Mùi': { daiLoi: 'Tháng 5 & Tháng 11 ÂL', tieuLoi: 'Tháng 4 & Tháng 10 ÂL', congCo: 'Tháng 3 & 9', phuChu: 'Tháng 1 & 7', theChu: 'Tháng 6 & 12' },
      'Dần': { daiLoi: 'Tháng 2 & Tháng 8 ÂL',  tieuLoi: 'Tháng 3 & Tháng 9 ÂL', congCo: 'Tháng 4 & 10', phuChu: 'Tháng 6 & 12', theChu: 'Tháng 1 & 7' },
      'Thân':{ daiLoi: 'Tháng 2 & Tháng 8 ÂL',  tieuLoi: 'Tháng 3 & Tháng 9 ÂL', congCo: 'Tháng 4 & 10', phuChu: 'Tháng 6 & 12', theChu: 'Tháng 1 & 7' },
      'Mão': { daiLoi: 'Tháng 1 & Tháng 7 ÂL',  tieuLoi: 'Tháng 6 & Tháng 12 ÂL', congCo: 'Tháng 5 & 11', phuChu: 'Tháng 3 & 9', theChu: 'Tháng 2 & 8' },
      'Dậu': { daiLoi: 'Tháng 1 & Tháng 7 ÂL',  tieuLoi: 'Tháng 6 & Tháng 12 ÂL', congCo: 'Tháng 5 & 11', phuChu: 'Tháng 3 & 9', theChu: 'Tháng 2 & 8' },
      'Thìn':{ daiLoi: 'Tháng 4 & Tháng 10 ÂL', tieuLoi: 'Tháng 5 & Tháng 11 ÂL', congCo: 'Tháng 6 & 12', phuChu: 'Tháng 2 & 8', theChu: 'Tháng 3 & 9' },
      'Tuất':{ daiLoi: 'Tháng 4 & Tháng 10 ÂL', tieuLoi: 'Tháng 5 & Tháng 11 ÂL', congCo: 'Tháng 6 & 12', phuChu: 'Tháng 2 & 8', theChu: 'Tháng 3 & 9' },
      'Tỵ':  { daiLoi: 'Tháng 3 & Tháng 9 ÂL',  tieuLoi: 'Tháng 2 & Tháng 8 ÂL', congCo: 'Tháng 1 & 7', phuChu: 'Tháng 5 & 11', theChu: 'Tháng 4 & 10' },
      'Hợi': { daiLoi: 'Tháng 3 & Tháng 9 ÂL',  tieuLoi: 'Tháng 2 & Tháng 8 ÂL', congCo: 'Tháng 1 & 7', phuChu: 'Tháng 5 & 11', theChu: 'Tháng 4 & 10' }
    };

    const canBuild = !kimLau.pham && hoangOc.good && !phamTamTai;

    return {
      bInfo,
      targetInfo,
      lunarAge,
      kimLau,
      hoangOc,
      tamTai: {
        pham: phamTamTai,
        years: tamTaiYears,
        desc: phamTamTai
          ? `Tuổi ${bInfo.chi} gặp năm ${targetInfo.chi} là phạm hạn Tam Tai (${tamTaiYears.join(' – ')}).`
          : `Tuổi ${bInfo.chi} trong năm ${targetInfo.chi} không phạm Tam Tai (Tam Tai ở các năm ${tamTaiYears.join(' – ')}).`
      },
      xuatGia: XUAT_GIA_MAP[bInfo.chi],
      canBuild,
      summary: canBuild
        ? `🌟 ĐẠI CÁT XÂY DỰNG: Năm ${buildYear} (${targetInfo.canChi}), gia chủ tuổi ${birthYear} (${bInfo.canChi} – ${lunarAge} tuổi mụ) hoàn toàn KHÔNG phạm Kim Lâu, được cung ${hoangOc.name} và không phạm Tam Tai. Rất tốt để tự đứng tuổi Động thổ xây sửa nhà!`
        : `⚠️ LƯU Ý MƯỢN TUỔI ĐỘNG THỔ: Năm ${buildYear} (${targetInfo.canChi}), gia chủ ${lunarAge} tuổi mụ vướng ${[kimLau.pham ? kimLau.type : '', !hoangOc.good ? hoangOc.name : '', phamTamTai ? 'Tam Tai' : ''].filter(Boolean).join(', ')}. Theo chuẩn Lý học Đông Phương: Nếu mượn tuổi động thổ, BẮT BUỘC phải mượn tuổi người bề trên có CÙNG HUYẾT THỐNG với chủ nhà (không phạm Kim Lâu, Hoang Ốc, Tam Tai), tuyệt đối không mượn tuổi người ngoài.`
    };
  }

  window.LacVietTrachCat = {
    TRUC_12,
    VONG_HOANG_DAO,
    getHoangDaoDay,
    get12HoursHoangDao,
    getQuyNhanDangThienMon,
    getHuongXuatHanh,
    evaluateDayFull,
    scanGoodDaysInMonth,
    checkAgeForBuilding
  };
})();
