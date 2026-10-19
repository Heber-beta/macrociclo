'use strict';
/* ================= Configuración y constantes ================= */
const CFG = window.APP_CONFIG || {};
const V1 = window.V1_DATA || null;
const $ = s => document.querySelector(s);
const PATTERNS = ['Tracción','Empuje','Piernas','Core','Habilidad','Acondicionamiento','Movilidad'];
const SUBS = {vertical:'Vertical',horizontal:'Horizontal',fondos:'Fondos / tríceps',rodilla:'Rodilla dominante',cadera:'Cadera dominante',unilateral:'Unilateral',gemelo:'Gemelos / tibial',antiext:'Anti-extensión',lateral:'Lateral / acarreo',flexion:'Flexión',rotacion:'Anti-rotación',metcon:'Metabólico',pliometria:'Pliometría',cardio:'Cardio',movilidad:'Movilidad'};
const EQUIP = {pc:'Peso corporal',barra:'Barra de dominadas',paralelas:'Paralelas',anillas:'Anillas',banda:'Bandas elásticas',banco:'Banco, cajón o silla',mancuernas:'Mancuernas',kb:'Kettlebell',barraol:'Barra olímpica y discos',polea:'Máquinas y poleas',comba:'Comba'};
const WEIGHTED = new Set(['mancuernas','kb','barraol','polea']);
const WDAYS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const WDAYS_L = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const WEEK_TYPES = ['Carga','Descarga','Test','Descarga + Test','Test final','Transición'];
const SESS_TYPES = ['Carga','Descarga','Test','Técnica','Transición'];
const PHASES = {E:'Evaluación inicial',PG:'Preparatoria general',PE:'Preparatoria específica',R:'Realización',T:'Transición'};
const LEVELS = {1:'Principiante',2:'Intermedio',3:'Avanzado'};
const GOALS = {
  fuerza:{label:'Fuerza',desc:'Más fuerza relativa: dominadas, fondos, pistol y variantes cada vez más difíciles.',
    ph:{PG:{r:[8,12],rest:90,rpe:[6,8],s:3,tempo:'3-1-1-0'},PE:{r:[5,8],rest:150,rpe:[7,9],s:4,tempo:'2-1-1-0'},R:{r:[3,5],rest:180,rpe:[8,9],s:4,tempo:'2-0-X-0'}},
    names:{PG:'Adaptación anatómica',PE:'Fuerza',R:'Fuerza máxima'},crit:'Completar todas las series en el tope del rango con RPE ≤ 8; entonces pasa a la variante siguiente.'},
  hipertrofia:{label:'Hipertrofia',desc:'Ganar masa muscular con volumen moderado-alto y cerca del fallo.',
    ph:{PG:{r:[10,15],rest:75,rpe:[6,8],s:3,tempo:'3-1-1-0'},PE:{r:[8,12],rest:90,rpe:[7,9],s:4,tempo:'3-0-1-0'},R:{r:[6,10],rest:120,rpe:[8,9],s:4,tempo:'2-0-1-0'}},
    names:{PG:'Acumulación',PE:'Hipertrofia',R:'Intensificación'},crit:'Llegar al tope del rango en todas las series antes de sumar dificultad o lastre.'},
  resistencia:{label:'Resistencia muscular',desc:'Más repeticiones y menos descanso: aguantar más series y circuitos.',
    ph:{PG:{r:[12,20],rest:60,rpe:[6,7],s:2,tempo:'2-0-1-0'},PE:{r:[15,25],rest:45,rpe:[7,8],s:3,tempo:'2-0-1-0'},R:{r:[20,30],rest:45,rpe:[8,9],s:3,tempo:'1-0-1-0'}},
    names:{PG:'Base',PE:'Resistencia a la fuerza',R:'Resistencia específica'},crit:'Completar el volumen con descansos cortos manteniendo la técnica.'},
  habilidades:{label:'Habilidades',desc:'Pino, L-sit, front lever, muscle-up: fuerza base más práctica técnica diaria.',
    ph:{PG:{r:[8,12],rest:90,rpe:[6,8],s:3,tempo:'3-1-1-0'},PE:{r:[5,8],rest:150,rpe:[7,8],s:4,tempo:'2-1-1-0'},R:{r:[3,6],rest:180,rpe:[7,9],s:4,tempo:'2-0-X-0'}},
    names:{PG:'Base de fuerza',PE:'Fuerza en habilidades',R:'Consolidación de habilidades'},crit:'Mantener la habilidad el tiempo objetivo con buena forma en 3 series.',skill:true},
  recomposicion:{label:'Pérdida de grasa',desc:'Mantener o ganar músculo en déficit, con un final metabólico que suma gasto.',
    ph:{PG:{r:[10,15],rest:60,rpe:[6,8],s:3,tempo:'3-1-1-0'},PE:{r:[8,12],rest:75,rpe:[7,8],s:3,tempo:'2-0-1-0'},R:{r:[6,10],rest:90,rpe:[8,9],s:4,tempo:'2-0-1-0'}},
    names:{PG:'Adaptación',PE:'Hipertrofia metabólica',R:'Densidad'},crit:'Mantener las repeticiones aunque baje el peso corporal; si caen 2 semanas seguidas, baja el volumen.',metcon:true},
  general:{label:'Condición general',desc:'Fuerza, movilidad y salud: equilibrado y sostenible.',
    ph:{PG:{r:[10,15],rest:60,rpe:[6,7],s:2,tempo:'3-1-1-0'},PE:{r:[8,12],rest:75,rpe:[7,8],s:3,tempo:'2-0-1-0'},R:{r:[6,10],rest:90,rpe:[7,9],s:3,tempo:'2-0-1-0'}},
    names:{PG:'Base',PE:'Desarrollo',R:'Consolidación'},crit:'Completar el plan con RPE dentro del objetivo durante toda la semana.'},
};
const SPLITS = {
  fb:{label:'Cuerpo completo',days:[
    {name:'Cuerpo completo A',slots:[['Tracción','vertical'],['Empuje','horizontal'],['Piernas','rodilla'],['Piernas','cadera'],['Core','antiext'],['Core','lateral']]},
    {name:'Cuerpo completo B',slots:[['Empuje','vertical'],['Tracción','horizontal'],['Piernas','unilateral'],['Empuje','fondos'],['Core','flexion'],['Piernas','gemelo']]},
    {name:'Cuerpo completo C',slots:[['Tracción','vertical'],['Empuje','fondos'],['Piernas','unilateral'],['Piernas','cadera'],['Core','rotacion'],['Core','flexion']]}]},
  tp:{label:'Torso / pierna',days:[
    {name:'Torso 1',slots:[['Tracción','vertical'],['Empuje','horizontal'],['Tracción','horizontal'],['Empuje','vertical'],['Empuje','fondos'],['Core','antiext']]},
    {name:'Pierna 1',slots:[['Piernas','rodilla'],['Piernas','cadera'],['Piernas','unilateral'],['Piernas','gemelo'],['Core','flexion'],['Core','lateral']]},
    {name:'Torso 2',slots:[['Tracción','horizontal'],['Empuje','vertical'],['Tracción','vertical'],['Empuje','horizontal'],['Empuje','fondos'],['Core','rotacion']]},
    {name:'Pierna 2',slots:[['Piernas','unilateral'],['Piernas','cadera'],['Piernas','rodilla'],['Piernas','gemelo'],['Core','antiext'],['Core','flexion']]}]},
  ppl:{label:'Empuje / tracción / pierna',days:[
    {name:'Empuje',slots:[['Empuje','horizontal'],['Empuje','vertical'],['Empuje','fondos'],['Empuje','horizontal'],['Core','antiext']]},
    {name:'Tracción',slots:[['Tracción','vertical'],['Tracción','horizontal'],['Tracción','vertical'],['Tracción','horizontal'],['Core','flexion']]},
    {name:'Pierna',slots:[['Piernas','rodilla'],['Piernas','cadera'],['Piernas','unilateral'],['Piernas','gemelo'],['Core','lateral']]},
    {name:'Torso',slots:[['Tracción','vertical'],['Empuje','horizontal'],['Tracción','horizontal'],['Empuje','vertical'],['Core','rotacion']]},
    {name:'Pierna y core',slots:[['Piernas','unilateral'],['Piernas','cadera'],['Piernas','rodilla'],['Core','antiext'],['Core','flexion']]}]},
};
const ICONS = {
  hoy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="12" cy="15" r="1.6" fill="currentColor"/></svg>',
  plan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V12M9 20V8M14 20V5M19 20v-9"/></svg>',
  progreso:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-5 4 3 8-8"/><path d="M15 7h5v5"/></svg>',
  tests:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 2h6M19 6l-1.5 1.5"/></svg>',
  cuerpo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 9a5 5 0 0 1 8 0M12 9l1.5-2"/></svg>',
  diario:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/></svg>',
  ajustes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
  menu:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
};
const MTABS = [['hoy','Hoy'],['diario','Diario'],['plan','Plan'],['progreso','Progreso'],['tests','Tests'],['cuerpo','Cuerpo'],['ajustes','Ajustes']];

