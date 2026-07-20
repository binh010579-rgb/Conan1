import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { JSDOM, VirtualConsole } from "jsdom";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GAME_DIR = path.resolve(HERE, "..");
const SAVE_KEY = "zero-hour-case-save-v2";
const html = (await readFile(path.join(GAME_DIR, "index.html"), "utf8"))
  .replace(/<link[^>]+styles\.css[^>]*>/, "")
  .replace(/<script[^>]+game\.js[^>]*><\/script>/, "");
const gameScript = await readFile(path.join(GAME_DIR, "game.js"), "utf8");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(check, label, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const value = check();
    if (value) return value;
    await sleep(5);
  }
  throw new Error(`Timeout khi chờ: ${label}`);
}

function createGame(saved = null) {
  const browserErrors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => browserErrors.push(error));
  virtualConsole.on("error", (error) => browserErrors.push(error));

  const dom = new JSDOM(html, {
    url: "https://playtest.local/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole,
  });
  const { window } = dom;
  const { document } = window;

  window.matchMedia = () => ({
    matches: true,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  });

  class AudioContextStub {
    constructor() {
      this.currentTime = 0;
      this.state = "running";
      this.destination = {};
    }
    createGain() {
      const node = {
        gain: {
          value: 0,
          setValueAtTime() {},
          exponentialRampToValueAtTime() {},
          setTargetAtTime() {},
        },
        connect() { return node; },
      };
      return node;
    }
    createOscillator() {
      const node = {
        type: "sine",
        frequency: { setValueAtTime() {} },
        connect() { return node; },
        start() {},
        stop() {},
      };
      return node;
    }
    resume() { this.state = "running"; }
  }
  window.AudioContext = AudioContextStub;
  window.webkitAudioContext = AudioContextStub;

  Object.defineProperty(window.HTMLDialogElement.prototype, "open", {
    configurable: true,
    get() { return this.hasAttribute("open"); },
    set(value) { value ? this.setAttribute("open", "") : this.removeAttribute("open"); },
  });
  window.HTMLDialogElement.prototype.showModal = function showModal() { this.open = true; };
  window.HTMLDialogElement.prototype.close = function close() { this.open = false; };

  if (saved) window.localStorage.setItem(SAVE_KEY, saved);
  window.eval(gameScript);
  return { dom, window, document, browserErrors };
}

function buttonByText(document, root, text) {
  return [...root.querySelectorAll("button")].find((button) => button.textContent.replace(/\s+/g, " ").trim().includes(text));
}

async function clickChoice(document, text) {
  const button = await waitFor(
    () => buttonByText(document, document.querySelector("#choice-list"), text),
    `lựa chọn “${text}”`,
  );
  assert.equal(button.disabled, false, `Lựa chọn “${text}” không được bị khóa`);
  button.click();
}

async function completeInterview(document, suspectName, pinFragments) {
  await clickChoice(document, suspectName);
  const deadline = Date.now() + 6000;
  const pinned = new Set();

  while (Date.now() < deadline) {
    const dialogue = document.querySelector("#dialogue-text").textContent;
    const pinButton = document.querySelector("#pin-statement");
    for (const fragment of pinFragments) {
      if (!pinned.has(fragment) && dialogue.includes(fragment) && !pinButton.hidden && !pinButton.disabled) {
        pinButton.click();
        pinned.add(fragment);
      }
    }

    const next = document.querySelector("#next-button");
    if (!next.hidden) next.click();

    const menuButton = buttonByText(document, document.querySelector("#choice-list"), suspectName);
    if (menuButton?.textContent.trim().startsWith("✓")) {
      assert.equal(pinned.size, pinFragments.length, `${suspectName} phải có đủ lời khai ghim`);
      return;
    }
    await sleep(5);
  }
  throw new Error(`Không hoàn tất được lời khai của ${suspectName}`);
}

async function openEvidence(document, id) {
  const hotspot = await waitFor(
    () => document.querySelector(`[data-evidence="${id}"]`),
    `vật thể ${id}`,
  );
  hotspot.click();
  await waitFor(() => document.querySelector("#inspection").open, `hộp khám nghiệm ${id}`);
}

