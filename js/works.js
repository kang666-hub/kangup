// 讀 works.json 產生作品清單；頁面用 data-works 指定模式（featured / fpv）；語言切換時重新渲染
import { getLang, t } from './i18n.js';

const TRACK_LABEL = { fpv: 'FPV', boxing: 'BOXING', engineering: 'BRIDGE' };
const RANK = ['1ST', '2ND', '3RD'];

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

// 小縮圖檔名約定：原檔名加 _sm（assets/works/xxx.jpg → assets/works/xxx_sm.jpg），works.json 不用多欄位
const smOf = (thumb) => thumb.replace(/\.jpg$/i, '_sm.jpg');
const pick = (w, k) => (getLang() === 'en' && w[`${k}_en`]) || w[k];

function renderScores(list, mount) {
  const items = list.filter((w) => w.featured).sort((a, b) => a.order - b.order);
  const head = el('div', 'row head');
  ['RANK', '', 'TITLE', 'TRACK'].forEach((t, k) => head.append(el('span', ['', 'th', '', ''][k], t)));
  mount.append(head);
  items.forEach((w, i) => {
    const a = el('a', 'row');
    a.href = w.href;
    a.append(el('span', 'rank', RANK[i] || `${i + 1}TH`));
    const th = el('span', 'th');                                    // 小縮圖（96px 寬、16:9）；沒有縮圖就留空框，版面不跳
    if (w.thumb) {
      const img = el('img');
      img.src = new URL(`../${smOf(w.thumb)}`, import.meta.url).href;   // 首頁用小縮圖（192×108）；/fpv/ 卡片用原圖
      img.alt = pick(w, 'title');                                   // 與旁邊的標題文字重複，是為了符合「縮圖要有 alt」的規則
      img.loading = 'lazy';
      img.width = 192; img.height = 108;
      th.append(img);
    }
    a.append(th);
    const ttl = el('span', 'ttl');                                  // 文字仍是「標題｜說明」；「標題｜」不斷行，所以「｜」不會落在行首
    ttl.append(el('span', 'nw', `${pick(w, 'title')}｜`), document.createTextNode(pick(w, 'desc')));
    a.append(ttl);
    a.append(el('span', `trk t-${w.track}`, TRACK_LABEL[w.track] || w.track));
    mount.append(a);
  });
}

function renderCards(list, mount) {
  list.filter((w) => w.track === 'fpv').sort((a, b) => (a.order ?? 99) - (b.order ?? 99)).forEach((w) => {
    const a = el('a', 'card');
    a.href = w.href;
    const thumb = el('div', 'thumb');
    if (w.thumb) {
      const img = el('img');
      img.src = new URL(`../${w.thumb}`, import.meta.url).href;
      img.alt = pick(w, 'title');                     // 目前語言的標題；切換語言時整張卡片重新渲染，alt 跟著換
      img.loading = 'lazy';
      img.width = 960; img.height = 540;              // 縮圖原尺寸，避免版面跳動
      thumb.classList.add('has-img');
      thumb.append(img);
    } else {
      thumb.textContent = t('thumb.placeholder');
    }
    a.append(thumb, el('h3', '', pick(w, 'title')), el('p', '', pick(w, 'desc')), el('span', 'go', 'WATCH ▶'));
    mount.append(a);
  });
}

const mount = document.querySelector('[data-works]');
if (mount) {
  let list = null;
  const render = () => {
    mount.replaceChildren();
    if (!list) {                                                  // 載入失敗：改導向 IG
      const a = el('a', 'noscript', t('works.error'));
      a.href = 'https://instagram.com/knight0114';
      mount.append(a);
      return;
    }
    if (mount.dataset.works === 'featured') renderScores(list, mount);
    else renderCards(list, mount);
  };
  try {
    list = await (await fetch(new URL('../data/works.json', import.meta.url))).json();
  } catch (e) { /* list 維持 null，顯示失敗訊息 */ }
  render();
  document.addEventListener('langchange', render);
}
