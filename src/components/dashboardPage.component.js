import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PersonaDataService from "../services/persona.service";
import EmpresaDataService from "../services/empresa.service";
import { setMessage, setOpenModal } from "../reducers/message";
import { personaForm } from "../helpers/forms";
import { withRouter } from "../common/with-router";
import Form from "react-bootstrap/Form";
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
import { BarChart, DefaultizedPieValueType } from '@mui/x-charts';
import { PieArcLabelPlot, PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { axisClasses } from '@mui/x-charts';
import { SearchInput } from "./form/AutoCompleteInput";
import OrdenDataService from "../services/orden.service";

const size = {
  width: 600,
  height: 500,
};

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

const chartSetting = {
  yAxis: [
    {
      label: 'Ordenes',
    },
  ],
  width: 400,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-10px, 0)',
      fontWeight: 'bold',
    },
  },
};

const valueFormatter = (value: number) => `${value} ordenes`;

const DashboardPage = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [dashboardData, setDashboard] = useState([]);
  const [ordenesEstatus, setOrdenesEstatus] = useState([]);
  const [ordenesService, setOrdenesService] = useState([]);
  const [TOTAL, setTotalFase] = useState(0);
  const { auth: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(currentUser.isLoggedIn, currentUser);
    if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else if (currentUser.user?.reset_password === 1) {
      navigate("/changepassword");
    } else {
      let idR = null;
      if (
        currentUser.auth.roles.find((rol) => rol.name == "admin") === undefined
      ) {
        idR = currentUser.auth.persona.empresaId;
      }
      EmpresaDataService.resumen(idR)
        .then((response) => {
          console.log("dashboard", response);
          setDashboard(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      OrdenDataService.faseCount(idR)
        .then((response) => {
          console.log("ordenesEstatus", response.data, response.data.length);
          setOrdenesEstatus(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      OrdenDataService.serviceCount(idR)
        .then((response) => {
          console.log("ordenesEstatus", response.data, response.data.length);
          setOrdenesService(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    if(ordenesEstatus !== null) {
      setTotalFase(ordenesEstatus.map((item) => item.value).reduce((a, b) => a + b, 0));
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

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
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
          <Grid item xs={12} md={3} sd={3} sx={{}}>
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
          <Grid item xs={12} md={3} sd={3} sx={{}}>
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
          <Grid item xs={12} md={3} sd={3} sx={{}}>
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
          <Grid item xs={12} md={3} sd={3} sx={{}}>
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
              {dashboardData?.precioTotal?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}{" "}
              facturado
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sd={6}>
            <>
              <PieChart
                series={[
                  {
                    data: [...ordenesEstatus],
                    innerRadius: 60,
                    outerRadius: 110,
                  },
                ]}
                {...size}
              >
                <PieCenterLabel>Ordenes</PieCenterLabel>
              </PieChart>
            </>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sd={6}>
            <>
              <BarChart
                dataset={ordenesService}
                xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                series={[
                  { dataKey: 'value', label: 'Ordenes', valueFormatter },
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
