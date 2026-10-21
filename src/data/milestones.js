// Taekwondo Historical Milestones
// Important dates and events in Taekwondo history

export const taekwondoMilestones = [
  {
    id: 1,
    year: "50 A.C. - 935 D.C.",
    title: "Era Antigua",
    description: "Los guerreros de la dinastía Shilla (período de los Tres Reinos) desarrollaron el arte marcial \"Taekkyon\" cuya traducción es \"pie-mano\".",
    icon: "ancient",
    color: "brand-red",
    position: "left"
  },
  {
    id: 2,
    year: "1955",
    title: "Era Moderna",
    description: "Después de la independencia de Corea, se oficializa el nacimiento del nombre oficial de \"Taekwon-do\" en 1955, unificando las diferentes escuelas bajo una sola denominación.",
    icon: "heritage",
    color: "orange-600",
    position: "right"
  },
  {
    id: 3,
    year: "1965",
    title: "Difusión Mundial",
    description: "El Embajador Choi, en una misión de buena voluntad del gobierno de Corea del Sur, viajó a varios países para difundir el Taekwon-do.",
    icon: "world",
    color: "yellow-600",
    position: "left"
  },
  {
    id: 4,
    year: "1972",
    title: "Creación ITF",
    description: "El General Choi Hong Hi, por problemas políticos, se exilió en Canadá y fundó el cuartel general de la Federación Internacional de Taekwon-Do (ITF).",
    icon: "organization",
    color: "blue-600",
    position: "right"
  },
  {
    id: 6,
    year: "1988",
    title: "Deporte de Demostración Olímpico",
    description: "El Taekwon-do se presenta como deporte de demostración en los Juegos Olímpicos de Seúl, marcando su entrada al escenario olímpico mundial.",
    icon: "demonstration",
    color: "purple-600",
    position: "left"
  },
  {
    id: 7,
    year: "2000",
    title: "Deporte Olímpico Oficial",
    description: "El Taekwon-do se convierte en deporte olímpico oficial en los Juegos de Sydney 2000, expandiendo su alcance mundial y estandarizando sus reglas de competición.",
    icon: "olympic",
    color: "yellow-600",
    position: "right"
  },
  {
    id: 8,
    year: "2017",
    title: "Reconocimiento UNESCO",
    description: "La UNESCO reconoce al Taekwon-do como Patrimonio Cultural Intangible de la Humanidad, destacando su valor cultural y filosófico.",
    icon: "heritage",
    color: "indigo-600",
    position: "left"
  }
];

// Icon paths for SVG icons
export const milestoneIcons = {
  ancient: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"></path>`,
  modern: `<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
  world: `<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>`,
  organization: `<path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path>`,
  federation: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>`,
  demonstration: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>`,
  olympic: `<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>`,
  heritage: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>`
};

// Helper function to get icon safely
export const getIcon = (iconName) => {
  return milestoneIcons[iconName] || milestoneIcons.ancient;
};

export default taekwondoMilestones;
