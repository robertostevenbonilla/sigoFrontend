import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrdenDataService from "../../services/orden.service";
import FaseDataService from "../../services/fase.service";
import { styled } from "@mui/material/styles";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import { Close, QrCodeScanner, Save } from "@mui/icons-material";
import { Card } from "../Card";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import { loadingTable } from "../../reducers/ui";
import { SearchInput } from "../form/AutoCompleteInput";
import { ordenFilterForm } from "../../helpers/forms";
import jsPDF from "jspdf";

import { PdfPage } from "../form/PdfPage";
import { setMessage, setOpenModal } from "../../reducers/message";

import UsuarioDataService from "../../services/usuario.service";
import { SelectInput } from "../form/SelectInput";

const AsignarXqr = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { isLoadingTable } = useSelector((state) => state.ui);
  const [motorizadoSelect, setMotorizadoSelect] = useState([]);
  const [morotizadoId, setMorotizadoId] = useState(-1);
  const [faseSelect, setFaseSelect] = useState([]);
  const [faseId, setFaseId] = useState(-1);
  const [guia, setGuia] = useState("");
  const [ordenes, setOrdenes] = useState({});

  useEffect(() => {
    console.log(currentUser, currentUser);
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      loadMotirizados();
      loadFase();
    }
  }, []);

  const getOrdenByGuia = (guiaR) => {
    OrdenDataService.getByGuia(guiaR)
      .then((response) => {
        let ordenGuia = [];
        ordenGuia[guiaR] = response.data;
        setOrdenes({ ...ordenes, ...ordenGuia });
        console.log(response.data, ordenes);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const loadFase = () => {
    FaseDataService.getSelect()
      .then((response) => {
        setFaseSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadMotirizados = () => {
    UsuarioDataService.motorizados()
      .then((response) => {
        setMotorizadoSelect(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChangeM = async (event) => {
    const { id, value } = event.target;
    console.log(event.target, id, value);
    setMorotizadoId(value);
  };

  const handleInputChangeF = async (event) => {
    const { id, value } = event.target;
    console.log(event.target, id, value);
    setFaseId(value);
  };

  const handleInputChange = async (event) => {
    const { id, value } = event.target;
    setGuia(value);
  };

  const handleQRread = async (event) => {
    const { id, value } = event.target;
    if (event.key === "Enter") {
      let guiaR = guia.replace(
        "httpÑ--sigo.goyaexpressdelivery.com-recibo-",
        ""
      );
      guiaR = guiaR.replace("http://sigo.goyaexpressdelivery.com/recibo/", "");
      getOrdenByGuia(guiaR);
      setGuia("");
    }
  };

  const handleCloseOrd = (ge) => {
    const { id, value } = ge.target;
    console.log("close", id, value);
    let ord = ordenes;
    delete ord[value];
    setOrdenes({ ...ord });
    console.log(ge, ordenes);
  };

  const listOrdenes = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 200,
            height: 160,
            textAlign: "left",
            overflow: "overlay",
            position: "relative",
          },
        }}
      >
        {Object.entries(ordenes)?.map((rowO, index) => {
          const row = rowO[1];
          return (
            <Paper id={row.guia} elevation={3} sx={{ padding: "10px" }}>
              <strong>Guia: </strong>
              {row.guia}
              <Button
                id={row.guia}
                name={row.guia}
                value={row.guia}
                aria-label="Close"
                ariaGuia={row.guia}
                onClick={handleCloseOrd}
                startIcon={<Close />}
                size="small"
                color="error"
                sx={{ position: "absolute", right: 0, top: 5 }}
              />
              <br />
              <strong>Fecha: </strong>
              {row.fechaEntrega}
              <br />
              <strong>Envia: </strong>
              {row.remitente}
              <br />
              <strong>Recibe: </strong>
              {row.destinatario}
              <br />
              <strong>Precio: </strong>
              {row.precio}
              <br />
              <strong>Costo: </strong>
              {row.costo}
              <br />
            </Paper>
          );
        })}
      </Box>
    );
  };

  const saveAsignar = () => {
    let guias = Object.keys(ordenes);
    const motorizado = morotizadoId === -1 ? null : morotizadoId;
    const fase = faseId === -1 ? null : faseId;
    const dataM = {
      guias: guias,
      mensajeroId: motorizado,
      estadoId: fase,
    };
    console.log(dataM);
    OrdenDataService.asignar(dataM)
      .then((response) => {
        const message = {
          title: "Mensajero",
          msg: "Mensajero asignado correctamente.",
          error: true,
        };
        dispatch(setMessage({ ...message }));
        dispatch(setOpenModal(true));
        setOrdenes({});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div idElement="asignar" style={{ width: "100%", margin: "0px auto" }}>
      <Card
        key="Asignar"
        title="Asignar"
        icon={<QrCodeScanner sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-asignar"
        className="text-start"
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} md={6}>
            <SearchInput
              options={[
                { id: -1, fullname: "Seleccione un motorizado" },
                ...motorizadoSelect,
              ]}
              value={morotizadoId}
              placeholder={"Seleccione un motorizado"}
              id={"morotizadoId"}
              name={"motorizadoId"}
              label={"Motorizado"}
              getOptionLabel={"fullname"}
              getIndexLabel={"id"}
              onChange={handleInputChangeM}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <SearchInput
              options={[
                { id: -1, nombre: "Seleccione un estado" },
                ...faseSelect,
              ]}
              value={faseId}
              placeholder={"Seleccione un estado"}
              id={"faseId"}
              name={"faseId"}
              label={"Estado"}
              getOptionLabel={"nombre"}
              getIndexLabel={"id"}
              onChange={handleInputChangeF}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              id="guia"
              name="guia"
              label="Guia"
              value={guia}
              onChange={handleInputChange}
              onKeyDown={handleQRread}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Button
              onClick={saveAsignar}
              endIcon={<Save />}
              variant="contained"
              color="success"
              sx={{margin: "auto 0"}}
            >
              Asignar
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            {Object.keys(ordenes).length > 0 && listOrdenes()}
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default AsignarXqr;
