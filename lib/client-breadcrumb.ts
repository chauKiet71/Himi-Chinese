export type ClientBreadcrumbModel = {
  currentLabel: string;
  parentHref: string;
  parentLabel: string;
};

const staticRoutes: Record<string, ClientBreadcrumbModel> = {
  "/account": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Tài khoản" },
  "/games": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Trò chơi" },
  "/forgot-password": { parentHref: "/login", parentLabel: "Đăng nhập", currentLabel: "Quên mật khẩu" },
  "/listening": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Luyện nghe" },
  "/login": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Đăng nhập" },
  "/notifications": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Thông báo" },
  "/practice": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Luyện tập" },
  "/privacy": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Chính sách bảo mật" },
  "/register": { parentHref: "/login", parentLabel: "Đăng nhập", currentLabel: "Đăng ký" },
  "/reset-password": { parentHref: "/login", parentLabel: "Đăng nhập", currentLabel: "Đặt lại mật khẩu" },
  "/terms": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Điều khoản sử dụng" },
  "/typing": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Luyện gõ" },
  "/videos": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Video" },
  "/vip": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Himi Chinese VIP" },
  "/vocabulary": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Bộ từ vựng" },
  "/verify-email": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Xác minh email" },
  "/writing": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Luyện viết" },
};

function levelLabel(value: string): string {
  const level = value.match(/\d+/u)?.[0];
  return level ? `HSK ${level}` : "Cấp độ HSK";
}

function studyModeLabel(value: string): string {
  if (value === "flashcard") return "Học flashcard";
  if (value === "listening") return "Luyện nghe";
  if (value === "writing") return "Luyện viết";
  return "Học bộ từ";
}

function writingLessonLabel(value: string): string {
  const sourceLabel = /(?:workbook|sach[-_]bai[-_]tap)/iu.test(value) ? "Sách bài tập" : "Giáo trình";
  const lessonNumber = value.match(/(?:bai|lesson)[-_]?(\d+)/iu)?.[1];
  if (!lessonNumber) return sourceLabel;
  return `${sourceLabel} - Bài ${String(Number(lessonNumber)).padStart(2, "0")}`;
}

export function getClientBreadcrumb(pathname: string, courseView?: string | null): ClientBreadcrumbModel | null {
  if (pathname === "/" || pathname.startsWith("/dev/")) return null;

  if (pathname === "/courses") {
    return courseView === "hsk"
      ? { parentHref: "/", parentLabel: "Học tập", currentLabel: "Các cấp độ HSK" }
      : { parentHref: "/", parentLabel: "Học tập", currentLabel: "Lộ trình" };
  }

  const segments = pathname.split("/").filter(Boolean);
  const [section, first, second, third] = segments;

  if (section === "courses" && first) {
    return { parentHref: "/courses", parentLabel: "Lộ trình", currentLabel: "Chi tiết lộ trình" };
  }

  if (section === "learn" && first) {
    return { parentHref: "/courses", parentLabel: "Lộ trình", currentLabel: "Bài học" };
  }

  if (section === "hsk" && first && second) {
    const lessonHref = `/hsk/${encodeURIComponent(first)}/${encodeURIComponent(second)}`;
    if (third === "play") return { parentHref: lessonHref, parentLabel: "Bài học", currentLabel: "Học theo hướng dẫn" };
    if (third === "quiz") return { parentHref: lessonHref, parentLabel: "Bài học", currentLabel: "Kiểm tra" };
    if (third === "flashcard") return { parentHref: lessonHref, parentLabel: "Bài học", currentLabel: "Thẻ ghi nhớ" };
    return { parentHref: "/courses?view=hsk", parentLabel: "Các cấp độ", currentLabel: `${levelLabel(first)} · Bài học` };
  }

  if ((section === "writing" || section === "typing") && first) {
    const sectionLabel = section === "writing" ? "Luyện viết" : "Luyện gõ";
    const levelHref = `/${section}/${encodeURIComponent(first)}`;
    if (second && third === "practice") {
      return {
        parentHref: levelHref,
        parentLabel: levelLabel(first),
        currentLabel: section === "writing" ? writingLessonLabel(second) : sectionLabel,
      };
    }
    if (second === "practice") {
      return { parentHref: levelHref, parentLabel: levelLabel(first), currentLabel: sectionLabel };
    }
    if (second) {
      return { parentHref: levelHref, parentLabel: levelLabel(first), currentLabel: "Bài học" };
    }
    return { parentHref: `/${section}`, parentLabel: "Các cấp độ", currentLabel: levelLabel(first) };
  }

  if (section === "videos" && first) {
    return { parentHref: "/videos", parentLabel: "Thư viện video", currentLabel: "Bài học" };
  }

  if (section === "vocabulary" && first) {
    const setHref = `/vocabulary/${encodeURIComponent(first)}`;
    if (second === "study") {
      return { parentHref: setHref, parentLabel: "Bộ từ vựng", currentLabel: studyModeLabel(third ?? "") };
    }
    return { parentHref: "/vocabulary", parentLabel: "Bộ từ vựng", currentLabel: "Chi tiết bộ từ" };
  }

  return staticRoutes[pathname] ?? { parentHref: "/", parentLabel: "Học tập", currentLabel: "Nội dung" };
}
