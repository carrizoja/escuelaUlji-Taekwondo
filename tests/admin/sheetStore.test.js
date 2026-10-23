import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAppsScript, plain } from './loadAppsScript.js';

const FILES = ['Schema.js', 'SheetStore.js'];
const torneoHeaders = ['fecha', 'nombre', 'categoria', 'lugar', 'inscripcion', 'premio', 'costo', 'nivel', 'modalidad', 'estado', 'id'];
const torneoRow = ['10/15/2025', 'Copa Ul-ji', 'Todas', 'Club', 'Hasta 10/10', 'Medallas', '$15.000', 'Todos', 'Combate', 'Abiertas', 'a1b2'];

function setup(extraGlobals = {}) {
  const loaded = loadAppsScript(FILES.concat('Validation.js'), { Utilities: { getUuid: () => 'new-uuid' }, ...extraGlobals });
  return { ...loaded, schemas: loaded.get('EVENT_SCHEMAS') };
}

/** Minimal in-memory Sheet implementing only what SheetStore uses. */
function fakeSheet(values, typedColumns = []) {
  const writes = [];
  const formats = [];
  return {
    values, writes, formats,
    getDataRange: () => ({ getDisplayValues: () => values.map(r => [...r]) }),
    getLastRow: () => values.length,
    getRange(row, col) {
      return {
        // Sheets Tables reject format changes on typed columns, and the error can
        // surface after the call, so the store must never change formats.
        setNumberFormat(f) { formats.push({ row, col, f, typed: typedColumns.includes(col) }); return this; },
        setValue(v) {
          writes.push({ row, col, v });
          while (values.length < row) values.push([]);
          values[row - 1][col - 1] = v;
          return this;
        }
      };
    },
    deleteRow: row => { values.splice(row - 1, 1); writes.push({ deleted: row }); }
  };
}

test('mapHeaders maps reordered, case-varied headers to column indexes', () => {
  const { get, schemas } = setup();
  const headers = [...torneoHeaders].reverse().map(h => ` ${h.toUpperCase()} `);
  const { columns } = plain(get('mapHeaders')('Torneos', headers, schemas.torneos));
  assert.equal(columns.id, 0);
  assert.equal(columns.fecha, torneoHeaders.length - 1);
});

test('mapHeaders throws naming the tab and the missing header', () => {
  const { get, schemas } = setup();
  const headers = torneoHeaders.filter(h => h !== 'premio');
  assert.throws(() => get('mapHeaders')('Torneos', headers, schemas.torneos), /Torneos.*premio/);
});

test('mapHeaders tolerates an absent optional header', () => {
  const { get, schemas } = setup();
  const headers = ['id', 'fecha', 'tipo', 'grado', 'lugar', 'hora', 'requisitos'];
  const { columns } = plain(get('mapHeaders')('Examenes', headers, schemas.examenes));
  assert.equal(columns.estado, -1);
});

test('readRecords maps rows by header and skips blank rows', () => {
  const { get, schemas } = setup();
  const sheet = fakeSheet([torneoHeaders, torneoRow, ['', '', '', '', '', '', '', '', '', '', '']]);
  const records = plain(get('readRecords')(sheet, schemas.torneos));
  assert.equal(records.length, 1);
  assert.equal(records[0].id, 'a1b2');
  assert.equal(records[0].premio, 'Medallas');
  assert.equal(records[0].rowNumber, 2);
});

test('appendRecord writes a new uuid and only known columns, without changing formats', () => {
  const { get, schemas } = setup();
  const sheet = fakeSheet([[...torneoHeaders, 'notas'], torneoRow]);
  const rec = plain(get('appendRecord')(sheet, schemas.torneos, { fecha: '1/2/2026', nombre: 'Nuevo' }));
  assert.equal(rec.id, 'new-uuid');
  assert.ok(sheet.writes.every(w => w.row === 3 && w.col <= torneoHeaders.length));
  assert.equal(sheet.formats.length, 0);
  assert.equal(sheet.values[2][torneoHeaders.indexOf('id')], 'new-uuid');
});

