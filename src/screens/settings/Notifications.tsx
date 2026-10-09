import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { Switch } from "@heroui/react";
import { switchClassNames } from "@/components/ui/switchStyles";
import SettingRow from "./SettingRow";

function Notifications() {
  return (
    <BoxWrapper title="Notifications" className="w-full">
      <SettingRow title="Weather alerts" description="Alerts are not available yet">
        <Switch
          isDisabled
          classNames={switchClassNames}
          aria-label="Weather notifications, not available yet"
        />
      </SettingRow>
    </BoxWrapper>
  );
}

export default Notifications;
