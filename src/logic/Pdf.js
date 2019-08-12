import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
//import { logger } from "../helpers/Logger";
import {
  genrateInvoiceSuccess,
  PdfActions,
  updateOrderDetailsRequest
} from "../actions";

const genrateInvoiceLogic = createLogic({
  type: PdfActions.GENRATE_INVOICE,
  async process({ action }, dispatch, done) {
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inspection",
      "/generatePdfDoc",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      done();
      return;
    } else {
      // toast.success(result.messages[0]);
      dispatch(genrateInvoiceSuccess(result.data.data));
      if (action.payload.isInspection) {
        dispatch(
          updateOrderDetailsRequest({
            _id: action.payload._id,
            inspectionURL: result.data.data,
            isChangedOrderStatus: true
          })
        );
      } else {
        dispatch(
          updateOrderDetailsRequest({
            _id: action.payload._id,
            invoiceURL: result.data.data,
            isPdfGenerated: true
          })
        );
      }
    }
    done();
  }
});

export const PdfLogic = [genrateInvoiceLogic];
