/**
 * Cloudinary helpers: signed browser uploads, thumbnail URLs and asset deletion.
 * The API secret is only read here, server-side, and never returned.
 */

const CLOUDINARY_FOLDER = 'escuela-ulji/gallery';
const THUMBNAIL_TRANSFORMATION = 'c_limit,w_600,f_auto,q_auto';
const UPLOAD_SEGMENT = '/image/upload/';
// Params Cloudinary leaves out of the signature
const UNSIGNED_PARAMS = ['file', 'cloud_name', 'resource_type', 'api_key'];

/**
 * Builds the string to sign: params sorted by name as `k=v` joined with `&`.
 * @param {Object} params
 * @returns {string} Without the secret appended
 */
function buildSignatureString(params) {
  return Object.keys(params)
    .filter(function (k) {
      return UNSIGNED_PARAMS.indexOf(k) === -1 && params[k] !== '' && params[k] !== null && params[k] !== undefined;
    })
    .sort()
    .map(function (k) { return k + '=' + params[k]; })
    .join('&');
}

function toHex(bytes) {
  return bytes.map(function (b) { return ('0' + (b < 0 ? b + 256 : b).toString(16)).slice(-2); }).join('');
}

/**
 * SHA-1 signature as Cloudinary specifies: sha1(sortedParams + secret).
 * @returns {string} Hex digest
 */
function signParams(params, secret) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_1,
    buildSignatureString(params) + secret,
    Utilities.Charset.UTF_8
  );
  return toHex(digest);
}

/**
 * Returns what the browser needs to upload one image directly to Cloudinary.
 * The parameters are fixed here; the client cannot choose what gets signed.
 */
function getUploadSignature() {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signParams({ folder: CLOUDINARY_FOLDER, timestamp: timestamp }, getConfig('CLOUDINARY_API_SECRET'));
  return {
    cloudName: getConfig('CLOUDINARY_CLOUD_NAME'),
    apiKey: getConfig('CLOUDINARY_API_KEY'),
    timestamp: timestamp,
    signature: signature,
    folder: CLOUDINARY_FOLDER
  };
}

/** True when the segment is a transformation like "c_limit,w_600". */
function isTransformation(segment) {
  return /^[a-z]{1,2}_/.test(segment);
}

/**
 * Derives a thumbnail URL by inserting a transformation. Non-Cloudinary or
 * already transformed URLs are returned unchanged.
 */
function thumbnailUrl(url) {
  if (!url || url.indexOf('res.cloudinary.com') === -1 || url.indexOf(UPLOAD_SEGMENT) === -1) return url;
  const parts = url.split(UPLOAD_SEGMENT);
  const rest = parts.slice(1).join(UPLOAD_SEGMENT);
  if (isTransformation(rest.split('/')[0])) return url;
  return parts[0] + UPLOAD_SEGMENT + THUMBNAIL_TRANSFORMATION + '/' + rest;
}

/**
 * Extracts the public id from a Cloudinary delivery URL.
 * @returns {string|null} null when the URL is not a Cloudinary upload
 */
function publicIdFromUrl(url) {
  if (!url || url.indexOf('res.cloudinary.com') === -1 || url.indexOf(UPLOAD_SEGMENT) === -1) return null;
  const segments = url.split(UPLOAD_SEGMENT).slice(1).join(UPLOAD_SEGMENT).split('/');
  while (segments.length > 1 && (isTransformation(segments[0]) || /^v\d+$/.test(segments[0]))) segments.shift();
  return segments.join('/').replace(/\.[A-Za-z0-9]+$/, '') || null;
}

/**
 * Deletes an image asset through the signed Admin destroy call.
 * @throws {Error} When Cloudinary does not confirm the deletion
 */
function destroyAsset(publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const apiKey = getConfig('CLOUDINARY_API_KEY');
  const signature = signParams({ public_id: publicId, timestamp: timestamp }, getConfig('CLOUDINARY_API_SECRET'));
  const response = UrlFetchApp.fetch('https://api.cloudinary.com/v1_1/' + getConfig('CLOUDINARY_CLOUD_NAME') + '/image/destroy', {
    method: 'post',
    payload: { public_id: publicId, timestamp: String(timestamp), api_key: apiKey, signature: signature },
    muteHttpExceptions: true
  });
  const code = response.getResponseCode();
  let result = '';
  try { result = JSON.parse(response.getContentText()).result; } catch (e) { /* non-JSON body */ }
  if (code !== 200 || result !== 'ok') {
    throw new Error('Cloudinary no confirmó el borrado de la imagen (HTTP ' + code + (result ? ', ' + result : '') + ').');
  }
}
