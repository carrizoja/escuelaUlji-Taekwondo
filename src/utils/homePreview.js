/**
 * Pure helpers for the home page previews (events and schedule).
 * Kept free of import.meta.env so they can be unit tested with `node --test`.
 */

const OPEN_STATUS = /abiert/i
const STALE_STATUS = /^programado$/i

/** Parses a sheet date (M/D/YYYY or ISO). Returns null when empty or invalid. */
export function parseEventDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function resolveStatus(estado, isPast) {
  const status = (estado ?? '').trim()
  if (isPast && (!status || OPEN_STATUS.test(status) || STALE_STATUS.test(status))) {
    return 'Finalizado'
  }
  return status
}

const joinParts = (parts) => parts.filter(Boolean).join(' · ')

const NORMALIZERS = [
  ['examenes', 'Examen', (e) => ({
    title: joinParts([e.tipo, e.grado]),
    detail: joinParts([e.lugar, e.hora]),
  })],
  ['torneos', 'Torneo', (e) => ({
    title: e.nombre,
    detail: joinParts([e.lugar]),
  })],
  ['seminarios', 'Seminario', (e) => ({
    title: e.titulo,
    detail: joinParts([e.lugar]),
  })],
]

/**
 * Picks the events to preview on the home page: the nearest upcoming ones
 * (soonest first) or, when nothing is upcoming, the most recent past ones.
 * Status follows the same rule as the events page: open or scheduled events
 * whose date has passed are shown as "Finalizado".
 */
export function selectPreviewEvents(eventData, { now = new Date(), limit = 3 } = {}) {
  const items = []
  for (const [key, type, describe] of NORMALIZERS) {
    for (const event of eventData?.[key] ?? []) {
      const date = parseEventDate(event.fecha)
      if (!date) continue
      const isPast = date < now
      const status = resolveStatus(event.estado, isPast)
      items.push({
        id: event.id,
        type,
        date,
        isPast,
        status,
        statusOpen: !isPast && OPEN_STATUS.test(status),
        ...describe(event),
      })
    }
  }

  const upcoming = items.filter((e) => !e.isPast).sort((a, b) => a.date - b.date)
  if (upcoming.length > 0) return upcoming.slice(0, limit)
  return items.sort((a, b) => b.date - a.date).slice(0, limit)
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function joinDays(days) {
  const list = days.map((d, i) => (i === 0 ? capitalize(d) : d))
  if (list.length <= 1) return list.join('')
  return `${list.slice(0, -1).join(', ')} y ${list[list.length - 1]}`
}

/** Flattens dojang class schedules into table rows. */
export function buildScheduleRows(dojangs) {
  return dojangs.flatMap((dojang) =>
    dojang.schedules.classes.map((c) => ({
      group: c.category,
      ageRange: c.ageRange,
      days: joinDays(c.days),
      time: c.time.replace(/\s*-\s*/g, ' - '),
      venue: dojang.name,
      neighborhood: dojang.address.neighborhood,
    }))
  )
}
