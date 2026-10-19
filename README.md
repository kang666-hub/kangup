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

## 新增／更新作品（流程）
給 Claude Code 的素材只要三樣：**分類（fpv／boxing／engineering）＋ IG 連結 ＋ 一張影片截圖**。

1. Kang 在聊天中給：分類、IG 連結、一張影片截圖。
2. 規劃端裁好 960×540 縮圖（JPG，去掉 IG 介面圖示），放 `03_website/thumbs_inbox/`（這個資料夾之後才會建立）。
3. Claude Code：
   - 縮圖搬到 `assets/works/`（檔名不變）
   - **產生 `_sm` 小縮圖**：執行 `python3 make_thumb_sm.py`（腳本在 `03_website/` 下、不進 repo），為每張縮圖產生首頁用的 `xxx_sm.jpg`（192×108、JPEG 品質 80、不帶中繼資料）；檔名約定是「原檔名加 `_sm`」，`works.js` 依約定推導，`works.json` 不用多欄位。`/fpv/` 的卡片仍用原圖
   - `data/works.json` 新增一筆：`id`、`title`／`desc`（中文）、`title_en`／`desc_en`（英文）、`track`、`thumb`（`assets/works/xxx.jpg`）、`href`（IG 網址，**去掉 `?` 後面的追蹤參數**，只留 `https://www.instagram.com/reel/XXXX/` 或 `/p/XXXX/`）、`featured`、`order`。中英標題與說明由 Kang 確認
   - 要不要上首頁 HIGH SCORES 由 `featured`／`order` 決定（`order` 不可重複）
   - `node --test` 全過後 commit、push
4. 首頁只顯示 3 筆 `featured`；其他作品自動出現在 `/fpv/`（`track: "fpv"`；boxing、engineering 的分類頁之後再做）。
- 縮圖卡片會自動 `loading="lazy"`、帶 `width`／`height`，`alt` 是目前語言的標題。首頁 HIGH SCORES 用 `_sm` 小縮圖（為了首頁傳輸量 < 1.5 MiB），`/fpv/` 卡片用原圖。

### 待辦
- **Select Your Fighter 三機影片**（三台 GEPRC 共用一顆 O4 Pro）：還沒拍；拍好後用上面的流程新增一筆（原本 `works.json` 裡的 `select-your-fighter` 已被第 1 筆 `cinebot25-v2-flight` 取代）。

## 本機預覽與測試
```
python3 -m http.server 8000
node --test
```
所有路徑皆為相對路徑，可同時在 `kang666-hub.github.io/kangup/` 與 `kangup.com` 運作。
