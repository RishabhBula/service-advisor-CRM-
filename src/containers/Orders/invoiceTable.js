import React, { Component } from "react";
import moment from "moment";

import {
  calculateSubTotal,
  getSumOfArray,
  calculateValues,
  serviceTotalsCalculation
} from "../../helpers";

class InvoiceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getServiceItems = serviceItemData => {
    const serviceTd = {
      fontSize: "12px",
      borderBottom: "1px solid #ddd",
      borderRight: "1px solid #ddd",
      padding: "3px",
      fontFamily: "Open Sans"
    };
    let  calSubTotal = 0;
    var table = [];
    for (let j = 0; j < serviceItemData.length; j++) {
      let service = serviceItemData[j];
      var val = service.description || service.brandName || service.discription;
      var note =
        (service.serviceType === "part" &&
        service.partOptions &&
        service.partOptions.showNoteOnQuoteAndInvoice
          ? "Note : " + service.note
          : "") ||
        (service.serviceType === "tire" &&
        service.tierPermission &&
        service.tierPermission.showNoteOnQuotesInvoices &&
        service.tierSize[0].notes !== ""
          ? "Note : " + service.tierSize[0].notes
          : "");

      var partnumber =
        (service.serviceType === "part" &&
        service.partOptions &&
        service.partOptions.showNumberOnQuoteAndInvoice &&
        service.partNumber !== ""
          ? service.partNumber
          : "") || "";
      // var serviceType = service.serviceType;
      var qty = service.qty || "";
      var hours = service.hours;
      var hourlyRate = service.rate ? service.rate.hourlyRate : 0;
      var cost =
        service.retailPrice ||
        (service.tierSize ? service.tierSize[0].retailPrice : null) ||
        0;

      calSubTotal = calculateSubTotal(
        cost,
        qty || 0,
        hours || 0,
        hourlyRate
      ).toFixed(2);
      const subDiscount = calculateValues(
        calSubTotal || 0,
        service.discount.value || 0,
        service.discount.type
      );
      const servicesSubTotal = (
        parseFloat(calSubTotal) - parseFloat(subDiscount)
      ).toFixed(2);
      var discountType = service.discount.type;
      var discountValue = service.discount.value || 0;
      var discountMainVal = "";
      discountMainVal =
        discountValue > 0
          ? discountType === "%"
            ? discountValue + "%"
            : "$" + discountValue
          : 0;
      table.push(
        <tr key={j}>
          <td style={serviceTd}>{val}</td>
          <td style={serviceTd}>
            {service.serviceType === "part" &&
            service.partOptions &&
            service.partOptions.showPriceOnQuoteAndInvoice
              ? "$" + cost
              : service.serviceType === "tire"
              ? "$" + cost
              : "-" || "-"}
          </td>
          <td style={serviceTd}>
            {service.serviceType === "part" &&
            service.partOptions &&
            service.partOptions.showPriceOnQuoteAndInvoice
              ? qty
              : service.serviceType === "tire"
              ? qty
              : "-" || "-"}
          </td>
          <td style={serviceTd}>{hours || "-"}</td>
          <td style={serviceTd}>{discountMainVal}</td>
          <td style={serviceTd}>{servicesSubTotal}</td>
        </tr>
      );
    }
    return table;
  };

  render() {
    const invoiceWarp = {
        width: "520px",
        marginRight: "5px",
        float: "left",
        fontSize: "13px",
        fontFamily: "Open Sans"
      },
      invoiceHeader = {
        width: "100%",
        clear: "both",
        float: "left"
      },
      totalTable = {
        width: "220px",
        border: "0px",
        float: "right",
        fontSize: "12px",
        fontFamily: "Open Sans"
      },
      totalTd = {
        width: "220px",
        fontSize: "12px",
        fontFamily: "Open Sans"
      },
      totalDivTitle = {
        width: "50%",
        display: "inline-block",
        fontFamily: "Open Sans"
      },
      totalDiv = {
        width: "50%",
        display: "inline-block",
        fontFamily: "Open Sans",
      },
      totalDivSpan = {
        paddingLeft : '20px'
      },
      serviceTableWarp = {
        width: "100%",
        clear: "both",
        float: "left",
        marginBottom: "20px",
        border: "1px solid #ddd",
        fontFamily: "Open Sans"
      },
      serviceTable = {
        width: "100%"
      },
      serviceTr = {
        textAlign: "left",
        fontSize: "11px",
        borderBottom: "1px solid #ddd",
        borderRight: "1px solid #ddd",
        padding: "3px",
        fontWeight: "normal",
        fontFamily: "Open Sans"
      },
      serviceTitle = {
        background: "#d8d5d5",
        color: "#000",
        textAlign: "left",
        padding: "5px",
        fontSize: "12px",
        fontFamily: "Open Sans"
      },
      InvoiceTitleBlock = {
        width: "50%",
        float: "left",
        fontFamily: "Open Sans"
      },
      InvoiceTitle = {
        width: "100%",
        fontSize: "12px",
        marginBottom: "5px",
        fontFamily: "Open Sans"
      },
      epaRow = {
        width: "100%",
        float: "left",
        fontSize: "11px",
        background: "#ccc",
        fontFamily: "Open Sans"
      },
      epaColumn = {
        display: "inline-block",
        marginRight: "10px",
        padding: "2px",
        fontFamily: "Open Sans"
      },
      epaServiceTotal = {
        float: "right",
        marginRight: "45px",
        display: "inline-block",
        padding: "2px",
        fontFamily: "Open Sans"
      },
      companyHeading = {
        width: "100%",
        fontSize: "12px",
        textAlign: "center",
        paddingRight: "30px",
        fontFamily: "Open Sans"
      },
      totalLine = {
        margin: "5px 0",
        background: "#dddddd",
        height: "1px",
        fontFamily: "Open Sans"
      },
      comapnyNameDiv = {
        width: "40%",
        float: "right",
        fontFamily: "Open Sans"
      },
      customerDetail = {
        width: "100%",
        clear: "both",
        float: "left",
        border: "1px solid #ddd",
        padding: "5px 0",
        margin: "5px 0 10px",
        fontFamily: "Open Sans"
      },
      customerDetailLeft = {
        width: "49%",
        float: "left",
        borderRight: "1px solid #ddd",
        paddingTop: "5px",
        paddingLeft: "5px",
        fontFamily: "Open Sans"
      },
      customerDetailRight = {
        width: "49%",
        float: "left",
        fontFamily: "Open Sans"
      },
      vehicelDetail = {
        margin: "0px",
        fontSize: "12px",
        paddingLeft: "10px",
        paddingTop: "5px",
        fontFamily: "Open Sans"
      };

    const { orderReducer, profileReducer } = this.props;

    const orderData = this.props.orderReducer.orderItems;
    const customerData = orderData.customerId;
    const comapnyInfo = profileReducer ? profileReducer.profileInfo : "";
      console.log(orderData, "orderData");
    const serviceData =
      orderReducer && orderReducer.orderItems
        ? orderReducer.orderItems.serviceId
        : "";
    const orderName =
      orderReducer && orderReducer.orderItems
        ? orderReducer.orderItems.orderName
        : "";
    const orderId = orderData.orderId || "";
    const orderDate = moment(orderData.createdAt || "").format("MMM Do YYYY");
    const companyName = comapnyInfo.companyName;
    const vehilceInfo =
      orderData.vehicleIdorderData.vehicleId.year +
      " " +
      orderData.vehicleId.make +
      " " +
      orderData.vehicleId.modal;

    const serviceCal = serviceTotalsCalculation(serviceData);
    const serviceTableInnner = [];
    let seriveItemTr;
    for (let i = 0; i < serviceData.length; i++) {
      serviceTableInnner.push(
        <div style={serviceTableWarp} className={"invoceTableDesign"} key={i}>
          <div style={serviceTitle}>{serviceData[i].serviceId.serviceName}</div>
          <table
            id="tbl"
            style={serviceTable}
            cellPadding="0"
            cellSpacing="0"
            border="0"
          >
            <thead>
              <tr>
                <th style={serviceTr} width="200">
                  Service Title
                </th>
                <th style={serviceTr}>Price</th>
                <th style={serviceTr}>Qty</th>
                <th style={serviceTr}>Hours</th>
                <th style={serviceTr}>Discount</th>
                <th style={serviceTr}>Sub total</th>
              </tr>
            </thead>
            <tbody>
              {
                (seriveItemTr = this.getServiceItems(
                  serviceData[i].serviceId.serviceItems
                ))
              }
            </tbody>
          </table>
          <div style={epaRow}>
            <div style={epaColumn}>
              Epa : {parseFloat(serviceCal.serviceEpa[i]).toFixed(2)}
            </div>
            <div style={epaColumn}>
              Discount: {parseFloat(serviceCal.serviceTax[i]).toFixed(2)}
            </div>
            <div style={epaColumn}>
              Tax : {parseFloat(serviceCal.serviceDiscount[i]).toFixed(2)}
            </div>
            <div style={epaServiceTotal}>
              Service Total: ${serviceCal.serviceCount[i]}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id={"invoicePDF"} style={invoiceWarp}>
        <div style={invoiceHeader}>
          <div style={InvoiceTitleBlock}>
            <div style={InvoiceTitle}>Invoice : #{orderId}</div>
            <div style={InvoiceTitle}>Created : {orderDate}</div>
          </div>
          <div style={comapnyNameDiv}>
            <div style={companyHeading}>{companyName}</div>
          </div>
        </div>

        <div style={customerDetail}>
          <div style={customerDetailLeft}>
            <div style={InvoiceTitle}>
              {customerData.firstName + " " + customerData.lastName}
            </div>
            <div style={InvoiceTitle}>{customerData.email}</div>
          </div>
          <div style={customerDetailRight}>
            <div style={vehicelDetail}>{vehilceInfo}</div>
          </div>
        </div>

        {serviceTableInnner}

        <table style={totalTable} id="invoiceTable">
          <thead>
            <tr>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={totalTd}>
                <div style={totalDivTitle}>Total Parts </div>
                <div style={totalDiv}>
                  : <span style={totalDivSpan}>${serviceCal.totalParts}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={totalTd}>
                <div style={totalDivTitle}>Total Tires</div>
                <div style={totalDiv}>
                  : <span style={totalDivSpan}>${serviceCal.totalTires}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={totalTd}>
                <div style={totalDivTitle}>Total Labor</div>
                <div style={totalDiv}>
                  : <span style={totalDivSpan}>${serviceCal.totalLabor}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={totalTd}>
                <div style={totalLine} />
                <div style={totalDivTitle}>Sub Total</div>
                <div style={totalDiv}>
                  : <span style={totalDivSpan}>${serviceCal.orderSubTotal}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={totalTd}>
                <div style={totalDivTitle}>Total Tax</div>
                <div style={totalDiv}>
                  : <span style={totalDivSpan}>+ ${serviceCal.totalTax}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={totalTd}>
                <div style={totalDivTitle}>Total Discount</div>
                <div style={totalDiv}>
                  : <span style={totalDivSpan}>- ${serviceCal.totalDiscount}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={totalTd}>
                <div style={totalDivTitle}>Grand Total</div>
                <div style={totalDiv}>
                  : <span style={totalDivSpan}>${serviceCal.orderGrandTotal}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <img
            src="http://serviceadvisor.io/images/banner-right-img.png"
            alt="logo"
            width="100"
          />
        </div>
      </div>
    );
  }
}

export default InvoiceTable;
