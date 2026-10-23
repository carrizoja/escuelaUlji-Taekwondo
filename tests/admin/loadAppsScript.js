import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../admin/apps-script');

/**
 * Loads Apps Script source files into one shared vm context, the way Apps
 * Script runs every file in a single global scope.
 * @param {string[]} files - File names inside admin/apps-script/, in load order
 * @param {Object} globals - Stubs for Apps Script services (Utilities, LockService...)
 * @returns {{ctx: Object, get: (name: string) => any}}
 */
export function loadAppsScript(files, globals = {}) {
  const ctx = vm.createContext({ console, ...globals });
  for (const file of files) {
    vm.runInContext(readFileSync(path.join(DIR, file), 'utf8'), ctx, { filename: file });
  }
  // `const` declarations are not context properties, so evaluate by name
  return { ctx, get: name => vm.runInContext(name, ctx) };
}

/** Copies a value out of the vm realm so deepEqual does not trip on prototypes. */
export const plain = value => JSON.parse(JSON.stringify(value));
