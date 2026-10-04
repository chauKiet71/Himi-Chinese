import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("writing catalog starts directly with the HSK level list", async (t) => {
  const server = await createServer({
    appType: "custom",
    configFile: false,
    resolve: { alias: { "@": process.cwd() } },
    root: process.cwd(),
    server: { middlewareMode: true },
  });
  t.after(() => server.close());

  const { default: WritingPage } = await server.ssrLoadModule("/app/writing/page.tsx");
  const html = renderToStaticMarkup(React.createElement(WritingPage));

  assert.match(html, /id="writing-topic-heading">Bài luyện viết theo HSK/);
  assert.doesNotMatch(html, /himi-section-banner/);
  assert.doesNotMatch(html, /Chọn bài đã học/);
});
