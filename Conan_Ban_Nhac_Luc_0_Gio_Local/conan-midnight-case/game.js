(() => {
  "use strict";

  const SAVE_KEY = "conan-midnight-case-save-v1";
  const REQUIRED_CLUES = ["watch", "piano", "midi", "access", "metronome", "door"];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const elements = {
    titleScreen: $("#title-screen"),
    gameScreen: $("#game-screen"),
    newGame: $("#new-game-button"),
    continueGame: $("#continue-button"),
    phase: $("#phase-label"),
    objective: $("#objective-label"),
    sound: $("#sound-button"),
    notebookButton: $("#notebook-button"),
    clueCount: $("#clue-count"),
    scene: $("#scene"),
    sceneCaption: $("#scene-caption"),
    hotspotLayer: $("#hotspot-layer"),
    locationNav: $("#location-nav"),
    portrait: $("#portrait"),
    speaker: $("#speaker-name"),
    dialogue: $("#dialogue-text"),
    choices: $("#choice-list"),
    next: $("#next-button"),
    dialoguePanel: $("#dialogue-panel"),
    notebook: $("#notebook"),
    notebookContent: $("#notebook-content"),
    deduction: $("#deduction"),
    deductionProgress: $("#deduction-progress"),
    logicProgress: $("#logic-progress"),
    deductionQuestion: $("#deduction-question"),
    deductionOptions: $("#deduction-options"),
    deductionFeedback: $("#deduction-feedback"),
    toast: $("#toast"),
  };

  const characterNames = {
    conan: "Edogawa Conan",
    ran: "Mouri Ran",
    kogoro: "Mouri Kogoro",
    megure: "Thanh tra Megure",
    rina: "Aoyama Rina",
    yuto: "Senda Yuto",
    misaki: "Kisaragi Misaki",
    haru: "Nishino Haru",
    narrator: "Hồ sơ vụ án",
  };

  const clues = {
    watch: {
      name: "Đồng hồ thông minh",
      icon: "⌚",
      location: "studio",
      position: [54, 66],
      description: "Dữ liệu nhịp tim dừng đột ngột lúc 23:18, sớm hơn tiếng đàn hơn 30 phút.",
      timeline: ["23:18", "Nhịp tim của nạn nhân dừng lại."],
      lines: [
        { who: "conan", text: "Màn hình đã vỡ, nhưng bộ nhớ vẫn còn. Nhịp tim dừng lúc 23:18... không phải 0 giờ." },
        { who: "megure", text: "Vậy tiếng đàn mọi người nghe sau 23:50 không thể do nạn nhân biểu diễn." },
      ],
    },
    piano: {
      name: "Bàn phím và bàn đạp",
      icon: "♫",
      location: "studio",
      position: [43, 58],
      description: "Phím đàn sạch bất thường; lớp bụi mỏng trên ba bàn đạp hoàn toàn không bị xáo trộn.",
      lines: [
        { who: "conan", text: "Một bản nhạc mạnh như vậy phải dùng bàn đạp vang. Nhưng lớp bụi này chưa từng bị chạm vào tối nay." },
        { who: "ran", text: "Nghĩa là tiếng đàn có thể phát ra mà không có người ngồi trước cây đàn?" },
      ],
    },
    coffee: {
      name: "Tách cà phê lạnh",
      icon: "☕",
      location: "studio",
      position: [64, 48],
      description: "Cà phê đã lạnh hoàn toàn và đóng một lớp màng mỏng; nó được rót từ rất lâu trước 0 giờ.",
      timeline: ["Trước 23:10", "Misaki mang cà phê vào phòng thu."],
      lines: [
        { who: "conan", text: "Cà phê lạnh hẳn, trên mặt còn có lớp màng. Nó không thể mới được rót gần 0 giờ." },
        { who: "kogoro", text: "Hừm! Chi tiết đó chỉ chứng minh ông ta thích uống cà phê nguội thôi!" },
      ],
    },
    metronome: {
      name: "Máy đếm nhịp bị tháo",
      icon: "△",
      location: "studio",
      position: [51, 39],
      description: "Quả nặng bằng đồng của máy đếm nhịp đã biến mất; cạnh đế có một vết lõm mới.",
      lines: [
        { who: "conan", text: "Thanh trượt còn đây, nhưng quả nặng bằng đồng đã bị tháo. Nó đủ nặng để trở thành hung khí." },
        { who: "megure", text: "Cảnh sát sẽ tìm nó trong đồ đạc của tất cả những người có mặt." },
      ],
    },
    door: {
      name: "Khóa cửa tự động",
      icon: "▣",
      location: "studio",
      position: [84, 58],
      description: "Cửa không cần chìa để khóa: chỉ cần khép lại, chốt điện tử sẽ tự động đóng.",
      lines: [
        { who: "conan", text: "Đây không phải phòng kín thật sự. Hung thủ chỉ cần rời đi rồi khép cửa; khóa sẽ tự chốt." },
        { who: "ran", text: "Vậy câu hỏi không phải hung thủ thoát ra thế nào, mà là họ rời đi lúc nào." },
      ],
    },
    midi: {
      name: "Tệp MIDI hẹn giờ",
      icon: "▶",
      location: "control",
      position: [35, 37],
      description: "Tệp midnight_take.mid được đặt lịch phát từ 23:50 đến đúng 0 giờ qua hệ thống đàn tự động.",
      timeline: ["23:50", "Hệ thống tự động phát tệp midnight_take.mid."],
      lines: [
        { who: "conan", text: "Đây rồi: midnight_take.mid, đặt lịch chạy lúc 23:50. Tiếng đàn chỉ là dữ liệu điều khiển tự động." },
        { who: "ran", text: "Kẻ gây án đã dùng bản nhạc để khiến mọi người hiểu sai thời điểm tử vong." },
      ],
    },
    access: {
      name: "Bản sao nhật ký khóa",
      icon: "#",
      location: "control",
      position: [63, 38],
      description: "Nhật ký chính bị xóa một dòng, nhưng bộ nhớ đệm ghi thẻ kỹ thuật S-04 mở cửa lúc 23:12.",
      timeline: ["23:12", "Thẻ kỹ thuật S-04 mở cửa Phòng thu A."],
      lines: [
        { who: "conan", text: "Nhật ký chính bị sửa, nhưng bộ nhớ đệm chưa kịp xóa: thẻ S-04 đã mở Phòng thu A lúc 23:12." },
        { who: "megure", text: "S-04 là thẻ của kỹ thuật viên âm thanh Senda Yuto." },
      ],
    },
    amplifier: {
      name: "Bộ khuếch đại còn nóng",
      icon: "≈",
      location: "control",
      position: [49, 65],
      description: "Bộ khuếch đại vừa hoạt động, trái với lời khai rằng toàn bộ hệ thống đã tắt từ 23:30.",
      lines: [
        { who: "conan", text: "Khe tản nhiệt vẫn còn nóng. Hệ thống chắc chắn đã hoạt động sau 23:30." },
        { who: "kogoro", text: "Vậy có người đã nói dối về tình trạng của phòng điều khiển." },
      ],
    },
    umbrella: {
      name: "Chiếc ô ướt",
      icon: "☂",
      location: "hall",
      position: [24, 72],
      description: "Chiếc ô của phóng viên Haru còn ướt, xác nhận anh ta vừa trở về từ bãi xe.",
      timeline: ["23:25", "Haru trở về từ bãi xe và nhìn thấy Yuto gần phòng điều khiển."],
      lines: [
        { who: "conan", text: "Nước mưa vẫn đang chảy từ chiếc ô. Haru quả thật vừa đi qua bãi xe như lời khai." },
        { who: "haru", text: "Và lúc quay lại, tôi thấy anh Yuto bước khỏi phòng điều khiển với một hộp dụng cụ kim loại." },
      ],
    },
  };

  const suspects = {
    rina: {
      name: "Aoyama Rina",
      role: "Nghệ sĩ piano trẻ",
      secret: "Bị nạn nhân lấy tên khỏi phần đồng sáng tác.",
      testimony: "Bản nhạc lúc 23:50 hoàn hảo một cách máy móc; nạn nhân luôn ngừng nửa nhịp trước đoạn kết.",
      lines: [
        { who: "rina", text: "Tôi căm ông Kisaragi vì đã xóa tên tôi khỏi bản nhạc. Nhưng lúc 23:18 tôi đang biểu diễn trên sân khấu phụ, hàng trăm người nhìn thấy." },
        { who: "conan", text: "Cô nhận ra bản nhạc lúc 23:50 có gì khác không?" },
        { who: "rina", text: "Không có khoảng nghỉ trước hợp âm cuối. Ông ấy chưa từng chơi như vậy... giống một bản thu được lập trình hơn." },
      ],
    },
    misaki: {
      name: "Kisaragi Misaki",
      role: "Quản lý kiêm em gái nạn nhân",
      secret: "Biết anh trai đã chiếm đoạt một bản nhạc chưa công bố.",
      testimony: "Mang cà phê vào lúc 23:08 và thấy Yuto chờ ngoài hành lang với thẻ kỹ thuật.",
      lines: [
        { who: "misaki", text: "Tôi mang cà phê vào lúc 23:08. Anh tôi đang tranh cãi qua điện thoại về quyền tác giả của một bản nhạc." },
        { who: "conan", text: "Khi rời đi, cô có nhìn thấy ai không?" },
        { who: "misaki", text: "Yuto đứng cuối hành lang, cầm thẻ kỹ thuật. Tôi tưởng anh ấy đến sửa hệ thống đàn tự động." },
      ],
    },
    haru: {
      name: "Nishino Haru",
      role: "Phóng viên âm nhạc",
      secret: "Định công bố bài điều tra về việc đạo nhạc.",
      testimony: "Từ bãi xe trở lại lúc 23:25 và nhìn thấy Yuto rời phòng điều khiển.",
      lines: [
        { who: "haru", text: "Tôi có động cơ để vạch mặt ông ta, không phải giết ông ta. Bài điều tra của tôi sẽ vô nghĩa nếu nguồn tin chết." },
        { who: "conan", text: "Anh đã thấy gì khi quay lại từ bãi xe?" },
        { who: "haru", text: "Khoảng 23:25, Yuto rời phòng điều khiển. Anh ta giấu một hộp kim loại dưới áo khoác." },
      ],
    },
    yuto: {
      name: "Senda Yuto",
      role: "Kỹ thuật viên âm thanh",
      secret: "Em gái quá cố là tác giả thật của Bản Nhạc Lúc 0 Giờ.",
      testimony: "Khẳng định hệ thống đã tắt từ 23:30 và không vào Phòng thu A sau 22:40.",
      lines: [
        { who: "yuto", text: "Tôi không vào Phòng thu A sau 22:40. Hệ thống điều khiển cũng đã tắt hoàn toàn từ 23:30." },
        { who: "conan", text: "Anh chắc chứ? Bộ khuếch đại vẫn nóng và thẻ S-04 xuất hiện trong bộ nhớ đệm lúc 23:12." },
        { who: "yuto", text: "Nhật ký có thể lỗi. Tôi... tôi không còn gì để nói." },
      ],
    },
  };

  const prologue = [
    { who: "narrator", text: "HƯỚNG DẪN: Khung hội thoại luôn ở phía dưới màn hình. Bấm vào khung, nút TIẾP TỤC hoặc phím cách để đọc tiếp." },
    { who: "narrator", text: "Nhà hát Tsukikage, 0 giờ 07 phút. Bên ngoài, cơn mưa đã xóa sạch mọi dấu chân." },
    { who: "ran", text: "Conan, bác Kogoro chỉ được mời tới buổi ra mắt bản nhạc... sao cảnh sát lại phong tỏa cả nhà hát vậy?" },
    { who: "megure", text: "Nhạc sĩ Kisaragi Daigo được phát hiện tử vong trong Phòng thu A. Căn phòng khóa kín từ bên trong hệ thống." },
    { who: "kogoro", text: "Nhưng từ 23:50 đến đúng 0 giờ, tất cả chúng tôi đều nghe ông ấy chơi đàn! Hung thủ chỉ có thể ra tay sau đó." },
    { who: "conan", text: "Không đúng... Nếu tiếng đàn chính là thứ hung thủ muốn mọi người nghe thấy thì sao?" },
    { who: "narrator", text: "Mục tiêu: khám phá hiện trường, thu thập ít nhất 6 chứng cứ cốt lõi rồi hỏi cung bốn nghi phạm." },
  ];

  const reveal = [
    { who: "conan", text: "Sự thật chỉ có một. Kisaragi Daigo đã chết lúc 23:18, đúng như dữ liệu đồng hồ ghi lại." },
    { who: "conan", text: "Tiếng đàn lúc 23:50 không phải biểu diễn trực tiếp. Tệp MIDI đã điều khiển cây đàn tự động trong khi căn phòng hoàn toàn trống lặng." },
    { who: "megure", text: "Còn căn phòng khóa kín?" },
    { who: "conan", text: "Cửa tự khóa khi khép lại. Hung thủ rời đi từ trước, sau đó xóa dòng thẻ của mình khỏi nhật ký chính." },
    { who: "conan", text: "Nhưng bộ nhớ đệm vẫn giữ thẻ S-04 lúc 23:12. Người có thẻ đó, hiểu hệ thống MIDI và nói dối rằng thiết bị đã tắt... chỉ có một." },
    { who: "conan", text: "Hung thủ là anh, Senda Yuto." },
    { who: "yuto", text: "...Cậu chỉ là một đứa trẻ. Làm sao cậu có thể biết?" },
    { who: "conan", text: "Quả nặng bằng đồng bị tháo khỏi máy đếm nhịp nằm trong hộp dụng cụ của anh. Vết lõm trên đế cũng khớp với cú va chạm." },
    { who: "yuto", text: "Bản Nhạc Lúc 0 Giờ do em gái tôi, Hana, sáng tác trước khi qua đời. Kisaragi đã lấy nó và dọa hủy mọi bản thảo còn lại." },
    { who: "yuto", text: "Tôi chỉ muốn ông ta thú nhận. Ông ta lao vào tôi... Tôi vung thứ đang cầm trong tay. Rồi tôi sợ hãi và dựng nên màn kịch này." },
    { who: "ran", text: "Một lời nói dối không thể đưa người đã mất trở về... nó chỉ khiến thêm nhiều người bị tổn thương." },
    { who: "conan", text: "Âm nhạc có thể lưu giữ ký ức. Nhưng chỉ sự thật mới giúp người sống bước tiếp." },
  ];

  const deductionQuestions = [
    {
      question: "Tiếng đàn được nghe từ 23:50 thực chất là gì?",
      options: ["Rina bí mật biểu diễn", "Một tệp MIDI được hẹn giờ", "Bản thu phát từ điện thoại", "Nạn nhân vẫn còn sống"],
      correct: 1,
      feedback: "Đúng. Tệp midnight_take.mid điều khiển cây đàn tự động, còn lớp bụi trên bàn đạp chứng minh không có người biểu diễn.",
    },
    {
      question: "Thời điểm tử vong thật sự gần nhất với mốc nào?",
      options: ["Khoảng 23:18", "Đúng 23:50", "Khoảng 0:03", "Sau khi cảnh sát tới"],
      correct: 0,
      feedback: "Đúng. Dữ liệu nhịp tim dừng lúc 23:18; tách cà phê lạnh cũng phủ nhận thời điểm tử vong gần 0 giờ.",
    },
    {
      question: "Hung thủ tạo ra căn phòng khóa kín bằng cách nào?",
      options: ["Trốn trong trần nhà", "Dùng chìa khóa giả từ bên ngoài", "Rời đi sớm rồi để cửa tự khóa", "Đi qua đường hầm bí mật"],
      correct: 2,
      feedback: "Chính xác. Chốt điện tử tự đóng khi cửa khép; hung thủ không cần ở trong phòng lúc tiếng đàn vang lên.",
    },
    {
      question: "Vật nào phù hợp nhất với hung khí đã biến mất?",
      options: ["Tách cà phê", "Quả nặng bằng đồng của máy đếm nhịp", "Thẻ khóa S-04", "Bàn đạp piano"],
      correct: 1,
      feedback: "Đúng. Quả nặng đủ chắc, đã bị tháo vội và để lại vết lõm mới trên đế máy đếm nhịp.",
    },
    {
      question: "Ai có đủ quyền truy cập, kiến thức và lời khai mâu thuẫn để thực hiện thủ thuật?",
      options: ["Aoyama Rina", "Kisaragi Misaki", "Nishino Haru", "Senda Yuto"],
      correct: 3,
      finalChoice: true,
      feedback: "Kết luận đã được khóa. Bây giờ hãy đối chất để kiểm chứng toàn bộ chuỗi suy luận của bạn.",
    },
  ];

  const locationNames = {
    hall: "Hành lang nhà hát • 0 giờ 07",
    studio: "Phòng thu A • Hiện trường khóa kín",
    control: "Phòng điều khiển • Hệ thống âm thanh",
  };

  const state = {
    phase: "title",
    location: "hall",
    clues: new Set(),
    interviews: new Set(),
    mistakes: 0,
    sound: true,
    rank: null,
  };

  let dialogueQueue = [];
  let dialogueCallback = null;
  let typingTimer = 0;
  let typingText = "";
  let isTyping = false;
  let toastTimer = 0;
  let dialogueGuideTimer = 0;
  let deductionIndex = 0;
  let audioContext = null;
  let audioMaster = null;
  let ambientNodes = [];

  function saveGame() {
    if (state.phase === "title") return;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      phase: state.phase,
      location: state.location,
      clues: [...state.clues],
      interviews: [...state.interviews],
      mistakes: state.mistakes,
      rank: state.rank,
      deductionIndex,
    }));
    elements.continueGame.hidden = false;
  }

  function clearSave() {
    localStorage.removeItem(SAVE_KEY);
    elements.continueGame.hidden = true;
  }

  function readSave() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      return saved && Array.isArray(saved.clues) ? saved : null;
    } catch {
      return null;
    }
  }

  function applySave(saved) {
    state.phase = saved.phase || "investigation";
    state.location = saved.location || "studio";
    state.clues = new Set(saved.clues || []);
    state.interviews = new Set(saved.interviews || []);
    state.mistakes = saved.mistakes || 0;
    state.rank = saved.rank || null;
    deductionIndex = Number.isInteger(saved.deductionIndex) ? saved.deductionIndex : 0;
  }

  function showScreen(name) {
    elements.titleScreen.classList.toggle("active", name === "title");
    elements.gameScreen.classList.toggle("active", name === "game");
  }

  function setPhase(phase, label) {
    state.phase = phase;
    elements.phase.textContent = `Giai đoạn: ${label}`;
    updateObjective();
    saveGame();
  }

  function updateObjective() {
    if (!elements.objective) return;
    const core = coreClueCount();
    const interviewed = state.interviews.size;
    const labels = {
      title: "Sẵn sàng phá án",
      prologue: "Đọc phần mở đầu • Bấm TIẾP TỤC",
      investigation: core >= REQUIRED_CLUES.length
        ? "Đã đủ chứng cứ • Bắt đầu hỏi cung"
        : `Chứng cứ cốt lõi ${core}/${REQUIRED_CLUES.length}`,
      interrogation: interviewed >= Object.keys(suspects).length
        ? "Đã đủ lời khai • Xâu chuỗi sự thật"
        : `Lời khai ${interviewed}/${Object.keys(suspects).length}`,
      deduction: "Tự đối chiếu chứng cứ và chọn thủ phạm",
      reveal: "Sự thật đang được vạch trần",
      ending: "Vụ án đã khép lại",
    };
    elements.objective.textContent = labels[state.phase] || "Theo dấu sự thật";
  }

  function setPortrait(who) {
    const character = characterNames[who] ? who : "narrator";
    elements.portrait.className = `portrait ${character}`;
    elements.portrait.hidden = character === "narrator";
    elements.speaker.textContent = characterNames[character];
  }

  function finishTyping() {
    if (!isTyping) return false;
    clearInterval(typingTimer);
    elements.dialogue.textContent = typingText;
    isTyping = false;
    return true;
  }

  function typeLine(text) {
    clearInterval(typingTimer);
    typingText = text;
    elements.dialogue.textContent = "";
    isTyping = true;
    let index = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = reduced ? text.length : 2;
    typingTimer = window.setInterval(() => {
      index = Math.min(text.length, index + step);
      elements.dialogue.textContent = text.slice(0, index);
      if (index >= text.length) {
        clearInterval(typingTimer);
        isTyping = false;
      }
    }, reduced ? 1 : 18);
  }

  function clearChoices() {
    elements.choices.replaceChildren();
  }

  function renderChoices(choices) {
    clearChoices();
    for (const choice of choices) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = choice.label;
      button.disabled = Boolean(choice.disabled);
      button.addEventListener("click", () => {
        playTone(640, 0.05, "sine", 0.025);
        choice.action();
      });
      elements.choices.append(button);
    }
  }

  function setDialogue(who, text, { next = false, choices = [] } = {}) {
    setPortrait(who);
    typeLine(text);
    elements.next.hidden = !next;
    renderChoices(choices);
  }

  function highlightDialogue() {
    clearTimeout(dialogueGuideTimer);
    elements.dialoguePanel.classList.remove("guide-attention");
    void elements.dialoguePanel.offsetWidth;
    elements.dialoguePanel.classList.add("guide-attention");
    elements.dialoguePanel.focus({ preventScroll: true });
    dialogueGuideTimer = window.setTimeout(() => {
      elements.dialoguePanel.classList.remove("guide-attention");
    }, 3200);
  }

  function playDialogue(lines, callback) {
    dialogueQueue = [...lines];
    dialogueCallback = callback || null;
    showNextDialogue();
  }

  function showNextDialogue() {
    if (dialogueQueue.length === 0) {
      elements.next.hidden = true;
      const callback = dialogueCallback;
      dialogueCallback = null;
      if (callback) callback();
      return;
    }
    const line = dialogueQueue.shift();
    setDialogue(line.who, line.text, { next: true });
  }

  function nextDialogue() {
    if (finishTyping()) return;
    playTone(520, 0.045, "sine", 0.018);
    showNextDialogue();
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("visible");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2600);
  }

  function updateCounters() {
    elements.clueCount.textContent = String(state.clues.size);
    updateObjective();
  }

  function changeLocation(location) {
    state.location = location;
    elements.scene.classList.remove("scene-hall", "scene-studio", "scene-control");
    elements.scene.classList.add(`scene-${location}`);
    elements.sceneCaption.textContent = locationNames[location];
    $$('[data-location]', elements.locationNav).forEach((button) => {
      button.classList.toggle("active", button.dataset.location === location);
    });
    renderHotspots();
    saveGame();
  }

  function renderHotspots() {
    elements.hotspotLayer.replaceChildren();
    if (state.phase !== "investigation") return;
    Object.entries(clues).forEach(([id, clue]) => {
      if (clue.location !== state.location) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `hotspot${state.clues.has(id) ? " found" : ""}`;
      button.style.left = `${clue.position[0]}%`;
      button.style.top = `${clue.position[1]}%`;
      button.setAttribute("aria-label", state.clues.has(id) ? `Xem lại ${clue.name}` : `Kiểm tra điểm khả nghi: ${clue.name}`);
      button.addEventListener("click", () => inspectClue(id));
      elements.hotspotLayer.append(button);
    });
  }

  function coreClueCount() {
    return REQUIRED_CLUES.filter((id) => state.clues.has(id)).length;
  }

  function inspectClue(id) {
    const clue = clues[id];
    if (!clue) return;
    const isNew = !state.clues.has(id);
    state.clues.add(id);
    updateCounters();
    renderHotspots();
    if (isNew) {
      playTone(880, 0.12, "triangle", 0.038);
      window.setTimeout(() => playTone(1174, 0.16, "sine", 0.025), 90);
      showToast(`Đã thêm chứng cứ: ${clue.name}`);
      saveGame();
    }
    playDialogue(clue.lines, renderInvestigationPrompt);
  }

  function hintForInvestigation() {
    const missing = REQUIRED_CLUES.find((id) => !state.clues.has(id));
    if (!missing) {
      showToast("Đã đủ chứng cứ cốt lõi. Hãy bắt đầu hỏi cung.");
      return;
    }
    const clue = clues[missing];
    changeLocation(clue.location);
    showToast(`Gợi ý: kiểm tra ${clue.name} tại ${locationNames[clue.location].split(" • ")[0]}.`);
  }

  function renderInvestigationPrompt() {
    setPhase("investigation", "Điều tra hiện trường");
    elements.locationNav.hidden = false;
    renderHotspots();
    const core = coreClueCount();
    const choices = [
      { label: "Nhận gợi ý", action: hintForInvestigation },
    ];
    if (core >= REQUIRED_CLUES.length) {
      choices.unshift({ label: "Đã đủ chứng cứ — Hỏi cung", action: startInterrogation });
    }
    setDialogue(
      "conan",
      core >= REQUIRED_CLUES.length
        ? "Các mảnh ghép cốt lõi đã đủ. Bây giờ phải đặt lời khai của bốn nghi phạm cạnh những chứng cứ này."
        : `Hãy kiểm tra các điểm sáng ở ba khu vực. Chúng ta đã có ${core}/${REQUIRED_CLUES.length} chứng cứ cốt lõi.`,
      { choices },
    );
  }

  function startInterrogation() {
    setPhase("interrogation", "Hỏi cung nghi phạm");
    elements.locationNav.hidden = true;
    elements.hotspotLayer.replaceChildren();
    changeLocation("hall");
    renderInterrogationMenu();
  }

  function renderInterrogationMenu() {
    const allInterviewed = Object.keys(suspects).every((id) => state.interviews.has(id));
    const choices = Object.entries(suspects).map(([id, suspect]) => ({
      label: `${state.interviews.has(id) ? "✓ " : ""}${suspect.name}`,
      action: () => interviewSuspect(id),
    }));
    if (allInterviewed) {
      choices.unshift({ label: "Xâu chuỗi sự thật", action: startDeduction });
    }
    setDialogue(
      "conan",
      allInterviewed
        ? "Bốn lời khai đã hoàn tất. Hãy tự mở Sổ vụ án, đối chiếu toàn bộ chứng cứ rồi đưa ra kết luận của bạn."
        : "Mỗi nghi phạm đều có động cơ, nhưng chỉ một người có thể dựng nên tiếng đàn giả và sửa nhật ký khóa.",
      { choices },
    );
  }

  function interviewSuspect(id) {
    const suspect = suspects[id];
    state.interviews.add(id);
    updateObjective();
    saveGame();
    playDialogue(suspect.lines, renderInterrogationMenu);
  }

  function startDeduction({ resume = false } = {}) {
    if (!resume) deductionIndex = 0;
    setPhase("deduction", "Suy luận cuối cùng");
    elements.deductionFeedback.textContent = "Game không chỉ ra thủ phạm. Hãy tự đối chiếu những gì bạn đã thu thập.";
    if (!elements.deduction.open) elements.deduction.showModal();
    renderDeductionQuestion();
    playTone(220, 0.32, "sawtooth", 0.018);
  }

  function renderDeductionQuestion() {
    const item = deductionQuestions[deductionIndex];
    elements.deductionProgress.textContent = `${deductionIndex + 1} / ${deductionQuestions.length}`;
    elements.logicProgress.style.width = `${(deductionIndex / deductionQuestions.length) * 100}%`;
    elements.deductionQuestion.textContent = item.question;
    elements.deductionOptions.replaceChildren();
    elements.deductionFeedback.textContent = item.finalChoice
      ? "Đây là kết luận của bạn. Không có gợi ý đáp án đúng."
      : "Chọn kết luận phù hợp nhất với chứng cứ.";
    item.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => answerDeduction(index, button));
      elements.deductionOptions.append(button);
    });
  }

  function answerDeduction(answer, button) {
    const item = deductionQuestions[deductionIndex];
    const buttons = $$('button', elements.deductionOptions);
    if (answer !== item.correct) {
      state.mistakes += 1;
      button.classList.add("wrong");
      if (item.finalChoice) {
        window.setTimeout(() => button.classList.remove("wrong"), 650);
      } else {
        button.disabled = true;
      }
      elements.deductionFeedback.textContent = item.finalChoice
        ? "Kết luận này chưa khớp toàn bộ hồ sơ. Hãy tự mở Sổ vụ án, đối chiếu lại rồi thử lần nữa."
        : "Chưa hợp lý. Hãy đối chiếu lại sổ chứng cứ và thử một kết luận khác.";
      playTone(138, 0.16, "sawtooth", 0.025);
      saveGame();
      return;
    }
    buttons.forEach((option) => { option.disabled = true; });
    button.classList.add("correct");
    elements.deductionFeedback.textContent = item.feedback;
    elements.logicProgress.style.width = `${((deductionIndex + 1) / deductionQuestions.length) * 100}%`;
    playTone(720, 0.1, "triangle", 0.035);
    window.setTimeout(() => playTone(960, 0.14, "sine", 0.026), 100);
    window.setTimeout(() => {
      deductionIndex += 1;
      saveGame();
      if (deductionIndex >= deductionQuestions.length) finishDeduction();
      else renderDeductionQuestion();
    }, 1500);
  }

  function finishDeduction() {
    elements.deduction.close();
    state.rank = state.mistakes === 0 ? "S" : state.mistakes <= 2 ? "A" : "B";
    setPhase("reveal", "Vạch trần sự thật");
    playDialogue(reveal, showEnding);
  }

  function showEnding() {
    setPhase("ending", "Vụ án khép lại");
    const rankText = state.rank === "S"
      ? "Hạng S — Không mắc sai lầm"
      : state.rank === "A"
        ? "Hạng A — Suy luận sắc bén"
        : "Hạng B — Đã tìm ra sự thật";
    setDialogue("conan", `${rankText}. Vụ án Bản Nhạc Lúc 0 Giờ đã được giải quyết.`, {
      choices: [
        { label: "Chơi lại từ đầu", action: newGame },
        { label: "Về màn hình chính", action: returnToTitle },
      ],
    });
    saveGame();
  }

  function beginPrologue() {
    setPhase("prologue", "Mở đầu vụ án");
    elements.locationNav.hidden = true;
    changeLocation("hall");
    window.setTimeout(highlightDialogue, 120);
    playDialogue(prologue, () => {
      changeLocation("studio");
      renderInvestigationPrompt();
      highlightDialogue();
    });
  }

  function resetState() {
    state.phase = "title";
    state.location = "hall";
    state.clues = new Set();
    state.interviews = new Set();
    state.mistakes = 0;
    state.rank = null;
    updateCounters();
  }

  function newGame() {
    clearSave();
    resetState();
    showScreen("game");
    initAudio();
    beginPrologue();
  }

  function continueGame() {
    const saved = readSave();
    if (!saved) return newGame();
    applySave(saved);
    showScreen("game");
    initAudio();
    updateCounters();
    if (state.phase === "prologue") {
      beginPrologue();
    } else if (state.phase === "ending") {
      showEnding();
    } else if (state.phase === "deduction") {
      startDeduction({ resume: true });
    } else if (state.phase === "reveal") {
      finishDeduction();
    } else if (state.phase === "interrogation") {
      startInterrogation();
    } else {
      changeLocation(state.location || "studio");
      renderInvestigationPrompt();
    }
    window.setTimeout(() => {
      if (!elements.deduction.open) highlightDialogue();
    }, 120);
  }

  function returnToTitle() {
    finishTyping();
    clearTimeout(dialogueGuideTimer);
    elements.dialoguePanel.classList.remove("guide-attention");
    dialogueQueue = [];
    dialogueCallback = null;
    showScreen("title");
    state.phase = "title";
  }

  function renderNotebook(tab = "clues") {
    $$('.notebook-tabs button').forEach((button) => button.classList.toggle("active", button.dataset.tab === tab));
    if (tab === "clues") {
      const grid = document.createElement("div");
      grid.className = "evidence-grid";
      Object.entries(clues).forEach(([id, clue]) => {
        const found = state.clues.has(id);
        const card = document.createElement("article");
        card.className = `evidence-card${found ? "" : " locked"}`;
        card.dataset.icon = found ? clue.icon : "?";
        const name = document.createElement("strong");
        name.textContent = found ? clue.name : "Chưa phát hiện";
        const description = document.createElement("p");
        description.textContent = found ? clue.description : "Khám phá hiện trường để mở khóa chứng cứ này.";
        card.append(name, description);
        grid.append(card);
      });
      elements.notebookContent.replaceChildren(grid);
      return;
    }
    if (tab === "suspects") {
      const grid = document.createElement("div");
      grid.className = "suspect-grid";
      Object.entries(suspects).forEach(([id, suspect]) => {
        const card = document.createElement("article");
        card.className = "suspect-card";
        card.dataset.icon = state.interviews.has(id) ? "✓" : "!";
        const name = document.createElement("strong");
        name.textContent = `${suspect.name} — ${suspect.role}`;
        const description = document.createElement("p");
        description.textContent = state.interviews.has(id)
          ? `${suspect.testimony} Bí mật: ${suspect.secret}`
          : "Chưa hoàn tất lời khai.";
        card.append(name, description);
        grid.append(card);
      });
      elements.notebookContent.replaceChildren(grid);
      return;
    }
    const list = document.createElement("div");
    list.className = "timeline-list";
    const events = Object.entries(clues)
      .filter(([id, clue]) => state.clues.has(id) && clue.timeline)
      .map(([, clue]) => clue.timeline)
      .sort((a, b) => a[0].localeCompare(b[0]));
    if (events.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Chưa đủ dữ kiện để dựng dòng thời gian.";
      list.append(empty);
    } else {
      events.forEach(([time, text]) => {
        const item = document.createElement("article");
        item.className = "timeline-item";
        const timeNode = document.createElement("time");
        timeNode.textContent = time;
        const title = document.createElement("strong");
        title.textContent = text;
        const detail = document.createElement("p");
        detail.textContent = "Mốc được xác nhận từ chứng cứ hoặc lời khai đã kiểm tra.";
        item.append(timeNode, title, detail);
        list.append(item);
      });
    }
    elements.notebookContent.replaceChildren(list);
  }

  function openNotebook() {
    renderNotebook("clues");
    if (!elements.notebook.open) elements.notebook.showModal();
    playTone(420, 0.05, "triangle", 0.02);
  }

  function initAudio() {
    if (audioContext) {
      if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
      return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      audioContext = new AudioContextClass();
      audioMaster = audioContext.createGain();
      audioMaster.gain.value = state.sound ? 0.9 : 0;
      audioMaster.connect(audioContext.destination);

      const droneGain = audioContext.createGain();
      droneGain.gain.value = 0.018;
      droneGain.connect(audioMaster);
      [55, 82.5].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = index ? "triangle" : "sine";
        oscillator.frequency.value = frequency;
        oscillator.detune.value = index ? -7 : 0;
        oscillator.connect(droneGain);
        oscillator.start();
        ambientNodes.push(oscillator);
      });
    } catch {
      audioContext = null;
      audioMaster = null;
    }
  }

  function playTone(frequency, duration, type = "sine", volume = 0.02) {
    if (!state.sound) return;
    initAudio();
    if (!audioContext || !audioMaster) return;
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(audioMaster);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }

  function toggleSound() {
    state.sound = !state.sound;
    elements.sound.textContent = `ÂM: ${state.sound ? "BẬT" : "TẮT"}`;
    if (audioMaster && audioContext) {
      audioMaster.gain.cancelScheduledValues(audioContext.currentTime);
      audioMaster.gain.setTargetAtTime(state.sound ? 0.9 : 0, audioContext.currentTime, 0.04);
    }
  }

  function bindEvents() {
    elements.newGame.addEventListener("click", newGame);
    elements.continueGame.addEventListener("click", continueGame);
    elements.next.addEventListener("click", nextDialogue);
    elements.dialoguePanel.addEventListener("click", (event) => {
      if (event.target.closest("button") || elements.next.hidden) return;
      nextDialogue();
    });
    elements.dialoguePanel.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !elements.next.hidden) {
        event.preventDefault();
        nextDialogue();
      }
    });
    elements.sound.addEventListener("click", toggleSound);
    elements.notebookButton.addEventListener("click", openNotebook);
    $$('[data-location]', elements.locationNav).forEach((button) => {
      button.addEventListener("click", () => changeLocation(button.dataset.location));
    });
    $$('.notebook-tabs button').forEach((button) => {
      button.addEventListener("click", () => renderNotebook(button.dataset.tab));
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === " " && !elements.next.hidden && !elements.deduction.open && !elements.notebook.open) {
        event.preventDefault();
        nextDialogue();
      }
      if ((event.key === "n" || event.key === "N") && state.phase !== "title" && !elements.deduction.open) {
        openNotebook();
      }
    });
  }

  function boot() {
    bindEvents();
    const saved = readSave();
    elements.continueGame.hidden = !saved;
    showScreen("title");
  }

  boot();
})();
