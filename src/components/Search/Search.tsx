import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { searchCities } from "@/services/geocode";
import { useWeatherStore } from "@/store/zustand";
import type { CityResult } from "@/types/weather";
import { Input } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { LuLoaderCircle, LuMapPin, LuSearch } from "react-icons/lu";

function Search() {
  const [searchResults, setSearchResults] = useState<CityResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const changeCurrentCity = useWeatherStore((state) => state.changeCurrentCity);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSearchError("");
    if (value.trim().length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
  };

  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchCities(term, controller.signal)
        .then((results) => {
          if (!controller.signal.aborted) setSearchResults(results);
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setSearchResults([]);
          setSearchError(error instanceof Error ? error.message : "City search failed");
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        handleSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    handleSearch("");
  };

  return (
    <div
      ref={searchContainerRef}
      className="w-full relative"
      role="search"
      aria-label="City search"
    >
      <Input
        fullWidth
        value={searchTerm}
        placeholder="Search for cities"
        startContent={<LuSearch aria-hidden="true" className="shrink-0 text-foreground" size={18} />}
        classNames={{
          inputWrapper:
            "h-12 rounded-2xl bg-primary data-[hover=true]:bg-primary group-data-[focus=true]:bg-primary border border-line shadow-none transition-colors group-data-[focus=true]:border-accent/60",
          input: "text-sm text-primary-foreground placeholder:text-foreground",
        }}
        onValueChange={handleSearch}
        isClearable
        onClear={clearSearch}
        aria-label="Search cities"
        aria-expanded={searchTerm.trim().length >= 2}
        aria-controls="search-results"
      />

      {searchTerm.trim().length >= 2 && (
        <BoxWrapper
          id="search-results"
          role="listbox"
          className="absolute inset-x-0 z-30 mt-2 flex max-h-[50vh] flex-col gap-1 overflow-y-auto p-2"
          aria-label="Search results"
        >
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <button
                key={result.id}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-150 outline-none hover:bg-white/[0.05] focus-visible:bg-white/[0.05]"
                onClick={() => {
                  void changeCurrentCity({
                    city: result.name,
                    state: result.state,
                    country: result.countryCode,
                    countryName: result.countryName,
                    latitude: result.latitude,
                    longitude: result.longitude,
                  });
                  clearSearch();
                }}
                role="option"
                aria-selected="false"
              >
                {result.countryCode ? (
                  <img
                    alt=""
                    aria-hidden="true"
                    src={`https://flagcdn.com/${result.countryCode.toLowerCase()}.svg`}
                    className="h-6 w-8 shrink-0 rounded-md object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <span className="grid h-6 w-8 shrink-0 place-items-center rounded-md bg-white/5">
                    <LuMapPin aria-hidden="true" size={14} />
                  </span>
                )}

                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-primary-foreground">
                    {result.name}
                  </span>
                  <span className="truncate text-xs">
                    {[result.state, result.countryName].filter(Boolean).join(", ")}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div
              className="flex items-center justify-center gap-2 p-4 text-sm text-foreground"
              role="status"
            >
              {isLoading && <LuLoaderCircle aria-hidden="true" className="animate-spin" size={16} />}
              {isLoading ? "Searching…" : searchError || "No results found"}
            </div>
          )}
        </BoxWrapper>
      )}
    </div>
  );
}

export default Search;
