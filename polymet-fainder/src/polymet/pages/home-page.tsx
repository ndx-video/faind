"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar, { SearchOptions } from "@/polymet/components/search-bar";
import FilterPanel, { FilterOptions } from "@/polymet/components/filter-panel";
import ResultsList from "@/polymet/components/results-list";
import PresetManager from "@/polymet/components/preset-manager";
import BlockEditor from "@/polymet/components/block-editor";
import { SAMPLE_FILES, SAMPLE_PRESETS } from "@/polymet/data/sample-files";
import { FileResult } from "@/polymet/components/result-card";
import { PresetData } from "@/polymet/components/preset-card";
import { SearchBlockData } from "@/polymet/components/search-block";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<FileResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [presets, setPresets] = useState<PresetData[]>(SAMPLE_PRESETS);
  const [searchBlocks, setSearchBlocks] = useState<SearchBlockData[]>([]);

  const handleSearch = (query: string, options: SearchOptions) => {
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      // Simple filtering logic for demo purposes
      let results = [...SAMPLE_FILES];

      if (query) {
        results = results.filter(
          (file) =>
            file.name.toLowerCase().includes(query.toLowerCase()) ||
            file.path.toLowerCase().includes(query.toLowerCase()) ||
            file.type.toLowerCase().includes(query.toLowerCase())
        );
      }

      setSearchResults(results);
      setIsSearching(false);
      setActiveTab("results");
    }, 800);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setIsSearching(true);

    // Simulate filter delay
    setTimeout(() => {
      // Simple filtering logic for demo purposes
      let results = [...SAMPLE_FILES];

      // Filter by file type
      if (filters.fileTypes.length > 0) {
        results = results.filter((file) =>
          filters.fileTypes.some((type) =>
            file.type.toLowerCase().includes(type.toLowerCase())
          )
        );
      }

      // Filter by size
      if (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 1000) {
        results = results.filter((file) => {
          const fileSizeMB = file.size / (1024 * 1024);
          return (
            fileSizeMB >= filters.sizeRange[0] &&
            fileSizeMB <= filters.sizeRange[1]
          );
        });
      }

      // Filter by date
      if (filters.dateRange.from || filters.dateRange.to) {
        results = results.filter((file) => {
          if (
            filters.dateRange.from &&
            file.modified < filters.dateRange.from
          ) {
            return false;
          }
          if (filters.dateRange.to && file.modified > filters.dateRange.to) {
            return false;
          }
          return true;
        });
      }

      // Filter by exclude paths
      if (filters.excludePaths.length > 0) {
        results = results.filter(
          (file) =>
            !filters.excludePaths.some((path) =>
              file.path.toLowerCase().includes(path.toLowerCase())
            )
        );
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handlePresetRun = (preset: PresetData) => {
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      // Simple filtering logic based on preset blocks
      let results = [...SAMPLE_FILES];

      // Filter by text blocks
      const textBlocks = preset.blocks.filter((block) => block.type === "text");
      if (textBlocks.length > 0) {
        results = results.filter((file) =>
          textBlocks.some(
            (block) =>
              file.name.toLowerCase().includes(block.value.toLowerCase()) ||
              (file.matches &&
                file.matches.some((match) =>
                  match.toLowerCase().includes(block.value.toLowerCase())
                ))
          )
        );
      }

      // Filter by file type blocks
      const fileTypeBlocks = preset.blocks.filter(
        (block) => block.type === "file-type"
      );
      if (fileTypeBlocks.length > 0) {
        results = results.filter((file) =>
          fileTypeBlocks.some((block) =>
            file.type.toLowerCase().includes(block.value.toLowerCase())
          )
        );
      }

      // Filter by path blocks
      const pathBlocks = preset.blocks.filter((block) => block.type === "path");
      if (pathBlocks.length > 0) {
        results = results.filter((file) =>
          pathBlocks.some((block) =>
            file.path.toLowerCase().includes(block.value.toLowerCase())
          )
        );
      }

      setSearchResults(results);
      setIsSearching(false);
      setActiveTab("results");
    }, 800);
  };

  const handleBlocksChange = (blocks: SearchBlockData[]) => {
    setSearchBlocks(blocks);
  };

  const handleRunBlocks = () => {
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      // Simple filtering logic based on blocks
      let results = [...SAMPLE_FILES];

      // Filter by text blocks
      const textBlocks = searchBlocks.filter((block) => block.type === "text");
      if (textBlocks.length > 0) {
        results = results.filter((file) =>
          textBlocks.some(
            (block) =>
              file.name.toLowerCase().includes(block.value.toLowerCase()) ||
              (file.matches &&
                file.matches.some((match) =>
                  match.toLowerCase().includes(block.value.toLowerCase())
                ))
          )
        );
      }

      // Filter by file type blocks
      const fileTypeBlocks = searchBlocks.filter(
        (block) => block.type === "file-type"
      );
      if (fileTypeBlocks.length > 0) {
        results = results.filter((file) =>
          fileTypeBlocks.some((block) =>
            file.type.toLowerCase().includes(block.value.toLowerCase())
          )
        );
      }

      // Filter by path blocks
      const pathBlocks = searchBlocks.filter((block) => block.type === "path");
      if (pathBlocks.length > 0) {
        results = results.filter((file) =>
          pathBlocks.some((block) =>
            file.path.toLowerCase().includes(block.value.toLowerCase())
          )
        );
      }

      setSearchResults(results);
      setIsSearching(false);
      setActiveTab("results");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">File Search</h1>
        <p className="text-muted-foreground">
          Search for files across your system using powerful search tools.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Basic Search</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Search</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="md:col-span-1">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <BlockEditor
                initialBlocks={searchBlocks}
                onChange={handleBlocksChange}
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleRunBlocks}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                >
                  Run Search
                </button>
              </div>
            </div>
            <div className="md:col-span-1">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <PresetManager
            presets={presets}
            onPresetRun={handlePresetRun}
            onPresetsChange={setPresets}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <ResultsList
            results={searchResults}
            onSelect={(file) => console.log("Selected file:", file)}
            onPreview={(file) => console.log("Preview file:", file)}
            isLoading={isSearching}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
