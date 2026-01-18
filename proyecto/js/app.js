// ============================================
// AGENDA DEPORTIVA Y CULTURAL - FUNCIONALIDAD
// ============================================

// Datos almacenados en localStorage
const DB = {
    participantes: JSON.parse(localStorage.getItem('participantes')) || [
        { id: 1, nombre: 'Juan', apellidoP: 'García', apellidoM: 'López', email: 'juan.garcia@email.com', telefono: '+52 5551234567', nacimiento: '1990-03-15', genero: 'Masculino', colonia: 'Centro' },
        { id: 2, nombre: 'María', apellidoP: 'Rodríguez', apellidoM: 'Sánchez', email: 'maria.rodriguez@email.com', telefono: '+52 5559876543', nacimiento: '1995-07-22', genero: 'Femenino', colonia: 'Sur' },
        { id: 3, nombre: 'Carlos', apellidoP: 'Hernández', apellidoM: 'Martínez', email: 'carlos.hernandez@email.com', telefono: '+52 5552468135', nacimiento: '1988-01-10', genero: 'Masculino', colonia: 'Norte' }
    ],
    eventos: JSON.parse(localStorage.getItem('eventos')) || [
        { id: 1, nombre: 'Torneo de Fútbol Municipal', tipo: 'Deportivo', categoria: 'Fútbol', fecha: '2026-01-15', hora: '09:00', costo: 0, cupo: 150, ubicacion: 'Cancha Municipal' },
        { id: 2, nombre: 'Festival de Danza Folklórica', tipo: 'Cultural', categoria: 'Danza', fecha: '2026-01-18', hora: '18:00', costo: 50, cupo: 300, ubicacion: 'Auditorio Municipal' }
    ],
    inscripciones: JSON.parse(localStorage.getItem('inscripciones')) || [
        { id: 1, folio: 'FOL-2026-0001', idEvento: 1, idParticipante: 1, estado: 'Confirmada', pago: 'Pagado' },
        { id: 2, folio: 'FOL-2026-0002', idEvento: 2, idParticipante: 2, estado: 'Confirmada', pago: 'Pagado' }
    ],
    categorias: JSON.parse(localStorage.getItem('categorias')) || [
        { id: 1, nombre: 'Fútbol', tipo: 'Deportivo', descripcion: 'Torneos de fútbol soccer' },
        { id: 2, nombre: 'Danza', tipo: 'Cultural', descripcion: 'Danza folklórica' }
    ]
};

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('participantes', JSON.stringify(DB.participantes));
    localStorage.setItem('eventos', JSON.stringify(DB.eventos));
    localStorage.setItem('inscripciones', JSON.stringify(DB.inscripciones));
    localStorage.setItem('categorias', JSON.stringify(DB.categorias));
}

// ============================================
// MODALES
// ============================================

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modal al hacer click afuera
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// ============================================
// PARTICIPANTES
// ============================================

function mostrarFormularioParticipante(accion = 'crear', id = null) {
    abrirModal('modalParticipante');
    const form = document.getElementById('formParticipante');
    
    if (accion === 'crear') {
        form.reset();
        document.getElementById('idParticipante').value = '';
        document.querySelector('#modalParticipante h2').textContent = 'Nuevo Participante';
        document.getElementById('btnGuardarParticipante').textContent = 'Registrar Participante';
    } else if (accion === 'editar' && id) {
        const participante = DB.participantes.find(p => p.id === id);
        if (participante) {
            document.getElementById('idParticipante').value = id;
            document.getElementById('nombre').value = participante.nombre;
            document.getElementById('apellidoP').value = participante.apellidoP;
            document.getElementById('apellidoM').value = participante.apellidoM;
            document.getElementById('email').value = participante.email;
            document.getElementById('telefono').value = participante.telefono;
            document.getElementById('nacimiento').value = participante.nacimiento;
            document.getElementById('genero').value = participante.genero;
            document.getElementById('colonia').value = participante.colonia;
            document.querySelector('#modalParticipante h2').textContent = 'Editar Participante';
            document.getElementById('btnGuardarParticipante').textContent = 'Actualizar Participante';
        }
    }
}

