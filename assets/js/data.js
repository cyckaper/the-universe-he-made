/* =====================================================================
   THE UNIVERSE HE MADE — Impact Map for Prof. William C. Sullivan
   ---------------------------------------------------------------------
   ★ 如何編輯這片星空 / HOW TO EDIT ★
   這個檔就是全部資料。把節點換成你認識的真實的人，或往 nodes 陣列再 push：
     center : 中心（Sullivan 教授本人）
     nodes  : 周圍的每一顆星。每個節點欄位：
        id        唯一代號（英數，不可重複）
        gen       世代：1 = 學生／朋友本人；2 = 他們的學生；3 = 成果（公司／研究）
        parent    這顆星環繞的對象 id（gen1 環繞 'wcs'）
        kind      類型，決定顏色：
                  'phd' 'masters' 'undergrad' 'friend' 'student2' 'company' 'research'
        name      顯示名字
        role      一行身分／歷程，可用 → 表示「從…到…」
        message   ★這個人想對 Bill 說的話（會以引言顯示，這是這份禮物的核心）
        detail / detailZh   說明（沒有 message 時才會顯示；中文可留空）
        placeholder: true   標示為「範例／待填」（虛線淡色顯示）
   ===================================================================== */

const universe = {
  center:{
    id:'wcs', name:'William C. Sullivan', kind:'center',
    role:'Professor & Head of Landscape Architecture · UIUC',
    detail:"Co-founder of the Landscape and Human Health Laboratory. For decades he asked a single question — how do the landscapes we design shape human wellbeing? — and taught a generation to pursue it with both rigor and heart.",
    detailZh:'景觀與人類健康實驗室（LHHL）共同創辦人。數十年來，他只問一個問題——我們所設計的地景，如何形塑人的身心健康？——並教會了一整個世代，用嚴謹與溫柔去追問它。'
  },
  nodes:[
    /* ---------- GEN 1 · 學生與朋友 ---------- */

    { id:'shelly', gen:1, parent:'wcs', kind:'phd',
      name:'Shih-Han “Shelly” Hung',
      role:"Exchange MS & PhD · dissertation committee → Assistant Professor, Master's Program in Biodiversity, National Taiwan University",
      message:"Congratulations on your retirement, Bill. Over the past fifteen years, you have played an important role in my academic journey — as my master's and doctoral committee member, collaborator, mentor, and friend. Thank you for your encouragement, generosity, and unwavering support. I wish you a joyful, healthy, and rewarding retirement, and I look forward to staying connected in the years ahead 🙌😀🧡" },

    { id:'yuchen', gen:1, parent:'wcs', kind:'phd',
      name:'Yu-Chen Yeh',
      role:'PhD dissertation committee → Assistant Professor, Dept. of Leisure Industry & Health Promotion, National Taipei University of Nursing and Health Sciences',
      message:"Thank you, Bill, for being part of my PhD journey. Your guidance and encouragement meant a lot to me. Congratulations on your retirement, and I wish you happiness, good health, and many wonderful adventures ahead!" },

    { id:'julie', gen:1, parent:'wcs', kind:'phd',
      name:'Julie · Yu-Hsin Tung',
      role:"Master's Exchange & PhD · dissertation committee → Assistant Professor, Fu Jen Catholic University",
      message:"Thank you for your tireless dedication to teaching and your invaluable mentorship. May your retirement be filled with joy, rest, and abundant blessings." },

    { id:'kao', gen:1, parent:'wcs', kind:'masters',
      name:'Kao Yu-Chieh 高語婕',
      role:"Master's Exchange (research project) → Landscape Designer, Classicdesign Co., Ltd.",
      message:"Although I was always nervous in class, learning with you at UIUC remains one of the most unforgettable memories of my life. Congratulations on your retirement!" },

    { id:'cyc', gen:1, parent:'wcs', kind:'friend',
      name:'CYC · Chun-Yen Chang 張俊彥',
      role:'Friend → Professor, National Taiwan University',
      message:"Now you're getting out of a long line of faculty meetings!" },

    { id:'yinghung', gen:1, parent:'wcs', kind:'friend',
      name:'Ying-Hung Li',
      role:'Friend → Professor, Feng Chia University',
      message:"We have worked together, defended together, had dinner together, and drunk together. BUT — guess what — we never... sang together!! Happy retirement!" },

    { id:'jiang', gen:1, parent:'wcs', kind:'phd',
      name:'Bin Jiang 江斌',
      role:'PhD → Associate Professor, University of Hong Kong',
      detail:"Now leads the Virtual Reality Lab for Landscape & Health at HKU — carrying the green-space-and-stress question into immersive technology, and training a new generation of his own.",
      detailZh:'現為香港大學副教授，主持景觀與健康虛擬實境實驗室，把「綠地與壓力」的提問帶進沉浸科技，並開始培養自己的下一代學生。' },

    /* ---------- GEN 2 · 他們的學生（下一代，範例：可填入或刪除） ---------- */
    { id:'g2_shelly', gen:2, parent:'shelly', kind:'student2', placeholder:true,
      name:'Her students at NTU', role:'The next generation',
      detail:"Shelly now mentors her own students — the line continues. Click to name one, or delete this star.",
      detailZh:'Shelly 如今也帶著自己的學生——這條線仍在延續。點此填入名字，或刪除這顆星。' },
    { id:'g2_julie', gen:2, parent:'julie', kind:'student2', placeholder:true,
      name:'Her students at Fu Jen', role:'The next generation',
      detail:"Click to edit or remove.", detailZh:'點此編輯或刪除。' },
    { id:'g2_jiang', gen:2, parent:'jiang', kind:'student2', placeholder:true,
      name:"Bin Jiang's students at HKU", role:'The third generation',
      detail:"Click to edit or remove.", detailZh:'點此編輯或刪除。' },

    /* ---------- GEN 3 · 延續的成果（研究／事業） ---------- */
    { id:'r_green', gen:3, parent:'jiang', kind:'research',
      name:'Green space & mental health',
      role:'A whole field of evidence',
      detail:"Hundreds of studies worldwide now measure how nature restores attention, lowers stress and heals — a research tradition that traces back to this lab.",
      detailZh:'今日全球已有數百項研究，量測自然如何恢復注意力、降低壓力、療癒身心——這條研究傳統，可以一路追溯回這間實驗室。' },
    { id:'r_research', gen:3, parent:'shelly', kind:'research', placeholder:true,
      name:'Research carried forward', role:'Ideas outliving their author',
      detail:"Click to edit or remove — a paper, a method, a question your students keep building on.",
      detailZh:'點此編輯或刪除——一篇論文、一個方法、一個被學生持續接力的提問。' }
  ]
};

/* ---------- kind → 顏色 / 標籤 ---------- */
const KIND = {
  center:   {c:'#f4d58d', en:'The teacher',          zh:'老師'},
  phd:      {c:'#ffd27a', en:'Doctoral student',     zh:'博士生'},
  masters:  {c:'#9ad0c2', en:"Master's student",     zh:'碩士生'},
  undergrad:{c:'#c9e4a6', en:'Undergraduate',        zh:'大學生'},
  friend:   {c:'#e7a6ce', en:'Friend',               zh:'朋友'},
  student2: {c:'#b5a7e6', en:"A student's student",   zh:'學生的學生'},
  company:  {c:'#f2a3a3', en:'Founded / built',       zh:'創立的事業'},
  research: {c:'#87c5e8', en:'Research carried on',    zh:'延續的研究'}
};
const LEGEND_ORDER = ['phd','masters','friend','student2','company','research'];
