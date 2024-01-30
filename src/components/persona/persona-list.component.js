import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PersonaDataService from "../../services/persona.service";
import { Link } from "react-router-dom";

import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import { AccountCircle } from "@mui/icons-material";
import { Card } from "@mui/material";

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
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchNombres, setSearchNombres] = useState("");

  const { isLoadingTable } = usePersonasTable;

  const { auth: currentUser } = useSelector((state) => state.auth);

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

  return (
    <div className="list row">
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
          searchableKeys={["nombres", "apellidos"]}
          rowId={"id"}
          add={true}
          onAddFunction={() => {
            navigate("/persona/add");
          }}
        />
      </Card>
    </div>
  );
};

export default PersonaList;
