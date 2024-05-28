import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FaseDataService from "../../services/fase.service";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import { Approval, Dashboard, ErrorOutline, TaskAlt } from "@mui/icons-material";
import {
  Breadcrumbs,
  Card,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  TextField,
} from "@mui/material";
import { setPages, setRows } from "../../reducers/ui";
import { setMessage, setOpenModal } from "../../reducers/message";

const columnsFase = [
  {
    field: "codigo",
    headerName: "Código",
    flex: 1,
  },
  {
    field: "nombre",
    headerName: "Estado",
    flex: 2,
  },
  {
    field: "origen",
    headerName: "Origen",
    type: "render",
    renderFunction: (row) => {
      return (
        <TextField
          hiddenLabel
          id="filled-hidden-label-small"
          value={row.color}
          variant="standard"
          size="small"
          type="color"
          disabled="true"
          sx={{
            width: "40px",
          }}
        />
      );
    },
  },
  {
    field: "showMensajero",
    headerName: "Mensajero",
    type: "render",
    renderFunction: (row) => {
      return row.showMensajero === 0 ? (
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

const FaseList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fases, setFases] = useState([]);
  const [reloadData, setReload] = useState(false);

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
      retrieveFase();
    }
  }, []);

  const retrieveFase = () => {
    FaseDataService.getAll()
      .then((response) => {
        setFases(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
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
          icon={<Approval sx={{ color: "white !important" }} />}
          label="Estado"
          onClick={() => {
            navigate(`/estado?page=${pages + 1}&rowsPerPage=${rows}`);
          }}
          sx={{ background: "#3364FF", color: "white", padding: "2px 5px" }}
        />
      </Breadcrumbs>
      <Card
        title="Estados"
        icon={<Approval sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-fases"
        className="text-start"
      >
        <EnhancedTable
          table={{
            columns: columnsFase,
            rows: fases,
            rowId: "id",
          }}
          sx
          noDataMessage={"Por el momento no existen registros."}
          /* loading={isLoadingTable} */
          view={true}
          onViewFunction={(id, row) => {
            navigate(`/estado/${id}`);
          }}
          searchableKeys={["codigo", "nombre"]}
          rowId={"id"}
          add={true}
          onAddFunction={() => {
            navigate("/estado/add");
          }}
          delete={true}
          showDeleteAlert={true}
          refreshData={reloadData}
          onRefreshData={() => {
            console.log("refresh data");
            setReload(false);
            retrieveFase();
          }}
          onDeleteFunction={async (id) => {
            const data = {
              id: id,
              estado: 0,
            };
            await FaseDataService.update(data)
              .then((response) => {
                console.log(response);
                if (response.status === 200) {
                  const message = {
                    title: "Estado eliminado",
                    msg: "Estado eliminado correctamente.",
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
          setPages={setPages}
          setRows={setRows}
        />
      </Card>
    </div>
  );
};

export default FaseList;
