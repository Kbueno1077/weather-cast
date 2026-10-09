import { LuBuilding2, LuCloudSun, LuMap, LuSettings2 } from "react-icons/lu";

export const navLinks = [
  { to: "/", label: "Weather", icon: LuCloudSun },
  { to: "/cities", label: "Cities", icon: LuBuilding2 },
  { to: "/map", label: "Map", icon: LuMap },
  { to: "/settings", label: "Settings", icon: LuSettings2 },
] as const;
