(() => {
  "use strict";

  const SAVE_KEY = "zero-hour-case-save-v2";
  const TEXT_SIZE_KEY = "zero-hour-case-text-size";
  const TEXT_SIZES = [
    { id: "medium", label: "VỪA" },
    { id: "large", label: "LỚN" },
    { id: "xlarge", label: "RẤT LỚN" },
  ];
  const CORE_EVIDENCE = ["watch", "piano", "metronome", "door", "midi", "access", "amplifier", "toolcase"];
  const REQUIRED_LINKS = ["false-time", "machine-rhythm", "system-lie", "cloned-card", "misaki-slip"];
  const MINI_GAME_EVIDENCE = ["watch", "piano", "metronome", "midi", "access"];
  const DEDUCTION_CHECKS = {
    watch: {
      question: "Mốc 23:18 phá vỡ giả định nào của đám đông?",
      hint: "So sánh thời điểm nhịp tim dừng với lúc tiếng đàn bắt đầu.",
      conclusion: "Nạn nhân đã chết trước tiếng đàn hơn 30 phút; âm thanh không thể là bằng chứng ông còn sống.",
      options: [
        { label: "Đồng hồ đã bị hung thủ chỉnh lùi giờ.", correct: false },
        { label: "Nạn nhân chết trước khi bản nhạc lúc 23:50 vang lên.", correct: true },
        { label: "Cú ngã xảy ra sau khi buổi biểu diễn kết thúc.", correct: false },
      ],
    },
    piano: {
      question: "Phím sạch đều và lớp bụi nguyên trên bàn đạp chứng minh điều gì?",
      hint: "Một người biểu diễn thật sẽ để lại dấu vết không đồng đều trên phím và bàn đạp.",
      conclusion: "Không có người thật chơi bản nhạc lúc 23:50; nguồn âm phải đến từ một cơ chế khác.",
      options: [
        { label: "Nạn nhân đã lau đàn ngay trước khi chết.", correct: false },
        { label: "Cây đàn đã hỏng từ nhiều ngày trước.", correct: false },
        { label: "Bản nhạc lúc 23:50 không do người trực tiếp biểu diễn.", correct: true },
      ],
    },
    metronome: {
      question: "Chi tiết nào khiến quả nặng bằng đồng trở thành vật chứng then chốt?",
      hint: "Ghép vật bị thiếu với vết lõm và sợi vải còn mắc lại.",
      conclusion: "Quả nặng bị tháo có thể là hung khí; sợi vải kem có thể nối nó với người đã cầm nó.",
      options: [
        { label: "Nó có thể dùng để chỉnh tốc độ tệp MIDI.", correct: false },
        { label: "Hình dạng khớp vết lõm và còn giữ sợi vải kem.", correct: true },
        { label: "Nó chứng minh Yuto đã mở hộp dụng cụ.", correct: false },
      ],
    },
    door: {
      question: "Vì sao hiện trường trông như một căn phòng khóa kín?",
      hint: "Chốt điện tử hoạt động sau khi cánh cửa đã khép.",
      conclusion: "Hung thủ có thể rời phòng bình thường; cánh cửa tự khóa sau đó tạo ra ảo giác phòng kín.",
      options: [
        { label: "Hung thủ thoát qua một lối bí mật dưới ray cửa.", correct: false },
        { label: "Cảnh sát đã vô tình khóa cửa khi tới nơi.", correct: false },
        { label: "Cửa tự chốt ba giây sau khi hung thủ rời đi.", correct: true },
      ],
    },
    access: {
      question: "Nhật ký S-04 thực sự chứng minh được điều gì?",
      hint: "Checksum cho biết thẻ được đọc không phải chiếc thẻ gốc.",
      conclusion: "Một bản sao S-04 đã mở cửa; mã thẻ không đủ để xác định người sử dụng là Yuto.",
      options: [
        { label: "Một bản sao S-04 mở cửa, nhưng chưa xác định được người dùng.", correct: true },
        { label: "Yuto chắc chắn có mặt trong phòng lúc 23:12.", correct: false },
        { label: "Đầu đọc thẻ bị hỏng nên toàn bộ nhật ký vô giá trị.", correct: false },
      ],
    },
  };
  const TIMELINE_EVENTS = [
    { id: "seal", time: "22:55", text: "Hộp dụng cụ của Yuto được niêm phong; thẻ S-04 gốc nằm bên trong." },
    { id: "card", time: "23:12", text: "Một bản sao thẻ S-04 mở cửa Phòng thu A." },
    { id: "death", time: "23:18", text: "Nhịp tim của Daigo dừng lại trong Phòng thu A." },
    { id: "yuto", time: "23:25", text: "Haru thấy Yuto rời phòng điều khiển với hộp dụng cụ." },
    { id: "midi", time: "23:50", text: "Tệp MIDI bắt đầu điều khiển cây đàn tự động." },
  ];
  const TIMELINE_DECK_ORDER = ["midi", "death", "seal", "yuto", "card"];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const el = {
    app: $("#app"), title: $("#title-screen"), game: $("#game-screen"), newGame: $("#new-game-button"),
    continueGame: $("#continue-button"), objective: $("#objective-label"), phase: $("#phase-label"), focus: $("#focus-label"),
    sound: $("#sound-button"), textSize: $("#text-size-button"), notebookButton: $("#notebook-button"), recordCount: $("#record-count"),
    scene: $("#scene"), sceneCaption: $("#scene-caption"), sceneTip: $("#scene-tip"), objectLayer: $("#object-layer"),
    locationNav: $("#location-nav"), portrait: $("#portrait"), speaker: $("#speaker-name"), speakerRole: $("#speaker-role"),
    dialogue: $("#dialogue-text"), choices: $("#choice-list"), next: $("#next-button"), dialoguePanel: $("#dialogue-panel"),
    dialogueHint: $("#dialogue-hint"), replayVoice: $("#replay-voice"),
    interrogationTools: $("#interrogation-tools"), tensionFill: $("#tension-fill"), pinStatement: $("#pin-statement"),
    notebook: $("#notebook"), notebookContent: $("#notebook-content"), inspection: $("#inspection"),
    inspectionTitle: $("#inspection-title"), inspectionVisual: $("#inspection-visual"), inspectionGlyph: $("#inspection-glyph"),
    miniGameHost: $("#mini-game-host"),
    inspectionPrompt: $("#inspection-prompt"), inspectionActions: $("#inspection-actions"), inspectionNotes: $("#inspection-notes"),
    inspectionClose: $("#inspection-close"), recordEvidence: $("#record-evidence"), linkBoard: $("#link-board"),
    linkClose: $("#link-close"), statementDeck: $("#statement-deck"), evidenceDeck: $("#evidence-deck"),
    linkFeedback: $("#link-feedback"), testLink: $("#test-link"), audioLab: $("#audio-lab"), audioClose: $("#audio-close"),
    audioAlign: $("#audio-align"), audioOffset: $("#audio-offset"), audioResult: $("#audio-result"), lockAudio: $("#lock-audio"),
    sceneWave: $("#scene-wave"), reconstruction: $("#reconstruction"), finalSlots: $("#final-slots"),
    timelineLab: $("#timeline-lab"), timelineClose: $("#timeline-close"), timelineSlots: $("#timeline-slots"),
    timelineDeck: $("#timeline-deck"), timelineFeedback: $("#timeline-feedback"), checkTimeline: $("#check-timeline"),
    finalDeck: $("#final-deck"), reconstructionProgress: $("#reconstruction-progress"),
    reconstructionFeedback: $("#reconstruction-feedback"), submitReconstruction: $("#submit-reconstruction"), toast: $("#toast"),
  };

  const characters = {
    ren: ["Kanzaki Ren", "Thám tử trẻ"], aoi: ["Hoshino Aoi", "Người đồng hành"],
    genda: ["Fujita Genda", "Thám tử tư"], sagara: ["Thanh tra Sagara", "Cảnh sát điều tra"],
    rina: ["Aoyama Rina", "Nghệ sĩ piano"], yuto: ["Senda Yuto", "Kỹ thuật viên âm thanh"],
    misaki: ["Kisaragi Misaki", "Quản lý nhà hát"], haru: ["Nishino Haru", "Phóng viên âm nhạc"],
    narrator: ["Hồ sơ vụ án", "Tường thuật"],
  };

  const voiceStyles = {
    narrator: { rate: .9, pitch: .82 }, ren: { rate: 1.04, pitch: 1.08 },
    aoi: { rate: 1, pitch: 1.12 }, genda: { rate: .96, pitch: .78 }, sagara: { rate: .92, pitch: .72 },
    rina: { rate: .98, pitch: 1.08 }, misaki: { rate: .93, pitch: 1.02 }, haru: { rate: .98, pitch: .86 }, yuto: { rate: .9, pitch: .8 },
  };

  const prologue = [
    { who: "narrator", text: "Nhà hát Tsukikage, 0 giờ 07 phút. Mưa lớn đã giữ tất cả những người có mặt lại bên trong." },
    { who: "sagara", text: "Nhạc sĩ Kisaragi Daigo được tìm thấy tử vong trong Phòng thu A. Cửa đã khóa, nhưng từ 23:50 đến đúng 0 giờ mọi người đều nghe ông ấy chơi đàn." },
    { who: "genda", text: "Vậy nạn nhân còn sống lúc 23:50. Hung thủ chỉ có thể ra tay sau khi bản nhạc kết thúc!" },
    { who: "ren", text: "Nếu tiếng đàn không dùng để chứng minh ông ấy còn sống, mà dùng để khiến mọi người tin như vậy thì sao?" },
    { who: "narrator", text: "Bạn sẽ không được chọn sẵn đáp án trong lúc lấy lời khai. Hãy nghe, lưu từng câu vào sổ rồi tự tìm vật chứng trong cảnh thật." },
  ];

  const suspects = {
    rina: {
      name: "Aoyama Rina", role: "Nghệ sĩ piano trẻ", icon: "R",
      intro: "Bị nạn nhân gạt tên khỏi phần đồng sáng tác. Có động cơ rõ ràng nhưng đang biểu diễn ở sân khấu phụ lúc 23:18.",
      lines: [
        { who: "rina", text: "Tôi căm ông Daigo vì đã xóa tên tôi khỏi bản nhạc, nhưng lúc 23:18 tôi đang ở sân khấu phụ trước hàng trăm khán giả." },
        { who: "ren", text: "Cô nghe thấy điều gì khác thường trong bản nhạc vang lên lúc 23:50?" },
        { who: "rina", text: "Nó hoàn hảo đến vô hồn. Ông ấy luôn ngừng nửa nhịp trước hợp âm cuối; đêm nay khoảng nghỉ ấy biến mất.", pin: "rina-rhythm" },
      ],
      records: ["rina-rhythm"],
      requiredPins: ["rina-rhythm"],
    },
    misaki: {
      name: "Kisaragi Misaki", role: "Quản lý kiêm em gái nạn nhân", icon: "M",
      intro: "Quản lý mọi quyền truy cập của nhà hát và là người cuối cùng xác nhận đã mang cà phê vào phòng thu.",
      lines: [
        { who: "misaki", text: "Tôi mang cà phê vào lúc 23:08 rồi rời đi ngay. Anh tôi còn sống và đang tranh cãi về tiền bản quyền." },
        { who: "ren", text: "Khi ra hành lang, cô nhìn thấy ai?" },
        { who: "misaki", text: "Yuto cầm thẻ S-04 đứng gần cửa. Chắc anh ta đến sửa tệp hẹn giờ chạy lúc 23:50... Tôi chỉ đoán vậy thôi.", pin: "misaki-slip" },
      ],
      records: ["misaki-last", "misaki-slip"],
      requiredPins: ["misaki-slip"],
    },
    haru: {
      name: "Nishino Haru", role: "Phóng viên âm nhạc", icon: "H",
      intro: "Đang điều tra bê bối đạo nhạc của nạn nhân. Cái chết khiến bài báo của anh mất nguồn tin quan trọng nhất.",
      lines: [
        { who: "haru", text: "Tôi ra bãi xe gọi cho tòa soạn. Lúc trở lại khoảng 23:25, áo và ô đều ướt sũng." },
        { who: "ren", text: "Anh có gặp ai trên đường trở lại không?" },
        { who: "haru", text: "Yuto bước khỏi phòng điều khiển, ôm một hộp dụng cụ kim loại. Trông anh ta rất hoảng.", pin: "haru-control" },
      ],
      records: ["haru-control"],
      requiredPins: ["haru-control"],
    },
    yuto: {
      name: "Senda Yuto", role: "Kỹ thuật viên âm thanh", icon: "Y",
      intro: "Hiểu hệ thống đàn tự động hơn bất kỳ ai. Em gái quá cố của anh từng sáng tác một bản nhạc cùng tên.",
      lines: [
        { who: "yuto", text: "Tôi không vào Phòng thu A sau 22:40. Thẻ S-04 luôn ở trong hộp dụng cụ của tôi.", pin: "yuto-room" },
        { who: "ren", text: "Còn hệ thống âm thanh sau 23:30?" },
        { who: "yuto", text: "Đã tắt hoàn toàn. Tôi không chạm vào bàn điều khiển và cũng không biết ai đã phát bản nhạc.", pin: "yuto-system" },
      ],
      records: ["yuto-room", "yuto-system"],
      requiredPins: ["yuto-room", "yuto-system"],
    },
  };

  const statements = {
    "crowd-time": { who: "Nhiều nhân chứng", quote: "Tiếng đàn từ 23:50 chứng minh Daigo còn sống đến gần 0 giờ.", source: "Mở đầu vụ án" },
    "rina-rhythm": { who: "Aoyama Rina", quote: "Bản nhạc quá hoàn hảo; khoảng nghỉ nửa nhịp quen thuộc đã biến mất.", source: "Lời khai Rina" },
    "misaki-last": { who: "Kisaragi Misaki", quote: "Tôi rời Phòng thu A ngay sau khi mang cà phê vào lúc 23:08.", source: "Lời khai Misaki" },
    "misaki-slip": { who: "Kisaragi Misaki", quote: "Chắc Yuto đến sửa tệp hẹn giờ chạy lúc 23:50.", source: "Lời khai Misaki" },
    "haru-control": { who: "Nishino Haru", quote: "Khoảng 23:25, Yuto rời phòng điều khiển với hộp dụng cụ.", source: "Lời khai Haru" },
    "yuto-room": { who: "Senda Yuto", quote: "Tôi không vào Phòng thu A sau 22:40; thẻ S-04 nằm trong hộp.", source: "Lời khai Yuto" },
    "yuto-system": { who: "Senda Yuto", quote: "Hệ thống âm thanh đã tắt hoàn toàn từ 23:30.", source: "Lời khai Yuto" },
  };

  const evidence = {
    watch: {
      name: "Đồng hồ thông minh", glyph: "⌚", location: "studio", area: [42, 59, 10, 12],
      miniGame: "wipe",
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
      miniGame: "uv",
      prompt: "Cây đàn chiếm gần nửa căn phòng. Nếu vừa có người biểu diễn, cơ cấu và bàn đạp phải để lại dấu vết.",
      actions: [
        ["Kiểm tra phím", "Phím sạch đều, không có dấu dầu tay mới ở đoạn cao trào."],
        ["Soi bàn đạp", "Lớp bụi mỏng trên cả ba bàn đạp vẫn nguyên vẹn."],
      ],
      description: "Không có dấu hiệu một người thật vừa biểu diễn; bàn đạp vang hoàn toàn không được dùng.",
    },
    metronome: {
      name: "Máy đếm nhịp", glyph: "△", location: "studio", area: [79, 67, 8, 21],
      miniGame: "fit",
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
      miniGame: "audio",
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
      miniGame: "logs",
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
    "misaki-slip": { statement: "misaki-slip", evidence: "midi", title: "Kiến thức chưa được công bố", text: "Misaki biết chính xác tệp được hẹn chạy lúc 23:50 trước khi lịch tác vụ được khôi phục; mã quản lý M-01 cũng ký lệnh phát." },
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
    { who: "ren", text: "Daigo đã chết lúc 23:18. Tiếng đàn sau đó chỉ là tệp MIDI được hẹn giờ, nên mọi lời khai dựa trên mốc 23:50 đều sai." },
    { who: "ren", text: "Cửa tự khóa khi khép lại. Hung thủ rời đi từ trước rồi dùng bản nhạc để biến một căn phòng bình thường thành phòng kín trong trí tưởng tượng của mọi người." },
    { who: "sagara", text: "Nhưng bộ nhớ đầu đọc ghi thẻ S-04 của Yuto lúc 23:12." },
    { who: "ren", text: "Đó là bản sao. S-04 gốc nằm trong hộp niêm phong từ 22:55. Yuto nói dối vì anh lén sao chép kho nhạc của em gái, không phải vì đã giết Daigo." },
    { who: "yuto", text: "Tôi chỉ muốn giữ lại bản gốc của Hana trước khi ông ấy xóa sạch. Tôi sợ cảnh sát coi đó là hành vi phá hoại dữ liệu." },
    { who: "ren", text: "Lệnh MIDI ban đầu được ký bằng mã quản lý M-01. Và trước khi lịch tác vụ được khôi phục, chỉ một người đã vô tình nói đúng cả việc có tệp hẹn giờ lẫn mốc 23:50." },
    { who: "ren", text: "Sợi vải kem trên máy đếm nhịp cũng trùng với áo khoác quản lý. Hung thủ là cô, Kisaragi Misaki." },
    { who: "misaki", text: "Tôi đã nhân bản S-04 để cuộc gặp lúc 23:12 không bị ghi dưới tên mình. Anh ấy định đổ toàn bộ tiền bản quyền bẩn lên tôi rồi hủy bản thảo của Hana. Tôi chỉ muốn ép anh ấy thú nhận... nhưng anh ấy cười vào mặt tôi." },
    { who: "misaki", text: "Tôi vung quả nặng trong lúc giằng co. Sau đó tôi dùng M-01 đặt lịch bản nhạc, đổi nhãn lệnh thành S-04 và hy vọng mọi người sẽ chỉ nhìn về phía Yuto." },
    { who: "aoi", text: "Cô đã bảo vệ một sự thật bằng quá nhiều lời nói dối. Cuối cùng, chính những lời nói dối đó đưa mọi người trở lại sự thật." },
    { who: "ren", text: "Một vụ án không được giải bằng việc đoán đúng một cái tên. Nó được giải khi mọi mắt xích đều không còn cách giải thích nào khác." },
  ];

  const locations = {
    hall: "Hành lang nhà hát • 0 giờ 07", studio: "Phòng thu A • Hiện trường", control: "Phòng điều khiển • Hệ thống âm thanh",
  };

  const state = {
    phase: "title", location: "hall", interviews: new Set(), statementCards: new Set(["crowd-time"]),
    pinnedStatements: new Set(), suspectPressure: {}, evidence: new Set(), inspections: {}, miniGames: new Set(),
    links: new Set(), deductions: new Set(), deductionFailures: {}, miniProgress: {}, audioSolved: false, timelineSlots: {}, timelineSolved: false, mistakes: 0,
    final: {}, sound: true, rank: null,
  };

  let queue = [], queueDone = null, typingTimer = 0, fullText = "", typing = false, toastTimer = 0;
  let dialogueAdvanceTimer = 0, currentLineComplete = null, dialogueIsSequence = false;
  let pendingEvidence = null, selectedStatement = null, selectedEvidence = null, selectedFinalCard = null;
  let currentInterviewId = null, currentDialogueLine = null, currentPinAttempted = false, selectedTimelineEvent = null, currentVoiceLine = null;
  let voiceSequence = 0, vietnameseVoices = [], voiceWaitTimer = 0, pendingVoiceRequest = null, voiceUnavailableNotified = false;
  let audioContext = null, masterGain = null, scoreTimer = 0, scoreStep = 0;

  function serialize() {
    const inspectionData = {};
    Object.entries(state.inspections).forEach(([id, values]) => { inspectionData[id] = [...values]; });
    return {
      ...state,
      interviews: [...state.interviews], statementCards: [...state.statementCards], pinnedStatements: [...state.pinnedStatements],
      evidence: [...state.evidence], inspections: inspectionData, miniGames: [...state.miniGames], links: [...state.links], deductions: [...state.deductions],
    };
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
    state.pinnedStatements = new Set(saved.pinnedStatements || []); state.suspectPressure = saved.suspectPressure || {};
    state.evidence = new Set(saved.evidence || []); state.inspections = {};
    Object.entries(saved.inspections || {}).forEach(([id, values]) => { state.inspections[id] = new Set(values); });
    state.miniGames = new Set(saved.miniGames || []); state.links = new Set(saved.links || []); state.deductions = new Set(saved.deductions || []);
    state.deductionFailures = saved.deductionFailures || {};
    state.miniProgress = saved.miniProgress && typeof saved.miniProgress === "object" ? saved.miniProgress : {};
    state.audioSolved = Boolean(saved.audioSolved);
    state.timelineSlots = saved.timelineSlots || {}; state.timelineSolved = Boolean(saved.timelineSolved); state.mistakes = saved.mistakes || 0;
    state.final = saved.final || {}; state.sound = saved.sound !== false; state.rank = saved.rank || null;
  }

  function showGame() {
    const focusedControl = document.activeElement;
    if (focusedControl && typeof focusedControl.blur === "function") focusedControl.blur();
    el.title.classList.remove("active");
    el.game.classList.add("active");
    el.app.scrollTop = 0;
    requestAnimationFrame(() => { el.app.scrollTop = 0; });
  }

  function supportsSpeechSynthesis() {
    return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  }

  function refreshVietnameseVoices() {
    vietnameseVoices = supportsSpeechSynthesis()
      ? window.speechSynthesis.getVoices().filter((voice) => {
        const language = voice.lang?.toLowerCase().replace("_", "-") || "";
        const name = voice.name || "";
        return language === "vi" || language.startsWith("vi-")
          || /vietnam|việt|hoài\s*my|hoaimy|nam\s*minh|namminh|microsoft\s+an\b/i.test(name);
      })
      : [];
    el.replayVoice.hidden = !vietnameseVoices.length;
    el.replayVoice.disabled = !state.sound;
    if (vietnameseVoices.length) {
      voiceUnavailableNotified = false;
      el.sound.title = `Giọng Việt: ${vietnameseVoices[0].name || "đã sẵn sàng"}`;
    }
    return vietnameseVoices;
  }

  function vietnameseVoiceFor(who) {
    refreshVietnameseVoices();
    if (!vietnameseVoices.length) return null;
    const voiceIndex = Math.abs([...who].reduce((sum, character) => sum + character.charCodeAt(0), 0)) % vietnameseVoices.length;
    return vietnameseVoices[voiceIndex];
  }

  function spokenWordEnd(text, event = {}) {
    const start = Number.isFinite(event.charIndex) ? Math.max(0, Math.min(text.length, event.charIndex)) : 0;
    const statedLength = Number.isFinite(event.charLength) ? Math.max(0, event.charLength) : 0;
    let end = Math.min(text.length, start + statedLength);
    if (!statedLength) {
      const remainder = text.slice(start);
      const match = remainder.match(/^\s*\S+/);
      end = Math.min(text.length, start + (match?.[0].length || 1));
    }
    while (end < text.length && /[,.!?;:\u2026\u201d\u2019"')\]]/.test(text[end])) end += 1;
    return end;
  }

  function startTypewriter(text, token, startIndex = 0) {
    clearInterval(typingTimer);
    let index = Math.max(0, Math.min(text.length, startIndex));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    typingTimer = setInterval(() => {
      if (token !== voiceSequence || !typing) { clearInterval(typingTimer); return; }
      index = Math.min(text.length, index + (reduced ? text.length : 2)); el.dialogue.textContent = text.slice(0, index);
      if (index >= text.length) { clearInterval(typingTimer); typing = false; completeCurrentLine(token); }
    }, reduced ? 1 : 16);
  }

  function cancelVoiceWait() {
    clearTimeout(voiceWaitTimer); voiceWaitTimer = 0; pendingVoiceRequest = null;
  }

  function waitForVietnameseVoice(text, who, token) {
    const request = { text, who, token, attempts: 0 };
    pendingVoiceRequest = request;
    const poll = () => {
      if (pendingVoiceRequest !== request || token !== voiceSequence || !typing || !state.sound) return;
      if (vietnameseVoiceFor(who)) {
        pendingVoiceRequest = null; clearTimeout(voiceWaitTimer); voiceWaitTimer = 0;
        clearInterval(typingTimer); el.dialogue.textContent = "";
        speakLine(text, who, token); return;
      }
      request.attempts += 1;
      if (request.attempts >= 12) {
        pendingVoiceRequest = null; el.sound.title = "Chrome chưa tìm thấy giọng đọc tiếng Việt trên thiết bị";
        startTypewriter(text, token);
        if (!voiceUnavailableNotified) {
          voiceUnavailableNotified = true;
          toast("Chrome chưa tải được giọng Việt. Game vẫn hiện phụ đề; hãy thử bấm ÂM: TẮT rồi BẬT sau vài giây.");
        }
        return;
      }
      voiceWaitTimer = setTimeout(poll, 200);
    };
    poll();
  }

  function handleVoicesChanged() {
    refreshVietnameseVoices();
    const request = pendingVoiceRequest;
    if (!request || !vietnameseVoices.length || request.token !== voiceSequence || !typing || !state.sound) return;
    pendingVoiceRequest = null; clearTimeout(voiceWaitTimer); voiceWaitTimer = 0;
    clearInterval(typingTimer); el.dialogue.textContent = "";
    speakLine(request.text, request.who, request.token);
  }

  function playLineWithVoiceFallback(text, who, token) {
    if (speakLine(text, who, token)) return;
    if (state.sound && supportsSpeechSynthesis()) waitForVietnameseVoice(text, who, token);
    else startTypewriter(text, token);
  }

  function speakLine(text, who = "narrator", token = voiceSequence) {
    currentVoiceLine = { text, who, onComplete: currentLineComplete };
    const voice = vietnameseVoiceFor(who);
    if (!voice || !state.sound) return false;

    const utterance = new window.SpeechSynthesisUtterance(text);
    const style = voiceStyles[who] || voiceStyles.narrator;
    utterance.lang = "vi-VN"; utterance.voice = voice;
    utterance.rate = style.rate; utterance.pitch = style.pitch; utterance.volume = .96;
    utterance.onstart = () => {
      if (token !== voiceSequence || !typing) return;
      el.dialogue.textContent = text.slice(0, spokenWordEnd(text));
    };
    utterance.onboundary = (event) => {
      if (token !== voiceSequence || !typing) return;
      el.dialogue.textContent = text.slice(0, spokenWordEnd(text, event));
    };
    utterance.onend = () => {
      if (token !== voiceSequence || !typing) return;
      el.dialogue.textContent = text; typing = false; completeCurrentLine(token);
    };
    utterance.onerror = () => {
      if (token !== voiceSequence || !typing) return;
      startTypewriter(text, token, el.dialogue.textContent.length);
    };
    window.speechSynthesis.resume?.();
    window.speechSynthesis.speak(utterance);
    return true;
  }

  function replayCurrentVoice() {
    if (!currentVoiceLine) return;
    clearDialogueAdvance();
    clearInterval(typingTimer); cancelVoiceWait(); const token = ++voiceSequence;
    if (supportsSpeechSynthesis()) window.speechSynthesis.cancel();
    fullText = currentVoiceLine.text; currentLineComplete = currentVoiceLine.onComplete || null;
    el.dialogue.textContent = ""; typing = true;
    playLineWithVoiceFallback(currentVoiceLine.text, currentVoiceLine.who, token);
  }

  function applyTextSize(sizeId) {
    const size = TEXT_SIZES.find((item) => item.id === sizeId) || TEXT_SIZES[1];
    document.documentElement.dataset.textSize = size.id;
    el.textSize.textContent = `CHỮ: ${size.label}`;
    el.textSize.setAttribute("aria-label", `Đổi cỡ chữ, hiện tại: ${size.label.toLowerCase()}`);
    localStorage.setItem(TEXT_SIZE_KEY, size.id);
  }

  function cycleTextSize() {
    const current = TEXT_SIZES.findIndex((item) => item.id === document.documentElement.dataset.textSize);
    applyTextSize(TEXT_SIZES[(current + 1) % TEXT_SIZES.length].id);
  }

  function setPhase(phase, label) {
    state.phase = phase; el.phase.textContent = label; updateObjective(); save();
  }

  function updateObjective() {
    const core = CORE_EVIDENCE.filter((id) => state.evidence.has(id)).length;
    const labels = {
      prologue: "Đọc mở đầu vụ án", statements: `Lấy lời khai ${state.interviews.size}/4`,
      investigation: core === CORE_EVIDENCE.length ? "Đã đủ vật chứng • Đối chiếu" : `Khám phá vật chứng ${core}/${CORE_EVIDENCE.length}`,
      linking: `Khóa mối liên hệ ${state.links.size}/${REQUIRED_LINKS.length}`,
      timeline: state.timelineSolved ? "Dòng thời gian đã khóa" : "Tự xếp 5 mốc thời gian",
      reconstruction: "Tự dựng lại toàn bộ vụ án", reveal: "Đối chất", ending: "Hồ sơ đã khép lại",
    };
    el.objective.textContent = labels[state.phase] || "Theo dấu sự thật";
    el.recordCount.textContent = String(state.statementCards.size + state.evidence.size + state.links.size);
    refreshFocus();
  }

  function caseScore() { return Math.max(0, 100 - state.mistakes * 6); }

  function refreshFocus() {
    const score = caseScore();
    el.focus.textContent = `TẬP TRUNG ${score}`; el.focus.dataset.score = String(score);
    el.focus.classList.toggle("warning", score < 82 && score >= 56);
    el.focus.classList.toggle("danger", score < 56);
  }

  function registerMistake() {
    state.mistakes += 1; refreshFocus();
  }

  function setPortrait(who) {
    const id = characters[who] ? who : "narrator";
    el.portrait.className = `portrait ${id}`; el.portrait.hidden = id === "narrator";
    if (currentInterviewId === id && (state.suspectPressure[id] || 0) > 0) el.portrait.classList.add("pressured");
    el.dialoguePanel.classList.toggle("narrator-dialogue", id === "narrator");
    [el.speaker.textContent, el.speakerRole.textContent] = characters[id];
  }

  function clearDialogueAdvance() {
    clearTimeout(dialogueAdvanceTimer); dialogueAdvanceTimer = 0;
  }

  function completeCurrentLine(token) {
    if (token !== voiceSequence) return;
    const complete = currentLineComplete; currentLineComplete = null;
    if (complete) complete();
  }

  function finishTyping() {
    if (!typing) return false;
    const complete = currentLineComplete; currentLineComplete = null;
    clearInterval(typingTimer); cancelVoiceWait(); voiceSequence += 1;
    if (supportsSpeechSynthesis()) window.speechSynthesis.cancel();
    el.dialogue.textContent = fullText; typing = false; if (complete) complete(); return true;
  }

  function typeLine(text, who = "narrator", onComplete = null) {
    clearDialogueAdvance();
    clearInterval(typingTimer); cancelVoiceWait(); const token = ++voiceSequence;
    if (supportsSpeechSynthesis()) window.speechSynthesis.cancel();
    fullText = text; currentLineComplete = onComplete; currentVoiceLine = { text, who, onComplete };
    el.dialogue.textContent = ""; typing = true;
    playLineWithVoiceFallback(text, who, token);
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
    clearDialogueAdvance(); queue = []; queueDone = null; dialogueIsSequence = false;
    currentDialogueLine = null; currentPinAttempted = false; hideInterrogationTools(); setPortrait(who); typeLine(text, who);
    el.next.hidden = !next; el.dialogueHint.textContent = choices.length ? "CHỌN HÀNH ĐỘNG ĐỂ TIẾP TỤC" : next ? "BẤM ĐỂ TIẾP TỤC" : "BẤM ĐỂ TUA CÂU";
    renderChoices(choices);
  }

  function groupLinkedDialogue(lines) {
    return lines.reduce((groups, source) => {
      const line = { ...source };
      const previous = groups.at(-1);
      const combinedLength = previous ? previous.text.length + line.text.length + 1 : Infinity;
      const linked = previous && previous.who === line.who && !previous.pin && !line.pin
        && !previous.breakAfter && !line.breakBefore && combinedLength <= 390;
      if (linked) {
        previous.text = `${previous.text.trim()} ${line.text.trim()}`;
        previous.linkedSentences = (previous.linkedSentences || 1) + 1;
      } else groups.push(line);
      return groups;
    }, []);
  }

  function lineNeedsPlayer(line) {
    return Boolean(line.waitForPlayer || (currentInterviewId && line.pin && !state.pinnedStatements.has(line.pin)));
  }

  function finishQueuedLine(line) {
    if (!dialogueIsSequence || currentDialogueLine !== line) return;
    if (lineNeedsPlayer(line)) {
      el.next.hidden = false;
      el.dialogueHint.textContent = "GHIM NẾU CẦN • TIẾP TỤC KHI SẴN SÀNG";
      return;
    }
    el.next.hidden = true; el.dialogueHint.textContent = "TỰ PHÁT • BẤM ĐỂ TUA CÂU";
    const following = queue[0];
    const delay = following && following.who === line.who ? 90 : following ? 260 : 180;
    clearDialogueAdvance();
    dialogueAdvanceTimer = setTimeout(() => {
      if (dialogueIsSequence && currentDialogueLine === line) nextLine();
    }, delay);
  }

  function playDialogue(lines, done) {
    clearDialogueAdvance(); queue = groupLinkedDialogue(lines); queueDone = done || null; dialogueIsSequence = true;
    nextLine();
  }
  function nextLine() {
    clearDialogueAdvance();
    if (!queue.length) {
      currentDialogueLine = null; hideInterrogationTools(); el.next.hidden = true; dialogueIsSequence = false;
      const done = queueDone; queueDone = null; if (done) done(); return;
    }
    const line = queue.shift(); currentDialogueLine = line; currentPinAttempted = false; setPortrait(line.who);
    el.next.hidden = true; el.dialogueHint.textContent = "TỰ PHÁT • BẤM ĐỂ TUA CÂU"; renderChoices([]); renderInterrogationTools(line);
    typeLine(line.text, line.who, () => finishQueuedLine(line));
  }
  function advanceDialogue() { if (!finishTyping()) { clearDialogueAdvance(); nextLine(); } }

  function hideInterrogationTools() {
    el.interrogationTools.hidden = true; el.pinStatement.disabled = false; el.dialoguePanel.classList.remove("interrogation-active");
  }

  function renderInterrogationTools(line) {
    const active = currentInterviewId && line?.who === currentInterviewId;
    if (!active) { hideInterrogationTools(); return; }
    const pinId = line.pin;
    const person = suspects[currentInterviewId]; const pressure = state.suspectPressure[currentInterviewId] || 0;
    el.interrogationTools.hidden = false; el.dialoguePanel.classList.add("interrogation-active");
    el.tensionFill.style.width = `${Math.min(100, pressure)}%`;
    el.pinStatement.disabled = currentPinAttempted || Boolean(pinId && state.pinnedStatements.has(pinId));
    el.pinStatement.textContent = pinId && state.pinnedStatements.has(pinId) ? "ĐÃ GHIM" : currentPinAttempted ? "CHƯA ĐỦ CĂN CỨ" : "GHIM ĐỂ KIỂM CHỨNG";
    el.pinStatement.setAttribute("aria-label", `Ghim lời khai của ${person.name}`);
  }

  function pinCurrentStatement() {
    if (!currentInterviewId || !currentDialogueLine || currentPinAttempted) return; const pinId = currentDialogueLine.pin;
    const person = suspects[currentInterviewId];
    if (!pinId) {
      currentPinAttempted = true; registerMistake();
      state.suspectPressure[currentInterviewId] = Math.min(100, (state.suspectPressure[currentInterviewId] || 0) + 9);
      el.portrait.classList.add("pressured", "pressure-hit"); setTimeout(() => el.portrait.classList.remove("pressure-hit"), 420);
      renderInterrogationTools(currentDialogueLine); save(); playTone(132, .15, "sawtooth", .018);
      toast("Câu này mới là bối cảnh hoặc động cơ, chưa có chi tiết độc lập để kiểm chứng."); return;
    }
    if (state.pinnedStatements.has(pinId)) return; const step = Math.ceil(100 / person.requiredPins.length);
    state.pinnedStatements.add(pinId); state.statementCards.add(pinId);
    state.suspectPressure[currentInterviewId] = Math.min(100, (state.suspectPressure[currentInterviewId] || 0) + step);
    el.portrait.classList.add("pressured", "pressure-hit"); setTimeout(() => el.portrait.classList.remove("pressure-hit"), 420);
    renderInterrogationTools(currentDialogueLine); updateObjective(); save(); playTone(760, .09, "square", .018);
    toast(`Đã ghim: ${statements[pinId].quote}`);
    if (dialogueIsSequence && !typing) finishQueuedLine(currentDialogueLine);
  }

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
    currentInterviewId = null; currentDialogueLine = null; hideInterrogationTools();
    const complete = Object.keys(suspects).every((id) => state.interviews.has(id));
    const choices = Object.entries(suspects).map(([id, person]) => {
      const pins = person.requiredPins.filter((pin) => state.pinnedStatements.has(pin)).length;
      const status = state.interviews.has(id) ? "✓ " : pins ? `${pins}/${person.requiredPins.length} • ` : "";
      return { label: `${status}${person.name}`, action: () => interview(id) };
    });
    if (complete) choices.unshift({ label: "Đến hiện trường", action: beginInvestigation });
    setDialogue("ren", complete
      ? "Đã ghi đủ lời khai. Bây giờ hãy tìm đồ vật thật trong ba khu vực và kiểm tra xem câu nào chịu được vật chứng."
      : "Nghe từng người và bấm GHIM ngay khi họ nói một câu có thể kiểm chứng. Bỏ lỡ câu quan trọng thì phải nghe lại — Sổ vụ án không tự suy luận hộ bạn.", { choices });
  }

  function interview(id) {
    const person = suspects[id]; currentInterviewId = id;
    playDialogue(person.lines, () => {
      const missing = person.requiredPins.filter((pin) => !state.pinnedStatements.has(pin));
      if (missing.length) {
        currentInterviewId = null; hideInterrogationTools();
        setDialogue("ren", `Bạn đã bỏ lỡ ${missing.length} câu có thể kiểm chứng trong lời khai của ${person.name}. Nghe lại và ghim đúng lúc — game sẽ không tự chọn hộ.`, {
          choices: [
            { label: "Nghe lại lời khai", action: () => interview(id) },
            { label: "Hỏi người khác trước", action: renderStatementMenu },
          ],
        });
        return;
      }
      const first = !state.interviews.has(id); state.interviews.add(id); person.records.forEach((record) => state.statementCards.add(record));
      currentInterviewId = null; hideInterrogationTools(); updateObjective(); save();
      if (first) toast(`Đã khóa lời khai của ${person.name}`); renderStatementMenu();
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
    if (core === CORE_EVIDENCE.length) choices.unshift({ label: `${state.timelineSolved ? "✓ " : ""}Dựng dòng thời gian`, action: openTimelineLab });
    if (core === CORE_EVIDENCE.length && state.timelineSolved && REQUIRED_LINKS.every((id) => state.links.has(id))) choices.unshift({ label: "Dựng lại vụ án", action: openReconstruction });
    setDialogue("ren", core === CORE_EVIDENCE.length
      ? "Không còn vật chứng cốt lõi nào bị bỏ sót. Tự xếp lại dòng thời gian rồi ghép lời khai với vật chứng; một lời nói dối chưa chắc đồng nghĩa với giết người."
      : `Quan sát cảnh thật rồi thao tác trực tiếp trên từng vật thể. Đã hoàn tất ${state.miniGames.size}/${MINI_GAME_EVIDENCE.length} thử nghiệm và ghi ${core}/${CORE_EVIDENCE.length} vật chứng cốt lõi.`, { choices });
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
    el.inspectionActions.replaceChildren(); el.inspectionNotes.replaceChildren(); el.miniGameHost.replaceChildren();
    const hasMiniGame = Boolean(item.miniGame); const miniGameSolved = state.miniGames.has(pendingEvidence);
    el.inspectionVisual.classList.toggle("mini-game-active", hasMiniGame && !miniGameSolved);
    el.inspectionGlyph.hidden = hasMiniGame && !miniGameSolved; el.miniGameHost.hidden = !hasMiniGame || miniGameSolved;
    if (hasMiniGame && !miniGameSolved) renderMiniGame(pendingEvidence);
    if (!hasMiniGame) {
      item.actions.forEach(([label], index) => {
        const button = document.createElement("button"); button.type = "button"; button.textContent = `${inspected.has(index) ? "✓ " : ""}${label}`;
        button.classList.toggle("done", inspected.has(index)); button.addEventListener("click", () => inspectDetail(index)); el.inspectionActions.append(button);
      });
    }
    if (item.audio && !state.audioSolved) {
      const button = document.createElement("button"); button.type = "button"; button.className = "audio-action"; button.textContent = "♫ Mở bàn pháp y âm thanh";
      button.addEventListener("click", openAudioLab); el.inspectionActions.append(button);
    }
    item.actions.forEach(([, note], index) => {
      if (inspected.has(index) || miniGameSolved) { const paragraph = document.createElement("p"); paragraph.textContent = note; el.inspectionNotes.append(paragraph); }
    });
    const complete = hasMiniGame ? miniGameSolved : inspected.size === item.actions.length;
    const deductionRequired = Boolean(DEDUCTION_CHECKS[pendingEvidence]);
    const deductionSolved = state.deductions.has(pendingEvidence);
    if (complete && deductionRequired && !deductionSolved && !state.evidence.has(pendingEvidence)) renderDeductionCheck(pendingEvidence);
    if (deductionSolved) {
      const conclusion = document.createElement("p"); conclusion.className = "deduction-result";
      conclusion.textContent = `KẾT LUẬN: ${DEDUCTION_CHECKS[pendingEvidence].conclusion}`; el.inspectionNotes.append(conclusion);
    }
    el.recordEvidence.disabled = !complete || (deductionRequired && !deductionSolved) || state.evidence.has(pendingEvidence);
    el.recordEvidence.textContent = state.evidence.has(pendingEvidence)
      ? "Đã ghi trong sổ"
      : !complete ? (hasMiniGame ? "Hoàn tất thử nghiệm trước" : "Kiểm tra đủ các chi tiết")
        : deductionRequired && !deductionSolved ? "Khóa kết luận trước khi ghi" : "Ghi vật chứng vào sổ";
  }

  function renderDeductionCheck(id) {
    const check = DEDUCTION_CHECKS[id]; if (!check) return;
    const section = document.createElement("section"); section.className = "deduction-check";
    section.innerHTML = `<small>CHỐT SUY LUẬN</small><strong>${check.question}</strong><div class="deduction-options"></div><p class="deduction-feedback" aria-live="polite"></p>`;
    const options = $(".deduction-options", section); const feedback = $(".deduction-feedback", section);
    check.options.forEach((option) => {
      const button = document.createElement("button"); button.type = "button"; button.textContent = option.label;
      button.addEventListener("click", () => {
        if (option.correct) {
          state.deductions.add(id); playChord([50, 57, 62, 65], .65, .011); save(); renderInspection();
          toast("Suy luận đã đứng vững. Vật chứng có thể được ghi vào hồ sơ."); return;
        }
        registerMistake(); state.deductionFailures[id] = (state.deductionFailures[id] || 0) + 1; save();
        feedback.textContent = state.deductionFailures[id] >= 2
          ? `Giả thuyết này chưa giải thích được toàn bộ dấu vết. Gợi ý: ${check.hint}`
          : "Giả thuyết này còn mâu thuẫn với dữ kiện vừa khám nghiệm.";
        section.classList.remove("wrong"); void section.offsetWidth; section.classList.add("wrong"); playTone(118, .2, "sawtooth", .02);
      });
      options.append(button);
    });
    el.inspectionActions.append(section);
  }

  function inspectDetail(index) {
    const item = evidence[pendingEvidence]; const inspected = state.inspections[pendingEvidence]; if (!item || !inspected) return;
    inspected.add(index); el.inspectionVisual.classList.remove("turn"); void el.inspectionVisual.offsetWidth; el.inspectionVisual.classList.add("turn");
    playTone(520 + index * 90, .08, "sine", .018); renderInspection(); save();
  }

  function renderMiniGame(id) {
    if (id === "watch") renderWatchGame();
    else if (id === "piano") renderUvGame();
    else if (id === "metronome") renderFitGame();
    else if (id === "access") renderLogGame();
    else if (id === "midi") {
      el.miniGameHost.innerHTML = `<div class="audio-mini"><span>PHỔ ÂM BỊ LỆCH</span><div class="mini-wave"><i></i><i></i><i></i><i></i><i></i></div><p>Hai bản thu nghe gần giống nhau. Hãy mở bàn pháp y để tự khóa điểm đồng bộ.</p></div>`;
    }
  }

  function renderWatchGame() {
    el.miniGameHost.innerHTML = `
      <div class="wipe-game">
        <p>Giữ chuột hoặc ngón tay rồi lau lớp bụi trên mặt kính.</p>
        <div class="watch-face" data-wipe-surface tabindex="0" role="button" aria-label="Lau mặt đồng hồ">
          <span>23:18</span><small>HEART RATE LOST</small><i class="grime-layer"></i>
        </div>
        <div class="mini-progress"><b></b></div><output>Đã làm sạch 0%</output>
      </div>`;
    const surface = $("[data-wipe-surface]", el.miniGameHost); const grime = $(".grime-layer", surface);
    const bar = $(".mini-progress b", el.miniGameHost); const output = $("output", el.miniGameHost);
    let wiping = false, progress = 0, lastX = 0, lastY = 0;
    const wipe = (amount) => {
      progress = Math.min(100, progress + amount); grime.style.opacity = String(Math.max(.05, 1 - progress / 105));
      bar.style.width = `${progress}%`; output.textContent = `Đã làm sạch ${progress}%`;
      if (progress >= 100) solveMiniGame("watch");
    };
    surface.addEventListener("pointerdown", (event) => { wiping = true; lastX = event.clientX || 0; lastY = event.clientY || 0; surface.classList.add("wiping"); wipe(8); });
    surface.addEventListener("pointermove", (event) => {
      if (!wiping) return; const distance = Math.hypot((event.clientX || 0) - lastX, (event.clientY || 0) - lastY);
      lastX = event.clientX || 0; lastY = event.clientY || 0; wipe(Math.max(5, Math.min(16, Math.round(distance / 3))));
    });
    const stop = () => { wiping = false; surface.classList.remove("wiping"); };
    surface.addEventListener("pointerup", stop); surface.addEventListener("pointerleave", stop);
    surface.addEventListener("keydown", (event) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); wipe(20); } });
  }

  function renderUvGame() {
    const zones = [
      { id: "keys", label: "DÃY PHÍM", x: "56%", y: "43%", valid: true, finding: "Phím cao trào không có vệt dầu tay mới; lớp bụi chạy liền qua các khe." },
      { id: "pedals", label: "BÀN ĐẠP VANG", x: "50%", y: "70%", valid: true, finding: "Bụi trên bàn đạp vang còn nguyên. Một màn biểu diễn thật không thể bỏ qua tiếp xúc này." },
      { id: "stand", label: "GIÁ NHẠC", x: "37%", y: "25%", valid: false, rejection: "Giá nhạc có thể không được chạm trong lúc biểu diễn; dấu ở đây không kiểm chứng được tiếng đàn." },
      { id: "rim", label: "MÉP NẮP", x: "78%", y: "57%", valid: false, rejection: "Mép nắp không phải bề mặt bắt buộc phải chạm khi chơi bản nhạc." },
      { id: "bench", label: "GHẾ ĐÀN", x: "24%", y: "70%", valid: false, rejection: "Ghế có thể đã được dùng từ trước. Nó không chứng minh ai chơi đàn lúc 23:50." },
    ];
    const stored = state.miniProgress.piano && typeof state.miniProgress.piano === "object" ? state.miniProgress.piano : {};
    const found = new Set(Array.isArray(stored.found) ? stored.found.filter((id) => zones.some((zone) => zone.id === id && zone.valid)) : []);
    const rejected = new Set(Array.isArray(stored.rejected) ? stored.rejected.filter((id) => zones.some((zone) => zone.id === id && !zone.valid)) : []);
    el.miniGameHost.innerHTML = `
      <div class="uv-game" data-uv-stage>
        <p>Rina nói một màn diễn thật phải để lại tiếp xúc trên cơ cấu chơi đàn. Quét và khóa đúng <strong>hai bề mặt bắt buộc</strong>.</p>
        <div class="piano-silhouette" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        ${zones.map((zone) => `<button type="button" data-uv-target="${zone.id}" data-uv-valid="${zone.valid}" style="--x:${zone.x};--y:${zone.y}" aria-label="Quét ${zone.label.toLowerCase()}" aria-pressed="${found.has(zone.id)}">${zone.label}</button>`).join("")}
        <span class="uv-beam" aria-hidden="true"></span>
        <output><span>${found.size} / 2 tiếp xúc then chốt</span><small>Không đánh dấu theo cảm tính: một lựa chọn sai sẽ giảm Tập trung.</small></output>
      </div>`;
    const stage = $("[data-uv-stage]", el.miniGameHost); const beam = $(".uv-beam", stage); const output = $("output", stage);
    const persist = () => {
      state.miniProgress.piano = { found: [...found], rejected: [...rejected] };
      save();
    };
    const setReadout = (headline, detail) => { output.innerHTML = `<span>${headline}</span><small>${detail}</small>`; };
    stage.addEventListener("pointermove", (event) => {
      const box = stage.getBoundingClientRect(); const x = box.width ? event.clientX - box.left : event.clientX; const y = box.height ? event.clientY - box.top : event.clientY;
      beam.style.transform = `translate(${x}px,${y}px)`;
    });
    $$('[data-uv-target]', stage).forEach((button) => {
      const zone = zones.find((item) => item.id === button.dataset.uvTarget);
      button.classList.toggle("found", found.has(zone.id)); button.classList.toggle("rejected", rejected.has(zone.id));
      button.addEventListener("click", () => {
        if (zone.valid) {
          if (found.has(zone.id)) { setReadout(`${found.size} / 2 tiếp xúc then chốt`, zone.finding); return; }
          found.add(zone.id); button.classList.add("found"); button.setAttribute("aria-pressed", "true"); persist();
          setReadout(`${found.size} / 2 tiếp xúc then chốt`, zone.finding); playTone(510 + found.size * 110, .12, "sine", .018);
          if (found.size === 2) setTimeout(() => solveMiniGame("piano"), 520);
          return;
        }
        if (rejected.has(zone.id)) { setReadout(`${found.size} / 2 tiếp xúc then chốt`, zone.rejection); return; }
        rejected.add(zone.id); button.classList.add("rejected"); registerMistake(); persist();
        setReadout("Giả thuyết bị loại", zone.rejection); stage.classList.remove("wrong"); void stage.offsetWidth; stage.classList.add("wrong"); playTone(118, .18, "sawtooth", .018);
      });
    });
  }

  function renderFitGame() {
    el.miniGameHost.innerHTML = `
      <div class="fit-game">
        <p>Chọn mảnh phù hợp rồi đặt vào hốc mất cân bằng của máy đếm nhịp.</p>
        <div class="metronome-body"><span data-fit-slot tabindex="0" role="button" aria-label="Hốc lắp quả nặng">HỐC TRỐNG</span></div>
        <div class="weight-pieces">
          <button type="button" draggable="true" data-piece="wood">MẢNH GỖ</button>
          <button type="button" draggable="true" data-piece="brass">QUẢ ĐỒNG</button>
          <button type="button" draggable="true" data-piece="steel">ỐC THÉP</button>
        </div><output>So hình dạng, khối lượng và vết lõm.</output>
      </div>`;
    const slot = $("[data-fit-slot]", el.miniGameHost); const output = $("output", el.miniGameHost); let selected = null;
    const choose = (piece, button) => { selected = piece; $$("[data-piece]", el.miniGameHost).forEach((item) => item.classList.toggle("selected", item === button)); };
    const fit = (piece) => {
      if (!piece) { output.textContent = "Hãy chọn một mảnh trước."; return; }
      if (piece === "brass") { slot.textContent = "KHỚP VẾT LÕM"; slot.classList.add("correct"); solveMiniGame("metronome"); return; }
      registerMistake(); output.textContent = piece === "wood" ? "Quá nhẹ và không tạo được vết lõm." : "Ốc thép quá nhỏ so với hốc trượt.";
      slot.classList.remove("wrong"); void slot.offsetWidth; slot.classList.add("wrong"); playTone(126, .16, "sawtooth", .018); save();
    };
    $$("[data-piece]", el.miniGameHost).forEach((button) => {
      button.addEventListener("click", () => choose(button.dataset.piece, button));
      button.addEventListener("dragstart", (event) => { selected = button.dataset.piece; if (event.dataTransfer) event.dataTransfer.setData("text/plain", selected); });
    });
    slot.addEventListener("click", () => fit(selected)); slot.addEventListener("keydown", (event) => { if (["Enter", " "].includes(event.key)) fit(selected); });
    slot.addEventListener("dragover", (event) => event.preventDefault()); slot.addEventListener("drop", (event) => { event.preventDefault(); fit(event.dataTransfer?.getData("text/plain") || selected); });
  }

  function renderLogGame() {
    const fragments = [
      ["delete", "00:04 / CENTRAL DELETE"], ["crc", "CRC 9F2A ≠ GỐC 77C1"], ["head", "23:12 / READER HEAD"],
      ["code", "TOKEN S-04 / READ"], ["midi", "23:50 / MIDI EXECUTE"], ["amp", "23:52 / AMP TELEMETRY"],
    ];
    const fragmentIds = new Set(fragments.map(([id]) => id));
    const stored = state.miniProgress.access && typeof state.miniProgress.access === "object" ? state.miniProgress.access : {};
    let chosen = Array.isArray(stored.chosen) ? stored.chosen.filter((id) => fragmentIds.has(id)).slice(0, 4) : [];
    el.miniGameHost.innerHTML = `
      <div class="log-game">
        <p>Khôi phục đúng bốn trường của gói đầu đọc: <strong>thời điểm → mã thẻ → checksum → thao tác trung tâm</strong>. Hai mảnh thuộc hệ thống âm thanh.</p>
        <div class="log-sequence" aria-live="polite"></div>
        <div class="log-fragments">${fragments.map(([id, label]) => `<button type="button" data-log-id="${id}">${label}</button>`).join("")}</div>
        <div class="log-controls"><button type="button" data-log-reset>LÀM LẠI</button><button type="button" data-log-check disabled>GIẢI MÃ</button></div>
        <output>0 / 4 trường đã khóa</output>
      </div>`;
    const sequence = $(".log-sequence", el.miniGameHost); const output = $("output", el.miniGameHost); const check = $("[data-log-check]", el.miniGameHost);
    const persist = () => { state.miniProgress.access = { chosen: [...chosen] }; save(); };
    const renderSequence = () => {
      sequence.innerHTML = chosen.length ? chosen.map((id, index) => `<button type="button" data-log-remove="${id}"><small>${index + 1}</small>${fragments.find(([key]) => key === id)[1]}</button>`).join("") : "<span>ĐẶT BỐN TRƯỜNG GÓI DỮ LIỆU VÀO ĐÂY</span>";
      $$("[data-log-id]", el.miniGameHost).forEach((button) => { button.disabled = chosen.includes(button.dataset.logId) || chosen.length === 4; });
      $$("[data-log-remove]", sequence).forEach((button) => button.addEventListener("click", () => { chosen = chosen.filter((id) => id !== button.dataset.logRemove); persist(); renderSequence(); }));
      output.textContent = `${chosen.length} / 4 trường đã khóa`; check.disabled = chosen.length !== 4;
    };
    $$("[data-log-id]", el.miniGameHost).forEach((button) => button.addEventListener("click", () => { if (chosen.length >= 4) return; chosen.push(button.dataset.logId); persist(); renderSequence(); }));
    $("[data-log-reset]", el.miniGameHost).addEventListener("click", () => { chosen = []; persist(); renderSequence(); });
    check.addEventListener("click", () => {
      if (chosen.join(",") === "head,code,crc,delete") { solveMiniGame("access"); return; }
      registerMistake(); output.textContent = "Gói chưa hợp lệ. Kiểm tra xem có mảnh nào thuộc MIDI/khuếch đại, rồi đọc từ đầu đọc đến thao tác xóa.";
      sequence.classList.remove("wrong"); void sequence.offsetWidth; sequence.classList.add("wrong"); playTone(118, .18, "sawtooth", .018); save();
    });
    renderSequence();
  }

  function solveMiniGame(id) {
    if (state.miniGames.has(id)) return; const item = evidence[id];
    delete state.miniProgress[id];
    state.miniGames.add(id); if (!state.inspections[id]) state.inspections[id] = new Set();
    item.actions.forEach((_, index) => state.inspections[id].add(index)); el.inspectionTitle.textContent = item.name;
    playChord([48, 55, 60, 64], .75, .012); toast(`Thử nghiệm hoàn tất: ${item.name}`); save(); renderInspection(); updateObjective();
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
    if (Math.abs(value - 58) > 3) { registerMistake(); el.audioResult.textContent = "Điểm đầu và cuối câu vẫn trượt nhau. Hãy nghe lại rồi dịch bản ghi."; playTone(125, .18, "sawtooth", .02); save(); return; }
    state.audioSolved = true; state.miniGames.add("midi"); if (!state.inspections.midi) state.inspections.midi = new Set();
    evidence.midi.actions.forEach((_, index) => state.inspections.midi.add(index));
    el.audioResult.textContent = "Đã khóa: bản hiện trường bám lưới tuyệt đối, không có độ trễ tự nhiên của người chơi.";
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
      registerMistake(); el.linkFeedback.textContent = "Hai mảnh này chưa tạo thành một quan hệ đủ chắc. Không có đáp án nào được tiết lộ.";
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

  function openTimelineLab() {
    if (!CORE_EVIDENCE.every((id) => state.evidence.has(id))) { toast("Hãy thu đủ vật chứng cốt lõi trước khi xếp dòng thời gian."); return; }
    if (el.notebook.open) el.notebook.close(); if (el.linkBoard.open) el.linkBoard.close();
    selectedTimelineEvent = null; setPhase("timeline", "Tái dựng thời gian"); renderTimelineLab();
    if (!el.timelineLab.open) el.timelineLab.showModal(); playChord([41, 48, 53, 57], .7, .009);
  }

  function renderTimelineLab() {
    el.timelineSlots.replaceChildren();
    TIMELINE_EVENTS.forEach((slot) => {
      const eventId = state.timelineSlots[slot.id]; const event = TIMELINE_EVENTS.find((item) => item.id === eventId);
      const button = document.createElement("button"); button.type = "button"; button.className = `timeline-slot${event ? " filled" : ""}`;
      button.dataset.timelineSlot = slot.id; button.innerHTML = `<time>${slot.time}</time><span>${event ? event.text : "Thả một sự kiện vào mốc này"}</span>`;
      button.addEventListener("click", () => {
        if (selectedTimelineEvent) placeTimelineEvent(slot.id, selectedTimelineEvent);
        else if (eventId) { delete state.timelineSlots[slot.id]; renderTimelineLab(); save(); }
      });
      button.addEventListener("dragover", (eventDrag) => eventDrag.preventDefault());
      button.addEventListener("drop", (eventDrop) => { eventDrop.preventDefault(); const id = eventDrop.dataTransfer?.getData("text/plain"); if (id) placeTimelineEvent(slot.id, id); });
      el.timelineSlots.append(button);
    });
    const used = new Set(Object.values(state.timelineSlots)); el.timelineDeck.replaceChildren();
    TIMELINE_DECK_ORDER.forEach((id) => {
      if (used.has(id)) return; const event = TIMELINE_EVENTS.find((item) => item.id === id); const button = document.createElement("button");
      button.type = "button"; button.draggable = true; button.dataset.timelineEvent = id; button.className = `timeline-event${selectedTimelineEvent === id ? " selected" : ""}`;
      button.innerHTML = `<small>SỰ KIỆN</small><span>${event.text}</span>`;
      button.addEventListener("click", () => { selectedTimelineEvent = selectedTimelineEvent === id ? null : id; renderTimelineLab(); });
      button.addEventListener("dragstart", (dragEvent) => { selectedTimelineEvent = id; if (dragEvent.dataTransfer) dragEvent.dataTransfer.setData("text/plain", id); });
      el.timelineDeck.append(button);
    });
    const filled = Object.keys(state.timelineSlots).length; el.checkTimeline.disabled = filled !== TIMELINE_EVENTS.length;
    el.timelineFeedback.textContent = state.timelineSolved ? "Dòng thời gian đã được chứng minh bằng hồ sơ." : `Đã đặt ${filled}/${TIMELINE_EVENTS.length} sự kiện. Game chỉ báo cả chuỗi đúng hoặc sai.`;
  }

  function placeTimelineEvent(slotId, eventId) {
    if (!TIMELINE_EVENTS.some((item) => item.id === slotId) || !TIMELINE_EVENTS.some((item) => item.id === eventId)) return;
    Object.keys(state.timelineSlots).forEach((key) => { if (state.timelineSlots[key] === eventId) delete state.timelineSlots[key]; });
    state.timelineSlots[slotId] = eventId; selectedTimelineEvent = null; playTone(440 + Object.keys(state.timelineSlots).length * 45, .07, "triangle", .014); renderTimelineLab(); save();
  }

  function checkTimeline() {
    const correct = TIMELINE_EVENTS.every((slot) => state.timelineSlots[slot.id] === slot.id);
    if (!correct) {
      registerMistake(); el.timelineFeedback.textContent = "Ít nhất một sự kiện đang đứng sai mốc. Đối chiếu mốc khách quan; game không chỉ ra ô sai.";
      el.timelineLab.classList.remove("wrong"); void el.timelineLab.offsetWidth; el.timelineLab.classList.add("wrong"); playTone(112, .24, "sawtooth", .022); save(); return;
    }
    state.timelineSolved = true; el.timelineFeedback.textContent = "Chuỗi thời gian đã khóa: tiếng đàn 23:50 xảy ra sau khi nạn nhân chết.";
    playChord([45, 52, 57, 60, 64], 1, .014); updateObjective(); save();
    setTimeout(() => closeTimelineLab(), 900);
  }

  function closeTimelineLab() {
    if (el.timelineLab.open) el.timelineLab.close(); selectedTimelineEvent = null;
    setPhase("investigation", "Khám phá hiện trường"); renderObjects(); renderInvestigationPrompt();
  }

  function openReconstruction() {
    if (!CORE_EVIDENCE.every((id) => state.evidence.has(id)) || !REQUIRED_LINKS.every((id) => state.links.has(id)) || !state.timelineSolved) {
      toast("Bạn cần đủ vật chứng, dòng thời gian và năm mối liên hệ trước khi đối chất."); return;
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
      registerMistake(); const accused = state.final.culprit?.startsWith("suspect-") ? suspects[state.final.culprit.slice(8)] : null;
      el.reconstructionFeedback.textContent = accused
        ? `${accused.name}: “Nếu buộc tội tôi, hãy chỉ ra cả thời điểm, thủ thuật và hung khí.” Ít nhất một mắt xích chưa đứng vững.`
        : "Ít nhất một mắt xích chưa được chứng minh bởi hồ sơ. Không chỉ ra ô sai — hãy tự đối chiếu lại.";
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
    const score = caseScore();
    const perfectCase = state.mistakes === 0 && state.evidence.has("coffee") && state.evidence.has("umbrella") && state.links.has("haru-route");
    state.rank = perfectCase ? "S+" : score >= 94 ? "S" : score >= 82 ? "A" : score >= 68 ? "B" : "C";
    setPhase("ending", perfectCase ? "Hồ sơ hoàn hảo" : "Hồ sơ hoàn tất");
    const ending = perfectCase
      ? `HỒ SƠ HOÀN HẢO — hạng S+, ${score}/100 điểm. Bạn không chỉ tìm ra hung thủ mà còn kiểm tra giả thuyết đầu độc, xác minh đường đi của Haru và bảo toàn bản lưu HANA_MASTER. Không còn người vô tội nào bị bỏ lại dưới bóng nghi ngờ.`
      : `Vụ án khép lại — hạng ${state.rank}, ${score}/100 điểm. Bạn đã tìm ra hung thủ, nhưng hồ sơ vẫn còn những nhánh phụ chưa được chứng minh tuyệt đối.`;
    setDialogue("ren", ending, {
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
      const launch = document.createElement("button"); launch.type = "button"; launch.className = "button primary timeline-launch";
      launch.textContent = state.timelineSolved ? "✓ Xem lại bàn thời gian" : "Tự xếp dòng thời gian";
      launch.disabled = !CORE_EVIDENCE.every((id) => state.evidence.has(id)); launch.addEventListener("click", openTimelineLab);
      el.notebookContent.append(list, launch);
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
    state.sound = !state.sound; ensureAudio(); masterGain.gain.setTargetAtTime(state.sound ? .7 : 0, audioContext.currentTime, .04);
    if (!state.sound) {
      const complete = currentLineComplete; currentLineComplete = null;
      cancelVoiceWait(); voiceSequence += 1;
      if (supportsSpeechSynthesis()) window.speechSynthesis.cancel();
      if (typing) { clearInterval(typingTimer); el.dialogue.textContent = fullText; typing = false; if (complete) complete(); }
    }
    if (state.sound) replayCurrentVoice();
    el.replayVoice.disabled = !state.sound;
    el.sound.textContent = `ÂM: ${state.sound ? "BẬT" : "TẮT"}`; save();
  }

  function beginNewGame() {
    localStorage.removeItem(SAVE_KEY); showGame(); ensureAudio(); startScore();
    Object.assign(state, {
      phase: "prologue", location: "hall", interviews: new Set(), statementCards: new Set(["crowd-time"]),
      pinnedStatements: new Set(), suspectPressure: {}, evidence: new Set(), inspections: {}, miniGames: new Set(), links: new Set(),
      deductions: new Set(), deductionFailures: {}, miniProgress: {}, audioSolved: false, timelineSlots: {}, timelineSolved: false, mistakes: 0, final: {}, rank: null,
    });
    currentInterviewId = null; currentDialogueLine = null; currentPinAttempted = false; selectedTimelineEvent = null; hideInterrogationTools();
    setPhase("prologue", "Mở đầu"); changeLocation("hall"); playDialogue(prologue, startStatements);
  }

  function continueSaved() {
    const saved = readSave(); if (!saved) return beginNewGame(); applySave(saved); showGame(); ensureAudio(); startScore(); el.sound.textContent = `ÂM: ${state.sound ? "BẬT" : "TẮT"}`;
    if (state.phase === "statements" || state.phase === "prologue") startStatements();
    else if (["investigation", "linking", "timeline"].includes(state.phase)) { state.phase = "investigation"; setPhase("investigation", "Khám phá hiện trường"); el.locationNav.hidden = false; el.sceneTip.hidden = false; changeLocation(state.location || "studio"); renderInvestigationPrompt(); }
    else if (state.phase === "reconstruction") { state.phase = "investigation"; setPhase("investigation", "Khám phá hiện trường"); changeLocation(state.location || "studio"); openReconstruction(); }
    else if (state.phase === "ending") { changeLocation("studio"); finishCase(); }
    else { state.phase = "investigation"; beginInvestigation(); }
  }

  el.newGame.addEventListener("click", beginNewGame); el.continueGame.addEventListener("click", continueSaved); el.sound.addEventListener("click", toggleSound);
  el.textSize.addEventListener("click", cycleTextSize);
  el.replayVoice.addEventListener("click", (event) => { event.stopPropagation(); replayCurrentVoice(); });
  el.notebookButton.addEventListener("click", openNotebook); el.next.addEventListener("click", (event) => { event.stopPropagation(); advanceDialogue(); });
  el.pinStatement.addEventListener("click", (event) => { event.stopPropagation(); pinCurrentStatement(); });
  el.dialoguePanel.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    if (typing || !el.next.hidden) advanceDialogue();
  });
  el.locationNav.addEventListener("click", (event) => { const button = event.target.closest("[data-location]"); if (button) changeLocation(button.dataset.location); });
  el.inspectionClose.addEventListener("click", closeInspection); el.recordEvidence.addEventListener("click", recordPendingEvidence);
  el.linkClose.addEventListener("click", closeLinkBoard); el.testLink.addEventListener("click", testSelectedLink);
  el.audioClose.addEventListener("click", () => { if (el.audioLab.open) el.audioLab.close(); if (pendingEvidence && !el.inspection.open) { el.inspection.showModal(); renderInspection(); } });
  el.audioAlign.addEventListener("input", updateAudioReadout); el.lockAudio.addEventListener("click", lockAudio);
  el.timelineClose.addEventListener("click", closeTimelineLab); el.checkTimeline.addEventListener("click", checkTimeline);
  $$('[data-play-sample]').forEach((button) => button.addEventListener("click", () => playSample(button.dataset.playSample)));
  el.submitReconstruction.addEventListener("click", submitReconstruction);
  $$(".notebook-tabs button").forEach((button) => button.addEventListener("click", () => renderNotebook(button.dataset.tab)));
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !event.target.matches("button, input") && (typing || !el.next.hidden)) { event.preventDefault(); advanceDialogue(); }
    if (event.key.toLowerCase() === "n" && el.game.classList.contains("active")) openNotebook();
  });

  applyTextSize(localStorage.getItem(TEXT_SIZE_KEY) || "large");
  if (supportsSpeechSynthesis()) {
    refreshVietnameseVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", handleVoicesChanged);
  } else {
    el.replayVoice.hidden = true;
  }
  el.continueGame.hidden = !readSave(); updateObjective();
})();
