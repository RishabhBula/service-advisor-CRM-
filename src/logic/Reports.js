import { createLogic } from "redux-logic";
import { ReportActions, updateCustomerReportData } from "../actions";
import { logger, ApiHelper } from "../helpers";

const getCustomerInvoiceReportLogic = createLogic({
  type: ReportActions.GET_CUSTOMER_INVOICE_REPORTS,
  async process({ action }, dispatch, done) {
    logger(action.payload);
    dispatch(
      updateCustomerReportData({
        isLoading: true,
        data: []
      })
    );
    const result = await new ApiHelper().FetchFromServer(
      "/reports",
      "",
      "GET",
      true,
      action.payload
    );
    logger(result);
    if (result.isError) {
      dispatch(
        updateCustomerReportData({
          isLoading: false,
          data: []
        })
      );
      done();
      return;
    }
    dispatch(
      updateCustomerReportData({
        isLoading: false,
        data: result.data.data
      })
    );
    done();
  }
});

/**
 *
 */
export const ReportLogics = [getCustomerInvoiceReportLogic];
