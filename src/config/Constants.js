export const UserPermissions = [
  { key: "isAllowedDashboard", text: "Allow access to Dashboard?" },
  { key: "isAllowedWorkflow", text: "Allow access to Workflow?" },
  { key: "isAllowedCalendar", text: "Allow access to Calendar?" },
  { key: "isAllowedInventory", text: "Allow access to Inventory?" },
  { key: "isAllowedTimesheets", text: "Allow access to Time Clocks ?" },
  { key: "isAllowedReportCenter", text: "Allow access to Reports Center?" },
  { key: "isAllowedCompanySettings", text: "Allow access to Settings?" },
  { key: "isIncludedToCalendar", text: "Include this user on the calendar?" },
  {
    key: "isAllowedViewEveryonesCalendar",
    text: "Allow viewing of everyone’s calendar?"
  },
  { key: "isAllowedTimeclock", text: "Include a time clock for this user?" },
  {
    key: "isAllowedManualTimesheets",
    text:
      "Allow adding of time manually and editing of existing time clock entries?"
  },
  { key: "isAllowedInspections", text: "Allow editing Inspection Templates?" },
  { key: "isAllowedCannedJobs", text: "Allow editing Canned Services?" },
  {
    key: "isAllowedPricingMatrices",
    text: "Allow editing of Pricing Matrices?"
  },
  { key: "isAllowedMessagingCustomers", text: "Allow messaging customers?" },
  {
    key: "isPreventEditingUponAuthorize",
    text: "Prevent editing orders upon authorization?"
  },
  {
    key: "isPreventEditingUponInvoice",
    text: "Prevent editing orders upon converting to invoice?"
  },
  {
    key: "isFilteredWorkflowByTechnician",
    text: "Filter Workflow to only show orders assigned to this user?"
  },
  {
    key: "isAllowedProfitability",
    text: "Allow viewing of order profitability?"
  },
  {
    key: "isNotifyJobAssigned",
    text:
      "Receive email notifications when services are assigned or unassigned?"
  },
  {
    key: "isNotifyOrderAuthorized",
    text: "Receive email notifications when customer authorizes order?"
  },
  {
    key: "isNotifyCustomerSendsMessage",
    text: "Receive email notification when customer sends message?"
  },
  {
    key: "isNotifyCustomerMakesPayment",
    text: "Receive email notification when customer makes payment?"
  },
  {
    key: "isNotifyChangeAppointmentStatus",
    text:
      "Receive email notifications when appointments are confirmed or cancelled?"
  }
];

export const TechincianDefaultPermissions = {
  isAllowedDashboard: false,
  isAllowedWorkflow: true,
  isAllowedCalendar: true,
  isAllowedInventory: true,
  isAllowedTimesheets: true,
  isAllowedReportCenter: false,
  isAllowedCompanySettings: false,
  isIncludedToCalendar: true,
  isAllowedViewEveryonesCalendar: false,
  isAllowedTimeclock: true,
  isAllowedManualTimesheets: false,
  isAllowedInspections: false,
  isAllowedCannedJobs: false,
  isAllowedPricingMatrices: false,
  isAllowedMessagingCustomers: true,
  isPreventEditingUponAuthorize: false,
  isPreventEditingUponInvoice: false,
  isFilteredWorkflowByTechnician: false,
  isAllowedProfitability: false,
  isNotifyJobAssigned: true,
  isNotifyOrderAuthorized: false,
  isNotifyCustomerSendsMessage: false,
  isNotifyCustomerMakesPayment: false,
  isNotifyChangeAppointmentStatus: false
};

export const AdminDefaultPermissions = {
  isAllowedDashboard: true,
  isAllowedWorkflow: true,
  isAllowedCalendar: true,
  isAllowedInventory: true,
  isAllowedTimesheets: true,
  isAllowedReportCenter: true,
  isAllowedCompanySettings: true,
  isIncludedToCalendar: true,
  isAllowedViewEveryonesCalendar: true,
  isAllowedTimeclock: true,
  isAllowedManualTimesheets: true,
  isAllowedInspections: true,
  isAllowedCannedJobs: true,
  isAllowedPricingMatrices: true,
  isAllowedMessagingCustomers: true,
  isPreventEditingUponAuthorize: false,
  isPreventEditingUponInvoice: false,
  isFilteredWorkflowByTechnician: false,
  isAllowedProfitability: true,
  isNotifyJobAssigned: true,
  isNotifyOrderAuthorized: true,
  isNotifyCustomerSendsMessage: true,
  isNotifyCustomerMakesPayment: true,
  isNotifyChangeAppointmentStatus: true
};

