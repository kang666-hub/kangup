// 中英切換：字典與套用。字典、detectLang 不碰 document，可在 Node 載入測試。
export const DICT = {
  zh: {
    'nav.works': '作品', 'nav.tools': '工具', 'nav.contact': '合作',
    'sfx.aria': '音效開關 / Toggle sound',
    'home.title': 'KANG｜用工程腦飛行與出拳',
    'home.desc': 'KANG：橋梁監造工程師 × FPV 飛手 × 拳擊。自己寫工具來分析每一次飛行、每一記出拳。',
    'home.ogdesc': '橋梁監造工程師 × FPV 飛手 × 拳擊。',
    'hero.alt': 'KANG 像素橫幅：戴工程帽的 KANG 指向看板，無人機飛過山谷橋',
    'hero.h1': '用工程腦<br>飛行與出拳',
    'hero.lead': '橋梁監造工程師 × FPV 飛手 × 拳擊。自己寫工具來分析每一次飛行、每一記出拳。',
    'hero.btn.select': '選擇角色', 'hero.btn.contact': '合作洽詢',
    'select.hint': '點選角色看介紹（選中的角色會動起來）',
    'p1.aria': '選擇工程', 'p2.aria': '選擇 FPV', 'p3.aria': '選擇拳擊',
    'p1.title': '工程', 'p1.desc': '橋梁監造工程師，參與桃園復興區橋梁災害復建。', 'p1.cta': '看工地空拍 →',
    'p2.title': 'FPV 穿越機', 'p2.desc': '花飛與電影感拍攝。GEPRC Cinebot25 / Cinebot35 / TriPro6 機隊。', 'p2.cta': '看 FPV 作品 →',
    'p3.title': '拳擊', 'p3.desc': '每週訓練日記，用姿態分析看自己的出拳。', 'p3.cta': '看訓練紀錄 →',
    'bonus.trainer.title': '花飛訓練平台',
    'bonus.trainer.desc': '3D 物理示範打桿與推力分解，含訓練菜單與自由練習。',
    'bonus.battery.desc': '鋰電池電壓參考與功率計算。',
    'contact.sub': 'FPV 拍攝 · 工程空拍 · 品牌合作',
    'fpv.intro': '花飛與電影感拍攝，用工程腦分析每一次飛行。',
    'fpv.h.works': '作品', 'fpv.h.fleet': '機隊', 'fpv.h.services': '接案項目',
    'fpv.services.body': 'FPV 拍攝、工程空拍',
    'thumb.placeholder': '[縮圖待補]',
    'works.error': '作品清單暫時無法載入，改到 IG 看 →',
    'fpv.title': 'FPV 作品集｜KANG',
    'fpv.desc': 'KANG 的 FPV 穿越機作品、機隊與接案項目：FPV 拍攝、工程空拍。',
    'fpv.ogdesc': 'FPV 穿越機作品、機隊與接案項目。',
    'tools.title': '工具區｜KANG',
    'tools.desc': 'KANG 自己寫的 FPV 工具：花飛訓練平台、fpvBattery 電池計算。',
    'tools.ogdesc': '花飛訓練平台、fpvBattery 電池計算。',
  },
  en: {
    'nav.works': 'Works', 'nav.tools': 'Tools', 'nav.contact': 'Contact',
    'sfx.aria': 'Toggle sound',
    'home.title': 'KANG｜Engineered to fly. Built to fight.',
    'home.desc': 'Bridge supervision engineer, FPV pilot and boxer from Taiwan.',
    'home.ogdesc': 'Bridge supervision engineer, FPV pilot and boxer from Taiwan.',
    'hero.alt': 'Pixel-art KANG in a hard hat pointing at a sign board while a drone flies past a valley bridge',
    'hero.h1': 'Engineered to fly.<br>Built to fight.',
    'hero.lead': 'Bridge supervision engineer × FPV pilot × boxer. I build my own tools to analyze every flight and every punch.',
    'hero.btn.select': 'Select character', 'hero.btn.contact': 'Work with me',
    'select.hint': 'Pick a character — the selected one comes alive.',
    'p1.aria': 'Select Engineering', 'p2.aria': 'Select FPV', 'p3.aria': 'Select Boxing',
    'p1.title': 'Engineering', 'p1.desc': 'Bridge construction supervision engineer on a disaster-recovery bridge project in Fuxing District, Taoyuan.', 'p1.cta': 'See site aerials →',
    'p2.title': 'FPV Drones', 'p2.desc': 'FPV freestyle & cinematic flying. GEPRC Cinebot25 / Cinebot35 / TriPro6 fleet.', 'p2.cta': 'See FPV works →',
    'p3.title': 'Boxing', 'p3.desc': 'Weekly training log — analyzing every punch with pose tracking.', 'p3.cta': 'See training log →',
    'bonus.trainer.title': 'FPV Freestyle Trainer',
    'bonus.trainer.desc': '3D physics demos of stick input and thrust vectors, with a training menu and free-flight mode.',
    'bonus.battery.desc': 'LiPo voltage reference and power calculator.',
    'contact.sub': 'FPV filming · Engineering aerials · Brand collaborations',
    'fpv.intro': "Freestyle and cinematic flying — analyzing every flight with an engineer's mind.",
    'fpv.h.works': 'Works', 'fpv.h.fleet': 'Fleet', 'fpv.h.services': 'Services',
    'fpv.services.body': 'FPV filming, engineering aerials',
    'thumb.placeholder': '[Thumbnail coming soon]',
    'works.error': "Couldn't load works — see them on Instagram →",
    'fpv.title': 'FPV Works｜KANG',
    'fpv.desc': 'FPV freestyle and cinematic flying by KANG — works, fleet and filming services.',
    'fpv.ogdesc': 'FPV freestyle and cinematic flying by KANG — works, fleet and filming services.',
    'tools.title': 'Tools｜KANG',
    'tools.desc': 'Free FPV tools built by KANG: FPV Freestyle Trainer and fpvBattery.',
    'tools.ogdesc': 'Free FPV tools built by KANG: FPV Freestyle Trainer and fpvBattery.',
  },
};

