import { formatDistanceToNow } from "date-fns";
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon,
  FolderIcon,
  ArchiveIcon,
  FileCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FileResult {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  modified: Date;
  matches?: string[];
}

interface ResultCardProps {
  file: FileResult;
  onSelect: (file: FileResult) => void;
  onPreview: (file: FileResult) => void;
  isSelected?: boolean;
  className?: string;
}

export default function ResultCard({
  file,
  onSelect,
  onPreview,
  isSelected = false,
  className,
}: ResultCardProps) {
  const getFileIcon = () => {
    const fileType = file.type.toLowerCase();
    if (fileType.includes("folder") || fileType.includes("directory")) {
      return <FolderIcon className="h-5 w-5" />;
    } else if (fileType.includes("image")) {
      return <ImageIcon className="h-5 w-5" />;
    } else if (fileType.includes("video")) {
      return <VideoIcon className="h-5 w-5" />;
    } else if (fileType.includes("audio")) {
      return <MusicIcon className="h-5 w-5" />;
    } else if (fileType.includes("zip") || fileType.includes("archive")) {
      return <ArchiveIcon className="h-5 w-5" />;
    } else if (fileType.includes("text") || fileType.includes("document")) {
      return <FileTextIcon className="h-5 w-5" />;
    } else {
      return <FileIcon className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isSelected ? "border-primary ring-1 ring-primary" : "",
        className
      )}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
        <div className="bg-secondary p-2 rounded-md">{getFileIcon()}</div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-medium text-base truncate">{file.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{file.path}</p>
        </div>
        {isSelected && (
          <Badge variant="outline" className="ml-auto">
            <FileCheckIcon className="h-3 w-3 mr-1" />
            Selected
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Type:</span> {file.type}
          </div>
          <div>
            <span className="font-medium">Size:</span>{" "}
            {formatFileSize(file.size)}
          </div>
          <div className="col-span-2">
            <span className="font-medium">Modified:</span>{" "}
            {formatDistanceToNow(file.modified, { addSuffix: true })}
          </div>
        </div>
        {file.matches && file.matches.length > 0 && (
          <div className="mt-2 text-xs">
            <p className="font-medium mb-1">Matches:</p>
            <div className="max-h-16 overflow-y-auto space-y-1">
              {file.matches.map((match, index) => (
                <div
                  key={index}
                  className="bg-secondary/50 p-1 rounded text-xs"
                >
                  {match}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onPreview(file)}
        >
          Preview
        </Button>
        <Button size="sm" className="flex-1" onClick={() => onSelect(file)}>
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}
