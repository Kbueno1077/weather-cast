import { Button } from "@nextui-org/react";
import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useState } from "react";
import { BsCloudRain, BsSun } from "react-icons/bs";
import { FiWind } from "react-icons/fi";
import { WiHumidity, WiThermometer, WiWindDeg } from "react-icons/wi";
import { getCurrentUnitSettings, useWeatherStore } from "@/store/zustand";
import { convertTemperature, convertWindSpeed } from "@/utils/utilities";

const OtherDetails = () => {
  const [showMore, setShowMore] = useState(false);

  const { currentWeather } = useWeatherStore((state) => state);
  const temperatureUnit = getCurrentUnitSettings("temperatureUnit");
  const windSpeedUnit = getCurrentUnitSettings("windSpeedUnit");

  return (
    <BoxWrapper className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold">AIR CONDITIONS</h2>

        <div className="text-right">
          <Button
            size="sm"
            className="bg-accent"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "See less" : "See more"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center mb-2">
            <WiThermometer className="w-6 h-6 mr-2" />
            <span className="text-sm">Real Feel</span>
          </div>
          <div className="text-2xl font-bold text-primary-foreground">
            {
              convertTemperature(
                currentWeather?.data.values.temperatureApparent || 0
              )[temperatureUnit as keyof typeof convertTemperature]
            }
            °
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <FiWind className="w-6 h-6 mr-2" />
            <span className="text-sm">Wind</span>
          </div>
          <div className="text-2xl font-bold text-primary-foreground">
            {
              convertWindSpeed(currentWeather?.data.values.windSpeed || 0)[
                windSpeedUnit as keyof typeof convertWindSpeed
              ]
            }{" "}
            {windSpeedUnit}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <BsCloudRain className="w-6 h-6 mr-2" />
            <span className="text-sm">Chance of rain</span>
          </div>
          <div className="text-2xl font-bold text-primary-foreground">
            {currentWeather?.data.values.precipitationProbability}%
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <WiHumidity className="w-6 h-6 mr-2" />
            <span className="text-sm">Humidity</span>
          </div>
          <div className="text-2xl font-bold text-primary-foreground">
            {currentWeather?.data.values.humidity}%
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
                {currentWeather?.data.values.uvIndex}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <WiWindDeg className="w-6 h-6 mr-2" />
                <span className="text-sm">Wind Direction</span>
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                {currentWeather?.data.values.windDirection}°
              </div>
            </div>
          </>
        )}
      </div>
    </BoxWrapper>
  );
};

export default OtherDetails;
