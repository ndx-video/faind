"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string, options: SearchOptions) => void;
  placeholder?: string;
  initialQuery?: string;
}

export interface SearchOptions {
  searchInCurrentDirectory: boolean;
  caseSensitive: boolean;
  useRegex: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search for files...",
  initialQuery = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [options, setOptions] = useState<SearchOptions>({
    searchInCurrentDirectory: false,
    caseSensitive: false,
    useRegex: false,
  });

  const handleSearch = () => {
    onSearch(query, options);
  };

  const toggleOption = (option: keyof SearchOptions) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-9 pr-4 py-6 text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
        <Button
          onClick={handleSearch}
          size="lg"
          className="px-6 py-6 text-base"
        >
          Find Files
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Button
          variant={options.searchInCurrentDirectory ? "default" : "outline"}
          size="sm"
          onClick={() => toggleOption("searchInCurrentDirectory")}
          className="h-8"
        >
          Current Directory
        </Button>
        <Button
          variant={options.caseSensitive ? "default" : "outline"}
          size="sm"
          onClick={() => toggleOption("caseSensitive")}
          className="h-8"
        >
          Case Sensitive
        </Button>
        <Button
          variant={options.useRegex ? "default" : "outline"}
          size="sm"
          onClick={() => toggleOption("useRegex")}
          className="h-8"
        >
          Use Regex
        </Button>
      </div>
    </div>
  );
}
