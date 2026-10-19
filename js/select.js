// 首頁選角互動：兩段式。點選瞬間播一次「選定動作」，播完接「待機循環」；介紹面板點選當下立刻切換。
import { unlock, playPick, playChosen } from './sfx.js';

document.documentElement.classList.add('js');

const asset = (name) => new URL(`../assets/${name}`, import.meta.url).href;
const IDLE_URL = {
  p1: asset('kang_select_p1_idle.gif'),
  p2: asset('kang_select_p2_idle.gif'),
  p3: asset('kang_boxing_punch_side.gif'),          // P3 待機沿用現有 GIF
};
const SHEET_URL = {
  p1: asset('kang_select_p1_confirm.png'),
  p2: asset('kang_select_p2_confirm.png'),
  p3: asset('kang_select_p3_confirm.png'),
};

const panels = [...document.querySelectorAll('.panel')];
const cards = {};                                   // id -> { id, el, sprite, gen, idleImg, idleUrl, blobP }
let current = null;

function card(el) {
  const c = { id: el.dataset.id, el, sprite: document.createElement('span'), gen: 0, idleImg: null, idleUrl: null, blobP: null };
  c.sprite.className = 'chosen';
  c.sprite.setAttribute('aria-hidden', 'true');
  el.insertBefore(c.sprite, el.querySelector('.tagbar'));
  el.dataset.phase = 'static';
  // 選定動作播完 → 接待機循環（只接受這張卡片、仍在選定動作階段的結束事件）
  c.sprite.addEventListener('animationend', (e) => {
    if (e.target === c.sprite && c.el.dataset.phase === 'chosen') startIdle(c);
  });
  return c;
}

// 待機 GIF 先抓成 blob：每次待機重新建立一個 blob URL，GIF 一定從第 0 格開始（不共用瀏覽器的動畫計時），且不再發網路請求
const blobOf = (c) => (c.blobP ||= fetch(IDLE_URL[c.id]).then((r) => r.blob()));

function clearIdle(c) {
  if (c.idleImg) { c.idleImg.remove(); c.idleImg = null; }
  if (c.idleUrl) { URL.revokeObjectURL(c.idleUrl); c.idleUrl = null; }
}

async function startIdle(c) {
  const gen = c.gen;
  try {
    const url = URL.createObjectURL(await blobOf(c));
    const img = new Image();
    img.className = 'idle';
    img.alt = '';
    img.src = url;
    await img.decode();                             // 解碼好才換上去：交接時沒有空白格
    if (gen !== c.gen) { URL.revokeObjectURL(url); return; }
    clearIdle(c);
    c.idleImg = img; c.idleUrl = url;
    c.el.insertBefore(img, c.sprite);
    c.el.dataset.phase = 'idle';
  } catch (e) { /* 失敗就維持目前畫面（選定動作最後一格或靜態圖） */ }
}

function stop(c) {                                  // 回到靜態圖（切到別的角色時，立即中斷）
  c.gen += 1;
  clearIdle(c);
  c.el.dataset.phase = 'static';
}

function startChosen(c) {                           // 播一次選定動作（再點一次已選中的角色也重播）
  c.gen += 1;
  clearIdle(c);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {   // 減少動態：跳過選定動作，直接待機
    c.el.dataset.phase = 'static';
    startIdle(c);
    return;
  }
  c.el.dataset.phase = 'static';
  c.sprite.style.animation = 'none';                // 重啟 CSS 動畫：先關掉、強制重排、再打開
  void c.sprite.offsetWidth;
  c.sprite.style.animation = '';
  c.el.dataset.phase = 'chosen';
}

function choose(id, { sound = true } = {}) {
  const prev = current;
  current = id;
  Object.values(cards).forEach((c) => c.el.setAttribute('aria-pressed', String(c.id === id)));
  panels.forEach((p) => { p.hidden = p.dataset.id !== id; });     // 面板點選當下立刻切換，不等動畫
  if (prev && prev !== id) stop(cards[prev]);
  startChosen(cards[id]);
  if (sound) playChosen(id);
}

document.querySelectorAll('.sel').forEach((el) => {
  const c = card(el);
  cards[c.id] = c;
  el.addEventListener('click', () => { unlock(); choose(c.id); });
  el.addEventListener('mouseenter', () => { if (matchMedia('(pointer:fine)').matches) playPick(); });
  el.addEventListener('focus', () => { if (el.matches(':focus-visible')) playPick(); });
});

// 載入時預設 P2：直接進待機循環，不播選定動作、不出聲
current = 'p2';
Object.values(cards).forEach((c) => c.el.setAttribute('aria-pressed', String(c.id === 'p2')));
panels.forEach((p) => { p.hidden = p.dataset.id !== 'p2'; });
startIdle(cards.p2);

// 頁面載入完成後，預先載入選定動作 sprite 與三個待機 GIF，切換時不閃白
window.addEventListener('load', () => {
  Object.keys(cards).forEach((id) => {
    const pre = new Image();
    pre.src = SHEET_URL[id];
    blobOf(cards[id]).catch(() => {});
  });
});
