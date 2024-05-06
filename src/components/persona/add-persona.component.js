import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PersonaDataService from "../../services/persona.service";
import EmpresaDataService from "../../services/empresa.service";
import { personaForm } from "../../helpers/forms";
import { Link } from "react-router-dom";
import { AccountCircle, Dashboard, ListAlt, Save } from "@mui/icons-material";
import { Card } from "../Card";
import { Box, Breadcrumbs, Button, Chip, Grid, TextField, Typography } from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";
import { ci } from "ecuador-validator";
import { setMessage, setOpenModal } from "../../reducers/message";

const AddPersona = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(personaForm);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { pages, rows } = useSelector((state) => state.ui);
  const [submitted, setSubmitted] = useState(false);
  const [empresaSelect, setEmpresaSelect] = useState([]);

  const handleInputChange = (event) => {
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
      EmpresaDataService.getSelect()
        .then((response) => {
          console.log("empresa", response);
          setEmpresaSelect(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const savePersona = (e) => {
    e.preventDefault();
    console.log(e.target.checkValidity(), !ci(form.identificacion) && form.empresaId > 0, !ci(form.identificacion), form.empresaId);

    if (!ci(form.identificacion) && (form.empresaId > 0 || form.empresaId === null)) {
      const message = {
        title: "Completar campos requeridos",
        msg: "Es necesario completar los campos requeridos",
        error: true,
      };
      dispatch(setMessage({ ...message }));
      dispatch(setOpenModal(true));
      return false;
    }

    var data = {
      nombres: form.nombres,
      apellidos: form.apellidos,
      identificacion: form.identificacion,
      email: form.email,
      telefono: form.telefono,
      estado: form.estado,
      empresaId: form.empresaId,
    };

    PersonaDataService.create(data)
      .then((response) => {
        const persona = response.data;
        console.log(persona);
        setForm({ ...form, id: persona.id, fullName: persona.fullName });
        setSubmitted(true);
        console.log(form);
      })
      .catch((e) => {
        console.log(e.response.data.message);
      });
  };

  const newPersona = () => {
    console.log(form);
    setForm(personaForm);
    setSubmitted(false);
  };

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{marginBottom: "10px"}}>
        <Chip
          icon={<Dashboard sx={{ color: "white !important" }} />}
          label="Dashboard"
          onClick={() => {
            navigate(`/`);
          }}
          sx={{background: "#3364FF", color: "white", padding: "2px 5px"}}
        />
        <Chip
          icon={<AccountCircle sx={{ color: "white !important" }} />}
          label="Persona"
          onClick={() => {
            navigate(`/persona?page=${pages+1}&rowsPerPage=${rows}`);
          }}
          sx={{background: "#3364FF", color: "white", padding: "2px 5px"}}
        />
        <Typography color="text.primary">Nueva persona</Typography>
      </Breadcrumbs>
      <Card
        title="Persona"
        icon={<AccountCircle sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-persona"
        className="text-start"
      >
        {submitted ? (
          <div>
            <h4>Se ha enviado correctamente!</h4>
            <p>{form.fullName}</p>
            <button className="btn btn-success" onClick={newPersona}>
              Add
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={savePersona} >
          <Grid container spacing={1}>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="nombres"
                name="nombres"
                label="Nombres"
                value={form.nombres}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="apellidos"
                name="apellidos"
                label="Apellidos"
                value={form.apellidos}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="identificacion"
                name="identificacion"
                label="Identificación"
                type="number"
                value={form.identificacion}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                inputProps= {{
                  maxLength: 10,
                  max: 10,
                }}
                helperText={
                  !ci(form.identificacion) && form.identificacion !== ""
                    ? "La cedula no es valida"
                    : ""
                }
                error={
                  form.identificacion !== "" ? !ci(form.identificacion) : false
                }
                required
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
                required={true}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12} className="text-start">
              <Button
                //onClick={savePersona}
                type="submit"
                endIcon={<Save />}
                variant="contained"
                color="success"
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

export default AddPersona;
