import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FaseDataService from "../../services/fase.service";
import { faseForm } from "../../helpers/forms";
import { Card } from "../Card";
import {
  Approval,
  Edit,
  Save,
} from "@mui/icons-material";
import {
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { setMessage, setOpenModal } from "../../reducers/message";

const Fase = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(faseForm);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(true);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { msg } = useSelector((state) => state.message);

  const getFase = (id) => {
    FaseDataService.get(id)
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
      setEdited(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getFase(id);
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
    }
    FaseDataService.update(data)
      .then((response) => {
        console.log(response);
        if(response.status === 200) {
          const message = {
            title: "Actualización Estado",
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
          title="Estado"
          icon={<Approval sx={{ color: "white", fontSize: "23px" }} />}
          openCollapse={true}
          idElement="datosGenerales-estado"
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

export default Fase;