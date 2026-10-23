/**
 * Serializes sheet writes. Every write path goes through withLock.
 */

const LOCK_TIMEOUT_MS = 10000;
const LOCK_BUSY_MESSAGE = 'Otro guardado está en curso, reintentá en unos segundos.';

/**
 * Runs fn while holding the script lock.
 * @param {Function} fn
 * @returns {*} fn's result
 * @throws {Error} Retryable error when the lock cannot be obtained; fn is not called
 */
function withLock(fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(LOCK_TIMEOUT_MS)) {
    const error = new Error(LOCK_BUSY_MESSAGE);
    error.retryable = true;
    throw error;
  }
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}
