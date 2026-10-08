import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import { appRouter, matchAppRoute } from "../node_modules/vinext/dist/routing/app-router.js";

test("VIP group links resolve to distinct pages with the matching policy forms", async (t) => {
  const root = process.cwd();
  const server = await createServer({
    configFile: false, appType: "custom", root,
    cacheDir: path.join(os.tmpdir(), "himi-vite-tests", "admin-access-navigation"),
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, watch: null },
    resolve: { alias: [{ find: "server-only", replacement: path.join(root, "tests/fixtures/server-only.ts") }, { find: "@", replacement: root }] },
    plugins: [{ name: "access-navigation-services", enforce: "pre",
      transform(code, id) {
        if (id.replaceAll("\\", "/").endsWith("/access/page.tsx")) return code.replace('"next/navigation"', '"virtual:access-navigation"');
      },
      resolveId(source, importer) {
        if (/admin-auth(?:\.ts)?$/.test(source)) return "\0access-test:auth";
        if (/content-access-repository(?:\.ts)?$/.test(source)) return "\0access-test:policies";
        if (source === "../../actions" && importer?.includes("/access/")) return "\0access-test:actions";
        if (source === "virtual:access-navigation") return "\0access-test:navigation";
      },
      load(id) {
        if (id === "\0access-test:auth") return "export async function requireAdminUser() { return { id: 'admin-test', displayName: 'Admin', role: 'admin' }; }";
        if (id === "\0access-test:policies") return "export async function getContentAccessPolicies() { return []; }";
        if (id === "\0access-test:actions") return "export async function updateContentAccessPolicyAction() {} export async function updateContentAccessPoliciesAction() {}";
        if (id === "\0access-test:navigation") return "export function redirect(url) { throw new Error('redirect:' + url); }";
      },
    }],
  });
  t.after(() => server.close());
  const routes = await appRouter(path.join(root, "app"));
  const renderRoute = async (url) => {
    const parsed = new URL(url, "https://admin.test");
    const { route } = matchAppRoute(parsed.pathname, routes);
    const module = await server.ssrLoadModule(route.pagePath);
    return renderToStaticMarkup(await module.default({ searchParams: Promise.resolve(Object.fromEntries(parsed.searchParams)) }));
  };
  const chooser = await renderRoute("/admin/access");
  assert.match(chooser, /href="\/admin\/access\/hsk"/);
  assert.match(chooser, /href="\/admin\/access\/typing"/);
  assert.doesNotMatch(chooser, /name="targetType"/);
  for (const [group, title, lesson] of [
    ["hsk", "Khóa VIP Lộ trình HSK", "hsk1-bai-01-chao-anh"],
    ["typing", "Khóa VIP Luyện gõ", "hsk1-l1"],
  ]) {
    for (const query of ["", "?level=hsk-1", `?level=hsk-1&lesson=${lesson}`]) {
      const markup = await renderRoute(`/admin/access/${group}${query}`);
      assert.match(markup, new RegExp(title));
      assert.match(markup, new RegExp(`aria-current="page" href="/admin/access/${group}"`));
      const types = [...markup.matchAll(/name="targetType"[^>]*value="([^"]+)"/g)].map((match) => match[1]);
      assert.ok(types.length > 0);
      assert.ok(types.every((type) => type.startsWith(`${group}_`)), `${group} page must only edit its own group`);
      assert.match(markup, new RegExp(`name="returnTo"[^>]*value="/admin/access/${group}`));
      if (query.includes("lesson=")) {
        assert.ok(types.includes(`${group}_question`));
        assert.match(markup, /admin-access-bulk-toolbar/);
        assert.match(markup, /Lưu tất cả trạng thái đang chọn/);
        assert.match(markup, /<fieldset[^>]*class="admin-access-bulk-fields"/);
      } else assert.doesNotMatch(markup, /admin-access-bulk-toolbar/);
    }
  }
  await assert.rejects(renderRoute("/admin/access?level=hsk-1&lesson=hsk1-bai-01-chao-anh&success=content_access_updated"), /redirect:\/admin\/access\/hsk\?level=hsk-1&lesson=hsk1-bai-01-chao-anh&success=content_access_updated/);
});
