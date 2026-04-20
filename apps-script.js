// ============================================
// VIBE Quiniela Mundial 2026 - Apps Script API
// Pegar esto en Extensions > Apps Script
// Deploy como Web App (Execute as: Me, Access: Anyone)
// ============================================

const SHEET_ID = '1rzB-X7mSPsExzh4Trh2mLuB-UF7EaCAQu6FYxLxLtoY';

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === 'Participantes') sheet.appendRow(['id','alias','nombre','email','equipo_favorito','fecha_registro']);
    if (name === 'Predicciones') sheet.appendRow(['participante_id','partido_id','gol_local','gol_visitante','timestamp']);
    if (name === 'Partidos') sheet.appendRow(['partido_id','fase','grupo','fecha','hora','local','visitante','gol_local','gol_visitante','status']);
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
    else result = { error: 'unknown action' };
  } catch (err) { result = { error: err.message }; }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function getData(sheetName) {
  const sheet = getSheet(sheetName);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });
}

function checkAlias(alias) {
  const users = getData('Participantes');
  const exists = users.some(u => u.alias.toLowerCase() === alias.toLowerCase());
  return { available: !exists };
}

function registerUser(data) {
  const sheet = getSheet('Participantes');
  const users = getData('Participantes');
  if (users.some(u => u.alias.toLowerCase() === data.alias.toLowerCase())) return { error: 'alias ya existe' };
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) return { error: 'email ya registrado' };
  const id = 'P' + Date.now();
  sheet.appendRow([id, data.alias, data.nombre, data.email, data.equipo || '', new Date().toISOString()]);
  return { ok: true, id: id, alias: data.alias };
}

function savePrediction(data) {
  const sheet = getSheet('Predicciones');
  const partidos = getData('Partidos');
  const partido = partidos.find(p => p.partido_id === data.partido_id);
  if (!partido) return { error: 'partido no encontrado' };
  if (partido.status === 'finalizado') return { error: 'partido ya finalizado' };
  // check deadline (1hr before match)
  const matchTime = new Date(partido.fecha + 'T' + partido.hora);
  const now = new Date();
  const deadline = new Date(matchTime.getTime() - 60 * 60 * 1000);
  if (now > deadline) return { error: 'deadline pasado' };
  // upsert
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

function getPredicciones(pid) {
  const all = getData('Predicciones');
  return all.filter(p => p.participante_id === pid);
}

function calcLeaderboard() {
  const partidos = getData('Partidos').filter(p => p.status === 'finalizado');
  const predicciones = getData('Predicciones');
  const users = getData('Participantes');
  const scores = {};
  users.forEach(u => { scores[u.id] = { alias: u.alias, nombre: u.nombre, exactos: 0, aciertos: 0, puntos: 0 }; });
  partidos.forEach(p => {
    const rL = Number(p.gol_local), rV = Number(p.gol_visitante);
    const realWinner = rL > rV ? 'L' : rL < rV ? 'V' : 'E';
    predicciones.filter(pr => pr.partido_id === p.partido_id).forEach(pr => {
      if (!scores[pr.participante_id]) return;
      const pL = Number(pr.gol_local), pV = Number(pr.gol_visitante);
      const predWinner = pL > pV ? 'L' : pL < pV ? 'V' : 'E';
      if (pL === rL && pV === rV) { scores[pr.participante_id].exactos++; scores[pr.participante_id].puntos += 5; }
      else if (predWinner === realWinner) { scores[pr.participante_id].aciertos++; scores[pr.participante_id].puntos += 2; }
    });
  });
  return Object.values(scores).sort((a, b) => b.puntos - a.puntos || b.exactos - a.exactos);
}

// run once to create tabs
function setup() {
  getSheet('Participantes');
  getSheet('Predicciones');
  getSheet('Partidos');
  getSheet('Config');
}
