import http from "../http-common";
import { AuthHeader } from "./auth-header";

const { header } = AuthHeader();

const getAll = async () => {
  return await http.get("/fase/", { headers: {...header()} });
}

const getSelect = async (mensajero = false) => {
  const url = "/fase/select" + (mensajero ? "?mensajero=1" : ""); 
  return await http.get(url, { headers: {...header()} });
}

const get = async (id) => {
  return await http.get(`/fase/${id}`, { headers: {...header()} });
}

const create = async (data) => {
  return await http.post("/fase/create", data, { headers: {...header()} });
}

const update = async (data) => {
  return await http.put(`/fase/${data.id}`, data, { headers: {...header()} });
}

const deleted = async (id) => {
  return await http.delete(`/fase/${id}`, { headers: {...header()} });
}

const FaseDataService = {
  getAll,
  getSelect,
  get,
  create,
  update,
  deleted,
}

export default FaseDataService;