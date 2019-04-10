export default {
  items: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "cui-dashboard",
      authKey: "isAllowedDashboard",
      // badge: {
      //   variant: "info",
      //   text: "NEW"
      // }
    },

    {
      name: "Workflow",
      url: "/workflow",
      icon: "icon-puzzle",
      authKey: "isAllowedWorkflow",
    },
    {
      name: "Calendar",
      url: "/calender",
      icon: "cui-calendar",
      authKey: "isAllowedCalendar",
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
      name: "Settings",
      url: "/settings",
      icon: "fa fa-cog",
      authKey: "isAllowedCompanySettings",
      children: [
        {
          name: "Staff Members",
          url: "/settings/users",
          icon: "fa fa-users",
        },
        {
          name: "Customers",
          url: "/customers",
          icon: "icon-puzzle",
        },
        {
          name: "Vehicles",
          url: "/vehicles",
          icon: "icon-puzzle",
        },
        {
          name: "Fleets",
          url: "/fleets",
          icon: "icon-puzzle",
        },
      ],
    },
  ],
};