async function clickInspectionAction(document, text) {
  const button = await waitFor(
    () => buttonByText(document, document.querySelector("#inspection-actions"), text),
    `thao tác khám nghiệm “${text}”`,
  );
  button.click();
  await sleep(5);
}

const evidencePlan = {
  watch: {
    mini: async (document, window) => {
      const surface = await waitFor(() => document.querySelector("[data-wipe-surface]"), "mặt đồng hồ");
      for (let index = 0; index < 5; index += 1) {
        surface.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      }
    },
    deduction: "Nạn nhân chết trước khi bản nhạc",
  },
  piano: {
    mini: async (document) => {
      const targets = await waitFor(() => {
        const items = [...document.querySelectorAll("[data-uv-target]")];
        return items.length === 3 ? items : null;
      }, "ba vùng UV");
      targets.forEach((target) => target.click());
    },
    deduction: "không do người trực tiếp biểu diễn",
  },
  metronome: {
    mini: async (document) => {
      (await waitFor(() => document.querySelector('[data-piece="brass"]'), "quả đồng")).click();
      document.querySelector("[data-fit-slot]").click();
    },
    deduction: "Hình dạng khớp vết lõm",
  },
  door: {
    actions: ["Thử chốt cửa", "Soi ray dưới"],
    deduction: "Cửa tự chốt ba giây",
  },
  coffee: { actions: ["Đo nhiệt độ", "Soi thành cốc"] },
  midi: {
    mini: async (document, window) => {
      await clickInspectionAction(document, "Mở bàn pháp y âm thanh");
      await waitFor(() => document.querySelector("#audio-lab").open, "bàn pháp y âm thanh");
      const align = document.querySelector("#audio-align");
      align.value = "58";
      align.dispatchEvent(new window.Event("input", { bubbles: true }));
      document.querySelector("#lock-audio").click();
      await waitFor(() => document.querySelector("#inspection").open, "quay lại khám nghiệm MIDI", 3000);
    },
  },
  access: {
    mini: async (document) => {
      for (const id of ["head", "code", "crc", "delete"]) {
        (await waitFor(() => document.querySelector(`[data-log-id="${id}"]`), `mảnh log ${id}`)).click();
      }
      document.querySelector("[data-log-check]").click();
    },
    deduction: "Một bản sao S-04 mở cửa",
  },
  amplifier: { actions: ["Đo nhiệt dư", "Đọc tải cuối"] },
  toolcase: { actions: ["Soi dây niêm phong", "Nhìn qua khe thẻ"] },
  umbrella: { actions: ["Chạm mặt vải", "Xem thẻ tên"] },
};

async function collectEvidence(document, window, id) {
  const plan = evidencePlan[id];
  await openEvidence(document, id);
  if (plan.mini) await plan.mini(document, window);
  for (const action of plan.actions || []) await clickInspectionAction(document, action);
  if (plan.deduction) await clickInspectionAction(document, plan.deduction);
  const record = await waitFor(
    () => {
      const button = document.querySelector("#record-evidence");
      return button && !button.disabled ? button : null;
    },
    `nút ghi vật chứng ${id}`,
  );
  record.click();
  await waitFor(() => !document.querySelector("#inspection").open, `đóng khám nghiệm ${id}`, 2500);
}

async function changeLocation(document, id) {
  const button = document.querySelector(`#location-nav [data-location="${id}"]`);
  assert(button, `Thiếu nút địa điểm ${id}`);
  button.click();
  await waitFor(() => document.querySelector("#scene").classList.contains(`scene-${id}`), `đổi sang ${id}`);
}

async function lockLink(document, statementText, evidenceText) {
  const statement = await waitFor(
    () => buttonByText(document, document.querySelector("#statement-deck"), statementText),
    `lời khai “${statementText}”`,
  );
  statement.click();
  const evidenceButton = await waitFor(
    () => buttonByText(document, document.querySelector("#evidence-deck"), evidenceText),
    `vật chứng “${evidenceText}”`,
  );
  evidenceButton.click();
  const test = document.querySelector("#test-link");
  assert.equal(test.disabled, false, "Nút đối chiếu phải khả dụng");
  test.click();
  await sleep(720);
}

