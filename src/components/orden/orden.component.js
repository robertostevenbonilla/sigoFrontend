import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrdenDataService from "../../services/orden.service";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import ServicioDataService from "../../services/servicio.service";
import FaseDataService from "../../services/fase.service";
import { ordenForm } from "../../helpers/forms";
import { Card as CardContent } from "../Card";
import { AssignmentInd, Business, Edit, Save } from "@mui/icons-material";
import { Card, Button, Grid, Paper, TextField } from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";
import { SelectInput } from "../form/SelectInput";
import { setMessage, setOpenModal } from "../../reducers/message";
import moment from "moment";
import "dayjs/locale/es";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";

const Orden = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(ordenForm);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(true);
  const [ciudadSelect, setCiudadSelect] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState([]);
  const [servicioSelect, setServicioSelect] = useState([]);
  const [faseSelect, setFaseSelect] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { msg } = useSelector((state) => state.message);

  const getOrden = (id) => {
    OrdenDataService.get(id)
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
    FaseDataService.getSelect()
      .then((response) => {
        setFaseSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(currentUser.isLoggedIn, currentUser);
    if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else if (currentUser.user?.reset_password === 1) {
      navigate("/changepassword");
    } else {
      setEdited(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadSelects();
      getOrden(id);
    }
  }, [id]);

  const handleInputChange = async (event) => {
    const { id, value } = event.target;
    console.log(form, event.target, id, value);
    setForm({ ...form, [id]: value });
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

  const handleEdited = () => {
    console.log(form);
    setEdited(!edited);
  };

  const handleSave = () => {
    console.log(form);
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
      empresaId: form.empresaId,
      servicioId: form.servicioId,
      faseId: form.faseId,
      ciudadOrigenId: form.ciudadOrigenId,
      ciudadDestinoId: form.ciudadDestinoId,
    };
    OrdenDataService.update(data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const message = {
            title: "Actualización Orden",
            msg: "",
            error: true,
          };
          console.log(response.data.message);
          dispatch(setMessage({ ...message, msg: response.data.message }));
          dispatch(setOpenModal(true));
          setLoading(false);
          setEdited(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* const deletePersona = () => {
    PersonaDataService.delete(formPersona.id)
      .then((response) => {
        console.log(response.data);
        navigate("/persona");
      })
      .catch((e) => {
        console.log(e);
      });
  }; */

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <CardContent
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
                renderInput={(params) => <TextField {...params} sx={{width: '100%'}} />}
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
                renderInput={(params) => <TextField {...params} sx={{width: '100%'}} />}
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
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12} className="text-start">
            {edited ? (
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
        </Grid>
      </CardContent>
    </div>
  );
};

export default Orden;
