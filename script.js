// VIBE Quiniela Mundial 2026
const API_URL = 'https://script.google.com/macros/s/AKfycbz8n6l5VVuka3r8yJFXyNsO1i2sAKEBqolcteCx95O90y4FCpnqo66Zh4BKHRUhGCY8/exec';
const LOCK_DATE = new Date('2026-06-25T05:59:00Z'); // Jun 24 23:59 CST (Costa Rica)

function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

// 48 teams
const TEAMS = ['Algeria','Argentina','Australia','Austria','Belgium','Bosnia and Herzegovina','Brazil','Canada','Cape Verde','Colombia','Croatia','Curacao','Czech Republic','DR Congo','Ecuador','Egypt','England','France','Germany','Ghana','Haiti','Iran','Iraq','Ivory Coast','Japan','Jordan','Mexico','Morocco','Netherlands','New Zealand','Norway','Panama','Paraguay','Portugal','Qatar','Saudi Arabia','Scotland','Senegal','South Africa','South Korea','Spain','Sweden','Switzerland','Tunisia','Turkiye','Uruguay','USA','Uzbekistan'];

// country name -> ISO code for flag images (flagcdn.com). England/Scotland use GB subdivisions.
const FLAG_CODES = {
  'Algeria':'dz','Argentina':'ar','Australia':'au','Austria':'at','Belgium':'be','Bosnia and Herzegovina':'ba','Brazil':'br','Canada':'ca','Cape Verde':'cv','Colombia':'co','Croatia':'hr','Curacao':'cw','Czech Republic':'cz','DR Congo':'cd','Ecuador':'ec','Egypt':'eg','England':'gb-eng','France':'fr','Germany':'de','Ghana':'gh','Haiti':'ht','Iran':'ir','Iraq':'iq','Ivory Coast':'ci','Japan':'jp','Jordan':'jo','Mexico':'mx','Morocco':'ma','Netherlands':'nl','New Zealand':'nz','Norway':'no','Panama':'pa','Paraguay':'py','Portugal':'pt','Qatar':'qa','Saudi Arabia':'sa','Scotland':'gb-sct','Senegal':'sn','South Africa':'za','South Korea':'kr','Spain':'es','Sweden':'se','Switzerland':'ch','Tunisia':'tn','Turkiye':'tr','Uruguay':'uy','USA':'us','Uzbekistan':'uz'
};
function flagUrl(team) { const c = FLAG_CODES[team]; return c ? `https://flagcdn.com/w80/${c}.png` : ''; }
function flagImg(team) { const u = flagUrl(team); return u ? `<img class="champ-pick-flag" src="${u}" alt="${team} flag" loading="lazy">` : ''; }

