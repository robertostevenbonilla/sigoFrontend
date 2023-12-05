import http from "../http-common";
import { AuthHeader } from "./auth-header";

const { header } = AuthHeader();

const getAll = async () => {
  return await http.get("/servicio/", { headers: {...header()} });
}

const getSelect = async () => {
  return await http.get("/servicio/select", { headers: {...header()} });
}

const get = async (id) => {
  return await http.get(`/servicio/${id}`, { headers: {...header()} });
}

const create = async (data) => {
  return await http.post("/servicio/create", data, { headers: {...header()} });
}

const update = async (data) => {
  return await http.put(`/servicio/${data.id}`, data, { headers: {...header()} });
}

const deleted = async (id) => {
  return await http.delete(`/servicio/${id}`, { headers: {...header()} });
}

const ServicioDataService = {
  getAll,
  getSelect,
  get,
  create,
  update,
  deleted,
}

export default ServicioDataService;