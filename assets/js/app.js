/* ===================== ENGINE ===================== */
const cv = document.getElementById('sky');
const ctx = cv.getContext('2d');
let W,H,DPR;
function resize(){
  DPR = Math.min(window.devicePixelRatio||1, 2);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = W*DPR; cv.height = H*DPR;
  cv.style.width=W+'px'; cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  layout();
}
window.addEventListener('resize', resize);

/* nodes incl. center */
const center = {...universe.center, gen:0, x:0, y:0};
const byId = {wcs:center};
universe.nodes.forEach(n=>{ byId[n.id]=n; });
const allNodes = [center, ...universe.nodes];

/* radii scale with screen */
function radii(){
  const base = Math.min(W,H);
  return [0, base*0.20, base*0.34, base*0.45];
}
function layout(){
  const R = radii();
  const g1 = universe.nodes.filter(n=>n.gen===1);
  g1.forEach((n,i)=>{ n.angle = (i/g1.length)*Math.PI*2 - Math.PI/2; n.r=R[1]; });
  [2,3].forEach(g=>{
    const gg = universe.nodes.filter(n=>n.gen===g);
    const byP={};
    gg.forEach(n=>{(byP[n.parent]=byP[n.parent]||[]).push(n);});
    Object.values(byP).forEach(group=>{
      const p = byId[group[0].parent] || center;
      const spread = Math.min(0.55, 0.22*group.length);
      group.forEach((n,i)=>{
        const off = group.length===1?0:(i/(group.length-1)-0.5)*spread;
        n.angle = (p.angle||0) + off + (g===3?0.04:0);
        n.r = R[g];
      });
    });
  });
  allNodes.forEach(n=>{
    if(n===center){n.x=0;n.y=0;return;}
    n.x=Math.cos(n.angle)*n.r;
    n.y=Math.sin(n.angle)*n.r;
  });
}

/* background stars */
const stars=[];
function makeStars(){
  stars.length=0;
  const n = Math.floor((window.innerWidth*window.innerHeight)/2600);
  for(let i=0;i<n;i++){
    stars.push({
      x:(Math.random()-0.5)*2200, y:(Math.random()-0.5)*2200,
      r:Math.random()*1.3+0.2, tw:Math.random()*Math.PI*2,
      sp:0.4+Math.random()*1.4, depth:0.3+Math.random()*0.7
    });
  }
}

/* camera */
const cam = {x:0,y:0,s:1, tx:0,ty:0,ts:1};
function recenter(){ cam.tx=0; cam.ty=0; cam.ts=1; }

/* reveal animation */
let revealStart=null;
function nodeDelay(n){
  if(n.gen===0) return 0;
  const order={1:600,2:1500,3:2300};
  const peers = universe.nodes.filter(m=>m.gen===n.gen);
  const idx = peers.indexOf(n);
  return order[n.gen] + idx*120;
}
const REVEAL_DUR=900;

function nodeAppear(n){
  if(revealStart===null) return 0;
  const t = performance.now()-revealStart-nodeDelay(n);
  return Math.max(0, Math.min(1, t/REVEAL_DUR));
}

/* node visual radius */
function nodeRadius(n){
  if(n.gen===0) return Math.max(16, Math.min(W,H)*0.022);
  if(n.gen===1) return n.kind==='phd'?9:8;
  if(n.gen===2) return 6;
  return 5.5;
}

/* world<->screen */
function w2s(x,y){ return [W/2+(x-cam.x)*cam.s, H/2+(y-cam.y)*cam.s]; }
function s2w(sx,sy){ return [cam.x+(sx-W/2)/cam.s, cam.y+(sy-H/2)/cam.s]; }

let hoverId=null, focusId=null;

