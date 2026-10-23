/**
 * Header-based parsing of Google Sheets rows.
 *
 * The headers listed here must match GOOGLE_SHEETS_SETUP.md, which is the
 * single source of truth for the events spreadsheet. Columns are matched by
 * header name (case and surrounding spaces ignored), so their order in the
 * sheet does not matter.
 *
 * Kept free of import.meta.env so it can be unit tested with `node --test`.
 */

// Field name = header name in the sheet. `optional` columns may be absent;
// `default` is used when the cell is empty or the column is absent.
export const EVENT_SCHEMAS = {
  examenes: {
    key: 'examenes',
    tab: 'Examenes',
    fields: {
      id: {},
      fecha: {},
      tipo: {},
      grado: {},
      lugar: {},
      hora: {},
      requisitos: {},
      estado: { optional: true, default: 'Programado' }
    }
  },
  torneos: {
    key: 'torneos',
    tab: 'Torneos',
    fields: {
      id: {},
      fecha: {},
      nombre: {},
      categoria: {},
      lugar: {},
      inscripcion: {},
      premio: {},
      costo: {},
      nivel: {},
      modalidad: {},
      estado: { default: 'Inscripciones Abiertas' }
    }
  },
  seminarios: {
    key: 'seminarios',
    tab: 'Seminarios',
    fields: {
      id: {},
      fecha: {},
      titulo: {},
      maestro: {},
      tema: {},
      duracion: {},
      costo: {},
      lugar: {},
      cupos: {},
      nivel: {},
      descripcion: {}
    }
  }
};

const normalize = value => String(value ?? '').trim();

/**
 * Converts raw sheet rows (header row first) into objects keyed by field.
 * @param {string} tabName - Tab name, used in error messages
 * @param {Array<Array<string>>} rows - Values as returned by the Sheets API
 * @param {Object} schema - One of EVENT_SCHEMAS
 * @returns {Array<Object>} One object per non-blank row
 * @throws {Error} When the header row or a required header is missing
 */
export function parseSheetRows(tabName, rows, schema) {
  const [headerRow, ...dataRows] = rows ?? [];
  if (!headerRow || headerRow.length === 0) {
    throw new Error(`Sheet tab "${tabName}" has no header row`);
  }

  const headers = headerRow.map(h => normalize(h).toLowerCase());
  const columns = {};
  const missing = [];

  for (const [field, options] of Object.entries(schema.fields)) {
    const index = headers.indexOf(field);
    if (index === -1 && !options.optional) missing.push(field);
    columns[field] = index;
  }

  if (missing.length > 0) {
    throw new Error(`Sheet tab "${tabName}" is missing required header(s): ${missing.join(', ')}`);
  }

  const result = [];
  dataRows.forEach((row, i) => {
    const cells = (row ?? []).map(normalize);
    if (cells.every(cell => cell === '')) return;

    // Sheet row number: +2 for the header row and 1-based numbering
    const sheetRow = i + 2;
    const item = {};
    for (const [field, options] of Object.entries(schema.fields)) {
      const index = columns[field];
      const value = index === -1 ? '' : cells[index] ?? '';
      item[field] = value || options.default || '';
    }

    if (!item.id) {
      item.id = `${schema.key}-row-${sheetRow}`;
      console.warn(`Sheet tab "${tabName}" row ${sheetRow} has no id; using "${item.id}"`);
    }

    result.push(item);
  });

  return result;
}
