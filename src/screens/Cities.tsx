import AddedCities from "@/components/AddedCities/AddedCities";
import Weather3DaysForecast from "@/components/DaysForecast/3DaysForecast";
import WeatherForecast from "@/components/Forecast/Forecast";
import Search from "@/components/Search/Search";
import { Loading } from "@/components/ui/Loading/Loading";
import WeatherNow from "@/components/WeatherNow/WeatherNow";
import { useLoadWeather } from "@/hooks/useLoadWeather";
import { useWeatherStore } from "@/store/zustand";

export default function Cities() {
  const { isLoading: bootstrapping } = useLoadWeather();
  const isLoading = useWeatherStore((state) => state.isLoading);
  const error = useWeatherStore((state) => state.error);
  const message = useWeatherStore((state) => state.message);
  const currentWeather = useWeatherStore((state) => state.currentWeather);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="stagger w-full flex flex-col items-start justify-start gap-4">
        <Search />
        <AddedCities />
      </div>

      <div className="stagger w-full flex flex-col items-start justify-start gap-4">
        {(isLoading || bootstrapping) && !currentWeather && <Loading compact />}
        {!isLoading && !bootstrapping && error && (
          <p className="text-lg">{message}</p>
        )}
        {!isLoading && currentWeather && !error && (
          <>
            <WeatherNow />
            <WeatherForecast compact />
            <Weather3DaysForecast />
          </>
        )}
      </div>
    </div>
  );
}
