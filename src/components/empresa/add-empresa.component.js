import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usuarioForm } from "../../helpers/forms";
import { UserAuth } from "../../actions/auth";
import PersonaDataService from "../../services/persona.service";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import { SearchInput } from "../form/AutoCompleteInput";
import {
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Card } from "../Card";
import { AssignmentInd, Business, Dashboard, Save } from "@mui/icons-material";
import { setMessage, setOpenModal } from "../../reducers/message";

const AddUsuario = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signup } = UserAuth();
  const [form, setForm] = useState(usuarioForm);
  const [ciudadSelect, setCiudadSelect] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { pages, rows } = useSelector((state) => state.ui);

  const handleInputChange = (event) => {
    console.log(event);
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    console.log(currentUser.isLoggedIn, currentUser);
    if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else if (currentUser.user?.reset_password === 1) {
      navigate("/changepassword");
    } else {
      CiudadDataService.getSelect()
        .then((response) => {
          console.log(response);
          setCiudadSelect(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const saveEmpresa = (e) => {
    e.preventDefault();
    setLoading(true);
    const dataAU = {
      codigo: form.codigo,
      nombre: form.nombre,
      identificacion: form.identificacion,
      email: form.email,
      telefono: form.telefono,
      celular: form.celular,
      direccion: form.direccion,
      ciudadId: form.ciudadId,
    };
    console.log(dataAU);
    EmpresaDataService.create(dataAU)
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          const message = {
            title: "Creación Empresa",
            msg: "",
            error: true,
          };
          console.log(response.data.message);
          dispatch(
            setMessage({ ...message, msg: "Se creo correctamente la empresa" })
          );
          dispatch(setOpenModal(true));
          setSubmitted(true);
        }
      })
      .catch((e) => {
        console.log(e /* .response.data.message */);
      });
  };

  const newUsuario = () => {
    console.log(form);
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
          icon={<Business sx={{ color: "white !important" }} />}
          label="Empresas"
          onClick={() => {
            navigate(`/empresa?page=${pages + 1}&rowsPerPage=${rows}`);
          }}
          sx={{ background: "#3364FF", color: "white", padding: "2px 5px" }}
        />
        <Typography color="text.primary">Nueva empresa</Typography>
      </Breadcrumbs>
      <Card
        title="Empresa"
        icon={<Business sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-cadenas"
        className="text-start"
      >
        {submitted ? (
          <div>
            <h4>Se ha enviado correctamente!</h4>
            <p>{form.fullName}</p>
            <button className="btn btn-success" onClick={newUsuario}>
              Agregar otra
            </button>
          </div>
        ) : (
          <Grid container spacing={1}>
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
              <TextField
                id="nombre"
                name="nombre"
                label="Nombre"
                value={form.nombre}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="identificacion"
                name="identificacion"
                label="Identificacion"
                value={form.identificacion}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
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
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="telefono"
                name="telefono"
                label="Telefono"
                value={form.telefono}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="celular"
                name="celular"
                label="Celular"
                value={form.celular}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="direccion"
                name="direccion"
                label="Direccion"
                value={form.direccion}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <SearchInput
                options={[
                  { id: -1, nombre: "Seleccione una ciudad" },
                  ...ciudadSelect,
                ]}
                value={form.ciudadId}
                placeholder={"Seleccione una ciudad"}
                id={"ciudadId"}
                name={"ciudadId"}
                label={"Ciudad"}
                getOptionLabel={"nombre"}
                getIndexLabel={"id"}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12} className="text-start">
              <Button
                onClick={saveEmpresa}
                endIcon={<Save />}
                variant="contained"
                color="success"
                className="align-middle"
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

export default AddUsuario;
