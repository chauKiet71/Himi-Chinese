import { writeFile } from "node:fs/promises";

const [, , debuggingPort, url, widthValue, heightValue, outputPath, motionPreference = "reduce"] = process.argv;
const width = Number(widthValue);
const height = Number(heightValue);

if (!debuggingPort || !url || !width || !height || !outputPath) {
  throw new Error("Usage: capture-auth.mjs <port> <url> <width> <height> <output>");
}

const target = await fetch(
  `http://127.0.0.1:${debuggingPort}/json/new?${encodeURIComponent(url)}`,
  { method: "PUT" },
).then((response) => response.json());

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const runtimeErrors = [];
const consoleErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") runtimeErrors.push(message.params.exceptionDetails.text);
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") consoleErrors.push(message.params.entry.text);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Page.bringToFront");
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: width <= 720,
  screenWidth: width,
  screenHeight: height,
  positionX: 0,
  positionY: 0,
});
await send("Emulation.setEmulatedMedia", {
  media: "screen",
  features: [{ name: "prefers-reduced-motion", value: motionPreference }],
});
await send("Page.navigate", { url });
await new Promise((resolve) => setTimeout(resolve, 4500));

const metrics = await send("Runtime.evaluate", {
  expression: `(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    };
    const opacity = (selector) => {
      const element = document.querySelector(selector);
      return element ? getComputedStyle(element).opacity : null;
    };
    return {
      width: innerWidth,
      height: innerHeight,
      scrollX,
      scrollY,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      body: rect("body"),
      shell: rect(".standalone-route-shell"),
      main: rect(".auth-page-login-scene"),
      stage: rect(".auth-scene-stage"),
      card: rect(".auth-card-login-scene"),
      brand: rect(".auth-scene-brand"),
      opacity: {
        art: opacity(".auth-login-scene-art"),
        card: opacity(".auth-card-login-scene"),
        brand: opacity(".auth-scene-brand"),
        home: opacity(".auth-scene-home"),
        replay: opacity(".auth-scene-replay"),
      },
      htmlStyle: {
        height: getComputedStyle(document.documentElement).height,
        minHeight: getComputedStyle(document.documentElement).minHeight,
        paddingBottom: getComputedStyle(document.documentElement).paddingBottom,
      },
      bodyStyle: {
        height: getComputedStyle(document.body).height,
        minHeight: getComputedStyle(document.body).minHeight,
        paddingBottom: getComputedStyle(document.body).paddingBottom,
      },
      children: Array.from(document.body.children).map((element) => ({
        tag: element.tagName,
        className: element.className,
        display: getComputedStyle(element).display,
        rect: rect(element.className ? "." + String(element.className).trim().split(/\\s+/).join(".") : element.tagName.toLowerCase()),
      })),
    };
  })()`,
  returnByValue: true,
});
const screenshot = await send("Page.captureScreenshot", {
  format: "png",
  fromSurface: true,
  captureBeyondViewport: false,
});

await writeFile(outputPath, Buffer.from(screenshot.data, "base64"));
process.stdout.write(JSON.stringify({ ...metrics.result.value, runtimeErrors, consoleErrors }));
socket.close();
