import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("listening hub presents the audio catalog without the mode switcher", async (t) => {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    resolve: { alias: { "@": process.cwd() } },
    root: process.cwd(),
    server: { middlewareMode: true },
  });
  t.after(() => server.close());

  const { default: ListeningPage } = await server.ssrLoadModule("/app/listening/page.tsx");
  const page = await ListeningPage({ searchParams: Promise.resolve({}) });
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null, page));

  assert.doesNotMatch(html, /aria-label="Chế độ luyện nghe"/);
  assert.doesNotMatch(html, /listening-mode-shell/);
  assert.match(html, /Đang tải kho bài nghe…/);
  assert.match(html, /Nghe để nói/);
  assert.match(html, /listening-redesign-hero/);
});

test("listening hub maps HSK curriculum links to a matching catalog group", async (t) => {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    resolve: { alias: { "@": process.cwd() } },
    root: process.cwd(),
    server: { middlewareMode: true },
  });
  t.after(() => server.close());

  const { default: ListeningPage } = await server.ssrLoadModule("/app/listening/page.tsx");
  const page = await ListeningPage({ searchParams: Promise.resolve({ level: "hsk-4" }) });
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null, page));

  assert.match(html, /data-initial-group="intermediate"/);
});
