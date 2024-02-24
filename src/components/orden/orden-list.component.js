import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FilterAltOutlined,
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
  Button,
  Card,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { loadingTable } from "../../reducers/ui";
import { SearchInput } from "../form/AutoCompleteInput";
import { ordenFilterForm } from "../../helpers/forms";
import jsPDF from "jspdf";

import { PdfPage } from "../form/PdfPage";

import autoTable from "jspdf-autotable";
import logo from "./../../assets/logo-goya.png";
import QRCode from "react-qr-code";
import HTMLComment from "../../hooks/HTMLComment";
import html2canvas from "html2canvas";

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
  /* {
    field: "fechaEntrega",
    headerName: "Entrega",
    flex: 1,
    format: "date",
  },
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

const OrdenList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { isLoadingTable } = useSelector((state) => state.ui);

  const [form, setForm] = useState(ordenFilterForm);
  const [ciudadSelect, setCiudadSelect] = useState([]);
  const [empresaSelect, setEmpresaSelect] = useState([]);
  const [servicioSelect, setServicioSelect] = useState([]);
  const [faseSelect, setFaseSelect] = useState([]);
  const [printPdf, setPrintPdf] = useState(false);

  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedObj, setSelectedObj] = useState([]);

  const loadSelects = () => {
    CiudadDataService.getSelect()
      .then((response) => {
        console.log("ciudad", response);
        setCiudadSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    EmpresaDataService.getSelect()
      .then((response) => {
        console.log("empresa", response);
        setEmpresaSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    ServicioDataService.getSelect()
      .then((response) => {
        console.log("servicio", response);
        setServicioSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    FaseDataService.getSelect()
      .then((response) => {
        console.log("fase", response);
        setFaseSelect(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(currentUser, currentUser);
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      retrieveOrdenes();
    }
  }, []);

  const getFilters = async () => {
    if (!filtersLoaded) {
      loadSelects();
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

  const retrieveOrdenes = (page = 0, size = 10) => {
    dispatch(loadingTable(true));
    OrdenDataService.getAll(page, size)
      .then((response) => {
        console.log(response.data);
        setOrdenes(response.data);
        dispatch(loadingTable(false));
      })
      .catch((e) => {
        console.log(e);
        dispatch(loadingTable(false));
      });
  };

  const downloadPdf = () => {
    /* doc = new jsPDF();

    setPrintPdf(true);
    setTimeout(() => {
      doc.setFont("helvetica");
      doc.setFontSize(9);
      autoTable(doc, {
        html: "#reportTable",
        margin: { top: 28 },
        styles: { fontSize: 8 },
        /* didDrawPage: header, * /
      });
      doc.save(`Reporte.pdf`);
    }, 0); */

    /* const domElement=document.querySelector('#reportTable')
    html2canvas(domElement, { onclose: (document)=>{
    document.querySelector('#save-button').style.visibility='hidden'
    }})
    .then((canvas)=>{
      const imgData=canvas.toDataURL('image/jpeg')
      const pdf=new jsPDF()
      pdf.addImage(imgData, 'JPEG',0,0,width,height)
      pdf.save('filename.pdf')
    }) */

    //const content = pdfRef.current;

    var svgElements = document.body.querySelectorAll('svg');
    svgElements.forEach(function(item) {
      item.setAttribute("width", item.getBoundingClientRect().width);
      item.setAttribute("height", item.getBoundingClientRect().height);
      item.style.width = null;
      item.style.height= null;
    });

    const content = document.querySelector("#reportTable");
    const screenWidth = parseFloat(window.getComputedStyle(content).width);
    console.log(screenWidth, 2480/screenWidth);
    const doc = new jsPDF();
    doc.html(content, {
      callback: function (doc) {
        doc.save("sample.pdf");
      },
      html2canvas: { scale: 0.215 }, // change the scale to whatever number you need
    });
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

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Card
        key="Ordenes"
        title="Ordenes"
        icon={<ListAlt sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-ordenes"
        className="text-start"
      >
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
            navigate(`/orden/${id}`);
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
              sx={{ padding: 2 }}
            >
              <Grid item sm={1} xs={12}>
                Filtros:
              </Grid>
              <Grid item sm={9} xs={12}>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={4}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione una ciudad" },
                        ...ciudadSelect,
                      ]}
                      value={form.ciudadOrigenId}
                      placeholder={"Seleccione una ciudad"}
                      id={"ciudadOrigenId"}
                      name={"ciudadOrigenId"}
                      label={"Ciudad Origen"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione una ciudad" },
                        ...ciudadSelect,
                      ]}
                      value={form.ciudadDestinoId}
                      placeholder={"Seleccione una ciudad"}
                      id={"ciudadDestinoId"}
                      name={"ciudadDestinoId"}
                      label={"Ciudad Destino"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione un estado" },
                        ...faseSelect,
                      ]}
                      value={form.faseId}
                      placeholder={"Seleccione un estado"}
                      id={"faseId"}
                      name={"faseId"}
                      label={"Estado"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SearchInput
                      options={[
                        { id: -1, nombre: "Seleccione un servicio" },
                        ...servicioSelect,
                      ]}
                      value={form.servicioId}
                      placeholder={"Seleccione un servicio"}
                      id={"servicioId"}
                      name={"servicioId"}
                      label={"Servicio"}
                      getOptionLabel={"nombre"}
                      getIndexLabel={"id"}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
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
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={2} xs={12} style={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  startIcon={<FilterAltOutlined />}
                  onClick={() => {
                    //getFiltered();
                    resetPagination();
                  }}
                >
                  Filtrar
                </Button>
              </Grid>
            </Grid>
          )}
          selectedItemsButtons={
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              onClick={() => {
                console.log("handleSelect ");
                downloadPdf();
              }}
            >
              Generar
            </Button>
          }
        />
      </Card>
      {selected.length > 0 ? (
        <PdfPage
          selected={selected}
          selectedObj={selectedObj}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default OrdenList;
