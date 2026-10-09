import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { LuCloudSun, LuHardDrive, LuMap } from "react-icons/lu";

const sources = [
  { icon: LuCloudSun, text: "Forecasts and weather maps come from Tomorrow.io." },
  { icon: LuMap, text: "City search and the base map use OpenStreetMap." },
  { icon: LuHardDrive, text: "Saved cities and unit choices stay in this browser." },
] as const;

function SettingsSide() {
  return (
    <div className="mt-0 flex w-full flex-col gap-4 lg:mt-11">
      <BoxWrapper className="w-full">
        <p className="eyebrow">WeatherCast</p>
        <h2 className="mt-1 mb-5 font-display text-2xl font-semibold tracking-tight text-primary-foreground">
          About
        </h2>
        <ul className="flex flex-col gap-4">
          {sources.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-3 text-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/5 text-foreground">
                <Icon aria-hidden="true" size={16} />
              </span>
              <span className="pt-1.5">{text}</span>
            </li>
          ))}
        </ul>
      </BoxWrapper>
    </div>
  );
}

export default SettingsSide;
