import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSheetRows, EVENT_SCHEMAS } from '../src/utils/sheetRows.js';

const torneoHeaders = ['fecha', 'nombre', 'categoria', 'lugar', 'inscripcion', 'premio', 'costo', 'nivel', 'modalidad', 'estado', 'id'];
const torneoRow = ['10/15/2025', 'Copa Ul-ji', 'Todas', 'Club', 'Hasta 10/10', 'Medallas', '$15.000', 'Todos', 'Combate', 'Inscripciones Abiertas', 'a1b2'];

test('maps cells by header name', () => {
  const [torneo] = parseSheetRows('Torneos', [torneoHeaders, torneoRow], EVENT_SCHEMAS.torneos);
  assert.equal(torneo.id, 'a1b2');
  assert.equal(torneo.premio, 'Medallas');
  assert.equal(torneo.costo, '$15.000');
  assert.equal(torneo.estado, 'Inscripciones Abiertas');
});

test('reordered columns give the same result', () => {
  const order = [...torneoHeaders.keys()].reverse();
  const reordered = [order.map(i => torneoHeaders[i]), order.map(i => torneoRow[i])];
  assert.deepEqual(
    parseSheetRows('Torneos', reordered, EVENT_SCHEMAS.torneos),
    parseSheetRows('Torneos', [torneoHeaders, torneoRow], EVENT_SCHEMAS.torneos)
  );
});

test('header matching ignores case and surrounding spaces', () => {
  const headers = torneoHeaders.map(h => ` ${h.toUpperCase()} `);
  const [torneo] = parseSheetRows('Torneos', [headers, torneoRow], EVENT_SCHEMAS.torneos);
  assert.equal(torneo.nombre, 'Copa Ul-ji');
});

test('missing required header throws naming the header and tab', () => {
  const headers = torneoHeaders.filter(h => h !== 'premio');
  assert.throws(
    () => parseSheetRows('Torneos', [headers], EVENT_SCHEMAS.torneos),
    /Torneos.*premio/
  );
});

test('sheet without a header row throws', () => {
  assert.throws(() => parseSheetRows('Torneos', [], EVENT_SCHEMAS.torneos), /Torneos/);
});

test('optional column falls back to its default', () => {
  const headers = ['id', 'fecha', 'tipo', 'grado', 'lugar', 'hora', 'requisitos'];
  const [examen] = parseSheetRows('Examenes', [headers, ['x1', '5/14/2025', 'Kup', '10 Kup', 'Dojang', '9:00', 'Ninguno']], EVENT_SCHEMAS.examenes);
  assert.equal(examen.estado, 'Programado');
  assert.equal(examen.id, 'x1');
});

test('empty cell uses the default and short rows are padded', () => {
  const row = torneoRow.slice(0, 9);
  const [torneo] = parseSheetRows('Torneos', [torneoHeaders, row], EVENT_SCHEMAS.torneos);
  assert.equal(torneo.estado, 'Inscripciones Abiertas');
  assert.equal(torneo.id, 'torneos-row-2');
});

test('blank rows are skipped', () => {
  const rows = parseSheetRows('Torneos', [torneoHeaders, [], ['', ' '], torneoRow], EVENT_SCHEMAS.torneos);
  assert.equal(rows.length, 1);
});

test('row without id gets a row-based fallback id', () => {
  const row = [...torneoRow.slice(0, 10), ''];
  const [torneo] = parseSheetRows('Torneos', [torneoHeaders, torneoRow, row], EVENT_SCHEMAS.torneos).slice(1);
  assert.equal(torneo.id, 'torneos-row-3');
});

test('values are trimmed', () => {
  const row = torneoRow.map(v => `  ${v} `);
  const [torneo] = parseSheetRows('Torneos', [torneoHeaders, row], EVENT_SCHEMAS.torneos);
  assert.equal(torneo.nombre, 'Copa Ul-ji');
});
