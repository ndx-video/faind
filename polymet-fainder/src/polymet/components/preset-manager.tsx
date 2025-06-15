"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, SaveIcon, SearchIcon } from "lucide-react";
import PresetCard, { PresetData } from "@/polymet/components/preset-card";
import BlockEditor from "@/polymet/components/block-editor";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Simple ID generator function to replace uuid
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

interface PresetManagerProps {
  presets: PresetData[];
  onPresetRun: (preset: PresetData) => void;
  onPresetsChange: (presets: PresetData[]) => void;
  className?: string;
}

export default function PresetManager({
  presets,
  onPresetRun,
  onPresetsChange,
  className,
}: PresetManagerProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPreset, setEditingPreset] = useState<PresetData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetDescription, setNewPresetDescription] = useState("");
  const [newPresetTags, setNewPresetTags] = useState("");

  const handleCreatePreset = () => {
    setEditingPreset({
      id: generateId(),
      name: "",
      description: "",
      blocks: [],
      tags: [],
    });
    setNewPresetName("");
    setNewPresetDescription("");
    setNewPresetTags("");
    setIsDialogOpen(true);
  };

  const handleEditPreset = (preset: PresetData) => {
    setEditingPreset(preset);
    setNewPresetName(preset.name);
    setNewPresetDescription(preset.description || "");
    setNewPresetTags((preset.tags || []).join(", "));
    setIsDialogOpen(true);
  };

  const handleSavePreset = () => {
    if (!editingPreset || !newPresetName.trim()) return;

    const updatedPreset: PresetData = {
      ...editingPreset,
      name: newPresetName.trim(),
      description: newPresetDescription.trim() || undefined,
      tags: newPresetTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    const isNew = !presets.some((p) => p.id === updatedPreset.id);
    const updatedPresets = isNew
      ? [...presets, updatedPreset]
      : presets.map((p) => (p.id === updatedPreset.id ? updatedPreset : p));

    onPresetsChange(updatedPresets);
    setIsDialogOpen(false);
    setEditingPreset(null);
  };

  const handleDeletePreset = (id: string) => {
    const updatedPresets = presets.filter((p) => p.id !== id);
    onPresetsChange(updatedPresets);
  };

  const handleRunPreset = (preset: PresetData) => {
    // Update last used timestamp
    const updatedPreset = {
      ...preset,
      lastUsed: new Date(),
    };

    const updatedPresets = presets.map((p) =>
      p.id === preset.id ? updatedPreset : p
    );

    onPresetsChange(updatedPresets);
    onPresetRun(updatedPreset);
  };

  const filteredPresets = presets.filter((preset) => {
    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (preset.description &&
        preset.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (preset.tags &&
        preset.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "recent") {
      return (
        matchesSearch &&
        preset.lastUsed &&
        new Date().getTime() - new Date(preset.lastUsed).getTime() <
          7 * 24 * 60 * 60 * 1000
      );

      // 7 days
    }
    return false;
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All Presets</TabsTrigger>
            <TabsTrigger value="recent">Recently Used</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {activeTab === "all" && (
              <div>
                {filteredPresets.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "No presets match your search"
                        : "No presets created yet"}
                    </p>
                    <Button onClick={handleCreatePreset}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Your First Preset
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPresets.map((preset) => (
                      <PresetCard
                        key={preset.id}
                        preset={preset}
                        onRun={handleRunPreset}
                        onEdit={handleEditPreset}
                        onDelete={handleDeletePreset}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "recent" && (
              <div>
                {filteredPresets.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      No recently used presets
                    </p>
                    <Button onClick={() => setActiveTab("all")}>
                      View All Presets
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPresets.map((preset) => (
                      <PresetCard
                        key={preset.id}
                        preset={preset}
                        onRun={handleRunPreset}
                        onEdit={handleEditPreset}
                        onDelete={handleDeletePreset}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Tabs>

        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="text"
              placeholder="Search presets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>
          <Button onClick={handleCreatePreset}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Preset
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPreset && presets.some((p) => p.id === editingPreset.id)
                ? "Edit Preset"
                : "Create New Preset"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="preset-name">Name</Label>
              <Input
                id="preset-name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Enter preset name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-description">Description (optional)</Label>
              <Textarea
                id="preset-description"
                value={newPresetDescription}
                onChange={(e) => setNewPresetDescription(e.target.value)}
                placeholder="Enter preset description"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-tags">Tags (comma separated)</Label>
              <Input
                id="preset-tags"
                value={newPresetTags}
                onChange={(e) => setNewPresetTags(e.target.value)}
                placeholder="documents, code, recent, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label>Search Blocks</Label>
              <BlockEditor
                initialBlocks={editingPreset?.blocks || []}
                onChange={(blocks) => {
                  if (editingPreset) {
                    setEditingPreset({ ...editingPreset, blocks });
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreset} disabled={!newPresetName.trim()}>
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