// i18n
const T = {
  en: {
    nav_home:'Home', nav_champion:'Bonus', nav_matches:'Matches', nav_rules:'Rules', nav_register:'Register', nav_login:'Login',
    hero_title:'World Cup Predictions 2026', hero_sub:'Predict the results of the FIFA World Cup USA/Mexico/Canada. Compete with all of TSE. Win prizes.',
    days:'Days', hours:'Hours', hero_join:'Join the Pool', hero_rules:'View Rules',
    champ_badge:'Extra', champ_title:'Bonus Points', champ_desc:'Two extra ways to rack up points before and during the tournament.',
    champ_card_tag:'Bonus', champ_card_title:'World Cup Champion', champ_card_desc:'Worth 10 bonus points. Locks June 24.',
    champ_save:'Save Pick', champ_locked:'Prediction for champ is locked.', champ_no_pick_locked:'You did not pick a winner on time :(', you_picked:'You picked:',
    champ_alive:'Still alive', champ_out:'Eliminated', champ_won:'World Champion!',
    round_r32:'Round of 32', round_r16:'Round of 16', round_qf:'Quarter-Finals', round_sf:'Semi-Finals', round_final:'Final', round_groups:'Group stage',
    bonus_info_tag:'Bonus', bonus_info_title:'Third Place Playoff', bonus_info_desc:'Predict the third-place match too, right under the trophy in the bracket. Same scoring: +5 for an exact score, +2 for the correct winner.',
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
    prizes_title:'Prizes', prize_1st:'1st Place', prize_2nd:'2nd Place', prize_3rd:'3rd Place', prize_raffle:'Raffle', prize_raffle_desc:'all participants', raffle_soon:'Coming Soon',
    trivia_badge:'Trivia Challenge', trivia_title:'Think you know the World Cup?', trivia_desc:'Test your knowledge and earn your spot to watch the semifinals <strong>or</strong> final. 3 winners get 2 hours of NPT each to catch the games live.',
    trivia_perk1:'3 winners', trivia_perk2:'2h NPT each', trivia_perk3:'Semis or Final', trivia_closes:'Closes in', trivia_deadline:'Deadline: July 12, 2026', trivia_cta:'Take the Trivia',
    podio_badge:'Final Results', podio_title:'The VIBE Podium', podio_sub:'The top 3 of the World Cup 2026 Pool', podio_champ:'Champion',
  },
  es: {
    nav_home:'Inicio', nav_champion:'Bonus', nav_matches:'Partidos', nav_rules:'Reglas', nav_register:'Registrarse', nav_login:'Ingresar',
    hero_title:'Quiniela Mundial 2026', hero_sub:'Predice los resultados del Mundial USA/Mexico/Canada. Compite con todo TSE. Gana premios.',
    days:'Dias', hours:'Horas', hero_join:'Unirme a la Quiniela', hero_rules:'Ver Reglas',
    champ_badge:'Extra', champ_title:'Puntos Bonus', champ_desc:'Dos formas extra de sumar puntos antes y durante el torneo.',
    champ_card_tag:'Bonus', champ_card_title:'Campeon del Mundial', champ_card_desc:'Vale 10 puntos bonus. Se bloquea el 24 de Junio.',
    champ_save:'Guardar', champ_locked:'La prediccion de campeon esta bloqueada.', champ_no_pick_locked:'No elegiste un campeon a tiempo :(', you_picked:'Elegiste:',
    champ_alive:'Sigue vivo', champ_out:'Eliminado', champ_won:'Campeon del Mundo!',
    round_r32:'Ronda de 32', round_r16:'Octavos', round_qf:'Cuartos de final', round_sf:'Semifinales', round_final:'Final', round_groups:'Fase de grupos',
    bonus_info_tag:'Bonus', bonus_info_title:'Partido por el Tercer Lugar', bonus_info_desc:'Predice tambien el partido por el tercer lugar, justo debajo del trofeo en el bracket. Mismo puntaje: +5 por marcador exacto, +2 por acertar al ganador.',
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
    prizes_title:'Premios', prize_1st:'1er Lugar', prize_2nd:'2do Lugar', prize_3rd:'3er Lugar', prize_raffle:'Rifa', prize_raffle_desc:'todos los participantes', raffle_soon:'Proximamente',
    trivia_badge:'Reto de Trivia', trivia_title:'Crees que sabes del Mundial?', trivia_desc:'Pon a prueba tu conocimiento y ganate tu lugar para ver las semifinales <strong>o</strong> la final. 3 ganadores reciben 2 horas de NPT cada uno para ver los partidos en vivo.',
    trivia_perk1:'3 ganadores', trivia_perk2:'2h NPT c/u', trivia_perk3:'Semis o Final', trivia_closes:'Cierra en', trivia_deadline:'Fecha limite: 12 de Julio, 2026', trivia_cta:'Hacer la Trivia',
    podio_badge:'Resultados Finales', podio_title:'El Podio VIBE', podio_sub:'El top 3 de la Quiniela Mundial 2026', podio_champ:'Campeon',
  }
};

