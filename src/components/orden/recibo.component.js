import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrdenDataService from "../../services/orden.service";
import FaseDataService from "../../services/fase.service";
import {
  Close,
  CloudUpload,
  EventNote,
  Info,
  ListAlt,
  QrCodeScanner,
  Save,
} from "@mui/icons-material";
import { Card } from "../Card";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  List,
  ListItem,
  ListItemText,
  Paper,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";
import { setMessage, setOpenModal } from "../../reducers/message";

import UsuarioDataService from "../../services/usuario.service";
import moment from "moment";
import { setLoading } from "../../reducers/ui";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Recibo = (props) => {
  const { guia } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { auth: currentUser } = useSelector((state) => state.auth);
  const [orden, setOrden] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [form, setForm] = useState({ incidencia: "", evidencias: [] });
  const [fileForm, setFile] = useState(null);
  const [imgID, setImageID] = useState([]);
  const [imgURL, setImageURL] = useState([]);
  const [checked, setChecked] = useState(false);
  const [incidenciasList, setIncidenciasList] = useState([]);

  useEffect(() => {
    console.log(currentUser, process.env.REACT_APP_IMG_URL);
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (guia !== "") {
      getOrdenByGuia(guia);
    }
  }, [guia]);

  const getOrdenByGuia = (guiaR) => {
    OrdenDataService.getByGuia(guiaR)
      .then((response) => {
        if (Object.keys(response.data).length > 0) {
          setOrden({ ...response.data });
          setImageID(
            response.data.Evidencias.map((i, v) => {
              return i.id;
            })
          );
          setImageURL(response.data.Evidencias);
          setIsLoad(true);
          setIncidenciasList(response.data.Incidencias);
        } else {
          const message = {
            title: "Orden",
            msg: "No se encontro una orden activa o correcta.",
            error: true,
          };
          dispatch(setMessage({ ...message }));
          dispatch(setOpenModal(true));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleInputChange = (event) => {
    console.log(event);
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleEvidencia = (event) => {
    const file = event.target.files;
    console.log(file);
    setFile(file);
  };

  const saveEvidencia = async (incidenciaList) => {
    console.log(fileForm, orden.id);
    let filesID = [];
    let filesURL = [];
    Array.from(fileForm).forEach(async (file) => {
      const response = await OrdenDataService.evidenciaInc(file, incidenciaList.id);
        /* .then((response) => { */
          console.log(response.data);
          console.log("Evidencia", response.data, incidenciaList);
          /* const pos = incidenciasList.findIndex((x) => x.id === incidenciaList.id);
          if (pos !== -1) { pos = 0; }
          console.log("Imagenes", pos, incidenciaList[pos]); */
          incidenciaList["evidencias"] = [
            response.data,
            ...incidenciaList["evidencias"],
          ];
          setIncidenciasList((incidenciasList) => [
            incidenciaList,
            ...incidenciasList,
          ]);
          console.log(incidenciasList,incidenciaList);
          dispatch(setLoading(false));
        /* })
        .catch((e) => {
          console.log(e);
        }); */
    });
    /* console.log(filesID, filesURL);
    setImageID([...filesID]);
    setImageURL([...filesURL]); */
  };

  const saveIncidencia = async (event) => {
    console.log(fileForm, orden.id);
    dispatch(setLoading(true));
    const data = {
      ordenId: orden.id,
      userId: currentUser.auth.id,
      descripcion: form.incidencia,
      fecha: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    const response = await OrdenDataService.incidencia(data);
      /* .then((response) => { */
        console.log(response.data);
        /* setIncidenciasList((incidenciasList) => [
          response.data,
          ...incidenciasList,
        ]); */
        saveEvidencia(response.data);
      /* })
      .catch((e) => {
        console.log(e);
      }); */
  };

  const handleChange = (event) => {
    setChecked(!checked);
  };

  return (
    <div idElement="recibo" style={{ width: "100%", margin: "0px auto" }}>
      <Card
        key="orden"
        title="Orden"
        icon={<ListAlt sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-orden"
        className="text-start"
      >
        <Grid container spacing={1}>
          {isLoad && (
            <Grid
              key={"reciboDetails"}
              container
              spacing={0}
              sx={{
                textAlign: "left",
                margin: "5px 10px",
                borderRadius: "5px 5px 0px 0px",
                width: "calc(100% - 20px)",
              }}
            >
              <Grid
                item
                xs={12}
                className="pdfItem"
                sx={{ borderRadius: "5px 5px 0px 0px" }}
              >
                {orden?.guia}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Fecha
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.fechaEntrega}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Servicio
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.Servicio.nombre}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Origen
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.origen}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Destino
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.destino}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Dirección
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.direccionOrigen}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Dirección
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.direccionDestino}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Envia
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.destinatario}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Recibe
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.remitente}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Telefono
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.telefonoDestinatario}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Telefono
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.telefonoRemitente}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Ciudad
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.ciudadOrigen.nombre}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Ciudad
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.ciudadDestino.nombre}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Producto
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.producto}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Costo
              </Grid>
              <Grid item xs={4} className="pdfValue">
                {orden?.precio}
              </Grid>
              <Grid item xs={2} className="pdfItem">
                Descripción
              </Grid>
              <Grid item xs={10} className="pdfValue">
                {orden?.descripcion}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Card>
      {loggedIn && (
        <Card
          key="incidencias"
          title="Evidencias"
          icon={<EventNote sx={{ color: "white", fontSize: "23px" }} />}
          openCollapse={true}
          idElement="datosGenerales-orden"
          className="text-start"
        >
          <Grid container spacing={1}>
            {/* <Grid item md={2} sm={2} xs={12} sx={{ margin: "auto 0" }}>
              <FormControlLabel
                control={<Switch checked={checked} onChange={handleChange} />}
                label="Hay incidencia"
              />
            </Grid> */}
            {
              <>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    id="incidencia"
                    name="incidencia"
                    label="Incidencia"
                    value={form.incidencia}
                    onChange={handleInputChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                    inputProps={{ step: 255, maxLength: 255 }}
                  />
                </Grid>
                {/* <Grid item md={4} sm={4} xs={12} sx={{ margin: "auto 0" }}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<EventNote />}
                    onClick={saveIncidencia}
                  >
                    Guardar incidencia
                  </Button>
                </Grid> */}
              </>
            }
          </Grid>
          <br />
          <Grid container spacing={1}>
            <Grid item md={8} sm={8} xs={12} sx={{ margin: "auto 0" }}>
              <TextField
                type="file"
                inputProps={{
                  multiple: true,
                  accept: "image/png, image/gif, image/jpeg",
                }}
                onChange={handleEvidencia}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12} sx={{ margin: "auto 0" }}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                onClick={saveIncidencia /* saveEvidencia */}
              >
                Guardar incidencia
              </Button>
            </Grid>

            <Grid item md={12} sm={12} sx={12}>
              <List dense={true}>
                {incidenciasList.map((item, key) => (
                  <>
                    <ListItem>
                      <ListItemText
                        primary={item.descripcion}
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "inline", fontWeight: '600', }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {item.usuario?.persona.fullName}:{" "}
                            </Typography>
                            {moment(
                              item.createdAt[item.fecha.length - 1] === "Z"
                                ? item.fecha.slice(0, -1)
                                : item.fecha
                            ).format("YYYY-MM-DD HH:mm:ss")}
                          </>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <Grid item md={12} sm={12} sx={12}>
                        <ImageList
                          sx={{ width: "100%", maxHeight: 450 }}
                          variant="quilted"
                          cols={3}
                          rowHeight={200}
                        >
                          {/* {imgURL.map((item, key) => ( */}
                          {item.evidencias.map((itemImg, keyImg) => (
                            <ImageListItem
                              key={`${key}-${itemImg.id}`}
                              sx={{ objectFit: "contain" }}
                            >
                              <img
                                srcSet={`${process.env.REACT_APP_IMG_URL}${itemImg.codigo}`}
                                src={`${process.env.REACT_APP_IMG_URL}${itemImg.codigo}`}
                                /* alt={item.title} */
                                loading="lazy"
                                style={{ objectFit: "contain" }}
                              />
                              <ImageListItemBar
                                title={itemImg.nombre}
                                subtitle={moment(
                                  itemImg.createdAt[
                                    itemImg.createdAt.length - 1
                                  ] === "Z"
                                    ? itemImg.createdAt.slice(0, -1)
                                    : itemImg.createdAt
                                ).format("YYYY-MM-DD hh:mm:ss")}
                                actionIcon={
                                  <IconButton
                                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                    aria-label={`info about ${itemImg.title}`}
                                  >
                                    <Info />
                                  </IconButton>
                                }
                              />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </Grid>
                    </ListItem>
                    <Divider variant="middle" component="li" />
                  </>
                ))}
              </List>
            </Grid>
          </Grid>
        </Card>
      )}
    </div>
  );
};

export default Recibo;
