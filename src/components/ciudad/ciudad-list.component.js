import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EmpresaDataService from "../../services/empresa.service";
import CiudadDataService from "../../services/ciudad.service";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  AssignmentInd,
  Business,
  HolidayVillage,
  LockReset,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Card } from "@mui/material";

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
  const navigate = useNavigate();
  const [ciudades, setCiudades] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);

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
        />
      </Card>
    </div>
  );
};

export default CiudadList;
