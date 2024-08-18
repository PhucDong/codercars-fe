import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import apiService from "../app/apiService";
import Joi from "joi";
import moment from "moment";

const initial_form = {
  make: "",
  model: "",
  release_date: 0,
  transmission_type: "",
  price: "",
  size: "",
  style: "",
};

export default function FormModal({
  open,
  handleClose,
  mode,
  selectedCar,
  modalKey,
  refreshData,
}) {
  const [form, setForm] = useState(initial_form);
  const [errors, setErrors] = useState(null);

  const schema = Joi.object({
    make: Joi.string().required().messages({
      "string.empty": "Make is required.",
    }),
    model: Joi.string().required().messages({
      "string.empty": "Model is required.",
    }),
    // release_date: Joi.number()
    //   .integer()
    //   .min(1900)
    //   .max(new Date().getFullYear())
    //   .required()
    //   .messages({
    //     "number.min": "Please select a year >= 1900.",
    //   }),
    release_date: Joi.date().greater("1990-1-1").messages({
      "date.greater": "Year must be greater than 1990.",
    }),
    transmission_type: Joi.string()
      .valid(
        "MANUAL",
        "AUTOMATIC",
        "AUTOMATED_MANUAL",
        "DIRECT_DRIVE",
        "UNKNOWN"
      )
      .required()
      .messages({ "string.empty": "Please 1 transmission type." }),
    price: Joi.number().integer().min(1000).required().messages({
      "number.base": "Price must be a number.",
      "number.min": "Price must be >= 1000.",
    }),
    size: Joi.string()
      .valid("Compact", "Midsize", "Large")
      .required()
      .messages({ "string.empty": "Please select 1 car size." }),
    style: Joi.string()
      .required()
      .messages({ "string.empty": "Style is required." }),
  }).options({ stripUnknown: true, abortEarly: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // UPDATE a car
  const handleEdit = async (newForm) => {
    try {
      await apiService.put(`/cars/${selectedCar?._id}`, { ...newForm });
      refreshData();
    } catch (err) {
      console.log(err);
    }
  };

  // POST a car
  const handleCreate = async (newFormData) => {
    try {
      await apiService.post("/cars", { ...newFormData });
      setForm(initial_form);
      refreshData();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubmit = () => {
    const validate = schema.validate(form);

    if (validate.error) {
      const newErrors = {};
      validate.error.details.forEach(
        (item) => (newErrors[item.path[0]] = item.message)
      );
      setErrors(newErrors);
    } else {
      if (mode === "create") handleCreate(validate.value);
      else handleEdit(validate.value);
    }
  };

  useEffect(() => {
    if (selectedCar?._id) {
      setErrors({});
      setForm(selectedCar);
    } else {
      setForm(initial_form);
    }
  }, [selectedCar]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} key={modalKey}>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setErrors({});
          setForm(initial_form);
        }}
        sx={{
          "& .MuiDialog-paper": {
            padding: "20px 28px",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            lineHeight: "100%",
            padding: 0,
            fontWeight: 550,
            mb: "8px",
          }}
        >
          {mode === "create" ? "CREATE A NEW CAR" : "EDIT CAR"}
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Stack
            spacing={2}
            sx={{
              gap: "8px",
              "& .MuiFormControl-root": {
                margin: 0,
                "& .MuiInput-root": {
                  marginTop: "12px",
                },
              },
            }}
          >
            {/* Make */}
            <TextField
              error={errors?.make && true}
              helperText={errors?.make ? errors.make : null}
              value={form.make}
              autoFocus
              margin="dense"
              name="make"
              label="Make"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleChange}
            />

            {/* Model */}
            <TextField
              error={errors?.model && true}
              helperText={errors?.model ? errors.model : null}
              value={form.model}
              onChange={handleChange}
              autoFocus
              margin="dense"
              name="model"
              label="Model"
              type="text"
              fullWidth
              variant="standard"
            />

            {/* Transmission Type */}
            <FormControl
              error={errors?.transmission_type && true}
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
            >
              <InputLabel id="transmission_type_label">
                Transmission Type
              </InputLabel>
              <Select
                labelId="transmission_type_label"
                name="transmission_type"
                value={form.transmission_type}
                onChange={handleChange}
                label="Transmission Type"
              >
                {[
                  "MANUAL",
                  "AUTOMATIC",
                  "AUTOMATED_MANUAL",
                  "DIRECT_DRIVE",
                  "UNKNOWN",
                ].map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              {errors?.transmission_type ? (
                <FormHelperText>{errors?.transmission_type}</FormHelperText>
              ) : null}
            </FormControl>

            {/* Size */}
            <FormControl
              error={errors?.size && true}
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
            >
              <InputLabel id="size-label">Size</InputLabel>
              <Select
                labelId="size-label"
                name="size"
                value={form.size}
                onChange={handleChange}
                label="Size"
              >
                {["Compact", "Midsize", "Large"].map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              {errors?.size ? (
                <FormHelperText>{errors?.size}</FormHelperText>
              ) : null}
            </FormControl>

            {/* Style */}
            <TextField
              error={errors?.style && true}
              helperText={errors?.style ? errors.style : null}
              value={form.style}
              margin="dense"
              name="style"
              label="Style"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleChange}
            />

            {/* Year & Price */}
            <Stack direction="row" spacing={2} sx={{ gap: "8px" }}>
              <DatePicker
                views={["year"]}
                label="Year"
                value={
                  !selectedCar
                    ? moment(form.release_date)
                    : moment(form.release_date).toDate()
                }
                onChange={(newValue) => {
                  setForm({ ...form, release_date: moment(newValue).format() });
                }}
                slotProps={{
                  textField: {
                    error: errors?.release_date ? true : false,
                    helperText: errors?.release_date
                      ? errors.release_date
                      : null,
                  },
                }}
              />

              <TextField
                value={form.price}
                onChange={handleChange}
                error={errors?.price && true}
                helperText={errors?.price ? errors.price : null}
                margin="dense"
                name="price"
                label="Price"
                type="number"
                variant="standard"
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: "4px",
            padding: 0,
            mt: "32px",
            "& .MuiButton-root": { m: 0 },
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "#F0F0F0",
              padding: "12px 20px",
              border: "1px solid #A9A9A9",
              borderRadius: "12px",
              color: "#70787A",
              fontWeight: 550,
              fontSize: "1.2rem",
              lineHeight: "100%",
              textTransform: "capitalize",
              width: "120px",
              "&:hover": {
                backgroundColor: "#F0F0F0",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#009CDB",
              padding: "12px 20px",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontWeight: 550,
              fontSize: "1.2rem",
              lineHeight: "100%",
              textTransform: "capitalize",
              width: "120px",
              "&:hover": {
                backgroundColor: "#009CDB",
              },
            }}
          >
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
