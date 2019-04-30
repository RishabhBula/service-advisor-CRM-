import { AppRoutes } from "./config/AppRoutes";

export default {
  items: [
    {
      name: AppRoutes.HOME.name,
      url: AppRoutes.DASHBOARD.url,
      icon: "fa fa-dashboard",
      authKey: "isAllowedDashboard"
    },
    {
      name: AppRoutes.CALENDER.name,
      url: AppRoutes.CALENDER.url,
      icon: "fa fa-calendar-alt",
      authKey: "isAllowedCalendar"
    },
    {
      name: AppRoutes.INVENTORY.name,
      url: AppRoutes.INVENTORY.url,
      icon: "fa fa-database",
      authKey: "isAllowedInventory"
    },
    {
      name: AppRoutes.STAFF_MEMBERS.name,
      url: AppRoutes.STAFF_MEMBERS.url,
      icon: "fa fa-users",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: AppRoutes.CUSTOMERS.name,
      url: AppRoutes.CUSTOMERS.url,
      icon: "fa fa-users",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: AppRoutes.VEHICLES.name,
      url: AppRoutes.VEHICLES.url,
      icon: "fa fa-cab",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: AppRoutes.FLEETS.name,
      url: AppRoutes.FLEETS.url,
      icon: "fas fa-car",
      authKey: "isAllowedCompanySettings"
    },
    {
      name: AppRoutes.PRICEMATRIX.name,
      url: AppRoutes.PRICEMATRIX.url,
      icon: "fas fa-hand-holding-usd",
      authKey: "isAllowedCompanySettings"
    }
  ]
};

export const ValidatedRoutes = [
  {
    url: AppRoutes.DASHBOARD.url,
    authKey: "isAllowedDashboard"
  },
  {
    url: AppRoutes.CALENDER.url,
    authKey: "isAllowedCalendar"
  },
  {
    url: AppRoutes.INVENTORY.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.INVENTORY_PARTS.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.INVENTORY_TIRES.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.INVENTORY_LABOURS.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.INVENTORY_VENDORS.url,
    authKey: "isAllowedInventory"
  },
  {
    url: AppRoutes.SETTINGS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.STAFF_MEMBERS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.CUSTOMERS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.VEHICLES.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.FLEETS.url,
    authKey: "isAllowedCompanySettings"
  },
  {
    url: AppRoutes.PRICEMATRIX.url,
    authKey: "isAllowedCompanySettings"
  }
];
