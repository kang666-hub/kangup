# kangup.com 個人網站 v0

KANG 個人品牌網站。純 HTML／CSS／ES modules，無框架、無建置、無後端。

## 結構
- `index.html` 首頁（A2「街機機台」版型）
- `fpv/` FPV 作品集、`tools/` 工具區
- `css/style.css` 共用樣式（色彩用 CSS 變數）
- `js/select.js` 選角互動、`js/works.js` 讀 `data/works.json` 產生作品清單
- `assets/` 像素素材（自 `01_pixel-avatar/` 與 `03_website/assets/` 複製）
- `CNAME` 自訂網域 `kangup.com`

## 新增作品
編輯 `data/works.json`，不用改 HTML：
- `track` 只能是 `fpv`／`boxing`／`engineering`
- `featured: true` 的會出現在首頁 HIGH SCORES（依 `order` 排序，`order` 不可重複）
- `track: "fpv"` 的會出現在 `/fpv/`
- `thumb` 填相對網站根目錄的路徑（如 `assets/xxx.jpg`），空字串顯示「[縮圖待補]」

## 本機預覽與測試
```
python3 -m http.server 8000
node --test
```
所有路徑皆為相對路徑，可同時在 `kang666-hub.github.io/kangup/` 與 `kangup.com` 運作。
