import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import Divider from "@/components/ui/Divider/Divider";

function SettingsSide() {
  return (
    <div className="flex flex-col gap-4 w-full mt-11">
      <BoxWrapper className="w-full">
        <h2 className="text-primary-foreground font-bold text-3xl mb-5">About</h2>
        <Divider />
        <div className="mt-5 flex flex-col gap-3">
          <p>Forecasts and weather maps come from Tomorrow.io.</p>
          <p>City search and the base map use OpenStreetMap.</p>
          <p>Saved cities and unit choices stay in this browser.</p>
        </div>
      </BoxWrapper>
    </div>
  );
}

export default SettingsSide;
