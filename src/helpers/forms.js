import moment from 'moment';

export const personaForm = {
    id: null,
    nombres: "",
    apellidos: "",
    identificacion: "",
    email: "",
    telefono: "",
    empresaId: null
}

export const usuarioForm = {
    id: null,
    username: '',
    password: '',
    newPassword: '',
    reset_password: false,
    roles: [],
}

export const empresaForm = {
    id: null,
    codigo: '',
    nombre: '',
    identificacion: '',
    email: '',
    telefono: '',
    celular: '',
    direccion: '',
    ciudadId: null,
    costo: '',
}

export const ciudadForm = {
    id: null,
    codigo: '',
    nombre: '',
    descripcion: '',
}

export const faseForm = {
    id: null,
    codigo: '',
    nombre: '',
    color: '',
    showMensajero: false,
    permitirAsignar: true,
}

export const servicioForm = {
    id: null,
    codigo: '',
    nombre: '',
    descripcion: '',
}

export const ordenForm = {
    id: null,
    fechaRecepcion: null,
    fechaEntrega: null,
    origen: '',
    destino: '',
    direccionOrigen: '',
    direccionDestino: '',
    remitente: '',
    destinatario: '',
    telefonoRemitente: '',
    telefonoDestinatario: '',
    email: '',
    descripcion: '',
    novedades: '',
    guia: '',
    costo: 0,
    precio: 0,
    producto: '',
    codigo: '',
    empresaId: null,
    servicioId: null,
    faseId: process.env.REACT_APP_FASE_CREADO*1,
    ciudadOrigenId: null,
    ciudadDestinoId: null,
    mensajeroId: null,
    Evidencias: [],
}
 
export const ordenFilterForm = {
    empresaId: [],
    servicioId: [],
    faseId: [],
    ciudadOrigenId: [],
    ciudadDestinoId: [],
    mensajeroId: [],
    fechaDesde: moment().subtract(1, 'months').format("YYYY-MM-DD"),
    fechaHasta: moment().format("YYYY-MM-DD"),
}

