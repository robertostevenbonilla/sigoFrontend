import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import { Modal, Button } from "react-bootstrap";
import logo from "./assets/logo-goya.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Login from "./components/login.component";
import AddPersona from "./components/persona/add-persona.component";
import Persona from "./components/persona/persona.component";
import PersonaList from "./components/persona/persona-list.component";
import AddUsuario from "./components/usuario/add-usuario.component";
import ChangePassword from "./components/change-password.component";
import { UserAuth } from "./actions/auth";
import { setMessage, setOpenModal } from "./reducers/message";
import { Loading } from "./components/Loading";
import UsuarioList from "./components/usuario/usuario-list.component";
import Usuario from "./components/usuario/usuario.component";
import {
  AppBar,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import DashboardPage from "./components/dashboardPage.component";
import EmpresaList from "./components/empresa/empresa-list.component";
import Empresa from "./components/empresa/empresa.component";
import AddEmpresa from "./components/empresa/add-empresa.component";
import CiudadList from "./components/ciudad/ciudad-list.component";
import Ciudad from "./components/ciudad/ciudad.component";
import AddCiudad from "./components/ciudad/add-ciudad.component";
import FaseList from "./components/fase/fase-list.component";
import Fase from "./components/fase/fase.component";
import AddFase from "./components/fase/add-fase.component";
import ServicioList from "./components/servicio/servicio-list.component";
import Servicio from "./components/servicio/servicio.component";
import AddServicio from "./components/servicio/add-servicio.component";
import OrdenList from "./components/orden/orden-list.component";
import Orden from "./components/orden/orden.component";
import AddOrden from "./components/orden/add-orden.component";
import {
  AccountCircle,
  Approval,
  AssignmentInd,
  Business,
  ChevronLeft,
  ChevronRight,
  Dashboard,
  DisplaySettings,
  HolidayVillage,
  ListAlt,
  Logout,
  Menu,
  QrCode2,
  QrCodeScanner,
} from "@mui/icons-material";
import MuiDrawer from "@mui/material/Drawer";
import AsignarXqr from "./components/asignarxQR/asignarXqr.component";
import Recibo from "./components/orden/recibo.component";
import { setPages, setRows } from "./reducers/ui";
import QrReader from "./components/asignarxQR/leerQr";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  overflowY: "auto",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const iconTheme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#00609C",
      darker: "#053e85",
    },
    neutral: {
      main: "#00CD68",
      contrastText: "#fff",
    },
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function App() {
  const { logout } = UserAuth();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [open, setOpen] = useState(true);

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { message: currentMessage } = useSelector((state) => state.message);
  const { isModalOpen: isModalOpen } = useSelector((state) => state.message);
  const { closeModal: closeModal } = useSelector((state) => state.message);
  const { isLoading } = useSelector((state) => state.ui);

  const location = useLocation();

  const [showModal, setShow] = useState(false);

  const handleCloseModal = () => {
    console.log("close modal");
    dispatch(setOpenModal(false));
    setShow(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    console.log(open);
    setOpen(false);
  };

  const handleMenu = (event) => {
    console.log(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const cerrarSesion = () => {
    logout().then((respose) => {
      navigate("/login");
    });
  };

  const setInit = () => {
    dispatch(setPages(1));
    dispatch(setRows(10));
  };

  if (!currentUser?.isLoggedIn && location.pathname.includes("login") && !location.pathname.includes("recibo")) {
    return (
      <div className="login-container">
        <Login />
      </div>
    );
  } else {
    return (
      <div className="App">
        {isLoading && <Loading />}
        <AppBar position="fixed" sx={{ background: "white" }}>
          {currentUser.isLoggedIn /* && currentUser.auth?.reset_password == 0 */ && (
            <Grid container justify="flex-end" alignItems="center">
              <Grid item sm={8}></Grid>
              <Grid item sm={3} sx={{ textAlign: "right" }}>
                <Typography
                  variant="subtitle2"
                  component="div"
                  sx={{ flexGrow: 1, color: "black" }}
                >
                  {currentUser.auth.persona.fullName}
                </Typography>
              </Grid>
              <Grid item sm={1}>
                <IconButton size="large" onClick={cerrarSesion} color="black">
                  <Logout />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </AppBar>
        <Drawer className="navSide" variant="permanent" open={open}>
          <DrawerHeader>
            <Link to={"/"} className="nav-link">
              <img
                src={logo}
                alt="Goya Express Delivery"
                loading="lazy"
                width={150}
                style={{
                  opacity: open ? 1 : 0,
                  filter:
                    "drop-shadow(0.5px 0 0 white) drop-shadow(0 0.5px 0 white) drop-shadow(-0.5px 0 0 white) drop-shadow(0 -0.5px 0 white)",
                }}
              />
            </Link>
            <IconButton
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              sx={{ color: "white" }}
            >
              {open ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ color: "white" }} />

          {currentUser.isLoggedIn && currentUser.auth?.reset_password == 0 && (
            <List>
              <ListItem
                key={"dashboard"}
                onClick={() => {
                  navigate("/");
                }}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "white",
                      paddingRight: "10px",
                      width: 35,
                    }}
                  >
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem
                key={"orden"}
                onClick={() => {
                  setInit();
                  navigate("/orden");
                }}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      paddingRight: "10px",
                      width: 35,
                    }}
                  >
                    <ListAlt />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ordenes"
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {currentUser.auth?.roles.find(
                (rol) =>
                  rol.name == "admin" ||
                  rol.name == "mensajero" ||
                  rol.name == "supervisor"
              ) !== undefined && (
                <>
                  <ListItem
                    key={"asignar"}
                    onClick={() => {
                      setInit();
                      navigate("/asignarqr");
                    }}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "white",
                          paddingRight: "10px",
                          width: 35,
                        }}
                      >
                        <QrCode2 />
                      </ListItemIcon>
                      <ListItemText
                        primary="Asignar"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    key={"scanqr"}
                    onClick={() => {
                      setInit();
                      navigate("/scanqr");
                    }}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "white",
                          paddingRight: "10px",
                          width: 35,
                        }}
                      >
                        <QrCodeScanner />
                      </ListItemIcon>
                      <ListItemText
                        primary="Escanear QR"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
              {currentUser.auth?.roles.find(
                (rol) =>
                  rol.name ==
                  "admin" /* || rol.name == "empresa" || rol.name == "empresaLectura" */
              ) !== undefined && (
                <>
                  <ListItem
                    key={"persona"}
                    onClick={() => {
                      setInit();
                      navigate("/persona");
                    }}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "white",
                          paddingRight: "10px",
                          width: 35,
                        }}
                      >
                        <AccountCircle />
                      </ListItemIcon>
                      <ListItemText
                        primary="Personas"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    key={"usuario"}
                    onClick={() => {
                      setInit();
                      navigate("/usuario");
                    }}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "white",
                          paddingRight: "10px",
                          width: 35,
                        }}
                      >
                        <AssignmentInd />
                      </ListItemIcon>
                      <ListItemText
                        primary="Usuarios"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
              {currentUser.auth?.roles.find((rol) => rol.name == "admin") !==
                undefined && (
                <>
                  <ListItem
                    key={"empresa"}
                    onClick={() => {
                      setInit();
                      navigate("/empresa");
                    }}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          paddingRight: "10px",
                          width: 35,
                        }}
                      >
                        <Business />
                      </ListItemIcon>
                      <ListItemText
                        primary="Empresas"
                        sx={{
                          opacity: open ? 1 : 0,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    key={"ciudad"}
                    onClick={() => {
                      setInit();
                      navigate("/ciudad");
                    }}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          paddingRight: "10px",
                          width: 35,
                        }}
                      >
                        <HolidayVillage />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ciudades"
                        sx={{
                          opacity: open ? 1 : 0,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    key={"estado"}
                    onClick={() => {
                      setInit();
                      navigate("/estado");
                    }}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          paddingRight: "10px",
                          width: 35,
                        }}
                      >
                        <Approval />
                      </ListItemIcon>
                      <ListItemText
                        primary="Estados"
                        sx={{
                          opacity: open ? 1 : 0,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem
                    key={"servicio"}
                    onClick={() => {
                      setInit();
                      navigate("/servicio");
                    }}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          paddingRight: "10px",
                          width: 35,
                        }}
                      >
                        <DisplaySettings />
                      </ListItemIcon>
                      <ListItemText
                        primary="Servicios"
                        sx={{
                          opacity: open ? 1 : 0,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          )}
        </Drawer>

        <Modal
          show={isModalOpen}
          onHide={handleClose}
          centered
          style={{
            zIndex: 2500,
          }}
        >
          <Modal.Header closeButton onClick={handleCloseModal}>
            <Modal.Title>{currentMessage.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{currentMessage.msg}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              color={currentMessage.error ? "error" : "inherit"}
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        <div
          className="mt-2"
          style={{
            marginLeft: open ? drawerWidth : 65,
            marginTop: "0px !important",
            background: "#efefef",
            minHeight: "100vh",
          }}
        >
          {/* <DrawerHeader /> */}
          <Box
            className="main-box"
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% )` },
              /* height: "calc(100vh - 100px)", */
              overflowY: "auto",
              marginTop: "40px",
            }}
          >
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/persona" element={<PersonaList />} />
              <Route path="/persona/add" element={<AddPersona />} />
              <Route path="/persona/:id" element={<Persona />} />
              <Route path="/usuario" element={<UsuarioList />} />
              <Route path="/usuario/add" element={<AddUsuario />} />
              <Route path="/usuario/:id" element={<Usuario />} />
              <Route path="/empresa" element={<EmpresaList />} />
              <Route path="/empresa/add" element={<AddEmpresa />} />
              <Route path="/empresa/:id" element={<Empresa />} />
              <Route path="/ciudad" element={<CiudadList />} />
              <Route path="/ciudad/add" element={<AddCiudad />} />
              <Route path="/ciudad/:id" element={<Ciudad />} />
              <Route path="/estado" element={<FaseList />} />
              <Route path="/estado/add" element={<AddFase />} />
              <Route path="/estado/:id" element={<Fase />} />
              <Route path="/servicio" element={<ServicioList />} />
              <Route path="/servicio/add" element={<AddServicio />} />
              <Route path="/servicio/:id" element={<Servicio />} />
              <Route path="/orden" element={<OrdenList />} />
              <Route path="/orden/add" element={<AddOrden />} />
              <Route path="/orden/:id" element={<Orden />} />
              <Route path="/asignarqr" element={<AsignarXqr />} />
              <Route path="/scanqr" element={<QrReader />} />
              <Route path="/recibo/:guia" element={<Recibo />} />
            </Routes>
          </Box>
        </div>
      </div>
    );
  }
}

export default App;