const STORE_KEY = 'kangup-lang';
const HTML_LANG = { zh: 'zh-Hant', en: 'en' };
const valid = (l) => l === 'zh' || l === 'en';

// 語言決定順序：網址 ?lang ＞ localStorage ＞ navigator.language（zh 開頭為中文，其他英文）
export function detectLang(search, stored, navLang) {
  const q = new URLSearchParams(search).get('lang');
  if (valid(q)) return q;
  if (valid(stored)) return stored;
  return String(navLang || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

let lang = 'zh';
export const getLang = () => lang;
export const t = (key) => DICT[lang][key] ?? DICT.zh[key] ?? key;

function store(l) {
  try { localStorage.setItem(STORE_KEY, l); } catch (e) { /* 無痕或被封鎖時略過 */ }
}

function apply() {
  const root = document.documentElement;
  root.lang = HTML_LANG[lang];
  document.querySelectorAll('[data-i18n]').forEach((e) => { e.textContent = t(e.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((e) => { e.innerHTML = t(e.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-content]').forEach((e) => { e.setAttribute('content', t(e.dataset.i18nContent)); });
  document.querySelectorAll('[data-i18n-alt]').forEach((e) => { e.setAttribute('alt', t(e.dataset.i18nAlt)); });
  document.querySelectorAll('[data-i18n-aria]').forEach((e) => { e.setAttribute('aria-label', t(e.dataset.i18nAria)); });
}

export function setLang(l, { persist = true } = {}) {
  if (!valid(l)) return;
  lang = l;
  if (persist) store(l);
  apply();
  document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
}

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('js');
  let stored = null;
  try { stored = localStorage.getItem(STORE_KEY); } catch (e) { /* 讀不到就當沒有 */ }
  lang = detectLang(location.search, stored, navigator.language);
  if (valid(new URLSearchParams(location.search).get('lang'))) store(lang);   // 網址指定的語言也記下來，換頁才會保留
  apply();
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      setLang(lang === 'zh' ? 'en' : 'zh');
      const u = new URL(location.href);                                      // 網址若帶 ?lang，同步改掉，重新整理才不會被舊值蓋回去
      if (u.searchParams.has('lang')) {
        u.searchParams.set('lang', lang);
        history.replaceState(null, '', u);
      }
    });
  }
}
