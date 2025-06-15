"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EditIcon, MoreVerticalIcon, PlayIcon, TrashIcon } from "lucide-react";
import { SearchBlockData } from "@/polymet/components/search-block";
import { cn } from "@/lib/utils";

export interface PresetData {
  id: string;
  name: string;
  description?: string;
  blocks: SearchBlockData[];
  lastUsed?: Date;
  tags?: string[];
}

interface PresetCardProps {
  preset: PresetData;
  onRun: (preset: PresetData) => void;
  onEdit: (preset: PresetData) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export default function PresetCard({
  preset,
  onRun,
  onEdit,
  onDelete,
  className,
}: PresetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getBlockTypeSummary = () => {
    const typeCounts: Record<string, number> = {};

    preset.blocks.forEach((block) => {
      typeCounts[block.type] = (typeCounts[block.type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => (
      <Badge key={type} variant="outline" className="mr-1">
        {count} {type}
      </Badge>
    ));
  };

  const formatLastUsed = () => {
    if (!preset.lastUsed) return "Never used";

    const now = new Date();
    const lastUsed = new Date(preset.lastUsed);
    const diffTime = Math.abs(now.getTime() - lastUsed.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isHovered ? "shadow-md" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{preset.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRun(preset)}>
                <PlayIcon className="mr-2 h-4 w-4" />
                Run
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(preset)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onDelete(preset.id)}
                className="text-red-600"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {preset.description && (
          <CardDescription>{preset.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">{getBlockTypeSummary()}</div>
          {preset.tags && preset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {preset.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="mr-1">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {formatLastUsed()}
          </span>
          <Button size="sm" className="ml-auto" onClick={() => onRun(preset)}>
            <PlayIcon className="mr-2 h-4 w-4" />
            Run
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