/* ---------- draw ---------- */
function draw(now){
  cam.x+=(cam.tx-cam.x)*0.08;
  cam.y+=(cam.ty-cam.y)*0.08;
  cam.s+=(cam.ts-cam.s)*0.08;

  ctx.clearRect(0,0,W,H);
  // nebula
  const ng = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.75);
  ng.addColorStop(0,'#15121f');
  ng.addColorStop(0.4,'#0c0a15');
  ng.addColorStop(1,'#050409');
  ctx.fillStyle=ng; ctx.fillRect(0,0,W,H);

  // background stars (parallax with camera)
  const t = now*0.001;
  for(const st of stars){
    const px = st.x*st.depth - cam.x*st.depth*0.4;
    const py = st.y*st.depth - cam.y*st.depth*0.4;
    const sx = W/2 + px*cam.s, sy = H/2 + py*cam.s;
    if(sx<-20||sx>W+20||sy<-20||sy>H+20) continue;
    const a = 0.35+0.45*Math.sin(t*st.sp+st.tw);
    ctx.globalAlpha=a*st.depth;
    ctx.beginPath();
    ctx.arc(sx,sy,st.r*cam.s*0.8,0,Math.PI*2);
    ctx.fillStyle='#fff7e6'; ctx.fill();
  }
  ctx.globalAlpha=1;

  // connection threads
  for(const n of universe.nodes){
    const ap = nodeAppear(n);
    if(ap<=0) continue;
    const p = byId[n.parent]||center;
    const [px,py]=w2s(p.x,p.y);
    const [nx,ny]=w2s(n.x,n.y);
    const ex = px+(nx-px)*ap, ey = py+(ny-py)*ap;
    const k = KIND[n.kind]||KIND.research;
    const grad = ctx.createLinearGradient(px,py,ex,ey);
    const isHot = (hoverId===n.id||focusId===n.id||hoverId===n.parent||focusId===n.parent);
    grad.addColorStop(0, hexA(k.c, isHot?0.0:0.0));
    grad.addColorStop(0.15, hexA(k.c, isHot?0.5:0.16));
    grad.addColorStop(1, hexA(k.c, isHot?0.9:0.4));
    ctx.strokeStyle=grad;
    ctx.lineWidth=isHot?1.7:0.9;
    ctx.beginPath();
    ctx.moveTo(px,py);
    // gentle quadratic curve
    const mx=(px+ex)/2 + (py-ey)*0.06, my=(py+ey)/2 + (ex-px)*0.06;
    ctx.quadraticCurveTo(mx,my,ex,ey);
    ctx.stroke();
  }

  // nodes (far first)
  const ordered=[...allNodes].sort((a,b)=>a.gen-b.gen);
  for(const n of ordered){
    const ap = nodeAppear(n);
    if(ap<=0 && n.gen!==0) continue;
    const wob = n.gen===0?0:Math.sin(t*0.6+ (n.angle||0)*3)*3;
    const [sx,sy]=w2s(n.x + (n.gen?Math.cos(t*0.3+n.angle)*0:0), n.y+wob);
    const k = KIND[n.kind]||KIND.research;
    let rad = nodeRadius(n)*cam.s*(0.4+0.6*ap);
    const isHot = (hoverId===n.id||focusId===n.id);
    const pulse = n.gen===0 ? 1+0.06*Math.sin(t*1.4) : 1;
    rad*=pulse;
    const dim = n.placeholder?0.62:1;

    // glow halo
    const hr = rad*(n.gen===0?5:3.4)*(isHot?1.4:1);
    const hg = ctx.createRadialGradient(sx,sy,0,sx,sy,hr);
    hg.addColorStop(0, hexA(k.c, (n.gen===0?0.55:0.4)*ap*dim));
    hg.addColorStop(0.4, hexA(k.c, (n.gen===0?0.22:0.14)*ap*dim));
    hg.addColorStop(1, hexA(k.c,0));
    ctx.fillStyle=hg;
    ctx.beginPath(); ctx.arc(sx,sy,hr,0,Math.PI*2); ctx.fill();

    // core
    ctx.beginPath(); ctx.arc(sx,sy,rad,0,Math.PI*2);
    ctx.fillStyle = n.gen===0?'#fff3d4':k.c;
    ctx.globalAlpha = ap;
    ctx.fill();
    ctx.globalAlpha=1;

    // placeholder ring
    if(n.placeholder){
      ctx.beginPath(); ctx.arc(sx,sy,rad+4,0,Math.PI*2);
      ctx.strokeStyle=hexA(k.c,0.35*ap); ctx.lineWidth=1;
      ctx.setLineDash([2,3]); ctx.stroke(); ctx.setLineDash([]);
    }

    // labels: center always; others on hover/focus or when zoomed in
    const showLabel = n.gen===0 || isHot || cam.s>1.6;
    if(showLabel && ap>0.6){
      ctx.globalAlpha=Math.min(1,(ap-0.6)/0.4);
      ctx.font = (n.gen===0?'600 ':'400 ') + (n.gen===0?Math.max(15,rad*0.9):13)+"px 'Cormorant Garamond', serif";
      ctx.fillStyle = isHot? '#fff7e6' : hexA('#e9e3d4',0.85);
      ctx.textAlign='center';
      ctx.shadowColor='rgba(0,0,0,0.8)'; ctx.shadowBlur=8;
      ctx.fillText(n.name, sx, sy - rad - 10);
      ctx.shadowBlur=0;
      ctx.globalAlpha=1;
    }

    n._sx=sx; n._sy=sy; n._sr=Math.max(rad, n.gen===0?rad:10);
  }

  requestAnimationFrame(draw);
}
function hexA(hex,a){
  const h=hex.replace('#','');
  const r=parseInt(h.substring(0,2),16),g=parseInt(h.substring(2,4),16),b=parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ---------- interaction ---------- */
function hitTest(sx,sy){
  let best=null,bestD=1e9;
  for(const n of allNodes){
    if(n._sx==null) continue;
    const d=Math.hypot(sx-n._sx,sy-n._sy);
    const rr=Math.max(n._sr+8, 16);
    if(d<rr && d<bestD){bestD=d;best=n;}
  }
  return best;
}

let dragging=false, moved=false, lastX=0,lastY=0, pointers=new Map(), pinchDist=0;
cv.addEventListener('pointerdown',e=>{
  cv.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  dragging=true; moved=false; lastX=e.clientX; lastY=e.clientY;
  cv.classList.add('grabbing');
});
cv.addEventListener('pointermove',e=>{
  if(pointers.has(e.pointerId)) pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){
    const pts=[...pointers.values()];
    const d=Math.hypot(pts[0].x-pts[1].x, pts[0].y-pts[1].y);
    if(pinchDist){ cam.ts=Math.max(0.6,Math.min(4, cam.ts*(d/pinchDist))); }
    pinchDist=d; moved=true; return;
  }
  if(dragging){
    const dx=e.clientX-lastX, dy=e.clientY-lastY;
    if(Math.abs(dx)+Math.abs(dy)>3) moved=true;
    cam.tx-=dx/cam.s; cam.ty-=dy/cam.s;
    cam.x-=dx/cam.s; cam.y-=dy/cam.s;
    lastX=e.clientX; lastY=e.clientY;
  } else {
    const hit=hitTest(e.clientX,e.clientY);
    hoverId=hit?hit.id:null;
    cv.style.cursor = hit? 'pointer':'grab';
  }
});
function endPointer(e){
  pointers.delete(e.pointerId);
  if(pointers.size<2) pinchDist=0;
  dragging=false; cv.classList.remove('grabbing');
  if(!moved){
    const hit=hitTest(e.clientX,e.clientY);
    if(hit){ selectNode(hit); }
    else { closePanel(); }
  }
}
cv.addEventListener('pointerup',endPointer);
cv.addEventListener('pointercancel',endPointer);
cv.addEventListener('wheel',e=>{
  e.preventDefault();
  const f = e.deltaY<0?1.12:0.89;
  cam.ts=Math.max(0.6,Math.min(4,cam.ts*f));
},{passive:false});

