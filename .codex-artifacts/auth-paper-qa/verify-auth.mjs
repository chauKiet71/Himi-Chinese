const [, , debuggingPort, widthValue = "390", heightValue = "844"] = process.argv;
const width = Number(widthValue);
const height = Number(heightValue);

if (!debuggingPort) throw new Error("Usage: verify-auth.mjs <port>");

const routes = ["login", "register", "forgot-password"];
const results = [];

for (const route of routes) {
  const target = await fetch(
    `http://127.0.0.1:${debuggingPort}/json/new?${encodeURIComponent(`http://localhost:4173/${route}`)}`,
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
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 720,
    screenWidth: width,
    screenHeight: height,
  });
  await send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await send("Page.navigate", { url: `http://localhost:4173/${route}` });
  await new Promise((resolve) => setTimeout(resolve, 3500));

  const inspection = await send("Runtime.evaluate", {
    expression: `(() => {
      const email = document.querySelector('input[name="email"]');
      const button = document.querySelector('.auth-form button[type="submit"]');
      if (!email || !button) return { ready: false };
      email.focus();
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      valueSetter.call(email, 'himi@example.com');
      email.dispatchEvent(new Event('input', { bubbles: true }));
      const style = getComputedStyle(email);
      return {
        ready: true,
        activeName: document.activeElement?.getAttribute('name'),
        emailValue: email.value,
        focusVisible: style.borderColor !== 'rgb(216, 225, 221)' || style.boxShadow !== 'none',
        submitEnabled: !button.disabled,
        submitLabel: button.textContent.trim(),
        links: Array.from(document.querySelectorAll('.auth-switch a')).map((link) => ({
          label: link.textContent.trim(),
          href: link.getAttribute('href'),
        })),
        homeHref: document.querySelector('.auth-scene-home')?.getAttribute('href'),
      };
    })()`,
    returnByValue: true,
  });

  results.push({
    route,
    ...inspection.result.value,
    runtimeErrors,
    consoleErrors,
  });
  socket.close();
}

process.stdout.write(JSON.stringify(results));
