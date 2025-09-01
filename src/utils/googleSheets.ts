// Google Sheets API utility functions
export interface ExamEvent {
  fecha: string;
  tipo: string;
  grado: string;
  lugar: string;
  hora: string;
  requisitos: string;
  estado?: string;
  descripcion?: string;
}

export interface TournamentEvent {
  fecha: string;
  nombre: string;
  categoria: string;
  lugar: string;
  inscripcion: string;
  premio?: string;
  costo?: string;
  nivel: string;
  modalidad?: string;
  estado?: string;
}

export interface SeminarEvent {
  fecha: string;
  titulo: string;
  maestro: string;
  tema: string;
  duracion: string;
  costo: string;
  lugar?: string;
  cupos?: string;
  nivel?: string;
  descripcion?: string;
}

export interface SheetData {
  examenes: ExamEvent[];
  torneos: TournamentEvent[];
  seminarios: SeminarEvent[];
}

// Method 1: Public Google Sheet (CSV export) - No API key required
export async function fetchSheetDataCSV(sheetId: string): Promise<SheetData> {
  try {
    console.log('Fetching data from Google Sheets CSV...');
    
    // Fetch CSV data from each sheet
    const [examenesResponse, torneosResponse, seminariosResponse] = await Promise.all([
      fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Examenes`),
      fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Torneos`),
      fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Seminarios`)
    ]);

    // Check if responses are OK
    if (!examenesResponse.ok || !torneosResponse.ok || !seminariosResponse.ok) {
      console.warn(`CSV fetch failed:`, {
        examenes: examenesResponse.status,
        torneos: torneosResponse.status,
        seminarios: seminariosResponse.status
      });
      throw new Error('Failed to fetch CSV data');
    }

    const parseCSV = (csvText: string) => {
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) return [];
      
      // Better CSV parsing to handle quoted values with commas
      const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };
      
      const headers = parseLine(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase());
      
      return lines.slice(1).map(line => {
        const values = parseLine(line).map(v => v.replace(/"/g, '').trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      }).filter(obj => Object.values(obj).some(val => val !== ''));
    };

    const [examenesText, torneosText, seminariosText] = await Promise.all([
      examenesResponse.text(),
      torneosResponse.text(),
      seminariosResponse.text()
    ]);

    const result = {
      examenes: parseCSV(examenesText),
      torneos: parseCSV(torneosText),
      seminarios: parseCSV(seminariosText)
    };

    // Transform data to match expected interface if needed
    const transformExamenes = (items: any[]) => {
      return items.map(item => ({
        fecha: item.fecha || '',
        tipo: item.tipo || 'Examen',
        grado: item.grado || '',
        lugar: item.lugar || '',
        hora: item.hora || '',
        requisitos: item.requisitos || '',
        estado: item.estado || 'Programado',
        descripcion: item.descripcion || ''
      }));
    };

    const transformTorneos = (items: any[]) => {
      return items.map(item => ({
        fecha: item.fecha || '',
        nombre: item.nombre || item.tipo || 'Torneo',
        categoria: item.categoria || item.grado || 'Todas las categorías',
        lugar: item.lugar || '',
        inscripcion: item.inscripcion || 'Consultar',
        premio: item.premio || '',
        costo: item.costo || '',
        nivel: item.nivel || item.grado || 'Todos los niveles',
        modalidad: item.modalidad || 'Combate y Poomsae',
        estado: item.estado || 'Inscripciones Abiertas'
      }));
    };

    const transformSeminarios = (items: any[]) => {
      return items.map(item => ({
        fecha: item.fecha || '',
        titulo: item.titulo || item.tipo || 'Seminario',
        maestro: item.maestro || 'Maestro Instructor',
        tema: item.tema || item.requisitos || 'Técnicas de Taekwondo',
        duracion: item.duracion || item.hora || '2 horas',
        costo: item.costo || 'Consultar',
        lugar: item.lugar || '',
        cupos: item.cupos || '20 participantes',
        nivel: item.nivel || item.grado || 'Todos los niveles',
        descripcion: item.descripcion || ''
      }));
    };

    const transformedResult = {
      examenes: transformExamenes(result.examenes),
      torneos: transformTorneos(result.torneos),
      seminarios: transformSeminarios(result.seminarios)
    };

    console.log('CSV data fetched successfully:', {
      examenes: transformedResult.examenes.length,
      torneos: transformedResult.torneos.length,
      seminarios: transformedResult.seminarios.length
    });

    return transformedResult;
  } catch (error) {
    console.error('Error fetching sheet data via CSV:', error);
    console.log('Using mock data as fallback...');
    return { examenes: [], torneos: [], seminarios: [] };
  }
}

// Method 2: Google Sheets API with API Key - More reliable and structured
export async function fetchSheetDataAPI(sheetId: string, apiKey: string): Promise<SheetData> {
  try {
    console.log('Fetching data from Google Sheets API...');
    
    // Validate API key format (should be a proper API key, not OAuth client ID)
    if (apiKey.includes('.apps.googleusercontent.com')) {
      console.warn('Warning: Provided API key appears to be an OAuth Client ID, not an API key. Falling back to CSV method.');
      return fetchSheetDataCSV(sheetId);
    }
    
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values`;
    
    const [examenesRes, torneosRes, seminariosRes] = await Promise.all([
      fetch(`${baseUrl}/Examenes!A:Z?key=${apiKey}`),
      fetch(`${baseUrl}/Torneos!A:Z?key=${apiKey}`),
      fetch(`${baseUrl}/Seminarios!A:Z?key=${apiKey}`)
    ]);

    // Check for API errors with detailed error handling
    if (!examenesRes.ok || !torneosRes.ok || !seminariosRes.ok) {
      const errors = await Promise.all([
        examenesRes.ok ? null : examenesRes.text(),
        torneosRes.ok ? null : torneosRes.text(),
        seminariosRes.ok ? null : seminariosRes.text()
      ]);
      
      console.error(`Google Sheets API Error:`, {
        examenes: { status: examenesRes.status, error: errors[0] },
        torneos: { status: torneosRes.status, error: errors[1] },
        seminarios: { status: seminariosRes.status, error: errors[2] }
      });
      
      throw new Error(`API Error: ${examenesRes.status} ${torneosRes.status} ${seminariosRes.status}`);
    }

    const parseSheetData = (data: any) => {
      if (!data.values || data.values.length < 2) return [];
      
      const headers = data.values[0].map((h: string) => h.toLowerCase().trim());
      
      return data.values.slice(1).map((row: string[]) => {
        const obj: any = {};
        headers.forEach((header: string, index: number) => {
          obj[header] = (row[index] || '').trim();
        });
        return obj;
      }).filter((obj: any) => Object.values(obj).some(val => val !== ''));
    };

    const [examenesData, torneosData, seminariosData] = await Promise.all([
      examenesRes.json(),
      torneosRes.json(),
      seminariosRes.json()
    ]);

    return {
      examenes: parseSheetData(examenesData),
      torneos: parseSheetData(torneosData),
      seminarios: parseSheetData(seminariosData)
    };
  } catch (error) {
    console.error('Error fetching sheet data via API:', error);
    console.log('Falling back to CSV method...');
    // Fallback to CSV method if API fails
    return fetchSheetDataCSV(sheetId);
  }
}

// Utility function to format dates
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// Utility function to check if event is upcoming
export function isUpcoming(dateString: string): boolean {
  try {
    // Handle various date formats
    let eventDate: Date;
    
    // Try different date formats
    if (dateString.includes('/')) {
      // Handle M/D/YYYY or MM/DD/YYYY format (US format)
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Assume M/D/YYYY format (US format common in Google Sheets)
        const month = parseInt(parts[0]) - 1; // Month is 0-indexed
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        eventDate = new Date(year, month, day);
      } else {
        eventDate = new Date(dateString);
      }
    } else if (dateString.includes('-')) {
      // Handle YYYY-MM-DD format
      eventDate = new Date(dateString);
    } else {
      // Try to parse as-is
      eventDate = new Date(dateString);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
    eventDate.setHours(0, 0, 0, 0);
    
    console.log(`Date comparison: ${dateString} -> ${eventDate.toISOString()} vs today ${today.toISOString()} = ${eventDate >= today}`);
    
    return eventDate >= today;
  } catch (error) {
    console.warn(`Error parsing date "${dateString}":`, error);
    return true; // Assume upcoming if can't parse date
  }
}

// Utility function to check if event date is in the past
export function isPastDate(dateString: string): boolean {
  try {
    // Handle various date formats
    let eventDate: Date;
    
    // Try different date formats
    if (dateString.includes('/')) {
      // Handle M/D/YYYY or MM/DD/YYYY format (US format)
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Assume M/D/YYYY format (US format common in Google Sheets)
        const month = parseInt(parts[0]) - 1; // Month is 0-indexed
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        eventDate = new Date(year, month, day);
      } else {
        eventDate = new Date(dateString);
      }
    } else if (dateString.includes('-')) {
      // Handle YYYY-MM-DD format
      eventDate = new Date(dateString);
    } else {
      // Try to parse as-is
      eventDate = new Date(dateString);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
    eventDate.setHours(0, 0, 0, 0);
    
    console.log(`isPastDate check: ${dateString} -> ${eventDate.toISOString()} vs today ${today.toISOString()} = ${eventDate < today}`);
    
    return eventDate < today;
  } catch (error) {
    console.warn(`Error parsing date "${dateString}":`, error);
    return false; // Assume not past if can't parse date
  }
}

// Main function to fetch all sheet data with fallback
export async function fetchEventData(sheetId?: string, apiKey?: string): Promise<SheetData> {
  if (!sheetId) {
    console.warn('No Google Sheet ID provided, using mock data');
    return getMockData();
  }

  try {
    // Try API method first if API key is available
    if (apiKey) {
      return await fetchSheetDataAPI(sheetId, apiKey);
    } else {
      // Use CSV method as fallback
      return await fetchSheetDataCSV(sheetId);
    }
  } catch (error) {
    console.error('Failed to fetch Google Sheets data:', error);
    return getMockData();
  }
}

// Mock data for development/fallback
function getMockData(): SheetData {
  return {
    examenes: [
      {
        fecha: '2025-02-15',
        tipo: 'Examen de Cinturones Kup',
        grado: '10° Kup a 1° Kup',
        lugar: 'Dojang Principal',
        hora: '9:00 AM - 2:00 PM',
        requisitos: 'Mínimo 3 meses en el grado actual, conocimiento de poomsae correspondiente',
        estado: 'Abierto',
        descripcion: 'Examen para cinturones de color con evaluación técnica y teórica'
      },
      {
        fecha: '2025-03-22',
        tipo: 'Examen de Dan',
        grado: '1° Dan a 5° Dan',
        lugar: 'Centro de Convenciones',
        hora: '8:00 AM - 6:00 PM',
        requisitos: 'Mínimo 1 año en el grado actual, certificado médico',
        estado: 'Próximamente',
        descripcion: 'Examen de cinturones negros con tribunal de maestros internacionales'
      }
    ],
    torneos: [
      {
        fecha: '2025-04-12',
        nombre: 'Copa Primavera Ul-ji',
        categoria: 'Todas las categorías',
        lugar: 'Polideportivo Municipal',
        inscripcion: 'Hasta el 5 de Abril',
        premio: 'Trofeos y medallas',
        costo: '$15.000',
        nivel: 'Principiante a Avanzado',
        modalidad: 'Poomsae y Combate',
        estado: 'Inscripciones Abiertas'
      },
      {
        fecha: '2025-06-18',
        nombre: 'Torneo Nacional de Verano',
        categoria: 'Juvenil y Senior',
        lugar: 'Centro Deportivo Nacional',
        inscripcion: 'Hasta el 10 de Junio',
        premio: 'Clasificación a Nacionales',
        costo: '$25.000',
        nivel: 'Avanzado',
        modalidad: 'Combate Olímpico',
        estado: 'Próximamente'
      }
    ],
    seminarios: [
      {
        fecha: '2025-03-08',
        titulo: 'Seminario de Poomsae Tradicional',
        maestro: 'Gran Maestro Kim Jin-Su',
        tema: 'Formas tradicionales y aplicaciones de combate',
        duracion: '6 horas',
        costo: '$20.000',
        lugar: 'Dojang Principal',
        cupos: '30 participantes',
        nivel: 'Cinturón verde en adelante',
        descripcion: 'Seminario intensivo sobre las formas tradicionales del Taekwondo y sus aplicaciones prácticas en combate'
      },
      {
        fecha: '2025-05-25',
        titulo: 'Defensa Personal para Mujeres',
        maestro: 'Maestra Ana García',
        tema: 'Técnicas de defensa personal y autoprotección',
        duracion: '4 horas',
        costo: '$12.000',
        lugar: 'Dojang Principal',
        cupos: '20 participantes',
        nivel: 'Todos los niveles',
        descripcion: 'Curso especializado en técnicas de defensa personal adaptadas para mujeres'
      }
    ]
  };
}
