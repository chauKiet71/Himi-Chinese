import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getMobilePageHeader } from "../lib/mobile-page-header.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("mobile page headers describe the current learner page and its parent", () => {
  assert.deepEqual(getMobilePageHeader("/"), { backHref: null, title: "Học tập" });
  assert.deepEqual(getMobilePageHeader("/typing/hsk-1"), { backHref: "/typing", title: "Chọn bài luyện gõ" });
  assert.deepEqual(getMobilePageHeader("/typing/hsk-1/hsk1-l1"), { backHref: "/typing/hsk-1", title: "Chọn phần luyện" });
  assert.deepEqual(getMobilePageHeader("/writing/hsk-2"), { backHref: "/writing", title: "Chọn bài luyện viết" });
  assert.deepEqual(getMobilePageHeader("/courses", "hsk"), { backHref: "/courses", title: "Lộ trình HSK" });
  assert.deepEqual(getMobilePageHeader("/courses/van-phong-hanh-chinh"), { backHref: "/courses", title: "Chi tiết lộ trình" });
  assert.deepEqual(getMobilePageHeader("/videos/hello"), { backHref: "/videos", title: "Bài học video" });
  assert.deepEqual(getMobilePageHeader("/account"), { backHref: "/", title: "Hồ sơ" });
});

test("learner shell renders one shared mobile header with back and notification controls", async () => {
  const [shell, styles, account, homeStyles] = await Promise.all([
    read("components/learner-app-shell.tsx"),
    read("app/learner-navigation.css"),
    read("app/account/page.tsx"),
    read("app/home-portal.css"),
  ]);

  assert.match(shell, /getMobilePageHeader\(pathname, searchParams\.get\("view"\)\)/);
  assert.match(shell, /const hideMobileHeader = pathname\.startsWith\("\/learn\/"\)/);
  assert.match(shell, /\{hideMobileHeader \? null : <header className=\{`learner-mobile-header/);
  assert.match(shell, /className=\{`learner-mobile-header \$\{pathname === "\/" \? "is-home" : ""\}`\.trim\(\)\}/);
  assert.match(shell, /className="learner-mobile-header-brand"[\s\S]*?<BrandMark priority variant="face" \/>/);
  assert.match(shell, /learner-mobile-header-back/);
  assert.match(shell, /learner-mobile-header-notifications/);
  assert.match(shell, /<strong aria-current="page">\{mobilePageHeader\.title\}<\/strong>/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*?\.learner-mobile-header\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?grid-template-columns:\s*48px minmax\(0, 1fr\) 48px;/);
  assert.match(styles, /\.learner-mobile-header\.is-home\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) 44px;[^}]*background:\s*rgba\(255, 255, 255, \.97\);/s);
  assert.match(styles, /\.learner-mobile-header-brand \.brand-mark\s*\{[^}]*width:\s*28px;[^}]*height:\s*28px;/s);
  assert.match(styles, /\.learner-mobile-header\.is-home \.learner-mobile-header-notifications\s*\{[^}]*width:\s*36px;[^}]*height:\s*36px;[^}]*border-radius:\s*50%;[^}]*background:\s*#fff3ef;/s);
  assert.match(styles, /\.client-breadcrumb-bar,[\s\S]*?\.typing-level-back,[\s\S]*?\.writing-level-back[\s\S]*?display:\s*none;/);
  assert.doesNotMatch(account, /account-mobile-header/);
  assert.doesNotMatch(homeStyles, /\.learner-app-shell\.is-home-route \.learn-topbar\s*\{[\s\S]*?display:\s*flex\s*!important/);
});
