import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PersonaDataService from "../services/persona.service";
import EmpresaDataService from "../services/empresa.service";
import { setMessage, setOpenModal } from "../reducers/message";
import { personaForm } from "../helpers/forms";
import { withRouter } from "../common/with-router";
import Form from "react-bootstrap/Form";
import ReactECharts from 'echarts-for-react';

import { Card } from "./Card";
import {
  AccountCircle,
  AssignmentInd,
  AttachMoney,
  Dashboard,
  Edit,
  Home,
  ListAlt,
  Save,
  Title,
} from "@mui/icons-material";
import { Box, Button, Grid, TextField } from "@mui/material";
import { BarChart, DefaultizedPieValueType } from "@mui/x-charts";
import {
  PieArcLabel,
  PieArcLabelPlot,
  PieChart,
  pieArcLabelClasses,
} from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { axisClasses } from "@mui/x-charts";
import { SearchInput } from "./form/AutoCompleteInput";
import { OrdenDataService } from "../services/orden.service";

const size = {
  height: 500,
};
const pieOptions = {
  mobile: {
    arcLabelMinAngle: 45,
    outerRadius: 140,
    cx: 140,
    highlightScope: { faded: 'global', highlighted: 'item' },
    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
  },
  tablet: {
    arcLabelMinAngle: 0,
    outerRadius: 240,
    cx: 240,
    highlightScope: { faded: 'global', highlighted: 'item' },
    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
  }
}

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

const chartSetting = {
  yAxis: [
    {
      label: "Ordenes",
    },
  ],
  width: 300,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-10px, 0)",
      fontWeight: "bold",
    },
  },
};

const getDeviceType = () => {
  const width = window.innerWidth;
  // Puedes ajustar el valor de 768 para adaptarlo a tus necesidades
  return width >= 768 ? 'tablet' : 'mobile';
};

const valueFormatter = (value) => `${value} ordenes`;

