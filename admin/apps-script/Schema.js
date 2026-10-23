/**
 * Sheet schemas and configuration.
 *
 * EVENT_SCHEMAS must stay identical to src/utils/sheetRows.js (a test checks
 * it). Field name = header name in the sheet; headers are matched ignoring
 * case and surrounding spaces. Source of truth: GOOGLE_SHEETS_SETUP.md.
 */

// `optional` columns may be absent; `default` fills empty values.
const EVENT_SCHEMAS = {
  examenes: {
    key: 'examenes',
    tab: 'Examenes',
    fields: {
      id: {},
      fecha: {},
      tipo: {},
      grado: {},
      lugar: {},
      hora: {},
      requisitos: {},
      estado: { optional: true, default: 'Programado' }
    }
  },
  torneos: {
    key: 'torneos',
    tab: 'Torneos',
    fields: {
      id: {},
      fecha: {},
      nombre: {},
      categoria: {},
      lugar: {},
      inscripcion: {},
      premio: {},
      costo: {},
      nivel: {},
      modalidad: {},
      estado: { default: 'Inscripciones Abiertas' }
    }
  },
  seminarios: {
    key: 'seminarios',
    tab: 'Seminarios',
    fields: {
      id: {},
      fecha: {},
      titulo: {},
      maestro: {},
      tema: {},
      duracion: {},
      costo: {},
      lugar: {},
      cupos: {},
      nivel: {},
      descripcion: {}
    }
  }
};

// The site reads the Photos tab by position (A:J); the dashboard maps by header name.
const PHOTO_SCHEMA = {
  key: 'photos',
  tab: 'Photos',
  fields: {
    id: {},
    title: {},
    description: {},
    thumbnail: {},
    fullSize: {},
    alt: {},
    category: {},
    date: {},
    nivel: {},
    tags: {}
  }
};

const PHOTO_CATEGORIES = ['training', 'competitions', 'belts', 'events', 'students'];

// Script Properties (Project Settings > Script properties)
const CONFIG_KEYS = [
  'EVENTS_SHEET_ID',
  'PHOTOS_SHEET_ID',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GITHUB_TOKEN',
  'GITHUB_REPO'
];

/**
 * Reads a Script Property.
 * @param {string} key - One of CONFIG_KEYS
 * @returns {string}
 * @throws {Error} Naming the missing key (never the value)
 */
function getConfig(key) {
  // Trim: a space or line break copied along with a key makes it invalid
  const value = String(PropertiesService.getScriptProperties().getProperty(key) || '').trim();
  if (!value) {
    throw new Error('Falta la propiedad de script "' + key + '". Configurala en Configuración del proyecto > Propiedades de la secuencia de comandos.');
  }
  return value;
}
