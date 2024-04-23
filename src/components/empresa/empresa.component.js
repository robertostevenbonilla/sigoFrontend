import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import { empresaForm } from "../../helpers/forms";
import { Card } from "../Card";
import {
  AssignmentInd,
  Business,
  Edit,
  Save,
} from "@mui/icons-material";
import {
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";
import { SelectInput } from "../form/SelectInput";
import { setMessage, setOpenModal } from "../../reducers/message";

const Empresa = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(empresaForm);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [ciudadSelect, setCiudadSelect] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState("");

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { msg } = useSelector((state) => state.message);

  const getEmpresa = (id) => {
    EmpresaDataService.get(id)
      .then((response) => {
        setForm(response.data);
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
        CiudadDataService.getSelect()
          .then((response) => {
            console.log("ciudad", response);
            setCiudadSelect(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      setEdited(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getEmpresa(id);
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
  };

  const handleEdited = () => {
    setEdited(!edited);
    console.log(form);
  };

  const handleSave = () => {
    console.log(form);
    const data = {
      id: form.id,
      codigo: form.codigo,
      nombre: form.nombre,
      identificacion: form.identificacion,
      email: form.email,
      telefono: form.telefono,
      celular: form.celular,
      direccion: form.direccion,
      ciudadId: form.ciudadId,
      costo: form.costo,
    }
    EmpresaDataService.update(data)
      .then((response) => {
        console.log(response);
        if(response.status === 200) {
          const message = {
            title: "Actualización Empresa",
            msg: "Empresa actualizada exitosamente",
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
          title="Empresa"
          icon={<Business sx={{ color: "white", fontSize: "23px" }} />}
          openCollapse={true}
          idElement="datosGenerales-cadenas"
          className="text-start"
        >
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
                disabled={edited}
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
                disabled={edited}
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
              <TextField
                id="celular"
                name="celular"
                label="Celular"
                value={form.celular}
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
                label="Costo"
                type="number"
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
                onClear={OnClearInput}
                disabled={edited}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                id="direccion"
                name="direccion"
                label="Direccion"
                value={form.direccion}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
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
        </Card>
    </div>
  );
};

export default Empresa;
