import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UsuarioDataService from "../../services/usuario.service";

import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import {
  AssignmentInd,
  LockReset,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Card } from "@mui/material";

const columnsUsuario = [
  {
    field: "persona.fullName",
    headerName: "Persona",
    flex: 3,
    renderFunction: (row) => {
      return row.persona.fullName;
    },
  },
  {
    field: "persona.empresa.nombre",
    headerName: "Empresa",
    flex: 3,
    renderFunction: (row) => {
      return row.persona.empresa?.nombre;
    },
  },
  {
    field: "persona.email",
    headerName: "Email",
    flex: 3,
    renderFunction: (row) => {
      return row.persona.email;
    },
  },
  {
    field: "username",
    headerName: "Usuario",
    flex: 3,
  },
  {
    field: "reset_password",
    headerName: "Restablecer Password",
    flex: 1,
    type: "render",
    renderFunction: (row) => {
      return <LockReset color={row.reset_password ? "success" : "disabled"} />;
    },
  },
  {
    field: "active",
    headerName: "Activo",
    flex: 1,
    type: "render",
    renderFunction: (row) => {
      if (row.active === true) {
        return <ToggleOn color="success" />;
      } else {
        return <ToggleOff color="error" />;
      }
    },
  },
  {
    field: "roles[0].name",
    headerName: "Rol",
    flex: 3,
    renderFunction: (row) => {
      return row.roles[0].name;
    },
  },
];

const UsuarioList = (props) => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  /* const {
    isLoadingTable
  } = useUsuariosTable; */

  const { auth: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(currentUser, currentUser);
    if (currentUser.auth?.reset_password === 1) {
      navigate("/changepassword");
    } else if (!currentUser.isLoggedIn) {
      navigate("/login");
    } else {
      retrieveUsuarios();
    }
  }, []);

  const retrieveUsuarios = () => {
    UsuarioDataService.getAll()
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveUsuarios();
  };

  return (
    <div className="list row">
      <Card
        title="Ordenes"
        icon={<AssignmentInd sx={{ color: "white", fontSize: "23px" }} />}
        openCollapse={true}
        idElement="datosGenerales-usuarios"
        className="text-start"
      >
        <EnhancedTable
          table={{
            columns: columnsUsuario,
            rows: usuarios,
            rowId: "id",
          }}
          noDataMessage={"Por el momento no existen registros."}
          /* loading={isLoadingTable} */
          view={true}
          onViewFunction={(id, row) => {
            console.log(id, row);
            navigate(`/usuario/${id}`);
          }}
          searchableKeys={["username", "persona", "empresa", "email"]}
          rowId={"id"}
          add={true}
          onAddFunction={() => {
            navigate("/usuario/add");
          }}
        />
      </Card>
    </div>
  );
};

export default UsuarioList;
