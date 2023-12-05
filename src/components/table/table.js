import * as React from "react";
import PropTypes from "prop-types";
import { makeStyles, styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  InputBase,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
//import "../../styles/collapsibleTable.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import RouteIcon from "@mui/icons-material/Route";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DownloadIcon from "@mui/icons-material/Download";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import moment from "moment";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { Stack } from "@mui/system";

export const EllipsisTable = (props) => {
  const ref = React.useRef();
  const [isOverFlow, setIsOverFlow] = React.useState(false);

  React.useLayoutEffect(() => {
    if (ref.current.clientWidth < ref.current.scrollWidth) {
      setIsOverFlow(true);
    }
  }, [ref]);

  return isOverFlow && !props.disableTooltip ? (
    <Tooltip
      title={<span style={{ color: "white!important" }}>{props.children}</span>}
    >
      <div
        className="enhance-table-cell"
        ref={ref}
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {props.children}
      </div>
    </Tooltip>
  ) : (
    <div
      className="enhance-table-cell"
      ref={ref}
      style={{
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </div>
  );
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  boxShadow:
    "0px 3px 1px -2px rgb(0 0 0 / 8%), 0px 2px 2px 0px rgb(0 0 0 / 8%), 0px 1px 5px 0px rgb(0 0 0 / 8%)",
}));

const SearchModal = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  border: "1px solid rgba(0, 0, 0, 0.3)",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    showCheckboxes,
    columns,
    disableButtons,
    showExpandableTable,
    maxSelected,
    disableCheckboxes,
    loading,
    expandibleButtonPosition,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      {loading ? (
        <TableRow>
          <TableCell>
            <Skeleton variant="text" sx={{ fontSize: "1rem", width: "100%" }} />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          {showExpandableTable && expandibleButtonPosition === "start" && (
            <TableCell align={"left"} style={{ width: 20 }}></TableCell>
          )}
          {showCheckboxes && (
            <TableCell padding="checkbox" style={{ width: 30 }}>
              {maxSelected === null && (
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  disabled={disableCheckboxes}
                  inputProps={{
                    "aria-label": "select all",
                  }}
                />
              )}
            </TableCell>
          )}
          {columns.map((headCell) => (
            <TableCell
              key={headCell.field}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.field ? order : false}
              style={{
                flexGrow: headCell.flex,
                ...(headCell.style ? headCell.style : {}),
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.field}
                direction={orderBy === headCell.field ? order : "asc"}
                onClick={createSortHandler(headCell.field)}
              >
                {headCell.headerName}
                {orderBy === headCell.field ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          {!disableButtons && (
            <TableCell align={"right"} style={{ width: 150 }}></TableCell>
          )}
          {showExpandableTable && expandibleButtonPosition === "end" && (
            <TableCell align={"right"} style={{ width: 20 }}></TableCell>
          )}
        </TableRow>
      )}
    </TableHead>
  );
}

function EnhancedTableRow(props) {
  const {
    isItemSelected,
    row,
    rowId,
    handleClick,
    labelId,
    columns,
    showCheckboxes,
    disableButtons,
    showExpandableTable,
    buttons,
    expandable,
    setExpandable,
    expandedItems,
    disableCheckboxes,
    expandibleButtonPosition,
  } = props;

  const [formattedRow, setFormattedRow] = React.useState({});

  const formatRow = (row) => {
    let obj = row;
    columns.map((column) => {
      obj = {
        ...obj,
        [column.field]: getFormatedValue(
          row[column.field],
          column.type ? column.type : column.format
        ),
      };
    });
    return obj;
  };

  const getFormatedValue = (value, type) => {
    if (type) {
      switch (type) {
        case "date":
          return value
            ? moment(
                value[value.length - 1] === "Z" ? value.slice(0, -1) : value
              ).format("YYYY-MM-DD")
            : "--";
        case "datetime":
          return value
            ? moment(
                value[value.length - 1] === "Z" ? value.slice(0, -1) : value
              ).format("YYYY-MM-DD hh:mm:ss")
            : "--";
        case "price":
          return value?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
      }
    }
    return value;
  };

  React.useEffect(() => {
    setFormattedRow(formatRow(row));
  }, [row]);

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={formattedRow[rowId]}
        selected={isItemSelected}
        style={{ background: expandable ? "#f1f1f1" : "none" }}
      >
        {showExpandableTable && expandibleButtonPosition === "start" && (
          <TableCell style={{ width: 20 }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                if (showExpandableTable)
                  setExpandable(expandable ? 0 : formattedRow[rowId]);
              }}
            >
              {expandable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {showCheckboxes && (
          <TableCell padding="checkbox" style={{ width: 30 }}>
            {!formattedRow.disableCheckbox && (
              <Checkbox
                color="primary"
                checked={isItemSelected}
                onClick={(event) => handleClick(event, row[rowId])}
                disabled={disableCheckboxes && !isItemSelected}
                inputProps={{
                  "aria-labelledby": labelId,
                }}
              />
            )}
          </TableCell>
        )}
        {columns.map((column) => {
          return (
            <TableCell
              style={{
                flexGrow: column.flex,
                padding: "3px 8px",
                ...(column.style ? column.style : {}),
              }}
            >
              {/* <EllipsisTable disableTooltip={column.disableTooltip}>
                {column.renderFunction
                  ? column.renderFunction(row)
                  : formattedRow[column.field]}
              </EllipsisTable> */}
              <Grid>
                {column.renderFunction
                  ? column.renderFunction(row)
                  : formattedRow[column.field]}
              </Grid>
            </TableCell>
          );
        })}

        {!disableButtons && (
          <TableCell align="right" style={{ width: 150 }}>
            <div>
              {buttons.map((btn) => {
                return btn;
              })}
            </div>
          </TableCell>
        )}
        {showExpandableTable && expandibleButtonPosition === "end" && (
          <TableCell style={{ width: 20 }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                if (showExpandableTable)
                  setExpandable(expandable ? 0 : formattedRow[rowId]);
              }}
            >
              {expandable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      {showExpandableTable && (
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              borderRadius: "0 0 10px 10px",
              background: "#fafafa",
              ...(expandable ? {} : { border: "none" }),
            }}
            colSpan={
              columns.length +
              (showCheckboxes ? 1 : 0) +
              (disableButtons ? 0 : 1) +
              1
            }
          >
            <Collapse
              in={expandable}
              timeout="auto"
              unmountOnExit
              sx={{ width: "100%" }}
            >
              <Box sx={{ margin: 1, width: "100%" }}>
                {expandedItems(row[rowId], row)}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    setSearch,
    search,
    extraFilters,
    getFilters,
    selectedItemsButtons,
    extraButtons,
    showAddButton,
    onAddFunction,
    resetPagination,
    isModalTable,
    modalFilters = null,
    icon,
    subtitle,
    title,
  } = props;

  const [isOpenFilters, setIsOpenFilters] = React.useState(false);
  return (
    <>
      <Toolbar
        sx={{
          width: "100%",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          pl: { sm: numSelected > 0 ? 2 : 1 },
          pr: { xs: 1, sm: 1 },
          mb: 2,
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} seleccionado{numSelected > 1 ? "s" : ""}
          </Typography>
        ) : isModalTable ? (
          modalFilters ?? (
            <Grid item container sm={6} alignItems={"center"}>
              {icon ? (
                <Grid
                  item
                  style={{
                    color: "#00CD68",
                    paddingRight: 15,
                    fontWeight: "bold",
                  }}
                >
                  {icon}
                </Grid>
              ) : (
                <></>
              )}
              <Stack>
                {subtitle ? (
                  <Typography variant="p" color={"neutral"}>
                    {subtitle}
                  </Typography>
                ) : (
                  <></>
                )}

                <Typography variant="h5" color="primary" fontSize={24}>
                  {title}
                </Typography>
              </Stack>
            </Grid>
          )
        ) : (
          <Grid item container sm={6}>
            {extraFilters && (
              <Tooltip title="Filtros">
                <IconButton
                  onClick={() => {
                    if (isOpenFilters) {
                      setIsOpenFilters(false);
                    } else {
                      if (getFilters !== null) getFilters();
                      setIsOpenFilters(true);
                    }
                  }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                value={search}
                placeholder="Buscar..."
                style={{ width: 350 }}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Search>
          </Grid>
        )}

        {numSelected > 0 ? (
          <>{selectedItemsButtons}</>
        ) : (
          <Grid
            item
            xs={6}
            container
            spacing={1}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            {extraButtons}
            {isModalTable && (
              <SearchModal>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  value={search}
                  placeholder="Buscar..."
                  style={{ width: 250 }}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </SearchModal>
            )}
            {showAddButton && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ marginLeft: 2 }}
                onClick={props.onAddFunction}
              >
                Agregar
              </Button>
            )}
          </Grid>
        )}
      </Toolbar>
      {extraFilters && (
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            mb: isOpenFilters ? 3 : 0,
            bgcolor: "#d9d9d9",
          }}
        >
          <Collapse
            in={isOpenFilters}
            timeout="auto"
            unmountOnExit
            sx={{ width: "100%" }}
          >
            {extraFilters(resetPagination)}
          </Collapse>
        </Paper>
      )}
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const {
    table = {
      title: "",
      columns: [],
      rows: [],
    },
    rowId,
    showCheckboxes = false,
    disableButtons = false,
    showExpandableTable = false,
    expandedItems,
    expandableItem = null,
    setExpandableItem = null,
    extraFilters = null,
    getFilters = null,
    selected = null,
    setSelected = null,
    handleSelectedChange = null,
    selectedItemsButtons,
    maxSelected = null,
    extraButtons,
    loading = false,
    extraRowButtons = null,
    isModalTable = false,
    modalFilters = null,
    disablePathParameters = false,
    icon = false,
    subtitle = "",
    title = "",
    expandibleButtonPosition = "end",
    stickyHeader = false,
    orderASC = "desc", // asc, desc
    searchableKeys = [],
    paginationServer = false,
    handlePagination = null,
  } = props;
  const [order, setOrder] = React.useState(orderASC);
  const [orderBy, setOrderBy] = React.useState("");
  const [innerSelected, setInnerSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [item, setItem] = React.useState(0);
  const [disableCheckboxes, setDisableCheckboxes] = React.useState(false);
  const [innerExpandableTable, setInnerExpandableTable] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [dataTable, setDataTable] = React.useState({
    title: "",
    columns: [],
    rows: [],
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (disablePathParameters) {
      setPage(0);
      setRowsPerPage(10);
      setSearch("");
    }
  }, [table]);

  React.useEffect(() => {
    //setOrder("desc");
    setOrderBy(rowId);
  }, [rowId]);

  React.useEffect(() => {
    if (searchParams && !disablePathParameters) {
      const innerPage = parseInt(
        searchParams.get("page") ? searchParams.get("page") : 1
      );
      const innerRowsPerPage = parseInt(
        searchParams.get("rowsPerPage") ? searchParams.get("rowsPerPage") : 10
      );
      const innerSearch = searchParams.get("search")
        ? searchParams.get("search")
        : "";

      setPage(innerPage - 1);
      setRowsPerPage(innerRowsPerPage);
      setSearch(innerSearch);
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (search) {
      setPage(0);
      setDataTable({
        ...table,
        rows: table.rows.filter((row) => search === "" || searchFilter(row)),
      });
    } else {
      setDataTable(table);
    }
  }, [search]);

  React.useEffect(() => {
    setDataTable({
      ...table,
      rows: table?.rows?.filter((row) => search === "" || searchFilter(row)),
    });
  }, [table]);

  React.useEffect(() => {
    if ((selected ? selected : innerSelected).length > 0) {
      const newSelected = (selected ? selected : innerSelected).filter((sel) =>
        dataTable.rows.some((row) => row[rowId] === sel && !row.disableCheckbox)
      );
      if (newSelected.length !== (selected ? selected : innerSelected).length)
        handleSelected(newSelected);
    }
  }, [dataTable]);

  React.useEffect(() => {
    if (handleSelectedChange) {
      handleSelectedChange(innerSelected);
    }
  }, [innerSelected]);

  const handleSelected = (newSelected) => {
    if (setSelected) {
      setSelected(newSelected);
    } else {
      setInnerSelected(newSelected);
    }
  };

  const triggerDeleteDialog = (value) => {
    setItem(value);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setItem(0);
    setOpenDialog(false);
  };

  const deleteItem = (innerItem, row) => {
    props.onDeleteFunction(innerItem ? innerItem : item[rowId], row);
    handleCloseDialog();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    console.log(event.target.checked);
    if (event.target.checked) {
      const newSelected = table.rows
        .filter((row) => !row.disableCheckbox)
        .map((row) => row[rowId]);
      handleSelected(newSelected);
      return;
    }
    handleSelected([]);
  };

  const resetPagination = () => {
    if (!disablePathParameters)
      navigate(location.pathname + `?page=${1}&rowsPerPage=${10}`);
    setPage(0);
    setRowsPerPage(10);
  };

  const handleClick = (event, name) => {
    const selectedIndex = (selected ? selected : innerSelected).indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(
        selected ? selected : innerSelected,
        name
      );
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(
        (selected ? selected : innerSelected).slice(1)
      );
    } else if (
      selectedIndex ===
      (selected ? selected : innerSelected).length - 1
    ) {
      newSelected = newSelected.concat(
        (selected ? selected : innerSelected).slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        (selected ? selected : innerSelected).slice(0, selectedIndex),
        (selected ? selected : innerSelected).slice(selectedIndex + 1)
      );
    }

    if (maxSelected !== null && newSelected.length >= maxSelected) {
      setDisableCheckboxes(true);
    } else {
      setDisableCheckboxes(false);
    }
    handleSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    if (!disablePathParameters)
      navigate(
        location.pathname + `?page=${newPage}&rowsPerPage=${rowsPerPage}`
      );
    if (paginationServer) handlePagination(newPage, rowsPerPage);
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event) => {
    const perPage = parseInt(event.target.value, 10);
    if (paginationServer) handlePagination(0, perPage);
    if (!disablePathParameters)
      navigate(
        location.pathname +
          `?page=${page + 1}&rowsPerPage=${perPage}`
      );
    setRowsPerPage(perPage);
    setPage(0);
  };

  const isSelected = (name) =>
    (selected ? selected : innerSelected).indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - table.rows.length) : 0;

  const getButtons = (id, row) => {
    let arrayButtons = [];
    if (props.view)
      arrayButtons.push(
        <Tooltip title="Ver" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onViewFunction(id, row)}
          >
            <VisibilityIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      );
    if (props.edit)
      arrayButtons.push(
        <Tooltip title="Editar" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onEditFunction(id, row)}
          >
            <EditIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      );
    if (props.productos)
      arrayButtons.push(
        <Tooltip title="Productos" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onProductosFunction(id, row)}
          >
            <WorkspacesIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      );
    if (props.rutas)
      arrayButtons.push(
        <Tooltip title="Rutas" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onRutasFunction(id, row)}
          >
            <RouteIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      );
    if (props.permisos)
      arrayButtons.push(
        <Tooltip title="Permisos" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onPermissionFunction(id, row)}
          >
            <FactCheckIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      );
    if (props.conciliacion)
      arrayButtons.push(
        <Tooltip title="Conciliacion" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onConciliacionFunction(id, row)}
          >
            <CompareArrowsIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      );
    if (props.download)
      arrayButtons.push(
        <Tooltip title="Descargar" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onDownloadFunction(id, row)}
          >
            <DownloadIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      );
    if (extraRowButtons !== null) arrayButtons.push(extraRowButtons(id, row));
    if (props.delete)
      arrayButtons.push(
        <Tooltip title="Eliminar" placement="top">
          <IconButton
            size="small"
            onClick={() =>
              props.showDeleteAlert
                ? triggerDeleteDialog(id, row)
                : deleteItem(id, row)
            }
          >
            <DeleteIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      );

    return arrayButtons;
  };

  const searchFilter = (row) => {
    return dataTable.columns.some(
      (column) =>
        typeof row[column.field] === "string" &&
        props.searchableKeys.includes(column.field) &&
        row[column.field]
          .toLocaleString()
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  };

  const getRows = () => {
    let rows = stableSort(dataTable?.rows, getComparator(order, orderBy));
    if (!paginationServer){
      rows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return rows
      .map((row, index) => {
        const isItemSelected = isSelected(row[rowId]);
        const labelId = `enhanced-table-checkbox-${index}`;
        const isExpandable =
          row[rowId] ===
          (expandableItem !== null ? expandableItem : innerExpandableTable);
        return (
          <EnhancedTableRow
            isItemSelected={isItemSelected}
            row={row}
            rowId={rowId}
            handleClick={handleClick}
            labelId={labelId}
            columns={dataTable.columns}
            showCheckboxes={showCheckboxes}
            disableCheckboxes={disableCheckboxes}
            disableButtons={disableButtons}
            showExpandableTable={showExpandableTable}
            expandable={isExpandable}
            setExpandable={
              setExpandableItem ? setExpandableItem : setInnerExpandableTable
            }
            expandedItems={expandedItems}
            buttons={getButtons(row[rowId], row)}
            expandibleButtonPosition={expandibleButtonPosition}
          />
        );
      });
  };

  return (
    <Grid container sx={{ width: "100%" }}>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estas seguro/a de eliminar este registro? "}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={deleteItem} variant="contained">
            Quiero eliminar este registro
          </Button>
        </DialogActions>
      </Dialog>
      <EnhancedTableToolbar
        numSelected={(selected ? selected : innerSelected).length}
        setSearch={setSearch}
        search={search}
        extraFilters={extraFilters}
        resetPagination={resetPagination}
        getFilters={getFilters}
        selectedItemsButtons={selectedItemsButtons}
        extraButtons={extraButtons}
        showAddButton={props.add}
        onAddFunction={props.onAddFunction}
        isModalTable={isModalTable}
        modalFilters={modalFilters}
        icon={icon}
        subtitle={subtitle}
        title={title}
      />
      <Paper
        elevation={isModalTable ? 0 : 3}
        sx={{
          width: "100%",
          mb: isModalTable ? 0 : 2,
          padding: 1,
          margin: "10px 16px",
          ...(isModalTable
            ? { border: "2px solid #f0f0f0", maxHeight: 450, overflowY: "auto" }
            : {}),
        }}
      >
        <TableContainer /* style={{ maxHeight: "calc(100vh - 300px)" }} */>
          <Table
            stickyHeader={stickyHeader}
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
            className={"enhance-table"}
          >
            <EnhancedTableHead
              columns={dataTable.columns}
              numSelected={(selected ? selected : innerSelected).length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              showExpandableTable={showExpandableTable}
              rowCount={
                dataTable.rows?.filter((row) => !row.disableCheckbox).length
              }
              showCheckboxes={showCheckboxes}
              disableCheckboxes={disableCheckboxes}
              maxSelected={maxSelected}
              disableButtons={disableButtons}
              loading={loading}
              expandibleButtonPosition={expandibleButtonPosition}
            />
            <TableBody>
              {loading ? (
                [1, 2, 3, 4, 5].map(() => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem", width: "100%" }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : dataTable.rows?.length > 0 ? (
                getRows() 
              ) : (
                <TableRow>
                  <TableCell colSpan={dataTable.columns.length}>
                    <Alert
                      severity="info"
                      style={{ width: "100%", color: "primary" }}
                    >
                      No se encontraron resultados
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        style={{ padding: 15 }}
      >
        <Grid item>
          <Grid container alignItems={"center"}>
            <span style={{ fontSize: 14, marginRight: 10 }}>
              Filas por página:
            </span>
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              size={"small"}
            >
              <MenuItem value={10} sx={{ whiteSpace: "normal" }}>
                10
              </MenuItem>
              <MenuItem value={50} sx={{ whiteSpace: "normal" }}>
                50
              </MenuItem>
              <MenuItem value={100} sx={{ whiteSpace: "normal" }}>
                100
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Pagination
          sx={{ color: "neutral" }}
          count={
            dataTable?.pages
              ? dataTable?.pages
              : Math.ceil(dataTable.rows?.length / rowsPerPage)
          }
          page={page + 1}
          onChange={handleChangePage}
        />
      </Grid>
    </Grid>
  );
}
