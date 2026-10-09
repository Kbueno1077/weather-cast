import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import type { CurrentCityType } from "@/types/weather";
import { cn } from "@/utils/cn";
import { sameCity } from "@/utils/utilities";
import { useState } from "react";
import { LuMapPin, LuTrash2 } from "react-icons/lu";

function AddedCities() {
  const savedCities = useWeatherStore((state) => state.savedCities);
  const currentCity = useWeatherStore((state) => state.currentCity);
  const changeCurrentCity = useWeatherStore((state) => state.changeCurrentCity);
  const removeSavedCity = useWeatherStore((state) => state.removeSavedCity);
  const [selectedCity, setSelectedCity] = useState<CurrentCityType | null>(currentCity);

  if (savedCities.length === 0) {
    return (
      <BoxWrapper className="w-full border-dashed border-white/10 bg-transparent py-10 shadow-none">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/5">
            <LuMapPin aria-hidden="true" size={22} />
          </span>
          <p className="font-medium text-primary-foreground">No saved cities yet</p>
          <p className="max-w-xs text-sm">
            Tap the star on the weather page, or search above to add one.
          </p>
        </div>
      </BoxWrapper>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-3">
      {savedCities.map((city) => {
        const selected = selectedCity ? sameCity(selectedCity, city) : false;
        return (
          <li key={`${city.city}-${city.state ?? ""}-${city.country ?? ""}`}>
            <BoxWrapper
              aria-current={selected ? "true" : undefined}
              className={cn(
                "w-full py-5",
                selected && "bg-accent/[0.07] ring-2 ring-accent/70 hover:bg-accent/10"
              )}
              onClick={() => {
                setSelectedCity(city);
                void changeCurrentCity(city);
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-display text-2xl font-semibold tracking-tight text-primary-foreground">
                      {city.city}
                    </h2>
                    {selected && (
                      <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-accent uppercase">
                        Viewing
                      </span>
                    )}
                  </div>
                  <span className="truncate text-sm">
                    {[city.state, city.countryName].filter(Boolean).join(", ")}
                  </span>
                </div>
                <button
                  className="grid size-9 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-danger/15 hover:text-danger focus-visible:outline-2 focus-visible:outline-danger"
                  aria-label={`Remove ${city.city}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeSavedCity(city);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <LuTrash2 aria-hidden="true" size={17} />
                </button>
              </div>
            </BoxWrapper>
          </li>
        );
      })}
    </ul>
  );
}

export default AddedCities;
