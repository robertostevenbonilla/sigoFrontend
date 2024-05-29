import * as React from "react";
import { useDispatch } from "react-redux";
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
  List,
  ListItem,
  ListItemIcon,
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
import { PictureAsPdf, TaskAlt, TrackChanges } from "@mui/icons-material";

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
    buttons,
    audit,
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
                padding: "16px 8px",
                ...(headCell.style ? headCell.style : {}),
              }}
            >
              {/* {console.log(headCell)} */}
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
          {audit && (
            <TableCell>Cambios</TableCell>
          )}
          {!disableButtons && (
            <>
              <TableCell align={"right"} sx={{ width: (150*buttons) }}></TableCell>
            </>
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
    audit,
    getAudit
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
                onClick={(event) => handleClick(event, row[rowId], row)}
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
        {audit && (
            <TableCell style={{
              padding: "3px 8px",
            }}>
              <Grid>
                { row.Audits.length > 0 ?  
                  <List>
                    <ListItem>
                      <ListItemIcon style={{ minWidth: 30 }} onClick={props.getAudit ? () => props.getAudit(row) : () => {return true;}}>
                        <TrackChanges sx={{color: '#ffdd29'}} />
                      </ListItemIcon>
                    </ListItem>
                  </List> : <List>
                    <ListItem>
                      <ListItemIcon style={{ minWidth: 30 }}>
                        <TaskAlt color="success" />
                      </ListItemIcon>
                    </ListItem>
                  </List>
                }
              </Grid>
            </TableCell>
          )}
        {!disableButtons && (
          <TableCell id={`btn${rowId}`} align="right" sx={{ width: (150*buttons.length) }}>
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
  const dispatch = useDispatch();
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
    showFilters,
    setShowFilters,
  } = props;
  
  const [isOpenFilters, setIsOpenFilters] = React.useState(showFilters);

  React.useEffect(() => {
    if(props.setShowFilters) dispatch(setShowFilters(isOpenFilters));
  }, [isOpenFilters]);

  return (
    <>
      <Toolbar
        sx={{
          width: "calc(100% - 32px)",
          margin: "2px 16px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          pl: { sm: numSelected > 0 ? 2 : 1 },
          pr: { xs: 1, sm: 1 },
          mb: 2,
        }}
      >
        {isModalTable ? (
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
          <Grid item container sm={5}>
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
                style={{ width: 300 }}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Search>
          </Grid>
        )}

        <Grid
          container
          xs={7}
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
            <Grid item md={3} sm={3} xs={12}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                /* sx={{ marginLeft: 2 }} */
                onClick={props.onAddFunction}
              >
                Agregar
              </Button>
            </Grid>
          )}
        </Grid>
      </Toolbar>
      {extraFilters && (
        <Paper
          elevation={3}
          sx={{
            width: "calc(100% - 32px)",
            margin: "2.5px 16px",
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
      {numSelected > 0 && (
        <Toolbar
          sx={{
            width: "calc(100% - 32px)",
            margin: "2.5px 16px",
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
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} seleccionado{numSelected > 1 ? "s" : ""}
          </Typography>

          {numSelected > 0 ? <>{selectedItemsButtons}</> : <></>}
        </Toolbar>
      )}
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const dispatch = useDispatch();
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
    selectedObj = null,
    setSelected = null,
    setSelectedObj = null,
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
    showFilters=false,
    setShowFilters=null,
    handlePagination = null,
    refreshData=null,
    onRefreshData=null,
    setPages=null,
    setRows=null,
    pagesHandle=0,
    rowsHandle=10,
    audit=false,
    getAudit=null,
  } = props;
  const [order, setOrder] = React.useState(orderASC);
  const [orderBy, setOrderBy] = React.useState("");
  const [innerSelected, setInnerSelected] = React.useState([]);
  const [innerSelectedObj, setInnerSelectedObj] = React.useState([]);

  const [page, setPage] = React.useState(pagesHandle);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsHandle);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [item, setItem] = React.useState(0);
  const [disableCheckboxes, setDisableCheckboxes] = React.useState(false);
  const [innerExpandableTable, setInnerExpandableTable] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [dataTable, setDataTable] = React.useState({
    title: "",
    columns: [],
    rows: [],
    total: 0,
  });
  const [refresh, setRefresh] = React.useState(refreshData);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    //if (table.rows === undefined) setPage(0);
    if (disablePathParameters) {
      setPage(0);
      setRowsPerPage(10);
      setSearch("");
    } else if (!disablePathParameters && refresh) {
      console.log(table,disablePathParameters,refresh);
      navigate(
        location.pathname + `?page=${page}&rowsPerPage=${rowsPerPage}`
        );
    }
  }, [table]);

  React.useEffect(() => {
    //setOrder("desc");
    setOrderBy(rowId);
  }, [rowId]);

  React.useEffect(() => {
    console.log("page",page);
    if(props.setPages) dispatch(setPages(page));
  }, [page]);

  React.useEffect(() => {
    console.log("rowsPerPage",rowsPerPage);
    if(props.setRows) dispatch(setRows(rowsPerPage));
  }, [rowsPerPage]);

  React.useEffect(() => {
    console.log("searchParams", refresh);
    if (searchParams && !disablePathParameters && !refresh) {
      console.log("searchParams1", refresh);
      const innerPage = parseInt(
        searchParams.get("page") ? searchParams.get("page") : 1
      );
      const innerRowsPerPage = parseInt(
        searchParams.get("rowsPerPage") ? searchParams.get("rowsPerPage") : 10
      );
      const innerSearch = searchParams.get("search")
        ? searchParams.get("search")
        : "";
      if((innerPage - 1) >= 0) setPage(innerPage - 1);
      setRowsPerPage(innerRowsPerPage);
      setSearch(innerSearch);
      console.log(innerPage,innerRowsPerPage, innerSearch);
      console.log(page,rowsPerPage, search);
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

  React.useEffect(() => {
    setRefresh(refreshData);
  }, [refreshData]);

  React.useEffect(() => {
    if(refresh) {
      if (!disablePathParameters)
        navigate(
          location.pathname + `?page=${page}&rowsPerPage=${rowsPerPage}`
        );
      if (paginationServer) handlePagination(page, rowsPerPage);
      console.log(onRefreshData);
      if (onRefreshData) {
        onRefreshData();
      }
    }
  }, [refresh]);

  React.useEffect(() => {
    //if (page !== pagesHandle)
      setPage(pagesHandle);
  }, [pagesHandle]);

  React.useEffect(() => {
    //if (rowsPerPage !== rowsHandle)
      setRowsPerPage(rowsHandle);
  }, [rowsHandle]);

  const handleSelected = (newSelected) => {
    if (setSelected) {
      setSelected(newSelected);
    } else {
      setInnerSelected(newSelected);
    }
  };

  const handleSelectedObj = (newSelectedObj) => {
    if (setSelectedObj) {
      setSelectedObj(newSelectedObj);
    } else {
      setInnerSelectedObj(newSelectedObj);
    }
  };

  const triggerDeleteDialog = (value, obj) => {
    console.log(`deleting ${value}`,obj);
    setItem(value);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setItem(0);
    setOpenDialog(false);
  };

  const deleteItem = (innerItem, row) => {
    console.log(`deleteItem`, page, rowsPerPage, item);
    props.onDeleteFunction(item).then(() => {
      if (!disablePathParameters)
        navigate(
          location.pathname + `?page=${page}&rowsPerPage=${rowsPerPage}`
        );
      if (paginationServer) handlePagination(page, rowsPerPage);
      else if(onRefreshData) onRefreshData();
    });
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
      const newObjSelected = table.rows
        .filter((row) => !row.disableCheckbox)
        .map((row) => row);
      console.log(newObjSelected);
      handleSelected(newSelected);
      handleSelectedObj(newObjSelected);
      return;
    }
    handleSelected([]);
    handleSelectedObj([]);
  };

  const resetPagination = () => {
    if (!disablePathParameters)
      navigate(location.pathname + `?page=${1}&rowsPerPage=${10}`);
    setPage(0);
    setRowsPerPage(10);
  };

  const handleClick = (event, name, row) => {
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

    const selectedIndexObj = (selectedObj ? selectedObj : innerSelectedObj).findIndex((obj) => obj.id === name );
    let newSelectedObj = [];

    const newObjSelected = table.rows
        .filter((obj) => newSelected.includes(obj.id) )
        .map((obj) => obj);

    handleSelected(newSelected);
    handleSelectedObj(newObjSelected);
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
      navigate(location.pathname + `?page=${1}&rowsPerPage=${perPage}`);
    setRowsPerPage(perPage);
    setPage(0);
  };

  const isSelected = (name) =>
    (selected ? selected : innerSelected).indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (table?.rows ? table?.rows.length : 0)) : 0;

  const getButtons = (id, row) => {
    let arrayButtons = [];
    if (props.view)
      arrayButtons.push(
        <Tooltip title="Ver" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onViewFunction(id, row)}
          >
            <VisibilityIcon fontSize={"small"} sx={{color: '#3364FF' }} />
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
    if (props.download)
      arrayButtons.push(
        <Tooltip title="Descargar" placement="top">
          <IconButton
            size="small"
            onClick={() => props.onDownloadFunction(id, row)}
          >
            <PictureAsPdf fontSize={"small"} sx={{color: '#F40F02' }} />
          </IconButton>
        </Tooltip>
      );
    if (extraRowButtons !== null) arrayButtons.push(extraRowButtons(id, row));
    if (props.delete)
      arrayButtons.push(
        <Tooltip title="Eliminar" placement="top">
          <IconButton
            size="small"
            onClick={() => {
              console.log(id,row)
              props.showDeleteAlert
                ? triggerDeleteDialog(id, row)
                : deleteItem(id, row)
            }}
          >
            <DeleteIcon fontSize={"small"} color="error" />
          </IconButton>
        </Tooltip>
      );

    return arrayButtons;
  };

  const countButtons = () => {
    let numButtons = 0;
    if (props.view)
      numButtons++;
    if (props.edit)
    numButtons++;
    if (props.productos)
      numButtons++;
    if (props.rutas)
      numButtons++;
    if (props.permisos)
      numButtons++;
    if (props.conciliacion)
      numButtons++;
    if (props.download)
      numButtons++;
    if (extraRowButtons !== null) numButtons += extraRowButtons.length;
    if (props.delete)
      numButtons++;
    return numButtons;
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
    if (!paginationServer) {
      rows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return rows.map((row, index) => {
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
          audit={audit}
          getAudit={getAudit}
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
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      <Paper
        elevation={isModalTable ? 0 : 3}
        sx={{
          width: "calc(100% - 32px)",
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
              buttons={countButtons()}
              audit={audit}
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
        style={{ padding: "8px", margin: "10px 16px" }}
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
              <MenuItem value={300} sx={{ whiteSpace: "normal" }}>
                300
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
