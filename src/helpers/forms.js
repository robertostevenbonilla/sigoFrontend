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
    oldPassword: '',
    newPassword: '',
    active: false,
    reset_password: false,
    roles: [],
    empresaId: -1,
    personaId: -1,
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
    empresaId: null,
    servicioId: null,
    faseId: null,
    ciudadOrigenId: null,
    ciudadDestinoId: null,
}

export const ordenFilterForm = {
    empresaId: null,
    servicioId: null,
    faseId: null,
    ciudadOrigenId: null,
    ciudadDestinoId: null,
}

