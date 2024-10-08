import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { servicioForm } from "../../helpers/forms";
import { UserAuth } from "../../actions/auth";
import ServicioDataService from "../../services/servicio.service";
import { Breadcrumbs, Button, Chip, Container, Grid, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Card } from "../Card";
import { Dashboard, DisplaySettings } from "@mui/icons-material";
import { setMessage, setOpenModal } from "../../reducers/message";

const AddCiudad = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signup } = UserAuth();
  const [form, setForm] = useState(servicioForm);
  const [personaSelect, setPersonaSelect] = useState([]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth: currentUser } = useSelector((state) => state.auth);
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
    }
  }, []);

  const saveServicio = (e) => {
    e.preventDefault();
    setLoading(true);
    const dataAU = {
      id: form.id,
      codigo: form.codigo,
      nombre: form.nombre,
      descripcion: form.descripcion,
    };
    console.log(dataAU);
    ServicioDataService.create(dataAU)
      .then((response) => {
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          const message = {
            title: "Creación Servicio",
            msg: "",
            error: true,
          };
          console.log(response.data.message);
          dispatch(
            setMessage({ ...message, msg: "Se creo correctamente el servicio" })
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
    setForm(servicioForm);
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
          icon={<DisplaySettings sx={{ color: "white !important" }} />}
          label="Servicio"
          onClick={() => {
            navigate(`/servicio?page=${pages + 1}&rowsPerPage=${rows}`);
          }}
          sx={{ background: "#3364FF", color: "white", padding: "2px 5px" }}
        />
        <Typography color="text.primary">Nuevo servicio</Typography>
      </Breadcrumbs>
      <Card
        title="Servicio"
        icon={<DisplaySettings sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-servicio"
        className="text-start"
      >
        {submitted ? (
          <div>
            <h4>Se ha enviado correctamente!</h4>
            <p>{form.nombre}</p>
            <button className="btn btn-success" onClick={newUsuario}>
              Agregar otro
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
                id="descripcion"
                name="descripcion"
                label="Descripción"
                value={form.descripcion}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12} className="text-start">
              <Button
                onClick={saveServicio}
                endIcon={<SaveIcon />}
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

export default AddCiudad;