const DashboardPage = () => {
  const [deviceType, setDeviceType] = useState(getDeviceType());

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    faseCount,
    serviceCount, } = OrdenDataService();

  const [dashboardData, setDashboard] = useState([]);
  const [ordenesEstatus, setOrdenesEstatus] = useState([]);
  const [ordenesService, setOrdenesService] = useState([
    {
      id: 1,
      codigo: "",
      label: "",
      value: 0,
    },
  ]);
  const [TOTAL, setTotalFase] = useState(0);
  const { auth: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };
    window.addEventListener('resize', handleResize);

    if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else {
      let idR = null;
      if (
        currentUser.auth?.roles.find((rol) => rol.name == "admin" || rol.name == "supervisor") === undefined
      ) {
        idR = currentUser.auth.persona.empresaId;
      }
      let mensajeroId = null;
      if ( currentUser.auth?.roles.find((rol) => rol.name !== "mensajero") ) {
        EmpresaDataService.resumen(idR)
          .then((response) => {
            setDashboard(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        mensajeroId = currentUser.auth.id;
        EmpresaDataService.resumenM(currentUser.auth.id)
          .then((response) => {
            setDashboard(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      faseCount(idR, mensajeroId)
        .then((response) => {
          setOrdenesEstatus(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      serviceCount(idR, mensajeroId)
        .then((response) => {
          setOrdenesService(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (ordenesEstatus !== null) {
      setTotalFase(
        ordenesEstatus.map((item) => item.value).reduce((a, b) => a + b, 0)
      );
    }
  }, [ordenesEstatus]);

  const PieCenterLabel = ({ children }) => {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  };

  const options = {
    title: {
      text: 'Ordenes',
      subtext: deviceType === 'mobile' ? '' : 'Total de ordenes por estado',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Estado orden',
        type: 'pie',
        radius: deviceType === 'mobile'? '50%' : '75%',
        data: ordenesEstatus.map(item => ({ value: item.value, name: item.label })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Card
        title="Dashboard"
        icon={<Dashboard sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="dashboard"
        className="text-start"
      >
        <Grid container spacing={1}>
          {currentUser.auth?.roles[0].name !== "mensajero" && (
            <>
              <Grid item xs={6} md={3} sd={3} sx={{}}>
                <Box
                  xs={12}
                  md={3}
                  sd={3}
                  sx={{
                    textAlign: "left",
                    padding: "30px 20px",
                    fontSize: "large",
                    color: "white",
                    fontWeight: "600",
                    height: 140,
                    borderRadius: 1,
                    bgcolor: "#3699FF",
                    "&:hover": {
                      bgcolor: "#0073e9",
                    },
                  }}
                >
                  <Home fontSize={"large"} sx={{ color: "white" }} />
                  <br />
                  {dashboardData.clientesTotal} clientes
                </Box>
              </Grid>
              <Grid item xs={6} md={3} sd={3} sx={{}}>
                <Box
                  xs={12}
                  md={3}
                  sd={3}
                  sx={{
                    textAlign: "left",
                    padding: "30px 20px",
                    fontSize: "large",
                    color: "white",
                    fontWeight: "600",
                    height: 140,
                    borderRadius: 1,
                    bgcolor: "#1BC5BD",
                    "&:hover": {
                      bgcolor: "#159892",
                    },
                  }}
                >
                  <AssignmentInd fontSize={"large"} sx={{ color: "white" }} />
                  <br />
                  {dashboardData.usuariosTotal} usuarios
                </Box>
              </Grid>
            </>
          )}
          <Grid item xs={6} md={3} sd={3} sx={{}}>
            <Box
              xs={12}
              md={3}
              sd={3}
              sx={{
                textAlign: "left",
                padding: "30px 20px",
                fontSize: "large",
                color: "white",
                fontWeight: "600",
                height: 140,
                borderRadius: 1,
                bgcolor: "#8950FC",
                "&:hover": {
                  bgcolor: "#671efb",
                },
              }}
            >
              <ListAlt fontSize={"large"} sx={{ color: "white" }} />
              <br />
              {dashboardData.ordenesTotal} ordenes
            </Box>
          </Grid>
          {currentUser.auth?.roles[0].name !== "mensajero" && (
            <>
              <Grid item xs={6} md={3} sd={3} sx={{}}>
                <Box
                  xs={12}
                  md={3}
                  sd={3}
                  sx={{
                    textAlign: "left",
                    padding: "30px 20px",
                    fontSize: "large",
                    color: "white",
                    fontWeight: "600",
                    height: 140,
                    borderRadius: 1,
                    bgcolor: "#8950FC",
                    "&:hover": {
                      bgcolor: "#671efb",
                    },
                  }}
                >
                  <AttachMoney fontSize={"large"} sx={{ color: "white" }} />
                  <br />
                  {dashboardData?.costoTotal?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}{" "}
                  facturado
                </Box>
              </Grid>
            </>
          )}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} sd={8}>
            <ReactECharts option={options} style={{height: deviceType === 'mobile' ? '400px' : '600px'}}/>
          </Grid>
          <Grid item xs={12} md={4} sd={4} sx={{ margin: "auto 0" }}>
            {ordenesEstatus.map((estado, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  md={12}
                  sd={12}
                  sx={{
                    background: `${estado.color}`,
                    margin: "5px",
                  }}
                >
                  <span
                    style={{
                      color: `${estado.color}`,
                      filter: "invert(1) grayscale(1) contrast(9)",
                      fontWeight: "400",
                    }}
                  >
                    {estado.codigo} - {estado.label}: {estado.value}
                  </span>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sd={6}>
            <>
              <BarChart
                dataset={ordenesService}
                xAxis={[{ scaleType: "band", dataKey: "label" }]}
                series={[
                  { dataKey: "value", label: "Ordenes", valueFormatter },
                ]}
                {...chartSetting}
              />
            </>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default DashboardPage;
