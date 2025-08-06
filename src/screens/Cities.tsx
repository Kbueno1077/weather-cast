import AddedCities from "@/components/AddedCities/AddedCities";
import Weather3DaysForecast from "@/components/DaysForecast/3DaysForecast";
import WeatherForecast from "@/components/Forecast/Forecast";
import Search from "@/components/Search/Search";
import { Loading } from "@/components/ui/Loading/Loading";
import WeatherNow from "@/components/WeatherNow/WeatherNow";
import { useWeatherStore } from "@/store/zustand";

export default function Cities() {
  const { isLoading, error, message } = useWeatherStore((state) => state);
  console.log("🚀 ~ Cities ~ message:", message);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full flex flex-col items-start justify-start gap-4">
        <Search />
        <AddedCities />
      </div>

      {!error && (
        <div className="w-full flex flex-col items-start justify-start gap-4">
          <WeatherNow />
          <WeatherForecast transparent />
          <Weather3DaysForecast />
        </div>
      )}
    </div>
  );
}
