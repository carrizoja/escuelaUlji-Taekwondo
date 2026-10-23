import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_SCHEMAS } from '../../src/utils/sheetRows.js';
import { loadAppsScript, plain } from './loadAppsScript.js';

const { get } = loadAppsScript(['Schema.js']);

test('Apps Script event schemas match the site EVENT_SCHEMAS', () => {
  assert.deepEqual(plain(get('EVENT_SCHEMAS')), EVENT_SCHEMAS);
});

test('photo schema lists the documented Photos headers in column order', () => {
  const photos = plain(get('PHOTO_SCHEMA'));
  assert.equal(photos.tab, 'Photos');
  assert.deepEqual(Object.keys(photos.fields), [
    'id', 'title', 'description', 'thumbnail', 'fullSize', 'alt', 'category', 'date', 'nivel', 'tags'
  ]);
  assert.deepEqual(plain(get('PHOTO_CATEGORIES')), ['training', 'competitions', 'belts', 'events', 'students']);
});

test('getConfig names the missing property without echoing values', () => {
  const props = { getProperty: () => null };
  const { get: g } = loadAppsScript(['Schema.js'], { PropertiesService: { getScriptProperties: () => props } });
  assert.throws(() => g('getConfig')('GITHUB_TOKEN'), /GITHUB_TOKEN/);
});

test('getConfig returns the stored value', () => {
  const props = { getProperty: k => (k === 'GITHUB_REPO' ? 'a/b' : null) };
  const { get: g } = loadAppsScript(['Schema.js'], { PropertiesService: { getScriptProperties: () => props } });
  assert.equal(g('getConfig')('GITHUB_REPO'), 'a/b');
});
