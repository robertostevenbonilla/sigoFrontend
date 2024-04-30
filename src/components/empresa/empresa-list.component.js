import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EmpresaDataService from "../../services/empresa.service";

import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  AssignmentInd,
  Business,
  Dashboard,
  LockReset,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Breadcrumbs, Card, Chip } from "@mui/material";
import { setPages, setRows } from "../../reducers/ui";
import { setMessage, setOpenModal } from "../../reducers/message";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
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
          icon={<Business sx={{ color: "white !important" }} />}
          label="Empresas"
          onClick={() => {
            navigate(`/empresa?page=${pages+1}&rowsPerPage=${rows}`);
          }}
          sx={{background: "#3364FF", color: "white", padding: "2px 5px"}}
        />
      </Breadcrumbs>
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
          delete={true}
          showDeleteAlert={true}
          refreshData={reloadData}
          onRefreshData={() => {
            console.log('refresh data');
            setReload(false);
            retrieveEmpresas();
          }}
          onDeleteFunction={async (id) => {
            const data = {
              id: id,
              estado: 0,
            };
            await EmpresaDataService.update(data)
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

export default EmpresaList;
