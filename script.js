// VIBE Quiniela Mundial 2026
const API_URL = 'https://script.google.com/macros/s/AKfycbx9Gbm_HIw5ApGTqc4s_t1RuYW1HscdcuWBr9TnzTOHwy-0QJ4DM-y6xR6p1gwX29qZ/exec';
const LOCK_DATE = new Date('2026-06-11T00:00:00-06:00'); // CST

// 48 teams
const TEAMS = ['Algeria','Argentina','Australia','Austria','Belgium','Bosnia and Herzegovina','Brazil','Canada','Cape Verde','Colombia','Costa Rica','Croatia','Curacao','Czechia','DR Congo','Ecuador','Egypt','England','France','Germany','Ghana','Haiti','Iran','Iraq','Ivory Coast','Japan','Jordan','Mexico','Morocco','Netherlands','New Zealand','Norway','Panama','Paraguay','Portugal','Qatar','Saudi Arabia','Scotland','Senegal','South Africa','South Korea','Spain','Sweden','Switzerland','Tunisia','Turkiye','Uruguay','USA','Uzbekistan'];

// i18n
const T = {
  en: {
    nav_home:'Home', nav_champion:'Champion', nav_matches:'Matches', nav_rules:'Rules', nav_register:'Register',
    hero_title:'World Cup Predictions 2026', hero_sub:'Predict the results of the FIFA World Cup USA/Mexico/Canada. Compete with all of TSE. Win prizes.',
    days:'Days', hours:'Hours', hero_join:'Join the Pool', hero_rules:'View Rules',
    champ_badge:'Bonus', champ_title:'Pick Your Champion', champ_desc:'Choose who you think will win the World Cup. Worth 10 bonus points. Locks when the tournament starts.',
    champ_save:'Save Pick', champ_locked:'Predictions are locked. The tournament has started.',
    match_badge:'Matches', match_title:'Group Stage', filter_all:'All', filter_pending:'Pending', filter_done:'Finished', loading:'Loading...',
    lb_title:'Standings', lb_player:'Player', lb_exact:'Exact', lb_correct:'Correct', lb_champ:'Champ', lb_pts:'Points',
    rules_badge:'Rules', rules_title:'Point System', r_exact:'Exact Result', r_exact_d:'Predict the exact score. E.g. you predict 2-1 and the result is 2-1.',
    r_winner:'Correct Winner', r_winner_d:'Predict who wins or a draw, without getting the exact score.',
    r_champ:'Champion Bonus', r_champ_d:'Correctly predict the World Cup winner. Must be locked before the tournament starts.',
    r_general:'General Rules',
    r1:'Predictions close 1 hour before each match.', r2:'Only one prediction per match.', r3:'You can modify your prediction before the deadline.',
    r4:'Tiebreaker: most exact results wins.', r5:'Prizes will be announced at the start of the tournament.', r6:'Champion pick locks on June 11, 2026. No changes after that.',
    reg_title:'Register', reg_alias:'Alias (Amazon)', reg_name:'Full Name', reg_email:'Email (Amazon)', reg_team:'Favorite Team (optional)', reg_submit:'Register',
    pred_submit:'Submit Prediction',
    btn_logout:'Logout', your_pick:'Your pick:', no_pick:'No pick yet', saved:'Saved!', sending:'Sending...', registering:'Registering...', registered:'Registered!', conn_err:'Connection error',
  },
  es: {
    nav_home:'Inicio', nav_champion:'Campeon', nav_matches:'Partidos', nav_rules:'Reglas', nav_register:'Registrarse',
    hero_title:'Quiniela Mundial 2026', hero_sub:'Predice los resultados del Mundial USA/Mexico/Canada. Compite con todo TSE. Gana premios.',
    days:'Dias', hours:'Horas', hero_join:'Unirme a la Quiniela', hero_rules:'Ver Reglas',
    champ_badge:'Bonus', champ_title:'Elige al Campeon', champ_desc:'Elige quien crees que ganara el Mundial. Vale 10 puntos bonus. Se bloquea al iniciar el torneo.',
    champ_save:'Guardar', champ_locked:'Las predicciones estan bloqueadas. El torneo ya inicio.',
    match_badge:'Partidos', match_title:'Fase de Grupos', filter_all:'Todos', filter_pending:'Pendientes', filter_done:'Finalizados', loading:'Cargando...',
    lb_title:'Tabla de Posiciones', lb_player:'Jugador', lb_exact:'Exactos', lb_correct:'Aciertos', lb_champ:'Campeon', lb_pts:'Puntos',
    rules_badge:'Reglas', rules_title:'Sistema de Puntos', r_exact:'Resultado Exacto', r_exact_d:'Acertar el marcador exacto. Ej: predecir 2-1 y el resultado es 2-1.',
    r_winner:'Acertar Ganador', r_winner_d:'Acertar quien gana o si es empate, sin acertar el marcador exacto.',
    r_champ:'Bonus Campeon', r_champ_d:'Acertar el campeon del Mundial. Debe estar bloqueado antes de que inicie el torneo.',
    r_general:'Reglas Generales',
    r1:'Las predicciones se cierran 1 hora antes de cada partido.', r2:'Solo una prediccion por partido.', r3:'Se puede modificar la prediccion antes del cierre.',
    r4:'Desempate: gana quien tenga mas resultados exactos.', r5:'Los premios se anuncian al inicio del torneo.', r6:'La prediccion de campeon se bloquea el 11 de junio, 2026.',
    reg_title:'Registro', reg_alias:'Alias (de Amazon)', reg_name:'Nombre Completo', reg_email:'Email (de Amazon)', reg_team:'Equipo favorito (opcional)', reg_submit:'Registrarme',
    pred_submit:'Enviar Prediccion',
    btn_logout:'Salir', your_pick:'Tu eleccion:', no_pick:'Sin eleccion aun', saved:'Guardado!', sending:'Enviando...', registering:'Registrando...', registered:'Registrado!', conn_err:'Error de conexion',
  }
};

