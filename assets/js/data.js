/* =====================================================================
   THE UNIVERSE HE MADE — Impact Map for Prof. William C. Sullivan
   ---------------------------------------------------------------------
   ★ 如何編輯這片星空 / HOW TO EDIT ★
   下方的 `universe` 物件就是全部資料。把範例節點換成你認識的真實的人即可：
     - center : 中心（Sullivan 教授本人）
     - nodes  : 周圍的每一顆星。每個節點欄位：
         id      唯一代號（英數，不可重複）
         gen     世代：1 = 學生本人；2 = 學生的學生；3 = 成果（公司／研究）
         parent  這顆星「環繞」的對象 id（gen1 環繞 'wcs'）
         kind    類型，決定顏色：'phd' 'masters' 'undergrad' 'student2' 'company' 'research'
         name    顯示名字
         role    一行身分（英文）
         detail  英文：他改變了這個人什麼
         detailZh 中文同上（可留空）
         placeholder: true  → 標示為「待填入」的範例（會以虛線淡色顯示）
   想加人，就往 nodes 陣列再 push 一個物件。位置會自動排列。
   ===================================================================== */

const universe = {
  center:{
    id:'wcs', name:'William C. Sullivan', kind:'center',
    role:'Professor & Head of Landscape Architecture · UIUC',
    detail:"Co-founder of the Landscape and Human Health Laboratory. For decades he asked a single question — how do the landscapes we design shape human wellbeing? — and taught a generation to pursue it with both rigor and heart.",
    detailZh:'景觀與人類健康實驗室（LHHL）共同創辦人。數十年來，他只問一個問題——我們所設計的地景，如何形塑人的身心健康？——並教會了一整個世代，用嚴謹與溫柔去追問它。'
  },
  nodes:[
    /* ---------- GEN 1 · 直接的學生 ---------- */
    { id:'jiang', gen:1, parent:'wcs', kind:'phd',
      name:'Bin Jiang  江斌',
      role:'PhD → Associate Professor, University of Hong Kong',
      detail:"Now leads the Virtual Reality Lab for Landscape & Health at HKU — carrying the green-space-and-stress question into immersive technology, and training a new generation of his own.",
      detailZh:'現為香港大學副教授，主持景觀與健康虛擬實境實驗室，把「綠地與壓力」的提問帶進沉浸科技，並開始培養自己的下一代學生。' },

    { id:'phd_a', gen:1, parent:'wcs', kind:'phd', placeholder:true,
      name:'A doctoral student', role:'PhD · now faculty somewhere',
      detail:"Click to edit — write this person's name, where they teach now, and the one idea of Bill's they carry forward.",
      detailZh:'點此編輯——寫下這位博士生的名字、現在任教的地方，以及他們從 Sullivan 老師身上帶走、並持續傳遞的那個信念。' },

    { id:'phd_b', gen:1, parent:'wcs', kind:'phd', placeholder:true,
      name:'A doctoral student', role:'PhD · researcher / practitioner',
      detail:"Click to edit — every PhD is a whole future. Name them here.",
      detailZh:'點此編輯——每一位博士生，都是一整個未來。把他們的名字寫在這裡。' },

    { id:'ms_a', gen:1, parent:'wcs', kind:'masters', placeholder:true,
      name:"A master's student", role:"Master's · designer / planner",
      detail:"Click to edit — the ones who went into practice and quietly reshaped real cities.",
      detailZh:'點此編輯——那些走入實務、悄悄改變了真實城市的碩士生。' },

    { id:'ms_b', gen:1, parent:'wcs', kind:'masters', placeholder:true,
      name:"A master's student", role:"Master's · public sector",
      detail:"Click to edit.",
      detailZh:'點此編輯。' },

    { id:'ug_a', gen:1, parent:'wcs', kind:'undergrad', placeholder:true,
      name:'An undergraduate', role:'Took one course that changed everything',
      detail:"Click to edit — sometimes a single semester redirects a whole life. Name one.",
      detailZh:'點此編輯——有時候，一學期的課就改變了一個人的一生。寫下一個這樣的名字。' },

    { id:'ug_b', gen:1, parent:'wcs', kind:'undergrad', placeholder:true,
      name:'An undergraduate', role:'Now works in green health & design',
      detail:"Click to edit.",
      detailZh:'點此編輯。' },

    /* ---------- GEN 2 · 學生的學生 ---------- */
    { id:'g2_jiang1', gen:2, parent:'jiang', kind:'student2', placeholder:true,
      name:"Bin Jiang's student", role:"The third generation",
      detail:"A student of a student — proof that influence compounds. Click to name them.",
      detailZh:'學生的學生——影響力會複利成長的證明。點此寫下名字。' },
    { id:'g2_jiang2', gen:2, parent:'jiang', kind:'student2', placeholder:true,
      name:"Bin Jiang's student", role:"The third generation",
      detail:"Click to edit.", detailZh:'點此編輯。' },

    { id:'g2_phda', gen:2, parent:'phd_a', kind:'student2', placeholder:true,
      name:"A student's student", role:"The line continues",
      detail:"Click to edit.", detailZh:'點此編輯。' },
    { id:'g2_phdb', gen:2, parent:'phd_b', kind:'student2', placeholder:true,
      name:"A student's student", role:"The line continues",
      detail:"Click to edit.", detailZh:'點此編輯。' },

    /* ---------- GEN 3 · 成果：公司 / 研究 ---------- */
    { id:'r_lhhl', gen:3, parent:'jiang', kind:'research',
      name:'Green space & mental health',
      role:'A whole field of evidence',
      detail:"Hundreds of studies worldwide now measure how nature restores attention, lowers stress and heals — a research tradition that traces back to this lab.",
      detailZh:'今日全球已有數百項研究，量測自然如何恢復注意力、降低壓力、療癒身心——這條研究傳統，可以一路追溯回這間實驗室。' },

    { id:'r_company', gen:3, parent:'phd_a', kind:'company', placeholder:true,
      name:'A company a student founded',
      role:'Turning research into practice',
      detail:"Click to edit — a firm, a startup, a nonprofit born from what they learned here.",
      detailZh:'點此編輯——一間公司、一個新創、一個非營利組織，誕生自他們在這裡學到的東西。' },

    { id:'r_paper', gen:3, parent:'phd_b', kind:'research', placeholder:true,
      name:'A line of research carried forward',
      role:'Ideas outliving their author',
      detail:"Click to edit — name a paper, a method, a theory that students kept building on.",
      detailZh:'點此編輯——寫下一篇論文、一個方法、一套理論，被學生們持續接力、不斷向前推進。' },

    { id:'r_policy', gen:3, parent:'ms_a', kind:'company', placeholder:true,
      name:'A city that got greener',
      role:'Design that reached the ground',
      detail:"Click to edit — a park, a campus, a policy. Influence you can stand inside.",
      detailZh:'點此編輯——一座公園、一個校園、一項政策。那是你可以真正站進去的影響力。' }
  ]
};

/* ---------- kind → 顏色 / 標籤 ---------- */
const KIND = {
  center:   {c:'#f4d58d', en:'The teacher',          zh:'老師'},
  phd:      {c:'#ffd27a', en:'Doctoral student',     zh:'博士生'},
  masters:  {c:'#9ad0c2', en:"Master's student",     zh:'碩士生'},
  undergrad:{c:'#c9e4a6', en:'Undergraduate',        zh:'大學生'},
  student2: {c:'#b5a7e6', en:"A student's student",   zh:'學生的學生'},
  company:  {c:'#f2a3a3', en:'Founded / built',       zh:'創立的事業'},
  research: {c:'#87c5e8', en:'Research carried on',    zh:'延續的研究'}
};
const LEGEND_ORDER = ['phd','masters','undergrad','student2','company','research'];