async function runPerfectPlaythrough() {
  const game = createGame();
  const { dom, window, document, browserErrors } = game;

  document.querySelector("#new-game-button").click();
  document.querySelector("#sound-button").click();
  await waitFor(() => buttonByText(document, document.querySelector("#choice-list"), "Aoyama Rina"), "menu lời khai", 5000);

  await completeInterview(document, "Aoyama Rina", ["hoàn hảo đến vô hồn"]);
  await completeInterview(document, "Kisaragi Misaki", ["Yuto cầm thẻ S-04"]);
  await completeInterview(document, "Nishino Haru", ["Yuto bước khỏi phòng điều khiển"]);
  await completeInterview(document, "Senda Yuto", ["không vào Phòng thu A", "Đã tắt hoàn toàn"]);

  await clickChoice(document, "Đến hiện trường");
  await waitFor(() => document.querySelector('[data-evidence="watch"]'), "hiện trường studio");

  for (const id of ["watch", "piano", "metronome", "door", "coffee"]) {
    await collectEvidence(document, window, id);
  }
  await changeLocation(document, "control");
  for (const id of ["midi", "access", "amplifier", "toolcase"]) {
    await collectEvidence(document, window, id);
  }
  await changeLocation(document, "hall");
  await collectEvidence(document, window, "umbrella");

  await clickChoice(document, "Mở bảng đối chiếu");
  await waitFor(() => document.querySelector("#link-board").open, "bảng đối chiếu");
  await lockLink(document, "Tiếng đàn từ 23:50", "Đồng hồ thông minh");
  await lockLink(document, "quá hoàn hảo", "Lệnh phát MIDI");
  await lockLink(document, "Hệ thống âm thanh đã tắt", "Bộ khuếch đại");
  await lockLink(document, "không vào Phòng thu A", "Hộp dụng cụ niêm phong");
  await lockLink(document, "tệp hẹn giờ chạy lúc 23:50", "Lệnh phát MIDI");
  await lockLink(document, "Khoảng 23:25", "Chiếc ô ướt");
  document.querySelector("#link-close").click();
  await waitFor(() => !document.querySelector("#link-board").open, "đóng bảng đối chiếu");

  await clickChoice(document, "Dựng dòng thời gian");
  await waitFor(() => document.querySelector("#timeline-lab").open, "bàn dòng thời gian");
  for (const id of ["seal", "card", "death", "yuto", "midi"]) {
    (await waitFor(() => document.querySelector(`[data-timeline-event="${id}"]`), `thẻ thời gian ${id}`)).click();
    document.querySelector(`[data-timeline-slot="${id}"]`).click();
  }
  const checkTimeline = document.querySelector("#check-timeline");
  assert.equal(checkTimeline.disabled, false, "Dòng thời gian đã đủ năm mốc");
  checkTimeline.click();
  await waitFor(() => !document.querySelector("#timeline-lab").open, "khóa dòng thời gian", 2500);

  await clickChoice(document, "Dựng lại vụ án");
  await waitFor(() => document.querySelector("#reconstruction").open, "bàn dựng lại vụ án");
  const finalAnswers = [
    ["Đồng hồ thông minh", "Thời điểm tử vong"],
    ["Lệnh phát MIDI", "Thủ thuật tiếng đàn"],
    ["Cửa kính phòng thu", "Căn phòng khóa kín"],
    ["Máy đếm nhịp", "Hung khí"],
    ["Kisaragi Misaki", "Thủ phạm và động cơ"],
  ];
  for (const [card, slot] of finalAnswers) {
    (await waitFor(() => buttonByText(document, document.querySelector("#final-deck"), card), `thẻ kết luận ${card}`)).click();
    (await waitFor(() => buttonByText(document, document.querySelector("#final-slots"), slot), `ô kết luận ${slot}`)).click();
  }
  const submit = document.querySelector("#submit-reconstruction");
  assert.equal(submit.disabled, false, "Đủ năm mắt xích để đối chất");
  submit.click();

  await waitFor(
    () => {
      const saved = JSON.parse(window.localStorage.getItem(SAVE_KEY) || "null");
      return saved?.phase === "ending" ? saved : null;
    },
    "kết thúc hạng S+",
    10000,
  );
  const saved = JSON.parse(window.localStorage.getItem(SAVE_KEY));
  assert.equal(saved.rank, "S+");
  assert.equal(saved.mistakes, 0);
  assert.equal(saved.evidence.length, 10);
  assert.equal(saved.links.length, 6);
  assert.equal(saved.deductions.length, 5);
  assert.equal(saved.timelineSolved, true);
  assert.equal(document.querySelector("#focus-label").textContent, "TẬP TRUNG 100");
  await waitFor(() => /HỒ SƠ HOÀN HẢO/.test(document.querySelector("#dialogue-text").textContent), "dòng kết thúc S+", 3000);
  assert.match(document.querySelector("#dialogue-text").textContent, /HỒ SƠ HOÀN HẢO/);
  assert.deepEqual(browserErrors, [], `Không được có lỗi trình duyệt: ${browserErrors.map(String).join("\n")}`);

  const serialized = window.localStorage.getItem(SAVE_KEY);
  dom.window.close();
  return serialized;
}