function guardarParticipante() {
    const id = document.getElementById('idParticipante').value;
    const nombre = document.getElementById('nombre').value;
    const apellidoP = document.getElementById('apellidoP').value;
    const apellidoM = document.getElementById('apellidoM').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const nacimiento = document.getElementById('nacimiento').value;
    const genero = document.getElementById('genero').value;
    const colonia = document.getElementById('colonia').value;

    if (!nombre || !apellidoP) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    if (id) {
        // Editar
        const idx = DB.participantes.findIndex(p => p.id === parseInt(id));
        if (idx !== -1) {
            DB.participantes[idx] = { id: parseInt(id), nombre, apellidoP, apellidoM, email, telefono, nacimiento, genero, colonia };
        }
    } else {
        // Crear
        const nuevoId = Math.max(...DB.participantes.map(p => p.id), 0) + 1;
        DB.participantes.push({ id: nuevoId, nombre, apellidoP, apellidoM, email, telefono, nacimiento, genero, colonia });
    }

    guardarDatos();
    cerrarModal('modalParticipante');
    actualizarTablaParticipantes();
    alert('Participante guardado exitosamente');
}

function eliminarParticipante(id) {
    if (confirm('¿Está seguro de eliminar este participante?')) {
        DB.participantes = DB.participantes.filter(p => p.id !== id);
        guardarDatos();
        actualizarTablaParticipantes();
        alert('Participante eliminado');
    }
}

