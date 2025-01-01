import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import { useState } from "react";
import { CurrentCityType } from "@/types/OpenWeatherTypes";
import { BsTrash2 } from "react-icons/bs";
import { BiMapPin } from "react-icons/bi";

function AddedCities() {
  const { savedCities, currentCity, changeCurrentCity, removeSavedCity } =
    useWeatherStore((state) => state);
  const [selectedCity, setSelectedCity] = useState<CurrentCityType | null>(
    // @ts-expect-error currentCity typed not completed
    currentCity || null
  );

  const handleCityClick = (city: CurrentCityType) => {
    setSelectedCity(city);
    changeCurrentCity(city);
  };

  if (savedCities.length === 0) {
    return (
      <BoxWrapper className="w-full py-6">
        <div className="flex flex-col items-center gap-4">
          <BiMapPin className="w-12 h-12 text-primary-foreground/50" />
          <p className="text-center text-primary-foreground">
            No cities added yet. Use the search bar above to add cities.
          </p>
        </div>
      </BoxWrapper>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {savedCities.map((city) => (
        <BoxWrapper
          key={city.city}
          className={`w-full h-full py-6 ${
            selectedCity?.city === city.city &&
            selectedCity?.state === city.state &&
            selectedCity?.countryName === city.countryName
              ? "bg-transparent border-accent border-1"
              : ""
          }`}
          onClick={() => handleCityClick(city)}
        >
          <div className="flex justify-between items-center h-full">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl text-primary-foreground  max-w-[200px]">
                  {city.city}
                </h2>
                <div>
                  <span>
                    {city.countryName} - {city.state}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="p-2 hover:bg-accent rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                removeSavedCity(city.city);
              }}
            >
              <BsTrash2 className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </BoxWrapper>
      ))}
    </div>
  );
}

export default AddedCities;
