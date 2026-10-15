import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname.replace(/^\//, "");

test("server-renders standalone Phase 2 extras with an anchor-only Kakao guide", () => {
  const script = String.raw`
    import assert from "node:assert/strict";
    import { createRequire } from "node:module";
    import { readFileSync } from "node:fs";
    import { dirname, resolve } from "node:path";
    import vm from "node:vm";
    import { transformSync } from "next/dist/build/swc/index.js";
    const require = createRequire(import.meta.url);
    const React = require("react");
    const { renderToStaticMarkup } = require("react-dom/server");
    const root = process.argv[1];
    const context = vm.createContext({ console, URL, TextEncoder, TextDecoder });
    const cache = new Map();
    const css = new Proxy({}, { get: (_, key) => String(key) });
    const synthetic = (namespace) => new vm.SyntheticModule(Object.keys(namespace), function () { for (const [key, value] of Object.entries(namespace)) this.setExport(key, value); }, { context });
    const reactModules = {
      react: synthetic({ ...React, default: React }), "react/jsx-runtime": synthetic(require("react/jsx-runtime")), "react/jsx-dev-runtime": synthetic(require("react/jsx-dev-runtime")),
      css: synthetic({ default: css }), icon: synthetic({ Icon: (props) => React.createElement("svg", props) }), gold: synthetic({ GoldLabel: (props) => React.createElement("p", props) }),
    };
    async function load(file) {
      if (cache.has(file)) return cache.get(file);
      const code = transformSync(readFileSync(file, "utf8"), { filename: file, sourceMaps: false, jsc: { parser: { syntax: "typescript", tsx: file.endsWith(".tsx") }, transform: { react: { runtime: "automatic" } } }, module: { type: "es6" } }).code;
      const mod = new vm.SourceTextModule(code, { context, identifier: file }); cache.set(file, mod);
      await mod.link(async (specifier, referencingModule) => {
        if (specifier === "react" || specifier.startsWith("react/jsx")) return reactModules[specifier];
        if (specifier.endsWith(".module.css")) return reactModules.css;
        if (specifier.endsWith("/Icon")) return reactModules.icon;
        if (specifier.endsWith("/GoldLabel")) return reactModules.gold;
        if (specifier.startsWith("@/")) return load(resolve(root, specifier.slice(2)) + ".ts");
        return load(resolve(dirname(referencingModule.identifier), specifier) + ".tsx");
      });
      await mod.evaluate(); return mod;
    }
    const source = (name) => resolve(root, "components/v3/sections", name);
    const stories = (await load(source("Stories.tsx"))).namespace.Stories;
    const faq = (await load(source("Faq.tsx"))).namespace.Faq;
    const guide = (await load(source("ConsultationGuide.tsx"))).namespace.ConsultationGuide;
    const location = (await load(source("Location.tsx"))).namespace.Location;
    const footer = (await load(resolve(root, "components/v3/layout/SaesomangFooter.tsx"))).namespace.SaesomangFooter;
    const content = (await load(resolve(root, "content/v3/saesomang.ts"))).namespace.saesomangContent;
    const extras = content.extras;
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
      React.createElement(stories, { stories: extras.stories, storyNotice: extras.storyNotice }),
      React.createElement(faq, { faq: extras.faq }),
      React.createElement(guide, { guide: extras.consultation }),
      React.createElement(location, { brandName: content.brand.name, location: extras.location, contacts: extras.contacts }),
      React.createElement(footer, { brand: content.brand, footer: { ...content.footer, links: extras.contacts, legal: [] } }),
    ));
    assert.equal((html.match(/data-story-id=/g) ?? []).length, 7);
    assert.equal((html.match(/<details/g) ?? []).length, 3);
    assert.match(html, /센터가 전하는 제도·운영 정보입니다\./);
    assert.match(html, /먼저 궁금한 이야기들입니다\./);
    assert.match(html, /카카오 오픈채팅으로 이동합니다\. 그룹방에는 연락처·건강정보·서류 사진을 올리지 마세요\./);
    assert.match(html, /href="https:\/\/open\.kakao\.com\/o\/ggmGtL5e"/);
    assert.equal((html.match(/<form\b|<input\b|<textarea\b/g) ?? []).length, 0);
    assert.equal((html.match(/href="tel:/g) ?? []).length, 0);
    assert.match(html, /TEL 031-726-5288/);
    assert.match(html, /경기도 성남시 분당구 미금로 215 청솔마을 대원상가 207호/);
    assert.match(html, /미금역 1번 출구에서 도보 5~10분입니다/);
    assert.match(html, /footer\.svg/);
    assert.match(html, /target="_blank" rel="noreferrer"/);
  `;
  const output = execFileSync(process.execPath, ["--experimental-vm-modules", "--input-type=module", "-e", script, root], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  assert.equal(output, "");
});
