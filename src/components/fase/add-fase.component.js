import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { faseForm } from "../../helpers/forms";
import { UserAuth } from "../../actions/auth";
import FaseDataService from "../../services/fase.service";
import {
  Breadcrumbs,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Card } from "../Card";
import { Approval, Dashboard } from "@mui/icons-material";
import { setMessage, setOpenModal } from "../../reducers/message";

const AddFase = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signup } = UserAuth();
  const [form, setForm] = useState(faseForm);

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

  const saveFase = (e) => {
    e.preventDefault();
    setLoading(true);
    const dataAU = {
      id: form.id,
      codigo: form.codigo,
      nombre: form.nombre,
      color: form.color,
      showMensajero: form.showMensajero,
    };
    console.log(dataAU);
    FaseDataService.create(dataAU)
      .then((response) => {
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          const message = {
            title: "Creación Fase",
            msg: "",
            error: true,
          };
          console.log(response.data.message);
          dispatch(
            setMessage({ ...message, msg: "Se creo correctamente el estado" })
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
    setForm(faseForm);
    setSubmitted(false);
  };

  const handleSwitchChange = (event) => {
    const { id, checked } = event.target;
    console.log(form, event.target, id, checked);
    setForm({ ...form, [id]: checked });
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
          icon={<Approval sx={{ color: "white !important" }} />}
          label="Estado"
          onClick={() => {
            navigate(`/estado?page=${pages + 1}&rowsPerPage=${rows}`);
          }}
          sx={{ background: "#3364FF", color: "white", padding: "2px 5px" }}
        />
        <Typography color="text.primary">Nuevo estado</Typography>
      </Breadcrumbs>
      <Card
        title="Estado"
        icon={<Approval sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-fases"
        className="text-start"
      >
        {submitted ? (
          <div>
            <h4>Se ha enviado correctamente!</h4>
            <p>{form.nombre}</p>
            <button className="btn btn-success" onClick={newUsuario}>
              Add
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
                id="color"
                name="color"
                label="Color"
                value={form.color}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                type="color"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    id="showMensajero"
                    name="showMensajero"
                    checked={form.showMensajero}
                    onChange={handleSwitchChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Mensajero"
                labelPlacement="start"
                sx={{ margin: "auto" }}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12} className="text-start">
              <Button
                onClick={saveFase}
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

export default AddFase;
