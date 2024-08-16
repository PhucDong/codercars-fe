import { useCallback, useEffect, useState } from "react";
import apiService from "../app/apiService";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Fab, IconButton, Pagination, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import FormModal from "../components/FormModal";
import AddIcon from "@mui/icons-material/Add";
import { useLocation } from "react-router-dom";
import { CustomNoRowsOverlay } from "../utils/tableNoData";

const HomePage = () => {
  const [cars, setCars] = useState([]);
  // const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [mode, setMode] = useState("create");
  const location = useLocation();

  const handleClickNew = () => {
    setMode("create");
    setOpenForm(true);
  };
  const handleClickEdit = (id) => {
    setMode("edit");
    setSelectedCar(cars.find((car) => car._id === id));
    setOpenForm(true);
  };

  // Click delete icon
  const handleClickDelete = (id) => {
    setOpenConfirm(true);
    setSelectedCar(cars.find((car) => car._id === id));
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(`/cars/${selectedCar._id}`);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const name =
    selectedCar?.release_date +
    " " +
    selectedCar?.make +
    " " +
    selectedCar?.model;

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "style",
      headerName: "Style",
      flex: 0.75,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "size",
      headerName: "Size",
      flex: 0.75,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "transmission_type",
      headerName: "Transmission Type",
      flex: 1.2,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.75,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "release_date",
      headerName: "Year",
      flex: 0.75,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "id",
      headerName: "Edit/Delete",
      minWidth: 120,
      flex: 0.75,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleClickEdit(value)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleClickDelete(value)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const rows = cars.map((car) => ({
    id: car._id,
    name: car.make + " " + car.model,
    size: car.size,
    style: car.style,
    transmission_type: car.transmission_type,
    price: car.price,
    release_date: car.release_date,
  }));

  const getData = useCallback(async () => {
    const queryParams = new URLSearchParams(location.search);

    const keyList = {};
    for (const [key, value] of queryParams.entries()) {
      keyList[`${key}`] = value;
    }

    let url = `/cars?limit=10&page=${page}`;

    Object.keys(keyList).forEach((key) => {
      if (keyList[key]) url += `&${key}=${keyList[key]}`;
    });

    const res = await apiService.get(url);
    setCars(res[0].cars);
    setTotalPages(res[0].metadata[0].totalPages);
  }, [location.search, page]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Container maxWidth="xl" sx={{ mt: "32px" }}>
      {/* Delete form */}
      <DeleteConfirmModal
        open={openConfirm}
        name={name}
        handleClose={() => {
          setOpenConfirm(false);
          setSelectedCar(null);
        }}
        action={handleDelete}
      />
      <FormModal
        open={openForm}
        refreshData={() => {
          setOpenForm(false);
          setSelectedCar(null);
          getData(); // fetch data to refresh browser
        }}
        selectedCar={selectedCar}
        handleClose={() => {
          setOpenForm(false);
          setSelectedCar(null);
        }}
        mode={mode}
      />
      <div style={{ width: "100%", overflow: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          columnHeaderHeight={44}
          disableColumnMenu={true}
          disableColumnSorting={true}
          getRowHeight={() => "auto"}
          autoHeight
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 12,
              },
            },
          }}
          pageSizeOptions={[12]}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            pagination: () => (
              <Pagination
                color="primary"
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
              />
            ),
          }}
          sx={{
            borderRadius: "8px",
            height: "100%",
            "& .MuiDataGrid-scrollbarFiller": {
              display: "none",
            },
            "& .MuiDataGrid-virtualScrollerContent": {
              display: rows.length === 0 && "none",
            },
            "& .MuiDataGrid-filler": { display: "none" },
            "& .MuiDataGrid-columnHeader": {
              p: 0,
              backgroundColor: "#F0F0F0",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#70787A",
              fontWeight: 550,
              fontSize: "0.95rem",
              lineHeight: "100%",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              fontSize: "1rem",
              py: "8px",
              width: "100%",
            },
            "& .MuiDataGrid-overlayWrapper": {
              height: "120px",
              width: "100%",
            },
            "& .MuiDataGrid-overlayWrapperInner": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxHeight: "100%",
            },
          }}
        />
      </div>
      <Fab
        variant="extended"
        color="info"
        onClick={handleClickNew}
        sx={{ position: "fixed", bottom: 10, left: 10 }}
        aria-label="add"
      >
        <AddIcon />
        New
      </Fab>
    </Container>
  );
};
export default HomePage;
