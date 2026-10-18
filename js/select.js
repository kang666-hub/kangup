// 首頁選角互動：切換按下狀態與介紹面板
const root = document.documentElement;
root.classList.add('js');

const buttons = [...document.querySelectorAll('.sel')];
const panels = [...document.querySelectorAll('.panel')];

function pick(id) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
  panels.forEach((p) => { p.hidden = p.dataset.id !== id; });
}

buttons.forEach((b) => b.addEventListener('click', () => pick(b.dataset.id)));
pick('p2');

// 預先載入三張動畫 GIF，切換時不閃白
document.querySelectorAll('.sel .anim').forEach((img) => {
  const pre = new Image();
  pre.src = img.currentSrc || img.src;
});
