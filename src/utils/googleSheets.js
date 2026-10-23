/**
 * Google Sheets integration for Escuela Ul-ji photo gallery
 * Fetches photo data from a public Google Sheets document
 * 
 * Configuration is loaded from environment variables:
 * - PUBLIC_GOOGLE_SHEETS_ID: Your Google Sheets document ID
 * - PUBLIC_GOOGLE_API_KEY: Your Google Cloud API key
 * 
 * Make sure to configure these in your .env file
 */

import { EVENT_SCHEMAS, parseSheetRows } from './sheetRows.js';

// Your Google Sheets configuration
const SHEET_CONFIG = {
  // Using environment variables for sensitive data
  SHEET_ID: import.meta.env.PUBLIC_GOOGLE_SHEETS_ID || '1_5uWM3MjIdL2tsJ0c0QVEoEc7WC0-6BwnvsY76322Ys',
  // The range of cells to fetch (e.g., 'Photos!A:J' for columns A through J)
  RANGE: 'Photos!A:J',
  // Using environment variable for API key
  API_KEY: import.meta.env.PUBLIC_GOOGLE_API_KEY
};

/**
 * Fetches photo data from Google Sheets
 * @returns {Promise<Array>} Array of photo objects
 */
export async function fetchPhotosFromSheets() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_CONFIG.SHEET_ID}/values/${SHEET_CONFIG.RANGE}?key=${SHEET_CONFIG.API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    const rows = data.values;
    
    if (!rows || rows.length === 0) {
      console.warn('No data found in Google Sheets');
      return [];
    }
    
    // Skip header row and convert to photo objects
    const [headers, ...photoRows] = rows;
    
    return photoRows.map((row, index) => {
      // Handle empty rows
      if (!row || row.length === 0) return null;
      
      // Parse tags safely
      let tags = [];
      if (row[9]) {
        try {
          tags = row[9].split(',').map(tag => tag.trim()).filter(tag => tag);
        } catch (error) {
          console.warn('Error parsing tags for photo:', row[1], error);
          tags = [];
        }
      }
      
      const photo = {
        id: row[0] || `photo-${index + 1}`,
        title: row[1] || '',
        description: row[2] || '',
        thumbnail: row[3] || '',
        fullSize: row[4] || row[3] || '', // Use thumbnail if fullSize is empty
        alt: row[5] || row[1] || '', // Use title if alt is empty
        category: row[6] || 'events',
        date: row[7] || new Date().toISOString(),
        likes: parseInt(row[8]) || 0,
        tags: tags
      };
      
      return photo;
    }).filter(photo => photo !== null && photo.id && photo.title); // Filter out invalid entries
    
  } catch (error) {
    console.error('Error fetching photos from Google Sheets:', error);
    throw error; // Re-throw to be handled by calling function
  }
}

/**
 * Generates photo categories with counts
 * @param {Array} photos - Array of photo objects
 * @returns {Array} Array of category objects
 */
export function generatePhotoCategories(photos) {
  const categoryCounts = {
    training: 0,
    competitions: 0,
    belts: 0,
    events: 0,
    students: 0
  };
  
  // Count photos in each category
  photos.forEach(photo => {
    if (categoryCounts.hasOwnProperty(photo.category)) {
      categoryCounts[photo.category]++;
    }
  });
  
  return [
    { id: 'all', name: 'Todas', count: photos.length },
    { id: 'training', name: 'Entrenamiento', count: categoryCounts.training },
    { id: 'competitions', name: 'Competencias', count: categoryCounts.competitions },
    { id: 'belts', name: 'Exámenes', count: categoryCounts.belts },
    { id: 'events', name: 'Eventos', count: categoryCounts.events },
    { id: 'students', name: 'Estudiantes', count: categoryCounts.students },
  ];
}

/**
 * Validates Google Sheets configuration
 * @returns {boolean} True if configuration is valid
 */
export function validateSheetsConfig() {
  return SHEET_CONFIG.SHEET_ID !== 'YOUR_GOOGLE_SHEETS_ID_HERE' && 
         SHEET_CONFIG.API_KEY !== 'YOUR_GOOGLE_SHEETS_API_KEY_HERE' &&
         SHEET_CONFIG.SHEET_ID && 
         SHEET_CONFIG.API_KEY &&
         SHEET_CONFIG.SHEET_ID.length > 20 && // Google Sheets IDs are typically 44 characters
         SHEET_CONFIG.API_KEY.length > 20; // API keys are typically 39 characters
}

/**
 * Fetches event data from Google Sheets (exams, tournaments, seminars).
 * Columns are read by header name; see GOOGLE_SHEETS_SETUP.md for the schema.
 * @param {string} sheetId - Google Sheets ID for events
 * @param {string} apiKey - Google Sheets API key
 * @returns {Promise<Object>} Object containing arrays for examenes, torneos, and seminarios
 * @throws {Error} When a tab cannot be fetched or its headers do not match the schema
 */
export async function fetchEventData(sheetId, apiKey) {
  const eventData = {};

  for (const schema of Object.values(EVENT_SCHEMAS)) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(schema.tab)}?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet tab "${schema.tab}": ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    eventData[schema.key] = parseSheetRows(schema.tab, data.values, schema);
  }

  return eventData;
}

/**
 * Formats a date string for display
 * @param {string} dateString - Date string in various formats
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If direct parsing fails, try to parse common formats
      return dateString; // Return original string if parsing fails
    }
    
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Checks if a date is upcoming (in the future)
 * @param {string} dateString - Date string to check
 * @returns {boolean} True if date is in the future
 */
export function isUpcoming(dateString) {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
  } catch (error) {
    console.warn('Error checking if date is upcoming:', error);
    return false;
  }
}

/**
 * Checks if a date is in the past
 * @param {string} dateString - Date string to check
 * @returns {boolean} True if date is in the past
 */
export function isPastDate(dateString) {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  } catch (error) {
    console.warn('Error checking if date is past:', error);
    return false;
  }
}