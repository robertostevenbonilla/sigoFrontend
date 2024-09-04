import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OrdenDataService } from "../../services/orden.service";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import ServicioDataService from "../../services/servicio.service";
import FaseDataService from "../../services/fase.service";
import { ordenForm } from "../../helpers/forms";
import { Card as CardContent } from "../Card";
import {
  Business,
  CloudUpload,
  Dashboard,
  Edit,
  EventNote,
  Info,
  ListAlt,
  Save,
} from "@mui/icons-material";
import {
  Button,
  Grid,
  TextField,
  ImageListItem,
  ImageList,
  ImageListItemBar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Breadcrumbs,
  Chip,
} from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";
import { setMessage, setOpenModal } from "../../reducers/message";
import moment from "moment";
import "dayjs/locale/es";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import UsuarioDataService from "../../services/usuario.service";
import { setLoading } from "../../reducers/ui";

const Orden = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { get, update, evidenciaInc, incidencia, asignar } = OrdenDataService();

  const [form, setForm] = useState(ordenForm);
  /* const [loading, setLoading] = useState(false); */
  const [edited, setEdited] = useState(true);
  const [ciudadSelect, setCiudadSelect] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState([]);
  const [servicioSelect, setServicioSelect] = useState([]);
  const [motorizadoSelect, setMotorizadoSelect] = useState([]);
  const [faseSelect, setFaseSelect] = useState([]);
  const [faseIdEvi, setFaseIdEvi] = useState(-1);
  const [editedSup, setEditedSup] = useState(true);
  const [incidenciasList, setIncidenciasList] = useState([]);
  const [fileForm, setFile] = useState(null);
  const [orden, setOrden] = useState({});
  const [eDescripcion, setEDescripcion] = useState("");

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { msg } = useSelector((state) => state.message);
  const { pages, rows } = useSelector((state) => state.ui);

  const getOrden = (id) => {
    get(id)
      .then((response) => {
        setForm(response.data);
        setIncidenciasList(response.data.Incidencias);
        setOrden({ ...response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const loadSelects = () => {
    CiudadDataService.getSelect()
      .then((response) => {
        setCiudadSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    EmpresaDataService.getSelect()
      .then((response) => {
        setEmpresaSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    ServicioDataService.getSelect()
      .then((response) => {
        setServicioSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    const mensajero =
      currentUser?.auth?.roles.find((rol) => rol.name == "mensajero") !==
      undefined
        ? true
        : false;
    FaseDataService.getSelect(mensajero)
      .then((response) => {
        setFaseSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    UsuarioDataService.motorizados()
      .then((response) => {
        setMotorizadoSelect(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    console.log(currentUser.isLoggedIn, currentUser);
    if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else if (currentUser.user?.reset_password === 1) {
      navigate("/changepassword");
    } else {
      setEdited(true);
    }
  }, []);

  React.useEffect(() => {
    if (id) {
      loadSelects();
      getOrden(id);
    }
  }, [id]);

  const handleInputChange = async (event) => {
    const { id, value } = event.target;
    if (id === "incidencia") {
      setEDescripcion(value);
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const handleInputChangeF = async (event) => {
    const { id, value } = event.target;
    setFaseIdEvi(value);
  };

  const onChange = (e, name = null, value = null) => {
    const inputName = name !== null ? name : e.target.name;
    const inputValue = value !== null ? value : e.target.value;

    setForm({ ...form, nIdActor: 0, [inputName]: inputValue });
  };

  const handleEdited = () => {
    if (
      currentUser.auth?.roles.find((rol) => rol.name === "supervisor") !==
      undefined
    ) {
      setEditedSup(false);
      setEdited(true);
    } else setEditedSup(false);
    setEdited(!edited);
  };

  const handleSave = () => {
    const data = {
      id: form.id,
      fechaRecepcion: form.fechaRecepcion,
      fechaEntrega: form.fechaEntrega,
      origen: form.origen,
      destino: form.destino,
      direccionOrigen: form.direccionOrigen,
      direccionDestino: form.direccionDestino,
      remitente: form.remitente,
      destinatario: form.destinatario,
      telefonoRemitente: form.telefonoRemitente,
      telefonoDestinatario: form.telefonoDestinatario,
      email: form.email,
      descripcion: form.descripcion,
      novedades: form.novedades,
      guia: form.guia,
      costo: form.costo,
      precio: form.precio,
      producto: form.producto,
      codigo: form.codigo,
      empresaId: form.empresaId,
      servicioId: form.servicioId,
      faseId: form.faseId,
      ciudadOrigenId: form.ciudadOrigenId,
      ciudadDestinoId: form.ciudadDestinoId,
      mensajeroId: form.mensajeroId,
    };
    update(data)
      .then((response) => {
        if (response.status === 200) {
          const message = {
            title: "Actualización Orden",
            msg: "",
            error: true,
          };
          dispatch(setMessage({ ...message, msg: response.data.message }));
          dispatch(setOpenModal(true));
          setEdited(true);
          setEditedSup(!editedSup);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEvidencia = (event) => {
    const file = event.target.files;
    setFile(file);
  };

  const saveEvidencia = async (incidenciaList) => {
    let ite = 0;
    Array.from(fileForm).forEach(async (file, key) => {
      const response = await evidenciaInc(file, incidenciaList.id);
      incidenciaList["evidencias"] = [
        response.data,
        ...incidenciaList["evidencias"],
      ];
      ite++;
      if (ite === fileForm.length) {
        await setIncidenciasList((incidenciasList) => [
          incidenciaList,
          ...incidenciasList,
        ]);
        setFaseIdEvi(-1);
        setEDescripcion("");
        dispatch(setLoading(false));
      }
    });
  };

  const saveIncidencia = async () => {
    if (eDescripcion === "") {
      const message = {
        title: "Guardar Incidencia",
        msg: "Ingrese una descripción.",
        error: true,
      };
      dispatch(setMessage({ ...message }));
      dispatch(setOpenModal(true));
      return false;
    }
    if (faseIdEvi === -1) {
      const message = {
        title: "Guardar Incidencia",
        msg: "Seleccione un estado.",
        error: true,
      };
      dispatch(setMessage({ ...message }));
      dispatch(setOpenModal(true));
      return false;
    }
    if (fileForm === null) {
      const message = {
        title: "Guardar Incidencia",
        msg: "Ingrese una fotografía.",
        error: true,
      };
      dispatch(setMessage({ ...message }));
      dispatch(setOpenModal(true));
      return false;
    }
    dispatch(setLoading(true));
    const data = {
      ordenId: orden.id,
      userId: currentUser.auth.id,
      descripcion: eDescripcion,
      fecha: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    const response = await incidencia(data);
    await saveAsignar();
    await saveEvidencia(response.data);
  };

  const saveAsignar = async () => {
    const fase = faseIdEvi === -1 ? null : faseIdEvi;
    const dataM = {
      guias: [orden.guia],
      mensajeroId: null,
      estadoId: fase,
    };
    console.log(dataM);
    await asignar(dataM)
      .then((response) => {
        const message = {
          title: "Asignación",
          msg: "Procesado correctamente.",
          error: true,
        };
        setForm({ ...form, faseId: fase });
        dispatch(setMessage({ ...message }));
        dispatch(setOpenModal(true));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "10px" }}>
        <Chip
          icon={<Dashboard sx={{ color: "white !important" }} />}
          label="Dashboard"
          onClick={() => {
            navigate(`/`);
          }}
          sx={{ background: "#3364FF", color: "white", padding: "2px 5px" }}
        />
        <Chip
          icon={<ListAlt sx={{ color: "white !important" }} />}
          label="Ordenes"
          onClick={() => {
            navigate(`/orden?page=${pages + 1}&rowsPerPage=${rows}`);
          }}
          sx={{ background: "#3364FF", color: "white", padding: "2px 5px" }}
        />
        <Typography color="text.primary">{form.guia}</Typography>
      </Breadcrumbs>
      <CardContent
        id="datosGenerales-orden"
        title="Orden"
        icon={<Business sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-orden"
        className="text-start"
      >
        <Grid container spacing={1}>
          <Grid item md={6} sm={6} xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"es"}
            >
              <DesktopDatePicker
                sx={{ width: "100% " }}
                label="Recepción"
                inputFormat="YYYY-MM-DD"
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: "100%" }} />
                )}
                value={dayjs(form.fechaRecepcion)}
                onChange={(e) =>
                  onChange(
                    null,
                    "fechaRecepcion",
                    moment(e["$d"]).format("YYYY-MM-DD")
                  )
                }
                disabled={edited}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"es"}
            >
              <DesktopDatePicker
                sx={{ width: "100% " }}
                label="Recepción"
                inputFormat="YYYY-MM-DD"
                renderInput={(params) => (
                  <TextField {...params} sx={{ width: "100%" }} />
                )}
                value={dayjs(form.fechaRecepcion)}
                onChange={(e) =>
                  onChange(
                    null,
                    "fechaRecepcion",
                    moment(e["$d"]).format("YYYY-MM-DD")
                  )
                }
                disabled={edited}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="guia"
              name="guia"
              label="Guía"
              value={form.guia}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              disabled={true}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
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
              disabled={true}
            />
          </Grid>
          <Grid container className="subGrid">
            <h2 className="card__title">Origen</h2>
            <Grid item className="sGitem">
              <TextField
                id="origen"
                name="origen"
                label="Origen"
                value={form.origen}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
              />
            </Grid>
            <Grid item className="sGitem">
              <TextField
                id="direccionOrigen"
                name="direccionOrigen"
                label="Dirección Remitente"
                value={form.direccionOrigen}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
                inputProps={{ step: 255, maxLength: 255 }}
              />
            </Grid>
            <Grid item className="sGitem">
              <TextField
                id="remitente"
                name="remitente"
                label="Remitente"
                value={form.remitente}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
              />
            </Grid>
            <Grid item className="sGitem">
              <TextField
                id="telefonoRemitente"
                name="telefonoRemitente"
                label="Telefono Remitente"
                value={form.telefonoRemitente}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
              />
            </Grid>
            <Grid item className="sGitem">
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
                disabled={edited}
              />
            </Grid>
          </Grid>
          <Grid container className="subGrid">
            <h2 className="card__title">Destino</h2>
            <Grid item className="sGitem">
              <TextField
                id="destino"
                name="destino"
                label="Destino"
                value={form.destino}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
              />
            </Grid>
            <Grid item className="sGitem">
              <TextField
                id="direccionDestino"
                name="direccionDestino"
                label="Dirección Destinario"
                value={form.direccionDestino}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
                inputProps={{ step: 255, maxLength: 255 }}
              />
            </Grid>
            <Grid item className="sGitem">
              <TextField
                id="destinatario"
                name="destinatario"
                label="Destinatario"
                value={form.destinatario}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
              />
            </Grid>
            <Grid item className="sGitem">
              <TextField
                id="telefonoDestinatario"
                name="telefonoDestinatario"
                label="Telefono Destinatario"
                value={form.telefonoDestinatario}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
              />
            </Grid>
            <Grid item className="sGitem">
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
                disabled={edited}
              />
            </Grid>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="email"
              name="email"
              label="Email"
              value={form.email}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="costo"
              name="costo"
              label="Costo envio"
              value={form.costo}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="producto"
              name="producto"
              label="Producto"
              value={form.producto}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="precio"
              name="precio"
              label="Precio producto"
              value={form.precio}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="codigo"
              name="codigo"
              label="Codigo"
              value={form.codigo}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
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
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
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
              disabled={editedSup}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <SearchInput
              options={[
                { id: -1, fullname: "Seleccione un mensajero" },
                ...motorizadoSelect,
              ]}
              value={form.mensajeroId}
              placeholder={"Seleccione un mensajero"}
              id={"mensajeroId"}
              name={"mensajeroId"}
              label={"Mensajero"}
              getOptionLabel={"fullname"}
              getIndexLabel={"id"}
              onChange={handleInputChange}
              disabled={editedSup}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <TextField
              id="descripcion"
              name="descripcion"
              label="Descripción"
              value={form.descripcion}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              disabled={edited}
              inputProps={{ step: 500, maxLength: 500 }}
            />
          </Grid>
          {currentUser.auth?.roles.find((rol) => rol.name === "admin") !==
            undefined && (
            <>
              <Grid item md={12} sm={12} xs={12} className="text-start">
                {edited && editedSup ? (
                  <Button
                    onClick={handleEdited}
                    endIcon={<Edit />}
                    variant="contained"
                    color="success"
                    className="align-middle"
                  >
                    Editar
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    endIcon={<Save />}
                    variant="contained"
                    color="success"
                    className="align-middle"
                  >
                    Guardar
                  </Button>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
      {currentUser.auth?.roles.find(
        (rol) => rol.name === "admin" || rol.name === "empresa"
      ) !== undefined && (
        <CardContent
          key="incidencias"
          title="Evidencias"
          icon={<EventNote sx={{ color: "white", fontSize: "23px" }} />}
          openCollapse={true}
          idElement="datosGenerales-orden"
          className="text-start"
        >
          {currentUser.auth?.roles.find((rol) => rol.name === "admin") !==
            undefined && (
            <Grid container spacing={1}>
              <Grid item md={6} sm={6} xs={12}>
                <SearchInput
                  options={[
                    { id: -1, nombre: "Seleccione un estado" },
                    ...faseSelect,
                  ]}
                  value={faseIdEvi}
                  placeholder={"Seleccione un estado"}
                  id={"faseIdEvi"}
                  name={"faseIdEvi"}
                  label={"Estado"}
                  getOptionLabel={"nombre"}
                  getIndexLabel={"id"}
                  onChange={handleInputChangeF}
                />
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <TextField
                  id="incidencia"
                  name="incidencia"
                  label="Incidencia"
                  value={eDescripcion}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  inputProps={{ step: 255, maxLength: 255 }}
                />
              </Grid>
              <Grid item md={8} sm={8} xs={12} sx={{ margin: "auto 0" }}>
                <TextField
                  type="file"
                  inputProps={{
                    multiple: true,
                    accept: "image/png, image/gif, image/jpeg",
                  }}
                  onChange={handleEvidencia}
                  fullWidth
                />
              </Grid>
              <Grid item md={4} sm={4} xs={12} sx={{ margin: "auto 0" }}>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUpload />}
                  onClick={saveIncidencia /* saveEvidencia */}
                >
                  Guardar incidencia
                </Button>
              </Grid>
            </Grid>
          )}
          <br />
          <Grid container spacing={1}>

            <Grid item md={12} sm={12} sx={12}>
              <List dense={true}>
                {incidenciasList.length > 0 &&
                  incidenciasList.map((item, key) => (
                    <>
                      <ListItem>
                        <ListItemText
                          primary={item.descripcion}
                          secondary={
                            <>
                              <Typography
                                sx={{ display: "inline", fontWeight: "600" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {item.usuario?.persona.fullName}:{" "}
                              </Typography>
                              {moment(
                                item.createdAt[item.fecha.length - 1] === "Z"
                                  ? item.fecha.slice(0, -1)
                                  : item.fecha
                              ).format("YYYY-MM-DD HH:mm:ss")}
                            </>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <Grid item md={12} sm={12} sx={12}>
                          <ImageList
                            sx={{ width: "100%", maxHeight: 450 }}
                            variant="quilted"
                            cols={3}
                            rowHeight={200}
                          >
                            {item.evidencias.map((itemImg, keyImg) => (
                              <ImageListItem
                                id={`${key}-${itemImg.id}`}
                                key={`${key}-${itemImg.id}`}
                                sx={{ objectFit: "contain" }}
                              >
                                <img
                                  srcSet={`${process.env.REACT_APP_IMG_URL}${itemImg.codigo}`}
                                  src={`${process.env.REACT_APP_IMG_URL}${itemImg.codigo}`}
                                  /* alt={item.title} */
                                  loading="lazy"
                                  style={{ objectFit: "contain" }}
                                />
                                <ImageListItemBar
                                  title={itemImg.nombre}
                                  subtitle={moment(
                                    itemImg.createdAt[
                                      itemImg.createdAt.length - 1
                                    ] === "Z"
                                      ? itemImg.createdAt.slice(0, -1)
                                      : itemImg.createdAt
                                  ).format("YYYY-MM-DD hh:mm:ss")}
                                  actionIcon={
                                    <IconButton
                                      sx={{
                                        color: "rgba(255, 255, 255, 0.54)",
                                      }}
                                      aria-label={`info about ${itemImg.title}`}
                                    >
                                      <Info />
                                    </IconButton>
                                  }
                                />
                              </ImageListItem>
                            ))}
                          </ImageList>
                        </Grid>
                      </ListItem>
                      <Divider variant="middle" component="li" />
                    </>
                  ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      )}
    </div>
  );
};

export default Orden;
