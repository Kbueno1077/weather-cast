import { Button } from "@nextui-org/react";
import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { CiMap } from "react-icons/ci";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdOutlineDisplaySettings } from "react-icons/md";
import { PiCityLight } from "react-icons/pi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  // Function to determine text color based on current path
  const getTextColor = (path: string) => {
    return location.pathname.startsWith(path) && path !== "/"
      ? "hsl(var(--primary-foreground))"
      : location.pathname === path
      ? "hsl(var(--primary-foreground))"
      : "hsl(var(--foreground))";
  };

  return (
    <BoxWrapper className="fixed h-[calc(100vh-2rem)] w-[85px] sm:block hidden px-0">
      <div className="flex flex-col justify-center items-center">
        <Link to={"/"}>
          <Button variant="light" className={`py-10 w-[60px]`}>
            <div className="p-2 flex flex-col gap-2 items-center justify-center">
              <FaUmbrellaBeach size={25} />
            </div>
          </Button>
        </Link>
      </div>

      <div className="mt-10 flex flex-col justify-center items-center">
        <Link to={"/"}>
          <Button variant="light" className="py-10 w-[60px]">
            <div className="p-2 flex flex-col gap-2 items-center justify-center">
              <TiWeatherPartlySunny
                size={20}
                style={{ color: getTextColor("/") }}
              />
              <h2 className="text-sm" style={{ color: getTextColor("/") }}>
                Weather
              </h2>
            </div>
          </Button>
        </Link>

        <Link to={"/cities"}>
          <Button variant="light" className="py-10 w-[60px]">
            <div className="flex flex-col gap-2 items-center justify-center">
              <PiCityLight
                size={20}
                style={{ color: getTextColor("/cities") }}
              />
              <h2
                className="text-sm"
                style={{ color: getTextColor("/cities") }}
              >
                Cities
              </h2>
            </div>
          </Button>
        </Link>

        <Link to={"/map"}>
          <Button variant="light" className="py-10 w-[60px]">
            <div className="flex flex-col gap-2 items-center justify-center">
              <CiMap size={20} style={{ color: getTextColor("/map") }} />
              <h2 className="text-sm" style={{ color: getTextColor("/map") }}>
                Map
              </h2>
            </div>
          </Button>
        </Link>

        <Link to="/settings">
          <Button variant="light" className="py-10 w-[60px]">
            <div className="flex flex-col gap-2 items-center justify-center">
              <MdOutlineDisplaySettings
                size={20}
                style={{ color: getTextColor("/settings") }}
              />
              <h2
                className="text-sm"
                style={{ color: getTextColor("/settings") }}
              >
                Settings
              </h2>
            </div>
          </Button>
        </Link>
      </div>
    </BoxWrapper>
  );
}

export default Sidebar;
