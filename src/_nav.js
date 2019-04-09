export default {
  items: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "icon-speedometer",
      // badge: {
      //   variant: "info",
      //   text: "NEW"
      // }
    },

    {
      name: "Workflow",
      url: "/workflow",
      icon: "icon-puzzle",
    },
    {
      name: "Calendar",
      url: "/calender",
      icon: "icon-puzzle",
    },
    {
      name: "Inventory",
      url: "/inventory",
      icon: "icon-puzzle",
    },
    {
      name: "Time Clocks",
      url: "/timesheets",
      icon: "icon-puzzle",
    },
    {
      name: "Reports",
      url: "/reports",
      icon: "icon-puzzle",
    },
    {
      name: "Common",
      url: "/common",
      icon: "icon-puzzle",
    },
    {
      name: "Settings",
      url: "/settings",
      icon: "fa fa-cog",
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
