import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PersonaDataService from "../../services/persona.service";
import EmpresaDataService from "../../services/empresa.service";
import { setMessage, setOpenModal } from "../../reducers/message";
import { personaForm } from "../../helpers/forms";
import { withRouter } from "../../common/with-router";
import Form from "react-bootstrap/Form";
import { Card } from "../Card";
import { AccountCircle, Edit, Save } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";

const Persona = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(personaForm);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(true);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const [empresaSelect, setEmpresaSelect] = useState([]);

  const getPersona = (id) => {
    PersonaDataService.get(id)
      .then((response) => {
        setForm(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
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

  useEffect(() => {
    if (id) {
      getPersona(id);
    }
  }, [id]);

  const handleInputChange = async (event) => {
    const { id, value } = event.target;
    console.log(form, event.target, id, value);
    setForm({ ...form, [id]: value });
  };

  const handleEdited = () => {
    setEdited(false);
  };

  const updatePersona = () => {
    console.log(form);
    setLoading(true);
    const dataSent = { ...form };
    delete dataSent.fullName;
    delete dataSent.empresa;

    PersonaDataService.update(dataSent)
      .then((response) => {
        const message = {
          title: "Actualización Persona",
          msg: "",
          error: true,
        };
        console.log(response.data.message);
        dispatch(setMessage({ ...message, msg: response.data.message }));
        dispatch(setOpenModal(true));
        setLoading(false);
        setEdited(true);
      })
      .catch((e) => {
        console.log(e.response.data.message);
        /* dispatch(setMessage({ ...message, msg: e.response.data.message }));
        dispatch(setOpenModal(true)); */
        setLoading(false);
      });
  };

  const deletePersona = () => {
    PersonaDataService.delete(form.id)
      .then((response) => {
        console.log(response.data);
        navigate("/persona");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Card
        title="Persona"
        icon={<AccountCircle sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-persona"
        className="text-start"
      >
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
                disabled={edited}
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
                disabled={edited}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                id="identificacion"
                name="identificacion"
                label="Identificación"
                value={form.identificacion}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={edited}
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
                disabled={edited}
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
                disabled={edited}
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
                onClick={updatePersona}
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
      </Card>
    </div>
  );
};

export default Persona;
