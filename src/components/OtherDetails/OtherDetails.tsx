import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import {
  convertDistance,
  convertPrecipitation,
  convertPressure,
  convertTemperature,
  convertWindSpeed,
} from "@/utils/utilities";
import { Button } from "@heroui/react";
import { useState } from "react";
import { BsCloudRain, BsSun } from "react-icons/bs";
import { FiWind } from "react-icons/fi";
import { WiHumidity, WiThermometer, WiWindDeg } from "react-icons/wi";

const OtherDetails = () => {
  const [showMore, setShowMore] = useState(false);
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const unitSettings = useWeatherStore((state) => state.unitSettings);
  const values = currentWeather?.data.values;

  return (
    <BoxWrapper className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold">AIR CONDITIONS</h2>
        <Button size="sm" className="bg-accent" onPress={() => setShowMore(!showMore)}>
          {showMore ? "See less" : "See more"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center mb-2">
            <WiThermometer className="w-6 h-6 mr-2" />
            <span className="text-sm">Real Feel</span>
          </div>
          <div className="text-2xl font-bold text-primary-foreground">
            {convertTemperature(values?.temperatureApparent || 0)[unitSettings.temperatureUnit]}°
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <FiWind className="w-6 h-6 mr-2" />
            <span className="text-sm">Wind</span>
          </div>
          <div className="text-2xl font-bold text-primary-foreground">
            {convertWindSpeed(values?.windSpeed || 0)[unitSettings.windSpeedUnit]}{" "}
            {unitSettings.windSpeedUnit}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <BsCloudRain className="w-6 h-6 mr-2" />
            <span className="text-sm">Chance of rain</span>
          </div>
          <div className="text-2xl font-bold text-primary-foreground">
            {values?.precipitationProbability ?? "–"}%
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <WiHumidity className="w-6 h-6 mr-2" />
            <span className="text-sm">Humidity</span>
          </div>
          <div className="text-2xl font-bold text-primary-foreground">
            {values?.humidity ?? "–"}%
          </div>
        </div>

        {showMore && (
          <>
            <div>
              <div className="flex items-center mb-2">
                <BsSun className="w-6 h-6 mr-2" />
                <span className="text-sm">UV Index</span>
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                {values?.uvIndex ?? "–"}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <WiWindDeg className="w-6 h-6 mr-2" />
                <span className="text-sm">Wind Direction</span>
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                {values?.windDirection ?? "–"}°
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <span className="text-sm">Pressure</span>
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                {convertPressure(values?.pressureSurfaceLevel || 0)[unitSettings.pressureUnit]}{" "}
                {unitSettings.pressureUnit}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <span className="text-sm">Precipitation</span>
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                {convertPrecipitation(values?.precipitationIntensity || 0)[unitSettings.precipitationUnit]}{" "}
                {unitSettings.precipitationUnit}/h
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <span className="text-sm">Visibility</span>
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                {convertDistance(values?.visibility || 0)[unitSettings.distanceUnit]}{" "}
                {unitSettings.distanceUnit}
              </div>
            </div>
          </>
        )}
      </div>
    </BoxWrapper>
  );
};

export default OtherDetails;
