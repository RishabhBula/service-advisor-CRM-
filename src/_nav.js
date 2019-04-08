export default {
  items: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "icon-speedometer"
      // badge: {
      //   variant: "info",
      //   text: "NEW"
      // }
    },

    {
      name: "Workflow",
      url: "/workflow",
      icon: "icon-puzzle"
    },
    {
      name: "Calendar",
      url: "/calender",
      icon: "icon-puzzle"
    },
    {
      name: "Inventory",
      url: "/inventory",
      icon: "icon-puzzle"
    },
    {
      name: "Time Clocks",
      url: "/timesheets",
      icon: "icon-puzzle"
    },
    {
      name: "Reports",
      url: "/reports",
      icon: "icon-puzzle"
    },
    {
      name: "Common",
      url: "/common",
      icon: "icon-puzzle"
    },
    {
      name: "Users",
      url: "/users",
      icon: "fa fa-users",
    },
    {
      name: "Settings",
      url: "/settings",
      icon: "fa fa-cog",
      children: [
        {
          name: "Customers",
          url: "/settings/customers",
          icon: "icon-puzzle"
        },
        {
          name: "Vehicles",
          url: "/settings/vehicles",
          icon: "icon-puzzle"
        }
      ]
    }
  ]
};
