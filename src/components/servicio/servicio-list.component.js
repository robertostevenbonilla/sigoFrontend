import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ServicioDataService from "../../services/servicio.service";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  Dashboard,
  DisplaySettings,
} from "@mui/icons-material";
import { Breadcrumbs, Card, Chip } from "@mui/material";
import { setPages, setRows } from "../../reducers/ui";
import { setMessage, setOpenModal } from "../../reducers/message";

const columnsServicio = [
  {
    field: "codigo",
    headerName: "Código",
    flex: 1,
  },
  {
    field: "nombre",
    headerName: "Servicio",
    flex: 2,
  },
  {
    field: "descripcion",
    headerName: "Descripción",
    flex: 4,
  }
];

const ServicioList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
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
      retrieveServicio();
    }
  }, []);

  const retrieveServicio = () => {
    ServicioDataService.getAll()
      .then((response) => {
        setServicios(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
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
          icon={<DisplaySettings sx={{ color: "white !important" }} />}
          label="Servicio"
          onClick={() => {
            navigate(`/servicio?page=${pages+1}&rowsPerPage=${rows}`);
          }}
          sx={{background: "#3364FF", color: "white", padding: "2px 5px"}}
        />
      </Breadcrumbs>
      <Card
        title="Ciudad"
        icon={<DisplaySettings sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-servicios"
        className="text-start"
      >
        <EnhancedTable
          table={{
            columns: columnsServicio,
            rows: servicios,
            rowId: "id",
          }}
          sx
          noDataMessage={"Por el momento no existen registros."}
          /* loading={isLoadingTable} */
          view={true}
          onViewFunction={(id, row) => {
            navigate(`/servicio/${id}`);
          }}
          searchableKeys={["codigo", "nombre", "descripcion"]}
          rowId={"id"}
          add={true}
          onAddFunction={() => {navigate("/servicio/add")}}
          delete={true}
          showDeleteAlert={true}
          refreshData={reloadData}
          onRefreshData={() => {
            console.log('refresh data');
            setReload(false);
            retrieveServicio();
          }}
          onDeleteFunction={async (id) => {
            const data = {
              id: id,
              estado: 0,
            };
            await ServicioDataService.update(data)
              .then((response) => {
                console.log(response);
                if (response.status === 200) {
                  const message = {
                    title: "Empresa eliminada",
                    msg: "Empresa eliminada correctamente.",
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

export default ServicioList;
