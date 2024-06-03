import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  OrdenDataService, } from "../../services/orden.service";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import ServicioDataService from "../../services/servicio.service";
import FaseDataService from "../../services/fase.service";
import { ordenForm } from "../../helpers/forms";
import { Card } from "../Card";
import {
  AssignmentInd,
  Business,
  Dashboard,
  Edit,
  ListAlt,
  Save,
} from "@mui/icons-material";
import {
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";
import { SelectInput } from "../form/SelectInput";
import { setMessage, setOpenModal } from "../../reducers/message";
import moment from "moment";
import "dayjs/locale/es";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import UsuarioDataService from "../../services/usuario.service";

const AddOrden = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { 
    get,
    create, } = OrdenDataService();

  const [form, setForm] = useState({
    ...ordenForm,
    fechaRecepcion: moment(),
    fechaEntrega: moment().add(1, "days").format("YYYY-MM-DD"),
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ciudadSelect, setCiudadSelect] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState([]);
  const [servicioSelect, setServicioSelect] = useState([]);
  const [faseSelect, setFaseSelect] = useState([]);
  const [motorizadoSelect, setMotorizadoSelect] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { msg } = useSelector((state) => state.message);
  const { pages, rows } = useSelector((state) => state.ui);

  const getOrden = (id) => {
    get(id)
      .then((response) => {
        setForm(response.data);
        console.log(response, response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
    UsuarioDataService.motorizados()
      .then((response) => {
        setMotorizadoSelect(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(currentUser.isLoggedIn, currentUser);
    if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else if (currentUser.user?.reset_password === 1) {
      navigate("/changepassword");
    } else {
      loadSelects();
    }
  }, []);

  const handleInputChange = async (event) => {
    const { id, value } = event.target;
    console.log(form, event.target, id, value);
    if (id === "empresaId" && value > 0) {
      console.log("gui", value);
      var response = await EmpresaDataService.findGuia(value)
        /* .then((response) => {
          var guia = (response.codigo+(((response.Guia)*1)+1));
          console.log("guia", response, guia);
          setForm({ ...form, "guia": guia });
        }) */
        .catch((error) => {
          console.error(error);
        });
      response = response.data;
      var guia = response.codigo + (response.Guias * 1 + 1);
      console.log("guia", response, guia);
      //setForm({ ...form, [id]: value });
      setForm({
        ...form,
        [id]: value,
        guia: guia,
        costo: response.costo,
        origen: response.nombre,
        direccionOrigen: response.direccion,
        remitente: response.nombre,
        telefonoRemitente: response.telefono === null ? ' ' : response.telefono,
        ciudadOrigenId: response.ciudadId,
      });
    } else if (id === "empresaId" && value <= 0) {
      setForm({ ...form, [id]: value, guia: "" });
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const handleSearchInputChange = async (event) => {
    const { name, value } = event.target;
    console.log(form, event, name, value);
    setForm({ ...form, [name]: [...value] });
  };

  const handleSwitchChange = (event) => {
    const { id, checked } = event.target;
    console.log(form, event.target, id, checked);
    setForm({ ...form, [id]: checked });
  };

  const onChange = (e, name = null, value = null) => {
    const inputName = name !== null ? name : e.target.name;
    const inputValue = value !== null ? value : e.target.value;

    setForm({ ...form, nIdActor: 0, [inputName]: inputValue });
  };

  const OnClearInput = (event) => {
    console.log(event);
  };

  const saveOrden = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    const data = {
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
      empresaId: form.empresaId === -1 ? null : form.empresaId,
      servicioId: form.servicioId === -1 ? null : form.servicioId,
      faseId: form.faseId === -1 ? null : form.faseId,
      ciudadOrigenId: form.ciudadOrigenId === -1 ? null : form.ciudadOrigenId,
      ciudadDestinoId:
        form.ciudadDestinoId === -1 ? null : form.ciudadDestinoId,
      mensajeroId: form.mensajeroId === -1 ? null : form.mensajeroId,
    };
    create(data)
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          const message = {
            title: "Creación Orden",
            msg: "",
            error: true,
          };
          console.log(response.data.message);
          dispatch(setMessage({ ...message, msg: response.data.message }));
          dispatch(setOpenModal(true));
          setLoading(false);
          setSubmitted(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const newUsuario = () => {
    console.log(form);
    setForm({ ...ordenForm, fechaRecepcion: moment(), fechaEntrega: moment() });
    setSubmitted(false);
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
        <Typography color="text.primary">Nueva orden</Typography>
      </Breadcrumbs>
      <Card
        title="Orden"
        icon={<Business sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-orden"
        className="text-start"
      >
        {submitted ? (
          <div>
            <h4>Se ha enviado correctamente!</h4>
            <button className="btn btn-success" onClick={newUsuario}>
              Agregar otra
            </button>
          </div>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={6} sm={6} xs={12}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={"es"}
              >
                <DesktopDatePicker
                  sx={{ width: "100% " }}
                  name="fechaRecepcion"
                  id="fechaRecepcion"
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
                  disablePast={true}
                  disabled={true}
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
                  name="fechaEntrega"
                  id="fechaEntrega"
                  label="Entrega"
                  inputFormat="YYYY-MM-DD"
                  renderInput={(params) => (
                    <TextField {...params} sx={{ width: "100%" }} />
                  )}
                  value={dayjs(form.fechaEntrega)}
                  onChange={(e) =>
                    onChange(
                      null,
                      "fechaEntrega",
                      moment(e["$d"]).format("YYYY-MM-DD")
                    )
                  }
                  disablePast={true}
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
                />
              </Grid>
              <Grid item className="sGitem">
                <TextField
                  id="remitente"
                  name="remitente"
                  label="Envia"
                  value={form.remitente}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
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
                />
              </Grid>
              <Grid item className="sGitem">
                <TextField
                  id="destinatario"
                  name="destinatario"
                  label="Recibe"
                  value={form.destinatario}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
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
                />
              </Grid>
            </Grid>
            {currentUser.auth?.roles.find((rol) => rol.name == "admin") !==
            undefined ? (
              <>
                <Grid item md={6} sm={6} xs={12}>
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
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
                  />
                </Grid>
              </>
            ) : (
              <Grid item md={12} sm={12} xs={12}>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            )}
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="producto"
                name="producto"
                label="Producto"
                value={form.producto}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
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
              />
            </Grid>
            {currentUser.auth?.roles.find((rol) => rol.name == "admin") !==
              undefined && (
              <>
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
                  />
                </Grid>
              </>
            )}
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
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12} className="text-start">
              <Button
                onClick={saveOrden}
                endIcon={<Save />}
                variant="contained"
                color="success"
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        )}
      </Card>
    </div>
  );
};

export default AddOrden;
