import {
  Tag,
  Dumbbell,
  ShoppingCart,
  CalendarCheck2,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  ScrollText
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Content",
      menus: [
        {
          href: "/dashboard/products",
          label: "Products",
          active: pathname === "/dashboard/products",
          icon: ScrollText,
          submenus: []
        },
        {
          href: "/dashboard/diet",
          label: "Diet Planner",
          active: pathname === "/dashboard/diet",
          icon: Bookmark,
          submenus: []
        },
        {
          href: "/dashboard/workout",
          label: "Workout",
          active: pathname === "/dashboard/workout",
          icon: Dumbbell,
          submenus: []
        },
        {
          href: "/schedule",
          label: "Schedule",
          active: pathname === "/schedule",
          icon: CalendarCheck2,
          submenus: [
            {
              href: "/dashboard/schedule/food",
              label: "Food",
              active: pathname === "/dashboard/schedule/food",
              icon: SquarePen,
            },
            {
              href: "/dashboard/schedule/workout",
              label: "Workout",
              active: pathname === "/schedule/workout",
              icon: SquarePen,
            }
          ]
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dashboard/account",
          label: "Account",
          active: pathname === "/dashboard/account",
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}
