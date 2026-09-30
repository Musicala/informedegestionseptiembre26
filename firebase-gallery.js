/**
 * ============================================================
 *  INFORME MENSUAL – MUSICALA / GMMMC
 *  firebase-gallery.js
 *  --------------------------------------------------------
 *  Conecta el informe al proyecto Firebase "db-musicala-fsa"
 *  y muestra las fotos del mes (coleccion galleryImages),
 *  protegidas detras de inicio de sesion con Google.
 *
 *  Solo los correos autorizados pueden ver las imagenes.
 *  El acceso a los datos esta tambien protegido por las
 *  reglas de seguridad de Firestore (lectura solo con sesion
 *  iniciada).
 * ============================================================
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  getFirestore,
  collection,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

// ──────────────────────────────────────────────────────────
// CONFIGURACION
// ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyCO8QV3OTNLFmaeVjJ7tDDL9vbiEoiIsLk',
  authDomain: 'db-musicala-fsa.firebaseapp.com',
  projectId: 'db-musicala-fsa',
  storageBucket: 'db-musicala-fsa.firebasestorage.app',
  messagingSenderId: '611214393967',
  appId: '1:611214393967:web:6b0eca59b0ced50c78839a'
};

// Correos autorizados para ver las fotos del informe.
// (La lectura de datos tambien la controlan las reglas de Firestore.)
const CORREOS_AUTORIZADOS = [
  'tsocialgs@fundacionsanantonio.org',
  'coordinacionpyp@fundacionsanantonio.org',
  'rectoria@fundacionsanantonio.org',
  'alekcaballeromusic@gmail.com',
  'catalina.medina.leal@gmail.com'
];

// Mes/anio del informe (se toma de INFORME_DATA si existe).
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function periodoInforme() {
  const d = window.INFORME_DATA || {};
  const anio = parseInt(d.anio, 10) || 2026;
  const mesIdx = MESES.indexOf(String(d.mes || '').toLowerCase());
  const meses = Array.isArray(d.meses) && d.meses.length
    ? d.meses.map(Number).filter((mes) => mes >= 1 && mes <= 12)
    : mesIdx >= 0 ? [mesIdx + 1] : [];
  return { anio, meses };
}

// ──────────────────────────────────────────────────────────
// ESTADO
// ──────────────────────────────────────────────────────────
let AUTH = null;
let DB = null;
let GALLERY_CACHE = null;

const barEl = () => document.getElementById('fb-auth-bar');
const galleryEl = () => document.getElementById('fb-gallery');
const modalEl = () => document.getElementById('fotos-modal');

// ──────────────────────────────────────────────────────────
// MODAL (ventana de la galería)
// ──────────────────────────────────────────────────────────
function abrirGaleria() {
  const m = modalEl();
  if (!m) return;
  m.classList.add('abierto');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function cerrarGaleria() {
  const m = modalEl();
  if (!m) return;
  m.classList.remove('abierto');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
// ──────────────────────────────────────────────────────────
// FUENTES (qué carga el modal según la tarjeta)
// ──────────────────────────────────────────────────────────
const FUENTES = {
  fotos:       { titulo: '📸 Galería de fotos del mes',  cargar: () => cargarFotos() },
  asistencias: { titulo: '📋 Planillas de asistencia',   cargar: () => cargarRegistros('attendanceSessions', 'asistencia') },
  puntualidad: { titulo: '⏱ Registros de puntualidad',   cargar: () => cargarRegistros('teacherShifts', 'puntualidad') },
  bitacoras:   { titulo: '📒 Bitácoras docentes',         cargar: () => cargarRegistros('classLogs', 'bitacora') },
  informes:    { titulo: '📄 Informe mensual docente',    cargar: () => cargarRegistros('informesMensuales', 'informe') }
};
let FUENTE_ACTUAL = 'fotos';

function abrirEvidencia(fuente) {
  FUENTE_ACTUAL = FUENTES[fuente] ? fuente : 'fotos';
  const t = document.querySelector('.fotos-modal-title');
  if (t) t.textContent = FUENTES[FUENTE_ACTUAL].titulo;
  limpiarGaleria();
  abrirGaleria();
  // Si ya hay sesión autorizada, carga de inmediato.
  const email = (AUTH && AUTH.currentUser && AUTH.currentUser.email || '').toLowerCase();
  if (email && CORREOS_AUTORIZADOS.includes(email)) renderFuente();
}

function renderFuente() {
  (FUENTES[FUENTE_ACTUAL] || FUENTES.fotos).cargar();
}

// Disponibles para los botones de las tarjetas de evidencias.
window.abrirEvidencia = abrirEvidencia;
window.abrirGaleriaFotos = () => abrirEvidencia('fotos');

function wireModal() {
  const m = modalEl();
  if (!m) return;
  m.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', cerrarGaleria));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && m.classList.contains('abierto')) cerrarGaleria();
  });
}

// ──────────────────────────────────────────────────────────
// ARRANQUE
// ──────────────────────────────────────────────────────────
init();

async function init() {
  if (!barEl()) return;
  wireModal();
  try {
    const app = initializeApp(firebaseConfig);
    AUTH = getAuth(app);
    DB = getFirestore(app);
    await setPersistence(AUTH, browserLocalPersistence).catch(() => {});
    // Por si se uso redireccion en vez de popup.
    getRedirectResult(AUTH).catch(() => {});
    onAuthStateChanged(AUTH, handleAuthChange);
    renderBar({ estado: 'cargando' });
  } catch (err) {
    console.error('Error iniciando Firebase:', err);
    renderBar({ estado: 'error', mensaje: 'No se pudo conectar con Firebase.' });
  }
}

// ──────────────────────────────────────────────────────────
// CAMBIO DE SESION
// ──────────────────────────────────────────────────────────
function handleAuthChange(user) {
  if (!user) {
    renderBar({ estado: 'fuera' });
    limpiarGaleria();
    return;
  }
  const email = (user.email || '').toLowerCase();
  if (!CORREOS_AUTORIZADOS.includes(email)) {
    renderBar({ estado: 'no-autorizado', email });
    limpiarGaleria();
    return;
  }
  renderBar({ estado: 'dentro', email });
  renderFuente();
}

// ──────────────────────────────────────────────────────────
// LOGIN / LOGOUT
// ──────────────────────────────────────────────────────────
async function login() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(AUTH, provider);
  } catch (err) {
    if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') return;
    if (err?.code === 'auth/popup-blocked') {
      await signInWithRedirect(AUTH, provider);
      return;
    }
    if (err?.code === 'auth/unauthorized-domain' || err?.code === 'auth/operation-not-supported-in-this-environment') {
      renderBar({ estado: 'error', mensaje: 'Para iniciar sesión, abre el informe desde el sitio publicado (musicala.github.io), no como archivo local.' });
      return;
    }
    console.error('Error de inicio de sesion:', err);
    renderBar({ estado: 'error', mensaje: 'No se pudo iniciar sesión. Intenta de nuevo.' });
  }
}

async function logout() {
  try { await signOut(AUTH); } catch (_) {}
}

// ──────────────────────────────────────────────────────────
// BARRA DE ACCESO
// ──────────────────────────────────────────────────────────
function renderBar(state) {
  const bar = barEl();
  if (!bar) return;

  if (state.estado === 'cargando') {
    bar.className = 'fb-auth-bar fb-loading';
    bar.innerHTML = `<span class="fb-bar-text">Conectando con Firebase…</span>`;
    return;
  }

  if (state.estado === 'fuera') {
    bar.className = 'fb-auth-bar fb-locked';
    bar.innerHTML = `
      <span class="fb-bar-text">🔒 Las fotos del mes están protegidas. Inicia sesión para verlas.</span>
      <button class="fb-btn fb-btn-login" type="button">Iniciar sesión con Google</button>`;
    bar.querySelector('.fb-btn-login')?.addEventListener('click', login);
    return;
  }

  if (state.estado === 'no-autorizado') {
    bar.className = 'fb-auth-bar fb-denied';
    bar.innerHTML = `
      <span class="fb-bar-text">⚠️ La cuenta <strong>${escapeHtml(state.email)}</strong> no está autorizada para ver las fotos.</span>
      <button class="fb-btn fb-btn-logout" type="button">Cerrar sesión</button>`;
    bar.querySelector('.fb-btn-logout')?.addEventListener('click', logout);
    return;
  }

  if (state.estado === 'dentro') {
    bar.className = 'fb-auth-bar fb-granted';
    bar.innerHTML = `
      <span class="fb-bar-text">✓ Acceso concedido: <strong>${escapeHtml(state.email)}</strong></span>
      <button class="fb-btn fb-btn-logout" type="button">Cerrar sesión</button>`;
    bar.querySelector('.fb-btn-logout')?.addEventListener('click', logout);
    return;
  }

  // error
  bar.className = 'fb-auth-bar fb-error';
  bar.innerHTML = `<span class="fb-bar-text">${escapeHtml(state.mensaje || 'Ocurrió un error.')}</span>`;
}

// ──────────────────────────────────────────────────────────
// GALERIA
// ──────────────────────────────────────────────────────────
function limpiarGaleria() {
  const g = galleryEl();
  if (g) g.innerHTML = '';
}

// Colecciones donde pueden vivir las fotos (igual que el hub).
// galleryImages la puede leer cualquier usuario con sesión; las demás
// solo docentes/admin, por eso cada lectura va en su propio try/catch.
const COLECCIONES_FOTOS = ['galleryImages', 'classLogs', 'diagnosticos', 'proyectos', 'muestrasProceso'];

async function cargarFotos() {
  const g = galleryEl();
  if (!g) return;
  g.innerHTML = `<p class="fb-gallery-msg">Cargando fotos…</p>`;

  try {
    let fotos = GALLERY_CACHE;
    if (!fotos) {
      const resultados = await Promise.all(
        COLECCIONES_FOTOS.map(async (nombre) => {
          try {
            const snap = await getDocs(collection(DB, nombre));
            return snap.docs.flatMap((doc) => fotosDeDoc(doc.id, doc.data()));
          } catch (_) {
            return []; // Sin permiso para esa colección: se ignora.
          }
        })
      );
      // Aplanar y quitar duplicados por URL.
      const porUrl = new Map();
      resultados.flat().forEach((f) => { if (f.url && !porUrl.has(f.url)) porUrl.set(f.url, f); });
      fotos = [...porUrl.values()];
      GALLERY_CACHE = fotos;
    }

    // Filtrar por el mes del informe; si no hay coincidencias, mostrar todas.
    const { anio, meses } = periodoInforme();
    let visibles = fotos;
    if (meses.length) {
      const delMes = fotos.filter((f) => f.anio === anio && meses.includes(f.mes));
      if (delMes.length) visibles = delMes;
    }

    if (!visibles.length) {
      g.innerHTML = `<p class="fb-gallery-msg">Aún no hay fotos cargadas en Firebase para mostrar aquí.</p>`;
      return;
    }

    g.innerHTML = `
      <div class="fb-gallery-grid">
        ${visibles.map((f) => `
          <a class="fb-foto" href="${escapeHtml(f.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(f.titulo)}">
            <img src="${escapeHtml(f.url)}" alt="${escapeHtml(f.titulo)}" loading="lazy" />
            ${f.titulo ? `<span class="fb-foto-cap">${escapeHtml(f.titulo)}</span>` : ''}
          </a>`).join('')}
      </div>
      <p class="fb-gallery-count">${visibles.length} foto${visibles.length === 1 ? '' : 's'} disponible${visibles.length === 1 ? '' : 's'}.</p>`;
  } catch (err) {
    console.error('Error cargando galeria:', err);
    g.innerHTML = `<p class="fb-gallery-msg fb-gallery-error">No se pudieron cargar las fotos. Verifica tu conexión o permisos.</p>`;
  }
}

// Extrae todas las imágenes de un documento (campos sueltos o arrays).
function fotosDeDoc(id, doc) {
  const titulo = String(doc.title || doc.name || doc.sessionName || doc.descripcion || doc.description || '').trim();
  const f = fechaDe(doc.date || doc.sessionDate || doc.createdAt || doc.updatedAt || doc.capturedAt || '');
  const anio = f ? f.getFullYear() : null;
  const mes = f ? f.getMonth() + 1 : null;

  const urls = new Set();
  // Campos de imagen individuales.
  [doc.imageUrl, doc.url, doc.src, doc.image, doc.photoUrl].forEach((v) => {
    const u = limpiarUrl(v);
    if (u && esImagenUrl(u)) urls.add(u);
  });
  // Campos que suelen ser listas de imágenes.
  ['images', 'photos', 'evidenceImages', 'imageUrls', 'imageLinks', 'media', 'gallery', 'attachments', 'evidenceLinks', 'evidenceFiles', 'files'].forEach((campo) => {
    const val = doc[campo];
    if (!Array.isArray(val)) return;
    val.forEach((item) => {
      const u = limpiarUrl(typeof item === 'string' ? item : (item?.url || item?.imageUrl || item?.photoUrl || item?.src || item?.downloadURL || ''));
      if (u && esImagenUrl(u)) urls.add(u);
    });
  });

  return [...urls].map((url, i) => ({ url, titulo, anio, mes, id: `${id}-${i}` }));
}

function limpiarUrl(v) {
  return String(v ?? '').trim();
}

function esImagenUrl(u) {
  const t = u.toLowerCase();
  return /\.(png|jpe?g|webp|gif|avif)(\?|#|$)/.test(t)
    || t.includes('firebasestorage.googleapis.com')
    || t.includes('googleusercontent.com');
}

function fechaDe(valor) {
  if (!valor) return null;
  if (typeof valor === 'object') {
    if (typeof valor.seconds === 'number') return new Date(valor.seconds * 1000);
    if (typeof valor.toDate === 'function') { try { return valor.toDate(); } catch (_) { return null; } }
    return null;
  }
  const d = new Date(valor);
  return isNaN(d.getTime()) ? null : d;
}

// ──────────────────────────────────────────────────────────
// REGISTROS (asistencias, puntualidad, bitácoras, informes)
// ──────────────────────────────────────────────────────────
const REGISTROS_CACHE = {};

async function cargarRegistros(coleccion, tipo) {
  const g = galleryEl();
  if (!g) return;
  g.innerHTML = `<p class="fb-gallery-msg">Cargando registros…</p>`;

  let items;
  try {
    items = REGISTROS_CACHE[coleccion];
    if (!items) {
      const snap = await getDocs(collection(DB, coleccion));
      items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      REGISTROS_CACHE[coleccion] = items;
    }
  } catch (err) {
    g.innerHTML = `<p class="fb-gallery-msg fb-gallery-error">No tienes permisos para ver estos registros en Firebase, o no hay datos disponibles. (Solo coordinación o docentes con acceso al área pueden consultarlos.)</p>`;
    return;
  }

  // Filtrar por el mes del informe; si no hay coincidencias, mostrar todos.
  const { anio, meses } = periodoInforme();
  let visibles = items;
  if (meses.length) {
    const delMes = items.filter((it) => coincideMes(it, anio, meses, tipo));
    if (delMes.length) visibles = delMes;
  }

  if (!visibles.length) {
    g.innerHTML = `<p class="fb-gallery-msg">No hay registros para mostrar aquí.</p>`;
    return;
  }

  g.innerHTML = `
    <div class="fb-registros">
      ${visibles.map((it) => renderRegistro(it, tipo)).join('')}
    </div>
    <p class="fb-gallery-count">${visibles.length} registro${visibles.length === 1 ? '' : 's'}.</p>`;
}

function coincideMes(it, anio, meses, tipo) {
  if (tipo === 'informe') {
    const y = Number(it.year) || Number(String(it.periodKey || it.period || '').split('-')[0]) || null;
    const mo = Number(it.monthNumber || it.monthIndex || it.month) ||
      Number(String(it.periodKey || it.period || '').split('-')[1]) || null;
    if (y && mo) return y === anio && meses.includes(mo);
  }
  const f = fechaDe(it.date || it.sessionDate || it.fecha || it.createdAt || it.updatedAt || '');
  return f ? (f.getFullYear() === anio && meses.includes(f.getMonth() + 1)) : false;
}

function renderRegistro(it, tipo) {
  if (tipo === 'asistencia')  return renderAsistencia(it);
  if (tipo === 'puntualidad') return renderPuntualidad(it);
  if (tipo === 'bitacora')    return renderBitacora(it);
  if (tipo === 'informe')     return renderInforme(it);
  return '';
}

function fila(label, value) {
  const v = textoCampo(value);
  return v ? `<div class="fb-reg-fila"><span class="fb-reg-lbl">${escapeHtml(label)}</span><span class="fb-reg-val">${escapeHtml(v)}</span></div>` : '';
}

function textoCampo(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map(textoCampo).filter(Boolean).join(', ');
  return String(v).trim();
}

function textoFecha(v) {
  const f = fechaDe(v);
  if (!f) return textoCampo(v);
  return f.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
}

function textoHora(v) {
  const f = fechaDe(v);
  if (f) return f.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  return textoCampo(v);
}

function renderAsistencia(it) {
  const titulo = textoCampo(it.sessionName || it.title || it.groupName) || 'Sesión';
  const area = textoCampo(it.area || it.areaId || it.primaryAreaId);
  const entries = it.entries || it.students || it.attendance || it.records || [];
  const filas = (Array.isArray(entries) ? entries : []).map((e) => {
    const nombre = textoCampo(e.studentName || e.fullName || e.name || e.student || e.nombre) || 'Estudiante';
    const estado = textoCampo(e.statusLabel || e.status || e.estado || e.attendanceStatus || e.state);
    return `<li><span>${escapeHtml(nombre)}</span>${estado ? `<span class="fb-reg-pill">${escapeHtml(estado)}</span>` : ''}</li>`;
  }).join('');
  return `
    <article class="fb-reg-card">
      <header class="fb-reg-head">
        <strong>${escapeHtml(titulo)}</strong>
        <span class="fb-reg-meta">${escapeHtml([area, textoFecha(it.date || it.sessionDate || it.createdAt)].filter(Boolean).join(' · '))}</span>
      </header>
      ${filas ? `<ul class="fb-reg-lista">${filas}</ul>` : '<p class="fb-reg-vacio">Sin detalle de estudiantes.</p>'}
      ${fila('Notas', it.notes || it.observaciones)}
    </article>`;
}

function renderPuntualidad(it) {
  const docente = textoCampo(it.teacherName || it.label || it.displayName) || 'Docente';
  return `
    <article class="fb-reg-card">
      <header class="fb-reg-head">
        <strong>${escapeHtml(docente)}</strong>
        <span class="fb-reg-meta">${escapeHtml(textoFecha(it.date || it.createdAt))}</span>
      </header>
      ${fila('Entrada', textoHora(it.checkIn || it.checkin || it.inAt))}
      ${fila('Salida', textoHora(it.checkOut || it.checkout || it.outAt))}
      ${fila('Estado', it.status)}
      ${fila('Correo', it.teacherEmail || it.email)}
    </article>`;
}

function renderBitacora(it) {
  const titulo = textoCampo(it.sessionName || it.title || it.titulo || it.sesion) || 'Bitácora';
  const area = textoCampo(it.area || it.areaId || it.primaryAreaId);
  const docente = textoCampo(it.teacherName || it.docente);
  const imgs = fotosDeDoc(it.id, it).map((f) => f.url);
  return `
    <article class="fb-reg-card">
      <header class="fb-reg-head">
        <strong>${escapeHtml(titulo)}</strong>
        <span class="fb-reg-meta">${escapeHtml([area, docente, textoFecha(it.date || it.fecha || it.createdAt)].filter(Boolean).join(' · '))}</span>
      </header>
      ${fila('Objetivo', it.objective || it.objetivo)}
      ${fila('Actividades', it.activities || it.actividades || it.activity)}
      ${fila('Logros', it.achievements || it.logros || it.avances)}
      ${fila('Retos', it.challenges || it.retos || it.dificultades)}
      ${fila('Seguimiento', it.followUp || it.seguimiento || it.proyeccion)}
      ${fila('Notas', it.notes || it.notas || it.comentarios)}
      ${imgs.length ? `<div class="fb-reg-imgs">${imgs.map((u) => `<a href="${escapeHtml(u)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(u)}" alt="evidencia" loading="lazy"></a>`).join('')}</div>` : ''}
    </article>`;
}

function renderInforme(it) {
  const titulo = textoCampo(it.title) || 'Informe mensual';
  const area = textoCampo(it.areaName || it.area || it.areaId);
  const docente = textoCampo(it.teacherName || it.name);
  return `
    <article class="fb-reg-card">
      <header class="fb-reg-head">
        <strong>${escapeHtml(titulo)}</strong>
        <span class="fb-reg-meta">${escapeHtml([area, docente].filter(Boolean).join(' · '))}</span>
      </header>
      ${fila('Resumen del mes', it.monthlySummary || it.summary)}
      ${fila('Logros principales', it.mainAchievements || it.achievements || it.avances)}
      ${fila('Dificultades', it.difficulties || it.challenges || it.retos)}
      ${fila('Estudiantes destacados', it.relevantStudents)}
      ${fila('Recomendaciones', it.nextMonthRecommendations || it.recommendations || it.recomendaciones)}
      ${fila('Necesidades o alertas', it.needsOrAlerts)}
      ${fila('Comentarios', it.comments || it.observaciones)}
    </article>`;
}

// ──────────────────────────────────────────────────────────
// UTIL
// ──────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
