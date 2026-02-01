"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/lib/i18n/navigation";
import {
  SeasonWithEpisodeCount,
  createSeason,
  updateSeason,
  deleteSeason,
} from "@/server-actions/seasons";

type DialogMode = "create" | "edit" | "delete" | null;

interface SeasonFormData {
  year: string;
  episodeCount: string;
  isFinished: boolean;
}

const initialFormData: SeasonFormData = {
  year: "",
  episodeCount: "8",
  isFinished: true,
};

interface SeasonsManagerProps {
  countryId: string;
  initialSeasons: SeasonWithEpisodeCount[];
  nextSeasonNumber: number;
}

export const SeasonsManager = ({
  countryId,
  initialSeasons,
  nextSeasonNumber: initialNextNumber,
}: SeasonsManagerProps) => {
  const [seasons, setSeasons] = useState<SeasonWithEpisodeCount[]>(initialSeasons);
  const [nextSeasonNumber, setNextSeasonNumber] = useState(initialNextNumber);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedSeason, setSelectedSeason] = useState<SeasonWithEpisodeCount | null>(null);
  const [formData, setFormData] = useState<SeasonFormData>(initialFormData);
  const [isPending, startTransition] = useTransition();

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedSeason(null);
    setFormData(initialFormData);
  };

  const handleFormChange = (field: keyof SeasonFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    startTransition(async () => {
      const episodeCount = parseInt(formData.episodeCount) || 0;
      const newSeason = await createSeason({
        countryId,
        year: formData.year ? parseInt(formData.year) : undefined,
        isFinished: formData.isFinished,
        episodeCount,
      });
      setSeasons((prev) =>
        [...prev, { ...newSeason, _count: { episodes: episodeCount } }].sort(
          (a, b) => a.number - b.number
        )
      );
      setNextSeasonNumber((prev) => prev + 1);
      closeDialog();
    });
  };

  const handleEdit = () => {
    if (!selectedSeason) return;
    startTransition(async () => {
      const updatedSeason = await updateSeason({
        id: selectedSeason.id,
        countryId,
        year: formData.year ? parseInt(formData.year) : null,
        isFinished: formData.isFinished,
      });
      setSeasons((prev) =>
        prev.map((s) =>
          s.id === selectedSeason.id
            ? { ...updatedSeason, _count: s._count }
            : s
        )
      );
      closeDialog();
    });
  };

  const handleDelete = () => {
    if (!selectedSeason) return;
    startTransition(async () => {
      await deleteSeason(selectedSeason.id, countryId);
      setSeasons((prev) => prev.filter((s) => s.id !== selectedSeason.id));
      closeDialog();
    });
  };

  const openCreateDialog = () => {
    setFormData({
      ...initialFormData,
      year: String(new Date().getFullYear()),
    });
    setDialogMode("create");
  };

  const openEditDialog = (season: SeasonWithEpisodeCount) => {
    setSelectedSeason(season);
    setFormData({
      year: season.year ? String(season.year) : "",
      episodeCount: String(season._count.episodes),
      isFinished: season.isFinished,
    });
    setDialogMode("edit");
  };

  const openDeleteDialog = (season: SeasonWithEpisodeCount) => {
    setSelectedSeason(season);
    setDialogMode("delete");
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Season {nextSeasonNumber}
        </Button>
      </div>

      {seasons.length === 0 ? (
        <Card className="border-white/6">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground text-sm">
              No seasons yet. Add your first season to get started.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {seasons.map((season) => (
            <Card
              key={season.id}
              className="group border-white/6 card-glow transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-yellow-400/80">
                      {season.number}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Season
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {season.year && (
                      <Badge variant="outline" className="border-white/10 text-xs text-muted-foreground">
                        {season.year}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={
                        season.isFinished
                          ? "border-emerald-500/30 text-emerald-400 text-xs"
                          : "border-yellow-500/30 text-yellow-400 text-xs"
                      }
                    >
                      {season.isFinished ? "Finished" : "Ongoing"}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  {season._count.episodes} episode{season._count.episodes !== 1 ? "s" : ""}
                </p>

                <div className="flex items-center gap-1 pt-3 border-t border-white/6">
                  <Button variant="ghost" size="sm" className="flex-1" asChild>
                    <Link href={`/admin/countries/${countryId}/seasons/${season.id}`}>
                      Episodes
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(season)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openDeleteDialog(season)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogMode === "create"} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Season {nextSeasonNumber}</DialogTitle>
            <DialogDescription>
              Create a new season. Episodes will be pre-created for you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Year (optional)</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.year}
                  onChange={(e) => handleFormChange("year", e.target.value)}
                  placeholder="2024"
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="episodeCount">Number of Episodes</Label>
                <Input
                  id="episodeCount"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.episodeCount}
                  onChange={(e) => handleFormChange("episodeCount", e.target.value)}
                  placeholder="8"
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFinished"
                checked={formData.isFinished}
                onCheckedChange={(checked) =>
                  handleFormChange("isFinished", checked === true)
                }
                disabled={isPending}
              />
              <Label htmlFor="isFinished" className="cursor-pointer">
                Season has finished airing
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={dialogMode === "edit"} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Season {selectedSeason?.number}</DialogTitle>
            <DialogDescription>Update season details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-year">Year (optional)</Label>
              <Input
                id="edit-year"
                type="number"
                min="1900"
                max="2100"
                value={formData.year}
                onChange={(e) => handleFormChange("year", e.target.value)}
                placeholder="2024"
                disabled={isPending}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isFinished"
                checked={formData.isFinished}
                onCheckedChange={(checked) =>
                  handleFormChange("isFinished", checked === true)
                }
                disabled={isPending}
              />
              <Label htmlFor="edit-isFinished" className="cursor-pointer">
                Season has finished airing
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogMode === "delete"} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Season {selectedSeason?.number}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this season? This will also delete
              all {selectedSeason?._count.episodes} episodes and their questions.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
