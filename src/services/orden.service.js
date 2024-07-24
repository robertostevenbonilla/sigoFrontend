import http from "../http-common";
import { AuthHeader } from "./auth-header";
import { AuthDataService } from "./auth.service";

export const OrdenDataService = () => {
  const { header } = AuthHeader();
  const { refreshTokenProcess } = AuthDataService();

  const getAll = async (page, size, filter = "", sort = "", moreFilters) => {
    if (page - 1 < 0) page = 0;
    else page = page - 1;
    let url = `/orden/?page=${page}&size=${size}`;
    if (filter !== "" && filter !== "none") url += `&filter=${filter}`;
    if (sort !== "") url += `&sort=${sort}`;
    else url += `&sort=fechaEntrega:desc`;
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(url, { headers: { ...header() } });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const getSelect = async () => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get("/orden/select", { headers: { ...header() } });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const get = async (id) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(`/orden/${id}`, { headers: { ...header() } });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const getByGuia = async (guia) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(`/orden/guia/${guia}`, { headers: { ...header() } });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const getByGuiaPriv = async (guia) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(`/orden/guiaPriv/${guia}`, { headers: { ...header() } });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const create = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post("/orden/create", data, { headers: { ...header() } });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const update = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.put(`/orden/${data.id}`, data, {
          headers: { ...header() },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const deleted = async (id) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.delete(`/orden/${id}`, { headers: { ...header() } });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const findByRemitente = async (remitente) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(`/orden/list?remitente=${remitente}`, {
          headers: { ...header() },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const findByDestinatario = async (destinatario) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(`/orden/list?destinatario=${destinatario}`, {
          headers: { ...header() },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const asignar = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post(`/orden/asignar`, data, {
          headers: { ...header() },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const faseCount = async (id, mensajeroId) => {
    let qp = id === null ? "" : "?empresaIdFilter=" + id;
    qp += mensajeroId !== null ? "&mensajeroIdFilter=" + mensajeroId : "";
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(`/orden/faseCount${qp}`, {
          headers: { ...header() },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const serviceCount = async (id, mensajeroId) => {
    let qp = id === null ? "" : "?empresaIdFilter=" + id;
    qp += mensajeroId !== null ? "&mensajeroIdFilter=" + mensajeroId : "";
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(`/orden/serviceCount${qp}`, {
          headers: { ...header() },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const evidencia = async (file, id) => {
    const formData = new FormData();
    formData.append("file", file);
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post(`/evidencia/orden/${id}`, formData, {
          headers: { ...header(), "Content-type": "multipart/form-data" },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const evidenciaInc = async (file, id) => {
    const formData = new FormData();
    formData.append("file", file);
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post(`/evidencia/incidencia/${id}`, formData, {
          headers: { ...header(), "Content-type": "multipart/form-data" },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const incidencia = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post("/incidencia/create", data, {
          headers: { ...header() },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const bulkcreate = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post(
          "/orden/bulkcreate",
          { ordenes: data },
          { headers: { ...header() } }
        );
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const getReporteGuia = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post(
          "/orden/reporteGuia?type=pdf",
          { ordenes: data },
          { headers: { ...header() }, responseType: "blob" }
        );
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const getTicket = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(
          `/orden/${data}/ticket?type=pdf`,
          { headers: { ...header() }, responseType: "blob" }
        );
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const getTickets = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post(
          `/orden/tickets?type=pdf`,
          { ordenes: data },
          { headers: { ...header() }, responseType: "blob" }
        );
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const getRecibos = async (data) => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.post(
          `/orden/recibos?type=pdf`,
          { ordenes: data },
          { headers: { ...header() }, responseType: "blob" }
        );
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const getReporte = async (tipo, formato, filter) => {
    let url = `/orden/reporte${tipo}?type=${formato}`;
    if (filter !== "") url += `&filter=${filter}`;
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(url, {
          headers: { ...header() },
          responseType: "blob",
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  const byFase = async () => {
    let returnData = null;
    let recall = false;
    do {
      try {
        returnData = await http.get(`/orden/byFase`, {
          headers: { ...header() },
        });
        recall = false;
      } catch (error) {
        console.error(error);
        if (error.response.status === 403) {
          recall = await refreshTokenProcess();
        } else {
          throw error;
        }
      }
    } while (recall);
    return returnData;
  };

  return {
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
    getByGuiaPriv,
    evidencia,
    evidenciaInc,
    incidencia,
    bulkcreate,
    getReporteGuia,
    getReporte,
    getTicket,
    getTickets,
    getRecibos,
    byFase,
  };
};
/* const OrdenDataService = {
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
  evidenciaInc,
  incidencia,
  bulkcreate,
  getReporteGuia,
  getReporte,
}

export default OrdenDataService; */
