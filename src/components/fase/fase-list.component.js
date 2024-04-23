import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FaseDataService from "../../services/fase.service";
import EnhancedTable from "../table/table";
import { usePersonasTable } from "../../hooks/usePersonaTable";
import { Approval, HolidayVillage } from "@mui/icons-material";
import { Card, TextField } from "@mui/material";

const columnsFase = [
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
            width: '40px',
          }}
        />
      );
    },
  },
];

const FaseList = (props) => {
  const navigate = useNavigate();
  const [fases, setFases] = useState([]);

  const { auth: currentUser } = useSelector((state) => state.auth);

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
        />
      </Card>
    </div>
  );
};

export default FaseList;
