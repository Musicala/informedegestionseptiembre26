/**
 * ============================================================
 *  INFORME MENSUAL – MUSICALA / GMMMC
 *  script.js – Renderizado dinámico desde informe-data.js
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof INFORME_DATA === 'undefined') {
    console.error('INFORME_DATA no está definido. Verifica que data/informe-data.js esté incluido.');
    return;
  }
  renderInforme(INFORME_DATA);
});

// ──────────────────────────────────────────────────────────────
// INTEGRIDAD DE TEXTO EN PANTALLA E IMPRESIÓN
// ──────────────────────────────────────────────────────────────
// Los informes se abren tanto en Hosting como directamente desde una carpeta.
// Se normaliza el texto a Unicode NFC y se corrigen los casos frecuentes de
// UTF-8 interpretado como Windows-1252 para que tildes, eñes y signos en
// español lleguen bien al diálogo de impresión y al PDF.
const REPARACIONES_CODIFICACION = {
  'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
  'Ã': 'Á', 'Ã‰': 'É', 'Ã': 'Í', 'Ã“': 'Ó', 'Ãš': 'Ú',
  'Ã±': 'ñ', 'Ã‘': 'Ñ', 'Ã¼': 'ü', 'Ãœ': 'Ü',
  'Â¿': '¿', 'Â¡': '¡', 'Âº': 'º', 'Âª': 'ª',
  'â€“': '–', 'â€”': '—', 'â€œ': '“', 'â€': '”', 'â€˜': '‘', 'â€™': '’', 'â€¦': '…'
};

function normalizarTextoEspanol(valor) {
  if (typeof valor !== 'string') return valor;
  const normalizado = valor.normalize('NFC');
  return normalizado.replace(/Ã.|Â.|â€./g, (fragmento) => REPARACIONES_CODIFICACION[fragmento] || fragmento);
}

function prepararTextoParaImpresion() {
  document.documentElement.lang = 'es';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodos = [];
  while (walker.nextNode()) nodos.push(walker.currentNode);
  nodos.forEach((nodo) => {
    const corregido = normalizarTextoEspanol(nodo.nodeValue);
    if (corregido !== nodo.nodeValue) nodo.nodeValue = corregido;
  });
  document.querySelectorAll('input, textarea').forEach((campo) => {
    const corregido = normalizarTextoEspanol(campo.value);
    if (corregido !== campo.value) campo.value = corregido;
  });
}

window.addEventListener('beforeprint', prepararTextoParaImpresion);
window.imprimirInforme = function () {
  prepararTextoParaImpresion();
  window.print();
};

// ──────────────────────────────────────────────────────────────
// RENDER PRINCIPAL
// ──────────────────────────────────────────────────────────────
function renderInforme(d) {
  renderMeta(d);
  renderHeader(d);
  renderPortada(d);
  renderResumen(d);
  renderIndicadores(d);
  renderDesarrolloPedagogico(d);
  renderAreaCards(d);
  renderAvancesRetos(d);
  renderNovedades(d);
  renderHorarios(d);
  renderTablero(d);
  renderEvidencias(d);
  renderRecomendaciones(d);
  renderComentarios(d);
  renderFirmas(d);
  setupPrintBtn(d);
}

// ──────────────────────────────────────────────────────────────
// META DEL DOCUMENTO
// ──────────────────────────────────────────────────────────────
function renderMeta(d) {
  document.title = `Informe ${d.mes} ${d.anio} – ${d.institucion} | Musicala`;
}

// ──────────────────────────────────────────────────────────────
// HEADER INSTITUCIONAL
// ──────────────────────────────────────────────────────────────
function renderHeader(d) {
  const el = document.getElementById('header-info');
  if (!el) return;
  el.innerHTML = `
    <span class="badge badge-purple">${d.proyecto}</span>
    <span class="badge badge-soft">${d.periodo}</span>
    <span class="badge badge-areas">${d.areas.join(' &amp; ')}</span>
  `;
}

// ──────────────────────────────────────────────────────────────
// PORTADA EJECUTIVA
// ──────────────────────────────────────────────────────────────
function renderPortada(d) {
  const el = document.getElementById('portada');
  if (!el) return;
  el.innerHTML = `
    <div class="portada-mes">${d.mes}</div>
    <div class="portada-anio">${d.anio}</div>
    <div class="portada-info">
      <div class="portada-tag">
        <span class="label">Institución</span>
        <span class="value">${d.institucion}</span>
      </div>
      <div class="portada-tag">
        <span class="label">Áreas</span>
        <span class="value">${d.areas.join(', ')}</span>
      </div>
      <div class="portada-tag">
        <span class="label">Fase</span>
        <span class="value">${d.fase}</span>
      </div>
      <div class="portada-tag">
        <span class="label">Responsable</span>
        <span class="value">${d.responsable}</span>
      </div>
      ${d.coordinador ? `<div class="portada-tag"><span class="label">Coordinador/a</span><span class="value">${d.coordinador}</span></div>` : ''}
    </div>
  `;
}

// ──────────────────────────────────────────────────────────────
// RESUMEN EJECUTIVO
// ──────────────────────────────────────────────────────────────
function renderResumen(d) {
  const el = document.getElementById('resumen-texto');
  if (!el) return;
  if (d.resumenEjecutivo) {
    el.textContent = d.resumenEjecutivo;
  } else {
    el.innerHTML = '<em class="placeholder">Resumen ejecutivo pendiente.</em>';
  }
}

// ──────────────────────────────────────────────────────────────
// INDICADORES PRINCIPALES
// ──────────────────────────────────────────────────────────────
function renderIndicadores(d) {
  const ind = d.indicadores;
  const grid = document.getElementById('indicadores-grid');
  if (!grid) return;

  const pct = parseFloat(ind.cumplimiento);
  const tienePorcentajeCumplimiento = Number.isFinite(pct);
  const colorClass = !tienePorcentajeCumplimiento ? 'neutral' : pct >= 90 ? 'green' : pct >= 70 ? 'yellow' : 'red';

  const cards = [
    {
      valor: ind.sesionesRealizadas,
      etiqueta: ind.etiquetaSesiones || `Sesiones realizadas (${d.mes?.toLowerCase() || 'periodo'})`,
      icono: '✅',
      tipo: 'success'
    },
    ...(tienePorcentajeCumplimiento ? [{
      valor: ind.cumplimiento,
      etiqueta: 'Cumplimiento',
      icono: '📊',
      tipo: colorClass,
      barra: true,
      pct
    }] : []),
    ...(ind.horasRealizadas ? [{
      valor: ind.horasProgramadas ? `${ind.horasRealizadas}/${ind.horasProgramadas}h` : `${ind.horasRealizadas}h`,
      etiqueta: ind.horasProgramadas ? 'Horas realizadas' : 'Horas de formación (2 h por sesión)',
      icono: '⏱',
      tipo: 'neutral'
    }] : []),
    ...(ind.puntualidadDocentes ? [{
      valor: ind.puntualidadDocentes,
      etiqueta: `Puntualidad docente (${ind.registrosPuntualidad || 25} registros)`,
      icono: '🕘',
      tipo: 'success'
    }] : []),
    ...(typeof ind.cambiosDocente !== 'undefined' ? [{
      valor: ind.cambiosDocente,
      etiqueta: 'Cambio de docente (Danzas)',
      icono: '🔄',
      tipo: 'info'
    }] : [])
  ];

  grid.innerHTML = cards.map(c => `
    <div class="indicador-card indicador-${c.tipo}">
      <div class="indicador-icono">${c.icono}</div>
      <div class="indicador-valor">${c.valor}</div>
      <div class="indicador-etiqueta">${c.etiqueta}</div>
      ${c.barra && tienePorcentajeCumplimiento ? `
        <div class="barra-wrap">
          <div class="barra-fill barra-${c.tipo}" style="width:${Math.min(c.pct,100)}%"></div>
        </div>` : ''}
    </div>
  `).join('');

  const contexto = document.getElementById('indicadores-contexto');
  if (contexto) {
    const notas = Array.isArray(ind.notas) ? ind.notas : [];
    contexto.innerHTML = notas.length ? `
      <div class="indicadores-contexto-titulo">Cómo leer estos datos</div>
      <div class="indicadores-notas">
        ${notas.map(nota => `
          <article class="indicadores-nota">
            <h3>${nota.titulo}</h3>
            <p>${nota.texto}</p>
          </article>`).join('')}
      </div>` : '';
  }
}

// ──────────────────────────────────────────────────────────────
// DESARROLLO PEDAGÓGICO
// ──────────────────────────────────────────────────────────────
function renderDesarrolloPedagogico(d) {
  // Fases del proceso (lista visual)
  const fasesEl = document.getElementById('fase-actual');
  if (fasesEl) {
    fasesEl.innerHTML = `
      <div class="fase-badge">
        <span class="fase-icono">🎯</span>
        <span>${d.fase}</span>
      </div>
    `;
  }
}

// ──────────────────────────────────────────────────────────────
// CARDS POR ÁREA
// ──────────────────────────────────────────────────────────────
function renderAreaCards(d) {
  const container = document.getElementById('areas-container');
  if (!container) return;

  container.innerHTML = d.procesosPorArea.map(area => {
    const pct = parseFloat(area.cumplimiento);
    const colorClass = !Number.isFinite(pct) ? 'neutral' : pct >= 90 ? 'green' : pct >= 70 ? 'yellow' : 'red';
    const accentStyle = area.color ? `--area-accent: ${area.color};` : '';

    return `
    <div class="area-card" style="${accentStyle}">
      <div class="area-card-header">
        <span class="area-icono">${area.icono || '🎭'}</span>
        <div>
          <h3 class="area-titulo">${area.area}</h3>
          <p class="area-descripcion">${area.descripcion}</p>
        </div>
      </div>

      <div class="area-stats">
        <div class="area-stat">
          <span class="stat-num">${area.sesionesRealizadas}</span>
          <span class="stat-lbl">${!Number.isFinite(Number(area.sesionesProgramadas)) || Number(area.sesionesProgramadas) <= 0 ? 'sesiones realizadas' : `de ${area.sesionesProgramadas} sesiones`}</span>
        </div>
        <div class="area-stat">
          <span class="stat-num">${area.participantes || '–'}</span>
          <span class="stat-lbl">${area.etiquetaParticipantes || 'participantes'}</span>
        </div>
        ${Number.isFinite(pct) ? `
          <div class="area-stat cumplimiento-stat cumplimiento-${colorClass}">
            <span class="stat-num">${area.cumplimiento}</span>
            <span class="stat-lbl">cumplimiento</span>
          </div>` : ''}
      </div>

      <div class="area-listas">
        ${area.avances && area.avances.length ? `
          <div class="area-lista">
            <h4 class="lista-titulo lista-avances">✦ Avances</h4>
            <ul>${area.avances.map(a => `<li>${a}</li>`).join('')}</ul>
          </div>` : ''}

        ${area.retos && area.retos.length ? `
          <div class="area-lista">
            <h4 class="lista-titulo lista-retos">▲ Retos</h4>
            <ul>${area.retos.map(r => `<li>${r}</li>`).join('')}</ul>
          </div>` : ''}
      </div>

      ${area.proyeccion ? `
        <div class="area-proyeccion">
          <span class="proyeccion-label">Proyección para el siguiente mes:</span>
          <span>${area.proyeccion}</span>
        </div>` : ''}
    </div>
    `;
  }).join('');
}

// ──────────────────────────────────────────────────────────────
// AVANCES Y RETOS GENERALES
// ──────────────────────────────────────────────────────────────
function renderAvancesRetos(d) {
  const avEl = document.getElementById('avances-lista');
  const retEl = document.getElementById('retos-lista');

  if (avEl && d.avances && d.avances.length) {
    avEl.innerHTML = d.avances.map(a => `
      <li class="item-avance">
        <span class="item-dot avance-dot">✦</span>
        <span>${a}</span>
      </li>`).join('');
  }

  if (retEl && d.retos && d.retos.length) {
    retEl.innerHTML = d.retos.map(r => `
      <li class="item-reto">
        <span class="item-dot reto-dot">▲</span>
        <span>${r}</span>
      </li>`).join('');
  }
}

// ──────────────────────────────────────────────────────────────
// NOVEDADES
// ──────────────────────────────────────────────────────────────
function renderNovedades(d) {
  const el = document.getElementById('novedades-lista');
  if (!el) return;
  if (!d.novedades || !d.novedades.length) {
    el.innerHTML = '<li class="placeholder">Sin novedades este mes.</li>';
    return;
  }
  el.innerHTML = d.novedades.map(n => `
    <li class="novedad-item">
      <span class="novedad-dot">◆</span>
      <span>${n}</span>
    </li>`).join('');
}

// ──────────────────────────────────────────────────────────────
// CUMPLIMIENTO DE HORARIOS
// ──────────────────────────────────────────────────────────────
function renderHorarios(d) {
  const el = document.getElementById('horarios-contenido');
  if (!el || !d.cumplimientoHorarios) return;
  const h = d.cumplimientoHorarios;
  el.innerHTML = `
    <p class="horarios-desc">${h.descripcion || ''}</p>
    ${h.porcentajeAsistenciaDocentes ? `
      <div class="horarios-stat">
        <span class="horarios-pct">${h.porcentajeAsistenciaDocentes}</span>
        <span class="horarios-lbl">asistencia del equipo docente</span>
      </div>` : ''}
    ${h.observaciones ? `<p class="horarios-obs"><strong>Nota:</strong> ${h.observaciones}</p>` : ''}
  `;
}

// ──────────────────────────────────────────────────────────────
// TABLERO EXTERNO (IFRAME)
// ──────────────────────────────────────────────────────────────
function renderTablero(d) {
  const seccion = document.getElementById('seccion-tablero');
  if (!seccion) return;
  if (!d.tableroUrl) {
    seccion.style.display = 'none';
    return;
  }
  seccion.style.display = '';
  const iframe = document.getElementById('tablero-iframe');
  const titulo = document.getElementById('tablero-titulo');
  if (iframe) iframe.src = d.tableroUrl;
  if (titulo) titulo.textContent = d.tableroTitulo || 'Tablero de seguimiento';
}

// ──────────────────────────────────────────────────────────────
// EVIDENCIAS
// ──────────────────────────────────────────────────────────────
function renderEvidencias(d) {
  const grid = document.getElementById('evidencias-grid');
  if (!grid) return;
  if (!d.evidencias || !d.evidencias.length) {
    grid.innerHTML = '<p class="placeholder">Sin evidencias registradas.</p>';
    return;
  }

  const iconosTipo = {
    registro: '📄',
    galería: '🖼',
    asistencia: '📋',
    tablero: '📊',
    carpeta: '📁',
    anexo: '📎'
  };
  const estadoClass = {
    'Disponible': 'estado-ok',
    'En proceso': 'estado-proceso',
    'Pendiente': 'estado-pendiente'
  };

  grid.innerHTML = d.evidencias.map(ev => {
    const icono = iconosTipo[ev.tipo] || '📄';
    const clase = estadoClass[ev.estado] || 'estado-pendiente';
    const tieneUrl = ev.url && ev.url.trim() !== '';
    const esGaleria = ev.fuente === 'fotos' || ev.tipo === 'galeria' || ev.tipo === 'galería';

    let accion;
    if (ev.fuente) {
      // Abre el modal con login y carga la info desde Firebase (no se imprime).
      const texto = esGaleria ? 'Ver galería →' : 'Ver registros →';
      accion = `<button type="button" class="evidencia-link evidencia-galeria-btn" onclick="abrirEvidencia('${ev.fuente}')">${texto}</button>`;
    } else if (tieneUrl) {
      accion = `<a href="${ev.url}" target="_blank" rel="noopener" class="evidencia-link">Haz clic para verlos →</a>`;
    } else {
      accion = '';
    }

    return `
    <div class="evidencia-card">
      <div class="evidencia-icono">${icono}</div>
      <div class="evidencia-info">
        <div class="evidencia-nombre">${ev.nombre}</div>
        ${ev.descripcion ? `<div class="evidencia-desc">${ev.descripcion}</div>` : ''}
        <div class="evidencia-footer">
          <span class="estado-badge ${clase}">${ev.estado}</span>
          ${accion}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ──────────────────────────────────────────────────────────────
// RECOMENDACIONES
// ──────────────────────────────────────────────────────────────
function renderRecomendaciones(d) {
  const el = document.getElementById('recomendaciones-lista');
  if (!el) return;
  if (!d.recomendaciones || !d.recomendaciones.length) {
    el.innerHTML = '<li class="placeholder">Sin recomendaciones registradas.</li>';
    return;
  }
  el.innerHTML = d.recomendaciones.map((r, i) => `
    <li class="recomendacion-item">
      <span class="rec-num">${String(i + 1).padStart(2, '0')}</span>
      <span>${r}</span>
    </li>`).join('');
}

// ──────────────────────────────────────────────────────────────
// COMENTARIOS FINALES
// ──────────────────────────────────────────────────────────────
function renderComentarios(d) {
  const el = document.getElementById('comentarios-texto');
  if (!el) return;
  if (d.comentariosFinales) {
    el.textContent = d.comentariosFinales;
  } else {
    el.innerHTML = '<em class="placeholder">Sin comentarios finales.</em>';
  }
}

// ──────────────────────────────────────────────────────────────
// FIRMAS
// ──────────────────────────────────────────────────────────────
function renderFirmas(d) {
  const grid = document.getElementById('firmas-grid');
  if (!grid) return;
  const izquierda = (d.firmas && d.firmas[0]) ? d.firmas[0] : {};
  const derecha = (d.firmas && d.firmas[3]) ? d.firmas[3] : {};

  grid.innerHTML = `
    <div class="aprobacion-fsa-wrap">
      <table class="tabla-aprobacion-fsa">
        <tr>
          <th rowspan="3">APROBADO</th>
          <td><label><input type="radio" name="aprobacion_fsa" value="si"> Sí</label></td>
        </tr>
        <tr>
          <td>
            <label><input type="radio" name="aprobacion_fsa" value="si_recomendaciones"> Sí con recomendaciones</label>
            <textarea id="recomendaciones-fsa" class="recomendaciones-fsa-input" placeholder="Escribe aquí las recomendaciones..."></textarea>
          </td>
        </tr>
        <tr>
          <td><label><input type="radio" name="aprobacion_fsa" value="no"> No</label></td>
        </tr>
      </table>

      <div class="firmas-plantilla-fsa">
        <div class="firma-box-fsa">
          <div class="firma-titulo-fsa">Firma</div>
          <div class="firma-espacio-fsa"></div>
          <div class="firma-footer-fsa">
            <div class="fila-fsa"><span class="lbl-fsa">NOMBRE DEL COORDINADOR O LÍDER DEL PROYECTO:</span> <input type="text" class="fsa-inline-input" value="${izquierda.nombre || ''}" placeholder="Nombres y apellidos"></div>
            <div class="fila-fsa"><span class="lbl-fsa">PROYECTO:</span> ${d.proyecto || '________________________'}</div>
            <div class="fila-fsa"><span class="lbl-fsa">FECHA:</span> <input type="text" class="fsa-inline-input fsa-inline-date" value="${izquierda.fecha || ''}" placeholder="dd/mm/aaaa"></div>
          </div>
        </div>

        <div class="firma-box-fsa">
          <div class="firma-titulo-fsa">Firma</div>
          <div class="firma-espacio-fsa"></div>
          <div class="firma-footer-fsa">
            <div class="fila-fsa"><span class="lbl-fsa">NOMBRE DEL COORDINADOR GENERAL DE PROGRAMAS Y PROYECTOS:</span> <input type="text" class="fsa-inline-input" value="${derecha.nombre || ''}" placeholder="Nombres y apellidos"></div>
            <div class="fila-fsa"><span class="lbl-fsa">FECHA:</span> <input type="text" class="fsa-inline-input fsa-inline-date" value="${derecha.fecha || ''}" placeholder="dd/mm/aaaa"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const radios = grid.querySelectorAll('input[name="aprobacion_fsa"]');
  const recomendaciones = grid.querySelector('#recomendaciones-fsa');
  if (recomendaciones) {
    recomendaciones.style.display = 'none';
    radios.forEach((radio) => {
      radio.addEventListener('change', () => {
        recomendaciones.style.display = radio.value === 'si_recomendaciones' && radio.checked ? 'block' : 'none';
      });
    });
  }
}

// ──────────────────────────────────────────────────────────────
// BOTÓN IMPRIMIR + CHECKLIST
// ──────────────────────────────────────────────────────────────
function setupPrintBtn(d) {
  const btn = document.getElementById('btn-imprimir');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const checklist = verificarChecklist(d);
    const panel = document.getElementById('checklist-panel');
    if (!panel) { window.imprimirInforme(); return; }

    if (checklist.faltantes.length === 0) {
      panel.innerHTML = `
        <div class="checklist-ok">
          <span class="check-icono">✅</span>
          <strong>Informe listo para descargar.</strong>
          <p>Todos los campos requeridos están completos.</p>
          <div class="check-actions">
            <button class="btn-print-confirm" onclick="window.imprimirInforme()">Imprimir / Exportar PDF</button>
            <button class="btn-check-cerrar" onclick="cerrarChecklist()">Cancelar</button>
          </div>
        </div>`;
    } else {
      panel.innerHTML = `
        <div class="checklist-warn">
          <span class="check-icono">⚠️</span>
          <strong>Faltan los siguientes campos:</strong>
          <ul>${checklist.faltantes.map(f => `<li>${f}</li>`).join('')}</ul>
          <p class="check-nota">Puedes imprimir de todos modos, pero se recomienda completar el informe antes.</p>
          <div class="check-actions">
            <button class="btn-print-confirm" onclick="window.imprimirInforme()">Imprimir de todas formas</button>
            <button class="btn-check-cerrar" onclick="cerrarChecklist()">Volver</button>
          </div>
        </div>`;
    }
    panel.classList.add('visible');
  });
}

function verificarChecklist(d) {
  const faltantes = [];
  if (!d.mes) faltantes.push('Mes');
  if (!d.periodo) faltantes.push('Periodo reportado');
  if (!d.resumenEjecutivo) faltantes.push('Resumen ejecutivo');
  if (!d.indicadores || !d.indicadores.cumplimiento) faltantes.push('Indicadores');
  if (!d.recomendaciones || !d.recomendaciones.length) faltantes.push('Recomendaciones');
  if (!d.evidencias || !d.evidencias.length) faltantes.push('Evidencias');
  const firmasSinNombre = d.firmas ? d.firmas.filter(f => !f.nombre || f.nombre.trim() === '') : [];
  if (firmasSinNombre.length > 0) faltantes.push(`Firmas (${firmasSinNombre.length} sin nombre)`);
  return { ok: faltantes.length === 0, faltantes };
}

// Exponer globalmente para los onclick del checklist
window.cerrarChecklist = function () {
  const panel = document.getElementById('checklist-panel');
  if (panel) panel.classList.remove('visible');
};
