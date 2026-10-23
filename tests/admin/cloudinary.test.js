import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { loadAppsScript, plain } from './loadAppsScript.js';

const Utilities = {
  DigestAlgorithm: { SHA_1: 'SHA_1' },
  Charset: { UTF_8: 'UTF_8' },
  // Apps Script returns signed bytes
  computeDigest: (algo, text) => Array.from(createHash('sha1').update(text, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b))
};

const props = {
  CLOUDINARY_CLOUD_NAME: 'demo', CLOUDINARY_API_KEY: 'key123', CLOUDINARY_API_SECRET: 'abcd'
};
const PropertiesService = { getScriptProperties: () => ({ getProperty: k => props[k] ?? null }) };

const { get, ctx } = loadAppsScript(['Schema.js', 'Cloudinary.js'], { Utilities, PropertiesService });

test('signature matches the example in the Cloudinary docs', () => {
  const sig = get('signParams')({
    eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
    public_id: 'sample_image',
    timestamp: 1315060510
  }, 'abcd');
  assert.equal(sig, 'bfd09f95f331f558cbd1320e67aa8d488770583e');
});

test('params are sorted and empty ones, file, api_key, resource_type and cloud_name are excluded', () => {
  assert.equal(
    get('buildSignatureString')({ timestamp: 1, folder: 'f', file: 'x', api_key: 'k', resource_type: 'image', cloud_name: 'c', tags: '' }),
    'folder=f&timestamp=1'
  );
});

test('getUploadSignature returns public data only and signs folder+timestamp', () => {
  const out = plain(get('getUploadSignature')());
  assert.deepEqual(Object.keys(out).sort(), ['apiKey', 'cloudName', 'folder', 'signature', 'timestamp']);
  assert.equal(out.cloudName, 'demo');
  assert.equal(out.apiKey, 'key123');
  assert.equal(out.signature, get('signParams')({ folder: out.folder, timestamp: out.timestamp }, 'abcd'));
  assert.ok(!JSON.stringify(out).includes('abcd'));
});

test('thumbnailUrl inserts a transformation after /upload/', () => {
  assert.equal(
    get('thumbnailUrl')('https://res.cloudinary.com/demo/image/upload/v12/escuela/a.jpg'),
    'https://res.cloudinary.com/demo/image/upload/c_limit,w_600,f_auto,q_auto/v12/escuela/a.jpg'
  );
});

test('thumbnailUrl leaves non-Cloudinary or already transformed urls unchanged', () => {
  const other = 'https://example.com/a.jpg';
  assert.equal(get('thumbnailUrl')(other), other);
  const done = 'https://res.cloudinary.com/demo/image/upload/c_fill,w_10/v1/a.jpg';
  assert.equal(get('thumbnailUrl')(done), done);
});

test('publicIdFromUrl strips transformations, version and extension', () => {
  const f = get('publicIdFromUrl');
  assert.equal(f('https://res.cloudinary.com/demo/image/upload/v12/escuela/gallery/a.b.jpg'), 'escuela/gallery/a.b');
  assert.equal(f('https://res.cloudinary.com/demo/image/upload/c_limit,w_600,f_auto/v12/x.png'), 'x');
  assert.equal(f('https://example.com/a.jpg'), null);
});
