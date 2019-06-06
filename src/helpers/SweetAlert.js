import Swal from "sweetalert2";
export const ConfirmBox = async obj => {
  if (!obj) {
    obj = {};
  }
  let {
    title,
    text,
    type,
    showCancelButton,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
  } = obj;
  return await Swal.fire({
    title: title || "Are you sure?",
    text: text || "You want to be able to revert this!",
    type: type || "warning",
    showCancelButton: typeof showCancelButton == 'undefined' ? true : showCancelButton,
    confirmButtonColor: confirmButtonColor || "#3085d6",
    cancelButtonColor: cancelButtonColor || "#d33",
    confirmButtonText: confirmButtonText || "Yes!",
  });
};