async function verifyContinue(serialized) {
  const game = createGame(serialized);
  const { dom, document, browserErrors } = game;
  const continueButton = document.querySelector("#continue-button");
  assert.equal(continueButton.hidden, false, "Nút tiếp tục phải hiện khi có save");
  continueButton.click();
  await waitFor(() => /HỒ SƠ HOÀN HẢO/.test(document.querySelector("#dialogue-text").textContent), "khôi phục ending S+", 3000);
  assert.equal(document.querySelector("#focus-label").textContent, "TẬP TRUNG 100");
  assert.deepEqual(browserErrors, [], `Không được có lỗi khi tải save: ${browserErrors.map(String).join("\n")}`);
  dom.window.close();
}

async function verifyPenaltyHintAndStrictRank(serialized) {
  const investigationSave = JSON.parse(serialized);
  investigationSave.phase = "investigation";
  investigationSave.location = "studio";
  investigationSave.evidence = investigationSave.evidence.filter((id) => id !== "watch");
  investigationSave.deductions = investigationSave.deductions.filter((id) => id !== "watch");
  investigationSave.deductionFailures = { ...investigationSave.deductionFailures, watch: 1 };
  investigationSave.mistakes = 0;
  investigationSave.rank = null;

  const hintGame = createGame(JSON.stringify(investigationSave));
  hintGame.document.querySelector("#continue-button").click();
  await openEvidence(hintGame.document, "watch");
  await clickInspectionAction(hintGame.document, "Đồng hồ đã bị hung thủ chỉnh lùi giờ");
  assert.match(hintGame.document.querySelector(".deduction-feedback").textContent, /Gợi ý:/);
  assert.equal(hintGame.document.querySelector("#focus-label").textContent, "TẬP TRUNG 94");
  const hintSave = JSON.parse(hintGame.window.localStorage.getItem(SAVE_KEY));
  assert.equal(hintSave.deductionFailures.watch, 2);
  assert.equal(hintSave.mistakes, 1);
  assert.deepEqual(hintGame.browserErrors, [], `Không được có lỗi ở nhánh gợi ý: ${hintGame.browserErrors.map(String).join("\n")}`);
  hintGame.dom.window.close();

  const oneMistakeSave = JSON.parse(serialized);
  oneMistakeSave.mistakes = 1;
  oneMistakeSave.rank = null;
  const rankGame = createGame(JSON.stringify(oneMistakeSave));
  rankGame.document.querySelector("#continue-button").click();
  await waitFor(() => /hạng S, 94\/100/.test(rankGame.document.querySelector("#dialogue-text").textContent), "hạng S sau một lỗi", 3000);
  const rankedSave = JSON.parse(rankGame.window.localStorage.getItem(SAVE_KEY));
  assert.equal(rankedSave.rank, "S", "Một lỗi không được nhận hạng S+");
  assert.equal(rankGame.document.querySelector("#focus-label").textContent, "TẬP TRUNG 94");
  assert.deepEqual(rankGame.browserErrors, [], `Không được có lỗi ở nhánh xếp hạng: ${rankGame.browserErrors.map(String).join("\n")}`);
  rankGame.dom.window.close();
}

const serialized = await runPerfectPlaythrough();
await verifyContinue(serialized);
await verifyPenaltyHintAndStrictRank(serialized);
console.log("PASS: full UI playthrough, strict S+, penalty hint, save/continue, 0 browser errors");
