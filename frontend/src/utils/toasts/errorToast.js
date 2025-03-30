import { toast } from "react-toastify";

export const showErrorToast = (message) => {
  toast.error(message, {
    className: "bg-red-500 text-white font-semibold",
    bodyClassName: "text-sm",
    progressClassName: "bg-red-300",
  });
};