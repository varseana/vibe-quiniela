// VIBE Quiniela Mundial 2026

// !! replace with your apps script deploy url after deploying !!
const API_URL = 'https://script.google.com/macros/s/AKfycbx9Gbm_HIw5ApGTqc4s_t1RuYW1HscdcuWBr9TnzTOHwy-0QJ4DM-y6xR6p1gwX29qZ/exec';

// user session (localStorage)
function getUser() { try { return JSON.parse(localStorage.getItem('vibe_user')); } catch { return null; } }
function setUser(u) { localStorage.setItem('vibe_user', JSON.stringify(u)); updateUserUI(); }
function logout() { localStorage.removeItem('vibe_user'); updateUserUI(); }

function updateUserUI() {
  const u = getUser();
  const navUser = document.getElementById('navUser');
  if (u) {
    navUser.innerHTML = `<span class="user-alias">${u.alias}</span> <button class="btn btn-glass btn-sm" onclick="logout()">Salir</button>`;
  } else {
    navUser.innerHTML = `<button class="btn btn-glow btn-sm" id="btnLogin" onclick="openRegister()">Registrarse</button>`;
  }
}

// api helpers
async function apiGet(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  return res.json();
}

async function apiPost(data) {
  const res = await fetch(API_URL, { method: 'POST', body: JSON.stringify(data) });
  return res.json();
}

// countdown to world cup (june 11 2026)
function startCountdown() {
  const target = new Date('2026-06-11T00:00:00Z');
  function tick() {
    const now = new Date();
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdDays').textContent = String(d).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

// modals
function openRegister() { document.getElementById('modalOverlay').classList.add('open'); }
function closeRegister() { document.getElementById('modalOverlay').classList.remove('open'); }
function openPredict(partido) {
  document.getElementById('predPartidoId').value = partido.partido_id;
  document.getElementById('predLocal').textContent = partido.local;
  document.getElementById('predVisitante').textContent = partido.visitante;
  document.getElementById('predictTitle').textContent = `${partido.local} vs ${partido.visitante}`;
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
  msg.textContent = 'Registrando...'; msg.className = 'form-msg';
  const data = {
    action: 'register',
    alias: document.getElementById('regAlias').value.trim(),
    nombre: document.getElementById('regNombre').value.trim(),
    email: document.getElementById('regEmail').value.trim(),
    equipo: document.getElementById('regEquipo').value.trim()
  };
  try {
    const res = await apiPost(data);
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    setUser({ id: res.id, alias: res.alias });
    msg.textContent = 'Registrado!'; msg.className = 'form-msg success';
    setTimeout(closeRegister, 1000);
  } catch { msg.textContent = 'Error de conexion'; msg.className = 'form-msg error'; }
});

// predict
document.getElementById('predictForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const u = getUser();
  if (!u) { openRegister(); return; }
  const msg = document.getElementById('predictMsg');
  msg.textContent = 'Enviando...'; msg.className = 'form-msg';
  const data = {
    action: 'predict',
    pid: u.id,
    partido_id: document.getElementById('predPartidoId').value,
    gol_local: Number(document.getElementById('predGolLocal').value),
    gol_visitante: Number(document.getElementById('predGolVisitante').value)
  };
  try {
    const res = await apiPost(data);
    if (res.error) { msg.textContent = res.error; msg.className = 'form-msg error'; return; }
    msg.textContent = 'Prediccion guardada!'; msg.className = 'form-msg success';
    setTimeout(closePredict, 1000);
    loadPartidos();
  } catch { msg.textContent = 'Error de conexion'; msg.className = 'form-msg error'; }
});

// load partidos
let allPartidos = [];
async function loadPartidos() {
  try {
    allPartidos = await apiGet('getPartidos');
    renderPartidos(allPartidos);
  } catch { document.getElementById('partidosGrid').innerHTML = '<div class="glass-card partido-card"><p class="placeholder-text">No se pudieron cargar los partidos</p></div>'; }
}

