// VIBE Quiniela Mundial 2026
const API_URL = 'https://script.google.com/macros/s/AKfycbz8n6l5VVuka3r8yJFXyNsO1i2sAKEBqolcteCx95O90y4FCpnqo66Zh4BKHRUhGCY8/exec';
const LOCK_DATE = new Date('2026-06-25T05:59:00Z'); // Jun 24 23:59 CST (Costa Rica)

function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

// 48 teams
const TEAMS = ['Algeria','Argentina','Australia','Austria','Belgium','Bosnia and Herzegovina','Brazil','Canada','Cape Verde','Colombia','Croatia','Curacao','Czech Republic','DR Congo','Ecuador','Egypt','England','France','Germany','Ghana','Haiti','Iran','Iraq','Ivory Coast','Japan','Jordan','Mexico','Morocco','Netherlands','New Zealand','Norway','Panama','Paraguay','Portugal','Qatar','Saudi Arabia','Scotland','Senegal','South Africa','South Korea','Spain','Sweden','Switzerland','Tunisia','Turkiye','Uruguay','USA','Uzbekistan'];

// i18n
const T = {
  en: {
    nav_home:'Home', nav_champion:'Champion', nav_matches:'Matches', nav_rules:'Rules', nav_register:'Register', nav_login:'Login',
    hero_title:'World Cup Predictions 2026', hero_sub:'Predict the results of the FIFA World Cup USA/Mexico/Canada. Compete with all of TSE. Win prizes.',
    days:'Days', hours:'Hours', hero_join:'Join the Pool', hero_rules:'View Rules',
    champ_badge:'Bonus', champ_title:'Pick Your Champion', champ_desc:'Choose who you think will win the World Cup. Worth 10 bonus points. Locks on June 24.',
    champ_save:'Save Pick', champ_locked:'Predictions are locked. The tournament has started.',
    match_badge:'Matches', match_title:'Group Stage', filter_all:'All', filter_pending:'Pending', filter_done:'Finished', loading:'Loading...',
    lb_title:'Standings', lb_player:'Player', lb_exact:'Exact', lb_correct:'Correct', lb_champ:'Champ', lb_pts:'Points',
    rules_badge:'Rules', rules_title:'Point System', r_exact:'Exact Result', r_exact_d:'Predict the exact score. E.g. you predict 2-1 and the result is 2-1.',
    r_winner:'Correct Winner', r_winner_d:'Predict who wins or a draw, without getting the exact score.',
    r_champ:'Champion Bonus', r_champ_d:'Correctly predict the World Cup winner. Must be locked before June 24.',
    r_general:'General Rules',
    r1:'Predictions close 1 hour before each match.', r2:'Only one prediction per match.', r3:'You can modify your prediction before the deadline.',
    r4:'Tiebreaker: most exact results wins.', r5:'Prizes will be announced at the start of the tournament.', r6:'Champion pick locks on June 24, 2026. No changes after that.',
    reg_title:'Register', reg_alias:'Alias (Amazon)', reg_name:'Full Name', reg_email:'Email (Amazon)', reg_team:'Favorite Team (optional)', reg_submit:'Register',
    reg_password:'Password', reg_password_confirm:'Confirm Password', password_mismatch:'Passwords do not match', password_short:'Password must be at least 4 characters',
    login_title:'Login', login_alias:'Alias', login_password:'Password', login_submit:'Login', login_switch:'Don\'t have an account? Register',
    reg_switch:'Already have an account? Login',
    set_pw_title:'Set Your Password', set_pw_desc:'Your password was reset. Please create a new one.', set_pw_submit:'Set Password',
    pred_submit:'Submit Prediction',
    btn_logout:'Logout', btn_change_pw:'Change Password', your_pick:'Your pick:', no_pick:'No pick yet', saved:'Saved!', sending:'Sending...', registering:'Registering...', registered:'Registered!', conn_err:'Connection error', logging_in:'Logging in...', logged_in:'Welcome back!', your_pred:'Your prediction',
    chg_pw_title:'Change Password', chg_pw_current:'Current Password', chg_pw_new:'New Password', chg_pw_confirm:'Confirm New Password', chg_pw_submit:'Change', pw_changed:'Password changed!',
    prizes_title:'Prizes', prize_1st:'1st Place', prize_2nd:'2nd Place', prize_3rd:'3rd Place', prize_raffle:'Raffle', prize_raffle_desc:'all participants',
  },
  es: {
    nav_home:'Inicio', nav_champion:'Campeon', nav_matches:'Partidos', nav_rules:'Reglas', nav_register:'Registrarse', nav_login:'Ingresar',
    hero_title:'Quiniela Mundial 2026', hero_sub:'Predice los resultados del Mundial USA/Mexico/Canada. Compite con todo TSE. Gana premios.',
    days:'Dias', hours:'Horas', hero_join:'Unirme a la Quiniela', hero_rules:'Ver Reglas',
    champ_badge:'Bonus', champ_title:'Elige al Campeon', champ_desc:'Elige quien crees que ganara el Mundial. Vale 10 puntos bonus. Se bloquea el 24 de Junio.',
    champ_save:'Guardar', champ_locked:'Las predicciones estan bloqueadas. El torneo ya inicio.',
    match_badge:'Partidos', match_title:'Fase de Grupos', filter_all:'Todos', filter_pending:'Pendientes', filter_done:'Finalizados', loading:'Cargando...',
    lb_title:'Tabla de Posiciones', lb_player:'Jugador', lb_exact:'Exactos', lb_correct:'Aciertos', lb_champ:'Campeon', lb_pts:'Puntos',
    rules_badge:'Reglas', rules_title:'Sistema de Puntos', r_exact:'Resultado Exacto', r_exact_d:'Acertar el marcador exacto. Ej: predecir 2-1 y el resultado es 2-1.',
    r_winner:'Acertar Ganador', r_winner_d:'Acertar quien gana o si es empate, sin acertar el marcador exacto.',
    r_champ:'Bonus Campeon', r_champ_d:'Acertar el campeon del Mundial. Debe estar bloqueado antes del 24 de junio.',
    r_general:'Reglas Generales',
    r1:'Las predicciones se cierran 1 hora antes de cada partido.', r2:'Solo una prediccion por partido.', r3:'Se puede modificar la prediccion antes del cierre.',
    r4:'Desempate: gana quien tenga mas resultados exactos.', r5:'Los premios se anuncian al inicio del torneo.', r6:'La prediccion de campeon se bloquea el 24 de junio, 2026.',
    reg_title:'Registro', reg_alias:'Alias (de Amazon)', reg_name:'Nombre Completo', reg_email:'Email (de Amazon)', reg_team:'Equipo favorito (opcional)', reg_submit:'Registrarme',
    reg_password:'Contrasena', reg_password_confirm:'Confirmar Contrasena', password_mismatch:'Las contrasenas no coinciden', password_short:'La contrasena debe tener al menos 4 caracteres',
    login_title:'Ingresar', login_alias:'Alias', login_password:'Contrasena', login_submit:'Ingresar', login_switch:'No tienes cuenta? Registrate',
    reg_switch:'Ya tienes cuenta? Ingresar',
    set_pw_title:'Crear Contrasena', set_pw_desc:'Tu contrasena fue reiniciada. Crea una nueva.', set_pw_submit:'Guardar Contrasena',
    pred_submit:'Enviar Prediccion',
    btn_logout:'Salir', btn_change_pw:'Cambiar Contrasena', your_pick:'Tu eleccion:', no_pick:'Sin eleccion aun', saved:'Guardado!', sending:'Enviando...', registering:'Registrando...', registered:'Registrado!', conn_err:'Error de conexion', logging_in:'Ingresando...', logged_in:'Bienvenido!', your_pred:'Tu prediccion',
    chg_pw_title:'Cambiar Contrasena', chg_pw_current:'Contrasena Actual', chg_pw_new:'Nueva Contrasena', chg_pw_confirm:'Confirmar Nueva', chg_pw_submit:'Cambiar', pw_changed:'Contrasena cambiada!',
    prizes_title:'Premios', prize_1st:'1er Lugar', prize_2nd:'2do Lugar', prize_3rd:'3er Lugar', prize_raffle:'Rifa', prize_raffle_desc:'todos los participantes',
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

// hash password (sha-256)
async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// user
function getUser() { try { return JSON.parse(localStorage.getItem('vibe_user')); } catch { return null; } }
function setUser(u) { localStorage.setItem('vibe_user', JSON.stringify(u)); updateUserUI(); }
function logout() { localStorage.removeItem('vibe_user'); updateUserUI(); updateChampionUI(); }
function updateUserUI() {
  const u = getUser(), nav = document.getElementById('navUser'), mu = document.getElementById('mobileUser');
  if (u) {
    nav.innerHTML = `<span class="user-alias">${u.alias}</span> <button class="btn btn-glass btn-sm" onclick="openChangePassword()">${t('btn_change_pw')}</button> <button class="btn btn-glass btn-sm" onclick="logout()">${t('btn_logout')}</button>`;
    mu.innerHTML = `<div class="mu-alias">Logged in as ${u.alias}</div><div class="mu-actions"><button onclick="openChangePassword()">${t('btn_change_pw')}</button><button onclick="logout()">${t('btn_logout')}</button></div>`;
  } else {
    nav.innerHTML = `<button class="btn btn-glass btn-sm" onclick="openLogin()">${t('nav_login')}</button> <button class="btn btn-glow btn-sm" onclick="openRegister()">${t('nav_register')}</button>`;
    mu.innerHTML = `<div class="mu-actions"><button onclick="openLogin()">${t('nav_login')}</button><button onclick="openRegister()">${t('nav_register')}</button></div>`;
  }
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
  const cdEl = document.getElementById('countdown');
  function tick() {
    const diff = Math.max(0, target - new Date());
    if (diff === 0) {
      cdEl.innerHTML = '<div class="countdown-started">The World Cup has started!</div>';
      return;
    }
    document.getElementById('cdDays').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  tick(); setInterval(tick, 1000);
}

// champion deadline countdown
function startChampionCountdown() {
  const el = document.getElementById('champCountdown');
  if (!el) return;
  function tick() {
    const diff = Math.max(0, LOCK_DATE - new Date());
    if (diff === 0) { el.innerHTML = ''; return; } // locked message handled by championLocked el
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = '<span class="champ-cd-label">Extended Deadline:</span> <span class="champ-cd-time">' +
      (d > 0 ? d + 'd ' : '') + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0') + '</span>';
  }
  tick(); setInterval(tick, 1000);
}

// modals
function openRegister() { document.getElementById('registerOverlay').classList.add('open'); }
function closeRegister() { document.getElementById('registerOverlay').classList.remove('open'); }
function openLogin() { document.getElementById('loginOverlay').classList.add('open'); }
function closeLogin() { document.getElementById('loginOverlay').classList.remove('open'); }
function openSetPassword() { document.getElementById('setPasswordOverlay').classList.add('open'); }
function closeSetPassword() { document.getElementById('setPasswordOverlay').classList.remove('open'); }
function openChangePassword() { document.getElementById('changePasswordOverlay').classList.add('open'); }
function closeChangePassword() { document.getElementById('changePasswordOverlay').classList.remove('open'); }
function openPredict(p) {
  if (!getUser()) { openLogin(); return; }
  document.getElementById('predPartidoId').value = p.partido_id;
  document.getElementById('predLocal').textContent = p.local;
  document.getElementById('predVisitante').textContent = p.visitante;
  document.getElementById('predictTitle').textContent = `${p.local} vs ${p.visitante}`;
  const existing = userPredictions[p.partido_id];
  document.getElementById('predGolLocal').value = existing ? existing.gol_local : '';
  document.getElementById('predGolVisitante').value = existing ? existing.gol_visitante : '';
  document.getElementById('predictMsg').textContent = '';
  document.getElementById('predictOverlay').classList.add('open');
}
function closePredict() { document.getElementById('predictOverlay').classList.remove('open'); }

// register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('regMsg');
  const pw = document.getElementById('regPassword').value;
  const pwConfirm = document.getElementById('regPasswordConfirm').value;
  if (pw.length < 4) { msg.textContent = t('password_short'); msg.className = 'form-msg error'; return; }
  if (pw !== pwConfirm) { msg.textContent = t('password_mismatch'); msg.className = 'form-msg error'; return; }
  msg.textContent = t('registering'); msg.className = 'form-msg';
  try {
    const hash = await hashPassword(pw);
    const res = await apiPost({ action:'register', alias:document.getElementById('regAlias').value.trim(), nombre:document.getElementById('regNombre').value.trim(), email:document.getElementById('regEmail').value.trim(), equipo:'', password_hash:hash });
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    setUser({ id: res.id, alias: res.alias, nombre: res.nombre });
    msg.textContent = t('registered'); msg.className = 'form-msg success';
    setTimeout(closeRegister, 1000);
  } catch { msg.textContent = t('conn_err'); msg.className = 'form-msg error'; }
});

// login
let _pendingLoginAlias = '';
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('loginMsg');
  const alias = document.getElementById('loginAlias').value.trim();
  const pw = document.getElementById('loginPassword').value;
  if (!alias || !pw) return;
  msg.textContent = t('logging_in'); msg.className = 'form-msg';
  try {
    const hash = await hashPassword(pw);
    const res = await apiPost({ action:'login', alias, password_hash:hash });
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    if (res.needsPassword) {
      _pendingLoginAlias = alias;
      closeLogin();
      openSetPassword();
      return;
    }
    setUser({ id: res.id, alias: res.alias, nombre: res.nombre });
    msg.textContent = t('logged_in'); msg.className = 'form-msg success';
    updateChampionUI();
    setTimeout(closeLogin, 1000);
  } catch { msg.textContent = t('conn_err'); msg.className = 'form-msg error'; }
});

