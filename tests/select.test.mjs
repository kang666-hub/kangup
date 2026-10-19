// v0.2 選角動畫與音效檢查：node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(path.join(ROOT, f), 'utf8');

test('新素材檔都存在（select.js 與 style.css 引用的 assets 檔）', () => {
  const fromJs = [...read('js/select.js').matchAll(/asset\('([^']+)'\)/g)].map((m) => m[1]);
  const fromCss = [...read('css/style.css').matchAll(/url\(\.\.\/assets\/([^)]+)\)/g)].map((m) => m[1]);
  const fromHtml = [...read('index.html').matchAll(/src="assets\/([^"]+)"/g)].map((m) => m[1]);
  const all = [...new Set([...fromJs, ...fromCss, ...fromHtml])];
  assert.ok(fromJs.length >= 6 && fromCss.length >= 3 && fromHtml.length >= 4, '引用數量不對');
  for (const f of all) assert.ok(existsSync(path.join(ROOT, 'assets', f)), `assets/${f} 不存在`);
  for (const f of ['kang_select_p1_confirm.png', 'kang_select_p2_confirm.png', 'kang_select_p3_confirm.png',
    'kang_select_p1_idle.gif', 'kang_select_p2_idle.gif', 'kang_engineer_static_v2.png', 'kang_avatar_static_v2.png']) {
    assert.ok(all.includes(f), `沒有被引用：${f}`);
  }
});

test('index.html 不再引用舊的待機 GIF 與舊靜態圖檔名', () => {
  const html = read('index.html') + read('js/select.js') + read('css/style.css');
  for (const old of ['kang_engineer_anim.gif', 'kang_avatar_anim_v2.gif', 'kang_engineer_static.png', 'kang_avatar_static.png']) {
    assert.ok(!html.includes(old), `還在引用 ${old}`);
  }
});

test('sfx.js 有預設值常數，且預設為開', async () => {
  const src = read('js/sfx.js');
  assert.match(src, /export const SFX_DEFAULT_ON = (true|false);/);
  const mod = await import(pathToFileURL(path.join(ROOT, 'js/sfx.js')).href);       // 在 Node 載入時不得碰瀏覽器 API
  assert.equal(typeof mod.SFX_DEFAULT_ON, 'boolean');
  assert.equal(mod.SFX_DEFAULT_ON, true);
  assert.equal(mod.isOn(), true);
});

test('sfx.js 載入時不建立 AudioContext（只在 unlock() 裡建立）', () => {
  const src = read('js/sfx.js');
  const before = src.split('export function unlock')[0];
  assert.ok(!/new AC\(|new AudioContext/.test(before), 'unlock() 以外的地方建立了 AudioContext');
  assert.equal((src.match(/new AC\(/g) || []).length, 1);
});

test('三個頁面都有音效開關，aria-label 為「音效開關 / Toggle sound」', () => {
  for (const page of ['index.html', 'fpv/index.html', 'tools/index.html']) {
    const html = read(page);
    assert.match(html, /id="sfx-toggle"[^>]*aria-label="音效開關 \/ Toggle sound"/, page);
    assert.match(html, /js\/sfx\.js/, page);
  }
});
