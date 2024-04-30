import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PersonaDataService from "../../services/persona.service";
import { Link } from "react-router-dom";

import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import { AccountCircle, Dashboard } from "@mui/icons-material";
import { Breadcrumbs, Card, Chip, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { setPages, setRows } from "../../reducers/ui";
import { setMessage, setOpenModal } from "../../reducers/message";

const columnsPersona = [
  {
    field: "nombres",
    headerName: "Nombres",
    type: "number",
    flex: 3,
  },
  {
    field: "apellidos",
    headerName: "Apellidos",
    flex: 3,
  },
  {
    field: "identificacion",
    headerName: "Identificacion",
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 2,
  },
  {
    field: "telefono",
    headerName: "Telefono",
    flex: 1,
  },
  {
    field: "empresa",
    headerName: "Empresa",
    flex: 2,
    type: "render",
    renderFunction: (row) => {
      return row.empresa?.nombre;
    },
  },
];

const PersonaList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [reloadData, setReload] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchNombres, setSearchNombres] = useState("");

  const { isLoadingTable } = usePersonasTable;

  const { auth: currentUser } = useSelector((state) => state.auth);
  const { pages } = useSelector((state) => state.ui);
  const { rows } = useSelector((state) => state.ui);

  useEffect(() => {
    console.log(currentUser, currentUser);
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      retrievePersonas();
    }
  }, []);

  const onChangeSearchNombres = (e) => {
    const searchNombres = e.target.value;
    setSearchNombres(searchNombres);
  };

  const retrievePersonas = () => {
    PersonaDataService.getAll()
      .then((response) => {
        setPersonas(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrievePersonas();
    setCurrentPersona(null);
    setCurrentIndex(-1);
  };

  const setActivePersona = (persona, index) => {
    setCurrentPersona(persona);
    setCurrentIndex(index);
  };

  const searchByNombres = () => {
    if (searchNombres === "") {
      refreshList();
    } else {
      PersonaDataService.findByNombres(searchNombres)
        .then((response) => {
          setPersonas(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="list row">
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
          icon={<AccountCircle sx={{ color: "white !important" }} />}
          label="Personas"
          onClick={() => {
            navigate(`/persona?page=${pages+1}&rowsPerPage=${rows}`);
          }}
          sx={{background: "#3364FF", color: "white", padding: "2px 5px"}}
        />
      </Breadcrumbs>
      <Card
        title="Ordenes"
        icon={<AccountCircle sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-usuarios"
        className="text-start"
      >
        <EnhancedTable
          table={{
            columns: columnsPersona,
            rows: personas,
            rowId: "id",
          }}
          noDataMessage={"Por el momento no existen registros."}
          loading={isLoadingTable}
          view={true}
          onViewFunction={(id, row) => {
            navigate(`/persona/${id}`);
          }}
          delete={true}
          showDeleteAlert={true}
          refreshData={reloadData}
          onRefreshData={() => {
            console.log('refresh data');
            setReload(false);
            retrievePersonas();
          }}
          onDeleteFunction={async (id) => {
            const data = {
              id: id,
              estado: 0,
            };
            await PersonaDataService.update(data)
              .then((response) => {
                console.log(response);
                if (response.status === 200) {
                  const message = {
                    title: "Persona eliminada",
                    msg: "Persona eliminada correctamente.",
                    error: true,
                  };
                  console.log(response.data.message);
                  dispatch(setMessage({ ...message }));
                  dispatch(setOpenModal(true));
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
          searchableKeys={["nombres", "apellidos"]}
          rowId={"id"}
          add={true}
          onAddFunction={() => {
            navigate("/persona/add");
          }}
          setPages={setPages}
          setRows={setRows}
        />
      </Card>
    </div>
  );
};

export default PersonaList;
