// VIBE Quiniela Mundial 2026 - Apps Script API v2
// Pegar en Extensions > Apps Script
// Deploy > Manage deployments > Edit (lapiz) > Version: New version > Deploy

const SHEET_ID = '1rzB-X7mSPsExzh4Trh2mLuB-UF7EaCAQu6FYxLxLtoY';
const LOCK_DATE = new Date('2026-06-11T06:00:00Z'); // june 11 CST = UTC-6

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === 'Participantes') sheet.appendRow(['id','alias','nombre','email','equipo_favorito','fecha_registro']);
    if (name === 'Predicciones') sheet.appendRow(['participante_id','partido_id','gol_local','gol_visitante','timestamp']);
    if (name === 'Partidos') sheet.appendRow(['partido_id','fase','grupo','fecha','hora','local','visitante','gol_local','gol_visitante','status']);
    if (name === 'Campeon') sheet.appendRow(['participante_id','equipo','timestamp']);
    if (name === 'Config') sheet.appendRow(['key','value']);
  }
  return sheet;
}

function doGet(e) {
  const action = e.parameter.action;
  let result;
  try {
    if (action === 'getPartidos') result = getData('Partidos');
    else if (action === 'getLeaderboard') result = calcLeaderboard();
    else if (action === 'getPredicciones') result = getPredicciones(e.parameter.pid);
    else if (action === 'getChampion') result = getChampion(e.parameter.pid);
    else if (action === 'checkAlias') result = checkAlias(e.parameter.alias);
    else result = { error: 'unknown action' };
  } catch (err) { result = { error: err.message }; }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  let result;
  try {
    if (data.action === 'register') result = registerUser(data);
    else if (data.action === 'predict') result = savePrediction(data);
    else if (data.action === 'saveChampion') result = saveChampion(data);
    else result = { error: 'unknown action' };
  } catch (err) { result = { error: err.message }; }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function getData(sheetName) {
  const sheet = getSheet(sheetName);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(r => { const obj = {}; headers.forEach((h, i) => obj[h] = r[i]); return obj; });
}

function checkAlias(alias) {
  const users = getData('Participantes');
  return { available: !users.some(u => u.alias.toLowerCase() === alias.toLowerCase()) };
}

function registerUser(data) {
  const sheet = getSheet('Participantes');
  const users = getData('Participantes');
  if (users.some(u => u.alias.toLowerCase() === data.alias.toLowerCase())) return { error: 'alias already taken' };
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) return { error: 'email already registered' };
  const id = 'P' + Date.now();
  sheet.appendRow([id, data.alias, data.nombre, data.email, data.equipo || '', new Date().toISOString()]);
  return { ok: true, id: id, alias: data.alias };
}

function savePrediction(data) {
  const sheet = getSheet('Predicciones');
  const partidos = getData('Partidos');
  const partido = partidos.find(p => p.partido_id === data.partido_id);
  if (!partido) return { error: 'match not found' };
  if (partido.status === 'finalizado') return { error: 'match already finished' };
  const matchTime = new Date(partido.fecha + 'T' + partido.hora);
  if (new Date() > new Date(matchTime.getTime() - 3600000)) return { error: 'deadline passed' };
  const all = sheet.getDataRange().getValues();
  for (let i = 1; i < all.length; i++) {
    if (all[i][0] === data.pid && all[i][1] === data.partido_id) {
      sheet.getRange(i + 1, 3).setValue(data.gol_local);
      sheet.getRange(i + 1, 4).setValue(data.gol_visitante);
      sheet.getRange(i + 1, 5).setValue(new Date().toISOString());
      return { ok: true, updated: true };
    }
  }
  sheet.appendRow([data.pid, data.partido_id, data.gol_local, data.gol_visitante, new Date().toISOString()]);
  return { ok: true, created: true };
}

function getChampion(pid) {
  const all = getData('Campeon');
  const pick = all.find(c => c.participante_id === pid);
  return pick ? { equipo: pick.equipo } : { equipo: null };
}

function saveChampion(data) {
  if (new Date() >= LOCK_DATE) return { error: 'locked - tournament has started' };
  if (!data.equipo) return { error: 'no team selected' };
  const sheet = getSheet('Campeon');
  const all = sheet.getDataRange().getValues();
  for (let i = 1; i < all.length; i++) {
    if (all[i][0] === data.pid) {
      sheet.getRange(i + 1, 2).setValue(data.equipo);
      sheet.getRange(i + 1, 3).setValue(new Date().toISOString());
      return { ok: true, updated: true };
    }
  }
  sheet.appendRow([data.pid, data.equipo, new Date().toISOString()]);
  return { ok: true, created: true };
}

function getPredicciones(pid) {
  return getData('Predicciones').filter(p => p.participante_id === pid);
}

function calcLeaderboard() {
  const partidos = getData('Partidos').filter(p => p.status === 'finalizado');
  const predicciones = getData('Predicciones');
  const users = getData('Participantes');
  const campeonPicks = getData('Campeon');
  // check if there is a winner set in Config
  const config = getData('Config');
  const winnerRow = config.find(c => c.key === 'campeon_real');
  const realWinner = winnerRow ? winnerRow.value : null;

  const scores = {};
  users.forEach(u => { scores[u.id] = { alias: u.alias, nombre: u.nombre, exactos: 0, aciertos: 0, campeon: '', puntos: 0 }; });

  // match points
  partidos.forEach(p => {
    const rL = Number(p.gol_local), rV = Number(p.gol_visitante);
    const realW = rL > rV ? 'L' : rL < rV ? 'V' : 'E';
    predicciones.filter(pr => pr.partido_id === p.partido_id).forEach(pr => {
      if (!scores[pr.participante_id]) return;
      const pL = Number(pr.gol_local), pV = Number(pr.gol_visitante);
      const predW = pL > pV ? 'L' : pL < pV ? 'V' : 'E';
      if (pL === rL && pV === rV) { scores[pr.participante_id].exactos++; scores[pr.participante_id].puntos += 5; }
      else if (predW === realW) { scores[pr.participante_id].aciertos++; scores[pr.participante_id].puntos += 2; }
    });
  });

  // champion bonus
  campeonPicks.forEach(cp => {
    if (!scores[cp.participante_id]) return;
    scores[cp.participante_id].campeon = cp.equipo;
    if (realWinner && cp.equipo === realWinner) scores[cp.participante_id].puntos += 10;
  });

  return Object.values(scores).sort((a, b) => b.puntos - a.puntos || b.exactos - a.exactos);
}

function setup() {
  getSheet('Participantes');
  getSheet('Predicciones');
  getSheet('Partidos');
  getSheet('Campeon');
  getSheet('Config');
}
