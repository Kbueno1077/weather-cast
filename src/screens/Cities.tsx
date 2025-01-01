import AddedCities from "@/components/AddedCities/AddedCities";
import Weather3DaysForecast from "@/components/DaysForecast/3DaysForecast";
import WeatherForecast from "@/components/Forecast/Forecast";
import Search from "@/components/Search/Search";
import WeatherNow from "@/components/WeatherNow/WeatherNow";

export default function Cities() {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full flex flex-col items-start justify-start gap-4">
        <Search />
        <AddedCities />
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-4">
        <WeatherNow />
        <WeatherForecast transparent />
        <Weather3DaysForecast />
      </div>
    </div>
  );
}
