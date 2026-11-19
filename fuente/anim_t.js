/* ----- Plantillas de movimiento ----- */
const EXA_T = (()=>{
const {LEN, FL, AY, HY, dir, add, ang} = EXA;
const R = LEN.ua+LEN.fa;
const X = 120, BODY = LEN.th+LEN.sh+LEN.sho; // tobillo → hombro (123)
const st = (o={})=>Object.assign({h:[X,HY], t:0, a:[180,180], l:[180,180]}, o);
const T = (x,y,b)=>({t:[x,y], b:b||1});
const sub = (a,b)=>[a[0]-b[0], a[1]-b[1]];
const norm = v=>{ const L = Math.hypot(v[0],v[1])||1; return [v[0]/L, v[1]/L]; };
// cuerpo recto desde el tobillo A apuntando al hombro S
function line(A, S, legB=-1){ const u = norm(sub(S,A)); const h = add(A,u,LEN.th+LEN.sh); return {h, t:ang(u), l:T(A[0],A[1],legB)}; }
// cuerpo recto desde la rodilla K (de rodillas), espinillas atrás en el suelo
function kneel(K, S, back=-1){ const u = norm(sub(S,K)); const h = add(K,u,LEN.th); return {h, t:ang(u), l:[ang([-u[0],-u[1]]), back<0 ? 270 : 90]}; }
const shoulder = p=>add(p.h, dir(p.t), LEN.sho);
// peso en las manos
function held(w, opt={}){
  const two = opt.two;
  if (w==='db') return two ? [{k:'db',at:'W'},{k:'db',at:'W2'}] : [{k:'db',at:'W'}];
  if (w==='kb') return two ? [{k:'kb',at:'W'},{k:'kb',at:'W2'}] : [{k:'kb',at:'W'}];
  if (w==='bb') return [{k:'plate',at:'W'}];
  if (w==='band') return [{k:'band',from:opt.from||'A',at:'W'}];
  if (w==='cable') return [{k:'cable',from:opt.cfrom||[X+80,FL-10],at:'W'}];
  return [];
}
const J = (o)=>Object.assign({}, o);
const F = (x)=>[x, AY];
const mk = (k, p=[], extra={})=>Object.assign({k, p}, extra);
const out = {};

/* ===== De pie ===== */
out.stand = o=>mk([st(), st({e:1.5})], [], {s:[[1,1.6],[0,1.6]]});

/* ===== Sentadillas ===== */
function squatPoses(o){
  const fx = X+6;
  const top = st({h:[X-2,HY], t:4, l:T(fx,AY,-1), l2:T(fx,AY,-1)});
  const deep = o.deep ? 172 : 158;
  const bot = {h:[X-24, deep], t:o.upright?18:36, l:T(fx,AY,-1), l2:T(fx,AY,-1)};
  let ta = [180,180], ba = [95,95];
  if (o.hold==='goblet'){ ta = ba = [160,10]; top.ar = bot.ar = 1; ta = [165,355]; ba = [165,355]; }
  if (o.hold==='back'){ ta = ba = [200,330]; top.ar = bot.ar = 1; }
  if (o.hold==='front'){ ta = ba = [150,320]; top.ar = bot.ar = 1; }
  if (o.hold==='side'){ ta = [180,180]; ba = [175,180]; }
  if (o.hold==='press'){ ta = [0,0]; ba = [150,330]; top.ar = 0; bot.ar = 1; }
  top.a = ta; bot.a = ba;
  return [top, bot];
}
out.squat = (o)=>{
  const [top, bot] = squatPoses(o);
  const p = [];
  if (o.box) p.push({k:'box', r:[X-52, 160, 30, FL-160]});
  if (o.hold==='goblet') p.push(...held(o.w||'kb'));
  if (o.hold==='side') p.push(...held(o.w||'db'));
  if (o.hold==='back' || o.hold==='front'){ p.push({k:'plate', at:'Sc', r:12}); }
  if (o.smith) p.push({k:'line', pts:[[X-14,0],[X-14,FL]], w:2}, {k:'line', pts:[[X-6,0],[X-6,FL]], w:1});
  const A = mk([top, bot], p);
  if (o.pause) A.s = [[1,1.2],[1,1.2],[0,1],[0,.4]];
  if (o.tempo) A.s = [[1,3],[1,.4],[0,1],[0,.4]];
  if (o.hold==='press'){ A.k = [Object.assign({}, top), bot]; }
  return A;
};
out.thruster = (o)=>{
  const [top, bot] = squatPoses({hold:'press'});
  const mid = Object.assign({}, top, {a:[150,330], ar:1});
  return mk([mid, bot, top], held(o.w||'db'), {s:[[1,.9],[0,.6],[2,.5],[2,.3],[0,.6]]});
};
out.wallsit = ()=>{
  const fx = X+14;
  const p = {h:[X-26,154], t:0, a:[180,180], l:T(fx,AY,-1), l2:T(fx,AY,-1)};
  return mk([p, Object.assign({},p,{e:1})], [{k:'wall', x:X-48, w:12}], {s:[[1,1.5],[0,1.5]]});
};
out.jumpsquat = (o)=>{
  const fx = X+6;
  const bot = {h:[X-22,156], t:34, a:[200,200], l:T(fx,AY,-1), l2:T(fx,AY,-1)};
  const air = {h:[X,HY-26], t:0, a:[20,20], l:[178,182], f:40};
  const land = {h:[X-8,HY+6], t:12, a:[120,120], l:T(fx,AY,-1)};
  if (o.broad){ air.h = [X+10, HY-22]; air.t = 25; air.a=[60,60]; }
  return mk([bot, air, land], [], {s:[[1,.38],[2,.42],[0,.7],[0,.3]]});
};
out.sissy = ()=>{
  const fx = X+2;
  const top = st({h:[X,HY], t:0, a:[90,90], l:T(fx,AY,-1), f:60});
  const bot = {h:[X+22,150], t:-22, a:[90,90], l:T(fx,AY-6,-1), f:40};
  return mk([top, bot], [{k:'post', at:[X+70,100]}]);
};
out.pistol = (o)=>{
  const fx = X+4;
  const top = st({h:[X-2,HY], t:4, a:[110,110], l:T(fx,AY,-1), l2:[150,150]});
  const bot = {h:[X-22, o.box?156:170], t:42, a:[92,92], l:T(fx,AY,-1), l2:[95,95]};
  const p = [];
  if (o.box) p.push({k:'box', r:[X-48, 160, 32, FL-160]});
  if (o.assist){ p.push({k:'post', at:[X+62,118]}); top.a = T(X+62,118,1); bot.a = T(X+58,122,1); }
  if (o.rings){ top.a = T(X+50,100,1); bot.a = T(X+46,126,1); p.push({k:'rings', at:'W', y:0}); }
  if (o.skater){ top.l2 = [190,270]; bot.l2 = [180,275]; bot.h = [X-14,158]; bot.t = 40; }
  return mk([top, bot], p);
};
out.cossack = ()=>{
  const L = T(X-52,AY,1), R = T(X+52,AY,-1);
  const mid = {h:[X,128], t:0, a:[160,150], a2:[200,210], l:L, l2:R};
  const left = {h:[X-34,166], t:8, a:[120,120], a2:[240,240], l:T(X-52,AY,1), l2:T(X+52,AY,-1), f2:-60};
  const right = {h:[X+34,166], t:-8, a:[120,120], a2:[240,240], l:T(X-52,AY,1), l2:T(X+52,AY,-1), f:60};
  return mk([mid, left, mid, right], [], {v:'f', s:[[1,1],[1,.4],[2,1],[3,1],[3,.4],[0,1]]});
};
out.legpress = (o)=>{
  const hip = [X-34,150];
  const top = {h:hip, t:-58, a:[150,170], l:T(X+28,88,-1), l2:T(X+28,88,-1), f:20};
  const bot = {h:hip, t:-58, a:[150,170], l:T(X-2,108,-1), l2:T(X-2,108,-1), f:20};
  if (o.single) { top.l2 = bot.l2 = [90,200]; }
  if (o.calf){ top.l = top.l2 = T(X+30,86,-1); bot.l = bot.l2 = T(X+30,86,-1); top.f = -10; bot.f = 40; }
  const p = [{k:'poly', pts:[[X-80,FL],[X-80,156],[X-18,156],[X-12,FL]]}, {k:'poly', pts:[[X-90,150],[X-66,104],[X-56,110],[X-78,156]]}, {k:'plat', at:'A'}];
  return mk([bot, top], p);
};
out.hack = (o)=>{
  const fx = X+20;
  const top = {h:[X-12,HY+2], t:-16, a:[200,330], ar:1, l:T(fx,AY-8,-1), l2:T(fx,AY-8,-1)};
  const bot = {h:[X-30,156], t:-16, a:[200,330], ar:1, l:T(fx,AY-8,-1), l2:T(fx,AY-8,-1)};
  return mk([top, bot], [{k:'poly', pts:[[X-58,60],[X-44,58],[X-14,184],[X-28,186]]}, {k:'poly', pts:[[X+4,FL],[X+44,FL-14],[X+48,FL],[X+4,FL+1]]}, {k:'pad', at:'S', d:[-2,-6], r:6}]);
};
out.legext = ()=>{
  const seat = {h:[X-10,150], t:-6, a:[170,120], l:[90,180]};
  const up = Object.assign({}, seat, {l:[90,96]});
  return mk([seat, up], [{k:'poly', pts:[[X-30,154],[X+14,154],[X+14,166],[X-30,166]]}, {k:'poly', pts:[[X-36,96],[X-26,96],[X-22,158],[X-32,158]]}, {k:'line', pts:[[X-8,166],[X-8,FL]], w:4}, {k:'pad', at:'A', d:[2,-4], r:6}]);
};
out.legcurl = (o)=>{
  if (o.seated){
    const a = {h:[X-20,148], t:-8, a:[170,120], l:[90,90]}; const b = Object.assign({}, a, {l:[90,200]});
    return mk([a, b], [{k:'poly', pts:[[X-40,152],[X+8,152],[X+8,164],[X-40,164]]}, {k:'poly', pts:[[X-46,96],[X-36,96],[X-32,156],[X-42,156]]}, {k:'line', pts:[[X-16,164],[X-16,FL]], w:4}, {k:'pad', at:'A', d:[0,-6], r:6}, {k:'pad', at:'K', d:[-8,-8], r:5}]);
  }
  const a = {h:[X-10,150], t:96, a:[150,140], l:[270,270], hd:-10};
  const b = Object.assign({}, a, {l:[270,25]});
  return mk([a, b], [{k:'box', r:[X-80,158,140,10]}, {k:'line', pts:[[X-10,168],[X-10,FL]], w:4}, {k:'pad', at:'A', d:[2,4], r:6}]);
};
out.machinefront = (o)=>{
  // abductores / aductores, vista frontal sentado
  const open = {h:[X,152], t:0, a:[200,195], a2:[160,165], l:[205,180], l2:[155,180], ls:.75, ls2:.75};
  const close = {h:[X,152], t:0, a:[200,195], a2:[160,165], l:[178,180], l2:[182,180], ls:.75, ls2:.75};
  const k = o.add ? [open, close] : [close, open];
  return mk(k, [{k:'box', r:[X-26,152,52,14]}, {k:'pad', at:'K', d:[-6,0], r:5}, {k:'pad', at:'K2', d:[6,0], r:5}], {v:'f'});
};
out.bandwalk = ()=>{
  const a = {h:[X,138], t:6, a:[170,150], a2:[190,210], l:T(X-14,AY,1), l2:T(X+14,AY,-1)};
  const b = {h:[X,138], t:6, a:[170,150], a2:[190,210], l:T(X-30,AY,1), l2:T(X+30,AY,-1)};
  return mk([a, b], [{k:'line', pts:['K','K2'], w:3}], {v:'f'});
};

/* ===== Zancadas ===== */
out.lunge = (o)=>{
  const ff = X+32, bf = X-40;
  const top = {h:[X-4,HY+2], t:2, a:[180,180], l:T(ff,AY,-1), l2:T(bf,AY-2,-1), f2:30};
  const bot = {h:[X-6,152], t:4, a:[180,180], l:T(ff,AY,-1), l2:T(bf,AY-2,-1), f2:40};
  const p = [];
  if (o.bulgarian){ top.l2 = T(X-50,150,-1); bot.l2 = T(X-50,150,-1); top.f2 = bot.f2 = 60; top.h=[X-2,HY+4]; bot.h=[X-6,150]; p.push({k:'box', r:[X-78,154,40,FL-154]}); }
  if (o.w==='db'){ p.push(...held('db')); }
  if (o.jump){ const air = {h:[X-4,HY-20], t:2, a:[150,150], l:[170,200], l2:[190,170], f2:40}; return mk([bot, air, Object.assign({}, bot, {l:T(ff,AY,-1)})], p, {s:[[1,.4],[2,.4],[2,.2],[0,.7],[0,.3]]}); }
  if (o.cossack) return out.cossack();
  return mk([top, bot], p);
};
out.stepup = (o)=>{
  const box = [X+6, 154, 50, FL-154];
  const a = {h:[X-12,HY+8], t:14, a:[180,180], l:T(X+26,152,-1), l2:T(X-20,AY,-1)};
  const b = {h:[X+20,154-LEN.th-LEN.sh-2], t:2, a:[180,180], l:T(X+26,152,-1), l2:[120,200]};
  const p = [{k:'box', r:box}];
  if (o.w) p.push(...held(o.w));
  return mk([a, b], p);
};
out.hipflex = ()=>{
  const a = {h:[X-12,150], t:0, a:[180,180], l:T(X+40,AY,-1), l2:[200,270]};
  const b = {h:[X-2,154], t:-6, a:[0,0], l:T(X+40,AY,-1), l2:[210,270]};
  return mk([a, b], [], {s:[[1,1.6],[1,1.2],[0,1.4],[0,.4]]});
};

/* ===== Bisagra de cadera ===== */
out.hinge = (o)=>{
  const fx = X+4, w = o.w;
  const top = st({h:[X-2,HY], t:4, l:T(fx,AY,-1), l2:T(fx,AY,-1), a:[176,178]});
  const bot = {h:[X-26, o.dl?146:HY-4], t:o.dl?62:80, l:T(fx,AY,-1), l2:T(fx,AY,-1), a:[180,180]};
  if (o.gm){ top.a = bot.a = [330,150]; top.ar = bot.ar = 1; bot.t = 78; }
  if (o.single){ bot.l2 = [272,272]; bot.t = 86; bot.h = [X-14,HY-2]; top.l2 = [190,195]; }
  if (o.dl){ bot.a = T(fx+2, 172, 1); top.a = [178,178]; }
  const p = [];
  if (w==='bb' || o.dl&&!w) p.push({k:'plate', at:'W', r:o.dl?16:13});
  else if (w) p.push(...held(w));
  if (o.tbar) p.push({k:'stick', a:[X-60,FL-2], b:'W', ext:6});
  return mk([top, bot], p);
};
out.swing = ()=>{
  const fx = X+6;
  const bot = {h:[X-26,HY-2], t:72, a:[205,205], l:T(fx,AY,-1)};
  const top = st({h:[X,HY], t:-2, a:[88,88], l:T(fx,AY,-1)});
  return mk([bot, top], [{k:'kb', at:'W'}], {s:[[1,.55],[1,.15],[0,.55],[0,.1]]});
};
out.nordic = ()=>{
  const K = [X-30, FL-6];
  const a = Object.assign(kneel(K, [X-28, 60]), {a:[160,30], ar:0});
  const b = Object.assign(kneel(K, [X+70, 150]), {a:T(X+70,186,1)});
  a.a = [170,20];
  return mk([a, b], [{k:'pad', at:'A', d:[-4,-6], r:5}], {s:[[1,3],[1,.3],[0,1.1],[0,.4]]});
};
out.bridge = (o)=>{
  // tumbado boca arriba, cabeza a la derecha
  const S = [X+30, FL-8];
  const fx = X-48;
  const mkP = (hy)=>{ const h = [X-14, hy]; return {h, t:ang(sub(S,h)), a:[260,270], l:T(fx,AY,1), l2:T(fx,AY,1), f:90}; };
  const bot = mkP(FL-10), top = mkP(o.hold?146:148);
  top.t = ang(sub(S, top.h));
  const p = [];
  if (o.single){ top.l2 = [ang(sub(top.h,S))+0, ang(sub(top.h,S))]; bot.l2 = [300,300]; }
  if (o.bench){ const Sb = [X+30, 160]; const mk2 = (hy)=>{ const h=[X-14,hy]; return {h, t:ang(sub(Sb,h)), a:[260,270], l:T(fx,AY,1), l2:T(fx,AY,1)}; };
    const b1 = mk2(180), b2 = mk2(156); b2.t = 92; if (o.single){ b1.l2=[300,300]; b2.l2=[275,275]; }
    p.push({k:'box', r:[X+20, 164, 60, FL-164]}); if (o.bar) p.push({k:'plate', at:'H', r:12}); return mk([b1, b2], p, {m:1}); }
  if (o.curl){ const a1 = {h:[X-20,FL-10], t:86, a:[260,270], l:T(X-90,AY,1), l2:T(X-90,AY,1)}; const a2 = {h:[X-14,152], t:ang(sub(S,[X-14,152])), a:[260,270], l:T(fx,AY,1), l2:T(fx,AY,1)}; return mk([a1,a2], o.rings?[{k:'rings', at:'A', y:0}]:[{k:'pad', at:'A', d:[-3,4], r:4}], {m:1}); }
  const A = mk([bot, top], p, {m:1});
  if (o.hold) A.s = [[1,1],[1,2.4],[0,1],[0,.4]];
  return A;
};
out.hyper = (o)=>{
  if (o.reverse){
    const a = {h:[X-6,150], t:90, a:[180,180], l:[180,180], hd:10};
    const b = Object.assign({}, a, {l:[275,275]});
    return mk([a, b], [{k:'box', r:[X-14,152,90,FL-152]}]);
  }
  if (o.machine){
    const a = {h:[X-12,128], t:150, a:[130,30], ar:0, l:T(X-58,AY-4,1), hd:10};
    const b = {h:[X-12,128], t:46, a:[150,20], l:T(X-58,AY-4,1)};
    a.a = [200,330]; a.ar = 1; b.a = [200,330]; b.ar = 1;
    return mk([a, b], [{k:'poly', pts:[[X-20,136],[X-4,120],[X+4,128],[X-12,144]]}, {k:'line', pts:[[X-10,140],[X-40,FL]], w:4}, {k:'pad', at:'A', d:[6,-4], r:5}]);
  }
  // en el suelo (superman)
  const a = {h:[X-10,FL-8], t:90, a:[90,90], l:[270,270]};
  const b = {h:[X-10,FL-8], t:78, a:[78,78], l:[282,282], hd:-10};
  return mk([a, b], [], {s:[[1,.9],[1,1],[0,.9],[0,.4]]});
};
out.kickback = ()=>{
  const fx = X+10;
  const a = {h:[X-6,HY-2], t:40, a:T(X+50,120,1), l:T(fx,AY,-1), l2:[178,180]};
  const b = Object.assign({}, a, {l2:[245,250]});
  return mk([a, b], [{k:'cable', from:[X+20,FL-8], at:'A2'}, {k:'post', at:[X+54,118]}]);
};

/* ===== Gemelos ===== */
out.calf = (o)=>{
  const down = st({h:[X,HY], f:90});
  const up = st({h:[X,HY-9], f:38});
  const p = [];
  if (o.step){ down.h = [X,HY-12]; up.h = [X,HY-22]; down.f = 110; p.push({k:'box', r:[X-6,FL-12,40,12]}); }
  if (o.machine) p.push({k:'pad', at:'Sc', d:[0,-5], r:6}, {k:'line', pts:[[X-26,0],[X-26,FL]], w:3});
  if (o.seated){
    const a = {h:[X-28,150], t:4, a:[150,150], l:[90,180], f:90}; const b = Object.assign({}, a, {h:[X-28,146], l:[86,182], f:40});
    return mk([a,b], [{k:'box', r:[X-52,154,40,FL-154]}, {k:'pad', at:'K', d:[2,-7], r:5}]);
  }
  if (o.hop){ const air = st({h:[X,HY-14], f:40}); return mk([down, air], [], {s:[[1,.22],[0,.22]], lin:1}); }
  if (o.tib){ const a = {h:[X-8,HY-4], t:-14, a:[180,180], l:T(X+16,AY,-1), f:90}; const b = Object.assign({}, a, {f:128}); return mk([a,b], [{k:'wall', x:X-40, w:12}]); }
  return mk([down, up], p);
};

/* ===== Flexiones ===== */
function pushPoses(o){
  const hy = o.hands!=null ? o.hands : 0;     // altura de las manos sobre el suelo
  const fy = o.feet!=null ? o.feet : 0;       // altura de los pies
  const handY = FL - hy - 1;
  const A = [o.knees ? X-50 : X-82, FL - fy - 4];
  const reach = (o.knees ? LEN.th+LEN.sho : BODY);
  const topDy = R-1, botDy = o.deficit ? -2 : 14;
  // altura del hombro arriba/abajo y solución del ángulo del cuerpo
  const solveS = (dy, xoff=0)=>{ const sy = handY - dy; let sin = (A[1]-sy)/reach; sin = Math.max(-0.95, Math.min(0.95, sin)); const cos = Math.sqrt(1-sin*sin); return [A[0]+reach*cos+xoff, sy]; };
  const St = solveS(topDy), Sb = solveS(botDy);
  const hx = St[0] + (o.planche ? -24 : 0);
  const mkP = (S)=>{ const b = o.knees ? kneel(A, S) : line(A, S); return Object.assign(b, {a:T(hx, handY, 1), hd:o.knees?0:4}); };
  let top = mkP(o.planche ? [St[0]+6, St[1]+3] : St), bot = mkP(o.planche ? [Sb[0]+4, Sb[1]] : Sb);
  return {top, bot, hx, handY, A};
}
out.pushup = (o)=>{
  const {top, bot, hx, handY, A} = pushPoses(o);
  const p = [];
  if (o.hands){ p.push({k:'box', r:[hx-20, FL-o.hands, 44, o.hands]}); }
  if (o.feet){ p.push({k:'box', r:[A[0]-26, FL-o.feet, 40, o.feet]}); }
  if (o.deficit){ p.push({k:'box', r:[hx-8, FL-8, 16, 8]}); }
  if (o.rings){ p.push({k:'rings', at:'W', y:0}); }
  if (o.weight){ p.push({k:'plate', at:'H', r:9, top:1}); }
  if (o.wall){ const W = [X+44, 90]; const Af = [X-30, AY-2]; const t1 = line(Af, [X+28, 82]); const t2 = line(Af, [X+38, 74]);
    t1.a = T(X+50, 82, 1); t2.a = T(X+50, 82, 1); t1.f = t2.f = 50; t2.t += 0;
    const b1 = line(Af, [X+16, 98]); b1.a = T(X+50,88,1); b1.f = 50; const tt = line(Af, [X+14,96]); tt.a = T(X+50,90,1);
    const top2 = line(Af,[X+4,90]); top2.a = T(X+50,90,1); top2.f = 50;
    const bot2 = line(Af,[X+26,104]); bot2.a = T(X+50,96,1); bot2.f = 50;
    return mk([top2, bot2], [{k:'wall', x:X+52, w:12}]);
  }
  let k = [top, bot], s;
  if (o.oneArm){ top.a2 = bot.a2 = [300,320]; top.ar = 0; }
  if (o.legUp){ top.l2 = bot.l2 = [ang(sub(top.h, A)) - 180 + 360 - 8, ang(sub(top.h, A)) - 180 + 360 - 8]; top.l2 = [282,282]; bot.l2 = [272,272]; }
  if (o.spider){ bot.l2 = [60, 250]; }
  if (o.tpush){ const tp = Object.assign({}, top, {a2:[0,0], as2:1}); k = [top, bot, top, tp]; s = [[1,.9],[0,.9],[3,.8],[3,.4],[0,.8]]; }
  if (o.archer){ top.a2 = bot.a2 = [160,160]; top.as2 = .9; bot.a2 = [150,150]; bot.as2 = .7; }
  if (o.explosive || o.clap || o.superman || o.chest){
    const air = Object.assign({}, top, {h:add(top.h,[0,-16]), a:o.clap||o.chest ? [140,40] : T(hx, handY-18, 1)});
    if (o.superman){ air.h = add(top.h,[0,-14]); air.l = T(A[0]+2, A[1]-14, -1); air.a = [70,70]; }
    if (o.chest){ air.a = [175,40]; }
    k = [top, bot, air]; s = [[1,.9],[0,.35],[2,.3],[0,.3],[0,.4]];
  }
  if (o.hindu){
    const pike = Object.assign(line(A, [X+18, 132]), {a:T(hx-6, handY, 1)});
    pike.h = [X-26, 98]; pike.t = 130; pike.l = T(A[0], A[1], -1);
    const low = Object.assign({}, bot, {hd:-6});
    const cobra = {h:[X-2,176], t:62, a:T(hx-6,handY,1), l:T(A[0],A[1],-1), hd:-30};
    k = [pike, low, cobra]; s = o.dive ? [[1,.8],[2,.8],[2,.4],[1,.8],[0,.8],[0,.3]] : [[1,.8],[2,.8],[2,.4],[0,.9],[0,.3]];
  }
  if (o.typewriter){ k = [top, bot, Object.assign({}, bot, {h:add(bot.h,[-8,0])}), bot]; s = [[1,.9],[2,.8],[3,.8],[0,.9],[0,.3]]; }
  const A2 = mk(k, p); if (s) A2.s = s;
  if (o.pause) A2.s = [[1,1],[1,1.2],[0,.9],[0,.4]];
  if (o.neg) A2.s = [[1,3],[1,.3],[0,1.2],[0,.4]];
  return A2;
};
out.pike = (o)=>{
  const p = [];
  if (o.feet){
    const hx = X+29, Af = [X-54, FL-o.feet-4];
    const top = {h:[X+12,95], t:170, a:T(hx, FL-1, 1), l:T(Af[0], Af[1], 1), f:0, hd:-10};
    const bot = {h:[X+12,118], t:172, a:T(hx, FL-1, 1), l:T(Af[0], Af[1], 1), f:0, hd:-10};
    p.push({k:'box', r:[Af[0]-26, FL-o.feet, 44, o.feet]});
    return mk([top, bot], p);
  }
  const Af = [X-46, FL-4], hx = X+54;
  const top = {h:[X-13,119], t:137.7, a:T(hx, FL-1, 1), l:T(Af[0], Af[1], 1), f:-20, hd:-10};
  const bot = {h:[X-1,126], t:160, a:T(hx, FL-1, 1), l:T(Af[0], Af[1], 1), f:-20, hd:-10};
  if (o.rings) p.push({k:'rings', at:'A', y:0});
  return mk([top, bot], p);
};
out.handstand = (o)=>{
  const hx = X, hy = FL-1;
  const top = {h:[X-2, hy-R-LEN.sho], t:180, a:T(hx, hy, 1), l:[o.wall?6:0, o.wall?8:0], hd:0, f:-90};
  top.a = T(hx, hy, -1);
  const bot = Object.assign({}, top, {h:[X+6, hy-14-LEN.sho], t:172});
  const p = []; if (o.wall) p.push({k:'wall', x:X+30, w:12});
  if (o.hspu) { return mk([top, bot], p, {s: o.neg ? [[1,3],[1,.3],[0,1],[0,.5]] : null}); }
  if (o.walk){
    const Af = [X+36, FL-4];
    const plank = Object.assign(line([X+30, FL-4], [X-80, FL-R]), {a:T(X-84, hy, -1)});
    plank.l = T(X+30, FL-4, 1);
    const mid = {h:[X+10, 100], t:-120, a:T(X-38, hy, -1), l:T(X+30, 70, 1)};
    const up = Object.assign({}, top, {h:[X+4, hy-R-LEN.sho], l:[8,10]});
    return mk([plank, mid, up], [{k:'wall', x:X+32, w:12}], {s:[[1,1.4],[2,1.4],[2,.8],[1,1.2],[0,1.2],[0,.5]]});
  }
  return mk([top, Object.assign({}, top, {h:add(top.h,[1,0]), t:181})], p, {s:[[1,1.3],[0,1.3]]});
};

/* ===== Planchas y core en el suelo ===== */
out.plank = (o)=>{
  const A = [o.knees? X-44 : X-80, FL-4];
  const sy = FL - LEN.ua - 4;
  const reach = o.knees ? LEN.th+LEN.sho : BODY;
  const sin = (A[1]-sy)/reach, cos = Math.sqrt(1-sin*sin);
  const S = [A[0]+reach*cos, sy];
  const b = o.knees ? kneel(A, S) : line(A, S);
  let p0 = Object.assign({}, b, {a:[180,90], hd:6});
  if (o.high){ const S2 = [X+38, FL-R]; const b2 = line(A, S2); p0 = Object.assign(b2, {a:T(S2[0], FL-1, 1), hd:4}); }
  const p1 = Object.assign({}, p0, {e:1});
  if (o.taps){ const tap = Object.assign({}, p0, {a2:[200,320]}); return mk([p0, tap], [], {s:[[1,.5],[1,.3],[0,.5],[0,.3]]}); }
  if (o.climb){ const k1 = Object.assign({}, p0, {l:[110,220]}); const k2 = Object.assign({}, p0, {l2:[110,220]}); return mk([k1, k2], [], {s:[[1,.32],[0,.32]]}); }
  if (o.wheel){
    const K = [X-40, FL-6];
    const inP = Object.assign(kneel(K, [X-24, 96]), {a:T(X+4, FL-10, 1)});
    const outP = Object.assign(kneel(K, [X+40, 150]), {a:T(X+84, FL-10, 1)});
    return mk([inP, outP], [{k:'wheel', at:'W'}], {s:[[1,1.5],[1,.4],[0,1.3],[0,.4]]});
  }
  if (o.fallout){
    const K = [X-40, FL-6];
    const inP = Object.assign(kneel(K, [X-24, 96]), {a:T(X+4, 110, 1)});
    const outP = Object.assign(kneel(K, [X+40, 140]), {a:T(X+92, 110, 1)});
    return mk([inP, outP], [{k:'rings', at:'W', y:0}], {s:[[1,1.5],[1,.4],[0,1.3],[0,.4]]});
  }
  if (o.lean){ const S2 = [X+48, FL-R+2]; const b2 = line(A, S2); const pa = Object.assign(b2, {a:T(X+30, FL-1, 1), hd:4}); const S3 = [X+60, FL-46]; const pb = Object.assign(line([A[0]+10, A[1]], S3), {a:T(X+30, FL-1, 1), hd:4}); return mk([pa, pb], [], {s:[[1,1.4],[1,1.2],[0,1.2],[0,.4]]}); }
  return mk([p0, p1], [], {s:[[1,1.6],[0,1.6]]});
};
out.ringknees = (o)=>{
  const A = [X-80, FL-24];
  const S = [X+38, FL-R];
  const p0 = Object.assign(line(A, S), {a:T(S[0], FL-1, 1), hd:4});
  const p1 = o.pike ? {h:[X-12, 98], t:128, a:T(S[0], FL-1, 1), l:T(X-48, FL-30, 1), f:0} : Object.assign({}, p0, {h:add(p0.h,[8,-6]), l:T(X-30, FL-30, 1), t:p0.t+6});
  p1.l = o.pike ? T(X-48, FL-24, 1) : {t:[X-26, FL-24], b:1};
  return mk([p0, p1], [{k:'rings', at:'A', y:0}]);
};
out.sideplank = (o)=>{
  // vista frontal: cuerpo inclinado apoyado en el antebrazo de abajo, brazo de arriba al techo
  const p0 = {h:[X-8.5,167], t:73, a:[0,0], a2:[180,100], as2:1, l:T(X-88,FL-14,-1), l2:T(X-84,FL-4,-1), f:0, f2:0};
  const pr = [];
  if (o.leg) p0.l = [280,280];
  if (o.cph){ pr.push({k:'box', r:[X-104, FL-30, 34, 30]}); p0.h = [X-6,150]; p0.t = 66; p0.l = T(X-90, FL-34, -1); p0.l2 = [220,200]; }
  const p1 = Object.assign({}, p0, {h:add(p0.h,[0,-3]), t:p0.t-1});
  return mk([p0, p1], pr, {v:'f', s:[[1,1.5],[0,1.5]]});
};
out.hollow = (o)=>{
  const h = [X-10, FL-9];
  const p0 = {h, t:76, a:[78,78], l:[282,282], hd:-10};
  if (o.knees){ p0.l = [330,260]; }
  if (o.arch){ const a = {h, t:80, a:[80,80], l:[278,278], hd:-18}; return mk([a, Object.assign({}, a, {e:1})], [], {s:[[1,1.5],[0,1.5]]}); }
  if (o.rock){ const a = Object.assign({}, p0, {h:[X-14,FL-11], t:70, l:[288,288]}); const b = Object.assign({}, p0, {h:[X-6,FL-11], t:84, l:[276,276]}); return mk([a,b], [], {m:1, s:[[1,.6],[0,.6]]}); }
  return mk([p0, Object.assign({}, p0, {e:1})], [], {m:1, s:[[1,1.5],[0,1.5]]});
};
out.deadbug = ()=>{
  const h = [X-10, FL-9];
  const a = {h, t:90, a:[0,0], a2:[0,0], l:[0,270], l2:[0,270]};
  const b = Object.assign({}, a, {a:[80,80], l2:[268,268]});
  return mk([a, b], [], {m:1});
};
out.birddog = ()=>{
  const a = {h:[X-22,151], t:80, a:T(X+21,FL-1,1), a2:T(X+21,FL-1,1), l:[180,270], l2:[180,270], hd:6};
  const b = Object.assign({}, a, {a:[84,84], l2:[272,272]});
  return mk([a, b], [], {s:[[1,1],[1,1],[0,1],[0,.4]]});
};
out.quad = (o)=>{
  // cuadrupedia: gato-camello, muñecas, rotación torácica, oso
  const a = {h:[X-22,151], t:80, a:T(X+21,FL-1,1), l:[180,270], hd:6};
  if (o.cat){ const c1 = Object.assign({}, a, {cv:-9, hd:40, h:[X-22,149]}); const c2 = Object.assign({}, a, {cv:7, hd:-30, h:[X-22,153]}); return mk([c1, c2], [], {s:[[1,1.6],[1,.5],[0,1.6],[0,.5]]}); }
  if (o.wrist){ const b = Object.assign({}, a, {h:[X-8,151], t:76}); return mk([a, b], [], {s:[[1,1.2],[0,1.2]]}); }
  if (o.thoracic){ const r1 = Object.assign({}, a, {a2:T(X+21,FL-1,1), a:[160,330]}); const r2 = Object.assign({}, a, {a2:T(X+21,FL-1,1), a:[350,310], hd:-30}); return mk([r1, r2], [], {s:[[1,1.4],[1,.6],[0,1.4],[0,.4]]}); }
  if (o.bear){ const b1 = {h:[X-22,138], t:78, a:T(X+24,FL-1,1), a2:T(X+12,FL-1,1), l:T(X-26,AY,-1), l2:T(X-40,AY,-1), hd:6, f:40, f2:40};
    const b2 = Object.assign({}, b1, {a:T(X+12,FL-1,1), a2:T(X+24,FL-1,1), l:T(X-40,AY,-1), l2:T(X-26,AY,-1)}); return mk([b1, b2], [], {s:[[1,.5],[0,.5]]}); }
  return mk([a, Object.assign({}, a, {e:1})]);
};
out.crunch = (o)=>{
  const h = [X-16, FL-9];
  const knees = T(X-62, AY, 1);
  const a = {h, t:92, a:[300,170], ar:1, l:knees, l2:knees, f:90};
  const b = Object.assign({}, a, {t:58, hd:20});
  if (o.reverse){ const r1 = {h, t:92, a:[270,270], l:[350,250]}; const r2 = {h:[X-10,FL-14], t:96, a:[270,270], l:[40,300]}; return mk([r1, r2], [], {m:1}); }
  if (o.vup){ const v1 = {h, t:88, a:[86,86], l:[272,272]}; const v2 = {h:[X-6,FL-6], t:38, a:[330,330], l:[318,318]}; return mk([v1, v2], [], {m:1}); }
  if (o.cable){ const K = [X-10, FL-6]; const c1 = Object.assign(kneel(K, [X-4, 80]), {a:[330,150], ar:1}); const c2 = Object.assign(kneel(K, [X+34, 130]), {a:[330,150], ar:1, hd:30}); c1.l[1] = c2.l[1] = 270; return mk([c1, c2], [{k:'cable', from:[X+10, 6], at:'W'}], {}); }
  return mk([a, b], [], {m:1});
};
out.twist = ()=>{
  const base = {h:[X,FL-10], l:[205,140], l2:[155,220], ls:.75, ls2:.75, f:0, f2:0};
  const a = Object.assign({}, base, {t:-14, a:T(X-34,FL-14,1), a2:T(X-30,FL-10,1)});
  const b = Object.assign({}, base, {t:14, a:T(X+30,FL-10,-1), a2:T(X+34,FL-14,-1)});
  return mk([a, b], [], {v:'f', s:[[1,.7],[0,.7]]});
};
out.pallof = ()=>{
  const fx = X+6;
  const a = st({h:[X,HY+4], t:2, l:T(fx,AY,-1), a:T(X+16, 70, 1)});
  const b = Object.assign({}, a, {a:T(X+50, 68, 1)});
  return mk([a, b], [{k:'band', from:[X-60, 68], at:'W'}], {s:[[1,.8],[1,1.2],[0,.8],[0,.4]]});
};

/* ===== Colgado de barra / anillas ===== */
const BAR = [X+4, 14];
function hangPoses(o){
  const bar = o.bar || BAR;
  const bot = {h:[bar[0]-3, bar[1]+R+LEN.sho+(o.dead?5:0)+1], t:3, a:T(bar[0], bar[1], 1), l:[172,205], e:o.dead?5:0};
  const top = {h:[bar[0]-16, bar[1]+20+LEN.sho], t:2, a:T(bar[0], bar[1], -1), l:[170,208], hd:-4};
  return {bot, top, bar};
}
out.hang = (o)=>{
  const {bot, bar} = hangPoses(o);
  const p = [o.rings ? {k:'rings', at:'W', y:0} : {k:'bar', p:bar}];
  if (o.scap){ const up = Object.assign({}, bot, {h:[bot.h[0], bar[1]+R+LEN.sho-3+1], e:-3}); const dn = Object.assign({}, bot, {e:5, h:[bot.h[0], bar[1]+R+LEN.sho+5+1]}); return mk([dn, up], p, {nofloor:1}); }
  if (o.inverted){ const inv = {h:[bar[0]-2, bar[1]-4], t:178, a:T(bar[0], bar[1]+3, 1), l:[2,0]}; inv.h = [bar[0]+2, 108]; inv.t = 180; inv.a = T(bar[0]+8, 118, 1); return mk([inv, Object.assign({}, inv, {e:1})], [{k:'rings', at:'W', y:0}], {s:[[1,1.5],[0,1.5]], nofloor:1}); }
  const h0 = bot.h, e0 = o.active?-2:5;
  return mk([Object.assign({}, bot, {e:e0, h:[h0[0], bar[1]+R+LEN.sho+e0+1]}), Object.assign({}, bot, {e:e0-1, h:[h0[0], bar[1]+R+LEN.sho+e0]})], p, {s:[[1,1.6],[0,1.6]], nofloor:1});
};
out.pullup = (o)=>{
  const {bot, top, bar} = hangPoses(o);
  const p = [];
  if (o.rings) p.push({k:'rings', at:'W', y:0}); else p.push({k:'bar', p:bar});
  if (o.L){ bot.l = top.l = [92,92]; }
  if (o.band) p.unshift({k:'band', from:bar, at:'A'});
  if (o.chest){ top.h = add(top.h,[-2,12]); top.t = -16; }
  if (o.machine){ bot.l = top.l = [180,270]; p.push({k:'pad', at:'K', d:[0,8], r:7}, {k:'line', pts:[[X+50,0],[X+50,FL]], w:3}); }
  if (o.archer){
    const L = [X-56, 14], R = [X+56, 14];
    const a = {h:[X, 14+LEN.ua+LEN.fa+LEN.sho-14], t:0, a:T(L[0],L[1],1), a2:T(R[0],R[1],-1), l:[178,182], l2:[182,178]};
    const b = {h:[X-34, 74], t:-4, a:T(L[0],L[1],1), a2:T(R[0],R[1],-1), l:[178,182], l2:[182,178]};
    return mk([a, b], [{k:'line', pts:[[X-80,14],[X+80,14]], w:4}], {v:'f', nofloor:1});
  }
  if (o.oneArm){ top.a2 = bot.a2 = T(bar[0]-4, bar[1]+R-2, 1); p.push({k:'band', from:bar, at:'W2'}); }
  const A = mk([bot, top], p, {nofloor:!o.machine});
  if (o.neg) A.s = [[0,3.4],[0,.3],[1,.7],[1,.3]];
  if (o.hold) A.s = [[1,.8],[1,2.4],[0,.8],[0,.4]];
  if (o.tempo) A.s = [[1,2.4],[1,1],[0,3.2],[0,.4]];
  if (o.neg){ A.k = [top, bot]; A.s = [[1,3.4],[1,.3],[0,.7],[0,.3]]; }
  return A;
};
out.muscleup = (o)=>{
  const bar = [X+4, 70];
  const hang = {h:[bar[0]-6, bar[1]+R+LEN.sho-2], t:4, a:T(bar[0],bar[1],1), l:[175,255]};
  const pull = {h:[bar[0]-10, bar[1]+8+LEN.sho], t:10, a:T(bar[0],bar[1],-1), l:[170,230], hd:-6};
  const trans = {h:[bar[0]-14, bar[1]+4], t:34, a:T(bar[0],bar[1],-1), l:[160,200], hd:10};
  const sup = {h:[bar[0]-6, bar[1]+10], t:10, a:T(bar[0],bar[1],-1), l:[176,195]};
  sup.h = [bar[0]-4, bar[1]-R+LEN.sho+8]; sup.t = 4; sup.a = T(bar[0]+2, bar[1], 1);
  const p = [o.rings ? {k:'rings', at:'W', y:0} : {k:'bar', p:bar}];
  if (o.low){ const fy = FL; const l0 = Object.assign(line([X-70,AY], [X+2,140]), {a:T(X+4,96,1)}); const l1 = {h:[X-20,118], t:20, a:T(X+4,104,-1), l:T(X-56,AY,-1)}; const l2 = {h:[X-6,96], t:4, a:T(X+4,124,-1), l:T(X-40,AY,-1)}; return mk([l0,l1,l2], [{k:'rings', at:'W', y:0}], {s:[[1,.9],[2,.8],[2,.4],[0,1],[0,.4]]}); }
  if (o.neg) return mk([sup, trans, pull, hang], p, {nofloor:1, s:[[1,1.2],[2,1.2],[3,1.4],[3,.4],[0,1]]});
  return mk([hang, pull, trans, sup], p, {nofloor:1, s:[[1,.8],[2,.45],[3,.5],[3,.6],[0,1.1],[0,.4]]});
};
out.lever = (o)=>{
  const bar = [X+30, 60];
  // front lever tuck: boca arriba, cadera a la izquierda
  const S = [X+10, 112];
  const tuck = {h:[S[0]-LEN.sho, S[1]+2], t:88, a:T(bar[0],bar[1],-1), l:[40,240]};
  if (o.adv) tuck.l = [70,250];
  if (o.one) { tuck.l = [70,250]; tuck.l2 = [272,272]; }
  if (o.full) tuck.l = tuck.l2 = [270,270];
  const p = [o.rings ? {k:'rings', at:'W', y:0} : {k:'bar', p:bar}];
  if (o.row){ const up = Object.assign({}, tuck, {h:[S[0]-LEN.sho+10, 84], t:88}); return mk([tuck, up], p, {m:1, nofloor:1}); }
  if (o.back){
    const bl = {h:[X-12, 120], t:92, a:T(X+4, 104, 1), l:[300,200], hd:8};
    bl.a = T(X-22, 100, -1);
    return mk([bl, Object.assign({}, bl, {e:1})], [{k:o.rings?'rings':'bar', at:'W', y:0, p:[X-22,100]}], {nofloor:1, s:[[1,1.5],[0,1.5]]});
  }
  if (o.skin){
    const k0 = {h:[bar[0]-4, bar[1]+R+LEN.sho], t:4, a:T(bar[0],bar[1],1), l:[175,200]};
    const k1 = {h:[bar[0]-10, bar[1]+30], t:110, a:T(bar[0],bar[1],-1), l:[20,250]};
    const k2 = {h:[bar[0]+8, bar[1]-30], t:150, a:T(bar[0],bar[1],-1), l:[-40,-110]};
    const k3 = {h:[bar[0]+30, bar[1]+30], t:200, a:T(bar[0],bar[1],-1), l:[160,120]};
    return mk([k0, k1, k2, k3], [o.rings ? {k:'rings', at:'W', y:0} : {k:'bar', p:bar}], {nofloor:1, s:[[1,1],[2,1],[3,1.1],[3,.8],[2,1],[1,1],[0,1],[0,.5]]});
  }
  return mk([tuck, Object.assign({}, tuck, {e:1})], p, {m:1, nofloor:1, s:[[1,1.5],[0,1.5]]});
};
out.flag = ()=>{
  const px = X-62;
  const a = {h:[X+22,112], t:-90, a:T(px, 140, -1), a2:T(px, 72, 1), l:[250,130], l2:[250,130], f:0, f2:0, hd:0};
  return mk([a, Object.assign({}, a, {h:[X+22,110]})], [{k:'pole', x:px}], {v:'f', s:[[1,1.5],[0,1.5]]});
};
out.hangraise = (o)=>{
  const {bot, bar} = hangPoses({});
  bot.l = [182,180];
  const up = Object.assign({}, bot, {l:[92,180], t:-2});
  if (o.legs) up.l = [96,96];
  if (o.t2b){ up.l = [18,18]; up.t = -30; up.h = add(bot.h,[10,-14]); }
  if (o.wipers){
    const w1 = {h:[X, 14+R+LEN.sho-14], t:0, a:T(X-14,14,1), a2:T(X+14,14,-1), l:[-60,-60], l2:[-50,-50], ls:.9, ls2:.9};
    const w2 = Object.assign({}, w1, {l:[50,50], l2:[60,60]});
    return mk([w1, w2], [{k:'line', pts:[[X-60,14],[X+60,14]], w:4}], {v:'f', nofloor:1, s:[[1,1],[1,.3],[0,1],[0,.3]]});
  }
  if (o.chair){
    const s0 = {h:[X-4, 104], t:0, a:[180,90], l:[180,180], e:3};
    const s1 = Object.assign({}, s0, {l: o.legs ? [94,94] : [90,180]});
    return mk([s0, s1], [{k:'poly', pts:[[X-20,40],[X-12,40],[X-12,FL],[X-20,FL]]}, {k:'box', r:[X-12,104,46,6]}]);
  }
  if (o.par){
    const top = [X+4, 112];
    const s0 = {h:[X, top[1]-R+LEN.sho+4], t:2, a:T(top[0], top[1], 1), l:[178,182]};
    s0.h = [X, top[1]-R+(-LEN.sho)+LEN.sho*2 - 6];
    s0.h = [X-2, top[1]-R+LEN.sho];
    const s1 = Object.assign({}, s0, {l:o.legs ? [94,94] : [88,180]});
    return mk([s0, s1], [{k:'post', at:top}]);
  }
  return mk([bot, up], [{k:'bar', p:bar}], {nofloor:1});
};
out.lsit = (o)=>{
  const hy = o.par ? 112 : FL-1;
  const hx = X+2;
  const p0 = {h:[X, hy+6], t:0, a:T(hx, hy, 1), l:o.tuck ? [60,180] : o.v ? [40,40] : [92,92], e:-1};
  p0.h = [X-2, hy - R + LEN.sho - 2];
  p0.h = [X-2, hy - R - LEN.sho + LEN.sho*1 + 10];
  p0.h = [X-2, hy - R + R - 8];
  const p = [];
  if (o.par) p.push({k:'post', at:[hx, hy]});
  if (o.rings) { p0.h = [X-2, 118]; p0.a = T(X+2, 124, 1); p.push({k:'rings', at:'W', y:0}); }
  return mk([p0, Object.assign({}, p0, {e:0})], p, {s:[[1,1.5],[0,1.5]]});
};
out.support = (o)=>{
  const top = [X+4, o.floor ? FL-1 : 112];
  const p0 = {h:[X+1, top[1]-R+LEN.sho+1], t:2, a:T(top[0], top[1], 1), l:[174,210]};
  const p = [];
  if (o.rings) p.push({k:'rings', at:'W', y:0}); else p.push({k:'post', at:top});
  return mk([p0, Object.assign({}, p0, {e:-1.5, h:add(p0.h,[0,1.5])})], p, {s:[[1,1.5],[0,1.5]]});
};
out.dip = (o)=>{
  const top = [X+4, o.bar ? 120 : 118];
  const up = {h:[X+1, top[1]-R+LEN.sho+1], t:3, a:T(top[0], top[1], 1), l:[176,225]};
  const tdn = o.bar ? 34 : 22, Sd = [top[0]+6, top[1]-24];
  const dn = {h:add(Sd, dir(tdn+180), LEN.sho), t:tdn, a:T(top[0], top[1], 1), l:[160,230]};
  const p = [];
  if (o.rings) p.push({k:'rings', at:'W', y:0});
  else if (o.bar) p.push({k:'bar', p:top, post:0});
  else p.push({k:'post', at:top});
  if (o.band) p.push({k:'band', from:top, at:'K'});
  if (o.machine){ up.l = dn.l = [180,270]; p.push({k:'pad', at:'K', d:[0,8], r:7}); }
  if (o.weight) p.push({k:'plate', at:'K', r:9});
  const A = mk([up, dn], p);
  if (o.neg){ A.s = [[1,3.4],[1,.3],[0,.8],[0,.4]]; }
  if (o.bench){
    const b = [X-38, 152];
    const u = {h:[X-28, 150], t:-4, a:T(b[0], b[1], -1), l:T(X+50, AY, 1), f:-20};
    u.h = [X-26, b[1] - R + LEN.sho*0 + 52 - 4]; u.h = [X-28, 106+44-48];
    u.h = [X-30, 104]; u.a = T(b[0], b[1], -1);
    const d = Object.assign({}, u, {h:[X-30, 130], t:4});
    return mk([u, d], [{k:'box', r:[X-70, 152, 40, FL-152]}]);
  }
  if (o.tricepbar){
    const bar = [X+40, 132];
    const Af = [X-80, AY-2];
    const t1 = Object.assign(line(Af, [X+36, 84]), {a:T(bar[0], bar[1], 1)});
    const t2 = Object.assign(line(Af, [X+30, 112]), {a:T(bar[0], bar[1], 1), hd:20});
    t1.a = T(bar[0], bar[1], 1); t2.a = T(bar[0], bar[1], -1);
    return mk([t1, t2], [o.rings ? {k:'rings', at:'W', y:0} : {k:'bar', p:bar, post:1}]);
  }
  return A;
};
out.crow = (o)=>{
  const hx = X+8, hy = FL-1;
  const p0 = {h:[X-18, 130], t:118, a:T(hx, hy, 1), l:[60,210], hd:10};
  if (o.planche){ p0.h = [X-34, 148]; p0.t = 96; p0.a = T(X+4, hy, 1); p0.l = [40,260]; }
  if (o.planchePush){ const a = Object.assign({}, p0, {h:[X-34, 148], t:96, a:T(X+4, hy, 1), l:[40,260]}); const b = Object.assign({}, a, {h:[X-30, 166], t:94}); return mk([a, b]); }
  return mk([p0, Object.assign({}, p0, {e:1})], [], {s:[[1,1.5],[0,1.5]]});
};

/* ===== Remos / tirones ===== */
out.invrow = (o)=>{
  const bar = o.bar || [X+36, o.rings ? 96 : 118];
  const Af = o.feet ? [X-86, FL-34] : [X-90, AY-2];
  const reachS = (S)=>{ const u = norm(sub(S, Af)); return add(Af, u, BODY); };
  const Sb = reachS([bar[0], bar[1]+R]);
  const St = reachS([bar[0]-4, bar[1]+14]);
  const b = Object.assign(line(Af, Sb, 1), {a:T(bar[0], bar[1], -1), f:30});
  const t = Object.assign(line(Af, St, 1), {a:T(bar[0], bar[1], -1), f:30});
  b.l = T(Af[0], Af[1], 1); t.l = T(Af[0], Af[1], 1);
  const p = [];
  if (o.rings) p.push({k:'rings', at:'W', y:0}); else if (o.table) p.push({k:'box', r:[X+10, bar[1]-6, 80, 6]}, {k:'line', pts:[[X+84,bar[1]],[X+84,FL]], w:3}); else p.push({k:'bar', p:bar, post:1});
  if (o.feet) p.push({k:'box', r:[Af[0]-22, FL-30, 40, 30]});
  if (o.archer){ b.a2 = T(bar[0], bar[1], -1); t.a2 = [10, 10]; }
  if (o.face){ t.a = T(bar[0]-24, bar[1]+4, -1); t.a = [20, 290]; }
  if (o.y){ const yb = Object.assign({}, b); const yt = Object.assign(line(Af, reachS([bar[0]-30, bar[1]+30]), 1), {a:[20,20]}); yt.l = T(Af[0],Af[1],1); return mk([yb, yt], p, {m:1}); }
  if (o.curl){ const cb = Object.assign({}, b); const ct = Object.assign(line(Af, reachS([bar[0]-22, bar[1]+30]), 1), {a:[30,300]}); ct.l = T(Af[0],Af[1],1); return mk([cb, ct], p, {m:1}); }
  if (o.supine) { b.a = T(bar[0], bar[1], 1); t.a = T(bar[0], bar[1], 1); }
  return mk([b, t], p, {m:1});
};
out.towelrow = ()=>{
  const door = [X+62, 96];
  const Af = [X+34, AY-2];
  const b = Object.assign(line(Af, [X-30, 72], -1), {a:T(door[0], door[1], 1), f:60});
  const t = Object.assign(line(Af, [X-8, 64], -1), {a:T(door[0]-24, door[1], -1), f:60});
  b.l = T(Af[0], Af[1], 1); t.l = T(Af[0], Af[1], 1);
  return mk([b, t], [{k:'wall', x:door[0]+2, w:12}, {k:'line', pts:['W', door], w:3}]);
};
out.bentrow = (o)=>{
  const fx = X+4;
  const base = {h:[X-22, HY-4], t:70, l:T(fx,AY,-1), l2:T(fx,AY,-1)};
  const S = shoulder(base);
  const dn = Object.assign({}, base, {a:T(S[0]+2, S[1]+R-2, 1)});
  const up = Object.assign({}, base, {a:T(base.h[0]+12, base.h[1]+2, 1)});
  const p = [];
  if (o.one){ base.t = 84; base.h = [X-24, HY-2]; const S2 = shoulder(base); dn.t = up.t = 84; dn.h = up.h = base.h; dn.a = T(S2[0], S2[1]+50, 1); up.a = T(base.h[0]+14, base.h[1]-2, 1); dn.a2 = up.a2 = T(S2[0]+4, 140, 1); p.push({k:'box', r:[S2[0]-26, 140, 60, FL-140]}); }
  if (o.w==='bb' || o.tbar) p.push({k:'plate', at:'W', r:13}); else if (o.w) p.push(...held(o.w));
  if (o.tbar) p.push({k:'stick', a:[X-70, FL-2], b:'W', ext:4});
  if (o.fly){ dn.a = [180,180]; up.a = [180,180]; up.as = .3; p.length = 0; p.push(...held('db')); }
  return mk([dn, up], p);
};
out.seatedrow = (o)=>{
  const a = {h:[X-40, FL-10], t:10, a:T(X+12, 150, 1), l:T(X+30, FL-20, -1), l2:T(X+30, FL-20, -1)};
  const b = {h:[X-40, FL-10], t:-8, a:T(X-26, 150, 1), l:T(X+34, FL-18, -1), l2:T(X+34, FL-18, -1)};
  const p = o.band ? [{k:'band', from:'A', at:'W'}] : [{k:'cable', from:[X+56, FL-14], at:'W'}, {k:'box', r:[X-80, FL-6, 60, 6]}, {k:'poly', pts:[[X+30,FL-6],[X+40,FL-40],[X+46,FL-38],[X+38,FL-6]]}];
  if (o.machine){ const c = {h:[X-30, 150], t:2, a:T(X+20, 112, 1), l:[90,180]}; const d = Object.assign({}, c, {a:T(X-14, 116, 1)}); return mk([c, d], [{k:'box', r:[X-44, 150, 36, 10]}, {k:'line', pts:[[X-26,160],[X-26,FL]], w:4}, {k:'box', r:[X+6, 84, 8, 50]}, {k:'bar', at:'W'}]); }
  if (o.erg){ const c = {h:[X-6, 164], t:22, a:T(X+40, 150, 1), l:T(X+38, FL-20, -1), l2:T(X+38, FL-20, -1)}; const d = {h:[X-50, 164], t:-14, a:T(X-34, 140, 1), l:T(X+38, FL-20, -1), l2:T(X+38, FL-20, -1)}; return mk([c, d], [{k:'box', r:[X-90, 172, 150, 6]}, {k:'cable', from:[X+56, 156], at:'W'}], {s:[[1,.8],[0,1.2]]}); }
  if (o.facepull){ const fx = X+2; const c = st({h:[X,HY], t:-6, l:T(fx,AY,-1), a:T(X+50, 58, 1)}); const d = Object.assign({}, c, {a:[60,300]}); return mk([c, d], o.band ? [{k:'band', from:[X+100, 54], at:'W'}] : [{k:'cable', from:[X+100, 54], at:'W'}]); }
  if (o.apart){ const c = {h:[X,HY], t:0, a:[90,90], a2:[90,90], as:.3, as2:.3, l:[182,180], l2:[178,180]}; c.a = [100,90]; c.a2 = [80,90]; const d = Object.assign({}, c, {a:[270,270], a2:[90,90], as:1, as2:1}); return mk([c, d], [{k:'line', pts:['W','W2'], w:2.4}], {v:'f'}); }
  if (o.reverseFly){ const c = {h:[X-30, 150], t:6, a:[90,90], l:[90,180]}; const d = Object.assign({}, c, {as:.35}); return mk([c, d], [{k:'box', r:[X-44, 150, 36, 10]}, {k:'line', pts:[[X-26,160],[X-26,FL]], w:4}, {k:'box', r:[X+4, 96, 8, 50]}]); }
  return mk([a, b], p);
};
out.pulldown = (o)=>{
  const hip = [X-18, 150];
  const a = {h:hip, t:-6, a:T(X-10, 30, -1), l:[90,175]};
  const b = {h:hip, t:-14, a:T(X-2, 92, 1), l:[90,175]};
  b.a = T(hip[0]+12, hip[1]-58, 1);
  const p = [{k:'box', r:[X-40, 154, 40, FL-154]}, {k:'pad', at:'K', d:[0,-8], r:6}, {k:'cable', from:[X-10, 4], at:'W'}, {k:'bar', at:'W'}];
  if (o.band){ p.length = 0; p.push({k:'band', from:[X-10,0], at:'W'}); }
  if (o.pullover){ const fx = X+4; const c = st({h:[X-8,HY], t:24, l:T(fx,AY,-1), a:[60,60]}); const d = Object.assign({}, c, {a:[170,170]}); return mk([c, d], [{k:'cable', from:[X+90, 12], at:'W'}]); }
  return mk([a, b], p);
};

/* ===== Empuje con carga ===== */
out.bench = (o)=>{
  const hip = [X-20, 150], t = o.incline ? 58 : 90;
  const S = add(hip, dir(t), LEN.sho);
  const up = {h:hip, t, a:T(S[0], S[1]-R+2, 1), l:T(X-62, AY, 1), l2:T(X-62, AY, 1), f:90};
  const dn = Object.assign({}, up, {a:T(S[0]-2, S[1]-10, 1)});
  if (o.incline){ up.a = T(S[0]+14, S[1]-48, 1); dn.a = T(S[0]+4, S[1]-10, 1); }
  const p = [];
  if (o.incline) p.push({k:'poly', pts:[[X-46,154],[X+20,154],[X+40,88],[X+28,84],[X+10,150],[X-46,150]]}, {k:'line', pts:[[X-20,158],[X-20,FL]], w:4});
  else p.push({k:'box', r:[X-60, 155, 120, 9]}, {k:'line', pts:[[X-50,164],[X-50,FL]], w:4}, {k:'line', pts:[[X+50,164],[X+50,FL]], w:4});
  if (o.fly){ up.a = [o.incline?20:0, o.incline?20:0]; dn.a = [o.incline?20:0, o.incline?20:0]; dn.as = .35; }
  if (o.french){ up.a = [0,0]; dn.a = [0,130]; }
  if (o.w==='bb') p.push({k:'plate', at:'W', r:13}); else p.push(...held(o.w||'db'));
  return mk([dn, up], p, {m:1});
};
out.chestpress = (o)=>{
  // sentado en máquina, de pie con banda o cruce de poleas
  const seat = {h:[X-24, 150], t:-4, a:T(X-4, 106, 1), l:[90,180]};
  const out1 = Object.assign({}, seat, {a:T(X+34, 104, 1)});
  if (o.band){ const fx = X+6; const a = st({h:[X,HY], t:4, l:T(fx,AY,-1), a:T(X+20, 70, 1)}); const b = Object.assign({}, a, {a:T(X+56, 68, 1)}); return mk([a, b], [{k:'band', from:[X-30, 70], at:'W'}]); }
  if (o.shoulder){ const s0 = Object.assign({}, seat, {a:T(X-12, 82, -1)}); const s1 = Object.assign({}, seat, {a:T(X-14, 30, 1)}); return mk([s0, s1], [{k:'box', r:[X-44, 154, 40, 8]}, {k:'box', r:[X-56, 80, 8, 74]}, {k:'line', pts:[[X-24,162],[X-24,FL]], w:4}, {k:'bar', at:'W'}]); }
  return mk([seat, out1], [{k:'box', r:[X-44, 154, 40, 8]}, {k:'box', r:[X-56, 86, 8, 68]}, {k:'line', pts:[[X-24,162],[X-24,FL]], w:4}, {k:'bar', at:'W'}]);
};
out.flyfront = (o)=>{
  if (o.cross){
    const a = {h:[X,HY], t:0, a:T(X-56, 46, 1), a2:T(X+56, 46, -1), l:T(X-12,AY,1), l2:T(X+12,AY,-1)};
    const b = Object.assign({}, a, {a:T(X+2, 108, -1), a2:T(X-2, 108, 1)});
    return mk([a, b], [{k:'cable', from:[8, 16], at:'W'}, {k:'cable', from:[232, 16], at:'W2'}], {v:'f'});
  }
  // pec deck sentado
  const a = {h:[X,152], t:0, a:[270,0], a2:[90,0], l:[190,180], l2:[170,180], ls:.75, ls2:.75};
  const b = Object.assign({}, a, {a:[240,10], a2:[120,350], as:.55, as2:.55});
  if (o.reverse){ return mk([b, a], [{k:'box', r:[X-26,152,52,14]}], {v:'f'}); }
  return mk([a, b], [{k:'box', r:[X-26,152,52,14]}], {v:'f'});
};
out.ohp = (o)=>{
  const fx = X+2;
  const base = st({h:[X,HY], t:0, l:T(fx,AY,-1), l2:T(fx,AY,-1)});
  const S = shoulder(base);
  const dn = Object.assign({}, base, {a:T(S[0]+8, S[1]-4, 1)});
  const up = Object.assign({}, base, {a:T(S[0]+2, S[1]-R+1, 1)});
  const p = [];
  if (o.w==='bb') p.push({k:'plate', at:'W', r:12}); else if (o.w==='band') p.push({k:'band', from:'A', at:'W'}); else p.push(...held(o.w||'db'));
  return mk([dn, up], p);
};
out.raise = (o)=>{
  if (o.front){ const a = st({a:[178,178]}); const b = st({a:[92,92]}); return mk([a, b], held(o.w||'db')); }
  const a = {h:[X,HY], t:0, a:[188,185], a2:[172,175], l:[182,180], l2:[178,180]};
  const b = {h:[X,HY], t:0, a:[265,268], a2:[95,92], l:[182,180], l2:[178,180]};
  const p = o.w==='band' ? [{k:'band', from:'A', at:'W'}, {k:'band', from:'A2', at:'W2'}] : o.w==='cable' ? [{k:'cable', from:[X+40, FL-6], at:'W'}] : [{k:'db', at:'W'}, {k:'db', at:'W2'}];
  if (o.w==='cable'){ a.a2 = b.a2 = [176,178]; }
  return mk([a, b], p, {v:'f'});
};
out.shrug = ()=>{ const a = st({a:[180,180]}); const b = st({a:[180,180], e:7}); return mk([a, b], held('db'), {s:[[1,.7],[1,.6],[0,.8],[0,.3]]}); };
out.curl = (o)=>{
  const fx = X+2;
  const a = st({h:[X,HY], t:0, l:T(fx,AY,-1), l2:T(fx,AY,-1), a:[178,178]});
  const b = Object.assign({}, a, {a:[178,18]});
  let p = [];
  if (o.w==='bb') p.push({k:'plate', at:'W', r:11}); else if (o.w==='band') p.push({k:'band', from:'A', at:'W'}); else if (o.w==='cable') p.push({k:'cable', from:[X+24, FL-4], at:'W'}); else p.push(...held(o.w||'db'));
  if (o.preacher){ a.h = b.h = [X-20, 150]; a.l = b.l = [90,180]; a.t = b.t = 14; a.a = [130,120]; b.a = [130,20]; p.push({k:'poly', pts:[[X-2,96],[X+30,130],[X+22,138],[X-8,108]]}); }
  return mk([a, b], p);
};
out.triceps = (o)=>{
  const fx = X+2;
  if (o.overhead){
    const a = st({h:[X,HY], t:14, l:T(fx+8,AY,-1), l2:T(fx-18,AY,-1), a:[8,200], ar:0});
    const b = Object.assign({}, a, {a:[8,20]});
    return mk([a, b], o.w==='band' ? [{k:'band', from:'A2', at:'W'}] : o.w==='cable' ? [{k:'cable', from:[X-60, 150], at:'W'}] : held('db'));
  }
  const a = st({h:[X,HY], t:10, l:T(fx,AY,-1), l2:T(fx,AY,-1), a:[172,40]});
  const b = Object.assign({}, a, {a:[172,176]});
  return mk([a, b], o.w==='band' ? [{k:'band', from:[X+40, 20], at:'W'}] : [{k:'cable', from:[X+36, 10], at:'W'}]);
};

/* ===== Acondicionamiento ===== */
out.burpee = (o)=>{
  const fx = X+6;
  const stand = st({h:[X,HY], t:0, l:T(fx,AY,-1), a:[180,180]});
  const squat = {h:[X-14, 160], t:56, l:T(fx,AY,-1), a:T(X+28, FL-1, 1)};
  const plank = Object.assign(line([X-78, AY-2], [X+28, FL-R]), {a:T(X+28, FL-1, 1)});
  const chest = Object.assign(line([X-78, AY-2], [X+38, FL-16]), {a:T(X+28, FL-1, 1)});
  const jump = {h:[X, HY-22], t:0, a:[10,10], l:[176,184], f:40};
  if (o.nopush) return mk([stand, squat, plank, squat, jump], [], {s:[[1,.45],[2,.35],[3,.35],[4,.45],[0,.45]]});
  return mk([stand, squat, plank, chest, plank, squat, jump], [], {s:[[1,.45],[2,.35],[3,.4],[4,.4],[5,.35],[6,.45],[0,.45]]});
};
out.jacks = ()=>{
  const a = {h:[X,HY], t:0, a:[184,182], a2:[176,178], l:[182,180], l2:[178,180]};
  const b = {h:[X,HY-4], t:0, a:[320,330], a2:[40,30], l:[200,180], l2:[160,180]};
  return mk([a, b], [], {v:'f', s:[[1,.35],[0,.35]]});
};
out.boxjump = ()=>{
  const box = [X+16, 140, 54, FL-140];
  const fx = X-20;
  const stand = st({h:[X-26,HY], l:T(fx,AY,-1)});
  const load = {h:[X-46, 154], t:40, a:[220,220], l:T(fx,AY,-1)};
  const air = {h:[X+8, 76], t:20, a:[60,60], l:[110,200], f:40};
  const land = {h:[X+26, 104], t:36, a:[100,100], l:T(X+46,138,-1)};
  const up = {h:[X+34, 140-81], t:0, a:[180,180], l:T(X+38,138,-1)};
  return mk([stand, load, air, land, up], [{k:'box', r:box}], {s:[[1,.5],[2,.35],[3,.3],[4,.5],[4,.6],[0,.01],[0,.5]]});
};
out.rope = ()=>{
  const a = st({h:[X,HY], a:[160,110], f:60});
  const b = st({h:[X,HY-10], a:[160,110], f:40, rp:1});
  a.rp = 0;
  return mk([a, b], [{k:'rope'}], {s:[[1,.2],[0,.2]], lin:1});
};
function gait(o){
  const big = o.sprint ? 1.25 : o.walk ? .55 : 1;
  const lean = o.sprint ? 14 : o.walk ? 2 : 8;
  const hy = HY + (o.walk ? 0 : -4);
  const P1 = {h:[X, hy], t:lean, a:[180-60*big, 180-110*big], a2:[180+50*big, 180-20*big], l:[180-40*big, 180+(o.walk?10:50)*big], l2:[180+28*big, 180+(o.walk?10:20)*big]};
  const P2 = {h:[X, hy + (o.walk?2:6)], t:lean, a:[180, 180-60], a2:[180, 180-60], l:[180-5, 180+(o.walk?5:80)*big], l2:[180+5, 180+5]};
  const P3 = {h:[X, hy], t:lean, a:P1.a2, a2:P1.a, l:P1.l2, l2:P1.l};
  const P4 = {h:[X, hy + (o.walk?2:6)], t:lean, a:P2.a2, a2:P2.a, l:P2.l2, l2:P2.l};
  // pies que tocan el suelo (aprox.)
  return [P1, P2, P3, P4];
}
out.run = (o)=>{
  const k = gait(o);
  const sp = o.sprint ? .17 : o.walk ? .34 : .24;
  const p = [];
  if (o.w) { p.push({k:o.w==='kb'?'kb':'db', at:'W'}); if (!o.suitcase) p.push({k:o.w==='kb'?'kb':'db', at:'W2'}); k.forEach(q=>{ q.a = [178,178]; q.a2 = [182,182]; }); }
  if (o.incline){ k.forEach(q=>{ q.t += 6; }); p.push({k:'poly', pts:[[20,FL],[220,FL-14],[220,FL],[20,FL+1]]}); }
  return mk(k, p, {s:[[1,sp],[2,sp],[3,sp],[0,sp]], lin:0});
};
out.bike = (o)=>{
  const C = [X+12, 168], r = 16;
  const k = [];
  for (let i=0;i<8;i++){
    const th = i*45;
    const f1 = add(C, dir(th), r), f2 = add(C, dir(th+180), r);
    k.push({h:[X-22, 116], t:36, a:T(X+40, 96, 1), l:T(f1[0], f1[1], -1), l2:T(f2[0], f2[1], -1), f:80, f2:80});
  }
  const p = [{k:'circ', at:C, r:r}, {k:'line', pts:[[X-22,122],[X+12,168],[X+40,96]], w:3}, {k:'circ', at:[X-40, 170], r:22}, {k:'circ', at:[X+64, 170], r:22}];
  if (o.ell){ k.forEach((q,i)=>{ const th=i*45; q.h = [X-6, 104]; q.t = 2; const f1 = [X+10+Math.sin(rad(th))*20, 170-Math.cos(rad(th))*6], f2 = [X+10-Math.sin(rad(th))*20, 170+Math.cos(rad(th))*6]; q.l = T(f1[0],f1[1],-1); q.l2 = T(f2[0],f2[1],-1); q.a = T(X+34+Math.sin(rad(th))*-10, 80, 1); q.a2 = T(X+34+Math.sin(rad(th))*10, 80, 1); q.f = q.f2 = 90; });
    return mk(k, [{k:'poly', pts:[[X-20,176],[X+50,176],[X+50,182],[X-20,182]]}, {k:'line', pts:[[X+50,FL],[X+44,70]], w:3}], {s:k.map((_,i)=>[(i+1)%8,.14]), lin:1}); }
  return mk(k, p, {s:k.map((_,i)=>[(i+1)%8,.12]), lin:1});
};
const rad = d=>d*Math.PI/180;

/* ===== Movilidad ===== */
out.dislocate = (o)=>{
  const a = st({a:[176,176]}), b = st({a:[0,0]}), c = st({a:[-70,-70]});
  return mk([a, b, c], [{k:'bar', at:'W'}].concat(o.band?[]:[]), {s:[[1,1],[2,1],[2,.3],[1,1],[0,1],[0,.3]]});
};
out.deepsquat = ()=>{
  const fx = X+6;
  const a = {h:[X-18, 172], t:30, l:T(fx,AY,-1), a:[150,40], hd:-6};
  return mk([a, Object.assign({}, a, {e:1.2, h:[X-18,171]})], [], {s:[[1,1.5],[0,1.5]]});
};
out.seated = (o)=>{
  const h = [X-40, FL-9];
  const a = {h, t:2, a:[150,150], l:[90,90], f:-90};
  const b = {h, t:o.pancake ? 70 : 62, a:[100,100], l:[90,90], hd:10};
  if (o.straddle){ a.l = b.l = [90,90]; a.ls = b.ls = 1; }
  return mk([a, b], [], {s:[[1,1.5],[1,1.2],[0,1.3],[0,.4]]});
};
out.scapprone = ()=>{
  const h = [X-10, FL-8];
  const a = {h, t:90, a:[150,60], l:[270,270], hd:6};
  const b = Object.assign({}, a, {a:[200,70], t:86, hd:-4});
  return mk([a, b]);
};

out.dragon = (o)=>{
  const S = [X+34, 150];
  const mkP = (tt)=>{ const h = add(S, dir(tt+180), LEN.sho); return {h, t:tt, a:T(X+64, 156, 1), l:o.tuck ? [tt+180-40, tt+180+60] : [tt+180, tt+180], hd:-6}; };
  const top = mkP(150), bot = mkP(98);
  const A = mk([top, bot], [{k:'box', r:[X-60, 154, 140, 9]}, {k:'line', pts:[[X-50,163],[X-50,FL]], w:4}, {k:'line', pts:[[X+70,163],[X+70,FL]], w:4}], {m:1});
  if (o.neg) A.s = [[1,3.2],[1,.3],[0,1.2],[0,.4]];
  return A;
};
out.wheelpose = ()=>{
  const a = {h:[X-6, 122], t:116, a:T(X+44, FL-1, -1), l:T(X-50, AY, 1), hd:20, cv:-6, f:90};
  const b = Object.assign({}, a, {h:[X-4, 114], t:118});
  return mk([a, b], [], {m:1, s:[[1,1.5],[0,1.5]]});
};
out.stretch = ()=>out.deepsquat();
return out;
})();
