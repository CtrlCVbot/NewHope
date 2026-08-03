import { spawn } from "node:child_process";
import { after } from "node:test";

const port = 4000 + (process.pid % 1000);
let server;
let ready;

async function ensureServer() {
  if (ready) return ready;
  ready = (async () => {
    server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", `${port}`], { cwd: new URL("..", import.meta.url), stdio: "ignore" });
    for (let attempt = 0; attempt < 50; attempt += 1) {
      try { const response = await fetch(`http://127.0.0.1:${port}/`); if (response.ok) return; } catch { /* Wait for Next.js to bind its port. */ }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error("Next.js production server did not start within 5 seconds.");
  })();
  return ready;
}

export async function render(pathname) { await ensureServer(); return fetch(`http://127.0.0.1:${port}${pathname}`, { headers: { accept: "text/html" } }); }

after(() => new Promise((resolve) => {
  if (!server || server.exitCode !== null) { resolve(); return; }
  server.once("exit", resolve);
  server.kill();
}));
