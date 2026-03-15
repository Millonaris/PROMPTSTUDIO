import { useState, useMemo, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   TOKENS
═══════════════════════════════════════════════════════ */
const D={bg:"#F8F5EF",surface:"#FFFFFF",panel:"#F2EFE8",ink:"#1C1915",muted:"#8A8279",border:"#E5DFD4",shadow:"0 1px 3px rgba(28,25,21,.06),0 4px 18px rgba(28,25,21,.04)"};
const SC={
  tipo:   {k:"#C25B3A",p:"#FCF0EC",e:"#EEC4B4"},
  tam:    {k:"#3D7A55",p:"#EAF4EE",e:"#9DD0B0"},
  estilo: {k:"#A96A20",p:"#FAF2E4",e:"#DFC080"},
  espacio:{k:"#2A7289",p:"#E5F2F6",e:"#85C8D9"},
  pers:   {k:"#8C4070",p:"#F8EBF4",e:"#D8A4CC"},
  cal:    {k:"#4A5494",p:"#ECEEF8",e:"#B0B8E0"},
  mob:    {k:"#5D6E40",p:"#EDF1E6",e:"#B0C494"},
  pal:    {k:"#7A4A80",p:"#F5EEF8",e:"#CCA8D8"},
  adv:    {k:"#5E6E50",p:"#EDF1E8",e:"#AFC09A"},
};
const FH="'Fraunces',serif";
const FB="'Plus Jakarta Sans',sans-serif";

/* ═══════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════ */
const PRESENTACIONES=[
  {v:"pared_1",      l:"1 lámina en pared",            mode:"wall", count:1},
  {v:"pared_2",      l:"2 láminas en pared",           mode:"wall", count:2},
  {v:"pared_3",      l:"3 láminas en pared",           mode:"wall", count:3},
  {v:"pared_4",      l:"4 láminas en pared",           mode:"wall", count:4},
  {v:"mujer_hold_1", l:"Mujer sujetando 1 lámina",     mode:"hold", count:1},
  {v:"mujer_hold_2", l:"Mujer sujetando 2 láminas",    mode:"hold", count:2},
  {v:"mujer_hold_3", l:"Mujer sujetando 3 láminas",    mode:"hold", count:3},
  {v:"mujer_hold_4", l:"Mujer sujetando 4 láminas",    mode:"hold", count:4},
];
const TAMANIOS=[
  {v:"muy_peq",l:"Muy pequeño",ratio:"3:4",compacto:true},
  {v:"peq",    l:"Pequeño",    ratio:"3:4",compacto:true},
  {v:"med",    l:"Mediano",    ratio:"4:5",compacto:false},
  {v:"gra",    l:"Grande",     ratio:"5:7",compacto:false},
];
const ESTILOS=[
  {v:"nordico",l:"Nórdico"},{v:"ibicenco",l:"Ibicenco"},{v:"boho",l:"Boho"},
  {v:"moderno",l:"Moderno"},{v:"japandi",l:"Japandi"},{v:"mediterraneo",l:"Mediterráneo"},
  {v:"rustico",l:"Rústico refinado"},{v:"minimalista",l:"Minimalista"},{v:"contemporaneo",l:"Contemporáneo natural"},
];
const ESPACIOS_SMALL=[
  {v:"rincon_peq",    l:"Rincón pequeño",          group:"small"},
  {v:"aparador_peq",  l:"Aparador pequeño",        group:"small"},
  {v:"consola_estrecha",l:"Consola estrecha",      group:"small"},
  {v:"lectura",       l:"Rincón de lectura",       group:"small"},
  {v:"pasillo_corto", l:"Pasillo corto",           group:"small"},
  {v:"recibidor_peq", l:"Recibidor pequeño",       group:"small"},
  {v:"comoda_baja",   l:"Cómoda baja",             group:"small"},
  {v:"banco_ventana", l:"Banco junto a ventana",   group:"small"},
  {v:"pared_corta",   l:"Pared corta",             group:"small"},
  {v:"esquina_comp",  l:"Esquina compacta",        group:"small"},
];
const ESPACIOS_LARGE=[
  {v:"salon_grande",      l:"Salón grande",                 group:"large"},
  {v:"comedor_amplio",    l:"Comedor amplio",               group:"large"},
  {v:"dormitorio_amplio", l:"Dormitorio amplio",            group:"large"},
  {v:"pared_grande",      l:"Pared grande",                 group:"large"},
  {v:"zona_abierta",      l:"Zona abierta",                 group:"large"},
  {v:"estancia_principal",l:"Estancia principal",           group:"large"},
  {v:"salon_comedor",     l:"Salón-comedor",                group:"large"},
  {v:"pared_mueble_largo",l:"Pared amplia con mueble largo",group:"large"},
];
const ESPACIOS=[...ESPACIOS_SMALL,...ESPACIOS_LARGE];
const PERSON_COUNT_OPS=[
  {v:"none", l:"Sin personas"},
  {v:"1",    l:"1 persona"},
  {v:"2",    l:"2 personas"},
];
const PERSON_TYPE_OPS=[
  {v:"mujer_35", l:"Mujer 35 años natural"},
  {v:"hombre",   l:"Hombre"},
  {v:"pareja",   l:"Pareja"},
  {v:"neutra",   l:"Persona neutra"},
];
const PERSON_ROLE_OPS=[
  {v:"secundaria", l:"Secundaria"},
  {v:"protagonista",l:"Protagonista"},
];
const ACCIONES=[
  {v:"leyendo",    l:"Leyendo"},
  {v:"sonriendo",  l:"Sonriendo"},
  {v:"hablando",   l:"Hablando"},
  {v:"cafe",       l:"Tomando café"},
  {v:"colocando",  l:"Colocando objetos"},
  {v:"escribiendo",l:"Escribiendo"},
  {v:"hojeando",   l:"Hojeando revista"},
  {v:"vida_cotidiana",l:"Vida cotidiana"},
  {v:"sujetando_laminas",l:"Sujetando láminas"},
];
const INTERACCIONES=[
  {v:"sola",           l:"Sola"},
  {v:"con_otra",       l:"Con otra persona"},
  {v:"con_libro",      l:"Con libro"},
  {v:"con_taza",       l:"Con taza"},
  {v:"con_objetos",    l:"Con objetos decorativos"},
  {v:"sin_mirar_prod", l:"Sin mirar al producto"},
];
const LUCES=[
  {v:"neutra",  l:"Neutra y limpia"},
  {v:"luminosa",l:"Muy luminosa"},
  {v:"lateral", l:"Lateral suave"},
  {v:"ventanal",l:"Gran ventanal"},
  {v:"blancos", l:"Blancos puros"},
];
const DIST_OPS_BY_COUNT={
  1:[
    {v:"centrada",        l:"Centrada"},
    {v:"unica_vertical",  l:"Única vertical"},
    {v:"sobre_aparador",  l:"Sobre aparador"},
    {v:"sobre_consola",   l:"Sobre consola"},
  ],
  2:[
    {v:"horizontal",      l:"Horizontal"},
    {v:"vertical",        l:"Vertical"},
    {v:"simetrica",       l:"Simétrica"},
    {v:"asimetrica",      l:"Asimétrica"},
  ],
  3:[
    {v:"horizontal",      l:"Horizontal"},
    {v:"vertical",        l:"Vertical"},
    {v:"dos_uno",         l:"2 abajo + 1 arriba"},
    {v:"uno_dos",         l:"1 arriba + 2 abajo"},
    {v:"escalonada",      l:"Escalonada"},
    {v:"editorial",       l:"Editorial"},
    {v:"simetrica",       l:"Simétrica"},
    {v:"asimetrica",      l:"Asimétrica"},
  ],
  4:[
    {v:"grid_2x2",        l:"2x2"},
    {v:"horizontal_lineal",l:"Horizontal lineal"},
    {v:"vertical_lineal", l:"Vertical lineal"},
    {v:"bloque_editorial",l:"Bloque editorial"},
    {v:"simetrica",       l:"Simétrica"},
  ],
};
const DECO_OPS=[
  {v:"poca",l:"Poca"},{v:"equilibrada",l:"Equilibrada"},{v:"rica",l:"Rica"},{v:"muy_rica",l:"Muy rica"},
];
const LANG_OPS=[{v:"es",l:"Español"},{v:"en",l:"English"}];

/* ── Mobiliario ───────────────────────────────────── */
const MOB_MODE=[{v:"auto",l:"Automático"},{v:"guided",l:"Guiado"},{v:"manual",l:"Manual"}];
const MUEBLES_OPS=[
  {v:"auto",           l:"Automático",       txt:"",                                           compacto:false},
  {v:"aparador_bajo",  l:"Aparador bajo",    txt:"un aparador bajo de madera natural clara",   compacto:false},
  {v:"aparador_rustico",l:"Aparador rústico",txt:"un aparador rústico de madera con pátina",   compacto:false},
  {v:"aparador_peq",   l:"Aparador pequeño", txt:"un aparador pequeño de madera lavada",       compacto:true},
  {v:"consola",        l:"Consola estrecha", txt:"una consola estrecha de roble",              compacto:true},
  {v:"comoda",         l:"Cómoda baja",      txt:"una cómoda baja de madera natural",          compacto:true},
  {v:"banco_obra",     l:"Banco de obra",    txt:"un banco de obra blanco",                    compacto:true},
  {v:"banco_madera",   l:"Banco de madera",  txt:"un banco de madera con pátina natural",      compacto:true},
  {v:"mesa_aux",       l:"Mesa auxiliar",    txt:"una mesa auxiliar pequeña",                  compacto:true},
  {v:"escritorio_peq", l:"Escritorio pequeño",txt:"un escritorio pequeño de madera",           compacto:false},
  {v:"repisa",         l:"Repisa o balda",   txt:"una repisa de madera natural",               compacto:false},
  {v:"vintage_peq",    l:"Mueble vintage",   txt:"un mueble vintage pequeño con carácter",     compacto:false},
  {v:"sin_mueble",     l:"Sin mueble",       txt:"sin mueble principal",                       compacto:true},
];
const APOYOS_OPS=[
  {v:"auto",    l:"Automático"  ,txt:""},
  {v:"butaca",  l:"Butaca lino"  ,txt:"una butaca de lino natural"},
  {v:"silla_f", l:"Silla fibras" ,txt:"una silla de fibras naturales"},
  {v:"taburete",l:"Taburete"     ,txt:"un taburete de madera bajo"},
  {v:"puff",    l:"Puff de yute" ,txt:"un puff de yute"},
  {v:"banco_aux",l:"Banco auxiliar",txt:"un banco auxiliar de madera"},
  {v:"banco_c", l:"Banco corrido",txt:"un banco corrido de madera"},
  {v:"sin",     l:"Sin apoyo"   ,txt:""},
];
const LAMPARA_OPS=[
  {v:"auto",     l:"Automático",       txt:""},
  {v:"cerama",   l:"Lámpara cerámica", txt:"una lámpara de cerámica artesanal encendida"},
  {v:"lino",     l:"Lámpara lino",     txt:"una lámpara con pantalla de lino"},
  {v:"barro",    l:"Lámpara barro",    txt:"una lámpara de barro claro artesanal"},
  {v:"aplique",  l:"Aplique sencillo", txt:"un aplique de pared de latón mate"},
  {v:"sobremesa",l:"Sobremesa",        txt:"una lámpara de sobremesa artesanal"},
  {v:"sin",      l:"Sin lámpara",      txt:""},
];
const VEGETA_OPS=[
  {v:"auto",   l:"Automático",         txt:""},
  {v:"olivo",  l:"Ramas de olivo",     txt:"ramas de olivo en jarrón alto"},
  {v:"eucali", l:"Eucalipto",          txt:"un ramo de eucalipto en florero"},
  {v:"seco",   l:"Ramo seco",          txt:"un ramo seco en jarrón de barro"},
  {v:"hoja_r", l:"Hoja redonda",       txt:"una planta de hoja redonda pequeña"},
  {v:"maceta", l:"Planta maceta",      txt:"una planta pequeña en maceta artesanal"},
  {v:"mediter",l:"Mediterránea",       txt:"una planta mediterránea discreta"},
  {v:"sin",    l:"Sin vegetación",     txt:""},
];
const OBJETOS_OPS=[
  {v:"libros",      l:"Libros"},
  {v:"jarron",      l:"Jarrón"},
  {v:"cuenco",      l:"Cuenco artesanal"},
  {v:"bandeja",     l:"Bandeja"},
  {v:"cestas",      l:"Cestas"},
  {v:"vela",        l:"Vela"},
  {v:"ceramica_peq",l:"Cerámica pequeña"},
  {v:"jarra_vidrio",l:"Jarra de vidrio"},
  {v:"escultura",   l:"Pieza escultórica"},
  {v:"caja_madera", l:"Caja de madera"},
  {v:"revistas",    l:"Revistas"},
  {v:"cuenco_barro",l:"Cuenco de barro"},
  {v:"portavelas",  l:"Portavelas"},
  {v:"marco_vacio", l:"Marco vacío"},
];
const OBJETOS_TXT={
  libros:"libros apilados",jarron:"un jarrón artesanal",cuenco:"un cuenco artesanal",
  bandeja:"una bandeja de fibras",cestas:"una cesta de mimbre",vela:"una vela sin quemar",
  ceramica_peq:"una cerámica pequeña",jarra_vidrio:"una jarra de vidrio soplado",
  escultura:"una pieza escultórica de barro",caja_madera:"una caja de madera",
  revistas:"revistas dobladas",cuenco_barro:"un cuenco de barro",
  portavelas:"un portavelas discreto",marco_vacio:"un pequeño marco vacío secundario",
};
const TEXTIL_OPS=[
  {v:"auto",        l:"Automático",      txt:""},
  {v:"cojines_lino",l:"Cojines lino",    txt:"cojines de lino blanco roto"},
  {v:"manta",       l:"Manta doblada",   txt:"una manta de algodón natural doblada"},
  {v:"plaid",       l:"Plaid natural",   txt:"un plaid en tono beige muy claro"},
  {v:"alfombra",    l:"Alfombra yute",   txt:"una alfombra de yute en el suelo"},
  {v:"lino_arrug",  l:"Lino arrugado",   txt:"lino arrugado de forma natural"},
  {v:"neutro",      l:"Textil neutro",   txt:"un textil ligero en tono neutro"},
  {v:"sin_manta",   l:"Sin manta",       txt:""},
  {v:"sin_alfombra",l:"Sin alfombra",    txt:""},
];
const INTENS_OPS=[
  {v:"muy_limpia", l:"Muy limpia"},
  {v:"equilibrada",l:"Equilibrada"},
  {v:"rica",       l:"Rica"},
  {v:"muy_rica",   l:"Muy rica"},
];

/* ── Paleta cromática ─────────────────────────────── */
const PAL_PALETAS=[
  {v:"neutros",         l:"Neutros",           dot:"#C8C0B0"},
  {v:"verdes_suaves",   l:"Verdes suaves",     dot:"#8DB88D"},
  {v:"verde_oliva",     l:"Verde oliva",       dot:"#7A8A50"},
  {v:"verdes_apagados", l:"Verdes apagados",   dot:"#6A8070"},
  {v:"azul_grisaceo",   l:"Azul grisáceo",     dot:"#7090A0"},
  {v:"azules_suaves",   l:"Azules suaves",     dot:"#80A0C0"},
  {v:"terracota",       l:"Terracota",         dot:"#C07060"},
  {v:"arena",           l:"Arena",             dot:"#C8B090"},
  {v:"beige_suave",     l:"Beige suave",       dot:"#D4C8A8"},
  {v:"marrones_calidos",l:"Marrones cálidos",  dot:"#A89070"},
  {v:"negro_grafito",   l:"Negro / grafito",   dot:"#404040"},
  {v:"rosa_empolvado",  l:"Rosa empolvado",    dot:"#D0A0A8"},
  {v:"teja_suave",      l:"Teja suave",        dot:"#C08870"},
  {v:"mostaza_suave",   l:"Mostaza suave",     dot:"#C8A840"},
  {v:"burdeos_suave",   l:"Burdeos suave",     dot:"#904060"},
  {v:"sin_color",       l:"Sin color guía",    dot:"#D0D0D0"},
];
const PAL_INTENS=[
  {v:"muy_sutil",l:"Muy sutil"},
  {v:"sutil",    l:"Sutil"},
  {v:"media",    l:"Media"},
];
const PAL_DONDE=[
  {v:"cojines",  l:"Cojines"},
  {v:"manta",    l:"Manta / plaid"},
  {v:"ceramica", l:"Cerámica pequeña"},
  {v:"jarron",   l:"Jarrón"},
  {v:"libros",   l:"Libros"},
  {v:"cuenco",   l:"Cuenco artesanal"},
  {v:"bandeja",  l:"Bandeja"},
  {v:"textiles", l:"Textiles ligeros"},
  {v:"alfombra", l:"Alfombra"},
  {v:"planta",   l:"Planta o ramas"},
  {v:"lampara",  l:"Lámpara"},
  {v:"escultura",l:"Pieza escultórica"},
];
const PAL_MODE=[
  {v:"auto",  l:"Automático"},
  {v:"guided",l:"Guiado"},
  {v:"manual",l:"Manual"},
];
const PAL_LABEL={
  neutros:"neutros y tonos piedra",verdes_suaves:"verdes suaves y naturales",
  verde_oliva:"verde oliva apagado",verdes_apagados:"verdes apagados tipo salvia",
  azul_grisaceo:"azul grisáceo muy contenido",azules_suaves:"azules suaves tipo pizarra",
  terracota:"terracota clara y cálida",arena:"arena y ocre suave",
  beige_suave:"beige suave y lino claro",marrones_calidos:"marrones cálidos suaves",
  negro_grafito:"negro o grafito contenido",rosa_empolvado:"rosa empolvado muy suave",
  teja_suave:"teja y naranja tostado suave",mostaza_suave:"mostaza y dorado apagado muy suave",
  burdeos_suave:"burdeos muy apagado y elegante",sin_color:"",
};
const DONDE_LABEL={
  cojines:"cojines",manta:"manta o plaid",ceramica:"cerámica pequeña",
  jarron:"jarrón",libros:"lomos de libros",cuenco:"cuenco artesanal",
  bandeja:"bandeja",textiles:"textiles ligeros",alfombra:"alfombra",
  planta:"vegetación y ramas",lampara:"lámpara",escultura:"pieza escultórica pequeña",
};
const PAL_AUTO_DONDE=[
  ["cojines","ceramica","libros"],["manta","jarron","textiles"],
  ["cuenco","planta","ceramica"],["bandeja","libros","alfombra"],
  ["ceramica","cojines","escultura"],["jarron","textiles","planta"],
  ["libros","manta","cuenco"],["planta","ceramica","bandeja"],
];

/* ═══════════════════════════════════════════════════════
   DOMAIN HELPERS
═══════════════════════════════════════════════════════ */
const DEFAULT_PEOPLE={cantidad:"none",tipo:"mujer_35",rol:"secundaria",accion:"vida_cotidiana",interaccion:"sola"};

function getPresentationMeta(tipo){
  return PRESENTACIONES.find(t=>t.v===tipo)||PRESENTACIONES[2];
}
function getSizeMeta(tam){
  return TAMANIOS.find(t=>t.v===tam)||TAMANIOS[1];
}
function getSpaceMeta(espacio){
  return ESPACIOS.find(e=>e.v===espacio)||ESPACIOS[0];
}
function isHoldingPresentation(tipo){
  return getPresentationMeta(tipo).mode==="hold";
}
function printWord(count){
  return count===1?"lámina":"láminas";
}
function productCountLabel(count){
  return `${count} ${printWord(count)}`;
}
function productDecorativeLabel(count){
  return count===1?"1 lámina decorativa":`${count} láminas decorativas`;
}
function getAllowedSpaces(tipo,tam){
  const pres=getPresentationMeta(tipo);
  const size=getSizeMeta(tam);
  if(pres.mode==="hold") return ESPACIOS;
  if(size.compacto) return ESPACIOS.filter(e=>e.group==="small");
  return ESPACIOS;
}
function getDistributionOptions(tipo){
  return DIST_OPS_BY_COUNT[getPresentationMeta(tipo).count]||DIST_OPS_BY_COUNT[3];
}
function getFilteredRoleOptions(tipo,cantidad){
  if(isHoldingPresentation(tipo)) return PERSON_ROLE_OPS.filter(o=>o.v==="protagonista");
  if(cantidad==="none") return PERSON_ROLE_OPS.filter(o=>o.v==="secundaria");
  return PERSON_ROLE_OPS.filter(o=>o.v==="secundaria");
}
function getFilteredActionOptions(tipo,cantidad){
  if(cantidad==="none") return [];
  if(isHoldingPresentation(tipo)) return ACCIONES.filter(o=>o.v==="sujetando_laminas");
  return ACCIONES.filter(o=>o.v!=="sujetando_laminas");
}
function getFilteredInteractionOptions(tipo,cantidad){
  if(cantidad==="none") return [];
  if(isHoldingPresentation(tipo)) return INTERACCIONES.filter(o=>["sola","sin_mirar_prod"].includes(o.v));
  if(cantidad==="1") return INTERACCIONES.filter(o=>o.v!=="con_otra");
  return INTERACCIONES.filter(o=>o.v!=="sola");
}
function describeCompactRule(tipo,tam){
  const pres=getPresentationMeta(tipo);
  const size=getSizeMeta(tam);
  if(pres.mode==="hold") return "La mujer sujetando las láminas no obliga a compactar el espacio y puede convivir con escenas más amplias.";
  if(size.compacto) return "Con producto pequeño en pared el sistema limitará la escena a espacios compactos, paredes cortas y mobiliario proporcionado.";
  if(size.v==="gra") return "El tamaño grande habilita también espacios amplios siempre que el producto siga dominando la escena.";
  return "El sistema mantendrá el producto proporcionado al espacio y evitará paredes vacías demasiado abiertas.";
}

/* ═══════════════════════════════════════════════════════
   VARIATION LIBRARIES
═══════════════════════════════════════════════════════ */
const AUTO_MUEBLES=[
  "un aparador bajo de madera natural clara","una consola estrecha de roble",
  "una cómoda baja de madera lavada","un banco de obra blanco",
  "un banco de madera con pátina natural","un mueble rústico pequeño de madera con cajones",
  "una repisa de madera natural","un aparador pequeño de madera con pátina envejecida",
  "una mesa auxiliar pequeña de madera natural","un mueble vintage pequeño con carácter",
];
const COMPACTO_MUEBLES=[
  "un aparador pequeño de madera lavada","una consola estrecha de roble",
  "una cómoda baja de madera natural","un banco de obra blanco",
  "un banco de madera con pátina natural","una mesa auxiliar pequeña",
];
const AUTO_APOYOS=["una butaca de lino natural cerca","una silla de fibras naturales al lado","un puff de yute en el lateral","un taburete de madera bajo","",""];
const AUTO_LAMPARAS=["una lámpara de cerámica artesanal encendida","una lámpara con pantalla de lino","un aplique de pared de latón mate","una lámpara de barro claro artesanal","una lámpara de sobremesa artesanal","",""];
const AUTO_VEGETA=["ramas de olivo en jarrón alto","un ramo de eucalipto en florero","una planta de hoja redonda pequeña","un ramo seco en jarrón de barro","una planta pequeña en maceta artesanal","una planta mediterránea discreta",""];
const AUTO_OBJETOS=[
  ["libros apilados","un cuenco artesanal blanco","una vela sin quemar"],
  ["libros apilados","una jarra de vidrio soplado","una cerámica pequeña"],
  ["una bandeja de fibras","un cuenco de cerámica","una pieza escultórica de barro"],
  ["libros apilados en horizontal","una cesta de mimbre","un cuenco artesanal"],
  ["una bandeja de madera con vela","libros apilados"],
  ["una caja de madera","cerámica blanca pequeña","ramas secas en frasco"],
  ["pieza escultórica de barro","vela gruesa","libros apilados"],
  ["revistas dobladas","un cuenco de barro","una bandeja de fibras"],
  ["un portavelas discreto","libros","cerámica artesanal pequeña"],
  ["una jarra de vidrio soplado","un cuenco de barro","lino arrugado"],
];
const AUTO_TEXTILES=["cojines de lino blanco roto","una manta de algodón natural doblada","una alfombra de yute en el suelo","lino arrugado de forma natural","un plaid en tono beige muy claro",""];

function pick(arr,seed){return arr[((seed%arr.length)+arr.length)%arr.length];}

const AUTO_COMPOSICIONES=[
  "una composición compacta y equilibrada con mobiliario proporcionado",
  "un rincón bien editado con capas suaves y circulación real",
  "una escena recogida con apoyo visual lateral y accesorios variados",
  "una composición natural de interiorismo con pesos visuales muy medidos",
  "un encuadre editorial con mueble principal bien proporcionado y acentos sutiles",
  "una escena realista con elementos vividos y distribución muy coherente",
];
const ACTION_VARIATIONS={
  leyendo:["leyendo un libro con calma","leyendo unas páginas de forma relajada","leyendo de manera tranquila junto a la escena"],
  sonriendo:["sonriendo con naturalidad","sonriendo suavemente","con una sonrisa leve y espontánea"],
  hablando:["hablando con naturalidad","manteniendo una conversación relajada","comentando algo de forma distendida"],
  cafe:["tomando café de forma espontánea","sosteniendo una taza con naturalidad","disfrutando de un café de forma casual"],
  colocando:["colocando algunos objetos decorativos","ajustando un detalle decorativo con suavidad","moviendo un objeto decorativo de forma natural"],
  escribiendo:["escribiendo en un cuaderno","anotando algo con calma","escribiendo de manera relajada en una libreta"],
  hojeando:["hojeando una revista","revisando una revista de decoración","pasando páginas de una revista con naturalidad"],
  vida_cotidiana:["haciendo vida cotidiana","en una acción doméstica muy natural","habitando el espacio con naturalidad"],
  sujetando_laminas:["sujetando las láminas con naturalidad","mostrando las láminas con gesto sereno","sosteniendo las láminas de forma clara y protagonista"],
};

function resolveVariation(mob,seed,isCompacto){
  const pool_m=isCompacto?COMPACTO_MUEBLES:AUTO_MUEBLES;
  const mueble  =mob.mueble==="auto"  ?pick(pool_m,seed)        :(MUEBLES_OPS.find(o=>o.v===mob.mueble)?.txt||pick(pool_m,seed));
  const apoyo   =mob.apoyo==="auto"   ?pick(AUTO_APOYOS,seed+1) :(APOYOS_OPS.find(o=>o.v===mob.apoyo)?.txt||"");
  const lampara =mob.lampara==="auto" ?pick(AUTO_LAMPARAS,seed+2):(LAMPARA_OPS.find(o=>o.v===mob.lampara)?.txt||"");
  const vegetal =mob.vegeta==="auto"  ?pick(AUTO_VEGETA,seed+3) :(VEGETA_OPS.find(o=>o.v===mob.vegeta)?.txt||"");
  const textil  =mob.textil==="auto"  ?pick(AUTO_TEXTILES,seed+5):(TEXTIL_OPS.find(o=>o.v===mob.textil)?.txt||"");
  const objetos =mob.objetos.length===0?pick(AUTO_OBJETOS,seed+4):mob.objetos.map(v=>OBJETOS_TXT[v]).filter(Boolean);
  const composicion=pick(AUTO_COMPOSICIONES,seed+7);
  return {mueble,apoyo,lampara,vegetal,objetos,textil,composicion};
}

/* ═══════════════════════════════════════════════════════
   PROMPT COPY MAPS
═══════════════════════════════════════════════════════ */
const ESTILO_BASE={
  nordico:      "pared blanca lisa en acabado mate, madera clara, textiles de lino, cerámica blanca, ambiente limpio y luminoso",
  ibicenco:     "pared blanca lisa en acabado mate, madera natural clara o lavada, fibras naturales, cerámica artesanal, sensación mediterránea real",
  boho:         "pared blanca lisa en acabado mate, madera rústica, fibras naturales, lino, capas visuales y ambiente acogedor y vivido",
  moderno:      "pared blanca lisa en acabado mate, líneas muy limpias, materiales depurados, composición precisa",
  japandi:      "pared blanca lisa en acabado mate, calma visual, materiales naturales, equilibrio y simplicidad",
  mediterraneo: "pared blanca lisa en acabado mate, madera natural, cerámica artesanal y ambiente mediterráneo auténtico",
  rustico:      "pared blanca lisa en acabado mate, madera con veta natural, textiles de algodón grueso e imperfecciones bonitas",
  minimalista:  "pared blanca lisa en acabado mate, silencio visual extremo y composición muy cuidada",
  contemporaneo:"pared blanca lisa en acabado mate, mezcla de madera y metal mate, textiles suaves",
};
const ESPACIO_TXT={
  rincon_peq:"un rincón pequeño y compacto",
  aparador_peq:"el entorno de un aparador pequeño",
  consola_estrecha:"el entorno de una consola estrecha",
  lectura:"un rincón de lectura acogedor",
  pasillo_corto:"un pasillo corto",
  recibidor_peq:"un recibidor pequeño",
  comoda_baja:"el entorno de una cómoda baja",
  banco_ventana:"el rincón junto a un banco cercano a la ventana",
  pared_corta:"una pared corta",
  esquina_comp:"una esquina compacta",
  salon_grande:"un salón grande y bien proporcionado",
  comedor_amplio:"un comedor amplio",
  dormitorio_amplio:"un dormitorio amplio",
  pared_grande:"una pared grande proporcionada",
  zona_abierta:"una zona abierta bien resuelta",
  estancia_principal:"la estancia principal",
  salon_comedor:"un salón-comedor amplio",
  pared_mueble_largo:"una pared amplia con mueble largo",
};
const LUZ_TXT={
  neutra:"mucha luz natural neutra y limpia",luminosa:"muchísima luz natural directa",
  lateral:"luz natural lateral suave",ventanal:"luz de gran ventanal inundando el espacio",
  blancos:"luz blanca y muy limpia",
};
const DIST_TXT={
  centrada:"centrada sobre el eje visual principal",
  unica_vertical:"en una única presencia vertical muy limpia",
  sobre_aparador:"centrada sobre un aparador proporcionado",
  sobre_consola:"centrada sobre una consola estrecha",
  horizontal:"alineadas en horizontal con ritmo limpio",
  vertical:"alineadas en vertical con lectura clara",
  dos_uno:"dos abajo y una arriba, bien compensadas",
  uno_dos:"una arriba y dos abajo, con jerarquía equilibrada",
  escalonada:"en una composición escalonada natural",
  editorial:"en una agrupación editorial con tensión controlada",
  simetrica:"en una composición simétrica precisa",
  asimetrica:"en una composición asimétrica equilibrada",
  grid_2x2:"en una retícula 2x2 perfectamente ordenada",
  horizontal_lineal:"en una línea horizontal continua",
  vertical_lineal:"en una línea vertical continua",
  bloque_editorial:"en un bloque editorial compacto",
};
const ACCION_TXT={
  leyendo:"leyendo de forma relajada",
  sonriendo:"sonriendo de forma natural",
  hablando:"hablando con naturalidad",
  cafe:"tomando café de forma espontánea",
  colocando:"colocando un objeto decorativo",
  escribiendo:"escribiendo en un cuaderno",
  hojeando:"hojeando una revista de decoración",
  vida_cotidiana:"haciendo vida cotidiana",
  sujetando_laminas:"sujetando las láminas",
};
const INTERACCION_TXT={
  sola:"sin acompañantes y con actitud natural",
  con_otra:"interactuando con la otra persona de forma suave",
  con_libro:"acompañada por un libro o revista",
  con_taza:"con una taza integrada en la acción",
  con_objetos:"interactuando con objetos decorativos",
  sin_mirar_prod:"sin mirar hacia el producto",
};
const DECO_TXT={
  poca:"decoración general contenida y limpia",
  equilibrada:"decoración general equilibrada y coherente",
  rica:"decoración general rica, cuidada y cálida",
  muy_rica:"decoración general abundante pero ordenada",
};
const INTENS_TXT={
  muy_limpia:"espacio muy limpio, mínima decoración",equilibrada:"decoración equilibrada y curada",
  rica:"decoración generosa con varias capas visuales",muy_rica:"decoración muy rica y vivida, múltiples capas visuales",
};

function buildPersonSubject(people,holding){
  const {cantidad,tipo}=people;
  if(holding) return "una mujer de unos 35 años, natural, bien vestida con tonos neutros y gesto sereno";
  if(cantidad==="2"){
    if(tipo==="pareja") return "una pareja natural";
    if(tipo==="hombre") return "dos hombres de presencia natural y estilo sobrio";
    if(tipo==="neutra") return "dos personas de presencia neutra y natural";
    return "dos mujeres de unos 35 años, naturales y bien integradas";
  }
  if(tipo==="hombre") return "un hombre de presencia natural y ropa sobria";
  if(tipo==="pareja") return "una persona de aspecto cálido y natural";
  if(tipo==="neutra") return "una persona neutra de presencia natural";
  return "una mujer de unos 35 años, natural, con ropa en tonos neutros";
}
function buildPeopleText(s,seed){
  const pres=getPresentationMeta(s.tipo);
  const holding=pres.mode==="hold";
  if(!holding&&s.people.cantidad==="none") return "sin personas en la escena; ";
  const subject=buildPersonSubject(s.people,holding);
  const action=pick(ACTION_VARIATIONS[s.people.accion]||[ACCION_TXT[s.people.accion]||ACCION_TXT.vida_cotidiana],seed+9);
  const interaction=INTERACCION_TXT[s.people.interaccion];
  if(holding){
    let t=`aparece ${subject}, ${action}, de pie en el interior, `;
    if(interaction) t+=`${interaction}, `;
    t+="como presencia protagonista humana, pero cediendo el protagonismo principal al producto; ";
    return t;
  }
  let t=`aparece ${subject}, ${action}`;
  if(interaction) t+=`, ${interaction}`;
  t+=", integrada con naturalidad, siempre secundaria y sin competir con el producto; ";
  if(s.people.cantidad==="2") t+="la acción entre personas debe sentirse cotidiana y suave, nunca teatral; ";
  return t;
}

/* ═══════════════════════════════════════════════════════
   PALETA BUILDER
═══════════════════════════════════════════════════════ */
function buildPaletaText(pal,seed,count){
  if(!pal.active||!pal.paletas.length||pal.paletas.every(v=>v==="sin_color")) return "";
  const labels=pal.paletas.filter(v=>v!=="sin_color").map(v=>PAL_LABEL[v]).filter(Boolean);
  if(!labels.length) return "";
  const colorStr=labels.join(" y ");
  let donde=pal.mode==="auto"?pick(PAL_AUTO_DONDE,seed+6):pal.donde.length?pal.donde:pick(PAL_AUTO_DONDE,seed+6);
  const dondeTxt=donde.map(v=>DONDE_LABEL[v]).filter(Boolean);
  const intensMap={muy_sutil:"de forma muy sutil y casi imperceptible",sutil:"de forma sutil y elegante",media:"de forma moderada y armónica"};
  const intensTxt=intensMap[pal.intens]||intensMap.sutil;
  let t=`Integra ${intensTxt} pequeños acentos cromáticos en la gama de ${colorStr} en algunos accesorios decorativos`;
  if(dondeTxt.length) t+=` — especialmente en ${dondeTxt.join(", ")} —`;
  t+=`; la pared sigue completamente blanca, ${count===1?"la lámina sigue completamente blanca y vacía":`las ${productCountLabel(count)} siguen completamente blancas y vacías`}, balance de blancos neutro y correcto, los colores guía nunca invaden ni dominan la composición; `;
  return t;
}

/* ═══════════════════════════════════════════════════════
   PROMPT BUILDER
═══════════════════════════════════════════════════════ */
function buildPrompt(s,v,seed){
  const tam=getSizeMeta(s.tam);
  const pres=getPresentationMeta(s.tipo);
  const count=pres.count;
  const isHolding=pres.mode==="hold";
  const esp=getSpaceMeta(s.espacio);
  const marcoTxt=s.marco?"con marco extrafino de roble natural claro minimalista":"sin marco";
  let p="";

  if(isHolding) p+="Fotografía lifestyle realista de interiorismo auténtico";
  else          p+="Fotografía editorial realista de interiorismo";

  if(!isHolding) p+=` en ${ESPACIO_TXT[s.espacio]||"un rincón proporcionado"}`;
  else           p+=` en ${ESPACIO_TXT[s.espacio]||"un interior luminoso y bonito"}`;
  p+=", ";

  p+=`de estilo decorativo ${s.estilo}: ${ESTILO_BASE[s.estilo]||""}; `;

  p+=`${LUZ_TXT[s.luz]||LUZ_TXT.neutra}`;
  p+="; balance de blancos correcto, blancos verdaderamente blancos, sin dominante cálida, sin tonos amarillos, sin efecto dorado; ";

  if(!isHolding){
    p+=`en la pared${v.mueble&&v.mueble!=="sin mueble principal"?" justo encima del mueble principal":""} ${count===1?"aparece":"aparecen"} ${productDecorativeLabel(count)} de tamaño visual ${tam.l.toLowerCase()}, `;
    p+=`${count===1?"con proporción vertical":"todas iguales entre sí, con proporción vertical"} ${tam.ratio}, ${marcoTxt}, `;
    if(s.cristal&&s.marco) p+="con cristal real y reflejos suaves de ventana y de cortina, brillo sutil fotográfico, nunca espejo ni brillo exagerado, ";
    p+="completamente blancas, vacías, sin diseño, sin texto y sin ilustración, ";
    p+=`${DIST_TXT[s.dist]||DIST_TXT.horizontal}, `;
    p+="vistas totalmente de frente a cámara, rectas, paralelas al plano de la imagen, nunca en diagonal, nunca inclinadas; ";
    p+=`el producto es el protagonista principal y ocupa un peso visual claro dentro del encuadre; `;
    if(tam.compacto) p+="la escena se desarrolla en un espacio compacto y recogido, evita paredes grandes vacías, escenas demasiado abiertas y mobiliario sobredimensionado; ";
    else if(esp.group==="large") p+="el espacio amplio sigue estando proporcionado para que el producto no se pierda ni quede lejano; ";
    p+=`${v.composicion}; `;

    const objStr=v.objetos.filter(Boolean).join(", ");
    const decorBits=[objStr,v.vegetal,v.lampara].filter(Boolean).join(", ");
    if(v.mueble&&v.mueble!=="sin mueble principal"){
      p+=decorBits?`${v.mueble} decorado con ${decorBits}`:`${v.mueble} con apoyo decorativo mínimo y proporcionado`;
    } else {
      p+=decorBits?`junto a la composición aparecen ${decorBits}`:"la composición se mantiene limpia, proporcionada y sin exceso de elementos";
    }
    if(v.textil) p+=`; ${v.textil}`;
    if(v.apoyo)  p+=`; ${v.apoyo} integrado en la escena`;
    p+=`; ${DECO_TXT[s.deco]||DECO_TXT.equilibrada}; ${INTENS_TXT[s.mob.intens]||INTENS_TXT.equilibrada}, sin quitar protagonismo al producto; `;
    p+=buildPeopleText(s,seed);

    const palTxt=buildPaletaText(s.pal,seed,count);
    if(palTxt) p+=palTxt;
  } else {
    p+=buildPeopleText(s,seed);
    p+=`sujeta ${productDecorativeLabel(count)} — ${count===1?"la lámina":"todas iguales"} con proporción vertical ${tam.ratio}, ${marcoTxt}, ${count===1?"completamente blanca, vacía, sin diseño, sin texto ni ilustración":"completamente blancas, vacías, sin diseño, sin texto ni ilustración"} —; `;
    p+="las láminas se ven con claridad, bien definidas y con lenguaje visual lifestyle real, nunca como atrezzo secundario; ";
    p+=`${v.composicion}; `;
    p+=`${DECO_TXT[s.deco]||DECO_TXT.equilibrada}; `;
    const palTxt=buildPaletaText(s.pal,seed,count);
    if(palTxt) p+=palTxt;
  }

  p+="fotografía auténtica de revista de decoración, materiales reales, texturas reales, no CGI, no render, no showroom artificial; el producto mantiene siempre el protagonismo principal.";
  return p;
}

function buildNegative(){
  return "text on prints, design on paper, illustration on canvas, printed artwork, CGI, 3D render, artificial showroom, diagonal frames, tilted prints, lateral perspective, yellow light, golden tones, warm cast, overexposed, heavy shadows, blurry product, unequal frame sizes, mirror reflections, glossy plastic sheen, render interior, oversized empty wall, open empty loft, dominant people, product out of focus";
}
function buildShort(s){
  const tam=getSizeMeta(s.tam);
  const pres=getPresentationMeta(s.tipo);
  if(pres.mode==="hold") return `Fotografía lifestyle realista. Mujer natural sujetando ${pres.count===1?"1 lámina blanca vacía":`${productCountLabel(pres.count)} blancas vacías`} ${tam.ratio}, ${s.estilo}, luz ${s.luz}, materiales reales, no render.`;
  return `Fotografía editorial interiorismo. ${pres.count===1?`1 lámina ${tam.l.toLowerCase()} ${tam.ratio} blanca vacía`:`${productCountLabel(pres.count)} ${tam.l.toLowerCase()} ${tam.ratio} blancas vacías`}, ${s.estilo}, ${ESPACIO_TXT[s.espacio]||"rincón compacto"}, de frente a cámara, balance de blancos neutro, no render.`;
}
function getWarnings(s){
  const w=[];
  const tam=getSizeMeta(s.tam);
  const esp=getSpaceMeta(s.espacio);
  const pres=getPresentationMeta(s.tipo);
  if(pres.mode==="wall"&&tam.compacto&&esp.group==="large") w.push("Producto pequeño en pared dentro de espacio grande → perderá escala. Mejor mantener espacios compactos y paredes cortas.");
  if(["ibicenco","mediterraneo"].includes(s.estilo)&&s.mob.intens==="muy_limpia") w.push("Estilo ibicenco con decoración muy limpia queda austero. Considera decoración equilibrada.");
  const muebleOpt=MUEBLES_OPS.find(o=>o.v===s.mob.mueble);
  if(tam?.compacto&&muebleOpt&&!muebleOpt.compacto&&muebleOpt.v!=="auto"&&muebleOpt.v!=="sin_mueble") w.push("Láminas pequeñas: considera un mueble más compacto.");
  if(s.pal.active&&s.pal.intens==="media"&&["minimalista","moderno"].includes(s.estilo)) w.push("Estilo moderno/minimalista con integración cromática media puede sobrecargar. Prueba intensidad 'Sutil'.");
  if(s.deco==="muy_rica"&&s.estilo==="minimalista") w.push("Minimalista con decoración muy rica puede romper la claridad visual. Considera 'Equilibrada'.");
  return w;
}

/* ═══════════════════════════════════════════════════════
   DEFAULTS & PRESETS
═══════════════════════════════════════════════════════ */
const DEFAULT_MOB={mode:"auto",mueble:"auto",apoyo:"auto",lampara:"auto",vegeta:"auto",objetos:[],textil:"auto",intens:"equilibrada"};
const DEFAULT_PAL={active:false,paletas:[],intens:"sutil",donde:[],mode:"auto"};
const DEFAULT={tipo:"pared_3",tam:"peq",estilo:"nordico",espacio:"rincon_peq",people:{...DEFAULT_PEOPLE},luz:"neutra",deco:"equilibrada",dist:"horizontal",marco:true,cristal:true,lang:"es",mob:{...DEFAULT_MOB},pal:{...DEFAULT_PAL}};

const PRESETS=[
  {l:"🌿 Ibicenco compacto", s:{...DEFAULT,tipo:"pared_2",tam:"peq",estilo:"ibicenco",espacio:"aparador_peq",people:{...DEFAULT_PEOPLE},luz:"luminosa",deco:"rica",dist:"horizontal",marco:true,cristal:true,mob:{...DEFAULT_MOB,mueble:"aparador_peq",intens:"rica"},pal:{...DEFAULT_PAL}}},
  {l:"🪴 Lectura con persona",s:{...DEFAULT,tipo:"pared_3",tam:"peq",estilo:"boho",espacio:"lectura",people:{cantidad:"1",tipo:"mujer_35",rol:"secundaria",accion:"leyendo",interaccion:"con_libro"},luz:"neutra",deco:"rica",dist:"horizontal",marco:true,cristal:false,mob:{...DEFAULT_MOB,vegeta:"olivo",intens:"rica"},pal:{...DEFAULT_PAL}}},
  {l:"❄ Consola nórdica",    s:{...DEFAULT,tipo:"pared_1",tam:"peq",estilo:"nordico",espacio:"consola_estrecha",people:{...DEFAULT_PEOPLE},luz:"blancos",deco:"poca",dist:"sobre_consola",marco:true,cristal:false,mob:{...DEFAULT_MOB,mueble:"consola",intens:"muy_limpia"},pal:{...DEFAULT_PAL}}},
  {l:"🤍 Mujer protagonista",s:{...DEFAULT,tipo:"mujer_hold_3",tam:"med",estilo:"nordico",espacio:"rincon_peq",people:{cantidad:"1",tipo:"mujer_35",rol:"protagonista",accion:"sujetando_laminas",interaccion:"sola"},luz:"luminosa",deco:"equilibrada",dist:"horizontal",marco:false,cristal:false,mob:{...DEFAULT_MOB},pal:{...DEFAULT_PAL}}},
  {l:"🏛 Pasillo editorial", s:{...DEFAULT,tipo:"pared_3",tam:"peq",estilo:"moderno",espacio:"pasillo_corto",people:{...DEFAULT_PEOPLE},luz:"lateral",deco:"poca",dist:"editorial",marco:true,cristal:true,mob:{...DEFAULT_MOB,mueble:"consola",lampara:"aplique",intens:"muy_limpia"},pal:{...DEFAULT_PAL}}},
  {l:"🛏 Dormitorio amplio", s:{...DEFAULT,tipo:"pared_4",tam:"gra",estilo:"japandi",espacio:"dormitorio_amplio",people:{...DEFAULT_PEOPLE},luz:"neutra",deco:"equilibrada",dist:"grid_2x2",marco:true,cristal:false,mob:{...DEFAULT_MOB,mueble:"comoda",vegeta:"seco",intens:"equilibrada"},pal:{...DEFAULT_PAL}}},
  {l:"☕ Salón con pareja",   s:{...DEFAULT,tipo:"pared_2",tam:"med",estilo:"contemporaneo",espacio:"salon_comedor",people:{cantidad:"2",tipo:"pareja",rol:"secundaria",accion:"cafe",interaccion:"con_otra"},luz:"neutra",deco:"equilibrada",dist:"simetrica",marco:true,cristal:true,mob:{...DEFAULT_MOB,lampara:"sobremesa",intens:"equilibrada"},pal:{...DEFAULT_PAL}}},
];

/* ═══════════════════════════════════════════════════════
   UI ATOMS
═══════════════════════════════════════════════════════ */
function Chip({label,active,sc,onClick,sm}){
  return(
    <button onClick={onClick} style={{background:active?sc.k:sc.p,color:active?"#fff":sc.k,border:`1.5px solid ${active?sc.k:sc.e}`,borderRadius:"999px",padding:sm?"4px 11px":"5px 15px",fontSize:sm?"11.5px":"12.5px",fontWeight:active?600:400,fontFamily:FB,cursor:"pointer",transition:"all .13s",outline:"none",whiteSpace:"nowrap",lineHeight:1.4,boxShadow:active?`0 2px 10px ${sc.k}28`:"none"}}>
      {label}
    </button>
  );
}
function DotChip({label,active,dot,sc,onClick}){
  return(
    <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:"6px",background:active?sc.k:sc.p,color:active?"#fff":sc.k,border:`1.5px solid ${active?sc.k:sc.e}`,borderRadius:"999px",padding:"4px 12px 4px 8px",fontSize:"11.5px",fontWeight:active?600:400,fontFamily:FB,cursor:"pointer",transition:"all .13s",outline:"none",whiteSpace:"nowrap",lineHeight:1.4,boxShadow:active?`0 2px 10px ${sc.k}28`:"none"}}>
      <span style={{width:"10px",height:"10px",borderRadius:"50%",background:dot,flexShrink:0,border:active?"1.5px solid rgba(255,255,255,.5)":"1.5px solid rgba(0,0,0,.1)",display:"inline-block"}}/>
      {label}
    </button>
  );
}
function MultiChip({label,active,sc,onClick}){
  return(
    <button onClick={onClick} style={{background:active?sc.k:sc.p,color:active?"#fff":sc.k,border:`1.5px solid ${active?sc.k:sc.e}`,borderRadius:"8px",padding:"5px 13px",fontSize:"12px",fontWeight:active?600:400,fontFamily:FB,cursor:"pointer",transition:"all .13s",outline:"none",whiteSpace:"nowrap",lineHeight:1.4,boxShadow:active?`0 2px 8px ${sc.k}28`:"none"}}>
      {label}
    </button>
  );
}
function Row({num,title,sc,children,note}){
  return(
    <div style={{marginBottom:"20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
        <div style={{minWidth:"22px",height:"22px",borderRadius:"6px",background:sc.p,border:`1.5px solid ${sc.e}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:"10px",fontWeight:700,color:sc.k,fontFamily:FB}}>{num}</span>
        </div>
        <span style={{fontFamily:FH,fontSize:"15px",fontWeight:600,color:D.ink,letterSpacing:"-0.2px"}}>{title}</span>
        <div style={{flex:1,height:"1px",background:sc.e,opacity:.7}}/>
      </div>
      {note&&<p style={{fontSize:"11.5px",color:sc.k,marginBottom:"8px",fontWeight:500,lineHeight:1.5}}>↳ {note}</p>}
      <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>{children}</div>
    </div>
  );
}
function Sub({label,sc,children}){
  return(
    <div style={{marginBottom:"12px"}}>
      <p style={{fontSize:"11px",color:D.muted,fontWeight:700,marginBottom:"6px",textTransform:"uppercase",letterSpacing:".6px",display:"flex",alignItems:"center",gap:"6px"}}>
        <span style={{width:"6px",height:"6px",borderRadius:"50%",background:sc.k,display:"inline-block"}}/>
        {label}
      </p>
      <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{children}</div>
    </div>
  );
}
function Tog({on,onChange,color}){
  return(
    <button onClick={()=>onChange(!on)} style={{width:"42px",height:"23px",borderRadius:"999px",background:on?color:"#D4CEC4",border:"none",cursor:"pointer",position:"relative",transition:"background .2s",outline:"none",flexShrink:0}}>
      <span style={{position:"absolute",top:"2.5px",left:on?"21px":"2.5px",width:"18px",height:"18px",borderRadius:"50%",background:"#fff",transition:"left .17s",boxShadow:"0 1px 4px rgba(0,0,0,.18)"}}/>
    </button>
  );
}
function PillBadge({sc,label}){
  return <span style={{fontSize:"11px",background:sc.p,color:sc.k,border:`1px solid ${sc.e}`,padding:"2px 9px",borderRadius:"999px",fontFamily:FB,fontWeight:500}}>{label}</span>;
}
function CollapseBtn({open,onClick,children}){
  return(
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:"8px",background:"transparent",border:`1px solid ${D.border}`,borderRadius:"10px",padding:"8px 16px",fontSize:"12.5px",fontWeight:500,color:D.muted,outline:"none",width:"100%"}}>
      <span style={{fontSize:"11px",display:"inline-block",transform:open?"rotate(90deg)":"none",transition:"transform .18s"}}>▶</span>
      {children}
    </button>
  );
}
function AccordionBlock({icon,title,subtitle,sc,open,onToggle,children}){
  return(
    <div style={{background:D.surface,borderRadius:"16px",border:`1px solid ${D.border}`,overflow:"hidden",boxShadow:D.shadow,marginBottom:"12px"}}>
      <button onClick={onToggle} style={{width:"100%",display:"flex",alignItems:"center",gap:"12px",padding:"14px 18px",background:sc.p,border:"none",borderBottom:open?`1px solid ${sc.e}`:"none",cursor:"pointer",outline:"none"}}>
        <div style={{width:"28px",height:"28px",borderRadius:"8px",background:sc.k,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:"14px",color:"#fff"}}>{icon}</span>
        </div>
        <div style={{flex:1,textAlign:"left"}}>
          <span style={{fontFamily:FH,fontSize:"14px",fontWeight:700,color:D.ink,display:"block"}}>{title}</span>
          <span style={{fontSize:"11px",color:D.muted}}>{subtitle}</span>
        </div>
        <span style={{fontSize:"11px",color:sc.k,display:"inline-block",transform:open?"rotate(90deg)":"none",transition:"transform .18s"}}>▶</span>
      </button>
      {open&&<div style={{padding:"18px"}}>{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════ */
export default function App(){
  const [s,setS]=useState(DEFAULT);
  const [seed,setSeed]=useState(0);
  const [showAdv,setShowAdv]=useState(false);
  const [showMob,setShowMob]=useState(false);
  const [showPal,setShowPal]=useState(false);
  const [showNeg,setShowNeg]=useState(false);
  const [showShort,setShowShort]=useState(false);
  const [copied,setCopied]=useState(null);
  const [ap,setAp]=useState(null);

  const cloneState=useCallback((src)=>({
    ...src,
    people:{...src.people},
    mob:{...src.mob,objetos:[...(src.mob?.objetos||[])]},
    pal:{...src.pal,paletas:[...(src.pal?.paletas||[])],donde:[...(src.pal?.donde||[])]},
  }),[]);
  const upd=useCallback((k,v)=>{setS(p=>({...p,[k]:v}));setAp(null);},[]);
  const updMob=useCallback((k,v)=>{setS(p=>({...p,mob:{...p.mob,[k]:v}}));setAp(null);},[]);
  const updPal=useCallback((k,v)=>{setS(p=>({...p,pal:{...p.pal,[k]:v}}));setAp(null);},[]);
  const updPeople=useCallback((k,v)=>{setS(p=>({...p,people:{...p.people,[k]:v}}));setAp(null);},[]);
  const applyPreset=(ps,i)=>{setS(cloneState(ps));setAp(i);};
  const regenerate=()=>setSeed(x=>x+7);

  const presentation=useMemo(()=>getPresentationMeta(s.tipo),[s.tipo]);
  const tam=useMemo(()=>getSizeMeta(s.tam),[s.tam]);
  const isHolding=presentation.mode==="hold";
  const isCompacto=!isHolding&&tam.compacto;
  const allowedSpaces=useMemo(()=>getAllowedSpaces(s.tipo,s.tam),[s.tipo,s.tam]);
  const smallSpaces=useMemo(()=>allowedSpaces.filter(o=>o.group==="small"),[allowedSpaces]);
  const largeSpaces=useMemo(()=>allowedSpaces.filter(o=>o.group==="large"),[allowedSpaces]);
  const distOptions=useMemo(()=>getDistributionOptions(s.tipo),[s.tipo]);
  const filteredRoleOptions=useMemo(()=>getFilteredRoleOptions(s.tipo,s.people.cantidad),[s.tipo,s.people.cantidad]);
  const filteredActionOptions=useMemo(()=>getFilteredActionOptions(s.tipo,s.people.cantidad),[s.tipo,s.people.cantidad]);
  const filteredInteractionOptions=useMemo(()=>getFilteredInteractionOptions(s.tipo,s.people.cantidad),[s.tipo,s.people.cantidad]);
  const filteredTypeOptions=useMemo(()=>{
    if(isHolding) return PERSON_TYPE_OPS.filter(o=>o.v==="mujer_35");
    if(s.people.cantidad!=="2") return PERSON_TYPE_OPS.filter(o=>o.v!=="pareja");
    return PERSON_TYPE_OPS;
  },[isHolding,s.people.cantidad]);
  const filteredCountOptions=useMemo(()=>{
    if(isHolding) return PERSON_COUNT_OPS.filter(o=>o.v==="1");
    return PERSON_COUNT_OPS;
  },[isHolding]);

  const variation=useMemo(()=>resolveVariation(s.mob,seed,isCompacto),[s.mob,seed,isCompacto]);
  const prompt=useMemo(()=>buildPrompt(s,variation,seed),[s,variation,seed]);
  const neg=useMemo(()=>buildNegative(),[]);
  const sht=useMemo(()=>buildShort(s),[s]);
  const warnings=useMemo(()=>getWarnings(s),[s]);

  useEffect(()=>{
    setS(prev=>{
      let next=prev;
      let changed=false;
      const pres=getPresentationMeta(prev.tipo);
      const size=getSizeMeta(prev.tam);
      const nextSpaces=getAllowedSpaces(prev.tipo,prev.tam);
      const nextDists=getDistributionOptions(prev.tipo);
      const compactMode=pres.mode==="wall"&&size.compacto;
      const allowedMuebles=compactMode?MUEBLES_OPS.filter(o=>o.v==="auto"||o.compacto||o.v==="sin_mueble"):MUEBLES_OPS;
      let people=next.people;

      if(!nextSpaces.some(o=>o.v===prev.espacio)){
        next={...next,espacio:nextSpaces[0]?.v||prev.espacio};
        changed=true;
      }
      if(!nextDists.some(o=>o.v===prev.dist)){
        next={...next,dist:nextDists[0]?.v||prev.dist};
        changed=true;
      }
      if(!allowedMuebles.some(o=>o.v===prev.mob.mueble)){
        next={...next,mob:{...next.mob,mueble:"auto"}};
        changed=true;
      }

      if(pres.mode==="hold"){
        const forcedInteraction=["sola","sin_mirar_prod"].includes(people.interaccion)?people.interaccion:"sola";
        const forcedPeople={...people,cantidad:"1",tipo:"mujer_35",rol:"protagonista",accion:"sujetando_laminas",interaccion:forcedInteraction};
        if(JSON.stringify(forcedPeople)!==JSON.stringify(people)){
          people=forcedPeople;
        }
      } else {
        let nextPeople={...people};
        if(nextPeople.cantidad==="none"){
          nextPeople.rol="secundaria";
          if(nextPeople.tipo==="pareja") nextPeople.tipo="mujer_35";
          if(nextPeople.accion==="sujetando_laminas") nextPeople.accion="vida_cotidiana";
          if(nextPeople.interaccion==="con_otra") nextPeople.interaccion="sola";
        } else {
          nextPeople.rol="secundaria";
          if(nextPeople.cantidad!=="2"&&nextPeople.tipo==="pareja") nextPeople.tipo="mujer_35";
          if(nextPeople.accion==="sujetando_laminas") nextPeople.accion="vida_cotidiana";
          if(nextPeople.cantidad==="1"&&nextPeople.interaccion==="con_otra") nextPeople.interaccion="sola";
          if(nextPeople.cantidad==="2"&&nextPeople.interaccion==="sola") nextPeople.interaccion="con_otra";
        }
        if(JSON.stringify(nextPeople)!==JSON.stringify(people)){
          people=nextPeople;
        }
      }

      if(JSON.stringify(people)!==JSON.stringify(next.people)){
        next={...next,people};
        changed=true;
      }
      return changed?next:prev;
    });
  },[s.tipo,s.tam,s.espacio,s.dist,s.mob.mueble,s.people.cantidad,s.people.tipo,s.people.rol,s.people.accion,s.people.interaccion]);

  const chips=(key,opts,sc,sm)=>opts.map(o=><Chip key={o.v} label={o.l} active={s[key]===o.v} sc={sc} onClick={()=>upd(key,o.v)} sm={sm}/>);

  const toggleObj=v=>{const c=s.mob.objetos;updMob("objetos",c.includes(v)?c.filter(x=>x!==v):[...c,v]);};
  const togglePaleta=v=>{const c=s.pal.paletas;updPal("paletas",c.includes(v)?c.filter(x=>x!==v):[...c,v]);};
  const toggleDonde=v=>{const c=s.pal.donde;updPal("donde",c.includes(v)?c.filter(x=>x!==v):[...c,v]);};

  const copy=(txt,w)=>{navigator.clipboard.writeText(txt);setCopied(w);setTimeout(()=>setCopied(null),2200);};

  const filteredMuebles=isCompacto?MUEBLES_OPS.filter(o=>o.v==="auto"||o.compacto||o.v==="sin_mueble"):MUEBLES_OPS;
  const peopleSummary=s.people.cantidad==="none"
    ?"Sin personas"
    :`${s.people.cantidad} ${s.people.cantidad==="1"?"persona":"personas"} · ${PERSON_TYPE_OPS.find(o=>o.v===s.people.tipo)?.l||"Natural"}`;

  const palSubtitle=s.pal.active
    ?(s.pal.paletas.filter(v=>v!=="sin_color").length>0
        ?`Activado · ${s.pal.paletas.filter(v=>v!=="sin_color").map(v=>PAL_PALETAS.find(p=>p.v===v)?.l).join(", ")}`
        :"Activado · sin paleta elegida")
    :"Desactivado";
  const variationLabel=isHolding?variation.composicion.split(" ").slice(0,4).join(" "):variation.mueble.split(" ").slice(0,4).join(" ");

  return(
    <div style={{fontFamily:FB,background:D.bg,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#CAC4BA;border-radius:99px}
        button,input{font-family:inherit}
      `}</style>

      {/* ── TOPBAR ─────────────────────────────────────── */}
      <header style={{background:D.surface,borderBottom:`1px solid ${D.border}`,padding:"0 22px",height:"56px",display:"flex",alignItems:"center",gap:"18px",flexShrink:0,boxShadow:`0 1px 8px rgba(28,25,21,.05)`}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",flexShrink:0}}>
          <div style={{width:"30px",height:"30px",borderRadius:"8px",background:SC.tipo.p,border:`1.5px solid ${SC.tipo.e}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:"14px"}}>🖼</span>
          </div>
          <div style={{lineHeight:1.2}}>
            <div style={{fontFamily:FH,fontSize:"16px",fontWeight:700,color:D.ink,letterSpacing:"-0.3px"}}>PromptStudio</div>
            <div style={{fontSize:"10px",color:D.muted}}>OhBimba · láminas decorativas</div>
          </div>
        </div>
        <div style={{flex:1,display:"flex",gap:"5px",overflowX:"auto",padding:"2px 0"}}>
          {PRESETS.map((p,i)=>(
            <button key={i} onClick={()=>applyPreset(p.s,i)} style={{background:ap===i?D.ink:D.bg,color:ap===i?"#fff":D.muted,border:`1px solid ${ap===i?D.ink:D.border}`,borderRadius:"999px",padding:"4px 14px",fontSize:"12px",fontWeight:ap===i?600:400,whiteSpace:"nowrap",outline:"none",transition:"all .13s"}}>
              {p.l}
            </button>
          ))}
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* ── LEFT ─────────────────────────────────────── */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 22px 60px"}}>

          <Row num="1" title="Presentación del producto" sc={SC.tipo}>
            {PRESENTACIONES.map(o=>(
              <Chip key={o.v} label={o.l} active={s.tipo===o.v} sc={SC.tipo} onClick={()=>upd("tipo",o.v)}/>
            ))}
          </Row>

          <Row num="2" title="Tamaño visual" sc={SC.tam}
            note={describeCompactRule(s.tipo,s.tam)}>
            {TAMANIOS.map(t=>(
              <button key={t.v} onClick={()=>upd("tam",t.v)} style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"1px",padding:"9px 16px",background:s.tam===t.v?SC.tam.k:SC.tam.p,color:s.tam===t.v?"#fff":SC.tam.k,border:`1.5px solid ${s.tam===t.v?SC.tam.k:SC.tam.e}`,borderRadius:"12px",outline:"none",transition:"all .13s",boxShadow:s.tam===t.v?`0 2px 10px ${SC.tam.k}28`:"none"}}>
                <span style={{fontSize:"13px",fontWeight:600}}>{t.l}</span>
                <span style={{fontSize:"10.5px",opacity:.75}}>proporción {t.ratio}</span>
              </button>
            ))}
          </Row>

          <Row num="3" title="Estilo decorativo" sc={SC.estilo}>
            {chips("estilo",ESTILOS,SC.estilo)}
          </Row>

          <Row num="4" title="Tipo de espacio" sc={SC.espacio}>
            <div style={{width:"100%"}}>
              <Sub label="Espacios pequeños" sc={SC.espacio}>
                {smallSpaces.map(o=>(
                  <Chip key={o.v} label={o.l} active={s.espacio===o.v} sc={SC.espacio} onClick={()=>upd("espacio",o.v)} sm/>
                ))}
              </Sub>
              {largeSpaces.length>0&&(
                <Sub label="Espacios grandes" sc={SC.espacio}>
                  {largeSpaces.map(o=>(
                    <Chip key={o.v} label={o.l} active={s.espacio===o.v} sc={SC.espacio} onClick={()=>upd("espacio",o.v)} sm/>
                  ))}
                </Sub>
              )}
              {presentation.mode==="wall"&&tam.compacto&&(
                <p style={{fontSize:"11px",color:SC.espacio.k,lineHeight:1.5,marginTop:"4px"}}>
                  Solo se muestran espacios compactos para mantener la escala correcta del producto pequeño en pared.
                </p>
              )}
            </div>
          </Row>

          <Row num="5" title="Personas y acción" sc={SC.pers}
            note={isHolding
              ?"La presentación elegida ya incorpora una mujer sujetando las láminas; su rol pasa automáticamente a protagonista."
              :"Si el producto va en pared, las personas se mantienen siempre en segundo plano para no robar protagonismo."}>
            <div style={{width:"100%"}}>
              <Sub label="Cantidad" sc={SC.pers}>
                {filteredCountOptions.map(o=>(
                  <Chip key={o.v} label={o.l} active={s.people.cantidad===o.v} sc={SC.pers} onClick={()=>updPeople("cantidad",o.v)} sm/>
                ))}
              </Sub>

              {s.people.cantidad!=="none"&&(
                <>
                  <Sub label="Tipo" sc={SC.pers}>
                    {filteredTypeOptions.map(o=>(
                      <Chip key={o.v} label={o.l} active={s.people.tipo===o.v} sc={SC.pers} onClick={()=>updPeople("tipo",o.v)} sm/>
                    ))}
                  </Sub>
                  <Sub label="Rol" sc={SC.pers}>
                    {filteredRoleOptions.map(o=>(
                      <Chip key={o.v} label={o.l} active={s.people.rol===o.v} sc={SC.pers} onClick={()=>updPeople("rol",o.v)} sm/>
                    ))}
                  </Sub>
                  <Sub label="Acción" sc={SC.pers}>
                    {filteredActionOptions.map(o=>(
                      <Chip key={o.v} label={o.l} active={s.people.accion===o.v} sc={SC.pers} onClick={()=>updPeople("accion",o.v)} sm/>
                    ))}
                  </Sub>
                  <Sub label="Interacción" sc={SC.pers}>
                    {filteredInteractionOptions.map(o=>(
                      <Chip key={o.v} label={o.l} active={s.people.interaccion===o.v} sc={SC.pers} onClick={()=>updPeople("interaccion",o.v)} sm/>
                    ))}
                  </Sub>
                </>
              )}
            </div>
          </Row>

          <Row num="6" title="Luz y calidad visual" sc={SC.cal}>
            {chips("luz",LUCES,SC.cal)}
            <div style={{width:"100%",display:"flex",gap:"22px",flexWrap:"wrap",marginTop:"8px",paddingTop:"10px",borderTop:`1px dashed ${D.border}`}}>
              <label style={{display:"flex",alignItems:"center",gap:"9px",cursor:"pointer"}}>
                <Tog on={s.marco}   onChange={v=>upd("marco",v)}   color={SC.cal.k}/>
                <span style={{fontSize:"12.5px",color:s.marco?SC.cal.k:D.muted,fontWeight:s.marco?600:400}}>Marco extrafino de roble</span>
              </label>
              <label style={{display:"flex",alignItems:"center",gap:"9px",cursor:"pointer"}}>
                <Tog on={s.cristal} onChange={v=>upd("cristal",v)} color={SC.cal.k}/>
                <span style={{fontSize:"12.5px",color:s.cristal?SC.cal.k:D.muted,fontWeight:s.cristal?600:400}}>Cristal con reflejos reales</span>
              </label>
            </div>
          </Row>

          {/* ── PANEL AVANZADO ───────────────────────────── */}
          <div style={{marginBottom:"20px"}}>
            <CollapseBtn open={showAdv} onClick={()=>setShowAdv(!showAdv)}>
              Panel avanzado — distribución, decoración, mobiliario, paleta, idioma y negative prompt
            </CollapseBtn>

            {showAdv&&(
              <div style={{marginTop:"14px",display:"flex",flexDirection:"column",gap:"0"}}>

                {!isHolding&&(
                  <div style={{marginBottom:"16px"}}>
                    <p style={{fontSize:"11.5px",color:D.muted,fontWeight:700,marginBottom:"7px",textTransform:"uppercase",letterSpacing:".5px"}}>{`Distribución de ${productCountLabel(presentation.count)}`}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                      {distOptions.map(o=>(
                        <Chip key={o.v} label={o.l} active={s.dist===o.v} sc={SC.adv} onClick={()=>upd("dist",o.v)} sm/>
                      ))}
                    </div>
                  </div>
                )}
                {isHolding&&(
                  <div style={{marginBottom:"16px",padding:"11px 14px",background:SC.adv.p,border:`1px solid ${SC.adv.e}`,borderRadius:"12px"}}>
                    <p style={{fontSize:"11.5px",color:SC.adv.k,lineHeight:1.6}}>
                      La distribución avanzada se adapta automáticamente a cómo la mujer sujeta las láminas y no necesita selección manual en esta presentación.
                    </p>
                  </div>
                )}

                <div style={{marginBottom:"16px"}}>
                  <p style={{fontSize:"11.5px",color:D.muted,fontWeight:700,marginBottom:"7px",textTransform:"uppercase",letterSpacing:".5px"}}>Nivel de decoración general</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{chips("deco",DECO_OPS,SC.adv,true)}</div>
                </div>

                {/* ── MOBILIARIO BLOCK ─────────────────────── */}
                <AccordionBlock icon="🪑" title="Mobiliario y decoración" sc={SC.mob} open={showMob} onToggle={()=>setShowMob(!showMob)}
                  subtitle={`Modo: ${s.mob.mode==="auto"?"Automático":s.mob.mode==="guided"?"Guiado":"Manual"}${s.mob.mueble!=="auto"?" · "+MUEBLES_OPS.find(o=>o.v===s.mob.mueble)?.l:""}`}>

                  <Sub label="A. Modo de control" sc={SC.mob}>
                    {MOB_MODE.map(o=><Chip key={o.v} label={o.l} active={s.mob.mode===o.v} sc={SC.mob} onClick={()=>updMob("mode",o.v)} sm/>)}
                  </Sub>
                  <p style={{fontSize:"11.5px",color:D.muted,lineHeight:1.55,marginBottom:"14px",paddingLeft:"12px",borderLeft:`2px solid ${SC.mob.e}`}}>
                    {s.mob.mode==="auto"&&"La app elige y varía automáticamente en cada regeneración."}
                    {s.mob.mode==="guided"&&"Elige el mueble y el apoyo; el resto varía automáticamente."}
                    {s.mob.mode==="manual"&&"Controlas cada elemento. Lo que dejes en Automático seguirá variando."}
                  </p>

                  {(s.mob.mode==="guided"||s.mob.mode==="manual")&&(
                    <>
                      <Sub label="B. Mueble principal" sc={SC.mob}>
                        {filteredMuebles.map(o=><Chip key={o.v} label={o.l} active={s.mob.mueble===o.v} sc={SC.mob} onClick={()=>updMob("mueble",o.v)} sm/>)}
                        {isCompacto&&<span style={{fontSize:"11px",color:SC.mob.k,width:"100%",marginTop:"4px"}}>↳ Solo muebles compactos disponibles con producto pequeño en pared.</span>}
                      </Sub>
                      <Sub label="C. Apoyo secundario" sc={SC.mob}>
                        {APOYOS_OPS.map(o=><Chip key={o.v} label={o.l} active={s.mob.apoyo===o.v} sc={SC.mob} onClick={()=>updMob("apoyo",o.v)} sm/>)}
                      </Sub>
                    </>
                  )}

                  {s.mob.mode==="manual"&&(
                    <>
                      <Sub label="D. Iluminación decorativa" sc={SC.mob}>
                        {LAMPARA_OPS.map(o=><Chip key={o.v} label={o.l} active={s.mob.lampara===o.v} sc={SC.mob} onClick={()=>updMob("lampara",o.v)} sm/>)}
                      </Sub>
                      <Sub label="E. Vegetación" sc={SC.mob}>
                        {VEGETA_OPS.map(o=><Chip key={o.v} label={o.l} active={s.mob.vegeta===o.v} sc={SC.mob} onClick={()=>updMob("vegeta",o.v)} sm/>)}
                      </Sub>
                      <Sub label="F. Objetos decorativos (selección múltiple)" sc={SC.mob}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",width:"100%"}}>
                          {OBJETOS_OPS.map(o=><MultiChip key={o.v} label={o.l} active={s.mob.objetos.includes(o.v)} sc={SC.mob} onClick={()=>toggleObj(o.v)}/>)}
                        </div>
                        {s.mob.objetos.length===0&&<span style={{fontSize:"11px",color:D.muted,marginTop:"4px"}}>Sin selección → se usarán objetos automáticos variados.</span>}
                      </Sub>
                      <Sub label="G. Textiles" sc={SC.mob}>
                        {TEXTIL_OPS.map(o=><Chip key={o.v} label={o.l} active={s.mob.textil===o.v} sc={SC.mob} onClick={()=>updMob("textil",o.v)} sm/>)}
                      </Sub>
                    </>
                  )}

                  <Sub label="H. Intensidad decorativa" sc={SC.mob}>
                    {INTENS_OPS.map(o=><Chip key={o.v} label={o.l} active={s.mob.intens===o.v} sc={SC.mob} onClick={()=>updMob("intens",o.v)} sm/>)}
                  </Sub>
                </AccordionBlock>

                {/* ── PALETA CROMÁTICA BLOCK ───────────────── */}
                <AccordionBlock icon="🎨" title="Paleta cromática de integración" sc={SC.pal} open={showPal} onToggle={()=>setShowPal(!showPal)} subtitle={palSubtitle}>

                  {/* A — activar */}
                  <Sub label="A. Activar integración cromática" sc={SC.pal}>
                    {[{v:false,l:"Desactivado"},{v:true,l:"Activado"}].map(o=>(
                      <Chip key={String(o.v)} label={o.l} active={s.pal.active===o.v} sc={SC.pal} onClick={()=>updPal("active",o.v)} sm/>
                    ))}
                  </Sub>

                  {s.pal.active&&(
                    <>
                      <p style={{fontSize:"11.5px",color:D.muted,lineHeight:1.6,marginBottom:"14px",paddingLeft:"12px",borderLeft:`2px solid ${SC.pal.e}`}}>
                        Introduce pequeños acentos cromáticos en accesorios decorativos para que el futuro diseño de las láminas encaje visualmente con la escena. Las láminas siguen completamente blancas y vacías. La pared sigue blanca. El balance de blancos no se altera.
                      </p>

                      {/* B — paletas (multi) */}
                      <Sub label="B. Familia cromática del futuro diseño (selección múltiple)" sc={SC.pal}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"6px",width:"100%"}}>
                          {PAL_PALETAS.map(o=>(
                            <DotChip key={o.v} label={o.l} active={s.pal.paletas.includes(o.v)} dot={o.dot} sc={SC.pal} onClick={()=>togglePaleta(o.v)}/>
                          ))}
                        </div>
                        {s.pal.paletas.length===0&&<span style={{fontSize:"11px",color:D.muted,marginTop:"4px"}}>Selecciona una o más familias cromáticas.</span>}
                      </Sub>

                      {/* C — intensidad */}
                      <Sub label="C. Intensidad de integración" sc={SC.pal}>
                        {PAL_INTENS.map(o=><Chip key={o.v} label={o.l} active={s.pal.intens===o.v} sc={SC.pal} onClick={()=>updPal("intens",o.v)} sm/>)}
                        <span style={{fontSize:"11px",color:D.muted,width:"100%",marginTop:"3px"}}>Por defecto: Sutil. Nunca convierte la escena en monotemática.</span>
                      </Sub>

                      {/* D — dónde aplicar */}
                      <Sub label="D. Dónde aplicar los colores guía (selección múltiple)" sc={SC.pal}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",width:"100%"}}>
                          {PAL_DONDE.map(o=>(
                            <MultiChip key={o.v} label={o.l} active={s.pal.donde.includes(o.v)} sc={SC.pal} onClick={()=>toggleDonde(o.v)}/>
                          ))}
                        </div>
                        {s.pal.donde.length===0&&<span style={{fontSize:"11px",color:D.muted,marginTop:"4px"}}>Sin selección → la app elige automáticamente y varía entre generaciones.</span>}
                      </Sub>

                      {/* E — modo */}
                      <Sub label="E. Modo de integración" sc={SC.pal}>
                        {PAL_MODE.map(o=><Chip key={o.v} label={o.l} active={s.pal.mode===o.v} sc={SC.pal} onClick={()=>updPal("mode",o.v)} sm/>)}
                        <p style={{fontSize:"11px",color:D.muted,width:"100%",marginTop:"4px",lineHeight:1.5}}>
                          {s.pal.mode==="auto"&&"La app decide en qué accesorios introducir los toques de color y varía entre generaciones."}
                          {s.pal.mode==="guided"&&"Respeta tu selección de accesorios en 'Dónde aplicar'; el resto varía automáticamente."}
                          {s.pal.mode==="manual"&&"Respeta exactamente tus selecciones de familia, dónde aplicar e intensidad."}
                        </p>
                      </Sub>

                      {/* preview visual */}
                      {s.pal.paletas.filter(v=>v!=="sin_color").length>0&&(
                        <div style={{marginTop:"8px",padding:"10px 14px",background:SC.pal.p,borderRadius:"10px",border:`1px solid ${SC.pal.e}`}}>
                          <p style={{fontSize:"11px",color:SC.pal.k,fontWeight:600,marginBottom:"6px"}}>Vista previa de la paleta seleccionada</p>
                          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",alignItems:"center"}}>
                            {s.pal.paletas.filter(v=>v!=="sin_color").map(v=>{
                              const opt=PAL_PALETAS.find(p=>p.v===v);
                              return opt?(
                                <div key={v} style={{display:"flex",alignItems:"center",gap:"5px"}}>
                                  <div style={{width:"14px",height:"14px",borderRadius:"50%",background:opt.dot,border:"1.5px solid rgba(0,0,0,.12)"}}/>
                                  <span style={{fontSize:"11px",color:D.ink,fontWeight:500}}>{opt.l}</span>
                                </div>
                              ):null;
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </AccordionBlock>

                <div style={{marginBottom:"16px"}}>
                  <p style={{fontSize:"11.5px",color:D.muted,fontWeight:700,marginBottom:"7px",textTransform:"uppercase",letterSpacing:".5px"}}>Idioma</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                    {LANG_OPS.map(o=>(
                      <Chip key={o.v} label={o.l} active={s.lang===o.v} sc={SC.adv} onClick={()=>upd("lang",o.v)} sm/>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:"12px"}}>
                  <p style={{fontSize:"11.5px",color:D.muted,fontWeight:700,marginBottom:"7px",textTransform:"uppercase",letterSpacing:".5px"}}>Negative prompt</p>
                  <div style={{background:D.surface,border:`1px solid ${D.border}`,borderRadius:"12px",padding:"12px",fontSize:"11.5px",lineHeight:1.7,color:D.muted}}>
                    {neg}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: output ────────────────────────────── */}
        <div style={{width:"360px",flexShrink:0,background:D.panel,display:"flex",flexDirection:"column",borderLeft:`1px solid ${D.border}`,overflow:"hidden"}}>

          {/* head */}
          <div style={{background:D.surface,borderBottom:`1px solid ${D.border}`,padding:"16px 20px 14px",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:"10px"}}>
              <span style={{fontFamily:FH,fontSize:"20px",fontWeight:700,color:D.ink}}>Prompt</span>
              <span style={{fontSize:"10px",fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:".8px"}}>{s.lang==="es"?"Español":"English"}</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              <PillBadge sc={SC.tipo} label={PRESENTACIONES.find(t=>t.v===s.tipo)?.l||"—"}/>
              <PillBadge sc={SC.tam}  label={`${tam.l} · ${tam.ratio}`}/>
              <PillBadge sc={SC.estilo} label={ESTILOS.find(e=>e.v===s.estilo)?.l||"—"}/>
              <PillBadge sc={SC.espacio} label={ESPACIOS.find(e=>e.v===s.espacio)?.l||"—"}/>
              <PillBadge sc={SC.pers} label={peopleSummary}/>
              {s.marco   &&<PillBadge sc={SC.cal}    label="Marco roble"/>}
              {s.cristal &&<PillBadge sc={SC.cal} label="Cristal real"/>}
              {s.pal.active&&s.pal.paletas.filter(v=>v!=="sin_color").length>0&&(
                <div style={{display:"flex",alignItems:"center",gap:"4px",background:SC.pal.p,border:`1px solid ${SC.pal.e}`,padding:"2px 9px 2px 6px",borderRadius:"999px"}}>
                  {s.pal.paletas.filter(v=>v!=="sin_color").slice(0,3).map(v=>{
                    const opt=PAL_PALETAS.find(p=>p.v===v);
                    return opt?<div key={v} style={{width:"8px",height:"8px",borderRadius:"50%",background:opt.dot}}/>:null;
                  })}
                  <span style={{fontSize:"11px",color:SC.pal.k,fontWeight:500,fontFamily:FB}}>Paleta</span>
                </div>
              )}
            </div>
          </div>

          {/* warnings */}
          {warnings.length>0&&(
            <div style={{background:"#FFFBEB",borderBottom:"1px solid #FDE68A",padding:"10px 16px",flexShrink:0}}>
              {warnings.map((w,i)=>(
                <div key={i} style={{fontSize:"12px",color:"#92400E",lineHeight:1.6,display:"flex",gap:"6px",marginBottom:i<warnings.length-1?"6px":0}}>
                  <span style={{flexShrink:0}}>⚠</span><span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* variación */}
          <div style={{padding:"9px 16px",borderBottom:`1px solid ${D.border}`,flexShrink:0,background:D.surface,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:"11px",color:D.muted,fontWeight:500}}>Var. #{seed} · {variationLabel}</span>
            <button onClick={regenerate} style={{background:D.bg,color:SC.tipo.k,border:`1px solid ${SC.tipo.e}`,borderRadius:"8px",padding:"4px 12px",fontSize:"11.5px",fontWeight:600,outline:"none",transition:"all .13s"}}>
              ↻ Regenerar variación
            </button>
          </div>

          {/* prompt text */}
          <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
            <div style={{background:D.surface,borderRadius:"12px",border:`1px solid ${D.border}`,padding:"15px",lineHeight:1.85,fontSize:"12.5px",color:D.ink,boxShadow:"inset 0 1px 3px rgba(28,25,21,.04)",marginBottom:"8px"}}>
              {prompt}
            </div>
            <div style={{fontSize:"11px",color:D.muted,textAlign:"right",marginBottom:"14px"}}>{prompt.length} chars</div>

            <button onClick={()=>setShowShort(!showShort)} style={{display:"flex",alignItems:"center",gap:"6px",background:"transparent",border:"none",color:D.muted,fontSize:"12px",fontWeight:500,outline:"none",marginBottom:"6px"}}>
              <span style={{fontSize:"10px",display:"inline-block",transform:showShort?"rotate(90deg)":"none",transition:"transform .15s"}}>▶</span>
              Prompt corto
            </button>
            {showShort&&<div style={{background:D.surface,borderRadius:"10px",border:`1px solid ${D.border}`,padding:"12px",fontSize:"12px",color:D.ink,lineHeight:1.75,marginBottom:"12px"}}>{sht}</div>}

            <button onClick={()=>setShowNeg(!showNeg)} style={{display:"flex",alignItems:"center",gap:"6px",background:"transparent",border:"none",color:D.muted,fontSize:"12px",fontWeight:500,outline:"none",marginBottom:"6px"}}>
              <span style={{fontSize:"10px",display:"inline-block",transform:showNeg?"rotate(90deg)":"none",transition:"transform .15s"}}>▶</span>
              Negative prompt
            </button>
            {showNeg&&<div style={{background:D.surface,borderRadius:"10px",border:`1px solid ${D.border}`,padding:"12px",fontSize:"12px",color:D.muted,lineHeight:1.75,marginBottom:"12px"}}>{neg}</div>}
          </div>

          {/* actions */}
          <div style={{padding:"12px 16px 18px",borderTop:`1px solid ${D.border}`,background:D.surface,flexShrink:0,display:"flex",flexDirection:"column",gap:"7px"}}>
            <button onClick={()=>copy(prompt,"main")} style={{background:copied==="main"?"#3D7A55":D.ink,color:"#fff",border:"none",borderRadius:"10px",padding:"12px",fontSize:"13.5px",fontWeight:700,outline:"none",transition:"all .18s",boxShadow:copied==="main"?"0 4px 14px rgba(61,122,85,.35)":"0 2px 8px rgba(28,25,21,.15)"}}>
              {copied==="main"?"✓  Copiado":"Copiar prompt"}
            </button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
              <button onClick={()=>copy(sht,"short")} style={{background:D.bg,color:D.muted,border:`1px solid ${D.border}`,borderRadius:"8px",padding:"8px",fontSize:"12px",fontWeight:500,outline:"none"}}>
                {copied==="short"?"✓ Copiado":"Copiar corto"}
              </button>
              <button onClick={()=>copy(neg,"neg")} style={{background:D.bg,color:D.muted,border:`1px solid ${D.border}`,borderRadius:"8px",padding:"8px",fontSize:"12px",fontWeight:500,outline:"none"}}>
                {copied==="neg"?"✓ Copiado":"Copiar negative"}
              </button>
            </div>
            <button onClick={()=>{setS(cloneState(DEFAULT));setAp(null);setShowAdv(false);setShowMob(false);setShowPal(false);setSeed(0);}} style={{background:"transparent",color:D.muted,border:`1px solid ${D.border}`,borderRadius:"8px",padding:"7px",fontSize:"11.5px",outline:"none"}}>
              Restablecer todo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
