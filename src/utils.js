import { toast } from "react-toastify";

export const showError = (error) => {
  toast.dark(error, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const showSuccess = (success) => {
  toast.info(success, {
    position: "top-left",
    autoClose: 2300,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