// set password (after admin reset)
document.getElementById('setPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('setPwMsg');
  const pw = document.getElementById('setPwPassword').value;
  const pwConfirm = document.getElementById('setPwPasswordConfirm').value;
  if (pw.length < 4) { msg.textContent = t('password_short'); msg.className = 'form-msg error'; return; }
  if (pw !== pwConfirm) { msg.textContent = t('password_mismatch'); msg.className = 'form-msg error'; return; }
  msg.textContent = t('sending'); msg.className = 'form-msg';
  try {
    const hash = await hashPassword(pw);
    const res = await apiPost({ action:'setPassword', alias:_pendingLoginAlias, password_hash:hash });
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    setUser({ id: res.id, alias: res.alias, nombre: res.nombre });
    msg.textContent = t('saved'); msg.className = 'form-msg success';
    updateChampionUI();
    setTimeout(closeSetPassword, 1000);
  } catch { msg.textContent = t('conn_err'); msg.className = 'form-msg error'; }
});

// change password
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('chgPwMsg');
  const u = getUser(); if (!u) return;
  const oldPw = document.getElementById('chgPwCurrent').value;
  const newPw = document.getElementById('chgPwNew').value;
  const newPwConfirm = document.getElementById('chgPwConfirm').value;
  if (newPw.length < 4) { msg.textContent = t('password_short'); msg.className = 'form-msg error'; return; }
  if (newPw !== newPwConfirm) { msg.textContent = t('password_mismatch'); msg.className = 'form-msg error'; return; }
  msg.textContent = t('sending'); msg.className = 'form-msg';
  try {
    const oldHash = await hashPassword(oldPw);
    const newHash = await hashPassword(newPw);
    const res = await apiPost({ action:'changePassword', pid:u.id, old_hash:oldHash, new_hash:newHash });
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    msg.textContent = t('pw_changed'); msg.className = 'form-msg success';
    setTimeout(closeChangePassword, 1500);
  } catch { msg.textContent = t('conn_err'); msg.className = 'form-msg error'; }
});

