// 網站結構檢查：node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const works = JSON.parse(readFileSync(path.join(ROOT, 'data/works.json'), 'utf8'));
const TRACKS = ['fpv', 'boxing', 'engineering'];

test('works.json 每筆都有必要欄位且型別正確', () => {
  assert.ok(Array.isArray(works) && works.length > 0);
  for (const w of works) {
    for (const k of ['id', 'title', 'desc', 'track', 'thumb', 'href']) {
      assert.equal(typeof w[k], 'string', `${w.id}.${k}`);
    }
    assert.ok(w.id && w.title && w.href, `${w.id} 缺必填內容`);
    assert.equal(typeof w.featured, 'boolean', `${w.id}.featured`);
    assert.equal(typeof w.order, 'number', `${w.id}.order`);
  }
});

test('id 不重複、track 合法', () => {
  const ids = works.map((w) => w.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const w of works) assert.ok(TRACKS.includes(w.track), `${w.id} track=${w.track}`);
});

test('thumb 非空時放在 assets/works/ 底下、是 jpg；href 不含 ?（追蹤參數）', () => {
  for (const w of works) {
    if (w.thumb) assert.match(w.thumb, /^assets\/works\/[\w.-]+\.jpg$/, `${w.id} thumb=${w.thumb}`);
    assert.ok(!w.href.includes('?'), `${w.id} href 含 ?：${w.href}`);
    assert.match(w.href, /^https:\/\/(www\.)?(instagram\.com|kang666-hub\.github\.io)\//, `${w.id} href 不是預期的網址`);
  }
});

test('每個 thumb 都有對應的 _sm 小縮圖（192×108 jpg）', () => {
  const dims = (file) => {                                                   // 讀 JPEG 的 SOF 區段取得寬高
    const b = readFileSync(file);
    let i = 2;
    while (i < b.length) {
      assert.equal(b[i], 0xff, '不是有效的 JPEG');
      const m = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + len;
    }
    throw new Error('找不到 SOF');
  };
  for (const w of works.filter((x) => x.thumb)) {
    const sm = w.thumb.replace(/\.jpg$/i, '_sm.jpg');
    assert.notEqual(sm, w.thumb, `${w.id} thumb 不是 .jpg`);
    const f = path.join(ROOT, sm);
    assert.ok(existsSync(f), `${w.id} 缺小縮圖 ${sm}（執行 make_thumb_sm.py）`);
    assert.deepEqual(dims(f), [192, 108], `${w.id} 小縮圖尺寸不是 192×108`);
  }
});

test('featured 的 order 不重複', () => {
  const orders = works.filter((w) => w.featured).map((w) => w.order);
  assert.equal(new Set(orders).size, orders.length);
});

test('thumb 若有填，檔案必須存在', () => {
  for (const w of works.filter((x) => x.thumb)) {
    assert.ok(existsSync(path.join(ROOT, w.thumb)), `${w.id} thumb 不存在`);
  }
});

test('三個頁面引用的本地檔案都存在', () => {
  const pages = ['index.html', 'fpv/index.html', 'tools/index.html'];
  for (const page of pages) {
    const file = path.join(ROOT, page);
    const html = readFileSync(file, 'utf8');
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1])
      .filter((r) => !/^(https?:|mailto:|#|data:)/.test(r));
    assert.ok(refs.length > 0);
    for (const ref of refs) {
      const clean = ref.split('#')[0].split('?')[0];
      if (!clean) continue;
      let target = path.resolve(path.dirname(file), clean);
      if (clean.endsWith('/') ) target = path.join(target, 'index.html');
      assert.ok(existsSync(target), `${page} 引用不存在：${ref}`);
    }
  }
});

test('程式碼中沒有刪除檔案的呼叫', () => {
  // 用字串拼接組出樣式，避免測試檔自己被掃到
  const names = ['unl' + 'ink', 'rm' + 'Sync', 'rm' + 'dir', 'rm' + '\\(', 'rm' + ' -', 'remove' + 'Sync'];
  const pattern = new RegExp(names.join('|'));
  const files = [];
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      if (n === '.git' || n === 'node_modules') continue;
      const p = path.join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(js|mjs|html)$/.test(n)) files.push(p);
    }
  };
  walk(ROOT);
  assert.ok(files.length >= 5);
  for (const f of files) {
    assert.ok(!pattern.test(readFileSync(f, 'utf8')), `${path.relative(ROOT, f)} 含刪除呼叫`);
  }
});
