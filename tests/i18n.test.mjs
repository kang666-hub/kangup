// 中英切換檢查：node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { DICT, detectLang } = await import(pathToFileURL(path.join(ROOT, 'js/i18n.js')).href);

test('works.json 每筆都有非空的 title_en、desc_en', () => {
  const works = JSON.parse(readFileSync(path.join(ROOT, 'data/works.json'), 'utf8'));
  for (const w of works) {
    for (const k of ['title_en', 'desc_en']) {
      assert.equal(typeof w[k], 'string', `${w.id}.${k}`);
      assert.ok(w[k].trim().length > 0, `${w.id}.${k} 是空的`);
    }
  }
});

test('i18n.js 的 zh 與 en 字典 key 完全一致，且值皆非空', () => {
  const zh = Object.keys(DICT.zh).sort();
  const en = Object.keys(DICT.en).sort();
  assert.deepEqual(zh, en);
  for (const l of ['zh', 'en']) for (const k of zh) assert.ok(DICT[l][k].trim(), `${l}.${k} 是空的`);
});

test('HTML 中每個 data-i18n key 都存在於字典', () => {
  for (const page of ['index.html', 'fpv/index.html', 'tools/index.html']) {
    const html = readFileSync(path.join(ROOT, page), 'utf8');
    const keys = [...html.matchAll(/data-i18n(?:-html|-content|-alt|-aria)?="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(keys.length > 0, `${page} 沒有任何 data-i18n`);
    for (const k of keys) assert.ok(k in DICT.zh, `${page} 的 key 不在字典：${k}`);
  }
});

test('語言決定順序：網址 ＞ localStorage ＞ navigator.language', () => {
  assert.equal(detectLang('?lang=en', 'zh', 'zh-TW'), 'en');
  assert.equal(detectLang('?lang=zh', 'en', 'en-US'), 'zh');
  assert.equal(detectLang('', 'en', 'zh-TW'), 'en');
  assert.equal(detectLang('?lang=xx', 'zh', 'en-US'), 'zh');
  assert.equal(detectLang('', null, 'zh-TW'), 'zh');
  assert.equal(detectLang('', null, 'zh-Hant-HK'), 'zh');
  assert.equal(detectLang('', null, 'en-US'), 'en');
  assert.equal(detectLang('', 'bad', 'ja-JP'), 'en');
});
