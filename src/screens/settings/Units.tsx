import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import { Tab, Tabs } from "@nextui-org/react";

function Units() {
  const { unitSettings, changeSettingsUnit } = useWeatherStore(
    (state) => state
  );

  return (
    <BoxWrapper title="Units" className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <h2>Temperature</h2>

        <Tabs
          aria-label="Options"
          color="primary"
          classNames={{
            tabList: "bg-background",
            tab: "data-[selected=true]:bg-background",
            cursor: "data-[selected=true]:bg-primary",
          }}
          fullWidth
          selectedKey={unitSettings.temperatureUnit}
          onSelectionChange={(key) =>
            changeSettingsUnit("temperatureUnit", key as string)
          }
        >
          <Tab key="°C" title="Celsius"></Tab>
          <Tab key="°F" title="Fahrenheit"></Tab>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4">
        <h2>Wind Speed</h2>
        <Tabs
          aria-label="Options"
          color="primary"
          classNames={{
            tabList: "bg-background",
            tab: "data-[selected=true]:bg-background",
            cursor: "data-[selected=true]:bg-primary",
          }}
          fullWidth
          selectedKey={unitSettings.windSpeedUnit}
          onSelectionChange={(key) =>
            changeSettingsUnit("windSpeedUnit", key as string)
          }
        >
          <Tab key="km/h" title="km/h"></Tab>
          <Tab key="m/s" title="m/s"></Tab>
          <Tab key="knots" title="Knots"></Tab>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4">
        <h2>Pressure</h2>
        <Tabs
          aria-label="Options"
          color="primary"
          classNames={{
            tabList: "bg-background",
            tab: "data-[selected=true]:bg-background",
            cursor: "data-[selected=true]:bg-primary",
          }}
          fullWidth
          selectedKey={unitSettings.pressureUnit}
          onSelectionChange={(key) =>
            changeSettingsUnit("pressureUnit", key as string)
          }
        >
          <Tab key="hPa" title="hPa"></Tab>
          <Tab key="in" title="Inches"></Tab>
          <Tab key="kPa" title="kPa"></Tab>
          <Tab key="mm" title="mm"></Tab>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4">
        <h2>Precipitations</h2>
        <Tabs
          aria-label="Options"
          color="primary"
          classNames={{
            tabList: "bg-background",
            tab: "data-[selected=true]:bg-background",
            cursor: "data-[selected=true]:bg-primary",
          }}
          fullWidth
          selectedKey={unitSettings.precipitationUnit}
          onSelectionChange={(key) =>
            changeSettingsUnit("precipitationUnit", key as string)
          }
        >
          <Tab key="mm" title="Milimeters"></Tab>

          <Tab key="in" title="Inches"></Tab>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4">
        <h2>Distance</h2>
        <Tabs
          aria-label="Options"
          variant="solid"
          color="primary"
          classNames={{
            tabList: "bg-background",
            tab: "data-[selected=true]:bg-background",
            cursor: "data-[selected=true]:bg-primary",
          }}
          fullWidth
          selectedKey={unitSettings.distanceUnit}
          onSelectionChange={(key) =>
            changeSettingsUnit("distanceUnit", key as string)
          }
        >
          <Tab key="km" title="Kilometers"></Tab>

          <Tab key="mi" title="Miles"></Tab>
        </Tabs>
      </div>
    </BoxWrapper>
  );
}

export default Units;
