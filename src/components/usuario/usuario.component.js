import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UsuarioDataService from "../../services/usuario.service";
import PersonaDataService from "../../services/persona.service";
import EmpresaDataService from "../../services/empresa.service";
import { usuarioForm } from "../../helpers/forms";
import Form from "react-bootstrap/Form";
import { Card } from "../Card";
import {
  AssignmentInd,
  Edit,
  Save,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Switch,
  TextField,
} from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";
import { SelectInput } from "../form/SelectInput";
import { setMessage, setOpenModal } from "../../reducers/message";

const Usuario = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(usuarioForm);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [personaSelect, setPersonaSelect] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState("");
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { msg } = useSelector((state) => state.message);

  const getUsuario = (id) => {
    UsuarioDataService.get(id)
      .then((response) => {
        response.data.roles = response.data.roles.map( role =>role.name)
        setForm(response.data);
        setEmpresaSelect(response.data.persona.empresa.nombre);
        console.log(response, response.data);
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
      PersonaDataService.getSelect()
        .then((response) => {
          console.log("persona", response);
          setPersonaSelect(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      setEdited(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getUsuario(id);
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

  const OnClearInput = (event) => {
    console.log(event);
    setEmpresaSelect("");
  };

  const handleEdited = () => {
    setEdited(!edited);
    console.log(form);
  };

  const handleSave = () => {
    console.log(form);
    const data = {
      id: form.id,
      username: form.username,
      password: form.password,
      reset_password: form.reset_password,
      active: form.active,
      roles: form.roles,
    };
    UsuarioDataService.update(data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const message = {
            title: "Actualización Usuario",
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
      <Card
        title="Usuario"
        icon={<AssignmentInd sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-cadenas"
        className="text-start"
      >
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
              disabled={edited}
            />
          </Grid>
          <Grid item md={3} sm={3} xs={12}>
            <FormControlLabel
              control={
                <Switch
                  id="active"
                  name="active"
                  checked={form.active}
                  onChange={handleSwitchChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Activo"
              labelPlacement="start"
              disabled={edited}
            />
          </Grid>
          <Grid item md={3} sm={3} xs={12}>
            <FormControlLabel
              control={
                <Switch
                  id="reset_password"
                  name="reset_password"
                  checked={form.reset_password}
                  onChange={handleSwitchChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Resetear Password"
              labelPlacement="start"
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <SelectInput
              data={[
                { value: "admin", text: "admin" },
                { value: "moderator", text: "moderator" },
                { value: "user", text: "user" },
              ]}
              multiple={true}
              value={form.roles}
              id={"roles"}
              name={"roles"}
              label={"Roles"}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              onChange={handleSearchInputChange}
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (
                        <Visibility color="success" />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={edited}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <SearchInput
              options={[
                { id: -1, fullName: "Seleccione una persona" },
                ...personaSelect,
              ]}
              value={form.personaId}
              placeholder={"Seleccione una persona"}
              id={"personaId"}
              name={"personaId"}
              label={"Persona"}
              getOptionLabel={"fullName"}
              getIndexLabel={"id"}
              onChange={handleInputChange}
              onClear={OnClearInput}
              disabled={edited}
            />
          </Grid>
          {/* <Grid item md={6} sm={6} xs={12}>
              <TextField
                value={empresaSelect}
                id={"empresaId"}
                name={"empresaId"}
                label={"Empresa"}
                getOptionLabel={"nombre"}
                getIndexLabel={"id"}
                fullWidth
                disabled
              />
            </Grid> */}
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
      </Card>
    </div>
  );
};

export default Usuario;