function actualizarTablaParticipantes() {
    const tbody = document.querySelector('#tablaParticipantes tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    DB.participantes.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td><strong>${p.nombre} ${p.apellidoP} ${p.apellidoM}</strong></td>
            <td>${p.email}</td>
            <td>${p.telefono}</td>
            <td>${p.nacimiento}</td>
            <td>${p.genero}</td>
            <td><span class="badge badge-info">Participante</span></td>
            <td class="actions">
                <a href="#" class="btn-icon" onclick="mostrarFormularioParticipante('editar', ${p.id}); return false;" title="Editar">✏️</a>
                <a href="#" class="btn-icon" onclick="eliminarParticipante(${p.id}); return false;" title="Eliminar">🗑️</a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================
// EVENTOS
// ============================================

function mostrarFormularioEvento(accion = 'crear', id = null) {
    abrirModal('modalEvento');
    const form = document.getElementById('formEvento');
    
    if (accion === 'crear') {
        form.reset();
        document.getElementById('idEvento').value = '';
        document.querySelector('#modalEvento h2').textContent = 'Nuevo Evento';
        document.getElementById('btnGuardarEvento').textContent = 'Crear Evento';
    } else if (accion === 'editar' && id) {
        const evento = DB.eventos.find(e => e.id === id);
        if (evento) {
            document.getElementById('idEvento').value = id;
            document.getElementById('nombreEvento').value = evento.nombre;
            document.getElementById('tipo').value = evento.tipo;
            document.getElementById('categoria').value = evento.categoria;
            document.getElementById('fecha').value = evento.fecha;
            document.getElementById('hora').value = evento.hora;
            document.getElementById('costo').value = evento.costo;
            document.getElementById('cupo').value = evento.cupo;
            document.getElementById('ubicacion').value = evento.ubicacion;
            document.querySelector('#modalEvento h2').textContent = 'Editar Evento';
            document.getElementById('btnGuardarEvento').textContent = 'Actualizar Evento';
        }
    }
}

function guardarEvento() {
    const id = document.getElementById('idEvento').value;
    const nombre = document.getElementById('nombreEvento').value;
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const costo = parseFloat(document.getElementById('costo').value) || 0;
    const cupo = parseInt(document.getElementById('cupo').value) || 0;
    const ubicacion = document.getElementById('ubicacion').value;

    if (!nombre || !fecha) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    if (id) {
        const idx = DB.eventos.findIndex(e => e.id === parseInt(id));
        if (idx !== -1) {
            DB.eventos[idx] = { id: parseInt(id), nombre, tipo, categoria, fecha, hora, costo, cupo, ubicacion };
        }
    } else {
        const nuevoId = Math.max(...DB.eventos.map(e => e.id), 0) + 1;
        DB.eventos.push({ id: nuevoId, nombre, tipo, categoria, fecha, hora, costo, cupo, ubicacion });
    }

    guardarDatos();
    cerrarModal('modalEvento');
    actualizarTablaEventos();
    alert('Evento guardado exitosamente');
}

function eliminarEvento(id) {
    if (confirm('¿Está seguro de eliminar este evento?')) {
        DB.eventos = DB.eventos.filter(e => e.id !== id);
        guardarDatos();
        actualizarTablaEventos();
        alert('Evento eliminado');
    }
}

function actualizarTablaEventos() {
    const tbody = document.querySelector('#tablaEventos tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    DB.eventos.forEach(e => {
        const tipoClass = e.tipo === 'Deportivo' ? 'deportivo' : 'cultural';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.id}</td>
            <td><strong>${e.nombre}</strong></td>
            <td><span class="badge badge-${tipoClass}">${e.tipo}</span></td>
            <td>${e.fecha}</td>
            <td>${e.categoria}</td>
            <td>${e.ubicacion}</td>
            <td>${e.cupo}</td>
            <td><span class="badge badge-activo">Activo</span></td>
            <td class="actions">
                <a href="#" class="btn-icon" onclick="mostrarFormularioEvento('editar', ${e.id}); return false;" title="Editar">✏️</a>
                <a href="#" class="btn-icon" onclick="eliminarEvento(${e.id}); return false;" title="Eliminar">🗑️</a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================
// INSCRIPCIONES
// ============================================

function mostrarFormularioInscripcion() {
    abrirModal('modalInscripcion');
    const select = document.getElementById('idEventoInsc');
    select.innerHTML = '<option value="">Selecciona un evento</option>';
    DB.eventos.forEach(e => {
        select.innerHTML += `<option value="${e.id}">${e.nombre}</option>`;
    });

    const selectPart = document.getElementById('idParticipanteInsc');
    selectPart.innerHTML = '<option value="">Selecciona un participante</option>';
    DB.participantes.forEach(p => {
        selectPart.innerHTML += `<option value="${p.id}">${p.nombre} ${p.apellidoP}</option>`;
    });
}

function guardarInscripcion() {
    const idEvento = parseInt(document.getElementById('idEventoInsc').value);
    const idParticipante = parseInt(document.getElementById('idParticipanteInsc').value);
    const pago = document.getElementById('pagoInsc').value;

    if (!idEvento || !idParticipante) {
        alert('Por favor selecciona evento y participante');
        return;
    }

    const nuevoId = Math.max(...DB.inscripciones.map(i => i.id), 0) + 1;
    const folio = 'FOL-' + new Date().getFullYear() + '-' + String(nuevoId).padStart(4, '0');
    
    DB.inscripciones.push({
        id: nuevoId,
        folio: folio,
        idEvento: idEvento,
        idParticipante: idParticipante,
        estado: 'Confirmada',
        pago: pago
    });

    guardarDatos();
    cerrarModal('modalInscripcion');
    actualizarTablaInscripciones();
    alert(`Inscripción realizada. Folio: ${folio}`);
}

function eliminarInscripcion(id) {
    if (confirm('¿Está seguro de cancelar esta inscripción?')) {
        const idx = DB.inscripciones.findIndex(i => i.id === id);
        if (idx !== -1) {
            DB.inscripciones[idx].estado = 'Cancelada';
            guardarDatos();
            actualizarTablaInscripciones();
            alert('Inscripción cancelada');
        }
    }
}

function actualizarTablaInscripciones() {
    const tbody = document.querySelector('#tablaInscripciones tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    DB.inscripciones.forEach(i => {
        const evento = DB.eventos.find(e => e.id === i.idEvento);
        const participante = DB.participantes.find(p => p.id === i.idParticipante);
        
        if (evento && participante) {
            const estadoClass = i.estado === 'Confirmada' ? 'confirmada' : 'cancelada';
            const pagoClass = i.pago === 'Pagado' ? 'success' : 'warning';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${i.folio}</strong></td>
                <td>${participante.nombre} ${participante.apellidoP}</td>
                <td>${evento.nombre}</td>
                <td>2026-01-13</td>
                <td><span class="badge badge-${estadoClass}">${i.estado}</span></td>
                <td><span class="badge badge-${pagoClass}">${i.pago}</span></td>
                <td>$${evento.costo}</td>
                <td class="actions">
                    <a href="#" class="btn-icon" onclick="eliminarInscripcion(${i.id}); return false;" title="Cancelar">❌</a>
                </td>
            `;
            tbody.appendChild(tr);
        }
    });
}

// ============================================
// CATEGORÍAS
// ============================================

function mostrarFormularioCategoria(accion = 'crear', id = null) {
    abrirModal('modalCategoria');
    const form = document.getElementById('formCategoria');
    
    if (accion === 'crear') {
        form.reset();
        document.getElementById('idCategoria').value = '';
        document.querySelector('#modalCategoria h2').textContent = 'Nueva Categoría';
        document.getElementById('btnGuardarCategoria').textContent = 'Crear Categoría';
    } else if (accion === 'editar' && id) {
        const categoria = DB.categorias.find(c => c.id === id);
        if (categoria) {
            document.getElementById('idCategoria').value = id;
            document.getElementById('nombreCategoria').value = categoria.nombre;
            document.getElementById('tipoCategoria').value = categoria.tipo;
            document.getElementById('descripcionCategoria').value = categoria.descripcion;
            document.querySelector('#modalCategoria h2').textContent = 'Editar Categoría';
            document.getElementById('btnGuardarCategoria').textContent = 'Actualizar Categoría';
        }
    }
}

function guardarCategoria() {
    const id = document.getElementById('idCategoria').value;
    const nombre = document.getElementById('nombreCategoria').value;
    const tipo = document.getElementById('tipoCategoria').value;
    const descripcion = document.getElementById('descripcionCategoria').value;

    if (!nombre || !tipo) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    if (id) {
        const idx = DB.categorias.findIndex(c => c.id === parseInt(id));
        if (idx !== -1) {
            DB.categorias[idx] = { id: parseInt(id), nombre, tipo, descripcion };
        }
    } else {
        const nuevoId = Math.max(...DB.categorias.map(c => c.id), 0) + 1;
        DB.categorias.push({ id: nuevoId, nombre, tipo, descripcion });
    }

    guardarDatos();
    cerrarModal('modalCategoria');
    actualizarTablaCategorias();
    alert('Categoría guardada exitosamente');
}

function eliminarCategoria(id) {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
        DB.categorias = DB.categorias.filter(c => c.id !== id);
        guardarDatos();
        actualizarTablaCategorias();
        alert('Categoría eliminada');
    }
}

function actualizarTablaCategorias() {
    const tbody = document.querySelector('#tablaCategorias tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    DB.categorias.forEach(c => {
        const tipoClass = c.tipo === 'Deportivo' ? 'deportivo' : 'cultural';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td><strong>${c.nombre}</strong></td>
            <td><span class="badge badge-${tipoClass}">${c.tipo}</span></td>
            <td>${c.descripcion.substring(0, 80)}...</td>
            <td><span class="badge badge-info">2 eventos</span></td>
            <td class="actions">
                <a href="#" class="btn-icon" onclick="mostrarFormularioCategoria('editar', ${c.id}); return false;" title="Editar">✏️</a>
                <a href="#" class="btn-icon" onclick="eliminarCategoria(${c.id}); return false;" title="Eliminar">🗑️</a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Inicializar tablas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarTablaParticipantes();
    actualizarTablaEventos();
    actualizarTablaInscripciones();
    actualizarTablaCategorias();
});
