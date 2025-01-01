import General from "./General";
import Notifications from "./Notifications";
import SettingsSide from "./SettingsSide";
import Units from "./Units";

export default function Settings() {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-2/3 flex flex-col items-start justify-start gap-4">
        <Units />
        <Notifications />
        <General />
      </div>

      <div className="w-full lg:w-1/3 flex flex-col items-start justify-start gap-4">
        <SettingsSide />
      </div>
    </div>
  );
}
