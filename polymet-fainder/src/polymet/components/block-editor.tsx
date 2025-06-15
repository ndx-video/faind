"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import SearchBlock, {
  SearchBlockData,
} from "@/polymet/components/search-block";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";

// Simple ID generator function to replace uuid
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

interface BlockEditorProps {
  initialBlocks?: SearchBlockData[];
  onChange?: (blocks: SearchBlockData[]) => void;
  className?: string;
}

export default function BlockEditor({
  initialBlocks = [],
  onChange,
  className,
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<SearchBlockData[]>(initialBlocks);

  const handleAddBlock = () => {
    const newBlock: SearchBlockData = {
      id: generateId(),
      type: "text",
      value: "",
      options: {
        caseSensitive: false,
        regex: false,
        wholeWord: false,
      },
    };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    onChange?.(updatedBlocks);
  };

  const handleUpdateBlock = (id: string, data: Partial<SearchBlockData>) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, ...data } : block
    );
    setBlocks(updatedBlocks);
    onChange?.(updatedBlocks);
  };

  const handleRemoveBlock = (id: string) => {
    const updatedBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(updatedBlocks);
    onChange?.(updatedBlocks);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
    onChange?.(items);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Search Blocks</h3>
        <Button onClick={handleAddBlock} size="sm">
          <PlusIcon className="h-4 w-4 mr-1" /> Add Block
        </Button>
      </div>

      {blocks.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No search blocks added yet
          </p>
          <Button onClick={handleAddBlock}>
            <PlusIcon className="h-4 w-4 mr-1" /> Add Your First Block
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {blocks.map((block, index) => (
                  <Draggable
                    key={block.id}
                    draggableId={block.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <SearchBlock
                          block={block}
                          onUpdate={handleUpdateBlock}
                          onRemove={handleRemoveBlock}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {blocks.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button onClick={handleAddBlock} size="sm">
            <PlusIcon className="h-4 w-4 mr-1" /> Add Block
          </Button>
        </div>
      )}
    </div>
  );
}
