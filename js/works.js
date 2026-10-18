// 讀 works.json 產生作品清單；頁面用 data-works 指定模式（featured / fpv）
const TRACK_LABEL = { fpv: 'FPV', boxing: 'BOXING', engineering: 'BRIDGE' };
const RANK = ['1ST', '2ND', '3RD'];

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderScores(list, mount) {
  const items = list.filter((w) => w.featured).sort((a, b) => a.order - b.order);
  const head = el('div', 'row head');
  ['RANK', 'TITLE', 'TRACK'].forEach((t) => head.append(el('span', '', t)));
  mount.append(head);
  items.forEach((w, i) => {
    const a = el('a', 'row');
    a.href = w.href;
    a.append(el('span', 'rank', RANK[i] || `${i + 1}TH`));
    a.append(el('span', 'ttl', `${w.title}｜${w.desc}`));
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
      img.alt = w.title;
      thumb.append(img);
    } else {
      thumb.textContent = '[縮圖待補]';
    }
    a.append(thumb, el('h3', '', w.title), el('p', '', w.desc), el('span', 'go', 'WATCH ▶'));
    mount.append(a);
  });
}

const mount = document.querySelector('[data-works]');
if (mount) {
  try {
    const res = await fetch(new URL('../data/works.json', import.meta.url));
    const list = await res.json();
    if (mount.dataset.works === 'featured') renderScores(list, mount);
    else renderCards(list, mount);
  } catch (e) {
    mount.append(el('p', 'noscript', '作品清單暫時無法載入。'));
  }
}
