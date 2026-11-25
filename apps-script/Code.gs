/** Deploy as a web app executing as the user accessing it; restrict access to yourself. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('Onda · Tu radio personal').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function librarySheet_() {
  const props = PropertiesService.getUserProperties();
  const id = props.getProperty('ONDA_SHEET_ID');
  if (id) return SpreadsheetApp.openById(id).getSheets()[0];
  const book = SpreadsheetApp.create('Onda · Biblioteca personal');
  props.setProperty('ONDA_SHEET_ID', book.getId());
  const sheet = book.getSheets()[0];
  sheet.setName('Biblioteca');
  sheet.getRange('A1').setValue('Biblioteca Onda (JSON)');
  return sheet;
}
function loadLibrary() {
  const lock = LockService.getUserLock(); lock.waitLock(10000);
  try {
    const sheet = librarySheet_(), value = sheet.getRange('A2').getValue();
    if (typeof value === 'string' && value.indexOf('ONDA_CHUNKS:') === 0) {
      const count = Number(value.split(':')[1]);
      if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error('Biblioteca dañada');
      return sheet.getRange(3,1,count,1).getValues().map(row=>String(row[0]).slice(6)).join('');
    }
    return value || null;
  }
  finally { lock.releaseLock(); }
}
function saveLibrary(json) {
  if (typeof json !== 'string' || json.length > 2000000) throw new Error('Biblioteca demasiado grande');
  const state = JSON.parse(json);
  if (state.version !== 1 || !Array.isArray(state.favorites) || state.favorites.length > 300 || !Array.isArray(state.schedule) || state.schedule.length > 100) throw new Error('Biblioteca no válida');
  // A2 indexes prefixed JSON chunks; the prefix prevents spreadsheet formula evaluation.
  const chunks = json.match(/[\s\S]{1,40000}/g) || [''];
  const lock = LockService.getUserLock(); lock.waitLock(10000);
  try {
    const sheet = librarySheet_();
    sheet.getRange(3,1,Math.max(sheet.getLastRow()-2,1),1).clearContent();
    sheet.getRange(3,1,chunks.length,1).setValues(chunks.map(c=>['CHUNK:'+c]));
    sheet.getRange('A2').setValue('ONDA_CHUNKS:' + chunks.length);
  } finally { lock.releaseLock(); }
  return true;
}
