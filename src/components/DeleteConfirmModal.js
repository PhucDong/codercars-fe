import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export default function DeleteConfirmModal({
  open,
  handleClose,
  name,
  action,
}) {
  const handleConfirm = () => {
    action();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ "& .MuiDialog-paper": { padding: "20px", width: "480px" } }}
    >
      <DialogContent sx={{ padding: 0, textAlign: "center" }}>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: "#000000", fontSize: "1.2rem", fontWeight: 520 }}
        >
          This action is irreversible. Are you sure you want to delete {name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 0,
          justifyContent: "center",
          gap: "4px",
          mt: "28px",
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
          onClick={handleConfirm}
          autoFocus
          sx={{
            backgroundColor: "#D94F37",
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
              backgroundColor: "#D94F37",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
