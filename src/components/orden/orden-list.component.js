import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrdenDataService from "../../services/orden.service";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import ServicioDataService from "../../services/servicio.service";
import FaseDataService from "../../services/fase.service";
import { styled } from "@mui/material/styles";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  AccountBox,
  Check,
  Dashboard,
  DeliveryDining,
  FilterAltOutlined,
  GridOn,
  ListAlt,
  Pages,
  Person,
  PictureAsPdf,
  Room,
  ScheduleSend,
  Today,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { loadingTable } from "../../reducers/ui";
import { SearchInput } from "../form/AutoCompleteInput";
import { ordenFilterForm } from "../../helpers/forms";
import jsPDF from "jspdf";

import { PdfPage } from "../form/PdfPage";
import { setMessage, setOpenModal } from "../../reducers/message";

import autoTable from "jspdf-autotable";
import logo from "./../../assets/logo-goya.png";
//import QRCode from "react-qr-code";
import HTMLComment from "../../hooks/HTMLComment";
import html2canvas from "html2canvas";
import UsuarioDataService from "../../services/usuario.service";
import { SelectInput } from "../form/SelectInput";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import xlsx, { read, utils, write } from "xlsx";
//import { setForm } from "../../reducers/filtro";
import { setForm, setFiltros, setShowFilters } from "../../reducers/filtro";
import { setPages, setRows } from "../../reducers/ui";

var doc = new jsPDF();

