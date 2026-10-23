import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildRegistrationMessage } from '../src/utils/eventRegistration.js'

test('names the event and its date', () => {
  assert.equal(
    buildRegistrationMessage({ name: 'Torneo Nacional', date: '20 ago 2025' }),
    'Hola, quiero inscribirme en Torneo Nacional del 20 ago 2025'
  )
})

test('omits the date when it is missing', () => {
  assert.equal(
    buildRegistrationMessage({ name: 'Seminario de Tul', date: '' }),
    'Hola, quiero inscribirme en Seminario de Tul'
  )
})

test('falls back to a generic message without a name', () => {
  assert.equal(
    buildRegistrationMessage({ name: '', date: '' }),
    'Hola, quiero inscribirme en un evento de la escuela'
  )
})

test('trims whitespace around name and date', () => {
  assert.equal(
    buildRegistrationMessage({ name: '  Torneo  ', date: ' 1 ene 2026 ' }),
    'Hola, quiero inscribirme en Torneo del 1 ene 2026'
  )
})
