(function () {
  const STORAGE_KEY = "promptstudio-local-v1";
  const API_BASE =
    location.protocol.startsWith("http") &&
    (location.hostname === "127.0.0.1" || location.hostname === "localhost") &&
    location.port === "8787"
      ? ""
      : "http://127.0.0.1:8787";

  const D = {
    bg: "#F8F5EF",
    surface: "#FFFFFF",
    panel: "#F2EFE8",
    ink: "#1C1915",
    muted: "#8A8279",
    border: "#E5DFD4",
  };
  const SC = {
    tipo: { k: "#C25B3A", p: "#FCF0EC", e: "#EEC4B4" },
    tam: { k: "#3D7A55", p: "#EAF4EE", e: "#9DD0B0" },
    estilo: { k: "#A96A20", p: "#FAF2E4", e: "#DFC080" },
    espacio: { k: "#2A7289", p: "#E5F2F6", e: "#85C8D9" },
    pers: { k: "#8C4070", p: "#F8EBF4", e: "#D8A4CC" },
    cal: { k: "#4A5494", p: "#ECEEF8", e: "#B0B8E0" },
    mob: { k: "#5D6E40", p: "#EDF1E6", e: "#B0C494" },
    pal: { k: "#7A4A80", p: "#F5EEF8", e: "#CCA8D8" },
    adv: { k: "#5E6E50", p: "#EDF1E8", e: "#AFC09A" },
  };

  const PRESENTACIONES = [
    { v: "pared_1", l: "1 lámina en pared", mode: "wall", count: 1 },
    { v: "pared_2", l: "2 láminas en pared", mode: "wall", count: 2 },
    { v: "pared_3", l: "3 láminas en pared", mode: "wall", count: 3 },
    { v: "pared_4", l: "4 láminas en pared", mode: "wall", count: 4 },
    { v: "mujer_hold_1", l: "Mujer sujetando 1 lámina", mode: "hold", count: 1 },
    { v: "mujer_hold_2", l: "Mujer sujetando 2 láminas", mode: "hold", count: 2 },
    { v: "mujer_hold_3", l: "Mujer sujetando 3 láminas", mode: "hold", count: 3 },
    { v: "mujer_hold_4", l: "Mujer sujetando 4 láminas", mode: "hold", count: 4 },
  ];
  const TAMANIOS = [
    { v: "muy_peq", l: "Muy pequeño", ratio: "3:4", compacto: true },
    { v: "peq", l: "Pequeño", ratio: "3:4", compacto: true },
    { v: "med", l: "Mediano", ratio: "4:5", compacto: false },
    { v: "gra", l: "Grande", ratio: "5:7", compacto: false },
  ];
  const ESTILOS = [
    { v: "nordico", l: "Nórdico" },
    { v: "ibicenco", l: "Ibicenco" },
    { v: "boho", l: "Boho" },
    { v: "moderno", l: "Moderno" },
    { v: "japandi", l: "Japandi" },
    { v: "mediterraneo", l: "Mediterráneo" },
    { v: "rustico", l: "Rústico refinado" },
    { v: "minimalista", l: "Minimalista" },
    { v: "contemporaneo", l: "Contemporáneo natural" },
  ];
  const ESPACIOS_SMALL = [
    { v: "rincon_peq", l: "Rincón pequeño", group: "small" },
    { v: "aparador_peq", l: "Aparador pequeño", group: "small" },
    { v: "consola_estrecha", l: "Consola estrecha", group: "small" },
    { v: "mueble_auxiliar", l: "Mueble auxiliar", group: "small" },
    { v: "lectura", l: "Rincón de lectura", group: "small" },
    { v: "relax", l: "Rincón de relax", group: "small" },
    { v: "pasillo_corto", l: "Pasillo corto", group: "small" },
    { v: "recibidor_peq", l: "Recibidor pequeño", group: "small" },
    { v: "comoda_baja", l: "Cómoda baja", group: "small" },
    { v: "banco_ventana", l: "Banco junto a ventana", group: "small" },
    { v: "pared_corta", l: "Pared corta", group: "small" },
    { v: "esquina_comp", l: "Esquina compacta", group: "small" },
  ];
  const ESPACIOS_LARGE = [
    { v: "salon_grande", l: "Salón grande", group: "large" },
    { v: "salon_sobre_sofa", l: "Salón sobre sofá", group: "large" },
    { v: "comedor_amplio", l: "Comedor amplio", group: "large" },
    { v: "comedor_aparador_largo", l: "Comedor sobre aparador largo", group: "large" },
    { v: "dormitorio_amplio", l: "Dormitorio amplio", group: "large" },
    { v: "dormitorio_cabecero", l: "Dormitorio sobre cabecero", group: "large" },
    { v: "pared_grande", l: "Pared grande", group: "large" },
    { v: "zona_abierta", l: "Zona abierta", group: "large" },
    { v: "estancia_principal", l: "Estancia principal", group: "large" },
    { v: "salon_comedor", l: "Salón-comedor", group: "large" },
    { v: "pared_mueble_largo", l: "Pared amplia con mueble largo", group: "large" },
  ];
  const ESPACIOS = ESPACIOS_SMALL.concat(ESPACIOS_LARGE);
  const PERSON_COUNT_OPS = [
    { v: "none", l: "Sin personas" },
    { v: "1", l: "1 persona" },
    { v: "2", l: "2 personas" },
  ];
  const PERSON_TYPE_OPS = [
    { v: "mujer_35", l: "Mujer 35 años natural" },
    { v: "hombre", l: "Hombre" },
    { v: "pareja", l: "Pareja" },
    { v: "neutra", l: "Persona neutra" },
  ];
  const PERSON_ROLE_OPS = [
    { v: "secundaria", l: "Secundaria" },
    { v: "protagonista", l: "Protagonista" },
  ];
  const ACCIONES = [
    { v: "leyendo", l: "Leyendo" },
    { v: "sonriendo", l: "Sonriendo" },
    { v: "hablando", l: "Hablando" },
    { v: "cafe", l: "Tomando café" },
    { v: "colocando", l: "Colocando objetos" },
    { v: "escribiendo", l: "Escribiendo" },
    { v: "hojeando", l: "Hojeando revista" },
    { v: "vida_cotidiana", l: "Vida cotidiana" },
    { v: "sujetando_laminas", l: "Sujetando láminas" },
  ];
  const INTERACCIONES = [
    { v: "sola", l: "Sola" },
    { v: "con_otra", l: "Con otra persona" },
    { v: "con_libro", l: "Con libro" },
    { v: "con_taza", l: "Con taza" },
    { v: "con_objetos", l: "Con objetos decorativos" },
    { v: "sin_mirar_prod", l: "Sin mirar al producto" },
  ];
  const LUCES = [
    { v: "neutra", l: "Neutra y limpia" },
    { v: "luminosa", l: "Muy luminosa" },
    { v: "lateral", l: "Lateral suave" },
    { v: "ventanal", l: "Gran ventanal" },
    { v: "blancos", l: "Blancos puros" },
  ];
  const DIST_OPS_BY_COUNT = {
    1: [
      { v: "centrada", l: "Centrada" },
      { v: "unica_vertical", l: "Única vertical" },
      { v: "sobre_aparador", l: "Sobre aparador" },
      { v: "sobre_consola", l: "Sobre consola" },
    ],
    2: [
      { v: "horizontal", l: "Horizontal" },
      { v: "vertical", l: "Vertical" },
      { v: "simetrica", l: "Simétrica" },
      { v: "asimetrica", l: "Asimétrica" },
    ],
    3: [
      { v: "horizontal", l: "Horizontal" },
      { v: "vertical", l: "Vertical" },
      { v: "dos_uno", l: "2 abajo + 1 arriba" },
      { v: "uno_dos", l: "1 arriba + 2 abajo" },
      { v: "escalonada", l: "Escalonada" },
      { v: "editorial", l: "Editorial" },
      { v: "simetrica", l: "Simétrica" },
      { v: "asimetrica", l: "Asimétrica" },
    ],
    4: [
      { v: "grid_2x2", l: "2x2" },
      { v: "horizontal_lineal", l: "Horizontal lineal" },
      { v: "vertical_lineal", l: "Vertical lineal" },
      { v: "bloque_editorial", l: "Bloque editorial" },
      { v: "simetrica", l: "Simétrica" },
    ],
  };
  const DECO_OPS = [
    { v: "poca", l: "Poca" },
    { v: "equilibrada", l: "Equilibrada" },
    { v: "rica", l: "Rica" },
    { v: "muy_rica", l: "Muy rica" },
  ];
  const LANG_OPS = [
    { v: "es", l: "Español" },
    { v: "en", l: "English" },
  ];
  const MODE_OPS = [
    { v: "local", l: "Modo local" },
    { v: "ia", l: "Modo IA" },
  ];

  const MOB_MODE = [
    { v: "auto", l: "Automático" },
    { v: "guided", l: "Guiado" },
    { v: "manual", l: "Manual" },
  ];
  const MUEBLES_OPS = [
    { v: "auto", l: "Automático", txt: "", compacto: false },
    { v: "aparador_bajo", l: "Aparador bajo", txt: "un aparador bajo de madera natural clara", compacto: false },
    { v: "aparador_rustico", l: "Aparador rústico", txt: "un aparador rústico de madera con pátina", compacto: false },
    { v: "aparador_peq", l: "Aparador pequeño", txt: "un aparador pequeño de madera lavada", compacto: true },
    { v: "consola", l: "Consola estrecha", txt: "una consola estrecha de roble", compacto: true },
    { v: "comoda", l: "Cómoda baja", txt: "una cómoda baja de madera natural", compacto: true },
    { v: "banco_obra", l: "Banco de obra", txt: "un banco de obra blanco", compacto: true },
    { v: "banco_madera", l: "Banco de madera", txt: "un banco de madera con pátina natural", compacto: true },
    { v: "mesa_aux", l: "Mesa auxiliar", txt: "una mesa auxiliar pequeña", compacto: true },
    { v: "escritorio_peq", l: "Escritorio pequeño", txt: "un escritorio pequeño de madera", compacto: false },
    { v: "repisa", l: "Repisa o balda", txt: "una repisa de madera natural", compacto: false },
    { v: "vintage_peq", l: "Mueble vintage", txt: "un mueble vintage pequeño con carácter", compacto: false },
    { v: "sin_mueble", l: "Sin mueble", txt: "sin mueble principal", compacto: true },
  ];
  const APOYOS_OPS = [
    { v: "auto", l: "Automático", txt: "" },
    { v: "butaca", l: "Butaca lino", txt: "una butaca de lino natural" },
    { v: "silla_f", l: "Silla fibras", txt: "una silla de fibras naturales" },
    { v: "taburete", l: "Taburete", txt: "un taburete de madera bajo" },
    { v: "puff", l: "Puff de yute", txt: "un puff de yute" },
    { v: "banco_aux", l: "Banco auxiliar", txt: "un banco auxiliar de madera" },
    { v: "banco_c", l: "Banco corrido", txt: "un banco corrido de madera" },
    { v: "sin", l: "Sin apoyo", txt: "" },
  ];
  const LAMPARA_OPS = [
    { v: "auto", l: "Automático", txt: "" },
    { v: "cerama", l: "Lámpara cerámica", txt: "una lámpara de cerámica artesanal encendida" },
    { v: "lino", l: "Lámpara lino", txt: "una lámpara con pantalla de lino" },
    { v: "barro", l: "Lámpara barro", txt: "una lámpara de barro claro artesanal" },
    { v: "aplique", l: "Aplique sencillo", txt: "un aplique de pared de latón mate" },
    { v: "sobremesa", l: "Sobremesa", txt: "una lámpara de sobremesa artesanal" },
    { v: "sin", l: "Sin lámpara", txt: "" },
  ];
  const VEGETA_OPS = [
    { v: "auto", l: "Automático", txt: "" },
    { v: "olivo", l: "Ramas de olivo", txt: "ramas de olivo en jarrón alto" },
    { v: "eucali", l: "Eucalipto", txt: "un ramo de eucalipto en florero" },
    { v: "seco", l: "Ramo seco", txt: "un ramo seco en jarrón de barro" },
    { v: "hoja_r", l: "Hoja redonda", txt: "una planta de hoja redonda pequeña" },
    { v: "maceta", l: "Planta maceta", txt: "una planta pequeña en maceta artesanal" },
    { v: "mediter", l: "Mediterránea", txt: "una planta mediterránea discreta" },
    { v: "sin", l: "Sin vegetación", txt: "" },
  ];
  const OBJETOS_OPS = [
    { v: "libros", l: "Libros" },
    { v: "jarron", l: "Jarrón" },
    { v: "cuenco", l: "Cuenco artesanal" },
    { v: "bandeja", l: "Bandeja" },
    { v: "cestas", l: "Cestas" },
    { v: "vela", l: "Vela" },
    { v: "ceramica_peq", l: "Cerámica pequeña" },
    { v: "jarra_vidrio", l: "Jarra de vidrio" },
    { v: "escultura", l: "Pieza escultórica" },
    { v: "caja_madera", l: "Caja de madera" },
    { v: "revistas", l: "Revistas" },
    { v: "cuenco_barro", l: "Cuenco de barro" },
    { v: "portavelas", l: "Portavelas" },
    { v: "marco_vacio", l: "Marco vacío" },
  ];
  const OBJETOS_TXT = {
    libros: "libros apilados",
    jarron: "un jarrón artesanal",
    cuenco: "un cuenco artesanal",
    bandeja: "una bandeja de fibras",
    cestas: "una cesta de mimbre",
    vela: "una vela sin quemar",
    ceramica_peq: "una cerámica pequeña",
    jarra_vidrio: "una jarra de vidrio soplado",
    escultura: "una pieza escultórica de barro",
    caja_madera: "una caja de madera",
    revistas: "revistas dobladas",
    cuenco_barro: "un cuenco de barro",
    portavelas: "un portavelas discreto",
    marco_vacio: "un pequeño marco vacío secundario",
  };
  const TEXTIL_OPS = [
    { v: "auto", l: "Automático", txt: "" },
    { v: "cojines_lino", l: "Cojines lino", txt: "cojines de lino blanco roto" },
    { v: "manta", l: "Manta doblada", txt: "una manta de algodón natural doblada" },
    { v: "plaid", l: "Plaid natural", txt: "un plaid en tono beige muy claro" },
    { v: "alfombra", l: "Alfombra yute", txt: "una alfombra de yute en el suelo" },
    { v: "lino_arrug", l: "Lino arrugado", txt: "lino arrugado de forma natural" },
    { v: "neutro", l: "Textil neutro", txt: "un textil ligero en tono neutro" },
    { v: "sin_manta", l: "Sin manta", txt: "" },
    { v: "sin_alfombra", l: "Sin alfombra", txt: "" },
  ];
  const INTENS_OPS = [
    { v: "muy_limpia", l: "Muy limpia" },
    { v: "equilibrada", l: "Equilibrada" },
    { v: "rica", l: "Rica" },
    { v: "muy_rica", l: "Muy rica" },
  ];

  const PAL_PALETAS = [
    { v: "neutros", l: "Neutros", dot: "#C8C0B0" },
    { v: "verdes_suaves", l: "Verdes suaves", dot: "#8DB88D" },
    { v: "verde_oliva", l: "Verde oliva", dot: "#7A8A50" },
    { v: "verdes_apagados", l: "Verdes apagados", dot: "#6A8070" },
    { v: "azul_grisaceo", l: "Azul grisáceo", dot: "#7090A0" },
    { v: "azules_suaves", l: "Azules suaves", dot: "#80A0C0" },
    { v: "terracota", l: "Terracota", dot: "#C07060" },
    { v: "arena", l: "Arena", dot: "#C8B090" },
    { v: "beige_suave", l: "Beige suave", dot: "#D4C8A8" },
    { v: "marrones_calidos", l: "Marrones cálidos", dot: "#A89070" },
    { v: "negro_grafito", l: "Negro / grafito", dot: "#404040" },
    { v: "rosa_empolvado", l: "Rosa empolvado", dot: "#D0A0A8" },
    { v: "teja_suave", l: "Teja suave", dot: "#C08870" },
    { v: "mostaza_suave", l: "Mostaza suave", dot: "#C8A840" },
    { v: "burdeos_suave", l: "Burdeos suave", dot: "#904060" },
    { v: "sin_color", l: "Sin color guía", dot: "#D0D0D0" },
  ];
  const PAL_INTENS = [
    { v: "muy_sutil", l: "Muy sutil" },
    { v: "sutil", l: "Sutil" },
    { v: "media", l: "Media" },
  ];
  const PAL_DONDE = [
    { v: "cojines", l: "Cojines" },
    { v: "manta", l: "Manta / plaid" },
    { v: "ceramica", l: "Cerámica pequeña" },
    { v: "jarron", l: "Jarrón" },
    { v: "libros", l: "Libros" },
    { v: "cuenco", l: "Cuenco artesanal" },
    { v: "bandeja", l: "Bandeja" },
    { v: "textiles", l: "Textiles ligeros" },
    { v: "alfombra", l: "Alfombra" },
    { v: "planta", l: "Planta o ramas" },
    { v: "lampara", l: "Lámpara" },
    { v: "escultura", l: "Pieza escultórica" },
  ];
  const PAL_MODE = [
    { v: "auto", l: "Automático" },
    { v: "guided", l: "Guiado" },
    { v: "manual", l: "Manual" },
  ];
  const PAL_LABEL = {
    neutros: "neutros y tonos piedra",
    verdes_suaves: "verdes suaves y naturales",
    verde_oliva: "verde oliva apagado",
    verdes_apagados: "verdes apagados tipo salvia",
    azul_grisaceo: "azul grisáceo muy contenido",
    azules_suaves: "azules suaves tipo pizarra",
    terracota: "terracota clara y cálida",
    arena: "arena y ocre suave",
    beige_suave: "beige suave y lino claro",
    marrones_calidos: "marrones cálidos suaves",
    negro_grafito: "negro o grafito contenido",
    rosa_empolvado: "rosa empolvado muy suave",
    teja_suave: "teja y naranja tostado suave",
    mostaza_suave: "mostaza y dorado apagado muy suave",
    burdeos_suave: "burdeos muy apagado y elegante",
    sin_color: "",
  };
  const DONDE_LABEL = {
    cojines: "cojines",
    manta: "manta o plaid",
    ceramica: "cerámica pequeña",
    jarron: "jarrón",
    libros: "lomos de libros",
    cuenco: "cuenco artesanal",
    bandeja: "bandeja",
    textiles: "textiles ligeros",
    alfombra: "alfombra",
    planta: "vegetación y ramas",
    lampara: "lámpara",
    escultura: "pieza escultórica pequeña",
  };
  const PAL_AUTO_DONDE = [
    ["cojines", "ceramica", "libros"],
    ["manta", "jarron", "textiles"],
    ["cuenco", "planta", "ceramica"],
    ["bandeja", "libros", "alfombra"],
    ["ceramica", "cojines", "escultura"],
    ["jarron", "textiles", "planta"],
    ["libros", "manta", "cuenco"],
    ["planta", "ceramica", "bandeja"],
  ];

  const DEFAULT_PEOPLE = {
    cantidad: "none",
    tipo: "mujer_35",
    rol: "secundaria",
    accion: "vida_cotidiana",
    interaccion: "sola",
  };
  const DEFAULT_MOB = {
    mode: "auto",
    mueble: "auto",
    apoyo: "auto",
    lampara: "auto",
    vegeta: "auto",
    objetos: [],
    textil: "auto",
    intens: "equilibrada",
  };
  const DEFAULT_PAL = {
    active: false,
    paletas: [],
    intens: "sutil",
    donde: [],
    mode: "auto",
  };
  const DEFAULT_STATE = {
    tipo: "pared_3",
    tam: "peq",
    estilo: "nordico",
    espacio: "rincon_peq",
    people: clone(DEFAULT_PEOPLE),
    luz: "neutra",
    deco: "equilibrada",
    dist: "horizontal",
    marco: true,
    cristal: true,
    lang: "es",
    generationMode: "local",
    mob: clone(DEFAULT_MOB),
    pal: clone(DEFAULT_PAL),
    seed: 0,
  };
  const PRESETS = [
    {
      l: "🌿 Ibicenco compacto",
      s: {
        tipo: "pared_2",
        tam: "peq",
        estilo: "ibicenco",
        espacio: "aparador_peq",
        people: clone(DEFAULT_PEOPLE),
        luz: "luminosa",
        deco: "rica",
        dist: "horizontal",
        marco: true,
        cristal: true,
        lang: "es",
        generationMode: "local",
        mob: { ...clone(DEFAULT_MOB), mueble: "aparador_peq", intens: "rica" },
        pal: clone(DEFAULT_PAL),
      },
    },
    {
      l: "🪴 Lectura con persona",
      s: {
        tipo: "pared_3",
        tam: "peq",
        estilo: "boho",
        espacio: "lectura",
        people: { cantidad: "1", tipo: "mujer_35", rol: "secundaria", accion: "leyendo", interaccion: "con_libro" },
        luz: "neutra",
        deco: "rica",
        dist: "horizontal",
        marco: true,
        cristal: false,
        lang: "es",
        generationMode: "local",
        mob: { ...clone(DEFAULT_MOB), vegeta: "olivo", intens: "rica" },
        pal: clone(DEFAULT_PAL),
      },
    },
    {
      l: "❄ Consola nórdica",
      s: {
        tipo: "pared_1",
        tam: "peq",
        estilo: "nordico",
        espacio: "consola_estrecha",
        people: clone(DEFAULT_PEOPLE),
        luz: "blancos",
        deco: "poca",
        dist: "sobre_consola",
        marco: true,
        cristal: false,
        lang: "es",
        generationMode: "local",
        mob: { ...clone(DEFAULT_MOB), mueble: "consola", intens: "muy_limpia" },
        pal: clone(DEFAULT_PAL),
      },
    },
    {
      l: "🤍 Mujer protagonista",
      s: {
        tipo: "mujer_hold_3",
        tam: "med",
        estilo: "nordico",
        espacio: "rincon_peq",
        people: { cantidad: "1", tipo: "mujer_35", rol: "protagonista", accion: "sujetando_laminas", interaccion: "sola" },
        luz: "luminosa",
        deco: "equilibrada",
        dist: "horizontal",
        marco: false,
        cristal: false,
        lang: "es",
        generationMode: "local",
        mob: clone(DEFAULT_MOB),
        pal: clone(DEFAULT_PAL),
      },
    },
    {
      l: "🏛 Pasillo editorial",
      s: {
        tipo: "pared_3",
        tam: "peq",
        estilo: "moderno",
        espacio: "pasillo_corto",
        people: clone(DEFAULT_PEOPLE),
        luz: "lateral",
        deco: "poca",
        dist: "editorial",
        marco: true,
        cristal: true,
        lang: "es",
        generationMode: "local",
        mob: { ...clone(DEFAULT_MOB), mueble: "consola", lampara: "aplique", intens: "muy_limpia" },
        pal: clone(DEFAULT_PAL),
      },
    },
    {
      l: "🛏 Dormitorio amplio",
      s: {
        tipo: "pared_4",
        tam: "gra",
        estilo: "japandi",
        espacio: "dormitorio_cabecero",
        people: clone(DEFAULT_PEOPLE),
        luz: "neutra",
        deco: "equilibrada",
        dist: "grid_2x2",
        marco: true,
        cristal: false,
        lang: "es",
        generationMode: "local",
        mob: { ...clone(DEFAULT_MOB), mueble: "comoda", vegeta: "seco", intens: "equilibrada" },
        pal: clone(DEFAULT_PAL),
      },
    },
    {
      l: "☕ Salón con pareja",
      s: {
        tipo: "pared_2",
        tam: "med",
        estilo: "contemporaneo",
        espacio: "salon_sobre_sofa",
        people: { cantidad: "2", tipo: "pareja", rol: "secundaria", accion: "cafe", interaccion: "con_otra" },
        luz: "neutra",
        deco: "equilibrada",
        dist: "simetrica",
        marco: true,
        cristal: true,
        lang: "es",
        generationMode: "local",
        mob: { ...clone(DEFAULT_MOB), lampara: "sobremesa", intens: "equilibrada" },
        pal: clone(DEFAULT_PAL),
      },
    },
  ];

  const AUTO_MUEBLES = [
    "un aparador bajo de madera natural clara",
    "una consola estrecha de roble",
    "una cómoda baja de madera lavada",
    "un banco de obra blanco",
    "un banco de madera con pátina natural",
    "un mueble rústico pequeño de madera con cajones",
    "una repisa de madera natural",
    "un aparador pequeño de madera con pátina envejecida",
    "una mesa auxiliar pequeña de madera natural",
    "un mueble vintage pequeño con carácter",
  ];
  const AUTO_MUEBLES_BY_SPACE = {
    salon_grande: [
      "un sofá de lino claro de líneas limpias",
      "un sofá amplio en tono crudo con presencia serena",
      "un sofá bajo y proporcionado en lino natural",
    ],
    salon_sobre_sofa: [
      "un sofá de lino claro de líneas limpias",
      "un sofá amplio en tono crudo con presencia serena",
      "un sofá bajo y proporcionado en lino natural",
    ],
    dormitorio_amplio: [
      "un cabecero tapizado claro y minimalista",
      "un cabecero de lino natural muy sereno",
      "una cama con cabecero bajo de tela clara",
    ],
    dormitorio_cabecero: [
      "un cabecero tapizado claro y minimalista",
      "un cabecero de lino natural muy sereno",
      "una cama con cabecero bajo de tela clara",
    ],
    comedor_amplio: [
      "un aparador largo de madera natural clara",
      "un aparador lineal de comedor en roble lavado",
      "un mueble bajo largo de comedor en madera clara",
    ],
    comedor_aparador_largo: [
      "un aparador largo de madera natural clara",
      "un aparador lineal de comedor en roble lavado",
      "un mueble bajo largo de comedor en madera clara",
    ],
    pared_mueble_largo: [
      "un mueble largo y bajo de madera clara",
      "un aparador lineal ancho y proporcionado",
      "un banco bajo largo de madera natural",
    ],
  };
  const COMPACTO_MUEBLES = [
    "un aparador pequeño de madera lavada",
    "una consola estrecha de roble",
    "una cómoda baja de madera natural",
    "un banco de obra blanco",
    "un banco de madera con pátina natural",
    "una mesa auxiliar pequeña",
  ];
  const AUTO_APOYOS = [
    "una butaca de lino natural cerca",
    "una silla de fibras naturales al lado",
    "un puff de yute en el lateral",
    "un taburete de madera bajo",
    "",
    "",
  ];
  const AUTO_LAMPARAS = [
    "una lámpara de cerámica artesanal encendida",
    "una lámpara con pantalla de lino",
    "un aplique de pared de latón mate",
    "una lámpara de barro claro artesanal",
    "una lámpara de sobremesa artesanal",
    "",
    "",
  ];
  const AUTO_VEGETA = [
    "ramas de olivo en jarrón alto",
    "un ramo de eucalipto en florero",
    "una planta de hoja redonda pequeña",
    "un ramo seco en jarrón de barro",
    "una planta pequeña en maceta artesanal",
    "una planta mediterránea discreta",
    "",
  ];
  const AUTO_OBJETOS = [
    ["libros apilados", "un cuenco artesanal blanco", "una vela sin quemar"],
    ["libros apilados", "una jarra de vidrio soplado", "una cerámica pequeña"],
    ["una bandeja de fibras", "un cuenco de cerámica", "una pieza escultórica de barro"],
    ["libros apilados en horizontal", "una cesta de mimbre", "un cuenco artesanal"],
    ["una bandeja de madera con vela", "libros apilados"],
    ["una caja de madera", "cerámica blanca pequeña", "ramas secas en frasco"],
    ["pieza escultórica de barro", "vela gruesa", "libros apilados"],
    ["revistas dobladas", "un cuenco de barro", "una bandeja de fibras"],
    ["un portavelas discreto", "libros", "cerámica artesanal pequeña"],
    ["una jarra de vidrio soplado", "un cuenco de barro", "lino arrugado"],
  ];
  const AUTO_TEXTILES = [
    "cojines de lino blanco roto",
    "una manta de algodón natural doblada",
    "una alfombra de yute en el suelo",
    "lino arrugado de forma natural",
    "un plaid en tono beige muy claro",
    "",
  ];
  const AUTO_COMPOSICIONES = [
    "una composición compacta y equilibrada con mobiliario proporcionado",
    "un rincón bien editado con capas suaves y circulación real",
    "una escena recogida con apoyo visual lateral y accesorios variados",
    "una composición natural de interiorismo con pesos visuales muy medidos",
    "un encuadre editorial con mueble principal bien proporcionado y acentos sutiles",
    "una escena realista con elementos vividos y distribución muy coherente",
  ];
  const ACTION_VARIATIONS = {
    leyendo: ["leyendo un libro con calma", "leyendo unas páginas de forma relajada", "leyendo de manera tranquila junto a la escena"],
    sonriendo: ["sonriendo con naturalidad", "sonriendo suavemente", "con una sonrisa leve y espontánea"],
    hablando: ["hablando con naturalidad", "manteniendo una conversación relajada", "comentando algo de forma distendida"],
    cafe: ["tomando café de forma espontánea", "sosteniendo una taza con naturalidad", "disfrutando de un café de forma casual"],
    colocando: ["colocando algunos objetos decorativos", "ajustando un detalle decorativo con suavidad", "moviendo un objeto decorativo de forma natural"],
    escribiendo: ["escribiendo en un cuaderno", "anotando algo con calma", "escribiendo de manera relajada en una libreta"],
    hojeando: ["hojeando una revista", "revisando una revista de decoración", "pasando páginas de una revista con naturalidad"],
    vida_cotidiana: ["haciendo vida cotidiana", "en una acción doméstica muy natural", "habitando el espacio con naturalidad"],
    sujetando_laminas: ["sujetando las láminas con naturalidad", "mostrando las láminas con gesto sereno", "sosteniendo las láminas de forma clara y protagonista"],
  };

  const ESTILO_BASE = {
    nordico: "pared blanca lisa en acabado mate, madera clara, textiles de lino, cerámica blanca, ambiente limpio y luminoso",
    ibicenco: "pared blanca lisa en acabado mate, madera natural clara o lavada, fibras naturales, cerámica artesanal, sensación mediterránea real",
    boho: "pared blanca lisa en acabado mate, madera rústica, fibras naturales, lino, capas visuales y ambiente acogedor y vivido",
    moderno: "pared blanca lisa en acabado mate, líneas muy limpias, materiales depurados, composición precisa",
    japandi: "pared blanca lisa en acabado mate, calma visual, materiales naturales, equilibrio y simplicidad",
    mediterraneo: "pared blanca lisa en acabado mate, madera natural, cerámica artesanal y ambiente mediterráneo auténtico",
    rustico: "pared blanca lisa en acabado mate, madera con veta natural, textiles de algodón grueso e imperfecciones bonitas",
    minimalista: "pared blanca lisa en acabado mate, silencio visual extremo y composición muy cuidada",
    contemporaneo: "pared blanca lisa en acabado mate, mezcla de madera y metal mate, textiles suaves",
  };
  const ESPACIO_TXT = {
    rincon_peq: "un rincón pequeño y compacto",
    aparador_peq: "el entorno de un aparador pequeño",
    consola_estrecha: "el entorno de una consola estrecha",
    mueble_auxiliar: "el entorno de un mueble auxiliar pequeño",
    lectura: "un rincón de lectura acogedor",
    relax: "un rincón de relax sereno y contenido",
    pasillo_corto: "un pasillo corto",
    recibidor_peq: "un recibidor pequeño",
    comoda_baja: "el entorno de una cómoda baja",
    banco_ventana: "el rincón junto a un banco cercano a la ventana",
    pared_corta: "una pared corta",
    esquina_comp: "una esquina compacta",
    salon_grande: "un salón grande y bien proporcionado",
    comedor_amplio: "un comedor amplio",
    dormitorio_amplio: "un dormitorio amplio",
    dormitorio_cabecero: "un dormitorio amplio con la composición situada sobre el cabecero",
    pared_grande: "una pared grande proporcionada",
    zona_abierta: "una zona abierta bien resuelta",
    estancia_principal: "la estancia principal",
    salon_sobre_sofa: "un salón amplio con la composición situada sobre el sofá principal",
    salon_comedor: "un salón-comedor amplio",
    comedor_aparador_largo: "un comedor amplio con la composición sobre un aparador largo",
    pared_mueble_largo: "una pared amplia con mueble largo",
  };
  const SPACE_PLACEMENT_TXT = {
    aparador_peq: "sobre un aparador pequeño bien proporcionado",
    consola_estrecha: "sobre una consola estrecha",
    mueble_auxiliar: "sobre un mueble auxiliar pequeño y bien escalado",
    comoda_baja: "sobre una cómoda baja",
    relax: "en una pared corta asociada a un rincón de relax",
    pared_corta: "sobre una pared corta bien medida",
    salon_sobre_sofa: "sobre el sofá principal",
    comedor_aparador_largo: "sobre un aparador largo de comedor",
    dormitorio_cabecero: "sobre el cabecero de la cama",
    pared_mueble_largo: "sobre un mueble largo bien proporcionado",
    salon_comedor: "sobre una pared principal del salón-comedor, preferiblemente en relación con el sofá o un mueble largo",
    salon_grande: "sobre el sofá principal",
    comedor_amplio: "sobre un aparador largo de comedor",
    dormitorio_amplio: "sobre el cabecero de la cama",
    pared_grande: "en una pared grande pero visualmente contenida por mobiliario y escala",
    zona_abierta: "en un frente de pared claro dentro de la zona abierta, sin quedar perdido",
    estancia_principal: "en la pared protagonista de la estancia principal, bien integrada con el mobiliario",
  };
  const LUZ_TXT = {
    neutra: "mucha luz natural neutra y limpia",
    luminosa: "muchísima luz natural directa",
    lateral: "luz natural lateral suave",
    ventanal: "luz de gran ventanal inundando el espacio",
    blancos: "luz blanca y muy limpia",
  };
  const DIST_TXT = {
    centrada: "centrada sobre el eje visual principal",
    unica_vertical: "en una única presencia vertical muy limpia",
    sobre_aparador: "centrada sobre un aparador proporcionado",
    sobre_consola: "centrada sobre una consola estrecha",
    horizontal: "alineadas en horizontal con ritmo limpio",
    vertical: "alineadas en vertical con lectura clara",
    dos_uno: "dos abajo y una arriba, bien compensadas",
    uno_dos: "una arriba y dos abajo, con jerarquía equilibrada",
    escalonada: "en una composición escalonada natural",
    editorial: "en una agrupación editorial con tensión controlada",
    simetrica: "en una composición simétrica precisa",
    asimetrica: "en una composición asimétrica equilibrada",
    grid_2x2: "en una retícula 2x2 perfectamente ordenada",
    horizontal_lineal: "en una línea horizontal continua",
    vertical_lineal: "en una línea vertical continua",
    bloque_editorial: "en un bloque editorial compacto",
  };
  const INTERACCION_TXT = {
    sola: "sin acompañantes y con actitud natural",
    con_otra: "interactuando con la otra persona de forma suave",
    con_libro: "acompañada por un libro o revista",
    con_taza: "con una taza integrada en la acción",
    con_objetos: "interactuando con objetos decorativos",
    sin_mirar_prod: "sin mirar hacia el producto",
  };
  const DECO_TXT = {
    poca: "decoración general contenida y limpia",
    equilibrada: "decoración general equilibrada y coherente",
    rica: "decoración general rica, cuidada y cálida",
    muy_rica: "decoración general abundante pero ordenada",
  };
  const INTENS_TXT = {
    muy_limpia: "espacio muy limpio, mínima decoración",
    equilibrada: "decoración equilibrada y curada",
    rica: "decoración generosa con varias capas visuales",
    muy_rica: "decoración muy rica y vivida, múltiples capas visuales",
  };

  let state = loadState();
  const ui = {
    showAdv: false,
    showMob: false,
    showPal: false,
    showNeg: false,
    showShort: false,
    copied: null,
    activePreset: null,
    aiPrompt: "",
    aiError: "",
    loadingAi: false,
    apiStatus: { checked: false, ok: false, configured: false, model: "", message: "Comprobando backend local..." },
  };

  const root = document.getElementById("app");

  init();

  function init() {
    root.addEventListener("click", handleClick);
    render();
    pingApi();
  }

  function handleClick(event) {
    const el = event.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;

    if (action === "set-root") {
      updateState(el.dataset.key, castValue(el.dataset.value));
      return;
    }
    if (action === "set-people") {
      updatePeople(el.dataset.key, castValue(el.dataset.value));
      return;
    }
    if (action === "set-mob") {
      updateMob(el.dataset.key, castValue(el.dataset.value));
      return;
    }
    if (action === "set-pal") {
      updatePal(el.dataset.key, castValue(el.dataset.value));
      return;
    }
    if (action === "toggle-obj") {
      toggleListValue("mob", "objetos", el.dataset.value);
      return;
    }
    if (action === "toggle-paleta") {
      toggleListValue("pal", "paletas", el.dataset.value);
      return;
    }
    if (action === "toggle-donde") {
      toggleListValue("pal", "donde", el.dataset.value);
      return;
    }
    if (action === "toggle-boolean") {
      updateState(el.dataset.key, !state[el.dataset.key]);
      return;
    }
    if (action === "toggle-panel") {
      ui[el.dataset.key] = !ui[el.dataset.key];
      render();
      return;
    }
    if (action === "apply-preset") {
      applyPreset(Number(el.dataset.index));
      return;
    }
    if (action === "copy") {
      copyText(el.dataset.which);
      return;
    }
    if (action === "regenerate") {
      state.seed += 7;
      clearAiResult();
      persist();
      render();
      return;
    }
    if (action === "reset") {
      state = clone(DEFAULT_STATE);
      ui.activePreset = null;
      ui.showAdv = false;
      ui.showMob = false;
      ui.showPal = false;
      ui.showNeg = false;
      ui.showShort = false;
      clearAiResult();
      persist();
      render();
      return;
    }
    if (action === "generate-ai") {
      generateAiPrompt();
      return;
    }
    if (action === "refresh-api") {
      pingApi();
    }
  }

  function updateState(key, value) {
    state[key] = value;
    ui.activePreset = null;
    enforceRules();
    clearAiResult();
    persist();
    render();
  }

  function updatePeople(key, value) {
    state.people[key] = value;
    ui.activePreset = null;
    enforceRules();
    clearAiResult();
    persist();
    render();
  }

  function updateMob(key, value) {
    state.mob[key] = value;
    ui.activePreset = null;
    persist();
    clearAiResult();
    render();
  }

  function updatePal(key, value) {
    state.pal[key] = value;
    ui.activePreset = null;
    persist();
    clearAiResult();
    render();
  }

  function toggleListValue(scope, key, value) {
    const list = state[scope][key];
    const index = list.indexOf(value);
    if (index >= 0) list.splice(index, 1);
    else list.push(value);
    ui.activePreset = null;
    persist();
    clearAiResult();
    render();
  }

  function applyPreset(index) {
    const preset = PRESETS[index];
    if (!preset) return;
    state = {
      ...clone(DEFAULT_STATE),
      ...clone(preset.s),
      seed: state.seed,
    };
    ui.activePreset = index;
    enforceRules();
    clearAiResult();
    persist();
    render();
  }

  function clearAiResult() {
    ui.aiPrompt = "";
    ui.aiError = "";
  }

  function enforceRules() {
    const pres = getPresentationMeta(state.tipo);
    const size = getSizeMeta(state.tam);
    const spaces = getAllowedSpaces(state.tipo, state.tam);
    const dists = getDistributionOptions(state.tipo);
    const compactMode = pres.mode === "wall" && size.compacto;
    const allowedMuebles = compactMode
      ? MUEBLES_OPS.filter(function (o) { return o.v === "auto" || o.compacto || o.v === "sin_mueble"; })
      : MUEBLES_OPS;

    if (!spaces.some(function (o) { return o.v === state.espacio; })) {
      state.espacio = spaces[0] ? spaces[0].v : state.espacio;
    }
    if (!dists.some(function (o) { return o.v === state.dist; })) {
      state.dist = dists[0] ? dists[0].v : state.dist;
    }
    if (!allowedMuebles.some(function (o) { return o.v === state.mob.mueble; })) {
      state.mob.mueble = "auto";
    }

    if (pres.mode === "hold") {
      state.people.cantidad = "1";
      state.people.tipo = "mujer_35";
      state.people.rol = "protagonista";
      state.people.accion = "sujetando_laminas";
      if (["sola", "sin_mirar_prod"].indexOf(state.people.interaccion) === -1) {
        state.people.interaccion = "sola";
      }
    } else {
      state.people.rol = "secundaria";
      if (state.people.cantidad === "none") {
        if (state.people.tipo === "pareja") state.people.tipo = "mujer_35";
        if (state.people.accion === "sujetando_laminas") state.people.accion = "vida_cotidiana";
        if (state.people.interaccion === "con_otra") state.people.interaccion = "sola";
      } else {
        if (state.people.cantidad !== "2" && state.people.tipo === "pareja") state.people.tipo = "mujer_35";
        if (state.people.accion === "sujetando_laminas") state.people.accion = "vida_cotidiana";
        if (state.people.cantidad === "1" && state.people.interaccion === "con_otra") state.people.interaccion = "sola";
        if (state.people.cantidad === "2" && state.people.interaccion === "sola") state.people.interaccion = "con_otra";
      }
    }
  }

  function render() {
    enforceRules();
    const presentation = getPresentationMeta(state.tipo);
    const tam = getSizeMeta(state.tam);
    const isHolding = presentation.mode === "hold";
    const isCompacto = !isHolding && tam.compacto;
    const allowedSpaces = getAllowedSpaces(state.tipo, state.tam);
    const smallSpaces = allowedSpaces.filter(function (o) { return o.group === "small"; });
    const largeSpaces = allowedSpaces.filter(function (o) { return o.group === "large"; });
    const distOptions = getDistributionOptions(state.tipo);
    const filteredRoleOptions = getFilteredRoleOptions(state.tipo, state.people.cantidad);
    const filteredActionOptions = getFilteredActionOptions(state.tipo, state.people.cantidad);
    const filteredInteractionOptions = getFilteredInteractionOptions(state.tipo, state.people.cantidad);
    const filteredTypeOptions = isHolding
      ? PERSON_TYPE_OPS.filter(function (o) { return o.v === "mujer_35"; })
      : state.people.cantidad !== "2"
        ? PERSON_TYPE_OPS.filter(function (o) { return o.v !== "pareja"; })
        : PERSON_TYPE_OPS;
    const filteredCountOptions = isHolding
      ? PERSON_COUNT_OPS.filter(function (o) { return o.v === "1"; })
      : PERSON_COUNT_OPS;
    const filteredMuebles = isCompacto
      ? MUEBLES_OPS.filter(function (o) { return o.v === "auto" || o.compacto || o.v === "sin_mueble"; })
      : MUEBLES_OPS;
    const variation = resolveVariation(state.mob, state.seed, isCompacto, state.espacio);
    const prompt = state.generationMode === "ia" && ui.aiPrompt ? ui.aiPrompt : buildPrompt(state, variation, state.seed);
    const basePrompt = buildPrompt(state, variation, state.seed);
    const shortPrompt = buildShort(state);
    const negativePrompt = buildNegative();
    const warnings = getWarnings(state);
    const peopleSummary = state.people.cantidad === "none"
      ? "Sin personas"
      : state.people.cantidad + " " + (state.people.cantidad === "1" ? "persona" : "personas") + " · " + findLabel(PERSON_TYPE_OPS, state.people.tipo);
    const palSummary = state.pal.active
      ? state.pal.paletas.filter(function (v) { return v !== "sin_color"; }).length > 0
        ? "Activado · " + state.pal.paletas.filter(function (v) { return v !== "sin_color"; }).map(function (v) { return findLabel(PAL_PALETAS, v); }).join(", ")
        : "Activado · sin paleta elegida"
      : "Desactivado";
    const variationLabel = isHolding
      ? variation.composicion.split(" ").slice(0, 4).join(" ")
      : variation.mueble.split(" ").slice(0, 4).join(" ");
    const activePromptTitle = state.generationMode === "ia" && ui.aiPrompt ? "Prompt IA" : "Prompt";

    root.innerHTML = [
      '<div class="app-shell">',
      renderTopbar(),
      '<div class="layout">',
      '<div class="left-panel">',
      renderRow("1", "Presentación del producto", SC.tipo, PRESENTACIONES.map(function (o) {
        return chip(o.l, state.tipo === o.v, SC.tipo, "set-root", { key: "tipo", value: o.v });
      }).join("")),
      renderRow(
        "2",
        "Tamaño visual",
        SC.tam,
        TAMANIOS.map(function (o) {
          return sizeChip(o, state.tam === o.v);
        }).join(""),
        describeCompactRule(state.tipo, state.tam)
      ),
      renderRow("3", "Estilo decorativo", SC.estilo, ESTILOS.map(function (o) {
        return chip(o.l, state.estilo === o.v, SC.estilo, "set-root", { key: "estilo", value: o.v });
      }).join("")),
      renderSpaceRow(smallSpaces, largeSpaces, presentation, tam),
      renderPeopleRow(filteredCountOptions, filteredTypeOptions, filteredRoleOptions, filteredActionOptions, filteredInteractionOptions, isHolding),
      renderLightRow(),
      renderAdvanced({
        isHolding: isHolding,
        presentation: presentation,
        distOptions: distOptions,
        filteredMuebles: filteredMuebles,
        isCompacto: isCompacto,
        palSummary: palSummary,
        negativePrompt: negativePrompt,
      }),
      '</div>',
      '<aside class="right-panel">',
      '<div class="right-header">',
      '<div class="right-title"><h2>' + escapeHtml(activePromptTitle) + '</h2><span class="lang-mark">' + escapeHtml(state.lang === "es" ? "Español" : "English") + '</span></div>',
      '<div class="status-row"><div class="mode-strip">' + MODE_OPS.map(function (o) {
        return chip(o.l, state.generationMode === o.v, SC.adv, "set-root", { key: "generationMode", value: o.v }, true);
      }).join("") + '</div></div>',
      renderApiStatus(),
      '<div class="badge-row">',
      pillBadge(SC.tipo, findLabel(PRESENTACIONES, state.tipo)),
      pillBadge(SC.tam, tam.l + " · " + tam.ratio),
      pillBadge(SC.estilo, findLabel(ESTILOS, state.estilo)),
      pillBadge(SC.espacio, findLabel(ESPACIOS, state.espacio)),
      pillBadge(SC.pers, peopleSummary),
      state.marco ? pillBadge(SC.cal, "Marco roble") : "",
      state.cristal ? pillBadge(SC.cal, "Cristal real") : "",
      state.pal.active && state.pal.paletas.filter(function (v) { return v !== "sin_color"; }).length
        ? '<span class="pill-badge" style="background:' + SC.pal.p + ";color:" + SC.pal.k + ";border-color:" + SC.pal.e + ';">Paleta</span>'
        : "",
      '</div></div>',
      warnings.length ? renderWarnings(warnings) : "",
      '<div class="variation-bar"><span class="variation-text">Var. #' + state.seed + " · " + escapeHtml(variationLabel) + '</span><button class="mini-btn" data-action="regenerate">↻ Regenerar variación</button></div>',
      '<div class="output-scroll">',
      '<div class="prompt-card' + (state.generationMode === "ia" && ui.aiPrompt ? " ai" : "") + '">' + escapeHtml(prompt) + '</div>',
      '<div class="char-count">' + prompt.length + " chars</div>",
      ui.aiError ? '<div class="note-box" style="border-color:#f0c7bc;background:#fff6f3;color:#8a4a38;margin-bottom:12px;">' + escapeHtml(ui.aiError) + "</div>" : "",
      state.generationMode === "ia"
        ? '<button class="action-btn secondary" data-action="generate-ai">' + (ui.loadingAi ? "Generando con IA..." : "Refinar prompt con IA") + "</button>"
        : "",
      disclosure("showShort", "Prompt corto", shortPrompt),
      disclosure("showNeg", "Negative prompt", negativePrompt),
      "</div>",
      '<div class="right-footer">',
      '<button class="copy-btn" data-action="copy" data-which="main">' + (ui.copied === "main" ? "✓ Copiado" : "Copiar prompt") + "</button>",
      '<div class="two-col">',
      '<button class="copy-btn ghost" data-action="copy" data-which="short">' + (ui.copied === "short" ? "✓ Copiado" : "Copiar corto") + "</button>",
      '<button class="copy-btn ghost" data-action="copy" data-which="neg">' + (ui.copied === "neg" ? "✓ Copiado" : "Copiar negative") + "</button>",
      "</div>",
      '<button class="reset-btn" data-action="reset">Restablecer todo</button>',
      "</div>",
      "</aside></div></div>",
    ].join("");

    function renderTopbar() {
      return [
        '<header class="topbar">',
        '<div class="brand"><div class="brand-icon">🖼</div><div><div class="brand-title">PromptStudio Local</div><div class="brand-subtitle">HTML, CSS, JavaScript + modo IA opcional</div></div></div>',
        '<div class="preset-strip">',
        PRESETS.map(function (preset, index) {
          return '<button class="preset-btn' + (ui.activePreset === index ? " active" : "") + '" data-action="apply-preset" data-index="' + index + '">' + escapeHtml(preset.l) + "</button>";
        }).join(""),
        "</div>",
        "</header>",
      ].join("");
    }

    function renderSpaceRow(small, large, pres, size) {
      let content = '<div style="width:100%;">';
      content += subBlock("Espacios pequeños", SC.espacio, small.map(function (o) {
        return chip(o.l, state.espacio === o.v, SC.espacio, "set-root", { key: "espacio", value: o.v }, true);
      }).join(""));
      if (large.length) {
        content += subBlock("Espacios grandes", SC.espacio, large.map(function (o) {
          return chip(o.l, state.espacio === o.v, SC.espacio, "set-root", { key: "espacio", value: o.v }, true);
        }).join(""));
      }
      if (pres.mode === "wall" && size.compacto) {
        content += '<p class="note-inline" style="color:' + SC.espacio.k + ';">Solo se muestran espacios compactos para mantener la escala correcta del producto pequeño en pared.</p>';
      }
      content += "</div>";
      return renderRow("4", "Tipo de espacio", SC.espacio, content);
    }

    function renderPeopleRow(countOps, typeOps, roleOps, actionOps, interactionOps, holding) {
      let content = '<div style="width:100%;">';
      content += subBlock("Cantidad", SC.pers, countOps.map(function (o) {
        return chip(o.l, state.people.cantidad === o.v, SC.pers, "set-people", { key: "cantidad", value: o.v }, true);
      }).join(""));
      if (state.people.cantidad !== "none") {
        content += subBlock("Tipo", SC.pers, typeOps.map(function (o) {
          return chip(o.l, state.people.tipo === o.v, SC.pers, "set-people", { key: "tipo", value: o.v }, true);
        }).join(""));
        content += subBlock("Rol", SC.pers, roleOps.map(function (o) {
          return chip(o.l, state.people.rol === o.v, SC.pers, "set-people", { key: "rol", value: o.v }, true);
        }).join(""));
        content += subBlock("Acción", SC.pers, actionOps.map(function (o) {
          return chip(o.l, state.people.accion === o.v, SC.pers, "set-people", { key: "accion", value: o.v }, true);
        }).join(""));
        content += subBlock("Interacción", SC.pers, interactionOps.map(function (o) {
          return chip(o.l, state.people.interaccion === o.v, SC.pers, "set-people", { key: "interaccion", value: o.v }, true);
        }).join(""));
      }
      content += "</div>";
      return renderRow(
        "5",
        "Personas y acción",
        SC.pers,
        content,
        holding
          ? "La presentación elegida ya incorpora una mujer sujetando las láminas; su rol pasa automáticamente a protagonista."
          : "Si el producto va en pared, las personas se mantienen siempre en segundo plano para no robar protagonismo."
      );
    }

    function renderLightRow() {
      return renderRow(
        "6",
        "Luz y calidad visual",
        SC.cal,
        LUCES.map(function (o) {
          return chip(o.l, state.luz === o.v, SC.cal, "set-root", { key: "luz", value: o.v });
        }).join("") +
          '<div class="toggle-row">' +
          toggleField("marco", "Marco extrafino de roble", SC.cal) +
          toggleField("cristal", "Cristal con reflejos reales", SC.cal) +
          "</div>"
      );
    }

    function renderAdvanced(context) {
      const advOpen = ui.showAdv;
      let body = "";
      if (advOpen) {
        body += '<div class="advanced-content">';
        if (!context.isHolding) {
          body += '<div class="advanced-block"><p class="advanced-title">Distribución de ' + escapeHtml(productCountLabel(context.presentation.count)) + '</p><div class="chip-group">';
          body += context.distOptions.map(function (o) {
            return chip(o.l, state.dist === o.v, SC.adv, "set-root", { key: "dist", value: o.v }, true);
          }).join("");
          body += "</div></div>";
        } else {
          body += '<div class="info-box advanced-block"><p class="small-text">La distribución avanzada se adapta automáticamente a cómo la mujer sujeta las láminas y no necesita selección manual en esta presentación.</p></div>';
        }
        body += '<div class="advanced-block"><p class="advanced-title">Nivel de decoración general</p><div class="chip-group">';
        body += DECO_OPS.map(function (o) {
          return chip(o.l, state.deco === o.v, SC.adv, "set-root", { key: "deco", value: o.v }, true);
        }).join("");
        body += "</div></div>";
        body += renderMobAccordion(context.filteredMuebles, context.isCompacto);
        body += renderPalAccordion(context.palSummary);
        body += '<div class="advanced-block"><p class="advanced-title">Idioma</p><div class="chip-group">';
        body += LANG_OPS.map(function (o) {
          return chip(o.l, state.lang === o.v, SC.adv, "set-root", { key: "lang", value: o.v }, true);
        }).join("");
        body += "</div></div>";
        body += '<div class="advanced-block"><p class="advanced-title">Negative prompt</p><div class="negative-box small-text">' + escapeHtml(context.negativePrompt) + "</div></div>";
        body += "</div>";
      }
      return [
        '<div class="section">',
        '<button class="collapse-btn" data-action="toggle-panel" data-key="showAdv"><span class="collapse-arrow' + (advOpen ? " rotated" : "") + '">▶</span>Panel avanzado — distribución, decoración, mobiliario, paleta, idioma y negative prompt</button>',
        body,
        "</div>",
      ].join("");
    }

    function renderMobAccordion(filteredMueblesList, compact) {
      const open = ui.showMob;
      let body = "";
      if (open) {
        body += subBlock("A. Modo de control", SC.mob, MOB_MODE.map(function (o) {
          return chip(o.l, state.mob.mode === o.v, SC.mob, "set-mob", { key: "mode", value: o.v }, true);
        }).join(""));
        body += '<p class="help-text">' +
          escapeHtml(
            state.mob.mode === "auto"
              ? "La app elige y varía automáticamente en cada regeneración."
              : state.mob.mode === "guided"
                ? "Elige el mueble y el apoyo; el resto varía automáticamente."
                : "Controlas cada elemento. Lo que dejes en Automático seguirá variando."
          ) +
          "</p>";

        if (state.mob.mode === "guided" || state.mob.mode === "manual") {
          body += subBlock("B. Mueble principal", SC.mob, filteredMueblesList.map(function (o) {
            return chip(o.l, state.mob.mueble === o.v, SC.mob, "set-mob", { key: "mueble", value: o.v }, true);
          }).join("") + (compact ? '<p class="note-inline" style="color:' + SC.mob.k + ';">Solo muebles compactos disponibles con producto pequeño en pared.</p>' : ""));
          body += subBlock("C. Apoyo secundario", SC.mob, APOYOS_OPS.map(function (o) {
            return chip(o.l, state.mob.apoyo === o.v, SC.mob, "set-mob", { key: "apoyo", value: o.v }, true);
          }).join(""));
        }
        if (state.mob.mode === "manual") {
          body += subBlock("D. Iluminación decorativa", SC.mob, LAMPARA_OPS.map(function (o) {
            return chip(o.l, state.mob.lampara === o.v, SC.mob, "set-mob", { key: "lampara", value: o.v }, true);
          }).join(""));
          body += subBlock("E. Vegetación", SC.mob, VEGETA_OPS.map(function (o) {
            return chip(o.l, state.mob.vegeta === o.v, SC.mob, "set-mob", { key: "vegeta", value: o.v }, true);
          }).join(""));
          body += subBlock("F. Objetos decorativos (selección múltiple)", SC.mob, OBJETOS_OPS.map(function (o) {
            return multiChip(o.l, state.mob.objetos.indexOf(o.v) >= 0, SC.mob, "toggle-obj", { value: o.v });
          }).join("") + (state.mob.objetos.length ? "" : '<p class="note-inline">Sin selección → se usarán objetos automáticos variados.</p>'));
          body += subBlock("G. Textiles", SC.mob, TEXTIL_OPS.map(function (o) {
            return chip(o.l, state.mob.textil === o.v, SC.mob, "set-mob", { key: "textil", value: o.v }, true);
          }).join(""));
        }
        body += subBlock("H. Intensidad decorativa", SC.mob, INTENS_OPS.map(function (o) {
          return chip(o.l, state.mob.intens === o.v, SC.mob, "set-mob", { key: "intens", value: o.v }, true);
        }).join(""));
      }

      return [
        '<div class="accordion">',
        '<button class="accordion-head" style="background:' + SC.mob.p + ';" data-action="toggle-panel" data-key="showMob">',
        '<div class="accordion-icon" style="background:' + SC.mob.k + ';">🪑</div>',
        '<div style="flex:1;"><div class="accordion-title">Mobiliario y decoración</div><div class="accordion-subtitle">Modo: ' + escapeHtml(state.mob.mode === "auto" ? "Automático" : state.mob.mode === "guided" ? "Guiado" : "Manual") + (state.mob.mueble !== "auto" ? " · " + escapeHtml(findLabel(MUEBLES_OPS, state.mob.mueble)) : "") + "</div></div>",
        '<span class="accordion-arrow' + (open ? " rotated" : "") + '" style="color:' + SC.mob.k + ';">▶</span>',
        "</button>",
        open ? '<div class="accordion-body">' + body + "</div>" : "",
        "</div>",
      ].join("");
    }

    function renderPalAccordion(summary) {
      const open = ui.showPal;
      let body = "";
      if (open) {
        body += subBlock("A. Activar integración cromática", SC.pal, [false, true].map(function (value) {
          return chip(value ? "Activado" : "Desactivado", state.pal.active === value, SC.pal, "set-pal", { key: "active", value: String(value) }, true);
        }).join(""));
        if (state.pal.active) {
          body += '<p class="help-text">Introduce pequeños acentos cromáticos en accesorios decorativos para que el futuro diseño de las láminas encaje visualmente con la escena. Las láminas siguen completamente blancas y vacías. La pared sigue blanca. El balance de blancos no se altera.</p>';
          body += subBlock("B. Familia cromática del futuro diseño", SC.pal, PAL_PALETAS.map(function (o) {
            return dotChip(o.l, state.pal.paletas.indexOf(o.v) >= 0, o.dot, SC.pal, "toggle-paleta", { value: o.v });
          }).join("") + (state.pal.paletas.length ? "" : '<p class="note-inline">Selecciona una o más familias cromáticas.</p>'));
          body += subBlock("C. Intensidad de integración", SC.pal, PAL_INTENS.map(function (o) {
            return chip(o.l, state.pal.intens === o.v, SC.pal, "set-pal", { key: "intens", value: o.v }, true);
          }).join('') + '<p class="note-inline">Por defecto: Sutil. Nunca convierte la escena en monotemática.</p>');
          body += subBlock("D. Dónde aplicar los colores guía", SC.pal, PAL_DONDE.map(function (o) {
            return multiChip(o.l, state.pal.donde.indexOf(o.v) >= 0, SC.pal, "toggle-donde", { value: o.v });
          }).join('') + (state.pal.donde.length ? "" : '<p class="note-inline">Sin selección → la app elige automáticamente y varía entre generaciones.</p>'));
          body += subBlock("E. Modo de integración", SC.pal, PAL_MODE.map(function (o) {
            return chip(o.l, state.pal.mode === o.v, SC.pal, "set-pal", { key: "mode", value: o.v }, true);
          }).join('') + '<p class="note-inline">' + escapeHtml(
            state.pal.mode === "auto"
              ? "La app decide en qué accesorios introducir los toques de color y varía entre generaciones."
              : state.pal.mode === "guided"
                ? "Respeta tu selección de accesorios en Dónde aplicar; el resto varía automáticamente."
                : "Respeta exactamente tus selecciones de familia, dónde aplicar e intensidad."
          ) + "</p>");
          const selected = state.pal.paletas.filter(function (v) { return v !== "sin_color"; });
          if (selected.length) {
            body += '<div class="preview-box"><p class="small-text" style="color:' + SC.pal.k + ';font-weight:600;margin-bottom:6px;">Vista previa de la paleta seleccionada</p><div class="color-preview">';
            body += selected.map(function (v) {
              const opt = PAL_PALETAS.find(function (item) { return item.v === v; });
              return opt ? '<div class="color-token"><span style="background:' + opt.dot + ';"></span>' + escapeHtml(opt.l) + "</div>" : "";
            }).join("");
            body += "</div></div>";
          }
        }
      }

      return [
        '<div class="accordion">',
        '<button class="accordion-head" style="background:' + SC.pal.p + ';" data-action="toggle-panel" data-key="showPal">',
        '<div class="accordion-icon" style="background:' + SC.pal.k + ';">🎨</div>',
        '<div style="flex:1;"><div class="accordion-title">Paleta cromática de integración</div><div class="accordion-subtitle">' + escapeHtml(summary) + "</div></div>",
        '<span class="accordion-arrow' + (open ? " rotated" : "") + '" style="color:' + SC.pal.k + ';">▶</span>',
        "</button>",
        open ? '<div class="accordion-body">' + body + "</div>" : "",
        "</div>",
      ].join("");
    }

    function renderApiStatus() {
      const cls = ui.apiStatus.ok && ui.apiStatus.configured ? "api-status online" : "api-status offline";
      const hint = state.generationMode === "ia"
        ? ' Si no conecta, arranca `npm install` y luego `npm start`.'
        : " El modo local sigue funcionando aunque el backend esté apagado.";
      return [
        '<div class="' + cls + '">',
        '<div><strong>Backend IA:</strong> ' + escapeHtml(ui.apiStatus.message) + "</div>",
        '<div class="small-text">Endpoint: ' + escapeHtml(API_BASE || "mismo origen") + " · Modelo: " + escapeHtml(ui.apiStatus.model || "—") + hint + "</div>",
        '<div style="margin-top:8px;"><button class="mini-btn" data-action="refresh-api">Comprobar conexión</button></div>',
        "</div>",
      ].join("");
    }

    function renderWarnings(list) {
      return '<div class="warning-panel">' + list.map(function (w) {
        return '<div class="warning-item"><span>⚠</span><span>' + escapeHtml(w) + "</span></div>";
      }).join("") + "</div>";
    }

    function disclosure(key, label, value) {
      const open = ui[key];
      return '<button class="disclosure" data-action="toggle-panel" data-key="' + key + '"><span class="disclosure-arrow' + (open ? " rotated" : "") + '">▶</span>' + escapeHtml(label) + '</button>' + (open ? '<div class="hidden-card">' + escapeHtml(value) + "</div>" : "");
    }
  }

  async function generateAiPrompt() {
    clearAiResult();
    ui.loadingAi = true;
    render();
    try {
      const variation = resolveVariation(state.mob, state.seed, !isHoldingPresentation(state.tipo) && getSizeMeta(state.tam).compacto, state.espacio);
      const basePrompt = buildPrompt(state, variation, state.seed);
      const response = await fetch(API_BASE + "/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: state.lang,
          basePrompt: basePrompt,
          shortPrompt: buildShort(state),
          negativePrompt: buildNegative(),
          configSummary: buildConfigSummary(state),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.prompt) {
        throw new Error(data.error || "No se pudo generar el prompt con IA.");
      }
      ui.aiPrompt = data.prompt;
      ui.aiError = "";
      ui.apiStatus = {
        checked: true,
        ok: true,
        configured: true,
        model: data.model || ui.apiStatus.model,
        message: "Conectado y listo",
      };
    } catch (error) {
      ui.aiPrompt = "";
      ui.aiError = error instanceof Error ? error.message : "Error generando el prompt con IA.";
    } finally {
      ui.loadingAi = false;
      render();
    }
  }

  async function pingApi() {
    try {
      const response = await fetch(API_BASE + "/health");
      const data = await response.json();
      ui.apiStatus = {
        checked: true,
        ok: Boolean(data.ok),
        configured: Boolean(data.configured),
        model: data.model || "",
        message: data.configured ? "Conectado y listo" : "Servidor activo, pero falta OPENAI_API_KEY",
      };
    } catch (error) {
      ui.apiStatus = {
        checked: true,
        ok: false,
        configured: false,
        model: "",
        message: "Servidor IA no detectado",
      };
    }
    render();
  }

  function copyText(which) {
    const variation = resolveVariation(state.mob, state.seed, !isHoldingPresentation(state.tipo) && getSizeMeta(state.tam).compacto, state.espacio);
    const mainPrompt = state.generationMode === "ia" && ui.aiPrompt ? ui.aiPrompt : buildPrompt(state, variation, state.seed);
    const map = {
      main: mainPrompt,
      short: buildShort(state),
      neg: buildNegative(),
    };
    writeClipboard(map[which] || "").then(function () {
      ui.copied = which;
      render();
      setTimeout(function () {
        ui.copied = null;
        render();
      }, 1800);
    });
  }

  function buildPrompt(s, variation, seed) {
    const tam = getSizeMeta(s.tam);
    const pres = getPresentationMeta(s.tipo);
    const count = pres.count;
    const isHolding = pres.mode === "hold";
    const esp = getSpaceMeta(s.espacio);
    const marcoTxt = s.marco ? "con marco extrafino de roble natural claro minimalista" : "sin marco";
    let prompt = "";

    prompt += isHolding ? "Fotografía lifestyle realista de interiorismo auténtico" : "Fotografía editorial realista de interiorismo";
    prompt += isHolding ? " en " + (ESPACIO_TXT[s.espacio] || "un interior luminoso y bonito") : " en " + (ESPACIO_TXT[s.espacio] || "un rincón proporcionado");
    prompt += ", ";
    prompt += "de estilo decorativo " + s.estilo + ": " + (ESTILO_BASE[s.estilo] || "") + "; ";
    prompt += (LUZ_TXT[s.luz] || LUZ_TXT.neutra);
    prompt += "; balance de blancos correcto, blancos verdaderamente blancos, sin dominante cálida, sin tonos amarillos, sin efecto dorado; ";

    if (!isHolding) {
      prompt += getPlacementText(s.espacio, variation) + " " + (count === 1 ? "aparece" : "aparecen") + " " + productDecorativeLabel(count) + " de tamaño visual " + tam.l.toLowerCase() + ", ";
      prompt += (count === 1 ? "con proporción vertical " : "todas iguales entre sí, con proporción vertical ") + tam.ratio + ", " + marcoTxt + ", ";
      if (s.cristal && s.marco) {
        prompt += "con cristal real y reflejos suaves de ventana y de cortina, brillo sutil fotográfico, nunca espejo ni brillo exagerado, ";
      }
      prompt += (count === 1
        ? "completamente blanca, vacía, sin diseño, sin texto y sin ilustración, "
        : "completamente blancas, vacías, sin diseño, sin texto y sin ilustración, ");
      prompt += (DIST_TXT[s.dist] || DIST_TXT.horizontal) + ", ";
      prompt += "vistas totalmente de frente a cámara, rectas, paralelas al plano de la imagen, nunca en diagonal, nunca inclinadas; ";
      prompt += "el producto es el protagonista principal y ocupa un peso visual claro dentro del encuadre; ";
      if (isThirtyByFortyTriptych(s.tipo, s.tam)) {
        prompt += "al tratarse de un set de 3 cuadros de 30x40, la escena debe sentirse contenida, doméstica y proporcionada, anclada a un rincón o mueble pequeño, nunca a una pared enorme ni a una estancia excesivamente abierta; ";
      }
      if (tam.compacto) {
        prompt += "la escena se desarrolla en un espacio compacto y recogido, evita paredes grandes vacías, escenas demasiado abiertas y mobiliario sobredimensionado; ";
      } else if (esp.group === "large") {
        prompt += "el espacio amplio sigue estando proporcionado para que el producto no se pierda ni quede lejano; en espacios grandes la composición debe anclarse claramente al mobiliario principal, como sofá, cabecero, aparador largo o mueble de apoyo; ";
      }
      prompt += variation.composicion + "; ";
      const decorBits = [variation.objetos.filter(Boolean).join(", "), variation.vegetal, variation.lampara].filter(Boolean).join(", ");
      if (variation.mueble && variation.mueble !== "sin mueble principal") {
        if (decorBits) {
          prompt += usesLooseDecorAroundMainPiece(s.espacio)
            ? variation.mueble + ", con " + decorBits + " repartidos de forma natural en apoyos cercanos y laterales"
            : variation.mueble + " decorado con " + decorBits;
        } else {
          prompt += variation.mueble + " con apoyo decorativo mínimo y proporcionado";
        }
      } else {
        prompt += decorBits ? "junto a la composición aparecen " + decorBits : "la composición se mantiene limpia, proporcionada y sin exceso de elementos";
      }
      if (variation.textil) prompt += "; " + variation.textil;
      if (variation.apoyo) prompt += "; " + variation.apoyo + " integrado en la escena";
      prompt += "; " + (DECO_TXT[s.deco] || DECO_TXT.equilibrada) + "; " + (INTENS_TXT[s.mob.intens] || INTENS_TXT.equilibrada) + ", sin quitar protagonismo al producto; ";
      prompt += buildPeopleText(s, seed);
      const palText = buildPaletaText(s.pal, seed, count);
      if (palText) prompt += palText;
    } else {
      prompt += buildPeopleText(s, seed);
      prompt += "sujeta " + productDecorativeLabel(count) + " — " + (count === 1 ? "la lámina" : "todas iguales") + " con proporción vertical " + tam.ratio + ", " + marcoTxt + ", " + (count === 1 ? "completamente blanca, vacía, sin diseño, sin texto ni ilustración" : "completamente blancas, vacías, sin diseño, sin texto ni ilustración") + " —; ";
      prompt += "las láminas se ven con claridad, bien definidas y con lenguaje visual lifestyle real, nunca como atrezzo secundario; ";
      prompt += variation.composicion + "; ";
      prompt += (DECO_TXT[s.deco] || DECO_TXT.equilibrada) + "; ";
      const palText = buildPaletaText(s.pal, seed, count);
      if (palText) prompt += palText;
    }

    prompt += "fotografía auténtica de revista de decoración, materiales reales, texturas reales, no CGI, no render, no showroom artificial; el producto mantiene siempre el protagonismo principal.";
    return prompt;
  }

  function buildShort(s) {
    const tam = getSizeMeta(s.tam);
    const pres = getPresentationMeta(s.tipo);
    if (pres.mode === "hold") {
      return "Fotografía lifestyle realista. Mujer natural sujetando " + (pres.count === 1 ? "1 lámina blanca vacía" : productCountLabel(pres.count) + " blancas vacías") + " " + tam.ratio + ", " + s.estilo + ", luz " + s.luz + ", materiales reales, no render.";
    }
    return "Fotografía editorial interiorismo. " + (pres.count === 1 ? "1 lámina " + tam.l.toLowerCase() + " " + tam.ratio + " blanca vacía" : productCountLabel(pres.count) + " " + tam.l.toLowerCase() + " " + tam.ratio + " blancas vacías") + ", " + s.estilo + ", " + (ESPACIO_TXT[s.espacio] || "rincón compacto") + ", " + getPlacementShortText(s.espacio) + ", de frente a cámara, balance de blancos neutro, no render.";
  }

  function buildNegative() {
    return "text on prints, design on paper, illustration on canvas, printed artwork, CGI, 3D render, artificial showroom, diagonal frames, tilted prints, lateral perspective, yellow light, golden tones, warm cast, overexposed, heavy shadows, blurry product, unequal frame sizes, mirror reflections, glossy plastic sheen, render interior, oversized empty wall, open empty loft, dominant people, product out of focus";
  }

  function buildPeopleText(s, seed) {
    const pres = getPresentationMeta(s.tipo);
    const holding = pres.mode === "hold";
    if (!holding && s.people.cantidad === "none") return "sin personas en la escena; ";
    const subject = buildPersonSubject(s.people, holding);
    const action = pick(ACTION_VARIATIONS[s.people.accion] || ["haciendo vida cotidiana"], seed + 9);
    const interaction = INTERACCION_TXT[s.people.interaccion];
    if (holding) {
      let text = "aparece " + subject + ", " + action + ", de pie en el interior, ";
      if (interaction) text += interaction + ", ";
      text += "como presencia protagonista humana, pero cediendo el protagonismo principal al producto; ";
      return text;
    }
    let text = "aparece " + subject + ", " + action;
    if (interaction) text += ", " + interaction;
    text += ", integrada con naturalidad, siempre secundaria y sin competir con el producto; ";
    if (s.people.cantidad === "2") {
      text += "la acción entre personas debe sentirse cotidiana y suave, nunca teatral; ";
    }
    return text;
  }

  function buildPaletaText(pal, seed, count) {
    if (!pal.active || !pal.paletas.length || pal.paletas.every(function (v) { return v === "sin_color"; })) return "";
    const labels = pal.paletas.filter(function (v) { return v !== "sin_color"; }).map(function (v) { return PAL_LABEL[v]; }).filter(Boolean);
    if (!labels.length) return "";
    const colorStr = labels.join(" y ");
    const where = pal.mode === "auto" ? pick(PAL_AUTO_DONDE, seed + 6) : pal.donde.length ? pal.donde : pick(PAL_AUTO_DONDE, seed + 6);
    const whereText = where.map(function (v) { return DONDE_LABEL[v]; }).filter(Boolean);
    const intensMap = {
      muy_sutil: "de forma muy sutil y casi imperceptible",
      sutil: "de forma sutil y elegante",
      media: "de forma moderada y armónica",
    };
    let text = "Integra " + (intensMap[pal.intens] || intensMap.sutil) + " pequeños acentos cromáticos en la gama de " + colorStr + " en algunos accesorios decorativos";
    if (whereText.length) text += " — especialmente en " + whereText.join(", ") + " —";
    text += "; la pared sigue completamente blanca, " + (count === 1 ? "la lámina sigue completamente blanca y vacía" : "las " + productCountLabel(count) + " siguen completamente blancas y vacías") + ", balance de blancos neutro y correcto, los colores guía nunca invaden ni dominan la composición; ";
    return text;
  }

  function buildConfigSummary(s) {
    const pres = getPresentationMeta(s.tipo);
    return {
      presentacion: findLabel(PRESENTACIONES, s.tipo),
      cantidad_laminas: pres.count,
      tamano_visual: findLabel(TAMANIOS, s.tam),
      estilo: findLabel(ESTILOS, s.estilo),
      espacio: findLabel(ESPACIOS, s.espacio),
      personas: {
        cantidad: findLabel(PERSON_COUNT_OPS, s.people.cantidad),
        tipo: findLabel(PERSON_TYPE_OPS, s.people.tipo),
        rol: findLabel(PERSON_ROLE_OPS, s.people.rol),
        accion: findLabel(ACCIONES, s.people.accion),
        interaccion: findLabel(INTERACCIONES, s.people.interaccion),
      },
      luz: findLabel(LUCES, s.luz),
      idioma: findLabel(LANG_OPS, s.lang),
      modo_generacion: s.generationMode,
      distribucion: findLabel(getDistributionOptions(s.tipo), s.dist),
      decoracion: findLabel(DECO_OPS, s.deco),
      reglas_fijas: [
        "producto de frente a camara",
        "marcos rectos, paralelos y sin perspectiva lateral",
        "marco extrafino de roble natural claro cuando aplica",
        "laminas blancas y vacias cuando se pide escena base",
        "balance de blancos neutro y correcto",
        "fotografia realista, no render",
        "producto protagonista principal",
      ],
    };
  }

  function getWarnings(s) {
    const warnings = [];
    const tam = getSizeMeta(s.tam);
    const esp = getSpaceMeta(s.espacio);
    const pres = getPresentationMeta(s.tipo);
    if (isThirtyByFortyTriptych(s.tipo, s.tam) && esp.group === "large") {
      warnings.push("Un set de 3 cuadros 30x40 no debería vivir en una pared grande o estancia abierta. Mejor rincón, aparador, consola, cómoda o mueble auxiliar.");
    }
    if (pres.mode === "wall" && tam.compacto && esp.group === "large") {
      warnings.push("Producto pequeño en pared dentro de espacio grande → perderá escala. Mejor mantener espacios compactos y paredes cortas.");
    }
    if (pres.mode === "wall" && !tam.compacto && ["pared_grande", "zona_abierta", "estancia_principal"].indexOf(s.espacio) >= 0) {
      warnings.push("En espacios grandes conviene anclar visualmente el producto sobre sofá, cabecero, aparador largo o mueble principal para evitar que la pared se sienta vacía.");
    }
    if ((s.estilo === "ibicenco" || s.estilo === "mediterraneo") && s.mob.intens === "muy_limpia") {
      warnings.push("Estilo ibicenco o mediterráneo con decoración muy limpia puede quedar austero. Considera decoración equilibrada.");
    }
    const muebleOpt = MUEBLES_OPS.find(function (o) { return o.v === s.mob.mueble; });
    if (tam.compacto && muebleOpt && !muebleOpt.compacto && muebleOpt.v !== "auto" && muebleOpt.v !== "sin_mueble") {
      warnings.push("Producto pequeño: conviene un mueble principal más compacto.");
    }
    if (s.pal.active && s.pal.intens === "media" && (s.estilo === "minimalista" || s.estilo === "moderno")) {
      warnings.push("Moderno o minimalista con integración cromática media puede sobrecargar la escena. Prueba intensidad sutil.");
    }
    if (s.deco === "muy_rica" && s.estilo === "minimalista") {
      warnings.push("Minimalista con decoración muy rica puede romper la claridad visual. Considera decoración equilibrada.");
    }
    return warnings;
  }

  function resolveVariation(mob, seed, isCompacto, spaceValue) {
    const contextualPool = AUTO_MUEBLES_BY_SPACE[spaceValue];
    const pool = isCompacto ? COMPACTO_MUEBLES : (contextualPool || AUTO_MUEBLES);
    const mueble = mob.mueble === "auto" ? pick(pool, seed) : (findByValue(MUEBLES_OPS, mob.mueble) || {}).txt || pick(pool, seed);
    const apoyo = mob.apoyo === "auto" ? pick(AUTO_APOYOS, seed + 1) : (findByValue(APOYOS_OPS, mob.apoyo) || {}).txt || "";
    const lampara = mob.lampara === "auto" ? pick(AUTO_LAMPARAS, seed + 2) : (findByValue(LAMPARA_OPS, mob.lampara) || {}).txt || "";
    const vegetal = mob.vegeta === "auto" ? pick(AUTO_VEGETA, seed + 3) : (findByValue(VEGETA_OPS, mob.vegeta) || {}).txt || "";
    const textil = mob.textil === "auto" ? pick(AUTO_TEXTILES, seed + 5) : (findByValue(TEXTIL_OPS, mob.textil) || {}).txt || "";
    const objetos = mob.objetos.length ? mob.objetos.map(function (v) { return OBJETOS_TXT[v]; }).filter(Boolean) : pick(AUTO_OBJETOS, seed + 4);
    const composicion = pick(AUTO_COMPOSICIONES, seed + 7);
    return { mueble: mueble, apoyo: apoyo, lampara: lampara, vegetal: vegetal, textil: textil, objetos: objetos, composicion: composicion };
  }

  function getPresentationMeta(value) {
    return findByValue(PRESENTACIONES, value) || PRESENTACIONES[2];
  }

  function getSizeMeta(value) {
    return findByValue(TAMANIOS, value) || TAMANIOS[1];
  }

  function getSpaceMeta(value) {
    return findByValue(ESPACIOS, value) || ESPACIOS[0];
  }

  function isThirtyByFortyTriptych(tipo, tam) {
    const pres = getPresentationMeta(tipo);
    const size = getSizeMeta(tam);
    return pres.mode === "wall" && pres.count === 3 && size.v === "peq" && size.ratio === "3:4";
  }

  function getPlacementText(spaceValue, variation) {
    const explicit = SPACE_PLACEMENT_TXT[spaceValue];
    if (explicit) return explicit;
    if (variation.mueble && variation.mueble !== "sin mueble principal") {
      return "en la pared justo encima del mueble principal";
    }
    return "en la pared";
  }

  function getPlacementShortText(spaceValue) {
    const explicit = SPACE_PLACEMENT_TXT[spaceValue];
    return explicit || "bien anclada al mobiliario";
  }

  function usesLooseDecorAroundMainPiece(spaceValue) {
    return ["salon_grande", "salon_sobre_sofa", "dormitorio_amplio", "dormitorio_cabecero"].indexOf(spaceValue) >= 0;
  }

  function getAllowedSpaces(tipo, tam) {
    const pres = getPresentationMeta(tipo);
    const size = getSizeMeta(tam);
    if (pres.mode === "hold") return ESPACIOS;
    if (isThirtyByFortyTriptych(tipo, tam)) {
      return ESPACIOS.filter(function (o) { return o.group === "small"; });
    }
    if (size.compacto) return ESPACIOS.filter(function (o) { return o.group === "small"; });
    return ESPACIOS;
  }

  function getDistributionOptions(tipo) {
    return DIST_OPS_BY_COUNT[getPresentationMeta(tipo).count] || DIST_OPS_BY_COUNT[3];
  }

  function getFilteredRoleOptions(tipo) {
    if (isHoldingPresentation(tipo)) return PERSON_ROLE_OPS.filter(function (o) { return o.v === "protagonista"; });
    return PERSON_ROLE_OPS.filter(function (o) { return o.v === "secundaria"; });
  }

  function getFilteredActionOptions(tipo, cantidad) {
    if (cantidad === "none") return [];
    if (isHoldingPresentation(tipo)) return ACCIONES.filter(function (o) { return o.v === "sujetando_laminas"; });
    return ACCIONES.filter(function (o) { return o.v !== "sujetando_laminas"; });
  }

  function getFilteredInteractionOptions(tipo, cantidad) {
    if (cantidad === "none") return [];
    if (isHoldingPresentation(tipo)) return INTERACCIONES.filter(function (o) { return o.v === "sola" || o.v === "sin_mirar_prod"; });
    if (cantidad === "1") return INTERACCIONES.filter(function (o) { return o.v !== "con_otra"; });
    return INTERACCIONES.filter(function (o) { return o.v !== "sola"; });
  }

  function isHoldingPresentation(tipo) {
    return getPresentationMeta(tipo).mode === "hold";
  }

  function describeCompactRule(tipo, tam) {
    const pres = getPresentationMeta(tipo);
    const size = getSizeMeta(tam);
    if (pres.mode === "hold") return "La mujer sujetando las láminas no obliga a compactar el espacio y puede convivir con escenas más amplias.";
    if (isThirtyByFortyTriptych(tipo, tam)) return "El set de 3 cuadros 30x40 se tratará como una composición contenida: rincones, aparadores, consolas, cómodas y pequeños muebles, nunca paredes grandes ni estancias abiertas.";
    if (size.compacto) return "Con producto pequeño en pared el sistema limitará la escena a espacios compactos, paredes cortas y mobiliario proporcionado.";
    if (size.v === "gra") return "El tamaño grande habilita también espacios amplios siempre que el producto siga dominando la escena.";
    return "El sistema mantendrá el producto proporcionado al espacio y evitará paredes vacías demasiado abiertas.";
  }

  function buildPersonSubject(people, holding) {
    if (holding) return "una mujer de unos 35 años, natural, bien vestida con tonos neutros y gesto sereno";
    if (people.cantidad === "2") {
      if (people.tipo === "pareja") return "una pareja natural";
      if (people.tipo === "hombre") return "dos hombres de presencia natural y estilo sobrio";
      if (people.tipo === "neutra") return "dos personas de presencia neutra y natural";
      return "dos mujeres de unos 35 años, naturales y bien integradas";
    }
    if (people.tipo === "hombre") return "un hombre de presencia natural y ropa sobria";
    if (people.tipo === "pareja") return "una persona de aspecto cálido y natural";
    if (people.tipo === "neutra") return "una persona neutra de presencia natural";
    return "una mujer de unos 35 años, natural, con ropa en tonos neutros";
  }

  function productCountLabel(count) {
    return count + " " + (count === 1 ? "lámina" : "láminas");
  }

  function productDecorativeLabel(count) {
    return count === 1 ? "1 lámina decorativa" : count + " láminas decorativas";
  }

  function chip(label, active, sc, action, dataset, small) {
    return '<button class="chip' + (small ? " sm" : "") + (active ? " active" : "") + '" style="background:' + (active ? sc.k : sc.p) + ";color:" + (active ? "#fff" : sc.k) + ";border-color:" + (active ? sc.k : sc.e) + ';" data-action="' + action + '"' + datasetAttrs(dataset) + ">" + escapeHtml(label) + "</button>";
  }

  function dotChip(label, active, dot, sc, action, dataset) {
    return '<button class="dot-chip' + (active ? " active" : "") + '" style="background:' + (active ? sc.k : sc.p) + ";color:" + (active ? "#fff" : sc.k) + ";border-color:" + (active ? sc.k : sc.e) + ';" data-action="' + action + '"' + datasetAttrs(dataset) + '><span class="dot-chip-swatch" style="background:' + dot + ";border-color:" + (active ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.1)") + ';"></span>' + escapeHtml(label) + "</button>";
  }

  function multiChip(label, active, sc, action, dataset) {
    return '<button class="multi-chip' + (active ? " active" : "") + '" style="background:' + (active ? sc.k : sc.p) + ";color:" + (active ? "#fff" : sc.k) + ";border-color:" + (active ? sc.k : sc.e) + ';" data-action="' + action + '"' + datasetAttrs(dataset) + ">" + escapeHtml(label) + "</button>";
  }

  function pillBadge(sc, label) {
    return '<span class="pill-badge" style="background:' + sc.p + ";color:" + sc.k + ";border-color:" + sc.e + ';">' + escapeHtml(label) + "</span>";
  }

  function renderRow(number, title, sc, content, note) {
    return [
      '<section class="section">',
      '<div class="section-head"><div class="section-num" style="background:' + sc.p + ";border-color:" + sc.e + ";color:" + sc.k + ';">' + number + '</div><div class="section-title">' + escapeHtml(title) + '</div><div class="section-line" style="background:' + sc.e + ';"></div></div>',
      note ? '<p class="section-note" style="color:' + sc.k + ';">↳ ' + escapeHtml(note) + "</p>" : "",
      '<div class="chip-group">' + content + "</div>",
      "</section>",
    ].join("");
  }

  function subBlock(label, sc, content) {
    return '<div class="subblock"><p class="subblock-title"><span class="subblock-dot" style="background:' + sc.k + ';"></span>' + escapeHtml(label) + '</p><div class="subchips">' + content + "</div></div>";
  }

  function toggleField(key, label, sc) {
    return '<label class="toggle-field"><button class="switch' + (state[key] ? " on" : "") + '" style="background:' + (state[key] ? sc.k : "#D4CEC4") + ';" data-action="toggle-boolean" data-key="' + key + '"><span class="switch-thumb"></span></button><span style="font-size:12.5px;color:' + (state[key] ? sc.k : D.muted) + ";font-weight:" + (state[key] ? 600 : 400) + ';">' + escapeHtml(label) + "</span></label>";
  }

  function sizeChip(option, active) {
    return '<button class="chip" style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;border-radius:12px;padding:9px 16px;background:' + (active ? SC.tam.k : SC.tam.p) + ";color:" + (active ? "#fff" : SC.tam.k) + ";border-color:" + (active ? SC.tam.k : SC.tam.e) + ';" data-action="set-root" data-key="tam" data-value="' + option.v + '"><span style="font-size:13px;font-weight:600;">' + escapeHtml(option.l) + '</span><span style="font-size:10.5px;opacity:.75;">proporción ' + escapeHtml(option.ratio) + "</span></button>";
  }

  function datasetAttrs(dataset) {
    return Object.keys(dataset || {}).map(function (key) {
      return ' data-' + key + '="' + escapeHtml(String(dataset[key])) + '"';
    }).join("");
  }

  function pick(arr, seed) {
    return arr[((seed % arr.length) + arr.length) % arr.length];
  }

  function castValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }

  function findByValue(list, value) {
    return list.find(function (item) { return item.v === value; });
  }

  function findLabel(list, value) {
    const found = findByValue(list, value);
    return found ? found.l : "—";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "absolute";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_STATE);
      return {
        ...clone(DEFAULT_STATE),
        ...JSON.parse(raw),
      };
    } catch (error) {
      return clone(DEFAULT_STATE);
    }
  }
})();
