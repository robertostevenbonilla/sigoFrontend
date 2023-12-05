import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EmpresaDataService from "../../services/empresa.service";

import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  AssignmentInd,
  Business,
  LockReset,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Card } from "@mui/material";

const columnsEmpresa = [
  {
    field: "codigo",
    headerName: "Código",
    flex: 1,
  },
  {
    field: "nombre",
    headerName: "Empresa",
    flex: 3,
  },
  {
    field: "identificacion",
    headerName: "Identificación",
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 2,
  },
  {
    field: "telefono",
    headerName: "Teléfono",
    flex: 1,
  },
  {
    field: "celular",
    headerName: "Celular",
    flex: 1,
  },
  {
    field: "direccion",
    headerName: "Dirección",
    flex: 3,
  },
];

const EmpresaList = (props) => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(currentUser, currentUser);
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      retrieveEmpresas();
    }
  }, []);

  const retrieveEmpresas = () => {
    EmpresaDataService.getAll()
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ width: "100%", margin: "0px auto" }}>
      <Card
        title="Empresa"
        icon={<Business sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-cadenas"
        className="text-start"
      >
        <EnhancedTable
          table={{
            columns: columnsEmpresa,
            rows: empresas,
            rowId: "id",
          }}
          sx
          noDataMessage={"Por el momento no existen registros."}
          /* loading={isLoadingTable} */
          view={true}
          onViewFunction={(id, row) => {
            navigate(`/empresa/${id}`);
          }}
          searchableKeys={["codigo", "nombre", "telefono", "celular", "email"]}
          rowId={"id"}
          add={true}
          onAddFunction={() => {navigate("/empresa/add")}}
        />
      </Card>
    </div>
  );
};

export default EmpresaList;