/* ================= Utilidades ================= */
function esc(s){ return String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function num(v){ return (v===''||v==null||isNaN(+v)) ? null : +v; }
function sum(a){ return a.reduce((x,y)=>x+(y||0),0); }
function avg(a){ const b=a.filter(x=>x!=null); return b.length ? sum(b)/b.length : null; }
function fmt(n,d=0){ return n==null||isNaN(n) ? '—' : Number(n).toLocaleString('es-CL',{maximumFractionDigits:d}); }
function pct(n){ return n==null ? '—' : Math.round(n*100) + '%'; }
function clone(x){ return x==null ? x : JSON.parse(JSON.stringify(x)); }
function uid(){ return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function parseD(s){ const [y,m,d] = String(s||'').split('-').map(Number); return new Date(y||2026,(m||1)-1,d||1); }
function isoD(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function addD(d,n){ const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function today(){ const t = new Date(); t.setHours(0,0,0,0); return t; }
function fd(d,opt){ return d.toLocaleDateString('es-CL', opt || {weekday:'short',day:'numeric',month:'short'}); }
function nextMonday(){ const t = today(); const k = (8 - t.getDay()) % 7 || 7; return addD(t,k); }
function round5(x){ return Math.max(5, Math.round(x/5)*5); }
function typeCls(t){ t = t||''; return /test/i.test(t) ? 'test' : /descarga/i.test(t) ? 'deload' : /transi|técnica/i.test(t) ? 'trans' : 'load'; }
function unitLbl(u){ return u==='seg' ? 's' : 'reps'; }
function fid(path){ return 'f_' + path.replace(/[^\w]/g,'_'); }

/* ================= Biblioteca ================= */
const BUILTIN = LIBRARY.map(a=>({name:a[0],pattern:a[1],sub:a[2],equip:a[3],unit:a[4],level:a[5],pct:a[6],muscles:a[7],tech:a[8],reg:a[9],prog:a[10],builtin:true}));
let _allEx = null;
function allEx(){
  if (_allEx) return _allEx;
  const c = (S.settings.custom||[]).map(e=>({...e, custom:true}));
  const names = new Set(c.map(e=>e.name));
  _allEx = [...c, ...BUILTIN.filter(e=>!names.has(e.name))];
  return _allEx;
}
function lib(name){ return allEx().find(e=>e.name===name) || {name, pattern:'—', sub:'', equip:'pc', unit:'reps', level:1, pct:0, muscles:'', tech:'', reg:'', prog:''}; }
function equipOk(e, set){ return String(e.equip||'pc').split('+').every(q=>q==='pc'||set.has(q)); }
function equipLbl(e){ return String(e.equip||'pc').split('+').map(q=>EQUIP[q]||q).join(' + '); }

/* ================= Estado ================= */
function defaultProfile(){ return {name:'',weight0:null,height:null,age:null,sex:'',kcalTrain:null,kcalRest:null,protein:1.8,activity:1.55,waterGoal:null}; }
const DIARIO = '_diario';
function emptyState(){ return {settings:{profile:defaultProfile(), custom:[]}, macros:{}, entries:{}}; }
function normState(o){ const e = emptyState(); if (!o) return e; return {settings:{profile:Object.assign(e.settings.profile, o.settings?.profile||{}), custom:o.settings?.custom||[]}, macros:o.macros||{}, entries:o.entries||{}}; }
let S = emptyState();
const UI = {screen:'home', mid:null, tab:'hoy', week:null, sess:null, editPlan:false, libQ:'', libPat:'', libEq:'', libLvl:0, libOpen:null, libEdit:null,
  wiz:null, confirm:null, auth:'login', authMsg:'', menu:false, importText:''};

/* ================= Backends ================= */
const LocalB = { name:'local', needsAuth:false, async init(){ return {id:'local'}; }, async loadAll(){ return null; }, async loadEntries(){ return null; }, async put(){} };

const ArtB = {
  name:'artifact', needsAuth:false, db:null,
  async init(){ try { this.db = await window.claude.use('db'); } catch(e){ this.db = null; } return this.db ? {id:'claude'} : null; },
  async loadAll(){
    const db = this.db;
    const [s, ms] = await Promise.all([db.doc('settings/main').get(), db.collection('macros').limit(500).get()]);
    const macros = {}; ms.docs.forEach(d=>{ if (d.exists) macros[d.id] = d.data(); });
    const out = {settings: s.exists ? s.data() : null, macros};
    if (!Object.keys(macros).length) { const mig = await this.migrateV1(); if (mig) out.migrated = mig; }
    return out;
  },
  async migrateV1(){
    const db = this.db;
    try {
      const [plan, prof, logs, body] = await Promise.all([db.doc('app/plan').get(), db.doc('app/profile').get(), db.collection('logs').limit(1000).get(), db.collection('body').limit(1000).get()]);
      if (!plan.exists && logs.empty && body.empty) return null;
      const o = {weeks: plan.exists ? plan.data().weeks : null, plan: plan.exists ? plan.data().plan : null, profile: prof.exists ? prof.data().profile : null, targets: prof.exists ? prof.data().targets : null, logs:{}, body:{}};
      logs.docs.forEach(d=>o.logs[d.id]=d.data()); body.docs.forEach(d=>o.body[d.id]=d.data());
      return fromV1(o);
    } catch(e){ return null; }
  },
  async loadEntries(mid){
    const q = await this.db.collection('entries').where('m','==',mid).limit(1000).get();
    const out = {}; q.docs.forEach(d=>{ const x = d.data(); if (x && x.k) out[x.k] = x.d; }); return out;
  },
  async put(kind, id, data){
    const db = this.db; let ref, body = data;
    if (kind==='settings') ref = db.doc('settings/main');
    else if (kind==='macro') ref = db.doc('macros/'+id);
    else { const [m,k] = id.split('|'); ref = db.doc('entries/'+m+'__'+k.replace(/[^\w\-.~:@+]/g,'_')); body = data==null ? null : {m, k, d:data}; }
    if (body==null) await ref.delete(); else await ref.set(body);
  }
};

const SupaB = {
  name:'supabase', needsAuth:true, sb:null, user:null,
  async init(){
    if (!window.supabase) throw new Error('No se pudo cargar el servicio de usuarios.');
    this.sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}});
    this.sb.auth.onAuthStateChange((ev, sess)=>{
      this.user = sess?.user || null;
      if (ev==='PASSWORD_RECOVERY'){ UI.auth = 'newpass'; renderAuth(); }
    });
    const {data} = await this.sb.auth.getSession();
    this.user = data.session?.user || null;
    return this.user;
  },
  async loadAll(){
    const sb = this.sb;
    const [s, m] = await Promise.all([sb.from('settings').select('data').maybeSingle(), sb.from('macros').select('id,data')]);
    if (s.error) throw s.error; if (m.error) throw m.error;
    const macros = {}; (m.data||[]).forEach(r=>macros[r.id] = r.data);
    return {settings: s.data ? s.data.data : null, macros};
  },
  async loadEntries(mid){
    const r = await this.sb.from('entries').select('key,data').eq('macro_id', mid).limit(5000);
    if (r.error) throw r.error;
    const out = {}; (r.data||[]).forEach(x=>out[x.key] = x.data); return out;
  },
  async put(kind, id, data){
    if (!this.user) throw new Error('sin sesión');
    const sb = this.sb, user_id = this.user.id, now = new Date().toISOString(); let r;
    if (kind==='settings') r = await sb.from('settings').upsert({user_id, data, updated_at:now});
    else if (kind==='macro'){
      if (data==null){ r = await sb.from('entries').delete().eq('macro_id', id); if (!r.error) r = await sb.from('macros').delete().eq('id', id); }
      else r = await sb.from('macros').upsert({id, user_id, data, updated_at:now});
    } else {
      const [m,k] = id.split('|');
      r = data==null ? await sb.from('entries').delete().match({macro_id:m, key:k})
                     : await sb.from('entries').upsert({user_id, macro_id:m, key:k, data, updated_at:now}, {onConflict:'user_id,macro_id,key'});
    }
    if (r && r.error) throw r.error;
  }
};

/* ================= Autoguardado (caché local + cola de cambios) ================= */
const Sync = {
  b:LocalB, user:null, dirty:new Set(), timer:null, busy:false, again:false, status:'ok', loaded:new Set(),
  ck(){ return 'macrociclo2:' + this.b.name + ':' + (this.user?.id || 'anon'); },
  saveCache(){ try { localStorage.setItem(this.ck(), JSON.stringify({S, dirty:[...this.dirty]})); } catch(e){} },
  loadCache(){ try { const o = JSON.parse(localStorage.getItem(this.ck()) || 'null'); if (o){ S = normState(o.S); this.dirty = new Set(o.dirty||[]); return true; } } catch(e){} return false; },
  mark(key){ if (!key) return; this.dirty.add(key); this.saveCache(); this.setStatus('saving'); clearTimeout(this.timer); this.timer = setTimeout(()=>this.flush(), 700); },
  value(key){
    if (key==='settings') return S.settings;
    if (key.startsWith('macro:')) return S.macros[key.slice(6)] || null;
    const [m,k] = key.slice(6).split('|'); const v = S.entries[m]?.[k]; return v==null ? null : v;
  },
  async flush(){
    if (this.busy){ this.again = true; return; }
    if (this.b.name==='local'){ this.dirty.clear(); this.saveCache(); this.setStatus('ok'); return; }
    if (!this.dirty.size){ this.setStatus('ok'); return; }
    this.busy = true; let failed = false;
    for (const key of [...this.dirty]){
      this.dirty.delete(key);
      const kind = key==='settings' ? 'settings' : key.startsWith('macro:') ? 'macro' : 'entry';
      const id = kind==='settings' ? null : key.slice(6);
      try { await this.b.put(kind, id, clone(this.value(key))); }
      catch(e){ this.dirty.add(key); failed = true; console.warn('guardado', e); break; }
    }
    this.busy = false; this.saveCache();
    if (failed){ this.setStatus('err'); clearTimeout(this.timer); this.timer = setTimeout(()=>this.flush(), 8000); }
    else if (this.dirty.size || this.again){ this.again = false; this.flush(); }
    else this.setStatus('ok');
  },
  setStatus(s){ this.status = s; const el = $('#sync'); if (!el) return; el.className = 'sync ' + s; el.querySelector('span').textContent = this.label(); },
  label(){
    if (this.b.name==='local') return 'Guardado en este navegador';
    return {ok:'Guardado', saving:'Guardando…', err:'Sin conexión · se guardará solo'}[this.status] || '';
  }
};
window.addEventListener('online', ()=>Sync.flush());
document.addEventListener('visibilitychange', ()=>{ if (document.visibilityState==='hidden') Sync.flush(); else if (UI.sess) keepAwake(true); });

function markMacro(M){ M.updated = new Date().toISOString(); Sync.mark('macro:'+M.id); }
function markEntry(mid, k){ Sync.mark('entry:'+mid+'|'+k); }
function markSettings(){ _allEx = null; Sync.mark('settings'); }

/* ================= Arranque y sesión ================= */
async function boot(){
  if (CFG.supabaseUrl && CFG.supabaseKey){
    Sync.b = SupaB; renderLoading();
    let last = null; try { last = JSON.parse(localStorage.getItem('macrociclo2:lastUser') || 'null'); } catch(e){}
    const timeout = new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')), 10000));
    try {
      const u = await Promise.race([SupaB.init(), timeout]);
      if (!u){ renderAuth(); return; }
      await startSession(u);
    } catch(e){
      console.warn('arranque', e);
      if (last && last.id){ SupaB.user = SupaB.user || last; await startSession(last); toast('Sin conexión con el servidor: trabajando con tus datos guardados en este equipo. Se sincroniza solo al volver la conexión.'); return; }
      UI.authMsg = e.message==='timeout' ? 'El servidor no responde. Revisa tu conexión a internet y toca Reintentar.' : 'No se pudo conectar: ' + (e.message||e);
      renderAuth(); const f = $('#authForm'); if (f) f.insertAdjacentHTML('beforeend', '<button class="btn" onclick="location.reload()">Reintentar</button>');
    }
    return;
  }
  if (window.claude && window.claude.use){
    renderLoading();
    const u = await ArtB.init();
    if (u){ Sync.b = ArtB; await startSession(u); return; }
  }
  Sync.b = LocalB; await startSession({id:'local'});
}
function renderLoading(){ $('#app').innerHTML = `<div class="auth"><p class="muted">Cargando…</p></div>`; }
async function startSession(user){
  if (Sync.b===SupaB && user && user.id){ try { localStorage.setItem('macrociclo2:lastUser', JSON.stringify({id:user.id, email:user.email})); } catch(e){} }
  Sync.user = user; Sync.loaded = new Set();
  if (!Sync.loadCache()) S = emptyState();
  _allEx = null;
  if (Sync.b.name==='local' && !Object.keys(S.macros).length){
    try { const v1 = JSON.parse(localStorage.getItem('macrociclo-calistenia-v1')||'null'); if (v1 && v1.plan) applyImport(fromV1(v1), false); } catch(e){}
  }
  render();
  if (Sync.b.name==='local') { Sync.setStatus('ok'); return; }
  Sync.setStatus('saving');
  try {
    const r = await Sync.b.loadAll();
    if (r){
      if (r.settings && !Sync.dirty.has('settings')) S.settings = normState({settings:r.settings}).settings;
      for (const id of Object.keys(S.macros)) if (!r.macros[id] && !Sync.dirty.has('macro:'+id) && !r.migrated) { delete S.macros[id]; delete S.entries[id]; }
      for (const [id,m] of Object.entries(r.macros)) if (!Sync.dirty.has('macro:'+id)) S.macros[id] = m;
      if (r.migrated) applyImport(r.migrated, true);
    }
    _allEx = null; Sync.saveCache();
    if (UI.mid) await loadEntries(UI.mid);
    await loadEntries(DIARIO);
    Sync.dirty.size ? Sync.flush() : Sync.setStatus('ok');
  } catch(e){ console.warn(e); Sync.setStatus('err'); setTimeout(()=>Sync.flush(), 8000); }
  render();
}
async function loadEntries(mid){
  if (Sync.b.name==='local' || Sync.loaded.has(mid)) return;
  try {
    const r = await Sync.b.loadEntries(mid);
    if (!r) return;
    const E = S.entries[mid] || (S.entries[mid] = {});
    for (const k of Object.keys(E)) if (!(k in r) && !Sync.dirty.has('entry:'+mid+'|'+k)) delete E[k];
    for (const [k,v] of Object.entries(r)) if (!Sync.dirty.has('entry:'+mid+'|'+k)) E[k] = v;
    Sync.loaded.add(mid); Sync.saveCache(); softRender();
  } catch(e){ console.warn(e); Sync.setStatus('err'); }
}

/* ================= Login ================= */
function renderAuth(){
  const m = UI.auth, msg = UI.authMsg ? `<p class="alert ${UI.authOk?'ok':'crit'}">${esc(UI.authMsg)}</p>` : '';
  let body;
  if (m==='newpass') body = `<h2>Nueva contraseña</h2><label class="f">Contraseña nueva (mínimo 8 caracteres)<input type="password" id="a_pw" autocomplete="new-password"></label><button class="btn primary lg" data-act="authNewPass">Guardar contraseña</button>`;
  else if (m==='reset') body = `<h2>Recuperar contraseña</h2><p class="small muted">Te enviaremos un correo con un enlace para crear una contraseña nueva.</p><label class="f">Correo<input type="email" id="a_email" autocomplete="email"></label><button class="btn primary lg" data-act="authReset">Enviar enlace</button><button class="btn ghost" data-act="authMode" data-arg="login">Volver a entrar</button>`;
  else if (m==='signup') body = `<h2>Crear cuenta</h2><label class="f">Correo<input type="email" id="a_email" autocomplete="email"></label><label class="f">Contraseña (mínimo 8 caracteres)<input type="password" id="a_pw" autocomplete="new-password"></label><label class="f">Repite la contraseña<input type="password" id="a_pw2" autocomplete="new-password"></label><button class="btn primary lg" data-act="authSignup">Crear cuenta</button><button class="btn ghost" data-act="authMode" data-arg="login">Ya tengo cuenta</button>`;
  else body = `<h2>Entrar</h2><label class="f">Correo<input type="email" id="a_email" autocomplete="email"></label><label class="f">Contraseña<input type="password" id="a_pw" autocomplete="current-password"></label><button class="btn primary lg" data-act="authLogin">Entrar</button><div class="row between"><button class="btn ghost" data-act="authMode" data-arg="signup">Crear cuenta</button><button class="btn ghost" data-act="authMode" data-arg="reset">Olvidé mi contraseña</button></div>`;
  $('#app').innerHTML = `<div class="auth"><form class="card" id="authForm" onsubmit="return false"><div class="logo">Macro<em>ciclo</em></div><p class="muted">Planifica, registra y controla tus macrociclos de entrenamiento.</p>${msg}${body}</form></div>`;
}
function authErr(e){
  const m = (e && (e.message||e.error_description)) || String(e);
  if (/invalid login/i.test(m)) return 'Correo o contraseña incorrectos.';
  if (/email not confirmed/i.test(m)) return 'Confirma tu correo: revisa tu bandeja de entrada y abre el enlace.';
  if (/already registered/i.test(m)) return 'Ese correo ya tiene una cuenta. Entra o recupera la contraseña.';
  if (/password/i.test(m) && /6|8|short|least/i.test(m)) return 'La contraseña es muy corta.';
  if (/rate limit/i.test(m)) return 'Demasiados intentos. Espera unos minutos.';
  return m;
}
async function authDo(kind){
  const email = $('#a_email')?.value.trim(), pw = $('#a_pw')?.value || '', pw2 = $('#a_pw2')?.value;
  UI.authOk = false;
  try {
    if (kind==='login'){
      const {data, error} = await SupaB.sb.auth.signInWithPassword({email, password:pw}); if (error) throw error;
      UI.authMsg = ''; await startSession(data.user); return;
    }
    if (kind==='signup'){
      if (pw.length < 8) { UI.authMsg = 'La contraseña debe tener al menos 8 caracteres.'; return renderAuth(); }
      if (pw !== pw2) { UI.authMsg = 'Las contraseñas no coinciden.'; return renderAuth(); }
      const {data, error} = await SupaB.sb.auth.signUp({email, password:pw, options:{emailRedirectTo: location.origin + location.pathname}}); if (error) throw error;
      if (data.session){ UI.authMsg = ''; await startSession(data.user); return; }
      UI.authOk = true; UI.authMsg = 'Cuenta creada. Revisa tu correo y abre el enlace de confirmación; luego entra aquí.'; UI.auth = 'login'; return renderAuth();
    }
    if (kind==='reset'){
      const {error} = await SupaB.sb.auth.resetPasswordForEmail(email, {redirectTo: location.origin + location.pathname}); if (error) throw error;
      UI.authOk = true; UI.authMsg = 'Si el correo tiene cuenta, te llegará un enlace para crear una contraseña nueva.'; UI.auth = 'login'; return renderAuth();
    }
    if (kind==='newpass'){
      if (pw.length < 8) { UI.authMsg = 'La contraseña debe tener al menos 8 caracteres.'; return renderAuth(); }
      const {data, error} = await SupaB.sb.auth.updateUser({password:pw}); if (error) throw error;
      UI.authMsg = ''; UI.auth = 'login'; toast('Contraseña actualizada'); await startSession(data.user); return;
    }
  } catch(e){ UI.authMsg = authErr(e); renderAuth(); }
}
async function signOut(){
  await Sync.flush();
  if (Sync.dirty.size){ UI.confirm = {msg:'Hay cambios sin subir (sin conexión). Si sales ahora quedarán solo en este dispositivo.', act:'forceSignOut', label:'Salir igual'}; render(); return; }
  forceSignOut();
}
async function forceSignOut(){ try { localStorage.removeItem('macrociclo2:lastUser'); } catch(e){} if (Sync.b===SupaB) await SupaB.sb.auth.signOut(); S = emptyState(); UI.screen = 'home'; UI.mid = null; UI.auth = 'login'; UI.authMsg = ''; renderAuth(); }

/* ================= Macrociclo: helpers ================= */
function curM(){ return UI.mid ? S.macros[UI.mid] : null; }
function E(M){ return S.entries[M.id] || (S.entries[M.id] = {}); }
function nWeeks(M){ return M.weeks.length; }
function weekStart(M,w){ return addD(parseD(M.start), w*7); }
function dayOf(M,k){ return M.days.find(d=>d.k===k) || {k, off:0, name:''}; }
function sessDate(M,w,k){ return addD(weekStart(M,w), dayOf(M,k).off); }
function rawWeek(M){ return Math.floor((today() - parseD(M.start)) / 864e5 / 7); }
function curWeek(M){ return Math.max(0, Math.min(nWeeks(M)-1, rawWeek(M))); }
function week(M,w){ return M.weeks[w]; }
function meso(M,n){ return M.mesos.find(m=>m.n===n); }
function sessKeys(M){ const a=[]; M.weeks.forEach(W=>M.days.forEach(d=>{ if (M.sessions[W.w+'-'+d.k]) a.push([W.w,d.k]); })); return a; }
function logOf(M,w,k){ return E(M)['log:'+w+'-'+k] || {}; }
function bw(M,w){ const e=E(M); for (let i=w;i>=0;i--){ const b=e['body:'+i]; if (b && num(b.weight)!=null) return +b.weight; } return num(S.settings.profile.weight0) ?? 70; }
function lastWeight(M){ const e=E(M); let r=null; M.weeks.forEach(W=>{ const b=e['body:'+W.w]; if (b && num(b.weight)!=null) r={w:W.w,v:+b.weight}; }); return r; }
function testWeeks(M){ return M.weeks.filter(W=>/test/i.test(W.type)).map(W=>W.w); }

/* ----- cálculos ----- */
function itemCalc(M,w,k,i){
  const it = M.sessions[w+'-'+k].items[i], L = (logOf(M,w,k).ex||[])[i] || {}, e = lib(it.ex), sec = e.unit==='seg';
  const sets = (L.sets||[]).filter(s=>s && num(s.r)!=null);
  const sp = num(it.s)||0, rp = num(it.r)||0, pl = sp*rp, re = sum(sets.map(s=>+s.r));
  const base = bw(M,w)*(+e.pct||0);
  const ton = sec ? 0 : Math.round(sum(sets.map(s=>s.r*(base + (num(s.kg) ?? num(it.kg) ?? 0)))));
  const rpes = sets.map(s=>num(s.rpe)).filter(x=>x!=null);
  return {sec, volPlan:sec?0:pl, volReal:sec?0:re, tutPlan:sec?pl:0, tutReal:sec?re:0, ton, n:sets.length,
    best: sets.length ? Math.max(...sets.map(s=>+s.r)) : null, rpe: rpes.length ? Math.max(...rpes) : null,
    compl: sets.length && pl ? re/pl : null, logged: sets.length>0, load: Math.round((base + (num(it.kg)||0))*10)/10};
}
function sessCalc(M,w,k){
  const p = M.sessions[w+'-'+k]; if (!p) return null;
  const L = logOf(M,w,k);
  let vp=0,vr=0,tp=0,tr=0,ton=0; const rr=[], ro=[];
  p.items.forEach((it,i)=>{ const c=itemCalc(M,w,k,i); vp+=c.volPlan; vr+=c.volReal; tp+=c.tutPlan; tr+=c.tutReal; ton+=c.ton; if(c.rpe!=null) rr.push(c.rpe); if(num(it.rpe)!=null) ro.push(+it.rpe); });
  const done = !!L.done, dur = num(L.dur), rpe = num(L.rpe), h = [L.sleep,L.fatigue,L.soreness,L.stress].map(num);
  return {w,k,type:p.t,date:sessDate(M,w,k),done,dur,rpe,srpe: done ? (dur||0)*(rpe||0) : 0, hooper: h.every(x=>x!=null) ? sum(h) : null,
    vp,vr,tp,tr,ton, rpeReal:avg(rr), rpeObj:avg(ro), compl: done && (vp+tp)>0 ? (vr+tr)/(vp+tp) : null, n:p.items.length};
}
function allWeeks(M){
  const e = E(M);
  const out = M.weeks.map(W=>{
    const ss = M.days.map(d=>sessCalc(M,W.w,d.k)).filter(Boolean);
    const load = sum(ss.map(s=>s.srpe)), mean = load/7, sd = Math.sqrt(Math.max(0, sum(ss.map(s=>s.srpe**2))/7 - mean*mean));
    const mono = load>0 && sd>0 ? mean/sd : null, b = e['body:'+W.w];
    return {...W, ss, planned:ss.length, done:ss.filter(s=>s.done).length, load, mono, strain: mono!=null ? Math.round(load*mono) : null,
      vp:sum(ss.map(s=>s.vp)), vr:sum(ss.map(s=>s.vr)), tp:sum(ss.map(s=>s.tp)), tr:sum(ss.map(s=>s.tr)), ton:sum(ss.map(s=>s.ton)),
      rpeReal:avg(ss.map(s=>s.rpeReal)), rpeObj:avg(ss.map(s=>s.rpeObj)), hooper:avg(ss.map(s=>s.hooper)),
      weight: b && num(b.weight)!=null ? +b.weight : null, waist: b && num(b.waist)!=null ? +b.waist : null};
  });
  out.forEach((o,i)=>{ const win = out.slice(Math.max(0,i-3), i+1); o.chronic = avg(win.map(x=>x.load)); o.acwr = (i>=3 && o.load>0 && o.chronic>0) ? o.load/o.chronic : null; o.alert = alertFor(o); });
  return out;
}
function alertFor(o){
  if (!o.load) return ['info','Sin datos'];
  if (o.acwr!=null && o.acwr>1.5) return ['crit','ACWR alto: baja la carga'];
  if (o.mono!=null && o.mono>2) return ['warn','Monotonía alta: varía las sesiones'];
  if (o.hooper!=null && o.hooper>20) return ['warn','Bienestar bajo: prioriza descanso'];
  if (o.rpeReal!=null && o.rpeObj!=null && o.rpeReal - o.rpeObj > 1) return ['warn','RPE sobre el objetivo: repite la semana'];
  if (o.acwr!=null && o.acwr<0.8) return ['info','Carga baja frente a tu media'];
  return ['ok','OK'];
}
function testVal(M,name,w){
  const e = E(M);
  if (name==='__peso') return num(e['body:'+w]?.weight);
  if (name==='__cintura') return num(e['body:'+w]?.waist);
  const direct = num(e['test:'+w]?.[name]); if (direct!=null) return direct;
  let best = null;
  M.days.forEach(d=>{ const p = M.sessions[w+'-'+d.k]; if (!p) return; p.items.forEach((it,i)=>{ if (it.ex!==name) return; const c = itemCalc(M,w,d.k,i); if (c.best!=null) best = Math.max(best??0, c.best); }); });
  return best;
}
function nextSession(M){
  const t = today().getTime(), list = sessKeys(M);
  return list.find(([w,k])=>sessDate(M,w,k).getTime()===t) || list.find(([w,k])=>sessDate(M,w,k).getTime()>t && !logOf(M,w,k).done) || list.find(([w,k])=>!logOf(M,w,k).done) || list[list.length-1];
}
function macroSummary(M){
  const list = sessKeys(M), done = list.filter(([w,k])=>logOf(M,w,k).done).length;
  const past = list.filter(([w,k])=>sessDate(M,w,k) <= today());
  return {total:list.length, done, adh: past.length ? past.filter(([w,k])=>logOf(M,w,k).done).length/past.length : null};
}

/* ================= Generador de macrociclos ================= */
function planWeeks(o){
  // o: {weeks, loadW, testInit, retestEvery, testFinal, trans}
  const types = [];
  if (o.testInit) types.push({type:'Test', phase:'E', meso:0});
  const trainN = Math.max(1, o.weeks - types.length - o.trans);
  const mlen = o.loadW + 1; let m = 0, left = trainN;
  while (left > 0){
    m++; const len = Math.min(mlen, left);
    for (let j=0;j<len;j++){
      const isLast = j===len-1 && len===mlen;
      types.push({type: isLast ? 'Descarga' : 'Carga', meso:m, j, len});
    }
    left -= len;
  }
  const nM = m;
  // fases por proporción de mesociclos
  types.forEach(t=>{ if (t.meso>0){ const f = (t.meso-0.5)/nM; t.phase = nM<=1 ? 'PE' : f < 0.4 ? 'PG' : f < 0.75 ? 'PE' : 'R'; } });
  // re-tests en la descarga de cada N mesociclos
  if (o.retestEvery){ types.forEach(t=>{ if (t.type==='Descarga' && t.meso % o.retestEvery===0 && t.meso<nM) t.type = 'Descarga + Test'; }); }
  if (o.testFinal){ const last = types[types.length-1]; if (last && last.meso>0) last.type = 'Test final'; }
  for (let i=0;i<o.trans;i++) types.push({type:'Transición', phase:'T', meso:nM+1});
  return {types, nM};
}
function pickEx(slot, eq, lvl, variant, used, style){
  const [pattern, sub] = slot;
  const ok = e => e.pattern===pattern && equipOk(e,eq) && e.level<=lvl && e.sub!=='movilidad';
  let c = allEx().filter(e=>ok(e) && (sub==null || e.sub===sub));
  if (!c.length) c = allEx().filter(ok);
  if (!c.length) return null;
  const weighted = e => String(e.equip).split('+').some(q=>WEIGHTED.has(q));
  const score = e => e.level*10 + (style==='gym' && weighted(e) ? 25 : 0) + (style==='cal' && !weighted(e) ? 25 : 0) + (e.unit==='reps' && pattern!=='Core' ? 3 : 0);
  c.sort((a,b)=>score(b)-score(a) || a.name.localeCompare(b.name));
  const top = c.filter(e=>score(e) >= score(c[0]) - 10);
  const pool = top.filter(e=>!used.has(e.name));
  const p = pool.length ? pool : top;
  return p[variant % p.length];
}
function itemFor(e, P, j, len, kind){
  const sec = e.unit==='seg';
  const toUnit = r => sec ? Math.min(60, round5(r <= 6 ? r*4 : r*2)) : r;
  let s = P.s, r, rpe, note = '';
  const loadW = Math.max(1, len - 1);
  if (kind==='carga'){ const f = loadW>1 ? j/(loadW-1) : 0; r = Math.round(P.r[0] + (P.r[1]-P.r[0])*f); rpe = Math.round(P.rpe[0] + (P.rpe[1]-P.rpe[0])*f); }
  else if (kind==='descarga'){ s = Math.max(1, Math.round(P.s*0.6)); r = P.r[0]; rpe = 5; note = 'Descarga: no llegues al fallo'; }
  else { s = 2; r = Math.max(5, P.r[0]); rpe = 5; note = kind==='tecnica' ? 'Ritmo cómodo, foco en la técnica' : 'Descanso activo'; }
  return {ex:e.name, s, r:toUnit(r), kg:null, rest: e.pattern==='Core' ? Math.min(60,P.rest) : P.rest, tempo:P.tempo, rpe, note};
}
function defaultTests(eq){
  const want = [['Dead hang','barra'],['Dominada prona','barra'],['Remo australiano','barra'],['Flexión',null],['Fondos en paralelas','paralelas'],['Fondos en banco','banco'],['Sentadilla aire',null],['Sentadilla búlgara','banco'],['Plancha',null],['Hollow body hold',null],['Elevación de rodillas colgado','barra']];
  const out = []; let fondos = false;
  for (const [n,q] of want){ if (q && !eq.has(q)) continue; if (n.startsWith('Fondos')){ if (fondos) continue; fondos = true; } const e = lib(n); out.push({name:n, unit:e.unit, better:'↑', protocol: e.unit==='seg' ? 'Máximo tiempo con técnica estricta.' : (n==='Sentadilla aire' ? 'Máximas reps completas en 60 s.' : 'Máximas repeticiones estrictas en una serie.'), target:null}); }
  return out;
}
function generateMacro(wz){
  const G = GOALS[wz.goal], eq = new Set(['pc', ...wz.equip]);
  const daysSel = wz.dows.slice().sort((a,b)=>a-b), nd = daysSel.length;
  const splitKey = nd<=3 ? 'fb' : nd===4 ? 'tp' : 'ppl';
  const SP = SPLITS[splitKey];
  const dayDefs = daysSel.map((dow,i)=>{
    let def;
    if (splitKey==='fb') def = SP.days[i % 3];
    else if (splitKey==='tp') def = SP.days[i % 4];
    else def = nd===5 ? SP.days[i] : SP.days[i % 3];
    let slots = def.slots.slice();
    if (G.skill) slots = [['Habilidad',null], ...slots.slice(0, slots.length-1)];
    if (G.metcon) slots = [...slots, ['Acondicionamiento', i%2 ? 'pliometria' : 'metcon']];
    return {k:String.fromCharCode(65+i), off:dow, name: def.name + (nd>5 && i>=3 ? ' 2' : ''), slots};
  });
  const {types, nM} = planWeeks({weeks:wz.weeks, loadW:wz.loadW, testInit:wz.testInit, retestEvery:wz.retestEvery, testFinal:wz.testFinal, trans:wz.trans});
  const baseLvl = {1:2, 2:3, 3:4}[wz.level] || 2;
  // mesociclos
  const mesos = [];
  if (wz.testInit) mesos.push({n:0, name:'Evaluación inicial', phase:PHASES.E, objective:'Medir el punto de partida y aprender la técnica.', range:'Máximo', rest:'3 min', rpe:'10', methods:'Batería de tests + sesión de técnica.', criterion:'Completar todos los tests con buena técnica.'});
  const phaseCount = {};
  for (let m=1;m<=nM;m++){
    const t = types.find(x=>x.meso===m), ph = t.phase, P = G.ph[ph] || G.ph.PE;
    phaseCount[ph] = (phaseCount[ph]||0) + 1;
    const nm = (m===1 && ph==='PG' && wz.goal!=='resistencia') ? 'Adaptación anatómica' : G.names[ph];
    const roman = ['','I','II','III','IV','V','VI'][phaseCount[ph]] || phaseCount[ph];
    const wks = types.filter(x=>x.meso===m).map(x=>types.indexOf(x));
    mesos.push({n:m, name: nm + (types.filter(x=>x.phase===ph).length > (wz.loadW+1) ? ' ' + roman : ''), phase:PHASES[ph], objective: G.desc,
      range: `${P.r[0]}-${P.r[1]}`, rest:`${P.rest} s`, rpe:`${P.rpe[0]}-${P.rpe[1]}`, methods:`${P.s} series por ejercicio, tempo ${P.tempo}. ${wz.loadW} semanas de carga progresiva y 1 de descarga.`,
      criterion:G.crit, weeks: `${wks[0]}-${wks[wks.length-1]}`});
  }
  if (wz.trans) mesos.push({n:nM+1, name:'Transición', phase:PHASES.T, objective:'Recuperación activa antes del siguiente macrociclo.', range:'10-15', rest:'60 s', rpe:'5', methods:'Volumen e intensidad bajos, movilidad y otras actividades.', criterion:'Llegar descansado al siguiente macrociclo.'});
  // ejercicios por mesociclo, día y posición
  const choice = {};
  for (let m=1;m<=nM;m++){
    const lvl = Math.min(5, baseLvl + Math.floor((m-1)/2));
    dayDefs.forEach((d,di)=>{
      const used = new Set();
      choice[m+'-'+d.k] = d.slots.map((slot,si)=>{ const e = pickEx(slot, eq, lvl, di + si, used, wz.style); if (e) used.add(e.name); return e; });
    });
  }
  const tests = defaultTests(eq);
  const weeks = [], sessions = {};
  const easy = (d,di) => { const used = new Set(); return d.slots.map((slot,si)=>{ const e = pickEx(slot, eq, Math.max(1, baseLvl-1), di+si, used, wz.style); if (e) used.add(e.name); return e; }); };
  types.forEach((t,w)=>{
    const ph = t.phase, P = G.ph[ph] || G.ph.PG;
    let goal;
    if (t.type==='Test') goal = 'Evaluación inicial y aprendizaje técnico';
    else if (t.type==='Descarga + Test') goal = 'Descarga (-40% de series) y re-test para medir avances';
    else if (t.type==='Test final') goal = 'Test final del macrociclo';
    else if (t.type==='Descarga') goal = 'Descarga: -40% de series, RPE 5, técnica y recuperación';
    else if (t.type==='Transición') goal = 'Descanso activo, movilidad y otras actividades';
    else goal = `Carga progresiva ${t.j+1}/${Math.max(1,t.len-1)}: sube reps o tiempo respecto a la semana anterior`;
    weeks.push({w, meso:t.meso, phase:PHASES[ph], type:t.type, goal});
    const isTestW = /test/i.test(t.type);
    const half = Math.ceil(tests.length/2);
    dayDefs.forEach((d,di)=>{
      const k = w+'-'+d.k;
      if (isTestW && di < 2){
        const part = di===0 ? tests.slice(0,half) : tests.slice(half);
        sessions[k] = {t:'Test', items: part.map(tt=>({ex:tt.name, s:1, r:null, kg:null, rest:180, tempo:'MÁX', rpe:10, note:'Test: 1 serie al máximo con técnica estricta.'}))};
        return;
      }
      let kind, exs, Pp = P;
      if (t.type==='Transición'){ kind = 'trans'; exs = easy(d,di); Pp = G.ph.PG; }
      else if (t.type==='Test'){ kind = 'tecnica'; exs = easy(d,di); Pp = G.ph.PG; }
      else { exs = choice[t.meso+'-'+d.k] || easy(d,di); kind = /descarga|test/i.test(t.type) ? 'descarga' : 'carga'; }
      const items = exs.filter(Boolean).map(e=>itemFor(e, Pp, t.j||0, t.len||wz.loadW+1, kind));
      sessions[k] = {t: kind==='carga' ? 'Carga' : kind==='descarga' ? 'Descarga' : kind==='tecnica' ? 'Técnica' : 'Transición', items};
    });
  });
  return {id:uid(), name: wz.name || ('Macrociclo de ' + GOALS[wz.goal].label.toLowerCase()), goal:wz.goal, level:wz.level, style:wz.style, start:wz.start,
    equip:[...wz.equip], split: SPLITS[splitKey].label, days: dayDefs.map(d=>({k:d.k, off:d.off, name:d.name})), mesos, weeks, sessions, tests,
    notes:'', created:new Date().toISOString(), updated:new Date().toISOString(), archived:false};
}
/* Plantilla del Excel original (v1) */
function fromV1(o){
  const d = V1;
  const weeks = (o.weeks || d.weeks.map(a=>({w:a[0],meso:a[1],phase:a[2],type:a[3],goal:a[4]}))).map(x=>({...x}));
  const plan = o.plan || (()=>{ const p = {}; for (const [k,v] of Object.entries(d.plan)) p[k] = {t:v.t, items:v.items.map(a=>({ex:a[0],s:a[1],r:a[2],kg:a[3],rest:a[4],tempo:a[5]||'',rpe:a[6],note:a[7]||''}))}; return p; })();
  const mesos = d.mesos.map(m=>({n:m[0], name:m[1], weeks:m[2], phase:m[3], objective:m[4], range:m[5], rest:m[6], rpe:m[7], methods:m[8], criterion:m[9]}));
  const tests = d.tests.filter(t=>t[1]!=='kg' && t[1]!=='cm').map(t=>({name:t[0], unit:t[1], better:t[2], protocol:t[3], target: o.targets?.[t[0]] ?? t[4]}));
  const p = o.profile || {};
  const M = {id:uid(), name:'Calistenia 27 semanas', goal:'fuerza', level:1, style:'cal', start:p.start || isoD(nextMonday()), equip:['barra','banco','paralelas'], split:'Cuerpo completo',
    days:[{k:'A',off:0,name:'Tracción + piernas'},{k:'B',off:2,name:'Empuje + core'},{k:'C',off:4,name:'Cuerpo completo'}],
    mesos, weeks, sessions:plan, tests, notes:'Plan original del Excel.', created:new Date().toISOString(), updated:new Date().toISOString(), archived:false};
  const entries = {};
  for (const [k,L] of Object.entries(o.logs||{})){
    const n = {...L}; delete n.ex;
    n.ex = (L.ex||[]).map(x=>{ if (!x) return null; const s = num(x.s) ?? (num(x.r)!=null ? 1 : 0), sets = []; for (let i=0;i<s;i++) sets.push({r:num(x.r), kg:num(x.kg), rpe: i===s-1 ? num(x.rpe) : null}); return {sets}; });
    entries['log:'+k] = n;
  }
  for (const [k,b] of Object.entries(o.body||{})) entries['body:'+k.replace(/^w/,'')] = b;
  const profile = {weight0:p.weight0, height:p.height, age:p.age, sex:p.sex, kcalTrain:p.kcalTrain, kcalRest:p.kcalRest, protein:p.protein};
  return {macro:M, entries, profile};
}
function applyImport(r, mark){
  S.macros[r.macro.id] = r.macro; S.entries[r.macro.id] = Object.assign(S.entries[r.macro.id]||{}, r.entries||{});
  if (r.profile){ for (const [k,v] of Object.entries(r.profile)) if (v!=null && S.settings.profile[k]==null) S.settings.profile[k] = v; }
  if (mark){ markSettings(); markMacro(r.macro); Object.keys(r.entries||{}).forEach(k=>markEntry(r.macro.id,k)); }
  Sync.saveCache();
}

/* ================= Render ================= */
let renderQueued = false;
function softRender(){
  const a = document.activeElement;
  if (a && a.closest && a.closest('#view') && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { renderQueued = true; return; }
  if (!$('#modal').hidden && UI.modal) { renderQueued = true; return; }
  render();
}
function header(){
  const M = curM(), inMacro = UI.screen==='macro' && M;
  const sub = inMacro ? `${esc(M.name)} · ${rawWeek(M)<0 ? 'empieza el ' + fd(parseD(M.start),{day:'numeric',month:'long'}) : rawWeek(M)>=nWeeks(M) ? 'terminado' : 'semana ' + curWeek(M)}` : (S.settings.profile.name ? 'Hola, ' + esc(S.settings.profile.name) : 'Tus macrociclos');
  const tabs = inMacro ? MTABS.map(([id,l])=>`<button data-act="tab" data-arg="${id}" aria-current="${UI.tab===id && !UI.sess}">${ICONS[id]}<span>${l}</span></button>`).join('') : '';
  const menu = UI.menu ? `<div class="menu-list">
      <button data-act="go" data-arg="home">Mis macrociclos</button>
      <button data-act="newMacro">Crear macrociclo</button>
      <button data-act="go" data-arg="diario">Diario: notas, agua y comida</button>
      <button data-act="go" data-arg="library">Biblioteca de ejercicios</button>
      <button data-act="go" data-arg="guide">Guía y escala de Borg</button>
      <button data-act="go" data-arg="profile">Perfil y datos</button>
      ${installEvt ? '<button data-act="install">Instalar app en este equipo</button>' : ''}
      ${Sync.b===SupaB ? '<button data-act="signOut">Cerrar sesión</button>' : ''}</div>` : '';
  return `<header class="top"><div class="wrap top-in">
    <button class="brand" data-act="go" data-arg="home">Macrociclo<small>${sub}</small></button>
    <div class="top-r"><div class="sync ${Sync.b.name==='local'?'':Sync.status}" id="sync"><i></i><span>${Sync.label()}</span></div>
      <div class="menu"><button class="icon-btn" data-act="menu" aria-label="Menú" aria-expanded="${UI.menu}">${ICONS.menu}</button>${menu}</div></div>
    ${tabs ? `<nav class="tabs">${tabs}</nav>` : ''}
  </div></header>${tabs ? `<nav class="tabs bottom">${tabs}</nav>` : ''}`;
}
function render(){
  renderQueued = false;
  if (Sync.b===SupaB && !SupaB.user) return renderAuth();
  const a = document.activeElement, focusId = a && a.id, sel = a && 'selectionStart' in a ? [a.selectionStart,a.selectionEnd] : null;
  CHARTS.length = 0;
  const M = curM();
  if (UI.screen==='macro' && !M) UI.screen = 'home';
  let html;
  if (UI.screen==='macro'){
    if (UI.sess) html = viewSession(M);
    else html = ({hoy:viewHoy,diario:viewDiario,plan:viewPlan,progreso:viewProgreso,tests:viewTests,cuerpo:viewCuerpo,ajustes:viewAjustes})[UI.tab](M);
  } else html = ({diario:()=>viewDiario(null), home:viewHome, wizard:viewWizard, library:viewLibrary, guide:viewGuide, profile:viewProfile})[UI.screen]();
  const confirm = UI.confirm ? `<div class="alert crit row between"><span>${esc(UI.confirm.msg)}</span><span class="row"><button class="btn danger sm" data-act="${UI.confirm.act}" data-arg="${esc(UI.confirm.arg||'')}">${esc(UI.confirm.label||'Confirmar')}</button><button class="btn sm" data-act="cancelConfirm">Cancelar</button></span></div>` : '';
  $('#app').innerHTML = header() + `<main class="wrap" id="view">${confirm}${html}</main>`;
  drawCharts();
  if (focusId){ const el = document.getElementById(focusId); if (el){ el.focus({preventScroll:true}); if (sel && el.setSelectionRange) try{ el.setSelectionRange(sel[0],sel[1]); }catch(e){} } }
}

/* ----- campos enlazados ----- */
// rutas: s.<ruta en settings> | m.<ruta en macro actual> | e.<clave de entrada>.<ruta>
function resolve(path){
  const p = path.split('.'), root = p.shift();
  if (root==='s') return {obj:S.settings, parts:p, mark:()=>markSettings()};
  const M = curM();
  if (root==='m') return {obj:M, parts:p, mark:()=>markMacro(M)};
  if (root==='e'){ const k = p.shift(); const Ex = E(M); if (!Ex[k]) Ex[k] = {}; return {obj:Ex[k], parts:p, mark:()=>markEntry(M.id,k), cleanup:()=>{ if (!Object.keys(Ex[k]).length) delete Ex[k]; }}; }
  if (root==='d'){ const k = p.shift(); const Ex = S.entries[DIARIO] || (S.entries[DIARIO] = {}); if (!Ex[k]) Ex[k] = {}; return {obj:Ex[k], parts:p, mark:()=>markEntry(DIARIO,k), cleanup:()=>{ if (!Object.keys(Ex[k]).length) delete Ex[k]; }}; }
  if (root==='ui') return {obj:UI, parts:p, mark:()=>{}};
  return null;
}
function getPath(path){ const r = resolve(path); if (!r) return undefined; let o = r.obj; for (const k of r.parts){ if (o==null) return undefined; o = o[k]; } return o; }
function setPath(path, val){
  const r = resolve(path); if (!r) return;
  let o = r.obj;
  for (let i=0;i<r.parts.length-1;i++){ const k = r.parts[i], nx = r.parts[i+1]; if (o[k]==null) o[k] = /^\d+$/.test(nx) ? [] : {}; o = o[k]; }
  const last = r.parts[r.parts.length-1];
  if (val===null || val==='') delete o[last]; else o[last] = val;
  if (r.cleanup) r.cleanup();
  r.mark();
}
function numIn(path, o={}){ const v = getPath(path); return `<input type="number" inputmode="decimal" id="${fid(path)}" data-k="${path}" value="${v??''}" ${o.ph!=null?`placeholder="${esc(o.ph)}"`:''} step="${o.step||'any'}" ${o.min!=null?`min="${o.min}"`:''} ${o.max!=null?`max="${o.max}"`:''}>`; }
function txtIn(path, o={}){ const v = getPath(path); return `<input type="text" id="${fid(path)}" data-k="${path}" ${o.lazy?'data-lazy="1"':''} value="${esc(v??'')}" ${o.ph?`placeholder="${esc(o.ph)}"`:''}>`; }
function selIn(path, opts){ const v = getPath(path); return `<select id="${fid(path)}" data-k="${path}">${opts.map(o=>{ const [val,lab] = Array.isArray(o) ? o : [o,o]; return `<option value="${esc(val)}" ${String(val)===String(v)?'selected':''}>${esc(lab)}</option>`; }).join('')}</select>`; }
function chips(path, from, to, label){ const v = num(getPath(path)); let s = `<div class="chips" role="group" aria-label="${esc(label||'')}">`; for (let i=from;i<=to;i++) s += `<button class="chip" data-set="${path}" data-v="${i}" aria-pressed="${v===i}">${i}</button>`; return s + '</div>'; }
function planText(it, e){
  const u = unitLbl(e.unit);
  if (it.tempo==='MÁX' || it.r==null) return `${it.s||1} × máx ${u}`;
  return `${it.s} × ${it.r} ${u}${num(it.kg)?` + ${fmt(it.kg,1)} kg`:''}`;
}
function statusPill(s){
  if (s.done) return '<span class="pill ok">Hecha</span>';
  if (s.date < today()) return '<span class="pill crit">No registrada</span>';
  if (s.date.getTime()===today().getTime()) return '<span class="pill load">Hoy</span>';
  return '<span class="pill">Pendiente</span>';
}

/* ================= Pantallas globales ================= */
function viewHome(){
  const list = Object.values(S.macros).sort((a,b)=>(a.archived-b.archived) || String(b.updated).localeCompare(String(a.updated)));
  const cards = list.map(M=>{
    const sm = macroSummary(M), rw = rawWeek(M), n = nWeeks(M);
    const state = M.archived ? '<span class="pill">Archivado</span>' : rw<0 ? `<span class="pill">Empieza ${fd(parseD(M.start),{day:'numeric',month:'short'})}</span>` : rw>=n ? '<span class="pill ok">Terminado</span>' : `<span class="pill load">Semana ${rw} de ${n-1}</span>`;
    return `<article class="card macrocard" data-act="openMacro" data-arg="${M.id}">
      <div class="row between"><div><span class="eyebrow">${esc(GOALS[M.goal]?.label||'Personalizado')} · ${n} semanas · ${M.days.length} días/semana</span><h2>${esc(M.name)}</h2></div>${state}</div>
      <div class="prog" title="${sm.done} de ${sm.total} sesiones"><i style="width:${sm.total?sm.done/sm.total*100:0}%"></i></div>
      <div class="calc"><span>Sesiones <b>${sm.done}/${sm.total}</b></span><span>Adherencia <b>${pct(sm.adh)}</b></span><span>${fd(parseD(M.start),{day:'numeric',month:'short',year:'numeric'})} – ${fd(addD(parseD(M.start), n*7-1),{day:'numeric',month:'short',year:'numeric'})}</span></div>
    </article>`;
  }).join('');
  return `<div class="row between"><div><span class="eyebrow">Planificación del entrenamiento</span><h1>Mis macrociclos</h1></div><button class="btn primary" data-act="newMacro">+ Crear macrociclo</button></div>
    ${Sync.b.name==='local' ? '<p class="alert warn">Estás usando la versión sin cuenta: los datos quedan solo en este navegador. Exporta una copia de vez en cuando desde Perfil y datos.</p>' : ''}
    ${cards ? `<div class="grid">${cards}</div>` : `<section class="card"><h2>Crea tu primer macrociclo</h2><p class="muted">Un asistente te pregunta tu objetivo, nivel, días disponibles y equipamiento, y arma el plan completo: mesociclos, semanas de carga y descarga, tests y cada sesión con sus ejercicios. Después puedes cambiar todo.</p><div class="row"><button class="btn primary lg" data-act="newMacro">Crear macrociclo</button>${V1?'<button class="btn lg" data-act="useTemplate">Usar el plan de calistenia de 27 semanas</button>':''}</div></section>`}`;
}

/* ----- Asistente ----- */
function newWizard(){ return {step:0, name:'', goal:'fuerza', level:1, style:'cal', start:isoD(nextMonday()), weeks:16, dows:[0,2,4], minutes:60, equip:['barra','banco'], loadW:3, testInit:true, retestEvery:2, testFinal:true, trans:1}; }
function viewWizard(){
  const z = UI.wiz, steps = ['Objetivo','Calendario','Equipamiento','Estructura','Revisión'];
  const nav = `<div class="steps">${steps.map((s,i)=>`<span class="${i===z.step?'on':''}">${i+1}. ${s}</span>`).join('')}</div>`;
  let body = '';
  if (z.step===0){
    body = `<label class="f">Nombre del macrociclo${txtIn('ui.wiz.name',{ph:'Ej.: Fuerza en dominadas 2027'})}</label>
      <div><span class="eyebrow">Objetivo principal</span></div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))">${Object.entries(GOALS).map(([k,g])=>`<button class="optcard" data-act="wz" data-arg="goal|${k}" aria-pressed="${z.goal===k}"><b>${g.label}</b><span class="small muted">${g.desc}</span></button>`).join('')}</div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))">
        <div><span class="eyebrow">Nivel</span><div class="seg" style="margin-top:6px">${Object.entries(LEVELS).map(([k,l])=>`<button data-act="wz" data-arg="level|${k}" aria-pressed="${+z.level===+k}">${l}</button>`).join('')}</div><p class="small muted" style="margin-top:6px">${['','Menos de 6 meses entrenando o sin dominadas estrictas.','6 meses a 2 años: dominadas y fondos con técnica.','Más de 2 años: variantes avanzadas o lastre.'][z.level]}</p></div>
        <div><span class="eyebrow">Estilo</span><div class="seg" style="margin-top:6px">${[['cal','Calistenia'],['mix','Mixto'],['gym','Gimnasio']].map(([k,l])=>`<button data-act="wz" data-arg="style|${k}" aria-pressed="${z.style===k}">${l}</button>`).join('')}</div><p class="small muted" style="margin-top:6px">Define si se priorizan ejercicios con el peso corporal o con pesas cuando hay equipamiento.</p></div>
      </div>`;
  } else if (z.step===1){
    body = `<div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">
        <label class="f">Fecha de inicio (lunes)<input type="date" id="wz_start" data-k="ui.wiz.start" value="${esc(z.start)}"></label>
        <label class="f">Duración (semanas, 6-52)${numIn('ui.wiz.weeks',{min:6,max:52,step:1})}</label>
        <label class="f">Minutos por sesión${numIn('ui.wiz.minutes',{min:20,step:5})}</label></div>
      <div><span class="eyebrow">Días de entrenamiento (${z.dows.length})</span><div class="chips" style="margin-top:6px">${WDAYS.map((d,i)=>`<button class="chip txt" data-act="wz" data-arg="dow|${i}" aria-pressed="${z.dows.includes(i)}">${d}</button>`).join('')}</div>
      <p class="small muted" style="margin-top:6px">${z.dows.length<2?'Elige al menos 2 días.':z.dows.length<=3?'Con 2-3 días se arma cuerpo completo.':z.dows.length===4?'Con 4 días se arma torso / pierna.':'Con 5-6 días se arma empuje / tracción / pierna.'} Deja al menos un día entre sesiones exigentes del mismo grupo.</p></div>
      ${parseD(z.start).getDay()!==1?'<p class="alert warn">La fecha de inicio no es lunes. Las semanas empezarán ese día de la semana.</p>':''}
      <p class="small muted">Termina el ${fd(addD(parseD(z.start), (num(z.weeks)||16)*7-1),{day:'numeric',month:'long',year:'numeric'})}.</p>`;
  } else if (z.step===2){
    body = `<p class="muted">Marca lo que tienes. Solo se elegirán ejercicios posibles con tu equipamiento; el peso corporal siempre está.</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))">${Object.entries(EQUIP).filter(([k])=>k!=='pc').map(([k,l])=>`<button class="optcard" data-act="wz" data-arg="eq|${k}" aria-pressed="${z.equip.includes(k)}"><b>${l}</b><span class="small muted">${allEx().filter(e=>String(e.equip).includes(k)).length} ejercicios</span></button>`).join('')}</div>
      <p class="small muted">Con lo que marcaste hay <b>${allEx().filter(e=>equipOk(e,new Set(['pc',...z.equip]))).length}</b> ejercicios disponibles en la biblioteca.</p>`;
  } else if (z.step===3){
    const pw = planWeeks({weeks:num(z.weeks)||16, loadW:z.loadW, testInit:z.testInit, retestEvery:z.retestEvery, testFinal:z.testFinal, trans:z.trans});
    const svg = periodSvgTypes(pw.types);
    const nTest = pw.types.filter(t=>/test/i.test(t.type)).length;
    body = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))">
      <div><span class="eyebrow">Semanas de carga por mesociclo</span><div class="seg" style="margin-top:6px">${[2,3,4,5].map(n=>`<button data-act="wz" data-arg="loadW|${n}" aria-pressed="${z.loadW===n}">${n}:1</button>`).join('')}</div><p class="small muted" style="margin-top:6px">${z.loadW} semanas subiendo la carga y 1 de descarga. 3:1 es lo más usado.</p></div>
      <div><span class="eyebrow">Evaluaciones</span><div class="chips" style="margin-top:6px"><button class="chip txt" data-act="wz" data-arg="testInit" aria-pressed="${z.testInit}">Test inicial</button><button class="chip txt" data-act="wz" data-arg="testFinal" aria-pressed="${z.testFinal}">Test final</button></div>
        <div class="seg" style="margin-top:8px">${[[0,'Sin re-tests'],[1,'Re-test cada meso'],[2,'Cada 2 mesos'],[3,'Cada 3 mesos']].map(([n,l])=>`<button data-act="wz" data-arg="retest|${n}" aria-pressed="${z.retestEvery===n}">${l}</button>`).join('')}</div></div>
      <div><span class="eyebrow">Transición al final</span><div class="seg" style="margin-top:6px">${[0,1,2].map(n=>`<button data-act="wz" data-arg="trans|${n}" aria-pressed="${z.trans===n}">${n} ${n===1?'semana':'semanas'}</button>`).join('')}</div></div>
    </div>
    <section class="card periodo"><div class="row between"><span class="small muted">${pw.types.length} semanas · ${pw.nM} mesociclos · ${nTest} semanas con test</span>${typeLegend()}</div>${svg}</section>`;
  } else {
    const G = GOALS[z.goal], nd = z.dows.length, split = nd<=3?'Cuerpo completo':nd===4?'Torso / pierna':'Empuje / tracción / pierna';
    body = `<dl class="kv"><dt>Nombre</dt><dd>${esc(z.name||'Macrociclo de '+G.label.toLowerCase())}</dd><dt>Objetivo</dt><dd>${G.label} · ${LEVELS[z.level]} · ${({cal:'Calistenia',mix:'Mixto',gym:'Gimnasio'})[z.style]}</dd>
      <dt>Calendario</dt><dd>${num(z.weeks)} semanas desde el ${fd(parseD(z.start),{weekday:'long',day:'numeric',month:'long'})}</dd><dt>Días</dt><dd>${z.dows.slice().sort().map(i=>WDAYS_L[i]).join(', ')} · ${split}</dd>
      <dt>Equipamiento</dt><dd>${['pc',...z.equip].map(k=>EQUIP[k]).join(', ')}</dd><dt>Estructura</dt><dd>${z.loadW}:1 · ${z.testInit?'test inicial, ':''}${z.retestEvery?'re-test cada '+z.retestEvery+' mesociclos, ':''}${z.testFinal?'test final, ':''}${z.trans} sem. de transición</dd></dl>
      <p class="note">Se generan todas las semanas y sesiones con series, repeticiones, descanso, tempo y RPE objetivo según el objetivo y la fase. Después puedes cambiar cualquier ejercicio, semana o mesociclo.</p>`;
  }
  const canNext = z.step!==1 || (z.dows.length>=2 && num(z.weeks)>=6 && num(z.weeks)<=52);
  return `<div class="row between"><div><span class="eyebrow">Nuevo macrociclo</span><h1>Asistente</h1></div><button class="btn ghost" data-act="go" data-arg="home">Cancelar</button></div>
    ${nav}<section class="card">${body}</section>
    <div class="row between"><button class="btn" data-act="wzStep" data-arg="-1" ${z.step===0?'disabled':''}>‹ Atrás</button>
      ${z.step<4 ? `<button class="btn primary" data-act="wzStep" data-arg="1" ${canNext?'':'disabled'}>Siguiente ›</button>` : `<button class="btn primary lg" data-act="wzCreate">Crear macrociclo</button>`}</div>`;
}
function typeLegend(){ return `<div class="legend"><span><i style="background:var(--t-test)"></i>Test</span><span><i style="background:var(--t-load)"></i>Carga</span><span><i style="background:var(--t-deload)"></i>Descarga</span><span><i style="background:var(--t-trans)"></i>Transición</span></div>`; }
function periodSvgTypes(types){
  const W = 640, H = 120, n = types.length, bw_ = (W-8)/n;
  let g = '';
  types.forEach((t,i)=>{
    const h = t.type==='Carga' ? 40 + 50*((t.j+1)/Math.max(1,(t.len||2)-1)) : /descarga/i.test(t.type) ? 45 : /test/i.test(t.type) ? 25 : 30;
    const x = 4 + i*bw_; g += `<rect x="${x+1}" y="${H-20-h}" width="${Math.max(1,bw_-2)}" height="${h}" rx="2" fill="var(--t-${typeCls(t.type)})" opacity=".8"><title>Semana ${i} · ${t.type}</title></rect>`;
    if (n<=30 || i%2===0) g += `<text x="${x+bw_/2}" y="${H-6}" text-anchor="middle" style="font-size:10px">${i}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Vista previa de la periodización">${g}</svg>`;
}

/* ----- Biblioteca ----- */
function exHistory(name){
  const out = [];
  for (const M of Object.values(S.macros)) for (const [w,k] of sessKeys(M)){ const p = M.sessions[w+'-'+k]; p.items.forEach((it,i)=>{ if (it.ex!==name) return; const c = itemCalc(M,w,k,i); if (c.logged){ const L = (logOf(M,w,k).ex||[])[i]; out.push({m:M.name, w, k, n:c.n, best:c.best, kg: Math.max(0,...(L.sets||[]).map(s=>num(s.kg)||0)), rpe:c.rpe, date:sessDate(M,w,k)}); } }); }
  return out.sort((a,b)=>a.date-b.date);
}
function libFilter(q, pat, eq, lvl, eqSet){
  q = (q||'').trim().toLowerCase();
  return allEx().filter(e=>(!pat || e.pattern===pat) && (!eq || String(e.equip).split('+').includes(eq)) && (!lvl || e.level===lvl) && (!eqSet || equipOk(e,eqSet)) && (!q || (e.name+' '+e.muscles+' '+(SUBS[e.sub]||'')).toLowerCase().includes(q)));
}
function libFilters(prefix){
  return `<div class="row"><input type="search" id="${prefix}q" data-ui="${prefix==='lib'?'libQ':'pickQ'}" placeholder="Buscar por nombre o músculo" value="${esc(UI[prefix==='lib'?'libQ':'pickQ']||'')}" style="max-width:340px"></div>
  <div class="seg"><button data-act="${prefix}Pat" data-arg="" aria-pressed="${!UI[prefix+'Pat']}">Todos</button>${PATTERNS.map(p=>`<button data-act="${prefix}Pat" data-arg="${p}" aria-pressed="${UI[prefix+'Pat']===p}">${p}</button>`).join('')}</div>
  <div class="row"><select id="${prefix}eqsel" data-uisel="${prefix}Eq" style="max-width:240px"><option value="">Todo el equipamiento</option>${Object.entries(EQUIP).map(([k,l])=>`<option value="${k}" ${UI[prefix+'Eq']===k?'selected':''}>${l}</option>`).join('')}</select>
  <select id="${prefix}lvsel" data-uisel="${prefix}Lvl" style="max-width:160px"><option value="0">Todos los niveles</option>${[1,2,3,4,5].map(n=>`<option value="${n}" ${+UI[prefix+'Lvl']===n?'selected':''}>Nivel ${n}</option>`).join('')}</select></div>`;
}
function dots(l){ return `<span class="lvl" title="Nivel ${l}">${'●'.repeat(+l||0)}${'○'.repeat(Math.max(0,5-(+l||0)))}</span>`; }
function viewLibrary(){
  const list = libFilter(UI.libQ, UI.libPat, UI.libEq, +UI.libLvl);
  const cards = list.slice(0,150).map(e=>{
    const open = UI.libOpen===e.name, editing = UI.libEdit===e.name;
    let det = '';
    if (editing) det = exEditor(e);
    else if (open){
      const h = exHistory(e.name), u = unitLbl(e.unit);
      det = `<dl class="kv"><dt>Patrón</dt><dd>${esc(e.pattern)} · ${esc(SUBS[e.sub]||e.sub||'')}</dd><dt>Equipamiento</dt><dd>${esc(equipLbl(e))}</dd><dt>Músculos</dt><dd>${esc(e.muscles)}</dd><dt>Técnica</dt><dd>${esc(e.tech)}</dd><dt>Más fácil</dt><dd>${esc(e.reg)}</dd><dt>Siguiente</dt><dd>${esc(e.prog)}</dd><dt>Carga</dt><dd>${e.pct ? `Mueve ~${Math.round(e.pct*100)}% de tu peso corporal` : 'Solo cuenta el peso externo (kg)'}</dd></dl>
      <div><span class="eyebrow">Tu historial</span>${h.length?`<p class="small">Mejor marca: <b>${fmt(Math.max(...h.map(x=>x.best)),1)} ${u}</b>${Math.max(...h.map(x=>x.kg))?` · máx. lastre ${fmt(Math.max(...h.map(x=>x.kg)),1)} kg`:''}</p><div class="exlist small">${h.slice(-6).reverse().map(x=>`<div><span>${fd(x.date,{day:'numeric',month:'short'})} · ${esc(x.m)} · S${x.w}-${x.k}</span><span>${x.n} series · mejor ${fmt(x.best,1)} ${u}${x.rpe!=null?` · RPE ${x.rpe}`:''}</span></div>`).join('')}</div>`:'<p class="empty">Todavía no hay registros de este ejercicio.</p>'}</div>
      <div class="row"><button class="btn sm" data-act="libEdit" data-arg="${esc(e.name)}">${e.custom?'Editar':'Personalizar'}</button>${e.custom && !e.builtinBase && !exUsed(e.name) ? `<button class="btn sm danger" data-act="libDel" data-arg="${esc(e.name)}">Borrar</button>`:''}</div>`;
    }
    return `<article class="card"><div class="row between" data-act="libOpen" data-arg="${esc(e.name)}" style="cursor:pointer"><div style="min-width:0"><div class="ex-name">${esc(e.name)}</div><div class="small muted">${esc(e.pattern)} · ${esc(SUBS[e.sub]||'')} · ${esc(equipLbl(e))} · ${e.unit} ${dots(e.level)}${e.custom?' · <b>propio</b>':''}</div></div><span class="small muted">${open||editing?'Cerrar':'Ver'}</span></div>${det}</article>`;
  }).join('');
  return `<div class="row between"><div><span class="eyebrow">${allEx().length} ejercicios</span><h1>Biblioteca de ejercicios</h1></div><button class="btn primary" data-act="libNew">+ Nuevo ejercicio</button></div>
    ${libFilters('lib')}
    <p class="small muted">${list.length} resultados${list.length>150?' (se muestran 150; afina la búsqueda)':''}.</p>
    <div class="grid">${cards || '<p class="empty">Ningún ejercicio coincide con los filtros.</p>'}</div>`;
}
function exUsed(name){ return Object.values(S.macros).some(M=>Object.values(M.sessions).some(p=>p.items.some(it=>it.ex===name)) || (M.tests||[]).some(t=>t.name===name)); }
function exEditor(e){
  const i = (S.settings.custom||[]).findIndex(x=>x.name===e.name); if (i<0) return '';
  const b = 's.custom.'+i;
  return `<div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
    <label class="f">Nombre${txtIn(b+'.name',{lazy:1})}</label>
    <label class="f">Patrón${selIn(b+'.pattern',PATTERNS)}</label>
    <label class="f">Subpatrón${selIn(b+'.sub',Object.entries(SUBS))}</label>
    <label class="f">Equipamiento${selIn(b+'.equip',[...Object.entries(EQUIP), ['barra+banda','Barra + banda'],['mancuernas+banco','Mancuernas + banco'],['barraol+banco','Barra olímpica + banco']])}</label>
    <label class="f">Unidad${selIn(b+'.unit',[['reps','Repeticiones'],['seg','Segundos']])}</label>
    <label class="f">Nivel (1-5)${numIn(b+'.level',{min:1,max:5,step:1})}</label>
    <label class="f">% peso corporal (0-1)${numIn(b+'.pct',{min:0,max:1,step:0.05})}</label></div>
    <label class="f">Músculos${txtIn(b+'.muscles')}</label>
    <label class="f">Claves técnicas<textarea id="${fid(b+'.tech')}" data-k="${b}.tech">${esc(e.tech)}</textarea></label>
    <div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))"><label class="f">Regresión (más fácil)${txtIn(b+'.reg')}</label><label class="f">Progresión (más difícil)${txtIn(b+'.prog')}</label></div>
    <div class="row between"><button class="btn sm primary" data-act="libEdit" data-arg="">Listo</button>${e.builtinBase?`<button class="btn sm" data-act="libRestore" data-arg="${esc(e.name)}">Volver al original</button>`:(!exUsed(e.name)?`<button class="btn sm danger" data-act="libDel" data-arg="${esc(e.name)}">Borrar</button>`:'<span class="small muted">En uso en tus planes.</span>')}</div>`;
}

/* ----- Guía ----- */
function viewGuide(){
  const borg = V1 ? V1.borg : [];
  const guide = V1 ? V1.guide : [];
  return `<div><span class="eyebrow">Cómo usar la plataforma</span><h1>Guía</h1></div>
  <section class="card"><h3>Flujo de trabajo</h3><dl class="kv">
    <dt>1. Planifica</dt><dd>Crea un macrociclo con el asistente o desde la plantilla. Ajusta mesociclos, semanas y sesiones en Plan (botón Editar plan).</dd>
    <dt>2. Registra</dt><dd>En Hoy abre la sesión: anota cada serie (reps o segundos, lastre, RPE). El temporizador de descanso arranca al marcar una serie. Al terminar, marca la sesión como realizada con su duración, RPE de sesión y bienestar.</dd>
    <dt>3. Controla</dt><dd>Progreso muestra carga, ACWR, volumen e intensidad con alertas. Tests compara tus evaluaciones. Cuerpo registra peso y cintura cada semana.</dd>
    <dt>4. Ajusta</dt><dd>Si el RPE real supera al objetivo o aparece una alerta, repite la semana o baja la carga editando el plan.</dd></dl></section>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))">${guide.map(([t,items])=>`<section class="card"><h3>${esc(t.charAt(0)+t.slice(1).toLowerCase())}</h3><dl class="kv">${items.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></section>`).join('')}</div>
  <h2>Escala de Borg CR10 y RIR</h2>
  <div class="tbl-wrap"><table><thead><tr><th class="num">RPE</th><th>Descripción</th><th class="num">RIR</th><th>Cómo se siente</th><th>Uso</th></tr></thead><tbody>
  ${borg.map(b=>`<tr><td class="num"><b style="font-family:var(--f-display);font-size:18px">${b[0]}</b></td><td>${esc(b[1])}</td><td class="num">${esc(b[2]??'')}</td><td class="wrap-txt">${esc(b[3]??'')}</td><td>${esc(b[4]??'')}</td></tr>`).join('')}</tbody></table></div>
  <p class="small muted">Carga interna = RPE de sesión × minutos (Foster). Monotonía = media diaria / desviación estándar; strain = carga × monotonía. ACWR = carga de la semana / media de las últimas 4 (zona 0,8-1,3, Gabbett). Hooper = sueño + fatiga + dolor + estrés (1-7 cada uno). Borg (1982); RPE-RIR de Zourdos et al. (2016).</p>`;
}

/* ----- Perfil ----- */
function viewProfile(){
  const P = S.settings.profile;
  const acct = Sync.b===SupaB ? `<section class="card"><h3>Cuenta</h3><p>Entraste como <b>${esc(SupaB.user?.email||'')}</b>.</p>
      <details><summary>Cambiar contraseña</summary><div class="fields"><label class="f">Contraseña nueva<input type="password" id="p_pw" autocomplete="new-password"></label></div><div class="row" style="margin-top:8px"><button class="btn sm" data-act="changePw">Guardar contraseña</button></div></details>
      <div class="row"><button class="btn" data-act="signOut">Cerrar sesión</button></div></section>` : '';
  return `<div><span class="eyebrow">Tus datos</span><h1>Perfil</h1></div>
  <section class="card"><div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
    <label class="f">Nombre${txtIn('s.profile.name')}</label>
    <label class="f">Peso inicial (kg)${numIn('s.profile.weight0',{min:0,step:0.1})}</label>
    <label class="f">Estatura (cm)${numIn('s.profile.height',{min:0})}</label>
    <label class="f">Edad${numIn('s.profile.age',{min:0,step:1})}</label>
    <label class="f">Sexo${selIn('s.profile.sex',[['','—'],'Hombre','Mujer','Otro'])}</label>
    <label class="f">Kcal días de entreno${numIn('s.profile.kcalTrain',{min:0,step:10})}</label>
    <label class="f">Kcal días de descanso${numIn('s.profile.kcalRest',{min:0,step:10})}</label>
    <label class="f">Proteína (g por kg)${numIn('s.profile.protein',{min:0,step:0.1})}</label>
    <label class="f">Actividad diaria${selIn('s.profile.activity',[[1.2,'Sedentaria (oficina, poco movimiento)'],[1.375,'Ligera (entreno 1-3 días)'],[1.55,'Moderada (entreno 3-5 días)'],[1.725,'Alta (entreno 6-7 días o trabajo físico)']])}</label>
    <label class="f">Meta de agua (ml, opcional)${numIn('s.profile.waterGoal',{min:0,step:50,ph:'automática'})}</label></div>
    <p class="small muted">Si dejas las kcal vacías, el Diario calcula una meta con tu peso, estatura, edad, sexo, actividad y el objetivo de tu macrociclo. La meta de agua automática es 35 ml por kg de peso, más 500 ml los días de entreno.</p>
    <p class="small muted">El peso se usa para calcular la carga por repetición y el tonelaje mientras no registres tu peso semanal.</p></section>
  ${acct}
  <section class="card"><h3>Copias de seguridad</h3>
    <p class="small">${Sync.b===SupaB?'Todo se guarda solo en tu cuenta (y una copia en este dispositivo por si pierdes conexión).':Sync.b===ArtB?'Todo se guarda solo en tu cuenta de Claude.':'Los datos están solo en este navegador.'} Aun así puedes descargar una copia completa.</p>
    <div class="row"><button class="btn" data-act="exportAll">Exportar todo (JSON)</button><button class="btn" data-act="import">Importar copia</button></div>
    <details><summary>Importar pegando el texto</summary><textarea id="f_imp" data-ui="importText" placeholder="Pega el contenido de una copia exportada (también acepta la copia de la versión anterior)">${esc(UI.importText)}</textarea><div class="row" style="margin-top:8px"><button class="btn sm" data-act="importText">Importar texto</button></div></details>
  </section>`;
}

/* ================= Pantallas del macrociclo ================= */
function viewHoy(M){
  const rw = rawWeek(M), n = nWeeks(M), W = curWeek(M), wk = week(M,W), ms = meso(M,wk.meso), all = allWeeks(M), wc = all[W];
  const nx = nextSession(M); const [nw,nk] = nx, ns = sessCalc(M,nw,nk), np = M.sessions[nw+'-'+nk];
  const sm = macroSummary(M), lw = lastWeight(M);
  let hero;
  if (rw < 0){ const d = Math.round((parseD(M.start)-today())/864e5); hero = `<div class="hero"><span class="eyebrow">Antes de empezar</span><div class="big">Empiezas en <em>${d} ${d===1?'día':'días'}</em></div><p class="muted">Revisa el plan y ajusta lo que quieras en Plan › Editar plan.</p></div>`; }
  else if (rw >= n) hero = `<div class="hero"><span class="eyebrow">Macrociclo terminado</span><div class="big">${n} de ${n} <em>semanas</em></div><p class="muted">Revisa tus tests y el progreso, o duplica este macrociclo en Ajustes para empezar otro.</p></div>`;
  else hero = `<div class="hero"><span class="eyebrow">${fd(weekStart(M,W),{day:'numeric',month:'short'})} – ${fd(addD(weekStart(M,W),6),{day:'numeric',month:'short'})} · ${esc(wk.phase)}</span>
      <div class="big">Semana <em>${W}</em> <span class="pill ${typeCls(wk.type)}" style="vertical-align:middle">${esc(wk.type)}</span></div><p>${esc(wk.goal)}</p>
      ${ms ? `<p class="small muted"><b>${esc(ms.name)}</b> · rango ${esc(ms.range)} · descanso ${esc(ms.rest)} · RPE ${esc(ms.rpe)}. Para avanzar: ${esc(ms.criterion)}</p>` : ''}</div>`;
  const strip = M.days.map(d=>{ const s = sessCalc(M,W,d.k); if (!s) return ''; const isT = s.date.getTime()===today().getTime();
    return `<button class="slot ${isT?'today':''}" data-act="open" data-arg="${W}-${d.k}"><span class="eyebrow">${WDAYS[d.off%7]} ${fd(s.date,{day:'numeric'})}</span><b>${esc(d.name||'Día '+d.k)}</b><span class="small muted">${esc(s.type)} · ${s.n} ejercicios</span>${statusPill(s)}</button>`; }).join('');
  const needBody = rw>=0 && rw<n && !(E(M)['body:'+W] && num(E(M)['body:'+W].weight)!=null);
  const al = wc.alert;
  return `${hero}
  ${np ? `<section class="card"><div class="row between"><div><span class="eyebrow">${ns.date.getTime()===today().getTime()?'Sesión de hoy':'Próxima sesión'}</span><h2>Semana ${nw} · ${esc(dayOf(M,nk).name||'Día '+nk)} <span class="pill ${typeCls(np.t)}">${esc(np.t)}</span></h2><p class="small muted">${WDAYS_L[dayOf(M,nk).off%7]} ${fd(ns.date,{day:'numeric',month:'long'})}</p></div>
    <button class="btn primary" data-act="open" data-arg="${nw}-${nk}">${ns.done?'Ver registro':'Registrar sesión'}</button></div>
    <div class="exlist">${np.items.map(it=>`<div><span>${esc(it.ex)}</span><span>${planText(it,lib(it.ex))}${num(it.rpe)!=null?` · RPE ${it.rpe}`:''}</span></div>`).join('') || '<p class="empty">Sesión sin ejercicios. Agrégalos en Plan.</p>'}</div></section>` : ''}
  ${rw>=0 && rw<n ? `<section class="card flat"><div class="row between"><h3>Esta semana</h3>${!(al[0]==='info'&&al[1]==='Sin datos') ? `<span class="pill ${al[0]==='info'?'':al[0]}">${esc(al[1])}</span>`:''}</div><div class="strip">${strip}</div></section>` : ''}
  <section class="kpis">
    <div class="kpi"><span>Sesiones hechas</span><b>${sm.done}<small class="muted" style="font-size:16px"> / ${sm.total}</small></b></div>
    <div class="kpi"><span>Adherencia hasta hoy</span><b>${pct(sm.adh)}</b></div>
    <div class="kpi"><span>Carga de la semana (UA)</span><b>${fmt(wc.load)}</b></div>
    <div class="kpi"><span>ACWR semana</span><b>${wc.acwr==null?'—':fmt(wc.acwr,2)}</b></div>
    <div class="kpi"><span>Peso actual</span><b>${fmt(lw?lw.v:S.settings.profile.weight0,1)} <small style="font-size:16px">kg</small></b></div>
  </section>
  ${needBody ? `<section class="card"><div><h3>Control corporal de la semana ${W}</h3><p class="small muted">Una vez por semana, mismo día, en ayunas. Cintura a la altura del ombligo.</p></div>
    <div class="fields"><label class="f">Peso (kg)${numIn(`e.body:${W}.weight`,{ph:fmt(bw(M,W),1),step:0.1})}</label><label class="f">Cintura (cm)${numIn(`e.body:${W}.waist`,{step:0.5})}</label></div></section>` : ''}`;
}

/* ----- Sesión (registro por serie) ----- */
function viewSession(M){
  const [ws,k] = UI.sess.split('-'); const w = +ws, key = w+'-'+k, p = M.sessions[key];
  if (!p){ UI.sess = null; return viewHoy(M); }
  const wk = week(M,w), L = logOf(M,w,k), s = sessCalc(M,w,k), base = `e.log:${key}`;
  const list = sessKeys(M), idx = list.findIndex(([a,b])=>a===w&&b===k), prev = list[idx-1], next = list[idx+1];
  const tw = testWeeks(M).includes(w) && p.t==='Test';
  const items = p.items.map((it,i)=>{
    const e = lib(it.ex), c = itemCalc(M,w,k,i), u = e.unit==='seg' ? 'Seg' : 'Reps';
    const sets = ((L.ex||[])[i]?.sets) || [];
    const nRows = Math.max(sets.length, num(it.s)||1);
    let rows = `<div class="setrow head"><span>Serie</span><span>${u}</span><span>Lastre kg</span><span>RPE</span><span></span></div>`;
    for (let j=0;j<nRows;j++){
      const sp = `${base}.ex.${i}.sets.${j}`, st = sets[j] || {}, done = num(st.r)!=null;
      rows += `<div class="setrow ${done?'done':''}"><span class="n">${j+1}</span>${numIn(sp+'.r',{ph:it.r??'máx',min:0})}${numIn(sp+'.kg',{ph:it.kg??'0',min:0,step:0.5})}${numIn(sp+'.rpe',{ph:it.rpe??'',min:0,max:10,step:0.5})}
        <button class="tick" data-act="tick" data-arg="${key}|${i}|${j}" aria-pressed="${done}" title="${done?'Borrar serie':'Serie hecha como el plan'}">✓</button></div>`;
    }
    return `<article class="card ex ${c.logged?'done':''}">
      <div class="ex-head"><div><div class="ex-name">${i+1}. ${esc(it.ex)}</div><div class="small muted">${esc(e.pattern)} · ${esc(e.muscles)}</div></div>
        ${num(it.rest) ? `<button class="btn sm" data-act="rest" data-arg="${it.rest}">Descanso ${it.rest} s</button>`:''}</div>
      <div class="planline"><span>Plan <b>${planText(it,e)}</b></span>${it.tempo&&it.tempo!=='MÁX'?`<span>Tempo <b>${esc(it.tempo)}</b></span>`:''}${num(it.rpe)!=null?`<span>RPE obj. <b>${it.rpe}</b></span>`:''}</div>
      ${it.note ? `<p class="note">${esc(it.note)}</p>`:''}
      <details><summary>Técnica y variantes</summary><dl class="kv"><dt>Claves</dt><dd>${esc(e.tech)||'—'}</dd><dt>Más fácil</dt><dd>${esc(e.reg)||'—'}</dd><dt>Siguiente</dt><dd>${esc(e.prog)||'—'}</dd></dl></details>
      <div class="sets">${rows}</div>
      <div class="row"><button class="btn ghost sm" data-act="addSet" data-arg="${key}|${i}">+ Serie</button>${sets.length>(num(it.s)||1)?`<button class="btn ghost sm" data-act="rmSet" data-arg="${key}|${i}">− Serie</button>`:''}${it.r!=null && !tw ? `<button class="btn ghost sm" data-act="asPlan" data-arg="${key}|${i}">Todo como el plan</button>`:''}</div>
      <div class="calc"><span>Series <b>${c.n}</b>/${it.s??'—'}</span>${c.sec?`<span>TUT <b>${fmt(c.tutReal)} s</b> / ${fmt(c.tutPlan)}</span>`:`<span>Volumen <b>${fmt(c.volReal)}</b> / ${fmt(c.volPlan)} reps</span><span>Tonelaje <b>${fmt(c.ton)} kg</b></span>`}${c.rpe!=null?`<span>RPE máx <b>${c.rpe}</b> · RIR ≈ <b>${Math.max(0,10-c.rpe)}</b></span>`:''}${c.compl!=null?`<span>Cumplimiento <b>${pct(c.compl)}</b></span>`:''}</div>
    </article>`;
  }).join('');
  return `<div class="row between"><button class="btn ghost" data-act="closeSess">← Volver</button>
    <div class="row">${prev?`<button class="btn sm" data-act="open" data-arg="${prev[0]}-${prev[1]}">‹ S${prev[0]}-${prev[1]}</button>`:''}${next?`<button class="btn sm" data-act="open" data-arg="${next[0]}-${next[1]}">S${next[0]}-${next[1]} ›</button>`:''}</div></div>
  <div class="hero"><span class="eyebrow">${WDAYS_L[dayOf(M,k).off%7]} ${fd(s.date,{day:'numeric',month:'long',year:'numeric'})} · ${esc(meso(M,wk.meso)?.name||'')} · ${esc(wk.phase)}</span>
    <h1>Semana ${w} · ${esc(dayOf(M,k).name||'Día '+k)} <span class="pill ${typeCls(p.t)}">${esc(p.t)}</span></h1><p class="muted">${esc(wk.goal)}</p></div>
  ${tw ? `<p class="note">Día de test: calentamiento de 10 min, 3 min de descanso entre pruebas, siempre en el mismo orden. Anota el resultado en la serie 1; la pestaña Tests se llena sola.</p>`:''}
  ${items || '<p class="empty">Esta sesión no tiene ejercicios. Agrégalos en Plan › Editar plan.</p>'}
  <section class="card"><h2>Cierre de sesión</h2>
    <button class="btn ${L.done?'primary':''}" data-act="toggleDone" data-arg="${key}" aria-pressed="${!!L.done}">${L.done?'✓ Sesión realizada':'Marcar como realizada'}</button>
    <div class="fields"><label class="f">Duración (min)${numIn(base+'.dur',{min:0,step:1,ph:'60'})}</label></div>
    <label class="f">RPE de la sesión (Borg 0-10, 30 min después de terminar)${chips(base+'.rpe',0,10,'RPE sesión')}</label>
    <div><span class="eyebrow">Bienestar (Hooper) · 1 muy bien … 7 muy mal</span></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr))">
      <label class="f">Sueño${chips(base+'.sleep',1,7,'Sueño')}</label><label class="f">Fatiga${chips(base+'.fatigue',1,7,'Fatiga')}</label>
      <label class="f">Dolor muscular${chips(base+'.soreness',1,7,'Dolor muscular')}</label><label class="f">Estrés${chips(base+'.stress',1,7,'Estrés')}</label></div>
    <label class="f">Notas<textarea id="${fid(base+'.notes')}" data-k="${base}.notes" placeholder="Cómo te sentiste, molestias, cambios">${esc(L.notes||'')}</textarea></label>
    <div class="kpis">
      <div class="kpi"><span>Carga interna sRPE</span><b>${fmt(s.srpe)}</b><span>${s.done?`${fmt(s.dur)} min × RPE ${fmt(s.rpe)}`:'Marca la sesión como realizada'}</span></div>
      <div class="kpi"><span>Índice Hooper (4-28)</span><b>${s.hooper??'—'}</b><span>${s.hooper==null?'Completa los 4 valores':s.hooper>20?'Bajo: prioriza descanso':s.hooper>14?'Moderado':'Bueno'}</span></div>
      <div class="kpi"><span>Volumen / TUT</span><b>${fmt(s.vr)}</b><span>reps · ${fmt(s.tr)} s</span></div>
      <div class="kpi help"><span>Tonelaje${helpTip('k_ton')}</span><b>${fmt(s.ton)}</b><span>kg</span></div>
      <div class="kpi"><span>Cumplimiento</span><b>${pct(s.compl)}</b><span>real vs plan</span></div>
    </div></section>`;
}

/* ----- Plan ----- */
function periodSvg(M, sel){
  const all = allWeeks(M), W = 640, H = 170, pad = 22, n = all.length, bwid = (W-8)/n;
  const max = Math.max(...all.map(o=>o.vp+o.tp/3), 1), cw = rawWeek(M);
  let bars = '';
  all.forEach((o,i)=>{
    const v = o.vp + o.tp/3, h = Math.max(4, (v/max)*(H-pad-30)), x = 4+i*bwid, y = H-pad-h;
    bars += `<g data-act="week" data-arg="${o.w}" style="cursor:pointer"><rect x="${x}" y="0" width="${bwid}" height="${H}" fill="transparent"/>
      <rect x="${x+1.5}" y="${y}" width="${Math.max(1,bwid-3)}" height="${h}" rx="2" fill="var(--t-${typeCls(o.type)})" opacity="${o.w===sel?1:.55}"/>
      ${o.w===sel?`<rect x="${x+.5}" y="${y-4}" width="${Math.max(1,bwid-1)}" height="${h+4}" rx="3" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`:''}
      ${(n<=30 || i%2===0 || i===sel) ? `<text x="${x+bwid/2}" y="${H-7}" text-anchor="middle" style="font-size:10px;fill:${o.w===cw?'var(--accent)':'var(--muted)'};font-weight:${o.w===cw?700:400}">${o.w}</text>`:''}<title>Semana ${o.w} · ${o.type} · ${fmt(o.vp)} reps + ${fmt(o.tp)} s</title></g>`;
  });
  let mb = '', start = 0;
  for (let i=1;i<=n;i++){
    if (i===n || all[i].meso!==all[start].meso){
      const x1 = 4+start*bwid, x2 = 4+i*bwid, ms = meso(M, all[start].meso);
      const lab = ms ? (all[start].meso===0 ? 'Test' : /transi/i.test(ms.name) ? 'Trans.' : 'M'+all[start].meso) : '';
      mb += `<line x1="${x1+3}" x2="${x2-3}" y1="8" y2="8" stroke="var(--line)" stroke-width="3" stroke-linecap="round"/><text x="${(x1+x2)/2}" y="22" text-anchor="middle" style="font-size:10px">${lab}</text>`;
      start = i;
    }
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Volumen planificado por semana">${mb}${bars}</svg>`;
}
function viewPlan(M){
  const n = nWeeks(M), sel = Math.min(UI.week ?? curWeek(M), n-1), wk = week(M,sel), ms = meso(M,wk.meso), edit = UI.editPlan;
  const sessions = M.days.map(d=>{
    const key = sel+'-'+d.k, p = M.sessions[key];
    if (!p) return edit ? `<section class="card"><h3>${esc(d.name||'Día '+d.k)}</h3><p class="empty">Sin sesión esta semana.</p><button class="btn sm" data-act="addSess" data-arg="${key}">+ Crear sesión</button></section>` : '';
    const s = sessCalc(M,sel,d.k);
    let body;
    if (!edit) body = `<div class="exlist">${p.items.map(it=>`<div><span>${esc(it.ex)}</span><span>${planText(it,lib(it.ex))}${num(it.rpe)!=null?` · RPE ${it.rpe}`:''}</span></div>`).join('') || '<p class="empty">Sin ejercicios.</p>'}</div>`;
    else {
      body = p.items.map((it,i)=>{ const b = `m.sessions.${key}.items.${i}`, e = lib(it.ex); return `<div class="editrow">
        <label class="f exsel">Ejercicio<button class="expick" data-act="pickFor" data-arg="${key}|${i}" title="Cambiar ejercicio">${esc(it.ex)}</button></label>
        <label class="f">Series${numIn(b+'.s',{min:0,step:1})}</label>
        <label class="f">${e.unit==='seg'?'Seg':'Reps'}${numIn(b+'.r',{min:0,ph:'máx'})}</label>
        <label class="f">Lastre kg${numIn(b+'.kg',{min:0,step:0.5})}</label>
        <label class="f">Desc. s${numIn(b+'.rest',{min:0,step:5})}</label>
        <label class="f">RPE${numIn(b+'.rpe',{min:0,max:10,step:0.5})}</label>
        <label class="f">Tempo${txtIn(b+'.tempo')}</label>
        <div class="acts"><button class="icon-btn" title="Subir" data-act="mv" data-arg="${key}|${i}|-1">↑</button><button class="icon-btn" title="Bajar" data-act="mv" data-arg="${key}|${i}|1">↓</button><button class="icon-btn" title="Quitar" data-act="rm" data-arg="${key}|${i}">✕</button></div>
        <label class="f wide">Nota${txtIn(b+'.note',{ph:'Indicaciones para este ejercicio'})}</label></div>`; }).join('')
        + `<div class="row"><button class="btn sm" data-act="pickAdd" data-arg="${key}">+ Añadir ejercicio</button>
           <label class="f" style="flex-direction:row;align-items:center;gap:8px">Tipo${selIn(`m.sessions.${key}.t`,SESS_TYPES)}</label>
           <button class="btn sm" data-act="copySess" data-arg="${key}">Copiar a otras semanas…</button>
           <button class="btn sm danger" data-act="delSess" data-arg="${key}">Quitar sesión</button></div>`;
    }
    return `<section class="card"><div class="row between"><div><span class="eyebrow">${WDAYS_L[d.off%7]} ${fd(s.date,{day:'numeric',month:'short'})}</span><h3>${esc(d.name||'Día '+d.k)} <span class="pill ${typeCls(p.t)}">${esc(p.t)}</span></h3></div>
      <div class="row">${statusPill(s)}<button class="btn sm" data-act="open" data-arg="${key}">Registro</button></div></div>${body}</section>`;
  }).join('');
  const mesoRows = M.mesos.map((m,i)=>edit ? `<tr class="${m.n===wk.meso?'cur':''}"><td>${m.n}</td><td>${txtIn(`m.mesos.${i}.name`)}</td><td>${txtIn(`m.mesos.${i}.phase`)}</td><td>${txtIn(`m.mesos.${i}.range`)}</td><td>${txtIn(`m.mesos.${i}.rest`)}</td><td>${txtIn(`m.mesos.${i}.rpe`)}</td><td>${txtIn(`m.mesos.${i}.objective`)}</td><td>${txtIn(`m.mesos.${i}.criterion`)}</td></tr>`
    : `<tr class="${m.n===wk.meso?'cur':''}"><td>${m.n}</td><td>${esc(m.name)}</td><td>${esc(m.phase)}</td><td>${M.weeks.filter(x=>x.meso===m.n).map(x=>x.w).join(', ')}</td><td>${esc(m.range)}</td><td>${esc(m.rest)}</td><td>${esc(m.rpe)}</td><td class="wrap-txt">${esc(m.criterion)}</td></tr>`).join('');
  return `<div class="row between"><div><span class="eyebrow">Planificación · ${esc(M.split||'')}</span><h1>${esc(M.name)}</h1></div><button class="btn ${edit?'primary':''}" data-act="editPlan">${edit?'Listo':'Editar plan'}</button></div>
  <section class="card periodo"><div class="row between"><span class="small muted">Volumen planificado por semana (toca una barra)</span>${typeLegend()}</div>${periodSvg(M, sel)}</section>
  <section class="row between">
    <div class="row"><button class="btn sm" data-act="week" data-arg="${sel-1}" ${sel<=0?'disabled':''}>‹</button>
      <div><span class="eyebrow">${fd(weekStart(M,sel),{day:'numeric',month:'short'})} – ${fd(addD(weekStart(M,sel),6),{day:'numeric',month:'short'})}</span><h2>Semana ${sel} · ${esc(ms?.name||'Mesociclo '+wk.meso)} <span class="pill ${typeCls(wk.type)}">${esc(wk.type)}</span></h2></div>
      <button class="btn sm" data-act="week" data-arg="${sel+1}" ${sel>=n-1?'disabled':''}>›</button></div>
  </section>
  ${edit ? `<section class="card"><div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">
     <label class="f">Tipo de semana${selIn(`m.weeks.${sel}.type`,WEEK_TYPES)}</label>
     <label class="f">Mesociclo${selIn(`m.weeks.${sel}.meso`,M.mesos.map(m=>[m.n, m.n+' · '+m.name]))}</label>
     <label class="f">Fase${txtIn(`m.weeks.${sel}.phase`)}</label></div>
     <label class="f">Objetivo de la semana${txtIn(`m.weeks.${sel}.goal`)}</label>
     <p class="small muted">Los cambios se guardan solos. Para cambiar un ejercicio en varias semanas a la vez, tócalo y elige el alcance.</p></section>`
   : `<p>${esc(wk.goal)}</p>${ms?`<p class="small muted"><b>${esc(ms.name)}</b> · ${esc(wk.phase)} · rango ${esc(ms.range)} · descanso ${esc(ms.rest)} · RPE ${esc(ms.rpe)} · ${esc(ms.methods||'')} Para avanzar: ${esc(ms.criterion||'')}</p>`:''}`}
  <div class="grid" ${edit?'style="grid-template-columns:1fr"':''}>${sessions}</div>
  <details class="card" ${edit?'open':''}><summary>Mesociclos y sus parámetros${edit?' (editables)':''}</summary><div class="tbl-wrap"><table><thead><tr><th>#</th><th>Mesociclo</th><th>Fase</th><th>${edit?'Reps / seg':'Semanas'}</th><th>${edit?'Descanso':'Reps / seg'}</th><th>${edit?'RPE':'Descanso'}</th><th>${edit?'Objetivo':'RPE'}</th><th>Criterio para avanzar</th></tr></thead><tbody>${mesoRows}</tbody></table></div>
  ${edit?'<div class="row" style="margin-top:8px"><button class="btn sm" data-act="addMeso">+ Añadir mesociclo</button></div>':''}</details>`;
}

/* ----- Gráficos ----- */
const CHARTS = [];
function chartBox(spec){ CHARTS.push(spec); return `<div class="chart" data-chart="${CHARTS.length-1}"></div>`; }
function niceMax(v){ if (!v||v<=0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); for (const m of [1,1.2,1.5,2,2.5,3,4,5,6,8,10]) if (m*p >= v) return m*p; return 10*p; }
function drawCharts(){
  document.querySelectorAll('[data-chart]').forEach(el=>{
    const sp = CHARTS[+el.dataset.chart]; if (!sp) return;
    const W = Math.max(280, el.clientWidth || 600), H = sp.h || 200, L = 40, R = 10, T = 10, B = 24;
    const n = sp.x.length, cw = (W-L-R)/n;
    const ymax = sp.ymax ?? niceMax(Math.max(...sp.series.flatMap(s=>s.v.filter(x=>x!=null)), 0));
    const ymin = sp.ymin ?? 0;
    const Y = v => T + (H-T-B) * (1 - (v-ymin)/((ymax-ymin)||1));
    const X = i => L + cw*i + cw/2;
    let g = '';
    for (let t=0;t<=4;t++){ const v = ymin + (ymax-ymin)*t/4, y = Y(v); g += `<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/><text x="${L-6}" y="${y+4}" text-anchor="end">${fmt(v, ymax-ymin<5?1:0)}</text>`; }
    if (sp.band){ const [a,b] = sp.band; g += `<rect x="${L}" width="${W-L-R}" y="${Y(Math.min(b,ymax))}" height="${Y(a)-Y(Math.min(b,ymax))}" fill="var(--ok)" opacity=".12"/>`; }
    const step = Math.max(1, Math.ceil(n / Math.max(4, Math.floor((W-L-R)/28))));
    sp.x.forEach((lab,i)=>{ if (i%step===0) g += `<text x="${X(i)}" y="${H-6}" text-anchor="middle">${lab}</text>`; });
    if (sp.mark!=null && sp.mark>=0 && sp.mark<n) g += `<line x1="${X(sp.mark)}" x2="${X(sp.mark)}" y1="${T}" y2="${H-B}" stroke="var(--accent)" stroke-dasharray="3 3"/>`;
    const bars = sp.series.filter(s=>s.type==='bar'), nb = bars.length;
    bars.forEach((s,bi)=>{ const bw_ = Math.max(2,(cw-4)/nb); s.v.forEach((v,i)=>{ if (v==null) return; const x = L + cw*i + 2 + bi*bw_, y = Y(Math.max(v,ymin)); g += `<rect x="${x}" y="${y}" width="${Math.max(1,bw_-1)}" height="${Math.max(0,Y(ymin)-y)}" rx="1.5" fill="${s.color}" ${s.op?`opacity="${s.op}"`:''}><title>${esc(s.name)} · ${sp.xname||'semana'} ${sp.x[i]}: ${fmt(v,1)}</title></rect>`; }); });
    sp.series.filter(s=>s.type!=='bar').forEach(s=>{
      let d = '', pen = false; const pts = [];
      s.v.forEach((v,i)=>{ if (v==null){ pen=false; return; } d += (pen?'L':'M') + X(i) + ' ' + Y(v) + ' '; pen = true; pts.push([i,v]); });
      g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" ${s.dash?'stroke-dasharray="5 4"':''}/>`;
      pts.forEach(([i,v],j)=>{ const last = j===pts.length-1; g += `<circle cx="${X(i)}" cy="${Y(v)}" r="${last?4.5:2.8}" fill="${last?s.color:'var(--surface)'}" stroke="${s.color}" stroke-width="2"><title>${esc(s.name)} · semana ${sp.x[i]}: ${fmt(v,2)}</title></circle>`; });
    });
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(sp.label||'')}">${g}</svg>`;
  });
}
/* ================= Diario: notas, agua y alimentación ================= */
function latestMacro(){ return curM() || Object.values(S.macros).filter(m=>!m.archived).sort((a,b)=>String(b.updated||'').localeCompare(String(a.updated||'')))[0] || null; }
function curWeight(){ const M = latestMacro(), lw = M ? lastWeight(M) : null; return lw ? lw.v : num(S.settings.profile.weight0); }
function trainingOn(ds){
  for (const M of Object.values(S.macros)){ if (M.archived) continue;
    for (const [w,k] of sessKeys(M)) if (isoD(sessDate(M,w,k))===ds) return {M, w, k, p:M.sessions[w+'-'+k], L:logOf(M,w,k)}; }
  return null;
}
function dayTargets(ds){
  const P = S.settings.profile, w = curWeight(), tr = trainingOn(ds), M = latestMacro();
  const water = num(P.waterGoal) ?? (w ? Math.round((w*35 + (tr?500:0))/50)*50 : null);
  let kcal = tr ? num(P.kcalTrain) : num(P.kcalRest), kcalSrc = 'tu perfil';
  if (kcal==null) kcal = num(tr ? P.kcalRest : P.kcalTrain);
  if (kcal==null && w && num(P.height) && num(P.age)){
    const bmr = 10*w + 6.25*P.height - 5*P.age + (P.sex==='Mujer' ? -161 : 5);
    const adj = M && M.goal==='recomposicion' ? 0.8 : M && M.goal==='hipertrofia' ? 1.1 : 1;
    kcal = Math.round(bmr * (num(P.activity)||1.55) * adj / 10) * 10; kcalSrc = 'estimación';
  }
  const prot = w && num(P.protein) ? Math.round(w * P.protein) : null;
  return {water, kcal, kcalSrc, prot, w, tr};
}
function meter(val, goal, unit, opts={}){
  const v = num(val), r = goal && v!=null ? v/goal : 0, w = Math.min(100, Math.round(r*100));
  const st = !goal ? '' : v==null ? 'Sin registro' : opts.range ? (r<0.9 ? `Faltan ${fmt(goal-v)} ${unit}` : r>1.1 ? `${fmt(v-goal)} ${unit} sobre la meta` : 'Dentro de la meta ✓') : (r>=1 ? 'Meta cumplida ✓' : `Faltan ${fmt(goal-v)} ${unit}`);
  const cls = !goal || v==null ? '' : opts.range ? (r<0.9||r>1.1 ? 'warn' : 'ok') : (r>=1 ? 'ok' : r>=0.6 ? 'warn' : 'crit');
  return `<div class="meter ${cls}"><div class="meter-top"><b>${v==null?'—':fmt(v)}</b><span>/ ${goal?fmt(goal)+' '+unit:'sin meta'}</span></div><div class="bar"><i style="width:${w}%"></i></div><span class="small ${cls?'st-'+cls:'muted'}">${st}</span></div>`;
}
function viewDiario(M){
  const ds = UI.dDate || isoD(today()), key = 'dia:'+ds, rec = (S.entries[DIARIO]||{})[key] || {}, t = dayTargets(ds), b = `d.${key}`;
  const D = parseD(ds), isToday = ds===isoD(today());
  const tr = t.tr;
  const train = tr ? `<p><span class="pill">${esc(tr.p.t||'Sesión')}</span> <b>${esc(dayOf(tr.M,tr.k).name||'Día '+tr.k)}</b> · ${esc(tr.M.name)}, semana ${tr.w} ${tr.L.done?'<span class="pill ok">Registrada</span>':''}</p>
      <div class="row"><button class="btn sm" data-act="diarioSess" data-arg="${tr.M.id}|${tr.w}-${tr.k}">${tr.L.done?'Ver registro de la sesión':'Registrar la sesión'}</button></div>`
    : `<p class="muted">No hay sesión planificada este día: es día de descanso o entrenamiento libre.</p>`;
  const missing = (!t.w ? ['peso'] : []).concat(t.kcalSrc==='estimación'||num(S.settings.profile.kcalTrain)!=null ? [] : [!num(S.settings.profile.height)?'estatura':null, !num(S.settings.profile.age)?'edad':null].filter(Boolean));
  // historial
  const all = Object.entries(S.entries[DIARIO]||{}).filter(([k])=>k.startsWith('dia:')).map(([k,v])=>[k.slice(4),v]).sort((a,b)=>b[0].localeCompare(a[0]));
  const q = (UI.dQ||'').toLowerCase().trim();
  const rows = all.filter(([d,v])=>!q || JSON.stringify(v).toLowerCase().includes(q)).slice(0,120).map(([d,v])=>{ const tg = dayTargets(d), wr = tg.water&&num(v.water)!=null ? v.water/tg.water : null, kr = tg.kcal&&num(v.kcal)!=null ? v.kcal/tg.kcal : null;
    const note = [v.notes, v.food].filter(Boolean).join(' · ');
    return `<tr class="${d===ds?'cur':''}" data-act="diarioDay" data-arg="${d}" style="cursor:pointer"><td>${fd(parseD(d),{weekday:'short',day:'numeric',month:'short'})}</td>
      <td class="num ${wr==null?'':wr>=1?'st-ok':wr>=0.6?'st-warn':'st-crit'}">${fmt(v.water)}</td><td class="num ${kr==null?'':kr<0.9||kr>1.1?'st-warn':'st-ok'}">${fmt(v.kcal)}</td><td class="num">${fmt(v.prot)}</td>
      <td class="num">${v.perf??'—'}</td><td class="num">${v.energy??'—'}</td><td class="num">${fmt(v.sleepH,1)}</td><td class="clip">${esc(note.slice(0,90))}</td></tr>`; }).join('');
  // últimos 14 días
  const days = Array.from({length:14},(_,i)=>isoD(addD(D, i-13))), recs = days.map(d=>(S.entries[DIARIO]||{})['dia:'+d]||{}), tgs = days.map(d=>dayTargets(d));
  const xl = days.map(d=>+d.slice(8));
  const back = M ? '' : `<button class="btn ghost sm" data-act="go" data-arg="home">‹ Mis macrociclos</button>`;
  return `${back}<div><span class="eyebrow">Registro diario</span><h1>Diario</h1><p class="muted">Anota cómo te fue, cuánta agua tomaste y qué comiste. Todo queda guardado y puedes buscarlo después.</p></div>
  <section class="card row between" style="flex-direction:row;align-items:center;flex-wrap:wrap">
    <div class="row"><button class="icon-btn" data-act="diarioMove" data-arg="-1" aria-label="Día anterior">‹</button>
      <input type="date" data-k="ui.dDate" id="f_dDate" value="${ds}" max="${isoD(addD(today(),1))}" style="width:auto">
      <button class="icon-btn" data-act="diarioMove" data-arg="1" aria-label="Día siguiente">›</button></div>
    <div class="row"><b>${(t=>t.charAt(0).toUpperCase()+t.slice(1))(fd(D,{weekday:'long',day:'numeric',month:'long'}))}</b>${isToday?'':'<button class="btn sm" data-act="diarioDay" data-arg="'+isoD(today())+'">Ir a hoy</button>'}</div>
  </section>
  ${missing.length ? `<p class="alert info">Para calcular tus metas falta tu ${missing.join(' y ')}. Complétalo en <a href="#" data-act="go" data-arg="profile">Perfil y datos</a>.</p>` : ''}
  <section class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))">
    <div class="card help-host"><h3><span class="help">Agua${helpTip('agua')}</span></h3>
      ${meter(rec.water, t.water, 'ml')}
      <div class="row"><button class="btn sm" data-act="water" data-arg="-250">− 250</button><button class="btn sm" data-act="water" data-arg="250">+ Vaso 250 ml</button><button class="btn sm" data-act="water" data-arg="500">+ Botella 500 ml</button></div>
      <label class="f">Total del día (ml)${numIn(b+'.water',{min:0,step:50})}</label></div>
    <div class="card"><h3><span class="help">Calorías${helpTip('kcal')}</span></h3>
      ${meter(rec.kcal, t.kcal, 'kcal', {range:1})}
      <span class="small muted">Meta ${tr?'de día de entreno':'de día de descanso'} según ${t.kcalSrc}.</span>
      <label class="f">Kcal consumidas${numIn(b+'.kcal',{min:0,step:10})}</label></div>
    <div class="card"><h3><span class="help">Proteína${helpTip('prot')}</span></h3>
      ${meter(rec.prot, t.prot, 'g')}
      <label class="f">Proteína consumida (g)${numIn(b+'.prot',{min:0,step:1})}</label></div>
  </section>
  <section class="card"><h3>Entrenamiento del día</h3>${train}
    <div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))">
      <label class="f"><span class="help">Rendimiento (1 muy mal · 5 excelente)${helpTip('perf')}</span>${chips(b+'.perf',1,5,'Rendimiento')}</label>
      <label class="f">Energía general (1 muy baja · 5 muy alta)${chips(b+'.energy',1,5,'Energía')}</label>
      <label class="f">Horas de sueño${numIn(b+'.sleepH',{min:0,max:16,step:0.5})}</label></div>
    <label class="f">Observaciones del entrenamiento<textarea id="${fid(b+'.notes')}" data-k="${b}.notes" placeholder="Cómo te sentiste, qué ejercicio costó más, molestias, récords, cambios para la próxima vez">${esc(rec.notes||'')}</textarea></label>
  </section>
  <section class="card"><h3>Alimentación</h3>
    <div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))">
      <label class="f">Desayuno${txtIn(b+'.meal1',{ph:'Ej: avena con plátano y 2 huevos'})}</label>
      <label class="f">Almuerzo${txtIn(b+'.meal2',{ph:'Ej: pollo, arroz y ensalada'})}</label>
      <label class="f">Once / cena${txtIn(b+'.meal3',{ph:'Ej: pan integral con palta y atún'})}</label>
      <label class="f">Colaciones${txtIn(b+'.meal4',{ph:'Ej: yogur, fruta, frutos secos'})}</label></div>
    <label class="f">Notas de alimentación<textarea id="${fid(b+'.food')}" data-k="${b}.food" placeholder="Hambre, antojos, suplementos, cómo te cayó la comida antes de entrenar">${esc(rec.food||'')}</textarea></label>
  </section>
  <section class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))">
    <div class="card"><h3>Agua: últimos 14 días</h3>${legend([['var(--t-deload)','Tomado (ml)'],['var(--ink)','Meta',1]])}
      ${chartBox({x:xl, xname:'día', mark:13, h:170, label:'Agua', series:[{type:'bar',name:'Agua',v:recs.map(r=>num(r.water)),color:'var(--t-deload)'},{type:'line',name:'Meta',v:tgs.map(g=>g.water),color:'var(--ink)',dash:1}]})}</div>
    <div class="card"><h3>Calorías: últimos 14 días</h3>${legend([['var(--accent)','Consumidas'],['var(--ink)','Meta',1]])}
      ${chartBox({x:xl, xname:'día', mark:13, h:170, label:'Calorías', series:[{type:'bar',name:'Kcal',v:recs.map(r=>num(r.kcal)),color:'var(--accent)'},{type:'line',name:'Meta',v:tgs.map(g=>g.kcal),color:'var(--ink)',dash:1}]})}</div>
  </section>
  <section class="card flat"><div class="row between"><h3>Historial (${all.length} ${all.length===1?'día':'días'})</h3><div class="row"><input type="search" data-ui="dQ" id="f_dQ" value="${esc(UI.dQ||'')}" placeholder="Buscar en notas y comidas" style="width:220px"><button class="btn sm" data-act="diarioCsv">Exportar CSV</button></div></div>
    ${all.length ? `<div class="tbl-wrap"><table><thead><tr><th>Fecha</th><th class="num">Agua ml</th><th class="num">Kcal</th><th class="num">Prot. g</th><th class="num">Rend.</th><th class="num">Energía</th><th class="num">Sueño h</th><th>Notas</th></tr></thead><tbody>${rows||'<tr><td colspan="8" class="muted">Sin resultados.</td></tr>'}</tbody></table></div>` : '<p class="empty">Aún no hay días anotados. Lo que escribas arriba se guarda solo.</p>'}
  </section>`;
}
function diarioCsv(){
  const all = Object.entries(S.entries[DIARIO]||{}).filter(([k])=>k.startsWith('dia:')).sort();
  const q = v => '"' + String(v??'').replace(/"/g,'""') + '"';
  const head = ['fecha','agua_ml','meta_agua_ml','kcal','meta_kcal','proteina_g','meta_proteina_g','rendimiento','energia','sueno_h','desayuno','almuerzo','once_cena','colaciones','notas_entreno','notas_alimentacion'];
  const lines = all.map(([k,v])=>{ const d = k.slice(4), t = dayTargets(d); return [d,v.water,t.water,v.kcal,t.kcal,v.prot,t.prot,v.perf,v.energy,v.sleepH,v.meal1,v.meal2,v.meal3,v.meal4,v.notes,v.food].map(q).join(';'); });
  return '﻿' + head.join(';') + '\n' + lines.join('\n');
}
function navyBF(sex, h, waist, neck, hip){
  if (!h || !waist || !neck) return null;
  const r = sex==='Mujer' ? (hip ? 495/(1.29579 - 0.35004*Math.log10(waist+hip-neck) + 0.22100*Math.log10(h)) - 450 : null)
                          : (waist>neck ? 495/(1.0324 - 0.19077*Math.log10(waist-neck) + 0.15456*Math.log10(h)) - 450 : null);
  return r==null || !isFinite(r) || r<2 || r>70 ? null : Math.round(r*10)/10;
}
function bodyFatCard(M){
  const P = S.settings.profile, cw = Math.max(0, Math.min(nWeeks(M)-1, rawWeek(M))), e = E(M);
  const lastWaist = (()=>{ for (let i=cw;i>=0;i--){ const v = num((e['body:'+i]||{}).waist); if (v!=null) return v; } return null; })();
  if (UI.bfWaist==null && lastWaist!=null) UI.bfWaist = lastWaist;
  const woman = P.sex==='Mujer', res = navyBF(P.sex, num(P.height), num(UI.bfWaist), num(UI.bfNeck), num(UI.bfHip));
  const need = [!num(P.height)?'estatura':null, !P.sex?'sexo':null].filter(Boolean);
  return `<section class="card"><h3><span class="help">Calcular mi % de grasa con una cinta métrica${helpTip('grasa')}</span></h3>
    <p class="small muted">Mide con la cinta ajustada pero sin apretar, de pie y relajado. <b>Cintura:</b> a la altura del ombligo. <b>Cuello:</b> justo bajo la nuez.${woman?' <b>Cadera:</b> en la parte más ancha de los glúteos.':''}</p>
    ${need.length ? `<p class="alert info">Para calcularlo falta tu ${need.join(' y ')} en <a href="#" data-act="go" data-arg="profile">Perfil y datos</a>.</p>` : ''}
    <div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">
      <label class="f">Cintura (cm)${numIn('ui.bfWaist',{min:0,step:0.5})}</label>
      <label class="f">Cuello (cm)${numIn('ui.bfNeck',{min:0,step:0.5})}</label>
      ${woman?`<label class="f">Cadera (cm)${numIn('ui.bfHip',{min:0,step:0.5})}</label>`:''}
      <div class="kpi"><span>Tu % de grasa estimado</span><b>${res==null?'—':fmt(res,1)+'%'}</b><span>${res==null?'completa las medidas':'método Marina EE.UU. · ±3-4%'}</span></div></div>
    ${res!=null ? `<div class="row"><button class="btn primary sm" data-act="saveBF" data-arg="${cw}|${res}">Guardar en la semana ${cw}</button></div>` : ''}
  </section>`;
}
function placeTip(h){
  const tip = h.querySelector(':scope > .help-tip, :scope .help-tip'); if (!tip) return;
  const a = h.querySelector('.info') || h, r = a.getBoundingClientRect(), vw = window.innerWidth, bottomBar = vw<=760 ? 72 : 0, vh = window.innerHeight - bottomBar;
  const w = Math.min(380, vw - 24); tip.style.width = w + 'px'; tip.style.maxHeight = ''; tip.style.overflowY = '';
  const th = tip.offsetHeight;
  let top = r.bottom + 8;
  if (top + th > vh - 8){ const above = r.top - th - 8; if (above >= 8) top = above; else { top = Math.max(8, Math.min(top, vh - 8 - th)); if (th > vh - 16){ top = 8; tip.style.maxHeight = (vh - 16) + 'px'; tip.style.overflowY = 'auto'; } } }
  tip.style.top = top + 'px'; tip.style.left = Math.max(12, Math.min(r.left - 24, vw - w - 12)) + 'px';
}
document.addEventListener('mouseover', e=>{ const h = e.target.closest && e.target.closest('.help'); if (h && !h.contains(e.relatedTarget)) placeTip(h); });
let tipOpenedAt = 0;
window.addEventListener('scroll', ()=>{ if (Date.now() - tipOpenedAt > 400) document.querySelectorAll('.help.open').forEach(h=>h.classList.remove('open')); else document.querySelectorAll('.help.open').forEach(placeTip); document.querySelectorAll('.help:hover').forEach(placeTip); }, {passive:true});

/* ================= Ayudas al pasar el mouse ================= */
const HELP = {
  srpe:['Carga interna semanal (sRPE)',
    'Cuánto te costó entrenar cada semana. Cada sesión vale lo duro que la sentiste (RPE de 0 a 10) multiplicado por los minutos que duró, y se suman las de la semana. La línea es tu promedio de las últimas 4 semanas.',
    'Ver si el entrenamiento sube de forma gradual, que es como el cuerpo se adapta sin lesionarse.',
    'Barras que suben poco a poco son buena señal. Una barra que salta muy por encima de la línea es una semana mucho más dura de lo habitual: más riesgo de fatiga o lesión. Para que aparezca, al cerrar cada sesión anota la duración y el RPE.'],
  acwr:['ACWR (relación carga aguda : crónica)',
    'Compara lo que entrenaste esta semana (carga aguda) con tu promedio de las últimas 4 semanas (carga crónica, lo que tu cuerpo ya está acostumbrado a hacer).',
    'Detectar si de golpe estás haciendo mucho más, o mucho menos, de lo que tu cuerpo tolera. Es uno de los indicadores más usados para prevenir lesiones.',
    'La franja verde (0,8 a 1,3) es la zona segura. Sobre 1,5 estás subiendo demasiado rápido: conviene aflojar. Bajo 0,8 entrenas menos que de costumbre, lo que es normal en semanas de descarga. Aparece desde la semana 3.'],
  vol:['Volumen: plan vs real',
    'El total de repeticiones de cada semana: en gris lo que decía el plan y en color lo que realmente hiciste.',
    'Saber si estás cumpliendo el plan y si este es realista para ti.',
    'Si las barras de color quedan cerca de las grises, cumpliste. Si quedan muy por debajo varias semanas seguidas, el plan quizá es demasiado exigente y conviene ajustarlo.'],
  rpe:['Intensidad: RPE objetivo vs real',
    'Qué tan duro se sintió el entrenamiento, en la escala de esfuerzo de 0 a 10 (escala de Borg). La línea punteada es lo que pedía el plan y la roja lo que anotaste.',
    'Ajustar la exigencia: el plan debe costarte lo que dice, ni más ni menos.',
    'Si tu línea va siempre por encima, te está costando más de lo previsto: baja peso o repeticiones. Si va muy por debajo, puedes exigirte un poco más.'],
  hooper:['Bienestar (índice de Hooper)',
    'Suma cuatro cosas que anotas al cerrar cada sesión: calidad del sueño, fatiga, dolor muscular y estrés, cada una de 1 (muy bien) a 7 (muy mal). El total va de 4 a 28.',
    'Detectar cansancio acumulado antes de que se note en tu rendimiento.',
    'Menor es mejor. Si sube varias semanas seguidas, conviene dormir más, comer mejor o adelantar una semana de descarga.'],
  peso:['Peso corporal',
    'Tu peso de cada semana, anotado en la pestaña Cuerpo.',
    'Ver la tendencia de tu peso a lo largo del macrociclo, no el número de un día.',
    'Fíjate en la dirección general. Diferencias de 0,5 a 1 kg entre semanas son normales por agua y comida. Pésate siempre el mismo día, en ayunas.'],
  grasa:['¿Cómo saber mi % de grasa?',
    'Es la parte de tu peso que es grasa; el resto es músculo, huesos, órganos y agua. Hay cuatro formas de medirlo, de la más práctica a la más precisa: 1) Con la calculadora de esta página, usando una cinta métrica (método de la Marina de EE.UU., error de ±3-4%). 2) Con una balanza de bioimpedancia, las que muestran "% grasa": es cómoda pero varía según cuánta agua tengas. 3) Con un nutricionista que mida tus pliegues con un plicómetro (buena precisión). 4) Con un examen DEXA en una clínica, que es el más exacto.',
    'Ver si bajas grasa sin perder músculo. El peso solo no te lo dice: puedes pesar lo mismo y tener menos grasa.',
    'Usa siempre el mismo método, a la misma hora y en ayunas, una vez cada 2 a 4 semanas. Lo importante es la tendencia, no el número exacto. Como referencia, en hombres 10-20% es un rango saludable y en mujeres 18-28%.'],
  agua:['Hidratación',
    'El agua que tomas en el día, contando agua, té, café y jugos (no bebidas alcohólicas). La meta se calcula con 35 ml por cada kg de tu peso, más 500 ml los días que entrenas. Puedes cambiarla en Perfil.',
    'Con una pérdida de solo el 2% de tu peso en agua ya rindes menos en fuerza y resistencia, y te recuperas peor.',
    'Usa los botones para sumar cada vaso (250 ml) o botella (500 ml). Una orina de color amarillo claro es buena señal de que estás bien hidratado.'],
  kcal:['Calorías del día',
    'La energía que comes en el día. Si llenaste las kcal en Perfil se usan esas; si no, se estiman con la fórmula de Mifflin-St Jeor (tu gasto en reposo según peso, estatura, edad y sexo) multiplicada por tu nivel de actividad, y ajustada al objetivo de tu macrociclo: -20% para perder grasa, +10% para ganar músculo.',
    'Comer acorde a tu objetivo: para bajar grasa necesitas comer algo menos de lo que gastas, y para ganar músculo, algo más.',
    'Quedar dentro de ±10% de la meta es un buen día. Una app como FatSecret o MyFitnessPal te ayuda a contar las calorías de lo que comes; aquí anotas el total.'],
  prot:['Proteína del día',
    'Gramos de proteína que comiste: carnes, pescado, huevos, lácteos, legumbres. La meta es tu peso × los g/kg de tu Perfil (1,6 a 2,2 g/kg es lo recomendado si entrenas fuerza).',
    'La proteína es lo que tu cuerpo usa para reparar y construir músculo después de entrenar. Es aún más importante si estás en déficit de calorías.',
    'Repártela en 3 a 5 comidas de 25 a 40 g cada una. Como referencia: 100 g de pollo tienen unos 30 g, y un huevo unos 6 g.'],
  perf:['Rendimiento y energía',
    'Tu propia nota del día: rendimiento es cómo te fue entrenando (1 muy mal, 5 excelente) y energía es cómo te sentiste en general.',
    'Cruzar estas notas con lo que comiste, dormiste y tomaste te muestra qué hábitos te hacen rendir mejor.',
    'Revisa el historial: si los días de bajo rendimiento coinciden con poca agua, pocas calorías o mal sueño, ya sabes qué ajustar.'],
  k_ses:['Sesiones','Sesiones que registraste sobre el total que tiene el plan.'],
  k_load:['Carga total sRPE','Suma de la carga de todas tus sesiones (duración × esfuerzo). Se mide en UA, unidades arbitrarias: sirve para comparar semanas entre sí, no tiene un valor "correcto".'],
  k_vol:['Volumen real','Total de repeticiones que has hecho en todo el macrociclo.'],
  k_ton:['Tonelaje','Kilos totales que has movido: repeticiones × (la parte de tu peso corporal que levanta cada ejercicio + el lastre). Sube cuando haces más repeticiones o con más peso.'],
  k_acwr:['ACWR actual','Relación entre lo que entrenaste esta semana y tu promedio de las últimas 4. Entre 0,8 y 1,3 estás en zona segura; sobre 1,5, estás subiendo demasiado rápido.'],
};
function helpTip(key){
  const h = HELP[key]; if (!h) return '';
  const body = h.length>2 ? `<p>${esc(h[1])}</p><p><b>Para qué te sirve:</b> ${esc(h[2])}</p><p><b>Cómo leerlo:</b> ${esc(h[3])}</p>` : `<p>${esc(h[1])}</p>`;
  return `<button class="info" data-act="help" aria-label="Qué significa ${esc(h[0])}">i</button><div class="help-tip" role="tooltip"><strong>${esc(h[0])}</strong>${body}</div>`;
}
function legend(items){ return `<div class="legend">${items.map(([c,l,dash])=>`<span><i style="background:${c};${dash?'height:3px;vertical-align:3px':''}"></i>${esc(l)}</span>`).join('')}</div>`; }

/* ----- Progreso ----- */
function viewProgreso(M){
  const all = allWeeks(M), cw = rawWeek(M), cur = all[curWeek(M)];
  const x = all.map(o=>o.w), mark = cw>=0&&cw<all.length ? cw : null;
  const lastW = Math.max(cw, ...all.filter(o=>o.load||o.vr||o.tr||o.weight!=null).map(o=>o.w));
  const upto = (v,i) => i<=lastW ? v : null;
  const sm = macroSummary(M);
  const rows = all.map(o=>`<tr class="${o.w===cw?'cur':''}"><td>${o.w}</td><td>${fd(weekStart(M,o.w),{day:'numeric',month:'short'})}</td><td><span class="pill ${typeCls(o.type)}">${esc(o.type)}</span></td>
    <td class="num">${o.done}/${o.planned}</td><td class="num">${fmt(o.load)}</td><td class="num">${o.mono==null?'—':fmt(o.mono,2)}</td><td class="num">${o.strain==null?'—':fmt(o.strain)}</td><td class="num">${fmt(o.chronic)}</td><td class="num">${o.acwr==null?'—':fmt(o.acwr,2)}</td>
    <td class="num">${fmt(o.vp)}</td><td class="num">${fmt(o.vr)}</td><td class="num">${fmt(o.tp)}</td><td class="num">${fmt(o.tr)}</td><td class="num">${fmt(o.ton)}</td><td class="num">${o.rpeObj==null?'—':fmt(o.rpeObj,1)}</td><td class="num">${o.rpeReal==null?'—':fmt(o.rpeReal,1)}</td><td class="num">${o.hooper==null?'—':fmt(o.hooper,1)}</td><td class="num">${o.weight==null?'—':fmt(o.weight,1)}</td>
    <td><span class="pill ${o.alert[0]==='info'?'':o.alert[0]}">${esc(o.alert[1])}</span></td></tr>`).join('');
  const wv = all.map(o=>o.weight), wf = wv.filter(z=>z!=null), w0 = num(S.settings.profile.weight0);
  const wlo = wf.length ? Math.floor(Math.min(...wf, w0??wf[0])-2) : 60, whi = wf.length ? Math.ceil(Math.max(...wf, w0??wf[0])+1) : 100;
  return `<div><span class="eyebrow">Control de la carga</span><h1>Progreso</h1></div>
  <section class="kpis">
    <div class="kpi help"><span>Sesiones${helpTip('k_ses')}</span><b>${sm.done}<small class="muted" style="font-size:16px"> / ${sm.total}</small></b></div>
    <div class="kpi help"><span>Carga total sRPE${helpTip('k_load')}</span><b>${fmt(sum(all.map(o=>o.load)))}</b><span>UA</span></div>
    <div class="kpi help"><span>Volumen real${helpTip('k_vol')}</span><b>${fmt(sum(all.map(o=>o.vr)))}</b><span>repeticiones</span></div>
    <div class="kpi help"><span>Tonelaje${helpTip('k_ton')}</span><b>${fmt(sum(all.map(o=>o.ton))/1000,1)}</b><span>toneladas</span></div>
    <div class="kpi help"><span>ACWR actual${helpTip('k_acwr')}</span><b>${cur.acwr==null?'—':fmt(cur.acwr,2)}</b><span>zona segura 0,8-1,3</span></div>
  </section>
  <section class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))">
    <div class="card help"><h3>Carga interna semanal (sRPE)${helpTip('srpe')}</h3>${legend([['var(--accent)','Carga (UA)'],['var(--t-test)','Media 4 semanas']])}
      ${chartBox({x, mark, label:'Carga semanal', series:[{type:'bar',name:'Carga',v:all.map(o=>o.load||null),color:'var(--accent)'},{type:'line',name:'Media 4 semanas',v:all.map((o,i)=>upto(o.chronic||null,i)),color:'var(--t-test)'}]})}</div>
    <div class="card help"><h3>ACWR (agudo : crónico)${helpTip('acwr')}</h3>${legend([['var(--ok)','Zona 0,8-1,3'],['var(--ink)','ACWR']])}
      ${chartBox({x, mark, label:'ACWR', ymin:0, ymax:Math.max(2, niceMax(Math.max(0,...all.map(o=>o.acwr||0)))), band:[0.8,1.3], series:[{type:'line',name:'ACWR',v:all.map(o=>o.acwr),color:'var(--ink)'}]})}</div>
    <div class="card help"><h3>Volumen: plan vs real (reps)${helpTip('vol')}</h3>${legend([['var(--t-trans)','Plan'],['var(--accent)','Real']])}
      ${chartBox({x, mark, label:'Volumen', series:[{type:'bar',name:'Plan',v:all.map(o=>o.vp),color:'var(--t-trans)',op:.45},{type:'bar',name:'Real',v:all.map(o=>o.vr||null),color:'var(--accent)'}]})}</div>
    <div class="card help"><h3>Intensidad: RPE objetivo vs real${helpTip('rpe')}</h3>${legend([['var(--t-trans)','Objetivo',1],['var(--crit)','Real',1]])}
      ${chartBox({x, mark, label:'RPE', ymin:0, ymax:10, series:[{type:'line',name:'RPE objetivo',v:all.map(o=>o.rpeObj),color:'var(--t-trans)',dash:1},{type:'line',name:'RPE real',v:all.map(o=>o.rpeReal),color:'var(--crit)'}]})}</div>
    <div class="card help"><h3>Bienestar (Hooper, menor es mejor)${helpTip('hooper')}</h3>${legend([['var(--warn)','Hooper medio']])}
      ${chartBox({x, mark, label:'Hooper', ymin:4, ymax:28, series:[{type:'line',name:'Hooper',v:all.map(o=>o.hooper),color:'var(--warn)'}]})}</div>
    <div class="card help"><h3>Peso corporal (kg)${helpTip('peso')}</h3>${legend([['var(--t-deload)','Peso']])}
      ${chartBox({x, mark, label:'Peso', ymin:wlo, ymax:whi, series:[{type:'line',name:'Peso',v:wv,color:'var(--t-deload)'}]})}</div>
  </section>
  <section class="flat card"><h3>Resumen semanal</h3>
  <div class="tbl-wrap"><table><thead><tr><th>Sem</th><th>Inicio</th><th>Tipo</th><th class="num">Sesiones</th><th class="num">Carga</th><th class="num">Monotonía</th><th class="num">Strain</th><th class="num">Crónica</th><th class="num">ACWR</th><th class="num">Vol plan</th><th class="num">Vol real</th><th class="num">TUT plan</th><th class="num">TUT real</th><th class="num">Tonelaje</th><th class="num">RPE obj</th><th class="num">RPE real</th><th class="num">Hooper</th><th class="num">Peso</th><th>Alerta</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="small muted">Carga = minutos × RPE de sesión (Foster). Monotonía = media diaria / desviación estándar; strain = carga × monotonía. ACWR = carga de la semana / media de las últimas 4 (desde la semana 3).</p></section>`;
}

/* ----- Tests ----- */
function viewTests(M){
  const tws = testWeeks(M);
  const head = tws.map((tw,i)=>`<th class="num">T${i}<br><span style="font-weight:400">S${tw} · ${fd(weekStart(M,tw),{day:'numeric',month:'short'})}</span></th>`).join('');
  const row = (name, label, unit, better, proto, ti, editable) => {
    const vals = tws.map(tw=>testVal(M,name,tw));
    const cells = tws.map((tw,i)=> editable ? `<td class="num">${numIn(`e.test:${tw}.${name.replace(/\./g,'')}`,{min:0,ph: vals[i]!=null?fmt(vals[i],1):'—'})}</td>` : `<td class="num">${vals[i]==null?'—':fmt(vals[i],1)}</td>`).join('');
    const t0 = vals.find(v=>v!=null), lastI = [...vals.keys()].reverse().find(i=>vals[i]!=null), last = lastI!=null ? vals[lastI] : null;
    const target = ti!=null ? num(M.tests[ti].target) : null;
    const ch = t0!=null && last!=null ? last - t0 : null, chp = ch!=null && t0 ? ch/t0 : null;
    const prog = t0!=null && last!=null && target!=null && target!==t0 ? Math.max(0,Math.min(1,(last-t0)/(target-t0))) : null;
    const good = ch==null||ch===0 ? '' : (better==='↑' ? ch>0 : ch<0) ? 'ok' : 'crit';
    return `<tr><td class="wrap-txt"><b>${esc(label)}</b><div class="small muted">${esc(proto)}</div></td><td>${esc(unit)} ${better}</td>${cells}
      <td class="num">${ti!=null?numIn(`m.tests.${ti}.target`,{min:0}):'—'}</td>
      <td class="num">${ch==null?'—':`<span class="pill ${good}">${ch>0?'+':''}${fmt(ch,1)}</span>`}</td><td class="num">${chp==null?'—':(chp>0?'+':'')+Math.round(chp*100)+'%'}</td>
      <td>${prog==null?'—':`<div class="bar" title="${Math.round(prog*100)}%"><i style="width:${prog*100}%"></i></div>`}</td>
      <td>${ti!=null?`<button class="icon-btn" title="Quitar de la batería" data-act="rmTest" data-arg="${ti}">✕</button>`:''}</td></tr>`;
  };
  const rows = (M.tests||[]).map((t,i)=>row(t.name, t.name, unitLbl(lib(t.name).unit), t.better||'↑', t.protocol||'', i, true)).join('')
    + row('__peso','Peso corporal','kg','↓','Desde Cuerpo, en la semana del test.',null,false) + row('__cintura','Cintura','cm','↓','Desde Cuerpo, en la semana del test.',null,false);
  return `<div class="row between"><div><span class="eyebrow">Batería de evaluación · ${tws.length} semanas con test</span><h1>Tests</h1></div><button class="btn" data-act="pickTest">+ Añadir test</button></div>
  ${tws.length ? '' : '<p class="alert warn">Este macrociclo no tiene semanas de test. Marca alguna semana como "Test" en Plan › Editar plan.</p>'}
  <p class="muted">Los resultados se toman de las sesiones de test (mejor serie de esa semana) o los escribes aquí directamente.</p>
  <div class="tbl-wrap"><table><thead><tr><th>Test</th><th>Unidad</th>${head}<th class="num">Objetivo</th><th class="num">Cambio</th><th class="num">%</th><th>Hacia el objetivo</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="note">Calentamiento de 10 min, 3 min de descanso entre tests, siempre en el mismo orden y a la misma hora del día.</p>`;
}

/* ----- Cuerpo ----- */
function viewCuerpo(M){
  const P = S.settings.profile, h = (num(P.height)||0)/100, cw = rawWeek(M), lw = lastWeight(M), e = E(M), w0 = num(P.weight0);
  const imc = v => h ? fmt(v/(h*h),1) : '—';
  const rows = M.weeks.map(W=>{ const k = 'body:'+W.w, b = e[k]||{}, wv = num(b.weight), calc = wv ?? bw(M,W.w);
    return `<tr class="${W.w===cw?'cur':''}"><td>${W.w}</td><td>${fd(weekStart(M,W.w),{day:'numeric',month:'short'})}</td>
    <td>${numIn(`e.${k}.weight`,{min:0,step:0.1})}</td><td>${numIn(`e.${k}.waist`,{min:0,step:0.5})}</td><td>${numIn(`e.${k}.fat`,{min:0,step:0.1})}</td>
    <td class="num">${wv==null?'—':imc(wv)}</td><td class="num">${wv==null||w0==null?'—':(wv-w0>0?'+':'')+fmt(wv-w0,1)}</td><td class="num">${P.protein?fmt(Math.round(calc*P.protein))+' g':'—'}</td>
    <td>${txtIn(`e.${k}.notes`)}</td></tr>`; }).join('');
  const all = allWeeks(M), wv = all.map(o=>o.weight), wf = wv.filter(z=>z!=null), zv = all.map(o=>o.waist), zf = zv.filter(z=>z!=null);
  return `<div><span class="eyebrow">Control corporal semanal</span><h1>Cuerpo</h1></div>
  <section class="kpis">
    <div class="kpi"><span>Peso inicial</span><b>${fmt(w0,1)}</b><span>kg${w0&&h?' · IMC '+imc(w0):''}</span></div>
    <div class="kpi"><span>Peso actual</span><b>${lw?fmt(lw.v,1):'—'}</b><span>${lw?`semana ${lw.w}${w0!=null?' · '+(lw.v-w0>0?'+':'')+fmt(lw.v-w0,1)+' kg':''}`:'sin registros'}</span></div>
    <div class="kpi"><span>Proteína diaria</span><b>${P.protein&&(lw||w0)?fmt(Math.round((lw?lw.v:w0)*P.protein))+' g':'—'}</b><span>${fmt(P.protein,1)} g/kg</span></div>
    <div class="kpi"><span>Kcal objetivo</span><b>${fmt(P.kcalTrain)}</b><span>entreno · ${fmt(P.kcalRest)} descanso</span></div>
  </section>
  ${w0==null||!h ? '<p class="alert info">Completa tu peso y estatura en Perfil para ver IMC y cambios.</p>' : ''}
  <section class="card"><h3>Peso y cintura</h3>${legend([['var(--t-deload)','Peso (kg)'],['var(--warn)','Cintura (cm)']])}
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))">
    ${chartBox({x:all.map(o=>o.w), mark:cw, h:170, label:'Peso', ymin:wf.length?Math.floor(Math.min(...wf,w0??wf[0])-2):60, ymax:wf.length?Math.ceil(Math.max(...wf,w0??wf[0])+1):100, series:[{type:'line',name:'Peso',v:wv,color:'var(--t-deload)'}]})}
    ${chartBox({x:all.map(o=>o.w), mark:cw, h:170, label:'Cintura', ymin:zf.length?Math.floor(Math.min(...zf)-3):70, ymax:zf.length?Math.ceil(Math.max(...zf)+2):110, series:[{type:'line',name:'Cintura',v:zv,color:'var(--warn)'}]})}
    </div></section>
  ${bodyFatCard(M)}
  <div class="tbl-wrap"><table><thead><tr><th>Sem</th><th>Fecha</th><th>Peso (kg)</th><th>Cintura (cm)</th><th><span class="help">% grasa${helpTip('grasa')}</span></th><th class="num">IMC</th><th class="num">Cambio</th><th class="num">Proteína</th><th>Notas</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* ----- Ajustes del macrociclo ----- */
function viewAjustes(M){
  const days = M.days.map((d,i)=>`<div class="row" style="align-items:end"><label class="f" style="width:90px">Día ${d.k}${selIn(`m.days.${i}.off`,WDAYS_L.map((l,j)=>[j,l]))}</label><label class="f" style="flex:1;min-width:160px">Nombre de la sesión${txtIn(`m.days.${i}.name`)}</label>${M.days.length>1?`<button class="icon-btn" title="Quitar día" data-act="rmDay" data-arg="${i}">✕</button>`:''}</div>`).join('');
  return `<div><span class="eyebrow">Configuración</span><h1>Ajustes del macrociclo</h1></div>
  <section class="card"><div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
    <label class="f">Nombre${txtIn('m.name')}</label>
    <label class="f">Fecha de inicio<input type="date" id="m_start" data-k="m.start" value="${esc(M.start)}"></label>
    <label class="f">Objetivo${selIn('m.goal',Object.entries(GOALS).map(([k,g])=>[k,g.label]))}</label></div>
    <label class="f">Notas<textarea id="m_notes" data-k="m.notes" placeholder="Contexto, lesiones, metas personales">${esc(M.notes||'')}</textarea></label>
    <p class="small muted">${nWeeks(M)} semanas: del ${fd(parseD(M.start),{day:'numeric',month:'long',year:'numeric'})} al ${fd(addD(parseD(M.start), nWeeks(M)*7-1),{day:'numeric',month:'long',year:'numeric'})}.</p></section>
  <section class="card"><h3>Días de entrenamiento</h3>${days}<div class="row"><button class="btn sm" data-act="addDay">+ Añadir día</button></div></section>
  <section class="card"><h3>Semanas</h3><p class="small muted">Añade semanas al final (copian la última semana de carga) o quita la última.</p>
    <div class="row"><button class="btn sm" data-act="addWeek">+ Añadir semana</button><button class="btn sm danger" data-act="askRmWeek" ${nWeeks(M)<=1?'disabled':''}>Quitar la última semana</button></div></section>
  <section class="card"><h3>Macrociclo</h3><div class="row">
    <button class="btn" data-act="dupMacro">Duplicar (sin registros)</button>
    <button class="btn" data-act="archMacro">${M.archived?'Desarchivar':'Archivar'}</button>
    <button class="btn" data-act="exportMacro">Exportar registro (CSV)</button>
    <button class="btn danger" data-act="askDelMacro">Borrar macrociclo</button></div></section>`;
}

/* ================= Selector de ejercicios (modal) ================= */
function openPicker(opts){ UI.modal = opts; UI.pickQ = ''; UI.pickPat = opts.pat || ''; UI.pickEq = ''; UI.pickLvl = 0; UI.pickScope = 'week'; UI.pickAvail = true; renderModal(); }
function renderModal(){
  const m = UI.modal, el = $('#modal');
  if (!m){ el.hidden = true; el.innerHTML = ''; return; }
  const M = curM();
  if (m.kind==='copy'){
    const [w,k] = m.key.split('-'), wk = week(M,+w);
    el.innerHTML = `<div class="sheet" role="dialog" aria-label="Copiar sesión"><div class="sheet-h"><div class="row between"><h2>Copiar sesión</h2><button class="btn ghost" data-act="closeModal">Cerrar</button></div></div>
      <div class="sheet-b"><p>Copia los ejercicios de <b>semana ${w} · ${esc(dayOf(M,k).name||'Día '+k)}</b> al mismo día de:</p>
      ${[['meso','Las demás semanas de carga de este mesociclo'],['sametype',`Todas las semanas de tipo "${esc(wk.type)}"`],['rest','Todas las semanas siguientes'],['all','Todas las semanas del macrociclo']].map(([v,l])=>`<button class="pick" data-act="doCopy" data-arg="${v}"><b>${l}</b><span class="small muted">Reemplaza esas sesiones</span></button>`).join('')}
      <p class="small muted">Los registros que ya hiciste no se borran.</p></div></div>`;
    el.hidden = false; return;
  }
  const eqSet = UI.pickAvail && M ? new Set(['pc', ...(M.equip||[])]) : null;
  const list = libFilter(UI.pickQ, UI.pickPat, UI.pickEq, +UI.pickLvl, eqSet);
  const cur = m.cur ? lib(m.cur) : null;
  const scope = m.kind==='replace' ? `<div class="seg">${[['week','Solo esta semana'],['meso','Todo el mesociclo'],['all','Todo el macrociclo']].map(([v,l])=>`<button data-act="pickScope" data-arg="${v}" aria-pressed="${UI.pickScope===v}">${l}</button>`).join('')}</div>` : '';
  const sugg = cur ? [cur.reg, cur.prog].filter(n=>n && allEx().some(e=>e.name===n)) : [];
  el.innerHTML = `<div class="sheet" role="dialog" aria-label="Elegir ejercicio"><div class="sheet-h">
      <div class="row between"><h2>${m.kind==='replace'?'Cambiar ejercicio':m.kind==='test'?'Añadir test':'Añadir ejercicio'}</h2><button class="btn ghost" data-act="closeModal">Cerrar</button></div>
      ${cur?`<p class="small muted">Actual: <b>${esc(cur.name)}</b></p>`:''}${scope}
      ${libFilters('pick')}
      ${M?`<label class="small" style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="pickAvail" data-uichk="pickAvail" ${UI.pickAvail?'checked':''}> Solo con mi equipamiento</label>`:''}
    </div><div class="sheet-b">
      ${sugg.length?`<span class="eyebrow">Sugeridos</span>${sugg.map(n=>{ const e = lib(n); return `<button class="pick" data-act="pickDo" data-arg="${esc(n)}"><span><b>${esc(n)}</b><br><span class="small muted">${n===cur.reg?'Más fácil':'Más difícil'} · ${esc(e.pattern)} · ${esc(equipLbl(e))}</span></span>${dots(e.level)}</button>`; }).join('')}<span class="eyebrow">Todos</span>`:''}
      ${list.slice(0,120).map(e=>`<button class="pick" data-act="pickDo" data-arg="${esc(e.name)}"><span><b>${esc(e.name)}</b><br><span class="small muted">${esc(e.pattern)} · ${esc(SUBS[e.sub]||'')} · ${esc(equipLbl(e))} · ${e.unit}</span></span>${dots(e.level)}</button>`).join('') || '<p class="empty">Ningún ejercicio coincide. Quita filtros o crea uno en la Biblioteca.</p>'}
    </div></div>`;
  el.hidden = false;
}
function closeModal(){ UI.modal = null; renderModal(); if (renderQueued) render(); }
function pickDo(name){
  const m = UI.modal, M = curM(); if (!m) return;
  const e = lib(name);
  if (m.kind==='add'){
    const p = M.sessions[m.key], last = p.items[p.items.length-1] || {}, ms = meso(M, week(M, +m.key.split('-')[0]).meso);
    const r0 = parseInt(String(ms?.range||'8'),10) || 8;
    p.items.push({ex:name, s:last.s ?? 3, r: e.unit==='seg' ? 20 : r0, kg:null, rest: parseInt(String(ms?.rest||'90'),10) || 90, tempo:last.tempo || '2-0-1-0', rpe:last.rpe ?? 7, note:''});
    markMacro(M);
  } else if (m.kind==='replace'){
    const [w,k] = m.key.split('-'), old = M.sessions[m.key].items[m.i].ex, wm = week(M,+w).meso;
    const weeks = UI.pickScope==='week' ? [+w] : UI.pickScope==='meso' ? M.weeks.filter(x=>x.meso===wm).map(x=>x.w) : M.weeks.map(x=>x.w);
    let n = 0;
    weeks.forEach(ww=>{ const p = M.sessions[ww+'-'+k]; if (!p) return; p.items.forEach(it=>{ if (it.ex===old){ it.ex = name; n++; } }); });
    M.sessions[m.key].items[m.i].ex = name;
    markMacro(M); toast(n>1 ? `Cambiado en ${n} sesiones` : 'Ejercicio cambiado');
  } else if (m.kind==='test'){
    if ((M.tests||[]).some(t=>t.name===name)) { toast('Ese test ya está en la batería'); return; }
    (M.tests || (M.tests = [])).push({name, unit:e.unit, better:'↑', protocol: e.unit==='seg' ? 'Máximo tiempo con técnica estricta.' : 'Máximas repeticiones estrictas en una serie.', target:null});
    markMacro(M);
  }
  UI.modal = null; renderModal(); render();
}

/* ================= Acciones ================= */
let wakeLock = null;
async function keepAwake(on){ try { if (on && !wakeLock && navigator.wakeLock){ wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener?.('release',()=>{ wakeLock = null; }); } if (!on && wakeLock){ await wakeLock.release(); wakeLock = null; } } catch(e){} }
function go(screen){ if (screen==='diario') loadEntries(DIARIO); UI.screen = screen; UI.sess = null; UI.menu = false; UI.confirm = null; keepAwake(false); render(); window.scrollTo(0,0); }
function openMacro(id){ UI.mid = id; UI.screen = 'macro'; UI.tab = 'hoy'; UI.sess = null; UI.week = null; UI.editPlan = false; UI.menu = false; render(); window.scrollTo(0,0); loadEntries(id); }
function moveLog(M, key, i, j){ const L = E(M)['log:'+key]; if (!L || !L.ex) return; const a = L.ex[i], b = L.ex[j]; L.ex[i] = b ?? null; L.ex[j] = a ?? null; markEntry(M.id,'log:'+key); }
function setsOf(M,key,i){ const Ex = E(M); const L = Ex['log:'+key] || (Ex['log:'+key] = {}); L.ex = L.ex || []; while (L.ex.length<=i) L.ex.push(null); L.ex[i] = L.ex[i] || {sets:[]}; L.ex[i].sets = L.ex[i].sets || []; return L.ex[i].sets; }
function autoDone(M,key){ const L = E(M)['log:'+key]; if (L && !L.done && (L.ex||[]).some(x=>x && (x.sets||[]).some(t=>num(t.r)!=null))){ L.done = true; markEntry(M.id,'log:'+key); return true; } return false; }
let installEvt = null;
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); installEvt = e; });
window.addEventListener('appinstalled', ()=>{ installEvt = null; toast('App instalada'); });
const ACTS = {
  water: a=>{ const ds = UI.dDate || isoD(today()), k = 'dia:'+ds, cur = num(((S.entries[DIARIO]||{})[k]||{}).water) || 0; setPath(`d.${k}.water`, Math.max(0, cur + +a) || null); render(); },
  diarioMove: a=>{ const d = addD(parseD(UI.dDate || isoD(today())), +a); if (d > addD(today(),1)) return; UI.dDate = isoD(d); render(); },
  diarioDay: a=>{ UI.dDate = a; render(); window.scrollTo(0,0); },
  diarioSess: a=>{ const [mid,key] = a.split('|'); UI.mid = mid; UI.screen = 'macro'; UI.tab = 'hoy'; UI.menu = false; loadEntries(mid); UI.sess = key; render(); window.scrollTo(0,0); keepAwake(true); },
  diarioCsv: ()=>saveFile(`diario-${isoD(today())}.csv`, diarioCsv(), 'text/csv'),
  saveBF: a=>{ const M = curM(), [w,v] = a.split('|'); setPath(`e.body:${w}.fat`, +v); if (num(UI.bfWaist)!=null) setPath(`e.body:${w}.waist`, +UI.bfWaist); if (num(UI.bfNeck)!=null) setPath(`e.body:${w}.neck`, +UI.bfNeck); toast(`Guardado: ${fmt(+v,1)}% en la semana ${w}`); render(); },
  install: async ()=>{ UI.menu = false; render(); if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch(e){} installEvt = null; },
  go: a=>go(a), menu: ()=>{ UI.menu = !UI.menu; render(); },
  tab: a=>{ UI.tab = a; UI.sess = null; keepAwake(false); render(); window.scrollTo(0,0); },
  openMacro: a=>openMacro(a),
  newMacro: ()=>{ UI.wiz = newWizard(); go('wizard'); },
  useTemplate: ()=>{ const r = fromV1({}); r.macro.start = isoD(nextMonday()); applyImport(r, true); toast('Plan de 27 semanas creado'); openMacro(r.macro.id); },
  wz: a=>{ const z = UI.wiz, [k,v] = a.split('|');
    if (k==='goal') z.goal = v; else if (k==='level') z.level = +v; else if (k==='style') z.style = v;
    else if (k==='dow'){ const i = +v; z.dows = z.dows.includes(i) ? z.dows.filter(x=>x!==i) : [...z.dows, i].slice(-6); }
    else if (k==='eq'){ z.equip = z.equip.includes(v) ? z.equip.filter(x=>x!==v) : [...z.equip, v]; }
    else if (k==='loadW') z.loadW = +v; else if (k==='testInit') z.testInit = !z.testInit; else if (k==='testFinal') z.testFinal = !z.testFinal;
    else if (k==='retest') z.retestEvery = +v; else if (k==='trans') z.trans = +v;
    render(); },
  wzStep: a=>{ UI.wiz.step = Math.max(0, Math.min(4, UI.wiz.step + +a)); render(); window.scrollTo(0,0); },
  wzCreate: ()=>{ const z = UI.wiz; z.weeks = Math.max(6, Math.min(52, num(z.weeks)||16)); const M = generateMacro(z); S.macros[M.id] = M; S.entries[M.id] = {}; Sync.loaded.add(M.id); markMacro(M); UI.wiz = null; openMacro(M.id); UI.tab = 'plan'; render(); toast('Macrociclo creado. Todo es editable en Plan.'); },
  open: a=>{ UI.sess = a; render(); window.scrollTo(0,0); keepAwake(true); },
  closeSess: ()=>{ const M = curM(); if (M && UI.sess && autoDone(M,UI.sess)) toast('Sesión registrada'); UI.sess = null; keepAwake(false); render(); window.scrollTo(0,0); },
  week: a=>{ const M = curM(); UI.week = Math.max(0, Math.min(nWeeks(M)-1, +a)); render(); },
  editPlan: ()=>{ UI.editPlan = !UI.editPlan; render(); },
  toggleDone: k=>{ const M = curM(); setPath(`e.log:${k}.done`, logOf(M,...k.split('-').map((x,i)=>i?x:+x)).done ? null : true); render(); if (logOf(M,+k.split('-')[0],k.split('-')[1]).done) toast('Sesión registrada'); },
  tick: a=>{ const M = curM(), [key,i,j] = a.split('|'), it = M.sessions[key].items[+i], sets = setsOf(M,key,+i);
    while (sets.length<=+j) sets.push({});
    const st = sets[+j];
    if (num(st.r)!=null){ sets[+j] = {}; }
    else if (num(it.r)==null){ const el = document.querySelector(`[data-k$=".ex.${i}.sets.${j}.r"]`); if (el) el.focus(); toast('Escribe cuántas hiciste en esta serie'); return; }
    else { st.r = num(it.r) ?? 0; if (num(it.kg)!=null && st.kg==null) st.kg = +it.kg; if (num(it.rpe)!=null && st.rpe==null) st.rpe = +it.rpe; if (num(it.rest)) startTimer(+it.rest); }
    markEntry(M.id,'log:'+key); autoDone(M,key); render(); },
  addSet: a=>{ const M = curM(), [key,i] = a.split('|'), it = M.sessions[key].items[+i], sets = setsOf(M,key,+i); while (sets.length < (num(it.s)||1)) sets.push({}); sets.push({}); markEntry(M.id,'log:'+key); render(); },
  rmSet: a=>{ const M = curM(), [key,i] = a.split('|'), sets = setsOf(M,key,+i); sets.pop(); markEntry(M.id,'log:'+key); render(); },
  asPlan: a=>{ const M = curM(), [key,i] = a.split('|'), it = M.sessions[key].items[+i], sets = setsOf(M,key,+i), n = num(it.s)||1;
    for (let j=0;j<n;j++){ sets[j] = sets[j] || {}; if (num(sets[j].r)==null) sets[j].r = num(it.r) ?? 0; if (num(it.kg)!=null && sets[j].kg==null) sets[j].kg = +it.kg; }
    markEntry(M.id,'log:'+key); autoDone(M,key); render(); },
  rest: a=>startTimer(+a),
  mv: a=>{ const M = curM(), [key,i,dir] = a.split('|'), it = M.sessions[key].items, x = +i, y = x + +dir; if (y<0||y>=it.length) return; [it[x],it[y]] = [it[y],it[x]]; moveLog(M,key,x,y); markMacro(M); render(); },
  rm: a=>{ const M = curM(), [key,i] = a.split('|'); M.sessions[key].items.splice(+i,1); const L = E(M)['log:'+key]; if (L && L.ex){ L.ex.splice(+i,1); markEntry(M.id,'log:'+key); } markMacro(M); render(); },
  pickFor: a=>{ const M = curM(), [key,i] = a.split('|'), it = M.sessions[key].items[+i]; openPicker({kind:'replace', key, i:+i, cur:it.ex, pat:lib(it.ex).pattern}); },
  pickAdd: a=>openPicker({kind:'add', key:a}),
  pickTest: ()=>openPicker({kind:'test'}),
  pickDo: a=>pickDo(a), closeModal: ()=>closeModal(),
  pickScope: a=>{ UI.pickScope = a; renderModal(); },
  pickPat: a=>{ UI.pickPat = a; renderModal(); },
  libPat: a=>{ UI.libPat = a; render(); },
  addSess: a=>{ const M = curM(); M.sessions[a] = {t:'Carga', items:[]}; markMacro(M); render(); },
  delSess: a=>{ UI.confirm = {msg:'¿Quitar esta sesión de la semana? Su registro, si existe, se conserva por si la vuelves a crear.', act:'doDelSess', arg:a, label:'Quitar sesión'}; render(); window.scrollTo(0,0); },
  doDelSess: a=>{ const M = curM(); delete M.sessions[a]; markMacro(M); UI.confirm = null; render(); },
  copySess: a=>{ UI.modal = {kind:'copy', key:a}; renderModal(); },
  doCopy: scope=>{ const M = curM(), [w,k] = UI.modal.key.split('-'), src = M.sessions[UI.modal.key], wk = week(M,+w);
    let targets = M.weeks.filter(x=>x.w!==+w);
    if (scope==='meso') targets = targets.filter(x=>x.meso===wk.meso && x.type==='Carga');
    else if (scope==='sametype') targets = targets.filter(x=>x.type===wk.type);
    else if (scope==='rest') targets = targets.filter(x=>x.w>+w);
    targets.forEach(x=>{ M.sessions[x.w+'-'+k] = clone(src); });
    markMacro(M); UI.modal = null; renderModal(); toast(`Copiada a ${targets.length} semanas`); render(); },
  addMeso: ()=>{ const M = curM(); const n = Math.max(...M.mesos.map(m=>m.n), 0) + 1; M.mesos.push({n, name:'Mesociclo '+n, phase:'', objective:'', range:'8-12', rest:'90 s', rpe:'7-8', methods:'', criterion:''}); markMacro(M); render(); },
  rmTest: a=>{ const M = curM(); M.tests.splice(+a,1); markMacro(M); render(); },
  addDay: ()=>{ const M = curM(); const used = new Set(M.days.map(d=>d.k)); let c = 65; while (used.has(String.fromCharCode(c))) c++; const k = String.fromCharCode(c); const free = [0,1,2,3,4,5,6].find(o=>!M.days.some(d=>d.off===o)) ?? 5;
    M.days.push({k, off:free, name:'Día '+k}); M.weeks.forEach(W=>{ M.sessions[W.w+'-'+k] = {t: /test/i.test(W.type)?'Técnica':/descarga/i.test(W.type)?'Descarga':W.type==='Transición'?'Transición':'Carga', items:[]}; }); markMacro(M); render(); toast('Día añadido: agrega ejercicios en Plan'); },
  rmDay: a=>{ UI.confirm = {msg:'¿Quitar este día y sus sesiones de todas las semanas?', act:'doRmDay', arg:a, label:'Quitar día'}; render(); window.scrollTo(0,0); },
  doRmDay: a=>{ const M = curM(), d = M.days[+a]; M.days.splice(+a,1); M.weeks.forEach(W=>delete M.sessions[W.w+'-'+d.k]); markMacro(M); UI.confirm = null; render(); },
  addWeek: ()=>{ const M = curM(), n = nWeeks(M), last = [...M.weeks].reverse().find(x=>x.type==='Carga') || M.weeks[n-1];
    M.weeks.push({w:n, meso:last.meso, phase:last.phase, type:'Carga', goal:last.goal});
    M.days.forEach(d=>{ const src = M.sessions[last.w+'-'+d.k]; if (src) M.sessions[n+'-'+d.k] = clone(src); }); markMacro(M); UI.week = n; render(); toast('Semana '+n+' añadida'); },
  askRmWeek: ()=>{ UI.confirm = {msg:'¿Quitar la última semana con sus sesiones planificadas?', act:'doRmWeek', label:'Quitar semana'}; render(); window.scrollTo(0,0); },
  doRmWeek: ()=>{ const M = curM(), n = nWeeks(M)-1; M.weeks.pop(); M.days.forEach(d=>delete M.sessions[n+'-'+d.k]); markMacro(M); UI.confirm = null; UI.week = null; render(); },
  dupMacro: ()=>{ const M = curM(), C = clone(M); C.id = uid(); C.name = M.name + ' (copia)'; C.start = isoD(nextMonday()); C.created = C.updated = new Date().toISOString(); C.archived = false; S.macros[C.id] = C; S.entries[C.id] = {}; Sync.loaded.add(C.id); markMacro(C); toast('Macrociclo duplicado'); openMacro(C.id); },
  archMacro: ()=>{ const M = curM(); M.archived = !M.archived; markMacro(M); render(); toast(M.archived?'Archivado':'Desarchivado'); },
  askDelMacro: ()=>{ UI.confirm = {msg:`¿Borrar "${curM().name}" con todos sus registros? No se puede deshacer.`, act:'doDelMacro', label:'Borrar para siempre'}; render(); window.scrollTo(0,0); },
  doDelMacro: ()=>{ const M = curM(); const keys = Object.keys(E(M)); delete S.macros[M.id]; delete S.entries[M.id];
    keys.forEach(k=>Sync.dirty.delete('entry:'+M.id+'|'+k)); if (Sync.b===ArtB) keys.forEach(k=>Sync.mark('entry:'+M.id+'|'+k));
    Sync.mark('macro:'+M.id); UI.confirm = null; UI.mid = null; go('home'); toast('Macrociclo borrado'); },
  cancelConfirm: ()=>{ UI.confirm = null; render(); },
  exportMacro: ()=>{ const M = curM(); saveFile(`${M.name.replace(/[^\w\- ]/g,'').trim()||'macrociclo'}-registro.csv`, csv(M), 'text/csv'); },
  exportAll: ()=>saveFile(`macrociclo-copia-${isoD(today())}.json`, JSON.stringify({app:'macrociclo', version:2, exportado:new Date().toISOString(), ...S}, null, 1), 'application/json'),
  import: ()=>$('#fileIn').click(),
  importText: ()=>importJson(UI.importText),
  libOpen: a=>{ UI.libOpen = UI.libOpen===a ? null : a; UI.libEdit = null; render(); },
  libNew: ()=>{ const c = S.settings.custom || (S.settings.custom = []); let n = 'Nuevo ejercicio', i = 2; while (allEx().some(e=>e.name===n)) n = 'Nuevo ejercicio ' + i++;
    c.unshift({name:n, pattern:UI.libPat||'Tracción', sub:'vertical', equip:'pc', unit:'reps', level:1, pct:0.5, muscles:'', tech:'', reg:'', prog:''}); markSettings(); UI.libQ = ''; UI.libEdit = UI.libOpen = n; render(); },
  libEdit: a=>{ if (!a){ UI.libEdit = null; render(); return; } const e = lib(a); if (!e.custom){ const c = S.settings.custom || (S.settings.custom = []); const copy = {...e}; delete copy.builtin; copy.builtinBase = true; c.unshift(copy); markSettings(); } UI.libEdit = UI.libOpen = a; render(); },
  libDel: a=>{ S.settings.custom = (S.settings.custom||[]).filter(e=>e.name!==a); markSettings(); UI.libOpen = UI.libEdit = null; render(); },
  libRestore: a=>{ S.settings.custom = (S.settings.custom||[]).filter(e=>e.name!==a); markSettings(); UI.libEdit = null; render(); toast('Ejercicio original restaurado'); },
  signOut: ()=>{ UI.menu = false; signOut(); }, forceSignOut: ()=>{ UI.confirm = null; forceSignOut(); },
  changePw: async ()=>{ const pw = $('#p_pw').value; if (pw.length<8){ toast('Mínimo 8 caracteres'); return; } const {error} = await SupaB.sb.auth.updateUser({password:pw}); toast(error ? authErr(error) : 'Contraseña actualizada'); },
  authMode: a=>{ UI.auth = a; UI.authMsg = ''; renderAuth(); },
  authLogin: ()=>authDo('login'), authSignup: ()=>authDo('signup'), authReset: ()=>authDo('reset'), authNewPass: ()=>authDo('newpass'),
};
function csv(M){
  const rows = [['semana','dia','sesion','fecha','tipo','orden','ejercicio','unidad','series_plan','reps_plan','lastre_plan','rpe_obj','serie','reps_reales','lastre','rpe','sesion_realizada','duracion','rpe_sesion','srpe','hooper']];
  for (const [w,k] of sessKeys(M)){ const key = w+'-'+k, p = M.sessions[key], s = sessCalc(M,w,k), L = logOf(M,w,k);
    p.items.forEach((it,i)=>{ const e = lib(it.ex), sets = ((L.ex||[])[i]?.sets||[]); const base = [w,k,dayOf(M,k).name,isoD(s.date),p.t,i+1,it.ex,e.unit,it.s??'',it.r??'',it.kg??'',it.rpe??''], tail = [L.done?'si':'',L.dur??'',L.rpe??'',s.srpe,s.hooper??''];
      if (!sets.length) rows.push([...base,'','','','',...tail]); else sets.forEach((st,j)=>rows.push([...base,j+1,st.r??'',st.kg??'',st.rpe??'',...tail])); }); }
  return rows.map(r=>r.map(v=>/[",;\n]/.test(String(v))?`"${String(v).replace(/"/g,'""')}"`:v).join(',')).join('\n');
}
async function saveFile(name, text, type){
  try { const dl = window.claude?.use ? await window.claude.use('downloads') : null; if (dl){ await dl.save({filename:name, data:text}); return; } }
  catch(e){ if (e && e.code && e.code!=='unavailable') return; }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text],{type})); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
  catch(e){ toast('No se pudo descargar el archivo.'); }
}
function importJson(text){
  let o; try { o = JSON.parse(text); } catch(e){ toast('El archivo no es una copia válida (JSON).'); return; }
  if (o && o.app==='macrociclo' && o.macros){
    const n = normState(o);
    S.settings = n.settings; markSettings();
    for (const [id,M] of Object.entries(n.macros)){ S.macros[id] = M; markMacro(M); S.entries[id] = n.entries[id] || {}; Sync.loaded.add(id); Object.keys(S.entries[id]).forEach(k=>markEntry(id,k)); }
    if (n.entries[DIARIO]){ S.entries[DIARIO] = Object.assign(S.entries[DIARIO]||{}, n.entries[DIARIO]); Sync.loaded.add(DIARIO); Object.keys(n.entries[DIARIO]).forEach(k=>markEntry(DIARIO,k)); }
    UI.importText = ''; toast('Copia importada'); go('home'); return;
  }
  if (o && o.plan && o.weeks){ const r = fromV1(o); applyImport(r, true); Sync.loaded.add(r.macro.id); UI.importText = ''; toast('Plan anterior importado'); openMacro(r.macro.id); return; }
  toast('El archivo no parece una copia de esta app.');
}
$('#fileIn').addEventListener('change', e=>{ const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ()=>importJson(r.result); r.readAsText(f); e.target.value = ''; });

