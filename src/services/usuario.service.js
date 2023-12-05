import http from "../http-common";
import { AuthHeader } from "./auth-header";

const { header } = AuthHeader();

const getAll = async () => {
  return await http.get("/usuario/", { headers: {...header()} });
}

const getSelect = async () => {
  return await http.get("/usuario/select", { headers: {...header()} });
}

const get = async (id) => {
  return await http.get(`/usuario/${id}`, { headers: {...header()} });
}

const update = async (data) => {
  return await http.put(`/usuario/${data.id}`, data, { headers: {...header()} });
}

const findByEmpresa = async (id) => {
  return await http.get(`/usuario/list?empresaId=${id}`, { headers: {...header()} });
}

const findByUsuario = async (usuario) => {
  return await http.get(`/usuario/list?username=${usuario}`, { headers: {...header()} });
}

const UsuarioDataService = {
  getAll,
  getSelect,
  get,
  update,
  findByUsuario
}

export default UsuarioDataService;