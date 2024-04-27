import { createSlice } from "@reduxjs/toolkit";
import thunk from 'redux-thunk'
import moment from "moment";

//var filter = localStorage.getItem('filter');

const initialState = {
  /* filter: filter ? JSON.parse(localStorage.getItem('filter')) : {
    empresaId: [],
    servicioId: [],
    faseId: [],
    ciudadOrigenId: [],
    ciudadDestinoId: [],
    motorizadoId: [],
    fechaDesde: moment().subtract(1, "months").format("YYYY-MM-DD"),
    fechaHasta: moment().format("YYYY-MM-DD"),
  }, */
  filter: {
    empresaId: [],
    servicioId: [],
    faseId: [],
    ciudadOrigenId: [],
    ciudadDestinoId: [],
    motorizadoId: [],
    fechaDesde: moment().subtract(1, "months").format("YYYY-MM-DD"),
    fechaHasta: moment().format("YYYY-MM-DD"),
  },
  filtros: "",
  showFilters: false,
};

export const filtroSlice = createSlice({
  name: "filtro",
  initialState,
  reducers: {
    setForm: (state, action) => {
      state.filter = { ...action.payload };
    },
    setFiltros: (state, action) => {
      state.filtros = action.payload;
    },
    setShowFilters: (state, action) => {
      state.showFilters = action.payload;
    },
  },
  //middleware: [thunk],
});

export const {
  /* setEmpresas,
  setServicios,
  setFases,
  setCiudadOrig,
  setCiudadDest,
  setMotorizado,
  setDesde,
  setHasta, */
  setForm,
  setFiltros,
  setShowFilters,
} = filtroSlice.actions;
