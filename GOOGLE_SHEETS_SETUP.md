# Google Sheets Integration for Eventos

This implementation allows you to fetch event data from Google Sheets and display it dynamically on your `/eventos` page.

## 📋 Google Sheets Setup

### 1. Create Your Google Sheet

Create a Google Sheet with 3 tabs (sheets):

#### **Examenes Sheet**
| fecha | tipo | grado | lugar | hora | requisitos | estado | descripcion |
|-------|------|-------|-------|------|------------|--------|-------------|
| 2025-02-15 | Examen de Cinturones Kup | 10° Kup a 1° Kup | Dojang Principal | 9:00 AM - 2:00 PM | Mínimo 3 meses en el grado actual | Abierto | Examen para cinturones de color |

#### **Torneos Sheet**
| fecha | nombre | categoria | lugar | inscripcion | premio | costo | nivel | modalidad | estado |
|-------|--------|-----------|-------|-------------|--------|-------|--------|-----------|--------|
| 2025-04-12 | Copa Primavera Ul-ji | Todas las categorías | Polideportivo Municipal | Hasta el 5 de Abril | Trofeos y medallas | $15.000 | Principiante a Avanzado | Poomsae y Combate | Inscripciones Abiertas |

#### **Seminarios Sheet**
| fecha | titulo | maestro | tema | duracion | costo | lugar | cupos | nivel | descripcion |
|-------|--------|---------|------|----------|--------|-------|--------|--------|-------------|
| 2025-03-08 | Seminario de Poomsae Tradicional | Gran Maestro Kim Jin-Su | Formas tradicionales y aplicaciones de combate | 6 horas | $20.000 | Dojang Principal | 30 participantes | Cinturón verde en adelante | Seminario intensivo sobre las formas tradicionales |

### 2. Make Your Sheet Public

1. Open your Google Sheet
2. Click **Share** button (top right)
3. Click **Change to anyone with the link**
4. Set permission to **Viewer**
5. Copy the share link

### 3. Get Your Sheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```

The Sheet ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 🔧 Configuration

### 1. Update Environment Variables

Edit your `.env` file:

```bash
# Replace with your actual Google Sheet ID
GOOGLE_SHEETS_ID=your_actual_sheet_id_here
PUBLIC_GOOGLE_SHEETS_ID=your_actual_sheet_id_here

# Optional: Google API Key for more reliable access
# GOOGLE_API_KEY=your_google_api_key_here
```

### 2. (Optional) Set up Google API Key

For more reliable access and higher rate limits:

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**
4. Create credentials (API Key)
5. Add the API key to your `.env` file

## 🚀 How It Works

### Data Fetching Methods

1. **CSV Method (Default)**: Uses public Google Sheets CSV export
   - No API key required
   - Rate limited by Google
   - Works for public sheets

2. **API Method (Optional)**: Uses Google Sheets API
   - Requires API key
   - Higher rate limits
   - More reliable
   - Better error handling

### Automatic Fallbacks

1. If Sheet ID is provided → Tries to fetch from Google Sheets
2. If API key is available → Uses API method
3. If no API key → Uses CSV method
4. If fetching fails → Shows mock data
5. If no Sheet ID → Shows mock data

### Data Processing

- Automatically filters upcoming events (based on fecha field)
- Formats dates in Spanish (dd de mes de año)
- Counts events for navigation tabs
- Handles missing or empty fields gracefully

## 📊 Features

### Dynamic Event Counts
- Navigation tabs show live counts: "Exámenes (2)"
- Hero section displays summary statistics

### Smart Date Handling
- Automatically filters past events
- Formats dates in Spanish locale
- Handles various date formats

### Responsive Design
- Mobile-friendly card layouts
- Tablet and desktop optimizations
- Smooth hover animations

### Event Status
- Color-coded status indicators
- Call-to-action buttons
- Registration information

## 🔄 Data Updates

To update event data:

1. Edit your Google Sheet directly
2. The website will automatically fetch new data on next build
3. For development: Restart the dev server to see changes

## 🛠️ Development

### View with Mock Data
```bash
npm run dev
```
Opens `http://localhost:4321/eventos` with sample data

### Build with Real Data
```bash
npm run build
```
Fetches real data from Google Sheets during build

### Deploy
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 📝 Data Validation

The system handles:
- Empty rows or columns
- Missing required fields
- Invalid date formats
- Network errors
- API rate limits

## 🎨 Customization

### Styling
- Uses Tailwind CSS classes
- Consistent with existing design system
- Dark mode support
- Brand colors and typography

### Event Types
Add new event types by:
1. Creating new sheet tabs in Google Sheets
2. Updating the `googleSheets.ts` utility
3. Adding new sections to `eventos.astro`

## 🔍 Troubleshooting

### Common Issues

1. **No data showing**: Check if Sheet ID is correct and sheet is public
2. **Old data**: Clear browser cache or restart dev server
3. **Rate limits**: Set up Google API key for higher limits
4. **CORS errors**: Ensure sheet is public and accessible

### Debug Information

Check browser console for debug logs:
```
Fetching event data from Google Sheets...
Successfully fetched event data: { examenes: 2, torneos: 2, seminarios: 2 }
```
