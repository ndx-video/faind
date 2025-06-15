"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GripIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBlockData {
  id: string;
  type: string;
  value: string;
  options?: Record<string, boolean | string>;
}

interface SearchBlockProps {
  block: SearchBlockData;
  onUpdate: (id: string, data: Partial<SearchBlockData>) => void;
  onRemove: (id: string) => void;
  isDragging?: boolean;
  className?: string;
}

export default function SearchBlock({
  block,
  onUpdate,
  onRemove,
  isDragging = false,
  className,
}: SearchBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const blockTypes = [
    { value: "text", label: "Text" },
    { value: "file-type", label: "File Type" },
    { value: "path", label: "Path" },
    { value: "size", label: "Size" },
    { value: "date", label: "Date" },
  ];

  const handleValueChange = (value: string) => {
    onUpdate(block.id, { value });
  };

  const handleTypeChange = (type: string) => {
    onUpdate(block.id, {
      type,
      value: "", // Reset value when type changes
      options: {}, // Reset options when type changes
    });
  };

  const handleOptionChange = (key: string, value: boolean | string) => {
    const updatedOptions = { ...(block.options || {}), [key]: value };
    onUpdate(block.id, { options: updatedOptions });
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Enter search text..."
              className="w-full"
            />

            {isExpanded && (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`case-sensitive-${block.id}`}
                    checked={block.options?.caseSensitive as boolean}
                    onCheckedChange={(checked) =>
                      handleOptionChange("caseSensitive", checked)
                    }
                  />

                  <Label htmlFor={`case-sensitive-${block.id}`}>
                    Case sensitive
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`regex-${block.id}`}
                    checked={block.options?.regex as boolean}
                    onCheckedChange={(checked) =>
                      handleOptionChange("regex", checked)
                    }
                  />

                  <Label htmlFor={`regex-${block.id}`}>Use regex</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`whole-word-${block.id}`}
                    checked={block.options?.wholeWord as boolean}
                    onCheckedChange={(checked) =>
                      handleOptionChange("wholeWord", checked)
                    }
                  />

                  <Label htmlFor={`whole-word-${block.id}`}>Whole word</Label>
                </div>
              </div>
            )}
          </div>
        );

      case "file-type":
        return (
          <Select value={block.value} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="archive">Archives</SelectItem>
              <SelectItem value="code">Code Files</SelectItem>
            </SelectContent>
          </Select>
        );

      case "path":
        return (
          <div className="space-y-2">
            <Input
              value={block.value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Enter path..."
              className="w-full"
            />

            {isExpanded && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`include-subfolders-${block.id}`}
                  checked={block.options?.includeSubfolders as boolean}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeSubfolders", checked)
                  }
                />

                <Label htmlFor={`include-subfolders-${block.id}`}>
                  Include subfolders
                </Label>
              </div>
            )}
          </div>
        );

      case "size":
        return (
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={block.options?.operator as string}
              onValueChange={(value) => handleOptionChange("operator", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="greater">Greater than</SelectItem>
                <SelectItem value="less">Less than</SelectItem>
                <SelectItem value="equal">Equal to</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={block.value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Size"
              className="w-full"
            />

            {isExpanded && (
              <div className="col-span-2">
                <Select
                  value={block.options?.unit as string}
                  onValueChange={(value) => handleOptionChange("unit", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kb">KB</SelectItem>
                    <SelectItem value="mb">MB</SelectItem>
                    <SelectItem value="gb">GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case "date":
        return (
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={block.options?.operator as string}
              onValueChange={(value) => handleOptionChange("operator", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="When" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before">Before</SelectItem>
                <SelectItem value="after">After</SelectItem>
                <SelectItem value="on">On</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={block.value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-full"
            />
          </div>
        );

      default:
        return (
          <Input
            value={block.value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter value..."
            className="w-full"
          />
        );
    }
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4 bg-card transition-all",
        isDragging ? "opacity-50" : "",
        isExpanded ? "shadow-md" : "",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripIcon className="h-4 w-4 text-muted-foreground cursor-move" />

          <Select value={block.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Block type" />
            </SelectTrigger>
            <SelectContent>
              {blockTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Less" : "More"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onRemove(block.id)}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {renderBlockContent()}
    </div>
  );
}
