import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { Switch } from "@nextui-org/react";

function Notifications() {
  return (
    <BoxWrapper title="Notifications" className="w-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-primary-foreground">Notifications</h2>
          <p>Be aware of the weather</p>
        </div>

        <Switch
          disabled={true}
          aria-label="Automatic updates"
          color="success"
        />
      </div>
    </BoxWrapper>
  );
}

export default Notifications;
