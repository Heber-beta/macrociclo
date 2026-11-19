/* ================= Animaciones de ejercicios =================
   Figura 2D articulada (vista lateral o frontal) con cinemática directa e inversa.
   Cada ejercicio usa una plantilla de movimiento (EXA_T) con opciones; los músculos
   del campo "muscles" se resaltan sobre la figura (principal en naranja, secundarios en amarillo). */
const EXA = (()=>{
const LEN = {tor:48, sho:44, neck:7, head:9, ua:27, fa:29, th:40, sh:39, ft:11};
const FL = 194;            // suelo
const AY = FL-2;           // altura del tobillo de pie
const HY = AY-LEN.th-LEN.sh; // cadera de pie (113)
const rad = d=>d*Math.PI/180, deg = r=>r*180/Math.PI;
const dir = a=>[Math.sin(rad(a)), -Math.cos(rad(a))];
const add = (p,v,k=1)=>[p[0]+v[0]*k, p[1]+v[1]*k];
const ang = v=>deg(Math.atan2(v[0], -v[1]));
const dist = (a,b)=>Math.hypot(b[0]-a[0], b[1]-a[1]);
const lerp = (a,b,t)=>{
  if (typeof a==='number' && typeof b==='number') return a+(b-a)*t;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((x,i)=>lerp(x,b[i],t));
  if (a && b && typeof a==='object' && typeof b==='object'){ const o={}; for (const k in a) o[k] = (k in b) ? lerp(a[k],b[k],t) : a[k]; for (const k in b) if (!(k in a)) o[k]=b[k]; return o; }
  return t<.5 ? a : b;
};
// ángulo "continuo": evita que la interpolación dé la vuelta larga
function unwrapPose(p0, p1){
  const fix = (a,b)=>{ if (typeof a==='number' && typeof b==='number'){ let d=b-a; while(d>180) d-=360; while(d<-180) d+=360; return a+d; } return b; };
  const out = {...p1};
  for (const k of ['t','hd']) if (k in p0 && k in p1) out[k] = fix(p0[k], p1[k]);
  for (const k of ['a','a2','l','l2']) if (Array.isArray(p0[k]) && Array.isArray(p1[k])) out[k] = p1[k].map((x,i)=>fix(p0[k][i], x));
  return out;
}
function ik(P, T, l1, l2, b){
  let d = dist(P,T); const th = ang([T[0]-P[0], T[1]-P[1]]);
  d = Math.max(Math.abs(l1-l2)+0.5, Math.min(l1+l2-0.01, d));
  const c = (l1*l1 + d*d - l2*l2)/(2*l1*d);
  const al = deg(Math.acos(Math.max(-1, Math.min(1, c))));
  const a1 = th + (b||1)*al;
  const K = add(P, dir(a1), l1), E = add(P, dir(th), d);
  return [a1, ang([E[0]-K[0], E[1]-K[1]])];
}
function limb(root, spec, l1, l2, k){
  k = k==null ? 1 : k;
  let a = Array.isArray(spec) ? spec : ik(root, spec.t, l1*k, l2*k, spec.b);
  const J1 = add(root, dir(a[0]), l1*k), J2 = add(J1, dir(a[1]), l2*k);
  return {a, J1, J2};
}
/* Calcula articulaciones a partir de una pose */
function solve(p, v, m){
  const H = p.h, t = p.t||0, perp = dir(t+90);
  const front = v==='f';
  const sw = front ? 14 : 0, hw = front ? 8 : 0;
  const N = add(H, dir(t), LEN.tor);
  const Sc = add(add(H, dir(t), LEN.sho), dir(t), p.e||0);
  const S1 = add(Sc, perp, -sw), S2 = add(Sc, perp, sw);
  const H1 = add(H, perp, -hw), H2 = add(H, perp, hw);
  const rel = a=>(p.ar && Array.isArray(a)) ? a.map(x=>x+t) : a;
  const arm1 = limb(S1, rel(p.a || [180,180]), LEN.ua, LEN.fa, p.as);
  const arm2 = limb(S2, rel(p.a2 || p.a || [180,180]), LEN.ua, LEN.fa, p.as2!=null ? p.as2 : p.as);
  const leg1 = limb(H1, p.l || [180,180], LEN.th, LEN.sh, p.ls);
  const leg2 = limb(H2, p.l2 || p.l || [180,180], LEN.th, LEN.sh, p.ls2!=null ? p.ls2 : p.ls);
  const sg = m ? 1 : -1;
  const foot = (leg, f) => front ? add(leg.J2, dir(leg.a[1] + (f!=null?f:0)), 5) : add(leg.J2, dir(leg.a[1] + sg*(f!=null?f:90)), LEN.ft);
  const Hd = add(N, dir(t + (p.hd||0)), LEN.neck + LEN.head);
  return {H, N, Sc, S:S1, S2, Hp:H1, Hp2:H2, Hd, E:arm1.J1, W:arm1.J2, E2:arm2.J1, W2:arm2.J2, K:leg1.J1, A:leg1.J2, K2:leg2.J1, A2:leg2.J2,
    T:foot(leg1, p.f), T2:foot(leg2, p.f2!=null ? p.f2 : p.f), arm1, arm2, leg1, leg2, t, front, cv:p.cv||0, rp:p.rp||0, m, hd:p.hd||0};
}
/* ----- músculos ----- */
const MUS = [
  [/pectoral/, ['pecho']], [/dorsal|redondo/, ['dorsal']], [/romboide|trapecio medio|trapecio inferior|columna torácica|escap/, ['espalda']],
  [/trapecio superior/, ['trapecio']], [/^trapecio$/, ['espalda','trapecio']], [/delto|hombro|manguito/, ['hombro']],
  [/braquiorradial/, ['antebrazo']], [/bíceps|braquial/, ['biceps']], [/tríceps/, ['triceps']], [/antebrazo|agarre|muñeca/, ['antebrazo']],
  [/core completo/, ['abdomen','oblicuos','lumbar']], [/core|abdom|transverso/, ['abdomen']], [/oblicu|cuadrado lumbar/, ['oblicuos']],
  [/erector|lumbar|^columna$|espalda baja/, ['lumbar']], [/glúteo/, ['gluteo']], [/cuádriceps|recto femoral/, ['cuadriceps']],
  [/isquio|femoral/, ['isquio']], [/aductor/, ['aductor']], [/gemelo|sóleo|aquiles|tobillo/, ['gemelo']], [/tibial/, ['tibial']],
  [/flexores de cadera|psoas/, ['psoas']], [/^cadera$/, ['gluteo','psoas']], [/piernas/, ['cuadriceps','gluteo','isquio','gemelo']],
  [/cardio/, ['corazon']], [/cuerpo completo/, ['pecho','dorsal','hombro','abdomen','gluteo','cuadriceps']], [/serrato/, ['serrato']],
  [/movilidad de hombros/, ['hombro','espalda']], [/^espalda$/, ['dorsal','espalda']]
];
function muscleGroups(str){
  const prim = new Set(), sec = new Set();
  String(str||'').toLowerCase().split(/,\s*/).forEach((tok,i)=>{
    const t = tok.replace(/\s*\(.*\)/,'').trim();
    for (const [re, gs] of MUS) if (re.test(t)) { gs.forEach(g=>(i===0?prim:sec).add(g)); if (!/core completo/.test(t)) break; }
  });
  prim.forEach(g=>sec.delete(g));
  return {prim, sec};
}
// [segmento, desde, hasta, lado (1 delante, -1 detrás, 0 centro), grosor]
const ZONES = {
  pecho:['tor',.64,.95,1,5], dorsal:['tor',.48,.9,-1,5.5], espalda:['tor',.74,.98,-1,4.2], trapecio:['tor',.93,1.12,-1,3.6],
  abdomen:['tor',.14,.6,1,5], oblicuos:['tor',.2,.6,0,4.2], lumbar:['tor',.04,.42,-1,4.5], serrato:['tor',.56,.8,0,4],
  gluteo:['tor',-.16,.14,-1,6.5], psoas:['th',0,.28,1,4.2],
  biceps:['ua',.18,.86,1,3.8], triceps:['ua',.18,.86,-1,3.8], antebrazo:['fa',.08,.68,0,3.4],
  cuadriceps:['th',.14,.9,1,5.2], isquio:['th',.16,.9,-1,5], aductor:['th',.1,.58,0,4], gemelo:['sh',.08,.55,-1,4.6], tibial:['sh',.1,.62,1,3.2]
};
const C1 = '#F0592F', C2 = '#F6AE2D';
function blob(A, B, f0, f1, side, w, m, front, col, op){
  const a = ang([B[0]-A[0], B[1]-A[1]]), L = dist(A,B);
  const c0 = add(A, dir(a), L*(f0+f1)/2);
  const nrm = dir(a + (m ? -90 : 90)*1);
  const off = front ? 0 : side*(w*0.55);
  const c = add(c0, nrm, off);
  const rx = Math.max(3, L*(f1-f0)/2), ry = front ? w*0.8 : w;
  return `<ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${(a-90).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)})" fill="${col}" opacity="${op}"/>`;
}
function drawMuscles(J, groups, m, front, pulse, only, side){
  let s = '';
  side = side || 'n';
  const segs = (k)=>{
    const out = [], n = side!=='f', f = side!=='n';
    if (k==='tor') out.push([J.H, J.N, 0]);
    if (k==='ua') { if (n) out.push([J.S, J.E, 1]); if (f) out.push([J.S2, J.E2, 1]); }
    if (k==='fa') { if (n) out.push([J.E, J.W, 1]); if (f) out.push([J.E2, J.W2, 1]); }
    if (k==='th') { if (n) out.push([J.Hp, J.K, 1]); if (f) out.push([J.Hp2, J.K2, 1]); }
    if (k==='sh') { if (n) out.push([J.K, J.A, 1]); if (f) out.push([J.K2, J.A2, 1]); }
    return out;
  };
  const one = (g, col, op)=>{
    if (g==='hombro'){ if (!only.has('sho')) return; const r = 5.6; const pts = []; if (side!=='f') pts.push(J.S); if (side!=='n') pts.push(J.S2); pts.forEach(c=>{ s += `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${r}" fill="${col}" opacity="${op}"/>`; }); return; }
    if (g==='corazon'){ if (!only.has('tor')) return; const c = add(add(J.H, dir(J.t), LEN.tor*.74), dir(J.t+(m?-90:90)), front?-4:3); const r = 3.2+pulse*1.2; s += `<path d="M${c[0].toFixed(1)},${(c[1]+r*0.9).toFixed(1)} l${-r*1.1},${-r*1.05} a${r*0.58},${r*0.58} 0 1 1 ${r*1.1},${-r*0.75} a${r*0.58},${r*0.58} 0 1 1 ${r*1.1},${r*0.75} z" fill="#E5484D" opacity=".95"/>`; return; }
    const z = ZONES[g]; if (!z || !only.has(z[0])) return;
    for (const [A,B,isLimb] of segs(z[0])){
      const sd = isLimb ? -z[3] : z[3];
      if (front && z[0]==='tor' && (g==='dorsal' || g==='oblicuos' || g==='serrato' || g==='gluteo' || g==='pecho' || g==='lumbar' || g==='espalda')){
        const pp = dir(J.t+90);
        for (const sg of [-1,1]) s += blob(add(A,pp,sg*6), add(B,pp,sg*6), z[1], z[2], 0, z[4]*.75, m, true, col, op);
      } else s += blob(A, B, z[1], z[2], sd, z[4]*0.85, m, front, col, op);
    }
  };
  const op1 = (0.78 + pulse*0.2).toFixed(2), op2 = (0.7 + pulse*0.14).toFixed(2);
  groups.sec.forEach(g=>one(g, C2, op2));
  groups.prim.forEach(g=>one(g, C1, op1));
  return s;
}
/* ----- dibujo ----- */
const P = p=>p[0].toFixed(1)+','+p[1].toFixed(1);
const ln = (a,b,w,extra='')=>`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke-width="${w}" ${extra}/>`;
// ----- figura humana -----
const SKIN = '#E8B48C', SKIN2 = '#C98F68', LINE = '#9A6446', HAIR = '#3B2619', SHORTS = '#2F3E5C', SHORTS2 = '#25314A', SHOE = '#3C4250', SOLE = '#E9ECEF';
function cap(A, B, r1, r2){
  const v = [B[0]-A[0], B[1]-A[1]], L = Math.hypot(v[0], v[1]) || 0.001, u = [v[0]/L, v[1]/L], n = [-u[1], u[0]];
  const p1 = [A[0]+n[0]*r1, A[1]+n[1]*r1], p2 = [B[0]+n[0]*r2, B[1]+n[1]*r2], p3 = [B[0]-n[0]*r2, B[1]-n[1]*r2], p4 = [A[0]-n[0]*r1, A[1]-n[1]*r1];
  return `M${P(p1)}L${P(p2)}A${r2} ${r2} 0 0 0 ${P(p3)}L${P(p4)}A${r1} ${r1} 0 0 0 ${P(p1)}Z`;
}
const shape = (d, fill, stroke, sw=1)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const mix = (a,b,t)=>[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
function legShape(Hp, K, A, T, far){
  const sk = far ? SKIN2 : SKIN, ln_ = far ? '#8A5A3E' : LINE, sh = far ? SHORTS2 : SHORTS;
  let s = '';
  s += shape(cap(K, A, 5.8, 3.8), sk, ln_);
  s += shape(cap(Hp, K, 8.4, 5.9), sk, ln_);
  s += shape(cap(Hp, mix(Hp, K, .48), 9.2, 7.9), sh, '#1B2436');
  s += shape(cap(A, T, 3.6, 2.9), SHOE, '#262A33');
  return s;
}
function armShape(S, E, W, far){
  const sk = far ? SKIN2 : SKIN, ln_ = far ? '#8A5A3E' : LINE;
  return shape(cap(E, W, 4.6, 3.3), sk, ln_) + shape(cap(S, E, 6, 4.6), sk, ln_) + `<circle cx="${W[0].toFixed(1)}" cy="${W[1].toFixed(1)}" r="3.6" fill="${sk}" stroke="${ln_}" stroke-width="1"/>`;
}
function torsoShape(J, front, m){
  const t = J.t, u = dir(t), H = J.H;
  let s = '';
  if (front){
    const p = dir(t+90);
    const at = (f, w)=>[add(add(H,u,LEN.tor*f), p, -w), add(add(H,u,LEN.tor*f), p, w)];
    const [h1,h2] = at(-0.06, 12), [w1,w2] = at(.42, 11), [c1,c2] = at(.78, 14.5), [s1,s2] = at(.93, 15.5);
    const d = `M${P(h1)} Q${P(add(w1,p,-1))} ${P(c1)} L${P(s1)} Q${P(add(add(H,u,LEN.tor),p,0))} ${P(s2)} L${P(c2)} Q${P(add(w2,p,1))} ${P(h2)} Z`;
    s += shape(d, SKIN, LINE, 1.1);
    // líneas anatómicas suaves
    const mid = (f)=>add(H,u,LEN.tor*f);
    s += `<path d="M${P(add(mid(.86),p,-11))} Q${P(add(mid(.68),p,-6))} ${P(mid(.7))} Q${P(add(mid(.68),p,6))} ${P(add(mid(.86),p,11))}" fill="none" stroke="${LINE}" stroke-width=".8" stroke-opacity=".7"/>`;
    s += `<line x1="${mid(.62)[0].toFixed(1)}" y1="${mid(.62)[1].toFixed(1)}" x2="${mid(.22)[0].toFixed(1)}" y2="${mid(.22)[1].toFixed(1)}" stroke="${LINE}" stroke-width=".7" stroke-opacity=".6"/>`;
    s += shape(cap(add(add(H,u,-3),p,-11.5), add(add(H,u,-3),p,11.5), 6.5, 6.5), SHORTS, '#1B2436');
    s += shape(cap(add(H,u,LEN.tor-4), J.N, 3.6, 3.6), SKIN, LINE);
    return s;
  }
  const fw = dir(t + (m ? -90 : 90));  // hacia delante del cuerpo
  const top = add(H, u, LEN.tor-5);
  const cv = J.cv || 0;
  const P0 = add(H, fw, -10.5), P1 = add(H, fw, 9.5);
  const Q0 = add(top, fw, -10.5), Q1 = add(top, fw, 11.5);
  const mb = add(add(H, u, LEN.tor*.5), fw, -cv*2);
  const B0 = add(mb, fw, -12.5), B1 = add(add(mb, fw, 12.5), u, 5);
  const d = `M${P(P0)} Q${P(B0)} ${P(Q0)} Q${P(add(add(top,u,6),fw,0))} ${P(Q1)} Q${P(B1)} ${P(P1)} Q${P(add(H,u,-7))} ${P(P0)} Z`;
  s += shape(d, SKIN, LINE, 1.1);
  // pecho y abdomen (línea suave)
  const cp = add(add(H,u,LEN.tor*.7), fw, 9);
  s += `<path d="M${P(add(cp,u,6))} Q${P(add(cp,fw,1.5))} ${P(add(add(cp,u,-6),fw,-2.5))}" fill="none" stroke="${LINE}" stroke-width=".8" stroke-opacity=".7"/>`;
  s += shape(cap(add(H,u,-2), add(H,u,8), 10.6, 10.2), SHORTS, '#1B2436');
  s += shape(cap(top, J.N, 3.8, 3.6), SKIN, LINE);
  return s;
}
function headShape(J, front, m){
  const c = J.Hd, r = LEN.head, up = dir(J.t + (J.hd||0));
  if (front){
    return `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${r}" fill="${SKIN}" stroke="${LINE}" stroke-width="1"/>` +
      `<path d="${cap(add(c,up,4), add(c,up,4.01), r-1.2, r-1.2)}" fill="${HAIR}"/>` +
      `<circle cx="${add(c,up,-1.5)[0].toFixed(1)}" cy="${add(c,up,-1.5)[1].toFixed(1)}" r="${r-2.4}" fill="${SKIN}"/>`;
  }
  const fw = dir(J.t + (J.hd||0) + (m ? -90 : 90));
  const nose = add(add(c, fw, r-0.5), up, -1);
  let s = `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${r}" fill="${SKIN}" stroke="${LINE}" stroke-width="1"/>`;
  s += `<circle cx="${nose[0].toFixed(1)}" cy="${nose[1].toFixed(1)}" r="2" fill="${SKIN}" stroke="${LINE}" stroke-width=".8"/>`;
  // pelo: casquete atrás y arriba
  const hc = add(add(c, fw, -2.2), up, 2);
  s += `<circle cx="${hc[0].toFixed(1)}" cy="${hc[1].toFixed(1)}" r="${r-1.6}" fill="${HAIR}"/>`;
  const face = add(add(c, fw, 2.6), up, -1.6);
  s += `<circle cx="${face[0].toFixed(1)}" cy="${face[1].toFixed(1)}" r="${r-2.8}" fill="${SKIN}"/>`;
  const ear = add(c, fw, -1.2);
  s += `<circle cx="${ear[0].toFixed(1)}" cy="${ear[1].toFixed(1)}" r="1.8" fill="${SKIN}" stroke="${LINE}" stroke-width=".7"/>`;
  const eye = add(add(c, fw, r-3.2), up, 1.2);
  s += `<circle cx="${eye[0].toFixed(1)}" cy="${eye[1].toFixed(1)}" r=".9" fill="${HAIR}"/>`;
  return s;
}
const PROP = `stroke="currentColor" stroke-opacity=".55" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const PROPF = `fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-opacity=".5"`;
function jp(J, at){ return typeof at==='string' ? J[at] : at; }
function drawProp(pr, J){
  const k = pr.k;
  if (k==='floor') return '';
  if (k==='box'){ const [x,y,w,h] = pr.r; return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" ${PROPF}/>`; }
  if (k==='poly') return `<polygon points="${pr.pts.map(P).join(' ')}" ${PROPF}/>`;
  if (k==='bar'){ const c = jp(J, pr.at||pr.p); return (pr.at ? '' : `<line x1="${(c[0]-30).toFixed(1)}" y1="${c[1].toFixed(1)}" x2="${(c[0]+30).toFixed(1)}" y2="${c[1].toFixed(1)}" stroke="currentColor" stroke-opacity=".28" stroke-width="3" stroke-linecap="round"/>`) + (pr.post ? `<line x1="${c[0].toFixed(1)}" y1="${c[1].toFixed(1)}" x2="${c[0].toFixed(1)}" y2="${FL}" ${PROP} stroke-width="2.4"/>` : '') + `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="4.6" fill="currentColor" fill-opacity=".85"/>`; }
  if (k==='wall') return `<rect x="${pr.x}" y="0" width="${pr.w||10}" height="${FL}" ${PROPF}/>`;
  if (k==='post'){ const c = jp(J, pr.at); return `<line x1="${c[0].toFixed(1)}" y1="${(c[1]+3).toFixed(1)}" x2="${c[0].toFixed(1)}" y2="${FL}" ${PROP} stroke-width="3"/><circle cx="${c[0].toFixed(1)}" cy="${(c[1]+2).toFixed(1)}" r="3" fill="currentColor" fill-opacity=".7"/>`; }
  if (k==='pole'){ return `<line x1="${pr.x}" y1="4" x2="${pr.x}" y2="${FL}" ${PROP} stroke-width="4"/>`; }
  if (k==='rings'){ const c = jp(J, pr.at); return `<line x1="${c[0].toFixed(1)}" y1="${pr.y!=null?pr.y:0}" x2="${c[0].toFixed(1)}" y2="${(c[1]-5).toFixed(1)}" ${PROP} stroke-width="1.4"/><circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="5" ${PROP} stroke-width="2.2"/>`; }
  if (k==='cable' || k==='band'){ const a = jp(J, pr.from), b = jp(J, pr.at); return `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" ${PROP} stroke-width="${k==='band'?2.6:1.4}" ${k==='band'?'stroke-dasharray="1 0"':''}/>` + (k==='cable' ? `<circle cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="4" ${PROP} stroke-width="1.6"/>` : ''); }
  if (k==='db'){ const c = jp(J, pr.at); return `<rect x="${(c[0]-7).toFixed(1)}" y="${(c[1]-3.5).toFixed(1)}" width="14" height="7" rx="2" fill="currentColor" fill-opacity=".7"/>`; }
  if (k==='kb'){ const c = jp(J, pr.at); return `<circle cx="${c[0].toFixed(1)}" cy="${(c[1]+7).toFixed(1)}" r="7" fill="currentColor" fill-opacity=".7"/><circle cx="${c[0].toFixed(1)}" cy="${(c[1]+1).toFixed(1)}" r="3" ${PROP} stroke-width="2"/>`; }
  if (k==='plate'){ const c = jp(J, pr.at), r = pr.r||11; return `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${r}" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-opacity=".6" stroke-width="2"/><circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="2" fill="currentColor" fill-opacity=".7"/>`; }
  if (k==='stick'){ const a = jp(J, pr.a), b = jp(J, pr.b); const v = [b[0]-a[0], b[1]-a[1]], L = Math.hypot(...v)||1, e = pr.ext||10; return `<line x1="${(a[0]-v[0]/L*e).toFixed(1)}" y1="${(a[1]-v[1]/L*e).toFixed(1)}" x2="${(b[0]+v[0]/L*e).toFixed(1)}" y2="${(b[1]+v[1]/L*e).toFixed(1)}" ${PROP} stroke-width="${pr.w||3}"/>`; }
  if (k==='hbar'){ const c = jp(J, pr.at), w = pr.w||40; return `<line x1="${(c[0]-w/2).toFixed(1)}" y1="${c[1].toFixed(1)}" x2="${(c[0]+w/2).toFixed(1)}" y2="${c[1].toFixed(1)}" ${PROP} stroke-width="3"/>`; }
  if (k==='pad'){ const c = jp(J, pr.at), d = pr.d||[0,0]; return `<circle cx="${(c[0]+d[0]).toFixed(1)}" cy="${(c[1]+d[1]).toFixed(1)}" r="${pr.r||5}" ${PROPF}/>`; }
  if (k==='wheel'){ const c = jp(J, pr.at); return `<circle cx="${c[0].toFixed(1)}" cy="${(FL-9).toFixed(1)}" r="9" ${PROP} stroke-width="2.4"/>`; }
  if (k==='rope'){ const a = J.W, y = FL+4 - J.rp*(FL-J.Hd[1]+30); const x0 = a[0]-34, x1 = a[0]+10; return `<path d="M${P(a)} C${(x0).toFixed(1)},${y.toFixed(1)} ${(x1+30).toFixed(1)},${y.toFixed(1)} ${P(a)}" ${PROP} stroke-width="1.4"/>`; }
  if (k==='plat'){ const c = J.A, u = dir(J.leg1.a[1]+90); const a = add(c,u,-16), b = add(c,u,16); const o = dir(J.leg1.a[1]); return `<line x1="${(a[0]+o[0]*4).toFixed(1)}" y1="${(a[1]+o[1]*4).toFixed(1)}" x2="${(b[0]+o[0]*4).toFixed(1)}" y2="${(b[1]+o[1]*4).toFixed(1)}" ${PROP} stroke-width="5"/>`; }
  if (k==='line'){ return `<polyline points="${pr.pts.map(p=>P(jp(J,p))).join(' ')}" ${PROP} stroke-width="${pr.w||2}"/>`; }
  if (k==='circ'){ const c = jp(J, pr.at); return `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${pr.r}" ${PROP} stroke-width="1.6" stroke-dasharray="3 3"/>`; }
  return '';
}
const HELD = new Set(['db','kb','plate','hbar','stick','wheel','bar']);
function frameSVG(A, pose, groups, pulse){
  const J = solve(pose, A.v, A.m);
  const props = A.p || [];
  const front = A.v==='f', m = A.m;
  let s = A.nofloor ? '' : `<line x1="0" y1="${FL}" x2="240" y2="${FL}" stroke="currentColor" stroke-opacity=".3" stroke-width="1.5"/>`;
  for (const pr of props) if (!HELD.has(pr.k) && !pr.top) s += drawProp(pr, J);
  const LEG = new Set(['th','sh']), ARM = new Set(['ua','fa','sho']), TOR = new Set(['tor']);
  if (front){
    s += legShape(J.Hp2, J.K2, J.A2, J.T2, false) + legShape(J.Hp, J.K, J.A, J.T, false);
    s += torsoShape(J, true, m);
    s += drawMuscles(J, groups, m, true, pulse, TOR, 'b') + drawMuscles(J, groups, m, true, pulse, LEG, 'b');
    s += armShape(J.S2, J.E2, J.W2, false) + armShape(J.S, J.E, J.W, false);
    s += drawMuscles(J, groups, m, true, pulse, ARM, 'b');
    s += headShape(J, true, m);
  } else {
    s += armShape(J.S2, J.E2, J.W2, true);
    s += legShape(J.Hp2, J.K2, J.A2, J.T2, true);
    s += torsoShape(J, false, m);
    s += drawMuscles(J, groups, m, false, pulse, TOR, 'n');
    s += legShape(J.Hp, J.K, J.A, J.T, false);
    s += drawMuscles(J, groups, m, false, pulse, LEG, 'n');
    s += headShape(J, false, m);
    s += armShape(J.S, J.E, J.W, false);
    s += drawMuscles(J, groups, m, false, pulse, ARM, 'n');
  }
  for (const pr of props) if (HELD.has(pr.k) || pr.top) s += drawProp(pr, J);
  return s;
}
const ease = x=>x<.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2;
function poseAt(A, time){
  const seq = A.s || (A.k.length===1 ? [[0,1]] : A.k.length===2 ? [[1,1.1],[1,.35],[0,1.1],[0,.35]] : A.k.map((_,i)=>[(i+1)%A.k.length, .9]));
  const total = seq.reduce((a,b)=>a+b[1],0);
  let tt = (time % total + total) % total, from = seq[seq.length-1][0];
  for (const [to, d] of seq){
    if (tt <= d){ const x = A.lin ? tt/d : ease(tt/d); return lerp(A.k[from], unwrapPose(A.k[from], A.k[to]), x); }
    tt -= d; from = to;
  }
  return A.k[from];
}
const cache = {};
function build(name, e){
  const key = name + '|' + ((e&&e.muscles)||'') + '|' + ((e&&e.equip)||'') + '|' + ((e&&e.sub)||'');
  if (cache[key]) return cache[key];
  const spec = (typeof EXA_MAP!=='undefined' && EXA_MAP[name]) || guess(e || {name});
  const fn = EXA_T[spec[0]] || EXA_T.stand;
  const A = fn(spec[1]||{});
  A.g = muscleGroups((e&&e.muscles)||'');
  cache[key] = A;
  return A;
}
function guess(e){
  const n = (e.name||'').toLowerCase(), eq = String(e.equip||'pc'), sub = e.sub, pat = e.pattern;
  const w = /mancuerna/.test(eq) ? 'db' : /kb/.test(eq) ? 'kb' : /barraol/.test(eq) ? 'bb' : /banda/.test(eq) ? 'band' : /polea/.test(eq) ? 'cable' : '';
  if (/flexi/.test(n)) return ['pushup', {}];
  if (/dominada|chin/.test(n)) return ['pullup', {}];
  if (/remo/.test(n)) return pat==='Tracción' && /barra|anillas/.test(eq) ? ['invrow', {rings:/anillas/.test(eq)}] : ['bentrow', {w}];
  if (/fondo/.test(n)) return ['dip', {}];
  if (/curl/.test(n) && !/femoral/.test(n)) return ['curl', {w}];
  if (/plancha/.test(n)) return ['plank', {}];
  if (/zancada|búlgara/.test(n)) return ['lunge', {w}];
  if (/sentadilla/.test(n)) return ['squat', {w}];
  if (/peso muerto|rumano/.test(n)) return ['hinge', {w}];
  if (/puente|hip thrust/.test(n)) return ['bridge', {}];
  if (/gemelo/.test(n)) return ['calf', {}];
  if (/press/.test(n)) return pat==='Empuje' && sub==='vertical' ? ['ohp', {w}] : ['bench', {w}];
  const bySub = {vertical: pat==='Empuje' ? ['ohp',{w}] : ['pullup',{}], horizontal: pat==='Empuje' ? ['pushup',{}] : ['invrow',{}], fondos:['dip',{}], rodilla:['squat',{w}], cadera:['hinge',{w}], unilateral:['lunge',{w}], gemelo:['calf',{}],
    antiext:['plank',{}], lateral:['sideplank',{}], flexion:['crunch',{}], rotacion:['twist',{}], metcon:['burpee',{}], pliometria:['jumpsquat',{}], cardio:['run',{}], movilidad:['stretch',{}], aislamiento: pat==='Piernas' ? ['legext',{}] : ['curl',{w}]};
  return bySub[sub] || ['stand', {}];
}
function svg(name, e, time){
  const A = build(name, e);
  const pose = poseAt(A, time*(A.speed||1));
  const pulse = (Math.sin(time*3.2)+1)/2;
  return frameSVG(A, pose, A.g, pulse);
}
function still(name, e, idx){
  const A = build(name, e);
  return frameSVG(A, A.k[Math.min(idx, A.k.length-1)], A.g, .6);
}
function legend(e){
  const parts = String(e.muscles||'').split(/,\s*/).filter(Boolean);
  return parts.map((m,i)=>{ const g = muscleGroups(m); const has = g.prim.size || g.sec.size; return `<span class="mchip"><i style="background:${!has ? 'transparent' : i===0 ? C1 : C2};${has?'':'border:1px dashed currentColor'}"></i>${m.replace(/</g,'&lt;')}</span>`; }).join('');
}

/* ----- mapa del cuerpo (frente y espalda) ----- */
function bodyMap(e){
  const g = muscleGroups((e&&e.muscles)||'');
  const col = k => g.prim.has(k) ? C1 : g.sec.has(k) ? C2 : null;
  const R = (k, d) => { const c = col(k); return `<path d="${d}" fill="${c || SKIN}" stroke="${c ? '#7A3A1C' : LINE}" stroke-width="${c?.7:.5}" stroke-opacity="${c?.6:.45}"/>`; };
  const el = (k, cx, cy, rx, ry, rot=0)=>{ const c = col(k); const base = (k==='gluteo'||k==='psoas') ? SHORTS : SKIN; return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="${c || base}" stroke="${c ? '#7A3A1C' : (k==='gluteo'||k==='psoas') ? '#1B2436' : LINE}" stroke-width="${c?.7:.5}" stroke-opacity="${c?.6:.45}"/>`; };
  const fig = (cx, back)=>{
    let s = '';
    const sk = (d)=>`<path d="${d}" fill="${SKIN}" stroke="${LINE}" stroke-width="1"/>`;
    // silueta
    s += sk(cap([cx-17,44],[cx-23,80],6,4.6)) + sk(cap([cx-23,80],[cx-26,108],4.6,3.4)) + `<circle cx="${cx-26.5}" cy="111" r="3.8" fill="${SKIN}" stroke="${LINE}"/>`;
    s += sk(cap([cx+17,44],[cx+23,80],6,4.6)) + sk(cap([cx+23,80],[cx+26,108],4.6,3.4)) + `<circle cx="${cx+26.5}" cy="111" r="3.8" fill="${SKIN}" stroke="${LINE}"/>`;
    s += sk(cap([cx-8,100],[cx-9,140],8.4,5.8)) + sk(cap([cx-9,140],[cx-9,178],5.8,3.8));
    s += sk(cap([cx+8,100],[cx+9,140],8.4,5.8)) + sk(cap([cx+9,140],[cx+9,178],5.8,3.8));
    s += `<path d="M${cx-12},102 Q${cx-15},84 ${cx-15},70 L${cx-19},44 Q${cx},34 ${cx+19},44 L${cx+15},70 Q${cx+15},84 ${cx+12},102 Z" fill="${SKIN}" stroke="${LINE}" stroke-width="1"/>`;
    s += sk(cap([cx,30],[cx,38],4,4));
    // músculos
    if (!back){
      s += R('trapecio', `M${cx-5},36 L${cx-14},42 L${cx-5},41 Z M${cx+5},36 L${cx+14},42 L${cx+5},41 Z`);
      s += el('hombro', cx-19, 47, 5.6, 6.6, 15) + el('hombro', cx+19, 47, 5.6, 6.6, -15);
      s += el('pecho', cx-7.5, 53, 7.2, 5.8) + el('pecho', cx+7.5, 53, 7.2, 5.8);
      s += el('serrato', cx-13, 64, 2.4, 4.2) + el('serrato', cx+13, 64, 2.4, 4.2);
      s += R('abdomen', `M${cx-6.5},62 L${cx+6.5},62 L${cx+6},92 Q${cx},96 ${cx-6},92 Z`);
      s += `<path d="M${cx},63 L${cx},93 M${cx-6},70 L${cx+6},70 M${cx-6},78 L${cx+6},78 M${cx-6},86 L${cx+6},86" stroke="${LINE}" stroke-width=".5" stroke-opacity=".5"/>`;
      s += el('oblicuos', cx-11, 78, 3.2, 9) + el('oblicuos', cx+11, 78, 3.2, 9);
      s += el('biceps', cx-21.5, 63, 3.6, 9.5, 10) + el('biceps', cx+21.5, 63, 3.6, 9.5, -10);
      s += el('antebrazo', cx-24.5, 93, 3.4, 11, 8) + el('antebrazo', cx+24.5, 93, 3.4, 11, -8);
      s += `<path d="M${cx-17},96 L${cx+17},96 L${cx+18},118 L${cx+2},118 L${cx},106 L${cx-2},118 L${cx-18},118 Z" fill="${SHORTS}"/>`;
      s += el('psoas', cx-6, 100, 2.6, 4.2, -20) + el('psoas', cx+6, 100, 2.6, 4.2, 20);
      s += el('cuadriceps', cx-9.5, 132, 5.8, 13) + el('cuadriceps', cx+9.5, 132, 5.8, 13);
      s += el('aductor', cx-3.5, 124, 2.2, 7) + el('aductor', cx+3.5, 124, 2.2, 7);
      s += el('tibial', cx-10, 158, 2.4, 11) + el('tibial', cx+10, 158, 2.4, 11);
      s += `<circle cx="${cx}" cy="18" r="10" fill="${SKIN}" stroke="${LINE}"/><path d="M${cx-10},17 Q${cx-9},6 ${cx},6 Q${cx+9},6 ${cx+10},17 Q${cx+5},10 ${cx},11 Q${cx-5},10 ${cx-10},17 Z" fill="${HAIR}"/>`;
      if (g.prim.has('corazon') || g.sec.has('corazon')) s += `<path d="M${cx+7},60 l-4,-4 a2.3,2.3 0 1 1 4,-2.8 a2.3,2.3 0 1 1 4,2.8 z" fill="#E5484D"/>`;
    } else {
      s += R('trapecio', `M${cx},32 L${cx+13},43 L${cx+5},47 L${cx},58 L${cx-5},47 L${cx-13},43 Z`);
      s += el('hombro', cx-19, 47, 5.6, 6.6, 15) + el('hombro', cx+19, 47, 5.6, 6.6, -15);
      s += R('espalda', `M${cx-4},48 L${cx-11},50 L${cx-10},60 L${cx-3},62 Z M${cx+4},48 L${cx+11},50 L${cx+10},60 L${cx+3},62 Z`);
      s += R('dorsal', `M${cx-15},50 Q${cx-17},66 ${cx-10},82 L${cx-4},76 L${cx-4},64 L${cx-11},61 Z M${cx+15},50 Q${cx+17},66 ${cx+10},82 L${cx+4},76 L${cx+4},64 L${cx+11},61 Z`);
      s += R('lumbar', `M${cx-8},78 L${cx-1},78 L${cx-1},95 L${cx-9},95 Z M${cx+8},78 L${cx+1},78 L${cx+1},95 L${cx+9},95 Z`);
      s += el('triceps', cx-21.5, 63, 3.8, 9.5, 10) + el('triceps', cx+21.5, 63, 3.8, 9.5, -10);
      s += el('antebrazo', cx-24.5, 93, 3.4, 11, 8) + el('antebrazo', cx+24.5, 93, 3.4, 11, -8);
      s += `<path d="M${cx-17},96 L${cx+17},96 L${cx+18},118 L${cx+2},118 L${cx},110 L${cx-2},118 L${cx-18},118 Z" fill="${SHORTS}"/>`;
      s += el('gluteo', cx-7, 105, 7, 8) + el('gluteo', cx+7, 105, 7, 8);
      s += el('isquio', cx-9.5, 134, 5.4, 12.5) + el('isquio', cx+9.5, 134, 5.4, 12.5);
      s += el('gemelo', cx-9.5, 154, 4.6, 9) + el('gemelo', cx+9.5, 154, 4.6, 9);
      s += `<circle cx="${cx}" cy="18" r="10" fill="${HAIR}" stroke="${LINE}"/>`;
    }
    s += `<path d="${cap([cx-9,178],[cx-12,183],3.6,3)}" fill="${SHOE}"/><path d="${cap([cx+9,178],[cx+12,183],3.6,3)}" fill="${SHOE}"/>`;
    s += `<text x="${cx}" y="198" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity=".7">${back?'Espalda':'Frente'}</text>`;
    return s;
  };
  return `<svg class="bodymap" viewBox="0 0 200 202" role="img" aria-label="Mapa de músculos trabajados">${fig(50,false)}${fig(150,true)}</svg>`;
}
// bucle único: anima todos los <svg class="exanim"> visibles
let running = false;
const reduce = typeof matchMedia!=='undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
function tick(ts){
  const els = document.querySelectorAll('svg.exanim');
  if (!els.length){ running = false; return; }
  const time = ts/1000;
  els.forEach(el=>{
    const n = el.getAttribute('data-ex');
    if (el._paused) return;
    const e = (typeof lib==='function') ? lib(n) : {name:n};
    try { el.innerHTML = reduce ? still(n, e, (Math.floor(time/2.2))%2) : svg(n, e, time); } catch(err){ el.innerHTML = ''; }
  });
  requestAnimationFrame(tick);
}
function start(){ if (!running && typeof requestAnimationFrame!=='undefined'){ running = true; requestAnimationFrame(tick); } }
return {svg, still, legend, bodyMap, start, build, muscleGroups, solve, LEN, FL, AY, HY, dir, add, ang, ik};
})();
