import React, { useState, /*  useRef, */ useEffect } from "react";
import {
  useNavigate /* , useLocation, useSearchParams */,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Styles
import "./qrStyles.css";

// Qr Scanner
import QrScanner from "qr-scanner";
import QrFrame from "../../assets/qr-frame.svg";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
} from "@mui/material";
import { SearchInput } from "../form/AutoCompleteInput";
import { CheckCircle, Close, QrCodeScanner, Save } from "@mui/icons-material";
import { OrdenDataService } from "../../services/orden.service";
import { setMessage, setOpenModal } from "../../reducers/message";
import FaseDataService from "../../services/fase.service";
import UsuarioDataService from "../../services/usuario.service";
import { CardHeader } from "react-bootstrap";

const QrReader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { asignar, getByGuia, byFase } = OrdenDataService();

  let scannerNR = null;
  let orders = [];
  const { auth: currentUser } = useSelector((state) => state.auth);

  const [ordenes, setOrdenes] = useState([]);
  const [redding, setRedding] = useState(false);
  const [faseSelect, setFaseSelect] = useState([]);
  const [motorizadoSelect, setMotorizadoSelect] = useState([]);
  const [morotizadoId, setMorotizadoId] = useState(-1);
  const [faseId, setFaseId] = useState(-1);
  const [qrOn, setQrOn] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    console.log("length", ordenes);
  }, [ordenes]);

  const loadFase = () => {
    if (
      currentUser?.auth?.roles.find((rol) => rol.name === "mensajero") ===
      undefined
    ) {
      const mensajero =
        currentUser?.auth?.roles.find((rol) => rol.name === "mensajero") !==
        undefined
          ? true
          : false;
      FaseDataService.getSelect(mensajero)
        .then((response) => {
          setFaseSelect(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setFaseId(process.env.REACT_APP_FASE_RUTA);
    }
  };

  const loadMotirizados = () => {
    if (
      currentUser?.auth?.roles.find((rol) => rol.name === "mensajero") ===
      undefined
    ) {
      UsuarioDataService.motorizados()
        .then((response) => {
          setMotorizadoSelect(response.data);
          if (currentUser.auth?.roles[0].name === "mensajero") {
            setMorotizadoId(currentUser.auth.id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setMorotizadoId(currentUser.auth.id);
    }
  };

  const getOrdenByGuia = async (guiaR) => {
    if (guiaR === "") return false;
    console.log(
      "getOrdenByGuia",
      guiaR,
      ordenes,
      Object.keys(ordenes),
      Object.keys(ordenes).find((guia) => guia === guiaR)
    );
    if (Object.keys(ordenes).find((guia) => guia === guiaR) === undefined) {
      await getByGuia(guiaR)
        .then((response) => {
          if (Object.keys(response.data).length > 0) {
            let ordenGuia = [];
            ordenGuia[guiaR] = response.data;
            setOrdenes((prevGuias) => ({
              ...prevGuias,
              ...ordenGuia,
            }));
            const dataM = {
              guias: [guiaR],
              mensajeroId: morotizadoId,
              estadoId: process.env.REACT_APP_FASE_RUTA,
            };
            asignar(dataM)
              .then((response) => {
                /* const message = {
                  title: "Asignación",
                  msg: "Procesado correctamente.",
                  error: true,
                };
                dispatch(setMessage({ ...message }));
                dispatch(setOpenModal(true)); */
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            const message = {
              title: "Orden",
              msg: "No se encontro una orden activa o correcta.",
              error: true,
            };
            dispatch(setMessage({ ...message }));
            dispatch(setOpenModal(true));
          }
          //setRedding(false);
        })
        .catch((e) => {
          console.log(e);
          //setRedding(false);
        });
    }
  };

  const handleInputChangeM = async (event) => {
    const { id, value } = event.target;
    setMorotizadoId(value);
  };

  const handleInputChangeF = async (event) => {
    const { id, value } = event.target;
    setFaseId(value);
  };

  const handleCloseOrd = (ge) => {
    const dataM = {
      guias: ge,
      mensajeroId: null,
      estadoId: process.env.REACT_APP_FASE_ENTREGADO,
    };
    asignar(dataM)
      .then((response) => {
        const message = {
          title: "Asignación",
          msg: "Procesado correctamente.",
          error: true,
        };
        dispatch(setMessage({ ...message }));
        dispatch(setOpenModal(true));
        let ord = ordenes;
        ge.forEach((guia) => {
          delete ord[guia];
        })
        setSelected([]);
        setOrdenes(() => ({ ...ord }));
      })
      .catch((err) => {
        console.log(err);
      });
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
    asignar(dataM)
      .then((response) => {
        const message = {
          title: "Asignación",
          msg: "Procesado correctamente.",
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

  const handleClick = (event, name, row) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(
        selected,
        name
      ); 
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(
        selected.slice(1)
      );

    } else if (
      selectedIndex ===
      selected.length - 1
    ) {
      newSelected = newSelected.concat(
        selected.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const listOrdenes = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            margin: "5px",
            width: 222,
            height: 250,
            textAlign: "left",
            overflow: "none",
            position: "relative",
          },
        }}
      >
        {Object.entries(ordenes)?.map((rowO, index) => {
          const row = rowO[1];
          const isItemSelected = isSelected(row["guia"]);
          return boxOrden({ isItemSelected, row });
        })}
      </Box>
    );
  };

  const isSelected = (id) => {
    return selected?.indexOf(id) !== -1;
  };

  const boxOrden = (props) => {
    const { isItemSelected, row } = props;
    return (
      <Card id={row.guia} variant="outlined" sx={{ padding: "10px" }}>
        <CardHeader>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Checkbox
                color="primary"
                checked={isItemSelected}
                onClick={(event) => handleClick(event, row['guia'], row)}
                inputProps={{
                  "aria-labelledby": row['id'],
                }}
              />
            </Grid>
            {currentUser?.auth?.roles.find(
              (rol) => rol.name === "mensajero"
            ) !== undefined && (
              <Grid item xs={6} sx={{ textAlign: "right", margin: "auto 0" }}>
                <IconButton
                  id={row.guia}
                  name={row.guia}
                  value={row.guia}
                  aria-label="Close"
                  ariaGuia={row.guia}
                  onClick={() => {
                    handleCloseOrd([row.guia]);
                  }}
                  size="small"
                  color="#3364FF"
                  variant="contained"
                >
                  <CheckCircle color="success" />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </CardHeader>
        <CardContent sx={{ overflow: "overlay", padding: 0, height: "150px" }}>
          <strong>Guia: </strong>
          {row.guia}
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
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            sx={{ margin: "auto" }}
            onClick={() => {
              navigate(`/recibo/${row.guia}`);
            }}
          >
            Ver más
          </Button>
        </CardActions>
      </Card>
    );
  };

  // Result
  const [scannedResult, setScannedResult] = useState("");

  // Success
  const onScanSuccess = async (result) => {
    // 🖨 Print the "result" to browser console.
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    setScannedResult(result?.data);
    const guia = result?.data;
    let guiaR = guia.replace("httpÑ--sigo.goyaexpressdelivery.com-recibo-", "");
    guiaR = guiaR.replace("http://sigo.goyaexpressdelivery.com/recibo/", "");

    if (!redding) {
      setRedding(true);
      await getOrdenByGuia(guiaR);
    }
  };

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
    //console.log(err);
  };

  useEffect(() => {
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      loadMotirizados();
      loadFase();
      if (
        currentUser?.auth?.roles.find((rol) => rol.name === "mensajero") !==
        undefined
      ) {
        byFase().then((response) => {
          console.log(response.data);
          const ordenesList = response.data;
          const claves = ordenesList.map((orden) => orden.guia);
          let ordenesTmp = {};
          claves.forEach((obj, pos) => {
            ordenesTmp[obj] = ordenesList[pos];
          });
          setOrdenes(ordenesTmp);
        });
      }
      //if (document.getElementById("video") && !scanner.current) {
      if (true) {
        // 👉 Instantiate the QR Scanner
        //scanner.current
        scannerNR = new QrScanner(
          document.getElementById("video"),
          onScanSuccess,
          {
            onDecodeError: onScanFail,
            // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
            preferredCamera: "environment",
            // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
            highlightScanRegion: true,
            // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
            highlightCodeOutline: true,
            // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
            overlay: document.getElementById("qrBox") || undefined,
          }
        );

        // 🚀 Start QR Scanner
        scannerNR
          ?.start()
          .then(() => setQrOn(true))
          .catch((err) => {
            if (err) setQrOn(false);
          });
      }
    }

    /* return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    }; */
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <>
      <div className="qr-reader" style={{ height: "50%" }}>
        {/* QR */}
        <video id="video" /* ref={videoEl} */></video>
        <div
          id="qrBox"
          /* ref={qrBoxEl} */
          className="qr-box"
          style={{
            position: "absolute",
            height: "100%",
            top: 0,
          }}
        >
          <img
            src={QrFrame}
            alt="Qr Frame"
            /* width={256}
            height={256} */
            className="qr-frame"
          />
        </div>

        {/* Show Data Result if scan is success */}
        {scannedResult && (
          <p
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 99999,
              color: "white",
            }}
          >
            Scanned Result: {scannedResult}
          </p>
        )}
      </div>
      <div idElement="asignar" style={{ width: "100%", margin: "0px auto" }}>
        <Card
          key="Asignar"
          title="Asignar"
          icon={<QrCodeScanner sx={{ color: "white", fontSize: "23px" }} />}
          idElement="datosGenerales-asignar"
          className="text-start"
          sx={{ padding: "20px" }}
        >
          <Grid container spacing={1}>
            {currentUser?.auth?.roles.find(
              (rol) => rol.name === "admin" || rol.name === "supervisor"
            ) !== undefined && (
              <>
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
                <Grid item md={3} sm={3} xs={12} sx={{ margin: "auto 0" }}>
                  <Button
                    onClick={saveAsignar}
                    endIcon={<Save />}
                    variant="contained"
                    color="success"
                    sx={{ margin: "auto 0" }}
                  >
                    Asignar
                  </Button>
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={12}>
              {selected.length > 0 &&
                <Button 
                  color="success"
                  variant="contained"
                  onClick={() => {
                    handleCloseOrd(selected);
                  }}
                >
                  Finalizar entrega
                </Button>
              }
              {Object.keys(ordenes).length > 0 && listOrdenes()}
            </Grid>
          </Grid>
        </Card>
      </div>
    </>
  );
};

export default QrReader;
