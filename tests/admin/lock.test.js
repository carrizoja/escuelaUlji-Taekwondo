import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAppsScript } from './loadAppsScript.js';

function setup({ locked = true } = {}) {
  const calls = { tryLock: [], release: 0 };
  const lock = {
    tryLock: ms => { calls.tryLock.push(ms); return locked; },
    releaseLock: () => { calls.release++; }
  };
  const { get } = loadAppsScript(['Lock.js'], { LockService: { getScriptLock: () => lock } });
  return { withLock: get('withLock'), calls };
}

test('runs fn under the lock, returns its result and releases', () => {
  const { withLock, calls } = setup();
  assert.equal(withLock(() => 42), 42);
  assert.deepEqual(calls.tryLock, [10000]);
  assert.equal(calls.release, 1);
});

test('lock failure throws a retryable Spanish error and never calls fn', () => {
  const { withLock, calls } = setup({ locked: false });
  let ran = false;
  assert.throws(() => withLock(() => { ran = true; }), /Otro guardado está en curso, reintentá en unos segundos/);
  assert.equal(ran, false);
  assert.equal(calls.release, 0);
});

test('releases the lock when fn throws', () => {
  const { withLock, calls } = setup();
  assert.throws(() => withLock(() => { throw new Error('boom'); }), /boom/);
  assert.equal(calls.release, 1);
});
