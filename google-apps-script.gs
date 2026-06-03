/**
 * WATER HABIT - Google Apps Script
 * ================================
 * INSTRUCCIONES DE INSTALACIÓN:
 *
 * 1. Ve a script.google.com
 * 2. Crea un nuevo proyecto → pega TODO este código
 * 3. Cambia SHEET_NAME si quieres otro nombre de hoja
 * 4. Clic en "Implementar" → "Nueva implementación"
 * 5. Tipo: "Aplicación web"
 * 6. Ejecutar como: "Yo"
 * 7. Acceso: "Cualquier persona"
 * 8. Clic en "Implementar" → autoriza → copia la URL
 * 9. Pega esa URL en la app Water Habit (Perfil → Google Sheets)
 *
 * ESTRUCTURA DE LA HOJA:
 * Columnas: Fecha | Hora | Cantidad (ml) | Fuente | Total del día | ID
 */

const SHEET_NAME = 'Registros';
const SPREADSHEET_ID = ''; // Dejar vacío = usa la hoja del script

// -------------------------------------------------------
// POST handler: recibe datos desde la app o Atajos iPhone
// -------------------------------------------------------
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = registrarAgua(data);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('Error en doPost: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// -------------------------------------------------------
// GET handler: devuelve resumen del día actual
// -------------------------------------------------------
function doGet(e) {
  try {
    const params = e.parameter;
    if (params.action === 'today') {
      const summary = getResumenHoy();
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, summary }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'week') {
      const week = getResumenSemana();
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, week }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, message: 'Water Habit API activa ✓' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// -------------------------------------------------------
// Función principal: registra una entrada de agua
// -------------------------------------------------------
function registrarAgua(data) {
  // Validar datos
  if (!data.cantidad && !data.amount) throw new Error('Cantidad requerida');
  const cantidad = parseInt(data.cantidad || data.amount);
  if (isNaN(cantidad) || cantidad < 1 || cantidad > 5000) {
    throw new Error('Cantidad inválida: debe ser entre 1 y 5000 ml');
  }

  const sheet = getSheet();
  const ahora = new Date();
  const fechaStr = Utilities.formatDate(ahora, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  const horaStr = data.hora || Utilities.formatDate(ahora, Session.getScriptTimeZone(), 'HH:mm');
  const fuente = data.fuente || data.source || 'app';
  const id = Utilities.getUuid().substring(0, 8);

  // Calcular total del día ANTES de agregar
  const totalHoy = getTotalHoy(sheet, fechaStr) + cantidad;

  sheet.appendRow([
    fechaStr,
    horaStr,
    cantidad,
    fuente,
    totalHoy,
    id
  ]);

  Logger.log(`Registrado: ${cantidad}ml a las ${horaStr} (total hoy: ${totalHoy}ml)`);

  return {
    fecha: fechaStr,
    hora: horaStr,
    cantidad,
    totalHoy,
    fuente,
    id
  };
}

// -------------------------------------------------------
// Calcula el total de agua del día para una fecha dada
// -------------------------------------------------------
function getTotalHoy(sheet, fechaStr) {
  const data = sheet.getDataRange().getValues();
  let total = 0;
  for (let i = 1; i < data.length; i++) {
    const rowFecha = data[i][0];
    const rowFechaStr = typeof rowFecha === 'object'
      ? Utilities.formatDate(rowFecha, Session.getScriptTimeZone(), 'dd/MM/yyyy')
      : rowFecha;
    if (rowFechaStr === fechaStr) {
      total += parseInt(data[i][2]) || 0;
    }
  }
  return total;
}

// -------------------------------------------------------
// Resumen del día actual
// -------------------------------------------------------
function getResumenHoy() {
  const sheet = getSheet();
  const ahora = new Date();
  const fechaStr = Utilities.formatDate(ahora, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  const data = sheet.getDataRange().getValues();
  let total = 0, registros = 0;

  for (let i = 1; i < data.length; i++) {
    const rowFecha = data[i][0];
    const rowFechaStr = typeof rowFecha === 'object'
      ? Utilities.formatDate(rowFecha, Session.getScriptTimeZone(), 'dd/MM/yyyy')
      : rowFecha;
    if (rowFechaStr === fechaStr) {
      total += parseInt(data[i][2]) || 0;
      registros++;
    }
  }

  return { fecha: fechaStr, totalMl: total, registros, litros: (total / 1000).toFixed(2) };
}

// -------------------------------------------------------
// Resumen de la semana
// -------------------------------------------------------
function getResumenSemana() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const hoy = new Date();
  const semana = {};

  for (let d = 6; d >= 0; d--) {
    const dia = new Date(hoy);
    dia.setDate(hoy.getDate() - d);
    const key = Utilities.formatDate(dia, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    semana[key] = 0;
  }

  for (let i = 1; i < data.length; i++) {
    const rowFecha = data[i][0];
    const rowFechaStr = typeof rowFecha === 'object'
      ? Utilities.formatDate(rowFecha, Session.getScriptTimeZone(), 'dd/MM/yyyy')
      : rowFecha;
    if (semana.hasOwnProperty(rowFechaStr)) {
      semana[rowFechaStr] += parseInt(data[i][2]) || 0;
    }
  }

  return semana;
}

// -------------------------------------------------------
// Obtiene o crea la hoja de cálculo
// -------------------------------------------------------
function getSheet() {
  let ss;
  if (SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Encabezados con formato
    const headers = [['Fecha', 'Hora', 'Cantidad (ml)', 'Fuente', 'Total del día (ml)', 'ID']];
    sheet.getRange(1, 1, 1, 6).setValues(headers);
    sheet.getRange(1, 1, 1, 6)
      .setBackground('#0BCDF4')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 100);
    sheet.setColumnWidth(2, 70);
    sheet.setColumnWidth(3, 110);
    sheet.setColumnWidth(4, 90);
    sheet.setColumnWidth(5, 140);
    sheet.setColumnWidth(6, 90);
  }
  return sheet;
}

// -------------------------------------------------------
// Test manual: ejecuta desde el editor de Apps Script
// -------------------------------------------------------
function testRegistro() {
  const data = { cantidad: 500, fuente: 'test-manual' };
  const result = registrarAgua(data);
  Logger.log('Test OK: ' + JSON.stringify(result));
}
