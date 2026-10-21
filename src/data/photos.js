// Photo data for the gallery - now powered by Google Sheets
import { fetchPhotosFromSheets, generatePhotoCategories, validateSheetsConfig } from '../utils/googleSheets.js';

// Cache for photos to avoid repeated API calls
let photosCache = null;
let categoriesCache = null;
let lastFetch = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get photos from Google Sheets with caching and fallback
 * @returns {Promise<Array>} Array of photo objects
 */
export async function getPhotos() {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (photosCache && lastFetch && (now - lastFetch) < CACHE_DURATION) {
    return photosCache;
  }
  
  try {
    // Check if Google Sheets is configured
    if (!validateSheetsConfig()) {
      console.info('Google Sheets not configured, using fallback data');
      return getFallbackPhotos();
    }
    
    // Fetch from Google Sheets
    photosCache = await fetchPhotosFromSheets();
    lastFetch = now;
    
    // If no photos found, use fallback
    if (!photosCache || photosCache.length === 0) {
      console.warn('No photos found in Google Sheets, using fallback data');
      return getFallbackPhotos();
    }
    
    return photosCache;
  } catch (error) {
    console.error('Error loading photos from Google Sheets, using fallback data:', error);
    return getFallbackPhotos();
  }
}

/**
 * Get photo categories with counts
 * @returns {Promise<Array>} Array of category objects
 */
export async function getPhotoCategories() {
  const photos = await getPhotos();
  return generatePhotoCategories(photos);
}

/**
 * Clear the photos cache (useful for development or manual refresh)
 */
export function clearPhotosCache() {
  photosCache = null;
  categoriesCache = null;
  lastFetch = null;
}

/**
 * Get fallback photos data
 * @returns {Array} Array of fallback photo objects
 */
function getFallbackPhotos() {
  return photos;
}

// Static export for backward compatibility and fallback data
export const photos = [
  {
    id: 'photo-1',
    title: 'Examen de Taekwondo 28-8-2023',
    description: 'Autoridades de Ul-Ji junto al Senior Master Julio Bazan y a la Sabum Nim Sandra Ojeda.',
    thumbnail: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1756929437/20230828_201217_ltwuxs.jpg',
    fullSize: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1756929437/20230828_201217_ltwuxs.jpg',
    alt: 'Autoridades de Ul-Ji junto al Senior Master Julio Bazan y a la Sabum Nim Sandra Ojeda',
    category: 'belts',
    date: '2023-08-28T10:00:00Z',
    likes: 0,
    tags: ['taekwondo', 'examenes', 'estudiantes']
  },

  {
    id: 'photo-15',
    title: 'Clase Abierta en Palermo',
    description: 'Hermosa clase donde padres e hijos practican juntos fortaleciendo vínculos familiares.',
    thumbnail: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1757626504/palermo2_nqmr2z.png',
    fullSize: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1757626504/palermo2_nqmr2z.png',
    alt: 'Clase abierta de Taekwondo en Palermo',
    category: 'students',
    date: '2024-11-10T16:00:00Z',
    likes: 82,
    tags: ['taekwondo', 'familia', 'padres', 'hijos', 'vínculos']
  },

  {
    id: 'photo-21',
    title: 'Clase Adultos marzo 2024',
    description: 'Intensa sesión de acondicionamiento físico para mejorar fuerza y resistencia.',
    thumbnail: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1757627274/entrenamiento_q31hel.png',
    fullSize: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1757627274/entrenamiento_q31hel.png',
    alt: 'Acondicionamiento físico para Taekwondo',
    category: 'training',
    date: '2024-03-15T18:00:00Z',
    likes: 52,
    tags: ['taekwondo', 'acondicionamiento', 'fuerza', 'resistencia']
  },
  {
    id: 'photo-22',
    title: 'Entrega de Trofeos Torneo Orán 2024',
    description: 'Ceremonia de premiación para los participantes de ACIT en Orán, Salta.',
    thumbnail: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1757627608/20240824_140605_ofc69v.jpg',
    fullSize: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1757627608/20240824_140605_ofc69v.jpg',
    alt: 'Ceremonia de premiación en Torneo Orán 2024',
    category: 'competitions',
    date: '2024-08-24T12:30:00Z',
    likes: 85,
    tags: ['taekwondo', 'campeonato escolar', 'jóvenes', 'talento']
  },

  {
    id: 'photo-24',
    title: 'Participación de Ul-Ji en clase del Master Julio Bazán',
    description: 'Aprovechando el viaje a Tucumán, varios integrantes de Ul-Ji participaron de una clase especial dictada por el Master Julio Bazán.',
    thumbnail: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1757626792/tucuman_bbydkh.jpg',
    fullSize: 'https://res.cloudinary.com/dgvje1bpw/image/upload/v1757626792/tucuman_bbydkh.jpg',
    alt: 'Clase del Master Julio Bazán en Tucumán',
    category: 'events',
    date: '2024-08-26T19:00:00Z',
    likes: 74,
    tags: ['taekwondo', 'navidad', 'exhibición', 'celebración']
  }
];

// Photo categories for filtering
export const photoCategories = [
  { id: 'all', name: 'Todas', count: photos.length },
  { id: 'training', name: 'Entrenamiento', count: photos.filter(p => p.category === 'training').length },
  { id: 'competitions', name: 'Competencias', count: photos.filter(p => p.category === 'competitions').length },
  { id: 'belts', name: 'Exámenes', count: photos.filter(p => p.category === 'belts').length },
  { id: 'events', name: 'Eventos', count: photos.filter(p => p.category === 'events').length },
  { id: 'students', name: 'Estudiantes', count: photos.filter(p => p.category === 'students').length },
];
