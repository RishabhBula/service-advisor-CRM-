import { createAction } from "redux-actions";

export const PdfActions = {
  GENRATE_INVOICE: "Genrate Invoice Requested!",
  GENRATE_INVOICE_SUCCESS: "Genrate Invoice Success!"
};

export const genrateInvoice = createAction(
  PdfActions.GENRATE_INVOICE
);
export const genrateInvoiceSuccess = createAction(
  PdfActions.GENRATE_INVOICE_SUCCESS
);
