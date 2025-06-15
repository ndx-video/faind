"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  fileTypes: string[];
  sizeRange: [number, number];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  includeHidden: boolean;
  excludePaths: string[];
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

export default function FilterPanel({
  onFilterChange,
  className,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    fileTypes: [],
    sizeRange: [0, 1000],
    dateRange: {
      from: undefined,
      to: undefined,
    },
    includeHidden: false,
    excludePaths: [],
  });

  const [excludePath, setExcludePath] = useState("");

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const addExcludePath = () => {
    if (excludePath.trim()) {
      const newExcludePaths = [...filters.excludePaths, excludePath.trim()];
      handleFilterChange({ excludePaths: newExcludePaths });
      setExcludePath("");
    }
  };

  const removeExcludePath = (path: string) => {
    const newExcludePaths = filters.excludePaths.filter((p) => p !== path);
    handleFilterChange({ excludePaths: newExcludePaths });
  };

  const fileTypeOptions = [
    { value: "all", label: "All Files" },
    { value: "documents", label: "Documents" },
    { value: "images", label: "Images" },
    { value: "audio", label: "Audio" },
    { value: "video", label: "Video" },
    { value: "archives", label: "Archives" },
    { value: "code", label: "Code Files" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <FilterIcon className="h-4 w-4" />

        <h3 className="font-medium">Filters</h3>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="file-types">
          <AccordionTrigger>File Types</AccordionTrigger>
          <AccordionContent>
            <Select
              onValueChange={(value) =>
                handleFilterChange({
                  fileTypes: value === "all" ? [] : [value],
                })
              }
              defaultValue="all"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                {fileTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>File Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                onValueChange={(value) =>
                  handleFilterChange({
                    sizeRange: [value[0], value[1]] as [number, number],
                  })
                }
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 KB</span>
                <span>1000 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">
                  {filters.sizeRange[0]} MB - {filters.sizeRange[1]} MB
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date">
          <AccordionTrigger>Date Modified</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="from">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="from"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {filters.dateRange.from ? (
                        format(filters.dateRange.from, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) =>
                        handleFilterChange({
                          dateRange: { ...filters.dateRange, from: date },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="to">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="to"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {filters.dateRange.to ? (
                        format(filters.dateRange.to, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) =>
                        handleFilterChange({
                          dateRange: { ...filters.dateRange, to: date },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="exclude-paths">
          <AccordionTrigger>Exclude Paths</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={excludePath}
                  onChange={(e) => setExcludePath(e.target.value)}
                  placeholder="Enter path to exclude"
                  className="flex-1"
                />

                <Button onClick={addExcludePath}>Add</Button>
              </div>
              {filters.excludePaths.length > 0 && (
                <div className="space-y-2">
                  {filters.excludePaths.map((path) => (
                    <div
                      key={path}
                      className="flex items-center justify-between bg-secondary p-2 rounded-md"
                    >
                      <span className="text-sm truncate flex-1">{path}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExcludePath(path)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="options">
          <AccordionTrigger>Additional Options</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="hidden-files"
                checked={filters.includeHidden}
                onCheckedChange={(checked) =>
                  handleFilterChange({ includeHidden: checked })
                }
              />

              <Label htmlFor="hidden-files">Include hidden files</Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setFilters({
            fileTypes: [],
            sizeRange: [0, 1000],
            dateRange: {
              from: undefined,
              to: undefined,
            },
            includeHidden: false,
            excludePaths: [],
          });
          onFilterChange({
            fileTypes: [],
            sizeRange: [0, 1000],
            dateRange: {
              from: undefined,
              to: undefined,
            },
            includeHidden: false,
            excludePaths: [],
          });
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}
