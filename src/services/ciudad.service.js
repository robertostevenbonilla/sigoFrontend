import http from "../http-common";
import { AuthHeader } from "./auth-header";

const { header } = AuthHeader();

const getAll = async () => {
  return await http.get("/ciudad/", { headers: {...header()} });
}

const getSelect = async () => {
  return await http.get("/ciudad/select", { headers: {...header()} });
}

const get = async (id) => {
  return await http.get(`/ciudad/${id}`, { headers: {...header()} });
}

const create = async (data) => {
  return await http.post("/ciudad/create", data, { headers: {...header()} });
}

const update = async (data) => {
  return await http.put(`/ciudad/${data.id}`, data, { headers: {...header()} });
}

const deleted = async (id) => {
  return await http.delete(`/ciudad/${id}`, { headers: {...header()} });
}

const CiudadDataService = {
  getAll,
  getSelect,
  get,
  create,
  update,
  deleted,
}

export default CiudadDataService;