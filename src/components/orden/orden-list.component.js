import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrdenDataService from "../../services/orden.service";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import ServicioDataService from "../../services/servicio.service";
import FaseDataService from "../../services/fase.service";
import EnhancedTable from "../table/table";
import {
  AccountBox,
  Approval,
  ContentCopy,
  Dashboard,
  DeliveryDining,
  ErrorOutline,
  FilterAltOffOutlined,
  FilterAltOutlined,
  GridOn,
  ListAlt,
  PictureAsPdf,
  Room,
  ScheduleSend,
  SummarizeOutlined,
  TaskAlt,
  Today,
  TrackChanges,
  WhatsApp,
} from "@mui/icons-material";
import {
  Breadcrumbs,
  Button,
  Card,
  Chip,
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
  TextField,
  Tooltip,
} from "@mui/material";
import { loadingTable } from "../../reducers/ui";
import { SearchInput } from "../form/AutoCompleteInput";
import { ordenFilterForm } from "../../helpers/forms";
import jsPDF from "jspdf";

import { setMessage, setOpenModal } from "../../reducers/message";

import html2canvas from "html2canvas";
import UsuarioDataService from "../../services/usuario.service";
import { SelectInput } from "../form/SelectInput";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import { read, utils, write } from "xlsx";
import { setForm, setFiltros, setShowFilters } from "../../reducers/filtro";
import { setPages, setRows, setLoading } from "../../reducers/ui";
import AuthDataService from "../../services/auth.service";

var doc = new jsPDF();

