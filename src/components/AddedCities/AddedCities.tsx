import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import type { CurrentCityType } from "@/types/weather";
import { sameCity } from "@/utils/utilities";
import { useState } from "react";
import { BiMapPin } from "react-icons/bi";
import { BsTrash2 } from "react-icons/bs";

function AddedCities() {
  const savedCities = useWeatherStore((state) => state.savedCities);
  const currentCity = useWeatherStore((state) => state.currentCity);
  const changeCurrentCity = useWeatherStore((state) => state.changeCurrentCity);
  const removeSavedCity = useWeatherStore((state) => state.removeSavedCity);
  const [selectedCity, setSelectedCity] = useState<CurrentCityType | null>(currentCity);

  if (savedCities.length === 0) {
    return (
      <BoxWrapper className="w-full py-6">
        <div className="flex flex-col items-center gap-4">
          <BiMapPin className="w-12 h-12 text-primary-foreground/50" />
          <p className="text-center text-primary-foreground">
            No cities added yet. Save a city from the weather page, or search above.
          </p>
        </div>
      </BoxWrapper>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {savedCities.map((city) => {
        const selected = selectedCity ? sameCity(selectedCity, city) : false;
        return (
          <BoxWrapper
            key={`${city.city}-${city.state ?? ""}-${city.country ?? ""}`}
            className={`w-full h-full py-6 ${
              selected ? "bg-transparent border-accent border-1" : ""
            }`}
            onClick={() => {
              setSelectedCity(city);
              void changeCurrentCity(city);
            }}
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl text-primary-foreground max-w-[200px]">
                  {city.city}
                </h2>
                <span>
                  {[city.countryName, city.state].filter(Boolean).join(" - ")}
                </span>
              </div>
              <button
                className="p-2 hover:bg-accent rounded-full"
                aria-label={`Remove ${city.city}`}
                onClick={(event) => {
                  event.stopPropagation();
                  removeSavedCity(city);
                }}
              >
                <BsTrash2 className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </BoxWrapper>
        );
      })}
    </div>
  );
}

export default AddedCities;