let lang = localStorage.getItem('vibe_lang') || 'en';
function t(key) { return T[lang][key] || T.en[key] || key; }
function setLang(l) {
  lang = l; localStorage.setItem('vibe_lang', l);
  document.getElementById('langToggle').textContent = l === 'en' ? 'ES' : 'EN';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
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

// trivia challenge deadline countdown (July 12, 2026 23:59 CST)
function startTriviaCountdown() {
  const el = document.getElementById('triviaCountdown');
  if (!el) return;
  const target = new Date('2026-07-12T23:59:00-06:00');
  function tick() {
    const diff = Math.max(0, target - new Date());
    if (diff === 0) { el.textContent = lang === 'es' ? 'Cerrado' : 'Closed'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    el.textContent = d + 'd ' + h + 'h ' + m + 'm';
  }
  tick(); setInterval(tick, 60000);
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
// ⁘[ CHAMPION STATUS ]⁘ deriva vivo/eliminado/campeon del equipo desde los partidos KO
// orden de rondas KO de mas temprana a mas tardia (para saber "hasta donde llego")
var KO_STATUS_ORDER = [
  { fase: 'Round of 32',    key: 'round_r32'   },
  { fase: 'Round of 16',    key: 'round_r16'   },
  { fase: 'Quarter-Finals', key: 'round_qf'    },
  { fase: 'Semi-Finals',    key: 'round_sf'    },
  { fase: 'Final',          key: 'round_final' }
];
// devuelve { state:'alive'|'out'|'won', roundKey } o null si no hay datos suficientes
// Regla por FRONTERA: el torneo avanza por rondas. La "ronda actual" es la mas
// avanzada que ya tiene equipos asignados. Un equipo sigue vivo SOLO si llega a esa
// frontera; si su participacion se quedo en una ronda anterior, esta eliminado
// (aunque haya ganado ese ultimo partido) porque el torneo ya avanzo sin el.
function computeChampionStatus(team, partidos) {
  if (!team || !partidos || !partidos.length) return null;
  function roundIdx(fase) { return KO_STATUS_ORDER.map(function(r){ return r.fase; }).indexOf(fase); }
  function hasTeam(p) { return (p.local && p.local === team) || (p.visitante && p.visitante === team); }
  function isDone(p) { return p.status === 'finalizado' && p.gol_local !== '' && p.gol_visitante !== ''; }

  // 1) ¿ya hay campeon? Final finalizada.
  var finalP = partidos.filter(function(p){ return p.fase === 'Final'; })[0];
  if (finalP && isDone(finalP)) {
    var frL = Number(finalP.gol_local), frV = Number(finalP.gol_visitante);
    var winner = frL > frV ? finalP.local : finalP.visitante;
    if (winner === team) return { state: 'won', roundKey: 'round_final' };
    // perdio la final (o ni jugo) -> eliminado
    if (hasTeam(finalP)) return { state: 'out', roundKey: 'round_final' };
    return { state: 'out', roundKey: 'round_groups' };
  }

  // 2) frontera = ronda mas avanzada que YA tiene equipos asignados (torneo actual)
  var frontierIdx = -1;
  KO_STATUS_ORDER.forEach(function(r, i) {
    var anyTeams = partidos.some(function(p){ return p.fase === r.fase && ((p.local && p.local.trim()) || (p.visitante && p.visitante.trim())); });
    if (anyTeams) frontierIdx = i;
  });
  if (frontierIdx === -1) return { state: 'out', roundKey: 'round_groups' }; // aun sin KO

  // 3) partidos del equipo en la ronda-frontera
  var frontierFase = KO_STATUS_ORDER[frontierIdx].fase;
  var atFrontier = partidos.filter(function(p){ return p.fase === frontierFase && hasTeam(p); });

  if (atFrontier.length) {
    // aparece en la ronda actual: vivo salvo que ya perdio ahi
    var lost = atFrontier.some(function(p) {
      if (!isDone(p)) return false;
      var rL = Number(p.gol_local), rV = Number(p.gol_visitante);
      var teamGoals = p.local === team ? rL : rV, oppGoals = p.local === team ? rV : rL;
      return teamGoals < oppGoals;
    });
    return lost
      ? { state: 'out', roundKey: KO_STATUS_ORDER[frontierIdx].key }
      : { state: 'alive', roundKey: KO_STATUS_ORDER[frontierIdx].key };
  }

  // 4) NO aparece en la ronda actual -> el torneo avanzo sin el -> eliminado
  //    (no importa si gano su ultimo partido en una ronda anterior)
  var everInKo = partidos.some(function(p){ return roundIdx(p.fase) !== -1 && hasTeam(p); });
  return { state: 'out', roundKey: everInKo ? null : 'round_groups' };
}

// iconos outline (huecos, estilo trivia) para el estado del campeon
function icoAlive() { return '<svg class="ln-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>'; }
function icoOut()   { return '<svg class="ln-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'; }

// pinta el chip de estado bajo la bandera del campeon
function renderChampionStatus(team) {
  var el = document.getElementById('championStatus');
  if (!el) return;
  var st = computeChampionStatus(team, allKoPartidos);
  if (!st) { el.innerHTML = ''; return; }
  if (st.state === 'alive') {
    // sigue vivo ~ muestra la ronda que juega
    el.innerHTML = '<div class="champ-status champ-status--alive">' + icoAlive() + t('champ_alive') + ' <span class="champ-status__sub">· ' + t(st.roundKey) + '</span></div>';
  } else if (st.state === 'out') {
    // eliminado ~ sin ronda (simple; cubre tambien "afuera en grupos")
    el.innerHTML = '<div class="champ-status champ-status--out">' + icoOut() + t('champ_out') + '</div>';
  } else if (st.state === 'won') {
    el.innerHTML = '<div class="champ-status champ-status--won">' + icoTrophy() + t('champ_won') + ' <span class="champ-status__sub">+10 pts</span></div>';
  }
}

var championTeam = null; // equipo elegido, cacheado para re-render en polling / cambio de idioma
async function loadChampion() {
  const u = getUser(); if (!u) return;
  try {
    const res = await apiGet('getChampion', { pid: u.id });
    championTeam = res.equipo || null;
    const cur = document.getElementById('championCurrent');
    const statusEl = document.getElementById('championStatus');
    if (res.equipo) {
      cur.innerHTML = isLocked()
        ? `<span class="champ-pick-country"><strong>${res.equipo}</strong>${flagImg(res.equipo)}</span>`
        : `${t('your_pick')} <strong>${res.equipo}</strong>`;
      document.getElementById('championSelect').value = res.equipo;
      // estado vivo/eliminado solo cuando el pick esta bloqueado (torneo en marcha)
      if (isLocked()) renderChampionStatus(res.equipo);
      else if (statusEl) statusEl.innerHTML = '';
    } else {
      cur.innerHTML = isLocked()
        ? `<span class="champ-pick-country champ-pick-country--none"><strong>${t('champ_no_pick_locked')}</strong></span>`
        : t('no_pick');
      if (statusEl) statusEl.innerHTML = ''; // sin pick -> sin estado
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
function renderHistoryCard(p, phaseClass) {
  const pred = userPredictions[p.partido_id];
  const pts = calcPoints(pred, p);
  var predLine = '';
  if (pred) {
    predLine = '<div class="partido-prediction">Your prediction: ' + pred.gol_local + ' - ' + pred.gol_visitante;
    if (pts) predLine += ' <span class="pts-badge pts-badge--' + pts.pts + '">' + pts.label + '</span>';
    predLine += '</div>';
  }
  return '<div class="glass-card partido-card partido-card--locked partido-card--' + phaseClass + '">' +
    '<div class="partido-header"><span class="partido-fase">' + esc(p.fase) + '</span><span class="partido-status finalizado">Final</span></div>' +
    '<div class="partido-teams"><div class="partido-team">' + esc(p.local) + '</div><div class="partido-score">' + p.gol_local + ' - ' + p.gol_visitante + '</div><div class="partido-team">' + esc(p.visitante) + '</div></div>' +
    '<div class="partido-date">' + formatFecha(p.fecha) + ' - ' + formatHora(p.hora) + '</div>' +
    predLine + '</div>';
}
async function loadPartidos() {
  const el = document.getElementById('partidosGrid');
  if (!el) return;
  try {
    const all = await apiGet('getPartidos');
    const koFases = ['Round of 32','Round of 16','Quarter-Finals','Semi-Finals','Third Place','Final'];
    allPartidos = all.filter(p => koFases.indexOf(p.fase) === -1);
    await loadUserPredictions();
    renderPartidos(getFilteredPartidos());
    // render KO finalizados en el history toggle ~ de mas reciente a mas antiguo:
    // Semi-Finals → Quarter-Finals → Round of 16 → Round of 32 (Group Stage va aparte, abajo)
    var r32Grid = document.getElementById('r32Grid');
    if (r32Grid) {
      // SF y QF SOLO se archivan cuando el Final Mode toma efecto (Final con ambos equipos):
      // hasta entonces siguen visibles en el bracket y no deben duplicarse aqui.
      var finalM = all.filter(p => p.fase === 'Final')[0];
      var finalMode = finalM && finalM.local && finalM.local.trim() && finalM.visitante && finalM.visitante.trim();
      var archivedRounds = [];
      if (finalMode) {
        archivedRounds.push({ fase: 'Semi-Finals',    badge: 'phase-badge--sf', cls: 'sf' });
        archivedRounds.push({ fase: 'Quarter-Finals', badge: 'phase-badge--qf', cls: 'qf' });
      }
      archivedRounds.push({ fase: 'Round of 16', badge: 'phase-badge--r16', cls: 'r16' });
      archivedRounds.push({ fase: 'Round of 32', badge: 'phase-badge--r32', cls: 'r32' });

      var html = '';
      archivedRounds.forEach(function(r) {
        var matches = all.filter(p => p.fase === r.fase && p.status === 'finalizado');
        if (matches.length > 0) {
          html += '<div class="phase-divider"><span class="phase-badge ' + r.badge + '">' + r.fase + '</span></div>';
          html += '<div class="partidos-grid">' + matches.map(p => renderHistoryCard(p, r.cls)).join('') + '</div>';
        }
      });

      if (html) {
        r32Grid.innerHTML = html;
      } else {
        r32Grid.innerHTML = '<div class="glass-card partido-card"><p class="placeholder-text" style="color:var(--text-muted);font-size:11px;">No knockout results yet</p></div>';
      }
    }
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
// btnRegister removido en la pagina de resultados finales ~ guard por si no existe
var _btnReg = document.getElementById('btnRegister');
if (_btnReg) _btnReg.addEventListener('click', () => { getUser() ? document.getElementById('partidos').scrollIntoView({behavior:'smooth'}) : openRegister(); });

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

// live refresh del bracket + estado del campeon (vivo/eliminado) cada 2 min mientras el torneo corre
setInterval(() => { if (isLocked()) loadKnockout(); }, 120000);

// init
startChampionCountdown(); populateTeams(); setLang(lang); updateUserUI(); updateChampionUI(); loadPartidos(); loadLeaderboard(); loadKnockout();

// ⁘[ KNOCKOUT BRACKET ]⁘
// lee getPartidos y filtra por fase para construir el bracket dinamicamente
// el array ROUND_ORDER mapea fase → columna del bracket (left o right del trophy)
// R16 y anteriores se archivan en "Past Predictions"; el bracket visible arranca en Quarter-Finals
var KO_ROUND_ORDER = [
  { key: 'qfl',  label: 'Quarter-Finals', fase: 'Quarter-Finals', side: 'left', slots: 2 },
  { key: 'semil', label: 'Semi-Finals', fase: 'Semi-Finals', side: 'left', slots: 1 },
  { key: 'final', label: 'Final', fase: 'Final', side: 'center', slots: 1 },
  { key: 'semir', label: 'Semi-Finals', fase: 'Semi-Finals', side: 'right', slots: 1 },
  { key: 'qfr',  label: 'Quarter-Finals', fase: 'Quarter-Finals', side: 'right', slots: 2 }
];
var koPredictions = {};
var allKoPartidos = []; // partidos KO cacheados (para el estado del campeon)

async function loadKnockout() {
  var u = getUser();
  var partidos = [];

  // si ya sabemos que Final Mode esta activo y aun no hay card en pantalla, mostrar la silueta (evita flash vacio en carga fria)
  // si ya hay una .final-hero (p.ej. tras guardar, con el pill "Saving"), no la pisamos: dejamos que el re-render la reemplace
  if (localStorage.getItem('vibeFinalMode') === '1' && !document.querySelector('.final-hero')) showFinalModeSkeleton();

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
    var koFases = ['Round of 32','Round of 16','Quarter-Finals','Semi-Finals','Third Place','Final'];
    partidos = all.filter(function(p) { return koFases.indexOf(p.fase) !== -1; });
    allKoPartidos = partidos; // cache para el estado del campeon
  } catch(e) {}

  // siempre re-renderizar con los datos que tengamos ([] muestra TBD, con datos muestra equipos)
  renderKnockout(partidos);
  // refrescar el estado del campeon (vivo/eliminado) con los partidos recien cargados
  if (championTeam && isLocked()) renderChampionStatus(championTeam);
}

// bandera grande para el Final Mode (w320 vs w80 normal)
function flagUrlBig(team) { var c = FLAG_CODES[team]; return c ? ('https://flagcdn.com/w320/' + c + '.png') : ''; }

// ⁘[ FINAL MODE SKELETON ]⁘ silueta de carga de la card gigante ~ evita el flash vacio mientras loadKnockout() trae la data
// (la card gigante no tiene data-pid ni .partido-prediction, asi que showCardSkeleton no aplica aca)
function showFinalModeSkeleton() {
  var grid = document.getElementById('bracketGrid');
  if (!grid) return;
  grid.classList.add('final-mode-active');
  grid.innerHTML =
    '<div class="final-mode-wrap"><div class="final-hero fm-skel">' +
      '<span class="final-badge-top fm-skel-badge"></span>' +
      '<div class="final-side"><span class="fm-skel-box fm-skel-flag"></span><span class="fm-skel-box fm-skel-country"></span></div>' +
      '<div class="final-center"><span class="fm-skel-box fm-skel-trophy"></span><span class="fm-skel-box fm-skel-vs"></span><span class="fm-skel-box fm-skel-champs"></span></div>' +
      '<div class="final-side"><span class="fm-skel-box fm-skel-flag"></span><span class="fm-skel-box fm-skel-country"></span></div>' +
      '<span class="fm-skel-box fm-skel-predline"></span>' +
    '</div></div>';
}

// pill "Saving..." en la linea Your prediction de la card gigante mientras loadKnockout() re-consulta
function showFinalPredSaving() {
  var hero = document.querySelector('.final-hero');
  if (!hero) return;
  var pill = '<div class="final-pred-line" id="finalPredLine"><span class="fp-pill"><span class="fp-spin"></span>' + t('sending') + '</span></div>';
  var line = hero.querySelector('.final-pred-line');
  if (line) { line.outerHTML = pill; }
  else {
    // no habia prediccion previa: insertar antes del hint/footer
    var hint = hero.querySelector('.final-hint, .final-winner-banner');
    if (hint) { hint.insertAdjacentHTML('beforebegin', pill); }
    else { hero.insertAdjacentHTML('beforeend', pill); }
  }
}

// icono trofeo outline (estilo trivia) ~ usado en el banner de campeon del Final Mode
function icoTrophy() {
  return '<svg class="ln-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>';
}

// ⁘[ FINAL MODE ]⁘ card gigante ~ se activa cuando la fila Final tiene AMBOS equipos
function renderFinalMode(finalMatch, thirdMatch) {
  var grid = document.getElementById('bracketGrid');
  var f = finalMatch;
  var isFinished = f.status === 'finalizado' && f.gol_local !== '' && f.gol_visitante !== '';
  var rL = Number(f.gol_local), rV = Number(f.gol_visitante);
  var winL = isFinished && rL > rV, winV = isFinished && rV > rL;

  // confeti dorado en hover (detras de todo)
  var goldConf = '<div class="gold-confetti-wrap" aria-hidden="true">';
  for (var i = 0; i < 24; i++) {
    goldConf += '<div class="gold-confetti" style="left:' + (i * 4.1 + (i % 3)) + '%;animation-duration:' + (1.6 + (i % 4) * 0.4) + 's;animation-delay:' + ((i % 6) * 0.3) + 's"></div>';
  }
  goldConf += '</div>';
  // confeti de celebracion (solo al terminar)
  var winConf = '';
  if (isFinished) {
    var cols = ['#9b30ff','#c850c0','#ff6ec7','#fbbf24','#22c55e'];
    winConf = '<div class="confetti-wrap" aria-hidden="true">';
    for (var j = 0; j < 40; j++) {
      winConf += '<div class="confetti" style="left:' + (j * 2.5) + '%;background:' + cols[j % cols.length] + ';animation-duration:' + (2.5 + (j % 5) * 0.5) + 's;animation-delay:' + ((j % 6) * 0.5) + 's"></div>';
    }
    winConf += '</div>';
  }

  var scoreBlock = isFinished
    ? '<div class="final-vs-score"><div class="final-score">' + f.gol_local + '</div><span class="final-vs-dash">-</span><div class="final-score">' + f.gol_visitante + '</div></div>'
    : '<div class="final-vs-score"><span class="final-vs-dash" style="font-size:28px">VS</span></div>';

  // linea de prediccion + puntos
  var pred = koPredictions[f.partido_id];
  var predLine = '';
  if (pred) {
    var ptsBadge = '';
    if (isFinished) {
      var pL = Number(pred.gol_local), pV = Number(pred.gol_visitante);
      if (pL === rL && pV === rV) ptsBadge = ' <span class="final-pts final-pts--5">+5 Exact!</span>';
      else { var realW = rL>rV?'L':rL<rV?'V':'E', predW = pL>pV?'L':pL<pV?'V':'E'; ptsBadge = predW===realW ? ' <span class="final-pts final-pts--2">+2 Winner</span>' : ' <span class="final-pts final-pts--0">No points</span>'; }
    }
    predLine = '<div class="final-pred-line">Your prediction: ' + pred.gol_local + ' - ' + pred.gol_visitante + ptsBadge + '</div>';
  }

  var footer = isFinished
    ? '<div class="final-winner-banner">' + icoTrophy() + esc(winL ? f.local : f.visitante) + ', World Champion</div>'
    : '<div class="final-hint">Tap the card to predict</div>';

  var clickable = !isFinished;
  var hero = document.createElement('div');
  hero.className = 'final-hero';
  hero.innerHTML = winConf + goldConf +
    '<span class="final-badge-top">The Grand Final</span>' +
    '<div class="final-side' + (winL ? ' winner' : '') + '"><img class="final-flag" src="' + flagUrlBig(f.local) + '" alt="' + esc(f.local) + '"><div class="final-country">' + esc(f.local) + '</div></div>' +
    '<div class="final-center"><img src="trophy.png" class="final-trophy" alt="Trophy">' + scoreBlock + '<div class="final-label-champs">World Champions</div></div>' +
    '<div class="final-side' + (winV ? ' winner' : '') + '"><img class="final-flag" src="' + flagUrlBig(f.visitante) + '" alt="' + esc(f.visitante) + '"><div class="final-country">' + esc(f.visitante) + '</div></div>' +
    predLine + footer;
  if (clickable) { hero.style.cursor = 'pointer'; hero.addEventListener('click', function() { openKoPredict(f); }); }

  var wrap = document.createElement('div');
  wrap.className = 'final-mode-wrap';
  wrap.appendChild(hero);

  // tercer lugar (bonus) debajo de la Final gigante
  var thirdCard = buildKoCard(thirdMatch, 'Third Place');
  thirdCard.classList.add('ko-third-place');
  var bonusWrap = document.createElement('div');
  bonusWrap.className = 'final-bonus';
  bonusWrap.appendChild(thirdCard);
  wrap.appendChild(bonusWrap);

  grid.appendChild(wrap);
}

function renderKnockout(partidos) {
  var grid = document.getElementById('bracketGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // ⁘[ FINAL MODE ]⁘ si la fila Final ya tiene AMBOS equipos → bracket colapsa a la card gigante
  var finalMatch = partidos.filter(function(p) { return p.fase === 'Final'; })[0] || null;
  var thirdMatch = partidos.filter(function(p) { return p.fase === 'Third Place'; })[0] || null;
  var finalReady = finalMatch && finalMatch.local && finalMatch.local.trim() && finalMatch.visitante && finalMatch.visitante.trim();
  grid.classList.toggle('final-mode-active', !!finalReady);
  // recordar el estado para pintar la silueta en la proxima carga/refresh (no flashear la card gigante en modo normal)
  if (finalReady) localStorage.setItem('vibeFinalMode', '1'); else localStorage.removeItem('vibeFinalMode');
  if (finalReady) { renderFinalMode(finalMatch, thirdMatch); return; }

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
      // card pequena de la Final ~ ENCIMA del trofeo (coming soon / parcial hasta que haya 2 equipos)
      var finalCard = buildKoCard(finalMatch, 'Final');
      finalCard.classList.add('ko-final-match');
      col.appendChild(finalCard);
      // trophy + label
      var trophy = document.createElement('img');
      trophy.src = 'trophy.png'; trophy.alt = 'Trophy'; trophy.className = 'ko-trophy-inner';
      col.appendChild(trophy);
      var lbl = document.createElement('div');
      lbl.className = 'ko-final-label'; lbl.textContent = 'WORLD CHAMPIONS';
      col.appendChild(lbl);
      // tercer lugar (bonus) ~ debajo del trofeo, offset hacia abajo
      var thirdCard = buildKoCard(thirdMatch, 'Third Place');
      thirdCard.classList.add('ko-third-place');
      col.appendChild(thirdCard);
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
      var card = buildKoCard(p, round.label);
      matchContainer.appendChild(card);
    }

    col.appendChild(matchContainer);
    grid.appendChild(col);
  });
}

// muestra un skeleton en la carta recien apostada mientras loadKnockout() trae la data del backend
function showCardSkeleton(partidoId) {
  var card = document.querySelector('[data-pid="' + partidoId + '"]');
  if (!card) return;
  var existing = card.querySelector('.partido-prediction');
  var skel = '<div class="partido-prediction pred-skeleton"><span class="pred-skeleton-bar"></span></div>';
  if (existing) { existing.outerHTML = skel; }
  else { card.insertAdjacentHTML('beforeend', skel); }
}

// slot de equipo para cartas KO: bandera real + nombre, o bandera "?" + TBD si aun no clasifica
function koTeamSlot(team) {
  if (team && team.trim()) {
    return '<div class="partido-team">' + flagImg(team) + '<div class="partido-team-name">' + esc(team) + '</div></div>';
  }
  return '<div class="partido-team"><div class="champ-pick-flag flag-tbd">?</div><div class="partido-team-name partido-team-name--tbd">TBD</div></div>';
}

function buildKoCard(p, roundLabel) {
  // 4 estados:
  // 1. sin datos (p null o ambos equipos vacios) → "Coming Soon" minimal
  // 2. parcial (solo local o solo visitante) → equipo + TBD, no clickeable
  // 3. ambos equipos, abierto → full card clickeable
  // 4. finalizado → resultado + puntos

  var hasLocal = p && p.local && p.local.trim();
  var hasVisitante = p && p.visitante && p.visitante.trim();
  var hasTeams = hasLocal && hasVisitante;
  var hasPartial = hasLocal || hasVisitante;
  var isFinished = p && p.status === 'finalizado';
  var fase = roundLabel || (p ? p.fase : 'Round of 32');
  // barra edge-to-edge: BONUS (tercer lugar) o LA GRAN FINAL (final)
  var isBonus = fase === 'Third Place';
  var isFinal = fase === 'Final';
  var bonusBar = isBonus ? '<div class="partido-bonus-bar">Bonus</div>'
               : isFinal ? '<div class="partido-final-bar">La Gran Final</div>' : '';

  var card = document.createElement('div');
  if (p && p.partido_id) card.setAttribute('data-pid', p.partido_id);

  // estado 1: sin datos ~ coming soon
  if (!hasPartial) {
    card.className = 'glass-card partido-card partido-card--locked ko-coming-soon' + (isBonus || isFinal ? ' partido-card--coming' : '');
    card.innerHTML = bonusBar +
      '<div class="partido-header"><span class="partido-fase">' + esc(fase) + '</span></div>' +
      '<div class="ko-coming-label">Coming Soon</div>';
    return card;
  }

  // estado 2: parcial ~ un equipo clasificado, el otro TBD (bandera real vs bandera "?")
  if (!hasTeams && !isFinished) {
    card.className = 'glass-card partido-card partido-card--locked';
    card.innerHTML = bonusBar +
      '<div class="partido-header"><span class="partido-fase">' + esc(fase) + '</span></div>' +
      '<div class="partido-teams">' +
        koTeamSlot(hasLocal ? p.local : null) +
        '<div class="partido-vs">vs</div>' +
        koTeamSlot(hasVisitante ? p.visitante : null) +
      '</div>' +
      (p.fecha ? '<div class="partido-date">' + formatFecha(p.fecha) + ' - ' + formatHora(p.hora) + '</div>' : '') +
      '<div class="partido-bet partido-bet--waiting">Waiting for teams</div>';
    return card;
  }

  // estados 3 y 4: ambos equipos presentes
  var pred = p && koPredictions[p.partido_id];
  var pts = null;

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

  card.className = 'glass-card partido-card' + (isClosed ? ' partido-card--locked' : '');

  var statusBadge = '';
  if (isFinished) statusBadge = '<span class="partido-status finalizado">Final</span>';
  else statusBadge = '<span class="partido-status pendiente">Score Pending</span>';

  var teamsRow = '<div class="partido-teams">' +
    '<div class="partido-team">' + flagImg(p.local) + '<div class="partido-team-name">' + esc(p.local) + '</div></div>' +
    (isFinished ? '<div class="partido-score">' + p.gol_local + ' - ' + p.gol_visitante + '</div>' : '<div class="partido-vs">vs</div>') +
    '<div class="partido-team">' + flagImg(p.visitante) + '<div class="partido-team-name">' + esc(p.visitante) + '</div></div>' +
    '</div>';

  var dateStr = formatFecha(p.fecha) + ' - ' + formatHora(p.hora);

  var betLine = '';
  if (bettingState === 'open') betLine = '<div class="partido-bet partido-bet--open">Open</div>';
  else if (bettingState === 'closing') betLine = '<div class="partido-bet partido-bet--closing">Closes in ' + closingLabel + '</div>';
  else if (bettingState === 'closed') betLine = '<div class="partido-bet partido-bet--closed">Betting Closed</div>';

  var predLine = '';
  if (pred) {
    predLine = '<div class="partido-prediction">Your prediction: ' + pred.gol_local + ' - ' + pred.gol_visitante;
    if (pts) predLine += ' <span class="pts-badge pts-badge--' + pts.n + '">' + pts.label + '</span>';
    predLine += '</div>';
  }

  card.innerHTML = bonusBar +
    '<div class="partido-header"><span class="partido-fase">' + esc(fase) + '</span>' + statusBadge + '</div>' +
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
    setTimeout(() => {
      closePredict();
      // el bonus (3er lugar) SI tiene su propia carta con data-pid aunque Final Mode este activo -> usar su skeleton normal.
      // solo la Final gigante (KO-FINAL) no tiene data-pid: para esa usamos el pill "Saving" sobre la card gigante.
      if (document.querySelector('[data-pid="' + partidoId + '"]')) showCardSkeleton(partidoId);
      else if (document.querySelector('.final-hero')) showFinalPredSaving();
      loadKnockout();
    }, 800);
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

// confeti del podio ~ dispara una sola vez cuando el podio entra en vista
(function() {
  var podio = document.getElementById('podio');
  if (!podio || typeof IntersectionObserver === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var fired = false;
  var colors = ['#ffd700', '#c0c0dc', '#cd7f32', '#9b30ff', '#c850c0', '#ff6ec7'];
  function celebrate() {
    if (typeof confetti !== 'function') return;
    var end = Date.now() + 1400;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: colors });
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !fired) { fired = true; celebrate(); obs.disconnect(); }
    });
  }, { threshold: 0.4 });
  obs.observe(podio);
})();
