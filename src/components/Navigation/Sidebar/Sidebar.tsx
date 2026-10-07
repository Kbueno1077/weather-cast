import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { Button } from "@heroui/react";
import { CiMap } from "react-icons/ci";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdOutlineDisplaySettings } from "react-icons/md";
import { PiCityLight } from "react-icons/pi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Weather", icon: TiWeatherPartlySunny },
  { to: "/cities", label: "Cities", icon: PiCityLight },
  { to: "/map", label: "Map", icon: CiMap },
  { to: "/settings", label: "Settings", icon: MdOutlineDisplaySettings },
] as const;

function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <BoxWrapper className="fixed h-[calc(100vh-2rem)] w-[85px] sm:block hidden px-0">
      <div className="flex flex-col justify-center items-center">
        <Link to="/" aria-label="WeatherCast home">
          <Button variant="light" className="py-10 w-[60px]">
            <FaUmbrellaBeach size={25} />
          </Button>
        </Link>
      </div>

      <div className="mt-10 flex flex-col justify-center items-center">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          const color = active
            ? "hsl(var(--primary-foreground))"
            : "hsl(var(--foreground))";

          return (
            <Link key={link.to} to={link.to} aria-current={active ? "page" : undefined}>
              <Button variant="light" className="py-10 w-[60px]">
                <div className="flex flex-col gap-2 items-center justify-center">
                  <Icon size={20} style={{ color }} />
                  <h2 className="text-sm" style={{ color }}>
                    {link.label}
                  </h2>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </BoxWrapper>
  );
}

export default Sidebar;
