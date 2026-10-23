/**
 * Pure server-side validators. Messages are in Spanish because the UI shows
 * them as-is next to each field.
 */

const MAX_SHORT = 200;
const MAX_LONG = 2000;
const LONG_FIELDS = ['requisitos', 'descripcion', 'description', 'tema'];
const CLOUDINARY_URL = /^https:\/\/res\.cloudinary\.com\//;

const REQUIRED_EVENT_FIELDS = {
  examenes: { fecha: 'La fecha', tipo: 'El tipo', lugar: 'El lugar' },
  torneos: { fecha: 'La fecha', nombre: 'El nombre', lugar: 'El lugar' },
  seminarios: { fecha: 'La fecha', titulo: 'El título', lugar: 'El lugar' }
};

const REQUIRED_PHOTO_FIELDS = {
  title: 'El título',
  alt: 'El texto alternativo',
  thumbnail: 'La imagen',
  category: 'La categoría',
  date: 'La fecha'
};

/**
 * Converts a date to the sheet format M/D/YYYY (no leading zeros).
 * Accepts YYYY-MM-DD (date input), an ISO timestamp (date part used) or M/D/YYYY.
 * @param {*} input
 * @returns {string|null} null when not a real calendar date
 */
function toSheetDate(input) {
  const text = String(input === null || input === undefined ? '' : input).trim();
  let year, month, day;
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/.exec(text);
  if (match) {
    year = +match[1]; month = +match[2]; day = +match[3];
  } else if ((match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text))) {
    month = +match[1]; day = +match[2]; year = +match[3];
  } else {
    return null;
  }
  const d = new Date(Date.UTC(year, month - 1, day));
  const real = d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
  return real ? month + '/' + day + '/' + year : null;
}

/**
 * Converts a sheet date (M/D/YYYY) to YYYY-MM-DD for a date input.
 * @param {string} text
 * @returns {string} Empty string when it cannot be parsed
 */
function sheetDateToInput(text) {
  const sheetDate = toSheetDate(text);
  if (!sheetDate) return '';
  const parts = sheetDate.split('/');
  return parts[2] + '-' + ('0' + parts[0]).slice(-2) + '-' + ('0' + parts[1]).slice(-2);
}

function cleanText(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function checkLength(field, value, errors) {
  const max = LONG_FIELDS.indexOf(field) !== -1 ? MAX_LONG : MAX_SHORT;
  if (value.length > max) errors[field] = 'No puede superar los ' + max + ' caracteres.';
}

/**
 * Validates an event submission.
 * @param {string} type - examenes | torneos | seminarios
 * @param {Object} data - Raw form data
 * @returns {{ok: boolean, errors: Object, values: Object}} values has cleaned fields except id
 */
function validateEvent(type, data) {
  const schema = EVENT_SCHEMAS[type];
  if (!schema) throw new Error('Tipo de evento desconocido: "' + type + '"');

  const errors = {};
  const values = {};
  Object.keys(schema.fields).forEach(function (field) {
    if (field === 'id') return;
    values[field] = cleanText(data && data[field]) || schema.fields[field].default || '';
    checkLength(field, values[field], errors);
  });

  const required = REQUIRED_EVENT_FIELDS[type];
  Object.keys(required).forEach(function (field) {
    if (!values[field] && !errors[field]) errors[field] = required[field] + ' es obligatorio.';
  });

  if (values.fecha && !errors.fecha) {
    const date = toSheetDate(values.fecha);
    if (date) values.fecha = date;
    else errors.fecha = 'La fecha no es válida. Usá el formato día/mes/año del selector.';
  }
  return { ok: Object.keys(errors).length === 0, errors: errors, values: values };
}

/**
 * Validates a photo submission.
 * @param {Object} data - Raw form data
 * @returns {{ok: boolean, errors: Object, values: Object}} values has cleaned fields except id
 */
function validatePhoto(data) {
  const errors = {};
  const values = {};
  Object.keys(PHOTO_SCHEMA.fields).forEach(function (field) {
    if (field === 'id') return;
    values[field] = cleanText(data && data[field]);
    checkLength(field, values[field], errors);
  });

  Object.keys(REQUIRED_PHOTO_FIELDS).forEach(function (field) {
    if (!values[field] && !errors[field]) errors[field] = REQUIRED_PHOTO_FIELDS[field] + ' es obligatorio.';
  });

  ['thumbnail', 'fullSize'].forEach(function (field) {
    if (values[field] && !CLOUDINARY_URL.test(values[field])) {
      errors[field] = 'Debe ser una URL https de Cloudinary.';
    }
  });

  if (values.category && PHOTO_CATEGORIES.indexOf(values.category) === -1) {
    errors.category = 'La categoría debe ser una de: ' + PHOTO_CATEGORIES.join(', ') + '.';
  }

  if (values.date && !errors.date) {
    const iso = sheetDateToInput(values.date);
    // Noon UTC never shows as the previous day in Argentina (UTC-3)
    if (iso) values.date = iso + 'T12:00:00Z';
    else errors.date = 'La fecha no es válida. Usá el formato día/mes/año del selector.';
  }
  return { ok: Object.keys(errors).length === 0, errors: errors, values: values };
}
