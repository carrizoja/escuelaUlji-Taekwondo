/**
 * Sheet access layer. Columns are found by header name (case and surrounding
 * spaces ignored), never by position, so reordering columns is safe.
 *
 * Writes only touch known columns (unknown columns are preserved). Values are
 * written as text so the spreadsheet locale cannot reinterpret them, except
 * event dates: those cells are real dates (shown as M/D/YYYY) like the
 * existing rows. Photo dates are ISO text (the gallery parses them).
 */

const EVENT_DATE_FORMAT = 'M/d/yyyy';

function normalizeHeader(value) {
  return String(value === null || value === undefined ? '' : value).trim().toLowerCase();
}

/**
 * Maps schema fields to column indexes (0-based; -1 for an absent optional one).
 * @param {string} tabName - Used in error messages
 * @param {Array} headerRow
 * @param {Object} schema - Entry of EVENT_SCHEMAS or PHOTO_SCHEMA
 * @returns {{columns: Object, width: number}}
 * @throws {Error} Naming the tab and every missing required header
 */
function mapHeaders(tabName, headerRow, schema) {
  if (!headerRow || headerRow.length === 0) {
    throw new Error('La hoja "' + tabName + '" no tiene fila de encabezados.');
  }
  const headers = headerRow.map(normalizeHeader);
  const columns = {};
  const missing = [];
  Object.keys(schema.fields).forEach(function (field) {
    const index = headers.indexOf(field.toLowerCase());
    if (index === -1 && !schema.fields[field].optional) missing.push(field);
    columns[field] = index;
  });
  if (missing.length > 0) {
    throw new Error('A la hoja "' + tabName + '" le falta el encabezado: ' + missing.join(', ') + '. No se guardó nada.');
  }
  return { columns: columns, width: headers.length };
}

/**
 * Opens the sheet tab for a schema.
 * @param {Object} schema
 * @returns {Sheet}
 */
function openSheet(schema) {
  const key = schema === PHOTO_SCHEMA ? 'PHOTOS_SHEET_ID' : 'EVENTS_SHEET_ID';
  const sheet = SpreadsheetApp.openById(getConfig(key)).getSheetByName(schema.tab);
  if (!sheet) throw new Error('No existe la pestaña "' + schema.tab + '" en la planilla.');
  return sheet;
}

/**
 * Reads all non-blank rows as objects keyed by field.
 * @returns {Array<Object>} Each with its fields plus rowNumber (1-based sheet row)
 */
function readRecords(sheet, schema) {
  const rows = sheet.getDataRange().getDisplayValues();
  const mapped = mapHeaders(schema.tab, rows[0], schema);
  const records = [];
  rows.slice(1).forEach(function (row, i) {
    if (row.every(function (cell) { return String(cell).trim() === ''; })) return;
    const record = { rowNumber: i + 2 };
    Object.keys(schema.fields).forEach(function (field) {
      const index = mapped.columns[field];
      record[field] = index === -1 ? '' : String(row[index] === undefined ? '' : row[index]).trim();
    });
    records.push(record);
  });
  return records;
}

/** Builds a date in the script time zone from M/D/YYYY. */
function sheetDateToDate(text) {
  const p = text.split('/');
  return new Date(+p[2], +p[0] - 1, +p[1]);
}

/**
 * Applies a number format, skipping cells in typed columns of a Sheets Table:
 * those reject format changes and already enforce their own type.
 */
function trySetNumberFormat(cell, format) {
  try {
    cell.setNumberFormat(format);
  } catch (err) {
    if (!/typed column/i.test(String(err && err.message))) throw err;
  }
  return cell;
}

/** Writes values into the known columns of a row. */
function writeCells(sheet, schema, rowNumber, columns, values) {
  Object.keys(values).forEach(function (field) {
    const index = columns[field];
    if (index === undefined || index === -1) return;
    const cell = sheet.getRange(rowNumber, index + 1);
    if (schema !== PHOTO_SCHEMA && field === 'fecha' && toSheetDate(values[field])) {
      trySetNumberFormat(cell, EVENT_DATE_FORMAT).setValue(sheetDateToDate(toSheetDate(values[field])));
    } else {
      trySetNumberFormat(cell, '@').setValue(values[field]);
    }
  });
}

function findRowNumber(sheet, schema, id) {
  const rows = sheet.getDataRange().getDisplayValues();
  const mapped = mapHeaders(schema.tab, rows[0], schema);
  for (let i = 1; i < rows.length; i++) {
    if (id && String(rows[i][mapped.columns.id]).trim() === id) {
      return { rowNumber: i + 1, columns: mapped.columns };
    }
  }
  throw new Error('No se encontró el registro en "' + schema.tab + '". Puede haber sido eliminado; actualizá la lista.');
}

/**
 * Appends a record with a new UUID.
 * @returns {Object} The saved values including id
 */
function appendRecord(sheet, schema, values) {
  const mapped = mapHeaders(schema.tab, sheet.getDataRange().getDisplayValues()[0], schema);
  const record = Object.assign({}, values, { id: Utilities.getUuid() });
  writeCells(sheet, schema, sheet.getLastRow() + 1, mapped.columns, record);
  return record;
}

/**
 * Updates the row with the given id; the id itself never changes.
 */
function updateRecord(sheet, schema, id, values) {
  const found = findRowNumber(sheet, schema, id);
  const changes = Object.assign({}, values);
  delete changes.id;
  writeCells(sheet, schema, found.rowNumber, found.columns, changes);
  return Object.assign({}, changes, { id: id });
}

/** Deletes the row with the given id. */
function deleteRecord(sheet, schema, id) {
  sheet.deleteRow(findRowNumber(sheet, schema, id).rowNumber);
}