/* ---------- panel ---------- */
const panel=document.getElementById('panel');
function selectNode(n){
  focusId=n.id;
  const k=KIND[n.kind]||KIND.research;
  document.getElementById('ptag').style.color=k.c;
  document.getElementById('ptagtxt').textContent = (n.gen===0? k.en : k.en+' · '+k.zh);
  document.getElementById('pname').textContent=n.name;
  document.getElementById('prole').textContent=n.role||'';
  const msgEl=document.getElementById('pmessage');
  const dEl=document.getElementById('pdetail');
  const dzEl=document.getElementById('pdetailzh');
  if(n.message){
    msgEl.textContent=n.message; msgEl.style.display='block';
    dEl.style.display='none'; dzEl.style.display='none';
  } else {
    msgEl.style.display='none';
    dEl.textContent=n.detail||''; dEl.style.display=n.detail?'block':'none';
    dzEl.textContent=n.detailZh||''; dzEl.style.display=n.detailZh?'block':'none';
  }
  const hint=document.getElementById('phint');
  hint.textContent = n.placeholder ? '✎ 範例節點 — 在 assets/js/data.js 裡換成真實的人，或刪除這顆星' : '';
  hint.style.display = n.placeholder?'block':'none';
  panel.classList.add('show');
  if(n.gen!==0){ cam.tx=n.x; cam.ty=n.y; cam.ts=Math.max(cam.ts,1.7); }
  else recenter();
}
function closePanel(){ panel.classList.remove('show'); focusId=null; }
document.getElementById('pclose').addEventListener('click',closePanel);

/* ---------- legend / counter ---------- */
function buildLegend(){
  const el=document.getElementById('legendEl');
  el.innerHTML = LEGEND_ORDER.map(key=>{
    const k=KIND[key];
    return `<div class="row"><span>${k.en}<span class="zh">${k.zh}</span></span><span class="dot" style="color:${k.c}"></span></div>`;
  }).join('');
}
function animateCount(){
  const target=universe.nodes.length;
  const el=document.getElementById('countNum');
  let c=0; const step=()=>{ c+=Math.ceil((target-c)/8); if(c>=target)c=target;
    el.textContent=c; if(c<target) setTimeout(step,60); };
  setTimeout(step,1800);
}

/* ---------- intro / ending ---------- */
document.getElementById('enter').addEventListener('click',()=>{
  document.getElementById('intro').classList.add('hide');
  revealStart=performance.now();
  ['titleTL','counterEl','legendEl','controlsEl'].forEach(id=>{
    document.getElementById(id).classList.add('show');
  });
  animateCount();
});
document.getElementById('resetBtn').addEventListener('click',()=>{ recenter(); closePanel(); });
const ending=document.getElementById('ending');
document.getElementById('endBtn').addEventListener('click',()=>{ ending.classList.add('show'); });
document.getElementById('ebackBtn').addEventListener('click',()=>{ ending.classList.remove('show'); });

/* ---------- boot ---------- */
resize(); makeStars(); buildLegend();
window.addEventListener('resize',makeStars);
requestAnimationFrame(draw);
