(() => {
  "use strict";

  const SAVE_KEY = "conan-midnight-case-save-v3";
  const CORE_EVIDENCE = ["watch", "piano", "metronome", "door", "midi", "access", "amplifier", "toolcase"];
  const REQUIRED_LINKS = ["false-time", "machine-rhythm", "system-lie", "cloned-card", "misaki-slip"];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const el = {
    app: $("#app"), title: $("#title-screen"), game: $("#game-screen"), newGame: $("#new-game-button"),
    continueGame: $("#continue-button"), objective: $("#objective-label"), phase: $("#phase-label"),
    sound: $("#sound-button"), notebookButton: $("#notebook-button"), recordCount: $("#record-count"),
    scene: $("#scene"), sceneCaption: $("#scene-caption"), sceneTip: $("#scene-tip"), objectLayer: $("#object-layer"),
    locationNav: $("#location-nav"), portrait: $("#portrait"), speaker: $("#speaker-name"), speakerRole: $("#speaker-role"),
    dialogue: $("#dialogue-text"), choices: $("#choice-list"), next: $("#next-button"), dialoguePanel: $("#dialogue-panel"),
    notebook: $("#notebook"), notebookContent: $("#notebook-content"), inspection: $("#inspection"),
    inspectionTitle: $("#inspection-title"), inspectionVisual: $("#inspection-visual"), inspectionGlyph: $("#inspection-glyph"),
    inspectionPrompt: $("#inspection-prompt"), inspectionActions: $("#inspection-actions"), inspectionNotes: $("#inspection-notes"),
    inspectionClose: $("#inspection-close"), recordEvidence: $("#record-evidence"), linkBoard: $("#link-board"),
    linkClose: $("#link-close"), statementDeck: $("#statement-deck"), evidenceDeck: $("#evidence-deck"),
    linkFeedback: $("#link-feedback"), testLink: $("#test-link"), audioLab: $("#audio-lab"), audioClose: $("#audio-close"),
    audioAlign: $("#audio-align"), audioOffset: $("#audio-offset"), audioResult: $("#audio-result"), lockAudio: $("#lock-audio"),
    sceneWave: $("#scene-wave"), reconstruction: $("#reconstruction"), finalSlots: $("#final-slots"),
    finalDeck: $("#final-deck"), reconstructionProgress: $("#reconstruction-progress"),
    reconstructionFeedback: $("#reconstruction-feedback"), submitReconstruction: $("#submit-reconstruction"), toast: $("#toast"),
  };

  const characters = {
    conan: ["Edogawa Conan", "Thám tử"], ran: ["Mouri Ran", "Người đồng hành"],
    kogoro: ["Mouri Kogoro", "Thám tử tư"], megure: ["Thanh tra Megure", "Cảnh sát điều tra"],
    rina: ["Aoyama Rina", "Nghệ sĩ piano"], yuto: ["Senda Yuto", "Kỹ thuật viên âm thanh"],
    misaki: ["Kisaragi Misaki", "Quản lý nhà hát"], haru: ["Nishino Haru", "Phóng viên âm nhạc"],
    narrator: ["Hồ sơ vụ án", "Tường thuật"],
  };

  const prologue = [
    { who: "narrator", text: "Nhà hát Tsukikage, 0 giờ 07 phút. Mưa lớn đã giữ tất cả những người có mặt lại bên trong." },
    { who: "megure", text: "Nhạc sĩ Kisaragi Daigo được tìm thấy tử vong trong Phòng thu A. Cửa đã khóa, nhưng từ 23:50 đến đúng 0 giờ mọi người đều nghe ông ấy chơi đàn." },
    { who: "kogoro", text: "Vậy nạn nhân còn sống lúc 23:50. Hung thủ chỉ có thể ra tay sau khi bản nhạc kết thúc!" },
    { who: "conan", text: "Nếu tiếng đàn không dùng để chứng minh ông ấy còn sống, mà dùng để khiến mọi người tin như vậy thì sao?" },
    { who: "narrator", text: "Bạn sẽ không được chọn sẵn đáp án trong lúc lấy lời khai. Hãy nghe, lưu từng câu vào sổ rồi tự tìm vật chứng trong cảnh thật." },
  ];

  const suspects = {
    rina: {
      name: "Aoyama Rina", role: "Nghệ sĩ piano trẻ", icon: "R",
      intro: "Bị nạn nhân gạt tên khỏi phần đồng sáng tác. Có động cơ rõ ràng nhưng đang biểu diễn ở sân khấu phụ lúc 23:18.",
      lines: [
        { who: "rina", text: "Tôi căm ông Daigo vì đã xóa tên tôi khỏi bản nhạc, nhưng lúc 23:18 tôi đang ở sân khấu phụ trước hàng trăm khán giả." },
        { who: "conan", text: "Cô nghe thấy điều gì khác thường trong bản nhạc vang lên lúc 23:50?" },
        { who: "rina", text: "Nó hoàn hảo đến vô hồn. Ông ấy luôn ngừng nửa nhịp trước hợp âm cuối; đêm nay khoảng nghỉ ấy biến mất." },
      ],
      records: ["rina-rhythm"],
    },
    misaki: {
      name: "Kisaragi Misaki", role: "Quản lý kiêm em gái nạn nhân", icon: "M",
      intro: "Quản lý mọi quyền truy cập của nhà hát và là người cuối cùng xác nhận đã mang cà phê vào phòng thu.",
      lines: [
        { who: "misaki", text: "Tôi mang cà phê vào lúc 23:08 rồi rời đi ngay. Anh tôi còn sống và đang tranh cãi về tiền bản quyền." },
        { who: "conan", text: "Khi ra hành lang, cô nhìn thấy ai?" },
        { who: "misaki", text: "Yuto cầm thẻ S-04 đứng gần cửa. Tôi nghĩ anh ta đến sửa cây đàn tự động... chỉ vậy thôi." },
      ],
      records: ["misaki-last", "misaki-slip"],
    },
    haru: {
      name: "Nishino Haru", role: "Phóng viên âm nhạc", icon: "H",
      intro: "Đang điều tra bê bối đạo nhạc của nạn nhân. Cái chết khiến bài báo của anh mất nguồn tin quan trọng nhất.",
      lines: [
        { who: "haru", text: "Tôi ra bãi xe gọi cho tòa soạn. Lúc trở lại khoảng 23:25, áo và ô đều ướt sũng." },
        { who: "conan", text: "Anh có gặp ai trên đường trở lại không?" },
        { who: "haru", text: "Yuto bước khỏi phòng điều khiển, ôm một hộp dụng cụ kim loại. Trông anh ta rất hoảng." },
      ],
      records: ["haru-control"],
    },
    yuto: {
      name: "Senda Yuto", role: "Kỹ thuật viên âm thanh", icon: "Y",
      intro: "Hiểu hệ thống đàn tự động hơn bất kỳ ai. Em gái quá cố của anh từng sáng tác một bản nhạc cùng tên.",
      lines: [
        { who: "yuto", text: "Tôi không vào Phòng thu A sau 22:40. Thẻ S-04 luôn ở trong hộp dụng cụ của tôi." },
        { who: "conan", text: "Còn hệ thống âm thanh sau 23:30?" },
        { who: "yuto", text: "Đã tắt hoàn toàn. Tôi không chạm vào bàn điều khiển và cũng không biết ai đã phát bản nhạc." },
      ],
      records: ["yuto-room", "yuto-system"],
    },
  };

  const statements = {
    "crowd-time": { who: "Nhiều nhân chứng", quote: "Tiếng đàn từ 23:50 chứng minh Daigo còn sống đến gần 0 giờ.", source: "Mở đầu vụ án" },
    "rina-rhythm": { who: "Aoyama Rina", quote: "Bản nhạc quá hoàn hảo; khoảng nghỉ nửa nhịp quen thuộc đã biến mất.", source: "Lời khai Rina" },
    "misaki-last": { who: "Kisaragi Misaki", quote: "Tôi rời Phòng thu A ngay sau khi mang cà phê vào lúc 23:08.", source: "Lời khai Misaki" },
    "misaki-slip": { who: "Kisaragi Misaki", quote: "Tôi nghĩ Yuto đến sửa cây đàn tự động.", source: "Lời khai Misaki" },
    "haru-control": { who: "Nishino Haru", quote: "Khoảng 23:25, Yuto rời phòng điều khiển với hộp dụng cụ.", source: "Lời khai Haru" },
    "yuto-room": { who: "Senda Yuto", quote: "Tôi không vào Phòng thu A sau 22:40; thẻ S-04 nằm trong hộp.", source: "Lời khai Yuto" },
    "yuto-system": { who: "Senda Yuto", quote: "Hệ thống âm thanh đã tắt hoàn toàn từ 23:30.", source: "Lời khai Yuto" },
  };

  const evidence = {
    watch: {
      name: "Đồng hồ thông minh", glyph: "⌚", location: "studio", area: [42, 59, 10, 12],
      prompt: "Chiếc đồng hồ nằm sát chân micro. Màn hình vỡ nhưng bộ nhớ cục bộ chưa mất.",
      actions: [
        ["Đọc cảm biến", "Biểu đồ nhịp tim dừng đột ngột ở một mốc duy nhất: 23:18."],
        ["Soi vết nứt", "Vết nứt xuất phát từ cạnh trái, phù hợp với cú ngã mạnh xuống sàn."],
      ],
      description: "Nhịp tim của Daigo dừng lúc 23:18, sớm hơn tiếng đàn hơn 30 phút.",
      timeline: ["23:18", "Nhịp tim của Daigo dừng lại."],
    },
    piano: {
      name: "Đàn grand piano", glyph: "♬", location: "studio", area: [17, 25, 30, 38],
      prompt: "Cây đàn chiếm gần nửa căn phòng. Nếu vừa có người biểu diễn, cơ cấu và bàn đạp phải để lại dấu vết.",
      actions: [
        ["Kiểm tra phím", "Phím sạch đều, không có dấu dầu tay mới ở đoạn cao trào."],
        ["Soi bàn đạp", "Lớp bụi mỏng trên cả ba bàn đạp vẫn nguyên vẹn."],
      ],
      description: "Không có dấu hiệu một người thật vừa biểu diễn; bàn đạp vang hoàn toàn không được dùng.",
    },
    metronome: {
      name: "Máy đếm nhịp", glyph: "△", location: "studio", area: [79, 67, 8, 21],
      prompt: "Máy đếm nhịp đặt trên bàn tiền cảnh. Thân gỗ còn mới nhưng trọng tâm bị lệch.",
      actions: [
        ["Xoay mặt sau", "Chốt giữ đã bị mở bằng tay, không phải hỏng do va đập."],
        ["Kiểm tra thanh trượt", "Quả nặng bằng đồng đã biến mất; cạnh đế có vết lõm và sợi vải kem rất nhỏ."],
      ],
      description: "Quả nặng bằng đồng bị tháo có thể là hung khí; sợi vải kem bám trong vết lõm.",
    },
    door: {
      name: "Cửa kính phòng thu", glyph: "▣", location: "studio", area: [71, 17, 25, 47],
      prompt: "Cửa kính nối Phòng thu A với phòng điều khiển. Không thấy ổ khóa cơ học ở phía trong.",
      actions: [
        ["Thử chốt cửa", "Chỉ cần khép cánh cửa, chốt điện tử tự động đóng sau ba giây."],
        ["Soi ray dưới", "Không có dấu cạy hay lối thoát phụ. Đây không phải một căn phòng kín thật sự."],
      ],
      description: "Hung thủ có thể rời phòng rồi khép cửa; chốt điện tử sẽ tự khóa sau ba giây.",
    },
    coffee: {
      name: "Tách cà phê lạnh", glyph: "☕", location: "studio", area: [69, 72, 8, 13], optional: true,
      prompt: "Chiếc tách nằm trên bàn tiền cảnh, gần máy đếm nhịp.",
      actions: [
        ["Đo nhiệt độ", "Cà phê đã lạnh hoàn toàn và có lớp màng mỏng trên mặt."],
        ["Soi thành cốc", "Không có chất lạ rõ ràng; đây là mốc thời gian, không phải hung khí."],
      ],
      description: "Cà phê được rót từ lâu trước 0 giờ; không phát hiện độc chất thông thường.",
      timeline: ["23:08", "Misaki mang cà phê vào Phòng thu A."],
    },
    midi: {
      name: "Lệnh phát MIDI", glyph: "▶", location: "control", area: [43, 39, 39, 26], audio: true,
      prompt: "Màn hình trung tâm lưu một lệnh phát đã bị đổi tên. Chỉ phân tích âm thanh mới xác định được nó có điều khiển đàn hay không.",
      actions: [
        ["Đọc lịch tác vụ", "Tệp midnight_take.mid được hẹn chạy từ 23:50 đến đúng 0 giờ."],
        ["Kiểm tra chữ ký lệnh", "Lệnh dùng mã quản lý M-01 rồi bị đổi nhãn thành S-04."],
      ],
      description: "Tệp MIDI tự điều khiển đàn lúc 23:50; lệnh gốc dùng mã quản lý M-01, sau đó bị ngụy trang.",
      timeline: ["23:50", "Tệp midnight_take.mid bắt đầu điều khiển cây đàn."],
    },
    access: {
      name: "Bộ nhớ đầu đọc thẻ", glyph: "#", location: "control", area: [3, 34, 9, 23],
      prompt: "Đầu đọc cửa còn giữ bản sao thô dù nhật ký trung tâm đã bị xóa một dòng.",
      actions: [
        ["Khôi phục bộ đệm", "Mã S-04 mở cửa lúc 23:12."],
        ["Đọc checksum", "Checksum không trùng thẻ gốc: đầu đọc đã nhận một bản sao được nhân bản."],
      ],
      description: "Một bản sao của thẻ S-04 mở cửa lúc 23:12; mã thẻ không chứng minh người dùng là Yuto.",
      timeline: ["23:12", "Bản sao thẻ S-04 mở Phòng thu A."],
    },
    amplifier: {
      name: "Bộ khuếch đại", glyph: "≈", location: "control", area: [32, 22, 13, 31],
      prompt: "Cụm khuếch đại cạnh cửa có đèn báo đã tắt nhưng khe thoát nhiệt vẫn còn ấm.",
      actions: [
        ["Đo nhiệt dư", "Nhiệt độ cho thấy thiết bị hoạt động ít nhất đến 23:52."],
        ["Đọc tải cuối", "Tải cuối là sao chép kho lưu trữ HANA_MASTER, không phải phát MIDI."],
      ],
      description: "Hệ thống còn hoạt động sau 23:30; Yuto đã nói dối để giấu việc sao chép kho HANA_MASTER.",
    },
    toolcase: {
      name: "Hộp dụng cụ niêm phong", glyph: "▰", location: "control", area: [82, 69, 17, 24],
      prompt: "Hộp dụng cụ Haru nhìn thấy nằm dưới bàn. Dây niêm phong màu đỏ chưa bị cắt.",
      actions: [
        ["Soi dây niêm phong", "Tem bảo trì đóng lúc 22:55 vẫn liền mạch."],
        ["Nhìn qua khe thẻ", "Thẻ S-04 nguyên bản nằm trong ngăn nhựa phía trong suốt thời gian hộp bị niêm phong."],
      ],
      description: "Thẻ S-04 gốc nằm trong hộp niêm phong từ 22:55; mã mở cửa 23:12 là bản sao.",
    },
    umbrella: {
      name: "Chiếc ô ướt", glyph: "☂", location: "hall", area: [57, 55, 12, 23], optional: true,
      prompt: "Một chiếc ô gấp tựa vào dãy tủ giữa hành lang.",
      actions: [
        ["Chạm mặt vải", "Nước mưa còn nhỏ xuống sàn; chiếc ô vừa được mang từ ngoài vào."],
        ["Xem thẻ tên", "Thẻ tên ghi Nishino Haru. Chi tiết này xác nhận đường đi từ bãi xe."],
      ],
      description: "Chiếc ô ướt xác nhận Haru vừa trở lại từ bãi xe như lời khai.",
      timeline: ["23:25", "Haru trở lại và thấy Yuto rời phòng điều khiển."],
    },
  };

  const links = {
    "false-time": { statement: "crowd-time", evidence: "watch", title: "Thời điểm tử vong giả", text: "Tiếng đàn không thể chứng minh Daigo còn sống: nhịp tim đã dừng lúc 23:18." },
    "machine-rhythm": { statement: "rina-rhythm", evidence: "midi", title: "Nhịp đàn phi tự nhiên", text: "Khoảng nghỉ cá nhân biến mất vì bản nhạc được lượng tử hóa trên lưới MIDI." },
    "system-lie": { statement: "yuto-system", evidence: "amplifier", title: "Lời nói dối của Yuto", text: "Yuto giấu việc sao chép HANA_MASTER; lời nói dối khiến anh đáng ngờ nhưng chưa chứng minh giết người." },
    "cloned-card": { statement: "yuto-room", evidence: "toolcase", title: "Chiếc thẻ không buộc tội được Yuto", text: "S-04 gốc nằm trong hộp niêm phong. Người mở cửa đã dùng bản sao." },
    "misaki-slip": { statement: "misaki-slip", evidence: "midi", title: "Kiến thức chưa được công bố", text: "Misaki biết cây đàn tự động trước khi cảnh sát công bố thủ thuật; mã quản lý M-01 cũng ký lệnh phát." },
    "haru-route": { statement: "haru-control", evidence: "umbrella", title: "Đường đi của Haru", text: "Chiếc ô ướt củng cố lời Haru về thời điểm quay lại hành lang." },
  };

  const finalSlots = [
    { id: "time", label: "Thời điểm tử vong", hint: "Mốc khách quan", correct: "watch" },
    { id: "music", label: "Thủ thuật tiếng đàn", hint: "Nguồn âm thật", correct: "midi" },
    { id: "room", label: "Căn phòng khóa kín", hint: "Cách rời hiện trường", correct: "door" },
    { id: "weapon", label: "Hung khí", hint: "Bộ phận bị mất", correct: "metronome" },
    { id: "culprit", label: "Thủ phạm và động cơ", hint: "Ai dựng màn kịch?", correct: "suspect-misaki" },
  ];

  const reveal = [
    { who: "conan", text: "Daigo đã chết lúc 23:18. Tiếng đàn sau đó chỉ là tệp MIDI được hẹn giờ, nên mọi lời khai dựa trên mốc 23:50 đều sai." },
    { who: "conan", text: "Cửa tự khóa khi khép lại. Hung thủ rời đi từ trước rồi dùng bản nhạc để biến một căn phòng bình thường thành phòng kín trong trí tưởng tượng của mọi người." },
    { who: "megure", text: "Nhưng bộ nhớ đầu đọc ghi thẻ S-04 của Yuto lúc 23:12." },
    { who: "conan", text: "Đó là bản sao. S-04 gốc nằm trong hộp niêm phong từ 22:55. Yuto nói dối vì anh lén sao chép kho nhạc của em gái, không phải vì đã giết Daigo." },
    { who: "yuto", text: "Tôi chỉ muốn giữ lại bản gốc của Hana trước khi ông ấy xóa sạch. Tôi sợ cảnh sát coi đó là hành vi phá hoại dữ liệu." },
    { who: "conan", text: "Lệnh MIDI ban đầu được ký bằng mã quản lý M-01. Và trước khi cảnh sát nói tới cây đàn tự động, chỉ một người đã vô tình nhắc đúng thủ thuật ấy." },
    { who: "conan", text: "Sợi vải kem trên máy đếm nhịp cũng trùng với áo khoác quản lý. Hung thủ là cô, Kisaragi Misaki." },
    { who: "misaki", text: "Anh ấy định đổ toàn bộ tiền bản quyền bẩn lên tên tôi rồi hủy bản thảo của Hana. Tôi chỉ muốn ép anh ấy thú nhận... nhưng anh ấy cười vào mặt tôi." },
    { who: "misaki", text: "Tôi vung quả nặng trong lúc giằng co. Sau đó tôi nhân bản S-04, đặt lịch bản nhạc và hy vọng mọi người sẽ chỉ nhìn về phía Yuto." },
    { who: "ran", text: "Cô đã bảo vệ một sự thật bằng quá nhiều lời nói dối. Cuối cùng, chính những lời nói dối đó đưa mọi người trở lại sự thật." },
    { who: "conan", text: "Một vụ án không được giải bằng việc đoán đúng một cái tên. Nó được giải khi mọi mắt xích đều không còn cách giải thích nào khác." },
  ];

  const locations = {
    hall: "Hành lang nhà hát • 0 giờ 07", studio: "Phòng thu A • Hiện trường", control: "Phòng điều khiển • Hệ thống âm thanh",
  };

  const state = {
    phase: "title", location: "hall", interviews: new Set(), statementCards: new Set(["crowd-time"]),
    evidence: new Set(), inspections: {}, links: new Set(), audioSolved: false, mistakes: 0,
    final: {}, sound: true, rank: null,
  };

  let queue = [], queueDone = null, typingTimer = 0, fullText = "", typing = false, toastTimer = 0;
  let pendingEvidence = null, selectedStatement = null, selectedEvidence = null, selectedFinalCard = null;
  let audioContext = null, masterGain = null, scoreTimer = 0, scoreStep = 0;

  function serialize() {
    const inspectionData = {};
    Object.entries(state.inspections).forEach(([id, values]) => { inspectionData[id] = [...values]; });
    return { ...state, interviews: [...state.interviews], statementCards: [...state.statementCards], evidence: [...state.evidence], inspections: inspectionData, links: [...state.links] };
  }

  function save() {
    if (state.phase === "title") return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(serialize()));
    el.continueGame.hidden = false;
  }

  function readSave() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch { return null; }
  }

  function applySave(saved) {
    state.phase = saved.phase || "statements"; state.location = saved.location || "hall";
    state.interviews = new Set(saved.interviews || []); state.statementCards = new Set(saved.statementCards || ["crowd-time"]);
    state.evidence = new Set(saved.evidence || []); state.inspections = {};
    Object.entries(saved.inspections || {}).forEach(([id, values]) => { state.inspections[id] = new Set(values); });
    state.links = new Set(saved.links || []); state.audioSolved = Boolean(saved.audioSolved); state.mistakes = saved.mistakes || 0;
    state.final = saved.final || {}; state.sound = saved.sound !== false; state.rank = saved.rank || null;
  }

  function showGame() { el.title.classList.remove("active"); el.game.classList.add("active"); }

  function setPhase(phase, label) {
    state.phase = phase; el.phase.textContent = label; updateObjective(); save();
  }

  function updateObjective() {
    const core = CORE_EVIDENCE.filter((id) => state.evidence.has(id)).length;
    const labels = {
      prologue: "Đọc mở đầu vụ án", statements: `Lấy lời khai ${state.interviews.size}/4`,
      investigation: core === CORE_EVIDENCE.length ? "Đã đủ vật chứng • Đối chiếu" : `Khám phá vật chứng ${core}/${CORE_EVIDENCE.length}`,
      linking: `Khóa mối liên hệ ${state.links.size}/${REQUIRED_LINKS.length}`,
      reconstruction: "Tự dựng lại toàn bộ vụ án", reveal: "Đối chất", ending: "Hồ sơ đã khép lại",
    };
    el.objective.textContent = labels[state.phase] || "Theo dấu sự thật";
    el.recordCount.textContent = String(state.statementCards.size + state.evidence.size + state.links.size);
  }

  function setPortrait(who) {
    const id = characters[who] ? who : "narrator";
    el.portrait.className = `portrait ${id}`; el.portrait.hidden = id === "narrator";
    el.dialoguePanel.classList.toggle("narrator-dialogue", id === "narrator");
    [el.speaker.textContent, el.speakerRole.textContent] = characters[id];
  }

  function finishTyping() {
    if (!typing) return false; clearInterval(typingTimer); el.dialogue.textContent = fullText; typing = false; return true;
  }

  function typeLine(text) {
    clearInterval(typingTimer); fullText = text; el.dialogue.textContent = ""; typing = true;
    let index = 0; const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    typingTimer = setInterval(() => {
      index = Math.min(text.length, index + (reduced ? text.length : 2)); el.dialogue.textContent = text.slice(0, index);
      if (index >= text.length) { clearInterval(typingTimer); typing = false; }
    }, reduced ? 1 : 16);
  }

  function renderChoices(items = []) {
    el.choices.replaceChildren();
    items.forEach((item) => {
      const button = document.createElement("button"); button.type = "button"; button.textContent = item.label;
      button.disabled = Boolean(item.disabled); button.addEventListener("click", (event) => { event.stopPropagation(); playTone(620, .05, "sine", .02); item.action(); });
      el.choices.append(button);
    });
  }

  function setDialogue(who, text, { next = false, choices = [] } = {}) {
    setPortrait(who); typeLine(text); el.next.hidden = !next; renderChoices(choices);
  }

  function playDialogue(lines, done) { queue = [...lines]; queueDone = done || null; nextLine(); }
  function nextLine() {
    if (!queue.length) { el.next.hidden = true; const done = queueDone; queueDone = null; if (done) done(); return; }
    const line = queue.shift(); setDialogue(line.who, line.text, { next: true });
  }
  function advanceDialogue() { if (!finishTyping()) nextLine(); }

  function toast(message) {
    clearTimeout(toastTimer); el.toast.textContent = message; el.toast.classList.add("visible");
    toastTimer = setTimeout(() => el.toast.classList.remove("visible"), 2600);
  }

  function changeLocation(location) {
    state.location = location; el.scene.classList.remove("scene-hall", "scene-studio", "scene-control");
    el.scene.classList.add(`scene-${location}`, "entering"); el.sceneCaption.textContent = locations[location];
    $$('[data-location]', el.locationNav).forEach((button) => button.classList.toggle("active", button.dataset.location === location));
    renderObjects(); setTimeout(() => el.scene.classList.remove("entering"), 260); save();
  }

  function renderObjects() {
    el.objectLayer.replaceChildren(); if (state.phase !== "investigation") return;
    Object.entries(evidence).forEach(([id, item]) => {
      if (item.location !== state.location) return;
      const button = document.createElement("button"); button.type = "button";
      button.className = `object-hotspot${state.evidence.has(id) ? " found" : ""}`;
      button.dataset.evidence = id;
      const [left, top, width, height] = item.area; Object.assign(button.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
      button.setAttribute("aria-label", state.evidence.has(id) ? `Xem lại ${item.name}` : `Quan sát vật thể trong cảnh`);
      button.innerHTML = `<span>${state.evidence.has(id) ? `ĐÃ GHI • ${item.name}` : "Quan sát vật thể"}</span><i aria-hidden="true"></i>`;
      button.addEventListener("click", () => openInspection(id)); el.objectLayer.append(button);
    });
  }

  function startStatements() {
    el.locationNav.hidden = true; el.sceneTip.hidden = true; changeLocation("hall"); setPhase("statements", "Lấy lời khai"); renderStatementMenu();
  }

  function renderStatementMenu() {
    const complete = Object.keys(suspects).every((id) => state.interviews.has(id));
    const choices = Object.entries(suspects).map(([id, person]) => ({ label: `${state.interviews.has(id) ? "✓ " : ""}${person.name}`, action: () => interview(id) }));
    if (complete) choices.unshift({ label: "Đến hiện trường", action: beginInvestigation });
    setDialogue("conan", complete
      ? "Đã ghi đủ lời khai. Bây giờ hãy tìm đồ vật thật trong ba khu vực và kiểm tra xem câu nào chịu được vật chứng."
      : "Trước tiên chỉ lấy lời khai, chưa tranh luận và chưa đưa vật chứng. Mỗi lời nói sẽ được lưu nguyên văn trong Sổ vụ án.", { choices });
  }

  function interview(id) {
    const person = suspects[id];
    playDialogue(person.lines, () => {
      const first = !state.interviews.has(id); state.interviews.add(id); person.records.forEach((record) => state.statementCards.add(record));
      updateObjective(); save(); if (first) toast(`Đã lưu lời khai của ${person.name}`); renderStatementMenu();
    });
  }

  function beginInvestigation() {
    setPhase("investigation", "Khám phá hiện trường"); el.locationNav.hidden = false; el.sceneTip.hidden = false;
    changeLocation("studio"); renderInvestigationPrompt();
  }

  function renderInvestigationPrompt() {
    const core = CORE_EVIDENCE.filter((id) => state.evidence.has(id)).length;
    const choices = [{ label: "Mở sổ vụ án", action: openNotebook }];
    if (core >= 4) choices.push({ label: "Mở bảng đối chiếu", action: openLinkBoard });
    if (core === CORE_EVIDENCE.length && REQUIRED_LINKS.every((id) => state.links.has(id))) choices.unshift({ label: "Dựng lại vụ án", action: openReconstruction });
    setDialogue("conan", core === CORE_EVIDENCE.length
      ? "Không còn vật chứng cốt lõi nào bị bỏ sót. Hãy ghép lời khai với vật chứng; một lời nói dối chưa chắc đồng nghĩa với giết người."
      : `Quan sát đồ vật trong ảnh; không còn dấu “+”. Vật khả nghi chỉ phản sáng nhẹ khi rê chuột hoặc chạm. Đã ghi ${core}/${CORE_EVIDENCE.length} vật chứng cốt lõi.`, { choices });
  }

  function openInspection(id) {
    const item = evidence[id]; if (!item) return; pendingEvidence = id;
    if (!state.inspections[id]) state.inspections[id] = new Set();
    el.inspectionTitle.textContent = state.evidence.has(id) ? item.name : "Vật thể chưa xác định";
    el.inspectionGlyph.textContent = item.glyph; el.inspectionVisual.dataset.kind = id; el.inspectionPrompt.textContent = item.prompt;
    renderInspection(); if (!el.inspection.open) el.inspection.showModal(); playTone(300, .13, "triangle", .02);
  }

  function renderInspection() {
    const item = evidence[pendingEvidence]; const inspected = state.inspections[pendingEvidence]; if (!item || !inspected) return;
    el.inspectionActions.replaceChildren(); el.inspectionNotes.replaceChildren();
    item.actions.forEach(([label], index) => {
      const button = document.createElement("button"); button.type = "button"; button.textContent = `${inspected.has(index) ? "✓ " : ""}${label}`;
      button.classList.toggle("done", inspected.has(index)); button.addEventListener("click", () => inspectDetail(index)); el.inspectionActions.append(button);
      if (inspected.has(index)) { const note = document.createElement("p"); note.textContent = item.actions[index][1]; el.inspectionNotes.append(note); }
    });
    if (item.audio && !state.audioSolved) {
      const button = document.createElement("button"); button.type = "button"; button.className = "audio-action"; button.textContent = "♫ So sánh hai bản ghi";
      button.addEventListener("click", openAudioLab); el.inspectionActions.append(button);
    }
    const complete = inspected.size === item.actions.length && (!item.audio || state.audioSolved);
    el.recordEvidence.disabled = !complete || state.evidence.has(pendingEvidence);
    el.recordEvidence.textContent = state.evidence.has(pendingEvidence) ? "Đã ghi trong sổ" : complete ? "Ghi vật chứng vào sổ" : "Kiểm tra đủ các chi tiết";
  }

  function inspectDetail(index) {
    const item = evidence[pendingEvidence]; const inspected = state.inspections[pendingEvidence]; if (!item || !inspected) return;
    inspected.add(index); el.inspectionVisual.classList.remove("turn"); void el.inspectionVisual.offsetWidth; el.inspectionVisual.classList.add("turn");
    playTone(520 + index * 90, .08, "sine", .018); renderInspection(); save();
  }

  function recordPendingEvidence() {
    const id = pendingEvidence; const item = evidence[id]; if (!item || el.recordEvidence.disabled) return;
    state.evidence.add(id); el.inspectionTitle.textContent = item.name; updateObjective(); save(); renderInspection(); renderObjects();
    playChord([50, 57, 62, 65], .75, .011); toast(`Đã ghi vật chứng: ${item.name}`); setTimeout(() => { closeInspection(); renderInvestigationPrompt(); }, 620);
  }

  function closeInspection() { if (el.inspection.open) el.inspection.close(); pendingEvidence = null; }

  function openAudioLab() {
    if (el.inspection.open) el.inspection.close(); updateAudioReadout(); if (!el.audioLab.open) el.audioLab.showModal();
  }

  function updateAudioReadout() {
    const value = Number(el.audioAlign.value); const offset = 100 - value;
    el.sceneWave.style.transform = `translateX(${(value - 58) * .7}px)`; el.audioOffset.textContent = `Độ lệch: ${offset > 0 ? "+" : ""}${offset} ms`;
    el.audioResult.textContent = Math.abs(value - 58) <= 3 ? "Hai đầu câu đã khớp. Khoảng nghỉ giữa câu vẫn biến mất." : "Hai bản ghi chưa khớp lưới thời gian.";
  }

  function playSample(kind) {
    ensureAudio(); const notes = [52, 55, 59, 64, 62, 59];
    const humanTimes = [0, .24, .51, .82, 1.22, 1.48]; const machineTimes = [0, .25, .5, .75, 1, 1.25];
    (kind === "human" ? humanTimes : machineTimes).forEach((time, index) => setTimeout(() => playMidi(notes[index], .18, .035), time * 620));
  }

  function lockAudio() {
    const value = Number(el.audioAlign.value);
    if (Math.abs(value - 58) > 3) { state.mistakes += 1; el.audioResult.textContent = "Điểm đầu và cuối câu vẫn trượt nhau. Hãy nghe lại rồi dịch bản ghi."; playTone(125, .18, "sawtooth", .02); save(); return; }
    state.audioSolved = true; el.audioResult.textContent = "Đã khóa: bản hiện trường bám lưới tuyệt đối, không có độ trễ tự nhiên của người chơi.";
    playChord([48, 55, 60, 64], .9, .014); save(); setTimeout(() => { if (el.audioLab.open) el.audioLab.close(); if (pendingEvidence) { if (!el.inspection.open) el.inspection.showModal(); renderInspection(); } }, 850);
  }

  function openLinkBoard() {
    setPhase("linking", "Đối chiếu lời khai"); selectedStatement = null; selectedEvidence = null; renderLinkBoard();
    if (!el.linkBoard.open) el.linkBoard.showModal();
  }

  function renderLinkBoard() {
    el.statementDeck.replaceChildren(); el.evidenceDeck.replaceChildren();
    [...state.statementCards].forEach((id) => {
      const item = statements[id]; if (!item) return; const button = document.createElement("button"); button.type = "button";
      button.className = `file-card${selectedStatement === id ? " selected" : ""}`; button.innerHTML = `<small>${item.who}</small><span>“${item.quote}”</span>`;
      button.addEventListener("click", () => { selectedStatement = selectedStatement === id ? null : id; renderLinkBoard(); }); el.statementDeck.append(button);
    });
    [...state.evidence].forEach((id) => {
      const item = evidence[id]; if (!item) return; const button = document.createElement("button"); button.type = "button";
      button.className = `file-card evidence-file${selectedEvidence === id ? " selected" : ""}`; button.innerHTML = `<small>${item.glyph} VẬT CHỨNG</small><span>${item.name}</span>`;
      button.addEventListener("click", () => { selectedEvidence = selectedEvidence === id ? null : id; renderLinkBoard(); }); el.evidenceDeck.append(button);
    });
    el.testLink.disabled = !(selectedStatement && selectedEvidence);
    const selected = selectedStatement && selectedEvidence;
    el.linkFeedback.textContent = selected ? "Hai mảnh đã đặt lên bàn. Hãy kiểm tra xem chúng thực sự bác bỏ hay củng cố nhau." : `Đã khóa ${state.links.size}/${REQUIRED_LINKS.length} mối liên hệ cốt lõi.`;
  }

  function testSelectedLink() {
    const found = Object.entries(links).find(([, item]) => item.statement === selectedStatement && item.evidence === selectedEvidence);
    if (!found) {
      state.mistakes += 1; el.linkFeedback.textContent = "Hai mảnh này chưa tạo thành một quan hệ đủ chắc. Không có đáp án nào được tiết lộ.";
      el.linkBoard.classList.remove("wrong"); void el.linkBoard.offsetWidth; el.linkBoard.classList.add("wrong"); playTone(132, .16, "sawtooth", .02); save(); return;
    }
    const [id, item] = found; const isNew = !state.links.has(id); state.links.add(id); updateObjective(); save();
    el.linkFeedback.textContent = `${item.title}: ${item.text}`; playChord([50, 57, 62, 65], .72, .01);
    if (isNew) toast(`Đã khóa mối liên hệ: ${item.title}`); selectedStatement = null; selectedEvidence = null;
    setTimeout(() => { renderLinkBoard(); if (REQUIRED_LINKS.every((linkId) => state.links.has(linkId))) el.linkFeedback.textContent = "Chuỗi mâu thuẫn cốt lõi đã đủ. Bạn có thể tự dựng lại vụ án."; }, 680);
  }

  function closeLinkBoard() {
    if (el.linkBoard.open) el.linkBoard.close();
    setPhase("investigation", "Khám phá hiện trường"); renderObjects(); renderInvestigationPrompt();
  }

  function openReconstruction() {
    if (!CORE_EVIDENCE.every((id) => state.evidence.has(id)) || !REQUIRED_LINKS.every((id) => state.links.has(id))) {
      toast("Bạn chưa đủ vật chứng hoặc mối liên hệ để dựng toàn bộ vụ án."); return;
    }
    if (el.linkBoard.open) el.linkBoard.close(); setPhase("reconstruction", "Dựng lại vụ án"); selectedFinalCard = null; renderReconstruction();
    if (!el.reconstruction.open) el.reconstruction.showModal(); playChord([38, 50, 57, 62], 1.1, .012);
  }

  function renderReconstruction() {
    el.finalSlots.replaceChildren();
    finalSlots.forEach((slot) => {
      const button = document.createElement("button"); button.type = "button"; const cardId = state.final[slot.id];
      button.className = `final-slot${cardId ? " filled" : ""}`; button.innerHTML = `<small>${slot.label}</small><strong>${cardId ? finalCardName(cardId) : slot.hint}</strong>`;
      button.addEventListener("click", () => assignFinalSlot(slot.id)); el.finalSlots.append(button);
    });
    const deck = [...CORE_EVIDENCE, "suspect-rina", "suspect-misaki", "suspect-haru", "suspect-yuto"];
    el.finalDeck.replaceChildren(); deck.forEach((id) => {
      const button = document.createElement("button"); button.type = "button"; button.textContent = finalCardName(id);
      button.className = selectedFinalCard === id ? "selected" : ""; button.addEventListener("click", () => { selectedFinalCard = selectedFinalCard === id ? null : id; renderReconstruction(); }); el.finalDeck.append(button);
    });
    const filled = finalSlots.filter((slot) => state.final[slot.id]).length; el.reconstructionProgress.textContent = `${filled} / ${finalSlots.length}`;
    el.submitReconstruction.disabled = filled !== finalSlots.length;
  }

  function finalCardName(id) {
    if (evidence[id]) return evidence[id].name; if (id.startsWith("suspect-")) return suspects[id.slice(8)]?.name || id; return id;
  }

  function assignFinalSlot(slotId) {
    if (!selectedFinalCard) { delete state.final[slotId]; renderReconstruction(); return; }
    Object.keys(state.final).forEach((key) => { if (state.final[key] === selectedFinalCard) delete state.final[key]; });
    state.final[slotId] = selectedFinalCard; selectedFinalCard = null; save(); renderReconstruction();
  }

  function submitReconstruction() {
    const correct = finalSlots.every((slot) => state.final[slot.id] === slot.correct);
    if (!correct) {
      state.mistakes += 1; el.reconstructionFeedback.textContent = "Ít nhất một mắt xích chưa được chứng minh bởi hồ sơ. Không chỉ ra ô sai — hãy tự đối chiếu lại.";
      el.reconstruction.classList.remove("wrong"); void el.reconstruction.offsetWidth; el.reconstruction.classList.add("wrong"); playTone(110, .28, "sawtooth", .025); save(); return;
    }
    el.reconstructionFeedback.textContent = "Mọi mắt xích đã khép kín. Bắt đầu đối chất."; playChord([45, 52, 57, 60, 64], 1.2, .016);
    setTimeout(() => { el.reconstruction.close(); startReveal(); }, 900);
  }

  function startReveal() {
    setPhase("reveal", "Đối chất"); changeLocation("studio"); el.locationNav.hidden = true; el.objectLayer.replaceChildren();
    el.app.classList.add("lightning"); setTimeout(() => el.app.classList.remove("lightning"), 750);
    playDialogue(reveal, finishCase);
  }

  function finishCase() {
    const score = Math.max(0, 100 - state.mistakes * 6); state.rank = score >= 94 ? "S" : score >= 82 ? "A" : score >= 68 ? "B" : "C";
    setPhase("ending", "Hồ sơ hoàn tất");
    setDialogue("conan", `Vụ án khép lại — hạng ${state.rank}, ${score}/100 điểm. Bạn đã tự liên kết lời khai, vật chứng và toàn bộ chuỗi gây án.`, {
      choices: [
        { label: "Xem lại sổ vụ án", action: openNotebook },
        { label: "Chơi lại từ đầu", action: () => { localStorage.removeItem(SAVE_KEY); location.reload(); } },
      ],
    });
    save();
  }

  function openNotebook() {
    renderNotebook($(".notebook-tabs .active")?.dataset.tab || "statements"); if (!el.notebook.open) el.notebook.showModal();
  }

  function renderNotebook(tab) {
    $$(".notebook-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
    el.notebookContent.replaceChildren();
    if (tab === "statements") {
      const grid = document.createElement("div"); grid.className = "notebook-grid";
      Object.entries(statements).forEach(([id, item]) => {
        const unlocked = state.statementCards.has(id); const card = document.createElement("article"); card.className = `notebook-entry${unlocked ? "" : " locked"}`;
        card.innerHTML = unlocked ? `<small>${item.source}</small><h3>${item.who}</h3><p>“${item.quote}”</p>` : `<small>CHƯA LẤY LỜI KHAI</small><h3>Hồ sơ bị khóa</h3><p>Hãy nói chuyện với người liên quan.</p>`; grid.append(card);
      }); el.notebookContent.append(grid);
    } else if (tab === "evidence") {
      const grid = document.createElement("div"); grid.className = "notebook-grid";
      Object.entries(evidence).forEach(([id, item]) => {
        const unlocked = state.evidence.has(id); const card = document.createElement("article"); card.className = `notebook-entry${unlocked ? "" : " locked"}`;
        card.innerHTML = unlocked ? `<small>${item.glyph} ${locations[item.location].split(" • ")[0]}</small><h3>${item.name}</h3><p>${item.description}</p>` : `<small>CHƯA KHÁM PHÁ</small><h3>Vật thể chưa xác định</h3><p>Tên và ý nghĩa chưa được tiết lộ.</p>`; grid.append(card);
      }); el.notebookContent.append(grid);
    } else if (tab === "links") {
      const list = document.createElement("div"); list.className = "link-list";
      Object.entries(links).forEach(([id, item]) => {
        const unlocked = state.links.has(id); const card = document.createElement("article"); card.className = `notebook-entry${unlocked ? "" : " locked"}`;
        card.innerHTML = unlocked ? `<small>MỐI LIÊN HỆ ĐÃ KHÓA</small><h3>${item.title}</h3><p>${item.text}</p>` : `<small>CHƯA ĐỐI CHIẾU</small><h3>Hai mảnh chưa nối</h3><p>Game không tiết lộ lời khai hoặc vật chứng cần ghép.</p>`; list.append(card);
      }); el.notebookContent.append(list);
    } else {
      const events = [];
      Object.entries(evidence).forEach(([id, item]) => { if (state.evidence.has(id) && item.timeline) events.push(item.timeline); });
      events.sort((a, b) => a[0].localeCompare(b[0])); const list = document.createElement("div"); list.className = "timeline-list";
      if (!events.length) list.innerHTML = `<p class="empty-note">Dòng thời gian chỉ hiện khi bạn tìm được mốc khách quan.</p>`;
      events.forEach(([time, text]) => { const item = document.createElement("article"); item.innerHTML = `<time>${time}</time><p>${text}</p>`; list.append(item); });
      el.notebookContent.append(list);
    }
  }

  function ensureAudio() {
    if (!audioContext) { audioContext = new (window.AudioContext || window.webkitAudioContext)(); masterGain = audioContext.createGain(); masterGain.gain.value = state.sound ? .7 : 0; masterGain.connect(audioContext.destination); }
    if (audioContext.state === "suspended") audioContext.resume();
  }

  function playTone(freq, duration = .1, type = "sine", volume = .02, delay = 0) {
    if (!state.sound) return; ensureAudio(); const now = audioContext.currentTime + delay; const osc = audioContext.createOscillator(); const gain = audioContext.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, now); gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(volume, now + .02); gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(gain).connect(masterGain); osc.start(now); osc.stop(now + duration + .03);
  }

  function playMidi(note, duration = .3, volume = .02, delay = 0) { playTone(440 * Math.pow(2, (note - 69) / 12), duration, "triangle", volume, delay); }
  function playChord(notes, duration = .8, volume = .01, delay = 0) { notes.forEach((note, index) => playMidi(note, duration, volume, delay + index * .018)); }

  function startScore() {
    ensureAudio(); if (scoreTimer) return;
    const pattern = [45, 52, 57, 60, 43, 50, 55, 59, 41, 48, 53, 57, 43, 50, 55, 58];
    scoreTimer = setInterval(() => { if (state.sound && state.phase !== "title") { playMidi(pattern[scoreStep % pattern.length], .75, .006); if (scoreStep % 4 === 0) playMidi(pattern[scoreStep % pattern.length] - 12, 1.3, .004); scoreStep += 1; } }, 520);
  }

  function toggleSound() {
    state.sound = !state.sound; ensureAudio(); masterGain.gain.setTargetAtTime(state.sound ? .7 : 0, audioContext.currentTime, .04); el.sound.textContent = `ÂM: ${state.sound ? "BẬT" : "TẮT"}`; save();
  }

  function beginNewGame() {
    localStorage.removeItem(SAVE_KEY); showGame(); ensureAudio(); startScore();
    Object.assign(state, { phase: "prologue", location: "hall", interviews: new Set(), statementCards: new Set(["crowd-time"]), evidence: new Set(), inspections: {}, links: new Set(), audioSolved: false, mistakes: 0, final: {}, rank: null });
    setPhase("prologue", "Mở đầu"); changeLocation("hall"); playDialogue(prologue, startStatements);
  }

  function continueSaved() {
    const saved = readSave(); if (!saved) return beginNewGame(); applySave(saved); showGame(); ensureAudio(); startScore(); el.sound.textContent = `ÂM: ${state.sound ? "BẬT" : "TẮT"}`;
    if (state.phase === "statements" || state.phase === "prologue") startStatements();
    else if (["investigation", "linking"].includes(state.phase)) { state.phase = "investigation"; setPhase("investigation", "Khám phá hiện trường"); el.locationNav.hidden = false; el.sceneTip.hidden = false; changeLocation(state.location || "studio"); renderInvestigationPrompt(); }
    else if (state.phase === "reconstruction") { state.phase = "investigation"; setPhase("investigation", "Khám phá hiện trường"); changeLocation(state.location || "studio"); openReconstruction(); }
    else if (state.phase === "ending") { changeLocation("studio"); finishCase(); }
    else { state.phase = "investigation"; beginInvestigation(); }
  }

  el.newGame.addEventListener("click", beginNewGame); el.continueGame.addEventListener("click", continueSaved); el.sound.addEventListener("click", toggleSound);
  el.notebookButton.addEventListener("click", openNotebook); el.next.addEventListener("click", (event) => { event.stopPropagation(); advanceDialogue(); });
  el.dialoguePanel.addEventListener("click", (event) => { if (event.target.closest("button")) return; if (!el.next.hidden) advanceDialogue(); });
  el.locationNav.addEventListener("click", (event) => { const button = event.target.closest("[data-location]"); if (button) changeLocation(button.dataset.location); });
  el.inspectionClose.addEventListener("click", closeInspection); el.recordEvidence.addEventListener("click", recordPendingEvidence);
  el.linkClose.addEventListener("click", closeLinkBoard); el.testLink.addEventListener("click", testSelectedLink);
  el.audioClose.addEventListener("click", () => { if (el.audioLab.open) el.audioLab.close(); if (pendingEvidence && !el.inspection.open) { el.inspection.showModal(); renderInspection(); } });
  el.audioAlign.addEventListener("input", updateAudioReadout); el.lockAudio.addEventListener("click", lockAudio);
  $$('[data-play-sample]').forEach((button) => button.addEventListener("click", () => playSample(button.dataset.playSample)));
  el.submitReconstruction.addEventListener("click", submitReconstruction);
  $$(".notebook-tabs button").forEach((button) => button.addEventListener("click", () => renderNotebook(button.dataset.tab)));
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !event.target.matches("button, input") && !el.next.hidden) { event.preventDefault(); advanceDialogue(); }
    if (event.key.toLowerCase() === "n" && el.game.classList.contains("active")) openNotebook();
  });

  el.continueGame.hidden = !readSave(); updateObjective();
})();
