import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import { cn } from "@/utils/cn";
import {
  convertDistance,
  convertPrecipitation,
  convertPressure,
  convertTemperature,
  convertWindSpeed,
} from "@/utils/utilities";
import { Button } from "@heroui/react";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  LuChevronDown,
  LuCloudRain,
  LuDroplets,
  LuEye,
  LuGauge,
  LuSun,
  LuThermometer,
  LuUmbrella,
  LuWind,
} from "react-icons/lu";

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

function compassPoint(degrees: number) {
  return COMPASS[Math.round((((degrees % 360) + 360) % 360) / 45) % 8];
}

interface StatProps {
  icon: IconType;
  label: string;
  value: string | number;
  unit?: string;
  detail?: string;
}

function Stat({ icon: Icon, label, value, unit, detail }: StatProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-background/40 p-4 ring-1 ring-white/[0.04] ring-inset">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-accent/10 text-accent">
          <Icon aria-hidden="true" size={15} />
        </span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-display text-2xl font-semibold text-primary-foreground tabular-nums">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-foreground">{unit}</span>}
      </p>
      {detail && <p className="-mt-2 text-xs">{detail}</p>}
    </div>
  );
}

const OtherDetails = () => {
  const [showMore, setShowMore] = useState(false);
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const unitSettings = useWeatherStore((state) => state.unitSettings);
  const values = currentWeather?.data.values;

  return (
    <BoxWrapper className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="eyebrow">Air conditions</h2>
        <Button
          size="sm"
          radius="full"
          className="bg-accent font-medium text-white"
          endContent={
            <LuChevronDown
              aria-hidden="true"
              className={cn("transition-transform duration-200", showMore && "rotate-180")}
            />
          }
          aria-expanded={showMore}
          onPress={() => setShowMore(!showMore)}
        >
          {showMore ? "See less" : "See more"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          icon={LuThermometer}
          label="Real feel"
          value={`${convertTemperature(values?.temperatureApparent || 0)[unitSettings.temperatureUnit]}°`}
        />
        <Stat
          icon={LuWind}
          label="Wind"
          value={convertWindSpeed(values?.windSpeed || 0)[unitSettings.windSpeedUnit]}
          unit={unitSettings.windSpeedUnit}
          detail={values ? `from ${compassPoint(values.windDirection)}` : undefined}
        />
        <Stat
          icon={LuUmbrella}
          label="Chance of rain"
          value={values?.precipitationProbability ?? "–"}
          unit="%"
        />
        <Stat icon={LuDroplets} label="Humidity" value={values?.humidity ?? "–"} unit="%" />

        {showMore && (
          <>
            <Stat icon={LuSun} label="UV index" value={values?.uvIndex ?? "–"} />
            <Stat
              icon={LuGauge}
              label="Pressure"
              value={convertPressure(values?.pressureSurfaceLevel || 0)[unitSettings.pressureUnit]}
              unit={unitSettings.pressureUnit}
            />
            <Stat
              icon={LuCloudRain}
              label="Precipitation"
              value={
                convertPrecipitation(values?.precipitationIntensity || 0)[
                  unitSettings.precipitationUnit
                ]
              }
              unit={`${unitSettings.precipitationUnit}/h`}
            />
            <Stat
              icon={LuEye}
              label="Visibility"
              value={convertDistance(values?.visibility || 0)[unitSettings.distanceUnit]}
              unit={unitSettings.distanceUnit}
            />
          </>
        )}
      </div>
    </BoxWrapper>
  );
};

export default OtherDetails;
