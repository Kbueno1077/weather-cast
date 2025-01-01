import Weather7DaysForecast from "@/components/DaysForecast/7DaysForecast";
import WeatherForecast from "@/components/Forecast/Forecast";
import OtherDetails from "@/components/OtherDetails/OtherDetails";
import Search from "@/components/Search/Search";
import DisplayError from "@/components/ui/DisplayError/DisplayError";
import { Loading } from "@/components/ui/Loading/Loading";
import WeatherNow from "@/components/WeatherNow/WeatherNow";
import { useLoadWeather } from "@/hooks/useLoadWeather";

export default function Home() {
  const { isLoading, error } = useLoadWeather();

  if (isLoading) return <Loading />;

  if (error) return <DisplayError error={error} />;

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