export const CustomerPermissionsText = [
  { key: "isCorporateFleetTaxExempt", text: "Is this customer tax exempt?" },
  {
    key: "shouldReceiveDiscount",
    text: "Does this customer receive a discount?"
  },
  {
    key: "shouldLaborRateOverride",
    text: "Does this customer have a labor rate override?"
  },
  {
    key: "shouldPricingMatrixOverride",
    text: "Does this customer have a pricing matrix override?"
  }
];

export const CustomerDefaultPermissions = {
  isCorporateFleetTaxExempt: {
    status: false
  },
  shouldReceiveDiscount: {
    status: false,
    percentageDiscount: "0"
  },
  shouldLaborRateOverride: {
    status: false,
    laborRate: null
  },
  shouldPricingMatrixOverride: {
    status: false,
    pricingMatrix: null
  }
};

export const PhoneOptions = [
  { key: "mobile", text: "Mobile" },
  { key: "work", text: "Work" },
  { key: "home", text: "Home" },
  { key: "office", text: "Office" },
  { key: "fax", text: "Fax" },
  { key: "other", text: "Other" }
];

export const RoleOptions = [
  {
    key: "5ca3473d70537232f13ff1f9",
    text: "Sub-Admin"
  },
  {
    key: "5ca3473d70537232f13ff1fa",
    text: "Technician"
  }
];

export const Transmission = [
  {
    key: "automatic",
    text: "Automatic"
  },
  {
    key: "manual",
    text: "Manual"
  }
];

export const Drivetrain = [
  {
    key: "2x4",
    text: "2x4"
  },
  {
    key: "4x4",
    text: "4x4"
  }
];

export const LabourPermission = {
  isShowHours: false,
  showNoteOnQuotesInvoices: false
}
export const LabourPermissionText = {
  isShowHours: "Display hours on quote & invoice",
  showNoteOnQuotesInvoices: "Display note on quote & invoice" 
}
export const tierPermission = {
   showNoteOnQuotesInvoices: false
 }
export const tierPermissionText = {
  showNoteOnQuotesInvoices: "Display note on quote & invoice"
};
export const orderPermission = {
  isShowHours: true,
  showNoteOnQuotesInvoices: true
};

export const LabourText = [
  { key: "isShowHours", text: "Display hours on quote & invoice" },
  {
    key: "showNoteOnQuotesInvoices",
    text: "Display note on quote & invoice",
  },
 ];

export const LabourTextDefault = {
  isShowHours: false,
  showNoteOnQuotesInvoices: false,
};
export const CreatePartOptions = [
  {
    key: "isTaxed",
    text: "Should this be taxed?"
  },
  {
    key: "showNumberOnQuoteAndInvoice",
    text: "Display part number on quote & invoice"
  },
  {
    key: "showPriceOnQuoteAndInvoice",
    text: "Display price and quantity on quote & invoice"
  },
  {
    key: "showNoteOnQuoteAndInvoice",
    text: "Display note on quote & invoice"
  }
];

/*  */
export const MarkupChangeValues = [
  {
    key: "15%",
    value: 15
  },
  {
    key: "25%",
    value: 25
  },
  {
    key: "35%",
    value: 35
  },
  {
    key: "50%",
    value: 50
  }
];

/*  */
export const MarginChangeValues = [
  {
    key: "15%",
    value: 15
  },
  {
    key: "25%",
    value: 25
  },
  {
    key: "35%",
    value: 35
  },
  {
    key: "50%",
    value: 50
  }
];

export const DefaultErrorMessage =
  "We are having some issues while completing your request. Please try after some time.";

export const notExist = "-"
export const WildCardRoutes = ["/profile"];

export const CustomerSheetHeaderToJSONKey = {
  "First Name": "firstName",
  "Last Name": "lastName",
  Phone: "value",
  "Phone Type": "phone",
  Email: "email",
  Company: "company",
  Address: "address",
  City: "city",
  State: "state",
  "Zip Code": "zipCode",
  "Is Tax Exempt": "isCorporateFleetTaxExempt",
  "Is Receive A Discount?": "shouldReceiveDiscount"
};
