import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrdenDataService from "../../services/orden.service";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import ServicioDataService from "../../services/servicio.service";
import FaseDataService from "../../services/fase.service";
import { styled } from "@mui/material/styles";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  AccountBox,
  FilterAltOutlined,
  ListAlt,
  Person,
  Room,
  ScheduleSend,
  Today,
} from "@mui/icons-material";
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { loadingTable } from "../../reducers/ui";
import { SearchInput } from "../form/AutoCompleteInput";
import { ordenFilterForm } from "../../helpers/forms";

const columnsOrden = [
  {
    field: "id",
    headerName: "Id",
    flex: 1,
  },
  {
    field: "guia",
    headerName: "Guia",
  },
  {
    field: "origen",
    headerName: "Origen",
    type: "render",
    renderFunction: (row) => {
      return (
        <List dense={true}>
          <ListItem style={{ padding: "3px 6px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary={row.origen} />
          </ListItem>
          <ListItem style={{ padding: "3px 6px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <Room />
            </ListItemIcon>
            <ListItemText primary={row.ciudadOrigen?.nombre} />
          </ListItem>
        </List>
      );
    },
  },
  {
    field: "destino",
    headerName: "Destino",
    type: "render",
    renderFunction: (row) => {
      return (
        <List dense={true}>
          <ListItem style={{ padding: "3px 6px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary={row.destino} />
          </ListItem>
          <ListItem style={{ padding: "3px 6px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <Room />
            </ListItemIcon>
            <ListItemText primary={row.ciudadDestino?.nombre} />
          </ListItem>
        </List>
      );
    },
  },
  {
    field: "fechaRecepcion",
    headerName: "Fecha",
    //format: "date",
    type: "render",
    renderFunction: (row) => {
      return (
        <List style={{ padding: "3px 6px" }} dense={true}>
          <ListItem style={{ padding: "3px 6px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <Today />
            </ListItemIcon>
            <ListItemText
              style={{ width: "max-content" }}
              primary={row.fechaRecepcion}
            />
          </ListItem>
          <ListItem style={{ padding: "3px 6px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <ScheduleSend />
            </ListItemIcon>
            <ListItemText
              style={{ width: "max-content" }}
              primary={row.fechaEntrega}
            />
          </ListItem>
        </List>
      );
    },
  },
  /* {
    field: "fechaEntrega",
    headerName: "Entrega",
    flex: 1,
    format: "date",
  },
  {
    field: "direccionOrigen",
    headerName: "Dirección Remitente",
    flex: 2,
  },
  {
    field: "direccionDestino",
    headerName: "Dirección Destinario",
    flex: 2,
  },
  {
    field: "remitente",
    headerName: "Remitente",
    flex: 2,
  },
  {
    field: "destinatario",
    headerName: "Destinatario",
    flex: 2,
  },
  {
    field: "telefonoRemitente",
    headerName: "Telefono Remitente",
    flex: 2,
  },
  {
    field: "telefonoDestinatario",
    headerName: "Telefono Destinatario",
    flex: 2,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 2,
  }, */
  /* {
    field: "descripcion",
    headerName: "Descripción",
    flex: 1,
  },
  {
    field: "novedades",
    headerName: "Novedades",
    flex: 1,
  }, */
  {
    field: "costo",
    headerName: "Costo",
    type: "price",
    style: { textAlign: "right" },
  },
  {
    field: "precio",
    headerName: "Precio",
    type: "price",
    style: { textAlign: "right" },
  },
  {
    field: "empresa",
    headerName: "Empresa",
    type: "render",
    renderFunction: (row) => {
      return row.empresa?.nombre;
    },
  },
  {
    field: "servicio",
    headerName: "Servicio",
    type: "render",
    renderFunction: (row) => {
      return row.servicio?.nombre;
    },
  },
  {
    field: "fase",
    headerName: "Estado",
    type: "render",
    renderFunction: (row) => {
      return row.fase?.nombre;
    },
  },
  /* {
    field: "ciudadOrigen",
    headerName: "Ciudad Origen",
    flex: 2,
    type: "render",
    renderFunction: (row) => {
      return row.ciudadOrigen.nombre;
    },
  },
  {
    field: "ciudadDestino",
    headerName: "Ciudad Destino",
    flex: 2,
    type: "render",
    renderFunction: (row) => {
      return row.ciudadDestino.nombre;
    },
  }, */
];

const OrdenList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { isLoadingTable } = useSelector((state) => state.ui);

  const [form, setForm] = useState(ordenFilterForm);
  const [ciudadSelect, setCiudadSelect] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState([]);
  const [servicioSelect, setServicioSelect] = useState([]);
  const [faseSelect, setFaseSelect] = useState([]);

  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const loadSelects = () => {
    CiudadDataService.getSelect()
      .then((response) => {
        console.log("ciudad", response);
        setCiudadSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    EmpresaDataService.getSelect()
      .then((response) => {
        console.log("empresa", response);
        setEmpresaSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    ServicioDataService.getSelect()
      .then((response) => {
        console.log("servicio", response);
        setServicioSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    FaseDataService.getSelect()
      .then((response) => {
        console.log("fase", response);
        setFaseSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(currentUser, currentUser);
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      retrieveOrdenes();
    }
  }, []);

  const getFilters = async () => {
    if (!filtersLoaded) {
      loadSelects();
      setFiltersLoaded(true);
    }
  };

  const handleInputChange = async (event) => {
    const { id, value } = event.target;
    console.log(form, event.target, id, value);
    setForm({ ...form, [id]: value });
  };

  const retrieveOrdenes = (page = 0, size = 10) => {
    dispatch(loadingTable(true));
    OrdenDataService.getAll(page, size)
      .then((response) => {
        console.log(response.data);
        setOrdenes(response.data);
        dispatch(loadingTable(false));
      })
      .catch((e) => {
        console.log(e);
        dispatch(loadingTable(false));
      });
  };

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Card
        title="Ordenes"
        icon={<ListAlt sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-ordenes"
        className="text-start"
      >
        <EnhancedTable
          table={{
            columns: columnsOrden,
            rows: ordenes.data,
            rowId: "id",
            pages: ordenes.pages,
            total: ordenes.total,
          }}
          sx
          noDataMessage={"Por el momento no existen registros."}
          /* loading={isLoadingTable} */
          view={true}
          onViewFunction={(id, row) => {
            navigate(`/orden/${id}`);
          }}
          searchableKeys={[
            "fechaEntrega",
            "remitente",
            "destinatario",
            "email",
            "guia",
          ]}
          rowId={"id"}
          paginationServer={true}
          handlePagination={retrieveOrdenes}
          loading={isLoadingTable}
          getFilters={getFilters}
          orderASC="asc"
          add={true}
          onAddFunction={() => {
            navigate("/orden/add");
          }}
          extraFilters={(resetPagination) => (
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{ padding: 2 }}
            >
              <Grid item sm={1} xs={12}>
                Filtros:
              </Grid>
              <Grid item sm={9} xs={12}>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={4}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione una ciudad" },
                        ...ciudadSelect,
                      ]}
                      value={form.ciudadOrigenId}
                      placeholder={"Seleccione una ciudad"}
                      id={"ciudadOrigenId"}
                      name={"ciudadOrigenId"}
                      label={"Ciudad Origen"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione una ciudad" },
                        ...ciudadSelect,
                      ]}
                      value={form.ciudadDestinoId}
                      placeholder={"Seleccione una ciudad"}
                      id={"ciudadDestinoId"}
                      name={"ciudadDestinoId"}
                      label={"Ciudad Destino"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione un estado" },
                        ...faseSelect,
                      ]}
                      value={form.faseId}
                      placeholder={"Seleccione un estado"}
                      id={"faseId"}
                      name={"faseId"}
                      label={"Estado"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione un servicio" },
                        ...servicioSelect,
                      ]}
                      value={form.servicioId}
                      placeholder={"Seleccione un servicio"}
                      id={"servicioId"}
                      name={"servicioId"}
                      label={"Servicio"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione una empresa" },
                        ...empresaSelect,
                      ]}
                      value={form.empresaId}
                      placeholder={"Seleccione una empresa"}
                      id={"empresaId"}
                      name={"empresaId"}
                      label={"Empresa"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={2} xs={12} style={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  startIcon={<FilterAltOutlined />}
                  onClick={() => {
                    //getFiltered();
                    resetPagination();
                  }}
                >
                  Filtrar
                </Button>
              </Grid>
            </Grid>
          )}
        />
      </Card>
    </div>
  );
};

export default OrdenList;
