import http from "../http-common";
import { AuthHeader } from "./auth-header";

const { header } = AuthHeader();

const getAll = async () => {
  return await http.get("/persona/", { headers: {...header()} });
}

const getSelect = async () => {
  return await http.get("/persona/select", { headers: {...header()} });
}

const get = async (id) => {
  return await http.get(`/persona/${id}`, { headers: {...header()} });
}

const create = async (data) => {
  return await http.post("/persona/create", data, { headers: {...header()} });
}

const update = async (data) => {
  return await http.put(`/persona/${data.id}`, data, { headers: {...header()} });
}

const deleted = async (id) => {
  return await http.delete(`/persona/${id}`, { headers: {...header()} });
}

const findByEmpresa = async (id) => {
  return await http.get(`/persona/list?empresaId=${id}`, { headers: {...header()} });
}

const findByNombres = async (nombres) => {
  return await http.get(`/persona/list?nombres=${nombres}`, { headers: {...header()} });
}

const PersonaDataService = {
  getAll,
  getSelect,
  get,
  create,
  update,
  deleted,
  findByEmpresa,
  findByNombres
}

export default PersonaDataService;