export type MobilePageHeaderModel = {
  backHref: string | null;
  title: string;
};

function hskLevelLabel(value: string | undefined): string {
  const level = value?.match(/\d+/u)?.[0];
  return level ? `HSK ${level}` : "HSK";
}

export function getMobilePageHeader(pathname: string, courseView?: string | null): MobilePageHeaderModel {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/u, "") : pathname;
  const [section, first, second, third] = normalizedPath.split("/").filter(Boolean);

  if (normalizedPath === "/") return { backHref: null, title: "Học tập" };

  if (section === "courses") {
    if (first) return { backHref: "/courses", title: "Chi tiết lộ trình" };
    if (courseView === "hsk") return { backHref: "/courses", title: "Lộ trình HSK" };
    return { backHref: "/", title: "Lộ trình" };
  }

  if (section === "learn") return { backHref: "/courses", title: "Bài học" };

  if (section === "hsk") {
    const lessonHref = first && second ? `/hsk/${encodeURIComponent(first)}/${encodeURIComponent(second)}` : "/courses?view=hsk";
    if (third === "play") return { backHref: lessonHref, title: "Học theo hướng dẫn" };
    if (third === "quiz") return { backHref: lessonHref, title: "Kiểm tra" };
    if (third === "flashcard") return { backHref: lessonHref, title: "Thẻ ghi nhớ" };
    return { backHref: "/courses?view=hsk", title: `${hskLevelLabel(first)} · Bài học` };
  }

  if (section === "typing") {
    if (!first) return { backHref: "/", title: "Luyện gõ" };
    const levelHref = `/typing/${encodeURIComponent(first)}`;
    if (!second) return { backHref: "/typing", title: "Chọn bài luyện gõ" };
    if (!third) return { backHref: levelHref, title: "Chọn phần luyện" };
    return { backHref: `/typing/${encodeURIComponent(first)}/${encodeURIComponent(second)}`, title: "Luyện gõ" };
  }

  if (section === "writing") {
    if (!first) return { backHref: "/", title: "Luyện viết" };
    const levelHref = `/writing/${encodeURIComponent(first)}`;
    if (!second) return { backHref: "/writing", title: "Chọn bài luyện viết" };
    return { backHref: levelHref, title: "Luyện viết" };
  }

  if (section === "listening") return { backHref: "/", title: "Luyện nghe" };
  if (section === "videos") return first
    ? { backHref: "/videos", title: "Bài học video" }
    : { backHref: "/", title: "Video" };
  if (section === "games") return { backHref: first ? "/games" : "/", title: "Trò chơi" };

  if (section === "vocabulary") {
    if (!first) return { backHref: "/", title: "Bộ từ vựng" };
    const setHref = `/vocabulary/${encodeURIComponent(first)}`;
    if (second === "study") return { backHref: setHref, title: "Học bộ từ" };
    return { backHref: "/vocabulary", title: "Chi tiết bộ từ" };
  }

  if (section === "account") return { backHref: "/", title: "Hồ sơ" };
  if (section === "notifications") return { backHref: "/", title: "Thông báo" };
  if (section === "vip") return { backHref: "/", title: "Thành viên VIP" };

  return { backHref: "/", title: "Himi Chinese" };
}
