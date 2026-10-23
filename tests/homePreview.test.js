import { test } from 'node:test'
import assert from 'node:assert/strict'
import { selectPreviewEvents, buildScheduleRows, parseEventDate } from '../src/utils/homePreview.js'

const NOW = new Date('2025-06-15T12:00:00')

const data = {
  examenes: [
    { id: '1', fecha: '7/10/2025', tipo: 'Examen de Grado', grado: '8° Gup', lugar: 'La Grieta', hora: '18:00', estado: 'Programado' },
    { id: '2', fecha: '3/1/2025', tipo: 'Examen de Grado', grado: '9° Gup', lugar: 'La Grieta', hora: '18:00', estado: 'Programado' },
  ],
  torneos: [
    { id: '3', fecha: '8/20/2025', nombre: 'Torneo Nacional', categoria: 'Infantil', lugar: 'Córdoba', estado: 'Inscripciones Abiertas' },
    { id: '4', fecha: '2/2/2025', nombre: 'Torneo Viejo', categoria: 'Adultos', lugar: 'Salta', estado: 'Inscripciones abiertas' },
  ],
  seminarios: [
    { id: '5', fecha: '6/30/2025', titulo: 'Seminario de Tul', maestro: 'M. Pérez', lugar: 'Congreso' },
    { id: '6', fecha: 'not a date', titulo: 'Sin fecha', maestro: '', lugar: '' },
  ],
}

test('parseEventDate returns null for empty or invalid values', () => {
  assert.equal(parseEventDate(''), null)
  assert.equal(parseEventDate(undefined), null)
  assert.equal(parseEventDate('not a date'), null)
  assert.ok(parseEventDate('10/15/2025') instanceof Date)
})

test('selects the nearest upcoming events across types, soonest first', () => {
  const items = selectPreviewEvents(data, { now: NOW, limit: 3 })
  assert.deepEqual(items.map((e) => e.id), ['5', '1', '3'])
  assert.deepEqual(items.map((e) => e.type), ['Seminario', 'Examen', 'Torneo'])
})

test('respects the limit', () => {
  assert.equal(selectPreviewEvents(data, { now: NOW, limit: 2 }).length, 2)
})

test('falls back to the most recent past events when none are upcoming', () => {
  const later = new Date('2026-01-01T00:00:00')
  const items = selectPreviewEvents(data, { now: later, limit: 2 })
  assert.deepEqual(items.map((e) => e.id), ['3', '1'])
})

test('skips events without a valid date', () => {
  const items = selectPreviewEvents(data, { now: NOW, limit: 10 })
  assert.ok(!items.some((e) => e.id === '6'))
})

test('open status is kept for upcoming events and marked open', () => {
  const torneo = selectPreviewEvents(data, { now: NOW, limit: 3 }).find((e) => e.id === '3')
  assert.equal(torneo.status, 'Inscripciones Abiertas')
  assert.equal(torneo.statusOpen, true)
})

test('past events with an open status become Finalizado and are not open', () => {
  const later = new Date('2026-01-01T00:00:00')
  const torneo = selectPreviewEvents(data, { now: later, limit: 3 }).find((e) => e.id === '3')
  assert.equal(torneo.status, 'Finalizado')
  assert.equal(torneo.statusOpen, false)
})

test('past scheduled exams become Finalizado', () => {
  const later = new Date('2026-01-01T00:00:00')
  const examen = selectPreviewEvents(data, { now: later, limit: 3 }).find((e) => e.id === '1')
  assert.equal(examen.status, 'Finalizado')
})

test('seminars without a status carry no status label while upcoming', () => {
  const s = selectPreviewEvents(data, { now: NOW, limit: 3 }).find((e) => e.id === '5')
  assert.equal(s.status, '')
  assert.equal(s.statusOpen, false)
})

test('titles and details come from the sheet fields', () => {
  const items = selectPreviewEvents(data, { now: NOW, limit: 3 })
  const byId = Object.fromEntries(items.map((e) => [e.id, e]))
  assert.equal(byId['3'].title, 'Torneo Nacional')
  assert.equal(byId['3'].detail, 'Córdoba')
  assert.equal(byId['5'].title, 'Seminario de Tul')
  assert.equal(byId['1'].title, 'Examen de Grado · 8° Gup')
  assert.equal(byId['1'].detail, 'La Grieta · 18:00')
})

test('returns an empty list when there are no events', () => {
  assert.deepEqual(selectPreviewEvents({ examenes: [], torneos: [], seminarios: [] }, { now: NOW }), [])
})

const dojangs = [
  {
    name: 'Dojang A',
    address: { neighborhood: 'Congreso' },
    schedules: {
      classes: [
        { category: 'Infantiles', ageRange: '6-12 años', days: ['lunes', 'miércoles'], time: '18:30 - 19:40' },
        { category: 'Juveniles y Adultos', ageRange: '13+ años', days: ['martes'], time: '18:00- 19:00' },
      ],
    },
  },
]

test('buildScheduleRows flattens every class of every dojang', () => {
  const rows = buildScheduleRows(dojangs)
  assert.equal(rows.length, 2)
  assert.deepEqual(rows[0], {
    group: 'Infantiles',
    ageRange: '6-12 años',
    days: 'Lunes y miércoles',
    time: '18:30 - 19:40',
    venue: 'Dojang A',
    neighborhood: 'Congreso',
  })
})

test('buildScheduleRows normalizes spacing around the time range dash', () => {
  assert.equal(buildScheduleRows(dojangs)[1].time, '18:00 - 19:00')
})

test('buildScheduleRows joins three or more days with commas and "y"', () => {
  const d = [{ name: 'X', address: { neighborhood: 'Y' }, schedules: { classes: [{ category: 'C', ageRange: '', days: ['lunes', 'martes', 'jueves'], time: '1' }] } }]
  assert.equal(buildScheduleRows(d)[0].days, 'Lunes, martes y jueves')
})
