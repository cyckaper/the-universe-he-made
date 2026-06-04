# The Universe He Made　他所造的宇宙

> 獻給 William C. Sullivan 教授（University of Illinois Urbana-Champaign）退休的「影響力地圖」（Impact Map）。
>
> 這不是一個人的地圖，而是被他改變的所有人。
>
> *A teacher's truest legacy was never the papers. It was the people who were changed.*

一個純前端、零相依套件、可離線運作的互動式星空網頁。中心是 Sullivan 教授這顆金色的太陽，外圈依世代擴散：博士生、碩士生、大學生 → 學生的學生、學生創立的事業、延續的研究，由發光的絲線連回源頭，組成一片知識宇宙。

---

## 專案結構

```
.
├── index.html              入口（很少需要動）
├── netlify.toml            Netlify 部署設定（靜態站、無建置步驟）
├── assets/
│   ├── css/style.css       樣式
│   └── js/
│       ├── data.js   ←★    星空資料：你只需要編輯這個檔
│       └── app.js          畫面引擎（星空、互動、動畫；通常不用碰）
└── README.md
```

## 如何編輯星空（只改 `assets/js/data.js`）

打開 `assets/js/data.js`，把範例節點換成你認識的真實的人：

- `universe.center`：中心，即 Sullivan 教授本人。
- `universe.nodes`：周圍每一顆星。每個節點的欄位：
  - `id`　唯一代號（英數，不可重複）
  - `gen`　世代：`1` = 學生本人；`2` = 學生的學生；`3` = 成果（公司／研究）
  - `parent`　這顆星環繞的對象 `id`（gen1 環繞 `'wcs'`）
  - `kind`　類型，決定顏色：`'phd'` `'masters'` `'undergrad'` `'student2'` `'company'` `'research'`
  - `name` / `role`　名字與一行身分
  - `detail` / `detailZh`　他改變了這個人什麼（英文／中文）
  - `placeholder: true`　標示為「待填入」的範例（會以虛線淡色顯示）

想加人，就往 `nodes` 陣列再 `push` 一個物件；座標會自動排列，不必手算位置。

> 真實節點：Sullivan 教授本人，以及 Shih-Han (Shelly) Hung、Yu-Chen Yeh、Julie (Yu-Hsin Tung)、Kao Yu-Chieh 高語婕、Chun-Yen Chang 張俊彥、Ying-Hung Li、Bin Jiang 江斌——每位都附上想對 Bill 說的話。gen2／gen3（他們的學生、延續的研究）為清楚標示的範例，可填入或刪除。

## 本地預覽

直接用瀏覽器打開 `index.html` 即可（雙擊也行）。或用簡易伺服器：

```bash
python3 -m http.server 8000   # 然後開 http://localhost:8000
```

## 部署（GitHub → Netlify 自動部署）

推上 GitHub 後，於 Netlify 選 **Add new site → Import an existing project → GitHub**，選取本 repo。建置設定留空即可：

- Build command：（空白）
- Publish directory：`.`

之後每次 `git push`，Netlify 會自動重新部署。
