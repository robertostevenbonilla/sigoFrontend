import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usuarioForm } from "../../helpers/forms";
import { UserAuth } from "../../actions/auth";
import CiudadDataService from "../../services/ciudad.service";
import { Button, Container, Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Card } from "../Card";
import { AssignmentInd, HolidayVillage } from "@mui/icons-material";
import { setMessage, setOpenModal } from "../../reducers/message";

const AddCiudad = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signup } = UserAuth();
  const [form, setForm] = useState(usuarioForm);
  const [personaSelect, setPersonaSelect] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const saveCiudad = (e) => {
    e.preventDefault();
    setLoading(true);
    const dataAU = {
        codigo: form.codigo,
        nombre: form.nombre,
        descripcion: form.descripcion,
    };
    console.log(dataAU);
    CiudadDataService.create(dataAU)
      .then((response) => {
        console.log(response);
        if(response.status === 200 || response.status === 201) {
          const message = {
            title: "Creación Ciudad",
            msg: "",
            error: true,
          };
          console.log(response.data.message);
          dispatch(setMessage({ ...message, msg: "Se creo correctamente la ciudad" }));
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
    setForm(usuarioForm);
    setSubmitted(false);
  };

  return (
    
    <Card
      title="Ciudad"
      icon={<HolidayVillage sx={{ color: "white", fontSize: "23px" }} />}
      openCollapse={true}
      idElement="datosGenerales-ciudad"
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
              onClick={saveCiudad}
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
  );
};

export default AddCiudad;
