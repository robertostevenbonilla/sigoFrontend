import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ServicioDataService from "../../services/servicio.service";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  DisplaySettings,
} from "@mui/icons-material";
import { Card } from "@mui/material";

const columnsServicio = [
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

const ServicioList = (props) => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);

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
        />
      </Card>
    </div>
  );
};

export default ServicioList;
