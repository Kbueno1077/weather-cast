import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import { Tab, Tabs } from "@heroui/react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuCloudRain, LuGauge, LuRuler, LuThermometer, LuWind } from "react-icons/lu";

function isOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[]
): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

const unitTabClassNames = {
  tabList: "rounded-xl bg-background/60 p-1 ring-1 ring-white/5 ring-inset",
  tab: "h-9",
  cursor: "rounded-lg bg-accent shadow-[0_6px_16px_-6px_rgb(59_130_246/0.8)]",
  tabContent: "font-medium text-foreground group-data-[selected=true]:text-white",
};

function UnitRow({ icon: Icon, label, children }: { icon: IconType; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-center md:gap-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-primary-foreground md:w-36 md:shrink-0">
        <Icon aria-hidden="true" size={16} className="text-foreground" />
        {label}
      </h3>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Units() {
  const { unitSettings, changeSettingsUnit } = useWeatherStore(
    (state) => state
  );

  return (
    <BoxWrapper title="Units" className="w-full">
      <div className="divide-y divide-line">
        <UnitRow icon={LuThermometer} label="Temperature">
          <Tabs
            aria-label="Temperature unit"
            color="primary"
            classNames={unitTabClassNames}
            fullWidth
            selectedKey={unitSettings.temperatureUnit}
            onSelectionChange={(key) => {
              if (isOneOf(key, ["°C", "°F"] as const)) {
                changeSettingsUnit("temperatureUnit", key);
              }
            }}
          >
            <Tab key="°C" title="Celsius"></Tab>
            <Tab key="°F" title="Fahrenheit"></Tab>
          </Tabs>
        </UnitRow>

        <UnitRow icon={LuWind} label="Wind speed">
          <Tabs
            aria-label="Wind speed unit"
            color="primary"
            classNames={unitTabClassNames}
            fullWidth
            selectedKey={unitSettings.windSpeedUnit}
            onSelectionChange={(key) => {
              if (isOneOf(key, ["km/h", "m/s", "knots"] as const)) {
                changeSettingsUnit("windSpeedUnit", key);
              }
            }}
          >
            <Tab key="km/h" title="km/h"></Tab>
            <Tab key="m/s" title="m/s"></Tab>
            <Tab key="knots" title="Knots"></Tab>
          </Tabs>
        </UnitRow>

        <UnitRow icon={LuGauge} label="Pressure">
          <Tabs
            aria-label="Pressure unit"
            color="primary"
            classNames={unitTabClassNames}
            fullWidth
            selectedKey={unitSettings.pressureUnit}
            onSelectionChange={(key) => {
              if (isOneOf(key, ["hPa", "in", "kPa", "mm"] as const)) {
                changeSettingsUnit("pressureUnit", key);
              }
            }}
          >
            <Tab key="hPa" title="hPa"></Tab>
            <Tab key="in" title="Inches"></Tab>
            <Tab key="kPa" title="kPa"></Tab>
            <Tab key="mm" title="mm"></Tab>
          </Tabs>
        </UnitRow>

        <UnitRow icon={LuCloudRain} label="Precipitation">
          <Tabs
            aria-label="Precipitation unit"
            color="primary"
            classNames={unitTabClassNames}
            fullWidth
            selectedKey={unitSettings.precipitationUnit}
            onSelectionChange={(key) => {
              if (isOneOf(key, ["mm", "in"] as const)) {
                changeSettingsUnit("precipitationUnit", key);
              }
            }}
          >
            <Tab key="mm" title="Millimeters"></Tab>
            <Tab key="in" title="Inches"></Tab>
          </Tabs>
        </UnitRow>

        <UnitRow icon={LuRuler} label="Distance">
          <Tabs
            aria-label="Distance unit"
            variant="solid"
            color="primary"
            classNames={unitTabClassNames}
            fullWidth
            selectedKey={unitSettings.distanceUnit}
            onSelectionChange={(key) => {
              if (isOneOf(key, ["km", "mi"] as const)) {
                changeSettingsUnit("distanceUnit", key);
              }
            }}
          >
            <Tab key="km" title="Kilometers"></Tab>
            <Tab key="mi" title="Miles"></Tab>
          </Tabs>
        </UnitRow>
      </div>
    </BoxWrapper>
  );
}

export default Units;
