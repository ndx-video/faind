"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar, { SearchOptions } from "@/polymet/components/search-bar";
import FilterPanel, { FilterOptions } from "@/polymet/components/filter-panel";
import ResultsList from "@/polymet/components/results-list";
import PresetManager from "@/polymet/components/preset-manager";
import BlockEditor from "@/polymet/components/block-editor";
import { SAMPLE_FILES, SAMPLE_PRESETS } from "@/polymet/data/sample-files";
import { FileResult } from "@/polymet/components/result-card";
import { PresetData } from "@/polymet/components/preset-card";
import { SearchBlockData } from "@/polymet/components/search-block";
import { useElectron } from "@/hooks/useElectron";
import { isElectron, formatFileSize, formatDate, logger } from "@/lib/electron-utils";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<FileResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [presets, setPresets] = useState<PresetData[]>(SAMPLE_PRESETS);
  const [searchBlocks, setSearchBlocks] = useState<SearchBlockData[]>([]);
  const [selectedDirectory, setSelectedDirectory] = useState<string>("");

  // Electron integration
  const {
    isElectron: electronAvailable,
    searchFiles,
    selectDirectory,
    openFile,
    showInFolder,
    appVersion
  } = useElectron();

  useEffect(() => {
    logger.info('HomePage mounted', {
      electronAvailable,
      appVersion,
      environment: isElectron() ? 'electron' : 'web'
    });
  }, [electronAvailable, appVersion]);

  const handleSearch = async (query: string, options: SearchOptions) => {
    setIsSearching(true);
    logger.debug('Starting search', { query, options, electronAvailable });

    try {
      if (electronAvailable && searchFiles) {
        // Use Electron search API
        const searchQuery = {
          text: query,
          fileTypes: options.fileTypes || [],
          directories: selectedDirectory ? [selectedDirectory] : [],
          caseSensitive: options.caseSensitive || false,
          maxResults: 1000
        };

        const electronResults = await searchFiles(searchQuery);

        // Convert Electron results to FileResult format
        const convertedResults: FileResult[] = electronResults.map(result => ({
          id: parseInt(result.id) || Math.random(),
          name: result.name,
          path: result.path,
          size: formatFileSize(result.size),
          modified: result.modified,
          type: result.extension || result.type,
          matches: result.matches?.map(m => m.text) || []
        }));

        setSearchResults(convertedResults);
        logger.info('Electron search completed', { resultCount: convertedResults.length });
      } else {
        // Fallback to mock data for web or when Electron API unavailable
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
        logger.info('Mock search completed', { resultCount: results.length });
      }

      setActiveTab("results");
    } catch (error) {
      logger.error('Search failed', error);
      // Fallback to empty results on error
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
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

  // Handle directory selection
  const handleSelectDirectory = async () => {
    if (!electronAvailable || !selectDirectory) {
      logger.warn('Directory selection not available - Electron API missing');
      return;
    }

    try {
      const directory = await selectDirectory();
      if (directory) {
        setSelectedDirectory(directory);
        logger.info('Directory selected', { directory });
      }
    } catch (error) {
      logger.error('Failed to select directory', error);
    }
  };

  // Handle file operations
  const handleFileSelect = async (file: FileResult) => {
    logger.debug('File selected', { file });

    if (electronAvailable && openFile) {
      try {
        await openFile(file.path);
        logger.info('File opened', { path: file.path });
      } catch (error) {
        logger.error('Failed to open file', error);
      }
    } else {
      logger.info('File selected (web mode)', { file });
    }
  };

  const handleFilePreview = async (file: FileResult) => {
    logger.debug('File preview requested', { file });

    if (electronAvailable && showInFolder) {
      try {
        await showInFolder(file.path);
        logger.info('File shown in folder', { path: file.path });
      } catch (error) {
        logger.error('Failed to show file in folder', error);
      }
    } else {
      logger.info('File preview (web mode)', { file });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">File Search</h1>
            <p className="text-muted-foreground">
              Search for files across your system using powerful search tools.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {electronAvailable && (
              <Badge variant="secondary" className="text-xs">
                Desktop v{appVersion}
              </Badge>
            )}
            {!electronAvailable && (
              <Badge variant="outline" className="text-xs">
                Web Mode
              </Badge>
            )}
          </div>
        </div>

        {electronAvailable && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              {selectedDirectory ? (
                <div>
                  <p className="text-sm font-medium">Search Directory:</p>
                  <p className="text-sm text-muted-foreground truncate">{selectedDirectory}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No directory selected - searches will use default locations
                </p>
              )}
            </div>
            <Button onClick={handleSelectDirectory} variant="outline" size="sm">
              Select Directory
            </Button>
          </div>
        )}
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
            onSelect={handleFileSelect}
            onPreview={handleFilePreview}
            isLoading={isSearching}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
