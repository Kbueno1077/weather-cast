import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import { useWeatherStore } from "@/store/zustand";
import { Button, Input } from "@nextui-org/react";
import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";
import CitiesDB from "../../public/Cities Database.json";

interface ResultProps {
  id: number;
  name: string;
  country_name: string;
  state_name: string;
  latitude: number;
  longitude: number;
  country_id: number;
  country_code: string;
  state_id: number;
}

function Search() {
  const [searchResults, setSearchResults] = useState<ResultProps[]>([]);
  const [resultsPerPage] = useState(7);
  const [resultsLoaded, setResultsLoaded] = useState(7);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { changeCurrentCity } = useWeatherStore((state) => state);

  const debouncedSearch = debounce((term: string) => {
    if (term === "") {
      setSearchResults([]);
      setResultsLoaded(7);
      setIsLoading(false);
      return;
    }

    const results = (CitiesDB as ResultProps[]).filter((city) =>
      city.name.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
    setResultsLoaded(7);
    setIsLoading(false);
  }, 300);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setIsLoading(true);
    debouncedSearch(term);
  };

  const handleLoadMore = () => {
    setResultsLoaded(resultsLoaded + resultsPerPage);
  };

  const handleSelectCity = (cityData: {
    city: string;
    countryCode?: string;
    state?: string;
    countryName?: string;
    latitude?: string;
    longitude?: string;
  }) => {
    changeCurrentCity(cityData);
    clearSearch();
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchTerm("");
    setResultsLoaded(7);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchResults.length > 0
      ) {
        clearSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchResults]);

  const paginatedResults = searchResults.slice(0, resultsLoaded);

  return (
    <div
      ref={searchContainerRef}
      className="w-full relative"
      role="search"
      aria-label="City search"
    >
      <Input
        ref={inputRef}
        fullWidth
        value={searchTerm}
        placeholder="Search for cities"
        classNames={{ inputWrapper: "bg-primary" }}
        onChange={handleSearch}
        isClearable
        onClear={clearSearch}
        aria-label="Search cities"
        aria-expanded={searchTerm ? "true" : "false"}
        aria-controls="search-results"
        aria-describedby="search-description"
      />
      <span id="search-description" className="sr-only">
        Type to search for cities. Use arrow keys to navigate results. Press
        Enter to select a city.
      </span>

      {searchTerm && (
        <BoxWrapper
          id="search-results"
          className="mt-3 flex flex-col gap-2 max-h-[50vh] overflow-y-auto absolute z-10 px-3"
          style={{
            width: inputRef.current
              ? inputRef.current.offsetWidth + 20 + "px"
              : "auto",
            boxShadow: "3px 3px 3px 3px rgba(0, 0, 0, 0.5)",
          }}
          aria-label="Search results"
        >
          {paginatedResults.length > 0 ? (
            <>
              <p role="status" aria-live="polite">
                Showing: {paginatedResults.length} / {searchResults.length}{" "}
                results
              </p>

              {paginatedResults.map((result: ResultProps) => (
                <button
                  key={result.id}
                  className="flex justify-between items-center w-full rounded-lg p-2 text-left hover:border hover:border-accent hover:bg-accent hover:text-white relative transition-colors duration-100"
                  onClick={() =>
                    handleSelectCity({
                      city: result.name,
                      state: result.state_name || "",
                      countryCode: result.country_code || "",
                      countryName: result.country_name || "",
                      latitude: result.latitude,
                      longitude: result.longitude,
                    })
                  }
                  role="option"
                  aria-selected="false"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold">{result.name}</span>
                    <span className="text-sm">
                      {result.state_name ? `State: ${result.state_name}` : ""}
                    </span>
                    <span className="text-sm">
                      {result.country_name
                        ? `Country: ${result.country_name}`
                        : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <img
                      alt=""
                      aria-hidden="true"
                      src={`https://flagcdn.com/${result.country_code.toLowerCase()}.svg`}
                      className="w-10 h-10 mr-2"
                    />
                  </div>
                </button>
              ))}

              {resultsLoaded < searchResults.length && !isLoading && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="flat"
                    fullWidth
                    onPress={handleLoadMore}
                    aria-label={`Load more results. Currently showing ${paginatedResults.length} of ${searchResults.length}`}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div
              className="text-center p-4 text-gray-500"
              role="status"
              aria-live="polite"
            >
              {isLoading ? "Searching..." : "No results found"}
            </div>
          )}

          {isLoading && paginatedResults.length > 0 && (
            <div
              className="absolute inset-0 bg-black/30 flex items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="text-white">Loading...</div>
            </div>
          )}
        </BoxWrapper>
      )}
    </div>
  );
}

export default Search;
