// ============================================================================
// ENGINE 2: LUẬN TUỔI LẠC VIỆT (GIA ĐẠO, HÔN NHÂN, CHỌN NĂM SINH CON ÚT & ĐỐI TÁC)
// Ngôn ngữ tư vấn thân thiện, dễ đọc hiểu cho khách hàng phổ thông & chuyên sâu
// ============================================================================

(function () {
  const AL = window.LacVietAmLich;

  // Từ điển tính cách đời thường theo Thiên Can & Ngũ Hành Mạng Lạc Việt
  const CAN_PERSONALITY = {
    'Giáp': 'Thẳng thắn, có tố chất dẫn dắt, trọng danh dự, đôi khi hơi cứng rắn nhưng rất có trách nhiệm.',
    'Ất':   'Mềm mỏng, khéo léo, biết tùy cơ ứng biến, sống tình cảm và chu đáo với người thân.',
    'Bính': 'Nhiệt huyết, hào sảng, hoạt bát, làm việc nhanh gọn nhưng đôi lúc nóng tính, nghĩ sao nói vậy.',
    'Đinh': 'Tinh tế, sâu sắc, ấm áp, biết lo xa và giữ lửa cho tổ ấm rất khéo.',
    'Mậu':  'Điềm đạm, vững chãi, trọng chữ tín, là chỗ dựa đáng tin cậy và rất có trách nhiệm gánh vác.',
    'Kỷ':   'Cẩn thận, tỉ mỉ, giỏi vun vén tài chính và chăm lo chu toàn cho nội bộ gia đình.',
    'Canh': 'Cương nghị, quyết đoán, độc lập cao, nói được làm được, thẳng tính và ghét sự giả dối.',
    'Tân':  'Sắc sảo, cầu toàn, nhạy bén với cái đẹp và tiền bạc, tự trọng cao.',
    'Nhâm': 'Thông minh, phóng khoáng, quảng giao, có tầm nhìn rộng và giỏi xoay xở trong công việc.',
    'Quý':  'Nhạy cảm, nhân hậu, kín đáo, giàu lòng trắc ẩn và có trực giác rất nhạy bén.'
  };

  // 1. Phân tích cấu trúc nội tại 3 trụ của 1 tuổi (Can - Chi - Mạng Lạc Thư Hoa Giáp)
  function analyzeSinglePerson(year, roleLabel = 'Đương số') {
    const info = AL.getYearInfo(year);
    const canToChi = AL.compareNguHanh(info.canHanh, info.chiHanh);
    const chiToMang = AL.compareNguHanh(info.chiHanh, info.lacVietHanh);
    const canToMang = AL.compareNguHanh(info.canHanh, info.lacVietHanh);

    let internalType = 'Bình hòa ổn định';
    let internalAdv = '';
    if (canToChi.score > 0 && chiToMang.score > 0) {
      internalType = 'Thuận lợi từ gốc (Tam Trụ Tương Sinh)';
      internalAdv = 'Trời phú cho sự thuận lợi nội tại: Suy nghĩ, hành động và sức khỏe/tài vận đồng nhất. Ra đời dễ gặp may mắn, có quý nhân nâng đỡ và tự tay gây dựng cơ đồ vững chắc.';
    } else if (canToChi.score >= 0 && chiToMang.score >= 0) {
      internalType = 'Vững vàng, ít biến động (Cát)';
      internalAdv = 'Tính cách và hoàn cảnh sống hài hòa: Cuộc đời ít gặp biến cố cực đoan, càng về trung niên và hậu vận càng sung túc, an nhàn.';
    } else if (canToChi.score < 0 && chiToMang.score > 0) {
      internalType = 'Khổ trước sướng sau (Tiền Khắc Hậu Sinh)';
      internalAdv = 'Thời trẻ (dưới 32 tuổi) thường phải tự lực cánh sinh, dễ đổi nghề hoặc lập nghiệp xa quê vất vả; nhưng nhờ gốc Mạng vững nên từ trung vận trở đi kinh tế và sự nghiệp rất khá giả.';
    } else {
      internalType = 'Nghị lực tự thân mạnh mẽ';
      internalAdv = 'Bản thân là người sắc sảo, hay lo nghĩ và tự ôm đồm nhiều việc. Khi lập gia đình rất cần người bạn đời biết chia sẻ hoặc sinh con út hợp mệnh để cuộc sống nhẹ nhàng, tụ tài tốt hơn.';
    }

    const canTrait = CAN_PERSONALITY[info.can] || '';
    let specialNote = `Tính cách nổi bật (Thiên Can ${info.can}): ${canTrait}`;

    return {
      roleLabel,
      info,
      canToChi,
      chiToMang,
      canToMang,
      internalType,
      internalAdv,
      specialNote
    };
  }

  // 2. Phân tích tương tác đồng đẳng 3 tầng giữa 2 người (VD: Chồng <-> Vợ, hoặc Cha/Mẹ <-> Con)
  function compareTwoPeople(y1, y2, label1 = 'Chồng', label2 = 'Vợ') {
    const p1 = AL.getYearInfo(y1);
    const p2 = AL.getYearInfo(y2);

    // Tầng 1: Thiên Can <-> Thiên Can (Tư duy, tiếng nói chung)
    const canPairKey = `${p1.can}-${p2.can}`;
    let canRel = AL.compareNguHanh(p1.canHanh, p2.canHanh);
    let canDetail = `${p1.can} (${p1.canHanh}) ↔ ${p2.can} (${p2.canHanh}): ${canRel.rel}`;
    let canHuman = '';
    let canScore = canRel.score * 10;

    if (AL.CAN_HOP_HOA[canPairKey]) {
      canDetail = `🌟 Thiên Can Hợp Hóa (${AL.CAN_HOP_HOA[canPairKey].desc})`;
      canHuman = `Rất tâm đầu ý hợp về suy nghĩ: Hai người dễ thấu hiểu tâm tư của nhau, bàn bạc việc lớn dễ đi đến thống nhất.`;
      canScore = 30;
    } else if (AL.CAN_XUNG[p1.can] === p2.can) {
      canDetail = `⚠️ Thiên Can Tương Xung (${p1.can} – ${p2.can})`;
      canHuman = `Đôi khi trái ngược quan điểm hoặc hơi khắc khẩu trong lời ăn tiếng nói; khi bàn việc lớn cần bình tĩnh lắng nghe, tránh nóng vội.`;
      canScore = -20;
    } else if (canRel.score > 0) {
      canHuman = `Suy nghĩ và định hướng tương trợ nhau tốt, người này nói người kia dễ tiếp thu và ủng hộ.`;
    } else if (canRel.score === 0) {
      canHuman = `Quan điểm sống độc lập, bình đẳng, tôn trọng ý kiến riêng của nhau.`;
    } else {
      canHuman = `Cách nhìn nhận vấn đề đôi lúc khác biệt; cần nhường nhịn lời nói để giữ hòa khí.`;
    }

    // Tầng 2: Địa Chi <-> Địa Chi (Thói quen sinh hoạt & tính nết)
    const chiPairKey = `${p1.chi}-${p2.chi}`;
    let chiRel = AL.compareNguHanh(p1.chiHanh, p2.chiHanh);
    let chiSpecial = 'Bình hòa';
    let chiHuman = '';
    let chiScore = chiRel.score * 10;

    if (AL.CHI_LUC_HOP[chiPairKey]) {
      chiSpecial = `🌟 Nhị Hợp (${AL.CHI_LUC_HOP[chiPairKey]})`;
      chiHuman = `Thói quen sinh hoạt và tình cảm gắn bó khăng khít, dễ quấn quýt và đồng hành cùng nhau.`;
      chiScore += 20;
    } else {
      const tamHopMatch = AL.CHI_TAM_HOP.find(g => g.group.includes(p1.chi) && g.group.includes(p2.chi) && p1.chi !== p2.chi);
      if (tamHopMatch) {
        chiSpecial = `🌟 Tam Hợp (${tamHopMatch.cuc})`;
        chiHuman = `Rất ăn ý trong lối sống và mục tiêu phấn đấu, làm việc chung dễ thành công.`;
        chiScore += 18;
      } else if (AL.CHI_LUC_XUNG[p1.chi] === p2.chi) {
        chiSpecial = `⚡ Lục Xung (${p1.chi} – ${p2.chi})`;
        chiHuman = `Cá tính và thói quen sinh hoạt hàng ngày khá trái ngược (một người thích nhanh, một người thích kỹ); cần chia sẻ việc nhà rõ ràng.`;
        chiScore -= 15;
      } else if (AL.CHI_LUC_HAI[p1.chi] === p2.chi) {
        chiSpecial = `🔸 Tương Hại (${p1.chi} – ${p2.chi})`;
        chiHuman = `Dễ nhạy cảm hoặc tự ái vì những lời nói vô tình; nên thẳng thắn tâm sự thay vì để bụng.`;
        chiScore -= 10;
      } else if (p1.chi === p2.chi) {
        chiSpecial = `🔹 Đồng Địa Chi (Cùng tuổi ${p1.chi})`;
        chiHuman = `Cùng con giáp nên rất hiểu tính nhau, chỉ cần tránh lúc cả hai cùng bướng bỉnh.`;
        chiScore += 5;
      } else {
        chiHuman = chiRel.score >= 0
          ? `Lối sống và sinh hoạt hàng ngày hài hòa, dễ thích nghi với nhau.`
          : `Nếp sinh hoạt có vài điểm khác biệt nhỏ, chỉ cần thông cảm cho nhau là êm ấm.`;
      }
    }
    const chiDetail = `Tuổi ${p1.chi} (${p1.chiHanh}) ↔ Tuổi ${p2.chi} (${p2.chiHanh}): ${chiSpecial} (${chiRel.rel})`;

    // Tầng 3: Thân Mạng Lạc Thư Hoa Giáp <-> Thân Mạng Lạc Thư Hoa Giáp (Gốc Tài Lộc & Sức Khỏe)
    const mangRel = AL.compareNguHanh(p1.lacVietHanh, p2.lacVietHanh);
    const mangHanRel = AL.compareNguHanh(p1.hanHanh, p2.hanHanh);
    const mangScore = mangRel.score * 18;
    const mangDetail = `${label1} mạng ${p1.lacVietHanh} ↔ ${label2} mạng ${p2.lacVietHanh}: ${mangRel.rel}`;
    let mangHuman = '';
    if (mangRel.score > 0) {
      mangHuman = `Gốc mệnh Tương Sinh (${p1.lacVietHanh} – ${p2.lacVietHanh}): Rất tốt cho sức khỏe và tài lộc đường dài, ở bên nhau càng lâu càng vượng.`;
    } else if (mangRel.score === 0) {
      mangHuman = `Gốc mệnh Tương Hòa (cùng hành ${p1.lacVietHanh}): Đồng sức đồng lòng, hợp lực tích lũy tài sản bền vững.`;
    } else {
      mangHuman = `Gốc mệnh Chế Khắc (${p1.lacVietHanh} – ${p2.lacVietHanh}): Dễ làm một người vất vả hơn hoặc tiền bạc hay phát sinh khoản chi bất ngờ; hóa giải tốt nhất bằng tuổi Con Út hợp mệnh!`;
    }

    const rawScore = 60 + canScore + chiScore + mangScore;
    const totalScore = Math.max(15, Math.min(99, Math.round(rawScore)));

    let rank = 'Trung Bình – Cần Nhường Nhịn & Điều Tiết';
    let badgeClass = 'badge-neutral';
    if (totalScore >= 80) {
      rank = 'Rất Hợp (Đại Cát – Tương Sinh Hòa Hợp)';
      badgeClass = 'badge-good';
    } else if (totalScore >= 65) {
      rank = 'Khá Hợp (Thuận Lợi & Bền Vững)';
      badgeClass = 'badge-good';
    } else if (totalScore < 50) {
      rank = 'Có Xung Khắc – Cần Tuổi Con Út Làm Cầu Nối';
      badgeClass = 'badge-warn';
    }

    return {
      p1,
      p2,
      label1,
      label2,
      can: { rel: canRel, detail: canDetail, human: canHuman, score: canScore },
      chi: { rel: chiRel, special: chiSpecial, detail: chiDetail, human: chiHuman, score: chiScore },
      mang: { rel: mangRel, hanRel: mangHanRel, detail: mangDetail, human: mangHuman, score: mangScore },
      totalScore,
      rank,
      badgeClass
    };
  }

  // 3. Phân tích toàn diện Gia Đạo theo Mô Hình "Tuổi Đầu Vào (Cha Mẹ) -> Tuổi Đầu Ra (Con Út)"
  function analyzeFamilyLacViet(fatherYear, motherYear, childrenYears = []) {
    const father = analyzeSinglePerson(fatherYear, 'Cha (Chồng)');
    const mother = analyzeSinglePerson(motherYear, 'Mẹ (Vợ)');
    const couple = compareTwoPeople(fatherYear, motherYear, 'Chồng', 'Vợ');

    const childrenAnalyses = childrenYears.map((cy, idx) => {
      const isYoungest = idx === childrenYears.length - 1;
      const orderTitle = childrenYears.length === 1
        ? 'Con Đầu Lòng (Đồng thời là Con Út hiện tại)'
        : (isYoungest ? `Con Thứ ${idx + 1} (🌟 CON ÚT – Quyết định vận khí gia đình)` : `Con Thứ ${idx + 1}`);
      const person = analyzeSinglePerson(cy, orderTitle);
      const withFather = compareTwoPeople(fatherYear, cy, 'Cha', 'Con');
      const withMother = compareTwoPeople(motherYear, cy, 'Mẹ', 'Con');

      // Kiểm tra xem đứa con này có đóng vai trò "Cầu nối Thông Quan" giữa Cha và Mẹ không
      const fHanh = father.info.lacVietHanh;
      const mHanh = mother.info.lacVietHanh;
      const cHanh = person.info.lacVietHanh;
      let isBridge = false;
      let bridgeExplanation = '';

      if ((AL.NGU_HANH_SINH[fHanh] === cHanh && AL.NGU_HANH_SINH[cHanh] === mHanh) ||
          (AL.NGU_HANH_SINH[mHanh] === cHanh && AL.NGU_HANH_SINH[cHanh] === fHanh)) {
        isBridge = true;
        bridgeExplanation = `🌟 CẦU NỐI VÀNG CHO CHA MẸ: Bé mệnh ${cHanh} đứng giữa chuyển hóa hoàn hảo cho Cha (${fHanh}) và Mẹ (${mHanh}), giúp hóa giải bất đồng của bố mẹ và đem lại lộc làm ăn rất rõ rệt!`;
      } else if (withFather.mang.rel.score > 0 && withMother.mang.rel.score > 0) {
        isBridge = true;
        bridgeExplanation = `✨ HỢP CẢ CHA LẪN MẸ: Bé mệnh ${cHanh} tương sinh thuận lợi với cả Cha (${fHanh}) và Mẹ (${mHanh}), nuôi con dễ dàng, gia đình thêm gắn kết.`;
      }

      const combinedChildScore = Math.round((withFather.totalScore + withMother.totalScore) / 2 + (isBridge ? 10 : 0));

      return {
        index: idx + 1,
        isYoungest,
        orderTitle,
        person,
        withFather,
        withMother,
        isBridge,
        bridgeExplanation,
        combinedScore: Math.min(99, combinedChildScore)
      };
    });

    // Đánh giá tổng kết vận khí gia đạo & tạo 3 Thẻ Tóm Tắt Đời Thường Dễ Đọc Cho Khách Hàng
    const youngest = childrenAnalyses.length > 0 ? childrenAnalyses[childrenAnalyses.length - 1] : null;
    let familyVerdict = '';
    let familySolution = '';
    let overallScore = couple.totalScore;

    // 3 thẻ tóm tắt nhanh bằng ngôn ngữ đời thường
    let summaryHoaKhi = '';
    let summaryTaiLoc = '';
    let summaryLoiKhuyen = '';

    if (couple.totalScore >= 72) {
      summaryHoaKhi = `Hai vợ chồng (${father.info.canChi} & ${mother.info.canChi}) có nền tảng tuổi rất hòa hợp (${couple.totalScore}/100 điểm). ${couple.can.human} ${couple.chi.human}`;
    } else if (couple.totalScore >= 55) {
      summaryHoaKhi = `Hai vợ chồng (${father.info.canChi} & ${mother.info.canChi}) ở mức Bình Hòa (${couple.totalScore}/100 điểm). Đôi lúc có khác biệt về lời nói hoặc thói quen sinh hoạt nhưng hoàn toàn có thể bù trừ tốt cho nhau.`;
    } else {
      summaryHoaKhi = `Tuổi của hai vợ chồng (${father.info.canChi} & ${mother.info.canChi}) có sự xung khắc nhất định (${couple.totalScore}/100 điểm), dễ khắc khẩu hoặc bất đồng ý kiến. Tuy nhiên bạn hoàn toàn yên tâm: Trong Lý học Lạc Việt, tuổi Con Út mới là chìa khóa hóa giải tất cả!`;
    }

    if (!youngest) {
      familyVerdict = `Hai bạn hiện đang xem ở chế độ "Đôi Lứa / Vợ Chồng Chưa Có Con" — Điểm hòa hợp của hai người đạt ${couple.totalScore}/100 điểm (${couple.rank}).`;
      familySolution = `Trong Lý học Lạc Việt, hai vợ chồng hợp hay khắc nhau lúc đầu chỉ là "Tuổi Đầu Vào". Khi sinh con, vận khí và tài lộc của cả gia đình sẽ chuyển sang phụ thuộc vào tuổi của người CON ÚT ("Tuổi Đầu Ra"). Hãy chọn năm sinh con đầu lòng trong Bảng Xếp Hạng Năm Sinh Con Tốt bên dưới để kích hoạt đại vận tài lộc cho cả hai vợ chồng!`;
      summaryTaiLoc = couple.mang.rel.score >= 0
        ? `Gốc mệnh của Chồng (${father.info.lacVietHanh}) và Vợ (${mother.info.lacVietHanh}) tương hỗ tốt: Khi về chung một nhà, hai bạn dễ đồng lòng làm ăn và tích lũy tài chính.`
        : `Gốc mệnh của Chồng (${father.info.lacVietHanh}) và Vợ (${mother.info.lacVietHanh}) đang khắc nhau: Giai đoạn đầu mới cưới có thể tốn kém hoặc vất vả xoay xở tiền bạc, nhưng khi sinh đứa con hợp tuổi thì kinh tế sẽ phất lên nhanh chóng.`;
      summaryLoiKhuyen = `1. Về tình cảm: Luôn tôn trọng sự khác biệt trong suy nghĩ của nhau.\n2. Về kế hoạch sinh con: Ưu tiên chọn các năm đạt trên 75 điểm ở bảng dưới để đứa con vừa dễ nuôi, vừa làm "cầu nối vàng" đem lại may mắn và giàu có cho bố mẹ.`;
    } else {
      overallScore = Math.round(couple.totalScore * 0.35 + youngest.combinedScore * 0.65);
      if (youngest.combinedScore >= 72) {
        familyVerdict = `🌟 GIA ĐÌNH VƯỢNG KHÍ NHỜ CON ÚT ("Giàu Con Út" – Đạt ${overallScore}/100 điểm): Dòng khí từ Cha (${father.info.canChi}) và Mẹ (${mother.info.canChi}) truyền xuống dừng lại ở bé Út (${youngest.person.info.year} ${youngest.person.info.canChi} – mạng ${youngest.person.info.lacVietHanh}) rất hợp tuổi bố mẹ (${youngest.combinedScore}/100 điểm). Bé Út chính là "ngôi sao may mắn" khóa chặt tài lộc và giữ gìn sự êm ấm cho cả nhà suốt 18 năm trưởng thành!`;
        familySolution = `Gia đình bạn đang có điểm dừng ở Con Út rất đẹp. Lời khuyên tốt nhất là giữ nguyên điểm dừng vận khí này, tập trung làm ăn, đầu tư và chăm chút phong thủy nhà ở (Cửa chính, Bếp, Phòng ngủ) để tài lộc nhân đôi.`;
        summaryTaiLoc = `Nhờ tuổi của bé Út (${youngest.person.info.year} ${youngest.person.info.canChi}) hợp với bố mẹ, từ khi sinh bé Út trở đi công việc làm ăn của gia đình có chiều hướng sáng sủa, gặp khó hóa lành và dễ tích lũy được nhà cửa, tài sản.`;
        summaryLoiKhuyen = `1. Giữ điểm dừng tại bé Út (${youngest.person.info.canChi}) hiện tại là tốt nhất.\n2. Người đứng tên quản lý tài sản/tài chính chính trong nhà nên ưu tiên người tương sinh tốt nhất với mệnh ${youngest.person.info.lacVietHanh} của bé Út.`;
      } else if (youngest.combinedScore >= 56) {
        familyVerdict = `⚖️ GIA ĐẠO BÌNH HÒA ỔN ĐỊNH (Đạt ${overallScore}/100 điểm): Điểm dừng vận khí tại bé Út (${youngest.person.info.year} ${youngest.person.info.canChi} – mạng ${youngest.person.info.lacVietHanh}) đạt mức Khá – Trung bình (${youngest.combinedScore}/100 điểm). Cuộc sống gia đình nhìn chung yên ổn, làm ăn có thu nhập đều đặn nhưng cần biết chi tiêu hợp lý.`;
        familySolution = `Hai vợ chồng nên giao quyền giữ tiền ("tay hòm chìa khóa") cho người có mệnh hợp hơn với bé Út (${youngest.person.info.lacVietHanh}), đồng thời giữ không gian bếp và phòng khách luôn sáng sủa, thông thoáng để tăng thêm sinh khí.`;
        summaryTaiLoc = `Kinh tế gia đình ở mức ổn định, làm đâu hưởng đó; hợp với việc đầu tư chắc chắn, tích lũy từng bước hơn là mạo hiểm lướt sóng.`;
        summaryLoiKhuyen = `1. Chồng và Vợ nên chia sẻ việc dạy con và nhường nhịn nhau khi bất đồng.\n2. Nếu dự định sinh thêm con trong tương lai, có thể tham khảo các năm trên 80 điểm ở bảng dưới để nâng vận khí gia đình lên mức Đại Cát.`;
      } else {
        familyVerdict = `⚠️ ĐIỂM DỪNG TẠI CON ÚT ĐANG HƠI XUNG KHẮC ("Khó Con Út" – Đạt ${overallScore}/100 điểm): Bé Út hiện tại (${youngest.person.info.year} ${youngest.person.info.canChi} – mạng ${youngest.person.info.lacVietHanh}) có tuổi chưa thật sự thuận với Cha/Mẹ (${youngest.combinedScore}/100 điểm). Thực tế cho thấy từ khi sinh bé Út này, bố mẹ dễ thấy công việc làm ăn vất vả hơn, tiền bạc dễ hao tán hoặc vợ chồng hay bất đồng hơn trước.`;
        familySolution = `Có 2 cách hóa giải rất hiệu quả trong Lý học Lạc Việt:\n• Cách 1 (Nếu vợ chồng còn trẻ và muốn thêm con): Chọn một năm thật đẹp ở bảng dưới để sinh thêm 1 bé Út mới hợp tuổi bố mẹ — vận khí cả nhà sẽ lập tức chuyển sang bé Út mới và phất lên!\n• Cách 2 (Nếu không sinh thêm con): Bố trí lại Phong thủy nhà ở (đặc biệt là hướng Bếp và Cửa chính), rèn cho bé Út tính tự lập sớm, và để người hợp mệnh với bé hơn đứng ra quản lý tài chính.`;
        summaryTaiLoc = `Dòng tiền trong gia đình dễ gặp cảnh "làm ra được nhưng cũng hay có việc phải chi tiêu hết", không nên cho vay mượn lớn hoặc đầu tư mạo hiểm tất tay.`;
        summaryLoiKhuyen = `1. Tuyệt đối không trách móc hay lo lắng tiêu cực: Bé có cá tính mạnh và độc lập, chỉ cần hướng cho bé học tập và tự lập sớm.\n2. Cải tạo phong thủy nhà ở (xem tại mục 4. Phong Thủy) để hóa giải phần hao hụt kinh tế.`;
      }
    }

    // Kiểm tra và giải oan các ngộ nhận dân gian nếu xuất hiện trong gia đình
    const mythBusters = [];
    const allChis = [father.info.chi, mother.info.chi, ...childrenAnalyses.map(c => c.person.info.chi)];
    // 1. Tứ hành xung
    const tuXungGroups = [
      ['Dần', 'Thân', 'Tỵ', 'Hợi'],
      ['Tý', 'Ngọ', 'Mão', 'Dậu'],
      ['Thìn', 'Tuất', 'Sửu', 'Mùi']
    ];
    tuXungGroups.forEach(g => {
      const matched = g.filter(chi => allChis.includes(chi));
      if (matched.length >= 2) {
        mythBusters.push({
          title: `Đừng lo lắng về lời đồn "Tứ Hành Xung" (${matched.join(' – ')})!`,
          content: `Rất nhiều người sợ câu "${g.join(' – ')} tứ hành xung". Thực tế con giáp (Địa Chi) chỉ chiếm 1/3 yếu tố. Khi xét đầy đủ cả Thiên Can và Gốc Mạng Lạc Việt (đặc biệt khi có Con Út hợp tuổi), hàng ngàn gia đình nằm trong nhóm Tứ Hành Xung vẫn giàu có, hạnh phúc viên mãn đến đầu bạc răng long!`
        });
      }
    });

    // 2. Tam hợp hóa tam tai
    AL.CHI_TAM_HOP.forEach(th => {
      const matched = th.group.filter(chi => allChis.includes(chi));
      if (matched.length >= 2) {
        mythBusters.push({
          title: `Giải oan lời đồn "Tam Hợp Hóa Tam Tai" (${matched.join(' – ')})!`,
          content: `Dân gian hay truyền miệng vợ chồng con cái cùng nhóm Tam Hợp (${th.group.join(' – ')}) sẽ bị "Tam Tai". Đây là quan niệm sai lầm: Tam Hợp giúp các thành viên trong nhà cực kỳ đồng lòng và hiểu ý nhau; còn tốt hay xấu về kinh tế là do Gốc Mạng và Thiên Can quyết định.`
        });
      }
    });

    // 3. Con ẩn tuổi Cha / Mẹ
    childrenAnalyses.forEach(c => {
      if (c.person.info.chi === father.info.chi || c.person.info.chi === mother.info.chi) {
        mythBusters.push({
          title: `Giải oan câu "Con Ẩn Tuổi Cha / Mẹ" (Trùng tuổi ${c.person.info.chi})`,
          content: `Con cái trùng con giáp (${c.person.info.chi}) với Cha hoặc Mẹ thường bị dân gian gọi là "ẩn tuổi". Thực tế con sinh cách bố mẹ 24 hoặc 36 năm sẽ có Thiên Can và Gốc Mạng hoàn toàn khác bố mẹ, nên hoàn toàn không có chuyện "con trai ẩn tuổi mẹ thì khổ" như lời đồn!`
        });
      }
    });

    // 4. Sự hoán vị Thủy - Hỏa trong Lạc Thư Hoa Giáp của thành viên gia đình
    const swappedMembers = [father, mother, ...childrenAnalyses.map(c => c.person)].filter(p => p.info.swapped);
    if (swappedMembers.length > 0) {
      mythBusters.push({
        title: `💡 Vì sao Mệnh của thành viên trong nhà khác với sách Tử Vi thông thường?`,
        content: `Trong gia đình bạn có ${swappedMembers.map(m => `<b>${m.roleLabel} sinh năm ${m.info.year} (${m.info.canChi})</b>: Sách Hán thông thường ghi là mệnh <b>${m.info.hanHanh}</b> (${m.info.hanName}), nhưng theo <b>Lạc Thư Hoa Giáp</b> chuẩn Lạc Việt thì mệnh thực sự là <b>${m.info.lacVietHanh}</b>`).join('; ')}. Đây chính là bí quyết cốt lõi của Lý học Lạc Việt: Các sách Hán cổ khi sao chép đã bị đảo ngược vị trí 2 hành Thủy và Hỏa (còn Kim, Mộc, Thổ vẫn giữ nguyên). Khi trả lại đúng mệnh Thủy – Hỏa gốc Lạc Việt, bạn sẽ thấy kết quả luận giải trùng khớp hoàn toàn với thực tế cuộc sống gia đình mình!`
      });
    }

    return {
      father,
      mother,
      couple,
      childrenAnalyses,
      youngest,
      overallScore,
      familyVerdict,
      familySolution,
      customerSummary: {
        hoaKhi: summaryHoaKhi,
        taiLoc: summaryTaiLoc,
        loiKhuyen: summaryLoiKhuyen
      },
      mythBusters
    };
  }

  // 4. Quét và xếp hạng Năm Sinh Con Tốt Nhất cho Cha & Mẹ (trong khoảng startYear .. endYear)
  function recommendChildYears(fatherYear, motherYear, startYear = 2025, endYear = 2036) {
    const fInfo = AL.getYearInfo(fatherYear);
    const mInfo = AL.getYearInfo(motherYear);
    const results = [];

    for (let y = startYear; y <= endYear; y++) {
      const cInfo = AL.getYearInfo(y);
      const withF = compareTwoPeople(fatherYear, y, 'Cha', 'Con');
      const withM = compareTwoPeople(motherYear, y, 'Mẹ', 'Con');

      // Kiểm tra cầu nối Thông Quan Ngũ Hành giữa Cha và Mẹ
      const fH = fInfo.lacVietHanh;
      const mH = mInfo.lacVietHanh;
      const cH = cInfo.lacVietHanh;
      let bridgeBonus = 0;
      let bridgeTag = '';
      let whyGood = '';

      if ((AL.NGU_HANH_SINH[fH] === cH && AL.NGU_HANH_SINH[cH] === mH) ||
          (AL.NGU_HANH_SINH[mH] === cH && AL.NGU_HANH_SINH[cH] === fH)) {
        bridgeBonus = 15;
        bridgeTag = '🌟 Cầu Nối Vàng Cho Bố Mẹ';
        whyGood = `Bé mệnh ${cH} làm cầu nối trung gian chuyển hóa giữa Cha (${fH}) và Mẹ (${mH}), giúp hóa giải xung khắc và cực vượng tài lộc.`;
      } else if (withF.mang.rel.score > 0 && withM.mang.rel.score > 0) {
        bridgeBonus = 10;
        bridgeTag = '✨ Tương Sinh Cả Bố Lẫn Mẹ';
        whyGood = `Mệnh ${cH} của bé tương sinh thuận lợi với cả Cha (${fH}) lẫn Mẹ (${mH}), nuôi con mát tay, gia đình thêm lộc.`;
      } else if (withF.mang.rel.score >= 0 && withM.mang.rel.score >= 0) {
        bridgeBonus = 5;
        bridgeTag = '✅ Bình Hòa Thuận Lợi';
        whyGood = `Mệnh ${cH} của bé hài hòa, êm ấm với cả bố và mẹ.`;
      } else {
        bridgeTag = '🔸 Cần Cân Nhắc';
        whyGood = `Mệnh ${cH} của bé hơi lệch pha với một bên bố hoặc mẹ, nên ưu tiên các năm xếp hạng cao hơn ở trên.`;
      }

      const avgScore = Math.min(99, Math.round((withF.totalScore + withM.totalScore) / 2 + bridgeBonus));
      results.push({
        year: y,
        cInfo,
        withF,
        withM,
        bridgeTag,
        whyGood,
        score: avgScore
      });
    }

    results.sort((a, b) => b.score - a.score);
    return results;
  }

  window.LacVietLuanTuoi = {
    analyzeSinglePerson,
    compareTwoPeople,
    analyzeFamilyLacViet,
    recommendChildYears
  };
})();