// predict
// predict form ~ handled by knockout submit listener below
// champion
function isLocked() { return new Date() >= LOCK_DATE; }
function populateTeams() {
  const sel = document.getElementById('championSelect');
  TEAMS.forEach(tm => { const o = document.createElement('option'); o.value = tm; o.textContent = tm; sel.appendChild(o); });
}
function updateChampionUI() {
  const locked = isLocked(), u = getUser();
  document.getElementById('championLocked').style.display = locked ? '' : 'none';
  document.getElementById('championInner').style.display = locked ? 'none' : '';
  document.getElementById('champCountdown').style.display = locked ? 'none' : '';
  if (!u) { document.getElementById('championCurrent').textContent = ''; return; }
  loadChampion();
}
async function loadChampion() {
  const u = getUser(); if (!u) return;
  try {
    const res = await apiGet('getChampion', { pid: u.id });
    const cur = document.getElementById('championCurrent');
    if (res.equipo) {
      cur.innerHTML = isLocked()
        ? `<span class="champ-pick-locked">&#127942; You picked: <strong>${res.equipo}</strong></span>`
        : `${t('your_pick')} <strong>${res.equipo}</strong>`;
      document.getElementById('championSelect').value = res.equipo;
    } else {
      cur.textContent = isLocked() ? '' : t('no_pick');
    }
  } catch {}
}
document.getElementById('btnChampion').addEventListener('click', async () => {
  const u = getUser(); if (!u) { openLogin(); return; }
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
let activeSort = 'date';
let userPredictions = {}; // { partido_id: { gol_local, gol_visitante } }

async function loadUserPredictions() {
  const u = getUser(); if (!u) { userPredictions = {}; return; }
  try {
    const preds = await apiGet('getPredicciones', { pid: u.id });
    userPredictions = {};
    preds.forEach(p => { userPredictions[p.partido_id] = { gol_local: p.gol_local, gol_visitante: p.gol_visitante }; });
  } catch { userPredictions = {}; }
}

function getFilteredPartidos() {
  let list = activeFilter === 'all' ? [...allPartidos] : allPartidos.filter(p => p.status === activeFilter);
  if (activeSort === 'group') list.sort((a, b) => a.grupo.localeCompare(b.grupo) || a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));
  return list;
}
async function loadPartidos() {
  const el = document.getElementById('partidosGrid');
  if (!el) return;
  try {
    const all = await apiGet('getPartidos');
    const koFases = ['Round of 32','Round of 16','Quarter-Finals','Semi-Finals','Final'];
    allPartidos = all.filter(p => koFases.indexOf(p.fase) === -1);
    await loadUserPredictions();
    renderPartidos(getFilteredPartidos());
  } catch { el.innerHTML = '<div class="glass-card partido-card"><p class="placeholder-text">Error</p></div>'; }
}
function formatFecha(f) { if (!f) return ''; const parts = f.match(/(\d{4})-(\d{2})-(\d{2})/); if (!parts) return f; const d = new Date(+parts[1], +parts[2]-1, +parts[3]); return d.toLocaleDateString(lang === 'es' ? 'es-CR' : 'en-US', { month:'short', day:'numeric' }); }
function formatHora(h) { if (!h) return ''; const m = String(h).match(/(\d{2}:\d{2})/); return m ? m[1] + ' CST' : h; }
function getMatchDeadline(p) {
  // deadline = match time - 1 hour (CST, same as stored hours)
  var parts = p.fecha.match(/(\d{4})-(\d{2})-(\d{2})/);
  var hParts = (p.hora || '').match(/(\d{2}):(\d{2})/);
  if (!parts || !hParts) return null;
  return new Date(+parts[1], +parts[2]-1, +parts[3], +hParts[1]-1, +hParts[2]);
}

function getBettingStatus(p) {
  if (p.status === 'finalizado') return { state: 'finished' };
  var deadline = getMatchDeadline(p);
  if (!deadline) return { state: 'open' };
  var now = new Date();
  var diff = deadline - now;
  if (diff <= 0) return { state: 'closed' };
  if (diff <= 12 * 3600000) {
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    return { state: 'closing', label: h > 0 ? h + 'h ' + m + 'm' : m + 'm' };
  }
  return { state: 'open' };
}

function calcPoints(pred, p) {
  if (!pred || p.status !== 'finalizado' || p.gol_local === '' || p.gol_visitante === '') return null;
  var rL = Number(p.gol_local), rV = Number(p.gol_visitante);
  var pL = Number(pred.gol_local), pV = Number(pred.gol_visitante);
  if (pL === rL && pV === rV) return { pts: 5, label: '+5 Exact!' };
  var realW = rL > rV ? 'L' : rL < rV ? 'V' : 'E';
  var predW = pL > pV ? 'L' : pL < pV ? 'V' : 'E';
  if (predW === realW) return { pts: 2, label: '+2 Correct winner' };
  return { pts: 0, label: 'No points' };
}

function renderPartidos(partidos) {
  const grid = document.getElementById('partidosGrid');
  if (!partidos.length) { grid.innerHTML = `<div class="glass-card partido-card"><p class="placeholder-text">${t('loading')}</p></div>`; return; }
  grid.innerHTML = partidos.map(p => {
    const pred = userPredictions[p.partido_id];
    const bet = getBettingStatus(p);
    const pts = calcPoints(pred, p);
    const isClosed = bet.state === 'closed' || bet.state === 'finished';

    // status badge
    var statusBadge = '';
    if (p.status === 'finalizado') statusBadge = '<span class="partido-status finalizado">Final</span>';
    else statusBadge = '<span class="partido-status pendiente">Score Pending</span>';

    // prediction + points line
    var predLine = '';
    if (pred) {
      predLine = `<div class="partido-prediction">${t('your_pred')}: ${pred.gol_local} - ${pred.gol_visitante}`;
      if (pts) predLine += ` <span class="pts-badge pts-badge--${pts.pts}">${pts.label}</span>`;
      predLine += '</div>';
    }

    // betting status line
    var betLine = '';
    if (bet.state === 'open') betLine = '<div class="partido-bet partido-bet--open">Open</div>';
    else if (bet.state === 'closing') betLine = `<div class="partido-bet partido-bet--closing">Closes in ${bet.label}</div>`;
    else if (bet.state === 'closed') betLine = '<div class="partido-bet partido-bet--closed">Betting Closed</div>';

    var cardClass = 'glass-card partido-card' + (isClosed ? ' partido-card--locked' : '');
    var onclick = isClosed ? '' : `onclick='openPredict(${JSON.stringify(p)})'`;

    return `
    <div class="${cardClass}" ${onclick}>
      <div class="partido-header"><span class="partido-fase">${p.fase} ${p.grupo||''}</span>${statusBadge}</div>
      <div class="partido-teams"><div class="partido-team">${p.local}</div>${p.status==='finalizado'?`<div class="partido-score">${p.gol_local} - ${p.gol_visitante}</div>`:'<div class="partido-vs">vs</div>'}<div class="partido-team">${p.visitante}</div></div>
      <div class="partido-date">${formatFecha(p.fecha)} - ${formatHora(p.hora)}</div>
      ${betLine}
      ${predLine}
    </div>`;
  }).join('');
}
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeFilter = btn.dataset.filter; renderPartidos(getFilteredPartidos());
  });
});
document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); activeSort = btn.dataset.sort; renderPartidos(getFilteredPartidos());
  });
});

