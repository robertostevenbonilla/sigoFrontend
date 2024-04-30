import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  AssignmentInd,
  Business,
  Dashboard,
  HolidayVillage,
  LockReset,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Breadcrumbs, Card, Chip } from "@mui/material";
import { setPages, setRows } from "../../reducers/ui";
import { setMessage, setOpenModal } from "../../reducers/message";

const columnsCiudad = [
  {
    field: "codigo",
    headerName: "Código",
    flex: 1,
  },
  {
    field: "nombre",
    headerName: "Cuidad",
    flex: 2,
  },
  {
    field: "descripcion",
    headerName: "Descripción",
    flex: 4,
  }
];

const CiudadList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ciudades, setCiudades] = useState([]);
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
      retrieveCiudad();
    }
  }, []);

  const retrieveCiudad = () => {
    CiudadDataService.getAll()
      .then((response) => {
        setCiudades(response.data);
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
          icon={<HolidayVillage sx={{ color: "white !important" }} />}
          label="Ciudades"
          onClick={() => {
            navigate(`/ciudad?page=${pages+1}&rowsPerPage=${rows}`);
          }}
          sx={{background: "#3364FF", color: "white", padding: "2px 5px"}}
        />
      </Breadcrumbs>
      <Card
        title="Ciudad"
        icon={<HolidayVillage sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-ciudades"
        className="text-start"
      >
        <EnhancedTable
          table={{
            columns: columnsCiudad,
            rows: ciudades,
            rowId: "id",
          }}
          sx
          noDataMessage={"Por el momento no existen registros."}
          /* loading={isLoadingTable} */
          view={true}
          onViewFunction={(id, row) => {
            navigate(`/ciudad/${id}`);
          }}
          searchableKeys={["codigo", "nombre", "descripcion"]}
          rowId={"id"}
          add={true}
          onAddFunction={() => {navigate("/ciudad/add")}}
          delete={true}
          showDeleteAlert={true}
          refreshData={reloadData}
          onRefreshData={() => {
            console.log('refresh data');
            setReload(false);
            retrieveCiudad();
          }}
          onDeleteFunction={async (id) => {
            const data = {
              id: id,
              estado: 0,
            };
            await CiudadDataService.update(data)
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

export default CiudadList;