let lang = localStorage.getItem('vibe_lang') || 'en';
function t(key) { return T[lang][key] || T.en[key] || key; }
function setLang(l) {
  lang = l; localStorage.setItem('vibe_lang', l);
  document.getElementById('langToggle').textContent = l === 'en' ? 'ES' : 'EN';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  if (allPartidos.length) renderPartidos(getFilteredPartidos());
  updateUserUI(); updateChampionUI();
}
document.getElementById('langToggle').addEventListener('click', () => setLang(lang === 'en' ? 'es' : 'en'));

// user
function getUser() { try { return JSON.parse(localStorage.getItem('vibe_user')); } catch { return null; } }
function setUser(u) { localStorage.setItem('vibe_user', JSON.stringify(u)); updateUserUI(); }
function logout() { localStorage.removeItem('vibe_user'); updateUserUI(); updateChampionUI(); }
function updateUserUI() {
  const u = getUser(), nav = document.getElementById('navUser');
  if (u) nav.innerHTML = `<span class="user-alias">${u.alias}</span> <button class="btn btn-glass btn-sm" onclick="logout()">${t('btn_logout')}</button>`;
  else nav.innerHTML = `<button class="btn btn-glow btn-sm" onclick="openRegister()">${t('nav_register')}</button>`;
}

// api
async function apiGet(action, params = {}) {
  const url = new URL(API_URL); url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return (await fetch(url)).json();
}
async function apiPost(data) { return (await fetch(API_URL, { method: 'POST', body: JSON.stringify(data) })).json(); }

