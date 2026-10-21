# 📊 Google Sheets Setup Guide for Escuela Ul-ji Gallery

## Step 1: Create Your Google Sheets

1. **Go to Google Sheets**: [sheets.google.com](https://sheets.google.com)
2. **Create a new spreadsheet** named "Escuela Ul-ji Gallery"
3. **Create a sheet tab** named "Photos"

## Step 2: Set Up Your Columns

Create these column headers in row 1:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| ID | Title | Description | Thumbnail URL | Full Size URL | Alt Text | Category | Date | Likes | Tags |

## Step 3: Add Your Photo Data

Example row (copy your existing data):
- **A2**: `photo-1`
- **B2**: `Examen de Taekwondo 28-8-2023`
- **C2**: `Autoridades de Ul-Ji junto al Senior Master Julio Bazan...`
- **D2**: `https://res.cloudinary.com/dgvje1bpw/image/upload/v1756929437/20230828_201217_ltwuxs.jpg`
- **E2**: `https://res.cloudinary.com/dgvje1bpw/image/upload/v1756929437/20230828_201217_ltwuxs.jpg`
- **F2**: `Autoridades de Ul-Ji junto al Senior Master Julio Bazan`
- **G2**: `belts`
- **H2**: `2023-08-28T10:00:00Z`
- **I2**: `0`
- **J2**: `taekwondo,examenes,estudiantes`

### Copy your existing photos:

```
photo-1	Examen de Taekwondo 28-8-2023	Autoridades de Ul-Ji junto al Senior Master Julio Bazan y a la Sabum Nim Sandra Ojeda.	https://res.cloudinary.com/dgvje1bpw/image/upload/v1756929437/20230828_201217_ltwuxs.jpg	https://res.cloudinary.com/dgvje1bpw/image/upload/v1756929437/20230828_201217_ltwuxs.jpg	Autoridades de Ul-Ji junto al Senior Master Julio Bazan y a la Sabum Nim Sandra Ojeda	belts	2023-08-28T10:00:00Z	0	taekwondo,examenes,estudiantes

photo-15	Clase Abierta en Palermo	Hermosa clase donde padres e hijos practican juntos fortaleciendo vínculos familiares.	https://res.cloudinary.com/dgvje1bpw/image/upload/v1757626504/palermo2_nqmr2z.png	https://res.cloudinary.com/dgvje1bpw/image/upload/v1757626504/palermo2_nqmr2z.png	Clase abierta de Taekwondo en Palermo	students	2024-11-10T16:00:00Z	82	taekwondo,familia,padres,hijos,vínculos

photo-21	Clase Adultos marzo 2024	Intensa sesión de acondicionamiento físico para mejorar fuerza y resistencia.	https://res.cloudinary.com/dgvje1bpw/image/upload/v1757627274/entrenamiento_q31hel.png	https://res.cloudinary.com/dgvje1bpw/image/upload/v1757627274/entrenamiento_q31hel.png	Acondicionamiento físico para Taekwondo	training	2024-03-15T18:00:00Z	52	taekwondo,acondicionamiento,fuerza,resistencia

photo-22	Entrega de Trofeos Torneo Orán 2024	Ceremonia de premiación para los participantes de ACIT en Orán, Salta.	https://res.cloudinary.com/dgvje1bpw/image/upload/v1757627608/20240824_140605_ofc69v.jpg	https://res.cloudinary.com/dgvje1bpw/image/upload/v1757627608/20240824_140605_ofc69v.jpg	Ceremonia de premiación en Torneo Orán 2024	competitions	2024-08-24T12:30:00Z	85	taekwondo,campeonato escolar,jóvenes,talento

photo-24	Participación de Ul-Ji en clase del Master Julio Bazán	Aprovechando el viaje a Tucumán, varios integrantes de Ul-Ji participaron de una clase especial dictada por el Master Julio Bazán.	https://res.cloudinary.com/dgvje1bpw/image/upload/v1757626792/tucuman_bbydkh.jpg	https://res.cloudinary.com/dgvje1bpw/image/upload/v1757626792/tucuman_bbydkh.jpg	Clase del Master Julio Bazán en Tucumán	events	2024-08-26T19:00:00Z	74	taekwondo,navidad,exhibición,celebración
```

## Step 4: Make Sheet Public

1. **Click "Share"** button (top right)
2. **Change access** to "Anyone with the link can view"
3. **Click "Done"**
4. **Copy the sheet ID** from the URL (the long string between `/d/` and `/edit`)

Example URL: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
Sheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 5: Get Google Sheets API Key

1. **Go to Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Create a new project** or select existing one
3. **Enable Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click and enable it
4. **Create credentials** (API Key):
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
5. **Restrict the API key** (recommended):
   - Click on your API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API"
   - Save

## Step 6: Update Your Configuration

Update the `SHEET_CONFIG` in `src/utils/googleSheets.js`:

```javascript
const SHEET_CONFIG = {
  SHEET_ID: 'your_actual_sheet_id_here', // Replace with your sheet ID
  RANGE: 'Photos!A:J',
  API_KEY: 'your_google_api_key_here' // Replace with your API key
};
```

## Step 7: Test Your Setup

1. **Update your configuration** with real values
2. **Clear your browser cache** and reload the gallery page
3. **Check browser console** for any error messages
4. **Add a new photo** to Google Sheets to test live updates

## Categories Available:
- `training` - Entrenamiento
- `competitions` - Competencias  
- `belts` - Exámenes
- `events` - Eventos
- `students` - Estudiantes

## ✅ Benefits:

✅ **Easy Updates**: Add/edit photos without touching code  
✅ **Team Management**: Multiple people can update the gallery  
✅ **Version Control**: Google Sheets tracks changes automatically  
✅ **No Deployment**: Changes appear immediately (after 5-minute cache)  
✅ **Backup**: All data is safely stored in Google Drive  
✅ **Fallback**: Site works even if Google Sheets is unavailable  

## 🔧 Troubleshooting:

**Problem**: "API key not valid"
- **Solution**: Check that your API key is correct and Google Sheets API is enabled

**Problem**: "The caller does not have permission"
- **Solution**: Make sure your Google Sheet is set to "Anyone with the link can view"

**Problem**: "No data found"
- **Solution**: Check that your sheet is named "Photos" and data starts from row 2

**Problem**: Photos not updating
- **Solution**: Wait 5 minutes for cache to expire, or clear cache manually

## 📞 Need Help?

If you encounter issues, check the browser console (F12) for error messages and refer to this guide.