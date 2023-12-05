import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { usuarioForm } from "../../helpers/forms";
import { UserAuth } from "../../actions/auth";
import PersonaDataService from "../../services/persona.service";
import { SearchInput } from "../form/AutoCompleteInput";
import { Button, Container, Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Card } from "../Card";
import { AssignmentInd } from "@mui/icons-material";

const AddUsuario = () => {
  const navigate = useNavigate();
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
      PersonaDataService.getSelect()
        .then((response) => {
          console.log(response);
          setPersonaSelect(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const saveUsuario = (e) => {
    e.preventDefault();
    setLoading(true);
    const dataAU = {
      username: form.username,
      password: form.password,
      personaId: form.personaId,
      roles: [form.roles],
    };
    console.log(dataAU);
    signup(dataAU)
      .then((response) => {
        console.log(response);
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
      title="Usuario"
      icon={<AssignmentInd sx={{ color: "white", fontSize: "23px" }} />}
      openCollapse={true}
      idElement="datosGenerales-cadenas"
      className="text-start"
    >
      {submitted ? (
        <div>
          <h4>Se ha enviado correctamente!</h4>
          <p>{form.fullName}</p>
          <button className="btn btn-success" onClick={newUsuario}>
            Add
          </button>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="username"
              name="username"
              label="Usuario"
              value={form.username}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="password"
              name="password"
              label="Password"
              value={form.password}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <SearchInput
              options={[{ id: -1, fullName: "Todos" }, ...personaSelect]}
              value={form.personaId}
              id={"personaId"}
              name={"personaId"}
              label={"Persona"}
              getOptionLabel={"fullName"}
              getIndexLabel={"id"}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <SearchInput
              options={[
                { id: "admin", rol: "admin" },
                { id: "moderator", rol: "moderator" },
                { id: "user", rol: "user" },
              ]}
              value={form.roles}
              id={"roles"}
              name={"roles"}
              label={"Roles"}
              getOptionLabel={"rol"}
              getIndexLabel={"id"}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12} className="text-start">
            <Button
              onClick={saveUsuario}
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

export default AddUsuario;