// leaderboard
async function loadLeaderboard() {
  try {
    const data = await apiGet('getLeaderboard'), body = document.getElementById('leaderboardBody');
    if (!data.length) { body.innerHTML = `<tr><td colspan="6" class="placeholder-text">--</td></tr>`; return; }
    const u = getUser();
    body.innerHTML = data.map((p, i) => {
      const isMe = u && p.alias.toLowerCase() === u.alias.toLowerCase();
      const cls = (i<3?'rank-'+(i+1):'') + (isMe?' current-user':'');
      const crown = i === 0 ? '<span class="rank-crown">&#128081;</span>' : '';
      const rankCell = (i+1) + crown;
      const name = isMe ? `<span class="user-alias">${p.alias}</span><span class="you-badge">You</span>` : p.alias;
      return `<tr class="${cls}"><td class="rank-num">${rankCell}</td><td>${name}</td><td>${p.exactos}</td><td>${p.aciertos}</td><td>${p.campeon||''}</td><td class="pts-num">${p.puntos}</td></tr>`;
    }).join('');
  } catch { document.getElementById('leaderboardBody').innerHTML = '<tr><td colspan="6" class="placeholder-text">Error</td></tr>'; }
}

// modal close handlers
document.getElementById('registerClose').addEventListener('click', closeRegister);
document.getElementById('registerOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeRegister(); });
document.getElementById('loginClose').addEventListener('click', closeLogin);
document.getElementById('loginOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeLogin(); });
document.getElementById('setPwClose').addEventListener('click', closeSetPassword);
document.getElementById('setPasswordOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeSetPassword(); });
document.getElementById('chgPwClose').addEventListener('click', closeChangePassword);
document.getElementById('changePasswordOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeChangePassword(); });
document.getElementById('predictClose').addEventListener('click', closePredict);
document.getElementById('predictOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closePredict(); });
document.getElementById('btnRegister').addEventListener('click', () => { getUser() ? document.getElementById('partidos').scrollIntoView({behavior:'smooth'}) : openRegister(); });

// switch between login/register
document.getElementById('switchToLogin').addEventListener('click', (e) => { e.preventDefault(); closeRegister(); openLogin(); });
document.getElementById('switchToRegister').addEventListener('click', (e) => { e.preventDefault(); closeLogin(); openRegister(); });

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

// back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 500));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// refresh betting status every 60s
setInterval(() => { if (allPartidos.length) renderPartidos(getFilteredPartidos()); }, 60000);

// init
startCountdown(); startChampionCountdown(); populateTeams(); setLang(lang); updateUserUI(); updateChampionUI(); loadPartidos(); loadLeaderboard(); loadKnockout();

// ⁘[ KNOCKOUT BRACKET ]⁘
// lee getPartidos y filtra por fase para construir el bracket dinamicamente
// el array ROUND_ORDER mapea fase → columna del bracket (left o right del trophy)
var KO_ROUND_ORDER = [
  { key: 'r32l', label: 'Round of 32', fase: 'Round of 32', side: 'left', slots: 8 },
  { key: 'r16l', label: 'Round of 16', fase: 'Round of 16', side: 'left', slots: 4 },
  { key: 'qfl',  label: 'Quarter-Finals', fase: 'Quarter-Finals', side: 'left', slots: 2 },
  { key: 'semil', label: 'Semi-Finals', fase: 'Semi-Finals', side: 'left', slots: 1 },
  { key: 'final', label: 'Final', fase: 'Final', side: 'center', slots: 1 },
  { key: 'semir', label: 'Semi-Finals', fase: 'Semi-Finals', side: 'right', slots: 1 },
  { key: 'qfr',  label: 'Quarter-Finals', fase: 'Quarter-Finals', side: 'right', slots: 2 },
  { key: 'r16r', label: 'Round of 16', fase: 'Round of 16', side: 'right', slots: 4 },
  { key: 'r32r', label: 'Round of 32', fase: 'Round of 32', side: 'right', slots: 8 }
];
var koPredictions = {};

async function loadKnockout() {
  var u = getUser();
  var partidos = [];

  // cargar predicciones del usuario
  if (u) {
    try {
      var preds = await apiGet('getPredicciones', { pid: u.id });
      koPredictions = {};
      preds.forEach(function(p) { koPredictions[p.partido_id] = { gol_local: Number(p.gol_local), gol_visitante: Number(p.gol_visitante) }; });
    } catch(e) {}
  }

  // cargar partidos del sheet
  try {
    var all = await apiGet('getPartidos');
    var koFases = ['Round of 32','Round of 16','Quarter-Finals','Semi-Finals','Final'];
    partidos = all.filter(function(p) { return koFases.indexOf(p.fase) !== -1; });
  } catch(e) {}

  // siempre re-renderizar con los datos que tengamos ([] muestra TBD, con datos muestra equipos)
  renderKnockout(partidos);
}

function renderKnockout(partidos) {
  var grid = document.getElementById('bracketGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // index partidos by fase + side for lookup
  // side stored as 'left_side' column: 'yes'=left, 'no'=right, 'center'=final
  function sideOf(p) {
    if (p.left_side === 'center' || p.fase === 'Final') return 'center';
    return p.left_side === 'yes' ? 'left' : 'right';
  }

  KO_ROUND_ORDER.forEach(function(round) {
    var col = document.createElement('div');
    col.className = 'ko-round' + (round.side === 'center' ? ' ko-final-col' : '');

    var header = document.createElement('div');
    header.className = 'ko-round-header';
    header.textContent = round.label;
    col.appendChild(header);

    if (round.side === 'center') {
      // trophy + label, no match cards
      var trophy = document.createElement('img');
      trophy.src = 'trophy.png'; trophy.alt = 'Trophy'; trophy.className = 'ko-trophy-inner';
      col.appendChild(trophy);
      var lbl = document.createElement('div');
      lbl.className = 'ko-final-label'; lbl.textContent = 'WORLD CHAMPIONS';
      col.appendChild(lbl);
      grid.appendChild(col);
      return;
    }

    var matchContainer = document.createElement('div');
    matchContainer.className = 'ko-round-matches';

    // get matches for this round + side, always show at least the expected slot count
    var roundMatches = partidos.filter(function(p) {
      return p.fase === round.fase && sideOf(p) === round.side;
    });
    var count = Math.max(roundMatches.length, round.slots);
    for (var i = 0; i < count; i++) {
      var p = roundMatches[i] || null;
      var card = buildKoCard(p);
      matchContainer.appendChild(card);
    }

    col.appendChild(matchContainer);
    grid.appendChild(col);
  });
}

function buildKoCard(p) {
  var hasTeams = p && p.local && p.visitante;
  var isFinished = p && p.status === 'finalizado';
  var pred = p && koPredictions[p.partido_id];
  var pts = null;

  // calcular puntos
  if (isFinished && pred && p.gol_local !== '' && p.gol_visitante !== '') {
    var rL = Number(p.gol_local), rV = Number(p.gol_visitante);
    var pL = Number(pred.gol_local), pV = Number(pred.gol_visitante);
    if (pL === rL && pV === rV) pts = { n: 5, label: '+5 Exact!' };
    else {
      var realW = rL > rV ? 'L' : rL < rV ? 'V' : 'E';
      var predW = pL > pV ? 'L' : pL < pV ? 'V' : 'E';
      pts = predW === realW ? { n: 2, label: '+2 Winner' } : { n: 0, label: 'No points' };
    }
  }

  // deadline / betting status
  var bettingState = 'locked', closingLabel = '';
  if (hasTeams && !isFinished) {
    var deadline = getMatchDeadline(p);
    if (!deadline) { bettingState = 'open'; }
    else {
      var diff = deadline - new Date();
      if (diff <= 0) bettingState = 'closed';
      else if (diff <= 12 * 3600000) {
        bettingState = 'closing';
        var ch = Math.floor(diff / 3600000), cm = Math.floor((diff % 3600000) / 60000);
        closingLabel = ch > 0 ? ch + 'h ' + cm + 'm' : cm + 'm';
      } else { bettingState = 'open'; }
    }
  }

  var isClickable = bettingState === 'open' || bettingState === 'closing';
  var isClosed = isFinished || bettingState === 'closed' || bettingState === 'locked';

  var card = document.createElement('div');
  card.className = 'glass-card partido-card' + (isClosed ? ' partido-card--locked' : '');

  // header: fase + status badge
  var statusBadge = '';
  if (isFinished) statusBadge = '<span class="partido-status finalizado">Final</span>';
  else if (hasTeams) statusBadge = '<span class="partido-status pendiente">Score Pending</span>';

  // teams row
  var fase = p ? esc(p.fase || '') : 'Round of 32';
  var teamA = hasTeams ? esc(p.local) : 'TBD';
  var teamB = hasTeams ? esc(p.visitante) : 'TBD';
  var teamsRow = '<div class="partido-teams">' +
    '<div class="partido-team">' + teamA + '</div>' +
    (isFinished ? '<div class="partido-score">' + p.gol_local + ' - ' + p.gol_visitante + '</div>' : '<div class="partido-vs">vs</div>') +
    '<div class="partido-team">' + teamB + '</div>' +
    '</div>';

  // date row
  var dateStr = p ? formatFecha(p.fecha) + ' - ' + formatHora(p.hora) : '';

  // betting status line
  var betLine = '';
  if (bettingState === 'open') betLine = '<div class="partido-bet partido-bet--open">Open</div>';
  else if (bettingState === 'closing') betLine = '<div class="partido-bet partido-bet--closing">Closes in ' + closingLabel + '</div>';
  else if (bettingState === 'closed') betLine = '<div class="partido-bet partido-bet--closed">Betting Closed</div>';

  // prediction line
  var predLine = '';
  if (pred) {
    predLine = '<div class="partido-prediction">Your prediction: ' + pred.gol_local + ' - ' + pred.gol_visitante;
    if (pts) predLine += ' <span class="pts-badge pts-badge--' + pts.n + '">' + pts.label + '</span>';
    predLine += '</div>';
  }

  card.innerHTML =
    '<div class="partido-header"><span class="partido-fase">' + fase + '</span>' + statusBadge + '</div>' +
    teamsRow +
    (dateStr ? '<div class="partido-date">' + dateStr + '</div>' : '') +
    betLine +
    predLine;

  if (isClickable) card.addEventListener('click', function() { openKoPredict(p); });
  return card;
}

function openKoPredict(p) {
  if (!getUser()) { openLogin(); return; }
  document.getElementById('predPartidoId').value = p.partido_id;
  document.getElementById('predLocal').textContent = p.local;
  document.getElementById('predVisitante').textContent = p.visitante;
  document.getElementById('predictTitle').textContent = p.local + ' vs ' + p.visitante;
  var existing = koPredictions[p.partido_id];
  document.getElementById('predGolLocal').value = existing ? existing.gol_local : '';
  document.getElementById('predGolVisitante').value = existing ? existing.gol_visitante : '';
  document.getElementById('predictMsg').textContent = '';
  document.getElementById('predictOverlay').classList.add('open');
}

// hook the predict form for both group stage (if any) and knockout
document.getElementById('predictForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const u = getUser(); if (!u) { openLogin(); return; }
  const msg = document.getElementById('predictMsg');
  const partidoId = document.getElementById('predPartidoId').value;
  const golL = Number(document.getElementById('predGolLocal').value);
  const golV = Number(document.getElementById('predGolVisitante').value);
  msg.textContent = t('sending'); msg.className = 'form-msg';
  try {
    const res = await apiPost({ action:'predict', pid:u.id, partido_id:partidoId, gol_local:golL, gol_visitante:golV });
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    koPredictions[partidoId] = { gol_local: golL, gol_visitante: golV };
    msg.textContent = t('saved'); msg.className = 'form-msg success';
    setTimeout(() => { closePredict(); loadKnockout(); }, 800);
  } catch { msg.textContent = t('conn_err'); msg.className = 'form-msg error'; }
});

// ⁘[ BRACKET DRAG TO PAN ]⁘
// solo horizontal ~ el usuario arrastra izquierda/derecha en el bracket
// arriba/abajo siempre scrollea la pagina (para llegar al leaderboard)
(function() {
  var el = document.querySelector('.bracket-scroll');
  if (!el) return;
  var startX, scrollLeft, active;
  var THRESHOLD = 8;

  // mouse drag (horizontal only)
  el.addEventListener('mousedown', function(e) {
    startX = e.clientX; scrollLeft = el.scrollLeft;
    active = false; el.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', function(e) {
    if (startX == null) return;
    var dx = e.clientX - startX;
    if (!active && Math.abs(dx) < THRESHOLD) return;
    active = true;
    el.scrollLeft = scrollLeft - dx;
    e.preventDefault();
  });
  window.addEventListener('mouseup', function() { startX = null; active = false; el.style.cursor = 'grab'; });

  // touch drag (horizontal only, vertical falls through to page)
  el.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX; scrollLeft = el.scrollLeft;
    active = false;
  }, { passive: true });

  el.addEventListener('touchmove', function(e) {
    if (startX == null) return;
    var dx = e.touches[0].clientX - startX;
    var dy = e.touches[0].clientY - (e.touches[0].clientY); // not used
    if (!active && Math.abs(dx) < THRESHOLD) return;
    // solo activar pan horizontal si el movimiento es mas horizontal que vertical
    var touchDy = e.touches[0].clientY - (el._touchStartY || e.touches[0].clientY);
    if (Math.abs(touchDy) > Math.abs(dx) * 1.5) return; // gesto vertical → pagina
    active = true;
    e.preventDefault();
    el.scrollLeft = scrollLeft - dx;
  }, { passive: false });

  el.addEventListener('touchstart', function(e) {
    el._touchStartY = e.touches[0].clientY;
  }, { passive: true });

  el.addEventListener('touchend', function() { active = false; el._touchStartY = null; });

  // centrar la vista inicial en el trophy (centro del bracket)
  function centerBracket() {
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }
  // esperar a que el bracket este renderizado
  if (el.scrollWidth > el.clientWidth) centerBracket();
  else setTimeout(centerBracket, 500);
})();
(function() {
  var bracketView = document.getElementById('knockoutBracketView');
  var groupView = document.getElementById('groupStageView');
  var btnToGroup = document.getElementById('btnToggleGroupStage');
  var btnToBracket = document.getElementById('btnBackToBracket');
  if (!bracketView || !groupView) return;
  var loaded = false;
  function showGroup() { bracketView.style.display = 'none'; groupView.style.display = ''; if (!loaded) { loaded = true; loadPartidos(); } }
  function showBracket() { groupView.style.display = 'none'; bracketView.style.display = ''; }
  if (btnToGroup) btnToGroup.addEventListener('click', showGroup);
  if (btnToBracket) btnToBracket.addEventListener('click', showBracket);
})();
(function() {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', function() {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('.mobile-link').forEach(function(link) {
    link.addEventListener('click', function() {
      burger.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();

// hide nav on scroll down, show on scroll up (mobile only)
(function() {
  var lastY = 0;
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  window.addEventListener('scroll', function() {
    if (window.innerWidth > 900) { nav.classList.remove('nav-hidden'); return; }
    if (burger.classList.contains('open')) return;
    var y = window.scrollY;
    if (y > lastY && y > 60) nav.classList.add('nav-hidden');
    else nav.classList.remove('nav-hidden');
    lastY = y;
  });
})();