// countdown
function startCountdown() {
  const target = new Date('2026-06-11T00:00:00-06:00');
  function tick() {
    const diff = Math.max(0, target - new Date());
    document.getElementById('cdDays').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  tick(); setInterval(tick, 1000);
}

// modals
function openRegister() { document.getElementById('modalOverlay').classList.add('open'); }
function closeRegister() { document.getElementById('modalOverlay').classList.remove('open'); }
function openPredict(p) {
  if (!getUser()) { openRegister(); return; }
  document.getElementById('predPartidoId').value = p.partido_id;
  document.getElementById('predLocal').textContent = p.local;
  document.getElementById('predVisitante').textContent = p.visitante;
  document.getElementById('predictTitle').textContent = `${p.local} vs ${p.visitante}`;
  document.getElementById('predGolLocal').value = '';
  document.getElementById('predGolVisitante').value = '';
  document.getElementById('predictMsg').textContent = '';
  document.getElementById('predictOverlay').classList.add('open');
}
function closePredict() { document.getElementById('predictOverlay').classList.remove('open'); }

// register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.textContent = t('registering'); msg.className = 'form-msg';
  try {
    const res = await apiPost({ action:'register', alias:document.getElementById('regAlias').value.trim(), nombre:document.getElementById('regNombre').value.trim(), email:document.getElementById('regEmail').value.trim(), equipo:document.getElementById('regEquipo').value.trim() });
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    setUser({ id: res.id, alias: res.alias });
    msg.textContent = t('registered'); msg.className = 'form-msg success';
    setTimeout(closeRegister, 1000);
  } catch { msg.textContent = t('conn_err'); msg.className = 'form-msg error'; }
});

// predict
document.getElementById('predictForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const u = getUser(); if (!u) { openRegister(); return; }
  const msg = document.getElementById('predictMsg');
  msg.textContent = t('sending'); msg.className = 'form-msg';
  try {
    const res = await apiPost({ action:'predict', pid:u.id, partido_id:document.getElementById('predPartidoId').value, gol_local:Number(document.getElementById('predGolLocal').value), gol_visitante:Number(document.getElementById('predGolVisitante').value) });
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    msg.textContent = t('saved'); msg.className = 'form-msg success';
    setTimeout(closePredict, 1000);
  } catch { msg.textContent = t('conn_err'); msg.className = 'form-msg error'; }
});

// champion
function isLocked() { return new Date() >= LOCK_DATE; }
function populateTeams() {
  const sel = document.getElementById('championSelect');
  TEAMS.forEach(tm => { const o = document.createElement('option'); o.value = tm; o.textContent = tm; sel.appendChild(o); });
}
function updateChampionUI() {
  const locked = isLocked(), u = getUser();
  document.getElementById('championLocked').style.display = locked ? '' : 'none';
  document.getElementById('championSelect').disabled = locked || !u;
  document.getElementById('btnChampion').disabled = locked || !u;
  if (!u) { document.getElementById('championCurrent').textContent = ''; return; }
  loadChampion();
}
async function loadChampion() {
  const u = getUser(); if (!u) return;
  try {
    const res = await apiGet('getChampion', { pid: u.id });
    const cur = document.getElementById('championCurrent');
    if (res.equipo) { cur.innerHTML = `${t('your_pick')} <strong>${res.equipo}</strong>`; document.getElementById('championSelect').value = res.equipo; }
    else cur.textContent = t('no_pick');
  } catch {}
}
document.getElementById('btnChampion').addEventListener('click', async () => {
  const u = getUser(); if (!u) { openRegister(); return; }
  const team = document.getElementById('championSelect').value;
  if (!team) return;
  const msg = document.getElementById('championMsg');
  msg.textContent = t('sending'); msg.className = 'form-msg';
  try {
    const res = await apiPost({ action:'saveChampion', pid:u.id, equipo:team });
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    msg.textContent = t('saved'); msg.className = 'form-msg success';
    document.getElementById('championCurrent').innerHTML = `${t('your_pick')} <strong>${team}</strong>`;
    setTimeout(() => msg.textContent = '', 2000);
  } catch { msg.textContent = t('conn_err'); msg.className = 'form-msg error'; }
});

