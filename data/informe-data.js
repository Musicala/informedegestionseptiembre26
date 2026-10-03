/** Informe mensual de gestión - MUSICALA / GMMMC. Septiembre de 2026. */
const INFORME_DATA = {
  mes: "Septiembre",
  anio: "2026",
  meses: [9],
  periodo: "1 al 30 de septiembre de 2026",
  institucion: "Fundación San Antonio - GMMMC",
  proyecto: "Clases extracurriculares de danza y porras",
  areas: ["Danzas", "Porras"],
  responsable: "MUSICALA",
  coordinador: "",
  fase: "Procesos de Danzas y Porras: formación técnica y montaje coreográfico",
  indicadores: {
    sesionesProgramadas: 0,
    etiquetaSesiones: "Sesiones realizadas (septiembre)",
    sesionesRealizadas: 9,
    cumplimiento: "No comparable",
    puntualidadDocentes: "100%",
    registrosPuntualidad: 15,
    cambiosDocente: 0,
    horasProgramadas: null,
    horasRealizadas: 18,
    notas: [
      {
        titulo: "Inscripción del segundo semestre",
        texto: "El listado institucional registra 11 NNA inscritos en Danzas y 41 en Porras: 52 NNA distintos en total. Estas cifras corresponden a inscripción y se mantienen como el listado institucional para el segundo semestre; no son un acumulado de asistencias mensuales."
      },
      {
        titulo: "Asistencia y programación de septiembre",
        texto: "En septiembre se reportaron 8 participantes en las sesiones de Danzas. Esta cifra corresponde a participación observada durante el mes y no modifica el listado institucional de personas inscritas. La fuente registra 0 sesiones programadas y 9 realizadas; por ello no se calcula un porcentaje de cumplimiento."
      }
    ]
  },
  resumenEjecutivo: "Durante septiembre de 2026 se dio continuidad a dos procesos formativos de la Fundación San Antonio: Danzas con el grupo GMMMC y Porras con estudiantes del Colegio José Manuel María Camargo. En GMMMC/Danzas se realizaron 9 sesiones y 18 horas de atención, con 8 NNA participantes en el periodo; el seguimiento reporta 100 % de puntualidad docente y ningún cambio o contingencia. En Porras se realizaron 17 sesiones. El trabajo avanzó progresivamente en el montaje de las rutinas Junior y Juvenil, desde las posiciones iniciales y los grupos acrobáticos hasta el avance cercano al 100 % de la rutina Junior al cierre del mes; Juvenil continuó avanzando en su montaje. Los listados institucionales del segundo semestre se mantienen: 11 NNA inscritos en Danzas y 41 en Porras. Estas cifras de inscripción no representan asistencia mensual y los datos de participación de GMMMC/Danzas no se atribuyen al grupo de Porras.",
  avances: [
    "Mayor control y fortalecimiento del core mediante ejercicios dinámicos y progresivos.",
    "Progreso en la comprensión y ejecución técnica de los giros, con incorporación del plié como preparación y apoyo para el control del movimiento.",
    "Avances en ritmo y musicalidad mediante juegos, percusión corporal, escucha y ejercicios de coordinación.",
    "Aprendizaje de pasos básicos de rock and roll y su integración en una frase coreográfica corta.",
    "Aumento progresivo de la dificultad de los ejercicios de acuerdo con la respuesta del grupo.",
    "Buena disposición general para recibir, comprender y aplicar correcciones, tanto en ejercicios conocidos como en nuevos retos.",
    "Incorporación de ejercicios de flexibilidad, estiramiento, coordinación, disociación y concentración."
  ],
  retos: [
    "Continuar fortaleciendo la interiorización del pulso y la coordinación entre música y movimiento.",
    "Reforzar la orientación espacial y el mantenimiento de la dirección durante los giros.",
    "Retomar y profundizar la disociación corporal para mejorar la independencia y coordinación de los segmentos corporales.",
    "Mantener la práctica rítmica gradual, con escucha musical, percusión corporal y ejercicios lúdicos antes de aumentar su complejidad."
  ],
  novedades: [
    "Durante el mes se revisaron ejercicios de periodos anteriores y se ajustaron progresivamente para responder al nivel de incorporación del grupo.",
    "Se introdujo rock and roll desde sus pasos básicos hasta una frase coreográfica corta, integrando técnica, ritmo, coordinación y memoria corporal.",
    "Se realizaron 9 sesiones de Danzas y se reportaron 8 participantes durante el periodo. Este dato mensual se presenta por separado del listado semestral de inscritos.",
    "En GMMMC/Danzas se realizaron 9 sesiones; en Porras del Colegio José Manuel María Camargo se realizaron 17 sesiones durante septiembre.",
    "En GMMMC/Danzas no se reportaron contingencias, sustituciones ni cambios de docente durante septiembre.",
    "El proceso de Porras corresponde al Colegio José Manuel María Camargo y se presenta separado de los indicadores de GMMMC/Danzas.",
    "El informe de septiembre de Porras está fechado el 26 de septiembre y corresponde a la docente Natalia Moreno."
  ],
  procesosPorArea: [
    {
      area: "Danzas", icono: "💃", color: "#6B3FA0",
      descripcion: "En septiembre se realizaron 9 sesiones y 18 horas de atención. El trabajo dio continuidad a los contenidos previos, aumentando progresivamente su dificultad. Se abordaron fortalecimiento del core, técnica de giros y plié, ritmo, coordinación, percusión corporal, pasos básicos de rock and roll y una frase coreográfica corta; también se trabajaron flexibilidad, estiramiento y disociación.",
      sesionesProgramadas: "No comparable", sesionesRealizadas: 9, participantes: 11, etiquetaParticipantes: "NNA inscritos (segundo semestre)",
      avances: [
        "Fortalecimiento del core y mayor control y estabilidad corporal.",
        "Progreso en los giros e incorporación del plié para preparar y controlar el movimiento.",
        "Trabajo de ritmo y musicalidad con juegos, percusión corporal y coordinación.",
        "Aprendizaje de pasos básicos de rock and roll integrados en una frase coreográfica corta.",
        "Buena disposición general para aplicar correcciones y asumir ejercicios de dificultad creciente."
      ],
      retos: [
        "Profundizar en la interiorización del pulso y la coordinación entre música y movimiento.",
        "Reforzar orientación espacial y mantenimiento de la dirección durante los giros.",
        "Retomar la disociación corporal y continuar con ejercicios de coordinación progresiva."
      ],
      proyeccion: "Continuar el trabajo de ritmo, pulso y coordinación con estrategias lúdicas y percusión corporal; reforzar giros, plié, orientación espacial, disociación y fortalecimiento del core; e integrar estos aprendizajes en secuencias coreográficas progresivamente más complejas.",
      cumplimiento: "No comparable"
    },
    {
      area: "Porras · Colegio José Manuel María Camargo", icono: "🎀", color: "#D43B8A",
      descripcion: "Durante septiembre se realizaron 17 sesiones. El proceso de los grupos Junior y Juvenil avanzó desde el acondicionamiento y la construcción de posiciones y grupos acrobáticos hacia el montaje de las posiciones #3 y #4, los saltos, las marcaciones y el repaso de las rutinas. Al 26 de septiembre, Junior reportó un avance cercano al 100 % de su rutina; Juvenil continuaba avanzando en su construcción. El informe mensual docente de Natalia Moreno, fechado el 26 de septiembre, resume el trabajo de acondicionamiento físico para la nueva rutina, circuitos de fuerza y resistencia, memoria muscular, nuevos elementos de gimnasia y construcción de rutinas para su ejecución al cierre de las clases extracurriculares. El listado institucional del segundo semestre registra 41 NNA inscritos en Porras; esa cifra corresponde a inscripción, no a asistencia mensual.",
      sesionesProgramadas: "No reportado", sesionesRealizadas: 17, participantes: 41, etiquetaParticipantes: "NNA inscritos (segundo semestre)",
      avances: [
        "1 de septiembre, Junior: se construyó la nueva rutina y se montaron grupos acrobáticos, medialunas, salto ruso, parada de manos con caída en arco y rollo. La rutina llegó hasta la posición #3 y se reportó mejora de la memoria muscular.",
        "3 de septiembre, Juvenil: se trabajó gimnasia con medialunas con carrera, rollo adelante y parada de manos con caída en arco; se registraron mejor postura y mayor resistencia.",
        "5 de septiembre, Junior y Juvenil: se realizaron circuitos de acondicionamiento y gimnasia. Junior avanzó en su rutina y Juvenil en gimnasia con carrera, medialunas y rondó.",
        "8 y 10 de septiembre: Junior repasó el esquema hasta la posición #3 y montó la posición de saltos, mientras Juvenil construyó la posición #3 y repasó la secuencia desde la primera posición hasta los saltos.",
        "12 de septiembre, Junior y Juvenil: los circuitos de medialunas, parada de manos, arco, rollos y resistencia aeróbica aportaron avance a la rutina Junior y mayor memoria muscular en la gimnasia Juvenil.",
        "15 y 17 de septiembre: Junior reforzó la memoria del esquema y limpió marcaciones, trabajando medialunas, grupos acrobáticos, flyers, bases y saltos; Juvenil avanzó en la simetría de los elementos gimnásticos dentro de la rutina.",
        "19 de septiembre, Junior y Juvenil: el repaso por circuitos de medialunas, rollos y parada de manos con caída en arco fortaleció la gimnasia y la memoria muscular.",
        "22 y 24 de septiembre: Junior formó la posición #4 con arcos y la integró al repaso; Juvenil montó la posición #4 y repasó la rutina completa.",
        "26 de septiembre, Junior y Juvenil: se repasaron las rutinas para la presentación. Junior alcanzó un avance cercano al 100 % de su rutina y Juvenil continuó avanzando en la construcción."
      ],
      retos: [
        "La ausencia de algunas estudiantes dificultó el montaje de posiciones, grupos acrobáticos y partes colectivas de las rutinas.",
        "Continuar el acondicionamiento físico y el desarrollo de fuerza, resistencia, postura, simetría y memoria muscular.",
        "Completar y consolidar la rutina Juvenil, y sostener el repaso y la limpieza técnica de ambas rutinas para su presentación al cierre de las clases extracurriculares."
      ],
      proyeccion: "Finalizar y consolidar la construcción de las rutinas Junior y Juvenil; repasar posiciones, saltos, marcaciones y elementos gimnásticos con limpieza y simetría; continuar circuitos de fuerza, resistencia y acondicionamiento; y favorecer la asistencia para estabilizar grupos acrobáticos y formaciones colectivas.",
      cumplimiento: "No comparable"
    }
  ],
  cumplimientoHorarios: {
    descripcion: "Durante septiembre se registraron 15 controles de puntualidad docente, todos reportados dentro del horario correspondiente, para un resultado del 100 %. No se registraron contingencias, sustituciones ni cambios de docente durante el periodo.",
    porcentajeAsistenciaDocentes: "100%",
    observaciones: "Los indicadores de asistencia, puntualidad y evidencias del consolidado corresponden a GMMMC/Danzas y no deben atribuirse a Porras del Colegio José Manuel María Camargo. Para Porras se reportan 17 sesiones realizadas y se cuenta con el informe mensual docente de Natalia Moreno, fechado el 26 de septiembre. No se dispone del total de asistentes, sesiones programadas, horas ejecutadas ni puntualidad de Porras; estos indicadores permanecen sin cuantificar."
  },
  tableroUrl: "",
  tableroTitulo: "Tablero de seguimiento GMMMC 2026",
  evidencias: [
    { nombre: "Galería de fotos del periodo", descripcion: "38 registros de galería o evidencias del proceso de septiembre. Inicia sesión para ver las imágenes cargadas en Firebase.", url: "", estado: "Disponible", tipo: "galería", fuente: "fotos" },
    { nombre: "Registros de asistencia", descripcion: "9 registros de asistencia correspondientes al periodo de septiembre.", url: "", estado: "Disponible", tipo: "asistencia", fuente: "asistencias" },
    { nombre: "Registros de puntualidad", descripcion: "15 controles de puntualidad docente, todos reportados dentro del horario (100 %).", url: "", estado: "Disponible", tipo: "registro", fuente: "puntualidad" },
    { nombre: "Seguimiento docente de GMMMC/Danzas", descripcion: "Registros docentes y pedagógicos del consolidado de septiembre de GMMMC/Danzas.", url: "", estado: "Disponible", tipo: "registro", fuente: "bitacoras" },
    { nombre: "Informe mensual docente de GMMMC/Danzas", descripcion: "2 informes mensuales docentes en el consolidado de septiembre de GMMMC/Danzas.", url: "", estado: "Disponible", tipo: "carpeta", fuente: "informes" },
    { nombre: "Seguimiento de Porras · Colegio José Manuel María Camargo", descripcion: "Seguimiento diferenciado de las rutinas Junior y Juvenil; 17 sesiones realizadas durante septiembre.", url: "", estado: "Disponible", tipo: "registro", fuente: "bitacoras" },
    { nombre: "Informe mensual de Porras · Natalia Moreno", descripcion: "Informe docente fechado el 26 de septiembre de 2026 sobre acondicionamiento, gimnasia y construcción de rutinas Junior y Juvenil.", url: "", estado: "Disponible", tipo: "carpeta", fuente: "informes" }
  ],
  recomendaciones: [
    "Continuar fortaleciendo la escucha musical, la interiorización del pulso y la coordinación entre movimiento y música.",
    "Mantener estrategias lúdicas y ejercicios de percusión corporal para desarrollar el componente rítmico.",
    "Reforzar la técnica de giros, el uso del plié, la orientación espacial y el control de la dirección.",
    "Retomar y profundizar los ejercicios de disociación corporal, flexibilidad, coordinación y concentración.",
    "Continuar el fortalecimiento del core e incrementar gradualmente la dificultad según la respuesta del grupo.",
    "Desarrollar secuencias coreográficas que integren técnica, ritmo, memoria corporal y musicalidad.",
    "Mantener el registro sistemático de ambos procesos y conservar diferenciadas las asistencias, bitácoras e indicadores de GMMMC/Danzas y Porras del Colegio José Manuel María Camargo.",
    "En Porras, finalizar el montaje de Junior y Juvenil, reforzar limpieza y simetría técnica, y atender el impacto de las ausencias en posiciones y grupos acrobáticos."
  ],
  comentariosFinales: "El balance de septiembre de 2026 recoge avances complementarios en dos procesos que se reportan por separado. En GMMMC/Danzas se realizaron 9 sesiones y 18 horas de atención, con 8 participantes reportadas para el periodo; se avanzó en core, giros, plié, ritmo y rock and roll, y se mantiene como reto la interiorización del pulso y la orientación espacial. En Porras del Colegio José Manuel María Camargo se realizaron 17 sesiones. El seguimiento mensual y el informe docente registran una progresión sostenida en los grupos Junior y Juvenil: Junior alcanzó un avance cercano al 100 % de su rutina al 26 de septiembre, mientras Juvenil continuó en construcción. La ausencia de algunas estudiantes dificultó el montaje de posiciones y grupos acrobáticos. Las cifras institucionales del segundo semestre se mantienen en 11 NNA inscritos en Danzas y 41 en Porras; no equivalen a la asistencia mensual. Los indicadores de puntualidad y asistencia de GMMMC/Danzas no se extrapolan al proceso de Porras.",
  firmas: [
    { cargo: "Coordinación Musicala", nombre: "Jimmy Alexander Caballero Moreno", fecha: "Bogotá, septiembre de 2026" },
    { cargo: "Docente - Porras", nombre: "Natalia Moreno", fecha: "Bogotá, septiembre de 2026" },
    { cargo: "Docente - Danzas", nombre: "", fecha: "Bogotá, septiembre de 2026" },
    { cargo: "Enlace GMMMC / Vo.Bo. Institución", nombre: "", fecha: "Bogotá, septiembre de 2026" }
  ]
};