const columnsOrden = [
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
  {
    field: "novedad",
    headerName: "Novedad",
    type: "render",
    renderFunction: (row) => {
      return row.Incidencias.length > 0 ? (
        <List>
          <ListItem>
            <ListItemIcon style={{ minWidth: 30 }}>
              <ErrorOutline sx={{ color: "#ffdd29" }} />
            </ListItemIcon>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem>
            <ListItemIcon style={{ minWidth: 30 }}>
              <TaskAlt color="success" />
            </ListItemIcon>
          </ListItem>
        </List>
      );
    },
  },
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
  const [searchParams] = useSearchParams();

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
  const [showReport, setShowReport] = useState(true);

  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedObj, setSelectedObj] = useState([]);
  const [fileXLS, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [download, setDownload] = useState(false);
  const [downloadObj, setDownloadObj] = useState([]);

  const [reloadData, setReload] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogA, setOpenDialogA] = useState(false);
  const [openDialogXLS, setOpenDialogXLS] = useState(false);
  const [openDialogReport, setOpenDialogReport] = useState(false);
  const [openDialogFase, setOpenDialogFase] = useState(false);
  const [motorizadoId, setMotorizadoId] = useState(-1);
  const [empresaUpId, setEmpresaUpId] = useState(-1);
  const [faseUpId, setFaseUpId] = useState(-1);
  const [audits, setAudit] = useState([]);

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
  };

  useEffect(() => {
    console.log(currentUser, location);
    const innerPage =
      parseInt(searchParams.get("page") ? searchParams.get("page") : 1) - 1;
    const innerRowsPerPage = parseInt(
      searchParams.get("rowsPerPage") ? searchParams.get("rowsPerPage") : 10
    );
    dispatch(setPages(innerPage));
    dispatch(setRows(innerRowsPerPage));
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      const innerPage =
        parseInt(searchParams.get("page") ? searchParams.get("page") : 1) - 1;
      const innerRowsPerPage = parseInt(
        searchParams.get("rowsPerPage") ? searchParams.get("rowsPerPage") : 10
      );
      dispatch(setPages(innerPage));
      dispatch(setRows(innerRowsPerPage));
      console.log("paginacion1", pages, rows);
      retrieveOrdenes(innerPage + 1, innerRowsPerPage);
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
    console.log("filtros", filtros, pages, rows);
    if (filtros !== "") {
      setSelected([]);
      setSelectedObj([]);
      setOrdenes([]);
      retrieveOrdenes(pages + 1, rows);
      if (filtros === "none") {
        dispatch(setFiltros(""));
      } else {
        setShowReport(false);
      }
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

  const handleSearchInputChange = async (event) => {
    let { name, value } = event.target;
    console.log(form, name, value);
    if (value.includes("-1")) {
      value = [];
    }
    if (name === "mensajeroId") {
      dispatch(setForm({ ...form, ["mensajeroId"]: [...value] }));
    } else {
      dispatch(setForm({ ...form, [name]: [...value] }));
    }
  };

  const handleInputChangeM = async (event) => {
    const { id, value } = event.target;
  console.log('handleInputChangeM',form, event.target, id, value);
    switch (id) {
      case "motorizadoId":
        setMotorizadoId(value);
        break;
      case "fasePId":
        setFaseUpId(value);
        break;
    }
  };

  const retrieveOrdenes = (page = 0, size = 10) => {
    dispatch(loadingTable(true));
    OrdenDataService.getAll(page, size, filtros, "fechaEntrega:desc")
      .then((response) => {
        setOrdenes(response.data);
        dispatch(loadingTable(false));
      })
      .catch((e) => {
        console.log(e);
        //AuthDataService.refreshToken()
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
        "codigo",
        "destino",
        "direccionDestino",
        "destinatario",
        "telefonoDestinatario",
        "ciudadDestinoId",
        "email",
        "producto",
        "precio",
        "descripcion",
      ],
      [
        'En el libro "Ciudades" puede encontrar las ciudades a donde puede realizar sus envios. En la columna Ciudad destino ingresar el identificador de la misma.(No borrar comentario)',
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

  const downloadPdf = async () => {
    dispatch(setLoading(true));
    await getPdfFile(selected);
  };

  const getPdfFile = async (orders) => {
    OrdenDataService.getReporteGuia(orders)
      .then((reporte) => {
        let fileName =
          "reporte" + moment().format("YYYY-MM-DD-HH:mm:ss.SS") + ".pdf";
        console.log(reporte);

        const url = URL.createObjectURL(reporte.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        dispatch(setLoading(false));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const downloadPdf1 = () => {
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

  const addFase = () => {
    setOpenDialogFase(true);
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
      mensajeroId: motorizadoId,
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

  const saveFase = () => {
    let guias = selectedObj.map((registro) => registro.guia);
    const dataM = {
      guias: guias,
      estadoId: faseUpId,
      mensajeroId: null,
    };
    console.log(dataM);
    OrdenDataService.asignar(dataM)
      .then((response) => {
        setOpenDialogFase(false);
        const message = {
          title: "Estado",
          msg: "Estado asignado correctamente.",
          error: true,
        };
        dispatch(setMessage({ ...message }));
        dispatch(setOpenModal(true));
        setReload(true);
        setFaseUpId(-1);
        document.getElementsByTagName('body')[0]?.style.removeProperty('overflow')
        document.getElementsByTagName('body')[0]?.style.removeProperty('padding-right')
      })
      .catch((err) => {
        console.log(err);
        setOpenDialogFase(false);
      });
  };

  const getFiltered = () => {
    dispatch(setPages(0));
    let filtered = "";
    Object.keys(form).forEach((key) => {
      if (key === "fechaDesde") {
        console.log("1", key, form[key]);
        if (form[key] !== undefined && form[key] !== null) {
          filtered += "fechaRecepcion:gte:" + form[key] + ";";
        }
      } else if (key === "fechaHasta") {
        console.log("2", key, form[key]);
        if (form[key] !== undefined && form[key] !== null) {
          filtered += "fechaRecepcion:lte:" + form[key] + ";";
        }
      } else {
        const ids = form[key].join(",");
        if (ids !== "") filtered += key + ":in:" + ids + ";";
      }
    });
    console.log("filtros", filtered);
    dispatch(setFiltros(filtered));
    //retrieveOrdenes(pages+1, rows);
  };

  const handleCloseDialog = () => {
    setMotorizadoId(-1);
    setFaseUpId(-1);
    setAudit([]);
    setOpenDialog(false);
    setOpenDialogXLS(false);
    setOpenDialogReport(false);
    setOpenDialogFase(false);
    setOpenDialogA(false);
  };

  const onChange = (e, name = null, value = null) => {
    const inputName = name !== null ? name : e?.target.name;
    const inputValue = value !== null ? value : e?.target.value;
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
    if (file === null) {
      const message = {
        title: "Subir ordenes",
        msg: "Seleccione un archivo.",
        error: true,
      };
      dispatch(setMessage({ ...message }));
      dispatch(setOpenModal(true));
      return false;
    }
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
      let empresaGuiaId = empresaUpId;
      if (
        currentUser.auth?.roles.find(
          (rol) => rol.name === "admin" || rol.name === "mensajero"
        ) === undefined
      ) {
        empresaGuiaId = currentUser.auth.persona.empresaId;
      }
      let orden = await EmpresaDataService.findGuia(empresaGuiaId).catch(
        (error) => {
          console.error(error);
        }
      );
      let telefono,
        direccionOrigen,
        remitente,
        ciudadOrigen,
        costo,
        empresaId,
        empresaOrden;
      if (currentUser.auth?.roles[0].name === "admin") {
        empresaOrden = await EmpresaDataService.get(empresaUpId).catch(
          (error) => {
            console.error(error);
          }
        );
        empresaOrden = empresaOrden.data;
        console.log(empresaOrden);
        telefono =
          empresaOrden.telefono !== null
            ? empresaOrden.telefono
            : empresaOrden.celular;
        direccionOrigen = empresaOrden.direccion;
        remitente = empresaOrden.nombre;
        ciudadOrigen = empresaOrden.Ciudad.id;
        costo = empresaOrden.costo;
        empresaId = empresaOrden.id;
      } else {
        telefono =
          currentUser.auth.persona.empresa.telefono !== null
            ? currentUser.auth.persona.empresa.telefono
            : currentUser.auth.persona.empresa.celular;
        direccionOrigen = currentUser.auth.persona.empresa.direccion;
        remitente = currentUser.auth.persona.fullName;
        ciudadOrigen = currentUser.auth.persona.empresa.Ciudad.id;
        costo = currentUser.auth.persona.empresa.costo;
        empresaId = currentUser.auth.persona.empresaId;
      }
      orden = orden.data;
      let addGuia = 1;
      let bulkcreate = null;
      jsonData.forEach((obj, pos) => {
        obj.origen = direccionOrigen;
        obj.direccionOrigen = direccionOrigen;
        obj.remitente = remitente;
        obj.ciudadOrigenId = ciudadOrigen;
        obj.costo = costo;
        obj.empresaId = empresaId;

        obj.telefonoRemitente = telefono;
        obj.ciudadDestinoId = obj.ciudadDestinoId * 1;
        obj.precio = obj.precio * 1;
        obj.fechaRecepcion = moment().format("YYYY-MM-DD");
        obj.fechaEntrega = moment().add(1, "days").format("YYYY-MM-DD");
        obj.guia = orden.codigo + (orden.Guias * 1 + addGuia);
        obj.servicioId = servicioSelect.filter((x) => x.codigo === "STD")[0].id;
        obj.faseId = faseSelect.filter((x) => x.codigo === "CRD")[0].id;
        addGuia++;
      });
      jsonData = jsonData.filter(function (e) {
        return e;
      });
      //return false;
      bulkcreate = await OrdenDataService.bulkcreate(jsonData);
      console.log(bulkcreate);
      retrieveOrdenes(pages + 1, rows);
      setOpenDialogXLS(false);
      setFile(null);
      setFileName("");
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadReporte = (tipo = "completo", formato = "pdf") => {
    console.log("downloadReporte", tipo, formato);
    dispatch(setLoading(true));
    OrdenDataService.getReporte(tipo, formato, filtros)
      .then((reporte) => {
        if (formato === "excel") formato = "xlsx";
        let fileName =
          "reporte" +
          tipo +
          moment().format("YYYY-MM-DD HH:mm:ss SS") +
          "." +
          formato;

        const url = URL.createObjectURL(reporte.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        dispatch(setLoading(false));
      })
      .catch((e) => {
        console.log(e);
        dispatch(setLoading(false));
      });
  };

  const showRowButtons = (id, row) => {
    return (
      <>
        <Tooltip title="Copiar" placement="top">
          <IconButton
            size="small"
            onClick={async () => {
              let text = `******\nGuía: ${row.guia}\n`;
              //if(row.codigo !== null)
              text += `Codigo: ${row.codigo}\n`;
              text += `Fecha orden: ${row.fechaRecepcion}\n`;
              text += `Origen: ${row.origen}\n`;
              text += `Ciudad Origen: ${row.ciudadOrigen.nombre}\n`;
              text += `Direccion:  ${row.direccionOrigen}\n`;
              text += `Envia: ${row.remitente}\n`;
              text += `Telefono: ${row.telefonoRemitente}\n`;
              text += `----\n`;
              text += `Producto: ${row.producto}\n`;
              text += `Costo: ${row.precio}\n`;
              text += `----\n`;
              text += `Destino: ${row.destino}\n`;
              text += `Ciudad Destino: ${row.ciudadDestino.nombre}\n`;
              text += `Direccion: ${row.direccionDestino}\n`;
              text += `Destinatario: ${row.destinatario}\n`;
              text += `Telefono: ${row.telefonoDestinatario}\n`;
              try {
                const permissions = await navigator.permissions.query({
                  name: "clipboard-write",
                });
                if (
                  permissions.state === "granted" ||
                  permissions.state === "prompt"
                ) {
                  await navigator.clipboard.writeText(text);
                  //alert('Text copied to clipboard!');
                } else {
                  throw new Error(
                    "Can't access the clipboard. Check your browser permissions."
                  );
                }
              } catch (error) {
                alert("Error al tratar de copiar:", error);
              }
            }}
          >
            <ContentCopy fontSize={"small"} sx={{ color: "#FFB74D" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="WhatsApp" placement="top">
          <IconButton
            size="small"
            onClick={() => {
              console.log(id, row);
              let link = `https://api.whatsapp.com/send?phone=${row.telefonoDestinatario}`;
              link += `&text=Buen+día,+servicio+de+mensajería+le+saluda,+para+informarle+que+tenemos+una+entrega+para+usted+de+*${row.producto}*.%0A`;
              link += `Por+el+valor+de+*%24${row.precio}*%0ARealizado+por+la+tienda+*${row.remitente}*.%0AMe+confirma+su+recepción+el+día+de+hoy`;
              link += `,+y+me+ayuda+con+su+ubicación+*GPS*+para+coordinar+la+entrega.`;
              window.open(link, "_blank");
              /* props.showDeleteAlert
              ? triggerDeleteDialog(id, row)
              : deleteItem(id, row);
              https://api.whatsapp.com/send?phone=$WHATSAPP&text=Buen+día,+servicio+de+mensajería+le+saluda,+para+informarle+que+tenemos+una+entrega+para+su+persona+de+$PRODUCTO.+Por+el+valor+de+$PRECIO....+Realizado+por+la+tienda+$CLIENTE.+Me+confirma+su+recepción+el+día+de+hoy
            */
            }}
          >
            <WhatsApp fontSize={"small"} sx={{ color: "#25d366" }} />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "10px" }}>
        <Chip
          icon={<Dashboard sx={{ color: "white !important" }} />}
          label="Dashboard"
          onClick={() => {
            navigate(`/`);
          }}
          sx={{ background: "#3364FF", color: "white", padding: "2px 5px" }}
        />
        <Chip
          icon={<ListAlt sx={{ color: "white !important" }} />}
          label="Ordenes"
          onClick={() => {
            navigate(`/orden?page=${pages + 1}&rowsPerPage=${rows}`);
          }}
          sx={{ background: "#3364FF", color: "white", padding: "2px 5px" }}
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
          id="popupHistorial"
          open={openDialogA}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Historial de cambios"}
          </DialogTitle>
          <DialogContent sx={{ paddingTop: "10px !important" }}>
            <Grid container spacing={2} alignItems={"center"}>
              {audits.length > 0 && (
                <List>
                  {audits.map((auditRow) => {
                    const cambio = JSON.parse(auditRow.cambio);
                    const faseList = faseSelect;
                    const mensajeroList = motorizadoSelect;
                    console.log("Audit",cambio,faseList,mensajeroList);
                    return (
                      <ListItem>
                        <strong>{auditRow.usuario.persona.fullName} </strong>
                        {cambio?.faseId !== undefined && (cambio?.faseId !== null ? " - "+faseList.find(x => x.id === cambio.faseId)?.nombre : " - Quito estado")}
                        {cambio?.mensajeroId !== undefined && (cambio?.mensajeroId !== null ? " - "+mensajeroList.find(x => x.id === cambio.mensajeroId)?.fullname : " - Quito mensajero")}
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

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
                  value={motorizadoId}
                  placeholder={"Seleccione un motorizado"}
                  id={"motorizadoId"}
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
          id="popupFase"
          open={openDialogFase}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Estas seguro/a de el estado? "}
          </DialogTitle>
          <DialogContent sx={{ paddingTop: "10px !important" }}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={12}>
                <SearchInput
                  options={[
                    { id: -1, nombre: "Seleccione un estado" },
                    ...faseSelect,
                  ]}
                  value={faseUpId}
                  placeholder={"Seleccione un estado"}
                  id={"fasePId"}
                  name={"fasePId"}
                  label={"Estado"}
                  getOptionLabel={"nombre"}
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
            <Button onClick={saveFase} variant="contained">
              Quiero asignar el estado
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
              {(currentUser.auth?.roles[0].name === "admin" ||
                currentUser.auth?.roles[0].name === "supervisor") && (
                <Grid item xs={12} sm={12}>
                  <SelectInput
                    data={[
                      /* { id: -1, nombre: "Seleccione una empresa" }, */
                      ...empresaSelect,
                    ]}
                    value={empresaUpId}
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
                    onChange={(event) => {
                      let { name, value } = event.target;
                      console.log(name, value);
                      setEmpresaUpId(value);
                    }}
                    getOptionLabel={"nombre"}
                    getIndexLabel={"id"}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={12}>
                <TextField
                  type="file"
                  inputProps={{
                    accept:
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
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

        <Dialog
          id="popupReportOrder"
          open={openDialogReport}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Descargar reportes."}
          </DialogTitle>
          <DialogContent sx={{ paddingTop: "10px !important" }}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={6}>
                <Button
                  className="extraButton"
                  variant="contained"
                  startIcon={<PictureAsPdf />}
                  sx={{ width: "90%", margin: "auto" }}
                  onClick={() => {
                    downloadReporte("Basico", "pdf");
                  }}
                >
                  Reporte Basico
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  className="extraButton"
                  variant="contained"
                  startIcon={<PictureAsPdf />}
                  sx={{ width: "90%", margin: "auto" }}
                  onClick={() => {
                    downloadReporte("Completo", "pdf");
                  }}
                >
                  Reporte Completo
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  className="extraButton"
                  variant="contained"
                  startIcon={<GridOn />}
                  sx={{ width: "90%", margin: "auto" }}
                  onClick={() => {
                    downloadReporte("Basico", "excel");
                  }}
                >
                  Reporte Basico
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  className="extraButton"
                  variant="contained"
                  startIcon={<GridOn />}
                  sx={{ width: "90%", margin: "auto" }}
                  onClick={() => {
                    downloadReporte("Completo", "excel");
                  }}
                >
                  Reporte Completo
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Cancelar
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
          onDownloadFunction={async (id, row) => {
            console.log("handleSelect ", id, row);
            dispatch(setLoading(true));
            await getPdfFile([id]);
          }}
          getAudit={async (row) => {
            setAudit(row.Audits);
            setOpenDialogA(true);
          }}
          delete={
            currentUser?.auth?.roles.find(
              (rol) => rol.name === "mensajero" || rol.name === "supervisor"
            ) !== undefined
              ? false
              : true
          }
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
          add={currentUser.auth?.roles[0].name === "mensajero" ? false : true}
          onAddFunction={() => {
            navigate("/orden/add");
          }}
          extraFilters={() => (
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
                      value={form.mensajeroId}
                      placeholder={"Seleccione un motorizado"}
                      id={"mensajeroId"}
                      name={"mensajeroId"}
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
                        value={
                          form.fechaDesde === "" ? "" : dayjs(form.fechaDesde)
                        }
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
                        value={
                          form.fechaHasta === "" ? "" : dayjs(form.fechaHasta)
                        }
                        disableFuture={true}
                        onChange={(e) => {
                          console.log("fecha", e);
                          onChange(
                            null,
                            "fechaHasta",
                            moment(e["$d"]).format("YYYY-MM-DD")
                          );
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={2} xs={12} style={{ textAlign: "right" }}>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={12}>
                    <Button
                      variant="contained"
                      startIcon={<FilterAltOutlined />}
                      sx={{ width: "90%" }}
                      onClick={() => {
                        getFiltered();
                      }}
                    >
                      Filtrar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button
                      variant="contained"
                      startIcon={<FilterAltOffOutlined />}
                      sx={{ width: "90%", lineHeight: 1 }}
                      disabled={showReport}
                      onClick={() => {
                        const clearForm = {
                          ...ordenFilterForm,
                          fechaDesde: null,
                          fechaHasta: null,
                        };
                        onChange(null, "fechaDesde", undefined);
                        onChange(null, "fechaHasta", undefined);
                        setShowReport(true);
                        dispatch(setFiltros("none"));
                        dispatch(setForm(clearForm));
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Button
                      variant="contained"
                      startIcon={<SummarizeOutlined />}
                      sx={{ width: "90%" }}
                      disabled={showReport}
                      onClick={() => {
                        setOpenDialogReport(true);
                      }}
                    >
                      Reportes
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          selectedItemsButtons={
            <List style={flexContainer}>
              <ListItem>
                <Button
                  className="extraButton"
                  variant="contained"
                  startIcon={<Approval />}
                  onClick={() => {
                    addFase();
                  }}
                >
                  Asignar Estado
                </Button>
              </ListItem>
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
          pagesHandle={pages}
          rowsHandle={rows}
          extraButtons={
            currentUser.auth?.roles[0].name === "mensajero" ? (
              <></>
            ) : (
              <>
                <Grid item md={3} sm={3} xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<GridOn />}
                    onClick={downloadXLS}
                    sx={{ lineHeight: 1 }}
                  >
                    Plantilla Excel
                  </Button>
                </Grid>
                <Grid item md={3} sm={3} xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<GridOn />}
                    onClick={addOrdenes}
                    sx={{ lineHeight: 1 }}
                  >
                    Subir ordenes
                  </Button>
                </Grid>
              </>
            )
          }
          extraRowButtons={
            currentUser?.auth?.roles.find(
              (rol) => rol.name === "admin" || rol.name === "supervisor"
            ) !== undefined
              ? showRowButtons
              : null
          }
          audit={true}
        />
      </Card>
    </div>
  );
};

export default OrdenList;
