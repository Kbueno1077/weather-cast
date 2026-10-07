import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { searchCities } from "@/services/geocode";
import { useWeatherStore } from "@/store/zustand";
import type { CityResult } from "@/types/weather";
import { Input } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

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
        classNames={{
          inputWrapper: "bg-primary border border-white/15 shadow-none",
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
          className="mt-3 flex flex-col gap-2 max-h-[50vh] overflow-y-auto absolute z-10 left-0 right-0 px-3"
          aria-label="Search results"
        >
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <button
                key={result.id}
                className="flex justify-between items-center w-full rounded-lg p-2 text-left hover:border hover:border-accent hover:bg-accent hover:text-white relative transition-colors duration-100"
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
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold">{result.name}</span>
                  <span className="text-sm">
                    {[result.state, result.countryName].filter(Boolean).join(", ")}
                  </span>
                </div>

                {result.countryCode && (
                  <img
                    alt=""
                    aria-hidden="true"
                    src={`https://flagcdn.com/${result.countryCode.toLowerCase()}.svg`}
                    className="w-10 h-8 object-cover rounded-sm"
                  />
                )}
              </button>
            ))
          ) : (
            <div className="text-center p-4 text-gray-500" role="status">
              {isLoading ? "Searching..." : searchError || "No results found"}
            </div>
          )}
        </BoxWrapper>
      )}
    </div>
  );
}

export default Search;
