import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  OrdenDataService, 
} from "../../services/orden.service";
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
    create,
  } = OrdenDataService();

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
    if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else if (currentUser.user?.reset_password === 1) {
      navigate("/changepassword");
    } else {
      loadSelects();
      if (id) {
        getOrden(id);
      }
    }
  }, [id]);

  const handleInputChange = async (event) => {
    const { id, value } = event.target;
    if (id === "empresaId" && value > 0) {
      var response = await EmpresaDataService.findGuia(value)
        .catch((error) => {
          console.error(error);
        });
      response = response.data;
      var guia = response.codigo + (response.Guias * 1 + 1);
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
    setForm({ ...form, [name]: [...value] });
  };

  const handleSwitchChange = (event) => {
    const { id, checked } = event.target;
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
        if (response.status === 201) {
          const message = {
            title: "Creación Orden",
            msg: "",
            error: true,
          };
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
            <h4>Se ha creado correctamente.</h4>
            <Button
              color="primary"
              variant="contained"
              onClick={newUsuario}
              startIcon={<Edit />}
            >
              Agregar Otra Orden
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate("/orden")}
              startIcon={<ListAlt />}
            >
              Ver Todas las Ordenes
            </Button>
          </div>
        ) : (
          <form onSubmit={saveOrden}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="guia"
                  name="guia"
                  label="Guía"
                  variant="outlined"
                  fullWidth
                  value={form.guia}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SelectInput
                  id="empresaId"
                  label="Empresa"
                  value={form.empresaId}
                  options={empresaSelect}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SelectInput
                  id="servicioId"
                  label="Servicio"
                  value={form.servicioId}
                  options={servicioSelect}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SelectInput
                  id="faseId"
                  label="Fase"
                  value={form.faseId}
                  options={faseSelect}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SelectInput
                  id="ciudadOrigenId"
                  label="Ciudad Origen"
                  value={form.ciudadOrigenId}
                  options={ciudadSelect}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SelectInput
                  id="ciudadDestinoId"
                  label="Ciudad Destino"
                  value={form.ciudadDestinoId}
                  options={ciudadSelect}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <SelectInput
                  id="motorizadoId"
                  label="Motorizado"
                  value={form.motorizadoId}
                  options={motorizadoSelect}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DesktopDatePicker
                    id="fechaRecepcion"
                    label="Fecha Recepción"
                    value={dayjs(form.fechaRecepcion)}
                    onChange={(date) => setForm({ ...form, fechaRecepcion: date.format("YYYY-MM-DD") })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DesktopDatePicker
                    id="fechaEntrega"
                    label="Fecha Entrega"
                    value={dayjs(form.fechaEntrega)}
                    onChange={(date) => setForm({ ...form, fechaEntrega: date.format("YYYY-MM-DD") })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="origen"
                  name="origen"
                  label="Origen"
                  variant="outlined"
                  fullWidth
                  value={form.origen}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="destino"
                  name="destino"
                  label="Destino"
                  variant="outlined"
                  fullWidth
                  value={form.destino}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="direccionOrigen"
                  name="direccionOrigen"
                  label="Dirección Origen"
                  variant="outlined"
                  fullWidth
                  value={form.direccionOrigen}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="direccionDestino"
                  name="direccionDestino"
                  label="Dirección Destino"
                  variant="outlined"
                  fullWidth
                  value={form.direccionDestino}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="remitente"
                  name="remitente"
                  label="Remitente"
                  variant="outlined"
                  fullWidth
                  value={form.remitente}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="destinatario"
                  name="destinatario"
                  label="Destinatario"
                  variant="outlined"
                  fullWidth
                  value={form.destinatario}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="telefonoRemitente"
                  name="telefonoRemitente"
                  label="Teléfono Remitente"
                  variant="outlined"
                  fullWidth
                  value={form.telefonoRemitente}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="telefonoDestinatario"
                  name="telefonoDestinatario"
                  label="Teléfono Destinatario"
                  variant="outlined"
                  fullWidth
                  value={form.telefonoDestinatario}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={form.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="descripcion"
                  name="descripcion"
                  label="Descripción"
                  variant="outlined"
                  fullWidth
                  value={form.descripcion}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="novedades"
                  name="novedades"
                  label="Novedades"
                  variant="outlined"
                  fullWidth
                  value={form.novedades}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="costo"
                  name="costo"
                  label="Costo"
                  variant="outlined"
                  fullWidth
                  value={form.costo}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="precio"
                  name="precio"
                  label="Precio"
                  variant="outlined"
                  fullWidth
                  value={form.precio}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="producto"
                  name="producto"
                  label="Producto"
                  variant="outlined"
                  fullWidth
                  value={form.producto}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id="codigo"
                  name="codigo"
                  label="Código"
                  variant="outlined"
                  fullWidth
                  value={form.codigo}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AddOrden;