/* ----- eventos ----- */
document.addEventListener('click', e=>{
  if (UI.menu && !e.target.closest('.menu')){ UI.menu = false; render(); }
  if (e.target.id==='modal'){ closeModal(); return; }
  const s = e.target.closest('[data-set]');
  if (s){ const cur = num(getPath(s.dataset.set)), v = +s.dataset.v; setPath(s.dataset.set, cur===v ? null : v); render(); return; }
  const hb = e.target.closest('.info');
  document.querySelectorAll('.help.open').forEach(h=>{ if (!hb || h!==hb.closest('.help')) h.classList.remove('open'); });
  if (hb){ e.preventDefault(); const h = hb.closest('.help'); placeTip(h); h.classList.toggle('open'); tipOpenedAt = Date.now(); return; }
  const a = e.target.closest('[data-act]');
  if (a && ACTS[a.dataset.act]){ e.preventDefault(); ACTS[a.dataset.act](a.dataset.arg); }
});
function readVal(el){ if (el.type==='number') return el.value==='' ? null : +el.value; if (el.tagName==='SELECT' && /^\d+$/.test(el.value) && /\.(off|meso)$/.test(el.dataset.k)) return +el.value; return el.value; }
function applyInput(el){
  const path = el.dataset.k;
  const m = path.match(/^s\.custom\.(\d+)\.name$/);
  if (m){
    const c = S.settings.custom[+m[1]], oldN = c.name, nn = el.value.trim();
    if (!nn || nn===oldN) return;
    if (allEx().some(x=>x.name===nn)){ toast('Ya existe un ejercicio con ese nombre.'); el.value = oldN; return; }
    for (const M of Object.values(S.macros)){ let used = false; for (const p of Object.values(M.sessions)) for (const it of p.items) if (it.ex===oldN){ it.ex = nn; used = true; } (M.tests||[]).forEach(t=>{ if (t.name===oldN){ t.name = nn; used = true; } }); if (used) markMacro(M); }
    c.builtinBase = false; c.name = nn; markSettings(); UI.libEdit = UI.libOpen = nn; return;
  }
  setPath(path, readVal(el));
  if (path.startsWith('s.custom')) _allEx = null;
}
document.addEventListener('input', e=>{
  const t = e.target, u = t.dataset?.ui;
  if (u){ UI[u] = t.value; if (u==='libQ') render(); else if (u==='pickQ') { renderModal(); const q = $('#pickq'); if (q){ q.focus(); q.setSelectionRange(q.value.length,q.value.length); } } return; }
  const el = t.closest('[data-k]'); if (!el || el.dataset.lazy || el.tagName==='SELECT' || el.type==='date') return;
  applyInput(el);
});
document.addEventListener('change', e=>{
  const t = e.target;
  if (t.dataset?.uisel){ UI[t.dataset.uisel] = t.value; t.dataset.uisel.startsWith('pick') ? renderModal() : render(); return; }
  if (t.dataset?.uichk){ UI[t.dataset.uichk] = t.checked; renderModal(); return; }
  const el = t.closest('[data-k]'); if (!el) return;
  if (el.dataset.lazy || el.tagName==='SELECT' || el.type==='date') applyInput(el);
  if (el.dataset.k.startsWith('ui.')) { render(); return; }
  setTimeout(()=>render(), 0);
});
document.addEventListener('focusout', ()=>{ if (renderQueued) setTimeout(()=>{ if (renderQueued) softRender(); }, 50); });
document.addEventListener('keydown', e=>{ if (e.key==='Escape' && UI.modal) closeModal(); if (e.key==='Enter' && e.target.closest && e.target.closest('#authForm')){ const b = $('#authForm .btn.primary'); if (b) b.click(); } });

