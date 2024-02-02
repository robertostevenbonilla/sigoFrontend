import http from "../http-common";
import { AuthHeader } from "./auth-header";

const { header } = AuthHeader();

const getAll = async () => {
  return await http.get("/empresa/", { headers: {...header()} });
}

const getSelect = async () => {
  return await http.get("/empresa/select", { headers: {...header()} });
}

const get = async (id) => {
  return await http.get(`/empresa/${id}`, { headers: {...header()} });
}

const create = async (data) => {
  return await http.post("/empresa/create", data, { headers: {...header()} });
}

const update = async (data) => {
  return await http.put(`/empresa/${data.id}`, data, { headers: {...header()} });
}

const deleted = async (id) => {
  return await http.delete(`/empresa/${id}`, { headers: {...header()} });
}

const findByCodigo = async (codigo) => {
  return await http.get(`/empresa/list?codigo=${codigo}`, { headers: {...header()} });
}

const findByNombre = async (nombres) => {
  return await http.get(`/empresa/list?nombre=${nombres}`, { headers: {...header()} });
}

const findGuia = async (id) => {
  return await http.get(`/empresa/${id}/guia`, { headers: {...header()} });
}

const EmpresaDataService = {
  getAll,
  getSelect,
  get,
  create,
  update,
  deleted,
  findByCodigo,
  findByNombre,
  findGuia,
}

export default EmpresaDataService;