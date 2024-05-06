import http from "../http-common";
import { AuthHeader } from "./auth-header";

const { header } = AuthHeader();

const getAll = async (page,size,filter="",sort="") => {
  if( page -1 < 0 ) page = 0;
  else page = page -1;
  let url = `/orden/?page=${page}&size=${size}`
  if(filter !== "") url = `/orden/?filter=${filter}&page=${page}&size=${size}`;
  if(sort !== "") url = `/orden/?filter=${filter}&page=${page}&size=${size}&sort=${sort}`;
  return await http.get(url, { headers: {...header()} });
}

const getSelect = async () => {
  return await http.get("/orden/select", { headers: {...header()} });
}

const get = async (id) => {
  return await http.get(`/orden/${id}`, { headers: {...header()} });
}

const getByGuia = async (guia) => {
  return await http.get(`/orden/guia/${guia}`, { headers: {...header()} });
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

const faseCount = async (id) => {
  const qp = id === null ? "" : "?empresaIdFilter="+id;
  return await http.get(`/orden/faseCount${qp}`, { headers: {...header()} });
}

const serviceCount = async (id) => {
  const qp = id === null ? "" : "?empresaIdFilter="+id;
  return await http.get(`/orden/serviceCount${qp}`, { headers: {...header()} });
}

const evidencia = async (file, id) => {
  const formData = new FormData();
  formData.append("file", file);
  return await http.post(`/evidencia/orden/${id}`, formData, { headers: {...header(), 'Content-type': 'multipart/form-data'} });
}

const incidencia = async (data) => {
  return await http.post("/incidencia/create", data, { headers: {...header()} });
};

const bulkcreate = async (data) => {
  return await http.post("/orden/bulkcreate", {ordenes: data}, { headers: {...header()} });
};

const getReporteGuia = async (data) => {
  return await http.post("/orden/reporteGuia?type=pdf", {ordenes: data}, { headers: {...header()}, responseType: 'blob' });
};

const getReporte = async (tipo, formato, filter) => {
  let url = `/orden/reporte${tipo}?type=${formato}`;
  if(filter !== "") url += `&filter=${filter}`;
  return await http.get(url, { headers: {...header()}, responseType: 'blob' });
};

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
  faseCount,
  serviceCount,
  getByGuia,
  evidencia,
  incidencia,
  bulkcreate,
  getReporteGuia,
  getReporte,
}

export default OrdenDataService;