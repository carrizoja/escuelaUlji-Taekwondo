import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cloudinaryResize } from '../src/utils/cloudinary.js';

const original = 'https://res.cloudinary.com/demo/image/upload/v1757626504/palermo2.jpg';

test('adds a fill, format and quality transformation after /upload/', () => {
  assert.equal(
    cloudinaryResize(original, { width: 800, height: 600 }),
    'https://res.cloudinary.com/demo/image/upload/c_fill,w_800,h_600,f_auto,q_auto/v1757626504/palermo2.jpg'
  );
});

test('leaves non-Cloudinary and empty URLs unchanged', () => {
  assert.equal(cloudinaryResize('https://example.com/a.jpg', { width: 800, height: 600 }), 'https://example.com/a.jpg');
  assert.equal(cloudinaryResize('', { width: 800, height: 600 }), '');
});

test('does not add a second transformation to an already transformed URL', () => {
  const transformed = 'https://res.cloudinary.com/demo/image/upload/w_300/v1/a.jpg';
  assert.equal(cloudinaryResize(transformed, { width: 800, height: 600 }), transformed);
});
