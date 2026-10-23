// Builds the prefilled WhatsApp message used by the "Inscribirse" buttons.
export function buildRegistrationMessage({ name = '', date = '' } = {}) {
  const eventName = String(name ?? '').trim()
  const eventDate = String(date ?? '').trim()
  if (!eventName) return 'Hola, quiero inscribirme en un evento de la escuela'
  return eventDate
    ? `Hola, quiero inscribirme en ${eventName} del ${eventDate}`
    : `Hola, quiero inscribirme en ${eventName}`
}
