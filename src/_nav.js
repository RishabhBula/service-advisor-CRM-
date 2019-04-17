export default {
  items: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "fa fa-dashboard",
      authKey: "isAllowedDashboard"
      // badge: {
      //   variant: "info",
      //   text: "NEW"
      // }
    },

    // {
    //   name: "Workflow",
    //   url: "/workflow",
    //   icon: "icon-puzzle",
    //   authKey: "isAllowedWorkflow",
    // },
    {
      name: "Calendar",
      url: "/calender",
      icon: "fa fa-calendar-alt",
      authKey: "isAllowedCalendar"
    },
    // {
    //   name: "Inventory",
    //   url: "/inventory",
    //   icon: "icon-puzzle",
    //   authKey: "isAllowedInventory",
    // },
    // {
    //   name: "Time Clocks",
    //   url: "/timesheets",
    //   icon: "icon-puzzle",
    //   authKey: "isAllowedTimesheets",
    // },
    // {
    //   name: "Reports",
    //   url: "/reports",
    //   icon: "icon-puzzle",
    //   authKey: "isAllowedReportCenter",
    // },
    // {
    //   name: "Common",
    //   url: "/common",
    //   icon: "icon-puzzle",
    // },
    {
      name: "Staff Members",
      url: "/settings/users",
      icon: "fa fa-users",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: "Customers",
      url: "/settings/customers",
      icon: "fa fa-users",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: "Vehicles",
      url: "/settings/vehicles",
      icon: "fa fa-cab",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: "Fleets",
      url: "/settings/fleets",
      icon: "fas fa-car",
      authKey: "isAllowedCompanySettings"
    }
    // {
    //   name: "Settings",
    //   isOpen: true,
    //   url: "/settings",
    //   icon: "fa fa-cog",
    //   authKey: "isAllowedCompanySettings",
    //   children: [
    //     {
    //       name: "Staff Members",
    //       url: "/settings/users",
    //       icon: "fa fa-users",
    //       isOpen: true
    //     },
    //     {
    //       name: "Customers",
    //       url: "/settings/customers",
    //       icon: "fa fa-users"
    //     },
    //     {
    //       name: "Vehicles",
    //       url: "/settings/vehicles",
    //       icon: "fa fa-cab"
    //     },
    //     {
    //       name: "Fleets",
    //       url: "/settings/fleets",
    //       icon: "fas fa-car"
    //     }
    //   ]
    // }
  ]
};
