import { toast } from "react-toastify";

export const showSuccessToast = (message) => {
    toast.success(message, {
      className: "bg-green-500 text-white font-semibold",
      bodyClassName: "text-sm",
      progressClassName: "bg-green-300",
    });
  };