/* ----- temporizador de descanso ----- */
const T = {end:0, iv:null};
function beep(){ try { const ac = new (window.AudioContext||window.webkitAudioContext)(); [0,0.25,0.5].forEach(t=>{ const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(ac.destination); o.start(ac.currentTime+t); o.stop(ac.currentTime+t+0.15); }); } catch(e){} try { navigator.vibrate && navigator.vibrate([200,100,200]); } catch(e){} }
function startTimer(sec){ T.end = Date.now() + sec*1000; clearInterval(T.iv); T.iv = setInterval(tick, 250); tick(); }
function tick(){
  const el = $('#timer'), left = Math.ceil((T.end - Date.now())/1000); el.hidden = false;
  if (left <= 0){ clearInterval(T.iv); T.iv = null; el.classList.add('end'); el.innerHTML = `<b>¡Vamos!</b><span>Siguiente serie</span><button data-tm="close">Cerrar</button>`; beep(); return; }
  el.classList.remove('end'); el.innerHTML = `<span class="small">Descanso</span><b>${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}</b><button data-tm="add">+15 s</button><button data-tm="close">Parar</button>`;
}
$('#timer').addEventListener('click', e=>{ const b = e.target.closest('[data-tm]'); if (!b) return; if (b.dataset.tm==='add'){ T.end += 15000; if (!T.iv) T.iv = setInterval(tick,250); tick(); } else { clearInterval(T.iv); T.iv = null; $('#timer').hidden = true; } });
let toastT;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(()=>t.hidden = true, 2800); }
let rzT; window.addEventListener('resize', ()=>{ clearTimeout(rzT); rzT = setTimeout(drawCharts, 150); });

function fatal(msg){
  const app = $('#app'); if (!app || app.querySelector('.fatal')) return;
  if (app.children.length && !app.querySelector('.auth p.muted')) { toast('Ocurrió un error: ' + msg); return; }
  app.innerHTML = `<div class="auth"><div class="card fatal"><h2>No se pudo abrir la app</h2><p class="muted">Tus datos están a salvo. Toca Recargar; si el problema sigue, envía una captura de esta pantalla.</p><p class="small" style="word-break:break-word"><code>${esc(String(msg).slice(0,300))}</code></p><button class="btn primary lg" onclick="location.reload()">Recargar</button></div></div>`;
}
window.addEventListener('error', e=>fatal(e.message || 'error'));
window.addEventListener('unhandledrejection', e=>fatal((e.reason && (e.reason.message||e.reason)) || 'error'));
boot();

document.addEventListener('mouseout', e=>{ if (!matchMedia('(hover:hover)').matches) return; const h = e.target.closest && e.target.closest('.help.open'); if (h && !h.contains(e.relatedTarget)) h.classList.remove('open'); });
