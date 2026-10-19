// 可愛 8-bit 音效：Web Audio API 即時合成（不放音檔）。載入時不出聲；第一次使用者點擊才建立 AudioContext。
export const SFX_DEFAULT_ON = true;        // 預設：開（之後要改預設值，只改這一行）
const STORE_KEY = 'kangup-sound';
const MASTER_GAIN = 0.15;                  // 主音量
// 選定音：上行三連音（像撿到金幣）；三個角色用不同音高（Hz）
const CHOSEN_NOTES = {
  p1: [1046.5, 1318.5, 1568.0],            // C6 E6 G6
  p2: [1174.7, 1480.0, 1760.0],            // D6 F#6 A6
  p3: [1318.5, 1661.2, 1975.5],            // E6 G#6 B6
};

let ctx = null;
let master = null;
let on = SFX_DEFAULT_ON;

function readStored() {
  try {
    const v = localStorage.getItem(STORE_KEY);
    if (v === '1') return true;
    if (v === '0') return false;
  } catch (e) { /* 讀不到就用預設值 */ }
  return SFX_DEFAULT_ON;
}

export const isOn = () => on;

function syncButtons() {
  document.querySelectorAll('#sfx-toggle').forEach((b) => {
    b.setAttribute('aria-pressed', String(on));
    b.classList.toggle('off', !on);
    const icon = b.querySelector('span');
    if (icon) icon.textContent = on ? '🔊' : '🔇';
  });
}

export function setOn(v) {
  on = Boolean(v);
  try { localStorage.setItem(STORE_KEY, on ? '1' : '0'); } catch (e) { /* 無痕或被封鎖時略過 */ }
  syncButtons();
}

// 只能在使用者點擊（手勢）裡呼叫：第一次才建立 AudioContext，之後只 resume
export function unlock() {
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

// 方波「嗶」：f0 → f1 掃頻，極快起音、指數衰減
function blip(f0, f1, t0, dur) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(f0, t0);
  osc.frequency.exponentialRampToValueAtTime(f1, t0 + dur * 0.8);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(1, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// 選擇音：短促高音「嗶」（約 60ms，音高上揚）
export function playPick() {
  if (!on || !ctx) return;
  blip(880, 1320, ctx.currentTime, 0.06);
}

// 選定音：「叮叮叮↗」（約 250ms）
export function playChosen(id) {
  if (!on || !ctx) return;
  const notes = CHOSEN_NOTES[id] || CHOSEN_NOTES.p2;
  const t = ctx.currentTime;
  notes.forEach((f, i) => blip(f, f * 1.01, t + i * 0.085, 0.09));
}

if (typeof document !== 'undefined') {
  on = readStored();
  syncButtons();
  const btn = document.getElementById('sfx-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      unlock();
      setOn(!on);
      if (on) playPick();
    });
  }
  // 第一次點擊（含點在頁面任何地方）才建立 AudioContext；載入時不建立、不出聲
  document.addEventListener('pointerdown', unlock, { capture: true, once: true });
}
