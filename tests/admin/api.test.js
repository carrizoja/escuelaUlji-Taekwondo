import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAppsScript, plain } from './loadAppsScript.js';

const FILES = ['Schema.js', 'Validation.js', 'SheetStore.js', 'Lock.js', 'Cloudinary.js', 'GitHub.js', 'Api.js'];

function setup() {
  const calls = [];
  const lock = { tryLock: () => true, releaseLock: () => {} };
  const { ctx } = loadAppsScript(FILES, { LockService: { getScriptLock: () => lock }, Utilities: {} });
  // Replace the I/O layer; Api.js resolves these names at call time
  ctx.openSheet = schema => ({ schema: schema.key });
  ctx.appendRecord = (s, schema, v) => { calls.push(['append', schema.key]); return { ...v, id: 'id1' }; };
  ctx.updateRecord = (s, schema, id, v) => { calls.push(['update', id]); return { ...v, id }; };
  ctx.deleteRecord = (s, schema, id) => { calls.push(['delete', id]); };
  ctx.triggerRebuild = () => { calls.push(['rebuild']); };
  return { ctx, calls };
}

const examen = { fecha: '2025-11-20', tipo: 'Presencial', lugar: 'Centro' };
const photo = {
  title: 'T', alt: 'A', category: 'events', date: '2025-05-01',
  fullSize: 'https://res.cloudinary.com/demo/image/upload/v1/a.jpg', thumbnail: ''
};

test('saveEvent without id creates, then triggers a rebuild', () => {
  const { ctx, calls } = setup();
  const r = plain(ctx.saveEvent('examenes', examen));
  assert.equal(r.ok, true);
  assert.equal(r.record.id, 'id1');
  assert.equal(r.publish.triggered, true);
  assert.deepEqual(calls.map(c => c[0]), ['append', 'rebuild']);
});

test('saveEvent with id updates', () => {
  const { ctx, calls } = setup();
  ctx.saveEvent('examenes', { ...examen, id: 'abc' });
  assert.deepEqual(calls[0], ['update', 'abc']);
});

test('invalid event is rejected with field errors and nothing is written or published', () => {
  const { ctx, calls } = setup();
  const r = plain(ctx.saveEvent('examenes', { fecha: 'x' }));
  assert.equal(r.ok, false);
  assert.ok(r.errors.fecha && r.errors.tipo && r.errors.lugar);
  assert.deepEqual(calls, []);
});

test('dispatch failure keeps the data and returns a warning', () => {
  const { ctx } = setup();
  ctx.triggerRebuild = () => { throw new Error('GitHub respondió 401'); };
  const r = plain(ctx.saveEvent('examenes', examen));
  assert.equal(r.ok, true);
  assert.equal(r.publish.triggered, false);
  assert.match(r.publish.warning, /401/);
});

test('deleteEvent deletes and triggers a rebuild', () => {
  const { ctx, calls } = setup();
  const r = plain(ctx.deleteEvent('torneos', 'zz'));
  assert.equal(r.ok, true);
  assert.deepEqual(calls.map(c => c[0]), ['delete', 'rebuild']);
});

test('savePhoto derives the thumbnail from the full-size url and never rebuilds', () => {
  const { ctx, calls } = setup();
  let saved;
  ctx.appendRecord = (s, schema, v) => { saved = v; calls.push(['append']); return { ...v, id: 'p1' }; };
  const r = plain(ctx.savePhoto(photo));
  assert.equal(r.ok, true);
  assert.match(saved.thumbnail, /\/upload\/c_limit,w_600,f_auto,q_auto\/v1\/a\.jpg$/);
  assert.deepEqual(calls.map(c => c[0]), ['append']);
});

test('savePhoto without alt is rejected', () => {
  const { ctx, calls } = setup();
  const r = plain(ctx.savePhoto({ ...photo, alt: '' }));
  assert.equal(r.ok, false);
  assert.ok(r.errors.alt);
  assert.deepEqual(calls, []);
});

test('deletePhoto removes the asset only when asked, and still removes the row if the asset call fails', () => {
  const { ctx, calls } = setup();
  ctx.readRecords = () => [{ id: 'p1', fullSize: 'https://res.cloudinary.com/demo/image/upload/v1/a.jpg', thumbnail: '' }];
  ctx.destroyAsset = id => { calls.push(['destroy', id]); };
  plain(ctx.deletePhoto('p1', false));
  assert.deepEqual(calls.map(c => c[0]), ['delete']);
  calls.length = 0;
  const r = plain(ctx.deletePhoto('p1', true));
  assert.deepEqual(calls.map(c => c[0]), ['delete', 'destroy']);
  assert.equal(r.assetDeleted, true);
  calls.length = 0;
  ctx.destroyAsset = () => { throw new Error('fail'); };
  const r2 = plain(ctx.deletePhoto('p1', true));
  assert.equal(r2.ok, true);
  assert.equal(r2.assetDeleted, false);
  assert.ok(r2.warning);
});

test('unknown event type is rejected', () => {
  const { ctx } = setup();
  assert.throws(() => ctx.listEvents('cursos'), /cursos/);
});
