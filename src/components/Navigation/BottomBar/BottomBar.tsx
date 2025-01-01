import { Button } from "@nextui-org/react";
import { CiMap } from "react-icons/ci";
import { MdOutlineDisplaySettings } from "react-icons/md";
import { PiCityLight } from "react-icons/pi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { NavLink } from "react-router-dom";

function BottomBar() {
  return (
    <div
      className="bg-primary w-full sm:hidden py-3 px-2 fixed bottom-0 h-[70px] z-50 rounded-none"
      style={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.8)" }}
    >
      <div className="flex justify-center gap-6 items-center w-full ">
        <NavLink to="/" preventScrollReset={true}>
          {({ isActive }) => (
            <Button
              isIconOnly
              variant="flat"
              color={"primary"}
              size="lg"
              className={`text-white ${
                isActive ? "text-primary-foreground" : "text-primary/100"
              }`}
            >
              <TiWeatherPartlySunny size={28} />
            </Button>
          )}
        </NavLink>

        <NavLink to="/cities" preventScrollReset={true}>
          {({ isActive }) => (
            <Button
              color={"primary"}
              isIconOnly
              variant="flat"
              size="lg"
              className={`text-white ${
                isActive ? "text-primary-foreground" : "text-primary/100"
              }`}
            >
              <PiCityLight size={28} />
            </Button>
          )}
        </NavLink>

        <NavLink to="/map" preventScrollReset={true}>
          {({ isActive }) => (
            <Button
              color={"primary"}
              isIconOnly
              variant="flat"
              size="lg"
              className={`text-white ${
                isActive ? "text-primary-foreground" : "text-primary/100"
              }`}
            >
              <CiMap size={28} />
            </Button>
          )}
        </NavLink>

        <NavLink to="/settings" preventScrollReset={true}>
          {({ isActive }) => (
            <Button
              color={"primary"}
              isIconOnly
              variant="flat"
              size="lg"
              className={`text-white ${
                isActive ? "text-primary-foreground" : "text-primary/100"
              }`}
            >
              <MdOutlineDisplaySettings size={28} />
            </Button>
          )}
        </NavLink>
      </div>
    </div>
  );
}

export default BottomBar;
