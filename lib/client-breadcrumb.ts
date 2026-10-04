export type ClientBreadcrumbModel = {
  currentLabel: string;
  parentHref: string;
  parentLabel: string;
};

const staticRoutes: Record<string, ClientBreadcrumbModel> = {
  "/account": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Tài khoản" },
  "/forgot-password": { parentHref: "/login", parentLabel: "Đăng nhập", currentLabel: "Quên mật khẩu" },
  "/listening": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Luyện nghe" },
  "/notifications": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Thông báo" },
  "/privacy": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Chính sách bảo mật" },
  "/register": { parentHref: "/login", parentLabel: "Đăng nhập", currentLabel: "Đăng ký" },
  "/reset-password": { parentHref: "/login", parentLabel: "Đăng nhập", currentLabel: "Đặt lại mật khẩu" },
  "/terms": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Điều khoản sử dụng" },
  "/videos": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Video" },
  "/verify-email": { parentHref: "/", parentLabel: "Học tập", currentLabel: "Xác minh email" },
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

export function getClientBreadcrumb(pathname: string): ClientBreadcrumbModel | null {
  if (pathname === "/" || pathname.startsWith("/courses") || pathname === "/forgot-password" || pathname === "/games" || pathname === "/login" || pathname === "/register" || pathname === "/typing" || pathname === "/vip" || pathname === "/vocabulary" || pathname === "/writing" || pathname.startsWith("/dev/")) return null;

  const segments = pathname.split("/").filter(Boolean);
  const [section, first, second, third] = segments;

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
    if (section === "typing" && !third) return null;
    if (section === "writing" && !second) return null;
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
