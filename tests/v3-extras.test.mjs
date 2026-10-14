import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname.replace(/^\//, "");

test("server-renders the standalone Phase 2 extras without enabling the local form", () => {
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
      react: synthetic({ ...React, default: React }),
      "react/jsx-runtime": synthetic(require("react/jsx-runtime")),
      "react/jsx-dev-runtime": synthetic(require("react/jsx-dev-runtime")),
      css: synthetic({ default: css }),
      icon: synthetic({ Icon: (props) => React.createElement("svg", props) }),
      gold: synthetic({ GoldLabel: (props) => React.createElement("p", props) }),
    };
    async function load(file) {
      if (cache.has(file)) return cache.get(file);
      const code = transformSync(readFileSync(file, "utf8"), { filename: file, sourceMaps: false, jsc: { parser: { syntax: "typescript", tsx: file.endsWith(".tsx") }, transform: { react: { runtime: "automatic" } } }, module: { type: "es6" } }).code;
      const mod = new vm.SourceTextModule(code, { context, identifier: file });
      cache.set(file, mod);
      await mod.link(async (specifier, referencingModule) => {
        if (specifier === "react" || specifier.startsWith("react/jsx")) return reactModules[specifier];
        if (specifier.endsWith(".module.css")) return reactModules.css;
        if (specifier.endsWith("/Icon")) return reactModules.icon;
        if (specifier.endsWith("/GoldLabel")) return reactModules.gold;
        if (specifier.startsWith("@/")) return load(resolve(root, specifier.slice(2)) + ".ts");
        return load(resolve(dirname(referencingModule.identifier), specifier) + ".tsx");
      });
      await mod.evaluate();
      return mod;
    }
    const source = (name) => resolve(root, "components/v3/sections", name);
    const stories = (await load(source("Stories.tsx"))).namespace.Stories;
    const faq = (await load(source("Faq.tsx"))).namespace.Faq;
    const consult = (await load(source("ConsultForm.tsx"))).namespace.ConsultForm;
    const location = (await load(source("Location.tsx"))).namespace.Location;
    const footer = (await load(resolve(root, "components/v3/layout/SaesomangFooter.tsx"))).namespace.SaesomangFooter;
    const content = (await load(resolve(root, "content/v3/saesomang.ts"))).namespace.saesomangContent;
    const extras = content.extras;
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
      React.createElement(stories, { stories: extras.stories, storyNotice: extras.storyNotice }),
      React.createElement(faq, { faq: extras.faq }),
      React.createElement(consult, { consult: extras.consult, formConfirmation: extras.formConfirmation, contacts: extras.contacts }),
      React.createElement(consult, { id: "consult-secondary", consult: extras.consult, formConfirmation: extras.formConfirmation, contacts: extras.contacts }),
      React.createElement(location, { brandName: content.brand.name, location: extras.location, contacts: extras.contacts }),
      React.createElement(footer, { brand: content.brand, footer: content.footer }),
    ));
    assert.equal((html.match(/data-story-id=/g) ?? []).length, 7);
    assert.equal((html.match(/<details/g) ?? []).length, 3);
    assert.match(html, /센터가 전하는 제도·운영 정보입니다\./);
    assert.match(html, /먼저 궁금한 이야기들입니다\./);
    assert.match(html, /작성하신 내용은 이 화면에서만 확인되며/);
    assert.match(html, /외부 전송·저장 기능이 없는 안내용 화면입니다/);
    assert.equal((html.match(/<fieldset disabled=""/g) ?? []).length, 2);
    assert.equal((html.match(/name="(?:name|phone|message)"/g) ?? []).length, 6);
    assert.match(html, /개인정보 보호를 위해 JavaScript를 사용할 수 없을 때는 이 양식을 작성할 수 없습니다/);
    assert.match(html, /경기도 성남시 분당구 미금로 215 청솔마을 대원상가 207호/);
    assert.match(html, /미금역 1번 출구에서 도보 5~10분입니다/);
    assert.match(html, /footer\.svg/);
    assert.match(html, /target="_blank" rel="noreferrer"/);
    const describedBy = [...html.matchAll(/aria-describedby="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(describedBy.length, 2);
    assert.notEqual(describedBy[0], describedBy[1]);
    for (const ids of describedBy) for (const itemId of ids.split(" ")) assert.match(html, new RegExp('id="' + itemId + '"'));
  `;
  const output = execFileSync(process.execPath, ["--experimental-vm-modules", "--input-type=module", "-e", script, root], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  assert.equal(output, "");
});
