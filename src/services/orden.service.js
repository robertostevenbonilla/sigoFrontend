import http from "../http-common";
import { AuthHeader } from "./auth-header";

const { header } = AuthHeader();

const getAll = async (page,size) => {
  return await http.get(`/orden/?page=${page}&size=${size}`, { headers: {...header()} });
}

const getSelect = async () => {
  return await http.get("/orden/select", { headers: {...header()} });
}

const get = async (id) => {
  return await http.get(`/orden/${id}`, { headers: {...header()} });
}

const create = async (data) => {
  return await http.post("/orden/create", data, { headers: {...header()} });
}

const update = async (data) => {
  return await http.put(`/orden/${data.id}`, data, { headers: {...header()} });
}

const deleted = async (id) => {
  return await http.delete(`/orden/${id}`, { headers: {...header()} });
}

const findByRemitente = async (remitente) => {
  return await http.get(`/orden/list?remitente=${remitente}`, { headers: {...header()} });
}

const findByDestinatario = async (destinatario) => {
  return await http.get(`/orden/list?destinatario=${destinatario}`, { headers: {...header()} });
}

const asignar = async (data) => {
  return await http.post(`/orden/asignar`, data, { headers: {...header()} });
}


const OrdenDataService = {
  getAll,
  getSelect,
  get,
  create,
  update,
  deleted,
  findByRemitente,
  findByDestinatario,
  asignar,
}

export default OrdenDataService;