import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAppsScript, plain } from './loadAppsScript.js';

const { get } = loadAppsScript(['Schema.js', 'Validation.js']);
const validateEvent = (...a) => plain(get('validateEvent')(...a));
const validatePhoto = (...a) => plain(get('validatePhoto')(...a));
const toSheetDate = get('toSheetDate');
const sheetDateToInput = get('sheetDateToInput');

test('dates: YYYY-MM-DD becomes M/D/YYYY without leading zeros', () => {
  assert.equal(toSheetDate('2025-03-07'), '3/7/2025');
  assert.equal(toSheetDate('2025-11-20'), '11/20/2025');
});

test('dates: already formatted M/D/YYYY is accepted', () => {
  assert.equal(toSheetDate('3/7/2025'), '3/7/2025');
  assert.equal(toSheetDate('11/20/2024'), '11/20/2024');
});

test('dates: impossible or malformed dates are rejected', () => {
  for (const bad of ['', '2025-02-30', '2025-13-01', '31/12/2025', 'mañana', '2025-3-7x', null, undefined]) {
    assert.equal(toSheetDate(bad), null, String(bad));
  }
});

test('dates: sheet format converts back to the date input format', () => {
  assert.equal(sheetDateToInput('3/7/2025'), '2025-03-07');
  assert.equal(sheetDateToInput('nope'), '');
});

test('valid torneo: values are trimmed, date converted, default status applied', () => {
  const r = validateEvent('torneos', { fecha: '2025-10-15', nombre: '  Copa Ul-ji ', lugar: 'Club', costo: '$15.000' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.errors, {});
  assert.equal(r.values.fecha, '10/15/2025');
  assert.equal(r.values.nombre, 'Copa Ul-ji');
  assert.equal(r.values.estado, 'Inscripciones Abiertas');
  assert.equal('id' in r.values, false);
});

test('valid examen and seminario need only their required fields', () => {
  assert.equal(validateEvent('examenes', { fecha: '2025-11-20', tipo: 'Presencial', lugar: 'Centro' }).ok, true);
  assert.equal(validateEvent('seminarios', { fecha: '2025-11-12', titulo: 'Encuentro', lugar: 'Palermo' }).ok, true);
});

test('missing required fields are named per field in Spanish', () => {
  const r = validateEvent('torneos', { fecha: '', nombre: ' ', lugar: '' });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ['fecha', 'lugar', 'nombre']);
  assert.match(r.errors.nombre, /obligatorio/i);
});

test('bad date gives a date format error', () => {
  const r = validateEvent('examenes', { fecha: '2025-02-31', tipo: 'x', lugar: 'y' });
  assert.equal(r.ok, false);
  assert.match(r.errors.fecha, /fecha/i);
  assert.deepEqual(Object.keys(r.errors), ['fecha']);
});

test('overly long text is rejected', () => {
  const r = validateEvent('seminarios', { fecha: '2025-11-12', titulo: 'x'.repeat(300), lugar: 'y' });
  assert.match(r.errors.titulo, /caracteres/);
});

test('unknown event type throws', () => {
  assert.throws(() => get('validateEvent')('cursos', {}), /cursos/);
});

const photo = {
  title: 'Entrenamiento',
  description: '',
  thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_limit,w_600/v1/a.jpg',
  fullSize: 'https://res.cloudinary.com/demo/image/upload/v1/a.jpg',
  alt: 'Alumnos entrenando',
  category: 'training',
  date: '2025-05-01',
  nivel: '',
  tags: 'dojang, clase'
};

test('valid photo converts the date', () => {
  const r = validatePhoto(photo);
  assert.equal(r.ok, true);
  assert.equal(r.values.date, '5/1/2025');
  assert.equal(r.values.category, 'training');
});

test('photo requires title, alt, thumbnail, category and date', () => {
  const r = validatePhoto({});
  assert.deepEqual(Object.keys(r.errors).sort(), ['alt', 'category', 'date', 'thumbnail', 'title']);
});

test('photo with empty alt is rejected', () => {
  const r = validatePhoto({ ...photo, alt: '  ' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.alt);
});

test('photo category must be in the allowed list', () => {
  assert.ok(validatePhoto({ ...photo, category: 'videos' }).errors.category);
});

test('photo urls must be https Cloudinary urls', () => {
  assert.ok(validatePhoto({ ...photo, thumbnail: 'http://res.cloudinary.com/x/a.jpg' }).errors.thumbnail);
  assert.ok(validatePhoto({ ...photo, thumbnail: 'https://evil.example.com/a.jpg' }).errors.thumbnail);
  assert.ok(validatePhoto({ ...photo, fullSize: 'https://evil.example.com/a.jpg' }).errors.fullSize);
});