test('updateRecord changes only the row with that id and keeps unknown columns', () => {
  const { get, schemas } = setup();
  const other = [...torneoRow]; other[10] = 'zzzz';
  const sheet = fakeSheet([[...torneoHeaders, 'notas'], [...torneoRow, 'keep me'], [...other, 'x']]);
  get('updateRecord')(sheet, schemas.torneos, 'a1b2', { nombre: 'Editado', id: 'hacked' });
  assert.equal(sheet.values[1][1], 'Editado');
  assert.equal(sheet.values[1][10], 'a1b2');
  assert.equal(sheet.values[1][11], 'keep me');
  assert.equal(sheet.values[2][1], 'Copa Ul-ji');
});

test('updateRecord and deleteRecord fail for an unknown id without writing', () => {
  const { get, schemas } = setup();
  const sheet = fakeSheet([torneoHeaders, torneoRow]);
  assert.throws(() => get('updateRecord')(sheet, schemas.torneos, 'nope', { nombre: 'x' }), /no se encontró/i);
  assert.throws(() => get('deleteRecord')(sheet, schemas.torneos, 'nope'), /no se encontró/i);
  assert.equal(sheet.writes.length, 0);
});

test('deleteRecord removes the row with that id', () => {
  const { get, schemas } = setup();
  const sheet = fakeSheet([torneoHeaders, torneoRow]);
  get('deleteRecord')(sheet, schemas.torneos, 'a1b2');
  assert.equal(sheet.values.length, 1);
});

test('a broken header writes nothing', () => {
  const { get, schemas } = setup();
  const sheet = fakeSheet([torneoHeaders.filter(h => h !== 'premio'), torneoRow.slice(0, 10)]);
  assert.throws(() => get('appendRecord')(sheet, schemas.torneos, { nombre: 'x' }), /premio/);
  assert.equal(sheet.writes.length, 0);
});

test('event dates are written as real date cells', () => {
  const { get, schemas } = setup();
  const sheet = fakeSheet([torneoHeaders, torneoRow]);
  get('appendRecord')(sheet, schemas.torneos, { fecha: '3/7/2026', nombre: 'Nuevo' });
  const col = torneoHeaders.indexOf('fecha') + 1;
  const value = sheet.values[2][col - 1];
  assert.equal(Object.prototype.toString.call(value), '[object Date]');
  assert.deepEqual([value.getFullYear(), value.getMonth(), value.getDate()], [2026, 2, 7]);
  assert.equal(sheet.formats.length, 0);
});

test('photo dates stay text', () => {
  const { get } = setup();
  const sheet = fakeSheet([['id', 'title', 'thumbnail', 'alt', 'category', 'date', 'description', 'fullSize', 'nivel', 'tags'], []]);
  get('appendRecord')(sheet, get('PHOTO_SCHEMA'), { title: 't', date: '2025-05-01T12:00:00Z' });
  assert.equal(sheet.values[2][5], '2025-05-01T12:00:00Z');
  assert.equal(sheet.formats.length, 0);
});

test('appendRecord still writes every value when columns are typed (Sheets Tables)', () => {
  const { get, schemas } = setup();
  // fecha (col 1) is a typed Date column, nombre..modalidad (cols 2-9) typed Text
  const sheet = fakeSheet([torneoHeaders, torneoRow], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const saved = plain(get('appendRecord')(sheet, schemas.torneos, {
    fecha: '11/20/2026', nombre: 'Copa', categoria: 'Todas', lugar: 'Club', inscripcion: '',
    premio: '', costo: '', nivel: '', modalidad: '', estado: ''
  }));
  const row3 = sheet.writes.filter(w => w.row === 3);
  assert.equal(saved.id, 'new-uuid');
  assert.equal(row3.length, torneoHeaders.length);
  assert.equal(Object.prototype.toString.call(row3.find(w => w.col === 1).v), '[object Date]');
  assert.equal(row3.find(w => w.col === 2).v, 'Copa');
  assert.equal(row3.find(w => w.col === 11).v, 'new-uuid');
  assert.equal(sheet.formats.length, 0);
});
