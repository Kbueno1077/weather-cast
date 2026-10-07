import Weather7DaysForecast from "@/components/DaysForecast/7DaysForecast";
import WeatherForecast from "@/components/Forecast/Forecast";
import OtherDetails from "@/components/OtherDetails/OtherDetails";
import Search from "@/components/Search/Search";
import DisplayError from "@/components/ui/DisplayError/DisplayError";
import { Loading } from "@/components/ui/Loading/Loading";
import WeatherNow from "@/components/WeatherNow/WeatherNow";
import { useLoadWeather } from "@/hooks/useLoadWeather";
import { useWeatherStore } from "@/store/zustand";

export default function Home() {
  const { isLoading, error } = useLoadWeather();
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const storeLoading = useWeatherStore((state) => state.isLoading);
  const storeError = useWeatherStore((state) => state.error);
  const message = useWeatherStore((state) => state.message);

  if ((isLoading || storeLoading) && !currentWeather) return <Loading />;

  if (!currentWeather && (error || storeError)) {
    return <DisplayError error={storeError ? message : error} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full flex flex-col items-start justify-start gap-4">
        <Search />

        <WeatherNow />
        <WeatherForecast />
        <OtherDetails />
      </div>

      <div>
        <Weather7DaysForecast />
      </div>
    </div>
  );
}