const columnsOrden = [
  /* {
    field: "id",
    headerName: "Id",
    flex: 1,
  }, */
  {
    field: "guia",
    headerName: "Guia",
  },
  {
    field: "origen",
    headerName: "Origen",
    type: "render",
    renderFunction: (row) => {
      return (
        <List dense={true}>
          <ListItem style={{ padding: "3px 0px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary={row.origen} />
          </ListItem>
          <ListItem style={{ padding: "3px 0px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <Room />
            </ListItemIcon>
            <ListItemText primary={row.ciudadOrigen?.nombre} />
          </ListItem>
        </List>
      );
    },
  },
  {
    field: "destino",
    headerName: "Destino",
    type: "render",
    renderFunction: (row) => {
      return (
        <List dense={true}>
          <ListItem style={{ padding: "3px 0px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary={row.destino} />
          </ListItem>
          <ListItem style={{ padding: "3px 0px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <Room />
            </ListItemIcon>
            <ListItemText primary={row.ciudadDestino?.nombre} />
          </ListItem>
        </List>
      );
    },
  },
  {
    field: "fechaRecepcion",
    headerName: "Fecha",
    //format: "date",
    type: "render",
    renderFunction: (row) => {
      return (
        <List style={{ padding: "3px 0px" }} dense={true}>
          <ListItem style={{ padding: "3px 0px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <Today />
            </ListItemIcon>
            <ListItemText
              style={{ width: "max-content" }}
              primary={row.fechaRecepcion}
            />
          </ListItem>
          <ListItem style={{ padding: "3px 0px" }}>
            <ListItemIcon style={{ minWidth: 30 }}>
              <ScheduleSend />
            </ListItemIcon>
            <ListItemText
              style={{ width: "max-content" }}
              primary={row.fechaEntrega}
            />
          </ListItem>
        </List>
      );
    },
  },
  /* 
  {
    field: "direccionOrigen",
    headerName: "Dirección Remitente",
    flex: 2,
  },
  {
    field: "direccionDestino",
    headerName: "Dirección Destinario",
    flex: 2,
  },
  {
    field: "remitente",
    headerName: "Remitente",
    flex: 2,
  },
  {
    field: "destinatario",
    headerName: "Destinatario",
    flex: 2,
  },
  {
    field: "telefonoRemitente",
    headerName: "Telefono Remitente",
    flex: 2,
  },
  {
    field: "telefonoDestinatario",
    headerName: "Telefono Destinatario",
    flex: 2,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 2,
  }, */
  /* {
    field: "descripcion",
    headerName: "Descripción",
    flex: 1,
  },
  {
    field: "novedades",
    headerName: "Novedades",
    flex: 1,
  }, */
  {
    field: "empresa",
    headerName: "Empresa",
    type: "render",
    renderFunction: (row) => {
      return row.Empresa?.nombre;
    },
  },
  {
    field: "servicio",
    headerName: "Servicio",
    type: "render",
    renderFunction: (row) => {
      return row.Servicio?.nombre;
    },
  },
  {
    field: "fase",
    headerName: "Estado",
    type: "render",
    renderFunction: (row) => {
      return row.Fase?.nombre;
    },
  },
  {
    field: "costo",
    headerName: "Costo",
    type: "price",
    numeric: true,
    style: { textAlign: "right" },
  },
  {
    field: "precio",
    headerName: "Precio",
    type: "price",
    numeric: true,
    style: { textAlign: "right" },
  },
  {
    field: "mensajero",
    headerName: "Mensajero",
    type: "render",
    renderFunction: (row) => {
      return (
        <>
          {row.mensajero ? (
            <List>
              <ListItem>
                <ListItemIcon style={{ minWidth: 30 }}>
                  <DeliveryDining />
                </ListItemIcon>
                {row.mensajero?.persona.fullName}
              </ListItem>
            </List>
          ) : (
            <></>
          )}
        </>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Creada",
    flex: 1,
    format: "datetime",
  },
  /* {
    field: "ciudadOrigen",
    headerName: "Ciudad Origen",
    flex: 2,
    type: "render",
    renderFunction: (row) => {
      return row.ciudadOrigen.nombre;
    },
  },
  {
    field: "ciudadDestino",
    headerName: "Ciudad Destino",
    flex: 2,
    type: "render",
    renderFunction: (row) => {
      return row.ciudadDestino.nombre;
    },
  }, */
];

const flexContainer = {
  display: "flex",
  flexDirection: "row",
  padding: 0,
};

const OrdenList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [ordenes, setOrdenes] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { isLoadingTable } = useSelector((state) => state.ui);
  const { filter: form } = useSelector((state) => state.filtro);
  const { filtros } = useSelector((state) => state.filtro);
  const { showFilters } = useSelector((state) => state.filtro);
  const { pages } = useSelector((state) => state.ui);
  const { rows } = useSelector((state) => state.ui);

  //const [formFilter, setForm] = useState(ordenFilterForm);
  //const [filtros, setFiltros] = useState("");
  //const [pages, setPages] = useState(1);
  //const [rows, setRows] = useState(10);

  const [ciudadSelect, setCiudadSelect] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState([]);
  const [servicioSelect, setServicioSelect] = useState([]);
  const [faseSelect, setFaseSelect] = useState([]);
  const [motorizadoSelect, setMotorizadoSelect] = useState([]);
  const [printPdf, setPrintPdf] = useState(false);

  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedObj, setSelectedObj] = useState([]);
  const [fileXLS, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [download, setDownload] = useState(false);
  const [downloadObj, setDownloadObj] = useState([]);

  const [reloadData, setReload] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogXLS, setOpenDialogXLS] = useState(false);
  const [morotizadoId, setMorotizadoId] = useState(-1);

  const loadSelects = async () => {
    CiudadDataService.getSelect()
      .then((response) => {
        setCiudadSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    EmpresaDataService.getSelect()
      .then((response) => {
        setEmpresaSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    ServicioDataService.getSelect()
      .then((response) => {
        setServicioSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    FaseDataService.getSelect()
      .then((response) => {
        setFaseSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(currentUser, location);
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      console.log("paginacion", pages, rows);
      retrieveOrdenes(pages+1,rows);
      loadMotirizados();
      loadSelects();
    }
  }, []);

  useEffect(() => {
    if (downloadObj.length > 0) {
      downloadPdf();
    }
  }, [downloadObj]);

  useEffect(() => {
    console.log(filtros);
    if (filtros !== "") {
      retrieveOrdenes(pages+1, rows);
    }
  }, [filtros]);

  const getFilters = async () => {
    if (!filtersLoaded) {
      setFiltersLoaded(true);
    }
  };

  const handleSelected = (items) => {
    setSelected(items);
  };

  const handleSelectedObj = (items) => {
    setSelectedObj(items);
  };

  const handleInputChange = async (event) => {
    const { id, value } = event.target;
    console.log(form, event.target, id, value);
    setForm({ ...form, [id]: value });
  };

  const handleSearchInputChange = async (event) => {
    let { name, value } = event.target;
    console.log(form, name, value);
    if (value.includes("-1")) value = [];
    if (name === "motorizadoIds") {
      dispatch(setForm({ ...form, ["motorizadoId"]: [...value] }));
    } else {
      dispatch(setForm({ ...form, [name]: [...value] }));
    }
  };

  const handleInputChangeM = async (event) => {
    const { id, value } = event.target;
    console.log(form, event.target, id, value);
    setMorotizadoId(value);
  };

  const retrieveOrdenes = (page = 0, size = 10) => {
    dispatch(loadingTable(true));
    console.log("retrieve",page,size);    
    console.log("retrieveOrdenes",pages,rows);
    OrdenDataService.getAll((page), size, filtros)
      .then((response) => {
        setOrdenes(response.data);
        dispatch(loadingTable(false));
      })
      .catch((e) => {
        console.log(e);
        dispatch(loadingTable(false));
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

  const downloadXLS = async () => {
    // Datos de ejemplo
    const data = [
      [
        "fechaEntrega",
        "origen",
        "direccionOrigen",
        "remitente",
        "telefonoRemitente",
        "ciudadOrigenId",
        "destino",
        "direccionDestino",
        "destinatario",
        "telefonoDestinatario",
        "ciudadDestinoId",
        "email",
        "costo",
        "producto",
        "precio",
        "descripcion",
      ],
      [
        'En el libro "Ciudades" puede encontrar las ciudades a donde puede realizar sus envios. En la columna Ciudad Origen y Ciudad destino ingresar el identificador de la misma.',
      ],
      // Agrega más filas según sea necesario
    ];

    // Crear un libro de Excel
    const workbook = utils.book_new();
    // Crear una hoja en el libro de Excel
    const worksheet = utils.aoa_to_sheet(data);

    // Definir opciones para la lista desplegable de ciudades
    const cities = ["Ciudad1", "Ciudad2", "Ciudad3"]; // Obtener estas opciones de la base de datos

    // Crear una regla de validación para las celdas de ciudades
    const citiesValidation = {
      sqref: "H2:H100", // Rango de celdas para aplicar la validación
      type: "list",
      formula1: '"' + cities.join(",") + '"',
    };

    // Aplicar la regla de validación a la hoja de cálculo
    //utils.sheet_set_validation(worksheet, citiesValidation);

    // Agregar la hoja al libro
    utils.book_append_sheet(workbook, worksheet, "Plantilla");
    let citiesList = await CiudadDataService.getSelect();
    citiesList = citiesList.data;
    const citiesData = [
      ["identificador", "Ciudad"],
      ...Object.keys(citiesList).map((key) => [
        citiesList[key].id,
        citiesList[key].nombre,
      ]),
    ];
    console.log("citiesData", citiesData);
    const citiesSheet = utils.aoa_to_sheet(citiesData);
    utils.book_append_sheet(workbook, citiesSheet, "Ciudades");

    // Convertir el libro a un archivo de Excel binario
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });

    // Crear un blob desde el archivo binario de Excel
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Crear un objeto URL para el blob
    const url = URL.createObjectURL(blob);

    // Crear un enlace invisible y hacer clic en él para iniciar la descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla.xlsx";
    a.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const content = document.querySelector("#reportTable");
    let contents = document.querySelectorAll(".qrPage");

    const pgFormat = {
      orientation: "p",
      unit: "px",
      format: [595, 841],
    };
    const doc = new jsPDF(pgFormat);

    /* doc.html(content, {
      callback: function (doc) {
        if (download) {
          doc.save(downloadObj[0].guia + ".pdf");
          setDownload(false);
          setDownloadObj([]);
        } else {
          doc.save("rutas.pdf");
          setSelected([]);
          setSelectedObj([]);
        }
      },
      html2canvas: { scale: 0.98 }, //0.215
      autoPaging: true,
    }); */

    contents.forEach(async (cont, index) => {
      /* await doc.html(contents[index], {
        callback: function (doc) {
          console.log(contents.length-1, index)
          if(contents.length-1 === index) {
            doc.save("rutas.pdf");
          } else {
            doc.addPage(pgFormat);
          }
        },
        html2canvas: { scale: 0.615 },
        autoPaging: true,
        y: (297*index)
      }); */
      console.log(cont);
      var scaleBy = 2;
      var w = 595;
      var h = 841;
      var canvas = document.createElement("canvas");
      canvas.width = w * scaleBy;
      canvas.height = h * scaleBy;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      var context = canvas.getContext("2d");
      context.scale(scaleBy, scaleBy);
      await html2canvas(cont, {
        canvas: canvas,
      }).then(function (canvas) {
        var wid = 595;
        var hgt = 841;
        var img = canvas.toDataURL(
          "image/png",
          (wid = canvas.width),
          (hgt = canvas.height)
        );
        var hratio = hgt / wid;
        /* var doc = new jsPDF('p','pt','a4'); */
        var width = doc.internal.pageSize.width;
        var height = width * hratio;
        doc.addImage(img, "PNG", 0, 0, width, height);
        if (contents.length - 1 === index) {
          console.log("save");
          doc.save("Test.pdf");
        } else {
          doc.addPage(pgFormat);
        }
      });
    });
  };

  const addMensajero = () => {
    console.log(selected);
    setOpenDialog(true);
  };

  const removeMensajero = () => {
    let guias = selectedObj.map((registro) => registro.guia);
    const dataM = {
      guias: guias,
      mensajeroId: null,
    };
    console.log(dataM);
    OrdenDataService.asignar(dataM)
      .then((response) => {
        const message = {
          title: "Mensajero",
          msg: "Mensajero quitado correctamente.",
          error: true,
        };
        dispatch(setMessage({ ...message }));
        dispatch(setOpenModal(true));
        setReload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveMotorizado = () => {
    let guias = selectedObj.map((registro) => registro.guia);
    const dataM = {
      guias: guias,
      mensajeroId: morotizadoId,
    };
    console.log(dataM);
    OrdenDataService.asignar(dataM)
      .then((response) => {
        setOpenDialog(false);
        const message = {
          title: "Mensajero",
          msg: "Mensajero asignado correctamente.",
          error: true,
        };
        dispatch(setMessage({ ...message }));
        dispatch(setOpenModal(true));
        setReload(true);
      })
      .catch((err) => {
        console.log(err);
        setOpenDialog(false);
      });
  };

  const getFiltered = () => {
    console.log(form);
    let filtered = "";
    Object.keys(form).forEach((key) => {
      console.log(key);
      if (key === "fechaDesde") {
        if (form[key] !== undefined) {
          filtered += "fechaRecepcion:gte:" + form[key] + ";";
        }
      } else if (key === "fechaHasta") {
        if (form[key] !== undefined) {
          filtered += "fechaRecepcion:lte:" + form[key] + ";";
        }
      } else {
        const ids = form[key].join(",");
        console.log(ids);
        if (ids !== "") filtered += key + ":in:" + ids + ";";
      }
    });
    console.log("filtros", filtered);
    dispatch(setFiltros(filtered));
  };

  var header = function (data) {
    doc.setFontSize(5);
    doc.addImage(
      "/assets/logo-goya.png",
      "JPEG",
      data.settings.margin.left,
      10,
      38,
      10
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      "Reporte de " + "PRUEBA".toLowerCase(),
      doc.internal.pageSize.width - 15,
      10,
      {
        align: "right",
      }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      "2023-12-01" + " a " + "2023-12-12",
      doc.internal.pageSize.width - 15,
      15,
      {
        align: "right",
      }
    );
    doc.setFontSize(8);
    doc.text("Red Efectiva SA de CV", 55, 11, {
      align: "left",
    });
    doc.text("Blvd. Antonio L. Rdz. 3058 Suite 201-A", 55, 14, {
      align: "left",
    });
    doc.text("Colonia Santa Maria", 55, 17, {
      align: "left",
    });
    doc.text("Monterrey, N.L. C.P. 64650", 55, 20, {
      align: "left",
    });

    //FOOTER
    const pageCount = doc.internal.getNumberOfPages();

    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica");
      doc.setFontSize(8);
      doc.text(
        "Página " + String(i) + " de " + String(pageCount),
        doc.internal.pageSize.width - 10,
        290,
        {
          align: "right",
        }
      );
    }
  };

  const handleCloseDialog = () => {
    setMorotizadoId(-1);
    setOpenDialog(false);
    setOpenDialogXLS(false);
  };

  const onChange = (e, name = null, value = null) => {
    const inputName = name !== null ? name : e.target.name;
    const inputValue = value !== null ? value : e.target.value;
    console.log(inputName, inputValue);
    dispatch(setForm({ ...form, [inputName]: inputValue }));
  };

  const addOrdenes = () => {
    setOpenDialogXLS(true);
  };

  const setXLSfile = (event) => {
    const file = event.target.files[0];
    console.log(file);
    setFile(file);
    setFileName(file.name);
  };

  const uploadXLS = () => {
    const file = fileXLS;
    console.log(file);
    let reader = new FileReader();

    reader.onload = async function (e) {
      let data = new Uint8Array(e.target.result);
      let workbook = read(data, {
        type: "array",
        raw: false,
        cellDates: true,
        dateNF: "yyyy-mm-dd",
      });
      // find the name of your sheet in the workbook first
      let worksheet = workbook.Sheets["Plantilla"];

      // convert to json format
      let jsonData = utils.sheet_to_json(worksheet, {
        raw: false,
        dateNF: "yyyy-mm-dd",
      });
      delete jsonData[0];
      let orden = await EmpresaDataService.findGuia(
        currentUser.auth.persona.empresaId
      ).catch((error) => {
        console.error(error);
      });
      orden = orden.data;
      let addGuia = 1;
      jsonData.forEach((obj, pos) => {
        obj.ciudadOrigenId = obj.ciudadOrigenId * 1;
        obj.ciudadDestinoId = obj.ciudadDestinoId * 1;
        obj.costo = obj.costo * 1;
        obj.precio = obj.precio * 1;
        obj.fechaRecepcion = moment().format("YYYY-MM-DD");
        obj.guia = orden.codigo + (orden.Guias * 1 + addGuia);
        obj.empresaId = currentUser.auth.persona.empresaId;
        obj.servicioId = servicioSelect.filter((x) => x.codigo === "STD")[0].id;
        obj.faseId = faseSelect.filter((x) => x.codigo === "CRD")[0].id;
        addGuia++;
      });
      jsonData = jsonData.filter(function (e) {
        return e;
      });
      console.log(jsonData);
      let bulkcreate = await OrdenDataService.bulkcreate(jsonData);
      console.log(bulkcreate);
      retrieveOrdenes(pages+1, rows);
      setOpenDialogXLS(false);
      setFile(null);
      setFileName("");
    };
    reader.readAsArrayBuffer(file);
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
          icon={<ListAlt sx={{ color: "white !important" }} />}
          label="Ordenes"
          onClick={() => {
            navigate(`/orden?page=${pages+1}&rowsPerPage=${rows}`);
          }}
          sx={{background: "#3364FF", color: "white", padding: "2px 5px"}}
        />
      </Breadcrumbs>
      <Card
        key="Ordenes"
        title="Ordenes"
        icon={<ListAlt sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        id="datosGenerales-ordenes"
        className="text-start"
      >
        <Dialog
          id="popupMotorizada"
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Estas seguro/a de asignar el motorizado? "}
          </DialogTitle>
          <DialogContent sx={{ paddingTop: "10px !important" }}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={12}>
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Cancelar
            </Button>
            <Button onClick={saveMotorizado} variant="contained">
              Quiero asignar el motorizado
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          id="popupUploadOrder"
          open={openDialogXLS}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Subir ordenes por lotes."}
          </DialogTitle>
          <DialogContent sx={{ paddingTop: "10px !important" }}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={12}>
                <TextField
                  type="file"
                  inputProps={{
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                  }}
                  onChange={setXLSfile}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Cancelar
            </Button>
            <Button onClick={uploadXLS} variant="contained">
              Subir archivo
            </Button>
          </DialogActions>
        </Dialog>
        <EnhancedTable
          table={{
            columns: columnsOrden,
            rows: ordenes.data,
            rowId: "id",
            pages: ordenes.pages,
            total: ordenes.total,
          }}
          noDataMessage={"Por el momento no existen registros."}
          view={true}
          onViewFunction={(id, row) => {
            //localStorage.setItem("filter", JSON.stringify({ ...form }));
            navigate(`/orden/${id}`);
          }}
          download={true}
          onDownloadFunction={(id, row) => {
            console.log("handleSelect ");
            setDownload(true);
            let data = [];
            data = data.concat(data, row);
            setDownloadObj(data);
          }}
          delete={true}
          showDeleteAlert={true}
          refreshData={reloadData}
          onRefreshData={() => {
            setReload(false);
          }}
          onDeleteFunction={async (id) => {
            console.log(id);
            const data = {
              id: id,
              estado: 0,
            };
            await OrdenDataService.update(data)
              .then((response) => {
                if (response.status === 200) {
                  const message = {
                    title: "Orden eliminada",
                    msg: "Orden eliminada correctamente.",
                    error: true,
                  };
                  dispatch(setMessage({ ...message }));
                  dispatch(setOpenModal(true));
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
          searchableKeys={[
            "fechaEntrega",
            "remitente",
            "destinatario",
            "email",
            "guia",
          ]}
          rowId={"id"}
          paginationServer={true}
          handlePagination={retrieveOrdenes}
          loading={isLoadingTable}
          getFilters={getFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          orderASC="asc"
          showCheckboxes={true}
          selected={selected}
          selectedObj={selectedObj}
          setSelected={handleSelected}
          setSelectedObj={handleSelectedObj}
          add={true}
          onAddFunction={() => {
            navigate("/orden/add");
          }}
          extraFilters={(resetPagination) => (
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{ padding: "15px", backgroundColor: "#d9d9d9" }}
            >
              <Grid item sm={1} xs={12}>
                Filtros:
              </Grid>
              <Grid item sm={9} xs={12}>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={3}>
                    <SelectInput
                      data={[
                        /* { id: -1, nombre: "Seleccione una ciudad" }, */
                        ...ciudadSelect,
                      ]}
                      multiple={true}
                      value={form.ciudadOrigenId}
                      id={"ciudadOrigenId"}
                      name={"ciudadOrigenId"}
                      label={"Ciudad Origen"}
                      input={
                        <OutlinedInput
                          id="select-multiple-cOrig"
                          placeholder="Ciudad Origen"
                        />
                      }
                      onChange={handleSearchInputChange}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      backgroundLabel={"#d9d9d9"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SelectInput
                      data={[
                        /* { id: -1, nombre: "Seleccione una ciudad" }, */
                        ...ciudadSelect,
                      ]}
                      multiple={true}
                      value={form.ciudadDestinoId}
                      placeholder={"Seleccione una ciudad"}
                      id={"ciudadDestinoId"}
                      name={"ciudadDestinoId"}
                      label={"Ciudad Destino"}
                      input={
                        <OutlinedInput
                          id="select-multiple-cDest"
                          placeholder="Ciudad Destino"
                        />
                      }
                      onChange={handleSearchInputChange}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      backgroundLabel={"#d9d9d9"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SelectInput
                      data={[
                        /* { id: -1, nombre: "Seleccione un estado" }, */
                        ...faseSelect,
                      ]}
                      multiple={true}
                      value={form.faseId}
                      placeholder={"Seleccione un estado"}
                      id={"faseId"}
                      name={"faseId"}
                      label={"Estado"}
                      input={
                        <OutlinedInput
                          id="select-multiple-estado"
                          placeholder="Estado"
                        />
                      }
                      onChange={handleSearchInputChange}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      backgroundLabel={"#d9d9d9"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SelectInput
                      data={[
                        /* { id: -1, nombre: "Seleccione un servicio" }, */
                        ...servicioSelect,
                      ]}
                      multiple={true}
                      value={form.servicioId}
                      placeholder={"Seleccione un servicio"}
                      id={"servicioId"}
                      name={"servicioId"}
                      label={"Servicio"}
                      input={
                        <OutlinedInput
                          id="select-multiple-servicio"
                          placeholder="Servicio"
                        />
                      }
                      onChange={handleSearchInputChange}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      backgroundLabel={"#d9d9d9"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SelectInput
                      data={[
                        /* { id: -1, nombre: "Seleccione una empresa" }, */
                        ...empresaSelect,
                      ]}
                      multiple={true}
                      value={form.empresaId}
                      placeholder={"Seleccione una empresa"}
                      id={"empresaId"}
                      name={"empresaId"}
                      label={"Empresa"}
                      input={
                        <OutlinedInput
                          id="select-multiple-empresa"
                          placeholder="Empresa"
                        />
                      }
                      onChange={handleSearchInputChange}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      backgroundLabel={"#d9d9d9"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SelectInput
                      data={[
                        /* { id: -1, fullname: "Seleccione un motorizado" }, */
                        ...motorizadoSelect,
                      ]}
                      multiple={true}
                      value={form.motorizadoId}
                      placeholder={"Seleccione un motorizado"}
                      id={"morotizadoIds"}
                      name={"motorizadoIds"}
                      label={"Motorizado"}
                      input={
                        <OutlinedInput
                          id="select-multiple-empresa"
                          placeholder="Empresa"
                        />
                      }
                      onChange={handleSearchInputChange}
                      getOptionLabel={"fullname"}
                      getIndexLabel={"id"}
                      backgroundLabel={"#d9d9d9"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale={"es"}
                    >
                      <DesktopDatePicker
                        sx={{ width: "100% " }}
                        label="Desde"
                        inputFormat="YYYY-MM-DD"
                        renderInput={(params) => (
                          <TextField {...params} sx={{ width: "100%" }} />
                        )}
                        value={dayjs(form.fechaDesde)}
                        disableFuture={true}
                        onChange={(e) =>
                          onChange(
                            null,
                            "fechaDesde",
                            moment(e["$d"]).format("YYYY-MM-DD")
                          )
                        }
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale={"es"}
                    >
                      <DesktopDatePicker
                        sx={{ width: "100% " }}
                        label="Hasta"
                        inputFormat="YYYY-MM-DD"
                        renderInput={(params) => (
                          <TextField {...params} sx={{ width: "100%" }} />
                        )}
                        value={dayjs(form.fechaHasta)}
                        disableFuture={true}
                        onChange={(e) =>
                          onChange(
                            null,
                            "fechaHasta",
                            moment(e["$d"]).format("YYYY-MM-DD")
                          )
                        }
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={2} xs={12} style={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  startIcon={<FilterAltOutlined />}
                  onClick={() => {
                    //resetPagination();
                    console.log(form);
                    getFiltered();
                  }}
                >
                  Filtrar
                </Button>
              </Grid>
            </Grid>
          )}
          selectedItemsButtons={
            <List style={flexContainer}>
              <ListItem>
                <Button
                  className="extraButton"
                  variant="contained"
                  startIcon={<DeliveryDining />}
                  onClick={() => {
                    addMensajero();
                  }}
                >
                  Asignar Mensajero
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  className="extraButton"
                  variant="contained"
                  startIcon={<DeliveryDining />}
                  onClick={() => {
                    removeMensajero();
                  }}
                  color="error"
                >
                  Quitar Mensajero
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  className="extraButton"
                  variant="contained"
                  startIcon={<PictureAsPdf />}
                  onClick={() => {
                    downloadPdf();
                  }}
                >
                  Imprimir
                </Button>
              </ListItem>
            </List>
          }
          setPages={setPages}
          setRows={setRows}
          extraButtons={
            <>
              <Grid item md={3} sm={3} xs={12}>
                <Button
                  variant="contained"
                  startIcon={<GridOn />}
                  onClick={downloadXLS}
                >
                  Plantilla Excel
                </Button>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <Button
                  variant="contained"
                  startIcon={<GridOn />}
                  onClick={addOrdenes}
                >
                  Subir ordenes
                </Button>
              </Grid>
            </>
          }
        />
      </Card>
      {selected.length > 0 && !download ? (
        <Grid
          sx={{ width: "590px", height: "840px", margin: "0 auto" }}
          /* style={{
            width: 0,
            height: 0,
            overflow: "hidden",
          }} */
        >
          {console.log("selectedObj", selectedObj)}
          <div>
            <PdfPage selectedObj={selectedObj} body={3} />
          </div>
        </Grid>
      ) : (
        <></>
      )}

      {download ? (
        <Grid
          sx={{ width: "590px", height: "840px", margin: "0 auto" }}
          /* style={{
            width: 0,
            height: 0,
            overflow: "hidden",
          }} */
        >
          {console.log("downloadObj", downloadObj)}
          <PdfPage selectedObj={downloadObj} body={3} />
        </Grid>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OrdenList;