// partidos
let allPartidos = [];
let activeFilter = 'all';
function getFilteredPartidos() { return activeFilter === 'all' ? allPartidos : allPartidos.filter(p => p.status === activeFilter); }
async function loadPartidos() {
  try { allPartidos = await apiGet('getPartidos'); renderPartidos(allPartidos); }
  catch { document.getElementById('partidosGrid').innerHTML = '<div class="glass-card partido-card"><p class="placeholder-text">Error</p></div>'; }
}
function formatFecha(f) { if (!f) return ''; const d = new Date(f); return isNaN(d) ? f : d.toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', { month:'short', day:'numeric' }); }
function formatHora(h) { if (!h) return ''; const m = String(h).match(/T(\d{2}:\d{2})/); return m ? m[1] : h; }
function renderPartidos(partidos) {
  const grid = document.getElementById('partidosGrid');
  if (!partidos.length) { grid.innerHTML = `<div class="glass-card partido-card"><p class="placeholder-text">${t('loading')}</p></div>`; return; }
  grid.innerHTML = partidos.map(p => `
    <div class="glass-card partido-card" onclick='openPredict(${JSON.stringify(p)})'>
      <div class="partido-header"><span class="partido-fase">${p.fase} ${p.grupo||''}</span><span class="partido-status ${p.status}">${p.status}</span></div>
      <div class="partido-teams"><div class="partido-team">${p.local}</div>${p.status==='finalizado'?`<div class="partido-score">${p.gol_local} - ${p.gol_visitante}</div>`:'<div class="partido-vs">vs</div>'}<div class="partido-team">${p.visitante}</div></div>
      <div class="partido-date">${formatFecha(p.fecha)} - ${formatHora(p.hora)}</div>
    </div>`).join('');
}
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeFilter = btn.dataset.filter; renderPartidos(getFilteredPartidos());
  });
});

// leaderboard
async function loadLeaderboard() {
  try {
    const data = await apiGet('getLeaderboard'), body = document.getElementById('leaderboardBody');
    if (!data.length) { body.innerHTML = `<tr><td colspan="6" class="placeholder-text">--</td></tr>`; return; }
    body.innerHTML = data.map((p, i) => `<tr class="${i<3?'rank-'+(i+1):''}"><td class="rank-num">${i+1}</td><td>${p.alias}</td><td>${p.exactos}</td><td>${p.aciertos}</td><td>${p.campeon||''}</td><td class="pts-num">${p.puntos}</td></tr>`).join('');
  } catch { document.getElementById('leaderboardBody').innerHTML = '<tr><td colspan="6" class="placeholder-text">Error</td></tr>'; }
}

// modal close
document.getElementById('modalClose').addEventListener('click', closeRegister);
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeRegister(); });
document.getElementById('predictClose').addEventListener('click', closePredict);
document.getElementById('predictOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closePredict(); });
document.getElementById('btnRegister').addEventListener('click', () => { getUser() ? document.getElementById('partidos').scrollIntoView({behavior:'smooth'}) : openRegister(); });

// nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

// reveal
const reveals = document.querySelectorAll('.glass-card, .section-header, .hero-content');
const revealObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }}); }, { threshold: 0.15 });
reveals.forEach(el => { el.classList.add('reveal'); revealObs.observe(el); });

// particles
const pc = document.getElementById('particles');
for (let i = 0; i < 25; i++) { const d = document.createElement('div'); d.className='particle'; d.style.left=Math.random()*100+'%'; d.style.animationDuration=8+Math.random()*12+'s'; d.style.animationDelay=Math.random()*10+'s'; d.style.width=d.style.height=1+Math.random()*2+'px'; d.style.opacity=0.15+Math.random()*0.25; pc.appendChild(d); }

// glider + scroll spy
const sections = document.querySelectorAll('section[id]'), navLinks = document.querySelectorAll('.nav-link'), glider = document.getElementById('navGlider');
function moveGlider(link) { if (!link||!glider) return; const r=link.getBoundingClientRect(),pr=link.parentElement.getBoundingClientRect(); glider.style.left=(r.left-pr.left)+'px'; glider.style.width=r.width+'px'; glider.classList.add('visible'); }
window.addEventListener('scroll', () => {
  let cur=''; const atBot=(window.scrollY+window.innerHeight)>=(document.body.scrollHeight-50);
  if (atBot) cur=sections[sections.length-1].id; else sections.forEach(s=>{if(window.scrollY>=s.offsetTop-200)cur=s.id;});
  navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+cur));
  const a=document.querySelector('.nav-link.active'); if(a)moveGlider(a);else glider.classList.remove('visible');
});
navLinks.forEach(l=>{l.addEventListener('mouseenter',()=>moveGlider(l));l.addEventListener('mouseleave',()=>{const a=document.querySelector('.nav-link.active');if(a)moveGlider(a);else glider.classList.remove('visible');});});

// init
startCountdown(); populateTeams(); setLang(lang); updateUserUI(); updateChampionUI(); loadPartidos(); loadLeaderboard();
