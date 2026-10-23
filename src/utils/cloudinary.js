/**
 * Cloudinary delivery URL helpers.
 */

const UPLOAD = '/image/upload/';

/**
 * Returns a Cloudinary URL that serves a cropped, resized and optimized copy.
 * URLs that are not Cloudinary uploads, or already carry a transformation,
 * are returned unchanged.
 * @param {string} url - Cloudinary delivery URL
 * @param {{width: number, height: number}} size - Target size in pixels
 * @returns {string}
 */
export function cloudinaryResize(url, { width, height }) {
  return withTransformation(url, `c_fill,w_${width},h_${height},f_auto,q_auto`);
}

/**
 * Like cloudinaryResize, but only caps the width so the original aspect ratio
 * is kept (for masonry layouts). Smaller images are never upscaled.
 * @param {string} url - Cloudinary delivery URL
 * @param {number} width - Maximum width in pixels
 * @returns {string}
 */
export function cloudinaryWidth(url, width) {
  return withTransformation(url, `c_limit,w_${width},f_auto,q_auto`);
}

function withTransformation(url, transformation) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes(UPLOAD)) return url;

  const [base, rest] = url.split(UPLOAD);
  const segments = rest.split('/');
  // A transformation segment (e.g. "w_300,c_fill") sits before the version/public id
  if (segments.length > 1 && /^[a-z]{1,2}_/.test(segments[0])) return url;

  return `${base}${UPLOAD}${transformation}/${rest}`;
}