function renderPartidos(partidos) {
  const grid = document.getElementById('partidosGrid');
  if (!partidos.length) { grid.innerHTML = '<div class="glass-card partido-card"><p class="placeholder-text">No hay partidos registrados aun</p></div>'; return; }
  grid.innerHTML = partidos.map(p => `
    <div class="glass-card partido-card" onclick='openPredict(${JSON.stringify(p)})'>
      <div class="partido-header">
        <span class="partido-fase">${p.fase} ${p.grupo || ''}</span>
        <span class="partido-status ${p.status}">${p.status}</span>
      </div>
      <div class="partido-teams">
        <div class="partido-team">${p.local}</div>
        ${p.status === 'finalizado' ? `<div class="partido-score">${p.gol_local} - ${p.gol_visitante}</div>` : '<div class="partido-vs">vs</div>'}
        <div class="partido-team">${p.visitante}</div>
      </div>
      <div class="partido-date">${p.fecha} ${p.hora || ''}</div>
    </div>
  `).join('');
}

// filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    renderPartidos(f === 'all' ? allPartidos : allPartidos.filter(p => p.status === f));
  });
});

// leaderboard
async function loadLeaderboard() {
  try {
    const data = await apiGet('getLeaderboard');
    const body = document.getElementById('leaderboardBody');
    if (!data.length) { body.innerHTML = '<tr><td colspan="5" class="placeholder-text">Sin datos aun</td></tr>'; return; }
    body.innerHTML = data.map((p, i) => `
      <tr class="${i < 3 ? 'rank-' + (i + 1) : ''}">
        <td class="rank-num">${i + 1}</td>
        <td>${p.alias}</td>
        <td>${p.exactos}</td>
        <td>${p.aciertos}</td>
        <td class="pts-num">${p.puntos}</td>
      </tr>
    `).join('');
  } catch { document.getElementById('leaderboardBody').innerHTML = '<tr><td colspan="5" class="placeholder-text">Error cargando leaderboard</td></tr>'; }
}

// modal close handlers
document.getElementById('modalClose').addEventListener('click', closeRegister);
document.getElementById('modalOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeRegister(); });
document.getElementById('predictClose').addEventListener('click', closePredict);
document.getElementById('predictOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) closePredict(); });
document.getElementById('btnRegister').addEventListener('click', () => { getUser() ? document.getElementById('partidos').scrollIntoView({ behavior: 'smooth' }) : openRegister(); });

// nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

// scroll reveal
const reveals = document.querySelectorAll('.glass-card, .section-header, .hero-content');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.15 });
reveals.forEach(el => { el.classList.add('reveal'); revealObs.observe(el); });

// particles
const pc = document.getElementById('particles');
for (let i = 0; i < 25; i++) {
  const d = document.createElement('div');
  d.className = 'particle';
  d.style.left = Math.random() * 100 + '%';
  d.style.animationDuration = 8 + Math.random() * 12 + 's';
  d.style.animationDelay = Math.random() * 10 + 's';
  d.style.width = d.style.height = 1 + Math.random() * 2 + 'px';
  d.style.opacity = 0.15 + Math.random() * 0.25;
  pc.appendChild(d);
}

// nav glider + scroll spy
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const glider = document.getElementById('navGlider');
function moveGlider(link) {
  if (!link || !glider) return;
  const r = link.getBoundingClientRect();
  const pr = link.parentElement.getBoundingClientRect();
  glider.style.left = (r.left - pr.left) + 'px';
  glider.style.width = r.width + 'px';
  glider.classList.add('visible');
}
window.addEventListener('scroll', () => {
  let current = '';
  const atBottom = (window.scrollY + window.innerHeight) >= (document.body.scrollHeight - 50);
  if (atBottom) { current = sections[sections.length - 1].id; }
  else { sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; }); }
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  const active = document.querySelector('.nav-link.active');
  if (active) moveGlider(active); else glider.classList.remove('visible');
});
navLinks.forEach(l => {
  l.addEventListener('mouseenter', () => moveGlider(l));
  l.addEventListener('mouseleave', () => { const a = document.querySelector('.nav-link.active'); if (a) moveGlider(a); else glider.classList.remove('visible'); });
});

// init
startCountdown();
updateUserUI();
loadPartidos();
loadLeaderboard();
