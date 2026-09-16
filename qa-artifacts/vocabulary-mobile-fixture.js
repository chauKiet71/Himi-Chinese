(() => {
  const words = [
    { hanzi: "交接班", pinyin: "jiāojiēbān", meaning: "bàn giao ca", sourceTitle: "Nhà máy & sản xuất", example: "上班前先完成交接班。", translation: "Trước khi vào ca cần hoàn thành bàn giao ca." },
    { hanzi: "车间", pinyin: "chējiān", meaning: "xưởng sản xuất", sourceTitle: "Nhà máy & sản xuất", example: "进入车间要遵守安全规定。", translation: "Khi vào xưởng phải tuân thủ quy định an toàn." },
    { hanzi: "工作区域", pinyin: "gōngzuò qūyù", meaning: "khu vực làm việc", sourceTitle: "Nhà máy & sản xuất", example: "请检查自己的工作区域。", translation: "Hãy kiểm tra khu vực làm việc của mình." },
    { hanzi: "预约", pinyin: "yùyuē", meaning: "đặt lịch, lịch hẹn", sourceTitle: "Giao tiếp", example: "我想预约明天的会议。", translation: "Tôi muốn đặt lịch cho cuộc họp ngày mai." },
    { hanzi: "请问洗手间在哪里", pinyin: "qǐngwèn xǐshǒujiān zài nǎlǐ", meaning: "Xin hỏi nhà vệ sinh ở đâu?", sourceTitle: "Mẫu kiểm tra cụm từ dài", example: "请问洗手间在哪里？", translation: "Xin hỏi nhà vệ sinh ở đâu?" },
    { hanzi: "学习", pinyin: "xuéxí", meaning: "học tập", sourceTitle: "HSK 1", example: "", translation: "" },
  ];
  const escape = (text) => text.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const icon = (name) => `<svg xmlns="http://www.w3.org/2000/svg" width="${name === "volume" ? 19 : 17}" height="${name === "volume" ? 19 : 17}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${name === "volume" ? '<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>' : '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 10v8M14 10v8"/>'}</svg>`;
  const table = document.createElement("div");
  table.className = "vsets-saved-table";
  table.setAttribute("role", "table");
  table.setAttribute("aria-label", "Danh sách từ đã lưu — dữ liệu mẫu kiểm tra responsive");
  table.dataset.fixture = "true";
  table.innerHTML = `<div class="vsets-saved-table-head" role="row"><span role="columnheader">Từ</span><span role="columnheader">Đọc · Nghĩa</span><span role="columnheader">Ví dụ</span><span role="columnheader">Thao tác</span></div><ul>${words.map((word) => `<li role="row"><strong class="vsets-list-hanzi" lang="zh" role="cell">${escape(word.hanzi)}</strong><div class="vsets-list-reading" role="cell"><strong>${escape(word.pinyin)}</strong><span>${escape(word.meaning)}</span><small>${escape(word.sourceTitle)}</small></div><div class="vsets-list-example" role="cell">${word.example ? `<span lang="zh">${escape(word.example)}</span><small>${escape(word.translation)}</small>` : '<small>Ôn lại từ này trong lượt học tiếp theo.</small>'}</div><div class="vsets-list-actions" role="cell"><button class="vsets-pronounce" aria-label="Nghe phát âm ${escape(word.hanzi)}" type="button">${icon("volume")}</button><button class="vsets-unsave" aria-label="Bỏ lưu ${escape(word.hanzi)}" type="button">${icon("trash")}<span>Bỏ lưu</span></button></div></li>`).join("")}</ul>`;
  const empty = document.querySelector(".vsets-library-main .vsets-empty");
  if (!empty) throw new Error("Expected the guest vocabulary empty state for read-only layout verification.");
  empty.replaceWith(table);
  document.title = "Từ đã lưu — dữ liệu mẫu kiểm tra responsive";
  window.vocabularyLayoutMetrics = () => ({
    viewport: [innerWidth, innerHeight],
    overflow: document.documentElement.scrollWidth > innerWidth,
    overlay: !!document.querySelector("vite-error-overlay,[data-nextjs-dialog]"),
    rows: [...table.querySelectorAll("li")].map((row) => {
      const word = row.querySelector(".vsets-list-hanzi");
      const example = row.querySelector(".vsets-list-example");
      const actions = row.querySelector(".vsets-list-actions");
      return {
        hanzi: word.textContent,
        wordLines: Math.round(word.clientHeight / parseFloat(getComputedStyle(word).lineHeight)),
        exampleWidth: Math.round(example.getBoundingClientRect().width),
        rowWidth: Math.round(row.getBoundingClientRect().width),
        actionsDirection: getComputedStyle(actions).flexDirection,
        touchTargets: [...actions.querySelectorAll("button")].map((button) => [button.clientWidth, button.clientHeight]),
      };
    }),
  });
  return window.vocabularyLayoutMetrics();
})();
